"""generate_missing_schemas.py

Generates ``comment_mod/data/schemas/<folder>-schema.json`` overlays for every
parser folder that has a Json* DTO in the decomp loader table but no schema
yet. Ground truth for "what fields exist" is the DTO; ground truth for
"which fields are refs and where they point" is ``build/data/ref_candidates.js``
emitted by the Builder's RefCandidateDetector.

Usage:
    # Regenerate the build's candidate payload first if stale:
    .\\build.bat
    python utils/python/generate_missing_schemas.py
        # Writes overlays for all unmodeled folders.

    python utils/python/generate_missing_schemas.py --folder installables
        # Writes a single folder's overlay (for iterative review).

    python utils/python/generate_missing_schemas.py --dry-run
        # Print intended changes without writing.

The output is intentionally hand-revisable — the generator does the bulk of
the work but each overlay is a normal JSON file modders can edit. After the
first generation pass, follow-ups should hand-tune descriptions for fields
that fell below the detector's MinSampleSize=5 threshold.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path

# Local helper — reused for loader parsing.
sys.path.insert(0, str(Path(__file__).resolve().parent))
from decomp_loader_table import (  # noqa: E402
    ROOT,
    DECOMP_DIR,
    parse_loader_dispatches,
    unmodeled_folders,
    UnmodeledFolder,
)

OVERLAY_DIR = ROOT / "comment_mod" / "data" / "schemas"
CANDIDATES_JS = ROOT / "build" / "data" / "ref_candidates.js"

# Match `public <type> <name> { get; set; }` (auto-properties) and
# `public <type> <name>;` (plain fields). Both are LitJson-deserialised.
PROP_RE = re.compile(
    r'public\s+(?P<type>[\w\[\]<>?,\s]+?)\s+(?P<name>\w+)\s*'
    r'(?:\{\s*get\s*;\s*set\s*;\s*\}|;)'
)


@dataclass(frozen=True)
class DtoField:
    name: str
    cs_type: str  # raw C# type token, e.g. "string", "string[]", "bool", "List<JsonAd.Page>"


def parse_dto_fields(class_name: str) -> list[DtoField]:
    """Read decomp/Assembly-CSharp/<class>.cs and pull every public property
    or field. Order is source order (matches LitJson serialisation order)."""
    p = DECOMP_DIR / f"{class_name}.cs"
    if not p.exists():
        return []
    text = p.read_text(encoding="utf-8-sig")
    out: list[DtoField] = []
    seen: set[str] = set()
    for m in PROP_RE.finditer(text):
        name = m.group("name")
        cs_type = m.group("type").strip()
        # The regex can over-match keywords like "static". Filter any C# keywords
        # accidentally captured as types. Only a small set ever leaks through.
        if cs_type in {"void", "static", "readonly", "const", "virtual", "override", "abstract"}:
            continue
        if name in seen:
            continue
        seen.add(name)
        out.append(DtoField(name=name, cs_type=cs_type))
    return out


def cs_type_to_schema_type(cs_type: str) -> dict | None:
    """Map a C# type token to a JSON Schema type fragment. Returns None for
    types that can't carry a strName ref (so the field is skipped from the
    overlay entirely — ghost fields can be added by hand later)."""
    t = cs_type.strip()
    # Strip nullable suffix.
    if t.endswith("?"):
        t = t[:-1].strip()
    # Arrays.
    if t.endswith("[]"):
        inner = t[:-2].strip()
        if inner == "string":
            return {"type": "array"}
        return None  # array-of-objects: would need x-shape NestedDirectArray, hand-tuned
    # List<T>.
    list_match = re.match(r"^List<\s*(.+?)\s*>$", t)
    if list_match:
        inner = list_match.group(1).strip()
        if inner == "string":
            return {"type": "array"}
        return None
    # Dictionary<K,V>: not a ref carrier.
    if t.startswith("Dictionary<") or t.startswith("IDictionary<"):
        return None
    # Primitive scalars.
    return {
        "string": {"type": "string"},
        "bool":   {"type": "boolean"},
        "int":    {"type": "integer"},
        "long":   {"type": "integer"},
        "uint":   {"type": "integer"},
        "byte":   {"type": "integer"},
        "short":  {"type": "integer"},
        "float":  {"type": "number"},
        "double": {"type": "number"},
        "decimal": {"type": "number"},
    }.get(t)


# ─── candidate detector index ───────────────────────────────────────────────

@dataclass(frozen=True)
class DetectorHit:
    """Detector signal for one (folder, fieldPath). Wraps the raw payload so the
    generator can emit the right shape (direct ref vs. encoded vs. nested)."""
    field_path: str         # e.g. "strActionCO" or "aThresh[*].strLootNew" or "aInputs[*]"
    sample_size: int
    distinct_values: int
    targets: list[tuple[str, float]]   # (target_folder, hit_rate), strongest first
    encoded: dict | None    # raw encoded finding from detector, if any

    @property
    def is_array_path(self) -> bool:
        return "[*]" in self.field_path

    @property
    def is_nested_path(self) -> bool:
        # array-of-objects with sub-field, e.g. aThresh[*].strLootNew
        return "[*]." in self.field_path

    @property
    def top_level_field(self) -> str:
        """Return the parent field name — what the schema property is keyed on."""
        idx_brk = self.field_path.find("[")
        idx_dot = self.field_path.find(".")
        cut_points = [i for i in (idx_brk, idx_dot) if i >= 0]
        if not cut_points:
            return self.field_path
        return self.field_path[:min(cut_points)]

    @property
    def nested_subfield(self) -> str | None:
        if not self.is_nested_path:
            return None
        # "aThresh[*].strLootNew" → "strLootNew"
        return self.field_path.split("[*].", 1)[1]


def load_detector_candidates() -> dict[tuple[str, str], DetectorHit]:
    """Returns a (folder, top_level_field) → strongest DetectorHit map.
    Multiple paths can share a top-level field (rare); strongest wins."""
    if not CANDIDATES_JS.exists():
        print(f"WARN: {CANDIDATES_JS} not found — generating without detector signal", file=sys.stderr)
        return {}
    text = CANDIDATES_JS.read_text(encoding="utf-8")
    text = re.sub(r"^window\.REF_CANDIDATES\s*=\s*", "", text)
    text = re.sub(r";\s*$", "", text)
    payload = json.loads(text)

    out: dict[tuple[str, str], DetectorHit] = {}
    for c in payload.get("candidates", []):
        targets = [
            (t["targetFolder"], t["hitRate"])
            for t in c.get("targets", [])
        ]
        targets.sort(key=lambda x: x[1], reverse=True)
        hit = DetectorHit(
            field_path=c["fieldPath"],
            sample_size=c["sampleSize"],
            distinct_values=c["distinctValues"],
            targets=targets,
            encoded=c.get("encoded"),
        )
        key = (c["sourceFolder"], hit.top_level_field)
        # Keep the strongest signal for the top-level field. "Strength" =
        # leverage = top hit_rate × min(distinct, sample). Matches the site.
        existing = out.get(key)
        if existing is None or _leverage(hit) > _leverage(existing):
            out[key] = hit
    return out


def _leverage(h: DetectorHit) -> float:
    top_rate = h.targets[0][1] if h.targets else 0.0
    if not top_rate and h.encoded:
        ts = h.encoded.get("targets", [])
        if ts:
            top_rate = ts[0]["hitRate"]
    return top_rate * min(h.distinct_values, h.sample_size)


# ─── property-block synthesis ───────────────────────────────────────────────

# Boilerplate descriptions for fields the detector didn't flag. Keyed by
# field name when a name strongly implies semantics from naming convention.
# Kept conservative — when in doubt the field gets a generic per-DTO note.
NAMING_HINTS: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"^strName$"),                      "The code name of this entry, as referred to in other files."),
    (re.compile(r"^strDescription$"),               "Player-facing description text."),
    (re.compile(r"^strTooltip$"),                   "Tooltip text shown on hover."),
    (re.compile(r"^strLabel$"),                     "Display label (player-facing)."),
    (re.compile(r"^strSprite"),                     "Sprite asset reference (resolved at runtime, not against data/)."),
    (re.compile(r"^strAnim"),                       "Animation asset reference (resolved at runtime, not against data/)."),
    (re.compile(r"^strSound|^strSFX"),              "Audio asset reference (resolved at runtime, not against data/)."),
    (re.compile(r"^strSchedule"),                   "Schedule rule (DSL string, not a strName reference)."),
    (re.compile(r"^strType$|^strKind$|^strCategory$"), "Enum tag dispatching to game code. NOT a strName reference."),
    (re.compile(r"^strBuildType$|^strJobType$|^strActionGroup$"), "Enum tag (free-form group name). NOT a strName reference."),
]


def name_hint(field_name: str) -> str | None:
    for pat, text in NAMING_HINTS:
        if pat.match(field_name):
            return text
    return None


def synthesize_description(
    folder_key: str,
    field: DtoField,
    hit: DetectorHit | None,
    classes: tuple[str, ...],
) -> tuple[str, dict]:
    """Return (description_text, extra_keys_dict) for this property."""
    extras: dict = {}

    # Encoded-only signal (no raw targets, but split-on-separator hits) — most
    # commonly the condition-string DSL (Name=value*duration → condtrigs.json)
    # via aInputs[*]-style fields. Handle this before the raw-targets path so
    # we don't miss it when hit.targets is empty.
    if hit is not None and not hit.targets and hit.encoded:
        sep = hit.encoded.get("separator", "=")
        enc_targets = hit.encoded.get("targets", [])
        if enc_targets:
            primary = enc_targets[0]["targetFolder"]
            if sep == "=":
                return (
                    f"Each entry is a condition string (Name=value*duration) — "
                    f"the name refers to entry within {primary}.json.",
                    extras,
                )
            # Other separators (",", "|") are LootItms / cumulative-loot shapes,
            # which need explicit x-shape values. Leave the field declared but
            # don't synthesize a (probably wrong) ref rule — flag for hand-tune.
            return (
                f"Encoded array (split on '{sep}') — first token of each entry "
                f"refers to entry within {primary}.json. Hand-tune x-shape "
                f"(LootItmsArray / InverseArray) before this fires.",
                extras,
            )

    # Raw detector signal (top-level value matches a (folder, strName) directly).
    if hit is not None and hit.targets:
        primary, rate = hit.targets[0]
        # Multi-target: declare fallbacks.
        all_targets = [t for t, r in hit.targets if r >= 0.30]
        if len(all_targets) >= 2:
            extras["x-targets"] = all_targets
            target_phrase = (
                f"refers to entry within {primary}.json (also resolves into "
                f"{', '.join(all_targets[1:])})"
            )
        else:
            target_phrase = f"refers to entry within {primary}.json"

        # Nested array of objects (aThresh[*].strLootNew → strLootNew sub-field).
        if hit.is_nested_path:
            extras["x-shape"] = "NestedDirectArray"
            extras["x-nested-field"] = hit.nested_subfield
            return (
                f"Each element is an object containing {hit.nested_subfield}, which "
                f"{target_phrase}.",
                extras,
            )

        # Top-level array path: StringArray. The schema type is set elsewhere
        # via cs_type_to_schema_type; the description just states the ref. Add
        # a "condition string" marker if the field name is a known cond-string
        # carrier (rare in this generation pass — most cond-string fields will
        # land in the encoded-only path above).
        if hit.is_array_path and looks_like_cond_string_field(field.name):
            return (
                f"Array of condition strings (Name=value*duration) — each name "
                f"{target_phrase}.",
                extras,
            )

        if hit.is_array_path:
            return (
                f"Array of names — each {target_phrase}.",
                extras,
            )
        return (f"{target_phrase.capitalize()}.", extras)

    # No detector signal. Use naming hint if any, else generic per-DTO note.
    hint = name_hint(field.name)
    if hint:
        return (hint, extras)
    cls_label = classes[0] if len(classes) == 1 else "/".join(classes)
    return (
        f"(Per {cls_label} decomp; no auto-detected ref signal — "
        f"hand-tune description if this field is a strName reference.)",
        extras,
    )


COND_STRING_FIELDS = {
    "aStartingConds", "aInputs", "aGivers", "aTargets",
}


def looks_like_cond_string_field(name: str) -> bool:
    return name in COND_STRING_FIELDS


# ─── full schema-file synthesis ─────────────────────────────────────────────

def build_schema_doc(
    folder_key: str,
    classes: tuple[str, ...],
    detector: dict[tuple[str, str], DetectorHit],
) -> tuple[dict, dict]:
    """Return (schema_doc, stats_dict)."""
    # Union of fields across all DTOs in the loader-bound class set.
    union: dict[str, DtoField] = {}
    for cls in classes:
        for f in parse_dto_fields(cls):
            if f.name not in union:
                union[f.name] = f

    properties: dict[str, dict] = {}
    n_ref = 0
    n_skipped_type = 0
    n_no_signal = 0
    for name, field in union.items():
        st = cs_type_to_schema_type(field.cs_type)
        if st is None:
            n_skipped_type += 1
            continue
        hit = detector.get((folder_key, name))
        desc, extras = synthesize_description(folder_key, field, hit, classes)
        prop: dict = {**st, "description": desc, **extras}
        properties[name] = prop
        if hit and (hit.targets or hit.encoded):
            n_ref += 1
        else:
            n_no_signal += 1

    # strName must come first (convention of every existing schema).
    ordered_props: dict[str, dict] = {}
    if "strName" in properties:
        ordered_props["strName"] = properties.pop("strName")
    for k in sorted(properties.keys()):
        ordered_props[k] = properties[k]

    classes_label = ", ".join(classes)
    doc = {
        "$schema": "http://json-schema.org/draft-07/schema",
        "$comment": (
            f"Generated by utils/python/generate_missing_schemas.py from "
            f"decomp DTO union [{classes_label}]; descriptions on ref-carrier "
            f"fields use the candidate detector's top target. Hand-tune fields "
            f"flagged 'no auto-detected ref signal' if they are strName references."
        ),
        "type": "array",
        "items": {
            "type": "object",
            "additionalProperties": True,
            "properties": ordered_props,
        },
    }
    stats = {
        "total": len(union),
        "emitted": len(ordered_props),
        "ref": n_ref,
        "no_signal": n_no_signal,
        "skipped_complex_type": n_skipped_type,
    }
    return doc, stats


# ─── orchestration ──────────────────────────────────────────────────────────

def write_schema(folder_key: str, doc: dict) -> Path:
    OVERLAY_DIR.mkdir(parents=True, exist_ok=True)
    out = OVERLAY_DIR / f"{folder_key}-schema.json"
    out.write_text(
        json.dumps(doc, indent=4, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    return out


def main() -> int:
    # Windows consoles default to cp1252; we emit unicode arrows/etc. in status text.
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except (AttributeError, OSError):
        pass

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--folder", help="Generate only this folder_key.")
    parser.add_argument("--dry-run", action="store_true",
                        help="Print plan without writing files.")
    args = parser.parse_args()

    detector = load_detector_candidates()
    cohort: list[UnmodeledFolder] = unmodeled_folders(parse_loader_dispatches())
    if args.folder:
        cohort = [u for u in cohort if u.folder_key == args.folder]
        if not cohort:
            print(f"folder '{args.folder}' is not in the unmodeled cohort", file=sys.stderr)
            return 2

    print(f"Generating overlays for {len(cohort)} folder(s) → {OVERLAY_DIR}\n")
    print(f"{'folder':<24} {'fields':<7} {'ref':<5} {'noSig':<6} {'skip':<5}  classes")
    print("-" * 100)

    grand: dict[str, int] = {"total": 0, "emitted": 0, "ref": 0, "no_signal": 0, "skipped_complex_type": 0}
    for u in cohort:
        doc, stats = build_schema_doc(u.folder_key, u.classes, detector)
        for k, v in stats.items():
            grand[k] = grand.get(k, 0) + v
        cls = ", ".join(u.classes)
        print(f"{u.folder_key:<24} "
              f"{stats['emitted']:>4}/{stats['total']:<2} "
              f"{stats['ref']:<5} "
              f"{stats['no_signal']:<6} "
              f"{stats['skipped_complex_type']:<5}  "
              f"{cls}")
        if not args.dry_run:
            write_schema(u.folder_key, doc)

    print("-" * 100)
    print(f"{'TOTAL':<24} "
          f"{grand['emitted']:>4}/{grand['total']:<2} "
          f"{grand['ref']:<5} "
          f"{grand['no_signal']:<6} "
          f"{grand['skipped_complex_type']:<5}")
    print()
    print(f"  ref     = field has detector signal → schema rule will fire (edges produced)")
    print(f"  noSig   = field declared but no detector signal (description added; no edges)")
    print(f"  skip    = non-string-shaped field (object/dict) — schema can't carry a strName ref")
    if args.dry_run:
        print("\n(dry-run — no files written)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
