using System.Text.Json;
using Ostranauts.DataModel;
using Xunit;

namespace Ostranauts.DataModel.Tests;

public class ConditionsSimpleExpanderTests
{
    private static DataObject Wrapper(string aValuesJson)
    {
        var json = "{\"strName\":\"Simple Conditions\",\"aValues\":" + aValuesJson + "}";
        return new DataObject(
            "conditions_simple", "<test>", "Simple Conditions",
            JsonDocument.Parse(json).RootElement.Clone());
    }

    [Fact]
    public void Expands_one_tuple_into_one_synthetic_object()
    {
        var w = Wrapper("[\"AllowEnglish\",\"AllowEnglish\",\"[us] [is] allowed.\",\"0\",\"0\",\"Neutral\",\"false\"]");

        var result = ConditionsSimpleExpander.Expand(new[] { w }).ToList();

        var single = Assert.Single(result);
        Assert.Equal("conditions_simple", single.Folder);
        Assert.Equal("AllowEnglish", single.StrName);
        Assert.Equal(JsonValueKind.Object, single.Fields.ValueKind);
        Assert.Equal("AllowEnglish", single.Fields.GetProperty("strName").GetString());
        Assert.Equal("AllowEnglish", single.Fields.GetProperty("strNameFriendly").GetString());
        Assert.Equal("Neutral", single.Fields.GetProperty("strColor").GetString());
    }

    [Fact]
    public void Multiple_tuples_yield_multiple_objects()
    {
        var w = Wrapper(
            "[\"A\",\"A\",\"da\",\"0\",\"0\",\"Neutral\",\"false\"," +
            "\"B\",\"B\",\"db\",\"0\",\"0\",\"Neutral\",\"false\"," +
            "\"C\",\"C\",\"dc\",\"0\",\"0\",\"Neutral\",\"false\"]");

        var result = ConditionsSimpleExpander.Expand(new[] { w }).ToList();
        Assert.Equal(3, result.Count);
        Assert.Equal(new[] { "A", "B", "C" }, result.Select(d => d.StrName));
    }

    [Fact]
    public void Non_conditions_simple_objects_are_ignored()
    {
        var other = new DataObject(
            "conditions", "<test>", "X",
            JsonDocument.Parse("{\"strName\":\"X\"}").RootElement.Clone());
        Assert.Empty(ConditionsSimpleExpander.Expand(new[] { other }));
    }

    [Fact]
    public void Trailing_partial_tuple_warns_and_is_skipped()
    {
        var w = Wrapper(
            "[\"A\",\"A\",\"da\",\"0\",\"0\",\"Neutral\",\"false\",\"B\",\"B\"]"); // 9 entries, partial second

        var warnings = new List<string>();
        var result = ConditionsSimpleExpander.Expand(new[] { w }, warnings.Add).ToList();
        Assert.Single(result);
        Assert.Equal("A", result[0].StrName);
        Assert.Contains(warnings, w => w.Contains("not a multiple of 7"));
    }

    [Fact]
    public void Non_string_strName_in_tuple_is_skipped_with_warning()
    {
        var w = Wrapper("[42,\"A\",\"da\",\"0\",\"0\",\"Neutral\",\"false\"]"); // non-string at strName slot

        var warnings = new List<string>();
        var result = ConditionsSimpleExpander.Expand(new[] { w }, warnings.Add).ToList();
        Assert.Empty(result);
        Assert.Contains(warnings, x => x.Contains("non-string or empty strName"));
    }
}
