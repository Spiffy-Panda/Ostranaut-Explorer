# Coverage gaps — extractor blind spots

Living scratchpad for "this folder/field is referenced but our extractor doesn't see it." Each entry is a hypothesis until the auto-detector (phase 2) confirms or refutes it; once confirmed, it's promoted to a `comment_mod/data/schemas/` overlay (phase 6, deferred).

The right place for an entry here: when **manual inspection of game data** suggests a reference relationship we're not capturing, *before* the detector has run, or to capture context the detector wouldn't surface (purpose, gameplay role, why the relationship matters).

Most discovered gaps will end up in the auto-generated `ref_candidates.js` instead — file an entry here only when the case warrants commentary beyond "field X hits target folder Y at hit-rate Z."

---

## installables/ — entire folder previously zero-edge

Symptoms (pre-phase-2): the `installables/` detail pages showed empty references-in and references-out, despite the folder containing every install/uninstall/repair action in the game. Cause: no schema overlay for `installables/`, so the extractor had no rules for it.

Sample entry — `FloorGrate01Install`:

```json
{
  "strName": "FloorGrate01Install",
  "strActionCO": "ItmFloorGrate01Loose",
  "strActionGroup": "Work",
  "strInteractionTemplate": "ACTInstallTEMP",
  "CTThem": "TIsFloorGrate01Uninstalled",
  "aInputs": [ "TIsFloorGrate01Uninstalled=1.0x1" ],
  "aToolCTsUse": [ "TIsToolWelding" ],
  "aLootCOs": [ "ItmFloorGrate01" ],
  "strStartInstall": "ItmFloorGrate01",
  "strAllowLootCTsUs": "CTWorkProgressHULL",
  "strAllowLootCTsThem": "CONDInstallProgressx5",
  "strProgressStat": "StatInstallProgress",
  "strCTThemMultCondTools": "IsToolWelding",
  "strCTThemMultCondUs": "StatInstallRateHULL"
}
```

Likely ref fields (target folder hypothesis, to be confirmed by detector):
- `strActionCO` → `items/` or `condowners/` (the user explicitly named `items/`; verify which folder actually contains `ItmFloorGrate01Loose`)
- `strInteractionTemplate` → `interactions/`
- `CTThem`, `aToolCTsUse[*]`, `strAllowLootCTsUs`, `strAllowLootCTsThem`, `strCTThemMultCondTools`, `strCTThemMultCondUs` → `condtrigs/`
- `aInputs[*]` → `condtrigs/` (cond-string DSL — `Name=value xduration`)
- `aLootCOs[*]`, `strStartInstall` → `items/` or `condowners/` (`Itm*` prefix)
- `strProgressStat` → `conditions/` (`Stat*` prefix)

Why this matters: installables is the bridge between **player actions** and **inventory + interactions**. Without it the graph misses the entire build/repair/uninstall layer — a major modder concern (every modded item that's installable goes through here).

Subfolders observed: `installables.json`, `installables_dismantle.json`, `installables_repair.json`, `installables_undamage.json` — same shape across all four.

---

## (template — copy when adding new entries)

## <folder>/ — short description

Symptoms: what's missing or wrong on the site today.

Sample entry: a representative JSON object showing the suspect fields.

Likely ref fields: hypothesized targets per field.

Why this matters: gameplay role; why this is worth fixing.
