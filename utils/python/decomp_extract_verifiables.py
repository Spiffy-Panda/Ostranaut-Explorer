"""decomp_extract_verifiables.py

Extracts the full GetVerifiables() method body from every IVerifiable class
in decomp/Assembly-CSharp/ and prints them with source file + line numbers.

Usage:
    python ./utils/python/decomp_extract_verifiables.py
"""

from pathlib import Path

DECOMP = Path(__file__).resolve().parents[2] / "decomp" / "Assembly-CSharp"

TARGETS = [
    "JsonCond",
    "JsonCondTrigger",
    "JsonCondOwner",
    "JsonInteraction",
    "JsonLoot",
    "Loot",
    "CondTrigger",
]


def extract_method(lines: list[str], sig: str) -> tuple[int, int] | None:
    start = next(
        (i for i, l in enumerate(lines) if sig in l and "public IDictionary" in l),
        None,
    )
    if start is None:
        return None
    depth = 0
    for i, l in enumerate(lines[start:], start):
        depth += l.count("{") - l.count("}")
        if depth == 0 and i > start:
            return (start, i)
    return None


for name in TARGETS:
    path = DECOMP / f"{name}.cs"
    if not path.exists():
        print(f"=== {name}: file not found ===\n")
        continue

    lines = path.read_text(encoding="utf-8-sig").splitlines()
    span = extract_method(lines, "GetVerifiables")
    if span is None:
        print(f"=== {name}: GetVerifiables not found ===\n")
        continue

    s, e = span
    print(f"=== {name} ({path.name} lines {s+1}-{e+1}) ===")
    print("\n".join(lines[s : e + 1]))
    print()
