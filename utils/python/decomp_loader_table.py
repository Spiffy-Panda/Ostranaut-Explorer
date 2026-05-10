"""decomp_loader_table.py

Parses ``decomp/Assembly-CSharp/DataHandler.cs`` for every
``LoadModJsons<JsonXxx>(strFolderPath + "yyy/", DataHandler.dictZzz, ...)``
dispatch line and emits the ground-truth (class, folder) table the game
itself uses.

Companion to ``decomp_schema_table.py`` / ``decomp_schema_crosscheck.py``,
which both used to carry hand-curated ``CLASS_TO_SCHEMA`` allowlists.
Those allowlists silently skipped DTOs that hadn't been pre-registered
(``installables``, ``ads``, ``cooverlays``, ...). This module replaces the
allowlist with discovery so the audits cover the full cohort.

Usage:
    python utils/python/decomp_loader_table.py
        # Prints the (class, folder) table and the unmodeled-folder cohort.

    python utils/python/decomp_loader_table.py --classes
        # Re-emits CLASS_TO_SCHEMA-shaped Python dict for paste-in use.

The functions are also importable: ``parse_loader_dispatches()`` returns
the list of ``LoaderEntry``; ``unmodeled_folders()`` reports which loader
entries don't yet have a schema in either schema dir.
"""

from __future__ import annotations

import argparse
import re
import sys
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATAHANDLER_CS = ROOT / "decomp" / "Assembly-CSharp" / "DataHandler.cs"
SCHEMA_DIRS = [
    ROOT / "data" / "schemas",
    ROOT / "comment_mod" / "data" / "schemas",
]
DECOMP_DIR = ROOT / "decomp" / "Assembly-CSharp"
DATA_DIR = ROOT / "data"

# DataHandler.LoadModJsons<JsonXxx>(strFolderPath + "yyy/", DataHandler.dictZzz, aIgnorePatterns)
LOADER_RE = re.compile(
    r'LoadModJsons<\s*(?P<cls>[A-Za-z_]\w*)\s*>\s*\(\s*'
    r'strFolderPath\s*\+\s*"(?P<folder>[^"]+)"',
)

# JsonSimple is a generic key→value DTO used for many string tables that
# aren't conceptually "data folders with cross-refs" (names_first, strings,
# manpages, traitscores, conditions_simple, crewskins, ...). They're loaded
# but they don't carry strName references the schema regex would discover.
SIMPLE_DTO = "JsonSimple"

# Folders DataLoader.cs explicitly skips (mirror of SkippedFolders there).
# These never produce DataObjects, so a schema for them would never fire.
PARSER_SKIPPED = frozenset({"schemas", "strings", "tsv", "ai_training", "glossary"})


@dataclass(frozen=True)
class LoaderEntry:
    cls: str           # e.g. "JsonInstallable"
    folder_path: str   # e.g. "installables/" or "attackmodes/coAttacks"
    folder_key: str    # canonicalised — trailing slash stripped, used as schema base name

    @property
    def is_simple(self) -> bool:
        return self.cls == SIMPLE_DTO


def _canonical_folder_key(folder_path: str) -> str:
    """Schema base names mirror what DataLoader uses as DataObject.Folder, which
    is the immediate child of ``data/`` (Path.GetFileName(folderPath) on the
    top-level dir). For nested loader paths like ``attackmodes/coAttacks`` or
    ``market/Markets/``, the parser still groups under the top-level segment
    (``attackmodes``, ``market``) and recurses into subfolders for files. Pick
    the LEFTMOST non-empty segment so multi-DTO loaders share one schema key."""
    parts = [p for p in folder_path.split("/") if p]
    return parts[0] if parts else folder_path


def parse_loader_dispatches(datahandler_cs: Path = DATAHANDLER_CS) -> list[LoaderEntry]:
    """Return every LoadModJsons dispatch found in DataHandler.cs, in source
    order. Both the LoadAllData() and LoadMod() blocks are emitted; duplicates
    (same cls+folder appearing in both blocks) are de-duplicated."""
    text = datahandler_cs.read_text(encoding="utf-8-sig")
    seen: set[tuple[str, str]] = set()
    out: list[LoaderEntry] = []
    for m in LOADER_RE.finditer(text):
        cls = m.group("cls")
        folder_path = m.group("folder")
        key = (cls, folder_path)
        if key in seen:
            continue
        seen.add(key)
        out.append(
            LoaderEntry(
                cls=cls,
                folder_path=folder_path,
                folder_key=_canonical_folder_key(folder_path),
            )
        )
    return out


def schema_exists(folder_key: str) -> bool:
    filename = f"{folder_key}-schema.json"
    return any((d / filename).exists() for d in SCHEMA_DIRS)


def dto_path(cls: str) -> Path | None:
    p = DECOMP_DIR / f"{cls}.cs"
    return p if p.exists() else None


def data_folder_present(folder_path: str) -> bool:
    """Whether ``data/<folder_path>/`` exists with at least one .json. Some
    loader entries point at folders that ship no data in the base game."""
    candidate = DATA_DIR / folder_path
    if not candidate.exists() or not candidate.is_dir():
        return False
    return any(candidate.rglob("*.json"))


@dataclass(frozen=True)
class UnmodeledFolder:
    folder_key: str            # parser folder name = data/<folder_key>
    classes: tuple[str, ...]   # all DTO classes the loader binds to this folder
    folder_paths: tuple[str, ...]  # all loader paths that feed this folder
    has_data: bool


def unmodeled_folders(
    entries: list[LoaderEntry] | None = None,
    *,
    skip_simple: bool = True,
    skip_parser_excluded: bool = True,
) -> list[UnmodeledFolder]:
    """Loader entries whose parser folder (top-level data/ child) lacks a schema.
    Multiple loader entries collapse onto a single folder_key — e.g. attackmodes
    is fed by both JsonAttackMode (coAttacks/) and JsonShipAttack (shipAttacks/).
    By default skips JsonSimple cohorts (string tables, no refs) and folders
    DataLoader explicitly skips."""
    entries = entries or parse_loader_dispatches()

    # Group entries by parser folder_key.
    grouped: dict[str, list[LoaderEntry]] = {}
    for e in entries:
        grouped.setdefault(e.folder_key, []).append(e)

    out: list[UnmodeledFolder] = []
    for folder_key, group in grouped.items():
        if skip_parser_excluded and folder_key in PARSER_SKIPPED:
            continue
        if schema_exists(folder_key):
            continue
        # If every entry in the group is JsonSimple, drop the folder entirely.
        non_simple = [e for e in group if not e.is_simple]
        if skip_simple and not non_simple:
            continue
        # Use only the non-simple DTOs for the schema; if none, fall back to all.
        dtos = non_simple if (skip_simple and non_simple) else group
        # Stable order: by folder_path so coAttacks < shipAttacks, etc.
        dtos = sorted(dtos, key=lambda e: e.folder_path)
        # De-dupe classes (a single DTO might map to multiple paths; rare).
        seen_cls: set[str] = set()
        unique_classes: list[str] = []
        for e in dtos:
            if e.cls not in seen_cls:
                seen_cls.add(e.cls)
                unique_classes.append(e.cls)
        out.append(
            UnmodeledFolder(
                folder_key=folder_key,
                classes=tuple(unique_classes),
                folder_paths=tuple(e.folder_path for e in dtos),
                has_data=any(data_folder_present(e.folder_path) for e in dtos),
            )
        )
    out.sort(key=lambda u: u.folder_key)
    return out


def _print_full_table(entries: list[LoaderEntry]) -> None:
    print(f"{len(entries)} loader dispatches found in DataHandler.cs\n")
    print(f"{'class':<30} {'folder_path':<40} {'schema?':<8} {'dto?':<5} {'data?':<5}")
    print("-" * 92)
    for e in entries:
        sch = "Y" if schema_exists(e.folder_key) else "."
        dto = "Y" if dto_path(e.cls) else "."
        dat = "Y" if data_folder_present(e.folder_path) else "."
        if e.is_simple:
            sch = "(simple)"
        print(f"{e.cls:<30} {e.folder_path:<40} {sch:<8} {dto:<5} {dat:<5}")


def _print_unmodeled(unmodeled: list[UnmodeledFolder]) -> None:
    print(f"\n=== UNMODELED FOLDERS: {len(unmodeled)} ===")
    print("(parser folders DataHandler loads but no <folder>-schema.json exists)\n")
    print(f"{'folder_key':<24} {'data':<5} {'classes':<60} {'loader paths'}")
    print("-" * 130)
    for u in unmodeled:
        dat = "Y" if u.has_data else "."
        cls_str = ", ".join(u.classes)
        paths_str = ", ".join(u.folder_paths)
        print(f"{u.folder_key:<24} {dat:<5} {cls_str:<60} {paths_str}")


def _emit_classes_dict(entries: list[LoaderEntry]) -> None:
    """For drop-in replacement of the hand-curated CLASS_TO_SCHEMA dicts."""
    seen: set[str] = set()
    print("CLASS_TO_SCHEMA = {")
    for e in entries:
        if e.is_simple:
            continue
        if e.cls in seen:
            continue
        seen.add(e.cls)
        print(f"    {e.cls!r:<32}: {e.folder_key!r},")
    print("}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--classes", action="store_true",
                        help="Print CLASS_TO_SCHEMA-shaped dict and exit.")
    parser.add_argument("--include-simple", action="store_true",
                        help="Include JsonSimple folders in unmodeled report.")
    args = parser.parse_args()

    if not DATAHANDLER_CS.exists():
        print(f"ERROR: {DATAHANDLER_CS} not found", file=sys.stderr)
        return 2

    entries = parse_loader_dispatches()
    if not entries:
        print("ERROR: no LoadModJsons dispatches matched", file=sys.stderr)
        return 2

    if args.classes:
        _emit_classes_dict(entries)
        return 0

    _print_full_table(entries)
    _print_unmodeled(unmodeled_folders(entries, skip_simple=not args.include_simple))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
