using Ostranauts.DataModel;
using Xunit;

namespace Ostranauts.DataModel.Tests;

/// <summary>
/// Covers the minimal mod-overlay behavior: chain a base data root with an
/// overlay (Comment Mod). Both DataLoader and SchemaLoader gain multi-root
/// overloads; ObjectIndex and SchemaCatalog handle (folder, key) collisions
/// with last-wins.
/// </summary>
public class MultiRootOverlayTests
{
    private static string BaseRoot =>
        Path.Combine(AppContext.BaseDirectory, "fixtures", "data_tiny");
    private static string OverlayRoot =>
        Path.Combine(AppContext.BaseDirectory, "fixtures", "comment_mod_tiny");

    [Fact]
    public void DataLoader_multi_root_yields_objects_from_all_roots_in_order()
    {
        var objects = DataLoader.Load(new[] { BaseRoot, OverlayRoot }).ToList();

        // base: condowners/condowners.json (2) + extra.json (1) + items.json (2) = 5
        // overlay: condowners/overlay.json (2: TestOwnerOne and OverlayOnly) = 2
        // total yielded = 7 (collisions resolved by ObjectIndex, not DataLoader)
        Assert.Equal(7, objects.Count);
        Assert.Equal(2, objects.Count(o => o.StrName == "TestOwnerOne"));   // base + overlay
        Assert.Single(objects, o => o.StrName == "OverlayOnly");             // overlay only
    }

    [Fact]
    public void ObjectIndex_resolves_overlay_collisions_with_last_wins()
    {
        var warnings = new List<string>();
        var objects = DataLoader.Load(new[] { BaseRoot, OverlayRoot }).ToList();
        var index = new ObjectIndex(objects, Enumerable.Empty<Reference>(), warnings.Add);

        var canonical = index.Get("condowners", "TestOwnerOne");
        Assert.NotNull(canonical);
        // Overlay version has fromOverlay=true; base version doesn't.
        Assert.True(canonical!.Fields.TryGetProperty("fromOverlay", out var prop) && prop.GetBoolean());

        // Duplicate fired a warning, and history is preserved.
        Assert.Contains(warnings, w => w.Contains("TestOwnerOne") && w.Contains("overlay.json"));
        Assert.True(index.Duplicates.ContainsKey(("condowners", "TestOwnerOne")));
        Assert.Equal(2, index.Duplicates[("condowners", "TestOwnerOne")].Count);
    }

    [Fact]
    public void SchemaLoader_multi_root_overlay_overrides_field_descriptions()
    {
        var baseSchemas = Path.Combine(BaseRoot, "schemas");
        var overlaySchemas = Path.Combine(OverlayRoot, "schemas");
        var catalog = SchemaLoader.Load(new[] { baseSchemas, overlaySchemas });

        // strItemDef exists in both — overlay wins. Both target items, but the
        // identity of the rule should be the overlay one (we can't see the
        // description text from a rule, but we CAN see overlay-only fields too).
        var strItemDef = catalog.RuleFor("condowners", "strItemDef");
        Assert.NotNull(strItemDef);
        Assert.Equal("items", strItemDef!.TargetFolder);

        // strNewField only exists in the overlay — proves overlay schemas were merged.
        var newField = catalog.RuleFor("condowners", "strNewField");
        Assert.NotNull(newField);
        Assert.Equal("interactions", newField!.TargetFolder);
    }

    [Fact]
    public void SchemaCatalog_constructor_tolerates_duplicate_keys_with_last_wins()
    {
        var first = new SchemaCatalog.FieldRule("condowners", "strFoo", "items", SchemaCatalog.FieldShape.Direct);
        var second = new SchemaCatalog.FieldRule("condowners", "strFoo", "loot", SchemaCatalog.FieldShape.Direct);
        var catalog = new SchemaCatalog(new[] { first, second });

        Assert.Equal(2, catalog.Rules.Count);
        var canonical = catalog.RuleFor("condowners", "strFoo");
        Assert.NotNull(canonical);
        Assert.Equal("loot", canonical!.TargetFolder);   // last-wins
    }
}
