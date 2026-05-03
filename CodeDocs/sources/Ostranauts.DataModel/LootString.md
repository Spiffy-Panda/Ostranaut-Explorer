# LootString.cs

**Path:** `src/Ostranauts.DataModel/LootString.cs`
**Status:** real

## Purpose

Decomposes the loot-entry DSL used in `Loot.aCOs`, `Loot.aLoots`, and similar fields. Wire format per CLAUDE.md "Reference-extraction notes": `[-]Name=chance x min[-max]`, with optional leading `-` for negative payouts and an optional `|`-delimited cumulative-probability sublist within a single array slot.

Examples seen in real data:
- `"Coughing=1.0x1"` — name + chance + count
- `"-RELStranger=1.0x1"` — negative payout
- `"OKLGLEO=1.0x1-2"` — count range
- `"Foo=0.5x1|Bar=0.5x1"` — two cumulative alternatives in one slot
- `"Volatile Prize Ship=1.0x1"` — names with spaces are valid

## Public API

```csharp
public sealed record LootString(
    string Name,
    double Chance,
    double MinCount,
    double MaxCount,
    bool Positive);

public static class LootStringParser
{
    // One slot from a JSON array — handles |-separated cumulative alternatives.
    public static IEnumerable<LootString> ParseSlot(string raw);

    // Single entry (no |). Returns null on malformed input.
    public static LootString? TryParseSingle(string raw);
}
```

`Chance`, `MinCount`, `MaxCount` parse with `InvariantCulture`. When the range part has no `-`, `MaxCount = MinCount`. The leading-`-` for negative payouts is detected before the `=` split, so names beginning with hyphens aren't currently supported (none observed in base data).

## Depends on

- `System.Globalization` (only).

## Used by

- `ReferenceExtractor.ExtractLootEntryArray` for fields with `FieldShape.LootEntryArray` (currently `loot.aCOs` and `loot.aLoots`).
- `LootStringParserTests`.
