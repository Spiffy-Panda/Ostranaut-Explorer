using Ostranauts.DataModel;
using Xunit;

namespace Ostranauts.DataModel.Tests;

public class SchemaLoaderTests
{
    private static string FixtureSchemaDir =>
        Path.Combine(AppContext.BaseDirectory, "fixtures", "data_tiny", "schemas");

    private static SchemaCatalog Load() => SchemaLoader.Load(FixtureSchemaDir);

    [Fact]
    public void Returns_empty_catalog_with_warning_when_dir_missing()
    {
        var warnings = new List<string>();
        var catalog = SchemaLoader.Load(Path.Combine(FixtureSchemaDir, "_does_not_exist_"), warnings.Add);

        Assert.Empty(catalog.Rules);
        Assert.Single(warnings);
    }

    [Fact]
    public void Derives_Direct_rule_from_string_field_with_refers_to_phrase()
    {
        var catalog = Load();
        var rule = catalog.RuleFor("condowners", "strItemDef");
        Assert.NotNull(rule);
        Assert.Equal("items", rule!.TargetFolder);
        Assert.Equal(SchemaCatalog.FieldShape.Direct, rule.Shape);
    }

    [Fact]
    public void Handles_reffers_typo_in_base_game_schemas()
    {
        var catalog = Load();
        var rule = catalog.RuleFor("condowners", "strLoot");
        Assert.NotNull(rule);
        Assert.Equal("loot", rule!.TargetFolder);
    }

    [Fact]
    public void Derives_StringArray_rule_from_array_field()
    {
        var catalog = Load();
        var rule = catalog.RuleFor("condowners", "aInteractions");
        Assert.NotNull(rule);
        Assert.Equal("interactions", rule!.TargetFolder);
        Assert.Equal(SchemaCatalog.FieldShape.StringArray, rule.Shape);
    }

    [Fact]
    public void Handles_Found_in_X_dot_json_pattern()
    {
        var catalog = Load();
        var rule = catalog.RuleFor("condowners", "aLights");
        Assert.NotNull(rule);
        Assert.Equal("lights", rule!.TargetFolder);
        Assert.Equal(SchemaCatalog.FieldShape.StringArray, rule.Shape);
    }

    [Fact]
    public void No_rule_when_field_has_no_description()
    {
        var catalog = Load();
        Assert.Null(catalog.RuleFor("condowners", "strNoDescriptionField"));
    }

    [Fact]
    public void No_rule_when_description_has_no_json_reference()
    {
        var catalog = Load();
        Assert.Null(catalog.RuleFor("condowners", "strBoringField"));
    }

    [Fact]
    public void No_rule_when_field_type_cannot_carry_a_strName()
    {
        // nNotAReference is an integer with "items.json" in the description.
        // Description text alone isn't enough — the field's JSON type must accept strings.
        var catalog = Load();
        Assert.Null(catalog.RuleFor("condowners", "nNotAReference"));
    }

    [Fact]
    public void Source_folder_is_derived_from_schema_filename()
    {
        var catalog = Load();
        Assert.All(catalog.Rules, r => Assert.Equal("condowners", r.SourceFolder));
    }
}
