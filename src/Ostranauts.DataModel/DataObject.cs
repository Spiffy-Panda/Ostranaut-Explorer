namespace Ostranauts.DataModel;

/// <summary>
/// One parsed entry from a data/&lt;folder&gt;/*.json array. Identified
/// by the (Folder, StrName) tuple — globally unique within base game data.
/// </summary>
public sealed record DataObject(
    string Folder,
    string FilePath,
    string StrName,
    string RawJson);
