# DEV-LOG

Reverse-chronological. Add an entry before every commit — at minimum a one-liner, ideally a short paragraph when the change is non-obvious. Tag with ISO date.

---

## 2026-05-07 — mod-npc-vendor user story (aInverse response-menu misread)

Captures a Discord-observed modding misread as a user-story scoring scenario. A modder built a humanoid vendor (`IsTraderNPC=1`), opened `interactions.json` to verify, saw `GUITradeAllowOKLGFixer` ("Browse the OKLG Black Market") listed in `GUITrade.aInverse`, and concluded the black-market branch was attached to their NPC. It isn't — `aInverse` is the response-branch list on the *interaction definition*, not on the NPC, and entries are CTTest-gated at runtime per `Interaction.cs:684–779`. `IsOKLGFixer` has exactly two grant paths in base-game data: `CONDTraderNPCOKLGFixer` (a static loot bundle the modder would have to pull deliberately) and `CONDPLOT_NewOKLGFixer_FixerConds` (applied by the New OKLG Fixer plot, whose selection predicate `CTPLOT_NewOKLGFixer_FixerNew_Make` hard-requires `CareerCriminal` or `CareerCriminalPast`). A vanilla vendor never qualifies; the branch is filtered out before the player ever sees it.

**[notes/user-stories/mod-npc-vendor.md](notes/user-stories/mod-npc-vendor.md)** — walks the misread, traces the gate, and proposes the explorer surfaces needed to short-circuit the wasted half-hour: response-menu framing banner on every `aInverse`, per-row gate pill summarising the target's `CTTestUs` / `CTTestThem`, and a derived "How is this granted?" section on Condition detail pages that breaks grants out into static-template vs. plot-driven (with the plot path's selection predicate summarised inline). Acceptance is "phew, I don't have to fix anything" in under 3 minutes — a misread-prevention test rather than an edit-enabling one.

**[PLAN.md](PLAN.md)** — routes the new story under EXPLORER between `mod-hygiene-station` and `mod-starter-ship`. Carrier line names the three explorer-side proposals plus a schema-overlay enrichment to fold the base-schema's chat → chat-reply example and `,[us],[them]` role-suppressor mechanic into our `aInverse` gloss in `comment_mod/data/schemas/interactions-schema.json` (the overlay's current description is correct but loses both load-bearing details).

**[.gitignore](.gitignore)** — excludes `/prose-extraction/Discord/` (verbatim Discord chat exports kept locally for context). Source material for this and future user stories lives there; the rule against quoting verbatim or naming individual users in tracked files is documented in CLAUDE.local.md.

Pre-push fair-use: factor 1 transformative (modder-tooling user story explaining an interaction-system pattern), factor 2 our prose + identifier names + one ~10-line `aInverse` snippet, factor 3 single representative excerpt, factor 4 no substitution risk. All four clear.

## 2026-05-07 — Room classification & ship-value reference (notes/rooms.md + rooms-reference.html)

Room classification is mostly intuitive from the rooms.json table, but the *value math* — `fValueModifier` × per-installed-CO base price, plus an undocumented O2-pump ×3 bonus and an asymmetric wall-mounting rule — isn't, and the [wiki](https://ostranauts.wiki.gg/wiki/Ship_Building#Ship_Value) covers maybe 20% of it. Two new artifacts fix this.

**[notes/rooms.md](notes/rooms.md) — modder-facing markdown reference.** Walks the two-stage classifier (geometry flood-fill in `Ship.cs:8800` → priority-ordered first-match `Matches()` in `Room.cs` / `RoomSpec.cs`), the per-room reqs/forbids decoded from `=chance×count` syntax, a meta-trigger glossary (`TIsRoomEngineering` / `TIsRoomWellnessOptionals01` / `TIsRoomRecreationOptionals` / `TIsRoomCargo` / `TIsRoomCargoExterior`, plus `TIsCanister` and `TIsShipBatteryInstalled` — all `bAND: false` aggregates the bare JSON doesn't hint at), and the five rooms that aren't a simple property-table read: Bridge Closed/Open paired by forbid-list, CargoRoomExterior as the only `bAllowVoid: true`, Reactor's priority-100 wins-everything behavior, the meta-trigger-using rooms, and Blank's `IsBlank` short-circuit.

**[src/Ostranauts.Site/rooms-reference.html](src/Ostranauts.Site/rooms-reference.html) — self-contained static web page.** Single `window.ROOMS` source-of-truth array drives both the priority-ordered decision table (color-coded `nPriority` pills 100→0) and the foldout per-room `<details>` cards. Click a table row → corresponding card opens and scrolls into view; hash deep-links work (`#room-LuxuryQuarters`). Three stacked value-callouts walk the price story end-to-end: **green** = per-room `RoomValue = Σ co.GetBasePrice() × fValueModifier`; **blue** = the full `Ship.GetShipValue()` formula including the O2 pump ×3 (independent multiplicative bonus applied after per-room sum) and the explicit "no variety bonus despite the W-X-Y-ZZZZ rating string implying one"; **red** = wall-mounting asymmetry — walls themselves contribute $0 to ship sale (no `use` mapPoint, both branches of `Tile.AddToRoom` fall through), wall-mounted equipment is credited to whichever room contains its `use`-point tile, and items like `ItmCargoLift01` (55,752 base price) are stranded at $0 in ship sale because they have no use-point at all.

**Style.** Reuses the existing dark-theme tokens from `style.css` (`--bg`, `--bg-elev`, `--accent`, `--warn`, `--bad`, `--good`) so the page integrates with the rest of the site. Three callout colors map to three roles: green = explainer, blue = formula, red = gotcha. No external scripts/CSS, works from `file://` like the other site pages. Mobile responsive (flow grid collapses 4 → 2×2 at <50rem).

**Wiki gaps documented.** Drafted MediaWiki-style blurbs in chat for the two genuinely-hidden mechanics (Air Pump Bonus subsection + Ship Rating clarification noting the X count is descriptive only, not a value bonus). Not PR'd to the wiki itself; capture is in the chat transcript for now.

Pre-push fair-use: factor 1 transformative (modder reference distilling JSON + decompiled behavior into one page), factor 2 our prose + tables, no verbatim C# excerpts, factor 3 short pseudo-code formulas only, factor 4 useless without owning the game. All four clear.

## 2026-05-07 — Design axis: DESIGN.md + PLAN-DESIGN.md + Claude Designer brief

Open the **visual design** axis as a sibling to PLAN-EXPLORER and PLAN-AST. Adds three top-level docs and routes them through PLAN.md.

**[DESIGN.md](DESIGN.md) — principles, not specs.** Eight invariants (beginner-first density; dismissibility-not-absence; don't gate on hover; plain language first, jargon second; stable visual vocabulary; color is never the sole carrier; provenance is honest, not punitive; the detail page is the dominant surface) plus the seven distinct UI element classes the design must keep separable, the three accent tones (banner blue / inline note neutral / Edit-this callout yellow), the static-site constraints (no Tailwind/shadcn/React; plain CSS only; `file://`-runnable), and the accessibility floor. Distilled from `notes/ux/newcomer-onboarding.md` §2 and the 11 user-story journeys.

**[PLAN-DESIGN.md](PLAN-DESIGN.md) — three-phase plan.** Phase 1 wireframes for 10 page-and-state targets; phase 2 high-fi (design tokens spec + renders + a `style.css` candidate + folder-name → palette-index table for the 30 folders); phase 3 integration into `src/Ostranauts.Site/style.css` with screenshot-pair verification per slice.

**[notes/design/claude-designer-brief.md](notes/design/claude-designer-brief.md) — paste-able prompt.** Self-contained brief embedding the audience definition, the 12-component catalog, the detail-page hierarchy, the folder list, the 8 principles, and the 11 user-story walks. Designer also has read access to the public repo, so the brief links to `notes/ux/newcomer-onboarding.md` and `notes/user-stories/` rather than fully embedding them.

PLAN.md updated to "three plans" routing. .gitignore now excludes `.playwright-mcp/` (per-session working dir for the visual-verification screenshot tool). [notes/screenshots/](notes/screenshots/) seeded with two PNGs of the current explorer landing — the verification path is `mcp__plugin_playwright_playwright__browser_take_screenshot` with repo-root-relative `notes/screenshots/<name>.png`; `mcp__Claude_Preview__preview_screenshot` returns to chat only and won't help here.

Pre-push fair-use check: factor 1 transformative (modder-tooling design plan), factor 2 our writing not game prose, factor 3 no game-data excerpts, factor 4 no substitution risk. All four clear.

## 2026-05-06 — PLAN-EXPLORER slice 8: Thresh-derived panel + strType dispatch tooltip (UX 1.4/1.8); 1.11 deferred

Two stretch components ship; one defers.

**UX 1.4 — derived "Modifies thresholds of this" panel.** Sits between the Fields block and the code-refs block on `Stat*` condition pages. Aggregates incoming edges to `conditions:Thresh<strName>` + `conditions_simple:Thresh<strName>` — neither node typically exists in real data because Thresh* conditions are *engine-synthesized at runtime*, not declared as JSON entries. The panel reads the dangling-edge targets directly: groups by source folder, sorts each by source-strName, shows up to 6 grants per folder with `+N more` overflow when crowded, and renders sample edge metadata on each row (min/max from the loot-string DSL).

**Empty-state is load-bearing.** [mod-suppress-needs.md](notes/user-stories/mod-suppress-needs.md) explicitly requires the empty state ("StatFood and StatHygiene have no Thresh* handle in the base game") to be visually obvious so the modder pivots to the rate-suppression mechanism. When zero Thresh-targeting edges exist, the panel renders with a `.thresh-empty` warn-accent variant explaining "this stat doesn't have a threshold-shift handle — modders typically suppress its consequences via `-Stat<X>Rate` entries instead." Same prose-first principle as the folder-mismatch note.

Live verification:
- `conditions:StatGrav` → 12 grants (CONDAntiGravStim2Per, CONDFeeblePer, CONDFitPer, …) — the anti-G-LOC modder lands here and sees both clothing and drug grants in one panel.
- `conditions:StatAtrophy` / `StatFood` / `StatHygiene` → all empty-state, all explain the rate-suppression pivot.

**UX 1.8 — strType dispatch tooltip.** Click a small `?` trigger next to the `strType` value in the Fields block to pop a 7-row table mapping each `strType` value (`condition`/`item`/`interaction`/`trigger`/`condrule`/`lifeevent`/`ship`) to its target folder + one-line behavior summary. The current entry's strType row is highlighted via `.active-row`. Beginners shouldn't have to read CLAUDE.md to learn this; the dispatch table is encoded in the parser's type-routed loot rules, slice 8 just surfaces it.

Verified: `loot:CONDApatheticPer` (`strType: condition`) → click `?` → table shows 7 rows with `condition` row highlighted as active.

**UX 1.11 — live-build diff: deferred.** Genuinely larger than a one-sitting slice. Needs (a) a graph-payload snapshot cached in localStorage at every page load, (b) a diff pass comparing current edges against the cached previous, (c) per-edge highlight rendering with decay logic. Worth doing after the rest of the newcomer surface gets a user-test pass — at which point we'll know whether this matters more than other items not on PLAN today. Documented in PLAN-EXPLORER as deferred, not removed.

**UX 1.12 — plain-language wiki links: tagged partial.** Glossary cards and per-prefix banners already carry wiki links. DSL primers (1.7) and Edit-this callouts (1.10) don't yet. Trivial to add; bundle into the next user-test cycle rather than its own slice.

Numbers unchanged: 91 rules, 87,845 references, 31 glossary cards, 193 field descriptions. No console errors (stale clipboard NotAllowed lines from earlier preview-eval probes are cosmetic, not from the new code).

## 2026-05-06 — PLAN-EXPLORER slice 7: Edit-this callout (UX 1.10)

Generated edit instructions for the most common modder-tunable patterns. Sits below the per-prefix banner / folder-mismatch note and above the Fields block — strongest visual emphasis on the page when it appears, since for a modder on a tuning task this is the destination.

**Detection per (folder, outgoing-edge shape).** Not by reading payload arrays from `properties.js` (those don't ship — arrays are gated to code-* folders) but by inspecting the *outgoing edges* the parser produced. Three pattern matchers seeded:

- `loot/` with `aCOs` edges carrying `chance/min/max` metadata → condition-grant case (anti-G-LOC, atrophy drugs, mood grants, hygiene effects). Picks a sample target name and tailors the direction-of-effect hint: `Thresh*` → "more tolerance"; `*Rate` → "scales the drain rate"; otherwise generic "stronger effect". When the entry also has `aLoots` outgoing edges, appends a second `<div class="callout-sub">` flagging the parallel item-drop dial.
- `loot/` with `aLoots` edges only → item-drop case (chance/min/max as quantity dials).
- `condowners/` with `aStartingConds` edges → default-state case ("only fresh spawns pick up the change" — the save-safety caveat from mod-suppress-needs).
- `traitscores:Trait Scores,1` (well-known strName) → chargen cost-table case ("position 2 of each comma-separated triple"; calls out the `0,0` filter-out gotcha from mod-free-traits).

**Rendering.** `renderCallout({ heading, body, steps, clipboard })` helper produces a yellow-tinted callout (warn accent, distinct from the blue-tinted explainer banner so the two don't visually compete). Header carries a "copy path" button; click writes the JSON file path to the clipboard so the modder can paste it into their editor's quick-open. Steps render as an ordered list — typically open file, find strName, edit field, run `make`, reload.

The callout text is generated, not stored — the `Name=chance x min-max` example pulls a real edge target from the current page so the example matches what the modder actually sees in the data.

**One nuance worth flagging.** The user-stories' "edit value 1.0 → 2.0" framing for `ThreshStatGrav=1.0x0.03125` was imprecise — the parser stores Loot.aCOs as loot-string format, so `1.0` is stored as `chance` and `0.03125` as `min/max` (not as cond-string `value`/`duration`). The callout copy reflects this honestly: "the dial is the magnitude after the `x`" with a labeled live example, rather than parroting the user-story's mislabel.

**Verification.** `loot:CONDApatheticPer` → callout with `ThreshStatAchievement=1.0x0.2` example + 4 steps + copy button. `loot:CONDOssifexStimPer` → callout with the *Rate* hint variant. `condowners:ItmSink01` → starting-conditions callout. `traitscores:Trait Scores,1` → chargen-cost callout. `conditions:StatGrav` → no callout (correct — stat conditions don't carry an aCOs payload to tune).

Numbers unchanged. No console errors except expected clipboard-API NotAllowed in the headless preview eval.

## 2026-05-06 — PLAN-EXPLORER slice 6: detail-page top — per-prefix banners + folder-mismatch note (UX 1.2/1.9)

Two cooperating components above the Fields block on every object detail page.

**UX 1.2 — per-prefix explainer banners.** Library of 7 banners keyed on strName naming-convention regexes scoped to one or more folders: `Thresh*` in conditions/, `Stat*` in conditions/, `Dc*` in conditions/, `COND*` in loot/, `DRUG*` / `CONDOssifex*` / `CONDStim*` in loot/condowners, `Itm*` in condowners/, `ACT*` in interactions/. First match wins (more-specific patterns ahead of broader). Each banner: title + 2-4 sentence body + optional wiki link. Dismissible per *id* (not per page) — clicking × on `StatGrav` hides the "About Stat conditions" banner on every Stat* page across the site. State persists in `localStorage["prefixExplainerDismissed"]`.

Library kept inline in `app.js` (`PREFIX_EXPLAINERS` array) rather than a separate `explainers/*.json` payload — 7 entries don't justify a Builder export step, and inline keeps the copy versioned alongside the renderer that consumes it. Easy to lift to JSON later if seed grows.

**UX 1.9 — folder-mismatch inline note.** When a strName's prefix convention disagrees with its actual folder, render a smaller note immediately under the explainer banner (or directly under the file path when no banner fires). Detected via a `PREFIX_FOLDER_MAPPING` rules array — each rule has a prefix regex, an "expected" folder, and a function that emits the explainer text given the *actual* folder (lets one rule cover multiple wrong-folder cases with different prose).

Seeded mappings:
- `COND*` expected in conditions/, actual in loot/ → "the strType field, not the prefix, decides folder. strType: condition routes through Loot's grant dispatcher." This is the single most-cited newcomer trap from the user stories.
- `Itm*` expected in items/, actual in condowners/ or loot/ → distinct messages for each (state container vs. loot payload).
- `ACT*` expected in interactions/, actual in loot/ → "Loot delegate for an interaction (strType: interaction)" — the Destructable-wiring case from mod-hygiene-station.
- `StatDamage*` expected in conditions/, actual in conditions_simple/ → the conditions_simple/ shorthand-format note. Surfaces the gotcha that Phase 3.1B retargets edges around.

**Detail-page top hierarchy (final).** From top to bottom: header (strName, folder, file path, copy-ref) → code-emitted blurb if applicable → **per-prefix explainer banner(s) (1.2)** → **folder-mismatch note (1.9)** → template block → Fields block → code refs → outgoing/incoming refs. Matches §2.1 of the UX plan.

**Verification.** `conditions:StatGrav` → 1 banner ("About Stat conditions"), no mismatch (correct folder). `loot:CONDApatheticPer` → 1 banner ("About wearable / payload condition grants") + 1 mismatch note ("Why is this in loot/? strName prefixes…follow naming convention but do not determine folder. The strType field does."). `conditions:IsApathetic` → no banner, no mismatch. Dismiss on `StatGrav` removes banner from `StatAtrophy` too; `localStorage["prefixExplainerDismissed"]` reads `["stat-conditions"]`.

Numbers unchanged. No console errors.

## 2026-05-06 — PLAN-EXPLORER slice 5: ref-row v2 — folder/strType badges + filter pills + DSL primer (UX 1.5/1.6/1.7)

Three UX components shipped together because they all touch the ref-row renderer; bundling avoids three sequential refactors of the same code path.

**UX 1.5 — folder + strType badges.** `renderEdgeRow` swaps the prior plain `<span class="field">folder</span>` for a `.folder-badge` carrying a stable per-folder color (12-color palette, hashed by folder name) plus an optional `.strtype-badge` when the *other* node has a `strType` field. Color picked via a non-cryptographic char-sum hash → palette index, so loot stays the same color site-wide. Color is never the sole carrier — every badge has its text label and a `title=` tooltip.

**UX 1.6 — filter pills.** When a ref panel has more than 5 rows, `renderEdgeGroups` emits a `.filter-pills` row above the groups: one pill per source/target folder (sorted by count) plus one `strType:` pill per distinct strType, plus a `clear filters` pill when any are active. Multi-pill semantics: AND across dimensions (folder ∧ strType), OR within each dimension. Active filters render with `.active` (filled). Per-page state lives in an `activeFilters` Map keyed by panel id (`in/<folder>:<strName>` or `out/...`); cleared on object navigation in two places — `navigateToObject` (via search + alt-folder click), and a `lastDetailId` check inside `renderObjectDetail` for direct-URL nav. State intentionally NOT in localStorage — pills are session/page-scoped per the spec.

**UX 1.7 — DSL primer popover.** Each labeled metadata chip (value/dur, chance/min/max, verb, portKey, commandPos) renders as a clickable `.meta-chip[data-dsl=<kind>]`. Click pins a `.dsl-primer` popover with title, labeled live example, per-part definitions, and a `tip` line. Click outside or × dismisses. Five primers seeded: cond-string, loot-string, condition verb (Add/Remove/HasCond), `aUpdateCommands` position, guipropmap dict key. Hover-trigger deferred — not adding it until accessibility audit; click-pin works for keyboard + mouse equally.

Verification (live preview, `conditions:StatDamage` — 967 incoming refs):
- Folder badges render with palette colors (`condrules` purple, `loot` yellow, `condowners` distinct).
- 7 pills auto-suggested: 5 folders (condowners 946, condtrigs 10, code-component 6, loot 4, chargeprofiles 1) + 2 strTypes (Item 946, condition 4). Click `loot` → 967 → 4 visible, status reads "4 of 967".
- Click a `lootstring` chip on a `loot:CONDApatheticPer` outgoing → primer shows "Loot-string format" with `ItmFoo=0.5x1-3` example and labeled parts.

Implementation surface: `renderEdgeRow` + `renderMetadata` rewritten; `renderEdgeGroups` gains a `panelId` parameter; new `renderFolderBadge` / `renderStrTypeBadge` / `renderDslPrimer` / `wireDslPrimers` helpers; CSS additions for `.folder-badge`, `.strtype-badge`, `.filter-pill[.active|.strtype|.clear]`, `.meta-chip[.dsl-condstring|.dsl-lootstring|.meta-verb]`, `.dsl-primer`. Numbers unchanged: 91 rules, 87,845 refs.

## 2026-05-06 — PLAN-EXPLORER slice 4: glossary cards + concept search (UX 1.1)

Hand-seeded concept→strName cards bridging plain-English game vocab to data-tree terms — the single most-load-bearing newcomer-onboarding component. Gates the lucky path of [crew-exercise-invisible-need.md](notes/user-stories/crew-exercise-invisible-need.md) (`exercise` / `atrophy` → `conditions:StatAtrophy`), unblocks [mod-suppress-needs.md](notes/user-stories/mod-suppress-needs.md) (`hunger` → `StatSatiety`+`StatFood` split, since there is no `StatHunger` in the data), and is step 1 of the [anti-g-loc-newcomer.md](notes/user-stories/anti-g-loc-newcomer.md) path (`anti-g-loc` → `conditions:StatGrav`).

**Seeded content.** 31 cards across three files in `comment_mod/data/glossary/`:
- `needs.json` (11 cards): anti-G-LOC, atrophy/exercise, satiety, food/malnutrition, hydration, sleep, fatigue, hygiene, defecate, pain, encumbrance.
- `moods.json` (6 cards): morale (umbrella), achievement, esteem, meaning, work-tick mood drain, free-time-tick refill.
- `concepts.json` (14 cards): threshold-shift, condowner, condition, condrule, condtrig, loot, interaction, pledge, installable, traitscores, starter ship, sink-as-template, apathetic, ossifex.

**Builder side.** `Program.WriteGlossary` walks every `<root>/glossary/*.json` across all data roots, parses each as a JSON array of cards, dedupes on display `name` (case-insensitive, last-wins so a mod can override a base-game card), and emits `build/data/glossary.js` as `window.GLOSSARY = [...]`. Stdout reports `glossary: N cards`. Empty/missing dir = no glossary, no error.

The dedup key is `name`, NOT `dataTerm`: two cards can legitimately point at the same dataTerm (e.g. *"Morale"* and *"Achievement"* both resolve to `conditions:StatAchievement` but are distinct entry points a beginner searches for). First implementation deduped on dataTerm, which silently dropped the *"Morale"* card; caught and fixed mid-slice.

**Site side.** `explorer.html` loads `data/glossary.js` via a new `<script src>`. `app.js` builds a flat alias index at startup (`{ alias: lowercased, entry } * N`) and on every search input runs both `searchMatches` (strName) and `glossaryMatches` (top 4) against the query. Cards render above strName matches in the search dropdown with a distinct `.glossary-card` class — accent-tinted background, "concept" label, summary, "→ Game-data term: folder:strName" CTA, optional modder hint and wiki link. Click navigates to the dataTerm's detail page (same path as a strName match would have).

Matcher ranking: exact alias match (0) > alias prefix-of-query (1) > query prefix-of-alias (2) > substring (3). Deduped per-query on dataTerm so an entry whose multiple aliases match doesn't render twice.

**Verified live.** Tested 4 queries from the user-story bottlenecks:
- `anti-g-loc` → 1 card (Anti-G-LOC tolerance).
- `atrophy` → 2 cards (Atrophy + Ossifex anti-atrophy drug) alongside 15 strName matches.
- `hunger` → 2 cards (Hunger short-term + Malnutrition cumulative) with 0 strName hits — exactly the dead-end-prevention case from mod-suppress-needs.
- `morale` → 1 card (Morale / Mood); confirmed the dedup fix.

Builder rerun: 31 cards, 91 rules, 87,845 references — graph numbers unchanged (glossary is an additive sibling payload). 79/79 tests still pass; no test surface for the glossary path yet (small, and the dedup logic is straightforward enough that a manual roundtrip catches regressions).

## 2026-05-06 — PLAN-EXPLORER slice 3: inline schema descriptions on the Fields block (UX 1.3)

Schema descriptions now render inline beneath every Fields-block row that has one. Three changes:

**Builder side.** `SchemaCatalog` gains a separate `FieldDescriptions: IReadOnlyDictionary<(folder, field), string>` map, populated by `SchemaLoader.LoadInternal` for *every* field with a `description` in the schema — not just the ones that became a `RefRule`. `GraphExporter` emits a top-level `fieldDescriptions: { "<folder>:<fieldName>": "..." }` block. Schema version unchanged at 6 (additive). The new ctor `SchemaCatalog(rules, fieldDescriptions)` is paired with a one-arg forwarder so existing callers and tests compile unchanged. 79/79 tests pass.

**Site side.** `app.js` merges `graph.fieldDescriptions` into the existing `ruleDescriptions` Map (filling gaps without overwriting — rule and field-description text are typically identical for fields that became rules). `renderFieldsBlock` restructures each row from a flat `<li>` flex-container into `<li class="field-row"><div class="field-line">name + value</div><div class="field-desc">…</div></li>`. The original flex layout moves to `.field-line` so name/value alignment is unchanged.

**Per-folder collapsibility.** A `Hide N descriptions` button next to the Fields header toggles `.descriptions-hidden` on the block; CSS hides `.field-desc` when the class is set. State is keyed by *folder* (not page) in localStorage under `fieldsBlockDescHidden`, so a user who hides descriptions on one `Stat*` page sees them hidden across all `Stat*` pages without losing them on `loot/`. Default is expanded; newcomers don't know to hover, and the user-story acceptance bias for *"render inline, allow collapse"* is explicit.

Verification: navigated to `conditions:StatAtrophy`. The `nDisplaySelf` row now shows the new schema description inline (*"How visible this condition is on the player character… 0 = invisible: the condition is active but never appears in the needs panel, in the mega-tooltip status modules, or in the character inspector's condition pills…"*). Toggle button reads "Hide 2 descriptions" (covers `nDisplaySelf` + `nDisplayOther` on this page). Click flips block to `descriptions-hidden`, descriptions collapse to `offsetHeight: 0`, button reads "Show 2 descriptions"; localStorage persists `["conditions"]`. No console errors.

Builder rerun: 91 rules, 87,845 references, 243 candidates — graph numbers unchanged (descriptions are presentation-side metadata, not edges).

Closes the wiring caveat from slice 2: `conditions:nDisplaySelf` description ships to graph.js and renders inline.

## 2026-05-06 — PLAN-EXPLORER slice 2: nDisplaySelf / nDisplayOther descriptions in conditions Comment Mod overlay

Add `nDisplaySelf` and `nDisplayOther` descriptions to `comment_mod/data/schemas/conditions-schema.json`. Specifically calls out *"0 = invisible: never appears in the needs panel, in the mega-tooltip status modules, or in the character inspector's condition pills"* — the second clause is what [crew-exercise-invisible-need.md](notes/user-stories/crew-exercise-invisible-need.md) requires the description to make explicit. Without it, the lucky-path tester can't connect "F3 console says StatAtrophy is climbing" to "and that's why it never appears in the inspector pills."

Semantics grounded in the decomp rather than the user story's speculative 0/1/2/3 framing:
- `0` — invisible everywhere (no `== 0` matches in `StatusModule` / `GUIChargenCareer` / `CondOwner`'s display passes).
- `1` — visible-secondary; matches the auxiliary list in `StatusModule.cs:115`.
- `2` — visible-primary; matches `list` in `StatusModule.cs:111` and the chargen-trait visibility checks in `GUIChargenCareer.cs:387+`.

`3` and higher show up only as data values without code branches; left out of the description rather than invented.

Builder rerun after the overlay edit: 91 rules (unchanged — the description rides on a non-ref scalar field), 87,845 references. Numbers identical because the description doesn't introduce new edges; it only enriches the schema-inspector view.

**Wiring caveat — descriptions on non-ref fields aren't yet in `graph.js`.** `GraphExporter.WriteGraphFile` only emits `description` for fields that became a `RefRule`. `nDisplaySelf` is integer + no folder mention, so today the description sits in the in-memory `SchemaCatalog` but never reaches the site's `ruleDescriptions` map. Slice 3 (UX 1.3 hover→inline) widens that pipe so all schema descriptions ride along, at which point this slice's content lights up on detail pages.

## 2026-05-06 — PLAN-EXPLORER slice 1: externalize code-side internal prose, add code-* folder mini-glossary

First slice on the `claude-explorer` branch — the cheapest win on PLAN-EXPLORER's list. Five user-facing prose blocks on `code-method` / `code-class` / `code-component` detail pages (and the sidebar heading) read like DEV-LOG entries — *"Synthetic node from PLAN-AST Phase 1"*, *"a Roslyn AST walk over `decomp/Assembly-CSharp/`"*, *"PLAN-AST Phase 2/3"*, etc. Modders aren't the audience for that vocabulary. Rewritten to modder-pov: *"This page lists every reference this method body makes to data you can edit"* / *"a code-component is one entry in the game's command table"* / etc.

Six exact-string swaps in `src/Ostranauts.Site/app.js`:
- Sidebar heading (~line 165): *"Code (PLAN-AST)"* → *"Code"*; tooltip rewritten.
- `renderCodeNodeDetail` blurb (~line 478): rewritten, branches on `code-method` vs `code-class`.
- `renderCodeComponentDetail` blurb (~line 541): rewritten.
- Runtime-ports muted-note (~line 555): drop *"(PLAN-AST Phase 3)"*.
- `renderCodeRefsBlock` muted-note (~line 1038): drop *"(PLAN-AST Phase 1)"*; *"decompiled C#"* → *"the game's C# code"*.
- `renderCodeEmittedHeader` blurb (~line 426): drop *"(PLAN-AST Phase 3)"* / *"Synthesized into the graph by Phase 3.1A"* — replaced with a generic *"the explorer surfaces it here"* clause.

Companion: new `FOLDER_BLURBS` map + `folderBlurb()` helper, surfaced via `renderFolderIndex`. Seeds three entries (`code-method`, `code-class`, `code-component`) so a modder landing on `#/f/code-component` gets an anchor for what the folder *is*. Re-uses the existing `.page-blurb` styling — no CSS changes.

Internal `// PLAN-AST Phase X` JS / C# comments deliberately untouched — those help agents + contributors reading the code, where the phase numbering is still the right vocabulary. The cleanup is strictly user-facing strings.

Verified live: navigated to `code-component:Heater`, `code-method:CrewSim.Awake`, `audioemitters/FFWD` (data-side detail with code-refs block), `#/f/code-method`. All four blurbs read as the new copy; no console errors. Build: copied `app.js` to `build/` for the preview, no Builder rerun needed (presentation-only).

## 2026-05-06 — PLAN-AST Phase 3.1D: refactor runtime-port resolver onto a per-method def-use map

The Phase 3 runtime-port resolver had a scope-bounding hack: when a `dict.TryGetValue("KEY", out X)` defined a local, the trace forward for consumers was bounded to the nearest enclosing `IfStatementSyntax` / `BlockSyntax` to dodge cross-key contamination (GasPump.SetData reuses one `string text` across five TryGetValue calls; only `strInput01` flows into a typing endpoint, the others go through `bool.Parse(text)` etc.). Worked, but a bespoke-per-pattern hack — and didn't compose into multi-hop alias chains.

Phase 3.1D introduces `MethodDefMap` (SSA-lite): a per-method index of every symbol's def in source order. A use of `X` at position `P` resolves to its most recent prior def via `MostRecentDefAt(symbol, P)`. The resolver now walks every consumer of the local in the *whole* method body and asks each one's def chain whether it terminates at our originating call — a reassignment severs the chain naturally, so cross-key contamination falls out without needing any syntactic bounding.

Captured def shapes:
- Method parameter binding (def at body start).
- Variable declarator with initializer (`string text = dict["K"]`).
- Simple assignment (`this.field = X` / `local = X`).
- Out-arg call (`dict.TryGetValue("K", out X)` records a def of X anchored to the inv).

Side benefit (the spec's headline): multi-hop alias chains resolve cleanly. `text = dict["K"]; localY = text; consumer(localY)` would have failed before — the consumer of `localY` was searched for in `text`'s scope only, missing the intermediate alias. With the def map, the recursive `ResolvesToOriginatingDef` walks `localY` → its def at `localY = text` → recurse with `text` → its def at the originating TryGetValue. Match.

What this slice does NOT change:
- `TraceFieldInClass` (cross-method field walks) — stays as-is. Def maps are per-method by definition.
- `ResolveParamInMethod` and `ResolveFieldUsage` — left as forward-walks. They're already simple AST scans; the def map didn't simplify them.
- Phase 2/2.1 dispatcher resolver — uses Pattern A/B/C/D/E directly, no def map.

Numbers unchanged from 3.1C:

```
total objects:    34,558
total references: 87,845  (5,304 lits + 4,519 wires-to + 118 cond-touches + 38 runtime-wires-to)
```

All previously-typed runtime ports (GasPump strInput01, GasPressureSense strSignalCond/strInteractionAlarm/strInteractionClear/strCTClear, Heater strInput01/strCondMonitor01, GasRespire2 strInput01) still type identically. 79/79 tests pass.

Leaves the door open for a future slice (Phase 4-ish) to apply the same def-map machinery cross-method: a per-class field-def map would let `TraceFieldInClass` answer "what assigned this field" rather than just "where is this field used." Not necessary for the current set of components.

## 2026-05-06 — PLAN-AST Phase 3.1C: container-grouping in renderCodeRefsBlock (data-side detail pages)

Phase 1.1 collapsed sibling-literal edges into one labeled block on `code-method` / `code-class` detail pages (the *"`new[] { … }` [lines X–Y]"* groups in `renderCodeOutgoing`). Same treatment now applies on the data-side *Code references (N)* block: when one `code-method` source has multiple incoming edges sharing the same `metadata.containerKey`, they collapse into one `<div class="code-refs-group">` with the container label + line range, with each individual literal hit shown inside.

The change is purely site-side — Phase 1.1 already populates `containerKey` / `containerLabel` / `containerLineStart` / `containerLineEnd` on every literal edge. `renderCodeRefsBlock` now buckets adjacent (line-sorted) edges within each source group by `containerKey` and renders multi-edge buckets via a new `renderCodeRefsBlockGroup` helper. Single-edge buckets fall through to the existing per-occurrence render unchanged.

Common case in the wild: `code-method:CrewSim.Awake` calls `CrewSim.LowerUI(CrewSim.tplCurrentUI != null && tplCurrentUI.Item1 == "FFWD" && tplLastUI != null && tplLastUI.Item1 != "FFWD")` — that one arg-list at line 226 contains two `"FFWD"` literals. On `audioemitters/FFWD`'s detail page the two used to render as adjacent identical `LowerUI(...)` rows; now they collapse under one `<code>LowerUI(…)</code> [line 226]` header.

Build numbers unchanged (presentation-only on top of Phase 1.1's existing edge metadata).

Acceptance smoke:
- `#/o/audioemitters/FFWD` → *Code references* block under *CrewSim.Awake* renders one `<code>LowerUI(…)</code> [line 226]` group with two inner snippets (was: two adjacent `decomp/Assembly-CSharp/CrewSim.cs:226` rows).
- Single-edge sources still render the bare per-edge layout. 79/79 tests pass.

## 2026-05-06 — PLAN-AST Phase 3.1B: helper-class follow-into for Destructable, +2,881 wires-to edges

`Destructable` was the only one of the 14 dispatcher commands whose typed in-ports the resolver couldn't reach. The dispatcher does `destructable.SetData(array)`; `Destructable.SetData` forwards to `DestCheck.SetData(aStrings, this.co)` on a *different* class; that's where the per-index field assignments + cond-method endpoints actually type the args (`aStrings[1]` → `this.strDamageCond` → `co.HasCond(...)`, etc.).

The `CodeComponent` record gains `FollowIntoTypes: IReadOnlyList<string>` — defaulted empty, populated via a one-line allow-list (`["DestCheck"]` for `Destructable`). Pattern D's whole-array forwarding now searches `[implType] ∪ FollowIntoTypes` for the called method, recursing with the helper class as the new `implType` so Pattern E and `ResolveFieldUsage` walk DestCheck's field declarations and usages. Index-discovery extracted into a shared recursive `DiscoverIndices` helper bounded at the same depth as the resolver.

Two adjacent changes the slice required:

1. **Depth limit raised from 1 to 2.** Required for the dispatcher → `Destructable.SetData` → `DestCheck.SetData` chain. Anything deeper still falls through as untyped.
2. **`ResolveFieldUsage` typing-endpoint vocabulary widened.** Phase 2.1 only knew `DataHandler.Get*` + folder. DestCheck's field consumers are `co.HasCond(this.strDamageCond)` / `co.GetCondAmount(...)` / `co.AddCondAmount(this.strDamageCond, …)` — all CondOwner cond-methods, no DataHandler involvement. Extended the resolver to also recognize the `CondOwnerCondMethods` set (→ `conditions/`) and `ship.GetCOByID` (→ `condowners/`) when classifying field-use sites. Sanity-checked GasPump/Heater/Wound/Rotor/Explosion/Electrical/Pledge/GasRespire2 — no regressions; their existing typings are untouched.

Builder-side change: `BridgePhase2`'s typed-arg WiresTo emit now retargets `conditions/` → `conditions_simple/` when the value lives there (mirrors Phase 3.1A's RuntimeWiresTo retarget). Without it, ~1,920 of the new Destructable edges would be dropped because `StatDamage` / `StatDamageMax` declare in `conditions_simple/`.

Numbers:

```
decomp phase 1: 1,299 .cs parsed → 2,002 code-method/class nodes, 5,304 literal edges
decomp phase 2: 14 code-component nodes
                + 4,519 wires-to (was 1,638; +2,881 from Destructable[1/2/3])
                + 118 produces/consumes/observes
                + 38 RuntimeWiresTo edges
total objects:    34,558  (unchanged)
total references: 87,845  (was 84,964; +2,881)
```

Per-position breakdown for Destructable: head (pos=0) 963 + [1] 961 + [2] 955 + [3] 4 + [4] 0 (untyped). Totals 2,883 from Destructable specifically, very close to the upper bound of 963 × 4 = 3,852 (the gap is per-instance values whose strNames don't exist in any folder — e.g. `StatDamageMax` does, but a handful of [3] arg values are placeholders or unique strNames).

Acceptance smoke:
- `#/o/code-component/Destructable` shows 4 typed in-ports: `[1] → conditions`, `[2] → loot`, `[3] → conditions`, `[4] → untyped`. The attribution chain on each reads the full cross-class trace, e.g. `[1] → conditions (.GetCondAmount(this.strDamageCond) ← .strDamageCond=[i] ← DestCheck.SetData(aStrings[]) ← SetData(aStrings[]))`.
- 79/79 tests pass; previously-typed components (GasPump, Heater, Wound, Rotor, Explosion, Electrical, Pledge, GasRespire2, GasPressureSense) all keep their typings.

Note on PLAN-AST 3.1B's framing: the spec said `[2]→interactions`. In practice the Destructable code-side flow types `[2]` to `loot` (the field flows into `DataHandler.GetLoot(...)`). Real condowner data carries names like `ACTAeroParts3x301Destroy` at position 2 — those live in `loot/`, not `interactions/`. Implementation tracks the actual code, not the spec's misremembering.

## 2026-05-06 — PLAN-AST Phase 3.1A: resolve dangling RuntimeWiresTo targets, synthesize code-emitted condition nodes when truly missing

The 17 dangling `RuntimeWiresTo` edges Phase 3 left behind ("`guipropmaps:AlarmPressureCO2 → conditions:IsReadyPressureSense`" and friends) all landed on a "No object known" placeholder when clicked. Phase 3.1A closes that hop. Two branches in `BridgePhase2`'s emit loop: when the runtime-port resolver typed an edge to `conditions/` and the name isn't there, (a) retarget to `conditions_simple/` if found there, otherwise (b) synthesize a new `DataObject` in `conditions/` with `Fields = { kind: "code-emitted", producedBy: "<component>" }` so the modder lands on a populated detail page.

In the current real-data run **all 17** originally-dangling targets land in `conditions_simple/` (they're declared as 7-tuples in `conditions_simple.json` even though the code-side AddCondAmount is what actually drives them at runtime). So the retarget branch handles all of them and the synthesis branch fires zero times. The synthesis branch remains for future genuinely code-only conditions (e.g. if a future `aUpdateCommands` component emits a name that's not in either folder).

Site-side: `renderObjectDetail` checks `props.kind === 'code-emitted'` and inserts a `renderCodeEmittedHeader(folder, strName, props)` blurb explaining "this isn't in `data/conditions/` — it's set by `code-component:<X>` via a dynamic `co.AddCondAmount(this.<key>, …)` call". When the page is a retargeted `conditions_simple/` entry the standard layout renders unchanged — the *Referenced by* block already shows the 7 incoming `RuntimeWiresTo` edges, each tagged with the source guipropmap and the port key in `metadata`.

Numbers:

```
total objects:    34,558  (unchanged — 0 synthesized; 17 retargeted edges instead)
total references: 84,964  (unchanged — same edge count, different target folder)
dangling RuntimeWiresTo edges: 0  (was: 17)
```

PLAN-AST Phase 3.1's framing assumed +17 synthesized condition nodes. Reality: those names already exist as `conditions_simple/` entries; retargeting to where the data lives is the more accurate fix. The synthesis path stays in place for future use.

Acceptance smoke:
- `#/o/guipropmaps/AlarmPressureCO2` → click "IsReadyPressureSense" → lands on `#/o/conditions_simple/IsReadyPressureSense` (populated, *Referenced by 7*).
- All `RuntimeWiresTo` edges resolve to known graph nodes (verified by walking `GRAPH_DATA.edges` in the live page).

All 79 tests still pass.

## 2026-05-06 — PLAN-AST Phase 3: runtime ports + RuntimeWiresTo edges from guipropmaps to code-emitted destinations

Phase 2 made `aUpdateCommands` legible — modders can see how a condowner wires to a code-component and what its positional args type to. Phase 3 closes the other half of the loop: what the code-component *reads at runtime* from its guipropmap dictionary, and where those values point. The high-impact deliverable: `IsReadyPressureSense`, `IsReadyPumpAir`, `IsReadyHeat` — code-emitted conditions that don't exist in `data/conditions/` and previously appeared nowhere in the graph — now show up as dashed edges from the 17 guipropmap entries that name them.

Pieces:

- **`ComponentIndexer.ScanComponentClassForRuntimePorts`** — new. For each impl type, scan for `dict.TryGetValue("KEY", out X)` and `dict["KEY"]` reads, filter to guipropmap-shaped receivers (allow-list: `dictionary`/`gpm`/`*propmap*`/`*mapgpm*`; rejects `mapGUIPropMaps`, `mapInfo`, `mapGasMols`), and trace each value's destination through three flow patterns:
  - **`out this.field`** → walk impl-type for `someConsumer(this.field)` callsites.
  - **`out var local`** / pre-declared local — walk forward inside the *enclosing if-statement / block only* (bounding scope is critical: GasPump.SetData reuses the same `string text` local across 5 TryGetValue calls; only `strInput01` flows into `GetCOByID(text)`, the rest go to `bool.Parse` / `int.Parse` and stay untyped).
  - **`this.field = dict["KEY"]`** + later `someConsumer(this.field)` elsewhere in the type.
- **Three new typing endpoints** on top of Phase 2's `DataHandler.Get*` map: `co.HasCond` / `AddCondAmount` / etc. → `conditions/`, `ship.GetCOByID` → `condowners/`.
- **`RefKind.RuntimeWiresTo`** — `guipropmaps/` → resolved data target; `metadata = { portKey, component, playerWired }`. Builder walks every guipropmap's `dictGUIPropMap` flat key/value array and emits one edge per (key, non-empty value) where the consuming component has a typed runtime port for that key.
- **No existence check on RuntimeWiresTo targets** — that's the whole point. Code-emitted conditions (`IsReadyPressureSense` set by GasPressureSense at runtime, `IsReadyPumpAir` set by GasPump, `IsReadyHeat` set by Heater) wouldn't otherwise appear anywhere in the graph; surfacing them as dangling edges is the visibility deliverable PLAN-AST framed in its motivation.
- **Site** — `code-component` detail page gains a *Runtime ports* block; `RuntimeWiresTo` edges render with a dashed left-border on the row so a modder visually distinguishes "runtime config" from "static design-time wiring."

Numbers:

```
decomp phase 1: 1,299 .cs parsed → 2,002 code-method/class nodes, 5,304 literal edges
decomp phase 2: 14 code-component nodes
                + 1,638 wires-to (head + typed positional args)
                + 118 produces/consumes/observes
                + 38 RuntimeWiresTo edges (Phase 3)
total objects:    34,558
total references: 84,964   (+309 from Phase 2 baseline; 271 from Phase 2.1, 38 from Phase 3)
```

Per-component runtime port summary (10 typed ports across 6 components, 30 untyped that still surface as visible slots):

```
GasPressureSense   strSignalCond → conditions     [.HasCond]
                   strInteractionAlarm → interactions
                   strInteractionClear → interactions
                   strCTClear → condtrigs
GasPump            strInput01 → condowners        [.GetCOByID]  player-wired
GasRespire2        strInput01 → condowners        [.GetCOByID]  player-wired
Heater             strInput01 → condowners        [.GetCOByID]  player-wired
                   strCondMonitor01 → conditions  [.HasCond]
```

The 17 dangling RuntimeWiresTo targets are the load-bearing visibility win:

```
17 dangling edges to code-emitted conditions:
  guipropmaps:AlarmPressureCO2     → conditions:IsReadyPressureSense
  guipropmaps:AlarmPressureN2      → conditions:IsReadyPressureSense
  guipropmaps:AlarmPressureO2      → conditions:IsReadyPressureSense
  ... 4 more "AlarmPressure*" entries
  guipropmaps:AirPump              → conditions:IsReadyPumpAir
  guipropmaps:AtmoScrubber02       → conditions:IsReadyPumpAir
  guipropmaps:Heater               → conditions:DcGasTemp01    (in data/conditions/)
  guipropmaps:Cooler               → conditions:DcGasTemp03    (in data/conditions/)
  guipropmaps:AtmoScrubber         → conditions:IsReadyHeat
  ... etc.
```

Acceptance smoke:
- `#/o/code-component/Heater` shows a *Runtime ports (4)* block with `strInput01 → condowners (player-wired)`, `strCondMonitor01 → conditions`, `strAddPoint → untyped`, `strSubPoint → untyped`.
- `#/o/guipropmaps/AlarmPressureCO2` shows 4 dashed runtime edges in *References out*: `→ conditions:IsReadyPressureSense [strSignalCond]` (dangling — code-emitted!), `→ interactions:MSAlarmCO2SwitchRedAllow [strInteractionAlarm]`, `→ interactions:MSAlarmCO2SwitchGreenAllow [strInteractionClear]`, `→ condtrigs:TIsGasPressureSafeCO2 [strCTClear]`.

PLAN-AST's "use the SemanticModel" framing for Phase 3 turned out unnecessary again — pure AST + the same depth-1 follow-into Phase 2 used was sufficient. The complexity table in PLAN-AST.md is updated.

All 79 tests still pass.

## 2026-05-05 — PLAN-AST Phase 2.1: depth-1 follow-into for `aUpdateCommands` typed in-ports + Phase 3 plan refresh

Phase 2 left 9 of 14 dispatcher commands with no typed in-ports because the `array[i]` flow went through `comp.SetData(...)` instead of straight into `DataHandler.GetX`. This slice extends the resolver to handle that hop, plus four other shapes that showed up once I read the components more carefully.

`ComponentIndexer` now applies five resolution patterns in order to each `array[i]` access in a dispatcher branch:

| Pattern | Shape | Component |
|---|---|---|
| **A** — direct | `DataHandler.GetX(array[i])` | already handled in Phase 2 |
| **B / C** — pass-through method call | `comp.M(array[i])` or `comp.M(arg0, array[i], …)` — follow into M, look for `DataHandler.GetX(paramName)` (also handles `paramName` stored to `this.field` then read elsewhere) | `Heater`, `Wound`, `Rotor` |
| **D** — whole-array forwarding | `comp.M(array)` — recurse into M's body using its parameter as the new "array" variable; chains B/C/E from there | `Electrical` (two-hop: `SetData(strings)` → `strings[1] = this.strGPMKey` → `GetGUIPropMap(this.strGPMKey)`) |
| **E** — direct field assignment | `comp.field = array[i]`, then look for `DataHandler.GetX(this.field)` elsewhere in the impl type | `Explosion` (`explosion.strType = array[1]` + `GetExplosion(this.strType)`) |

Net result: 5 components newly typed (`Heater[1] → condtrigs`, `Wound[1] → wounds`, `Rotor[1] → condowners`, `Explosion[1] → explosions`, `Electrical[1] → guipropmaps`). 271 new `WiresTo` edges (1,367 → 1,638). 84,655 → 84,926 total references. Source-attribution strings on the port chain are visible to modders — e.g. Electrical's UI now reads `[1] → guipropmaps (DataHandler.GetGUIPropMap(this.strGPMKey) ← .strGPMKey=[i] ← SetData(strings[]))`, showing the full three-hop trace.

Implementation notes:
- Recursion bounded at depth 1; anything deeper falls through as untyped (still recorded so the modder knows the slot is consumed).
- Index-discovery pass also walks into `comp.M(array)` callees so we can resolve indices that only appear inside the receiving method's body. Without this, Electrical's branch — which never indexes `array` directly at the dispatcher level — would have stayed un-typed.
- `KnownGetters` extended with `GetCondOwner → condowners` for Rotor.
- `Destructable` remains untyped: it forwards to `DestCheck.SetData` on a different class. A per-component allowlist of follow-through types would unblock it; deferred since the head wires-to-component edge is the load-bearing piece for the modder.
- The full Roslyn `SemanticModel` rung remained unnecessary — pure AST + the static getter table covered everything.

Phase 3 plan refresh (also landed in this commit, [PLAN-AST.md](PLAN-AST.md)) — once I had the AST patterns nailed and read the actual components that consume `strInput01` (Heater, GasPump, GUIAirPump, GUIMeter, GUIToggle4x*), several Phase-3-as-originally-drafted assumptions turned out wrong:

- **There is no `panels/` folder.** Runtime wiring lives inside `guipropmaps/`'s `dictGUIPropMap` flat key/value array. Cross-side join is `code-component` ↔ `guipropmaps` keys.
- **`strInput01` values are CO instance ids set at runtime, not strNames.** Most static defaults are empty; the binding is fully player-side. Phase 3's value-add is making the *port* visible plus surfacing whatever static defaults exist — not "matching strNames."
- **Same complexity rung as Phase 2** (AST + depth-1 follow-into), not the `SemanticModel`-tier I'd originally framed. Reuse `ResolveFieldUsage` for the `dict["strInput01"] → field → GetCOByID(field)` chain.

The refresh adds a new edge `kind` (`RuntimeWiresTo`, dashed in the UI) and a `runtimeInPorts[]` array on `code-component` properties. Updated the complexity table to put Phase 3 on the AST tier.

All 79 existing tests still pass.

## 2026-05-05 — PLAN-AST Phase 1.1: structural-parent grouping + UI polish on code-side detail pages

Three small but visible improvements layered on top of Phase 1+2's data, no schema bump:

- **Sibling literals collapse into one labeled block.** Reading `code-class:CondOwner` used to render four separate rows for the four entries of a `new[] { "DropItem", "DropItemStack", "PickupItem", "PickupItemStack" }` array literal. Each row repeated the same arrow / file:line / source-line snippet. The indexer was AST-aware enough to find each literal, but threw away the syntactic parent. Now `DecompIndexer.FindContainer` walks up to the nearest `InitializerExpressionSyntax` or `ArgumentListSyntax`, generates a stable `ContainerKey` (`<NodeType>@<SpanStart>`), a human label (`aFoo[]` from a named field, `new[] { … }` for inline arrays, `MethodName(…)` for arg lists), and the line range. Builder threads these onto the edge `Metadata`. Site `renderCodeOutgoing` buckets adjacent edges sharing a `containerKey` and renders one labeled `.code-out-group` block instead of N look-alike rows. Single-literal containers and standalone literals fall through to the existing per-row render unchanged. Method bodies usually don't group (each `co.HasCond("X")` call is its own one-arg `ArgumentList`); only true sibling-literal cases (array initializers, multi-string-arg calls) collapse.

- **`code-method` headings show `()` so methods read as callable.** `BodyTemp.Exposure` looked like a field access; it's now `BodyTemp.Exposure()` in the detail header, search results, folder index, and the Code-references block on data-side pages. The graph id / strName stays bare so overload-suffix disambiguation (`#2`, `#3`) and search-by-typing keep working — `formatCodeName(folder, strName)` is purely a render-time transform.

- **Code lines come through trimmed.** The indexer stored `TrimEnd()` lines, leaving leading tabs in the `<pre>` block; switched to `Trim()` at extract time and added a defensive `.trim()` in the renderers so older data still reads cleanly.

- **Sidebar gains a `Code (PLAN-AST)` subsection.** I'd filtered code-* folders out of the sidebar entirely on the previous slice; that hid them from anyone who didn't already know the URL convention. Now they appear at the bottom under a non-clickable `Code (PLAN-AST)` divider, ordered `code-component (14)` → `code-class (60)` → `code-method (1942)` so the small + structurally-meaningful set is on top.

Build numbers unchanged (still 34,558 objects / 84,655 references / v6 schema) — these are presentation layers on top of Phase 1+2's data, plus the indexer's metadata extension.

Acceptance smoke: `#/o/code-class/CondOwner` now renders one block `new[] { … } [lines 10089–10094]` listing all four interactions, instead of four separate rows. `#/o/code-method/BodyTemp.Exposure` heading reads `BodyTemp.Exposure()` and code-line snippets have their leading tabs stripped.

## 2026-05-04 — PLAN-AST Phase 2: code-component nodes + aUpdateCommands wiring + condition role classification

Followup slice on top of Phase 1, shipped same day. Phase 1 made *every* method/class with literal strings a graph node. Phase 2 picks out the structurally-meaningful ones — the entries in `CondOwner.AddCommand`'s dispatcher, which are what `condowners.aUpdateCommands` strings actually invoke at runtime — and surfaces them as their own kind: `code-component`. A condowner now has a navigable path *through code* to the conditions it produces, instead of just "this strName appears as a quoted literal somewhere."

What Phase 2 recovers per dispatcher branch:

- **Command name** (the `array[0] == "X"` literal) → becomes the synthetic `code-component:<X>` node's strName.
- **Implementing C# class** (`AddComponent<T>()`) → e.g. `GasPump`, `GasPressureSense`, `Heater`. Used as the file-pointer on the node and as the scan target for cond-touch edges.
- **Min arity** (`if (array.Length < N) return;`).
- **Typed in-ports**: every `array[i]` whose immediately-enclosing call is `DataHandler.GetXxx(array[i])` resolves to the data folder for that getter via a static `KnownGetters` map. Other positions become untyped ports (still recorded so the modder knows the slot is consumed).
- **Cond-touches**: scan the implementing class's methods for invocations of `AddCond` / `AddCondAmount` / `RemoveCond` / `RemCond` / `ZeroCondAmount` / `HasCond` / `GetCondAmount` with a literal first arg. Each becomes a `produces` / `consumes` / `observes`-classified edge to `conditions/<name>` (only when that condition actually exists; dynamic-name calls like `co.AddCondAmount(this.strSignalCond, ...)` are silently skipped).

Builder-side bridging emits two new edge families:

- **`WiresTo` (1,367 edges)** — one per `condowners.aUpdateCommands` entry, with both a head edge to the matching `code-component` and per-typed-arg edges to resolved data folders. So a condowner with `"GasPump,AirPump02,Panel A"` lights up `code-component:GasPump`, `gasrespires:AirPump02`, and three positional metadata blobs.
- **`ProducesCondition` / `ConsumesCondition` / `ObservesCondition` (118 edges)** — `code-component → conditions/`, role-classified per the verb so a condition's "Referenced by" page can rank "actively maintained" producers above "merely consulted" observers.

Pieces:

- **`src/Ostranauts.Decomp/ComponentIndexer.cs`** — new. Locates `CondOwner.AddCommand`, walks each `array[0] == "X"` branch with the analysis above. The full Roslyn `SemanticModel` rung wasn't needed in practice — the dispatcher's syntactic shape plus a one-time static `KnownGetters` table sourced from `DataHandler.cs` covers what PLAN-AST framed as a binding/CFG problem. If a future dispatcher gets harder, promoting to `SemanticModel` is a localized change.
- **`DecompIndexer` refactor** — added `ParseTrees` and an `Index(ParsedDecompTreeSet)` overload so Phase 1 and Phase 2 share parse work. Each `.cs` file in `decomp/` is parsed exactly once.
- **`Reference.cs`** — added `WiresTo`, `ProducesCondition`, `ConsumesCondition`, `ObservesCondition` (still v6 schema, additive).
- **`GraphExporter.WritePropertiesFile`** — opt-in array/object serialization for `code-*` folders so `inPorts[]` and `produces[]` reach `properties.js`. Data-side nodes still skip arrays/objects (those are graph edges, not viewable scalars).
- **`Program.cs`** — split the bridge step into `BridgePhase1` and `BridgePhase2`. The Phase 2 bridge walks every condowner's `aUpdateCommands` and emits the wires-to + typed-arg edges; both bridges share the data-side `existenceSet` / `foldersByName` indexes built earlier in main.
- **Site (`app.js`, `style.css`)** — new `renderCodeComponentDetail` shows in-ports (with typed/untyped split + the `DataHandler.Get*` source string), conditions touched (grouped by produces/consumes/observes), and the wired-by condowner listing. `renderMetadata` now inlines `pos=N` for `WiresTo` edges and the verb name for cond-edges so the data-side `Referenced by` block reads cleanly.

Numbers from the current real-data run:

```
decomp phase 1: parsed 1,299 files (0 skipped), 2,002 code nodes, 5,304 resolved literal edges
decomp phase 2: 14 code-component nodes, 1,367 wires-to + 118 produces/consumes/observes edges

graph.js:      ~26.5 MB (Phase 2 added ~1,500 edges; ~1% increase)
properties.js: ~10.3 MB (now carries inPorts/produces arrays for code-component nodes)
total objects:    34,558  (+14 from v1.5)
total references: 84,655  (+1,485 from v1.5)
```

Acceptance smoke against the site:
- `#/o/code-component/GasPump` renders with 2 in-ports (`[1] → gasrespires (DataHandler.GetGasRespire)`, `[2] → untyped`), 23 conditions touched (4 produces + 1 consumes + 18 observes), and 4 wired-by condowners with their raw aUpdateCommands strings.
- `#/o/condowners/ItmAirPump02OnG` shows an `aUpdateCommands · 4` group in References out, with both head edges to `code-component:GasPump` (`pos=0`) and the typed-arg edge to `gasrespires:AirPump02` (`pos=1`).
- `#/o/conditions/IsOverrideOn` shows `Referenced by (17)` with verb-grouped sub-blocks (`AddCondAmount · 7`, `GetCondAmount · 3`, `HasCond · 6`, `ZeroCondAmount · 1`), each row tagged with the source `code-component:<X>` and the verb in metadata.

All 79 existing tests still pass.

Phase 3 (runtime-wired `strInput01` ports — alarm → pump panel wiring rendered as dashed edges) remains on the plan.

## 2026-05-04 — PLAN-AST Phase 1: Roslyn-AST decomp indexer + first-class code-side graph nodes

First slice of [PLAN-AST.md](PLAN-AST.md) shipped. The regex pipeline in `utils/python/emit_code_refs.py` answered "where does this strName appear in a quoted literal in decomp?"; this lifts the same question one rung up the Chomsky hierarchy — Roslyn parses each `decomp/Assembly-CSharp/*.cs` file, walks `MethodDeclarationSyntax`/`ConstructorDeclarationSyntax`/`OperatorDeclarationSyntax`/`DestructorDeclarationSyntax` bodies and class-level `FieldDeclarationSyntax`/`PropertyDeclarationSyntax`/`EventFieldDeclarationSyntax` initializers, and emits one synthetic graph node per literal-bearing method/class plus one edge per identifier-shaped string literal.

Pieces:

- **`src/Ostranauts.Decomp/`** (new project, `net8.0`, references `Microsoft.CodeAnalysis.CSharp` 4.11). Self-contained `DecompIndexer.Index(decompRoot, repoRoot, onWarning)` returning raw `CodeNode[]` + `CodeLiteralEdge[]`. Roslyn lives here and never crosses into `Ostranauts.DataModel` (which stays `netstandard2.1` for future BepInEx loadability). 1,299 decomp files parse in a few seconds with zero failures on the current tree.
- **Builder bridge** — `Program.cs` wires the indexer behind a `--decomp <dir>` flag (default: auto-detect `decomp/Assembly-CSharp/`; `--no-decomp` opts out). Each `CodeNode` becomes a synthetic `DataObject` with folder `code-method` or `code-class` (kebab-case so `${folder}:${strName}` IDs split cleanly on the site's first-colon convention). Each `CodeLiteralEdge` whose value matches a known data strName becomes one `Reference` per matching folder — so multi-folder names like `Itm*` surface in every applicable folder, matching the "(also: ...)" pattern.
- **`Reference.cs`** — added `RefKind.LiteralInMethod` / `RefKind.LiteralInClass`. Metadata = `{ line, text }`. `SourceField` is `"body"` or `"initializer"`.
- **`GraphExporter.cs`** — `$schema_version` bumped to 6 (was 5). Code-node extras (`qualifiedName`, `lineStart`, `lineEnd`) ride through the existing `properties.js` pipeline because `BuildCodeDataObject` packs them into the `Fields` JsonElement.
- **Site** (`app.js`, `style.css`) — `SCHEMA_VERSION = 6`, `code-` folders filtered out of the sidebar, `nameToFolders` (the `(also: ...)` index) and the health/data orphans+cross-dups tallies. New `renderCodeNodeDetail` for `code-*` nodes shows the file:line range and lists outgoing literal edges in source order with the trimmed source line. `renderCodeRefsBlock` rewritten to source from incoming `LiteralIn{Method,Class}` edges, grouped by source code node; legacy `window.CODE_REFS` retained as a fallback only.
- **Tests** — all 79 existing tests still pass; no new tests for the indexer yet (Phase 1 acceptance is the live build numbers, the UI smoke, and not breaking any existing assertion).

Numbers from the current real-data run:

```
1,299 .cs files parsed (0 skipped)
2,002 code nodes (1,942 code-method + 60 code-class)
5,304 resolved literal edges (5,208 LiteralInMethod + 96 LiteralInClass)

graph.js:      26 MB (was ~23 MB; +3 MB)
properties.js: 9.9 MB
```

Acceptance smoke against the site (loaded over `python -m http.server`):
- `#/o/code-method/GasPump.Pump` renders a code-side detail page with 11 outgoing literals (e.g. line 187 `bool flag3 = this.co.HasCond("IsOverrideOn");`).
- `#/o/conditions/StatPower` shows a *Code references (58)* block with 58 method/class sources, each with file:line and the trimmed source line.
- Folder sidebar correctly excludes `code-method` / `code-class`. Search picks up qualified names (`GasPump.` returns four code-methods).

Phase 2 (`SemanticModel`-driven `aUpdateCommands` resolution + `code-component` ports) and Phase 3 (runtime-wired `strInput01` ports) remain on the plan.

## 2026-05-04 — User-stories renderer: output to source folder so file:// preview works

Reported by direct preview: clicking the new *User Stories* tab card from `src/Ostranauts.Site/index.html` (file:// URL, no build run) hit a 404 because the rendered HTML lived only in `build/user-stories/` and the source folder didn't have it. The previous flow rendered to `build/user-stories/` (and `build-public/user-stories/`), so source-folder preview broke even though the built site worked.

Refactored to single source of truth:

- Added a `user-stories` Makefile target that renders into `$(SITE_SRC)/user-stories/` (i.e. `src/Ostranauts.Site/user-stories/`).
- The `site` and `site-public` targets depend on `user-stories` and the existing `cp -r $(SITE_SRC)/. $(BUILD_DIR)/` step picks the rendered HTML up automatically. Removed the per-target render invocations in `site` and `site-public`.
- `.gitignore` excludes `/src/Ostranauts.Site/user-stories/` so the rendered artifacts don't get tracked. Comment in the gitignore explains the rationale.
- Renderer's default `--out` updated to match (`src/Ostranauts.Site/user-stories/`); docstring rewritten to explain the source-folder layout.

Net effect: clicking *User Stories* from the cover page works whether you're previewing `src/Ostranauts.Site/index.html`, `build/index.html`, or the GitHub Pages bundle. Same rendered files in all three places.

Known follow-up: cross-repo `.md` links inside story bodies (e.g. `[PLAN-AST.md](../../PLAN-AST.md)`) resolve from `build/user-stories/` (relative depth 1 from repo root) but not from `src/Ostranauts.Site/user-stories/` (depth 2). Fix would be rewriting cross-repo `.md` targets to GitHub blob URLs in the link rewriter — punted pending decision.

## 2026-05-04 — Three AST-bound user stories + on-site rendered user-story library

Filled out the three forward-looking user stories that the prior planning split flagged as "would end up in PLAN-AST," and stood up a build path that renders every `notes/user-stories/*.md` file as a styled HTML page on the site.

New user stories (acceptance specs for PLAN-AST phases, not current-explorer traversals):

- `rewire-co2-alarm-to-remote-pump.md` — Phase 3. The alarm→pump connection is established at runtime via `strInput01` panel wiring; modder needs the explorer to render the runtime-wired in-port as a dashed edge with an explainer banner.
- `trace-engine-emitted-condition.md` — Phase 2. `DcGasPpO2` and similar engine-emitted conditions get populated detail pages with `code:component` producers, gate-expression snippets, and a "data-side overrides" status section.
- `debug-broken-aupdatecommands-line.md` — Phase 2. `aUpdateCommands` entries render as structured positional arguments resolved against their target folders, with red ✗ markers + did-you-mean suggestions on resolution failure.

Each story follows the existing format (story → solution path → "what the site needs to support this" → acceptance criterion). PLAN.md routing table updated to include all three under the AST group.

Renderer + build wiring:

- `utils/python/render_user_stories.py` — stdlib-only Markdown→HTML for the subset our user-story files actually use (headers, paragraphs, fenced code, inline code, bold/italic, links, blockquotes, lists, HRs, GFM-style tables). Sibling `.md` links rewritten to `.html`. Each rendered page wraps in a template that reuses `style.css` tokens for the dark theme. An index page groups stories by routing tag (EXPLORER / EXPLORER + AST partial / AST / DANGLING) using a hardcoded mapping that mirrors PLAN.md.
- `Makefile` `site` and `site-public` targets both invoke the renderer (output to `$(BUILD_DIR)/user-stories/` and `$(PUBLIC_BUILD_DIR)/user-stories/` respectively). The renderer is conditional on `notes/user-stories/` existing so the build doesn't break if it's missing.
- `src/Ostranauts.Site/index.html` gains a sixth tab card — *User Stories* — linking to the rendered library.

Four-factor check (per CLAUDE.md, since this surface ships in `build-public/`): the user stories are our own writing about hypothetical modder workflows; no in-game prose, NPC dialog, or substantial data dumps; the few `decomp:*.cs:NN` placeholder citations are line-number references, not reproduced source. Clears all four factors.

Smoke-tested: rendered 11 stories + index, link rewriting verified, inline backticks in titles render as `<code>` spans, the Tabs section on the cover page now lists User Stories alongside Explorer/Schemas/Coverage/Data Health/LLM Candidates.

## 2026-05-04 — Audit pass: fix stale `scrap_scripts/python/<NN>_*.py` references after the promotion commit

Eight scripts were promoted from `scrap_scripts/python/` to `utils/python/` (with their `<NN>_` prefix dropped) in commit `bbcb9cf`, but several call-sites still pointed at the old paths. Found via a `scrap_scripts/python/[0-9]+_` grep across the tree.

Fixed:

- `src/Ostranauts.Site/app.js:59` — the runtime "code_refs.js not loaded — Run … to generate it" console-info message pointed at `scrap_scripts/python/10_emit_code_refs.py`. Now points at `utils/python/emit_code_refs.py`.
- `src/Ostranauts.DataModel/SchemaCatalog.cs:48` — XML-doc comment on the `IsGhost` rule referenced `scrap_scripts/python/07_decomp_schema_table.py`. Now `utils/python/decomp_schema_table.py`.
- Eight promoted scripts' own docstring Usage sections (`decomp_extract_verifiables`, `decomp_schema_crosscheck`, `decomp_schema_table`, `decomp_string_search`, `emit_code_refs`, `wiki_cache`, `wiki_crawl`, `wiki_extract_schemas`).
- `utils/python/wiki_extract_schemas.py:416` — the line that *generates* the `comment_mod/wiki_review_queue.md` header. Both the generator and the current generated output (`comment_mod/wiki_review_queue.md:3`) corrected so future regenerations stay clean.
- `PLAN-AST.md` *Build wiring* — the *"stale path in app.js:59"* commentary was now itself stale (the path was just fixed). Rewritten to clarify that the runtime message was corrected separately; the Makefile wiring (the actual Phase 1 deliverable) is still missing.

Deliberately not touched:

- `DEV-LOG.md` historical entries about the promotion event itself.
- `prose-extraction/Modding__CondOwners-opus.md` — provenance documentation that records what scripts were used at extraction time. The script in question (`05_condowners_keys.py`) was one of the two kept in scrap per the prior audit, so the ref is still accurate at the time it was written.
- The convention/policy refs in `.gitignore`, `CLAUDE.md`, `PROJECT-PITCH.md`, `README.md`, `utils/README.md` — these define the `utils/` ↔ `scrap_scripts/` split.

## 2026-05-04 — Split PLAN.md into EXPLORER + AST axes; add code-side roadmap

Two planning axes had been bleeding into one file. Split them:

- `PLAN.md` → `PLAN-EXPLORER.md` via `git mv` (history preserved). Header rewritten to scope it to the modder-facing JSON browser axis (schema overlay coverage, site UX, content/wiki extraction). Self-reference at the v2 stretch section now reads "this file" instead of the moved name.
- New `PLAN-AST.md` lays out the code-side graph extension: replace the regex-based `code_refs.js` pipeline with a Roslyn AST + semantic-model extractor, promoting decomp classes/methods/components to first-class graph nodes with typed in/out ports. Four phases mapped to complexity-class rungs (AST / SemanticModel / runtime-wired / hierarchy). Phase 2 recovers `aUpdateCommands` config-key resolution, code-emitted condition producers (e.g. `IsReadyPumpAir` set by `GasPressureSense.Run`), and runtime-wired panel ports as graph edges instead of prose-in-schema-descriptions. The current Makefile regression that stops `code_refs.js` from being generated on local builds (`Makefile:29` doesn't invoke `utils/python/emit_code_refs.py`; only `site-public` writes a stub at line 55) is folded into Phase 1's deliverable.
- New `PLAN.md` is a top-level routing brief — no work items, just (1) one paragraph each on the two plans, (2) a routing table for the eight files in `notes/user-stories/`, and (3) a *Dangling* section. Six stories carry on EXPLORER; `crew-exercise-invisible-need` is EXPLORER-primary with an AST-Phase-2 partial; `explore-needs-loop` is fully dangling because it's the only designer-exploration story and neither plan has UX affordances for *"why does this stat behave this way"* diagnostic framing.

Triggering context: an earlier in-session attempt to follow the pressure-sensor → pump → pressure-restore chain through the data ended up patching the symptom (one large prose description on `aUpdateCommands` in `comment_mod/data/schemas/condowners-schema.json`, plus a from-scratch `gasrespires-schema.json`, plus two overlay-data shims for code-emitted conditions in a new `comment_mod/data/conditions/conditions.json`). That diff was reverted in this same commit — the structural fix lives in PLAN-AST instead. CLAUDE.md churn from the same session also reverted; the existing inline-Python rule was already sufficient.

## 2026-05-03 — Reframe needs-suppression handoff around `addcond`, demote chargen-trait to optional

The handoff previously led with "register a selectable trait at character creation" and treated `addcond IsNeedsReduced` as a fallback for existing saves. Empirically, the chargen-trait path conflicts with at least one other mod that touches the same global "Trait Scores,1" bucket (FreeTraits in particular ships a full replacement of the base list with score-zeroed entries; load-order interactions are unpredictable). Reframed the handoff to recommend the `addcond` path as primary, with the traitscores file marked as optional and gated behind a `.callout warn` block that names the conflict and the chargen-UI gotchas.

Also corrected an interpretation error introduced in the prior commit: I had said the format was `TraitName,score,ageCost` and that "ageCost must be ≥1." Re-reading `GUIChargenTraits.cs:81` (sums `Value[0]` as the year cost) and `:146` (filters on `Value[1] != 0`) shows the format is actually `TraitName,ageCost,visibilityFlag` — first number is the displayed year cost (signed), second is a visibility flag that gates whether the trait shows in chargen at all. `0,1` is a valid "free, 0 year" entry, contrary to what I'd documented. The user-story Files-table entry was updated to match.

Section 7 promoted from "applying it to a save you've already started" to "applying the trait — the recommended way." Subtitle, section 1 framing, model diagram, troubleshooting, and TOC entry all aligned to the new voice.

## 2026-05-03 — Fix traitscores `ageCost=0` filter in needs-suppression handoff and user story

The handoff and user story documented `0,0` as "free pick, no in-game age cost" for traitscores entries. Empirically false: a trait registered as `0,0` does not appear in character creation. Confirmed by `decomp/Assembly-CSharp/GUIChargenTraits.cs:146` (the chargen UI's `DrawShelves` skips entries where `keyValuePair.Value[1] != 0` is false) and `:58` (the score-budget calculator applies the same filter). The second number is the **age cost**, and `0` makes the trait invisible to chargen. The FreeTraits mod uses `0,1` for everything ("free in score budget, 1 year mandatory cost") which is the cheapest visible option.

Updated the handoff's example to `IsNeedsReduced,0,1`, rewrote the explanation to call out the filter, and appended the cause to the "Trait doesn't appear" troubleshooting bullet. Updated the user story's Files-table entry to match. Cited `GUIChargenTraits.cs:146`/`:58` inline so future readers can verify.

Earlier confusion (mid-session) about whether the mod's traitscores entry replaces core's: it does not. `dictTraitsTemp` is local to each `LoadMod(strFolderPath, ...)` invocation, so each mod's traitscores file is parsed in isolation and its entries get added to the global `DataHandler.dictTraitScores` keyed by **trait name** (not by the outer "Trait Scores,1" name). Additive merge at the trait-name level. The outer entry's strName collision doesn't matter.

## 2026-05-03 — Fix loading_order.json location in needs-suppression handoff and user story

The handoff (`notes/handoff/needs-suppression-mod-guide.html`) and the user story (`notes/user-stories/mod-suppress-needs.md`) both documented `loading_order.json` as living at `Ostranauts_Data/loading_order.json` (one level above `Mods/`). Direct evidence from a current install showed the actual location is `Ostranauts_Data/Mods/loading_order.json` — inside the `Mods/` folder, alongside individual mod folders. The wiki ([Modding/Data Modding § loading_order.json](https://ostranauts.wiki.gg/wiki/Modding/Data_Modding#loading_order.json)) still documents the older location; the game has since moved it. Five spots in the handoff updated (file tree, filebar header, location explanation, mod summary, troubleshooting); the user story Files-table entry updated. Both updates note the wiki discrepancy explicitly so future readers don't trip on it. The troubleshooting section also tells migrating modders to move any stale `Ostranauts_Data/loading_order.json` they have from following pre-update wiki instructions.

## 2026-05-03 — Paraphrase Discord conversation in mod-suppress-needs user story

The "## The conversation that drove this" section in `notes/user-stories/mod-suppress-needs.md` previously transcribed three Discord messages verbatim, including one identifying name. Replaced with a paraphrased summary that preserves the substance — modder asked about feasibility of a needs-suppressing player trait before committing to learning the mod system, was told prior art existed via tick-effect modifications, flagged intimidation about zero baseline knowledge as the actual blocker. Names dropped; the load-bearing intimidation detail preserved.

## 2026-05-03 — README reconciliation: Limitations section + stale-claim fixups

Stale parts of the README pruned (status line *"pre-v1, skeleton and planning only"* → *"v1 in active development"* with link to live demo and Limitations section; CI claim *"not wired up yet"* → current state of "parser only ever runs on contributor machines, public Pages ships frame only"; project-layout directory name `OstranautDataExplorer/` → `Ostranaut-Explorer/`; title harmonized with repo and cover).

Added a "Limitations — what's not in the box yet" section near the bottom that consolidates what was previously scattered across [PLAN.md](PLAN.md), [notes/coverage-gaps.md](notes/coverage-gaps.md), and [notes/ux/](notes/ux/): missing site features (glossary card UX 1.1, explainer banners 1.2, inline schema descriptions 1.3, filter pills 1.6, cluster pages 3.1, template-hub pages 3.2, smaller 1.4/1.7-1.12 components, `/help/debug` migration); parser coverage gaps (5 of ~70 folders schema-covered upstream, 184 uncovered ref candidates pending promotion, stat-bar → `Stat*` audit at 1 of 11 confirmed, mod-overlay load order out of scope until v2); content gaps (5 pending LLM extraction passes on flagged Modding wiki pages, `nDisplaySelf` semantics, needs-suppression handoff still untested in-game). The aim is that a fresh visitor or contributor sees the honest limits in one place and knows where each one is tracked in detail.

## 2026-05-03 — Public Pages bundle + cover page + four-factor pre-push check

Set up the static "public bundle" for GitHub Pages. The site frame, `comment_mod/`, and `notes/handoff/` ship; the C# parser never runs in CI. Game data isn't redistributable, so the public deploy carries empty data stubs and a cover page that explains the empty-data state up-front, then describes each tab. Visitors who want a populated explorer clone the repo and run `make site` locally with Ostranauts installed.

Renamed `src/Ostranauts.Site/index.html` → `explorer.html` (content unchanged) and made the new `index.html` the cover page. Local `make run` now opens the cover, one click from the explorer — same UX as Pages visitors. Cover styling reuses the dark theme variables from `style.css` plus a small inline block for cover-specific layout (the global `main { display: grid; ... }` rule is the explorer's two-pane layout, overridden with `display: block` on `main.cover`). A bordered orange-warn "Empty dataset · Public demo" header makes the missing-data state explicit so visitors don't click into the tabs expecting them to work.

Added a "Pre-push check — four-factor fair use review" section to CLAUDE.md. Anything pushed to the public bundle is publicly redistributed content, so the four factors get walked: purpose/character, nature, amount/substantiality, market effect. Most data-only handoffs clear factors 1, 2, 4 trivially; only factor 3 is plausibly violable (full strName dumps, comprehensive game-manual handoffs). The check is the audit trail.

`make site-public` target produces `build-public/` (~132K — site files + cover + handoffs + four 30-byte data stubs). `.github/workflows/pages.yml` runs that target on push to main/master and deploys via `actions/upload-pages-artifact` + `actions/deploy-pages`. Runner needs only `make` / `bash` / `cp` — no .NET, no game tree. `.gitignore` excludes `/build-public/`.

## 2026-05-03 — Needs-suppression mod handoff page + Makefile copy step

Wrote a self-contained HTML guide for the modder from the `mod-suppress-needs.md` user story: how to build a player-trait that flatlines hunger / thirst / sleep / hygiene / psych needs. It's untested (the explorer doesn't ship yet) and presented as a starting scaffold, not a verified mod. Lives at `notes/handoff/needs-suppression-mod-guide.html`.

Content shape: the trait → condition → per-loot → `aCOs` chain explained against the real vanilla `IsApathetic → CONDApatheticPer → ThreshStatAchievement=1.0x0.2` chain, the two suppression mechanisms (`Thresh<Stat>` for stats that have one, `-Stat<Name>Rate` for `StatFood` and `StatHygiene` which don't), four copy-pasteable mod files plus `loading_order.json`, a tuning section, the `addcond` console fallback for existing saves, and a ten-item "Pitfalls and confusable names" section. Each section that's informed by the wiki cites it inline (Conditions, Condition Rules, Modding/Loot, Modding/Data Modding, Health and Safety, Traits, Debug); a Sources section at the bottom collects the links.

Key data correction surfaced while writing: `StatHunger` does not exist. The wiki's Condition Rules tutorial uses it as a pedagogical placeholder, but the real stats are `StatSatiety` (the feeling) and `StatFood` (malnutrition), and `StatFood` notably has no `Thresh*` handle. The `mod-suppress-needs.md` user story was rewritten to use the correct names, the actual `IsApathetic` example chain instead of a hypothetical wearable, and the full real stat checklist; a new acceptance bullet calls out that the explorer must surface the *absence* of `Thresh*` for `StatFood` / `StatHygiene` so modders pivot to the rate mechanism instead of hunting for a handle that doesn't exist.

Makefile: added `HANDOFF_SRC := notes/handoff` and a post-`cp` step that mirrors `notes/handoff/` into `$(BUILD_DIR)/handoff/` after the site files land. Guarded by `[ -d "$(HANDOFF_SRC)" ]` so it's a no-op if the folder ever gets removed. Once GitHub Pages is live, the guide is reachable at `<pages-url>/handoff/needs-suppression-mod-guide.html` — not linked from the site UI, just directly URL-shareable.

## 2026-05-03 — Untrack `.claude/settings.local.json`

The Claude Code convention is `.claude/settings.json` = shared (tracked), `.claude/settings.local.json` = per-user (gitignored). This repo had it inverted: only the `.local.json` existed and it was tracked. Added the file to `.gitignore` and `git rm --cached`'d it. Local copy preserved.

## 2026-05-03 — User stories from `testdata_mods/` source mods

Five new story files in `notes/user-stories/`, derived from studying two real mods sitting in a local `testdata_mods/` working tree (jwebmeister's `FreeTraits_and_StarterShipPlus`, Voideka's `HygieneStation`). Same modder-as-audience framing as the rest of the user-stories folder.

- `mod-free-traits.md` — tuning mod (`traitscores.json` `aValues` cond-string, position 2 = age years; flip non-zero rows to `0`). Covers the careers `aSkillsHobby` companion override.
- `mod-hygiene-station.md` — full "add a new installable" mod, exercising condowners (installed + loose variants), items, conditions_simple, condtrigs, the `aInverse` interaction state machine, loot (`bNested`/`bSuppress` spawn-contents, `strType: interaction` destroy delegate), and installables (install / uninstall / dismantle / undamage).
- `mod-starter-ship.md` — character-creation chain `loot[strType:ship] ← lifeevents[strShipRewards] ← career[aEventsShip]`, plus the `bShipOwned` / `fShipMortgage` / `fShipDmgMax` / `fStartATCRange` / `strStartATC` field set on the life-event side.
- `mod-suppress-needs.md` — captured Discord exchange about a player-trait that flatlines needs. The mod path is the `Thresh<StatName>` pattern (additive, save-safe). Includes an explicit acceptance criterion ("…without needing to ask on Discord").
- `explore-needs-loop.md` — a meta-story (explicitly disclaimed up top as "designer exploration, not a mod-making story") on what the explorer needs to surface so a designer can see why the needs loop reads as a treadmill. Two paths: (1) conversational agency — `StatSocialization` / `StatBelonging` are real but `nDisplaySelf=0` until crisis; (2) drain/refill asymmetry — passive drain vs. active refill, rates buried in tick-effect loot edges. Findings feed into `mod-suppress-needs.md` and into UX 1.1 / 1.4 / 1.10 component requirements.

`.gitignore` adds `/testdata_mods/` — the source mods are local working material, not redistributable. Stories cite their paths but the trees themselves stay local.

---

## 2026-05-03 — Standup: discoverability + PLAN.md + audience framing + Makefile fix

Standup-driven batch of housekeeping after a multi-session burst of UX/notes work. Three logical clusters of change.

**Notes / UX work** (the original session's product, finalized here):
- `notes/user-stories/anti-g-loc-newcomer.md` — newcomer-modder sibling to the existing `anti-g-loc-leggings` story. Same ItmLeggings01 / loot.json destination, but the modder walks in with no prior knowledge of `StatGrav`, `Thresh<X>` naming, the cond-string DSL, or `strType`-routed Loot dispatch.
- `notes/ux/newcomer-onboarding.md` — 12-component UX plan derived from that story (concept search, per-prefix explainers, inline schema descriptions, derived *"modifies thresholds of"* sidebars, folder + strType badges, filter pills, DSL primer popover, strType dispatch tooltip, *"why is this in X/"* inline note, *"edit this"* callout, live-build diff highlight, plain-language wiki links) plus display-constraint guidance for a designer. Stretch sections cover cluster pages (3.1, three-tier detection: curated / auto-prefix / auto-signature; comparison table is the centerpiece) and template-hub pages (3.2, fan-in heuristic for cases like `items/ItmBodyPart01` used as `strItemDef` by 20 `condowners/Wound*` entries).
- `notes/user-stories/crew-exercise-invisible-need.md` — drafted by a lighter agent earlier in the day with player framing; reframed for modder audience here (the data findings — `StatAtrophy.nDisplaySelf=0`, `CONDTick1HourPhysio` rates, `CONDTick1HourWorkMoods` drains, `CONDOssifexStimPer` — are accurate; only the framing needed flipping from *"frustrated player"* to *"modder writing a design doc to mod the work/needs loop"*).
- `notes/wiki-onboarding.md` — drafted by a lighter agent that went out of scope (cached ~24 player-facing wiki pages instead of `Modding/*`-only). The notes turned out modder-relevant; added a scope-context preamble and trimmed an over-length quote.

**Site change** — small `copy ref` button in the upper-right of every object detail's `.detail-head`. Copies `<folder>\<strName>` (e.g. `items\ItmBodyPart01`) to the clipboard so the user can paste an unambiguous handle into chat / issues without typing or hand-formatting. Mirrors the `.llm-block button` style + flash-on-success interaction. CSS adds `position: relative` to `.detail-head` to anchor the absolute-positioned button.

**Standup outputs**:
- **PLAN.md** at the repo root. Active work tracker — items live until shipped, then deleted (DEV-LOG.md is the historical record). Sections: parser/library, site/UX, content/wiki extraction, stretch/v2. Replaces the in-progress fragments that had been accumulating in PROJECT-PITCH.
- **PROJECT-PITCH.md slimmed** — removed *"Suggested first slice"* (all done), trimmed v0/v1 roadmap blocks (mostly shipped), moved the LLM-assist extraction page-priority table to PLAN.
- **README.md** + **CLAUDE.md** updated for .md discoverability — every reader-facing surface now reachable from one of the two roots. README gets a "Where things live" table; CLAUDE gets a "Where to look first" pointer set covering PLAN, DEV-LOG, notes/user-stories, notes/ux, notes/coverage-gaps, notes/wiki-onboarding, prose-extraction, comment_mod/wiki_review_queue.
- **CLAUDE.md** also gets explicit **Audience clarity** + **Wiki crawl scope** sections — addresses the recurring failure mode where lighter agents heard *"newcomer"* as *"new to the game"* instead of *"new to Ostranauts modding."* Pass-down language for subagent prompts included.
- **CODE-DESIGN.md** layout listing collapsed to declarative-rule (one .md per .cs source file, directory is source of truth) instead of a stale exhaustive listing. `iverifiable-ref-map.md` now mentioned in the layout.
- **CodeDocs/io/inputs.md** rewritten — explicit five-input enumeration (`data/`, `data/schemas/`, `comment_mod/data/schemas/`, `wiki_cache/`, `decomp/`), refreshed folder list, documented the multi-root overlay mechanism, mentioned all the scripts that consume each surface.
- **CodeDocs/00_PROJECT.md** Status section refreshed — single current-truth snapshot (32,542 objects, 77,866 references, 91 rules, 240 candidates) plus a pointer to DEV-LOG for slice-by-slice history; deleted the now-stale slice-recap that ended at Slice E phase 1.

**Bug fix** — Makefile passed `--data` to the Builder, but the CLI takes `--root`. Would have failed any `make site` invocation. Replaced with optional `--root $(DATA_ROOT)` (only emitted when `DATA_ROOT` is overridden); default invocation now relies on the Builder's auto-detection of `data` + `comment_mod/data` (which has been the right behavior since the multi-root overlay shipped).

## 2026-05-03 — Multi-strName-source surfacing (alt-folder suffix on every ref link)

User flagged the case where the same strName lives in multiple folders simultaneously — the `Itm*` pattern where a name is a loot entry, a condowner, AND an item DTO at once. The schema's primary target picks one folder; modders editing the data need to see the others to avoid editing the wrong file.

The detector itself was already handling multi-target — `RefCandidateDetector` emits all qualifying targets per `(sourceFolder, fieldPath)`, sorted by hit-rate. Real-data confirmation: `interactions.objLootModeSwitchThem` produces a Candidate with three targets — loot 100%, condowners 93%, items 73% — even though it's covered by schema. The miss was on the surfacing side.

Changes (site-only):

- `nameToFolders` map built at load (strName → Set<folder>). Cheap — same data the cross-folder duplicate check on `/health/data` was already computing per render.
- `renderAltFolderSuffix(primaryFolder, strName)` helper: when a name lives in 2+ folders, appends `(also: <folder>, ...)` after the link, each clickable. Used on outgoing/incoming edge rows and on the auto-detected scalar links in the Fields block.
- `/health/data` dangling-edges sample table: when the dangling target's strName actually exists in another folder, the row shows "actually exists in: X" — turns a dead-end into a navigable hint. Frequently surfaces "schema says items/ but the value lives in condowners/" type misroutings.
- `/health/coverage`: new "Covered fields with multi-folder targets" section listing every covered candidate where ≥2 target folders matched. Surfaces patterns the previous page filtered out (it only showed uncovered candidates). Uses the same row template as the uncovered list (refactored to a shared `candidateRow()` function).

No detector / library changes. No new tests. Site behavior change only.

## 2026-05-03 — Auto-detection + health pages + template engine + conditions_simple expansion (phases 1-5)

Plan-driven 6-phase batch. The runaway take-away: the auto-detector turns up **240 candidates (184 uncovered)** on real data — enough material for the next several Slice-E-style schema expansions to be data-driven instead of hand-curated.

**Phase 1** — `notes/coverage-gaps.md`. Living scratchpad for "this folder/field is referenced but our extractor doesn't see it." Seeded with the installables case (every conventional ref-shaped field — `strActionCO`, `CTThem`, `aLootCOs[*]`, `aInputs[*]`, etc.).

**Phase 2** — `Ostranauts.DataModel.RefCandidateDetector` + `CandidateExporter`. Scans every leaf string in every node's `Fields`, hits each value against a global `(folder, strName)` index. Two passes per leaf — raw (value-as-whole) and encoded (split on `,`/`=`/`|` and try the prefix token, catches CondString-style and LootItm-style fields without schema rules). Per `(sourceFolder, fieldPath)` aggregation: sample size, distinct values, hits per target folder, hit-rate. Self-folder hits and the `strName` field are excluded by default. Output: `build/data/ref_candidates.js` (~91 KB). Sort: uncovered first, then by `sampleSize × bestHitRate`. 7 unit tests.

Real-data biggest finds: `ships.aItems[*].strName` → cooverlays (454k samples, 80% rate); `ships.aConstructionTemplates[*].aItems[*].strName` → cooverlays (123k); `condrules.aThresh[*].strLootNew` → loot (matched the manual Slice E phase 4 nested-array pattern); the entire installables coverage gap (`strActionCO`, `CTThem`, `strInteractionTemplate`, `aLootCOs[*]`, `aInputs[*]` via encoded-`=` split, etc.). 7-distinct-value coincidence cases (e.g. `items.aSocketReqs[*]`) sort low because of the `× distinctValues` factor in the leverage score.

**Phase 3** — site decoration. Top-level scalar fields with an uncovered candidate render as `folder:value` links on the Fields block when the value resolves to a known node, with a 🔍 badge and hit-rate tooltip. Array/nested-path candidates surface on the coverage page only (not inline) — keeps the detail page from getting noisy. Uses CSS `.auto-detected` for visual distinction from schema-derived edges (dashed underline vs solid).

**Phase 4** — `/health/coverage` (extractor-integrity). Per-folder table: objects, in-edges, out-edges, rules, candidates. Zero-out-edges rows highlighted as suspected blind spots. Below that: top-200 detector candidates by leverage with target folder, hit-rate, sample/distinct counts, encoded-shape tag. Will become the standing dashboard for "are we actually seeing this folder."

**Phase 5** — four sub-features:
- **`/health/data`** — dangling-by-target-folder, sample 50 dangling rows with click-through to source, orphans-by-folder (top 30), cross-folder duplicate strNames (top 100).
- **`conditions_simple` expansion** — `Ostranauts.DataModel.ConditionsSimpleExpander`. The folder's single file holds a wrapper with a flat `aValues` array where every 7 elements is one logical record `[strName, strNameFriendly, strDesc, nDisplaySelf, nDisplayOther, strColor, bInvert]`. Synthesizes one DataObject per tuple. Object count: **31,152 → 32,542 (+1,390)**. Now resolves the previously-dangling `homeworlds.aConds*` edges — those rules already had `x-targets: ["conditions_simple", "conditions"]` from Slice E phase 3 but had no synthetic entries to land on. 5 unit tests. Real data finding surfaced: `IsBCER` and `IsBCRS` appear twice within the wrapper's array (data bug or override).
- **Template engine** — site-only. Two surfaces per detail page: (a) folder-wide Mustache-lite template, click-to-edit, magic-word interpolation against a context built from `fields.<key>` / `outRefs.<sourceField>.{length, first}` / `inRefs.*` / `outCount` / `inCount` / `strName` / `folder` / `file`; (b) per-object free-form note. localStorage by default; "copy for comment_mod" buttons produce paste-ready text drops for `comment_mod/templates/<folder>.tmpl` and `comment_mod/notes/<folder>/<strName>.md`. Editor sidebar lists magic words available on the current object, click-to-insert.
- **`/llm-candidates`** — global top-50 by incoming-ref count + per-folder top-10. Two clipboard buttons per row: copy folder-template prompt / copy object-blurb prompt. Prompts are self-contained — node fields, outgoing/incoming ref groups, magic-word inventory, exemplar siblings. User pastes into chat, gets a template/blurb back, pastes into the template editor. **Zero programmatic LLM API spend** — user controls every call.

**Tabs + blurbs.** Moved Schemas / Coverage / Data Health / LLM Candidates from the sidebar to a top tab bar. Each tab has a hover-tooltip blurb and a visible page-blurb panel at the top of the page, both written from a modder's POV: when do you visit this page, what does it tell you, what should you do with it.

**Real-data deltas vs the previous build:**
```
  objects:    31,152 → 32,542  (+1,390 conditions_simple synthetics)
  references: 77,866           (unchanged — fallback resolution shifts dangling → conditions_simple, no new edges)
  rules:      91               (unchanged — schema overlay promotion is deferred phase 6)
  candidates: 0     → 240      (new detector channel; 184 of those uncovered by schema)
  warnings:   13    → 15       (+2 conditions_simple internal duplicates)
```

**File counts:** 4 new C# files (RefCandidateDetector, CandidateExporter, ConditionsSimpleExpander, plus 2 test files) + significant additions to app.js (5 new render functions: coverage, data-health, llm-candidates, template-block, tabs+blurbs). 79/79 tests passing (was 67; added 12 across detector + expander tests).

**CodeDocs synced.** 3 new source overviews + Program.md, outputs.md, 00_PROJECT.md updated to reflect the new pipeline + new payload file (`ref_candidates.js`).

**Phase 6 deferred** — promoting auto-detected candidates into `comment_mod/data/schemas/` overlays. Not blocking anything; the report file persists and the site already renders the candidates inline + on the coverage page. Do this when ready to commit a large overlay diff.



Per user: "check to see if there are any python scripts to extract and document into the utils tracked folder."

Audited the 10 python scripts in `scrap_scripts/python/`:

- **Promoted (8)** — durable tools, regenerate tracked content, or required for builds:
  | Old | New |
  |---|---|
  | `01_wiki_cache.py` | `utils/python/wiki_cache.py` |
  | `02_wiki_crawl.py` | `utils/python/wiki_crawl.py` |
  | `03_wiki_extract_schemas.py` | `utils/python/wiki_extract_schemas.py` |
  | `06_decomp_schema_crosscheck.py` | `utils/python/decomp_schema_crosscheck.py` |
  | `07_decomp_schema_table.py` | `utils/python/decomp_schema_table.py` |
  | `08_extract_verifiables.py` | `utils/python/decomp_extract_verifiables.py` |
  | `09_decomp_string_search.py` | `utils/python/decomp_string_search.py` |
  | `10_emit_code_refs.py` | `utils/python/emit_code_refs.py` |
- **Kept in scrap (2)** — explicit "one-off" / "exploration" per docstring:
  - `04_verify_folder_counts.py`
  - `05_condowners_keys.py`

Old copies deleted from `scrap_scripts/python/` for disk hygiene (gitignored, no commit effect — just removes confusion). Names dropped the `<NN>_` prefix on promotion; descriptive names now (`wiki_cache.py`, `decomp_string_search.py`, etc.). Renumbering is no longer meaningful for tracked tools.

Internal change: `wiki_crawl.py`'s import of `01_wiki_cache` (which used `importlib.import_module` because the module name started with a digit) replaced with a normal `from wiki_cache import ...`.

`utils/README.md` added with a per-script table + common usage examples + a "how to add a new tool" section.

`CLAUDE.md` "Scrap scripts" section rewritten as "Scripts: utils/ vs scrap_scripts/" — codifies the promotion criteria, the tracked-vs-throwaway distinction, and the rules that apply to both kinds.

Tracked-file cross-references rewritten via a one-shot Python rewrite (`scrap_scripts/python/<NN>_*.py` → `utils/python/<descriptive>.py`) across `DEV-LOG.md`, `PROJECT-PITCH.md`, `README.md`, `CodeDocs/io/{inputs,outputs}.md`, `CodeDocs/sources/Ostranauts.DataModel/SchemaLoader.md`, `CodeDocs/iverifiable-ref-map.md`.

Smoke-tested both `decomp_string_search.py EmbarkCommand` and `emit_code_refs.py` from the new path; same outputs as before (1 hit / ~658 KB code_refs.js).

## 2026-05-03 — graph.js split into 3 payloads + dnSpy README + emit_code_refs

Per user: split the monolithic graph.js into typed payloads and add a code-references file.

**Split (graph.js v4 → v5):**
- `graph.js` (`window.GRAPH_DATA`): the direct graph — nodes, edges, rules. Same shape as v4 minus per-node `fields`. ~23 MB (was ~32).
- `properties.js` (`window.NODE_PROPS`): `{"<folder>:<strName>": {scalar fields...}}`. Lives next to graph.js, written by the same Builder pass. ~8.9 MB.
- `code_refs.js` (`window.CODE_REFS`): `{"<strName>": [{file, line, text}, ...]}`. Hardcoded `"<strName>"` quoted-literal occurrences in `decomp/`. Generated by a separate Python script (below). ~658 KB; 1,321 names have hits, 3,309 total occurrences.

`GraphExporter.WriteJson` now writes both the graph and properties files (the second one is a sibling to the path passed in). Site loads all three via separate `<script src>` tags; properties + code-refs are optional and the site degrades gracefully if either is missing (empty Fields block, no Code references block).

**`10_emit_code_refs.py`** — scans `decomp/Assembly-CSharp/**/*.cs` for `"<identifier>"` quoted-literal patterns whose contents match a strName in graph.js. Reads each file once, single regex pass. Outputs `build/data/code_refs.js`. Required for the site's code-references block; otherwise it just doesn't appear.

**README dnSpy section** — full setup instructions for decompiling `Assembly-CSharp.dll` with [dnSpy](https://github.com/dnSpyEx/dnSpy) per the wiki's recommendation. Default settings, source `<Steam>/.../Ostranauts_Data/Managed/Assembly-CSharp.dll`, destination `decomp/Assembly-CSharp/`. Whole project works without `decomp/`; the four scripts that consume it (06, 07, 08, 09, 10) just stay idle.

**Site detail page** now renders code references when present. Each hit shows the relative file path + line number + the code line itself in a monospace block.

Tests: 67/67 (split is pure serialization rearrangement; no behavior changes).

## 2026-05-03 — Slice E phase 6: decomp string-literal search script

New `utils/python/decomp_string_search.py` (gitignored). Regex-greps the decompiled C# source tree for `"<key>"` quoted-literal occurrences. Catches references to data names that don't appear via the JSON-schema layer — typically hardcoded calls in game code like:

```
JsonPledge pledge = DataHandler.GetPledge("EmbarkCommand");
```

(in `AIShipManager.cs:1007`). The schema-driven extractor can't see this because `EmbarkCommand` isn't anywhere in the data tree's JSON; it's a runtime lookup by a string literal in code.

Usage:
```
python ./utils/python/decomp_string_search.py EmbarkCommand
python ./utils/python/decomp_string_search.py -C 3 EmbarkCommand DcFood
```

Reports `path:lineno: line` for each hit. `-C N` adds N lines of surrounding context with a `>>` marker on the matched line. Soft-warns when a key doesn't look identifier-shaped (pass `--no-strict` to silence).

Smoke-tested: `EmbarkCommand` → 1 hit (AIShipManager.cs); `DcFood` and `Coughing` → 0 hits (purely data-driven, never named explicitly in code). The latter is the expected pattern for most data names — the win is finding the *exceptions* (string-literal lookups in code that schema work can't reach).

Future: a higher-level "audit all data names against decomp string-lookups" pass could iterate every node in graph.js, run this against decomp, and report which data entries are referenced from game code as string literals. Out of scope for this slice.

## 2026-05-03 — Slice E phase 5: outgoing-ref schemas for tickers / shipspecs / lifeevents / chargeprofiles

Folders that DataLoader was already loading but had no schema → no outgoing rules. Added minimal overlays based on `decomp/Assembly-CSharp/Json{Ticker,ShipSpec,LifeEvent,ChargeProfile}.cs` property lists + `data/<folder>/*.json` value samples.

- `tickers-schema.json`: `strCondLoot` → loot (48 edges), `strCondLootCoeff` → conditions (14), `strCondUpdate` → conditions (0 — present but unused in current data).
- `shipspecs-schema.json`: `strLootRegIDs` (24) and `strLootATCRegions` (9) → loot.
- `lifeevents-schema.json`: `strInteraction` → interactions (97), `strStartATC` → homeworlds (12), `strShipRewards` → loot (12).
- `chargeprofiles-schema.json`: `strCondName` → conditions (14), `strItemCT` → condtrigs (13).

All inferred from decomp ground truth; conservative — only the fields whose target folder I'm confident about are declared. Other Json* properties left to the future.

Real-data deltas vs Phase 4:
  edges:    77,623 → 77,866  (+243)
  rules:    81 → 91          (+10)

## 2026-05-03 — Slice E phase 4: nested object refs (DcFood case fully resolved)

The `condrules.aThresholds[*].strLootNew` case (the `DcFood` investigation that motivated all of Slice E): condrule entries have an `aThresholds` array of OBJECTS, each containing a `strLootNew` field that references `loot/`. Single-level extraction couldn't reach into the nested objects.

Mechanism added:
- New `FieldShape.NestedDirectArray` — for arrays where each element is an object with a single named string sub-field that's the ref.
- `SchemaCatalog.FieldRule.NestedField` — name of the sub-field within each array element.
- `SchemaLoader` reads `x-nested-field: "<sub>"` JSON Schema extension.
- `ReferenceExtractor.ExtractNestedDirectArray`: walks the array, pulls the named sub-field from each object, emits one edge per non-empty value. `sourceField` is set to `"aThresholds[*].strLootNew"` so the path is visible on the detail page. Inherits the existence-aware fallback resolution from Phase 3.

Schema overlay:
- `condrules-schema.json`: added `aThresholds` with `x-shape: NestedDirectArray`, `x-nested-field: "strLootNew"`, `x-targets: ["loot"]`. The DcFood-class condrules now produce 5 nested-loot refs each.

Script 07 mapping fix:
- `CLASS_TO_SCHEMA` updated: `CondRule → condrules` (no `Json` prefix; the runtime class IS the deserialization target per IVerifiable map). Plus `JsonPlotManagerSettings → plot_manager` so the script catches the second plot folder properly.

**`condrules:DcFood` verified end-to-end: now shows 6 outgoing refs (1 strCond → conditions:StatFood, 5 aThresholds[*].strLootNew → loot:CONDDcFood01..05).** This was the canary case that started Slice E.

Real-data deltas:
  edges:    76,846 → 77,623  (+777, mostly aThresholds across all condrules)
  rules:    80 → 81          (+1)

Tests: 67/67 (extractor signature unchanged; new shape uses the existing exists checker).

## 2026-05-03 — Slice E phase 3: existence-aware fallback targets

Per the IVerifiable map: condtrigs `aReqs`/`aForbids`/`aTriggers`/`aTriggersForbid` are dual-type — each entry is *either* a condtrig name *or* a condition name. Same shape applies to `homeworlds.aConds*` which can target `conditions_simple/` or `conditions/`. Single fixed-target rules can't model this.

Mechanism added:
- `SchemaCatalog.FieldRule.FallbackTargets` — optional ordered list of fallback folders.
- `SchemaLoader` reads `x-targets: [primary, ...fallbacks]` JSON Schema extension. First entry becomes the primary `TargetFolder` (overrides the regex-derived one); the rest become `FallbackTargets`.
- `ReferenceExtractor` now optionally takes an `exists: Func<string, string, bool>` checker. New `ResolveExistingTarget` walks `[primary, ...fallbacks]` per value and routes each edge to the first folder that contains it, falling back to primary (= dangling) if none. Applied to Direct, StringArray, CondStringArray shapes.
- `Program.cs` builds the existence set (HashSet<(folder, strName)>) once after loading, passes its `Contains` to the extractor.

Schema overlays:
- `condtrigs-schema.json`: `aReqs`/`aForbids`/`aTriggers`/`aTriggersForbid` get `x-targets: ["condtrigs", "conditions"]`. Plus added the missing `aTriggersForbid` field.
- `homeworlds-schema.json`: `aCondsCitizen`/`aCondsResident`/`aCondsIllegal` get `x-targets: ["conditions_simple", "conditions"]`.

Real-data deltas:
  edges:    76,055 → 76,846  (+791, mostly new aTriggersForbid)
  rules:    79 → 80          (+1 new rule)
  Verified split: condtrigs.aReqs → 5,677 to condtrigs, 2,953 to conditions
  Verified split: homeworlds.aCondsCitizen → 109 to conditions_simple, 84 to conditions

Dangling counts on conditions_simple still 100% — that's the separate "array-of-tuples structural format" issue (the folder has a single meta-entry containing the actual conditions in `aValues`). Phase 3 only addresses the routing mechanism; the structural workaround is a separate slice.

Tests: 67/67 (no behavioral test changes — extractor signature gained an optional parameter that defaults to skipping fallback resolution).

## 2026-05-03 — Object detail page: scalar fields + hover descriptions + casing fix

User flagged three issues on the homeworlds:MHNG detail page (the `aCondsCitizen`/`aCondsResident`/`aCondsIllegal` view):

1. **Field group headers were forced UPPERCASE** (e.g. `ACONDSCITIZEN`) — not Hungarian-notation. Fixed by removing `text-transform: uppercase` from `.refs-block .group-head` and switching to a monospace font for legibility. Now shows `aCondsCitizen` as written.

2. **Schema descriptions weren't surfaced** even though we had them on every rule. Added `Description` to `SchemaCatalog.FieldRule`, plumbed through `SchemaLoader` (was already reading `description` for ref derivation; now also retains it on the rule). `GraphExporter` serializes `description` on each rule entry. Site stores them in a `(folder:fieldName) → description` map at load time. Field-group headers and the new field-name labels now render with `title=` attributes; CSS adds a dotted underline + help cursor when a tooltip is available.

3. **Non-reference data fields weren't shown anywhere** — the homeworlds page should display strColonyName, nFoundingYear, etc. Added per-node `fields` object containing scalar values (string/number/bool/null only — arrays/nested objects skipped to keep payload size sane). New `Fields (N)` block on the detail page renders them as a key:value list, sorted, with hover descriptions.

Schema version: 3 → 4. Two additive surfaces (per-node `fields`, per-rule `description`); v3 readers ignore the additions.

Size impact: graph.js grew 19 MB → **32 MB** (mostly per-node scalars across 31k nodes). Per-node `fields` is the bulk; per-rule descriptions are negligible. Sharding moves up the priority list if this grows much further.

Tests: 67/67 (no behavioral test changes; the new payload fields are pure pass-through).

## 2026-05-03 — x-no-ref suppression + plot_manager mapping; cleanup after Phase 2

**Two findings from a dangling-rate audit after Phase 2:**

1. `interactions.strUseCase` was producing 103 dangling edges to `chargeprofiles/` — but the field's actual values are use-case tokens like `"Check"` and `"Normal"` (suffixes on chargeprofile name patterns at runtime). The wiki description's parenthetical *"(strName from chargeprofiles.json)"* tripped the regex. **Fixed** by adding a new JSON Schema `x-no-ref: true` extension and a suppression mechanism: SchemaLoader's multi-dir variant now collects keys flagged with `x-no-ref` in later dirs and removes any rule from earlier dirs at that key. Applied via overlay; +1 test.

2. `JsonPlotManagerSettings` (sibling of `JsonPlot`) is the C# class whose fields the prior "plot ghosts" actually live on — the data folder is `plot_manager/` (one entry, `pm_settings.json`). **Added** `comment_mod/data/schemas/plot_manager-schema.json` to document the fields where they belong (no new ref rules — all numeric/object types).

Also: refactored single-dir `SchemaLoader.Load` to delegate to a private `LoadInternal` returning both rules and suppression keys; multi-dir Load now uses `Dictionary<key, rule>` instead of a flat list, which de-duplicates base+overlay rules. Total catalog rule count dropped 94 → 79 (15 collapsed dupes); edges only changed by -103 (the strUseCase suppression). De-dup makes the inspector counts more honest.

Tests: 66 → 67 (+1 for x-no-ref round-trip).

Real-data deltas vs phase 2:
  edges:    76,158 → 76,055  (-103, all dangling chargeprofiles-strUseCase noise gone)
  rules:    94 → 79          (-15: 1 from strUseCase suppression, 14 from de-dup)

Audit findings deferred to FUTURE slices (see todo list at session end):
- `conditions_simple/` is structurally an array-of-tuples (single top-level entry with an `aValues: [[strName, ...], ...]` array). 617 dangling `homeworlds.aConds*` edges resolve to entries inside this — needs a per-folder structural workaround.
- Phase 3: existence-aware extraction for dual-type targets (condtrigs, plus the conditions_simple multi-target case).
- Phase 4: nested object refs (DcFood's `aThresholds[*].strLootNew`).
- Phase 5: outgoing-ref schemas for tickers/shipspecs/lifeevents (data already loads; would derive rules for refs going OUT).

## 2026-05-03 — Slice E phase 2: encoded-array FieldShapes (aInverse, aLootItms, aStartingCondRules)

Three new FieldShapes for the encoded-array formats documented in `CodeDocs/iverifiable-ref-map.md`:

- `InverseArray` — split each element on `,`, take [0]. For `JsonInteraction.aInverse`. Trailing tokens (`[us]`, `[them]` role-swap markers) go on `Metadata.args`.
- `CondRuleAttachArray` — split each element on `=`, take [0] as ref. If [1] parses as a double, attach as `Metadata.fModifier`. For `JsonCondOwner.aStartingCondRules`.
- `LootItmsArray` — split each element on `,`. Verb at [0] (verbs: addus, addthem, removethem, take, use, lacks, input, give, removeus), loot name at [1], trailing booleans on `Metadata.args`. For `JsonInteraction.aLootItms`.

Three new RefKinds: `Inverse`, `CondRuleAttach`, `LootItm`. GraphExporter's WriteScalar now handles `string[]` so the `args` metadata serializes as a JSON array.

Schemas declare these via a new `x-shape` JSON Schema extension (explicit override; takes precedence over inferred shape and marker phrases). Example:

```json
"aLootItms": { "type": "array", "x-shape": "LootItmsArray", "description": "..." }
```

Tests: 61 → 66 (+5 covering each shape + a positive case for malformed-skip).

Real-data deltas vs phase 1:
  edges:    67,129 → 76,158  (+9,029)
  rules:    91 → 94 (+3)

Standout: `interactions.aInverse` alone produces 8,558 edges — the social-interaction reply chain was nearly invisible before. `condowners.aStartingCondRules` produces 471 edges (every Crew01 attachment), all carrying their `fModifier` value on Metadata. `interactions.aLootItms` produces 303 edges with verbs preserved.

## 2026-05-03 — Slice E phase 1: IVerifiable-map-driven schema expansion (direct-string fields)

Added the direct-string reference fields documented in `CodeDocs/iverifiable-ref-map.md` (extracted from the game's own `IVerifiable.GetVerifiables()`). No code change — pure schema additions.

- `condowners-schema.json`: + `aInteractions` (→ interactions, 2,257 edges), `aTickers` (→ tickers, 283), `strContainerCT` (→ condtrigs, 232).
- `interactions-schema.json`: + 12 new direct-string fields per IVerifiable: `CTTestRoom`, `LootVFXUs/Them`, `LootAudioUs/Them`, `LootAddFactionsUs/Them`, `LootAddCondRulesUs/Them`, `ShipTestUs/Them/3rd`. Plus `strPledgeAddThem` (clearly real per JsonInteraction.cs grep, 49 edges).
- `conditions-schema.json`: + `strAnti` (self-folder ref, 97 edges — antithetical condition removed when current is added).

Real-data deltas vs prior commit:
  edges:    63,829 → 67,129  (+3,300)
  rules:    74     → 91      (+17)

Phase 2 will tackle the encoded-array shapes (aLootItms verb encoding, aStartingCondRules `=fModifier` encoding, aInverse comma encoding) — those need new FieldShapes in the C# library.

## 2026-05-03 — Ghost-rule preservation in schemas

Per the user's "keep ghosts, document them in editor as ghosts" decision: instead of removing the 18 `JsonInteraction` and 5 `JsonPlot` schema fields that `07_decomp_schema_table.py` flagged as not-in-decomp, marked them with a JSON Schema `x-ghost: true` extension. The flag rides through `SchemaCatalog.FieldRule.IsGhost` → `GraphExporter` (graph.js v3 adds `isGhost` on rule entries) → site `#/schemas` and `#/schema/<folder>` views (rendered with a 👻 badge in italics + warn color, dim treatment skipped on ghost zero-edge rules).

Rationale: ghost fields might be referenced in older docs, used by mods, or restored by future game updates — modders editing JSON benefit from "I see this field name documented but the game won't read it." Each ghost description starts with `[GHOST: ...]` so even tooltip-style views surface the status without the `x-ghost` machinery.

Also: `strPledgeRemove`, which I had added in the Slice A interactions overlay on (incorrect) wiki authority, was downgraded to ghost — the decomp showed `JsonInteraction` only deserializes `strPledgeAdd`/`strPledgeAddThem`, with no removal counterpart. Net: rules grew 62 → 74 (+12 ghosts; 5 are non-string-shaped so don't manifest as rules); edge count unchanged at 63,829.

graph.js schema bumped 2 → 3. Tests 60 → 61 (one new round-trip test).

## 2026-05-02 — Decomp cross-check script + dev infrastructure

Added `utils/python/decomp_schema_crosscheck.py`, a Python audit tool that diffs the decompiled C# `Json*.cs` classes in `decomp/Assembly-CSharp/` against our JSON schemas in `data/schemas/` and `comment_mod/data/schemas/`. It reports three things per matched pair: fields present in C# but absent from the schema (coverage gaps), fields in the schema but absent from C# (possible errors or legacy docs), and unmatched classes/schemas that have no mapping yet.

The decomp folder (`decomp/Assembly-CSharp/`) contains 126 `Json*.cs` files that are the authoritative source of truth for which fields the game actually deserializes — they are the ground truth the schemas should reflect. 12 of those classes map directly to folders we already have schemas for.

Also: created this file, updated CLAUDE.md with the dev-log commit rule and a note that the game uses LitJson for JSON deserialization (affects field naming conventions and edge case parsing behavior).
