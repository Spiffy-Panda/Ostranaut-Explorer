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

// PLAN-AST Phase 1+2: parse decomp/ once, run two passes over the parsed trees.
if (decomp/Assembly-CSharp exists or --decomp passed) {
    var parsedTrees = DecompIndexer.ParseTrees(decompRoot, repoRoot, ...);

    // Phase 1: code-method / code-class nodes + literal-in-{method,class} edges.
    var phase1 = DecompIndexer.Index(parsedTrees);
    var (codeObjs1, codeRefs1) = BridgePhase1(phase1, foldersByName);
    objects.AddRange(codeObjs1);
    references.AddRange(codeRefs1);

    // Phase 2: ComponentIndexer reads CondOwner.AddCommand dispatcher, emits
    // code-component nodes with in-ports + produces/consumes/observes condition
    // edges. Builder also walks every condowners.aUpdateCommands string and
    // emits WiresTo edges to the matching code-component plus typed positional
    // -arg edges to resolved data folders.
    var components = ComponentIndexer.Index(parsedTrees, ...);
    var (codeObjs2, codeRefs2, _, _) = BridgePhase2(components, objects, existenceSet);
    objects.AddRange(codeObjs2);
    references.AddRange(codeRefs2);
}

var index = new ObjectIndex(objects, references, w => { ... });

GraphExporter.WriteJson(index, Path.Combine(outDir, "graph.js"), catalog);

// Auto-detect ref candidates for fields the schema doesn't yet describe.
var candidates = RefCandidateDetector.Detect(objects, catalog);
CandidateExporter.WriteJs(candidates, Path.Combine(outDir, "ref_candidates.js"));
```

`BridgePhase1` synthesizes one `DataObject` per `CodeNode` (with `qualifiedName` / `lineStart` / `lineEnd` packed into `Fields` so they flow through to `properties.js`) and one `Reference` per `(CodeLiteralEdge, matching data folder)` pair. `BridgePhase2` does the same for `code-component` nodes (packing `inPorts` / `produces` / `runtimePorts` arrays) and additionally walks every condowner's `aUpdateCommands` strings to emit `WiresTo` edges to components + their typed positional-arg targets, plus walks every guipropmaps' `dictGUIPropMap` for `RuntimeWiresTo` edges (Phase 3).

PLAN-AST Phase 3.1A — for each `RuntimeWiresTo` edge that the runtime-port resolver typed to `conditions/`, the bridge re-checks data existence and either retargets to `conditions_simple/` (where the canonical name often lives) or, if absent from both, synthesizes a new `DataObject` in `conditions/` with `Fields = { kind: "code-emitted", producedBy: "<component>" }` so the modder lands on a populated detail page instead of *"No object known."* In the current real-data run all 17 originally-dangling targets retarget cleanly to `conditions_simple/`, so 0 nodes are synthesized; the synthesis branch remains for future truly-code-only conditions.

Stdout: lists each loaded root, both decomp-pipeline summaries if they ran (`phase 1: parsed N files, K nodes, M edges` / `phase 2: K components, M wires-to + N produces/consumes/observes`), then the written-path plus `objects`, `references`, `rules`, and `candidates` counts; if any warnings fired, the count is reported pointing at stderr.

Real-data run (vanilla `data/` + `comment_mod/data/` overlay + `decomp/Assembly-CSharp/`): 34,558 objects (1,390 conditions_simple synthetics + 2,002 Phase 1 code nodes + 14 Phase 2 code-component nodes), 87,845 references (5,304 Phase 1 literal edges + 4,519 Phase 2/3.1B wires-to + 118 Phase 2 cond-touch edges + 38 Phase 3 runtime-wires-to edges), 91 rules, 243 detector candidates (187 uncovered).

Phase 3.1B — when an `aUpdateCommands` typed-arg edge is inferred to `conditions/` but the value lives in `conditions_simple/`, `BridgePhase2` retargets the edge to `conditions_simple/` (same fallback the Phase 3.1A `RuntimeWiresTo` retarget uses). Without this, `Destructable`'s newly-typed `[1]` and `[3]` ports — which mostly point at `StatDamage`/`StatDamageMax` (declared in `conditions_simple/`) — would generate ~1,920 dangling edges that get filtered out.

## Depends on

- All of `Ostranauts.DataModel`.
- `Ostranauts.Decomp` (Roslyn-AST indexer).

## Used by

- The build chain (`Makefile` / `build.bat`) invokes this via `dotnet run --project ...`.
