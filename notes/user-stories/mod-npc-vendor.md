# User story — Building an NPC vendor (and the `aInverse` misread)

**Source:** a real modder question observed in the BlueBottleGames Discord (#modding-discussion, 2026-05-06). Verbatim chat is local-only; see `CLAUDE.local.md` for the export folder.

---

## The goal

A modder builds a humanoid NPC vendor. They use the canonical pattern: a humanoid CondOwner with `IsTraderNPC=1` plus the right inventory configuration. The NPC works in-game — the trade UI opens correctly when the player approaches.

But the modder is *reading the data* to verify everything is wired the way they expect. They open `data/interactions/interactions.json` and look at the base "Offer to Trade" interaction (`GUITrade`):

```json
"aInverse": [
  "SOCTradeFixerRecognizeFriend",
  "SOCTradeFixerConvoStartAngry",
  ...
  "GUITradeAllowOKLGFixer",   // "Browse the OKLG Black Market"
  "GUITradeAllow"
]
```

Their vendor — never referenced as a fixer, never given any criminal-related conditions — appears to have the black-market dialog branch attached. They go on Discord asking how to remove it from "their" NPC.

This is a **misread**, not a real attachment. The story is about the explorer making that fact clear without the modder having to ask.

---

## What's actually going on

`aInverse` is the **response-branch list** on an interaction definition — what the *other* party can do back when this interaction fires. It lives on the interaction, not the NPC. Each entry is CTTest-gated at runtime; the engine drops failed-CTTest entries before the player ever sees them (`decomp/Assembly-CSharp/Interaction.cs:684–779`).

For `GUITradeAllowOKLGFixer`, the gate is:

- `CTTestUs = TIsOKLGFixer` — the trader must have `IsOKLGFixer`.
- `CTTestThem = TIsOKLGFixerAccess` — the player must have `OKLGFixerAccess`.

`IsOKLGFixer` has only two grant paths in the base game, **both named explicitly for the OKLG fixer plot**:

1. `CONDTraderNPCOKLGFixer` (`data/loot/loot.json`) — a static condition-loot bundle. You'd have to pull it deliberately.
2. `CONDPLOT_NewOKLGFixer_FixerConds` (`data/loot/loot_plots.json`) — applied by the New OKLG Fixer plot, whose selection predicate `CTPLOT_NewOKLGFixer_FixerNew_Make` (`data/condtrigs/contrigs_plots.json`) hard-requires `CareerCriminal` OR `CareerCriminalPast`, forbids the player / existing fixers / robots, and only fires on dormant NPCs.

Neither path attaches by accident. Without one of them, the branch's CTTest fails and the menu entry is filtered out at runtime. The data structure references the branch; the NPC does not "have" it.

---

## The journey — what the explorer should do

### Step 1 — On the modder's NPC vendor detail page

The modder opens their CondOwner. They see `aInteractions` includes `GUITrade`. They click through to inspect the trade flow.

> **What the site shows:** the outgoing-interaction edge carries a small inline note: *"Interactions point at a shared definition. Following this link shows what response branches the trader **might** offer; not what your NPC has 'attached.' See response menu vs. capability."*

### Step 2 — On `interactions:GUITrade`

The modder lands on the trade-opener detail page. The Fields block surfaces `aInverse` as a labelled list with one row per response branch.

> **What the site shows:**
>
> - A dismissable contextual banner at the top: *"This is a response menu. Branches listed here are the responder's possible reactions to the petitioner's `<this interaction>`. Each branch is gated by its own `CTTestUs` / `CTTestThem`; failures are filtered out at runtime, so a branch's presence in the list does not mean any given NPC offers it."*
> - Each `aInverse` row shows the target interaction (linked), and a derived **gate pill** summarising the target's `CTTestUs` / `CTTestThem`. For `GUITradeAllowOKLGFixer`, the pill reads *gated by `TIsOKLGFixer`*.
> - Hover the pill: *"This branch only fires if the trader has `IsOKLGFixer`. Click to see what grants `IsOKLGFixer`."*
> - The `,[us],[them]` role-suppressor token is shown on rows that use it, with a tooltip explaining role-flip semantics. (See coverage-gap follow-up below — schema gloss enrichment carries this.)

### Step 3 — Following the gate

The modder clicks through the gate pill on `GUITradeAllowOKLGFixer`'s row. They land on `conditions:IsOKLGFixer`.

> **What the site shows:**
>
> - A derived **"How is this granted?"** section, computed by scanning every condowner / loot / trigger / lifeevent / pledge for grants of this condition. For `IsOKLGFixer`: empty under "Static templates," then two rows under "Plot-driven only" — `CONDTraderNPCOKLGFixer` and `CONDPLOT_NewOKLGFixer_FixerConds`. Each row carries a folder badge and a `strType` badge.
> - The plot path's row links to its selection predicate `CTPLOT_NewOKLGFixer_FixerNew_Make` and shows a one-liner of `aReqs`: *"requires `CareerCriminal` or `CareerCriminalPast` (OR), forbids `IsPlayer` / existing `IsOKLGFixer` / `IsRobot`."*
> - A dismissable note at the top: *"This condition has **no static template grant**. It is only attached by plot dispatch. Modders building NPCs from scratch will not inherit it unless they pull a fixer-specific bundle deliberately."*

The modder reads the predicate. Their vendor isn't a career criminal. They close the tab, confident the branch never applies. No Discord question needed.

---

## What the explorer needs to support this

Each item is marked **shipped** / **partial** / **proposed** so the gap is explicit.

- **"Response menu" framing on every interaction's `aInverse`** — banner explaining that branches in `aInverse` are CTTest-gated response options of the *other* party, not capabilities the parent interaction grants. — *proposed.*
- **Per-row gate pill** showing each `aInverse` row's target's `CTTestUs` / `CTTestThem` summary — *proposed.* Today the test names are buried in the linked-target's Fields block; a modder reading the parent has to click through every row to learn whether it would even fire.
- **Derived "How is this granted?" section on Condition detail pages** — collects every CO entry, loot bundle, lifeevent, or trigger that grants the condition, broken out into static-template grants vs. plot-driven grants. — *proposed.* The `IsOKLGFixer` case is the canary because the answer is "neither statically — only via plot," and that fact alone resolves the misread.
- **Glossary entry for `aInverse`** that leads with the chat → chat-reply example and the `,[us],[them]` role-suppressor — folded into the schema overlay's field description so the explainer surfaces inline, not only on a separate Glossary tab. — *proposed.* See coverage-gap follow-up below.
- **Plot-grant predicate inline on the grant row** — when a condition is plot-granted, the `CTPLOT_*_Make` selection predicate's `aReqs` should be summarised in plain language alongside the grant row, not require a separate click. — *proposed.* For `IsOKLGFixer`, the one-liner *"requires `CareerCriminal` or `CareerCriminalPast`"* is the load-bearing fact that ends the modder's investigation.

---

## Coverage-gap follow-ups

Two non-UX items the investigation surfaced. Track here so they aren't lost:

- **`comment_mod/data/schemas/interactions-schema.json`** — the overlay's `aInverse` description is technically correct but loses the chat → chat-reply example *and* the `,[us],[them]` role-suppressor mechanic that the base game schema explains (`data/schemas/interactions-schema.json`). Folding the base-schema wording in would let the explorer surface the better gloss without a separate UI item.
- **`IsOKLGFixer` is a clean canonical example** of "a condition that no static template grants — only a plot does, and only to NPCs matching a specific career filter." Worth flagging in `notes/coverage-gaps.md` as the reference example for plot-attached-only conditions; future user stories that touch plot-driven NPC traits can point at this one.

---

## Acceptance criterion

A modder who has built a custom humanoid NPC vendor and is inspecting its trade flow on the explorer reaches a confident answer to the question *"Does my vendor have the black market interaction?"* in **under 3 minutes**, without needing to ask on Discord, and articulates the answer correctly:

> *"No. The branch is in the trade opener's response menu, gated on `IsOKLGFixer`. That condition is only granted by the OKLG fixer plot, which only selects career criminals. My vendor doesn't qualify, so the branch never fires."*

The acceptance test is reading-the-data-correctly, not editing — a "phew, I don't have to fix anything" outcome. The explorer's job here is to prevent a wasted half-hour, not to enable a new edit.
