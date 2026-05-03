namespace Ostranauts.DataModel;

/// <summary>
/// Forward + reverse index over the parsed objects and the references
/// extracted from them. The site frontend reads these via GraphExporter;
/// the future LSP reads them in-process.
///
/// When the input contains duplicate (Folder, StrName) keys the LATER
/// entry wins for lookups (matches the game's load-order semantics).
/// All duplicates remain visible via <see cref="Duplicates"/>.
/// </summary>
public sealed class ObjectIndex
{
    private readonly Dictionary<(string folder, string name), DataObject> _byKey;
    private readonly ILookup<(string folder, string name), Reference> _outgoing;
    private readonly ILookup<(string folder, string name), Reference> _incoming;
    private readonly Dictionary<(string folder, string name), List<DataObject>> _duplicates;

    public IReadOnlyList<DataObject> Objects { get; }
    public IReadOnlyList<Reference> References { get; }

    /// <summary>
    /// Keys that appeared more than once in the input, mapped to all
    /// definitions in load order. The canonical entry (last-wins) is the
    /// final element in each list. Surfaces on the future health page.
    /// </summary>
    public IReadOnlyDictionary<(string folder, string name), List<DataObject>> Duplicates => _duplicates;

    public ObjectIndex(
        IEnumerable<DataObject> objects,
        IEnumerable<Reference> references,
        Action<string>? onWarning = null)
    {
        Objects = objects.ToList();
        References = references.ToList();

        _byKey = new Dictionary<(string folder, string name), DataObject>();
        _duplicates = new Dictionary<(string folder, string name), List<DataObject>>();

        foreach (var obj in Objects)
        {
            var key = (obj.Folder, obj.StrName);
            if (_byKey.TryGetValue(key, out var prior))
            {
                if (!_duplicates.TryGetValue(key, out var list))
                {
                    list = new List<DataObject> { prior };
                    _duplicates[key] = list;
                }
                list.Add(obj);
                onWarning?.Invoke($"duplicate strName: {obj.Folder}:{obj.StrName} — '{obj.FilePath}' overrides '{prior.FilePath}'");
            }
            _byKey[key] = obj; // last-wins
        }

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
