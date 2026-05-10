"""Emit the SacksAndBuckets mod's items.json from config.yaml.

Each container CO needs an ItemDef in items.json that supplies the
sprite (strImg / strImgNorm). Without these, the CO can be defined
but the rendered art falls back to whatever vanilla ItemDef the
strItemDef points at -- which means our generated sprites never
get used.

This script emits 25 ItemDef entries:
  ItmSack<Suffix>     -> strImg = ItmSack<Suffix>     (sock layout = vanilla ItmBackpack02)
  ItmBucket<Suffix>   -> strImg = ItmBucket<Suffix>   (sock layout = vanilla ItmCrate01)
  ItmSacksKiosk01     -> strImg = ItmKioskSupplies01  (sock layout = vanilla ItmKioskSupplies01)

The container PNGs themselves are produced by emit_sprites.py; the
kiosk's strImg passes through to vanilla art (LoadPNG iterates
aModPaths and shares dictImages, so 'core' loaded first will already
have ItmKioskSupplies01.png cached when our items.json points at the
same name).

# Sockets

Sockets describe the item's *world footprint* + neighbour
constraints, not its inventory grid. They drive the placement-preview
overlay in-game (showing the cells the item occupies + the
required/forbidden neighbours). For backpack/crate-class items the
constraints are mild (just "don't overlap myself"); for kiosks
they're a wall+floor footprint preview.

We copy each shape verbatim from the closest-matching vanilla
ItemDef so the in-game placement display reads correctly:
  sack   -- ItmBackpack02         (nCols=1, 1x1 footprint, wear/drop-anywhere)
  bucket -- ItmCrate01            (nCols=2, 2x2 footprint, drop-anywhere)
  kiosk  -- ItmKioskSupplies01    (nCols=5, 5x1 footprint, wall+floor)

Earlier versions emitted empty socket arrays for everything to dodge
a placement issue with the kiosk; turned out the underlying problem
was display-clarity, not actual blocked placement. With vanilla
sockets restored the kiosk shows its real footprint when held, and
the player just finds a wall+floor spot to drop it.

Run: python spiffy-mods/util/SacksAndBuckets/emit_items.py
"""

from __future__ import annotations

from _lib import REPO_ROOT, load_config, ordered, write_json


# --- Vanilla socket layouts, copied verbatim ---
# ItmBackpack02 (nCols=1) -- wearable single-cell container.
_SACK_SOCKETS = dict(
    nCols=1,
    aSocketAdds=["TILItemAdds"],
    aSocketForbids=[
        "Blank", "Blank", "Blank",
        "Blank", "TILItemForbids", "Blank",
        "Blank", "Blank", "Blank",
    ],
    aSocketReqs=[
        "Blank", "Blank", "Blank",
        "Blank", "Blank", "Blank",
        "Blank", "Blank", "Blank",
    ],
)

# ItmCrate01 (nCols=2) -- 2x2-footprint floor crate.
_BUCKET_SOCKETS = dict(
    nCols=2,
    aSocketAdds=[
        "TILItemAdds", "TILItemAdds",
        "TILItemAdds", "TILItemAdds",
    ],
    aSocketForbids=[
        "Blank", "Blank", "Blank", "Blank",
        "Blank", "TILItemForbids", "TILItemForbids", "Blank",
        "Blank", "TILItemForbids", "TILItemForbids", "Blank",
        "Blank", "Blank", "Blank", "Blank",
    ],
    aSocketReqs=[
        "Blank", "Blank", "Blank", "Blank",
        "Blank", "Blank", "Blank", "Blank",
        "Blank", "Blank", "Blank", "Blank",
        "Blank", "Blank", "Blank", "Blank",
    ],
)

# ItmKioskSupplies01 (nCols=5) -- 5-wide wall fixture: top row needs
# TILWall, two rows below need TILFloor; obstruction-forbidden in the
# fixture footprint cells.
_KIOSK_SOCKETS = dict(
    nCols=5,
    aSocketAdds=[
        "TILFixtureAdds", "TILFixtureAdds", "TILFixtureAdds", "TILFixtureAdds", "TILFixtureAdds",
    ],
    aSocketForbids=[
        "Blank", "Blank", "Blank", "Blank", "Blank", "Blank", "Blank",
        "Blank", "TILObstruction", "TILObstruction", "TILObstruction", "TILObstruction", "TILObstruction", "Blank",
        "Blank", "TILObstruction", "TILObstruction", "TILObstruction", "TILObstruction", "TILObstruction", "Blank",
    ],
    aSocketReqs=[
        "Blank", "TILWall", "TILWall", "TILWall", "TILWall", "TILWall", "Blank",
        "Blank", "TILFloor", "TILFloor", "TILFloor", "TILFloor", "TILFloor", "Blank",
        "Blank", "TILFloor", "TILFloor", "TILFloor", "TILFloor", "TILFloor", "Blank",
    ],
)


def item_def(name: str, sockets: dict, strImg: str | None = None) -> dict:
    """Build an ItemDef row.

    `sockets` is one of _SACK_SOCKETS / _BUCKET_SOCKETS / _KIOSK_SOCKETS
    -- a dict carrying nCols + the three aSocket* arrays sized for that
    footprint. The arrays are vanilla shapes copied verbatim so the
    in-game placement display draws the same footprint hint as the
    vanilla item we're modelled on.

    strImg defaults to `name` so the runtime resolves it to a same-named
    PNG under the mod's images/ folder (the file emit_sprites.py wrote).
    Pass an explicit strImg to alias another item's art -- the kiosk
    passes "ItmKioskSupplies01" to fall through to vanilla art via
    LoadPNG's shared dictImages cache."""
    img = strImg if strImg is not None else name
    return ordered(
        ("strName", name),
        ("strImg", img),
        ("strImgNorm", f"{img}n"),
        ("strImgDamaged", ""),
        ("strDmgColor", "DamageTintRust"),
        ("fZScale", 0.02),
        ("nCols", sockets["nCols"]),
        ("aSocketAdds", sockets["aSocketAdds"]),
        ("aSocketForbids", sockets["aSocketForbids"]),
        ("aSocketReqs", sockets["aSocketReqs"]),
    )


def main() -> int:
    cfg = load_config()
    out_root = REPO_ROOT / cfg["mod"]["out_root"]
    out_path = out_root / "items" / "items.json"

    entries: list[dict] = []
    for item in cfg["items"]:
        suffix = item["suffix"]
        entries.append(item_def(f"ItmSack{suffix}", _SACK_SOCKETS))
        entries.append(item_def(f"ItmBucket{suffix}", _BUCKET_SOCKETS))

    # Kiosk ItemDef. Vanilla ItmKioskSupplies01 socket layout (5x1
    # wall+floor footprint) so the placement-preview shows the player
    # the kiosk's real shape; strImg passthrough so the visual stays
    # vanilla. The kiosk doesn't have an Install/Uninstall flow in
    # this mod, so the wall+floor "requirements" are display-only --
    # the player just finds a spot that satisfies them and drops.
    k = cfg["kiosk"]
    entries.append(item_def(k["strName"], _KIOSK_SOCKETS, strImg=k["strImg"]))

    write_json(out_path, entries)
    print(f"Wrote {len(entries)} ItemDef entries to {out_path.relative_to(REPO_ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
