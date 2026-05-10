"""
build_ship_inspector_data.py — extract data feeds for the static-site
ship-inspector tool (PLAN-BUILDER.md, Phase 1).

Produces four artifacts under src/Ostranauts.Site/data/:
  * canned-ships/<reg>.json           — stripped per-ship copies
  * canned-ships-manifest.json        — dropdown driver
  * id-friendly-names.json            — strName → strNameFriendly map
                                        (covers full base game, not just
                                        intersection-with-canned-ships)

Inputs:
  * data/loot/loot.json               — the five Random* ship loot tables
  * data/ships/<reg>.json             — per-ship definitions
  * data/condowners/*.json            — CondOwner defs (carry aStartingConds)
  * data/items/*.json                 — Item defs (point at a CondOwner via strCOBase)
  * data/cooverlays/*.json            — overlay defs (also point via strCOBase)

Bucket-classification rule, priority-ordered (first match wins). Each ship
item carries a strName referencing a CondOwner def; we walk strCOBase chains
to find aStartingConds. Each cond is "Name=value x duration"; we strip the
"=…" tail before matching.

  walls       any cond name starts with IsWall or IsLitWall
  floors      any cond name starts with IsFloor
  doors       any cond name starts with IsDoor or IsDockSys
  conduits    any cond name starts with IsConduit or IsPowerConduit
  containers  cond IsContainer* present AND IsInstalled NOT present
  equipment   cond IsInstalled present
  decorative  cond IsCarried present
  other       no rule fired

Note on the plan's bucket spec: PLAN-BUILDER.md described ship items as
'aCOs' with their own 'aStartingConds' / 'IsInstallable'. The actual data
shape: ships have 'aItems' whose entries are reference-only (strName,
fX, fY, fRotation, strID) — no inline conds. The starting-conds live on
the CondOwner def reached via strCOBase. The flag the game uses on
installed equipment is 'IsInstalled', not 'IsInstallable'. The classifier
adapts accordingly.

Usage:
  python utils/python/build_ship_inspector_data.py
"""
from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

sys.stdout.reconfigure(encoding="utf-8")

REPO_ROOT = Path(__file__).resolve().parents[2]

DATA_ROOT       = REPO_ROOT / "data"
SITE_DATA_ROOT  = REPO_ROOT / "src" / "Ostranauts.Site" / "data"
CANNED_SHIP_DIR = SITE_DATA_ROOT / "canned-ships"
MANIFEST_PATH   = SITE_DATA_ROOT / "canned-ships-manifest.json"
NAMES_PATH      = SITE_DATA_ROOT / "id-friendly-names.json"

# A ship can appear in multiple loot tables; the manifest reports only the
# first encountered, in the order below.
SHIP_LOOT_TABLES = [
    "RandomShip",
    "RandomDerelictSmall",
    "RandomDerelictMedium",
    "RandomDerelictBig",
    "RandomShipOld",
]

# Heavy fields that bloat user-uploaded saves. Canned base-game ships
# rarely carry them, but the strip is defensive against modder uploads
# of save-state-bearing ships.
HEAVY_FIELDS = {
    "aLog", "social", "aMessages", "aMsgColors",
    "dictRecentlyTried", "dictRememberScores", "aRememberIAs",
}

LARGE_STRING_THRESHOLD = 4096  # bytes


# ---------- IO helpers --------------------------------------------------------

def load_json(path: Path) -> Any:
    # utf-8-sig swallows a leading BOM if present (some game data files have one).
    with open(path, encoding="utf-8-sig") as f:
        return json.load(f)


def load_json_dir(folder: Path) -> dict[str, dict]:
    """Load every *.json under `folder` and index its entries by strName."""
    out: dict[str, dict] = {}
    for fp in sorted(folder.glob("*.json")):
        try:
            d = load_json(fp)
        except (OSError, json.JSONDecodeError) as e:
            print(f"  WARN: skipped {fp.name}: {e}", file=sys.stderr)
            continue
        if not isinstance(d, list):
            continue
        for entry in d:
            if isinstance(entry, dict) and "strName" in entry:
                out[entry["strName"]] = entry
    return out


def write_json(path: Path, data: Any, *, compact: bool = False) -> None:
    """Pretty-printed by default. Pass compact=True for single-line output —
    used for the canned-ships/*.json build artifacts where the on-disk file
    is consumed by JS at runtime, never read by humans, and a multi-line
    diff per regeneration would be 700k+ lines for no review value."""
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        if compact:
            json.dump(data, f, ensure_ascii=False, separators=(",", ":"))
        else:
            json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")


# ---------- loot enumeration --------------------------------------------------

def enumerate_canned_ships(loot_data: list[dict]) -> tuple[list[str], dict[str, str]]:
    """Walk the five Random* ship loot tables in priority order; return
    (regs, source_table_by_reg) — regs is dedup'd preserving first-seen order."""
    by_name = {e["strName"]: e for e in loot_data if isinstance(e, dict) and "strName" in e}
    regs_seen: list[str] = []
    source_by_reg: dict[str, str] = {}
    for tbl_name in SHIP_LOOT_TABLES:
        tbl = by_name.get(tbl_name)
        if tbl is None:
            print(f"  WARN: loot table '{tbl_name}' not found in data/loot/loot.json",
                  file=sys.stderr)
            continue
        # aCOs is a list of cumulative-pick strings; each is "|"-joined entries
        # of "Name=chance x min-max" (positive payouts only for ships).
        for chunk in tbl.get("aCOs") or []:
            if not isinstance(chunk, str):
                continue
            for piece in chunk.split("|"):
                piece = piece.strip().lstrip("-+")
                if not piece:
                    continue
                name = piece.split("=", 1)[0].strip()
                if not name or name in source_by_reg:
                    continue
                source_by_reg[name] = tbl_name
                regs_seen.append(name)
    return regs_seen, source_by_reg


# ---------- bucket classification --------------------------------------------

class CondResolver:
    """Resolve the aStartingConds of a CondOwner / Item / CondOwnerOverlay
    by walking strCOBase chains across the three folders."""

    def __init__(self,
                 condowners: dict[str, dict],
                 items: dict[str, dict],
                 cooverlays: dict[str, dict]) -> None:
        self.cdo = condowners
        self.itm = items
        self.ovl = cooverlays

    def conds_for(self, name: str, _depth: int = 0) -> list[str]:
        if _depth > 8 or not name:
            return []
        if name in self.cdo:
            entry = self.cdo[name]
            conds = entry.get("aStartingConds") or []
            if conds:
                return conds
            base = entry.get("strCOBase")
            if base and base != name:
                return self.conds_for(base, _depth + 1)
        if name in self.itm:
            base = self.itm[name].get("strCOBase")
            if base:
                return self.conds_for(base, _depth + 1)
        if name in self.ovl:
            base = self.ovl[name].get("strCOBase")
            if base:
                return self.conds_for(base, _depth + 1)
        return []


def classify_bucket(conds: list[str]) -> str:
    """Priority-ordered bucket classifier. See module docstring for the table."""
    cond_names = [c.split("=", 1)[0] for c in conds]
    has = lambda *prefixes: any(n.startswith(prefixes) for n in cond_names)

    if has("IsWall", "IsLitWall"):
        return "walls"
    if has("IsFloor"):
        return "floors"
    if has("IsDoor", "IsDockSys"):
        return "doors"
    if has("IsConduit", "IsPowerConduit"):
        return "conduits"
    has_container = has("IsContainer")
    has_installed = "IsInstalled" in cond_names
    if has_container and not has_installed:
        return "containers"
    if has_installed:
        return "equipment"
    if "IsCarried" in cond_names:
        return "decorative"
    return "other"


# ---------- ship strip + classify --------------------------------------------

def strip_ship(ship: dict, resolver: CondResolver, reg: str) -> tuple[dict, dict[str, int]]:
    """Return (stripped_ship_dict, bucket_counts).

    The returned dict mirrors the input except: heavy fields are dropped
    (top-level and on shipCO), each entry in aItems carries a new `_bucket`
    field, and any string value > LARGE_STRING_THRESHOLD is dropped with a
    warning (defensive against base64 dumps in user-uploaded saves)."""

    out: dict = {}
    for k, v in ship.items():
        if k in HEAVY_FIELDS:
            continue
        if isinstance(v, str) and len(v) > LARGE_STRING_THRESHOLD:
            print(f"  WARN: dropping large string field '{k}' on {reg} ({len(v):,} bytes)",
                  file=sys.stderr)
            continue
        out[k] = v

    if isinstance(out.get("shipCO"), dict):
        co = {}
        for k, v in out["shipCO"].items():
            if k in HEAVY_FIELDS:
                continue
            if isinstance(v, str) and len(v) > LARGE_STRING_THRESHOLD:
                print(f"  WARN: dropping large string field 'shipCO.{k}' on {reg} "
                      f"({len(v):,} bytes)", file=sys.stderr)
                continue
            co[k] = v
        out["shipCO"] = co

    bucket_counts: dict[str, int] = {
        "walls": 0, "floors": 0, "doors": 0, "conduits": 0,
        "containers": 0, "equipment": 0, "decorative": 0, "other": 0,
    }

    items_in = out.get("aItems") or []
    items_out = []
    for it in items_in:
        if not isinstance(it, dict):
            items_out.append(it)
            continue
        item = dict(it)  # shallow copy — fX/fY/etc. are scalars
        # Drop big base64 dumps if any sneak in on a CO instance.
        for k in list(item.keys()):
            v = item[k]
            if isinstance(v, str) and len(v) > LARGE_STRING_THRESHOLD:
                print(f"  WARN: dropping large string field 'aItems[*].{k}' on {reg} "
                      f"({len(v):,} bytes; item.strName={item.get('strName')!r})",
                      file=sys.stderr)
                del item[k]
        sn = item.get("strName") or ""
        conds = resolver.conds_for(sn)
        bucket = classify_bucket(conds)
        item["_bucket"] = bucket
        bucket_counts[bucket] += 1
        items_out.append(item)
    out["aItems"] = items_out

    return out, bucket_counts


def manifest_entry(reg: str,
                   ship: dict,
                   bucket_counts: dict[str, int],
                   source_table: str) -> dict:
    friendly = ship.get("strFriendlyName") or ship.get("strName") or reg
    return {
        "reg": reg,
        "friendlyName": friendly,
        "sourceLootTable": source_table,
        "dimW": ship.get("nCols"),
        "dimH": ship.get("nRows"),
        "componentCount": sum(bucket_counts.values()),
        "bucketCounts": bucket_counts,
    }


# ---------- friendly-name map -------------------------------------------------

def build_friendly_name_map() -> dict[str, str]:
    """Walk condowners/, items/, cooverlays/ and collect strName→strNameFriendly
    for every entry that carries one. Folder precedence (last-wins): cooverlays
    override items override condowners — so a per-flavor overlay name wins
    over the underlying base."""
    out: dict[str, str] = {}
    for folder in ("condowners", "items", "cooverlays"):
        for fp in sorted((DATA_ROOT / folder).glob("*.json")):
            try:
                d = load_json(fp)
            except (OSError, json.JSONDecodeError) as e:
                print(f"  WARN: skipped {fp.name}: {e}", file=sys.stderr)
                continue
            if not isinstance(d, list):
                continue
            for entry in d:
                if not isinstance(entry, dict):
                    continue
                sn = entry.get("strName")
                fn = entry.get("strNameFriendly")
                if sn and fn:
                    out[sn] = fn
    return dict(sorted(out.items()))


# ---------- main --------------------------------------------------------------

def main() -> int:
    print(f"[ship-inspector-data] repo root: {REPO_ROOT}")

    # 1. Build def-resolver indexes once.
    print("[1/5] indexing CondOwner / Item / CooverLay defs…")
    condowners = load_json_dir(DATA_ROOT / "condowners")
    items      = load_json_dir(DATA_ROOT / "items")
    cooverlays = load_json_dir(DATA_ROOT / "cooverlays")
    resolver = CondResolver(condowners, items, cooverlays)
    print(f"        condowners={len(condowners)}  items={len(items)}  cooverlays={len(cooverlays)}")

    # 2. Enumerate canned ships from loot.
    print("[2/5] enumerating canned-ship registries from loot tables…")
    loot_data = load_json(DATA_ROOT / "loot" / "loot.json")
    regs, source_by_reg = enumerate_canned_ships(loot_data)
    print(f"        {len(regs)} unique ship regs across {len(SHIP_LOOT_TABLES)} tables")

    # 3. Strip + classify per ship.
    print(f"[3/5] stripping + classifying per-ship JSON → {CANNED_SHIP_DIR.relative_to(REPO_ROOT)}/")
    CANNED_SHIP_DIR.mkdir(parents=True, exist_ok=True)
    # Wipe any stale outputs so re-runs after a loot-table edit don't leave
    # ghosts behind.
    for stale in CANNED_SHIP_DIR.glob("*.json"):
        stale.unlink()

    manifest: list[dict] = []
    missing_regs: list[str] = []
    for reg in regs:
        src = DATA_ROOT / "ships" / f"{reg}.json"
        if not src.exists():
            missing_regs.append(reg)
            print(f"        WARN: '{reg}' referenced by loot but data/ships/{reg}.json not found",
                  file=sys.stderr)
            continue
        try:
            raw = load_json(src)
        except (OSError, json.JSONDecodeError) as e:
            print(f"        WARN: failed to parse {src.name}: {e}", file=sys.stderr)
            continue
        if not (isinstance(raw, list) and raw and isinstance(raw[0], dict)):
            print(f"        WARN: unexpected shape in {src.name} (expected single-element array)",
                  file=sys.stderr)
            continue
        ship_dict = raw[0]
        stripped, bucket_counts = strip_ship(ship_dict, resolver, reg)
        # Preserve the array wrapper so the file shape matches input.
        # Compact (single-line) output — these are build artifacts; line-
        # by-line diffs of a regeneration aren't useful and pretty-print
        # bloated the commit by ~10x.
        write_json(CANNED_SHIP_DIR / f"{reg}.json", [stripped], compact=True)
        manifest.append(manifest_entry(reg, stripped, bucket_counts, source_by_reg[reg]))

    if missing_regs:
        print(f"        skipped {len(missing_regs)} loot-only regs: "
              f"{', '.join(missing_regs[:5])}"
              f"{'…' if len(missing_regs) > 5 else ''}",
              file=sys.stderr)

    # 4. Manifest.
    print(f"[4/5] writing manifest → {MANIFEST_PATH.relative_to(REPO_ROOT)}")
    manifest.sort(key=lambda m: m["reg"].lower())
    write_json(MANIFEST_PATH, manifest)

    # 5. Friendly-name map.
    print(f"[5/5] writing friendly-name map → {NAMES_PATH.relative_to(REPO_ROOT)}")
    name_map = build_friendly_name_map()
    write_json(NAMES_PATH, name_map)
    print(f"        {len(name_map)} strName → strNameFriendly entries")

    # Summary report.
    if manifest:
        total_components = sum(m["componentCount"] for m in manifest)
        total_buckets: dict[str, int] = {}
        for m in manifest:
            for k, v in m["bucketCounts"].items():
                total_buckets[k] = total_buckets.get(k, 0) + v
        print()
        print(f"summary: {len(manifest)} ships, {total_components:,} components total")
        for k in ("walls", "floors", "doors", "conduits", "containers",
                  "equipment", "decorative", "other"):
            print(f"  {k:11} {total_buckets.get(k, 0):>7,}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
