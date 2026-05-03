# Prose extraction: Modding__CondOwners

- Source: https://ostranauts.wiki.gg/wiki/Modding/CondOwners
- Model family: sonnet
- Model snapshot: claude-sonnet-4-6
- Folder mapped to: condowners
- Cached at: (frontmatter does not include a fetch date; slug confirms source as Modding/CondOwners)

## Page summary

The Modding/CondOwners wiki page is a conceptual deep-dive into the CondOwner system — the unified object model underlying every entity in Ostranauts — rather than a data-format reference. It explains philosophy (unified conditions/interactions/identity for all objects), systems (containment, AI, social, physics), and some modder guidance, but contains only one small wikitable that enumerates JSON field names: the "Identity: What Am I?" table in the "What Makes a CondOwner" section. All five fields documented there (`strID`, `strCODef`, `strName`, `strNameFriendly`, `strNameShort`) landed in the review queue because none of their table-row descriptions mention a `.json` target. The page also has a "For Modders & Data Designers" section pointing to `[[Data:CondOwners]]` for "the JSON structure," confirming the page is intentionally narrative-first; the normative field reference is elsewhere.

---

## Fields

### `strID` — Outcome C

- **Auto-parser status:** review-queue
- **Wiki shape hint:** `str` prefix → direct string
- **Real-data shape:** absent (not found in any condowners data file)

> "**strID** — Unique identifier for save games and code — 'NPC_12847_John'"

The wiki presents `strID` as a runtime/save-file identity field, not a definition-time JSON property. Scanning all condowners JSON files confirms `strID` does not appear in any condowner definition. It is a save-state field assigned at runtime, not something present in the `data/condowners/` files that the parser ingests.

**Commentary:** The review queue correctly flagged "no .json target found in description" — but the deeper issue is that `strID` is absent from real data entirely. It is a save-game artifact, not a definition field. The auto-parser was correct to withhold it from the schema. This is a C outcome: the wiki entry documents a runtime field not present in the data-tree source files. Resolution: add a note to the review queue checkbox that this is a save-file field and should be excluded from the condowners schema; no schema entry needed.

**Confidence:** high — verified absent across all 1,110 condowner definition objects in the data tree.

---

### `strCODef` — Outcome C

- **Auto-parser status:** review-queue
- **Wiki shape hint:** `str` prefix → direct string
- **Real-data shape:** absent (not found in any condowners data file)

> "**strCODef** — Type definition (links to Data:CondOwners) — 'COHuman' or 'COWrenchBasic'"

Like `strID`, `strCODef` is a save-game/runtime field — the field that records which condowner definition a live instance refers to. It does not appear in any definition object under `data/condowners/`. The wiki description "links to Data:CondOwners" implies it refers back to the condowners folder itself (i.e., `strCODef` on a save instance names a `strName` in `condowners/*.json`), but that link is only meaningful in a save-file context, not in the definition files the parser ingests.

**Commentary:** The review queue entry says "no .json target found in description." The description does imply a condowners target, but the field is absent from the data tree. Were this present in save data, it would be an A outcome (string reference → condowners.json). For the purposes of schema coverage of the `data/condowners/` definitions, this is C. If and when save-file inspection is implemented (v2 roadmap), `strCODef` would be the primary forward-reference field on each save-game CondOwner instance.

**Confidence:** high — verified absent from all definition objects.

---

### `strName` — Outcome B

- **Auto-parser status:** review-queue
- **Wiki shape hint:** `str` prefix → direct string
- **Real-data shape:** string (present in 1,110/1,110 objects — universal)

> "**strName** — Default display name — 'John Smith' or 'Wrench'"

`strName` is the universal primary key of every condowner definition. It is what other files use to cross-reference this object (e.g., `strItemDef: "Blank"` resolves to the condowner named `"Blank"`). The wiki description does not mention a `.json` target because `strName` *is* the lookup key, not a reference to another file.

The comment_mod schema already has a hand-authored entry for `strName` with description "The code name of the condowner, as referred to in other files." This is correct. The wiki's phrasing ("Default display name") is slightly misleading — `strName` is the internal code name (the wiki's "display name" meaning is really `strNameFriendly`). The existing schema description is more accurate than the wiki.

**Proposed schema entry:**
```json
"strName": {
  "type": "string",
  "description": "The code name of the condowner, as referred to in other files. Used as the cross-reference key by strItemDef, strLoot, and other string-keyed fields.",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#strName"
}
```

**Commentary:** The review queue flagged this as "no .json target found" — correct, because `strName` is the target, not a pointer. The auto-parser cannot infer that `strName` is the identity key rather than a reference; this is inherently a B outcome. The existing comment_mod entry is good; the proposed description above slightly enriches it by explaining the cross-reference role. No schema rule change needed (SchemaLoader must not attempt to follow `strName` as a reference).

**Confidence:** high — role is unambiguous from data structure.

---

### `strNameFriendly` — Outcome B

- **Auto-parser status:** review-queue
- **Wiki shape hint:** `str` prefix → direct string
- **Real-data shape:** string (present in 1,083/1,110 objects)

> "**strNameFriendly** — Custom renamed version — Your custom ship name"

`strNameFriendly` is the human-readable display name shown to players, distinct from the internal `strName` code key. It carries no cross-reference to another folder. The comment_mod schema has a hand-authored entry: "The human readable name of the condowner." That is accurate and sufficient.

**Proposed schema entry:**
```json
"strNameFriendly": {
  "type": "string",
  "description": "Human-readable display name shown to players. Distinct from strName (the internal code key). Used in tooltips, UI panels, and player-facing text.",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#strNameFriendly"
}
```

**Commentary:** Review-queue flag "no .json target found" is correct — this is a display string with no referential meaning. The existing comment_mod entry is correct. The wiki's phrasing ("Custom renamed version") is confusing because in definition files this is the authored friendly name, not a player rename; the proposed description clarifies. Auto-parser correctly abstained from generating a rule.

**Confidence:** high — confirmed display-only string in real data.

---

### `strNameShort` — Outcome B

- **Auto-parser status:** review-queue
- **Wiki shape hint:** `str` prefix → direct string
- **Real-data shape:** string (present in 1,049/1,110 objects)

> "**strNameShort** — Abbreviated for UI space — 'J. Smith' or 'Wrench'"

`strNameShort` is the compact display name for tight UI contexts (tooltips, lists). No cross-reference. The comment_mod schema has a hand-authored entry: "Simplified name for generic category.\nUsed in tooltips and lists." That is accurate.

**Proposed schema entry:**
```json
"strNameShort": {
  "type": "string",
  "description": "Abbreviated display name for compact UI contexts such as tooltips and lists.",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#strNameShort"
}
```

**Commentary:** Review-queue flag "no .json target found" is correct. The existing schema entry is adequate; this is a cosmetic enrichment. Auto-parser correctly abstained.

**Confidence:** high — confirmed display-only string.

---

### `strType` — Outcome B

- **Auto-parser status:** not-seen (not mentioned on this wiki page; present in comment_mod schema from elsewhere)
- **Wiki shape hint:** not documented on this page
- **Real-data shape:** string, always present (1,110/1,110), values: "Item", "Crew", "Ship"

The wiki page does not document `strType` in any table or bold-prose field mention. It is in the comment_mod schema with an enum `["Item", "Crew", "Ship"]` and description "The type of the condowner." The real data confirms this: every object has `strType` with one of those three values.

**Commentary:** Not-seen by the auto-parser on this page — the page mentions types of CondOwners conceptually but never names `strType` as a JSON field. The comment_mod entry looks hand-curated (not wiki-extracted) and is correct. No action needed from this extraction pass. Parser improvement opportunity: the "For Modders" section table mentions "What conditions start with?" and "What interactions available?" but does not give field names.

**Confidence:** high for B classification — confirmed in data; enum is accurate.

---

### `strItemDef` — Outcome A (confirm existing)

- **Auto-parser status:** clean (in comment_mod schema, hand-authored)
- **Wiki shape hint:** `str` prefix → direct string
- **Real-data shape:** string (present in 1,110/1,110 objects)

The wiki page does not explicitly document `strItemDef` as a field name anywhere in a table or bold-prose mention. The comment_mod schema entry "The item definition, reffers to entry within items.json" is hand-authored with a typo ("reffers"). Real data confirms: `strItemDef` is present universally and its values are item `strName` strings (e.g., "Blank", "ItmAtmoScrubber01Ready").

**Proposed schema entry (confirm/fix typo):**
```json
"strItemDef": {
  "type": "string",
  "description": "The item definition. Refers to entry within items.json.",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#strItemDef"
}
```

**Commentary:** The auto-parser did not extract this from the wiki page (not present in a table), but a hand-authored entry exists and is functionally correct. The existing description contains "reffers" (double-f typo) — SchemaLoader's regex `refers?\s+to\s+entr` still matches it because of the `?` on `s`, but the canonical phrasing should be "Refers to entry within items.json." Agree with target `items`. The `x-source` anchor should be updated if a direct wiki citation exists; the page itself doesn't document this field, so the anchor is a best-effort link to the page.

**Confidence:** high — universal field, consistent values pointing to items.

---

### `strLoot` — Outcome A (confirm existing)

- **Auto-parser status:** clean (in comment_mod schema, hand-authored)
- **Wiki shape hint:** `str` prefix → direct string
- **Real-data shape:** string or null (present in 724/1,110 objects; null when absent)

The wiki page does not document `strLoot` as a named field. The comment_mod schema entry reads "Loot the condowner spawns with, reffers to entry within loot.json" (same double-f typo). Real data: when non-null, `strLoot` is a string such as "WOUNDArmLowerL" — a loot table `strName`.

**Proposed schema entry (confirm/fix):**
```json
"strLoot": {
  "type": "string",
  "description": "Loot table the condowner spawns with. Refers to entry within loot.json.",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#strLoot"
}
```

**Commentary:** Agree with existing rule (→ loot). Typo fix same as above. The wiki page conceptually describes loot spawning in the "Containers" and "Lot" sections but never names `strLoot` as a field. The `x-source` anchor is a best-effort page link. Auto-parser correctly handles this via the hand-authored entry.

**Confidence:** high — field is consistent with loot.json references.

---

### `strDesc` — Outcome B (confirm existing)

- **Auto-parser status:** clean (in comment_mod schema, hand-authored)
- **Wiki shape hint:** `str` prefix → direct string
- **Real-data shape:** string (present in 832/1,110 objects)

The wiki page does not document `strDesc` as a named field. The comment_mod schema entry reads "A longer description of the item. Present in inventory tooltips." Real data confirms it is a plain prose description string (e.g., "A mainstay in off-world construction projects…").

**Commentary:** B outcome — display-only string, no cross-reference. Existing schema entry is correct. Auto-parser did not encounter this field name on the wiki page.

**Confidence:** high — confirmed display-only string in real data.

---

### `bSlotLocked` — Outcome B (confirm existing)

- **Auto-parser status:** clean (in comment_mod schema, hand-authored)
- **Wiki shape hint:** `b` prefix → boolean
- **Real-data shape:** bool (present in 49/1,110 objects)

> "**Slot Locked** — Can't be removed — Cybernetic implants, fused equipment"

The wiki mentions slot-locking in the "Slots" table under the conceptual description, but does not name `bSlotLocked` explicitly. The comment_mod entry "Controls whether the condowner is locked into the slot it inhabits" is accurate. Real data confirms it is boolean.

**Commentary:** B outcome — boolean flag, no cross-reference needed. Existing schema entry is correct. The auto-parser would have seen the `b` prefix and correctly classified it as non-string-shaped, routing to the review queue if it appeared in a table; but the wiki never actually names `bSlotLocked` in any table row.

**Confidence:** high — confirmed boolean in real data.

---

### `aStartingConds` — Outcome A (confirm existing, note cond-string shape)

- **Auto-parser status:** clean (in comment_mod schema, hand-authored)
- **Wiki shape hint:** `a` prefix → array; values are condition strings
- **Real-data shape:** string[] (every element is a CondString like "IsSystem=1.0x1")

The wiki page does not document `aStartingConds` as a named field. The comment_mod schema entry reads: "Conditions applied at spawn. Array of condition strings (Name=value*duration) — each name refers to entry within conditions.json." Real data confirms: every element follows the `Name=value x duration` DSL (e.g., "IsSystem=1.0x1", "IsHiddenInv=1.0x1").

**Commentary:** A outcome confirmed. This is a `CondStringArray` shape per Decision #6 — value and duration metadata must be preserved on the edge, not stripped. The existing description correctly captures this. The description ends with "refers to entry within conditions.json" which is the correct SchemaLoader-triggering phrase. Agree entirely.

**Confidence:** high — universal CondString pattern confirmed in real data.

---

### `aInteractions` — Outcome A

- **Auto-parser status:** not-seen
- **Wiki shape hint:** `a` prefix → array; elements are interaction names
- **Real-data shape:** string[] (1,065/1,110 objects; elements are interaction `strName` values, e.g., "SOCGreetAI", "GUITrade")

The wiki page conceptually describes interactions extensively ("Interactions: What Can Happen," "The Action Queue"), but never names `aInteractions` as a JSON field in any table or bold-prose mention. Real data confirms string arrays of interaction names.

**Proposed schema entry:**
```json
"aInteractions": {
  "type": "array",
  "description": "List of interactions available to this condowner. Each entry refers to entry within interactions.json.",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#aInteractions"
}
```

**Commentary:** Not-seen by the auto-parser because the wiki never names `aInteractions` in a wikitable first column or bold-prose field syntax. The "For Modders" section mentions "What interactions available? — Determines how players/NPCs can use it" as a design question but does not give the JSON field name. The `x-source` anchor is best-effort. This is the second-most common field in the data (1,065 occurrences) and is a primary cross-reference target; it warrants an A entry.

**Confidence:** high — field is nearly universal, values consistently name interaction objects.

---

### `aUpdateCommands` — Outcome C

- **Auto-parser status:** not-seen
- **Wiki shape hint:** `a` prefix → array; values appear to be comma-delimited command strings
- **Real-data shape:** string[] (1,051/1,110 objects; values like "GasRespire2,HumanO2,null", "Heater,TIsAirtightHumanOrRoom")

> "CondOwners can have additional Unity components added dynamically: GasExchange — Breathe/leak atmosphere, GasPump — Move gas between containers, Heater — Emit/absorb heat, Explosion — Explode when triggered, Wound — Track injury location/severity. These are added via the **Update Commands** system, allowing data-driven component composition without recompiling code."

The wiki describes the Update Commands system conceptually but does not name `aUpdateCommands` as a JSON field. Real data shows the values are not plain `strName` cross-references; they are structured command strings with comma-separated arguments (e.g., "GasRespire2,HumanO2,null"). This appears to be a mini-DSL similar to CondStrings but for Unity component instantiation.

**Commentary:** C outcome. The field exists in real data (1,051 objects) and is significant, but the wiki only explains the system conceptually without naming the JSON field or its format. The value format is ambiguous: elements look like `ComponentType,Arg1,Arg2` where the component type names ("GasRespire2", "Heater") are C# class names, not `data/` folder entries — so this would not produce schema rules in the same sense as string-ref fields. Resolving this would require wiki page edits that document `aUpdateCommands` explicitly with its command-string format, or documentation from the C# source (outside this extraction's scope).

**Confidence:** med — present in data is confirmed, but classification as C (not A) relies on the value format appearing to reference C# types rather than JSON objects.

---

### `strAudioEmitter` — Outcome A

- **Auto-parser status:** not-seen
- **Wiki shape hint:** `str` prefix → direct string
- **Real-data shape:** string (516/1,110 objects; values like "AmbBarTechnoLowpass", "ShipAmbientUnderwater01")

The wiki page does not document `strAudioEmitter` as a JSON field name anywhere. Real data values are audio emitter `strName` strings that correspond to entries in `data/audioemitters/`.

**Proposed schema entry:**
```json
"strAudioEmitter": {
  "type": "string",
  "description": "Audio emitter definition for this condowner's ambient sound. Refers to entry within audioemitters.json.",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#strAudioEmitter"
}
```

**Commentary:** Not-seen by the auto-parser — absent from the wiki page. The field is present in 516 objects (nearly half), and the value pattern (e.g., "AmbBarTechnoLowpass" matching the audioemitters folder naming convention) strongly implies a cross-reference to audioemitters.json. This is a valuable A entry not reachable from this wiki page; it would need to come from a wiki page that documents `strAudioEmitter` explicitly, or from the `data/audioemitters/` schema page if one exists.

**Confidence:** med — target inferred from naming convention and folder existence, but no wiki text confirms it. A wiki page covering audioemitters fields would raise this to high.

---

### `aTickers` — Outcome A

- **Auto-parser status:** not-seen
- **Wiki shape hint:** `a` prefix → array
- **Real-data shape:** string[] (348/1,110 objects; values like "Achievement", "AIAgent", "Blood" — ticker `strName` values)

The wiki discusses the Ticker system ("Time & Events: The Ticker System") extensively but never names `aTickers` as a JSON field. Real data shows string arrays whose values match entries in `data/tickers/`.

**Proposed schema entry:**
```json
"aTickers": {
  "type": "array",
  "description": "Tickers (event schedulers) active on this condowner. Each entry refers to entry within tickers.json.",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#aTickers"
}
```

**Commentary:** Not-seen — the wiki page explains the ticker mechanism conceptually without naming the JSON field. The `WIKI_TERM_TO_FOLDER` map includes `"ticker": "tickers"`, so if the wiki had described `aTickers` as "Array of Tickers," the auto-parser would have caught it. This is a gap in wiki documentation, not a parser limitation. The A classification is confident because `data/tickers/` exists and values match.

**Confidence:** high — values consistently match tickers folder naming convention.

---

### `mapChargeProfiles` — Outcome A

- **Auto-parser status:** not-seen
- **Wiki shape hint:** `map` prefix → array in data (implemented as a flat list, not a dict)
- **Real-data shape:** string[] (286/1,110 objects; values like "Melee", "MeleeAttackDefaultExtraFragile")

The wiki page discusses the ChargeProfile system ("Power & Resources" section) but never names `mapChargeProfiles` as a JSON field. Real data shows string arrays whose values appear to be chargeprofile `strName` references. A `data/chargeprofiles/` folder likely exists.

**Proposed schema entry:**
```json
"mapChargeProfiles": {
  "type": "array",
  "description": "Charge profiles defining resource consumption for this condowner's actions. Each entry refers to entry within chargeprofiles.json.",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#mapChargeProfiles"
}
```

**Commentary:** Not-seen — same pattern as aTickers. The `map` prefix here is misleading since real data shows a string array, not a dict. The values (e.g., "Melee", "MeleeAttackDefaultExtraFragile") suggest a reference to a chargeprofiles folder. Confidence is medium because the target folder is inferred from naming convention — the exact folder name needs verification against `data/`.

**Confidence:** med — target folder inferred; values consistent with external references.

---

### `strContainerCT` — Outcome A

- **Auto-parser status:** not-seen
- **Wiki shape hint:** `str` prefix, `CT` infix → direct string, likely a CondTrigger name
- **Real-data shape:** string (234/1,110 objects; value like "TIsFitContainerFilterCO2")

The wiki discusses containers and containment but never names `strContainerCT`. The value "TIsFitContainerFilterCO2" follows the `T...` naming convention common to CondTrigger entries. `WIKI_TERM_TO_FOLDER` maps "condtrig" → "condtrigs".

**Proposed schema entry:**
```json
"strContainerCT": {
  "type": "string",
  "description": "CondTrigger that filters which items can be placed in this condowner's container. Refers to entry within condtrigs.json.",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#strContainerCT"
}
```

**Commentary:** Not-seen — field absent from wiki. The `CT` infix and value naming pattern strongly imply a condtrigs reference. Classifying as A with medium confidence since the inference is from naming convention only.

**Confidence:** med — naming convention is strong evidence but no wiki text confirms target.

---

### `aSlotsWeHave` — Outcome A

- **Auto-parser status:** not-seen
- **Wiki shape hint:** `a` prefix → array
- **Real-data shape:** string[] (72/1,110 objects; values like "body", "WoundAbdomenLower", "armUpperR")

The wiki discusses slots conceptually but never names `aSlotsWeHave`. Values appear to be slot `strName` references from `data/slots/`. The `WIKI_TERM_TO_FOLDER` map includes `"slot": "slots"`.

**Proposed schema entry:**
```json
"aSlotsWeHave": {
  "type": "array",
  "description": "Slots present on this condowner (attachment points for equipment or wounds). Each entry refers to entry within slots.json.",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#aSlotsWeHave"
}
```

**Commentary:** Not-seen — field absent from wiki. Values like "body", "WoundAbdomenLower", "armUpperR", "pledges", "social" match the slot naming convention. A with high confidence given the naming pattern and data/slots/ folder existence.

**Confidence:** high — values clearly match slot naming conventions.

---

### `aStartingCondRules` — Outcome A

- **Auto-parser status:** not-seen
- **Wiki shape hint:** `a` prefix → array; values contain condition rule names
- **Real-data shape:** string[] (69/1,110 objects; values like "DcAchievement=1", "DcAging=1")

The wiki discusses Condition Rules conceptually but never names `aStartingCondRules`. Values follow the pattern `CondRuleName=priority` which is a mini-DSL similar to CondStrings but for condition rules. The condition rule name portion (e.g., "DcAchievement") refers to `data/condrules/`.

**Proposed schema entry:**
```json
"aStartingCondRules": {
  "type": "array",
  "description": "Condition rules active on this condowner at spawn. Each entry is a condition rule string (Name=priority). Each name refers to entry within condrules.json.",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#aStartingCondRules"
}
```

**Commentary:** Not-seen by the auto-parser. The value format `DcAchievement=1` is structurally similar to CondStrings but simpler (no `x` duration component — just `Name=priority`). The `CONDSTRING_MARKERS` regex in the extractor looks for "condition string" or "condition equation" phrasing; it would not match a wiki description of this field unless it used those exact terms. This is A with high confidence — condrules folder existence and value naming pattern are both strong evidence.

**Confidence:** high — 69 objects, values consistently follow condrules naming convention.

---

### `mapSlotEffects` — Outcome A

- **Auto-parser status:** not-seen
- **Wiki shape hint:** `map` prefix → array in data (flat list, not dict); values are slot effect references
- **Real-data shape:** string[] (574/1,110 objects; values like "drag", "Blank")

The wiki page discusses slot effects (equipping grants conditions like "IsAirtight") but never names `mapSlotEffects`. Real data shows string arrays; values like "drag" and "Blank" may refer to a slot effects definition folder or may be interaction/condition names. The target folder is uncertain.

**Commentary:** C outcome due to target ambiguity. The `map` prefix again mismatches the actual array shape in data. Values "drag" and "Blank" are too short/generic to identify a target folder from naming convention alone. The wiki section on slots says "Slot Effects — Conditions applied when equipped — Wearing a spacesuit grants IsAirtight," suggesting slot effects reference conditions — but "drag" and "Blank" don't match condition naming conventions. This needs the `data/sloteffects/` folder to be checked (if it exists) or wiki clarification of the value format.

**Confidence:** low for any specific target — the value pattern is inconsistent with known naming conventions.

---

### `mapAltItemDefs` — Outcome C

- **Auto-parser status:** not-seen
- **Wiki shape hint:** `map` prefix → array in data (flat list); "AltItemDefs" suggests mode-switching targets
- **Real-data shape:** string[] (70/1,110 objects; values like "IsSolid", "ItmAtmoScrubber01Ready")

> "Mode switching is complex because it must: Remove the old CondOwner from its current location, Create the new CondOwner at the same position, Transfer all persistent state…"

The wiki discusses mode switching ("Mode Switching: Transformation") but never names `mapAltItemDefs`. Values include both condition names ("IsSolid") and item names ("ItmAtmoScrubber01Ready"), suggesting this is a mixed or multi-type field.

**Commentary:** C outcome. The value set contains both condition-named strings and item-named strings, making the cross-reference target ambiguous without wiki documentation. The name "AltItemDefs" suggests it lists alternative item definitions for mode switching, but the presence of what looks like a condition name ("IsSolid") in the same array complicates this. Needs wiki documentation or source inspection to resolve.

**Confidence:** low — value pattern is heterogeneous and target cannot be determined from naming alone.

---

### `mapPoints` — Outcome B

- **Auto-parser status:** not-seen
- **Wiki shape hint:** `map` prefix → array in data (flat list); named-point strings
- **Real-data shape:** list (830/1,110 objects; in sample objects appears as empty list `[]`; wiki confirms it's a name→position map)

> "Named points (mapPoints) let objects have specific interaction locations: 'use' — Where to stand when interacting, 'sit' — Where to position when sitting, 'install' — Where to stand when installing"

The wiki explicitly names `mapPoints` in the "Position & Named Points" section and describes it as a map of named interaction locations. Real data shows it as a list (often empty).

**Proposed schema entry:**
```json
"mapPoints": {
  "type": "array",
  "description": "Named interaction points on the condowner (e.g. 'use', 'sit', 'install'). Defines where characters should stand when interacting with specific positions on this object.",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#mapPoints"
}
```

**Commentary:** The wiki explicitly names `mapPoints` in prose (not a wikitable first-column cell), so the auto-parser's `field_candidates_from_prose` could in principle match it if it appeared as `'''mapPoints'''`. Looking at the wiki text: "'''Named points''' (mapPoints) let objects..." — the bold text wraps "Named points", not `mapPoints` itself. The field name appears in parentheses after bold prose, which is outside both the wikitable extractor and the bold-field-name prose extractor's patterns. This is a recall miss: the parser would need to recognize the `(fieldName)` parenthetical pattern. B outcome — no cross-reference, just position data.

**Confidence:** high — field is explicitly documented in wiki prose; no reference target.

---

### `mapCondTolerance` — Outcome C

- **Auto-parser status:** not-seen
- **Wiki shape hint:** `map` prefix → array in data (flat list)
- **Real-data shape:** list (631/1,110 objects; appears as empty list `[]` in most samples)

The wiki does not mention `mapCondTolerance` anywhere by that name. The wiki does discuss condition preferences and comfort zones under "Condition Rules: Why Do I Want Things?" — "Each rule defines a 'comfort zone' for a condition. When the actual value differs from the preferred value, the CondOwner becomes motivated to fix it." This may relate conceptually, but the field name is never stated.

**Commentary:** C outcome. Present in 631 objects but never documented on this wiki page. The "Cond Tolerance" name suggests it maps conditions to tolerance thresholds, but without wiki documentation or non-empty real-data samples to inspect, the value format is unknown. This is a pure recall miss from the wiki being silent on the field name.

**Confidence:** low — field exists in data, no wiki documentation found on this page.

---

### `mapGUIPropMaps` — Outcome C

- **Auto-parser status:** not-seen
- **Wiki shape hint:** `map` prefix → array in data (flat list)
- **Real-data shape:** string[] or null (752/1,110 objects; non-null values like "Duties", "Finance", "FFWD", "Encounter", "Hire", "Inventory", "Roster", "SocialCombat", "Trade", "Vote", "Panel A", "HeaterItemGeneric", "PDAVizSettings")

The wiki does not document `mapGUIPropMaps`. The values look like UI panel names, suggesting this maps conditions to GUI property displays, but the target type is unclear — these do not appear to be `strName` values from any standard data folder.

**Commentary:** C outcome. The value pattern (UI panel strings) suggests this is a display/layout configuration field rather than a cross-reference to a data folder. Without wiki documentation it cannot be classified more precisely. The field is present in most crew/item objects but its structure is opaque from the data alone.

**Confidence:** low — no wiki documentation; value pattern suggests non-referential UI config.

---

### `jsonPI` — Outcome C

- **Auto-parser status:** not-seen
- **Wiki shape hint:** `json` prefix — unusual; not in the standard Hungarian-prefix list
- **Real-data shape:** string or null (620/1,110 objects; non-null value like "AICargo01")

The wiki does not document `jsonPI`. The `json` prefix is not in the parser's `DIRECT_PREFIXES` or `ARRAY_PREFIXES` — it would not be detected by `looks_like_field()` at all. The value "AICargo01" could be a reference to an AI profile or some other definition type.

**Commentary:** C outcome. The `json` prefix fails `looks_like_field()` because the character after "json" is uppercase 'P' but "json" is not in any recognized prefix list. This is both a wiki documentation gap and a parser limitation — even if the wiki documented this field, the auto-parser would not recognize it as a field name. Resolution: add `"json"` as a recognized prefix (with uppercase-following check) to `looks_like_field()`, and document the field on the wiki.

**Confidence:** low — no wiki documentation; target type unknown.

---

### `nContainerHeight` / `nContainerWidth` — Outcome B

- **Auto-parser status:** not-seen
- **Wiki shape hint:** `n` prefix → numeric (non-ref by parser convention)
- **Real-data shape:** int (both present in 214/1,110 objects; values like 1, 2, 3, 5, 10)

> "Containers are grid-based storage spaces where physical items go… The physical space constraint makes inventory management a real consideration."

The wiki discusses containers and their grid layout but never names `nContainerHeight` or `nContainerWidth`. The `n` prefix means these are numeric non-reference fields; the parser correctly routes them to non-string-shaped (review queue) if seen, but they don't appear on this wiki page at all.

**Proposed schema entry:**
```json
"nContainerHeight": {
  "type": "integer",
  "description": "Height in grid cells of this condowner's container storage space.",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#nContainerHeight"
},
"nContainerWidth": {
  "type": "integer",
  "description": "Width in grid cells of this condowner's container storage space.",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#nContainerWidth"
}
```

**Commentary:** B outcomes — numeric, no cross-reference. Not-seen by auto-parser. The wiki container size table (Backpack 3×4, Storage Crate 5×5, etc.) implies these fields but never names them. Together they define grid-based container capacity.

**Confidence:** high — integer fields, semantics clear from naming.

---

### `nStackLimit` — Outcome B

- **Auto-parser status:** not-seen
- **Wiki shape hint:** `n` prefix → numeric
- **Real-data shape:** int (159/1,110 objects; values like 5, 10, 20, 50, 99)

> "Stacking allows identical items to occupy one 'slot' in the world while representing multiple copies… Stack limit reached — Item won't stack further (max 99, 50, etc.)"

The wiki mentions stack limits in the stacking section but never names `nStackLimit`. Numeric, non-reference.

**Proposed schema entry:**
```json
"nStackLimit": {
  "type": "integer",
  "description": "Maximum number of identical items that can be stacked together.",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#nStackLimit"
}
```

**Commentary:** B outcome. The wiki mentions stack limits but never the field name. `n` prefix is numeric/non-ref. Not-seen.

**Confidence:** high — integer field, semantics unambiguous.

---

### `strPortraitImg` — Outcome B

- **Auto-parser status:** not-seen
- **Wiki shape hint:** `str` prefix → string; but "Img" suffix suggests asset path, not a data object reference
- **Real-data shape:** string or null (1,104/1,110 objects; values like "ItmSink01", "ItmBackpack01")

The wiki does not document `strPortraitImg` as a field. Values look like sprite/image asset names. This is a near-universal field but references game assets, not `data/` JSON objects.

**Commentary:** B outcome — display/asset reference, not a cross-reference to any data folder. The naming convention (ItmFoo, AAFoo) matches item naming but these are sprite asset names, not item `strName` values from items.json. Worth documenting but does not produce a schema rule.

**Confidence:** high — asset reference pattern confirmed, not a JSON folder reference.

---

### `strPaperDollImg` — Outcome B

- **Auto-parser status:** not-seen
- **Wiki shape hint:** `str` prefix → string; "Img" suffix → asset path
- **Real-data shape:** string (2/1,110 objects; value "Crew2PS01")

The wiki does not document `strPaperDollImg`. Extremely rare field (2 occurrences). Asset reference.

**Commentary:** B outcome — asset reference. Too rare to be high priority.

**Confidence:** med — very few samples; likely correct B classification.

---

### `bSaveMessageLog` — Outcome B

- **Auto-parser status:** not-seen
- **Wiki shape hint:** `b` prefix → boolean
- **Real-data shape:** bool (3/1,110 objects; value `true`)

> "For player characters and important NPCs, this log is saved between sessions."

The wiki mentions message log saving in the "Message Logging" section but never names `bSaveMessageLog`. Extremely rare boolean (3 occurrences).

**Commentary:** B outcome — boolean flag, no cross-reference. Present only on special crew objects.

**Confidence:** high — boolean, semantics align with wiki description.

---

### `aComponents` — Outcome C

- **Auto-parser status:** not-seen
- **Wiki shape hint:** `a` prefix → array
- **Real-data shape:** string[] (2/1,110 objects; value ["LootSpawner"])

> "CondOwners can have additional Unity components added dynamically: GasExchange, GasPump, Heater, Explosion, Wound. These are added via the Update Commands system..."

The wiki describes Unity component composition but names the mechanism as "Update Commands" (→ `aUpdateCommands`). The `aComponents` field is present in only 2 objects with value "LootSpawner" — this may be a distinct component injection system or a legacy/alternate approach. The value "LootSpawner" is a C# component name, not a data folder reference.

**Commentary:** C outcome. Extremely rare (2 objects), value is a C# type name, wiki doesn't document this specific field. Relationship to `aUpdateCommands` is unclear without source inspection.

**Confidence:** low — 2 occurrences, ambiguous relationship to documented systems.

---

### `dictSlotsLayout` — Outcome B

- **Auto-parser status:** not-seen
- **Wiki shape hint:** `dict` prefix → object/dict in data
- **Real-data shape:** object (20/1,110 objects; maps slot names to `{x, y, z}` position objects)

The wiki discusses slot positions conceptually but never names `dictSlotsLayout`. Real data shows it as a dictionary mapping slot names (like "self", "pocket_pouchSm01") to 3D position coordinates — pure layout/positioning data.

**Commentary:** B outcome — spatial layout data, no cross-reference to JSON data folders. The slot name keys (e.g., "pocket_pouchSm01") might reference slot definitions, but the values are coordinate triples, not string references.

**Confidence:** high — structure is clear from data; no referential pattern.

---

### `mapAltSlotImgs` — Outcome B

- **Auto-parser status:** not-seen
- **Wiki shape hint:** `map` prefix → array in data (flat list)
- **Real-data shape:** string[] (17/1,110 objects; values alternate between item names and asset path strings, e.g., "ItmDrinkBottle01Clear", "paperdoll/held/bodyDrinkBottle01ClearL")

The wiki does not document `mapAltSlotImgs`. Values appear to alternate between item `strName` values and sprite asset paths. This is likely a display/paperdoll configuration field.

**Commentary:** B outcome — display/asset configuration. The alternating pattern (item name, asset path) suggests a mapping from item variant to its paperdoll image, not a pure JSON cross-reference.

**Confidence:** med — pattern is consistent but the field is undocumented.

---

## Page-level notes

### PAGE_TO_FOLDER: Already correct

`Modding__CondOwners` is correctly mapped to `condowners` in `PAGE_TO_FOLDER`. No change needed.

### Wiki structure assessment: narrative page, not a field reference

The Modding/CondOwners page is primarily conceptual documentation — it explains *why* the CondOwner system works as it does, with extensive prose and high-level tables about game mechanics. The only wikitable that documents actual JSON field names is the five-row "Identity: What Am I?" table (`strID`, `strCODef`, `strName`, `strNameFriendly`, `strNameShort`). The vast majority of condowner fields (`aInteractions`, `aTickers`, `aUpdateCommands`, `mapSlotEffects`, `strAudioEmitter`, etc.) are documented only conceptually or not at all. The page explicitly defers to `[[Data:CondOwners]]` for the JSON structure.

**Wiki-edit suggestion:** The page would produce dramatically better auto-parser recall if the "For Modders & Data Designers" section contained a wikitable of JSON fields with descriptions that follow the standard `.json`-anchored reference phrase patterns. Alternatively, the `[[Data:CondOwners]]` page (if it exists and has field tables) should be added to `PAGE_TO_FOLDER` as a separate mapping — it would be the higher-yield target for condowners field extraction.

### Parser-improvement opportunity: `(fieldName)` parenthetical pattern

The `mapPoints` field is documented as "'''Named points''' (mapPoints) let objects have specific interaction locations" — the field name appears in parentheses after a bold label, not as the bold text itself. Neither `field_candidates_from_table` nor `field_candidates_from_prose` would detect this pattern. A generalizable fix would be to add a prose regex matching `\(([A-Za-z][A-Za-z0-9_]+)\)` near a field-like name, after the existing bold-field extractor. Low priority given this page's low yield, but worth noting for pages that use this convention.

### Parser-improvement opportunity: `json` prefix not recognized

The `jsonPI` field fails `looks_like_field()` because `"json"` is not in any recognized prefix list. If the `json` prefix is intentional Hungarian notation in the game's codebase, it should be added to `DIRECT_PREFIXES`. Check whether other folders have `json`-prefixed fields before adding it globally.

### Review-queue resolution summary

The five review-queue items for this page resolve as:
- `strID`: C — save-file field, absent from data definitions. No schema entry.
- `strCODef`: C — save-file field, absent from data definitions. Would be A in save-file context (→ condowners).
- `strName`: B — primary key, no outbound reference. Existing schema entry is correct.
- `strNameFriendly`: B — display string. Existing schema entry is correct.
- `strNameShort`: B — display string. Existing schema entry is correct.
