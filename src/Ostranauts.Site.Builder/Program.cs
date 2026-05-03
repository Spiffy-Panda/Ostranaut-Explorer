using Ostranauts.DataModel;

namespace Ostranauts.Site.Builder;

internal static class Program
{
    private const string DefaultDataRoot = "data";
    private const string DefaultOutDir = "build/data";

    private static int Main(string[] args)
    {
        var dataRoot = DefaultDataRoot;
        var outDir = DefaultOutDir;

        for (var i = 0; i < args.Length; i++)
        {
            switch (args[i])
            {
                case "--data" when i + 1 < args.Length:
                    dataRoot = args[++i];
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

        if (!Directory.Exists(dataRoot))
        {
            Console.Error.WriteLine($"data root not found: {dataRoot}");
            Console.Error.WriteLine("see README.md — copy data from your Steam install");
            return 1;
        }

        var schemaDir = Path.Combine(dataRoot, "schemas");
        var warnings = 0;
        var catalog = SchemaLoader.Load(
            schemaDir,
            warning => { Console.Error.WriteLine(warning); warnings++; });

        var objects = DataLoader
            .Load(dataRoot, warning => { Console.Error.WriteLine(warning); warnings++; })
            .ToList();

        var references = objects.SelectMany(o => ReferenceExtractor.Extract(o, catalog)).ToList();
        var index = new ObjectIndex(
            objects,
            references,
            warning => { Console.Error.WriteLine(warning); warnings++; });

        // .js (not .json) so the static site can load via <script src> from file:// URLs.
        // The site fetches via script tag rather than fetch() because browsers block
        // fetch against local files. See GraphExporter for the wrapper format.
        var graphPath = Path.Combine(outDir, "graph.js");
        GraphExporter.WriteJson(index, graphPath);

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
        Console.Error.WriteLine("usage: Ostranauts.Site.Builder [--data <dir>] [--out <dir>]");
        Console.Error.WriteLine($"  --data <dir>  path to game data folder    (default: {DefaultDataRoot})");
        Console.Error.WriteLine($"  --out  <dir>  output directory            (default: {DefaultOutDir})");
    }
}
