"""Emit the SacksAndBuckets mod's condowners.json from config.yaml.

Templates 24 container CO entries (12 sacks at <sack_h>x<sack_w>, 12 buckets
at <bucket_h>x<bucket_w>) plus 1 kiosk CO (ItmSacksKiosk01) following the
crate-shape spawnability profile so `spawn ItmSacksKiosk01` works.

Run: python spiffy-mods/util/SacksAndBuckets/emit_condowners.py
"""

from __future__ import annotations

from pathlib import Path

from _lib import REPO_ROOT, load_config, ordered, title_case, write_json


def sack_entry(item: dict, dim: dict, sprite_strname: str) -> dict:
    suffix = item["suffix"]
    noun = item["noun"]
    return ordered(
        ("strName", f"ItmSack{suffix}"),
        ("strNameShort", f"Sack: {suffix}"),
        ("strNameFriendly", f"Sack of {title_case(noun)}"),
        ("strDesc", (
            f"A reinforced canvas sack, sized and stitched for one job: "
            f"holding {noun} and nothing else. Single-type by construction."
        )),
        ("strItemDef", sprite_strname),
        ("strType", "Item"),
        ("strLoot", None),
        ("strContainerCT", item["gate"]),
        ("nContainerHeight", dim["height"]),
        ("nContainerWidth", dim["width"]),
        ("aInteractions", ["Inventory", "EquipItem", "DropItem", "PickupItem"]),
        ("aStartingConds", [
            "IsBurnable=1.0x1.0",
            "IsContainer=1.0x1",
            "IsBackpack=1.0x1.0",
            "IsFlexible=1.0x1.0",
            "IsSheet=1.0x1.0",
            "IsTempInsulator=1.0x1.0",
            "IsSolid=1.0x1.0",
            "StatMass=1.0x2.0",
            "StatBasePrice=1.0x200.0",
            "StatDamageMax=1.0x4",
            "StatDismantleProgressMax=1.0x30",
            "IsCategoryTextiles=1.0x1.0",
        ]),
        ("mapCondTolerance", []),
        ("mapPoints", []),
        ("mapChargeProfiles", ["Melee", "MeleeAttackDefault"]),
        ("aUpdateCommands", ["Destructable,StatDamage,ACTClothesDestroy,StatDamageMax,1.0"]),
        ("mapGUIPropMaps", None),
        ("strPortraitImg", sprite_strname),
        ("strAudioEmitter", "ItmBackpackSound"),
        ("mapSlotEffects", [
            "back",  "Backpack02Full",
            "heldL", "HeldBackpack02FullL",
            "heldR", "HeldBackpack02FullR",
            "drag",  "Backpack02Full",
        ]),
        ("jsonPI", None),
    )


def bucket_entry(item: dict, dim: dict, sprite_strname: str) -> dict:
    suffix = item["suffix"]
    noun = item["noun"]
    return ordered(
        ("strName", f"ItmBucket{suffix}"),
        ("strNameShort", f"Bucket: {suffix}"),
        ("strNameFriendly", f"Bucket of {title_case(noun)}"),
        ("strDesc", (
            f"An oversized industrial bucket built for bulk salvage. "
            f"Stays put -- drag it to where you want it. Accepts {noun} only."
        )),
        ("strItemDef", sprite_strname),
        ("strType", "Item"),
        ("strLoot", None),
        ("strContainerCT", item["gate"]),
        ("nContainerHeight", dim["height"]),
        ("nContainerWidth", dim["width"]),
        ("aInteractions", ["Inventory", "DropItem", "PickupItem"]),
        ("aStartingConds", [
            "IsContainer=1.0x1.0",
            "IsCrate=1.0x1.0",
            "IsOversized=1.0x1.0",
            "IsRigid=1.0x1.0",
            "IsSolid=1.0x1.0",
            "IsWaterproof=1.0x1.0",
            "StatBasePrice=1.0x400.0",
            "StatDamageMax=1.0x10",
            "StatDismantleProgressMax=1.0x20",
            "StatMass=1.0x15.0",
            "IsCategoryTools=1.0x1",
        ]),
        ("mapCondTolerance", []),
        ("mapPoints", []),
        ("mapChargeProfiles", ["Melee", "MeleeAttackDefault"]),
        ("aUpdateCommands", ["Destructable,StatDamage,ACTCrate01Destroy,StatDamageMax,1.0"]),
        ("mapGUIPropMaps", None),
        ("strPortraitImg", "paperdoll/held/portCrate01"),
        ("strAudioEmitter", "ItmPlasticBoxSound"),
        ("mapSlotEffects", [
            "heldL", "HeldItmCrate01L",
            "heldR", "HeldItmCrate01R",
            "drag",  "Blank",
        ]),
        ("jsonPI", None),
    )


def kiosk_entry(cfg: dict) -> dict:
    """The standalone trade kiosk. Crate-shape spawnability (no IsInstalled
    so the engine drops it on the floor at the player's feet on `spawn`)."""
    k = cfg["kiosk"]
    return ordered(
        ("strName", k["strName"]),
        ("strNameShort", "Kiosk: Sacks & Buckets"),
        ("strNameFriendly", "Sacks & Buckets Kiosk"),
        ("strDesc", (
            "A self-service kiosk stocked with single-type containers: "
            "sacks for wear-and-carry, buckets for bulk floor storage. "
            "One container, one item type."
        )),
        # strItemDef = our own ItemDef (emit_items.py emits it with empty
        # sockets so placement isn't restricted to wall+floor like vanilla
        # ItmKioskSupplies01 demands). The visual still pulls from vanilla
        # art via that ItemDef's strImg passthrough.
        ("strItemDef", k["strName"]),
        ("strType", "Item"),
        ("strLoot", None),
        ("strContainerCT", "TIsFitContainerUnlimited"),
        ("nContainerHeight", 0),
        ("nContainerWidth", 0),
        ("aInteractions", ["ACTKioskUseNPC", "GUITradeSacksKiosk"]),
        ("aStartingConds", [
            "IsContainer=1.0x1.0",
            "IsHiddenInv=1.0x1",            # restored: hides the kiosk's
                                            # (unused) physical inventory
                                            # panel when held -- not actually
                                            # tied to IsInstalled.
            "IsInfiniteContainer=1.0x1",    # restored: lets the trade UI
                                            # transact unbounded volume,
                                            # which is what kiosks need.
            "IsIndestructable=1.0x1",
            "IsKioskNPC=1.0x1",
            "IsOversized=1.0x1.0",
            "IsReadyRestock=1.0x1.0",
            "IsRigid=1.0x1.0",
            "IsSalvageValueHigh=1.0x1.0",
            "IsSolid=1.0x1.0",
            "IsTraderNPC=1.0x1",
            "StatMass=1.0x10.0",            # was 31; matched ItmCrate01 to
                                            # make the held kiosk easier to
                                            # carry around for v1.
            "StatDamageMax=1.0x70",
            "IsMechanical=1.0x1",
            "IsCategoryIndustrialProducts=1.0x1",
        ]),
        ("mapCondTolerance", []),
        ("mapPoints", ["use,0,-16"]),
        ("mapChargeProfiles", []),
        ("aUpdateCommands", []),
        ("mapGUIPropMaps", [
            "Panel A", "Trade",
            "Trade",   "Trade",
            "Trader",  k["guipropmap"],
        ]),
        ("strPortraitImg", "ItmKioskSupplies01"),
        ("strAudioEmitter", "ItmKioskHealth01Sound"),
        ("mapSlotEffects", [
            "heldL", "HeldItmCrate01L",
            "heldR", "HeldItmCrate01R",
            "drag",  "Blank",
        ]),
        ("jsonPI", None),
    )


def main() -> int:
    cfg = load_config()
    out_root = REPO_ROOT / cfg["mod"]["out_root"]
    out_path = out_root / "condowners" / "condowners.json"

    sack_dim = cfg["dimensions"]["sack"]
    bucket_dim = cfg["dimensions"]["bucket"]

    entries: list[dict] = []
    for item in cfg["items"]:
        suffix = item["suffix"]
        # New strItemDef per container so each can carry its own generated
        # sprite (emit_items.py + emit_sprites.py wire this up).
        entries.append(sack_entry(item, sack_dim, f"ItmSack{suffix}"))
        entries.append(bucket_entry(item, bucket_dim, f"ItmBucket{suffix}"))
    entries.append(kiosk_entry(cfg))

    write_json(out_path, entries)
    print(f"Wrote {len(entries)} entries to {out_path.relative_to(REPO_ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
