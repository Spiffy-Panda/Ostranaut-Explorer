using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.CodeAnalysis.Text;

namespace Ostranauts.Decomp;

/// <summary>
/// One node in the code-side graph: a method/constructor/operator
/// (<c>code-method</c>) or a class with literal-bearing field/property
/// initializers (<c>code-class</c>). Mirrors the data-side <c>DataObject</c>
/// shape — Builder promotes these into the same graph.
/// </summary>
public sealed record CodeNode(
    string Folder,          // "code-method" | "code-class"
    string QualifiedName,   // e.g. "GasPump.Pump" or "GasPump"
    string File,            // path relative to the repo root
    int LineStart,
    int LineEnd);

/// <summary>
/// One quoted string literal extracted from a <see cref="CodeNode"/>'s body
/// (method) or class-level initializer (class). The literal is identifier-shaped
/// (<c>[A-Za-z_][A-Za-z0-9_]*</c>); resolution against actual data strNames is
/// the Builder's job.
/// </summary>
public sealed record CodeLiteralEdge(
    string SourceFolder,
    string SourceQualifiedName,
    string Literal,
    int Line,
    string LineText);

public sealed record DecompIndexResult(
    IReadOnlyList<CodeNode> Nodes,
    IReadOnlyList<CodeLiteralEdge> Edges,
    int FilesParsed,
    int FilesSkipped);

/// <summary>
/// One parsed decomp file plus its repo-relative path. Reused across passes
/// (Phase 1 literal extraction + Phase 2 component-wiring analysis) so that
/// each <c>.cs</c> file is parsed exactly once.
/// </summary>
public sealed record ParsedDecompTree(SyntaxTree Tree, string RelativePath);

/// <summary>
/// All parsed trees from a decomp root, plus parse counters. Shared input to
/// all decomp-indexing passes.
/// </summary>
public sealed record ParsedDecompTreeSet(
    IReadOnlyList<ParsedDecompTree> Trees,
    int FilesParsed,
    int FilesSkipped);

/// <summary>
/// Phase 1 indexer — walks a decompiled C# tree, parses each file with Roslyn,
/// emits one <see cref="CodeNode"/> per method/constructor that contains at
/// least one identifier-shaped string literal in its body, plus one
/// <see cref="CodeLiteralEdge"/> per such literal. Class-level field/property
/// initializers attach to a synthesized <c>code-class</c> node.
///
/// Stays at the AST tier (no <c>SemanticModel</c>, no symbol binding). Phase 2
/// will add semantic resolution for <c>aUpdateCommands</c>/runtime-wired ports.
/// See <c>PLAN-AST.md</c>.
/// </summary>
public static class DecompIndexer
{
    /// <summary>
    /// Walks <paramref name="decompRoot"/>, parses every <c>.cs</c> file once,
    /// returns the raw nodes + edges. Caller resolves <see cref="CodeLiteralEdge.Literal"/>
    /// values against the data graph's strName index to produce real edges.
    ///
    /// Files that fail to parse are counted as <see cref="DecompIndexResult.FilesSkipped"/>
    /// and reported via <paramref name="onWarning"/> (no recovery heuristics).
    /// </summary>
    public static DecompIndexResult Index(
        string decompRoot,
        string repoRoot,
        Action<string>? onWarning = null)
    {
        var parsed = ParseTrees(decompRoot, repoRoot, onWarning);
        return Index(parsed);
    }

    /// <summary>
    /// Phase 1 pass over an already-parsed tree set. Lets callers run multiple
    /// passes (Phase 1 literal extraction + Phase 2 component analysis) over
    /// the same parsed trees without re-reading files from disk.
    /// </summary>
    public static DecompIndexResult Index(ParsedDecompTreeSet parsed)
    {
        var nodes = new List<CodeNode>();
        var edges = new List<CodeLiteralEdge>();
        var qnameCounts = new Dictionary<string, int>();

        foreach (var pt in parsed.Trees)
            ProcessTree(pt.Tree, pt.RelativePath, nodes, edges, qnameCounts);

        return new DecompIndexResult(nodes, edges, parsed.FilesParsed, parsed.FilesSkipped);
    }

    /// <summary>
    /// Reads + parses every <c>*.cs</c> under <paramref name="decompRoot"/>.
    /// Files that fail to read or parse are counted as
    /// <see cref="ParsedDecompTreeSet.FilesSkipped"/> and reported via
    /// <paramref name="onWarning"/> (no recovery heuristics).
    /// </summary>
    public static ParsedDecompTreeSet ParseTrees(
        string decompRoot,
        string repoRoot,
        Action<string>? onWarning = null)
    {
        var trees = new List<ParsedDecompTree>();
        var filesParsed = 0;
        var filesSkipped = 0;

        if (!Directory.Exists(decompRoot))
        {
            onWarning?.Invoke($"decomp root not found: {decompRoot}");
            return new ParsedDecompTreeSet(trees, 0, 0);
        }

        var files = Directory.EnumerateFiles(decompRoot, "*.cs", SearchOption.AllDirectories)
            .OrderBy(f => f, StringComparer.Ordinal)
            .ToArray();

        foreach (var path in files)
        {
            string text;
            try
            {
                text = File.ReadAllText(path);
            }
            catch (Exception ex)
            {
                filesSkipped++;
                onWarning?.Invoke($"decomp: could not read {path} — {ex.Message}");
                continue;
            }

            SyntaxTree tree;
            try
            {
                tree = CSharpSyntaxTree.ParseText(text, path: path);
            }
            catch (Exception ex)
            {
                filesSkipped++;
                onWarning?.Invoke($"decomp: parse failed {path} — {ex.Message}");
                continue;
            }

            // Roslyn is permissive — diagnostics-at-error don't block tree
            // production. We accept the partial tree; PLAN says we tolerate
            // decomp noise to "skip files Roslyn can't parse" only.

            filesParsed++;
            var rel = NormalizePath(Path.GetRelativePath(repoRoot, path));
            trees.Add(new ParsedDecompTree(tree, rel));
        }

        return new ParsedDecompTreeSet(trees, filesParsed, filesSkipped);
    }

    private static void ProcessTree(
        SyntaxTree tree,
        string relativePath,
        List<CodeNode> nodes,
        List<CodeLiteralEdge> edges,
        Dictionary<string, int> qnameCounts)
    {
        var root = tree.GetRoot();
        var sourceText = tree.GetText();

        // Pass 1: class-level field/property initializers. Walk every type
        // declaration (incl. nested) and collect literals only from members
        // that belong directly to it (not its nested types).
        foreach (var typeDecl in root.DescendantNodes().OfType<TypeDeclarationSyntax>())
        {
            var typeName = GetQualifiedTypeName(typeDecl);
            var classLiterals = new List<(string lit, int line, string text)>();

            foreach (var member in typeDecl.Members)
            {
                switch (member)
                {
                    case FieldDeclarationSyntax field:
                        foreach (var v in field.Declaration.Variables)
                            if (v.Initializer is { } init)
                                ExtractLiterals(init, sourceText, classLiterals);
                        break;
                    case PropertyDeclarationSyntax prop when prop.Initializer is { } pinit:
                        ExtractLiterals(pinit, sourceText, classLiterals);
                        break;
                    case EventFieldDeclarationSyntax eventField:
                        foreach (var v in eventField.Declaration.Variables)
                            if (v.Initializer is { } einit)
                                ExtractLiterals(einit, sourceText, classLiterals);
                        break;
                }
            }

            if (classLiterals.Count == 0) continue;

            var qname = MakeUniqueQualifiedName(typeName, "code-class", qnameCounts);
            var span = typeDecl.GetLocation().GetLineSpan();
            nodes.Add(new CodeNode(
                Folder: "code-class",
                QualifiedName: qname,
                File: relativePath,
                LineStart: span.StartLinePosition.Line + 1,
                LineEnd: span.EndLinePosition.Line + 1));

            foreach (var (lit, line, text) in classLiterals)
                edges.Add(new CodeLiteralEdge("code-class", qname, lit, line, text));
        }

        // Pass 2: methods, constructors, operators, destructors. Walk method
        // body + expression body (=> ...) only; class-level initializers
        // already handled above and shouldn't double-count.
        foreach (var method in root.DescendantNodes().OfType<BaseMethodDeclarationSyntax>())
        {
            var typeName = method.Parent is TypeDeclarationSyntax t
                ? GetQualifiedTypeName(t)
                : "<global>";
            var methodName = MethodName(method);
            if (methodName is null) continue;

            var methodLiterals = new List<(string lit, int line, string text)>();
            if (method.Body is { } body) ExtractLiterals(body, sourceText, methodLiterals);
            if (method.ExpressionBody is { } eb) ExtractLiterals(eb, sourceText, methodLiterals);

            if (methodLiterals.Count == 0) continue;

            var baseName = $"{typeName}.{methodName}";
            var qname = MakeUniqueQualifiedName(baseName, "code-method", qnameCounts);
            var span = method.GetLocation().GetLineSpan();
            nodes.Add(new CodeNode(
                Folder: "code-method",
                QualifiedName: qname,
                File: relativePath,
                LineStart: span.StartLinePosition.Line + 1,
                LineEnd: span.EndLinePosition.Line + 1));

            foreach (var (lit, line, text) in methodLiterals)
                edges.Add(new CodeLiteralEdge("code-method", qname, lit, line, text));
        }
    }

    private static string? MethodName(BaseMethodDeclarationSyntax m) => m switch
    {
        MethodDeclarationSyntax md           => md.Identifier.ValueText,
        ConstructorDeclarationSyntax         => ".ctor",
        DestructorDeclarationSyntax          => ".dtor",
        OperatorDeclarationSyntax od         => "op_" + od.OperatorToken.ValueText,
        ConversionOperatorDeclarationSyntax  => "op_Conv",
        _                                    => null,
    };

    private static void ExtractLiterals(
        SyntaxNode root,
        SourceText sourceText,
        List<(string lit, int line, string text)> output)
    {
        // Skip nested type declarations — their literals belong to those
        // types, not to the enclosing scope. Methods recurse fine; only
        // type-decl boundaries need the cut.
        var stack = new Stack<SyntaxNode>();
        stack.Push(root);
        while (stack.Count > 0)
        {
            var node = stack.Pop();
            if (node != root && node is TypeDeclarationSyntax) continue;

            if (node is LiteralExpressionSyntax lit && lit.IsKind(SyntaxKind.StringLiteralExpression))
            {
                var value = lit.Token.ValueText;
                if (IsIdentifierShaped(value))
                {
                    var span = lit.GetLocation().GetLineSpan();
                    var lineNo = span.StartLinePosition.Line + 1;
                    var lineText = sourceText.Lines[span.StartLinePosition.Line]
                        .ToString().TrimEnd();
                    if (lineText.Length > 200) lineText = lineText.Substring(0, 200);
                    output.Add((value, lineNo, lineText));
                }
            }

            foreach (var child in node.ChildNodes())
                stack.Push(child);
        }
    }

    private static bool IsIdentifierShaped(string s)
    {
        // Same heuristic the existing utils/python/emit_code_refs.py uses —
        // filters out format strings and log messages.
        if (string.IsNullOrEmpty(s)) return false;
        var c0 = s[0];
        if (!char.IsLetter(c0) && c0 != '_') return false;
        for (var i = 1; i < s.Length; i++)
        {
            var c = s[i];
            if (!char.IsLetterOrDigit(c) && c != '_') return false;
        }
        return s.Length > 1; // single letters are too noisy ("e", "i", ...)
    }

    private static string GetQualifiedTypeName(TypeDeclarationSyntax type)
    {
        // Build outer.inner.X. Namespaces omitted — game decomp is overwhelmingly
        // global (`global::ClassName`) or one root namespace, so nested-type
        // disambiguation is the load-bearing piece.
        var parts = new List<string>();
        SyntaxNode? current = type;
        while (current is TypeDeclarationSyntax td)
        {
            parts.Add(td.Identifier.ValueText);
            current = td.Parent;
        }
        parts.Reverse();
        return string.Join(".", parts);
    }

    private static string MakeUniqueQualifiedName(
        string baseName,
        string folder,
        Dictionary<string, int> counts)
    {
        var key = $"{folder}|{baseName}";
        if (!counts.TryGetValue(key, out var count))
        {
            counts[key] = 1;
            return baseName;
        }
        counts[key] = count + 1;
        return $"{baseName}#{count + 1}";
    }

    private static string NormalizePath(string path) => path.Replace('\\', '/');
}
