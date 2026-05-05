using System.Text.Json;
using Ostranauts.DataModel;
using Ostranauts.Decomp;

namespace Ostranauts.Site.Builder;

internal static class Program
{
    private static readonly string[] DefaultRoots = { "data", "comment_mod/data" };
    private const string DefaultOutDir = "build/data";
    private const string DefaultDecompRoot = "decomp/Assembly-CSharp";

    private static int Main(string[] args)
    {
        var roots = new List<string>();
        var outDir = DefaultOutDir;
        string? decompRoot = null;
        bool decompExplicitlyDisabled = false;

        for (var i = 0; i < args.Length; i++)
        {
            switch (args[i])
            {
                case "--root" when i + 1 < args.Length:
                    roots.Add(args[++i]);
                    break;
                case "--out" when i + 1 < args.Length:
                    outDir = args[++i];
                    break;
                case "--decomp" when i + 1 < args.Length:
                    decompRoot = args[++i];
                    break;
                case "--no-decomp":
                    decompExplicitlyDisabled = true;
                    break;
                case "-h" or "--help":
                    PrintUsage();
                    return 0;
                default:
                    Console.Error.WriteLine($"unknown arg: {args[i]}");
                    PrintUsage();
                    return 2;
            }
        }

        // Default: use whichever of the standard roots actually exist on disk,
        // in priority order (data → comment_mod/data, last-wins).
        if (roots.Count == 0)
            roots.AddRange(DefaultRoots.Where(Directory.Exists));

        if (roots.Count == 0)
        {
            Console.Error.WriteLine("no data roots found. Either:");
            Console.Error.WriteLine("  - place game data in ./data (see README)");
            Console.Error.WriteLine("  - or pass --root <path> explicitly");
            return 1;
        }

        Console.WriteLine($"loading from {roots.Count} root(s):");
        foreach (var r in roots) Console.WriteLine($"  {r}");

        var schemaDirs = roots.Select(r => Path.Combine(r, "schemas")).ToList();
        var warnings = 0;
        var catalog = SchemaLoader.Load(
            schemaDirs,
            warning => { Console.Error.WriteLine(warning); warnings++; });

        var objects = DataLoader
            .Load(roots, warning => { Console.Error.WriteLine(warning); warnings++; })
            .ToList();

        // conditions_simple/ is structurally an array-of-tuples instead of array-of-objects.
        // Expand each 7-tuple into a synthetic DataObject so refs from homeworlds (and elsewhere)
        // can resolve via the normal index. Wrapper objects stay in place.
        var simpleExpanded = ConditionsSimpleExpander
            .Expand(objects, warning => { Console.Error.WriteLine(warning); warnings++; })
            .ToList();
        objects.AddRange(simpleExpanded);

        // Build the strName → folders map from the raw data objects (before
        // adding code-side nodes). Code edges resolve a literal to the set of
        // data folders that contain it; this is also used downstream.
        var foldersByName = new Dictionary<string, List<string>>(StringComparer.Ordinal);
        foreach (var o in objects)
        {
            if (!foldersByName.TryGetValue(o.StrName, out var list))
            {
                list = new List<string>();
                foldersByName[o.StrName] = list;
            }
            if (!list.Contains(o.Folder)) list.Add(o.Folder);
        }

        // Build the existence lookup once so ReferenceExtractor can resolve
        // fallback targets (FieldRule.FallbackTargets) per-value. Cheap: HashSet.
        var existenceSet = new HashSet<(string folder, string name)>(
            objects.Select(o => (o.Folder, o.StrName)));
        bool Exists(string folder, string name) => existenceSet.Contains((folder, name));

        var references = objects.SelectMany(o => ReferenceExtractor.Extract(o, catalog, Exists)).ToList();

        // PLAN-AST Phase 1: parse decomp/, promote methods/classes carrying
        // string literals to code-side DataObjects, and emit one Reference per
        // literal whose value matches a known data strName.
        if (!decompExplicitlyDisabled)
        {
            var resolvedDecompRoot = decompRoot ?? (Directory.Exists(DefaultDecompRoot) ? DefaultDecompRoot : null);
            if (resolvedDecompRoot is not null)
            {
                var (codeObjs, codeRefs, parsed, skipped) = RunDecompIndex(
                    resolvedDecompRoot,
                    foldersByName,
                    warning => { Console.Error.WriteLine(warning); warnings++; });

                Console.WriteLine($"decomp: parsed {parsed} files ({skipped} skipped), {codeObjs.Count} code nodes, {codeRefs.Count} resolved literal edges");
                objects.AddRange(codeObjs);
                references.AddRange(codeRefs);
            }
            else
            {
                Console.WriteLine("decomp: skipping (decomp/Assembly-CSharp not found; pass --decomp <dir> to override)");
            }
        }

        var index = new ObjectIndex(
            objects,
            references,
            warning => { Console.Error.WriteLine(warning); warnings++; });

        var graphPath = Path.Combine(outDir, "graph.js");
        GraphExporter.WriteJson(index, graphPath, catalog);

        // Auto-detected ref candidates — fields whose values look like cross-folder
        // refs but no schema rule covers them. Drives the site's "auto-detected"
        // links + the extractor-integrity health page.
        var detectorOpts = new RefCandidateDetector.Options();
        var candidates = RefCandidateDetector.Detect(objects, catalog, detectorOpts);
        var candidatesPath = Path.Combine(outDir, "ref_candidates.js");
        CandidateExporter.WriteJs(candidates, candidatesPath, detectorOpts);

        Console.WriteLine($"wrote {graphPath}");
        Console.WriteLine($"  objects:    {index.Objects.Count}");
        Console.WriteLine($"  references: {index.References.Count}");
        Console.WriteLine($"  rules:      {catalog.Rules.Count}");
        Console.WriteLine($"  candidates: {candidates.Count} ({candidates.Count(c => !c.CoveredBySchema)} uncovered)");
        if (warnings > 0)
            Console.WriteLine($"  warnings:   {warnings} (see stderr)");
        return 0;
    }

    /// <summary>
    /// Bridges <see cref="DecompIndexer"/>'s raw output into the data graph's
    /// DataObject/Reference shape. One CodeNode → one DataObject. One
    /// CodeLiteralEdge → one Reference per data folder that contains the
    /// literal as a strName (so a literal "Coughing" resolves to both
    /// conditions/Coughing and condowners/Coughing if both exist).
    /// </summary>
    private static (
        List<DataObject> Objects,
        List<Reference> References,
        int FilesParsed,
        int FilesSkipped) RunDecompIndex(
        string decompRoot,
        Dictionary<string, List<string>> foldersByName,
        Action<string> onWarning)
    {
        // Anchor decomp paths against the current working directory — that's
        // the same convention the rest of the Builder uses for relative paths.
        var repoRoot = Directory.GetCurrentDirectory();
        var raw = DecompIndexer.Index(decompRoot, repoRoot, onWarning);

        var dataObjects = new List<DataObject>(raw.Nodes.Count);
        foreach (var n in raw.Nodes)
            dataObjects.Add(BuildCodeDataObject(n));

        var refs = new List<Reference>();
        foreach (var e in raw.Edges)
        {
            if (!foldersByName.TryGetValue(e.Literal, out var folders)) continue;

            var kind = e.SourceFolder == "code-class" ? RefKind.LiteralInClass : RefKind.LiteralInMethod;
            var metadata = new Dictionary<string, object>
            {
                ["line"] = e.Line,
                ["text"] = e.LineText,
            };
            // Emit one edge per matching folder. Multi-folder strNames (Itm*
            // names commonly hit loot/, condowners/, items/) all surface.
            foreach (var folder in folders)
            {
                refs.Add(new Reference(
                    SourceFolder: e.SourceFolder,
                    SourceName: e.SourceQualifiedName,
                    SourceField: kind == RefKind.LiteralInClass ? "initializer" : "body",
                    TargetFolder: folder,
                    TargetName: e.Literal,
                    Kind: kind,
                    Metadata: metadata));
            }
        }
        return (dataObjects, refs, raw.FilesParsed, raw.FilesSkipped);
    }

    private static DataObject BuildCodeDataObject(CodeNode n)
    {
        // Pack the code-node-specific metadata into a JsonElement so it shows
        // up on properties.js the same way regular data scalar fields do.
        var fields = JsonSerializer.SerializeToElement(new
        {
            qualifiedName = n.QualifiedName,
            lineStart = n.LineStart,
            lineEnd = n.LineEnd,
        }).Clone();
        return new DataObject(
            Folder: n.Folder,
            FilePath: n.File,
            StrName: n.QualifiedName,
            Fields: fields);
    }

    private static void PrintUsage()
    {
        Console.Error.WriteLine("usage: Ostranauts.Site.Builder [--root <dir>]... [--out <dir>] [--decomp <dir>] [--no-decomp]");
        Console.Error.WriteLine("  --root <dir>   data root (repeatable; later roots override earlier)");
        Console.Error.WriteLine($"                 default: any existing of [{string.Join(", ", DefaultRoots)}]");
        Console.Error.WriteLine($"  --out <dir>    output directory                    (default: {DefaultOutDir})");
        Console.Error.WriteLine($"  --decomp <dir> decompiled C# tree to index        (default: {DefaultDecompRoot} if it exists)");
        Console.Error.WriteLine("  --no-decomp    skip decomp indexing entirely");
    }
}
