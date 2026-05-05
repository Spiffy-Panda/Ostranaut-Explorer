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

### Phase 1 — AST scope: `code:method` nodes, literal edges within method bodies · *next*

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

### Phase 2 — Semantic scope: `code:method` ports + `aUpdateCommands` resolution · *proposed*

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

### Phase 3 — Runtime-wired ports (panels / `strInput01`) · *proposed*

**Complexity rung:** still semantic model, plus a small data-side model extension.

**Goal:** represent player-established runtime wiring (e.g. an alarm's `strInput01` panel slot accepting any pump CO) as a typed connection in the graph, not as prose.

**Mechanism:**
- `code:component` in-ports gain a `runtimeWired: true` flag where the binding happens at game-runtime, not at data-load.
- The Site's traversal renders these as dashed edges with a hover-explanation: "this connection is established when the player wires panel A to panel B in-game; any CO whose signal type matches port T is a valid source."
- The data-side `panels/` folder (and any sibling configuring runtime wiring) gets a schema field — `inPortType` / `outPortType` — that the indexer cross-references against `code:component` ports.

**Deliverable:** the gas-pressure → pump chain renders as a single browseable graph path, with the dashed runtime edge clearly marked as "player-established."

**Open question:** whether `strInput01`-style fields belong on the `code:component` side (port-typed) or stay on data and gain an `x-runtime-wired` flag. Decide when this phase is picked up; both work.

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

The current Makefile `site` target (line 29) does **not** invoke `emit_code_refs.py` — `code_refs.js` is missing from `build/data/` on every fresh build. The site's graceful-degradation log message (`app.js:53-59`) silently became the default. Phase 1 fixes this by integrating into the Builder, so `code_graph.js` (or merged `graph.js`) emits unconditionally. (The runtime log message itself was corrected to point at the promoted `utils/python/emit_code_refs.py` path in a separate audit pass; the Makefile wiring is still missing.)

---

## How this relates to other open work

- **Slice E phase 6** (PLAN-EXPLORER.md, deferred) — schema-overlay promotion for 184 candidates. Independent. Phase 1 here doesn't depend on it; Phase 2 may obsolete some candidates if they're code-wired (`aUpdateCommands` arguments resolved here would no longer need a hand-curated schema rule).
- **Stat bars audit** (PLAN-EXPLORER.md, next) — independent. The `Stat*` cross-validation does not need code-side nodes.
- **Inline schema field descriptions / glossary card** (PLAN-EXPLORER.md, UX 1.1-1.3) — independent. Phase 2's port descriptions on `code:component` nodes might feed the glossary later, but that's a downstream consumer, not a dependency.

---

## Design discussion summary (for cold readers)

The grep extractor in `emit_code_refs.py` operates at finite-state complexity — it can recognize `"<identifier>"` but knows nothing about scope, paren matching, or symbol identity. To connect two names within the same method body (or to gate a write on a read) you need at least pushdown automaton (CFG) capability, which an AST gives you. Going further (control-flow gating, "this write only fires if this read returned truthy") requires the symbol-resolution / flow layer that Roslyn calls `SemanticModel`. Going further still (proving `foo` flows to `dict[key2]`) is abstract interpretation and is out of scope for this plan.

| Phase | Pipeline stage | Roslyn surface |
|-------|----------------|----------------|
| 1 | AST | `SyntaxTree`, `SyntaxWalker` |
| 2 | Semantic analysis (binding + CFG) | `SemanticModel`, `SymbolFinder` |
| 3 | Same as 2, plus a small data-schema flag | `SemanticModel` |
| 4 (deferred) | Same as 2 | `SemanticModel`, type hierarchy walks |

The "stop at the AST" rung (Phase 1) is the high-leverage one — it gives every method a node and every literal an edge, which subsumes the entire current grep pipeline plus enough structure to make Phase 2 tractable.
