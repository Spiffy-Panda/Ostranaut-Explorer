# IVerifiable Cross-Reference Map

**Purpose:** Feed this document to a future prompt when writing schema extraction rules, updating `comment_mod` schemas, or implementing the ref-extraction pass in `Ostranauts.DataModel`. The data here is derived directly from `GetVerifiables()` in the decompiled source — it is the game's own cross-reference declaration and is more authoritative than anything inferred from JSON field names or wiki docs.

**Source:** `decomp/Assembly-CSharp/` — extracted by `utils/python/decomp_extract_verifiables.py`.

---

## Classes implementing IVerifiable

Six classes implement the interface. Two (`JsonCondTrigger`, `JsonLoot`) return empty dictionaries — their runtime counterparts (`CondTrigger`, `Loot`) carry the actual refs.

| Class | Source file | GetVerifiables useful? |
|---|---|---|
| `JsonCond` | JsonCond.cs | Yes |
| `JsonCondTrigger` | JsonCondTrigger.cs | **No — empty** |
| `JsonCondOwner` | JsonCondOwner.cs | Yes |
| `JsonInteraction` | JsonInteraction.cs | Yes |
| `JsonLoot` | JsonLoot.cs | **No — empty** |
| `Loot` | Loot.cs | Yes (runtime class) |
| `CondTrigger` | CondTrigger.cs | Yes (runtime class) |

---

## JsonCond → conditions/

| Field | Encoding | Target type | Target folder |
|---|---|---|---|
| `aPer[]` | plain string | `Loot` | loot/ |
| `aNext[]` | plain string | `CondTrigger` | condtrigs/ |
| `strAnti` | plain string | `JsonCond` | conditions/ |

Note: the `action` delegate in the source passes `null` as the type array for `aPer` and `aNext` — the type annotation in the table above comes from the argument passed to `action(this.aPer, new Type[]{typeof(Loot)})`. The engine uses these for verification but the null suggests type checking may be lenient here.

---

## JsonCondOwner → condowners/

| Field | Encoding | Target type | Target folder |
|---|---|---|---|
| `strContainerCT` | plain string | `CondTrigger` | condtrigs/ |
| `strItemDef` | plain string | `JsonItemDef` | items/ |
| `strLoot` | plain string | `Loot` | loot/ |
| `aInteractions[]` | plain string | `JsonInteraction` | interactions/ |
| `aStartingConds[]` | `"[‑]CondName=value×duration"` — split on `=`, strip leading `-` from [0] | `JsonCond` | conditions/ |
| `aStartingCondRules[]` | `"RuleName=fModifier"` — split on `=`, take [0] | `CondRule` | condrules/ |
| `aTickers[]` | plain string | `JsonTicker` | tickers/ (verify folder name) |

**`aStartingCondRules` edge data:** the part after `=` is a `double` that initialises `CondRule.fModifier` (private, defaults 1.0). This multiplier scales all `fMin`/`fMax` threshold values at runtime. It must be preserved on the edge (same principle as condition value/duration).

---

## JsonInteraction → interactions/

### Direct string fields → CondTrigger (condtrigs/)

`CTTest3rd`, `CTTestRoom`, `CTTestThem`, `CTTestUs`

### Direct string fields → Loot (loot/)

`LootCTs3rd`, `LootCTsThem`, `LootCTsUs`, `LootConds3rd`, `LootVFXUs`, `LootVFXThem`, `LootAudioUs`, `LootAudioThem`, `LootCondsThem`, `LootCondsUs`, `objLootModeSwitch`, `objLootModeSwitchThem`, `LootAddFactionsUs`, `LootAddFactionsThem`, `LootAddCondRulesUs`, `LootAddCondRulesThem`

### Direct string fields → JsonShipSpec (shipspecs/)

`ShipTestUs`, `ShipTestThem`, `ShipTest3rd`

### Array fields with encoding

| Field | Encoding | Target type | Target folder |
|---|---|---|---|
| `aInverse[]` | `"InteractionName,..."` — split on `,`, take [0] | `JsonInteraction` | interactions/ |
| `aLootItms[]` | `"verb,lootName[,...]"` — split on `,`, take [1] | `Loot` | loot/ |

**`aLootItms` verbs:** `addus`, `addthem`, `removethem`, `take`, `use`, `lacks`, `input`, `give`, `removeus`. The verb is at index [0] (case-insensitive). For `use`, `lacks`, `input`: minimum 3 tokens. For `give`, `removeus`: minimum 4 tokens.

**Note on our interaction schema ghosts:** The cross-check (`06`) reported 18 ghost fields in our interactions schema. These were retained with `x-ghost: true` per the 2026-05-03 dev-log entry. Future schema work should cross these ghosts against the full `JsonInteraction.cs` property list to confirm which are truly absent from the decomp.

---

## Loot (runtime, loaded from loot/)

`JsonLoot.GetVerifiables()` is empty. The runtime `Loot` object built from it does all the work. The target type for `aCOLootUnits` entries is **type-routed on `Loot.strType`**:

| `strType` value | Target type | Target folder |
|---|---|---|
| `"item"` (default / no match) | `JsonCondOwner` or `JsonCOOverlay` | condowners/ |
| `"condition"` | `JsonCond` | conditions/ |
| `"interaction"` | `JsonInteraction` | interactions/ |
| `"trigger"` | `CondTrigger` | condtrigs/ |
| `"ship"` | `JsonShip` | ships/ |
| `"lifeevent"` | `JsonLifeEvent` | lifeevents/ |
| `"relationship"` | _(returns empty — no refs)_ | — |
| `"text"` | _(returns empty — no refs)_ | — |

**`Thresh*` exception when `strType == "condition"`:** if a loot unit name starts with `"Thresh"`, strip the prefix and look up the remainder in `DataHandler.dictCondRulesLookup` (a map of stat names → condrule names) to get the actual `CondRule` ref. If the lookup misses, the raw name falls back to `JsonCond`. This is the `Thresh<StatName>` naming convention from CLAUDE.md — it is resolved at runtime via lookup, not a direct strName match.

**`aOtherLootUnits` entries** → `Loot` (recursive, loot/ self-refs). Always, regardless of `strType`.

---

## CondTrigger (runtime, loaded from condtrigs/)

`JsonCondTrigger.GetVerifiables()` is empty. The runtime class declares:

| Fields | Target types | Notes |
|---|---|---|
| `aReqs[]`, `aForbids[]`, `aTriggers[]`, `aTriggersForbid[]` | `CondTrigger` **or** `JsonCond` | Dual-type — each string may be either a condtrig name or a condition name |

The dual-type means edge routing for these fields cannot be resolved purely by folder lookup — a string must be checked against both `dictCTs` and `dictConds`. For the graph, the `refKind` should reflect the resolved type after lookup.

---

## CondRule (runtime, loaded from condrules/)

Not prefixed with `Json`. The class **is** the deserialization target — `CondRule.cs` maps directly to the `condrules/` data folder. `JsonCondRule` does not exist.

Properties deserialized from JSON:

| Property | Type | Notes |
|---|---|---|
| `strName` | string | identity key |
| `strCond` | string | → `JsonCond` (conditions/) |
| `fPref` | double | defaults `+Infinity` |
| `aThresholds[]` | `CondRuleThresh[]` | see below |

`fModifier` is **private** and runtime-only — not in JSON. It is initialised from `aStartingCondRules` strings on the owning `JsonCondOwner`.

### CondRuleThresh

Deserialized inline within `CondRule.aThresholds`:

| Property | Type | Notes |
|---|---|---|
| `strLootNew` | string | → `Loot` (loot/) |
| `fMin` | float | threshold lower bound |
| `fMax` | float | threshold upper bound |
| `fMinAdd` | float | delta applied when crossing fMin |
| `fMaxAdd` | float | delta applied when crossing fMax |

`CondRuleThresh.strLootNew` is an undocumented ref to `loot/` — not yet in any schema.

---

## Schema gaps identified by this analysis

Items below are actionable for `comment_mod/data/schemas/`:

1. **`condowners-schema.json`** — add: `aStartingCondRules` (format `"RuleName=fModifier"`, ref → condrules/, edge carries `fModifier`), `strContainerCT` (→ condtrigs/), `aTickers` (→ tickers/), `aInteractions` (→ interactions/), `strItemDef` (→ items/), `strLoot` (→ loot/)
2. **`condrules-schema.json`** — add: `aThresholds` array with `strLootNew` (→ loot/), `fMin`, `fMax`, `fMinAdd`, `fMaxAdd`; add `fPref`; fix crosscheck mapping from `JsonCondRule` → `CondRule`
3. **`conditions-schema.json`** — add: `aPer` (→ loot/), `aNext` (→ condtrigs/), `strAnti` (→ conditions/ self-ref)
4. **`condtrigs-schema.json`** — add: `aReqs`, `aForbids`, `aTriggers`, `aTriggersForbid` — each is dual-type (condtrig or condition name)
5. **`interactions-schema.json`** — 16 `Loot*` fields, 4 `CT*` fields, 3 `ShipTest*` fields, `aInverse`, `aLootItms` all undocumented; `aLootItms` has embedded verb + loot ref encoding
6. **`loot-schema.json`** — `strType` enum values need expansion (add `ship`, `lifeevent`, `relationship`, `text` alongside existing); `Thresh*` naming convention for condition-type loot needs a note
7. **New schemas needed:** `tickers/` (for `JsonTicker`), `shipspecs/` (for `JsonShipSpec`), `lifeevents/` (for `JsonLifeEvent`)

---

## Crosscheck mapping fix

`06_decomp_schema_crosscheck.py` and `07_decomp_schema_table.py` both use `CLASS_TO_SCHEMA`. Add:

```python
"CondRule": "condrules",
```

And remove any entry for `"JsonCondRule"` if present.
