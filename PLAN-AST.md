# PLAN-AST

Plan for replacing the regex-based `code_refs.js` pipeline with a Roslyn-AST-based extractor that promotes **decomp classes and methods to first-class graph objects** — same node/edge model as data, with their own in/out ports.

The grep pipeline (`utils/python/emit_code_refs.py` → `code_refs.js`) answers the lexical question "where does this strName appear in a quoted literal?" That is a regular-language operation and cannot connect anything more structured. This plan is not a port of that pipeline — it is the replacement of a finite-state recognizer with an AST/semantic walker, on the premise that the value-add is the connections, not the literal hits.

For complexity-class framing of the rungs, see the `[design discussion]` summary at the bottom of this file.

---

## Why this is a genuine value-add (not a grep upgrade)

The data side of the graph already shows "X references Y." The code side currently shows "X is mentioned by name in file Z, line N" and stops there. With AST awareness, the code side starts answering questions the data side cannot:

- **`aUpdateCommands` becomes a real edge.** `"GasPressureSense,AlarmPressureO2"` resolves to a node `code:GasPressureSense` with an in-port that consumes a `guipropmaps/` entry. The `condowner → guipropmaps` link is recovered without writing a hand-curated rule per command.
- **Code-emitted conditions become traceable.** `IsReadyPumpAir` has no producer in `data/conditions/` because it's set by `GasPressureSense.Run`. Today the explorer shows it as a dangling reference. With AST awareness it shows as "produced by `code:GasPressureSense` (decomp:GasPressureSense.cs:NN)."
- **Runtime-wired refs become representable.** Pump → alarm wiring (player-set via `strInput01`) shows up as "this CO has a remote-input port; any CO carrying signal `TIsReadyPumpAir` is a valid input." Today the chain is invisible in the site.
- **Co-occurrence in scope replaces lexical adjacency.** "What other strName values does `GasPump.Pump` touch?" becomes a graph traversal, not a file:line list to skim.

Effectively, the pressure-sensor → pump chain that motivated the previous turn's investigation becomes a **graph path** the site can render, instead of prose buried in a schema description.

---

## Goals & non-goals

**Goals (in scope for this plan):**
- A Roslyn-driven extractor in `Ostranauts.Site.Builder` (or a peer project) that ingests `decomp/Assembly-CSharp/`, emits `code:` nodes and edges into the existing `graph.js` payload (or a sibling payload merged at site load).
- The site renders code-side nodes with the same UI affordances as data-side nodes (fields, in/out ref blocks, hover-from-other-pages).
- The decomp tree stays the source of truth — no copying source into the repo, no derivative-text bundle in `build-public/`. Code references stay non-public per the four-factor check (factor 2: decompiled C# is proprietary creative work).

**Non-goals (deferred to v2 or out entirely):**
- Full dataflow / taint analysis ("`foo` eventually reaches `dict[key2]`"). Past Roslyn's stock semantic model, into abstract interpretation. Skip.
- Cross-assembly / Unity-engine resolution. We bind names within `Assembly-CSharp/`; we do not chase into UnityEngine or BepInEx assemblies.
- Decompiler-noise tolerance beyond "skip files Roslyn can't parse." If ILSpy spits a synthesized identifier we can't bind, we drop the edge with a counter, not a heuristic recovery.
- Public deployment of the code-side payload. The local `build/` may include it; `build-public/` does not. Re-run the four-factor check before changing that.

---

## Phases

Each phase ships a self-contained slice with a DEV-LOG entry. The graph data model is extended additively at every phase — old consumers keep working with new node kinds present.

### Phase 1 — AST scope: `code:method` nodes, literal edges within method bodies · *shipped 2026-05-04*

Implementation notes (post-merge):
- Folder names landed as `code-method` / `code-class` (kebab-case, not `code:method`) because the site's `${folder}:${strName}` ID splits on the first colon. The kind discriminator is the folder string itself.
- Bridging from `CodeNode`/`CodeLiteralEdge` to `DataObject`/`Reference` lives in `Site.Builder.Program.cs`, not in `Ostranauts.Decomp`, so the indexer stays free of `Ostranauts.DataModel` coupling.
- `code-method` nodes are emitted only when at least one identifier-shaped literal is present in the body (PLAN's "every method gets a node" framing relaxed to "every literal gets a node attached to its enclosing method"). Same effect for the existing-data-page "Incoming code refs" block; revisit when Phase 2 wants outgoing-literal-free methods to participate.
- See [DEV-LOG 2026-05-04](DEV-LOG.md) for the live build numbers and acceptance smoke.

**Complexity rung:** AST only (PDA / brace-matching, no symbol resolution).

**Goal:** every quoted-string literal in `decomp/Assembly-CSharp/*.cs` lands on a `code:method` node corresponding to its enclosing method, with file/line metadata on the edge — not in a sidecar dict.

**Implementation:**
- New project `src/Ostranauts.Decomp/Ostranauts.Decomp.csproj` targeting `net8.0`. Reference `Microsoft.CodeAnalysis.CSharp`. Keep `Ostranauts.DataModel` on `netstandard2.1` — Roslyn does not need to ship to BepInEx.
- A `DecompIndexer` that walks the decomp tree, parses each file with `CSharpSyntaxTree.ParseText`, walks `MethodDeclarationSyntax` and `ConstructorDeclarationSyntax`, and emits one node per method plus one edge per `LiteralExpressionSyntax` of kind `StringLiteralExpression` whose value matches a strName from `graph.js`.
- Parse failures are counted, listed in a per-build report, and skipped. No recovery heuristics.
- Builder consumes `DecompIndexer` and merges its output into `graph.js` (preferred) or emits `code_graph.js` as a sibling payload. Decision lives with the Phase 1 author.

**Graph schema additions:**
- New node kind `code:method`. Fields: `qualifiedName` (e.g. `GasPump.Pump`), `file`, `lineStart`, `lineEnd`, `kind: "code:method"`.
- New edge kind `refKind: "literal-in-method"`. Source: `code:method`. Target: existing data node by strName. Edge metadata: `line`, `text` (the line containing the literal, ≤120 chars).
- Out: retire `code_refs.js` and the `code-refs-block` UI in `app.js:627-636`. The new `code:method` nodes' outgoing edges replace it.

**Deliverable:**
- Decomp methods appear as searchable / linkable graph objects.
- Every existing data detail page gains an "Incoming code refs" block listing the methods that mention it.
- New detail page kind for `code:method` showing all strName edges out of the method body.

**Open questions:**
- Do we want one node per method, or one per method *body region* (split at top-level if/switch)? The latter is closer to control-flow and useful for Phase 2; the former is simpler. Default to per-method; revisit at Phase 2.
- Class-level static initializers (`= "..."`) should also be captured. Roslyn surfaces these as `FieldDeclarationSyntax` with an `EqualsValueClause`. Add a `code:class` node kind for these so the edge has somewhere to attach. Out-of-method literals are a real case in the decomp.

### Phase 2 — Semantic scope: `code:method` ports + `aUpdateCommands` resolution · *shipped 2026-05-04*

Implementation notes (post-merge):
- The dispatcher analysis didn't end up requiring a full Roslyn `SemanticModel` / `SymbolFinder` pass. The dispatcher (`CondOwner.AddCommand`) is a single-method `if (array[0] == "X") { ... }` chain whose syntactic shape carries enough — typed in-port resolution is "is the immediate enclosing call `DataHandler.GetXxx(array[i])`?" walked off the syntax tree, with a static `KnownGetters` map sourced from a one-time read of `DataHandler.cs`. PLAN's "ports are derived from the semantic model" remains the right framing, but the actual binding cost is small enough to skip the full compilation step. If that breaks for a future dispatcher (e.g. nested call indirection, polymorphic `SetData` dispatching), promoting to `SemanticModel` is a localized change in `ComponentIndexer`.
- Five of the 14 commands (`Pledge`, `GasRespire2`, `GasPump`, `GasPressureSense`, `Sensor`) have typed in-ports; the rest emit untyped ports because their data flows through `component.SetData(array)` — that's "follow into SetData" territory, deferred until a downstream feature wants it.
- Produces/consumes/observes edges only emit when the named condition exists in `conditions/`. That keeps `co.AddCondAmount(this.strSignalCond, ...)` (dynamic field — driven by guipropmaps data, not code) from generating noisy dangling edges. The data-side guipropmaps schema-rule path covers those cases.
- See [DEV-LOG 2026-05-04](DEV-LOG.md) for live build numbers and acceptance smoke.

**Complexity rung:** Roslyn `SemanticModel` — symbol resolution, type binding, basic flow.

**Goal:** make `aUpdateCommands` and similar code-wiring fields produce real edges automatically, without per-command schema rules.

**Mechanism:**
- For each C# class `Json*` and each `MonoBehaviour` whose name appears as the leading token of any `aUpdateCommands` entry in the data tree (e.g. `GasPressureSense`, `GasPump`, `Destructable`), the indexer emits a `code:component` node with declared **in-ports** (parameters consumed from the wiring string) and **out-ports** (conditions added to / removed from a CO during `Run` / `Pump` / equivalent).
- Ports are derived from the semantic model: a parameter that flows into a `LookUpByName(...)` call resolves to a typed in-port (target folder = the lookup table). A literal passed to a `CondOwner.AddCond(...)` resolves to a typed out-port (target folder = `conditions/`).
- Resolution rules live in the indexer, not the data schemas. The schema `aUpdateCommands` description becomes a one-liner pointer to the resolution rule, not the encyclopedia entry it grew into in the recent uncommitted diff.

**Graph schema additions:**
- `code:component` node kind with `inPorts: [...]` and `outPorts: [...]`.
- New edge kind `refKind: "wires-to"` from a data field (e.g. condowner.aUpdateCommands[i] token 2) to a `code:component`'s in-port.
- New edge kind `refKind: "produces-condition"` / `"consumes-condition"` from a `code:component` to a `conditions/` node.

**Deliverable:**
- `IsReadyPumpAir` and `IsReadyPressureSense` detail pages show "produced by code:GasPressureSense" without any overlay-data shim. The two entries currently in `comment_mod/data/conditions/conditions.json` get retired.
- The five `aUpdateCommands` commands documented in the recent diff (`GasPressureSense`, `GasPump`, `GasRespire2`, `Destructable`, `Electrical`) all surface their config-key resolution as graph edges. New commands added later resolve themselves; no schema edit required.

**Risk:** the semantic model only binds what the syntax tree contains. Calls into `UnityEngine.*` or `BepInEx.*` assemblies do not bind. Document the bind-failure rate per-class in the build report.

### Phase 3 — Runtime-wired ports (`strInput01` via guipropmaps) · *proposed (refreshed 2026-05-05 after Phase 2)*

**Complexity rung:** AST + a tiny static lookup-table extension. Same tier Phase 2 turned out to need — no `SemanticModel` required (Phase 2's framing-of-need did not survive contact with the actual decomp; revisit if a future analysis really does require binding).

**Goal:** represent player-established runtime wiring (e.g. a CO2 alarm's `strInput01` slot accepting any pump CO) as an explicit, navigable graph edge — not prose buried in a schema description.

#### Reality check from Phase 2

While shipping Phase 2 we read enough of the decomp to find that a couple of assumptions in the original Phase 3 sketch were wrong:

1. **There is no `panels/` folder.** Runtime wiring lives inside `guipropmaps/`'s `dictGUIPropMap` flat key/value array. Keys observed in real data: `strInput01`, `strInput02`, `strInput01Interaction`, `strSubPoint`, `strAddPoint`, `strSignalCond`, `strCondMonitor01`, `strInteractionAlarm`, `strInteractionClear`, `strCTClear`, `strValidCOTrigger01`. So the cross-side join is `code-component` ↔ `guipropmaps` keys, not a separate panel folder.

2. **The connection point is a CO instance id, not a strName.** The static-data field (e.g. `strInput01: ""`) is empty by default; the player edits it in-game and the value becomes a runtime CO id. So a populated `strInput01` field in `guipropmaps` is a *factory default* — most are blank, the binding is fully runtime.

3. **Multiple components consume `strInput01`.** Confirmed reads in the decomp: `Heater.UpdateRemote` (`dictionary.TryGetValue("strInput01", out this.strRemoteID)`), `GasPump.SetData/Pump`, `GUIAirPump.GetCOByID(this.dictPropMap["strInput01"])`, `GUIMeter`, `GUIToggle4x`, `GUIToggle4xInput`. Each is a distinct code-component (when it appears in `aUpdateCommands`) or a GUI sibling that shadows one.

#### Mechanism (revised)

- **AST discovery.** Scan every `code-component`'s implementing class for `dictionary.TryGetValue("strInput0N", out …)` and `this.dictPropMap["strInput0N"]` patterns inside its update methods (`Update` / `UpdateRemote` / `Run` / `Pump` / equivalent). Each match adds one **runtime in-port** to the component, named after the literal string (`strInput01`). The matching key letters (`InteractionAlarm` etc.) on the same dictionary follow the same pattern; treat each as a port. Stays AST-only, mirroring `ScanComponentClassForCondCalls`.
- **Port typing via field flow.** When the read value is assigned to a field (`this.strRemoteID`) and that field is later passed to `ship.GetCOByID(this.strRemoteID)` or `DataHandler.GetCondOwner(this.strRemoteID)`, the port's expected target is `condowners/` — depth-1 follow-into, just like Phase 2's typed-port resolution. Reuse the same `ResolveFieldUsage` helper (it just needs to learn `GetCOByID` → `condowners`).
- **Static-default edges.** For each `guipropmap` entry whose `strInput0N` value is non-empty, emit one `RuntimeWiresTo` edge from the host condowner (the one whose `aUpdateCommands` references this guipropmap via the existing Phase 2 `WiresTo` to `code-component:Heater[1] → guipropmaps`) to the named target. Most entries are empty — that's fine, the port still surfaces, the edge just isn't pre-baked.
- **Runtime port flag on the existing `code-component` payload.** Add a new top-level `runtimeInPorts` array alongside `inPorts` / `produces` (same JsonElement-on-NODE_PROPS pattern Phase 2 already uses). Each entry: `{ name: "strInput01", targetFolder: "condowners", source: "ship.GetCOByID(this.strRemoteID) ← this.strRemoteID = dictPropMap[\"strInput01\"]" }`.

#### Graph schema additions

- New edge `kind`: `RuntimeWiresTo`. Source is a data condowner (or a `guipropmaps` entry); target is a data condowner. `metadata = { portName, defaultValueSource, runtime: true }`. The site renders these dashed instead of solid (Phase 1.1's grouping CSS already separates structurally; one more ruleset for `[data-runtime="true"]`).
- `code-component` `properties.js` gains `runtimeInPorts[]` (mirrors `inPorts[]`).

#### Deliverable

The [rewire-co2-alarm-to-remote-pump](notes/user-stories/rewire-co2-alarm-to-remote-pump.md) story passes end-to-end:

1. Open `condowners:CO2AlarmCO`. See its `aUpdateCommands` group `Heater(...)` from Phase 2. Click `code-component:Heater`.
2. On the Heater detail page, see a new **Runtime in-ports** block: `strInput01 → condowners` (typed via the `GetCOByID` chain), `strCondMonitor01 → conditions` (read into `this.strSignalCond`, used in `co.HasCond(this.strSignalCond)`), etc.
3. Click any condowner with a populated `strInput01` static default — the edge is dashed and labeled `runtime-wired (default value: "AirPump02")`.

#### What stays out of scope

- **Cross-component matching by signal type** (e.g. "any CO whose `strSignalType` matches port `T` is a valid source"). The `strSignalType` field on guipropmaps doesn't have a published vocabulary in either decomp or data; it's a player-facing runtime semantic. Phase 3 makes the *port* visible and the *static defaults* visible. A "candidate sources for this port" hover is a Phase 4-ish polish.
- **Live save-file inspection.** Reading a player's actual saved `strInput01` values is a different input surface (saves live in `%USERPROFILE%/AppData/...`, different format). Out of scope here; v2's save inspector covers it.

#### Lessons from Phase 2 carried forward

- **One-hop follow-into is enough.** Phase 2's depth-1 resolver (direct → method-arg → field-assignment → method-arg-via-field) caught every case we cared about in `CondOwner.AddCommand`. Phase 3's runtime-port resolution follows the same chain (`dict["strInput01"]` → field → `GetCOByID(field)`); reuse `ResolveFieldUsage`.
- **Untyped ports still ship.** Phase 2's `code-component` page lists `[2] → untyped` for unresolvable positions. That's a feature: the modder sees the slot is consumed even when we can't type it. Phase 3 should do the same when a `strInput0N` value's flow doesn't land on a known DataHandler getter.
- **Container-grouping (Phase 1.1) applies.** Multi-key reads from one `dictPropMap` (`strInput01` + `strCondMonitor01` + `strSubPoint` + `strAddPoint`, all in one `Heater.UpdateRemote`) are siblings under one container — the site already renders sibling-literal blocks; runtime in-ports should land in the same idiom.

### Phase 4 — Decomp class hierarchy as a first-class navigation surface · *deferred*

Once `code:class` / `code:method` / `code:component` nodes exist, an inheritance map (`Json*` ↔ `JsonCondOwner` ↔ `IVerifiable`, etc.) becomes a free side-deliverable. The site can offer a "code structure" view that lists the 126 `Json*.cs` files and their data-folder bindings (per CLAUDE.md). Not load-bearing for the modder UX, so deferred until a downstream feature needs it.

---

## Implementation notes that apply to all phases

- **Roslyn lives in `Ostranauts.Decomp` (or `Ostranauts.Site.Builder`), never in `Ostranauts.DataModel`.** The library targets `netstandard2.1` for future BepInEx loadability; dragging Roslyn into it would balloon the deployable surface.
- **No decomp source goes into `build-public/`.** Re-confirm with the four-factor check (CLAUDE.md → "Pre-push check") before any change. Code-side payloads ship to the local `build/` only.
- **Every decomp file is read once.** The indexer streams the directory, parses each file once into a `SyntaxTree`, runs all phase-relevant walkers in a single pass. The current Python regex pipeline already does this; preserve the property.
- **`emit_code_refs.py` stays as a smoke-test fallback.** Useful for "does this strName appear anywhere in code at all" without spinning up Roslyn. Mark it explicitly as a fallback in its docstring once Phase 1 ships.
- **Site UX integration follows the existing `code-refs-block` precedent** — `app.js:627-636` and `style.css:361-386` already render a code-references section on data detail pages. Phase 1 reuses the slot, just with richer edges. Don't redesign the UI block in the same PR; ship the data side first.

---

## Build wiring

Phase 1 integrated the AST indexer directly into `Ostranauts.Site.Builder.Program.Main`, so `graph.js` carries the code-side nodes/edges unconditionally whenever `decomp/Assembly-CSharp/` is present. No Makefile change needed — the Builder auto-detects, and `--no-decomp` opts out. `utils/python/emit_code_refs.py` remains as a smoke-test fallback (its output, `code_refs.js`, is still consumed by the site's `renderLegacyCodeRefsBlock` path when no AST edges exist).

---

## How this relates to other open work

- **Slice E phase 6** (PLAN-EXPLORER.md, deferred) — schema-overlay promotion for 184 candidates. Independent. Phase 1 here doesn't depend on it; Phase 2 may obsolete some candidates if they're code-wired (`aUpdateCommands` arguments resolved here would no longer need a hand-curated schema rule).
- **Stat bars audit** (PLAN-EXPLORER.md, next) — independent. The `Stat*` cross-validation does not need code-side nodes.
- **Inline schema field descriptions / glossary card** (PLAN-EXPLORER.md, UX 1.1-1.3) — independent. Phase 2's port descriptions on `code:component` nodes might feed the glossary later, but that's a downstream consumer, not a dependency.

---

## Design discussion summary (for cold readers)

The grep extractor in `emit_code_refs.py` operates at finite-state complexity — it can recognize `"<identifier>"` but knows nothing about scope, paren matching, or symbol identity. To connect two names within the same method body (or to gate a write on a read) you need at least pushdown automaton (CFG) capability, which an AST gives you. Going further (control-flow gating, "this write only fires if this read returned truthy") requires the symbol-resolution / flow layer that Roslyn calls `SemanticModel`. Going further still (proving `foo` flows to `dict[key2]`) is abstract interpretation and is out of scope for this plan.

| Phase | Pipeline stage | Roslyn surface | Status |
|-------|----------------|----------------|--------|
| 1 | AST | `SyntaxTree`, `SyntaxWalker` | shipped 2026-05-04 |
| 2 | AST + static getter→folder table + depth-1 follow-into (method args, field assignments, whole-array forwarding) | `SyntaxTree`, no `SemanticModel` needed in practice | shipped 2026-05-04 |
| 3 | Same shape as Phase 2 — extend the resolver to `dict.TryGetValue("strInput0N", out field)` patterns; add a new `RuntimeWiresTo` edge kind for static-default values | `SyntaxTree`, AST-only (revisit if a future analysis really needs `SemanticModel`) | proposed (refreshed 2026-05-05) |
| 4 (deferred) | Same as 3 plus type-hierarchy walks for `Json*` ↔ `JsonCondOwner` ↔ `IVerifiable` inheritance | `SemanticModel` if/when it becomes necessary | deferred |

The "stop at the AST" rung (Phase 1) is the high-leverage one — it gives every method a node and every literal an edge, which subsumes the entire current grep pipeline plus enough structure to make Phase 2 tractable.
