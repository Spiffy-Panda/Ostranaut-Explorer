"""Emit the SacksAndBuckets mod's items.json from config.yaml.

Each container CO needs an ItemDef in items.json that supplies the
sprite (strImg / strImgNorm). Without these, the CO can be defined
but the rendered art falls back to whatever vanilla ItemDef the
strItemDef points at -- which means our generated sprites never
get used.

This script emits 24 ItemDef entries:
  ItmSack<Suffix>     -> strImg = ItmSack<Suffix>
  ItmBucket<Suffix>   -> strImg = ItmBucket<Suffix>

The PNGs themselves are produced by emit_sprites.py.

Run: python spiffy-mods/util/SacksAndBuckets/emit_items.py
"""

from __future__ import annotations

from _lib import REPO_ROOT, load_config, ordered, write_json


def item_def(name: str) -> dict:
    """Build an ItemDef. Most fields are layout/socket scaffolding that
    Ostranauts uses for its grid-paste UI; we mirror the shape of vanilla
    backpack/crate ItemDefs without populating sockets (since our containers
    don't need slot-paste behavior beyond what the CO declares).

    strImg is set to `name` so the runtime resolves it to a same-named
    PNG under the mod's images/ folder (the file emit_sprites.py wrote)."""
    return ordered(
        ("strName", name),
        ("strImg", name),
        ("strImgNorm", f"{name}n"),
        ("strImgDamaged", ""),
        ("strDmgColor", "DamageTintRust"),
        ("fZScale", 0.02),
        ("nCols", 1),
        ("aSocketAdds", []),
        ("aSocketForbids", []),
        ("aSocketReqs", []),
    )


def main() -> int:
    cfg = load_config()
    out_root = REPO_ROOT / cfg["mod"]["out_root"]
    out_path = out_root / "items" / "items.json"

    entries: list[dict] = []
    for item in cfg["items"]:
        suffix = item["suffix"]
        entries.append(item_def(f"ItmSack{suffix}"))
        entries.append(item_def(f"ItmBucket{suffix}"))

    write_json(out_path, entries)
    print(f"Wrote {len(entries)} ItemDef entries to {out_path.relative_to(REPO_ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
