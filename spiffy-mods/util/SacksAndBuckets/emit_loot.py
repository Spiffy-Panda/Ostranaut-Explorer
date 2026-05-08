"""Emit the SacksAndBuckets mod's loot files from config.yaml.

Two outputs under <mod_out>/loot/:
  loot.json -- ItmSacksKioskInv stock table (24 sack/bucket lines).
  loot_self_reference.json -- 25 self-emit wrappers: 24 sacks/buckets
    (so the kiosk's aLoots refs resolve via loot/) + 1 for ItmSacksKiosk01
    itself (so `spawn ItmSacksKiosk01` resolves the loot table that emits
    the actual CO -- vanilla items like ItmAICargo01 use the same trick).

Run: python spiffy-mods/util/SacksAndBuckets/emit_loot.py
"""

from __future__ import annotations

from _lib import REPO_ROOT, load_config, ordered, write_json


def stock_line(prefix: str, suffix: str, chance: float, mn: int, mx: int) -> str:
    """Format an aLoots entry: 'Name=chanceXmin-max' or 'Name=chanceXn'."""
    qty = f"{mn}-{mx}" if mn != mx else f"{mn}"
    return f"{prefix}{suffix}={chance}x{qty}"


def main() -> int:
    cfg = load_config()
    out_root = REPO_ROOT / cfg["mod"]["out_root"]
    stock_cfg = cfg["kiosk_stock"]

    # --- Stock table for the kiosk ---
    stock_lines: list[str] = []
    for item in cfg["items"]:
        suffix = item["suffix"]
        stock_lines.append(stock_line(
            "ItmSack", suffix,
            stock_cfg["sack_chance"],
            stock_cfg["sack_count_min"],
            stock_cfg["sack_count_max"],
        ))
        stock_lines.append(stock_line(
            "ItmBucket", suffix,
            stock_cfg["bucket_chance"],
            stock_cfg["bucket_count_min"],
            stock_cfg["bucket_count_max"],
        ))

    kiosk_inv = ordered(
        ("strName", cfg["kiosk"]["stock_table"]),
        ("aCOs", []),
        ("aLoots", stock_lines),
        ("strType", "item"),
    )
    loot_path = out_root / "loot" / "loot.json"
    write_json(loot_path, [kiosk_inv])
    print(f"Wrote {cfg['kiosk']['stock_table']} ({len(stock_lines)} lines) to {loot_path.relative_to(REPO_ROOT)}")

    # --- Self-reference wrappers ---
    # 24 for the items + 1 for the kiosk itself.
    names: list[str] = []
    for item in cfg["items"]:
        names.append(f"ItmSack{item['suffix']}")
        names.append(f"ItmBucket{item['suffix']}")
    names.append(cfg["kiosk"]["strName"])

    wrappers = []
    for n in names:
        wrappers.append(ordered(
            ("strName", n),
            ("aCOs", [f"{n}=1.0x1"]),
            ("aLoots", []),
            ("strType", "item"),
        ))
    self_ref_path = out_root / "loot" / "loot_self_reference.json"
    write_json(self_ref_path, wrappers)
    print(f"Wrote {len(wrappers)} self-reference wrappers to {self_ref_path.relative_to(REPO_ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
