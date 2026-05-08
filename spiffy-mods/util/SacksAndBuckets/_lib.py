"""Shared helpers for the SacksAndBuckets generators.

All generators in this folder import `load_config()` from here and use the
same conventions: paths are repo-relative; the repo root resolves to
Path(__file__).resolve().parents[3] (since this file lives at
spiffy-mods/util/SacksAndBuckets/_lib.py, four levels deep from root).
"""

from __future__ import annotations

import json
from collections import OrderedDict
from pathlib import Path
from typing import Any

import yaml


REPO_ROOT = Path(__file__).resolve().parents[3]
CONFIG_PATH = Path(__file__).resolve().parent / "config.yaml"


def load_config() -> dict[str, Any]:
    """Read config.yaml as a dict. Sole entry point for config access."""
    with CONFIG_PATH.open("r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def write_json(out_path: Path, payload: Any) -> None:
    """Write JSON with 2-space indent, UTF-8 no BOM, trailing newline.

    Matches the style of vanilla data files closely enough that the
    explorer's diff view doesn't get noisy. We also ensure the file lives
    at out_path; parent dirs are created if missing.
    """
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", encoding="utf-8", newline="\n") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
        f.write("\n")


def ordered(*pairs: tuple[str, Any]) -> "OrderedDict[str, Any]":
    """Build an OrderedDict from an arg list of (key, value) tuples.

    Used so generated JSON has a stable, vanilla-ish field order rather
    than whatever Python's dict happens to preserve from literal layout.
    """
    return OrderedDict(pairs)


def title_case(noun: str) -> str:
    """'small mech parts' -> 'Small Mech Parts'. Matches PowerShell's
    ToTitleCase output the prior generators emitted, for visual stability."""
    return " ".join(w.capitalize() for w in noun.split())
