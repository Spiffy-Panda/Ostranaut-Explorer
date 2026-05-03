using System.Globalization;

namespace Ostranauts.DataModel;

/// <summary>
/// Decomposed condition-string entry. The wire format is
/// <c>&lt;Name&gt;=&lt;Value&gt;x&lt;Duration&gt;</c>, e.g. "IsSystem=1.0x1".
/// Value is preserved as a double; Duration as an int.
/// Both are kept on edges that reference conditions so detail pages
/// can aggregate "default value X across N owners."
/// </summary>
public sealed record CondString(string Name, double Value, int Duration);

public static class CondStringParser
{
    /// <summary>
    /// Parses one condition string. Returns null if the input doesn't
    /// match the expected shape — caller decides how to surface that.
    /// </summary>
    public static CondString? TryParse(string raw)
    {
        if (string.IsNullOrWhiteSpace(raw)) return null;

        var eq = raw.IndexOf('=');
        if (eq <= 0 || eq == raw.Length - 1) return null;

        var name = raw[..eq];

        var rest = raw[(eq + 1)..];
        var x = rest.IndexOf('x');
        if (x <= 0 || x == rest.Length - 1) return null;

        if (!double.TryParse(rest[..x], NumberStyles.Float, CultureInfo.InvariantCulture, out var value))
            return null;
        if (!int.TryParse(rest[(x + 1)..], NumberStyles.Integer, CultureInfo.InvariantCulture, out var duration))
            return null;

        return new CondString(name, value, duration);
    }
}
