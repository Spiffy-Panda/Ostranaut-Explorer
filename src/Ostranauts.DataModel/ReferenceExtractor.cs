namespace Ostranauts.DataModel;

/// <summary>
/// Given a DataObject and the SchemaCatalog, emits one Reference per
/// outgoing cross-reference found in the object's fields. v1 step 3.
/// </summary>
public static class ReferenceExtractor
{
    /// <summary>
    /// Scaffold stub. Real implementation walks the object's fields,
    /// consults SchemaCatalog.RuleFor() to know which fields are refs,
    /// dispatches per FieldShape (Direct / StringArray / CondStringArray),
    /// and yields a Reference per resolved target. Pronoun tokens
    /// (regex \[\w+\]) are skipped.
    /// </summary>
    public static IEnumerable<Reference> Extract(DataObject obj, SchemaCatalog catalog)
    {
        // TODO(v1): walk obj.RawJson fields against catalog rules.
        // For CondStringArray fields, use CondStringParser and attach
        // value+duration as Reference.Metadata.
        return Enumerable.Empty<Reference>();
    }
}
