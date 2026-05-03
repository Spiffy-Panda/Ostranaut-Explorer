# Prose extraction: Modding__CondOwners

- Source: https://ostranauts.wiki.gg/wiki/Modding/CondOwners
- Model family: opus
- Model snapshot: claude-opus-4-7
- Folder mapped to: condowners
- Cached at: (no `cached_at` line in frontmatter — only `source_url`, `source_title`, `display_title`, `section_count`)

## Page summary

The Modding/CondOwners wiki page is a long-form architectural primer, not a field reference. It explains why Ostranauts uses a unified "everything is a CondOwner" object system — identity, conditions (state), interactions (verbs) — and walks through containment (slots/containers/stacking/lot), action queues, AI loops, faction reputation, mode switching, save/load, economy, and tickers. The page explicitly defers field-shape documentation to the (linked but not crawled) `Data:CondOwners` page; only one wikitable on this page (the Identity table) directly enumerates JSON property names. Most "fields" extracted here are mentioned glancingly in prose (e.g. `aQueue`, `bPersists`, `mapPoints`) and need to be cross-referenced with `data/condowners/*.json` to verify shape. The auto-parser's review-queue residue for this page is exactly the five rows of the Identity wikitable.

## Fields

### `strID` — Outcome C

- **Auto-parser status:** review-queue
- **Wiki shape hint:** `str` prefix → string
- **Real-data shape:** absent in `data/condowners/*.json` (verified via `scrap_scripts/python/05_condowners_keys.py` — 32 distinct keys, no `strID`)

> '''strID''' || Unique identifier for save games and code || "NPC_12847_John"

**Commentary:** The wiki places this in the Identity table on the same row as `strName`/`strCODef`/etc., but the description ("Unique identifier for save games and code") plus the example value (`NPC_12847_John` — instance-id, not a definition name) makes clear that `strID` is a *runtime / save-file* property, not a data-tree property. The 1,104 condowner objects under `data/condowners/` carry no `strID` key. So this is C, not B: ambiguous-by-context — the wiki documents it in the same table as data-tree fields, but it is not a data-tree field. The right resolution is a wiki-edit suggestion (split the Identity table into "data-tree fields" vs "runtime/instance fields") rather than an overlay schema entry. The deterministic extractor correctly flagged it ("no .json target found in description") because no rule applies; classifying it as B would falsely advertise a data-tree property that doesn't exist.

**Confidence:** high — ground-truth aggregation across all `condowners/*.json` files confirms absence.

### `strCODef` — Outcome C

- **Auto-parser status:** review-queue
- **Wiki shape hint:** `str` prefix → string
- **Real-data shape:** absent in `data/condowners/*.json`

> '''strCODef''' || Type definition (links to [[Data:CondOwners]]) || "COHuman" or "COWrenchBasic"

**Commentary:** The peer haiku run classified this as A with a self-referential `→ condowners.json` rule. I disagree on classification grounds: like `strID`, this field does not appear in any `data/condowners/*.json` object — the 32-key aggregate covers `strName`, `strItemDef`, `strType`, etc., but no `strCODef`. The wiki's own example values (`COHuman`, `COWrenchBasic`) ARE valid `strName`s in condowners, so semantically the wiki is telling us this is a save-game pointer back to a definition's `strName`. But you cannot add a v1 schema rule for a field that no real data-tree object emits — the extracted edge would never fire on the `data/` corpus the parser indexes. This belongs in a future "save-file schema" not in `condowners-schema.json`. Wiki-edit suggestion: relocate `strID` and `strCODef` out of the Identity wikitable into a separate "instance / save-file fields" table to make the distinction visible.

**Confidence:** high — verified absence from data-tree; verified examples match real `strName`s elsewhere; the disagreement with haiku is over scope, not facts.

### `strName` — Outcome B

- **Auto-parser status:** review-queue (deterministic extractor) / clean (already present in pre-existing hand-edited overlay)
- **Wiki shape hint:** `str` prefix → string
- **Real-data shape:** string (present on 1,104 / 1,104 condowner objects — universal)

> '''strName''' || Default display name || "John Smith" or "Wrench"

**Proposed schema entry:**
```json
"strName": {
  "type": "string",
  "description": "Unique code name of the condowner; the key other folders point at when referencing this object. Per the wiki, also the default in-game display name when strNameFriendly/strNameShort are absent.",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#Identity:_What_Am_I.3F"
}
```

**Commentary:** Already in `comment_mod/data/schemas/condowners-schema.json` ("The code name of the condowner, as referred to in other files."). Auto-parser flagged it as review-queue because the wiki's bare description ("Default display name") doesn't trigger any `.json`-target pattern — there's no target here, this IS the target field. The existing overlay description is correct in substance and richer than the wiki's; my proposed entry merely adds an `x-source`. Note the wiki conflates two roles into one field: the unique-key role and the default-display-name role. That conflation is real in-game but worth flagging in the description for downstream consumers.

**Confidence:** high — universal in real data; semantics are uncontroversial.

### `strNameFriendly` — Outcome B

- **Auto-parser status:** review-queue (deterministic extractor) / clean (in pre-existing overlay)
- **Wiki shape hint:** `str` prefix → string
- **Real-data shape:** string (present on 1,077 / 1,104 condowners)

> '''strNameFriendly''' || Custom renamed version || Your custom ship name

**Proposed schema entry:**
```json
"strNameFriendly": {
  "type": "string",
  "description": "Human-readable display name. Per the wiki, used for player-customizable rename data (e.g. ship names) and overrides the default strName in UI.",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#Identity:_What_Am_I.3F"
}
```

**Commentary:** Already in the overlay as "The human readable name of the condowner." Display-only string — no reference target, correctly absent from auto-parser's schema output. The wiki's "Your custom ship name" example is misleading (suggests it's only set at runtime), but real data uses it freely as a static friendly label (`"Regolith"`, `"Sink"` etc.). B-not-A: there's no evidence this string keys into any folder.

**Confidence:** high — present in 97% of objects with no detectable reference semantics.

### `strNameShort` — Outcome B

- **Auto-parser status:** review-queue (deterministic extractor) / clean (in pre-existing overlay)
- **Wiki shape hint:** `str` prefix → string
- **Real-data shape:** string (present on 1,043 / 1,104 condowners)

> '''strNameShort''' || Abbreviated for UI space || "J. Smith" or "Wrench"

**Proposed schema entry:**
```json
"strNameShort": {
  "type": "string",
  "description": "Abbreviated display name used in compact UI elements (tooltips, lists). Display-only, no cross-folder reference semantics.",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#Identity:_What_Am_I.3F"
}
```

**Commentary:** Already in the overlay. Pure display string. Auto-parser correctly couldn't extract a target. Confirmed by ground-truth: shows up as `"Sink"`, `"Regolith"`, `"Void"` etc. — none of those are valid strNames in any folder.

**Confidence:** high — universal display field with no resolvable target.

### `aStartingConds` — Outcome A

- **Auto-parser status:** clean (in pre-existing overlay) — but described in prose on this page, not in a wikitable on this page
- **Wiki shape hint:** `a` prefix → array; element shape "Name=value*duration"
- **Real-data shape:** `array<string+condstring>` — every one of 1,104 objects has it; condition-string shape verified (e.g. `"IsSystem=1.0x1"`)

> Conditions are the "memory" of every object. When something happens to a CondOwner, it gains or loses conditions.

**Proposed schema entry:**
```json
"aStartingConds": {
  "type": "array",
  "description": "Conditions applied at spawn. Array of condition strings (Name=value*duration) — each name refers to entry within conditions.json.",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#Conditions:_What_State_Am_I_In.3F"
}
```

**Commentary:** Already in the overlay verbatim. The wiki page documents the *concept* of conditions (with the examples `DamageBlunt`, `StatWear`, `StatPower`, `IsInstalled`) but does not name the field `aStartingConds` directly — that name comes from the data-tree itself and from prior schema work. The CondString DSL (`Name=value*duration`) is exactly what PROJECT-PITCH.md decision #6 mandates be preserved on the edge. Auto-parser couldn't have derived this rule from this page (the field name is never bolded as `'''aStartingConds'''` in the prose) — the rule originated elsewhere. Keep the existing overlay entry; it's correct.

**Confidence:** high — confirmed by 100% data-tree presence and the explicit condition-string shape in every value.

### `aQueue` — Outcome C

- **Auto-parser status:** not-seen
- **Wiki shape hint:** `a` prefix → array (per Hungarian convention)
- **Real-data shape:** absent from `data/condowners/*.json` (32-key aggregate; no `aQueue`)

> Every CondOwner has a ''to-do list'' called the '''action queue''' (aQueue). This is an ordered list of interactions waiting to be performed.

**Commentary:** The wiki names this field explicitly in prose (parenthetical `(aQueue)`), but the deterministic extractor missed it because the bold token is `'''action queue'''` (display name), not `'''aQueue'''`. Even if it had been bold, the surrounding prose doesn't carry a `.json`-target phrase — it would have landed in the review queue. More importantly, ground-truth check: `aQueue` is not a property on any `condowners/*.json` object. Like `strID`, this is runtime/instance state (the queue is populated as the game runs), not a data-tree definition field. C-not-A. Wiki-edit suggestion would be to move `(aQueue)` mentions out of the modding page or annotate them as runtime-only.

**Confidence:** high — verified absence; the prose framing ("ordered list of interactions waiting to be performed") describes runtime state.

### `mapPoints` — Outcome A

- **Auto-parser status:** not-seen (extractor's prefix list is `str/a/n/f/b/obj/Loot/CT/PSpec/dict/map/pledge` — `map` IS in the list, but only `looks_like_field` matches it; `mapPoints` is bolded only once and the surrounding prose has no `.json` target)
- **Wiki shape hint:** `map` prefix → array (per `ARRAY_PREFIXES`)
- **Real-data shape:** `array<string>` — present on 830 / 1,104 condowners; values are CSV-encoded strings like `"Left,-16,0"`, `"Up,0,-16"`, `"Right,16,0"`

> '''Named points''' (mapPoints) let objects have specific interaction locations:

**Proposed schema entry:**
```json
"mapPoints": {
  "type": "array",
  "description": "Named anchor points for interactions, encoded as comma-separated strings (Name,x,y). Includes special points like 'use', 'sit', 'install', 'random', 'random_offship'. Not a cross-folder reference — the names are local labels, not strNames.",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#Position_.26_Named_Points"
}
```

**Commentary:** Strictly speaking this is closer to B than A — the wiki documents named-point labels (`"use"`, `"sit"`, `"install"`, `"random"`, `"random_offship"`) which are NOT cross-folder references; they're hardcoded conventions. Marking it A would mislead the parser into treating these as strName refs. So the rule above intentionally has NO `Refers to entry within X.json` phrase. This is an A-shaped entry (it would survive in the overlay) but with description language explicitly disclaiming reference semantics — a B in spirit. Tagging it A here in the sense of "wiki implies a target — and the target is an internal vocabulary, not another folder." The deterministic extractor would have needed prefix-`map`-aware prose detection AND a richer description for this; neither exists. Recommend leaving as overlay-only documentation.

**Confidence:** med — shape is verified, but the "not a reference" assertion needs preserving in the description so future extractor passes don't re-promote it.

### `bPersists` — Outcome B

- **Auto-parser status:** not-seen
- **Wiki shape hint:** `b` prefix → boolean (NON_REF_PREFIXES)
- **Real-data shape:** absent at the top level of `condowners/*.json`. The flag actually lives on `conditions/*.json` entries (per the conditions schema), not on condowners themselves.

> '''Persistent conditions''' (marked with bPersists flag) transfer to new CondOwner

**Commentary:** Mentioned only inside the "Mode Switching: What Gets Preserved" prose; never bolded as `'''bPersists'''`, only parenthetical. The deterministic extractor would have needed a "field-name in parentheses after a noun phrase" pattern to catch this. The bigger issue: even if caught, this isn't a CondOwner field — `bPersists` is documented elsewhere as a property of *Condition* definitions. So the right home for any schema entry is `conditions-schema.json`, not `condowners-schema.json`. Skipping in the overlay for this page; flagging as a parser-improvement opportunity (cross-folder field-name disambiguation: when the wiki names a field on page X, verify it lives in folder X before adding the rule there).

**Confidence:** med — confident this isn't a condowners field; less confident about exact home until conditions data is checked.

### `aInteractions` — Outcome A

- **Auto-parser status:** not-seen on this page (the field is referenced via the linked Interactions page, not defined here)
- **Wiki shape hint:** `a` prefix → array
- **Real-data shape:** `array<string>` — 1,059 / 1,104 condowners; example values include `"SOCGreetAI"`, `"GUITrade"`, etc.

> Not every object can do every interaction. Availability is filtered by [[CondTriggers]]:

**Proposed schema entry:**
```json
"aInteractions": {
  "type": "array",
  "description": "Interactions this condowner offers as a target. Array of interaction strNames; each refers to entry within interactions.json.",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#Interactions:_What_Can_Happen"
}
```

**Commentary:** The page itself never spells `aInteractions` out — it talks about "what interactions are available" and links to the Interactions page. The field name comes from the data-tree itself. Auto-parser couldn't have derived this from THIS page; it almost certainly comes from the Interactions page or from existing schemas. Worth proposing here because (a) the page describes the semantic role clearly and (b) ground-truth confirms array-of-strNames pointing at `interactions/`. Cross-page-evidence A.

**Confidence:** high — semantically obvious; verified by 1,059 real-data presences and target-folder existence.

### `aStartingCondRules` — Outcome A

- **Auto-parser status:** not-seen on this page (not bolded; only the *concept* of "Condition Rules" is mentioned, with a wiki link)
- **Wiki shape hint:** `a` prefix → array; rule entries take the shape `Name=N`
- **Real-data shape:** `array<string>` — 69 / 1,104 condowners; example values `"DcAchievement=1"`, `"DcAging=1"`, `"DcAltruism=1"`

> [[Condition Rules]] are what make NPCs (and some objects) "want" things.

**Proposed schema entry:**
```json
"aStartingCondRules": {
  "type": "array",
  "description": "Condition rules attached at spawn. Array of strings of shape Name=value, where each Name refers to entry within condrules.json.",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#Condition_Rules:_Why_Do_I_Want_Things.3F"
}
```

**Commentary:** Page documents the concept but never names the field. Ground-truth shows the values are NOT condition strings (`Name=value*duration`) — they're rule references with optional weight (`Name=N`). So shape is "string array" but element format differs from `aStartingConds`; describing it the same way would be wrong. The deterministic extractor would have needed to see `'''aStartingCondRules'''` bolded with a `condrules.json` cue — neither is on this page. Cross-page-evidence A; the rule above is conservative.

**Confidence:** med — very confident on the target folder; less confident on whether the value DSL is exactly `Name=N` or something richer (no game-data spec on this page).

### `aTickers` — Outcome A

- **Auto-parser status:** not-seen
- **Wiki shape hint:** `a` prefix → array
- **Real-data shape:** `array<string>` — 348 / 1,104 condowners; example values `"Achievement"`, `"AIAgent"`, `"Altruism"`, `"Autonomy"`, `"Blood"`

> '''Tickers''' are Ostranauts' event scheduling system. They're how the game knows "do this thing after X time passes."

**Proposed schema entry:**
```json
"aTickers": {
  "type": "array",
  "description": "Tickers (event schedules) attached to this condowner. Array of ticker strNames; each refers to entry within tickers.json.",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#Time_.26_Events:_The_Ticker_System"
}
```

**Commentary:** Wiki devotes a section to tickers, names the concept `Tickers`, and `tickers` is a recognized term in `WIKI_TERM_TO_FOLDER` — but `aTickers` is never bolded, so the extractor missed it. Cross-page-evidence A: the field exists in real data with array-of-strName shape, and a `tickers/` folder exists in the data tree. Worth adding to overlay.

**Confidence:** med — assumes the strings reference `tickers/` strNames (very likely, but not 100% confirmed without checking tickers folder contents).

### `aUpdateCommands` — Outcome A

- **Auto-parser status:** not-seen
- **Wiki shape hint:** `a` prefix → array
- **Real-data shape:** `array<string>` — 1,045 / 1,104 condowners; example `"GasRespire2,HumanO2,null"` (CSV-shaped: command name + args)

> These are added via the '''Update Commands''' system, allowing data-driven component composition without recompiling code.

**Proposed schema entry:**
```json
"aUpdateCommands": {
  "type": "array",
  "description": "Unity components dynamically attached to this condowner via the Update Commands system. Each entry is a CSV-shaped string of (CommandName,arg1,arg2,...). The first token is a code-side component identifier (GasExchange, GasPump, Heater, Explosion, Wound, etc.) — not a strName reference into any data folder.",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#Commands_.26_Components"
}
```

**Commentary:** Wiki lists code-side component names (`GasExchange`, `GasPump`, `Heater`, `Explosion`, `Wound`). These are C# identifiers compiled into the game, not data-tree strNames. So even though the field has the `a` prefix and looks ref-shaped, no overlay rule should be derived — this is documentation-only (B-substance, A-form). Description above explicitly disclaims a target. Parser-improvement note: code-side enum/identifier targets are a recurring pattern; the parser should learn to recognize them and abstain rather than emitting dangling refs.

**Confidence:** high — verified shape; verified that argument tokens (`HumanO2`) likely DO reference conditions or items but the first token never does.

### `mapChargeProfiles` — Outcome A

- **Auto-parser status:** not-seen (the section calls them "ChargeProfiles", never spells out the field name)
- **Wiki shape hint:** `map` prefix → array
- **Real-data shape:** `array<string>` — 280 / 1,104 condowners; example `"Melee"`, `"MeleeAttackDefaultExtraFragile"`

> Many CondOwners consume resources when used. The '''ChargeProfile''' system handles this generically.

**Commentary:** Field exists in real data but the wiki never names `mapChargeProfiles` directly — only the concept "ChargeProfile system" with a description of resource type / amount-per-use / source / damage-on-use. Ground-truth shows the values are bare strings (e.g. `"Melee"`) which are likely lookup keys into a charge-profile registry — but there's no `chargeprofiles/` folder in `data/`. So this is C in classification: target unknown without further wiki crawl. Skipping a proposed schema entry for safety. Parser-improvement note: when a wiki section describes a "system" with a strong concept name (capital-letter compound noun) but no named field, fold a heuristic that maps section concept → `map<Concept>s` field name and check the data tree for a confirming presence.

**Confidence:** low — high confidence on field-existence and shape; low confidence on what folder (if any) the values reference.

### `mapSlotEffects` — Outcome A

- **Auto-parser status:** not-seen
- **Wiki shape hint:** `map` prefix → array
- **Real-data shape:** `array<string>` — 568 / 1,104 condowners; example values `"drag"`, `"Blank"`

> '''Slot Effects''' || Conditions applied when equipped || Wearing a spacesuit grants '''IsAirtight'''

**Proposed schema entry:**
```json
"mapSlotEffects": {
  "type": "array",
  "description": "Conditions applied to the wearer/parent when this condowner is equipped in a slot. Per the wiki's slot-effects table, these are condition strNames — refers to entry within conditions.json.",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#Slots:_The_Right_Tool_for_the_Right_Job"
}
```

**Commentary:** Wiki gives `IsAirtight` as the example slot-effect value — that's a condition. But ground-truth shows real values like `"drag"` and `"Blank"` (not condition-shaped). So the field may carry mixed payloads (condition names AND non-condition labels like `drag`/`Blank`). The proposed rule could produce false positives on the non-condition entries. Confidence is medium because the wiki phrasing strongly implies condition-target while the data shows broader use. Worth proposing, but flag for review.

**Confidence:** med — wiki-data tension; rule may overfit.

### `aSlotsWeHave` — Outcome A

- **Auto-parser status:** not-seen
- **Wiki shape hint:** `a` prefix → array
- **Real-data shape:** `array<string>` — 72 / 1,104 condowners; example `"body"`, `"WoundAbdomenLower"`, `"WoundChest"`, `"head"`, `"hardpoint_1"` (matches the wiki's named-slot examples)

> '''Slot Name''' || Identifies the socket || "heldL", "heldR", "head", "hardpoint_1"

**Proposed schema entry:**
```json
"aSlotsWeHave": {
  "type": "array",
  "description": "Slot names this condowner exposes for child attachment. Each refers to entry within slots.json.",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#Slots:_The_Right_Tool_for_the_Right_Job"
}
```

**Commentary:** Wiki documents slot-name semantics in a wikitable with examples that match real data verbatim (`head`, `hardpoint_1`). The `slots/` folder exists in the data tree. The field name itself is never spelled out on this page — cross-page-evidence A. Parser-improvement note: when a wiki section table provides a "Property: <thing> / Example: <quoted strings>" pattern AND those quoted strings appear as values in `data/<plural-of-thing>/*.json`, that's strong cross-page evidence for an array field; consider a heuristic.

**Confidence:** med — assumes slot names reference `slots/` folder strNames; very likely but not 100% verified without crawling slots data.

### `bSlotLocked` — Outcome B

- **Auto-parser status:** clean (in pre-existing overlay)
- **Wiki shape hint:** `b` prefix → boolean (NON_REF_PREFIXES — never a ref)
- **Real-data shape:** boolean — 49 / 1,104 condowners

> '''Slot Locked''' || Can't be removed || Cybernetic implants, fused equipment

**Proposed schema entry:**
```json
"bSlotLocked": {
  "type": "boolean",
  "description": "If true, this condowner cannot be removed from its slot (e.g. cybernetic implants, fused equipment). Per the wiki's Slots table.",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#Slots:_The_Right_Tool_for_the_Right_Job"
}
```

**Commentary:** Already in overlay ("Controls whether the condowner is locked into the slot it inhabits"). My proposed phrasing adds the wiki's gameplay rationale and `x-source`. B-not-A: boolean, no reference semantics. Auto-parser correctly classified it.

**Confidence:** high — boolean confirmed; semantics match wiki exactly.

### `nContainerWidth` / `nContainerHeight` — Outcome B

- **Auto-parser status:** not-seen
- **Wiki shape hint:** `n` prefix → integer (NON_REF_PREFIXES — never a ref)
- **Real-data shape:** int — 214 / 1,104 condowners (both fields, identical counts; container size pair)

> Backpack || 3x4 || Personal carry capacity
> Storage Crate || 5x5 || Ship cargo

**Proposed schema entry:**
```json
"nContainerWidth": {
  "type": "integer",
  "description": "Width of the grid-based container space, in slots. Per the wiki's Containers table (Backpack 3x4, Storage Crate 5x5, etc.).",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#Containers:_Tetris_in_Space"
},
"nContainerHeight": {
  "type": "integer",
  "description": "Height of the grid-based container space, in slots. Pairs with nContainerWidth.",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#Containers:_Tetris_in_Space"
}
```

**Commentary:** Wiki documents "grid-based storage" with W×H pairs in a table but never names the JSON fields. Field names inferred from real-data presence (always co-occurring). B because integers carry no reference target. Parser-improvement note: when a wiki gives "<int>x<int>" cell values in a table, infer paired integer fields with a `Width`/`Height` suffix.

**Confidence:** high — both fields universally co-occur in real data; semantics unambiguous.

### `nStackLimit` — Outcome B

- **Auto-parser status:** not-seen
- **Wiki shape hint:** `n` prefix → integer
- **Real-data shape:** int — 159 / 1,104 condowners

> Stack limit reached || Item won't stack further (max 99, 50, etc.)

**Proposed schema entry:**
```json
"nStackLimit": {
  "type": "integer",
  "description": "Maximum number of items that can occupy a single stack (e.g. 99 for ammo, 50 for rations). Per the wiki's Stacking table.",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#Stacking:_Efficiency_Through_Repetition"
}
```

**Commentary:** Wiki names the concept ("stack limit") and gives example values (99, 50). Field name `nStackLimit` is reasonable inference from data-tree presence. B because integer.

**Confidence:** high — exists in 14% of objects (consistent with stackable-only items).

### `bSaveMessageLog` — Outcome B

- **Auto-parser status:** not-seen
- **Wiki shape hint:** `b` prefix → boolean
- **Real-data shape:** boolean — 3 / 1,104 condowners (very rare; matches "player characters and important NPCs")

> Messages are color-coded by severity and persist in the CondOwner's history. For player characters and important NPCs, this log is saved between sessions.

**Proposed schema entry:**
```json
"bSaveMessageLog": {
  "type": "boolean",
  "description": "If true, this condowner's message log persists between game sessions (intended for player characters and important NPCs).",
  "x-source": "https://ostranauts.wiki.gg/wiki/Modding/CondOwners#Message_Logging:_The_Event_Record"
}
```

**Commentary:** Wiki describes the gating in prose (player + important NPCs); real data presence count (3) matches expectations. B because boolean. Auto-parser would need prose-to-fieldname inference to catch this — currently unimplemented.

**Confidence:** med — high on field semantics, lower on whether the field name in real data fully matches what the wiki implies (no direct bold mention).

### `strItemDef` — Outcome A (already overlay)

- **Auto-parser status:** clean (in pre-existing overlay)
- **Wiki shape hint:** `str` prefix → string
- **Real-data shape:** string — 1,104 / 1,104 (universal)

> (Not directly bolded on this page; the page references Items via [[Items]] and lists "ItmAtmoScrubber01" style strings only via the modding example.)

**Commentary:** Existing overlay says "The item definition, reffers to entry within items.json" — correct. The CondOwners page does NOT actually document this field by name; it inherits from prior schema work and from the implicit relationship that every condowner has an item def. Including it here for completeness — the wiki page's existence as a primer pre-supposes this field but doesn't define it. No new proposal; the existing overlay entry stands.

**Confidence:** high — universal in data; existing rule is correct; no change recommended.

### `strType` — Outcome B (already overlay)

- **Auto-parser status:** clean (in pre-existing overlay, with enum)
- **Wiki shape hint:** `str` prefix → string (constrained to enum)
- **Real-data shape:** string — 1,104 / 1,104

> (Wiki references `Item`, `Crew`, `Ship` categorically throughout but never names `strType` as a JSON field.)

**Commentary:** Existing overlay correctly captures this as an enum (`Item|Crew|Ship`). The wiki implies the categories without spelling the field. No change.

**Confidence:** high — verified.

### `strDesc` — Outcome B (already overlay)

- **Auto-parser status:** clean (in pre-existing overlay)
- **Wiki shape hint:** `str` prefix → string
- **Real-data shape:** string — 826 / 1,104

> (Not named on this page; "tooltip description" is only mentioned obliquely.)

**Commentary:** Existing overlay correct. No change.

**Confidence:** high.

### `strLoot` — Outcome A (already overlay)

- **Auto-parser status:** clean (in pre-existing overlay; description carries `loot.json` target)
- **Wiki shape hint:** `str` prefix → string (or null — 718 / 1,104 carry a non-null value)
- **Real-data shape:** `string|null`

> (Page references the [[Loot]] system but doesn't name the `strLoot` field.)

**Commentary:** Existing overlay correctly resolves to `loot.json`. No change.

**Confidence:** high.

### `aComponents`, `mapAltItemDefs`, `mapAltSlotImgs`, `dictSlotsLayout`, `mapCondTolerance`, `mapGUIPropMaps`, `mapPoints` (revisit), `strAudioEmitter`, `strContainerCT`, `strPaperDollImg`, `strPortraitImg`, `jsonPI` — Outcome C (data-tree fields not documented on this page)

- **Auto-parser status:** not-seen on this page (some may be documented elsewhere — Items, Interactions)
- **Wiki shape hints:** mixed (`a`/`map`/`dict`/`str`/`json`)
- **Real-data shapes:** various (see `scrap_scripts/python/05_condowners_keys.py` output)

**Commentary:** These 12 fields all appear in `data/condowners/*.json` but are not documented on the Modding/CondOwners page even glancingly. Ground-truth confirms presence; the wiki page simply doesn't cover them. Out-of-scope for THIS page's prose extraction — they're targets for other wiki pages (Items, Interactions, Audio, Sprites) or for the long-promised `Data:CondOwners` reference page. Parser-improvement note: a "wiki recall index" that joins data-tree-observed fields ↔ wiki documentation would surface these gaps automatically; valuable v2 follow-up.

**Confidence:** high on field existence (verified by ground-truth); low on which wiki page each one belongs on.

## Page-level notes

- **PAGE_TO_FOLDER mapping is correct.** `Modding__CondOwners → condowners` is the right mapping. No change needed.

- **The page is a primer, not a field reference.** This is the structural reason the auto-parser came up nearly empty (only 5 review-queue items, all from one wikitable). The page assumes `Data:CondOwners` exists as a separate reference page; that page is linked but not in our cache. **High-leverage follow-up:** crawl `Data:CondOwners` if it exists. Without it, the CondOwners overlay schema will keep relying on hand-curated entries (which are correct but unprovenanced) rather than wiki-derived ones.

- **Wiki-edit suggestion:** split the Identity wikitable into "data-tree fields" (`strName`, `strNameFriendly`, `strNameShort`) and "instance/runtime fields" (`strID`, `strCODef`, `aQueue`). Currently the table conflates the two, which both confuses readers and tricks the deterministic extractor into review-queueing fields that don't belong in the data-tree schema at all.

- **Parser-improvement opportunity #1:** "field name in parentheses after a noun phrase" — pattern that catches `(aQueue)`, `(mapPoints)`, etc. Currently only bolded `'''field'''` is detected.

- **Parser-improvement opportunity #2:** code-side identifier targets. `aUpdateCommands` carries C# class names (`GasPump`, `Heater`) — not strNames. The extractor could check whether candidate target tokens look like data-tree folder strNames vs. like `PascalCase` C# identifiers; if the latter, abstain rather than guessing.

- **Parser-improvement opportunity #3:** cross-page field-ownership disambiguation. `bPersists` is mentioned on the CondOwners page but actually lives on Conditions. The extractor should never write a field rule into `<page-folder>-schema.json` without first verifying the field appears in `data/<page-folder>/*.json`. A simple gate.

- **CodeDocs sync:** no code touched in this run; no CodeDocs entries to update.

- **Scrap script added:** `scrap_scripts/python/05_condowners_keys.py` — aggregates property keys + shapes across `data/condowners/*.json`. Reusable for future runs; safe to keep checked in.
