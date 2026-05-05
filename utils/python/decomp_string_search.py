"""decomp_string_search.py

Regex-grep for `"<key>"` literal string occurrences across the decompiled
C# source tree. Catches references to data names that the JSON-schema
extractor can't see — typically hardcoded calls like
`DataHandler.GetPledge("EmbarkCommand")` in `AIShipManager.cs`.

Reports file path, line number, and the line itself for each hit. Optional
--context N includes N lines of surrounding code per match.

Usage:
    # one key
    python ./utils/python/decomp_string_search.py EmbarkCommand

    # several
    python ./utils/python/decomp_string_search.py EmbarkCommand DcFood Coughing

    # surrounding context (3 lines before, 3 after)
    python ./utils/python/decomp_string_search.py --context 3 EmbarkCommand

    # restrict matching to identifier-shaped names (no spaces, alnum/_)
    # (already the default; opt out with --no-strict to allow any text inside quotes)
"""

from __future__ import annotations

import argparse
import re
import sys
from collections import defaultdict
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
DECOMP_DIR = REPO_ROOT / "decomp" / "Assembly-CSharp"


def search_one(key: str, files: list[Path]) -> list[tuple[Path, int, str]]:
    """Returns [(path, line_number, line_text), ...] for matches of "<key>"."""
    # Match the key as a quoted literal: "<key>"
    # `re.escape` handles any regex-special chars in the key.
    pattern = re.compile(r'"' + re.escape(key) + r'"')
    hits: list[tuple[Path, int, str]] = []
    for path in files:
        try:
            text = path.read_text(encoding="utf-8-sig", errors="replace")
        except OSError:
            continue
        for lineno, line in enumerate(text.splitlines(), start=1):
            if pattern.search(line):
                hits.append((path, lineno, line.rstrip()))
    return hits


def gather_files() -> list[Path]:
    if not DECOMP_DIR.exists():
        print(f"decomp dir not found: {DECOMP_DIR}", file=sys.stderr)
        return []
    return sorted(DECOMP_DIR.rglob("*.cs"))


def fmt_match(path: Path, lineno: int, line: str, context: int, all_lines: list[str] | None) -> str:
    rel = path.relative_to(REPO_ROOT)
    if context <= 0 or all_lines is None:
        return f"{rel}:{lineno}: {line}"
    start = max(0, lineno - 1 - context)
    end = min(len(all_lines), lineno + context)
    out_lines = []
    out_lines.append(f"--- {rel}:{lineno} ---")
    for i in range(start, end):
        marker = ">>" if i == lineno - 1 else "  "
        out_lines.append(f"{marker} {i + 1:5}  {all_lines[i].rstrip()}")
    return "\n".join(out_lines)


def main() -> int:
    ap = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    ap.add_argument("keys", nargs="+", help="One or more keys to search for as quoted literals.")
    ap.add_argument("--context", "-C", type=int, default=0, metavar="N",
                    help="Show N lines of surrounding context per match (default 0).")
    ap.add_argument("--no-strict", action="store_true",
                    help="Don't require the key to be identifier-shaped (alnum/_); allow anything in the quoted literal.")
    args = ap.parse_args()

    files = gather_files()
    if not files:
        return 1

    # Strict mode: warn on keys that look unlikely to match anything sensible.
    if not args.no_strict:
        IDENT = re.compile(r"^[A-Za-z_][A-Za-z0-9_ ]*$")
        for k in args.keys:
            if not IDENT.match(k):
                print(f"warn: key {k!r} doesn't look like an identifier; pass --no-strict to silence",
                      file=sys.stderr)

    total = 0
    for key in args.keys:
        hits = search_one(key, files)
        print(f"=== {key!r}: {len(hits)} hit{'s' if len(hits) != 1 else ''} ===")
        if not hits:
            print()
            continue

        # Group by file for tidier output.
        by_file: dict[Path, list[tuple[int, str]]] = defaultdict(list)
        for p, ln, line in hits:
            by_file[p].append((ln, line))

        # If --context, we'll need the full file once per file
        for path in sorted(by_file):
            all_lines = path.read_text(encoding="utf-8-sig", errors="replace").splitlines() \
                if args.context > 0 else None
            for ln, line in by_file[path]:
                print(fmt_match(path, ln, line, args.context, all_lines))
                total += 1
        print()

    print(f"=== summary: {total} match{'es' if total != 1 else ''} across {len(args.keys)} key(s) ===")
    return 0 if total > 0 else 0  # don't fail just because no matches


if __name__ == "__main__":
    sys.exit(main())
