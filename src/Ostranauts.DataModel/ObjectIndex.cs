namespace Ostranauts.DataModel;

/// <summary>
/// Forward + reverse index over the parsed objects and the references
/// extracted from them. The site frontend reads these via GraphExporter;
/// the future LSP reads them in-process.
/// </summary>
public sealed class ObjectIndex
{
    private readonly Dictionary<(string folder, string name), DataObject> _byKey;
    private readonly ILookup<(string folder, string name), Reference> _outgoing;
    private readonly ILookup<(string folder, string name), Reference> _incoming;

    public IReadOnlyList<DataObject> Objects { get; }
    public IReadOnlyList<Reference> References { get; }

    public ObjectIndex(IEnumerable<DataObject> objects, IEnumerable<Reference> references)
    {
        Objects = objects.ToList();
        References = references.ToList();
        _byKey = Objects.ToDictionary(o => (o.Folder, o.StrName));
        _outgoing = References.ToLookup(r => (r.SourceFolder, r.SourceName));
        _incoming = References.ToLookup(r => (r.TargetFolder, r.TargetName));
    }

    public DataObject? Get(string folder, string name) =>
        _byKey.TryGetValue((folder, name), out var o) ? o : null;

    public IEnumerable<Reference> Outgoing(string folder, string name) => _outgoing[(folder, name)];

    public IEnumerable<Reference> Incoming(string folder, string name) => _incoming[(folder, name)];

    /// <summary>Edges whose target isn't in the index — surfaced on the health page.</summary>
    public IEnumerable<Reference> DanglingReferences() =>
        References.Where(r => !_byKey.ContainsKey((r.TargetFolder, r.TargetName)));
}
