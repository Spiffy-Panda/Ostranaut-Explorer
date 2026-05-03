# Ostranaut Data Explorer

A static-site explorer for the [Ostranauts](https://store.steampowered.com/app/1022980/Ostranauts/) game data tree. Pick any object by `strName` and immediately see what it points to, what points to it, and the surrounding reference graph — IDE-style "Find Usages" for a game where everything is a `CondOwner` referencing other `CondOwner`s by string name.

> **Status: pre-v1.** Project skeleton and planning only. See [PROJECT-PITCH.md](PROJECT-PITCH.md) for the full design and roadmap.

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

Because the data files aren't in the repo, **CI builds aren't wired up yet**. Builds happen on contributor machines for now. GitHub Actions is on the table once we have a sanctioned source for the data — or once the build can be split so the parser runs locally and only the resulting `graph.js` is published.

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

   - `scrap_scripts/python/06_decomp_schema_crosscheck.py` and `07_decomp_schema_table.py` audit our schemas against the actual `Json*.cs` deserialization classes (`grep -E 'public string \w+ { get; set' decomp/Assembly-CSharp/Json*.cs` is the underlying signal).
   - `scrap_scripts/python/10_emit_code_refs.py` scans for hardcoded `"<strName>"` string-literal lookups (e.g. `DataHandler.GetPledge("EmbarkCommand")` in `AIShipManager.cs`) and emits `build/data/code_refs.js` so the site shows a "Code references" block on each object detail page.

   The whole project works without `decomp/` — those scripts and the code-references panel just stay empty. With it, you get a much more authoritative picture of the game's data surface.

## Building

Once `data/` is populated:

```bash
make           # from Git Bash on Windows, or any POSIX shell
build.bat      # double-clickable wrapper that invokes `make` under Git Bash
```

The build runs the C# parser against `data/`, emits `graph.js` (a JS-wrapped JSON payload), and assembles the static site under `build/`. Open `build/index.html` directly in a browser to use the explorer offline — no local server needed — or push `build/` to GitHub Pages.

## Project layout

```
OstranautDataExplorer/
├── data/                          # game data (gitignored, you supply)
├── data.original/                 # baseline snapshot (gitignored, optional)
├── src/
│   ├── Ostranauts.DataModel/      # C# library — parsing, indexing, graph
│   │                              # targets netstandard2.1 (mod-loadable)
│   ├── Ostranauts.Site.Builder/   # CLI: net8.0, emits graph.js (JS-wrapped JSON)
│   └── Ostranauts.Site/           # vanilla JS + Cytoscape.js frontend
├── scrap_scripts/                 # exploratory / one-off scripts (gitignored)
├── build/                         # `make` output, ready for GitHub Pages
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

- **v0** — repository scaffolding, baseline snapshot. *(current)*
- **v1** — the explorer: search, forward + backward references, interactive graph, static site.
- **v2** — mod-overlay loader, VS Code language server (full IDE assistance for editing data files), save inspector/editor (starting with `aCrew01`), map explorer, save-map explorer.

Full detail in [PROJECT-PITCH.md](PROJECT-PITCH.md).

## For AI agents (and the curious)

`CODE-DESIGN.md` is the LLM-targeted index pointing at `CodeDocs/`. It exists so an agent (or a human reviewer) can answer "what does this class do, what's its public API, what depends on it" without opening every `.cs` file — overviews live alongside the code and are kept in sync at commit time. If you're using Claude Code or any agentic coding tool against this repo, that file plus `CLAUDE.md` are the orientation pack.

## Contributing

Not open for outside contributions yet — the project is still pre-v1. If you stumbled on it and want to follow along, the pitch and CLAUDE.md will tell you most of what you need.

## Acknowledgements

- [Ostranauts](https://store.steampowered.com/app/1022980/Ostranauts/) by Blue Bottle Games.
- The [Ostranauts wiki](https://ostranauts.wiki.gg/) — particularly the [Data Modding](https://ostranauts.wiki.gg/wiki/Modding/Data_Modding) and [CondOwners](https://ostranauts.wiki.gg/wiki/Modding/CondOwners) pages — which document the data system this project visualizes.
