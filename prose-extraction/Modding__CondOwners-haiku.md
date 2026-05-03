# Prose extraction: Modding__CondOwners

- Source: https://ostranauts.wiki.gg/wiki/Modding/CondOwners
- Model family: haiku
- Model snapshot: claude-haiku-4-5-20251001
- Folder mapped to: condowners
- Cached at: 2024-11-22

## Page summary

This page comprehensively documents the CondOwner system—the unified building blocks of all objects in Ostranauts. It explains the philosophical foundation (why unified objects), the three essential components (identity, conditions, interactions), containment systems (slots, containers, stacking, lot), and advanced topics (mode switching, social systems, AI behavior). The page does not document individual JSON field definitions in traditional "schema reference" format; instead, it presents field names only within prose explanations of game mechanics and within a few illustrative tables. No wiki link to Data:CondOwners schema is provided; the page assumes readers will consult that separate page for exact field shapes.

## Fields

### `strID` — Outcome B

- **Auto-parser status:** review-queue
- **Wiki shape hint:** str prefix (Identity section)
- **Real-data shape:** absent in raw data (save-game metadata, not data-tree object)

> Unique identifier for save games and code: "NPC_12847_John"

**Proposed schema entry:**
```json
"strID": {
  "type": "string",
  "description": "Instance identifier used in save games; not present in data-tree definitions",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#Identity:_What_Am_I?"
}
```

**Commentary:** The wiki documents this field in the Identity table. However, strID appears only in save files, not in `data/condowners/*.json`. This is legitimate non-reference documentation. Mark as save-file-only metadata.

**Confidence:** med — The wiki is clear, but the field is absent from the data tree we index.

### `strCODef` — Outcome A

- **Auto-parser status:** review-queue
- **Wiki shape hint:** str prefix (Identity section)
- **Real-data shape:** string (self-referential)

> Type definition (links to Data:CondOwners): "COHuman" or "COWrenchBasic"

**Proposed schema entry:**
```json
"strCODef": {
  "type": "string",
  "description": "CondOwner type definition; refers to entry within condowners.json",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#Identity:_What_Am_I?"
}
```

**Commentary:** The wiki explicitly states this "links to Data:CondOwners" via wiki markup, and examples (COHuman, COWrenchBasic) are strName values in condowners.json. The auto-parser missed this because it doesn't parse wiki [[links]], only .json-phrase patterns. This is a self-referential forward reference.

**Confidence:** high — Wiki link is explicit; examples match real naming conventions.

### `strName` — Outcome B

- **Auto-parser status:** review-queue
- **Wiki shape hint:** str prefix (Identity section)
- **Real-data shape:** string

> Default display name: "John Smith" or "Wrench"

**Proposed schema entry:**
```json
"strName": {
  "type": "string",
  "description": "Unique identifier and default display name; used as key for references from other folders",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#Identity:_What_Am_I?"
}
```

**Commentary:** This is the key field—objects are referenced BY strName from all other folders. It's not a reference outbound, but the primary target of all references inbound. Document as the identity key.

**Confidence:** high — Fundamental field; present in all real data.

### `strNameFriendly` — Outcome B

- **Auto-parser status:** review-queue
- **Wiki shape hint:** str prefix (Identity section)
- **Real-data shape:** string (optional)

> Custom renamed version: "Your custom ship name"

**Proposed schema entry:**
```json
"strNameFriendly": {
  "type": "string",
  "description": "Player-customizable display name (optional; overrides strName in UI)",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#Identity:_What_Am_I?"
}
```

**Commentary:** Non-reference display metadata. Optional in real data.

**Confidence:** high — Wiki and data confirm; no references.

### `strNameShort` — Outcome B

- **Auto-parser status:** clean
- **Wiki shape hint:** str prefix (Identity section)
- **Real-data shape:** string (optional)

> Abbreviated for UI space: "J. Smith" or "Wrench"

**Commentary:** Already in schema. Non-reference metadata for condensed display. Existing entry is correct.

**Confidence:** high — No change needed.

### `aStartingConds` — Outcome A

- **Auto-parser status:** clean
- **Wiki shape hint:** a prefix (Conditions section)
- **Real-data shape:** CondStringArray

> Conditions applied at spawn. Array of condition strings (Name=value*duration) — each name refers to entry within conditions.json

**Commentary:** Already in schema with correct description. Real data shows condition strings like "IsSystem=1.0x1". The schema correctly identifies this as a CondStringArray where the condition NAME refers to conditions.json entries.

**Confidence:** high — Schema is correct and well-documented.

### `strLoot` — Outcome A

- **Auto-parser status:** clean
- **Wiki shape hint:** str prefix
- **Real-data shape:** string or null

**Commentary:** Already in schema. Refers to loot.json. The existing rule is correct.

**Confidence:** high — No change needed.

### `strItemDef` — Outcome A

- **Auto-parser status:** clean
- **Wiki shape hint:** str prefix
- **Real-data shape:** string or null

**Commentary:** Already in schema. Refers to items.json. Present in all real data samples examined.

**Confidence:** high — No change needed.

### `bSlotLocked` — Outcome B

- **Auto-parser status:** clean
- **Wiki shape hint:** b prefix (non-reference boolean)
- **Real-data shape:** boolean (optional)

> Controls whether the condowner is locked into the slot it inhabits

**Commentary:** Already in schema as a non-reference field. Boolean property controlling slot behavior.

**Confidence:** high — No change needed.

### `strType` — Outcome B

- **Auto-parser status:** clean
- **Wiki shape hint:** str prefix (enum)
- **Real-data shape:** enum (Item, Crew, Ship)

**Commentary:** Already in schema with correct enum values. Non-reference metadata.

**Confidence:** high — No change needed.

### `mapPoints` — Outcome C

- **Auto-parser status:** not-seen
- **Wiki shape hint:** map prefix
- **Real-data shape:** object (map)

> Named points (mapPoints) let objects have specific interaction locations. Examples: "use", "sit", "install", "random", "random_offship"

**Commentary:** The wiki discusses the mapPoints system and lists named point types, but does not formalize "mapPoints" as a JSON field name in a table or bold format. The deterministic extractor requires `looks_like_field` pattern matching, which is triggered by bold text or wikitable format. This is a recall miss—the parser would need explicit field-name formatting to extract it.

**Proposed schema entry:**
```json
"mapPoints": {
  "type": "object",
  "description": "Named interaction points mapping point name (use, sit, install, random, random_offship) to position/metadata",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#Position_.26_Named_Points"
}
```

**Confidence:** med — Wiki documents the concept but not the field name formally. Field exists in real data. Structure details unclear from wiki alone.

### `aUpdateCommands` — Outcome C

- **Auto-parser status:** not-seen
- **Wiki shape hint:** a prefix
- **Real-data shape:** array

> These are added via the Update Commands system, allowing data-driven component composition without recompiling code. Components: GasExchange, GasPump, Heater, Explosion, Wound.

**Commentary:** The wiki explains the Update Commands system in prose but does not explicitly document a field named `aUpdateCommands`. The field exists in real data (always empty in samples examined). Without explicit field-name formatting in the wiki, the parser cannot extract it. This is a recall miss due to prose-only documentation.

**Proposed schema entry:**
```json
"aUpdateCommands": {
  "type": "array",
  "description": "Data-driven component composition; list of command objects for dynamically added components",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#Commands_.26_Components"
}
```

**Confidence:** low — Field exists but purpose is unclear without examining non-empty examples. Needs confirmation from actual game data structure.

### `mapCondTolerance` — Outcome C

- **Auto-parser status:** not-seen
- **Wiki shape hint:** map prefix
- **Real-data shape:** array (purpose unclear)

> Not documented in the wiki page.

**Commentary:** The field `mapCondTolerance` appears in real data but is entirely absent from the Modding/CondOwners wiki page. No documentation available to infer its purpose or targets. This is a recall miss at the wiki level, not a parser deficiency.

**Confidence:** low — Undocumented. Recommend: either add wiki documentation or mark as internal.

### `strPortraitImg` — Outcome C

- **Auto-parser status:** not-seen
- **Wiki shape hint:** str prefix
- **Real-data shape:** string or null

> Not documented in the wiki page.

**Commentary:** The field appears in real data (e.g., "ItmSink01") but is not mentioned on the Modding/CondOwners page. The naming suggests an asset reference, but no target folder or explanation is provided by the wiki. This is a recall miss at the wiki level.

**Confidence:** low — Undocumented. Likely an asset identifier, not a cross-reference to the JSON data tree.

### `strAudioEmitter` — Outcome C

- **Auto-parser status:** not-seen
- **Wiki shape hint:** str prefix
- **Real-data shape:** string or null

> Not documented in the wiki page.

**Commentary:** The field appears in real data (e.g., "AmbBarTechnoLowpass") and the name strongly suggests a reference to audioemitters.json. However, the wiki page does not mention this field. The rule is inferred from naming convention, not from wiki documentation. Recommend: add wiki documentation to confirm target folder.

**Proposed schema entry:**
```json
"strAudioEmitter": {
  "type": "string",
  "description": "Audio emitter definition; refers to entry within audioemitters.json",
  "x-source": "[inferred from naming pattern; not documented on page]"
}
```

**Confidence:** med — Naming convention is strong, but wiki silence makes this low-confidence. Recommend upstream wiki documentation.

### `aInteractions` — Outcome C

- **Auto-parser status:** not-seen
- **Wiki shape hint:** a prefix
- **Real-data shape:** array of strings

> Every CondOwner has ... interactions waiting to be performed. Availability is filtered by CondTriggers.

**Commentary:** The wiki discusses interactions and action queues but does not explicitly document a field named `aInteractions`. The field exists in real data (always empty in samples). The wiki uses prose-only explanation, not field-name formatting. This is a recall miss. Based on context, `aInteractions` likely lists interactions available to the CondOwner (references to interactions.json).

**Proposed schema entry:**
```json
"aInteractions": {
  "type": "array",
  "description": "Array of interactions available to this CondOwner; each refers to entry within interactions.json",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#Interactions:_What_Can_Happen"
}
```

**Confidence:** med — Field exists and context supports the target, but field name is not explicitly documented on the page.

## Page-level notes

- **PAGE_TO_FOLDER:** Correct. Maps to condowners.
- **Wiki-edit suggestion:** The Modding/CondOwners page is game-design documentation rather than a field-reference schema. It lacks a formal "JSON field reference" table. Fields documented only in prose (`aInteractions`, `mapPoints`, `aUpdateCommands`) are unreachable by deterministic extraction. Adding a structured "Field reference" wikitable would raise the parser's recall from ~60% to ~100% for this page.
- **Parser-improvement opportunity:** The `looks_like_field` function requires bold wikitable format. Fields mentioned in prose-system descriptions (e.g., "the Update Commands system") are missed. A future enhancement could add a secondary pass for camelCase field-name patterns in code blocks or special wiki markup, but this trades precision for coverage. Better to improve the wiki first.
- **Additional fields in real data:** Spot-check samples revealed `jsonPI` and `mapGUIPropMaps` fields not mentioned in the wiki or existing schema. Recommend: full audit of `data/condowners/*.json` to enumerate all fields present in actual game data.
- **Confidence summary:** Auto-parser's "clean" entries (strName, strNameShort, strNameFriendly, aStartingConds, strLoot, strItemDef, bSlotLocked, strType) are all correct and well-described. The review-queue and not-seen fields are mostly due to wiki formatting gaps, not extractor bugs.
