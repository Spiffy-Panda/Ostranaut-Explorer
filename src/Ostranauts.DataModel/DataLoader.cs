using System.Text.Json;

namespace Ostranauts.DataModel;

/// <summary>
/// Walks a data root, parses every JSON-array file, yields one
/// DataObject per array entry.
/// </summary>
public static class DataLoader
{
    /// <summary>
    /// Folders under <c>data/</c> that aren't JSON-array-of-objects and must be skipped.
    /// `schemas/` is also skipped here — that's <see cref="SchemaLoader"/>'s job.
    /// </summary>
    private static readonly HashSet<string> SkippedFolders = new(StringComparer.OrdinalIgnoreCase)
    {
        "schemas",
        "strings",
        "tsv",
        "ai_training",
    };

    private static readonly JsonDocumentOptions ParseOptions = new()
    {
        AllowTrailingCommas = true,
        CommentHandling = JsonCommentHandling.Skip,
    };

    /// <summary>
    /// Walks <paramref name="dataRoot"/>'s immediate subdirectories. For each folder
    /// not in <see cref="SkippedFolders"/>, parses every <c>*.json</c> file as a
    /// top-level array and yields one DataObject per element.
    ///
    /// Streams via yield so the entire data tree never has to sit in memory at once.
    ///
    /// Files that fail to parse, or aren't arrays at the top level, or contain entries
    /// without a "strName" string property, are reported via <paramref name="onWarning"/>
    /// (if supplied) and skipped without throwing.
    /// </summary>
    public static IEnumerable<DataObject> Load(string dataRoot, Action<string>? onWarning = null)
    {
        if (!Directory.Exists(dataRoot))
            throw new DirectoryNotFoundException($"data root not found: {dataRoot}");

        foreach (var folderPath in Directory.EnumerateDirectories(dataRoot))
        {
            var folder = Path.GetFileName(folderPath);
            if (SkippedFolders.Contains(folder)) continue;

            foreach (var filePath in Directory.EnumerateFiles(folderPath, "*.json", SearchOption.TopDirectoryOnly))
            {
                JsonDocument? doc;
                try
                {
                    using var stream = File.OpenRead(filePath);
                    doc = JsonDocument.Parse(stream, ParseOptions);
                }
                catch (JsonException ex)
                {
                    onWarning?.Invoke($"skip (parse error): {filePath} — {ex.Message}");
                    continue;
                }

                using (doc)
                {
                    if (doc.RootElement.ValueKind != JsonValueKind.Array)
                    {
                        onWarning?.Invoke($"skip (not a top-level array): {filePath}");
                        continue;
                    }

                    foreach (var element in doc.RootElement.EnumerateArray())
                    {
                        if (element.ValueKind != JsonValueKind.Object) continue;
                        if (!element.TryGetProperty("strName", out var nameProp)
                            || nameProp.ValueKind != JsonValueKind.String)
                        {
                            onWarning?.Invoke($"skip (entry missing strName): {filePath}");
                            continue;
                        }

                        var strName = nameProp.GetString();
                        if (string.IsNullOrEmpty(strName)) continue;

                        // Clone() detaches the element from the soon-to-be-disposed JsonDocument.
                        yield return new DataObject(folder, filePath, strName!, element.Clone());
                    }
                }
            }
        }
    }
}
