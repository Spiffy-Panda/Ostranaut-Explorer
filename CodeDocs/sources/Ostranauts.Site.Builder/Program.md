# Program.cs

**Path:** `src/Ostranauts.Site.Builder/Program.cs`
**Status:** real

## Purpose

CLI entry point for the Builder. Parses arguments, runs the parser pipeline, runs the optional decomp/AST pipeline (PLAN-AST Phase 1), writes `graph.js` (script-tag-loadable; see `GraphExporter`). Designed to be the only consumer of `Ostranauts.DataModel`'s top-level static methods so the orchestration is in one place.

## Public API (CLI)

```
Ostranauts.Site.Builder [--root <dir>]... [--out <dir>] [--decomp <dir>] [--no-decomp] [-h | --help]
```

`--root` is **repeatable** and order-significant: later roots override earlier ones for collisions on `(folder, strName)` (objects) and `(folder, fieldName)` (schema rules). When no `--root` is given, the Builder uses whichever of the standard pair `["data", "comment_mod/data"]` actually exists on disk — so the default invocation Just Works against a freshly-set-up repo with the Comment Mod overlay applied automatically.

`--decomp <dir>` points at a decompiled C# tree (the `Ostranauts.Decomp` indexer's input). When omitted, the Builder auto-detects `decomp/Assembly-CSharp` and runs the indexer if present, skipping it silently otherwise. `--no-decomp` disables the indexer even when a tree is on disk.

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

// conditions_simple/ — array-of-tuples folder. Synthesize one DataObject per 7-tuple.
objects.AddRange(ConditionsSimpleExpander.Expand(objects, w => { ... }));

// strName -> [folder,...] map (data-side only) — used to resolve code-literal edges
// against every folder that contains a matching name.
var foldersByName = ...;

var existenceSet = new HashSet<(string, string)>(objects.Select(o => (o.Folder, o.StrName)));
bool Exists(string f, string n) => existenceSet.Contains((f, n));

var references = objects.SelectMany(o => ReferenceExtractor.Extract(o, catalog, Exists)).ToList();

// PLAN-AST Phase 1: parse decomp/, promote methods/classes carrying string
// literals to code-side DataObjects + emit one Reference per literal whose
// value matches a known data strName (one edge per matching folder).
if (decomp/Assembly-CSharp exists or --decomp passed) {
    var (codeObjs, codeRefs, parsed, skipped) = RunDecompIndex(decompRoot, foldersByName, ...);
    objects.AddRange(codeObjs);
    references.AddRange(codeRefs);
}

var index = new ObjectIndex(objects, references, w => { ... });

GraphExporter.WriteJson(index, Path.Combine(outDir, "graph.js"), catalog);

// Auto-detect ref candidates for fields the schema doesn't yet describe.
var candidates = RefCandidateDetector.Detect(objects, catalog);
CandidateExporter.WriteJs(candidates, Path.Combine(outDir, "ref_candidates.js"));
```

`RunDecompIndex` is a private helper that calls `DecompIndexer.Index`, then synthesizes one `DataObject` per `CodeNode` (with `qualifiedName` / `lineStart` / `lineEnd` packed into `Fields` so they flow through to `properties.js`) and one `Reference` per `(CodeLiteralEdge, matching data folder)` pair.

Stdout: lists each loaded root, decomp-pipeline summary if it ran (`parsed N files, K code nodes, M resolved literal edges`), then the written-path plus `objects`, `references`, `rules`, and `candidates` counts; if any warnings fired, the count is reported pointing at stderr.

Real-data run (vanilla `data/` + `comment_mod/data/` overlay + `decomp/Assembly-CSharp/`): ~34.5k objects (incl. ~1.4k conditions_simple synthetics + ~2.0k code nodes), ~83.2k references (incl. ~5.3k AST literal edges), 91 rules, ~241 detector candidates (~185 uncovered).

## Depends on

- All of `Ostranauts.DataModel`.
- `Ostranauts.Decomp` (Roslyn-AST indexer).

## Used by

- The build chain (`Makefile` / `build.bat`) invokes this via `dotnet run --project ...`.
