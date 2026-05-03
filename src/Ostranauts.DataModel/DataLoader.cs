namespace Ostranauts.DataModel;

/// <summary>
/// Walks a data root, parses every JSON-array file, yields one
/// DataObject per array entry. v1 step 2.
/// </summary>
public static class DataLoader
{
    /// <summary>
    /// Scaffold stub. Real implementation reads dataRoot/{folder}/*.json,
    /// parses each as a JSON array, and yields one DataObject per element.
    /// Folder name comes from the directory; FilePath is the source file;
    /// StrName is read from the object's "strName" property.
    /// </summary>
    public static IEnumerable<DataObject> Load(string dataRoot)
    {
        // TODO(v1): parse data/<folder>/*.json arrays into DataObjects.
        // Skip non-folder entries (DebugSocialAudit.csv, tsv/, strings/, etc.)
        // per the v1 scope decision in PROJECT-PITCH.md.
        return Enumerable.Empty<DataObject>();
    }
}
