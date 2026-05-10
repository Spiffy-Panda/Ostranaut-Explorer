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


def item_def(name: str, strImg: str | None = None) -> dict:
    """Build an ItemDef. Most fields are layout/socket scaffolding that
    Ostranauts uses for its grid-paste UI; we mirror the shape of vanilla
    backpack/crate ItemDefs without populating sockets, so placement is
    fully permissive -- the player can drop the item on any tile, no
    wall-+-floor neighbour requirement (vanilla ItmKioskSupplies01's
    aSocketReqs demands TILWall on the top row + TILFloor below; that
    was the bug that blocked drop-anywhere on the held kiosk).

    strImg defaults to `name` so the runtime resolves it to a same-named
    PNG under the mod's images/ folder (the file emit_sprites.py wrote).
    Pass an explicit strImg to alias another item's art (e.g. the kiosk
    passes "ItmKioskSupplies01" to fall through to vanilla art via
    LoadPNG's shared dictImages cache)."""
    img = strImg if strImg is not None else name
    return ordered(
        ("strName", name),
        ("strImg", img),
        ("strImgNorm", f"{img}n"),
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

    # Kiosk ItemDef. Permissive (empty) sockets so the held kiosk drops
    # anywhere; strImg passthrough so the visual stays vanilla.
    k = cfg["kiosk"]
    entries.append(item_def(k["strName"], strImg=k["strImg"]))

    write_json(out_path, entries)
    print(f"Wrote {len(entries)} ItemDef entries to {out_path.relative_to(REPO_ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
