using System.Globalization;

namespace Ostranauts.DataModel;

/// <summary>
/// Decomposed loot-entry string used in <c>Loot.aCOs</c> and similar fields.
/// Wire format per CLAUDE.md "Reference-extraction notes":
/// <c>[-]Name=chance x min[-max]</c>, with optional leading <c>-</c> for
/// negative payouts and an optional <c>|</c>-delimited cumulative-probability
/// sublist within a single array slot.
/// Examples: "Coughing=1.0x1", "-RELStranger=1.0x1",
/// "OKLGLEO=1.0x1-2", "Foo=0.5x1|Bar=0.5x1".
/// </summary>
public sealed record LootString(
    string Name,
    double Chance,
    double MinCount,
    double MaxCount,
    bool Positive);

public static class LootStringParser
{
    /// <summary>
    /// Parses one array slot, which may contain multiple <c>|</c>-separated
    /// entries (cumulative-probability alternatives). Returns one LootString
    /// per parsed entry. Malformed entries are silently skipped.
    /// </summary>
    public static IEnumerable<LootString> ParseSlot(string raw)
    {
        if (string.IsNullOrWhiteSpace(raw)) yield break;
        foreach (var entry in raw.Split('|'))
        {
            var parsed = TryParseSingle(entry);
            if (parsed is not null) yield return parsed;
        }
    }

    /// <summary>
    /// Parses one entry (no <c>|</c>). Format:
    /// <c>[-]Name=chance x min[-max]</c>. Returns null on malformed input.
    /// </summary>
    public static LootString? TryParseSingle(string raw)
    {
        if (string.IsNullOrWhiteSpace(raw)) return null;
        raw = raw.Trim();

        var positive = true;
        if (raw.StartsWith("-", StringComparison.Ordinal))
        {
            positive = false;
            raw = raw.Substring(1);
        }

        var eq = raw.LastIndexOf('=');
        if (eq <= 0 || eq == raw.Length - 1) return null;

        var name = raw.Substring(0, eq).Trim();
        if (string.IsNullOrEmpty(name)) return null;

        var rest = raw.Substring(eq + 1);
        var x = rest.IndexOf('x');
        if (x <= 0 || x == rest.Length - 1) return null;

        if (!double.TryParse(rest.Substring(0, x), NumberStyles.Float, CultureInfo.InvariantCulture, out var chance))
            return null;

        var range = rest.Substring(x + 1);
        // Range can be "min" (single) or "min-max". A leading minus would have been
        // stripped above; here we look for an internal hyphen separating min and max.
        var dash = range.IndexOf('-', startIndex: 1);
        double min, max;
        if (dash > 0)
        {
            if (!double.TryParse(range.Substring(0, dash), NumberStyles.Float, CultureInfo.InvariantCulture, out min)
                || !double.TryParse(range.Substring(dash + 1), NumberStyles.Float, CultureInfo.InvariantCulture, out max))
                return null;
        }
        else
        {
            if (!double.TryParse(range, NumberStyles.Float, CultureInfo.InvariantCulture, out min))
                return null;
            max = min;
        }

        return new LootString(name, chance, min, max, positive);
    }
}
