"""coverage_strname_occurrences.py

For every strName in the graph, find every JSON file where that name
appears as a *complete* string value (not a substring of a condition
string, loot weight, etc.), then check whether the Builder emitted an
edge for that occurrence. Anything unaccounted-and-not-flagged-as-false-
positive is a "potentially missed reference" — a place where a modder's
ctrl-F would have caught a connection the explorer doesn't surface.

Out of scope by design (separate audit pass needed):
  - Condition strings ("IsSystem=1.0x1") and loot weights ("Foo=0.5 x 1-3").
  - Substring matches against free text ("Sink Up The Plumbing").

Outputs:
  build/coverage/strname_occurrences.md   — human-readable report
  build/coverage/strname_occurrences.json — machine-readable summary
  build/data/coverage_misses.js           — sidecar the site loads;
                                            window.COVERAGE_MISSES is keyed
                                            by source_id and contains only
                                            UNACCOUNTED, NON-FALSE-POSITIVE
                                            tuples — the "your ctrl-F would
                                            have hit this" panel.

False-positive filter:
  - Field's description in graph.js field_descriptions contains
    "NOT a strName reference" (parser was told this isn't a ref).
  - Field's description contains "Enum tag dispatching to game code"
    (known enum, per Comment Mod overlay convention).
  - Field name is in COSMETIC_FIELDS (display text / asset paths /
    color names that happen to coincide with a strName).

Usage:
    python ./utils/python/coverage_strname_occurrences.py
    python ./utils/python/coverage_strname_occurrences.py --top 20
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_GRAPH = REPO_ROOT / "build" / "data" / "graph.js"
DEFAULT_OUT_MD = REPO_ROOT / "build" / "coverage" / "strname_occurrences.md"
DEFAULT_OUT_JSON = REPO_ROOT / "build" / "coverage" / "strname_occurrences.json"
DEFAULT_OUT_JS = REPO_ROOT / "build" / "data" / "coverage_misses.js"

DATA_ROOTS = [
    REPO_ROOT / "data",
    REPO_ROOT / "comment_mod" / "data",
]
SKIP_FOLDERS = {"schemas", "glossary"}

PLACEHOLDER = re.compile(r"^\[\w+\]$")

# Fields that are *display text*, *asset paths*, or *color literals* — values
# may happen to spell a strName but aren't refs. Excluded from the misses
# panel (still tallied in the report so we can sanity-check the list).
COSMETIC_FIELDS = frozenset({
    "strColor",          # CSS-style color or color name
    "strNameFriendly",   # display name shown in UI
    "strNameShort",      # short display name
    "strFriendlyName",   # alternative display name
    "strDesc",           # description prose
    "strBody",           # tip body, etc.
    "strImg",            # sprite / asset path
    "strPortraitImg",    # portrait asset path
    "strRaiseUI",        # UI dispatch tag (handled by code, not data lookup)
    "strType",           # known enum (per CLAUDE.md)
    "strCategory",       # enum
    "strNameID",         # display name id
    "strNameLong",       # long display name
    "aValues",           # strings/aValues is interleaved key/value text
})

# Description fragments that mark a field as definitely-not-a-ref.
NOT_A_REF_HINTS = (
    "NOT a strName reference",
    "Enum tag dispatching to game code",
)


def load_graph(graph_path: Path) -> dict:
    text = graph_path.read_text(encoding="utf-8")
    prefix = "window.GRAPH_DATA = "
    if not text.startswith(prefix):
        raise ValueError(f"{graph_path} doesn't start with {prefix!r}")
    payload = text[len(prefix):]
    if payload.endswith(";\n"):
        payload = payload[:-2]
    elif payload.endswith(";"):
        payload = payload[:-1]
    return json.loads(payload)


def index_data_files() -> list[Path]:
    files: list[Path] = []
    for root in DATA_ROOTS:
        if not root.exists():
            continue
        for folder_dir in sorted(root.iterdir()):
            if not folder_dir.is_dir():
                continue
            if folder_dir.name in SKIP_FOLDERS:
                continue
            for jf in sorted(folder_dir.glob("*.json")):
                files.append(jf)
    return files


def walk_object(obj, parent_field: str | None, on_string):
    """Recursively visit every leaf string in `obj`, calling on_string with
    the SCHEMA-LEVEL field name (not the inner JSON-pointer step).

    Ostranauts convention: dict-typed values whose name starts with `map` or
    `dict` are data-keyed maps — their inner keys are themselves strName refs
    (e.g. mapCondTolerance: { Hunger: 0.5 }), and the parser tags any edge
    out of them with the OUTER field name as sourceField. So we emit both
    inner keys and inner values under that outer field. Other dict-typed
    values are sub-objects whose inner keys are real schema fields (Loot →
    aCOs / aLoots / …), and we recurse normally."""
    if isinstance(obj, dict):
        for k, v in obj.items():
            if isinstance(v, str):
                on_string(v, k, role="value")
            elif isinstance(v, list):
                walk_object(v, k, on_string)
            elif isinstance(v, dict):
                if k.startswith("map") or k.startswith("dict"):
                    # Data-keyed map: keys are strName refs; values get the
                    # outer map-field name as their leaf field too.
                    for inner_k, inner_v in v.items():
                        on_string(inner_k, k, role="key")
                        if isinstance(inner_v, str):
                            on_string(inner_v, k, role="value")
                        elif isinstance(inner_v, (list, dict)):
                            walk_object(inner_v, k, on_string)
                else:
                    walk_object(v, k, on_string)
    elif isinstance(obj, list):
        for item in obj:
            if isinstance(item, str):
                if parent_field is not None:
                    on_string(item, parent_field, role="value")
            elif isinstance(item, (list, dict)):
                walk_object(item, parent_field, on_string)


def is_false_positive(folder: str, field: str, field_descriptions: dict) -> bool:
    if field in COSMETIC_FIELDS:
        return True
    desc = field_descriptions.get(f"{folder}:{field}", "")
    return any(hint in desc for hint in NOT_A_REF_HINTS)


def main() -> int:
    ap = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    ap.add_argument("--graph", default=str(DEFAULT_GRAPH))
    ap.add_argument("--out-md", default=str(DEFAULT_OUT_MD))
    ap.add_argument("--out-json", default=str(DEFAULT_OUT_JSON))
    ap.add_argument("--out-js", default=str(DEFAULT_OUT_JS),
                    help="sidecar JS for the site's missed-references panel")
    ap.add_argument("--top", type=int, default=30)
    ap.add_argument("--samples", type=int, default=5)
    args = ap.parse_args()

    graph_path = Path(args.graph)
    if not graph_path.exists():
        print(f"graph.js not found at {graph_path}", file=sys.stderr)
        return 1

    graph = load_graph(graph_path)

    name_universe: set[str] = set()
    for n in graph.get("nodes", []):
        sn = n.get("strName")
        if sn is not None:
            name_universe.add(sn)

    target_name_by_id: dict[str, str] = {
        f"{n['folder']}:{n.get('strName')}": n.get("strName", "")
        for n in graph.get("nodes", [])
        if n.get("strName") is not None
    }
    accounted: set[tuple[str, str, str]] = set()
    for e in graph.get("edges", []):
        tgt_name = target_name_by_id.get(e["target"])
        if tgt_name is None:
            continue
        sf = e.get("sourceField", "")
        accounted.add((e["source"], sf, tgt_name))

    # Builder emits a top-level "fieldDescriptions" map keyed by "<folder>:<field>".
    field_descriptions = graph.get("fieldDescriptions", {})
    if not isinstance(field_descriptions, dict):
        field_descriptions = {}

    print(
        f"loaded {len(name_universe):,} strNames, "
        f"{len(graph.get('edges', [])):,} edges -> "
        f"{len(accounted):,} unique (src,field,tgt) accounted tuples; "
        f"{len(field_descriptions):,} field descriptions"
    )

    files = index_data_files()
    print(f"walking {len(files):,} JSON files under data/ + comment_mod/data/...")

    tuples: dict[tuple[str, str, str], dict] = {}
    raw_positions = 0

    for jf in files:
        rel = jf.relative_to(REPO_ROOT).as_posix()
        folder = jf.parent.name
        try:
            with jf.open("r", encoding="utf-8-sig") as f:
                data = json.load(f)
        except (OSError, json.JSONDecodeError) as ex:
            print(f"  skip {rel}: {ex}", file=sys.stderr)
            continue
        if not isinstance(data, list):
            data = [data] if isinstance(data, dict) else []

        for entry in data:
            if not isinstance(entry, dict):
                continue
            src_name = entry.get("strName")
            if not isinstance(src_name, str):
                continue
            source_id = f"{folder}:{src_name}"

            def visit(value: str, leaf_field: str, role: str,
                      _src=source_id, _file=rel, _folder=folder):
                nonlocal raw_positions
                if leaf_field == "strName":
                    return
                if value not in name_universe:
                    return
                if PLACEHOLDER.match(value):
                    return
                raw_positions += 1
                key = (_src, leaf_field, value)
                if key not in tuples:
                    tuples[key] = {
                        "folder": _folder,
                        "file": _file,
                        "role": role,
                        "positions": 1,
                        "accounted": key in accounted,
                    }
                else:
                    tuples[key]["positions"] += 1

            walk_object(entry, None, visit)

    total = len(tuples)
    n_acc = sum(1 for t in tuples.values() if t["accounted"])
    n_un = total - n_acc
    n_fp = sum(
        1 for (src, field, _val), t in tuples.items()
        if not t["accounted"] and is_false_positive(t["folder"], field, field_descriptions)
    )
    n_real_misses = n_un - n_fp
    print(
        f"\ndistinct (src,field,tgt) tuples: {total:,} total, "
        f"{n_acc:,} accounted ({100*n_acc/total if total else 0:.1f}%), "
        f"{n_un:,} unaccounted "
        f"({n_fp:,} filtered as false positive, {n_real_misses:,} real misses)"
    )
    print(f"raw positions (with duplicates): {raw_positions:,}")

    # Group by (folder, field).
    grouped: dict[tuple[str, str], dict] = defaultdict(
        lambda: {"acc": 0, "un": 0, "un_pos": 0, "fp": False, "samples": []}
    )
    for (src, field, value), t in tuples.items():
        g = grouped[(t["folder"], field)]
        if t["accounted"]:
            g["acc"] += 1
        else:
            g["un"] += 1
            g["un_pos"] += t["positions"]
            if len(g["samples"]) < args.samples:
                g["samples"].append({
                    "source_id": src, "value": value,
                    "file": t["file"], "role": t["role"], "positions": t["positions"],
                })
    for (folder, field), g in grouped.items():
        g["fp"] = is_false_positive(folder, field, field_descriptions)

    ranked = sorted(
        grouped.items(),
        key=lambda kv: (kv[1]["fp"], -kv[1]["un"], -kv[1]["acc"], kv[0]),
    )

    # Markdown report.
    out_md = Path(args.out_md)
    out_md.parent.mkdir(parents=True, exist_ok=True)
    lines: list[str] = []
    lines.append("# strName occurrence coverage (v1: full-string only)\n\n")
    lines.append(
        f"- Universe: **{len(name_universe):,}** strNames "
        f"({len(graph.get('nodes', [])):,} graph nodes)\n"
    )
    lines.append(
        f"- Edges in graph: **{len(graph.get('edges', [])):,}** "
        f"({len(accounted):,} unique (src,field,tgt) tuples)\n"
    )
    lines.append(f"- JSON files walked: **{len(files):,}**\n")
    lines.append(
        f"- Distinct tuples found: **{total:,}** "
        f"(**{n_acc:,}** accounted = {100*n_acc/total if total else 0:.1f}%, "
        f"**{n_un:,}** unaccounted)\n"
    )
    lines.append(
        f"- Of unaccounted: **{n_fp:,}** filtered as false positive "
        f"(cosmetic / known-enum), **{n_real_misses:,}** real misses\n"
    )
    lines.append(
        f"- Raw JSON positions: **{raw_positions:,}** "
        f"(positions/tuple = {raw_positions/total if total else 0:.1f})\n\n"
    )
    lines.append(
        "**Scope.** v1 matches strNames only as *complete* JSON string values "
        "(or dict keys). Substrings inside condition strings (`IsSystem=1.0x1`) "
        "and loot weights (`Foo=0.5 x 1-3`) are out of scope.\n\n"
        "**False-positive filter.** A field is excluded from the misses panel "
        "if (a) its name is in COSMETIC_FIELDS (display text / asset paths / "
        "color names) or (b) its description in graph.js says \"NOT a strName "
        "reference\" or \"Enum tag dispatching to game code\". The report still "
        "lists those rows, marked with `[fp]`, so the filter itself is auditable.\n\n"
        "**Coverage unit.** One edge covers all positions of the same "
        "(source, field, target) tuple, so coverage is counted by tuple. "
        "Position multipliers shown for context.\n\n"
    )
    lines.append("## Top groups by unaccounted tuple count\n\n")
    lines.append("| folder | field | unacc | acc | unacc positions | classification |\n")
    lines.append("|---|---|---:|---:|---:|---|\n")
    for (folder, field), g in ranked[: args.top]:
        tag = "[fp]" if g["fp"] else "[miss]"
        lines.append(
            f"| `{folder}` | `{field}` | {g['un']} | {g['acc']} | {g['un_pos']} | {tag} |\n"
        )
    lines.append("\n## Detail (top groups)\n\n")
    for (folder, field), g in ranked[: args.top]:
        if g["un"] == 0:
            continue
        tag = "false positive" if g["fp"] else "real miss"
        lines.append(
            f"### `{folder}` · `{field}` — {g['un']} unaccounted "
            f"({g['un_pos']} positions) — {tag}\n\n"
        )
        for s in g["samples"]:
            mult = f" ×{s['positions']}" if s["positions"] > 1 else ""
            lines.append(
                f"- `{s['source_id']}` -> `{s['value']}`{mult} "
                f"(role: {s['role']}, in {s['file']})\n"
            )
        lines.append("\n")

    out_md.write_text("".join(lines), encoding="utf-8")
    print(f"wrote {out_md.relative_to(REPO_ROOT)} ({out_md.stat().st_size/1024:.1f} KB)")

    # JSON sidecar (full per-group summary).
    out_json = Path(args.out_json)
    out_json.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "universe_size": len(name_universe),
        "edges_total": len(graph.get("edges", [])),
        "accounted_tuples_in_graph": len(accounted),
        "files_walked": len(files),
        "tuples_total": total,
        "tuples_accounted": n_acc,
        "tuples_unaccounted": n_un,
        "tuples_false_positive": n_fp,
        "tuples_real_misses": n_real_misses,
        "raw_positions": raw_positions,
        "groups": [
            {
                "folder": folder, "field": field,
                "accounted_tuples": g["acc"],
                "unaccounted_tuples": g["un"],
                "unaccounted_positions": g["un_pos"],
                "is_false_positive": g["fp"],
            }
            for (folder, field), g in ranked
        ],
    }
    with out_json.open("w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
    print(f"wrote {out_json.relative_to(REPO_ROOT)} ({out_json.stat().st_size/1024:.1f} KB)")

    # JS sidecar — per-source list of real misses for the site panel.
    misses_by_source: dict[str, list[dict]] = defaultdict(list)
    for (src, field, value), t in tuples.items():
        if t["accounted"]:
            continue
        if is_false_positive(t["folder"], field, field_descriptions):
            continue
        misses_by_source[src].append({
            "field": field,
            "value": value,
            "positions": t["positions"],
            "role": t["role"],
        })
    # Stable ordering inside each source.
    for src in misses_by_source:
        misses_by_source[src].sort(key=lambda m: (m["field"], m["value"]))

    out_js = Path(args.out_js)
    out_js.parent.mkdir(parents=True, exist_ok=True)
    with out_js.open("w", encoding="utf-8") as f:
        f.write("window.COVERAGE_MISSES = ")
        ordered = {src: misses_by_source[src] for src in sorted(misses_by_source)}
        json.dump(ordered, f, indent=2, ensure_ascii=False)
        f.write(";\n")
    print(
        f"wrote {out_js.relative_to(REPO_ROOT)} "
        f"({out_js.stat().st_size/1024:.1f} KB; "
        f"{len(misses_by_source):,} source objects with at least one real miss)"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
