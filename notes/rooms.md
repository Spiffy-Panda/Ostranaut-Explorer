# Room classification reference

How the game decides what *kind* of room a given enclosed area is. Audience: modders editing [data/rooms/rooms.json](../data/rooms/rooms.json) or the trigger definitions in [data/condtrigs/condtrigs.json](../data/condtrigs/condtrigs.json).

## How it works (TL;DR)

1. **Geometry**: tiles flood-fill across non-wall, non-portal neighbors. The result is a `Room` with a tile list and a synthetic `Compartment` CondOwner. Walls block. Doors / airlock doors (`IsPortal`) are the boundary markers between rooms. (Source: [Ship.cs:8800](../decomp/Assembly-CSharp/Ship.cs).)
2. **Classification**: [Room.CreateRoomSpecs()](../decomp/Assembly-CSharp/Room.cs) sorts every entry in [data/rooms/rooms.json](../data/rooms/rooms.json) by `nPriority` **descending** and picks the **first** one whose `Matches()` returns true.
3. **`Matches()` checks** (in order):
   - `bAllowVoid == room.Void` — pressurization gate. Only `CargoRoomExterior` allows void.
   - `nMinTileSize ≤ tiles ≤ nMaxTileSize` (`-1` = unbounded).
   - For each `aReqs` entry — at least N CondOwners in the room match the named `CondTrigger`. `IsFloorGrate` COs are skipped. `StackCount` counts.
   - For each `aForbids` entry — *no* CondOwner in the room can match it.
4. Re-runs whenever a CondOwner with `IsInstalled` enters or leaves the tile set, so installing a Nav Station retags the room live.

## Decision order

`nPriority` is the at-a-glance "checked in this order" table. First match wins.

| Pri | Spec | Friendly | Min tiles | Value × | Pressurized? |
|----:|---|---|----:|----:|:---:|
| 100 | Reactor             | Reactor room              | 4  | 1.6  | ✓ |
|  90 | BridgeRoom          | Bridge (Closed)           | 4  | 1.5  | ✓ |
|  85 | TowingRoom          | Towing Room               | 2  | 1.6  | ✓ |
|  80 | BridgeArea          | Bridge (Open)             | 4  | 1.3  | ✓ |
|  75 | Airlock             | Airlock                   | 3  | 1.5  | ✓ |
|  70 | Engineering         | Engineering Room          | 4  | 1.4  | ✓ |
|  65 | WellnessRoom        | Wellness Room             | 4  | 1.9  | ✓ |
|  60 | Recreation          | Recreational Room         | 10 | 1.9  | ✓ |
|  50 | LuxuryQuarters      | Luxury Quarters           | 12 | 2.0  | ✓ |
|  45 | Bathroom            | Bathroom                  | 4  | 1.8  | ✓ |
|  40 | Galley              | Galley                    | 6  | 1.8  | ✓ |
|  35 | BasicQuarters       | Basic Quarters            | 8  | 1.8  | ✓ |
|  25 | Passenger2          | Passenger Room Medium     | 32 | 1.6  | ✓ |
|  20 | Passenger1          | Passenger Room Small      | 16 | 1.4  | ✓ |
|  15 | GasCargoRoom        | Gas Cargo Room            | 12 | 1.2  | ✓ |
|  10 | CargoRoom           | Cargo Room                | 6  | 1.2  | ✓ |
|   5 | CargoRoomExterior   | Cargo Space (Exterior)    | 6  | 1.05 | **void** |
|   0 | Blank               | (no specialization)       | —  | 1.0  | ✓ |

`nMaxTileSize` is `-1` (unbounded) for every entry, so it's omitted from the table.

## What "Value ×" actually does

`fValueModifier` is a **sale-price multiplier** on the room's contents — not a stat boost, atmosphere buff, or passive resource. From [Room.cs:206 CalculateRoomValue](../decomp/Assembly-CSharp/Room.cs):

```
RoomValue = Σ ( co.GetBasePrice() × fValueModifier )  for each installed co in room
```

- **Blank ×1.0** — contents sell for their base price.
- **LuxuryQuarters ×2.0** — every installed bed, bin, chair, light in that room sells for twice base.
- Loose / uninstalled items are skipped: `AddToRoom` requires `IsInstalled`, so they're never in the room's content list and never pick up the multiplier.
- Walls, floors, and other "props" CondOwners that satisfy the room's flood-fill but aren't installed equipment are excluded for the same reason.
- The multiplier is the *only* thing the spec contributes to ship value — there's no flat per-room bonus.

So `fValueModifier: 1.5` on a modded room means "anything installed in this layout is worth 50% more when the ship sells."

## Trigger glossary

The `aReqs` / `aForbids` strings are `CondTrigger` references with `=chance×count` syntax, e.g. `TIsChairInstalled=1.0x4` = "≥4 installed chairs". A few are **meta-triggers** that OR over a sub-list (defined in [data/condtrigs/condtrigs.json](../data/condtrigs/condtrigs.json) with `bAND: false`):

| Meta-trigger | Satisfied by any of |
|---|---|
| `TIsRoomEngineering`           | `TIsCanister`, `TIsChargerBattery04Installed`, `TIsShipBatteryInstalled`, `TIsRCSDistroInstalled` |
| `TIsRoomWellnessOptionals01`   | `TIsFridge01Installed`, `TIsSinkInstalled`, `TIsTreadmillInstalled`, `TIsStrengthTrainerInstalled` |
| `TIsRoomRecreationOptionals`   | `TIsTerminalInstalled`, `TIsTVInstalled`, `TIsBartopInstalled` |
| `TIsRoomCargo`                 | `TIsStorageBinInstalled`, `TIsRackInstalled` |
| `TIsRoomCargoExterior`         | `TIsCargoWeb01Installed`, `TIsStorageBinInstalled` |
| `TIsCanister`                  | `TIsRTAInstalled`, `TIsCanister01Installed`, `TIsCanisterLH02Installed`, `TIsCanisterLHe02Installed` |
| `TIsShipBatteryInstalled`      | `TIsBattery02Installed`, `TIsBattery02bInstalled`, `TIsBattery02cInstalled` |

Plain (non-meta) triggers used in rooms.json bind directly to a CondOwner test:

| Trigger | Requires (`aReqs`) | Forbids |
|---|---|---|
| `TIsReactorIC`            | `IsReactorIC` | — |
| `TIsNavStationInstalled`  | `IsNavStation`, `IsInstalled` | `IsDamaged` |
| `TIsTowingBraceInstalled` | `IsEquipmentTowing`, `IsInstalled` | `IsDamaged` |
| `TIsDockSysInstalled`     | `IsDockSys`, `IsInstalled` | — |
| `TIsBedInstalled`         | `IsCushion`, `IsSheet`, `IsInstalled` | `IsDamaged`, `IsSlotted`, `IsInContainer`, `IsCarried` |
| `TIsToilet`               | `IsContainer`, `IsOpening10cmUp`, `IsWaterproof`, `IsInstalled` | — |
| `TIsSinkInstalled`        | `IsSink`, `IsInstalled` | `IsDamaged` |
| `TIsTableInstalled`       | `IsTable`, `IsInstalled` | — |
| `TIsChairInstalled`       | `IsChair`, `IsInstalled` | `IsDamaged` |
| `TIsFridge01Installed`    | `IsFridge01`, `IsInstalled` | — |
| `TIsStorageBinInstalled`  | `IsStorageBin`, `IsInstalled` | `IsDamaged` |
| `TIsLightSourceInstalled` | `IsLightSource`, `IsInstalled` | `IsDamaged` |
| `TIsHatchInstalled`       | `IsHatch`, `IsInstalled` | `IsDamaged` |
| `TIsRCSDistroInstalled`   | `IsRCSReg`, `IsInstalled` | — |
| `TIsRTAInstalled`         | `IsRTA`, `IsInstalled` | `IsDamaged` |

## Per-room foldouts

<details>
<summary><b>Reactor</b> — Reactor room · pri 100 · ×1.6</summary>

- Min tiles: **4**, pressurized
- Requires: `TIsReactorIC` ×1 — anything with `IsReactorIC`
- Forbids: *none*
- **Gotcha**: priority 100 + no forbids = an IC reactor turns *any* 4+-tile pressurized room into a Reactor, no matter what else is installed. If you mod a reactor into a bridge or a galley, you lose the bridge/galley classification.

</details>

<details>
<summary><b>BridgeRoom</b> — Bridge (Closed) · pri 90 · ×1.5</summary>

- Min tiles: **4**, pressurized
- Requires: `TIsNavStationInstalled` ×1
- Forbids: `TIsRCSDistroInstalled`, `TIsRoomRecreationOptionals` (terminal/TV/bartop), `TIsRoomWellnessOptionals01` (fridge/sink/treadmill/strength), `TIsToilet`, `TIsReactorIC`, `TIsBedInstalled`
- See the **paired note** below — Closed and Open share the same trigger; the forbid list is what distinguishes them.

</details>

<details>
<summary><b>TowingRoom</b> — Towing Room · pri 85 · ×1.6</summary>

- Min tiles: **2** (smallest of any spec), pressurized
- Requires: `TIsTowingBraceInstalled` ×1
- Forbids: *none*
- The 2-tile minimum is unique. Any pressurized room ≥2 tiles with a towing brace and no reactor (which would beat it on priority) becomes Towing.

</details>

<details>
<summary><b>BridgeArea</b> — Bridge (Open) · pri 80 · ×1.3</summary>

- Min tiles: **4**, pressurized
- Requires: `TIsNavStationInstalled` ×1
- Forbids: *none*
- The "fallback" Bridge — gets picked when a Nav Station is in a room that *also* has anything from BridgeRoom's forbid list. Lower value modifier (1.3 vs 1.5) is the cost of mixing functions.

</details>

<details>
<summary><b>Airlock</b> — Airlock · pri 75 · ×1.5</summary>

- Min tiles: **3**, pressurized
- Requires: `TIsDockSysInstalled` ×1
- Forbids: `TIsRCSDistroInstalled`, `TIsShipBatteryInstalled`, `TIsRoomRecreationOptionals`, `TIsRoomWellnessOptionals01`, `TIsToilet`, `TIsReactorIC`, `TIsNavStationInstalled`, `TIsBedInstalled`
- A docking system in a room with anything else interesting → it falls through to Blank (no Airlock-Open variant).

</details>

<details>
<summary><b>Engineering</b> — Engineering Room · pri 70 · ×1.4</summary>

- Min tiles: **4**, pressurized
- Requires: `TIsRoomEngineering` ×1 — **meta-trigger**: any of canister, charger, ship battery, RCS distributor
- Forbids: *none*
- Cheapest "industrial" classification — one canister or one battery is enough.

</details>

<details>
<summary><b>WellnessRoom</b> — Wellness Room · pri 65 · ×1.9</summary>

- Min tiles: **4**, pressurized
- Requires: `TIsRoomWellnessOptionals01` ×**2** — **meta-trigger**: needs *two* of fridge / sink / treadmill / strength trainer
- Forbids: `TIsToilet`, `TIsReactorIC`, `TIsBedInstalled`
- The `×2` is the only `aReqs` count >1 that's on a meta-trigger; the count tracks the trigger's `fCount`, so two distinct items work as well as two of the same.

</details>

<details>
<summary><b>Recreation</b> — Recreational Room · pri 60 · ×1.9</summary>

- Min tiles: **10**, pressurized
- Requires: `TIsTableInstalled` ×1, `TIsFridge01Installed` ×1, `TIsRoomRecreationOptionals` ×1 (meta: terminal / TV / bartop)
- Forbids: `TIsReactorIC`
- Combines a plain trigger and a meta-trigger.

</details>

<details>
<summary><b>LuxuryQuarters</b> — Luxury Quarters · pri 50 · ×2.0</summary>

- Min tiles: **12**, pressurized
- Requires: `TIsBedInstalled` ×1, `TIsStorageBinInstalled` ×**2**, `TIsChairInstalled` ×1, `TIsLightSourceInstalled` ×1
- Forbids: `TIsToilet`, `TIsReactorIC`, `TIsCanister`, `TIsRTAInstalled`, `TIsShipBatteryInstalled`, `TIsHatchInstalled`
- Highest value modifier in the game. The `TIsHatchInstalled` forbid is unusual — putting a hatch in the room demotes it to BasicQuarters even with everything else present.

</details>

<details>
<summary><b>Bathroom</b> — Bathroom · pri 45 · ×1.8</summary>

- Min tiles: **4**, pressurized
- Requires: `TIsToilet` ×1, `TIsSinkInstalled` ×1
- Forbids: *none*
- The `TIsToilet` trigger is *capability-based* (any installed waterproof container with a 10 cm-up opening), not item-based — modded toilets just need those `IsContainer`/`IsOpening10cmUp`/`IsWaterproof`/`IsInstalled` conds.

</details>

<details>
<summary><b>Galley</b> — Galley · pri 40 · ×1.8</summary>

- Min tiles: **6**, pressurized
- Requires: `TIsTableInstalled` ×1, `TIsChairInstalled` ×**4**, `TIsFridge01Installed` ×1
- Forbids: `TIsToilet`, `TIsReactorIC`, `TIsBedInstalled`

</details>

<details>
<summary><b>BasicQuarters</b> — Basic Quarters · pri 35 · ×1.8</summary>

- Min tiles: **8**, pressurized
- Requires: `TIsBedInstalled` ×1, `TIsStorageBinInstalled` ×1, `TIsLightSourceInstalled` ×1
- Forbids: `TIsToilet`, `TIsReactorIC`, `TIsCanister` (meta: any RTA / canister)
- Note: BasicQuarters does **not** forbid `TIsHatchInstalled` (LuxuryQuarters does). That one forbid is the trip-line between the two.

</details>

<details>
<summary><b>Passenger2</b> — Passenger Room Medium · pri 25 · ×1.6</summary>

- Min tiles: **32** (largest minimum), pressurized
- Requires: `TIsChairInstalled` ×**8**
- Forbids: `TIsToilet`, `TIsSinkInstalled`, `TIsReactorIC`, `TIsCanister`
- Differs from Passenger1 only in tile count (32 vs 16) and chair count (8 vs 4). Priority 25 > 20 means Medium is checked first; an 8-chair, 32-tile room hits Medium.

</details>

<details>
<summary><b>Passenger1</b> — Passenger Room Small · pri 20 · ×1.4</summary>

- Min tiles: **16**, pressurized
- Requires: `TIsChairInstalled` ×**4**
- Forbids: same as Passenger2

</details>

<details>
<summary><b>GasCargoRoom</b> — Gas Cargo Room · pri 15 · ×1.2</summary>

- Min tiles: **12**, pressurized
- Requires: `TIsCanister` ×**6** (meta: counts RTAs and canister types together)
- Forbids: *none*
- Only a high canister count separates this from Engineering — at 1–5 canisters you get Engineering (×1.4), at 6+ canisters in 12+ tiles you get GasCargo (×1.2). Engineering wins on priority, so the discriminator is really the `nMinTileSize=12` plus the count threshold.

</details>

<details>
<summary><b>CargoRoom</b> — Cargo Room · pri 10 · ×1.2</summary>

- Min tiles: **6**, pressurized
- Requires: `TIsRoomCargo` ×**6** — meta: storage bin or rack
- Forbids: *none*

</details>

<details>
<summary><b>CargoRoomExterior</b> — Cargo Space (Exterior) · pri 5 · ×1.05</summary>

- Min tiles: **6**, **`bAllowVoid: true` — vacuum-only**
- Requires: `TIsRoomCargoExterior` ×**20** — meta: cargo web or storage bin
- Forbids: *none*
- The **only** spec with `bAllowVoid: true`. Every other spec's `Matches()` returns false on a vacuum room, so an unpressurized area can never be anything except this or Blank.

</details>

<details>
<summary><b>Blank</b> — (no specialization) · pri 0 · ×1.0</summary>

- Min/max tiles: unbounded
- Requires/forbids: *none*
- Special-cased: `Matches()` is short-circuited by `IsBlank` ([RoomSpec.cs:97](../decomp/Assembly-CSharp/Ostranauts/Ships/Rooms/RoomSpec.cs)) so it's never *picked* by the priority loop. The fallback `_roomSpec ??= dictRoomSpec["Blank"]` at the end of `CreateRoomSpecs()` is what actually assigns it.

</details>

## Pairs and oddballs — rooms that aren't a simple JSON-row reading

Most rooms are exactly what the JSON says. Five cases need extra context:

### 1. Bridge (Closed) vs Bridge (Open) — same trigger, distinguished by forbids

`BridgeRoom` (90) and `BridgeArea` (80) both require *only* `TIsNavStationInstalled`. The classifier between them is:

- BridgeRoom forbids RCS distro, recreation, wellness, toilet, reactor, bed.
- BridgeArea forbids nothing.

Because BridgeRoom is checked first, a "clean" bridge gets the ×1.5 closed value; a Nav Station co-located with anything from the forbid list falls through to BridgeArea (×1.3). This **forbids-as-purity-tier** pattern is unique to the Bridge pair — no other room types use the same `aReqs` and split on `aForbids`. If you're modding a new specialized room and want a graceful "open" fallback, copy this pattern.

### 2. CargoRoomExterior — the only `bAllowVoid: true` entry

The pressurization gate is binary: either the spec wants a void room or it wants a pressurized room. So every other spec is implicitly `bAllowVoid: false`, and an unpressurized enclosed area can only ever be CargoRoomExterior or Blank. If you mod a new void-permitting room, **you must explicitly set `bAllowVoid: true`** or the spec will never match.

### 3. Reactor's priority-100 wins everything

Because `Matches()` is first-hit-wins and Reactor has no forbids, an IC reactor turns *any* 4+-tile pressurized room into a Reactor regardless of what else is installed. Bed + reactor → Reactor (not Quarters). Nav Station + reactor → Reactor (not Bridge). If you want a coexisting "engineering bay with a reactor" classification, you'd add a higher-priority spec that requires the reactor *and* the engineering items.

### 4. Meta-trigger expansion — five rooms hide their real requirements

Reading the JSON literally, `Engineering` requires `TIsRoomEngineering`. That's not enough info for a modder — the actual requirement is **any one of** four sub-triggers. The same applies to:

| Spec | Meta `aReqs` | Real shape |
|---|---|---|
| Engineering         | `TIsRoomEngineering` ×1     | canister OR charger battery 04 OR ship battery OR RCS distro |
| WellnessRoom        | `TIsRoomWellnessOptionals01` ×2 | two of fridge / sink / treadmill / strength trainer |
| Recreation          | `TIsRoomRecreationOptionals` ×1 | terminal OR TV OR bartop (in addition to plain table + fridge) |
| CargoRoom           | `TIsRoomCargo` ×6           | six items, each storage bin OR rack |
| CargoRoomExterior   | `TIsRoomCargoExterior` ×20  | twenty items, each cargo web OR storage bin |

A site auto-rendering rooms.json without resolving meta-triggers will look correct but be useless to a modder asking "what do I have to install to get a Wellness Room?" The schema-driven cross-reference resolver should follow `aTriggers` on `bAND: false` triggers and render the OR-set.

### 5. Blank — fallback, not a match

`IsBlank` is short-circuited inside `Matches()`, so Blank's `aReqs`/`aForbids`/`nMinTileSize` are all dead fields — the row is just a holder for `strNameFriendly`/`strIconName`/`fValueModifier`. Treating Blank as "a row with no requirements" in a UI is fine; treating it as "a room that requires zero things" is wrong (every empty room would match it before priority order kicked in, but `Matches()` makes sure it can't).

## Modding notes

- New room specs need to be inserted into [comment_mod/](../comment_mod/) (or a v2 mod overlay) on top of `data/rooms/rooms.json`. The spec list is loaded into `DataHandler.dictRoomSpec` keyed by `strName`, so collisions on `strName` last-wins.
- New `aReqs` / `aForbids` triggers must already exist in [data/condtrigs/condtrigs.json](../data/condtrigs/condtrigs.json) — you can't inline a CondTrigger inside a RoomSpec.
- `nPriority` ties are resolved by `OrderByDescending` only, which is unstable in .NET — give every new spec a unique priority to avoid load-order surprises.
- The `aReqs` / `aForbids` strings are parsed through the same `Loot` machinery used elsewhere ([RoomSpec.cs:49-66](../decomp/Assembly-CSharp/Ostranauts/Ships/Rooms/RoomSpec.cs) wraps them in a synthetic Loot with `strType="trigger"`), so the `=chance×count` syntax is identical to loot-table entries.
