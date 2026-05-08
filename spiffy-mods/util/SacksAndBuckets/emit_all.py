"""Run all SacksAndBuckets generators in order.

Equivalent to running each emit_*.py individually. Sprites first (so any
fatal source-PNG issue surfaces before the JSON files churn), then JSON.

Run: python spiffy-mods/util/SacksAndBuckets/emit_all.py
"""

from __future__ import annotations

import importlib
import sys


SCRIPTS = ("emit_sprites", "emit_items", "emit_condowners", "emit_loot")


def main() -> int:
    for name in SCRIPTS:
        print(f"--- {name} ---")
        mod = importlib.import_module(name)
        rc = mod.main()
        if rc != 0:
            print(f"({name} returned {rc}; stopping)", file=sys.stderr)
            return rc
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
