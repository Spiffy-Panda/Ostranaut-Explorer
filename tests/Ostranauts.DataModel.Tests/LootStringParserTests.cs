using Ostranauts.DataModel;
using Xunit;

namespace Ostranauts.DataModel.Tests;

public class LootStringParserTests
{
    [Theory]
    [InlineData("Coughing=1.0x1", "Coughing", 1.0, 1.0, 1.0, true)]
    [InlineData("OKLGLEO=1.0x1-2", "OKLGLEO", 1.0, 1.0, 2.0, true)]
    [InlineData("-RELStranger=1.0x1", "RELStranger", 1.0, 1.0, 1.0, false)]
    [InlineData("ItmBackpack02=0.5x1", "ItmBackpack02", 0.5, 1.0, 1.0, true)]
    [InlineData("Volatile Prize Ship=1.0x1", "Volatile Prize Ship", 1.0, 1.0, 1.0, true)]
    public void Parses_well_formed_single_entries(string raw, string name, double chance, double min, double max, bool positive)
    {
        var parsed = LootStringParser.TryParseSingle(raw);
        Assert.NotNull(parsed);
        Assert.Equal(name, parsed!.Name);
        Assert.Equal(chance, parsed.Chance);
        Assert.Equal(min, parsed.MinCount);
        Assert.Equal(max, parsed.MaxCount);
        Assert.Equal(positive, parsed.Positive);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData("NoEquals")]
    [InlineData("Name=")]
    [InlineData("Name=NoX")]
    [InlineData("Name=1.0x")]
    [InlineData("Name=NaN.Yx1")]
    [InlineData("=1.0x1")]
    public void Returns_null_for_malformed(string raw)
    {
        Assert.Null(LootStringParser.TryParseSingle(raw));
    }

    [Fact]
    public void ParseSlot_splits_cumulative_alternatives()
    {
        var slot = "Foo=0.5x1|Bar=0.3x1|-Baz=0.2x1-3";
        var parsed = LootStringParser.ParseSlot(slot).ToList();
        Assert.Equal(3, parsed.Count);
        Assert.Equal("Foo", parsed[0].Name);
        Assert.True(parsed[0].Positive);
        Assert.Equal("Bar", parsed[1].Name);
        Assert.Equal("Baz", parsed[2].Name);
        Assert.False(parsed[2].Positive);
        Assert.Equal(1.0, parsed[2].MinCount);
        Assert.Equal(3.0, parsed[2].MaxCount);
    }

    [Fact]
    public void ParseSlot_skips_malformed_alternatives_silently()
    {
        var slot = "Good=1.0x1|garbage|AlsoGood=0.5x2";
        var parsed = LootStringParser.ParseSlot(slot).ToList();
        Assert.Equal(2, parsed.Count);
        Assert.Equal(new[] { "Good", "AlsoGood" }, parsed.Select(p => p.Name));
    }

    [Fact]
    public void ParseSlot_handles_empty_string()
    {
        Assert.Empty(LootStringParser.ParseSlot(""));
        Assert.Empty(LootStringParser.ParseSlot("   "));
    }
}
