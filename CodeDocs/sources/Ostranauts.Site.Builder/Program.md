# Program.cs

**Path:** `src/Ostranauts.Site.Builder/Program.cs`
**Status:** real

## Purpose

CLI entry point for the Builder. Parses arguments, runs the parser pipeline, writes `graph.js` (script-tag-loadable; see `GraphExporter`). Designed to be the only consumer of `Ostranauts.DataModel`'s top-level static methods so the orchestration is in one place.

## Public API (CLI)

```
Ostranauts.Site.Builder [--root <dir>]... [--out <dir>] [-h | --help]
```

`--root` is **repeatable** and order-significant: later roots override earlier ones for collisions on `(folder, strName)` (objects) and `(folder, fieldName)` (schema rules). When no `--root` is given, the Builder uses whichever of the standard pair `["data", "comment_mod/data"]` actually exists on disk — so the default invocation Just Works against a freshly-set-up repo with the Comment Mod overlay applied automatically.

Default output: `--out build/data`.

Exit codes:
- `0` — success (warnings reported on stderr but do not fail the run)
- `1` — no data roots resolved
- `2` — unknown / malformed argument

## Pipeline

```csharp
// Resolve roots (explicit --root flags, or default to existing of [data, comment_mod/data]).
var roots = ...;
var schemaDirs = roots.Select(r => Path.Combine(r, "schemas")).ToList();

var warnings = 0;
var catalog = SchemaLoader.Load(schemaDirs, w => { Console.Error.WriteLine(w); warnings++; });
var objects = DataLoader.Load(roots, w => { ... }).ToList();
var references = objects.SelectMany(o => ReferenceExtractor.Extract(o, catalog)).ToList();
var index = new ObjectIndex(objects, references, w => { ... });

GraphExporter.WriteJson(index, Path.Combine(outDir, "graph.js"), catalog);  // catalog also serialized for the schema inspector
```

Stdout: lists each loaded root, then the written-path plus `objects`, `references`, `rules` counts; if any warnings fired, the count is reported pointing at stderr.

Real-data run (vanilla `data/` + `comment_mod/data/` overlay): ~29k objects, ~52k references, 35 rules.

## Depends on

- All of `Ostranauts.DataModel`.

## Used by

- The build chain (`Makefile` / `build.bat`) invokes this via `dotnet run --project ...`.
