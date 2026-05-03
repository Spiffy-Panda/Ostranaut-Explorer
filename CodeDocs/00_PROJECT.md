# 00_PROJECT.md — architectural overview

Read this first. It's the briefest map of how the projects fit together; everything else in `CodeDocs/` zooms in.

## What we're building

Static-site explorer for the Ostranauts game data tree. Every entry under `data/` has a unique `strName`; objects cross-reference each other by string name. The site lets you pick any object and see forward references, backward references, and a small interactive graph. IDE-style "Find Usages" for game data.

## Three projects, one solution

```
OstranautDataExplorer.sln
├── src/Ostranauts.DataModel/          netstandard2.1   parser/indexer library
├── src/Ostranauts.Site.Builder/       net8.0           CLI that writes graph.json
├── src/Ostranauts.Site/               (no .csproj)     vanilla HTML/CSS/JS
└── tests/Ostranauts.DataModel.Tests/  net8.0, xunit
```

`Ostranauts.DataModel` targets `netstandard2.1` because the same library will eventually be loaded inside an Ostranauts BepInEx mod (the wiki's BepInEx page documents `netstandard2.1` as the mod target).

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
              ReferenceExtractor  ──►  IEnumerable<Reference>
                       │
                       ▼
                 ObjectIndex (forward + reverse maps, dangling-ref scan)
                       │
                       ▼
                 GraphExporter  ──►  build/data/graph.json
                                          │
                                          ▼
                              src/Ostranauts.Site/* (copied to build/)
                              fetches graph.json client-side, renders
```

The Builder CLI (`Program.cs`) is the orchestrator — it runs that whole pipeline.

## Roadmap snapshot

- **v0** ✓ — repo scaffolding, baseline data snapshot, build chain, scaffold-mode pipeline that emits an empty but valid `graph.json`.
- **v1** — fill in the stubs: `SchemaLoader` parses field descriptions to derive reference rules, `DataLoader` walks the data tree, `ReferenceExtractor` walks fields against the rules. Then the site grows from "render placeholder summary" to "search + detail pages + Cytoscape graph view."
- **v2** — mod-overlay loader, VS Code language server (LSP), save inspector/editor, map explorer.

Detail in `PROJECT-PITCH.md`.

## Key conventions

- Reference rules are **schema-derived**, not hand-curated. A hand-curated overrides file may add comments only; comments should be upstreamed into the schema files.
- Condition strings (`"IsSystem=1.0x1"`) carry `Name=value xduration` semantics. The value + duration are kept on the edge as `Reference.Metadata` so condition detail pages can aggregate.
- Pronoun/placeholder tokens (regex `\[\w+\]`) are not references and should be skipped during extraction.
- Mod overlay support is **out of scope for v1**.
- Modern C# language features (records, init-only) work on netstandard2.1 via the `IsExternalInit` polyfill in `src/Ostranauts.DataModel/Polyfills.cs`.

## Status by file (current truth)

All `Ostranauts.DataModel` types are now real implementations. Real-data smoke test: ~29k objects, ~7,900 references, 26 rules, 5.4 MB → 6.7 MB graph.json.

Outstanding v1 polish (not blocking):
- ~1,500 dangling references — partly legitimate "missing data" findings, partly a known false-positive rule (`interactions.strTargetPoint` is matched as `→ condowners` because its description says *"(assigned in condowners.json)"*; it's not actually a strName ref). Fix is to clarify the schema description, intended for the future Comment Mod.
- `CondStringArray` rules: 0 today. Base schemas don't document the cond-string DSL fields (`aStartingConds`, etc.). Same fix path — schema additions.
