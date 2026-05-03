# CLAUDE.md

Operating notes for Claude Code working in this repo. Keep this file tight.

## Project shape

- `data/` — read-only mirror of the Ostranauts game data tree (~70 folders of JSON arrays). Source of truth for the parser. Do not modify.
- `data/schemas/*-schema.json` — authoritative reference rules. The parser **derives** which fields are cross-references from the schema's field descriptions.
- `comment_mod/data/schemas/*-schema.json` — tracked overlay holding our schema improvements (additions and edits). The Builder reads `data/` and `comment_mod/data/` together as ordered roots (last-wins on collisions); no manual setup step. The base game's schemas are sparse (5 of ~70 folders covered, often without descriptions); the Comment Mod is how we extend coverage without "hand-curated rules". A proper v2 mod-overlay loader (with `mod_info.json` / `loading_order.json`) builds on top of this minimal multi-root mechanism.
- `src/Ostranauts.DataModel/` — C# parsing/indexing library. Targets **`netstandard2.1`** (so it can be loaded by Ostranauts/BepInEx-side mods later).
- `src/Ostranauts.Site.Builder/` — CLI that consumes the library and emits `graph.js` (a JS-wrapped JSON payload — script-tag-loadable so the static site works from `file://` URLs without needing a local server). Targets **`net8.0`**.
- `src/Ostranauts.Site/` — static vanilla-JS frontend (Cytoscape.js for graph view). No build framework; deploy is "copy folder."
- `build/` — Makefile output. Ready to publish to GitHub Pages.

## Build

`make` is the entry point. On Windows, run from Git Bash. A `build.bat` wraps `make` so double-click / `cmd` invocation works without rewriting the build pipeline.

## Scrap scripts

Any throwaway script — exploratory parsing, one-off data dumps, schema spelunking — must:

1. Live in `./scrap_scripts/<lang>/` where `<lang>` is one of `python`, `bash`, `cmd`, `ps`.
2. Be named `<NN>_<slug>.<ext>` where `NN` is a zero-padded incrementing key per language folder (e.g. `01_count_condowners.py`, `02_dump_dangling_refs.py`).
3. **Not** be invoked inline. The `python` command line should only ever be `python ./scrap_scripts/python/NN_slug.py`. For Bash, PowerShell, and CMD: practice restraint with inlining — short one-liners are fine, but anything that grows beyond a couple of pipes or starts needing variables / loops / conditionals goes into a file in the appropriate folder.

This rule applies to subagents too. When delegating to an Agent, include this directive in the prompt so the subagent obeys it.

Rationale: keeps the working directory clean, makes prior exploration discoverable, and means the same script can be re-run later without retyping or guessing what the previous attempt looked like.

## Dev log — write before every commit

Before committing, add an entry to [DEV-LOG.md](DEV-LOG.md). Minimum: one line describing what changed and why. For non-obvious changes (design decisions, schema additions, refactors), a short paragraph. Format: `## YYYY-MM-DD — <slug>` header, reverse-chronological order.

## Game engine notes

- The game deserializes JSON with **LitJson** (not Newtonsoft.Json / System.Text.Json). LitJson is case-sensitive and maps JSON keys directly to C# property/field names. No `[JsonProperty]` rename attributes — the JSON key **is** the C# member name. This is relevant when reconciling field names in `decomp/` against data in `data/`.
- Decompiled C# classes in `decomp/Assembly-CSharp/` are ground truth for what fields the game actually reads. There are 126 `Json*.cs` files; the ones matching data folders (e.g. `JsonCondOwner` → `condowners/`) are authoritative sources for schema work.

## CodeDocs — read before code, sync before commit

This repo carries an LLM-targeted documentation index at [CODE-DESIGN.md](CODE-DESIGN.md) plus the `CodeDocs/` tree it points at. The point: most code questions can be answered from the per-file overviews without opening the actual `.cs`, which keeps the context budget intact.

Rules:

1. **Load before navigating code.** Before opening any source file (Read, Grep, Glob into `src/` or `tests/`), read `CODE-DESIGN.md` and `CodeDocs/00_PROJECT.md`. They're small. They tell you whether the file you were going to grep for already has an overview.
2. **Sync before any commit.** If you modified a `.cs` file, the matching `CodeDocs/sources/<Project>/<File>.md` must reflect the new state — public API signatures, status (real/stubbed), dependencies, who uses it. If you changed a generated/consumed file format, update `CodeDocs/io/inputs.md` or `outputs.md`. The pre-commit checklist is "every changed code file has a synced overview."
3. **On noticed desync, full audit.** If you read an overview and it's wrong (claims a method that doesn't exist, or misses a public member that does), don't just fix that one. Sweep the whole `CodeDocs/sources/` and `CodeDocs/io/` against the current code and re-sync everything that drifted. The trust value of the system depends on it being globally accurate, not locally patched.

**Pass this directive into subagent prompts.** A subagent that ignores CodeDocs both wastes its own context and risks drifting the index by editing code without updating overviews.

## Wiki cache — fetch once, re-read locally

`wiki_cache/` is a gitignored local cache of Ostranauts wiki pages. **Always check the cache before reaching for `WebFetch`.** Wiki content rarely changes mid-session, and the cache keeps the full wikitext (much richer than `WebFetch`'s prompt-summarized output).

Workflow:

1. Convert the wiki URL to a slug — `https://ostranauts.wiki.gg/wiki/Modding/CondOwners` → `Modding__CondOwners`. Slashes in the page title become `__`.
2. Look for `wiki_cache/markdown/<slug>.md`. If present, `Read` it directly.
3. If absent, run `python ./scrap_scripts/python/01_wiki_cache.py <url-or-page-title> [...]` to populate. The script accepts multiple URLs/titles in one call — batch them. Pass `--refresh` to force a re-fetch.

The cached `.md` files are wikitext with a small YAML frontmatter (source URL, section count). Internal `[[Page]]` links reveal which other pages exist — follow them by re-running the cache script.

**Pass this workflow into subagent prompts** so they cache-first too instead of burning fresh `WebFetch` calls on pages we already have.

## Reference-extraction notes

- Cross-references are plain `strName` strings keyed across folders. There are no formal foreign keys.
- Condition strings (e.g. `"IsSystem=1.0x1"` in `aStartingConds`) carry value + duration metadata that **must be preserved on the edge**, not stripped. The condition's detail page aggregates incoming edges to show "default value X across N owners," "modified by ±Y across M interactions."
- Loot strings (`Loot.aCOs`, `Loot.aLoots`) carry weight metadata: `Name=chance x min-max`, comma-delimited, `|` for cumulative-probability sublists within one slot, leading `-` for negative payouts. Preserve `chance`, `fMin`, `fMax`, `bPositive` on the edge — same principle as condition strings.
- `Loot.aCOs` target folder is **conditional on the parent's `strType`**: `condition` → `conditions/`, `item` → `condowners/`, `trigger` → `condtrigs/`, `interaction` → `interactions/`, `condrule` → `condrules/`, `lifeevent` → `lifeevents/`, `ship` → `ships/`. The schema-driven extractor must support **type-routed ref rules** (target depends on a sibling field), not just one fixed target folder per field. `Loot.aLoots` always points into `loot/`.
- CondRules emit edges to (a) the target stat condition and (b) each threshold's discomfort (`Dc*`) condition. Both land in `conditions/` but should carry distinct `refKind` (e.g. `target` vs. `threshold-effect`) so the condition detail page can present them separately.
- `Thresh<StatName>` conditions are a naming convention — they dynamically shift the thresholds of `<StatName>`. Not a direct strName reference; surface as a derived `modifies-thresholds-of` relationship via the name pattern.
- Pledges (`data/pledges/`) reference interactions in three fields: `strIATrigger`, `aIAEnd[]`, `strIAEmergency` → `interactions/`. `strThemID` → `condowners/` (with `null` and `[them]` / `[3rd]` allowed via the placeholder allowlist). Reverse direction: `interactions.strPledgeAdd` / `interactions.strPledgeRemove` → `pledges/`, and `personspecs.strLootIAAdds` → `loot/`. Together these form the **pledge-attach chain** (PersonSpec → Loot[`strType=interaction`] → Interaction[`strPledgeAdd`] → Pledge) that endows characters with lifetime AI behaviors — a useful end-to-end canary for the type-routed loot rules.
- `strType` fields (on `loot/`, `pledges/`, likely others) are **enum tags dispatching to game code**, not strName references. The schema-driven extractor must classify them as enums and may use them to route sibling fields' targets (e.g. loot `aCOs`). Recurring trap: assume any field literally named `strType` is an enum unless explicitly proven a ref.
- Pronoun / placeholder tokens — anything matching `\[\w+\]` (e.g. `[us]`, `[them]`, `[me]`, `[here]`) is not a reference. Allowlist by regex, not by enumerated list. `[us]` also appears in loot `aCOs` to mean the calling CondOwner.
- Mod overlay / load order is **out of scope for v1** — base game `data/` only.

## Graph viz

Cytoscape.js. Auto-layouts bunch nodes — users must be able to drag nodes manually and have positions persist (localStorage keyed per object page is the v1 plan).
