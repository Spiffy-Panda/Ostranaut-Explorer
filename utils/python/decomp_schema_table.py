"""decomp_schema_table.py

Produces a single markdown table with columns: name | type | schema
  Y  = field exists in the merged schema
  N  = field exists in C# but is absent from the schema
  *  = field exists in the schema but has no matching C# property (ghost)

One full-width "header" row per class/schema pair separates groups.

The (class → folder) mapping is derived from DataHandler.LoadAllData /
LoadMod via decomp_loader_table.py — every Json* DTO the game actually
loads gets a row, including ones we haven't written schemas for yet
(those rows show every C# field marked "N").

Usage:
    python ./utils/python/decomp_schema_table.py [--out FILE]

By default prints to stdout. Pass --out to write to a file instead.
"""

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DECOMP_DIR = ROOT / "decomp" / "Assembly-CSharp"
SCHEMA_DIRS = [
    ROOT / "data" / "schemas",
    ROOT / "comment_mod" / "data" / "schemas",
]

# Loader-derived (class → schema-folder-key) table. See decomp_loader_table.py
# for the parsing logic. Replaces the previous hand-curated allowlist.
sys.path.insert(0, str(Path(__file__).resolve().parent))
from decomp_loader_table import parse_loader_dispatches  # noqa: E402


def _build_class_to_schema() -> dict[str, str]:
    out: dict[str, str] = {}
    for entry in parse_loader_dispatches():
        if entry.is_simple:
            continue  # JsonSimple covers many string-table folders; skip
        out.setdefault(entry.cls, entry.folder_key)
    return out


CLASS_TO_SCHEMA = _build_class_to_schema()

PROP_RE = re.compile(
    r"public\s+(\S+)\s+(\w+)\s*\{\s*get\s*;\s*set\s*;\s*\}"
)


def parse_cs_props(path: Path) -> list[tuple[str, str]]:
    """Return list of (name, type) for all public auto-properties."""
    text = path.read_text(encoding="utf-8-sig")
    return [(name, typ) for typ, name in PROP_RE.findall(text)]


def load_merged_schema(base_name: str) -> dict | None:
    filename = f"{base_name}-schema.json"
    merged: dict | None = None
    for schema_dir in SCHEMA_DIRS:
        p = schema_dir / filename
        if p.exists():
            data = json.loads(p.read_text(encoding="utf-8"))
            props = data.get("items", {}).get("properties", {})
            if merged is None:
                merged = dict(props)
            else:
                merged.update(props)
    return merged


def md_row(*cells: str) -> str:
    return "| " + " | ".join(cells) + " |"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", metavar="FILE",
                        help="Write output to FILE instead of stdout")
    args = parser.parse_args()

    out = open(args.out, "w", encoding="utf-8") if args.out else sys.stdout

    # Table header
    print(md_row("name", "type", "schema"), file=out)
    print(md_row("---", "---", "---"), file=out)

    for class_name, schema_name in sorted(CLASS_TO_SCHEMA.items()):
        cs_path = DECOMP_DIR / f"{class_name}.cs"
        if not cs_path.exists():
            print(md_row(f"**{class_name}** _(no decomp file)_", "", ""), file=out)
            continue

        cs_props = parse_cs_props(cs_path)           # [(name, type), ...]
        cs_prop_map = {name: typ for name, typ in cs_props}
        schema_dict = load_merged_schema(schema_name) or {}
        schema_keys = set(schema_dict.keys())

        label = f"**{class_name}** -> `{schema_name}-schema.json`"
        print(md_row(label, "", ""), file=out)

        # C# props first (preserving declaration order)
        for name, typ in cs_props:
            flag = "Y" if name in schema_keys else "N"
            print(md_row(name, typ, flag), file=out)

        # Schema-only ghosts
        cs_names = set(cs_prop_map.keys())
        for ghost in sorted(schema_keys - cs_names):
            print(md_row(ghost, "_(schema only)_", "*"), file=out)

    if args.out:
        out.close()
        print(f"Written to {args.out}")


if __name__ == "__main__":
    main()
