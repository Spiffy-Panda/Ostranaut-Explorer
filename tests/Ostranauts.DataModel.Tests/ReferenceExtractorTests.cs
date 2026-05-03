using System.Text.Json;
using Ostranauts.DataModel;
using Xunit;

namespace Ostranauts.DataModel.Tests;

public class ReferenceExtractorTests
{
    private static SchemaCatalog Catalog(params SchemaCatalog.FieldRule[] rules) => new(rules);

    private static DataObject Object(string folder, string name, string json) =>
        new(folder, "<test>", name, JsonDocument.Parse(json).RootElement.Clone());

    private static SchemaCatalog.FieldRule Direct(string folder, string field, string target) =>
        new(folder, field, target, SchemaCatalog.FieldShape.Direct);

    private static SchemaCatalog.FieldRule Array(string folder, string field, string target) =>
        new(folder, field, target, SchemaCatalog.FieldShape.StringArray);

    private static SchemaCatalog.FieldRule Cond(string folder, string field, string target) =>
        new(folder, field, target, SchemaCatalog.FieldShape.CondStringArray);

    [Fact]
    public void Direct_string_field_emits_one_reference()
    {
        var obj = Object("condowners", "Owner1", """{"strName":"Owner1","strItemDef":"ItemA"}""");
        var refs = ReferenceExtractor.Extract(obj, Catalog(Direct("condowners", "strItemDef", "items"))).ToList();

        var r = Assert.Single(refs);
        Assert.Equal("condowners", r.SourceFolder);
        Assert.Equal("Owner1", r.SourceName);
        Assert.Equal("strItemDef", r.SourceField);
        Assert.Equal("items", r.TargetFolder);
        Assert.Equal("ItemA", r.TargetName);
        Assert.Equal(RefKind.Direct, r.Kind);
        Assert.Null(r.Metadata);
    }

    [Fact]
    public void StringArray_emits_one_reference_per_string()
    {
        var obj = Object("condowners", "Owner1", """{"aInteractions":["IntA","IntB","IntC"]}""");
        var refs = ReferenceExtractor.Extract(obj, Catalog(Array("condowners", "aInteractions", "interactions"))).ToList();

        Assert.Equal(3, refs.Count);
        Assert.All(refs, r =>
        {
            Assert.Equal(RefKind.DirectInArray, r.Kind);
            Assert.Equal("interactions", r.TargetFolder);
            Assert.Equal("aInteractions", r.SourceField);
        });
        Assert.Equal(new[] { "IntA", "IntB", "IntC" }, refs.Select(r => r.TargetName));
    }

    [Fact]
    public void CondStringArray_emits_Condition_refs_with_value_and_duration_metadata()
    {
        var obj = Object("condowners", "Owner1", """{"aStartingConds":["IsSystem=1.0x1","DcHungry=0.5x10"]}""");
        var refs = ReferenceExtractor.Extract(obj, Catalog(Cond("condowners", "aStartingConds", "conditions"))).ToList();

        Assert.Equal(2, refs.Count);
        var first = refs[0];
        Assert.Equal(RefKind.Condition, first.Kind);
        Assert.Equal("conditions", first.TargetFolder);
        Assert.Equal("IsSystem", first.TargetName);
        Assert.NotNull(first.Metadata);
        Assert.Equal(1.0, (double)first.Metadata!["value"]);
        Assert.Equal(1, (int)first.Metadata!["duration"]);
    }

    [Fact]
    public void Placeholder_tokens_are_skipped()
    {
        // [us] and [them] in strItemDef should not produce a reference.
        var obj = Object("condowners", "Owner1", """{"strItemDef":"[us]"}""");
        var refs = ReferenceExtractor.Extract(obj, Catalog(Direct("condowners", "strItemDef", "items"))).ToList();
        Assert.Empty(refs);

        var arr = Object("condowners", "Owner2", """{"aInteractions":["RealOne","[them]","[3rd]","RealTwo"]}""");
        var arrRefs = ReferenceExtractor.Extract(arr, Catalog(Array("condowners", "aInteractions", "interactions"))).ToList();
        Assert.Equal(2, arrRefs.Count);
        Assert.Equal(new[] { "RealOne", "RealTwo" }, arrRefs.Select(r => r.TargetName));
    }

    [Fact]
    public void Null_string_fields_emit_no_reference()
    {
        var obj = Object("condowners", "Owner1", """{"strItemDef":null}""");
        var refs = ReferenceExtractor.Extract(obj, Catalog(Direct("condowners", "strItemDef", "items"))).ToList();
        Assert.Empty(refs);
    }

    [Fact]
    public void Empty_string_emits_no_reference()
    {
        var obj = Object("condowners", "Owner1", """{"strItemDef":""}""");
        var refs = ReferenceExtractor.Extract(obj, Catalog(Direct("condowners", "strItemDef", "items"))).ToList();
        Assert.Empty(refs);
    }

    [Fact]
    public void Fields_without_a_rule_are_silently_skipped()
    {
        var obj = Object("condowners", "Owner1", """{"strRandomField":"SomeValue","strItemDef":"ItemA"}""");
        var refs = ReferenceExtractor.Extract(obj, Catalog(Direct("condowners", "strItemDef", "items"))).ToList();

        var r = Assert.Single(refs);
        Assert.Equal("strItemDef", r.SourceField);
    }

    [Fact]
    public void Wrong_field_value_kind_emits_no_reference()
    {
        // strItemDef rule expects a string, but here it's a number.
        var obj = Object("condowners", "Owner1", """{"strItemDef":42}""");
        var refs = ReferenceExtractor.Extract(obj, Catalog(Direct("condowners", "strItemDef", "items"))).ToList();
        Assert.Empty(refs);
    }

    [Fact]
    public void Malformed_cond_strings_are_skipped_in_array()
    {
        var obj = Object("condowners", "Owner1", """{"aStartingConds":["GoodOne=1.0x1","NoEqualsHere","GoodTwo=0.5x5"]}""");
        var refs = ReferenceExtractor.Extract(obj, Catalog(Cond("condowners", "aStartingConds", "conditions"))).ToList();

        Assert.Equal(2, refs.Count);
        Assert.Equal(new[] { "GoodOne", "GoodTwo" }, refs.Select(r => r.TargetName));
    }
}
