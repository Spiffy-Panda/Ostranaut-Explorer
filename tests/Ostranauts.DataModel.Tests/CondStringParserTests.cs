using Ostranauts.DataModel;
using Xunit;

namespace Ostranauts.DataModel.Tests;

public class CondStringParserTests
{
    [Theory]
    [InlineData("IsSystem=1.0x1", "IsSystem", 1.0, 1)]
    [InlineData("IsHiddenInv=1.0x1", "IsHiddenInv", 1.0, 1)]
    [InlineData("DcHungry=0.5x10", "DcHungry", 0.5, 10)]
    [InlineData("StatDamage=2.5x100", "StatDamage", 2.5, 100)]
    public void Parses_well_formed_strings(string raw, string name, double value, int duration)
    {
        var parsed = CondStringParser.TryParse(raw);
        Assert.NotNull(parsed);
        Assert.Equal(name, parsed!.Name);
        Assert.Equal(value, parsed.Value);
        Assert.Equal(duration, parsed.Duration);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData("NoEquals")]
    [InlineData("=1.0x1")]
    [InlineData("Name=")]
    [InlineData("Name=NoX")]
    [InlineData("Name=1.0x")]
    [InlineData("Name=NaN.Yx1")]
    [InlineData("Name=1.0xNaN")]
    public void Returns_null_for_malformed_input(string raw)
    {
        Assert.Null(CondStringParser.TryParse(raw));
    }
}
