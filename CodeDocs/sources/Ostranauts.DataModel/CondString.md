# CondString.cs

**Path:** `src/Ostranauts.DataModel/CondString.cs`
**Status:** real

## Purpose

Decomposes the embedded condition-string DSL Ostranauts uses in fields like `aStartingConds`. The wire format is `<Name>=<Value>x<Duration>` (e.g. `"IsSystem=1.0x1"` means "set condition `IsSystem` to value `1.0` for duration `1`"). The value and duration are gameplay state we want to preserve on edges so condition detail pages can aggregate ("default 1.0 across N owners").

## Public API

```csharp
public sealed record CondString(string Name, double Value, int Duration);

public static class CondStringParser
{
    // Parses one condition string. Returns null on malformed input.
    public static CondString? TryParse(string raw);
}
```

`Value` parses with `InvariantCulture` (decimal point, never comma). `Duration` parses as integer.

## Depends on

- `System.Globalization` (only).

## Used by

- `ReferenceExtractor` (will use once real, to crack `aStartingConds`-style fields and attach value+duration as `Reference.Metadata`).
- `CondStringParserTests`.
