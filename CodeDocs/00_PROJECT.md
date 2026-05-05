# 00_PROJECT.md — architectural overview

Read this first. It's the briefest map of how the projects fit together; everything else in `CodeDocs/` zooms in.

## What we're building

Static-site explorer for the Ostranauts game data tree. Every entry under `data/` has a unique `strName`; objects cross-reference each other by string name. The site lets you pick any object and see forward references, backward references, and a small interactive graph. IDE-style "Find Usages" for game data.

## Four projects, one solution

```
OstranautDataExplorer.sln
├── src/Ostranauts.DataModel/          netstandard2.1   parser/indexer library
├── src/Ostranauts.Decomp/             net8.0           Roslyn-AST decomp indexer (PLAN-AST)
├── src/Ostranauts.Site.Builder/       net8.0           CLI that writes graph.js
├── src/Ostranauts.Site/               (no .csproj)     vanilla HTML/CSS/JS
└── tests/Ostranauts.DataModel.Tests/  net8.0, xunit
```

`Ostranauts.DataModel` targets `netstandard2.1` because the same library will eventually be loaded inside an Ostranauts BepInEx mod (the wiki's BepInEx page documents `netstandard2.1` as the mod target). `Ostranauts.Decomp` is `net8.0` and pulls in Roslyn — kept out of `DataModel` so the BepInEx-loadable surface stays small.

## Data flow

```
data/                 (game data, gitignored — supplied from Steam install)
  ├── schemas/*-schema.json
  └── <folder>/*.json
        │
        ▼
SchemaLoader  ──►  SchemaCatalog        (which fields are refs, and into which folder)
        │              │
        ▼              │
DataLoader    ──►  IEnumerable<DataObject>
                       │
                       ▼
            ConditionsSimpleExpander (synth tuples → DataObjects)
                       │
                       ▼
              ReferenceExtractor  ──►  IEnumerable<Reference>
                       │
                       ▼     ┌── decomp/Assembly-CSharp/ (optional)
                       │     │           │
                       │     ▼           ▼
                       │   DecompIndexer (Roslyn AST) ──► CodeNodes + CodeLiteralEdges
                       │           │  resolve literals against data strNames
                       │           ▼
                       └── synthetic code-method/code-class DataObjects
                                  + LiteralIn{Method,Class} References
                       │
                       ▼
                 ObjectIndex (forward + reverse maps, dangling-ref scan)
                       │
                       ▼
                 GraphExporter  ──►  build/data/graph.js  (window.GRAPH_DATA = {...};)
                                  └──  build/data/properties.js (window.NODE_PROPS = {...};)
                       │
                       ▼
            RefCandidateDetector  ──►  build/data/ref_candidates.js (window.REF_CANDIDATES = {...};)
                                          │
                                          ▼
                              src/Ostranauts.Site/* (copied to build/)
                              loads payloads via <script src>, renders client-side
                              (object detail · folder index · schema inspector
                               · health/coverage · health/data · llm-candidates)
```

The Builder CLI (`Program.cs`) is the orchestrator — it runs that whole pipeline.

## Roadmap snapshot

- **v0** ✓ — shipped. Repo scaffolding, baseline data snapshot, build chain.
- **v1** — *largely shipped.* Schema-driven extraction, full site (search, detail, schema inspector, health/coverage, health/data, LLM candidates, template engine), code-references panel, multi-strName-source surfacing. Newcomer-onboarding UX components are the active in-progress slice. See [PLAN.md](../PLAN.md).
- **v1.5 / PLAN-AST Phase 1** ✓ — Roslyn-AST decomp indexer promotes methods/classes into the graph as `code-method`/`code-class` nodes with `LiteralIn{Method,Class}` edges. See [PLAN-AST.md](../PLAN-AST.md). Phase 2 (`SemanticModel`-driven `aUpdateCommands` / port resolution) and Phase 3 (runtime-wired ports) are next.
- **v2** — mod-overlay loader, VS Code language server (LSP), save inspector/editor, map explorer.

Detail in `PROJECT-PITCH.md`. Active work in `PLAN.md`.

## Key conventions

- Reference rules are **schema-derived**, not hand-curated. The Comment Mod overlay (`comment_mod/data/schemas/`) is how schema improvements ship — it's not "hand-curated rules," it's a tracked schema overlay loaded by `SchemaLoader.Load(IEnumerable<string>)` alongside `data/schemas/`.
- Condition strings (`"IsSystem=1.0x1"`) carry `Name=value xduration` semantics. Value + duration are kept on the edge as `Reference.Metadata` so condition detail pages can aggregate.
- Loot strings carry `chance`/`min`/`max`/`positive` metadata, also on the edge.
- `Loot.aCOs` target folder is **type-routed by the parent's `strType`** — see `LootString.cs` and the dispatch table in CLAUDE.md.
- Pronoun/placeholder tokens (regex `\[\w+\]`) are not references; allowlisted during extraction.
- Mod overlay support is **out of scope for v1** — but the multi-root SchemaLoader is the prototype for it.
- Modern C# language features (records, init-only) work on netstandard2.1 via the `IsExternalInit` polyfill in `src/Ostranauts.DataModel/Polyfills.cs`.

## Status (current truth)

All `Ostranauts.DataModel` types are real implementations. Latest real-data smoke test (Comment Mod overlay + `conditions_simple` synthesized + PLAN-AST Phase 1 decomp indexer over 1,299 `.cs` files):

```
objects:     34,544   (31,152 data + 1,390 conditions_simple synthetics + 2,002 code-side)
references:  83,170   (~91 schema-derived rules + 5,304 AST-literal edges)
candidates:     241   (auto-detected by RefCandidateDetector, 185 uncovered)
warnings:        15
```

Of the 2,002 code-side nodes: 1,942 `code-method` + 60 `code-class`. Of the 5,304 AST edges: 5,208 `LiteralInMethod` + 96 `LiteralInClass`.

Vanilla `data/` only (no Comment Mod overlay, no decomp): ~7,900 references. Almost all the graph richness comes from the overlay; PLAN-AST adds another ~5k on top once decomp is present.

For the slice-by-slice history of how the numbers got here, read [DEV-LOG.md](../DEV-LOG.md). For what's next, read [PLAN.md](../PLAN.md).
