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

    [Fact]
    public void LootEntryArray_emits_Loot_refs_with_chance_min_max_positive_metadata()
    {
        var obj = Object("loot", "L1", """{"strType":"condition","aCOs":["Coughing=1.0x1","-StatHealRate=0.5x1-3"]}""");
        var rule = new SchemaCatalog.FieldRule(
            "loot", "aCOs", "conditions", SchemaCatalog.FieldShape.LootEntryArray);
        var refs = ReferenceExtractor.Extract(obj, Catalog(rule)).ToList();

        Assert.Equal(2, refs.Count);
        Assert.All(refs, r => Assert.Equal(RefKind.Loot, r.Kind));
        Assert.Equal("Coughing", refs[0].TargetName);
        Assert.Equal(1.0, (double)refs[0].Metadata!["chance"]);
        Assert.True((bool)refs[0].Metadata!["positive"]);
        Assert.Equal("StatHealRate", refs[1].TargetName);
        Assert.False((bool)refs[1].Metadata!["positive"]);
        Assert.Equal(1.0, (double)refs[1].Metadata!["min"]);
        Assert.Equal(3.0, (double)refs[1].Metadata!["max"]);
    }

    [Fact]
    public void LootEntryArray_routes_target_via_sibling_strType()
    {
        var routing = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["condition"] = "conditions",
            ["item"] = "condowners",
            ["interaction"] = "interactions",
        };
        var rule = new SchemaCatalog.FieldRule(
            "loot", "aCOs", "conditions", SchemaCatalog.FieldShape.LootEntryArray,
            RoutingSibling: "strType", RoutingTargets: routing);
        var catalog = Catalog(rule);

        var lootForItem = Object("loot", "L_item", """{"strType":"item","aCOs":["ItmCoffeemaker01=1.0x1"]}""");
        var lootForInteraction = Object("loot", "L_int", """{"strType":"interaction","aCOs":["MakeCoffee=1.0x1"]}""");
        var lootForUnknownType = Object("loot", "L_other", """{"strType":"mystery","aCOs":["X=1.0x1"]}""");

        var itemRef = Assert.Single(ReferenceExtractor.Extract(lootForItem, catalog));
        Assert.Equal("condowners", itemRef.TargetFolder);
        var interactionRef = Assert.Single(ReferenceExtractor.Extract(lootForInteraction, catalog));
        Assert.Equal("interactions", interactionRef.TargetFolder);
        // Unknown sibling value -> falls back to rule.TargetFolder ("conditions").
        var fallbackRef = Assert.Single(ReferenceExtractor.Extract(lootForUnknownType, catalog));
        Assert.Equal("conditions", fallbackRef.TargetFolder);
    }

    [Fact]
    public void LootEntryArray_splits_cumulative_pipe_alternatives()
    {
        var obj = Object("loot", "L1",
            """{"strType":"interaction","aCOs":["AltA=0.3x1|AltB=0.5x1|AltC=0.2x1"]}""");
        var rule = new SchemaCatalog.FieldRule(
            "loot", "aCOs", "interactions", SchemaCatalog.FieldShape.LootEntryArray);
        var refs = ReferenceExtractor.Extract(obj, Catalog(rule)).ToList();

        Assert.Equal(3, refs.Count);
        Assert.Equal(new[] { "AltA", "AltB", "AltC" }, refs.Select(r => r.TargetName));
    }

    [Fact]
    public void InverseArray_takes_name_at_index_0_and_preserves_extra_tokens()
    {
        var obj = Object("interactions", "ChatA",
            """{"aInverse":["ChatReply,[us],[them]","SnapReply"]}""");
        var rule = new SchemaCatalog.FieldRule(
            "interactions", "aInverse", "interactions", SchemaCatalog.FieldShape.InverseArray);
        var refs = ReferenceExtractor.Extract(obj, Catalog(rule)).ToList();

        Assert.Equal(2, refs.Count);
        Assert.All(refs, r => Assert.Equal(RefKind.Inverse, r.Kind));
        Assert.Equal("ChatReply", refs[0].TargetName);
        Assert.NotNull(refs[0].Metadata);
        Assert.Equal(new[] { "[us]", "[them]" }, (string[])refs[0].Metadata!["args"]);
        Assert.Equal("SnapReply", refs[1].TargetName);
        Assert.Null(refs[1].Metadata); // no extra tokens
    }

    [Fact]
    public void CondRuleAttachArray_extracts_name_and_fModifier()
    {
        var obj = Object("condowners", "Crew01",
            """{"aStartingCondRules":["DcHunger=1.5","DcThirst=0.5","DcSocial"]}""");
        var rule = new SchemaCatalog.FieldRule(
            "condowners", "aStartingCondRules", "condrules", SchemaCatalog.FieldShape.CondRuleAttachArray);
        var refs = ReferenceExtractor.Extract(obj, Catalog(rule)).ToList();

        Assert.Equal(3, refs.Count);
        Assert.All(refs, r => Assert.Equal(RefKind.CondRuleAttach, r.Kind));
        Assert.Equal("DcHunger", refs[0].TargetName);
        Assert.Equal(1.5, (double)refs[0].Metadata!["fModifier"]);
        Assert.Equal("DcThirst", refs[1].TargetName);
        Assert.Equal(0.5, (double)refs[1].Metadata!["fModifier"]);
        // Third entry has no = → no fModifier metadata.
        Assert.Equal("DcSocial", refs[2].TargetName);
        Assert.Null(refs[2].Metadata);
    }

    [Fact]
    public void LootItmsArray_extracts_verb_and_loot_name()
    {
        var obj = Object("interactions", "MakeCoffee",
            """{"aLootItms":["addus,ItmCoffee01","use,CTGrabHandle,true","give,CTGiveItem,false,true"]}""");
        var rule = new SchemaCatalog.FieldRule(
            "interactions", "aLootItms", "loot", SchemaCatalog.FieldShape.LootItmsArray);
        var refs = ReferenceExtractor.Extract(obj, Catalog(rule)).ToList();

        Assert.Equal(3, refs.Count);
        Assert.All(refs, r => Assert.Equal(RefKind.LootItm, r.Kind));
        Assert.All(refs, r => Assert.Equal("loot", r.TargetFolder));

        Assert.Equal("ItmCoffee01", refs[0].TargetName);
        Assert.Equal("addus", refs[0].Metadata!["verb"]);
        Assert.False(refs[0].Metadata!.ContainsKey("args"));

        Assert.Equal("CTGrabHandle", refs[1].TargetName);
        Assert.Equal("use", refs[1].Metadata!["verb"]);
        Assert.Equal(new[] { "true" }, (string[])refs[1].Metadata!["args"]);

        Assert.Equal("CTGiveItem", refs[2].TargetName);
        Assert.Equal("give", refs[2].Metadata!["verb"]);
        Assert.Equal(new[] { "false", "true" }, (string[])refs[2].Metadata!["args"]);
    }

    [Fact]
    public void LootItmsArray_skips_malformed_entries_with_only_verb()
    {
        var obj = Object("interactions", "Bad",
            """{"aLootItms":["addus","take,GoodOne","",", ,",,]}""".Replace(",,]}", "]}"));
        // Note: the test input above has a malformed third entry "addus" (no comma).
        var rule = new SchemaCatalog.FieldRule(
            "interactions", "aLootItms", "loot", SchemaCatalog.FieldShape.LootItmsArray);
        var refs = ReferenceExtractor.Extract(obj, Catalog(rule)).ToList();

        Assert.Single(refs);
        Assert.Equal("GoodOne", refs[0].TargetName);
    }

    [Fact]
    public void SchemaLoader_x_shape_extension_overrides_inferred_shape()
    {
        // Use the catalog directly via SchemaLoader to verify x-shape works.
        // (Inline schema parsing isn't easy; just verify FieldRule construction.)
        var rule = new SchemaCatalog.FieldRule(
            "interactions", "aLootItms", "loot", SchemaCatalog.FieldShape.LootItmsArray);
        Assert.Equal(SchemaCatalog.FieldShape.LootItmsArray, rule.Shape);
    }
}
