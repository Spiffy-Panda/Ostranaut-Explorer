# Ostranaut Data Explorer — Project Pitch

## What this is

A static-site explorer for the Ostranauts game data tree (`data/`). The site lets a modder pick any object by `strName` and immediately see:

- **What it points to** (forward references — items it uses, conditions it starts with, sounds it emits, interactions it offers, etc.)
- **What points to it** (backlinks — every other entry across the whole `data/` tree that mentions this `strName`)
- **The neighborhood graph** — a small force-directed view of the n-hop reference cluster around the selected object.

The point is: Ostranauts is a "everything is a CondOwner" game, with ~30 data folders cross-referencing each other by string name. There's no IDE-style "Find Usages" today. This tool is that.

## Why now / who's it for

- **Audience:** modders writing JSON for the game (myself first, the small modding community second).
- **Pain point:** when you change `Blank`, or rename a condition, or wonder "what spawns this item?", you currently grep. Grep on 130k+ lines of JSON across 70+ folders is painful and lossy — you can't tell whether a string match is a real reference or coincidental text inside a description.
- **Win:** typed, schema-aware lookups. "Where is `ItmGalleyCoffeemaker01` referenced?" returns a clean list grouped by reference kind (loot table, condowner def, plot beat, etc.) — not a grep dump.

## Domain primer (what I confirmed by reading the data)

- Every JSON file under `data/<folder>/` is an array of objects, each with a unique `strName`.
- ~30 folders / object types. Major ones: `condowners`, `items`, `conditions`, `interactions`, `loot`, `cooverlays`, `condrules`, `condtrigs`, `slots`, `lights`, `audioemitters`, `plots`, `plot_beats`, `ships`, `rooms`, `loot`, `traitscores`, etc.
- Schemas live in `data/schemas/` (e.g. `condowners-schema.json`, `items-schema.json`) — these document the field-to-folder reference rules in their `description` strings (e.g. *"strItemDef: refers to entry within items.json"*, *"aLights: Lights emitted by the item. Found in lights.json"*). The schemas are **the authoritative reference map** the parser should learn from, not a hand-coded table.
- References are plain strings keyed by `strName`. There's no formal foreign-key system — the game resolves them at load.
- Conditions are embedded with a mini-DSL: `"IsSystem=1.0x1"` means `<conditionName>=<value>x<duration>`. The parser has to crack these to extract the condition reference.
- Pronoun tokens (`[us]`, `[them]`) are not references — they're placeholders. Need a small allowlist.
- Mods override base data when they share a `strName`. Out of scope for v1 (see open questions).

## Architecture

Three-project solution, one repo:

```
OstranautDataExplorer/
├── data/                              # game data (read-only, already present)
├── src/
│   ├── Ostranauts.DataModel/          # C# library — parsing, indexing, graph
│   │   │                              # targets netstandard2.1 (mod-loadable)
│   │   ├── SchemaLoader.cs            # reads data/schemas/*-schema.json, derives ref rules
│   │   ├── DataLoader.cs              # walks data/, parses every JSON array
│   │   ├── ReferenceExtractor.cs      # schema-driven → emits (sourceId, refKind, targetId, metadata)
│   │   ├── CondStringParser.cs        # cracks "IsSystem=1.0x1"; preserves value + duration on the edge
│   │   ├── Index.cs                   # forward + reverse indexes, lookup by strName/folder
│   │   └── GraphExporter.cs           # serialize to JSON for the web frontend
│   ├── Ostranauts.Site.Builder/       # CLI: net8.0, references DataModel, writes graph.js
│   └── Ostranauts.Site/               # vanilla JS + Cytoscape.js, no build framework
├── scrap_scripts/                     # see CLAUDE.md — exploratory throwaway scripts live here
├── build/                             # Makefile output, deployable to GitHub Pages
├── Makefile                           # `make` builds end-to-end
├── build.bat                          # double-clickable wrapper that runs `make` under Git Bash
├── CLAUDE.md
└── PROJECT-PITCH.md
```

**Why split DataModel from the Builder CLI:** the library targets `netstandard2.1` so it can be loaded inside an Ostranauts BepInEx mod later (e.g. an in-game data linter). The Builder is a normal `net8.0` console app that references the library and produces site assets. The library carries no `net8.0`-only dependencies.

**Site stack:** vanilla JS + Cytoscape.js. Static SPA, single `graph.js` payload (a JS-wrapped JSON object — `<script src>`-loadable so `file://` works without a local server), GitHub-Pages-friendly with a configurable base path. Spiritually similar to Quartz (Obsidian → static site): build-time parser + thin JS frontend.

## What the parser actually does

1. **Discover schemas.** Load every `data/schemas/*-schema.json`. Parse field descriptions for the phrase patterns (`refers to entry within X.json`, `Found in X.json`, `Check X.json`) to auto-derive a reference map: *field `strItemDef` on a condowner points into `items/`*. Where the schema is silent or ambiguous, fall back to a small hand-curated overrides file.
2. **Load all data.** Walk `data/`, parse every JSON array, build a flat `Map<(folder, strName), JsonObject>` registry.
3. **Extract references.** For each object, walk every field; consult the reference map to know which fields contain refs. Handle four shapes:
   - Plain `string` field (`strItemDef`)
   - `array<string>` field (`aInteractions`, `aSocketReqs`)
   - **Encoded condition strings** in `aStartingConds` etc. — `Name=value x duration`. Strip the suffix to get the condition name; preserve value + duration on the edge.
   - **Encoded loot strings** in `Loot.aCOs` / `Loot.aLoots` — `Name=chance x min-max`, comma-delimited, `|` for cumulative sublists, leading `-` for negation. Preserve chance + min/max + sign on the edge. The target folder for `aCOs` is **type-routed** by the parent's `strType` field (`item` → `condowners/`, `condition` → `conditions/`, `trigger` → `condtrigs/`, `interaction` → `interactions/`, `condrule` → `condrules/`, `lifeevent` → `lifeevents/`, `ship` → `ships/`). The reference map therefore needs **conditional rules** (target depends on a sibling field), not just fixed field→folder mappings. `aLoots` always points into `loot/`.

   CondRules deserve their own note: each rule's outgoing edges are (a) the target stat condition and (b) one edge per threshold to its discomfort (`Dc*`) condition. Carry a distinct `refKind` on each so the condition detail page can split "I am the target of N rules" from "I am applied at threshold X of M rules." `Thresh<StatName>` conditions are a naming-convention derived link to `<StatName>`, not a strName ref.
4. **Build the graph.** Forward: `(source) → [refKind] → (target)`. Reverse: same edges, indexed the other way. Detect dangling refs (target not in registry) and ambiguous refs (target name exists in multiple folders).
5. **Emit JSON for the site.** A node list (id, folder, strName, friendly name, brief), an edge list (source, target, refKind, sourceField), and per-object pages.

## Site UX (v1)

- **Search bar:** fuzzy search over `strName` + `strNameFriendly` across all folders.
- **Object detail page:**
  - Header: name, type, source file path.
  - "References out" panel: grouped by refKind, each row links to that target's page.
  - "References in" panel: same, the other direction. This is the killer feature.
  - Raw JSON, collapsed by default.
  - Mini graph: 1-hop neighborhood, click a node to navigate. **Drag to rearrange — positions persist in localStorage** (auto-layouts always bunch up).
- **Folder index pages:** a list view per object type, plus a summary block at the top — pulled from the schema's top-level `description` if present, else from a `data/<folder>/_README.md` if present, else parser-generated stats (entry count, common fields, notable entries).
- **Condition detail pages (special case):** because `aStartingConds` and similar carry value + duration, condition pages aggregate incoming edges by their values — "default value 1.0 across N owners," "set to 0.5 across M owners," "modified by interactions A, B, C." The parser preserves this metadata on the edge rather than discarding it.
- **Health page:** dangling references, orphaned objects (nothing points to them), duplicate `strName`s across folders.

## Out of scope for v1

- Mod loading order / overrides (just base game `data/` for now).
- Editing data — read-only explorer. Schema files are an exception: they're edited in place during v0/v1 to add comments and clarify reference rules. Those edits are intended to migrate to a "Comment Mod" once mod-overlay support exists in v2.
- Sprite/image asset previews (we'd need to point at the game's `StreamingAssets/sprites` outside `data/`).
- Live reload during dev.
- Save-file inspection / editing — separate domain (different schema, different file location); deferred to v2.

## Roadmap

> Active work — what's *next*, what's in-progress, what's blocked — lives in
> [PLAN.md](PLAN.md). This roadmap is the long-arc shape only; specifics
> migrate to PLAN as they become real next steps. Shipped slices live in
> [DEV-LOG.md](DEV-LOG.md).

### v0 — baseline + working copy *(shipped)*

Repo scaffolded. `data/` baseline workflow established. See DEV-LOG for
the actual delivery.

### v1 — explorer

Everything described in this pitch above. Goal: search any object, see forward + backward references, browse a small interactive graph, ship it as a static GitHub Pages site.

Most v1 surface is shipped (search, detail pages, forward+reverse refs,
mini-graph, schema inspector, health pages, template engine, code-refs
panel). What's left in v1 territory — newcomer-onboarding components,
glossary search, contextual explainers, the late-v1 stat-page generator
— lives in [PLAN.md](PLAN.md) under *Site / UX*.

**Stat-page generator (late v1).** A planned Builder step that asks a lightweight LLM to write a one-paragraph plain-English summary of each object given its `strName`, fields, and outgoing references — "this is a [coffeemaker] that [requires power], [interacts with crew via X]". Output cached per object so re-runs don't burn API calls. Each detail page renders the summary with a visible "AI-generated description — verify against source" notice, and embeds machine-readable structured metadata (likely `<script type="application/ld+json">` plus selective `data-*` attributes) so external tooling can extract clean facts without scraping the prose.

### v2 — mod-aware tooling, IDE integration, save tools
Ordered by dependency, not effort.

1. **Mod partial loader (overlay).** Loader reads a mod root with `mod_info.json` + `loading_order.json`, merges objects by `strName` with later mods winning. Refactors `DataLoader` to accept multiple roots in priority order. *Prerequisite for everything else in v2 — the LSP wants to lint mod files in context, the Comment Mod migration uses it, etc.*
2. **VS Code language server (LSP).** A C# language server (`Ostranauts.Lsp`, `net8.0`) using `OmniSharp.Extensions.LanguageServer`, plus a thin TypeScript extension shell (`vscode-extension/`). Reuses `Ostranauts.DataModel` for all reference resolution. Provides diagnostics (dangling refs, duplicate `strName`s, schema violations), hover (forward + backward references inline), go-to-definition across files, and `strName` completion. Modders edit JSON in VS Code with full IDE assistance.

   *Sized as the bulk of v2 work* — comparable to v1's web-explorer effort. New surface is LSP plumbing per feature; the data layer is reused. Slotted early because:
   - It needs only the overlay loader as a prerequisite.
   - It's the highest-leverage modder-facing feature in v2 — the moment it ships, anyone editing data in VS Code benefits.
   - It largely **subsumes the "mod editor"** item below; an IDE with hover/completion/jump-to-def is usually a better authoring experience than a custom UI for this kind of structured-text editing.
3. **Comment Mod migration.** Diff `data/schemas/` against `data.original/schemas/`, package the differences as `mods/CommentMod/data/schemas/...`, restore `data/schemas/` to vanilla. After this, the working copy is "core data + Comment Mod overlay" rather than mutated core. The LSP shows comments via hover.
4. **~~Mod editor~~ — likely cancelled.** Reconsider after LSP ships. Custom mod-authoring UI may be unnecessary if the LSP covers the editing experience well. Keep on the list for now in case there are workflows (bulk renames, visual ship editing, etc.) the LSP can't reach.
5. **Save inspector — `aCrew01` first.** Saves are JSON; `aCrew01` is the crew array. Start with read-only inspection, applying the same schema-driven approach (saves reference data-tree objects by `strName`, so the explorer's reverse-lookup machinery transfers).
6. **Save editor — `aCrew01`.** Add field editing on top of the inspector.
7. **General save inspector / editor (non-map).** Extend coverage beyond crew to ship state, inventory, conditions, etc.
8. **Map explorer.** Visualize ship/station tilemaps from `ships/` and `rooms/` data-tree objects.
9. **Save map explorer.** Same view, but driven by save-file map state.

## Wiki content map (for posterity)

The Ostranauts wiki at `ostranauts.wiki.gg` is ~824 articles spread across these top categories (size = page count, queried via the MediaWiki `allcategories` endpoint):

| Category | Pages | What's there | Relevant to us? |
|---|---|---|---|
| **Items** | 425 | Per-item pages, infobox-driven (sprite, type, mass, manufacturer, lore). One article per `data/items/` entry, roughly. | Indirectly — infoboxes encode field values; could ground-truth rules. |
| **Locations** | 78 | In-game places (stations, cities, points of interest) organized by region (`Jupiter`, `Mars`, `Belt`, `Earth`, `Ganymed`). | Tangential — relates to `data/star_systems/`, `data/ships/`. |
| **Corporations** | 33 + 23 commercial | In-universe companies: parent corps and their subsidiaries. World-building. | Low — narrative context, not schema info. |
| **Hull / HVAC / Control / Furniture / Consumables** | ~70 combined | Item subcategories (each item belongs to one). | Indirect — informs what `nType` values mean. |
| **Lore** | 7 | World setting, history, factions. | None for the parser. |
| **Main Mechanics** | 17 | Game systems documentation (combat, AI, social, economy). | Indirect — explains *why* certain refs exist. |
| **Modding** | small (subpages) | What we care about. JSON modding, BepInEx, CondOwners, Loot, Pledges, glossary. | **Primary target for the wiki crawl.** |
| **Game updates** | 110 | Patch notes / changelog. | None for the parser. |
| Templates, Admin, Disambiguations | ~80 combined | Wiki infrastructure. | None. |

**Style.** Every content article uses MediaWiki templates (especially infoboxes) for structured fields, plus free prose. Modding pages use tables-of-fields, code blocks, and sectioned headings. The infobox-template content on item pages is the most structured non-modding data — could in theory be parsed for cross-validation of items/ field values, but that's well beyond v1 scope.

**Crawl scope decision (Q above):** start with `Modding/*` only. The other ~750 articles are valuable context but don't carry the field-to-folder reference info we're after. Revisit if we want item-page infobox extraction later.

### Pages flagged for LLM-assist extraction

The deterministic extractor (`utils/python/wiki_extract_schemas.py`) leaves a per-page review queue in [comment_mod/wiki_review_queue.md](comment_mod/wiki_review_queue.md) for fields it couldn't confidently resolve. The page-priority + assigned-model table for the actual extraction pass lives in [PLAN.md](PLAN.md) under *Content / wiki extraction*.

## Decisions (resolved)

| # | Decision |
|---|---|
| 1 | **Site stack:** vanilla JS + Cytoscape.js (Quartz-style: build-time parser + thin JS frontend). |
| 2 | **Reference rules:** schema-driven from `data/schemas/*-schema.json`. A hand-curated overrides file may add comments only — never invent rules the schema doesn't imply. Useful comments should be upstreamed into the schema files where possible. |
| 3 | **Mod overlay:** out of scope for v1. Base game `data/` only. |
| 4 | **Non-JSON folders** (`tsv/`, `strings/`, `ai_training/`, `DebugSocialAudit.csv`): skip. Each folder index page gets a summary block instead — schema description → `_README.md` → parser stats, in that order. |
| 5 | **Build orchestrator:** `make`, run from Git Bash on Windows. A `build.bat` wraps it for double-click / `cmd` invocation. |
| 6 | **Condition strings** (`"IsSystem=1.0x1"`): keep value + duration on the edge. Condition detail pages aggregate incoming edges by value — "default 1.0 across N owners," etc. |
| 7 | **Pronoun / placeholder tokens:** allowlist by regex `\[\w+\]` (covers `[us]`, `[them]`, `[me]`, `[here]`, anything in that shape). Not enumerated. |
| 8 | **Graph scale:** static JS-wrapped JSON for v1. Manual node positions persist in localStorage (auto-layouts bunch up). Shard per-folder if the single `graph.js` gets too big. |
| 9 | **.NET targets:** `Ostranauts.DataModel` → `netstandard2.1` (the wiki's BepInEx mod target, so the library can be reused inside a mod). `Ostranauts.Site.Builder` → `net8.0`. |
| 10 | **Hosting:** GitHub Pages. Site needs a configurable base path so `/OstranautDataExplorer/` works. |
| 11 | **Per-folder summaries:** hybrid (c) — schema's top-level `description` → `data/<folder>/_README.md` → parser-generated stats, fall through in that order. |

