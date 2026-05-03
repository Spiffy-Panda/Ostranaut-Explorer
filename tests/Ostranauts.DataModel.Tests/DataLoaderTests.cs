using System.Text.Json;
using Ostranauts.DataModel;
using Xunit;

namespace Ostranauts.DataModel.Tests;

public class DataLoaderTests
{
    private static string FixtureRoot =>
        Path.Combine(AppContext.BaseDirectory, "fixtures", "data_tiny");

    [Fact]
    public void Loads_objects_from_all_eligible_folders()
    {
        var warnings = new List<string>();
        var objects = DataLoader.Load(FixtureRoot, warnings.Add).ToList();

        // condowners.json (2) + extra.json (1, ExtraOwner) + items.json (2) = 5
        Assert.Equal(5, objects.Count);
        Assert.Contains(objects, o => o.Folder == "condowners" && o.StrName == "TestOwnerOne");
        Assert.Contains(objects, o => o.Folder == "condowners" && o.StrName == "TestOwnerTwo");
        Assert.Contains(objects, o => o.Folder == "condowners" && o.StrName == "ExtraOwner");
        Assert.Contains(objects, o => o.Folder == "items" && o.StrName == "TestItemA");
        Assert.Contains(objects, o => o.Folder == "items" && o.StrName == "TestItemB");
    }

    [Fact]
    public void Skips_known_non_json_array_folders()
    {
        var objects = DataLoader.Load(FixtureRoot).ToList();

        // strings/should_not_load.json exists but is in a skipped folder.
        Assert.DoesNotContain(objects, o => o.Folder == "strings");
    }

    [Fact]
    public void Warns_on_entries_missing_strName_but_does_not_throw()
    {
        var warnings = new List<string>();
        var objects = DataLoader.Load(FixtureRoot, warnings.Add).ToList();

        Assert.Contains(warnings, w => w.Contains("missing strName"));
    }

    [Fact]
    public void Preserves_parsed_fields_on_DataObject()
    {
        var owner = DataLoader.Load(FixtureRoot)
            .First(o => o.StrName == "TestOwnerOne");

        Assert.Equal(JsonValueKind.Object, owner.Fields.ValueKind);
        Assert.Equal("TestItemA", owner.Fields.GetProperty("strItemDef").GetString());
        Assert.Equal(
            "IsSystem=1.0x1",
            owner.Fields.GetProperty("aStartingConds")[0].GetString());
    }

    [Fact]
    public void Throws_when_data_root_does_not_exist()
    {
        Assert.Throws<DirectoryNotFoundException>(
            () => DataLoader.Load(Path.Combine(FixtureRoot, "_does_not_exist_")).ToList());
    }
}
