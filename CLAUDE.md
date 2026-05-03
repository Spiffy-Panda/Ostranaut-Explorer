# CLAUDE.md

Operating notes for Claude Code working in this repo. Keep this file tight.

## Project shape

- `data/` — read-only mirror of the Ostranauts game data tree (~70 folders of JSON arrays). Source of truth for the parser. Do not modify.
- `data/schemas/*-schema.json` — authoritative reference rules. The parser **derives** which fields are cross-references from the schema's field descriptions. A hand-curated overrides file may add comments, but should never invent reference rules the schema does not imply. Prefer upstreaming useful comments into the schema files themselves.
- `src/Ostranauts.DataModel/` — C# parsing/indexing library. Targets **`netstandard2.1`** (so it can be loaded by Ostranauts/BepInEx-side mods later).
- `src/Ostranauts.Site.Builder/` — CLI that consumes the library and emits `graph.json` + per-object detail JSON. Targets **`net8.0`**.
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
- Pronoun / placeholder tokens — anything matching `\[\w+\]` (e.g. `[us]`, `[them]`, `[me]`, `[here]`) is not a reference. Allowlist by regex, not by enumerated list.
- Mod overlay / load order is **out of scope for v1** — base game `data/` only.

## Graph viz

Cytoscape.js. Auto-layouts bunch nodes — users must be able to drag nodes manually and have positions persist (localStorage keyed per object page is the v1 plan).
