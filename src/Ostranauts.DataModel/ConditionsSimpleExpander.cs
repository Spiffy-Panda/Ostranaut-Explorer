using System.Text;
using System.Text.Json;

namespace Ostranauts.DataModel;

/// <summary>
/// <para>
/// <c>conditions_simple/</c> is the one folder in the data tree that doesn't follow
/// the standard "array of objects, each with a strName" pattern. Its single file
/// contains a wrapper object whose <c>aValues</c> array is a FLAT sequence of values
/// where every 7 elements is one logical record:
/// </para>
/// <code>
/// [ strName, strNameFriendly, strDesc, nDisplaySelf, nDisplayOther, strColor, bInvert ]
/// </code>
/// <para>
/// We synthesize one DataObject per 7-tuple so the rest of the pipeline (extractor,
/// index, exporter) sees these as ordinary entries. The original wrapper object
/// ("Simple Conditions") is left in place — it's a legitimate manifest, just not
/// the level at which other folders' refs land.
/// </para>
/// <para>
/// Resolves the ~617 previously-dangling <c>homeworlds.aCondsCitizen</c> /
/// <c>aCondsResident</c> / <c>aCondsIllegal</c> edges that target conditions_simple/.
/// </para>
/// </summary>
public static class ConditionsSimpleExpander
{
    public const string Folder = "conditions_simple";

    private static readonly string[] FieldNames =
    {
        "strName", "strNameFriendly", "strDesc",
        "nDisplaySelf", "nDisplayOther", "strColor", "bInvert"
    };

    /// <summary>
    /// Walks every wrapper object in the <c>conditions_simple/</c> folder and
    /// yields one synthetic DataObject per 7-element tuple in its <c>aValues</c>
    /// array. Wrapper objects are NOT yielded — they're the input here, the caller
    /// keeps them via the original <c>DataLoader</c> output.
    /// </summary>
    public static IEnumerable<DataObject> Expand(
        IEnumerable<DataObject> objects,
        Action<string>? onWarning = null)
    {
        foreach (var obj in objects)
        {
            if (obj.Folder != Folder) continue;
            if (obj.Fields.ValueKind != JsonValueKind.Object) continue;
            if (!obj.Fields.TryGetProperty("aValues", out var arr)) continue;
            if (arr.ValueKind != JsonValueKind.Array) continue;

            var values = arr.EnumerateArray().ToList();
            var stride = FieldNames.Length;
            for (var i = 0; i + stride <= values.Count; i += stride)
            {
                var name = values[i].ValueKind == JsonValueKind.String
                    ? values[i].GetString()
                    : null;
                if (string.IsNullOrEmpty(name))
                {
                    onWarning?.Invoke(
                        $"conditions_simple: skipping tuple at offset {i} in '{obj.FilePath}' — non-string or empty strName");
                    continue;
                }

                // Build a JSON object literal for this tuple's fields. Use raw text
                // for each value so numbers/strings/bools all serialize correctly.
                var sb = new StringBuilder();
                sb.Append('{');
                for (var k = 0; k < stride; k++)
                {
                    if (k > 0) sb.Append(',');
                    sb.Append('"').Append(FieldNames[k]).Append("\":");
                    sb.Append(values[i + k].GetRawText());
                }
                sb.Append('}');

                using var doc = JsonDocument.Parse(sb.ToString());
                yield return new DataObject(
                    Folder: Folder,
                    FilePath: obj.FilePath,
                    StrName: name!,
                    Fields: doc.RootElement.Clone());
            }

            if (values.Count % stride != 0)
            {
                onWarning?.Invoke(
                    $"conditions_simple: '{obj.FilePath}' has {values.Count} aValues entries, not a multiple of {stride}");
            }
        }
    }
}
