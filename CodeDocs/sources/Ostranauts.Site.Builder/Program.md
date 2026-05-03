# Program.cs

**Path:** `src/Ostranauts.Site.Builder/Program.cs`
**Status:** real

## Purpose

CLI entry point for the Builder. Parses arguments, runs the parser pipeline, writes `graph.json`. Designed to be the only consumer of `Ostranauts.DataModel`'s top-level static methods so the orchestration is in one place.

## Public API (CLI)

```
Ostranauts.Site.Builder [--data <dir>] [--out <dir>] [-h | --help]
```

Defaults: `--data data`, `--out build/data`.

Exit codes:
- `0` — success
- `1` — data root missing
- `2` — unknown / malformed argument

## Pipeline

```csharp
var catalog    = SchemaLoader.Load(Path.Combine(dataRoot, "schemas"));
var objects    = DataLoader.Load(dataRoot).ToList();
var references = objects.SelectMany(o => ReferenceExtractor.Extract(o, catalog)).ToList();
var index      = new ObjectIndex(objects, references);
GraphExporter.WriteJson(index, Path.Combine(outDir, "graph.json"));
```

Console output: path of the written file plus `objects`, `references`, `rules` counts.

## Depends on

- All of `Ostranauts.DataModel`.

## Used by

- The build chain (`Makefile` / `build.bat`) invokes this via `dotnet run --project ...`.
