# Program.cs

**Path:** `src/Ostranauts.Site.Builder/Program.cs`
**Status:** real

## Purpose

CLI entry point for the Builder. Parses arguments, runs the parser pipeline, writes `graph.js` (script-tag-loadable; see `GraphExporter`). Designed to be the only consumer of `Ostranauts.DataModel`'s top-level static methods so the orchestration is in one place.

## Public API (CLI)

```
Ostranauts.Site.Builder [--data <dir>] [--out <dir>] [-h | --help]
```

Defaults: `--data data`, `--out build/data`.

Exit codes:
- `0` — success (warnings reported on stderr but do not fail the run)
- `1` — data root missing
- `2` — unknown / malformed argument

## Pipeline

```csharp
var catalog = SchemaLoader.Load(Path.Combine(dataRoot, "schemas"));

var warnings = 0;
var objects = DataLoader
    .Load(dataRoot, w => { Console.Error.WriteLine(w); warnings++; })
    .ToList();

var references = objects.SelectMany(o => ReferenceExtractor.Extract(o, catalog)).ToList();
var index = new ObjectIndex(
    objects, references,
    w => { Console.Error.WriteLine(w); warnings++; });

GraphExporter.WriteJson(index, Path.Combine(outDir, "graph.js"));
```

Stdout summary: written-path plus `objects`, `references`, `rules` counts; if any warnings fired, the count is reported pointing at stderr.

Current real-data run (base game `data/`): ~29k objects, 0 references (until ReferenceExtractor lands), ~10 duplicate-strName warnings.

## Depends on

- All of `Ostranauts.DataModel`.

## Used by

- The build chain (`Makefile` / `build.bat`) invokes this via `dotnet run --project ...`.
