"""
build_ship_inspector_data.py — extract data feeds for the static-site
ship-inspector tool (PLAN-BUILDER.md, Phase 1).

Produces both .json and .js artifacts under src/Ostranauts.Site/data/:
  * canned-ships/<reg>.json + .js     — stripped per-ship copies
  * canned-ships-manifest.json + .js  — dropdown driver
  * id-friendly-names.json + .js      — strName → strNameFriendly map
                                        (covers full base game, not just
                                        intersection-with-canned-ships)

The .js wrappers exist so ship-inspector.html can `<script src="…">` the
data without fetch(), which Chrome blocks under file://. The .json
copies stay as-is — modders read id-friendly-names.json directly, and
the canned-ships JSONs round-trip cleanly through `python -m json.tool`
for anyone wanting to inspect a single ship outside the browser.

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
CATEGORIES_PATH = SITE_DATA_ROOT / "id-component-categories.json"

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


def write_js_wrapper(path: Path, data: Any, *, assignment: str, compact: bool = False) -> None:
    """Emit a `<script src>`-loadable wrapper that assigns the JSON payload
    to a window global. `assignment` is the literal LHS text — e.g.
    'window.SHIP_FRIENDLY_NAMES' or
    '(window.SHIP_INSPECTOR_CANNED = window.SHIP_INSPECTOR_CANNED || {})["Coffin"]'.
    The file is gitignore-friendly: a single trailing newline, no BOM."""
    path.parent.mkdir(parents=True, exist_ok=True)
    if compact:
        payload = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    else:
        payload = json.dumps(data, ensure_ascii=False, indent=2)
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(f"{assignment} = {payload};\n")


def js_string_literal(s: str) -> str:
    """Encode a Python str as a JS string literal — used for ship registries
    in `window.SHIP_INSPECTOR_CANNED["<reg>"] = …`. JSON-encoding a string
    yields a valid JS string literal (matching quote rules + escapes)."""
    return json.dumps(s, ensure_ascii=False)


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


# Bucket predicates — single source of truth. Each rule has a `match` set
# of cond-name prefixes (any one matches) and an optional `excludes` set of
# cond names that must NOT also be present. First match wins. The `other`
# bucket is the catch-all for anything that didn't match a previous rule.
# Mirrored verbatim into the emitted id-component-categories.json so the
# file documents its own classifier.
BUCKET_RULES = [
    {"bucket": "walls",      "match": ["IsWall", "IsLitWall"]},
    {"bucket": "floors",     "match": ["IsFloor"]},
    {"bucket": "doors",      "match": ["IsDoor", "IsDockSys"]},
    {"bucket": "conduits",   "match": ["IsConduit", "IsPowerConduit"]},
    {"bucket": "containers", "match": ["IsContainer"], "excludes": ["IsInstalled"]},
    {"bucket": "equipment",  "match": ["IsInstalled"]},
    {"bucket": "decorative", "match": ["IsCarried"]},
]


def classify_bucket(conds: list[str]) -> str:
    """First-match-wins over BUCKET_RULES. See the rule table for prefixes
    and exclusions; `other` is the implicit catch-all."""
    cond_names = [c.split("=", 1)[0] for c in conds]
    cond_set = set(cond_names)
    for rule in BUCKET_RULES:
        prefixes = tuple(rule["match"])
        if not any(n.startswith(prefixes) for n in cond_names):
            continue
        excludes = rule.get("excludes") or []
        if any(x in cond_set for x in excludes):
            continue
        return rule["bucket"]
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


# ---------- component-category map -------------------------------------------

def parse_stat_value(conds: list[str], stat_name: str) -> float | None:
    """aStartingConds entries look like 'StatBasePrice=1.0x21.0'. Return the
    'x'-suffix scalar as a float, or None if the stat isn't present."""
    prefix = stat_name + "="
    for c in conds:
        if not c.startswith(prefix):
            continue
        # Format: <prefix>=<chance>x<value>
        try:
            tail = c[len(prefix):]
            return float(tail.split("x", 1)[1])
        except (IndexError, ValueError):
            return None
    return None


def extract_categories(conds: list[str]) -> list[str]:
    """Pull the 'Hull', 'Electronics', etc. from any IsCategory<X> conds."""
    out = []
    for c in conds:
        n = c.split("=", 1)[0]
        if n.startswith("IsCategory") and len(n) > len("IsCategory"):
            out.append(n[len("IsCategory"):])
    return out


def load_color_map() -> dict[str, str]:
    """data/colors/colors.json → { name: '#rrggbb' }. Alpha is preserved as
    8-char #rrggbbaa when α<255 so a renderer can reflect transparency."""
    out: dict[str, str] = {}
    fp = DATA_ROOT / "colors" / "colors.json"
    if not fp.exists():
        return out
    try:
        d = load_json(fp)
    except (OSError, json.JSONDecodeError):
        return out
    if not isinstance(d, list):
        return out
    for e in d:
        if not isinstance(e, dict): continue
        name = e.get("strName")
        if not name: continue
        r = max(0, min(255, int(e.get("nR", 0))))
        g = max(0, min(255, int(e.get("nG", 0))))
        b = max(0, min(255, int(e.get("nB", 0))))
        a = max(0, min(255, int(e.get("nA", 255))))
        if a == 255:
            out[name] = f"#{r:02x}{g:02x}{b:02x}"
        else:
            out[name] = f"#{r:02x}{g:02x}{b:02x}{a:02x}"
    return out


def item_footprint(items: dict[str, dict], strName: str) -> tuple[int | None, int | None]:
    """Return (nCols, nRows) in tile units for a strName, by walking the
    strCOBase chain through items/. Mirrors the engine's own derivation in
    Item.cs:271-272 — `nWidthInTiles = jid.nCols`,
    `nHeightInTiles = aSocketAdds.Count / nCols`. Returns (None, None) when
    the strName has no items/ entry (e.g. CondOwners that aren't placeable
    items, or characters)."""
    seen: set[str] = set()
    name = strName
    while name and name not in seen:
        seen.add(name)
        e = items.get(name)
        if e is None:
            return (None, None)
        ncols = e.get("nCols")
        adds = e.get("aSocketAdds")
        if isinstance(ncols, int) and ncols > 0 and isinstance(adds, list):
            nrows = len(adds) // ncols
            return (ncols, nrows)
        nxt = e.get("strCOBase")
        if nxt and nxt != name:
            name = nxt
            continue
        return (None, None)
    return (None, None)


def build_component_categories(
    condowners: dict[str, dict],
    items: dict[str, dict],
    cooverlays: dict[str, dict],
    resolver: CondResolver,
) -> dict:
    """Walk every entry that carries (or inherits) aStartingConds and emit
    a bucketed map: { byBucket: { walls: { strName: {…meta…}, … }, … } }.

    Entries with bucket == 'other' are kept — modders use this to confirm a
    new ID lands where they expect, including the catch-all bin."""

    color_map = load_color_map()

    # Pool all candidate (strName, source) — preference order condowners >
    # items > cooverlays so the most authoritative metadata wins.
    pool: dict[str, tuple[str, dict]] = {}
    for sn, e in cooverlays.items(): pool.setdefault(sn, ("cooverlay", e))
    for sn, e in items.items():      pool[sn] = ("item", e)
    for sn, e in condowners.items(): pool[sn] = ("condowner", e)

    by_bucket: dict[str, dict[str, dict]] = {b: {} for b in (
        "walls", "floors", "doors", "conduits",
        "containers", "equipment", "decorative", "other"
    )}

    for sn, (src, entry) in pool.items():
        conds = resolver.conds_for(sn)
        if not conds:
            continue  # no classification possible — skip the long tail
        bucket = classify_bucket(conds)

        # damage-tint reference, only present on cooverlay rows; resolve to
        # an #rrggbb so the inspector / a modder can see it without
        # having to cross-reference data/colors/colors.json by hand.
        dmg_color_name = None
        dmg_color_hex = None
        ovl = cooverlays.get(sn)
        if ovl and isinstance(ovl, dict):
            dmg_color_name = ovl.get("strDmgColor")
            if dmg_color_name:
                dmg_color_hex = color_map.get(dmg_color_name)

        meta: dict = {
            "friendly": entry.get("strNameFriendly") or entry.get("strName"),
        }
        short = entry.get("strNameShort")
        if short and short != meta["friendly"]:
            meta["short"] = short

        cats = extract_categories(conds)
        if cats: meta["category"] = cats

        price = parse_stat_value(conds, "StatBasePrice")
        if price is not None: meta["basePrice"] = price
        mass = parse_stat_value(conds, "StatMass")
        if mass is not None: meta["mass"] = mass
        dmg_max = parse_stat_value(conds, "StatDamageMax")
        if dmg_max is not None: meta["durability"] = dmg_max

        ncols, nrows = item_footprint(items, sn)
        if ncols is not None and nrows is not None:
            meta["nCols"] = ncols
            meta["nRows"] = nrows

        if dmg_color_name:
            meta["dmgTint"] = dmg_color_name
            if dmg_color_hex: meta["dmgTintHex"] = dmg_color_hex

        meta["source"] = src
        by_bucket[bucket][sn] = meta

    # Sort each bucket's entries by friendly name for stable output.
    for b in by_bucket:
        by_bucket[b] = dict(sorted(
            by_bucket[b].items(),
            key=lambda kv: (kv[1].get("friendly") or kv[0]).lower(),
        ))

    counts = {b: len(by_bucket[b]) for b in by_bucket}

    classifier = {
        "_description": (
            "First-match-wins. For each rule, an entry's resolved aStartingConds "
            "(walking strCOBase chains via the same logic the engine uses on "
            "load) is checked. `match` lists cond-name prefixes — any one of "
            "which routes the entry into this bucket. `excludes` lists cond "
            "names that must NOT also be present (used to keep "
            "containers separate from installable equipment)."
        ),
        "rules": [dict(r) for r in BUCKET_RULES] + [
            {"bucket": "other", "match": [], "_note": "implicit catch-all"},
        ],
    }

    return {
        "_generated_by": "utils/python/build_ship_inspector_data.py",
        "_buckets": list(by_bucket.keys()),
        "_counts": counts,
        "_field_glossary": {
            "friendly":     "strNameFriendly — modder-facing display name.",
            "short":        "strNameShort — included only when distinct from `friendly`.",
            "category":     "Names lifted from any IsCategory<X> conds (Hull, Electronics, …).",
            "basePrice":    "StatBasePrice — base sale price in $.",
            "mass":         "StatMass — kg.",
            "durability":   "StatDamageMax — hit points before destruction.",
            "nCols":        "Footprint width in tiles. Engine: nWidthInTiles = items[strName].nCols (Item.cs:271).",
            "nRows":        "Footprint height in tiles. Engine: nHeightInTiles = aSocketAdds.Count / nCols (Item.cs:272).",
            "dmgTint":      "Cooverlay strDmgColor name (only present on cooverlays).",
            "dmgTintHex":   "dmgTint resolved against data/colors/colors.json as `#rrggbb` (or `#rrggbbaa` for α<255).",
            "source":       "Which folder produced the row: 'condowner', 'item', or 'cooverlay'.",
        },
        "_classifier": classifier,
        "byBucket": by_bucket,
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
    # ghosts behind. Includes the .js wrappers alongside the .json files.
    for stale in CANNED_SHIP_DIR.glob("*.json"):
        stale.unlink()
    for stale in CANNED_SHIP_DIR.glob("*.js"):
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
        write_js_wrapper(
            CANNED_SHIP_DIR / f"{reg}.js",
            [stripped],
            assignment=f"(window.SHIP_INSPECTOR_CANNED = window.SHIP_INSPECTOR_CANNED || {{}})[{js_string_literal(reg)}]",
            compact=True,
        )
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
    write_js_wrapper(
        MANIFEST_PATH.with_suffix(".js"),
        manifest,
        assignment="window.SHIP_INSPECTOR_MANIFEST",
    )

    # 5. Friendly-name map.
    print(f"[5/6] writing friendly-name map → {NAMES_PATH.relative_to(REPO_ROOT)}")
    name_map = build_friendly_name_map()
    write_json(NAMES_PATH, name_map)
    write_js_wrapper(
        NAMES_PATH.with_suffix(".js"),
        name_map,
        assignment="window.SHIP_FRIENDLY_NAMES",
    )
    print(f"        {len(name_map)} strName → strNameFriendly entries")

    # 6. Component-category map.
    print(f"[6/6] writing component categories → {CATEGORIES_PATH.relative_to(REPO_ROOT)}")
    categories = build_component_categories(condowners, items, cooverlays, resolver)
    write_json(CATEGORIES_PATH, categories)
    write_js_wrapper(
        CATEGORIES_PATH.with_suffix(".js"),
        categories,
        assignment="window.SHIP_COMPONENT_CATEGORIES",
    )
    cat_total = sum(categories["_counts"].values())
    print(f"        {cat_total} components classified across {len(categories['_buckets'])} buckets:")
    for b, c in categories["_counts"].items():
        print(f"          {b:11} {c:>6,}")

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
