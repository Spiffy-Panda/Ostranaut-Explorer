# User story — HygieneStation Mod

**Source mod:** `testdata_mods/HygieneStation/`
**Original mod by:** Voideka (mod version 1.5, game version 0.14.3.6)

---

## The goal

A modder has watched their crew's hygiene stat degrade on long hauls with no sink.
They know the game has a hygiene need, and they know the existing Sink object handles
it. They want to create a new installable furniture piece — a sponge-bath station that
draws from an internal water reservoir — that crew can use to maintain hygiene when a
plumbed sink isn't available.

This is a "add a new thing to the game" mod, not a "tune an existing value" mod. The
modder needs to create entries across several folders that didn't exist before.

They know what they want in the game. They do not know how the Sink works in data,
or how to build a new installable item from scratch.

---

## The journey

### Step 1 — Find how the existing Sink works

The modder searches for `Sink` (something they know from in-game). They find
`condowners:ItmSink01`. The detail page shows:

- `aStartingConds` includes `IsInstalled`, `IsContainer`, `StatMass`, `StatDamageMax`,
  and hygiene-related conditions like `IsHygieneSink`.
- `aInteractions` includes `SeekHygieneWater` — the interaction that triggers washing.
- `aUpdateCommands` includes a `Destructable,...` entry linking to a damage interaction.
- `strItemDef` references `items:ItmSink01` — the visual/socket definition.

From the Sink's incoming refs the modder sees that `installables:SinkInstall` and
`installables:SinkUninstall` reference it — those define the install/uninstall actions
with tool requirements and progress stats.

**Explorer outcome:** The modder has a working template. A new installable hygiene item
needs: a condowner entry (installed + loose variants), an items entry (visual), a
conditions_simple entry (new condition), condtrigs (gates), interactions (use chain),
loot entries (contents + destroy), and installables (install/uninstall).

### Step 2 — Understand the installed vs. loose variant pattern

The Sink has two condowner entries: `ItmSink01` (installed, wall-mounted) and
`ItmSink01Loose` (carried in inventory). The explorer's per-prefix explainer
("About installable items") explains this pattern:

- The **installed** variant has `IsInstalled=1.0x1` in `aStartingConds`, is solid,
  has use-point coordinates in `mapPoints`, and is referenced by the installable entry.
- The **loose** variant lacks `IsInstalled`, has `IsCumbersome`, and its
  `aInteractions` are `DropItem`/`PickupItem` instead of use interactions.
- The `strItemDef` on each variant points to its visual definition in `items/`.
- `aUpdateCommands` on both uses `Destructable,StatDamage,<damageInteraction>,StatDamageMax,1.0`
  to wire up the destruction behavior.

**Explorer outcome:** The modder understands why there are two entries and what differs
between them. They can copy this pattern for `ItmHygieneStation` and
`ItmHygieneStationLoose`.

### Step 3 — Understand condition gating via condtrigs

On the Sink's `SeekHygieneWater` interaction detail page, the `CTTestThem` field
references `condtrigs:TIsHygieneWater`. The condtrig detail page shows its `aReqs`:
`["IsHygieneSink", "IsWater"]` with `bAND: false` — meaning the target must have
`IsHygieneSink` OR `IsWater`.

The modder's new station needs a parallel path: `TIsHygieneWater` should also match
when the target has `IsHygieneStation` — or the mod needs its own `TIsHygieneWater`
override that adds `IsHygieneStation` to the OR list.

The explorer shows the incoming refs of `condtrigs:TIsHygieneWater` — which
interactions test against it — making it clear that overriding this one condtrig
would affect all hygiene interactions.

**Explorer outcome:** The modder understands that the Hygiene Station mod creates its
own new condition (`IsHygieneStation`) and its own parallel condtrigs
(`TIsHygieneStation`, `TIsHygieneStationInstalled`, `TIsHygieneWater`) rather than
modifying base-game entries — a safer, non-destructive pattern.

### Step 4 — Understand conditions_simple

The modder sees `IsHygieneSink` referenced in condtrigs but doesn't find it in
`conditions/`. The explorer's folder note explains: simple conditions live in
`conditions_simple/` as a shorthand format — each row defines a condition by
`"strName,strNameFriendly,strDesc,nPriority,nLayer,strCategory,bHidden"`.

**Explorer outcome:** The modder knows they need one `conditions_simple/` entry to
register `IsHygieneStation` before any condtrig or condowner can reference it.

### Step 5 — Follow the interaction chain

The `SeekHygieneWater` interaction on the Sink is the opener (`bOpener: true`). The
`aInverse` field chains to internal interactions. On the Hygiene Station the chain is:

```
SeekHygieneWater  (opener, CTTestThem: TIsHygieneWater)
  → SeekHygieneHygieneStation  (seeks an installed station)
  → ACTSeekHygieneWater         (seeks loose water in the station's container)
  → ACTSeekHygieneDeny          (deny fallback)

SeekHygieneHygieneStation
  → ACTSeekHygieneStationDenyWater   (station has no water → wander)
  → ACTSeekHygieneAllowHygieneStation (station has water → sit, begin cleanse)

ACTSeekHygieneAllowHygieneStation
  → ACTSeekHygieneAllowHygieneStationCleanse  (consume water, apply hygiene conditions)
  → ACTSeekHygieneAllowHygieneStationDone     (finish, done-using)
```

The explorer's outgoing refs panel with DSL primer popovers on `aInverse` entries
makes this chain readable. Each step's `LootCTsUs` / `LootCTsThem` fields grant/remove
conditions as the action progresses.

**Explorer outcome:** The modder can trace the full state machine without reading raw
JSON. They understand `aInverse` as a prioritized fallback list, `LootCTsUs/LootCTsThem`
as condition grants, and `CTTestUs/CTTestThem` as the gates that select which branch fires.

### Step 6 — Understand loot entries for contents and destruction

The `aUpdateCommands` entry `Destructable,StatDamage,ACTHygieneStationDmg,StatDamageMax,1.0`
references `loot:ACTHygieneStationDmg` with `strType: interaction`. The loot entry's
`aCOs` grant `MSDestroyDefault=1.0x1` — the standard destroy condition.

The station also has loot entries for salvage contents (`ItmHygieneStationSalvageContents`,
`ItmHygieneStationStationContents`) defining what drops when the station is looted or
dismantled, and `ItmHygieneStationNew` (`bNested: true, bSuppress: true`) for initial
spawn contents.

**Explorer outcome:** The modder understands that loot entries serve multiple roles:
initial contents (`bNested`), salvage payouts, and interaction delegates
(`strType: interaction` used by `aUpdateCommands`).

### Step 7 — Understand installables

The `installables:HygieneStationInstall` entry shows:
- `strActionCO` — the loose condowner being installed
- `strInteractionTemplate` — the base install interaction to clone
- `CTThem` — the condtrig gating which objects this installable applies to
- `aInputs` — conditions consumed during the install action
- `aToolCTsUse` — required tools
- `aLootCOs` — what is produced (the installed condowner)
- `strProgressStat` / `strAllowLootCTsThem` — the progress-bar system
- `strBuildType` / `strJobType` — job classification

**Explorer outcome:** The modder can write their own installable entry by following
this template. The `strInteractionTemplate` reference to `interactions:ACTInstallTEMP`
is visible as an outgoing ref link — clicking through shows what the template looks like.

---

## Files in the mod's implementation

| File | What it does |
|---|---|
| `data/conditions_simple/conditions_simple.json` | Registers `IsHygieneStation` — the marker condition that identifies this item type. Must exist before any condtrig or condowner references it. |
| `data/condtrigs/condtrigs.json` | Defines `TIsHygieneStation`, `TIsHygieneStationInstalled`, `TIsHygieneStationUninstalled`, `TIsHygieneWater` (matches either `IsHygieneStation OR IsWater`), `TIsDirty`, and `TCanDoHygiene`. These are the gates used in interaction `CTTestUs`/`CTTestThem` fields. |
| `data/condowners/condowners.json` | Defines the installed (`ItmHygieneStation`) and loose (`ItmHygieneStationLoose`) condowner variants. Core fields: `aStartingConds` for initial state, `aInteractions` for available actions, `mapPoints` for use/sit point coordinates, `strItemDef` for the visual, `aUpdateCommands` for destruction wiring, `strContainerCT`/`nContainerHeight`/`nContainerWidth` for the internal water reservoir. |
| `data/items/items.json` | Defines `ItmHygieneStation` and `ItmHygieneStationLoose` visual entries — sprite name, normal map, tile socket rules (`aSocketAdds`, `aSocketForbids`, `aSocketReqs`), scale. Referenced by condowner `strItemDef`. |
| `data/interactions/interactions.json` | The full use-interaction state machine: `SeekHygieneWater` (opener), `SeekHygieneHygieneStation` (navigate to station), `ACTSeekHygieneWater` (consume water path), `ACTSeekHygieneAllowHygieneStation` (sit and cleanse), `ACTSeekHygieneAllowHygieneStationCleanse` (consume water, apply conditions), `ACTSeekHygieneAllowHygieneStationDone` (finish), deny stubs. |
| `data/loot/loot.json` | Defines `ACTHygieneStationDmg` (destroy delegate, `strType: interaction`), `ItmHygieneStationSalvageContents` (loot-on-salvage), `ItmHygieneStationStationContents` (water contents range), `ItmHygieneStationNew` (spawn contents, `bNested: true, bSuppress: true`). |
| `data/loot/loot_components.json` | Defines `ItmHygieneStationComponents` (damaged-salvage parts) and `ItmHygieneStationDismantle` (full-dismantle parts yield). |
| `data/loot/Furnishings_Kiosk.json` | Adds the Hygiene Station to whatever furniture purchase loot table makes it available to buy in-station. |
| `data/installables/installables.json` | Defines `HygieneStationInstall` and `HygieneStationUninstall` — tool requirements (Mortorq), progress stats, condtrig gates, input/output condowners. |
| `data/installables/installables_dismantle.json` | Defines the dismantle action (salvage-recovery path, different from uninstall). |
| `data/installables/installables_undamage.json` | Defines the repair-in-place action when the station is damaged but not destroyed. |
| `mod_info.json` | Loader identification. |

---

## What the explorer needs to show for this story to succeed

- Searching `Sink` or `hygiene` reaches `condowners:ItmSink01` and the modder can use
  that as a working template before writing any new JSON.
- The installed-vs-loose condowner pattern is explained in an explainer banner or
  "About installable items" note — the modder shouldn't have to discover it by diffing
  two condowner entries manually.
- `conditions_simple/` is surfaced as a distinct folder with an explainer that it is
  the shorthand registration path for simple flag conditions.
- The `aInverse` field on interactions renders as a labeled list of chained interactions
  (not a raw string array), so the state machine is readable without knowing the DSL.
- `strType: interaction` on a loot entry triggers the `strType` dispatch tooltip
  (component 1.8 from the UX plan), so the modder understands why a `loot/` entry
  is being used as an interaction delegate.
- The `installables/` entry has an outgoing ref link to its `strInteractionTemplate`,
  making the template's fields discoverable by following one click.
- `bNested` and `bSuppress` on loot entries have inline descriptions explaining their
  role in the spawn-contents pattern.
