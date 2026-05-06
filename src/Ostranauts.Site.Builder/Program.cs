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

        // PLAN-AST Phase 1+2: parse decomp/ once, then run two analysis passes
        // over the same parsed trees:
        //   Phase 1 (DecompIndexer): code-method / code-class nodes + literal edges.
        //   Phase 2 (ComponentIndexer): code-component nodes from CondOwner.AddCommand
        //   dispatcher + condowners.aUpdateCommands wiring + AddCond producers.
        if (!decompExplicitlyDisabled)
        {
            var resolvedDecompRoot = decompRoot ?? (Directory.Exists(DefaultDecompRoot) ? DefaultDecompRoot : null);
            if (resolvedDecompRoot is not null)
            {
                var phaseWarn = (string warning) => { Console.Error.WriteLine(warning); warnings++; };
                var repoRoot = Directory.GetCurrentDirectory();

                // Single parse — both phases reuse the same SyntaxTree set.
                var parsedTrees = DecompIndexer.ParseTrees(resolvedDecompRoot, repoRoot, phaseWarn);

                // Phase 1.
                var phase1 = DecompIndexer.Index(parsedTrees);
                var phase1Bridge = BridgePhase1(phase1, foldersByName);
                Console.WriteLine($"decomp phase 1: parsed {phase1.FilesParsed} files ({phase1.FilesSkipped} skipped), {phase1Bridge.Objects.Count} code nodes, {phase1Bridge.References.Count} resolved literal edges");
                objects.AddRange(phase1Bridge.Objects);
                references.AddRange(phase1Bridge.References);

                // Phase 2 — depends on the freshly-extended object set so
                // produces/consumes-condition edges can resolve against
                // conditions/* nodes that exist after Phase 1 too.
                var components = ComponentIndexer.Index(parsedTrees, phaseWarn);
                var phase2Bridge = BridgePhase2(components, objects, existenceSet);
                Console.WriteLine($"decomp phase 2: {phase2Bridge.Objects.Count} code-component nodes, {phase2Bridge.WiresToCount} wires-to + {phase2Bridge.CondEdgeCount} produces/consumes/observes edges");
                objects.AddRange(phase2Bridge.Objects);
                references.AddRange(phase2Bridge.References);
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
    private static (List<DataObject> Objects, List<Reference> References) BridgePhase1(
        DecompIndexResult raw,
        Dictionary<string, List<string>> foldersByName)
    {
        var dataObjects = new List<DataObject>(raw.Nodes.Count);
        foreach (var n in raw.Nodes)
        {
            var fields = JsonSerializer.SerializeToElement(new
            {
                qualifiedName = n.QualifiedName,
                lineStart = n.LineStart,
                lineEnd = n.LineEnd,
            }).Clone();
            dataObjects.Add(new DataObject(
                Folder: n.Folder,
                FilePath: n.File,
                StrName: n.QualifiedName,
                Fields: fields));
        }

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
            // Phase 1.1 — structural-parent grouping. When the literal sits
            // inside an array initializer / args list with siblings, carry
            // the container info on the edge so the site can render the
            // group as one labeled block.
            if (!string.IsNullOrEmpty(e.ContainerKey))
            {
                metadata["containerKey"] = e.ContainerKey;
                metadata["containerLabel"] = e.ContainerLabel;
                metadata["containerLineStart"] = e.ContainerLineStart;
                metadata["containerLineEnd"] = e.ContainerLineEnd;
            }
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
        return (dataObjects, refs);
    }

    /// <summary>
    /// Bridges <see cref="ComponentIndexer"/>'s output into the graph:
    /// <list type="bullet">
    ///   <item>One <c>code-component:&lt;CommandName&gt;</c> DataObject per dispatcher branch.</item>
    ///   <item>For each condowner with non-empty <c>aUpdateCommands</c>: one
    ///         <see cref="RefKind.WiresTo"/> edge to the matching code-component
    ///         (always), plus one per typed positional arg (when the arg position
    ///         resolves to a folder via <see cref="ComponentIndexer.KnownGetters"/>
    ///         AND the named entry exists in that folder).</item>
    ///   <item>One <see cref="RefKind.ProducesCondition"/> /
    ///         <see cref="RefKind.ConsumesCondition"/> /
    ///         <see cref="RefKind.ObservesCondition"/> edge per literal-string
    ///         AddCond / RemCond / HasCond call inside each component class.</item>
    /// </list>
    /// </summary>
    private static (List<DataObject> Objects, List<Reference> References, int WiresToCount, int CondEdgeCount) BridgePhase2(
        IReadOnlyList<CodeComponent> components,
        IReadOnlyList<DataObject> currentObjects,
        HashSet<(string folder, string name)> dataExistenceSet)
    {
        var dataObjects = new List<DataObject>();
        var componentByName = new Dictionary<string, CodeComponent>(StringComparer.Ordinal);
        foreach (var c in components)
        {
            componentByName[c.CommandName] = c;
            var inPortsJson = c.InPorts.Select(p => new { index = p.Index, targetFolder = p.TargetFolder, source = p.Source }).ToArray();
            var producesJson = c.Produces.Select(p => new { name = p.ConditionName, verb = p.Verb, role = p.Role, method = p.MethodName, file = p.File, line = p.Line }).ToArray();
            var fields = JsonSerializer.SerializeToElement(new
            {
                commandName = c.CommandName,
                implementingType = c.ImplementingType,
                arityMin = c.ArityMin,
                dispatcherFile = c.DispatcherFile,
                dispatcherLine = c.DispatcherLine,
                inPorts = inPortsJson,
                produces = producesJson,
            }).Clone();

            // FilePath: prefer the component's class file when known so the
            // detail page can deep-link. Fall back to dispatcher file.
            var classFile = $"decomp/Assembly-CSharp/{c.ImplementingType}.cs";
            dataObjects.Add(new DataObject(
                Folder: "code-component",
                FilePath: !string.IsNullOrEmpty(c.ImplementingType) ? classFile : c.DispatcherFile,
                StrName: c.CommandName,
                Fields: fields));
        }

        var refs = new List<Reference>();
        var wiresToCount = 0;
        var condEdgeCount = 0;

        // -- Outgoing produces/consumes/observes edges per component class.
        foreach (var c in components)
        {
            foreach (var p in c.Produces)
            {
                // Only emit if there's a real conditions/<name> entry to point
                // at — produces-edges to non-existent conditions would noise
                // the data-health page without helping anyone.
                if (!dataExistenceSet.Contains(("conditions", p.ConditionName))) continue;
                var kind = p.Role switch
                {
                    "produces" => RefKind.ProducesCondition,
                    "consumes" => RefKind.ConsumesCondition,
                    "observes" => RefKind.ObservesCondition,
                    _ => RefKind.ObservesCondition,
                };
                var meta = new Dictionary<string, object>
                {
                    ["verb"] = p.Verb,
                    ["method"] = p.MethodName,
                    ["line"] = p.Line,
                };
                refs.Add(new Reference(
                    SourceFolder: "code-component",
                    SourceName: c.CommandName,
                    SourceField: p.Verb,
                    TargetFolder: "conditions",
                    TargetName: p.ConditionName,
                    Kind: kind,
                    Metadata: meta));
                condEdgeCount++;
            }
        }

        // -- Per-condowner wires-to edges driven by aUpdateCommands strings.
        foreach (var co in currentObjects)
        {
            if (co.Folder != "condowners") continue;
            if (co.Fields.ValueKind != JsonValueKind.Object) continue;
            if (!co.Fields.TryGetProperty("aUpdateCommands", out var arr)) continue;
            if (arr.ValueKind != JsonValueKind.Array) continue;

            foreach (var item in arr.EnumerateArray())
            {
                if (item.ValueKind != JsonValueKind.String) continue;
                var raw = item.GetString();
                if (string.IsNullOrWhiteSpace(raw)) continue;
                var tokens = raw.Split(',');
                if (tokens.Length == 0) continue;
                var commandName = tokens[0].Trim();
                if (!componentByName.TryGetValue(commandName, out var comp)) continue;

                // Edge 1: condowner → code-component (always).
                var headMeta = new Dictionary<string, object>
                {
                    ["commandName"] = commandName,
                    ["position"] = 0,
                    ["raw"] = raw,
                };
                refs.Add(new Reference(
                    SourceFolder: "condowners",
                    SourceName: co.StrName,
                    SourceField: "aUpdateCommands",
                    TargetFolder: "code-component",
                    TargetName: commandName,
                    Kind: RefKind.WiresTo,
                    Metadata: headMeta));
                wiresToCount++;

                // Edges 2+: typed positional args. Only emit when the inferred
                // folder actually contains the referenced strName — keeps the
                // graph honest and lets the dangling-edges health page focus
                // on real data bugs.
                foreach (var port in comp.InPorts)
                {
                    if (string.IsNullOrEmpty(port.TargetFolder)) continue;
                    if (port.Index >= tokens.Length) continue;
                    var argValue = tokens[port.Index].Trim();
                    if (string.IsNullOrEmpty(argValue)) continue;
                    if (!dataExistenceSet.Contains((port.TargetFolder, argValue))) continue;
                    var argMeta = new Dictionary<string, object>
                    {
                        ["commandName"] = commandName,
                        ["position"] = port.Index,
                        ["raw"] = raw,
                        ["resolvedBy"] = port.Source,
                    };
                    refs.Add(new Reference(
                        SourceFolder: "condowners",
                        SourceName: co.StrName,
                        SourceField: "aUpdateCommands",
                        TargetFolder: port.TargetFolder,
                        TargetName: argValue,
                        Kind: RefKind.WiresTo,
                        Metadata: argMeta));
                    wiresToCount++;
                }
            }
        }

        return (dataObjects, refs, wiresToCount, condEdgeCount);
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
