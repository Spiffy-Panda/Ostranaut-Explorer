"""Extract field-to-folder reference rules from cached wiki pages and
generate JSON Schema files in comment_mod/data/schemas/.

Strategy (deterministic — no LLM):
1. For each cached wiki page mapped to a known source folder, scan the
   wikitext for field documentation patterns:
     - Wikitables whose first column cells look like field names
       (typed prefixes: str, n, f, b, a, map, dict, obj).
     - Bold field references in prose ('''strFoo''') with following
       description text.
2. For each (field, description) pair, infer:
     - Shape from the field-name prefix (str/obj -> Direct, a -> StringArray).
     - Target folder by matching the description against the same regex
       set SchemaLoader uses (refers to entry in X.json, etc.) plus a
       handful of wiki-specific synonyms.
     - Promote StringArray -> CondStringArray when the description
       mentions condition equations / condition strings.
3. Emit one comment_mod/data/schemas/<folder>-schema.json per source
   folder, with x-source provenance per property.
4. Anything that looked like a field but couldn't be confidently
   resolved goes into comment_mod/wiki_review_queue.md.

Usage:
    python scrap_scripts/python/03_wiki_extract_schemas.py
"""

from __future__ import annotations

import json
import re
import sys
from collections import defaultdict
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
WIKI_MD_DIR = REPO_ROOT / "wiki_cache" / "markdown"
COMMENT_MOD_DIR = REPO_ROOT / "comment_mod" / "data" / "schemas"
REVIEW_QUEUE_PATH = REPO_ROOT / "comment_mod" / "wiki_review_queue.md"

# Page slug -> source folder. Pages not in this map are skipped (or noted).
PAGE_TO_FOLDER = {
    "Modding__CondOwners": "condowners",
    "Modding__Loot": "loot",
    "Modding__Items": "items",
    "Modding__Interactions": "interactions",
    "Modding__Pledges": "pledges",
    "Modding__Ships": "ships",
    "CondTriggers": "condtrigs",
    "Condition_Rules": "condrules",
    "Conditions": "conditions",
}

# Field names the extractor must NEVER emit as refs, even if a wiki table or
# prose sentence superficially makes them look like one. Two flavors:
#   - Enum tags dispatching to game code (strType, strKind) — per the
#     "Recurring trap" note in CLAUDE.md.
#   - Concept labels that show up in wiki tables but aren't actual JSON fields
#     (LootUnit is a class, not a property).
SKIP_FIELDS = {
    "strType",      # enum on loot/, pledges/, ...
    "strKind",      # enum, same family
    "LootUnit",     # class label in Modding/Loot tables
    "Loots",        # struct label in Modding/Loot tables
}

# Pages we're aware of but explicitly DON'T map (overview/tutorial style).
KNOWN_NON_FOLDER_PAGES = {
    "Modding", "Modding__Data_Modding", "Modding__Glossary",
    "Modding__BepInEx_Modding", "Modding__Sprites_and_Assets",
    "Modding__Source_Control", "Modding__Creating_a_Stuffed_Animal_Mod",
    "Main_Page", "Ostranauts_Wiki", "Crew", "Ship",
}

# Recognized field-name prefixes. Used both to spot field names and to infer shape.
DIRECT_PREFIXES = ("str", "obj", "Loot", "CT", "PSpec", "pledge")  # capitals OK; e.g. "LootCTsUs"
ARRAY_PREFIXES = ("a", "dict", "map")
NON_REF_PREFIXES = ("n", "f", "b")  # numeric / boolean — never a string ref

# Phrases in description that point at a target folder. Same intent as
# SchemaLoader.DescriptionPatterns but expanded with wiki synonyms.
DESCRIPTION_PATTERNS = [
    re.compile(r"\b(?:refers?|reffers?)\s+to\s+entr(?:y|ies)\s+(?:in|within)\s+(\w+)\.json", re.I),
    re.compile(r"\b(?:found|located|stored|defined)\s+in\s+(\w+)\.json", re.I),
    re.compile(r"\bfrom\s+(\w+)\.json", re.I),
    re.compile(r"\bentr(?:y|ies)\s+(?:in|from|within)\s+(\w+)\.json", re.I),
    re.compile(r"\b(\w+)\.json\s+entry", re.I),
    re.compile(r"\b(?:check|see)\s+(\w+)\.json", re.I),
    # Wiki-style: "Data/Loot/*.json" — capture "Loot" -> lowercase
    re.compile(r"`?Data/(\w+)/", re.I),
    # generic fallback
    re.compile(r"\b(?:in|within)\s+(\w+)\.json", re.I),
]

CONDSTRING_MARKERS = re.compile(
    r"\bcondition\s+(?:string|equation|equations|strings)\b", re.I)

# Wiki-natural phrasings: "Array of ConditionTriggers", "Name of CondOwner",
# "List of Loots", etc. Map the captured term to a folder name.
WIKI_TERM_TO_FOLDER = {
    "condition": "conditions",
    "conditions": "conditions",
    "conditiontrigger": "condtrigs",
    "conditiontriggers": "condtrigs",
    "condtrig": "condtrigs",
    "condtrigs": "condtrigs",
    "condrule": "condrules",
    "condrules": "condrules",
    "loot": "loot",
    "loots": "loot",
    "lootunit": "loot",
    "condowner": "condowners",
    "condowners": "condowners",
    "co": "condowners",
    "cos": "condowners",
    "item": "items",
    "items": "items",
    "interaction": "interactions",
    "interactions": "interactions",
    "ledgerdef": "ledgerdefs",
    "ledgerdefs": "ledgerdefs",
    "pledge": "pledges",
    "pledges": "pledges",
    "ticker": "tickers",
    "tickers": "tickers",
    "personspec": "personspecs",
    "personspecs": "personspecs",
    "ship": "ships",
    "ships": "ships",
    "shipspec": "shipspecs",
    "shipspecs": "shipspecs",
    "room": "rooms",
    "rooms": "rooms",
    "slot": "slots",
    "slots": "slots",
    "color": "colors",
    "colors": "colors",
    "light": "lights",
    "lights": "lights",
    "audioemitter": "audioemitters",
    "audioemitters": "audioemitters",
    "trait": "traitscores",
    "traits": "traitscores",
    "lifeevent": "lifeevents",
    "lifeevents": "lifeevents",
}

# "Array of CondTriggers", "List of Conditions", "an Item", "name of pledge", etc.
WIKI_TERM_PATTERN = re.compile(
    r"\b(?:array|list|name|names|each|the|a|an|of)\s+(?:of\s+)?([A-Za-z]+)\b", re.I)


def looks_like_field(name: str) -> bool:
    """Heuristic: is this a Hungarian-notation field name?
    Requires: prefix (str/a/n/f/b/obj/Loot/CT/PSpec/dict/map/pledge) immediately
    followed by an uppercase letter. So `strFoo` matches but `string` doesn't;
    `LootCTsUs` matches but `Loot` (the bare table label) doesn't."""
    if not name or " " in name or len(name) < 3:
        return False
    if name in SKIP_FIELDS:
        return False
    # Try each prefix; the character right after must be uppercase.
    all_prefixes = DIRECT_PREFIXES + ARRAY_PREFIXES + NON_REF_PREFIXES
    for prefix in all_prefixes:
        if name.startswith(prefix) and len(name) > len(prefix):
            next_char = name[len(prefix)]
            if next_char.isupper():
                return True
    return False


def infer_shape(field: str, description: str) -> str | None:
    """Returns 'string', 'array', or None if not a string-ref carrier."""
    if field.startswith(NON_REF_PREFIXES) and not field.startswith(("nName",)):
        # Treat n/f/b as non-refs — but be careful, some wiki names just
        # happen to start with those letters. Defensive: also require the
        # next char is uppercase to look like a real prefix usage.
        if len(field) > 1 and field[1].isupper():
            return None
    if field.startswith(ARRAY_PREFIXES):
        return "array"
    return "string"


def extract_target(description: str) -> str | None:
    """First tries the .json-anchored patterns (high confidence), then falls
    back to wiki-natural phrasings ("Array of CondTriggers") via the term map."""
    for pat in DESCRIPTION_PATTERNS:
        m = pat.search(description)
        if m:
            target = m.group(1).strip().lower()
            if target in {"json", "data", "the", "a", "an"}:
                continue
            return target
    # Fallback: scan for "X of Y" patterns where Y is a known wiki term.
    for m in WIKI_TERM_PATTERN.finditer(description):
        candidate = m.group(1).lower()
        if candidate in WIKI_TERM_TO_FOLDER:
            return WIKI_TERM_TO_FOLDER[candidate]
    return None


def is_cond_string_field(description: str) -> bool:
    return bool(CONDSTRING_MARKERS.search(description))


# Match the start of a wikitable: {| ... |}
WIKITABLE_RE = re.compile(r"\{\|[^\n]*\n(.*?)\n\|\}", re.S)
ROW_SEP_RE = re.compile(r"^\|-", re.M)


def parse_wikitable_rows(table_body: str) -> list[list[str]]:
    """Yields rows of cells. A cell can span multiple lines; cells inside one
    row are separated by `||` on the same line OR by `|` at the start of a
    new line (multi-line row syntax)."""
    rows = []
    blocks = ROW_SEP_RE.split(table_body)
    for block in blocks:
        cells: list[str] = []
        for ln in block.strip().splitlines():
            if not ln:
                continue
            if ln.startswith("|+") or ln.startswith("!"):
                continue  # caption or header row
            # Strip ALL leading | chars (handles |, ||, sometimes more).
            stripped = re.sub(r"^\|+\s*", "", ln)
            # Then split on internal `||` (cells on same line).
            for cell in re.split(r"\|\|", stripped):
                cells.append(cell.strip())
        if cells:
            rows.append(cells)
    return rows


# Strip MediaWiki bold/italic + link wrappers + code styling for clean comparisons.
def detag(s: str) -> str:
    s = re.sub(r"'''(.+?)'''", r"\1", s)            # bold
    s = re.sub(r"''(.+?)''", r"\1", s)              # italic
    s = re.sub(r"\[\[([^|\]]+)\|([^\]]+)\]\]", r"\2", s)  # [[x|y]] -> y
    s = re.sub(r"\[\[([^\]]+)\]\]", r"\1", s)              # [[x]] -> x
    s = re.sub(r"\{\{c\|([^\}]+)\}\}", r"\1", s)    # {{c|...}} -> ...
    s = re.sub(r"`([^`]+)`", r"\1", s)              # `x` -> x
    s = re.sub(r"<[^>]+>", "", s)                   # strip html tags
    return s.strip()


def field_candidates_from_table(rows: list[list[str]]) -> list[tuple[str, str]]:
    """Look for rows whose first cell is a field-name-shaped token. Returns
    [(field_name, description)] tuples — description is the rest of the row joined."""
    out = []
    for row in rows:
        if not row:
            continue
        head = detag(row[0])
        # Sometimes the field name is wrapped in extra punctuation — strip common ones.
        head = head.strip(" -*`")
        if not looks_like_field(head):
            continue
        rest = " ".join(detag(c) for c in row[1:]).strip()
        if rest:
            out.append((head, rest))
    return out


def field_candidates_from_prose(text: str) -> list[tuple[str, str]]:
    """Look for '''fieldName''' in prose followed by descriptive text on the
    same line (up to ~200 chars). Lower-confidence than table-derived.
    Skips lines starting with `|` or `!` (table syntax) since those are
    handled by parse_wikitable_rows and the prose pattern would otherwise
    swallow `||` separators into the description."""
    out = []
    for m in re.finditer(r"'''([A-Za-z][A-Za-z0-9_]+)'''[\s:\-–—]*(.+?)(?=\n|$)", text):
        # Find the start of this line in the source — skip if it's table syntax.
        line_start = text.rfind("\n", 0, m.start()) + 1
        line_first_char = text[line_start:line_start + 1]
        if line_first_char in ("|", "!"):
            continue
        name, desc = m.group(1), detag(m.group(2)).strip()
        if not looks_like_field(name) or not desc:
            continue
        out.append((name, desc))
    return out


def build_property(field: str, description: str, page_url: str) -> tuple[dict, str | None] | None:
    """Returns (json_schema_property, target_folder) or None if no rule
    can be derived. The property dict is what we emit into the schema file."""
    target = extract_target(description)
    shape = infer_shape(field, description)
    if shape is None:
        return None

    type_keyword = "array" if shape == "array" else "string"

    # Construct a description that matches the SchemaLoader regex set.
    # If a target was found, include "refers to entry within X.json" so the
    # main loader's rules engine derives a rule from this property cleanly.
    parts: list[str] = []
    if description:
        parts.append(description.rstrip(".") + ".")
    if is_cond_string_field(description):
        parts.append("Array of condition strings (Name=value*duration).")
    if target:
        parts.append(f"Refers to entry within {target}.json.")

    prop: dict = {
        "type": type_keyword,
        "description": " ".join(parts),
        "x-source": page_url,
    }
    return prop, target


def parse_page(page_path: Path, source_folder: str) -> tuple[dict[str, dict], list[tuple[str, str, str]]]:
    """Returns (props_by_field, review_items). Props_by_field is what we'll
    write into the schema file; review_items is [(field, description, why)]
    for the review queue."""
    text = page_path.read_text(encoding="utf-8")
    # Strip our YAML frontmatter
    if text.startswith("---\n"):
        text = text.split("---\n\n", 1)[-1]
    # Find the page URL from frontmatter
    url_match = re.search(r"source_url:\s*(\S+)", page_path.read_text(encoding="utf-8"))
    page_url = url_match.group(1) if url_match else ""

    candidates: list[tuple[str, str]] = []
    for table_match in WIKITABLE_RE.finditer(text):
        candidates.extend(field_candidates_from_table(parse_wikitable_rows(table_match.group(1))))
    candidates.extend(field_candidates_from_prose(text))

    # Dedupe — last description wins (later mentions tend to be richer).
    by_field: dict[str, str] = {}
    for f, d in candidates:
        # Prose pattern can pick up false positives (bold non-field words).
        # Prefer the longest description seen for each field.
        if f not in by_field or len(d) > len(by_field[f]):
            by_field[f] = d

    props: dict[str, dict] = {}
    review: list[tuple[str, str, str]] = []
    for field, desc in by_field.items():
        result = build_property(field, desc, f"{page_url}#{field}" if page_url else "")
        if result is None:
            review.append((field, desc, "non-string-shaped field"))
            continue
        prop, target = result
        if target is None:
            review.append((field, desc, "no .json target found in description"))
            continue
        props[field] = prop
    return props, review


def merge_schema(folder: str, props: dict[str, dict]) -> dict:
    """Returns a JSON Schema dict ready to write — merges with any existing
    schema in comment_mod/data/schemas/<folder>-schema.json, with the
    new wiki-derived properties overlaying existing ones."""
    schema_path = COMMENT_MOD_DIR / f"{folder}-schema.json"
    if schema_path.exists():
        existing = json.loads(schema_path.read_text(encoding="utf-8"))
    else:
        existing = {
            "$schema": "http://json-schema.org/draft-07/schema",
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": True,
                "properties": {},
            },
        }
    existing_props = existing["items"].setdefault("properties", {})
    for field, prop in props.items():
        existing_props[field] = prop  # wiki-derived overrides
    return existing


def main() -> int:
    if not WIKI_MD_DIR.exists():
        print(f"no wiki cache at {WIKI_MD_DIR} — run 02_wiki_crawl.py first", file=sys.stderr)
        return 1

    COMMENT_MOD_DIR.mkdir(parents=True, exist_ok=True)

    # source_folder -> {field: prop}
    by_folder: dict[str, dict[str, dict]] = defaultdict(dict)
    review: list[tuple[str, str, str, str]] = []  # (page, field, desc, why)
    seen_pages: set[str] = set()

    for md_path in sorted(WIKI_MD_DIR.glob("*.md")):
        slug = md_path.stem
        seen_pages.add(slug)
        if slug in KNOWN_NON_FOLDER_PAGES:
            continue
        if slug not in PAGE_TO_FOLDER:
            review.append((slug, "(whole page)", "—", "page not mapped to a source folder; add to PAGE_TO_FOLDER if relevant"))
            continue
        folder = PAGE_TO_FOLDER[slug]
        props, page_review = parse_page(md_path, folder)
        by_folder[folder].update(props)
        for f, d, why in page_review:
            review.append((slug, f, d, why))

    written: list[Path] = []
    for folder, props in sorted(by_folder.items()):
        if not props:
            continue
        schema = merge_schema(folder, props)
        out_path = COMMENT_MOD_DIR / f"{folder}-schema.json"
        out_path.write_text(json.dumps(schema, indent=4, ensure_ascii=False) + "\n", encoding="utf-8")
        written.append(out_path)
        print(f"wrote {out_path.relative_to(REPO_ROOT)}  ({len(props)} fields)")

    # Review queue
    REVIEW_QUEUE_PATH.parent.mkdir(parents=True, exist_ok=True)
    with REVIEW_QUEUE_PATH.open("w", encoding="utf-8") as f:
        f.write("# Wiki review queue\n\n")
        f.write("Items the deterministic extractor (`scrap_scripts/python/03_wiki_extract_schemas.py`)\n")
        f.write("couldn't confidently resolve. Review in batches; check the box once handled\n")
        f.write("(either by adding to `PAGE_TO_FOLDER`, editing the wiki page, or hand-curating\n")
        f.write("the affected schema file).\n\n")
        by_page: dict[str, list[tuple[str, str, str]]] = defaultdict(list)
        for page, field, desc, why in review:
            by_page[page].append((field, desc, why))
        for page in sorted(by_page):
            f.write(f"## {page}\n\n")
            for field, desc, why in by_page[page]:
                desc_short = (desc[:120] + "…") if len(desc) > 120 else desc
                f.write(f"- [ ] **{field}** — {why}\n")
                if desc != "—":
                    f.write(f"  > {desc_short}\n")
            f.write("\n")

    print()
    print(f"review queue: {REVIEW_QUEUE_PATH.relative_to(REPO_ROOT)} ({len(review)} entries)")
    print(f"schemas written: {len(written)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
