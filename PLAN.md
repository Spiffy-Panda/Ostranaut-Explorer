# PLAN

Top-level routing file. Active work tracking has split along two axes;
this file points at both and routes the user-story scoring scenarios so
it's clear which plan each one drives.

If you're picking up work cold, read this file first, then the plan that
matches the axis you're touching.

---

## The two plans

- **[PLAN-EXPLORER.md](PLAN-EXPLORER.md)** — modder-facing JSON browser.
  Schema overlay coverage (parser/library), site UX (newcomer onboarding,
  glossary, prefix banners, inline schema, ref-row badges, filter pills),
  wiki / LLM-assisted content extraction. Captures the *hopping around +
  learning the modding space* the explorer is built for.
- **[PLAN-AST.md](PLAN-AST.md)** — code-side graph extension. Promotes
  decomp classes/methods/components to first-class graph objects via
  Roslyn AST + semantic model. Replaces the regex-based code-references
  pipeline with one that recovers `aUpdateCommands` wiring,
  code-emitted condition producers, and runtime-wired ports as real
  graph edges.

The two are independent and ship on their own schedules. PLAN-AST Phase 2
may obsolete a couple of items in PLAN-EXPLORER (notably the recent
`comment_mod/data/conditions/` overlay shims), but neither blocks the
other.

---

## User-story routing

Every file in [`notes/user-stories/`](notes/user-stories/) is a scoring
scenario the explorer is meant to satisfy. Each story is "passed" when a
modder (or designer) can walk it end-to-end smoothly. Mapped to which
plan addresses it:

| User story | Plan | What carries it |
|---|---|---|
| [anti-g-loc-leggings](notes/user-stories/anti-g-loc-leggings.md) | EXPLORER | Search + folder index + `aCOs` / cond-string schema descriptions; `Thresh<X>` derived sidebar (UX 1.4) for the `ThreshStatGrav` jump. |
| [anti-g-loc-newcomer](notes/user-stories/anti-g-loc-newcomer.md) | EXPLORER | Glossary card (UX 1.1, blocking), prefix banners (UX 1.2), inline schema (UX 1.3) — same destination as the skilled story but the explorer has to teach the rungs. |
| [crew-exercise-invisible-need](notes/user-stories/crew-exercise-invisible-need.md) | EXPLORER (primary) + AST (partial) | Tick-effect tracing through `aTickers` → loot → conditions is data-side. The "why does the AI prefer leisure when needs look green?" piece is C# scoring code — Phase 2 of PLAN-AST surfaces it. |
| [mod-free-traits](notes/user-stories/mod-free-traits.md) | EXPLORER | `traitscores/` schema + folder navigation. The `nDisplaySelf` description item in PLAN-EXPLORER is from the related crew-exercise scenario, not this one. |
| [mod-hygiene-station](notes/user-stories/mod-hygiene-station.md) | EXPLORER | Template-hub pages (UX 3.2) — modder needs to clone the Sink pattern across multiple folders. The fan-in heuristic + "editing this affects N instances" callout is the centerpiece. |
| [mod-starter-ship](notes/user-stories/mod-starter-ship.md) | EXPLORER | Folder index + cross-folder ref traversal from character-creation entries to `ships/`. No specific UX item is dedicated; falls out of basic search + ref blocks. |
| [mod-suppress-needs](notes/user-stories/mod-suppress-needs.md) | EXPLORER | Already partly served by the shipped needs-suppression handoff page. Remaining gaps are schema descriptions on `addcond` / `traitscores.ageCost` and the `nDisplaySelf` item. |

---

## Dangling user stories

Stories where neither plan, as written, fully addresses what the story
asks. These are the honest gaps in the active plan set.

### [explore-needs-loop](notes/user-stories/explore-needs-loop.md) — *fully dangling*

The only **designer exploration** story in the set, not a modding story.
The asker wants to use the explorer as a diagnostic to understand *why*
the needs loop feels like a treadmill — conversational agency gap,
need-timer-reset frustration. The story spans:

- Data-side traversal (which interactions touch needs, what tick-effects
  reset them) — covered well enough by EXPLORER.
- Code-side traversal (what makes the AI pick "exercise" over
  "converse," whether a conversation interaction even exists that
  resolves a need rather than nudging it) — partly covered by PLAN-AST
  Phase 2.
- A **framing gap** that neither plan touches: the explorer is built and
  copywritten for modders. A designer using it as a "why does this game
  feel like X" diagnostic has no UI affordances pointing them at root
  causes — the closest thing is the glossary, which is reference, not
  diagnostic.

What would address it: a small UX component for *"why is this stat
behaving this way?"* style questions — likely a banner on stat detail
pages that lists the loops touching it (production, decay, suppression,
threshold modifiers) with a one-sentence framing for each. Roughly half
EXPLORER, half AST. Not on either plan today; track here until promoted.

### [crew-exercise-invisible-need](notes/user-stories/crew-exercise-invisible-need.md) — *partially dangling*

Listed in the routing table because EXPLORER carries most of it, but the
load-bearing observation the modder makes — *"crew exercise even when
needs panel is fully green"* — is fundamentally a question about AI
action selection, which lives in C#. PLAN-AST Phase 2 brings code-side
nodes into the graph; whether that's *enough* to answer the question
("which scoring function picks 'exercise' and what data drives it?")
depends on how cleanly the AI scoring methods bind in Roslyn. Flag it
here so when AST Phase 2 is picked up, this story is part of the
acceptance check.

---

## How to use this file

- **Add** a routing entry when a new user story lands in
  `notes/user-stories/`. Decide which plan carries it; if neither does,
  list it under *Dangling*.
- **Move** a dangling entry into the routing table once a plan picks it
  up — and add the corresponding section to that plan in the same
  commit.
- **Don't put work items here.** Work items live in their respective
  plan. This file routes only.
- **Keep it short.** If routing entries grow paragraphs, the detail
  belongs in the user-story file or the plan.
