# User story — rewiring a CO2 alarm to a remote O2 pump

A scoring/test scenario for **AST Phase 3** (see
[PLAN-AST.md](../../PLAN-AST.md)). Captures a question the explorer
currently cannot answer regardless of how good its data-side coverage gets,
because the connection the modder is asking about is established at runtime
by the player wiring panels in-game. This story is the acceptance test for
*"is the explorer good enough at runtime-wired connections."*

## The story

A modder is on Discord and types this:

> **Modder:** I want my cargo bay 3 CO2 alarm to drive the bridge's
> emergency O2 pump, not the cargo bay's local pump. There's nothing in the
> alarm's data that says "go talk to this pump." Where is the connection
> actually established, and is there a way I can lock it in from data so I
> don't have to wire it in-game every time I respawn?

The honest answer is mostly *"no, you can't lock it in from data,"* but the
explanation of *why* is what the modder is asking for — and the answer
routes through three pieces that don't all live in data:

1. The alarm CO has `aUpdateCommands: "GasPressureSense,AlarmPressureCO2"`
   which wires it to the C# `GasPressureSense` component.
2. When the sensor sees out-of-range CO2, it modeswitches the alarm to its
   red variant, which carries `IsReadyPumpAir=1` in `aStartingConds`.
3. The pump CO has `aUpdateCommands: "GasPump,AirPump02,Panel A"` — wires
   it to `GasPump`. `GasPump` reads its on/off signal from a remote CO each
   tick — *which* remote CO is the player's `strInput01` panel wiring at
   runtime.

The link from this alarm to that pump is **player-established**. It's not
in any JSON. The alarm doesn't reference pumps; the pump doesn't reference
alarms. They share a signal-condition vocabulary (`IsReadyPumpAir` ↔
`TIsReadyPumpAir`) and the player wires whichever pair they want.

Without code-side graph nodes, the explorer shows a dead end — *"this CO
has no outgoing reference to any pump"* — and cannot explain *why* or
*what* connects them. This is the dead-end PLAN-AST Phase 3 fixes.

---

## Solution path — once Phase 3 ships

### Step 1 — Land on the alarm CO

Search `ItmAlarmCO2OnR`. Detail page renders. Among the outgoing
references, under a new **Code wiring** block, the modder sees:

> **aUpdateCommands**:
> - `GasPressureSense,AlarmPressureCO2` → `code:GasPressureSense` (config:
>   `guipropmaps:AlarmPressureCO2`)

### Step 2 — Click into `code:GasPressureSense`

The component detail page shows declared in/out ports, derived from the C#
SemanticModel:

- **Inputs** (data-driven): `signal-cond` (`IsReadyPressureSense`, ticked
  by `tickers:PressureSenseCO2`), `clear-CT` (`TIsGasPressureSafeCO2`),
  `interaction-alarm` and `interaction-clear` (modeswitches).
- **Outputs**: each tick, queues a modeswitch to a red/green variant of the
  alarm CO depending on the room CT. The red variant's
  `aStartingConds` is what carries the on/off signal pumps consume.

Narrative line: *"this component reads pressure on the room at its `RoomA`
point and modeswitches the alarm CO. The red modeswitch's `aStartingConds`
is what carries the on/off signal that pumps consume."*

### Step 3 — Trace the signal

Click `conditions:IsReadyPumpAir`. The detail page now shows it as a
code-emitted condition (banner: *"set by the red alarm modeswitch CO;
consumed by `code:GasPump` via `TIsReadyPumpAir`"*). Outgoing edges: this
is a signal flag, not a stat. Incoming edges: `code:GasPump` reads it.

### Step 4 — Click into `code:GasPump`

`code:GasPump`'s detail page lists its ports:

- **`signal-CT-main`** (data-driven via `gasrespires:AirPump02.strSignalCTMain`):
  `TIsReadyPumpAir`. The pump reads this on a remote CO each tick.
- **`remote-input` (in-port, runtime-wired)**: dashed-edge banner: *"the
  remote CO is established by the player wiring `strInput01` on this
  pump's panel to another CO's signal output. Any CO carrying
  `IsReadyPumpAir` is a valid source. There is no data-side override for
  this connection — it's set in-game and persists with the save."*

That dashed banner is the answer to *"why can't I lock this in from data."*

### Step 5 — Answer the modder's question

The site now contains enough information for the modder to write:

> Cannot be done from data — the alarm-pump pairing is player-set in the
> in-game wiring panel UI. Workaround: pre-wire the alarm in a save file
> and share the save. Or: edit `gasrespires:AirPump02.strSignalCTMain` to
> a different condition the alarm doesn't produce, so the pump is gated on
> something else entirely (advanced; will affect every pump using
> `AirPump02`).

The modder posts that answer on Discord without asking for help.

---

## What the site needs to support this

- **`code:component` node kind for C# MonoBehaviours referenced from
  `aUpdateCommands`.** Phase 1 of PLAN-AST gives them detail pages; Phase 2
  gives them typed in/out ports.
- **Runtime-wired in-port flag.** Phase 3. The dashed-edge *"the player
  wires this in-game"* banner is **the** unblock for this story. Without
  it, the modder reaches step 4 and is told only that the pump reads a
  remote CO — true but unactionable.
- **`aUpdateCommands` structured render on data-side detail pages.** Phase
  1 / Phase 2 deliverable. Without this block, the modder never reaches
  step 2.
- **Code-emitted condition banner on `IsReadyPumpAir`'s detail page.**
  Phase 2 deliverable (it's currently a dangling-ref in the data-health
  view).

---

## Acceptance criterion

Phase 3 is "good enough" for this story when a modder following the steps
above answers the original Discord question without leaving the site, in
five clicks (alarm → component → signal → pump-component → port detail)
and one read of the runtime-wired banner.
