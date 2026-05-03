using Ostranauts.DataModel;

namespace Ostranauts.Site.Builder;

internal static class Program
{
    private static readonly string[] DefaultRoots = { "data", "comment_mod/data" };
    private const string DefaultOutDir = "build/data";

    private static int Main(string[] args)
    {
        var roots = new List<string>();
        var outDir = DefaultOutDir;

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

        // Build the existence lookup once so ReferenceExtractor can resolve
        // fallback targets (FieldRule.FallbackTargets) per-value. Cheap: HashSet.
        var existenceSet = new HashSet<(string folder, string name)>(
            objects.Select(o => (o.Folder, o.StrName)));
        bool Exists(string folder, string name) => existenceSet.Contains((folder, name));

        var references = objects.SelectMany(o => ReferenceExtractor.Extract(o, catalog, Exists)).ToList();
        var index = new ObjectIndex(
            objects,
            references,
            warning => { Console.Error.WriteLine(warning); warnings++; });

        var graphPath = Path.Combine(outDir, "graph.js");
        GraphExporter.WriteJson(index, graphPath, catalog);

        Console.WriteLine($"wrote {graphPath}");
        Console.WriteLine($"  objects:    {index.Objects.Count}");
        Console.WriteLine($"  references: {index.References.Count}");
        Console.WriteLine($"  rules:      {catalog.Rules.Count}");
        if (warnings > 0)
            Console.WriteLine($"  warnings:   {warnings} (see stderr)");
        return 0;
    }

    private static void PrintUsage()
    {
        Console.Error.WriteLine("usage: Ostranauts.Site.Builder [--root <dir>]... [--out <dir>]");
        Console.Error.WriteLine("  --root <dir>  data root (repeatable; later roots override earlier)");
        Console.Error.WriteLine($"                default: any existing of [{string.Join(", ", DefaultRoots)}]");
        Console.Error.WriteLine($"  --out  <dir>  output directory                  (default: {DefaultOutDir})");
    }
}
