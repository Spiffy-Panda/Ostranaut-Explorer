# utils/

Tracked, durable tooling. Sibling of `scrap_scripts/` (which is for genuinely throwaway exploration and is gitignored). The split:

- **`utils/`** — scripts that produce build artifacts the site needs, regenerate tracked content (`comment_mod/`, `CodeDocs/`), or are used often enough to justify keeping a stable, named version under version control. Tracked.
- **`scrap_scripts/`** — one-off exploration, ad-hoc data dumps, schema spelunking. Gitignored. Per `CLAUDE.md`, named `<NN>_<slug>.<ext>`.

If a script in `scrap_scripts/` proves useful enough to keep, promote it here with a descriptive name (drop the `<NN>_` prefix), and ideally a docstring + sample command.

## Python tools

All scripts assume the working directory is the repo root unless noted; they use `Path(__file__).resolve().parents[2]` to anchor to it.

| Script | Purpose |
|---|---|
| `wiki_cache.py` | Single-page wiki fetcher. Caches pages from `ostranauts.wiki.gg` to `wiki_cache/` as both raw API JSON and extracted wikitext markdown. Idempotent. |
| `wiki_crawl.py` | Recursive crawler that follows `[[Internal Link]]` references from a seed page. Built on `wiki_cache.py`. |
| `wiki_extract_schemas.py` | Generates `comment_mod/data/schemas/*-schema.json` overlays from cached wiki pages. Deterministic; emits a review queue (`comment_mod/wiki_review_queue.md`) for ambiguous cases. |
| `decomp_loader_table.py` | Parses `DataHandler.LoadAllData` / `LoadMod` for every `LoadModJsons<Json*>(folder)` dispatch line, yielding the ground-truth (class → folder) table the game itself uses. Drives discovery for the two audit scripts below and for `generate_missing_schemas.py`; replaces the hand-curated `CLASS_TO_SCHEMA` allowlists those scripts used to carry. Also reports the unmodeled cohort (folders the loader recognises but no schema covers). |
| `generate_missing_schemas.py` | Generates `comment_mod/data/schemas/<folder>-schema.json` overlays for every parser folder in the unmodeled cohort. Field set comes from the corresponding `Json*` DTO; ref classifications are pulled from `build/data/ref_candidates.js` (the candidate detector's output). Re-runnable; rerun when new DTOs land in the decomp or the detector finds new candidates. |
| `decomp_schema_crosscheck.py` | Diffs decompiled `Json*.cs` classes (in `decomp/Assembly-CSharp/`) against our JSON schemas. Reports gaps in three buckets per matched pair: C#-only, schema-only, unmatched. |
| `decomp_schema_table.py` | Same data as the crosscheck, but rendered as a single Y/N/* markdown table per (class, schema) pair. Used to audit Slice E phases. |
| `decomp_extract_verifiables.py` | Extracts the full `GetVerifiables()` method body from every `IVerifiable` class in decomp; produced the source material for `CodeDocs/iverifiable-ref-map.md`. |
| `decomp_string_search.py` | Regex-grep for `"<key>"` quoted-literal occurrences across decomp. Catches hardcoded data-name lookups in game code (e.g. `DataHandler.GetPledge("EmbarkCommand")`). Interactive — pass keys on the command line, optional `-C N` for context. |
| `emit_code_refs.py` | **Required** for the site's "Code references" block. Scans `decomp/Assembly-CSharp/**/*.cs` for `"<strName>"` literals matching any node in `build/data/graph.js`; writes `build/data/code_refs.js`. Single regex pass per file; ~3 seconds against current decomp. |
| `coverage_strname_occurrences.py` | Audit script: for each strName, find every JSON position where it appears as a *complete* string value or dict key, then check whether the Builder emitted an edge. Filters known false-positive fields (cosmetic / enum / NOT-a-ref) via the graph's `fieldDescriptions` map. Writes a markdown report + JSON sidecar to `build/coverage/`, plus `build/data/coverage_misses.js` which the site's "Potentially missed references" panel reads. Run after every Builder run. |

## Mod tooling lives with the mod

Per-mod generators live under `spiffy-mods/util/<ModName>/` (e.g.
[spiffy-mods/util/SacksAndBuckets/](../spiffy-mods/util/SacksAndBuckets/)),
not here. They're driven by a per-mod `config.yaml` and emit JSON +
PNG artifacts into the mod's `data/` folder. See each mod's
`util/<ModName>/README.md` for invocation.

## Common usage

```bash
# Refresh the wiki cache for new modding pages
python utils/python/wiki_cache.py Modding/Items

# Crawl whole modding subtree (cap at 200 pages)
python utils/python/wiki_crawl.py --prefix Modding --max 200

# Regenerate comment_mod schemas from current cache
python utils/python/wiki_extract_schemas.py

# Audit our schemas against decomp
python utils/python/decomp_schema_table.py --out scrap_scripts/python/audit.md

# Find code-side references to a specific data name
python utils/python/decomp_string_search.py -C 3 EmbarkCommand

# Refresh the site's code-refs panel after a build
python utils/python/emit_code_refs.py

# Refresh the site's "Potentially missed references" panel + coverage report
python utils/python/coverage_strname_occurrences.py
```

## Adding a new tool

If you write something durable, drop it here with:
1. A module docstring at the top, including a `Usage:` block.
2. Default IO paths via `Path(__file__).resolve().parents[2]` so it works no matter where it's invoked from.
3. An entry in the table above.

Throwaway scripts go in `scrap_scripts/<lang>/<NN>_<slug>.<ext>` per the CLAUDE.md convention; promote them here only when they earn it.
