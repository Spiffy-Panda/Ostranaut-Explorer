using System.Text.Json;
using Ostranauts.DataModel;
using Xunit;

namespace Ostranauts.DataModel.Tests;

public class RefCandidateDetectorTests
{
    private static DataObject Obj(string folder, string name, string json) =>
        new(folder, "<test>", name, JsonDocument.Parse(json).RootElement.Clone());

    private static SchemaCatalog Empty => SchemaCatalog.Empty;

    [Fact]
    public void High_hit_rate_uncovered_field_surfaces_as_candidate()
    {
        // Five installables all referencing items that exist.
        var objs = new[]
        {
            Obj("items", "ItmA", """{"strName":"ItmA"}"""),
            Obj("items", "ItmB", """{"strName":"ItmB"}"""),
            Obj("items", "ItmC", """{"strName":"ItmC"}"""),
            Obj("items", "ItmD", """{"strName":"ItmD"}"""),
            Obj("items", "ItmE", """{"strName":"ItmE"}"""),
            Obj("installables", "Inst1", """{"strName":"Inst1","strActionCO":"ItmA"}"""),
            Obj("installables", "Inst2", """{"strName":"Inst2","strActionCO":"ItmB"}"""),
            Obj("installables", "Inst3", """{"strName":"Inst3","strActionCO":"ItmC"}"""),
            Obj("installables", "Inst4", """{"strName":"Inst4","strActionCO":"ItmD"}"""),
            Obj("installables", "Inst5", """{"strName":"Inst5","strActionCO":"ItmE"}"""),
        };

        var candidates = RefCandidateDetector.Detect(objs, Empty);

        var match = candidates.FirstOrDefault(c =>
            c.SourceFolder == "installables" && c.FieldPath == "strActionCO");
        Assert.NotNull(match);
        Assert.False(match!.CoveredBySchema);
        Assert.Equal(5, match.SampleSize);
        var topTarget = match.RawTargets.First();
        Assert.Equal("items", topTarget.TargetFolder);
        Assert.Equal(1.0, topTarget.HitRate);
    }

    [Fact]
    public void Below_min_sample_is_filtered_out()
    {
        // Only 3 hits (default minSample=5), should not surface.
        var objs = new[]
        {
            Obj("items", "ItmA", """{"strName":"ItmA"}"""),
            Obj("items", "ItmB", """{"strName":"ItmB"}"""),
            Obj("items", "ItmC", """{"strName":"ItmC"}"""),
            Obj("installables", "Inst1", """{"strName":"Inst1","strRef":"ItmA"}"""),
            Obj("installables", "Inst2", """{"strName":"Inst2","strRef":"ItmB"}"""),
            Obj("installables", "Inst3", """{"strName":"Inst3","strRef":"ItmC"}"""),
        };

        var candidates = RefCandidateDetector.Detect(objs, Empty);

        Assert.DoesNotContain(candidates, c => c.FieldPath == "strRef");
    }

    [Fact]
    public void Self_folder_hits_are_excluded_by_default()
    {
        // strName-equivalent self-refs shouldn't surface.
        var objs = new[]
        {
            Obj("conditions", "CondA", """{"strName":"CondA"}"""),
            Obj("conditions", "CondB", """{"strName":"CondB","strSibling":"CondA"}"""),
            Obj("conditions", "CondC", """{"strName":"CondC","strSibling":"CondA"}"""),
            Obj("conditions", "CondD", """{"strName":"CondD","strSibling":"CondA"}"""),
            Obj("conditions", "CondE", """{"strName":"CondE","strSibling":"CondA"}"""),
            Obj("conditions", "CondF", """{"strName":"CondF","strSibling":"CondA"}"""),
        };

        var candidates = RefCandidateDetector.Detect(objs, Empty);

        Assert.DoesNotContain(candidates, c => c.FieldPath == "strSibling");
    }

    [Fact]
    public void Encoded_value_with_equals_separator_surfaces_via_Encoded_finding()
    {
        // values look like cond-strings — raw whole-value misses, but split on `=` hits.
        var objs = new[]
        {
            Obj("condtrigs", "CTA", """{"strName":"CTA"}"""),
            Obj("condtrigs", "CTB", """{"strName":"CTB"}"""),
            Obj("condtrigs", "CTC", """{"strName":"CTC"}"""),
            Obj("condtrigs", "CTD", """{"strName":"CTD"}"""),
            Obj("condtrigs", "CTE", """{"strName":"CTE"}"""),
            Obj("installables", "Inst1", """{"strName":"Inst1","aIn":["CTA=1.0x1","CTB=1.0x1"]}"""),
            Obj("installables", "Inst2", """{"strName":"Inst2","aIn":["CTC=1.0x1","CTD=1.0x1"]}"""),
            Obj("installables", "Inst3", """{"strName":"Inst3","aIn":["CTE=1.0x1"]}"""),
        };

        var candidates = RefCandidateDetector.Detect(objs, Empty);

        var match = candidates.FirstOrDefault(c =>
            c.SourceFolder == "installables" && c.FieldPath == "aIn[*]");
        Assert.NotNull(match);
        Assert.Empty(match!.RawTargets);
        Assert.NotNull(match.Encoded);
        Assert.Equal("=", match.Encoded!.Separator);
        Assert.Equal("condtrigs", match.Encoded.Targets.First().TargetFolder);
    }

    [Fact]
    public void Schema_covered_field_is_marked_CoveredBySchema_true()
    {
        var catalog = new SchemaCatalog(new[]
        {
            new SchemaCatalog.FieldRule("installables", "strActionCO", "items", SchemaCatalog.FieldShape.Direct),
        });
        var objs = new[]
        {
            Obj("items", "ItmA", """{"strName":"ItmA"}"""),
            Obj("items", "ItmB", """{"strName":"ItmB"}"""),
            Obj("items", "ItmC", """{"strName":"ItmC"}"""),
            Obj("items", "ItmD", """{"strName":"ItmD"}"""),
            Obj("items", "ItmE", """{"strName":"ItmE"}"""),
            Obj("installables", "Inst1", """{"strName":"Inst1","strActionCO":"ItmA"}"""),
            Obj("installables", "Inst2", """{"strName":"Inst2","strActionCO":"ItmB"}"""),
            Obj("installables", "Inst3", """{"strName":"Inst3","strActionCO":"ItmC"}"""),
            Obj("installables", "Inst4", """{"strName":"Inst4","strActionCO":"ItmD"}"""),
            Obj("installables", "Inst5", """{"strName":"Inst5","strActionCO":"ItmE"}"""),
        };

        var candidates = RefCandidateDetector.Detect(objs, catalog);

        var match = candidates.First(c =>
            c.SourceFolder == "installables" && c.FieldPath == "strActionCO");
        Assert.True(match.CoveredBySchema);
    }

    [Fact]
    public void Nested_array_of_objects_walked_with_path_marker()
    {
        // condrules.aThresholds[*].strLootNew shape: array of objects whose sub-field hits loot/.
        var objs = new[]
        {
            Obj("loot", "L1", """{"strName":"L1"}"""),
            Obj("loot", "L2", """{"strName":"L2"}"""),
            Obj("loot", "L3", """{"strName":"L3"}"""),
            Obj("loot", "L4", """{"strName":"L4"}"""),
            Obj("loot", "L5", """{"strName":"L5"}"""),
            Obj("condrules", "Rule1", """{"strName":"Rule1","aThresh":[{"strLootNew":"L1"},{"strLootNew":"L2"}]}"""),
            Obj("condrules", "Rule2", """{"strName":"Rule2","aThresh":[{"strLootNew":"L3"},{"strLootNew":"L4"}]}"""),
            Obj("condrules", "Rule3", """{"strName":"Rule3","aThresh":[{"strLootNew":"L5"}]}"""),
        };

        var candidates = RefCandidateDetector.Detect(objs, Empty);

        Assert.Contains(candidates, c =>
            c.SourceFolder == "condrules" &&
            c.FieldPath == "aThresh[*].strLootNew" &&
            c.RawTargets.Any(t => t.TargetFolder == "loot"));
    }

    [Fact]
    public void Placeholder_tokens_are_skipped()
    {
        // values like "[us]" / "[them]" are runtime substitutions, not refs.
        var objs = new[]
        {
            Obj("items", "ItmA", """{"strName":"ItmA"}"""),
            Obj("things", "T1", """{"strName":"T1","strRef":"[us]"}"""),
            Obj("things", "T2", """{"strName":"T2","strRef":"[them]"}"""),
            Obj("things", "T3", """{"strName":"T3","strRef":"[3rd]"}"""),
            Obj("things", "T4", """{"strName":"T4","strRef":"[me]"}"""),
            Obj("things", "T5", """{"strName":"T5","strRef":"[here]"}"""),
        };

        var candidates = RefCandidateDetector.Detect(objs, Empty);
        // strRef has 5 placeholder values — all dropped; sampleSize remains 0; not emitted.
        Assert.DoesNotContain(candidates, c => c.FieldPath == "strRef");
    }
}
