# DecompIndexer.cs

**Path:** `src/Ostranauts.Decomp/DecompIndexer.cs`
**Status:** real (PLAN-AST Phase 1)

## Purpose

Roslyn-AST-based indexer over a decompiled C# tree (default `decomp/Assembly-CSharp/`). Produces synthetic graph contributions for the site:

- One `code-method` node per method/constructor/operator that contains at least one identifier-shaped string literal in its body.
- One `code-class` node per type whose field/property/event-field initializers contain at least one identifier-shaped literal.
- One `CodeLiteralEdge` per such literal — file, 1-based line number, and the trimmed source line (≤200 chars).

Replaces the regex pipeline in `utils/python/emit_code_refs.py` for the `build/` site target. The Python script remains as a smoke-test fallback per PLAN-AST.

The indexer is **AST-only** — it does not bind symbols, walk control flow, or read the `SemanticModel`. PLAN-AST Phase 2 lifts the rung.

## Public API

```csharp
public sealed record CodeNode(
    string Folder,          // "code-method" | "code-class"
    string QualifiedName,   // e.g. "GasPump.Pump" or "GasPump"
    string File,            // path relative to the repo root, forward-slashed
    int LineStart,
    int LineEnd);

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

public sealed record ParsedDecompTree(SyntaxTree Tree, string RelativePath);

public sealed record ParsedDecompTreeSet(
    IReadOnlyList<ParsedDecompTree> Trees,
    int FilesParsed,
    int FilesSkipped);

public static class DecompIndexer
{
    public static DecompIndexResult Index(
        string decompRoot,
        string repoRoot,
        Action<string>? onWarning = null);

    // Phase 1 over a pre-parsed tree set. Lets Phase 2's ComponentIndexer
    // share parse work without re-reading files from disk.
    public static DecompIndexResult Index(ParsedDecompTreeSet parsed);

    public static ParsedDecompTreeSet ParseTrees(
        string decompRoot,
        string repoRoot,
        Action<string>? onWarning = null);
}
```

`Index` (string overload) walks `decompRoot` recursively for `*.cs`, parses each via `CSharpSyntaxTree.ParseText`, and runs both passes (class-level then method-level) in a single tree traversal. The tree-set overload + `ParseTrees` exist so PLAN-AST Phase 2 (`ComponentIndexer`) can share the parse work instead of reading the decomp tree twice. Files that throw on read or parse are counted in `FilesSkipped` and reported via `onWarning` — no recovery heuristics.

Caller resolves `CodeLiteralEdge.Literal` against the data graph's strName index (one edge per matching folder).

## Filtering rules

- **Identifier-shaped only:** `[A-Za-z_][A-Za-z0-9_]*`, length ≥ 2. Mirrors the existing `emit_code_refs.py` heuristic; suppresses format strings and log-message false positives.
- **Class-pass scope:** literals inside `FieldDeclarationSyntax`, `PropertyDeclarationSyntax.Initializer`, `EventFieldDeclarationSyntax` of the type's *direct* members; nested types own their own literals.
- **Method-pass scope:** literals inside `BaseMethodDeclarationSyntax.Body` and `.ExpressionBody` (so `=> "Foo"` arrow methods are covered).
- **Nested-type cut:** the literal-walker stops descent at any nested `TypeDeclarationSyntax`, so a method's body literals don't accidentally include literals from its nested local types (those get emitted by their own pass).
- **Overload / shadow disambiguation:** `Type.Method` collisions (overloads, partial classes) get a `#2`, `#3` suffix to keep IDs unique.

## Output volumes (current real-data run)

```
1,299 .cs files parsed, 0 skipped
2,002 code nodes (1,942 code-method + 60 code-class)
5,304 resolved literal edges (5,208 LiteralInMethod + 96 LiteralInClass)
```

## Depends on

- `Microsoft.CodeAnalysis.CSharp` 4.11+ (Roslyn).

## Used by

- `Ostranauts.Site.Builder.Program` — bridges to `DataObject`/`Reference` and merges into `graph.js`.
