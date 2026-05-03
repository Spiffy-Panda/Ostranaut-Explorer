"""
06_decomp_schema_crosscheck.py

Diffs decompiled C# Json*.cs classes against our JSON schemas.

For each class that maps to a known schema folder, reports:
  MISSING  — field in C# but absent from schema (coverage gap)
  GHOST    — field in schema but absent from C# (may be wrong/stale)

Also lists unmatched classes and unmatched schemas at the end.

Usage:
    python ./scrap_scripts/python/06_decomp_schema_crosscheck.py [--verbose]
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

# Maps C# class name → schema base name (without -schema.json).
# Add entries here as new schemas are written.
CLASS_TO_SCHEMA = {
    "JsonCond":        "conditions",
    "JsonCondOwner":   "condowners",
    "JsonCondTrigger": "condtrigs",
    "JsonCrime":       "crime",
    "JsonHomeworld":   "homeworlds",
    "JsonInteraction": "interactions",
    "JsonItemDef":     "items",
    "JsonJob":         "jobs",
    "JsonLoot":        "loot",
    "JsonPersonSpec":  "personspecs",
    "JsonPledge":      "pledges",
    "JsonPlot":        "plot",
}

PROP_RE = re.compile(
    r"public\s+\S+\s+(\w+)\s*\{\s*get\s*;\s*set\s*;\s*\}"
)


def parse_cs_props(path: Path) -> list[str]:
    text = path.read_text(encoding="utf-8-sig")
    return PROP_RE.findall(text)


def load_merged_schema(base_name: str) -> dict | None:
    """Load schema properties, with comment_mod overlaying base."""
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


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--verbose", action="store_true",
                        help="Show full field lists, not just counts")
    args = parser.parse_args()

    matched_classes = set()
    matched_schemas = set(CLASS_TO_SCHEMA.values())

    print("=" * 70)
    print("DECOMP -> SCHEMA CROSS-CHECK")
    print("=" * 70)

    any_diff = False
    for class_name, schema_name in sorted(CLASS_TO_SCHEMA.items()):
        cs_path = DECOMP_DIR / f"{class_name}.cs"
        if not cs_path.exists():
            print(f"\n[WARN] No decomp file for {class_name} (expected {cs_path.name})")
            continue

        cs_props = set(parse_cs_props(cs_path))
        schema_props_dict = load_merged_schema(schema_name)

        if schema_props_dict is None:
            print(f"\n[WARN] No schema found for '{schema_name}' (class {class_name})")
            continue

        schema_props = set(schema_props_dict.keys())
        matched_classes.add(class_name)

        missing = sorted(cs_props - schema_props)   # in C# but not schema
        ghost   = sorted(schema_props - cs_props)   # in schema but not C#

        if not missing and not ghost:
            print(f"\n  {class_name} -> {schema_name}-schema.json  [OK]")
            continue

        any_diff = True
        print(f"\n  {class_name} -> {schema_name}-schema.json")
        if missing:
            print(f"    MISSING from schema ({len(missing)}): ", end="")
            if args.verbose or len(missing) <= 6:
                print(", ".join(missing))
            else:
                print(", ".join(missing[:6]) + f"  … +{len(missing)-6} more")
        if ghost:
            print(f"    GHOST in schema ({len(ghost)}):   ", end="")
            if args.verbose or len(ghost) <= 6:
                print(", ".join(ghost))
            else:
                print(", ".join(ghost[:6]) + f"  … +{len(ghost)-6} more")

    # Unmatched decomp classes
    all_cs = {p.stem for p in DECOMP_DIR.glob("Json*.cs")}
    unmatched_classes = sorted(all_cs - set(CLASS_TO_SCHEMA.keys()))

    # Unmatched schemas
    all_schema_names: set[str] = set()
    for sd in SCHEMA_DIRS:
        for p in sd.glob("*-schema.json"):
            all_schema_names.add(p.stem.replace("-schema", ""))
    unmatched_schemas = sorted(all_schema_names - matched_schemas)

    print("\n" + "=" * 70)
    if not any_diff:
        print("All matched pairs: fully covered.")
    print(f"\nUnmatched classes ({len(unmatched_classes)} of {len(all_cs)} total Json* classes):")
    for c in unmatched_classes:
        print(f"  {c}")
    print(f"\nUnmatched schemas ({len(unmatched_schemas)}):")
    for s in unmatched_schemas:
        print(f"  {s}-schema.json")
    print()


if __name__ == "__main__":
    main()
