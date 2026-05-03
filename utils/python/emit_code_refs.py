"""10_emit_code_refs.py

Scans decomp/Assembly-CSharp/ for hardcoded `"<strName>"` quoted-literal
references to any data name in the current graph.js, then writes a
JS-wrapped JSON payload at build/data/code_refs.js for the site to load.

The site renders the hits per-object on the detail page so modders can
see "this data name is referenced from game code at AIShipManager.cs:1007"
even though the schema-driven extractor can't see those refs.

Usage:
    python ./scrap_scripts/python/10_emit_code_refs.py
    python ./scrap_scripts/python/10_emit_code_refs.py --graph build/data/graph.js --out build/data/code_refs.js

Default IO:
    in:  build/data/graph.js
    in:  decomp/Assembly-CSharp/**.cs
    out: build/data/code_refs.js  (window.CODE_REFS = { "<strName>": [{file,line,text},...] })

Performance: reads each .cs file ONCE, finds all `"identifier"` occurrences
in a single regex pass, then filters by the graph's strName set. ~30k names
× 130 files completes in a few seconds.
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
DEFAULT_OUT = REPO_ROOT / "build" / "data" / "code_refs.js"
DEFAULT_DECOMP = REPO_ROOT / "decomp" / "Assembly-CSharp"

# Match "<identifier>" in C# source. Identifier-shaped only: filters out
# format strings, log messages, etc. that just happen to contain quotes.
QUOTED_IDENT = re.compile(r'"([A-Za-z_][A-Za-z0-9_]*)"')


def load_str_names(graph_path: Path) -> set[str]:
    """Extract the strName set from graph.js — strip the JS wrapper, parse the
    JSON, pull every node.strName."""
    text = graph_path.read_text(encoding="utf-8")
    prefix = "window.GRAPH_DATA = "
    if not text.startswith(prefix):
        raise ValueError(f"{graph_path} doesn't start with {prefix!r}")
    payload = text[len(prefix):]
    if payload.endswith(";\n"): payload = payload[:-2]
    elif payload.endswith(";"): payload = payload[:-1]
    g = json.loads(payload)
    return {n["strName"] for n in g["nodes"] if "strName" in n}


def scan_decomp(decomp_dir: Path, names: set[str]) -> dict[str, list[dict]]:
    """Returns { strName: [{file: <relpath>, line: <int>, text: <str>}, ...] }."""
    hits: dict[str, list[dict]] = defaultdict(list)
    files = sorted(decomp_dir.rglob("*.cs"))
    for path in files:
        try:
            text = path.read_text(encoding="utf-8-sig", errors="replace")
        except OSError:
            continue
        # Pre-compute line starts so we can map match.start() to line number quickly.
        line_starts = [0]
        for i, ch in enumerate(text):
            if ch == "\n":
                line_starts.append(i + 1)
        # We'll need the raw lines too for the displayed text.
        lines = text.splitlines()
        rel = path.relative_to(REPO_ROOT).as_posix()

        for m in QUOTED_IDENT.finditer(text):
            name = m.group(1)
            if name not in names:
                continue
            # Binary-search for line number
            pos = m.start()
            lo, hi = 0, len(line_starts) - 1
            while lo < hi:
                mid = (lo + hi + 1) // 2
                if line_starts[mid] <= pos:
                    lo = mid
                else:
                    hi = mid - 1
            line_no = lo + 1
            # Raw line, trimmed
            raw = lines[line_no - 1] if 0 <= line_no - 1 < len(lines) else ""
            hits[name].append({"file": rel, "line": line_no, "text": raw.rstrip()})
    return hits


def write_code_refs(hits: dict[str, list[dict]], out_path: Path) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", encoding="utf-8") as f:
        f.write("window.CODE_REFS = ")
        # Sort name -> hits ordered for stable diffs
        ordered = {name: hits[name] for name in sorted(hits)}
        json.dump(ordered, f, indent=2, ensure_ascii=False)
        f.write(";\n")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--graph", default=str(DEFAULT_GRAPH), help=f"path to graph.js (default: {DEFAULT_GRAPH.relative_to(REPO_ROOT)})")
    ap.add_argument("--decomp", default=str(DEFAULT_DECOMP), help=f"decomp source root (default: {DEFAULT_DECOMP.relative_to(REPO_ROOT)})")
    ap.add_argument("--out", default=str(DEFAULT_OUT), help=f"output path (default: {DEFAULT_OUT.relative_to(REPO_ROOT)})")
    args = ap.parse_args()

    graph_path = Path(args.graph)
    decomp_dir = Path(args.decomp)
    out_path = Path(args.out)

    if not graph_path.exists():
        print(f"graph.js not found at {graph_path}", file=sys.stderr)
        return 1
    if not decomp_dir.exists():
        print(f"decomp dir not found at {decomp_dir} — see README dnSpy section", file=sys.stderr)
        return 1

    names = load_str_names(graph_path)
    print(f"loaded {len(names):,} strNames from {graph_path.relative_to(REPO_ROOT)}")
    hits = scan_decomp(decomp_dir, names)
    total = sum(len(v) for v in hits.values())
    print(f"scanned {decomp_dir.relative_to(REPO_ROOT)}: {len(hits):,} names hit, {total:,} total occurrences")
    write_code_refs(hits, out_path)
    size_kb = out_path.stat().st_size / 1024
    print(f"wrote {out_path.relative_to(REPO_ROOT)} ({size_kb:.1f} KB)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
