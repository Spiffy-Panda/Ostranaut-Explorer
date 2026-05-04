# Ostranaut Explorer

A static-site explorer for the [Ostranauts](https://store.steampowered.com/app/1022980/Ostranauts/) game data tree. Pick any object by `strName` and immediately see what it points to, what points to it, and the surrounding reference graph — IDE-style "Find Usages" for a game where everything is a `CondOwner` referencing other `CondOwner`s by string name.

> **Status: v1 in active development.** The site frame, parser, and core search/navigation tabs are working. UX onboarding components, cluster/template-hub pages, and several content gaps are still in flight — see [Limitations](#limitations--whats-not-in-the-box-yet) below for the honest list. Public demo (frame only, no game data) at <https://spiffy-panda.github.io/Ostranaut-Explorer/>. Long-arc design in [PROJECT-PITCH.md](PROJECT-PITCH.md).

## Why

Ostranauts data lives in ~70 folders of JSON arrays under `StreamingAssets/data/`. Objects cross-reference each other by `strName` strings — there's no formal foreign-key system, no IDE assistance, and `grep` on 130k+ lines of JSON returns coincidental text matches alongside real references. This tool parses the schemas, follows the references, and gives you a browsable map.

## Setting up locally

The base-game data files are not redistributed in this repo — there's no published policy on the [Ostranauts wiki](https://ostranauts.wiki.gg/) permitting it, so until that changes you supply them from your own Steam install.

1. **Locate your Steam copy of Ostranauts.** The data folder lives at:

   ```
   <Steam library>\steamapps\common\Ostranauts\Ostranauts_Data\StreamingAssets\data
   ```

   On a default Windows install that's typically `C:\Program Files (x86)\Steam\steamapps\common\Ostranauts\Ostranauts_Data\StreamingAssets\data`.

2. **Copy that folder into the project root** as `data/`:

   ```
   <project>/data/
       condowners/
       items/
       conditions/
       interactions/
       schemas/
       ...
   ```

3. **(Recommended) Make a baseline snapshot** so in-place schema edits are recoverable:

   ```bash
   cp -r data data.original
   ```

   Both `data/` and `data.original/` are gitignored. The snapshot is your recovery point if you mutate schema files locally and want to diff against vanilla.

4. **Comment Mod overlay (loaded automatically).** This repo ships schema improvements that significantly extend reference-rule coverage — they live tracked under `comment_mod/data/schemas/`. The Builder reads `data/` and `comment_mod/data/` together by default, with the overlay taking precedence on collisions. No copy step needed.

   To opt out (vanilla data only) or supply additional roots, use the explicit `--root <path>` flag:

   ```bash
   # vanilla only
   dotnet run --project src/Ostranauts.Site.Builder -- --root data
   # custom mod stack
   dotnet run --project src/Ostranauts.Site.Builder -- --root data --root my_mod/data
   ```

Because the game data isn't redistributable, **the parser only ever runs on contributor machines** — never in CI, never on a hosted runner. The public Pages deploy at <https://spiffy-panda.github.io/Ostranaut-Explorer/> ships the static site frame, the cover page describing each tab, and the bundled handoffs only; the data tabs are empty there. To populate them, follow the steps above and run `make` locally.

5. **(Optional) Decompile the game's `Assembly-CSharp.dll`** so the parser can cross-check schemas against the C# source of truth and the site can show hardcoded code references on object detail pages. Per the [Ostranauts wiki](https://ostranauts.wiki.gg/wiki/Modding/BepInEx_Modding), the recommended decompiler is **[dnSpy](https://github.com/dnSpyEx/dnSpy)**.

   1. Install dnSpy (the dnSpyEx fork; the original is unmaintained).
   2. Open dnSpy → File → Open → navigate to the game's managed-code DLL:

      ```
      <Steam library>\steamapps\common\Ostranauts\Ostranauts_Data\Managed\Assembly-CSharp.dll
      ```

   3. In the assembly tree on the left, right-click the **Assembly-CSharp** node → **Export to Project…**.
   4. **Use the default settings** — don't tick anything extra. Choose `decomp/Assembly-CSharp/` in this repo as the destination, then OK.
   5. dnSpy emits a folder of `.cs` files next to a generated `.csproj`. The `decomp/` folder is gitignored.

   With `decomp/Assembly-CSharp/` populated:

   - `utils/python/decomp_schema_crosscheck.py` and `decomp_schema_table.py` audit our schemas against the actual `Json*.cs` deserialization classes (`grep -E 'public string \w+ { get; set' decomp/Assembly-CSharp/Json*.cs` is the underlying signal).
   - `utils/python/emit_code_refs.py` scans for hardcoded `"<strName>"` string-literal lookups (e.g. `DataHandler.GetPledge("EmbarkCommand")` in `AIShipManager.cs`) and emits `build/data/code_refs.js` so the site shows a "Code references" block on each object detail page.

   The whole project works without `decomp/` — those scripts and the code-references panel just stay empty. With it, you get a much more authoritative picture of the game's data surface.

   See `utils/README.md` for the full catalog of decomp / wiki tooling.

## Building

Once `data/` is populated:

```bash
make           # from Git Bash on Windows, or any POSIX shell
build.bat      # double-clickable wrapper that invokes `make` under Git Bash
```

The build runs the C# parser against `data/`, emits `graph.js` (a JS-wrapped JSON payload), and assembles the static site under `build/`. Open `build/index.html` directly in a browser to use the explorer offline — no local server needed. The landing page is the cover (the same one visible on the public demo); click **Explorer** in the tab bar to enter the navigable data view.

`make site-public` produces a frame-only bundle under `build-public/` with no game-data derivatives. That's what `.github/workflows/pages.yml` deploys on every push.

## Project layout

```
Ostranaut-Explorer/
├── data/                          # game data (gitignored, you supply)
├── data.original/                 # baseline snapshot (gitignored, optional)
├── comment_mod/                   # tracked schema overlay (extends base-game schemas)
├── src/
│   ├── Ostranauts.DataModel/      # C# library — parsing, indexing, graph
│   │                              # targets netstandard2.1 (mod-loadable)
│   ├── Ostranauts.Site.Builder/   # CLI: net8.0, emits graph.js (JS-wrapped JSON)
│   └── Ostranauts.Site/           # cover (index.html) + explorer (explorer.html), vanilla JS + Cytoscape.js
├── notes/handoff/                 # standalone HTML pages that ship under build/handoff/
├── scrap_scripts/                 # exploratory / one-off scripts (gitignored)
├── build/                         # `make` output, full bundle (gitignored)
├── build-public/                  # `make site-public` output, no game-data (gitignored)
├── .github/workflows/pages.yml    # deploys build-public/ to GitHub Pages
├── Makefile
├── build.bat                      # Windows wrapper for `make`
├── CLAUDE.md                      # operating notes for AI-assisted development
└── PROJECT-PITCH.md               # design rationale and roadmap
```

## Tech stack

- **`Ostranauts.DataModel`** — C#, `netstandard2.1`. Targets the same surface as Ostranauts BepInEx mods so the same library can later power an in-game data linter.
- **`Ostranauts.Site.Builder`** — C#, `net8.0`. Console app that drives the library and emits site data.
- **`Ostranauts.Site`** — vanilla JS, [Cytoscape.js](https://js.cytoscape.org/) for the graph view. No framework, no bundler. Static deploy.
- **Build orchestrator** — `make`, run from Git Bash on Windows.

## How references are extracted

Reference rules are derived from `data/schemas/*-schema.json` — specifically from the field descriptions, which already contain phrases like *"refers to entry within items.json"* and *"Found in lights.json"*. The parser reads these and learns which fields cross-reference which folders. A small overrides file may add comments, but should never invent rules the schemas don't imply. Improvements to clarity belong upstream in the schema files themselves.

## Roadmap (summary)

- **v0** — repository scaffolding, baseline snapshot. *(shipped)*
- **v1** — the explorer: search, forward + backward references, interactive graph, static site. *(largely shipped; newcomer-onboarding UX components in progress)*
- **v2** — mod-overlay loader, VS Code language server (full IDE assistance for editing data files), save inspector/editor (starting with `aCrew01`), map explorer, save-map explorer.

Long-arc design and decisions: [PROJECT-PITCH.md](PROJECT-PITCH.md). Active
next steps (lives until done, then deleted): [PLAN.md](PLAN.md). What
shipped when: [DEV-LOG.md](DEV-LOG.md).

## Limitations — what's not in the box yet

The public demo at <https://spiffy-panda.github.io/Ostranaut-Explorer/> ships the site frame, the cover page describing each tab, and the bundled handoffs only — there's no graph data. To see anything in the data tabs you must clone the repo and run `make site` locally with Ostranauts installed (see [Setting up locally](#setting-up-locally)).

Beyond the empty-data caveat, several substantive parts are stubbed, deferred, or not yet built. [PLAN.md](PLAN.md) tracks current priority; [notes/coverage-gaps.md](notes/coverage-gaps.md) tracks parser blind spots.

**Site features not yet built** (see [notes/ux/](notes/ux/) for full specs):

- **Glossary card + concept search (UX 1.1).** Search-bar fallback when strName matches return zero, with a hand-seeded alias map (~30 seed entries). Gates both newcomer-onboarding user stories.
- **Per-prefix contextual explainer banners (UX 1.2).** Short banners keyed on naming convention (`Stat*`, `Thresh*`, `COND*`, `Itm*`, `ACT*`, `DRUG*`).
- **Inline schema field descriptions (UX 1.3).** Currently hover-only; newcomers don't know to hover.
- **Filter pills on incoming refs (UX 1.6).** Plain-language pill set above any ref list >5 rows.
- **Cluster pages (UX 3.1).** Per-folder prefix-cluster pages with curation overlay, three-tier auto-detection, and a *"compared with the neighborhood"* table as the centerpiece.
- **Template-hub pages (UX 3.2).** For one-object-as-type-definition cases like `ItmBodyPart01` (used as `strItemDef` by 20+ `Wound*` entries). Includes a blast-radius callout when editing a template would affect every instance.
- Several smaller UX components (1.4 derived `Thresh<X>` sidebar, 1.7 DSL primer popover, 1.8 `strType` dispatch tooltip, 1.9 *"Why is this in `X/`?"* note, 1.10 *"Edit this"* callout, 1.11 live-build diff, 1.12 plain-language wiki links).
- A static `/help/debug` route migrated from the wiki Debug page.

**Parser coverage gaps:**

- Only **5 of ~70 data folders** carry a base-game schema. `comment_mod/data/schemas/` extends coverage but is far from complete.
- The auto-detector found **184 uncovered ref candidates** (`build/data/ref_candidates.js`) that haven't been promoted to schema overlays. See [PLAN.md](PLAN.md) → *Slice E phase 6* for status.
- Stat-bar → `Stat*` strName mappings are partial — only `StatGrav` confirmed of eleven UI bars. See [PLAN.md](PLAN.md) → *Stat bars cross-validation audit*.
- **Mod-overlay load order beyond the simple `data/` + `comment_mod/data/` pair is out of scope** until a v2 mod-aware loader. The Builder accepts ordered roots today, but there's no `mod_info.json` / `loading_order.json` resolver.

**Content gaps:**

- LLM-assist extraction passes pending on five flagged Modding wiki pages (Conditions, Modding/Pledges, Modding/CondOwners, Modding/Interactions, Modding/Loot).
- `nDisplaySelf` field semantics not yet captured in the schema (gates the *crew-exercise-invisible-need* user story).
- The *needs-suppression* mod handoff (linked under `/handoff/`) is a starting scaffold and is **untested in-game** — verified workflow happens once the explorer is populated.

When you visit a populated explorer with real data, expect to encounter fields with no description, folders with no schema, and references the parser can't yet resolve. Those gaps are the work surface — they're tracked rather than hidden, so contributors can pick the next overlay or component.

## Where things live

| Document                                                              | What's there                                                                 |
|-----------------------------------------------------------------------|------------------------------------------------------------------------------|
| [PROJECT-PITCH.md](PROJECT-PITCH.md)                                  | Why this exists, who it's for, architecture, decisions, v2 long-arc roadmap. |
| [PLAN.md](PLAN.md)                                                    | Active work — what's next, in-progress, blocked, deferred. Shrinks as items ship. |
| [DEV-LOG.md](DEV-LOG.md)                                              | Reverse-chronological changelog. One entry per slice; what + why.             |
| [CLAUDE.md](CLAUDE.md)                                                | Operating notes for AI-assisted development. Conventions, workflows, gotchas. |
| [CODE-DESIGN.md](CODE-DESIGN.md) → `CodeDocs/`                        | LLM-targeted code overviews. Per-file public API, dependencies, status.       |
| [utils/README.md](utils/README.md)                                    | Catalog of tracked Python utilities (wiki cache, decomp audit, etc.).         |
| [notes/coverage-gaps.md](notes/coverage-gaps.md)                      | Living scratchpad for parser blind spots before the auto-detector runs.       |
| [notes/user-stories/](notes/user-stories/)                            | End-to-end modder scenarios that test the site is "good enough."              |
| [notes/ux/](notes/ux/)                                                | UX plans for site components. Designer-facing specs, content + constraints.   |
| [notes/wiki-onboarding.md](notes/wiki-onboarding.md)                  | Modder-relevant material harvested from player-facing wiki pages.             |
| [prose-extraction/README.md](prose-extraction/README.md)              | Per-page provenance from LLM-assist wiki extraction passes.                   |
| [comment_mod/wiki_review_queue.md](comment_mod/wiki_review_queue.md)  | Per-page review queue for fields the deterministic extractor punted on.       |

## For AI agents (and the curious)

`CODE-DESIGN.md` is the LLM-targeted index pointing at `CodeDocs/`. It exists so an agent (or a human reviewer) can answer "what does this class do, what's its public API, what depends on it" without opening every `.cs` file — overviews live alongside the code and are kept in sync at commit time. If you're using Claude Code or any agentic coding tool against this repo, that file plus `CLAUDE.md` are the orientation pack — and `PLAN.md` tells the agent what's actually next.

## Contributing

Not open for outside contributions yet — the project is still pre-v1. If you stumbled on it and want to follow along, the pitch and CLAUDE.md will tell you most of what you need.

## Acknowledgements

- [Ostranauts](https://store.steampowered.com/app/1022980/Ostranauts/) by Blue Bottle Games.
- The [Ostranauts wiki](https://ostranauts.wiki.gg/) — particularly the [Data Modding](https://ostranauts.wiki.gg/wiki/Modding/Data_Modding) and [CondOwners](https://ostranauts.wiki.gg/wiki/Modding/CondOwners) pages — which document the data system this project visualizes.
