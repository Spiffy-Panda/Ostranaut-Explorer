# Wiki → Modder & Newcomer Onboarding Notes

**Scope note.** CLAUDE.md and PROJECT-PITCH.md set the wiki crawl scope as
`Modding/*` only — those are the pages with the field-to-folder reference
info we actually need. This file documents what was learned from a
*broader* sweep: ~24 player-facing pages (Basic_Controls, User_Interface,
Debug, plus Main Mechanics) crawled to extract the slices that turn out to
be modder-relevant — debug commands, stat-bar / `Stat*` strName mapping,
in-game UI patterns the explorer mirrors, and so on. Treat this file as
*opportunistic cross-validation material*, not as the canonical
modding-page corpus. The Modding/* extraction lives in
`comment_mod/wiki_review_queue.md` (see PROJECT-PITCH).

Each section cites its source wiki page and cache path. Tracks three things
per page: **migration recommendation** (what to copy/host), **site sprinkles**
(bits that belong embedded in data pages), and **cross-validation notes**
(things the wiki surface lets us audit against the data).

---

## Basic Controls

**Source:** https://ostranauts.wiki.gg/wiki/Basic_Controls
**Cache:** `wiki_cache/markdown/Basic_Controls.md`

### Migration
All six keybind tables (Camera, Ship, Time, Inventory, Special, Meta) are
ready to replicate verbatim as a static `/help/controls` page in the site.
No transformation needed — render as HTML tables, strip the wiki image syntax
(replace keyboard-icon filenames with plain key labels or a simple CSS pill).

### Site sprinkles

- **F3 = Debug Console** — surface this inline anywhere the site references
  the debug system (e.g. condition detail pages that suggest `addcond` testing).
  Copy: *"Open the debug console with F3."*

- **Z = Eyedropper** — copies an object's type identity to the cursor. Useful
  context on condowner/item detail pages: *"In-game, press Z over an object to
  grab an instance of its type — handy for testing spawned items."*

- **`↑` = Debug (Meta Controls)** — the arrow-up key opens the debug menu.
  Relevant context near the `unlockdebug` console command note.

- **CapsLock = Cycle Crew** — useful framing on crew/condowner pages: this is
  how players switch active character, which determines which condowner the
  `addcond`/`getcond` commands target when no name is specified.

- **Ship Controls overlap with Camera (WASD/QE)** — only active while piloting.
  Worth a note on the Flying or Ship pages: *"WASD and Q/E change meaning
  when piloting — they control thrust and rotation instead of camera."*

### Cross-validation
None directly — keybinds don't map to data objects. The existence of F3 as a
debug toggle is a sanity-check that the Debug page is reachable in-game.

---

## User Interface

**Source:** https://ostranauts.wiki.gg/wiki/User_Interface
**Cache:** `wiki_cache/markdown/User_Interface.md`

### Migration
No full-section migration needed. Content here is mostly game orientation;
the pieces worth hosting are already broken into sprinkles below. One
exception: if the site eventually has a /help/ui overview page, the **PDA
Apps table** and the **Stat Bars table** are both clean reference material
to embed there.

### Site sprinkles

**Stat Bars → condition name mapping**

The UI page names the eleven visible stat bars. These map directly to `Stat*`
conditions in the data. The mapping is the primary cross-validation target
(see below), but it also provides **player-facing names** for use on condition
detail pages:

| UI bar label       | Condition (to confirm) | Notes from wiki                                               |
|--------------------|------------------------|---------------------------------------------------------------|
| Gas Pressure       | StatO2 or similar      | See: Managing Atmosphere                                      |
| Gas Temperature    | (ambient stat)         | See: Managing Atmosphere — HVAC                               |
| Body Temperature   | (body stat)            | Impacted by gas temp and health conditions                    |
| Pain               | StatPain or similar    | Indication of physical injury                                 |
| Satiety            | StatHunger or similar  | Food-related                                                  |
| Hydration          | StatThirst or similar  | Drink-related                                                 |
| Encumbrance        | StatGrav               | "Currently only impacted by G-force during ship acceleration" — confirms StatGrav = encumbrance; affects movement speed and fatigue gain |
| Bowels             | (bowels stat)          | Relieved at toilet                                            |
| Fatigue            | StatFatigue or similar | Increases with activity, recovers sitting                     |
| Sleep              | StatSleep or similar   | Recovered at bed; impacted by roster schedule, bed quality, traits |
| Hygiene            | StatHygiene or similar | Affects health and social impact                              |

Condition name column is TBD — cross-reference `data/conditions/` strNames
against these labels. Once confirmed, each `Stat*` condition detail page
should display its player-facing bar label.

**MTT (Multi Tooltip) — right-click picker**

When a player right-clicks a tile, the MTT opens showing every object on
that tile with its name, condition, and owner. For a condowner NPC it shows
traits, skills, emotional state, and equipment paperdoll. Relevant framing
on condowner detail pages: *"Right-click a character in-game to see their
live condition state in the MTT."*

Multiple right-clicks cycle through overlapping objects. This is the
player's primary way to inspect individual condowners in the live game —
validates why the data explorer mirrors that "per-object detail" pattern.

**Autotask (AI behavior)**

AI behavior is driven by conditions and interactions. When Autotask is
enabled, the character acts on needs (eat when hungry, sleep on sleep shift,
etc.) — meaning the `Stat*` conditions and their threshold conditions are
directly observable through this mode. Useful framing on interaction/condition
pages for modders: *"Autotask mode exercises this condition's thresholds
automatically — enable it to test changes."*

**Event Log color coding**

Useful context for modders watching condition effects in-game:
- Light gray = neutral events
- Red = negative effects
- Green = positive effects
- Blue = communications, dialogue, plot events
- Bright red = combat

Sprinkle on condition detail pages that have visible in-game effects:
*"Condition changes appear in the event log (bottom bar). Red/green coding
reflects whether the effect is negative/positive."*

**Super Fast Forward (SFF)**

SFF simulates up to 6 hours. During SFF, work is simulated but tasks don't
complete, and random parts may be repaired. The UI warns of imminent
dangers before starting. Useful context on any pages relating to scheduled
tasks or crew automation — SFF is the test harness for time-sensitive
conditions.

**Debug Console entry (from Overview section)**

The UI page briefly describes the Debug Console as "a window for inputting
commands for testing, troubleshooting, and modifying game behavior in a way
that may be considered cheating and/or game breaking." This framing matches
the Debug page's own warning. Consistent to use this as the one-line
description wherever we link to debug docs.

### Cross-validation

The stat bars table is the main cross-validation hook: once we confirm which
`Stat*` strNames correspond to which bars, we can audit:
1. Do all eleven bars have a named `Stat*` condition in `data/conditions/`?
2. Do those conditions have `Thresh*` counterparts?
3. Are there `Stat*` conditions with *no* corresponding UI bar (internal-only stats)?

This audit should happen early — it validates a significant slice of the
conditions folder and surfaces any orphan Stat conditions the wiki doesn't
mention.

---

## Debug

**Source:** https://ostranauts.wiki.gg/wiki/Debug
**Cache:** `wiki_cache/markdown/Debug.md`

### Migration
**Migrate the full commands table** to a `/help/debug` page on the site.
All ~20 commands are useful for modders. The spoiler section (`meatstate`)
can be collapsible. The formatting note (spaces → underscores in names,
quoted args for multi-word strings) belongs at the top of the page, not
buried.

The wiki carries a warning that console commands can break saves and may be
considered cheating — preserve a paraphrased version on the migrated page:
*"Console commands can break your saves. Back up first."*

Open the console with **F3** (or `↑` for the debug menu).
Color coding: pink = command failed, purple = command succeeded.

### Modder-critical commands

These deserve extra prominence on the migrated page and as inline hints
on data pages:

| Command     | Why it matters for modding                                              |
|-------------|-------------------------------------------------------------------------|
| `addcond`   | Adds a condition to a condowner by strName. Directly validates our condition + condowner index. Syntax: `addcond <name> <condStrName> <value>` |
| `getcond`   | Lists conditions on a condowner, supports partial strName match. Useful for auditing active state during testing. |
| `spawn`     | Spawns a loot entry by strName into the player's inventory or nearby. Validates that loot/condowner strNames are correct. |
| `verify`    | Verifies all game JSON files. **Modders should run this after editing any JSON file.** Output confirms whether the game can load modified data. |
| `unlockdebug` | Unlocks debug hotkeys and enables the debug overlay (hotkey: BackQuote). The overlay is the in-game equivalent of our data explorer — lets modders inspect live state. |
| `kill`      | Adds Death condition to a condowner by name. Tests death conditions/triggers. |
| `addcrew`   | Spawns random crew. Quick way to get test subjects for condition testing. |
| `rel`       | Sets social relationship conditions between humans. Tests relationship-condition interactions. |

Other commands (`echo`, `crewsim`, `clear`, `bugform`, `damageship`,
`breakinship`, `oxygen`, `meteor`, `lookup`, `toggle`, `ship`, `summon`,
`skywalk`, `plot`) are useful for general testing but not modder-specific.

### Site sprinkles

- **On every `Stat*` condition detail page:** *"Test in-game: `getcond
  <character> <strName>` to read current value; `addcond <character>
  <strName> <value>` to set it."*

- **On condowner detail pages that represent items/spawnable objects:**
  *"Spawn in-game: `spawn <strName>`"*

- **In any modder workflow doc (README, Comment Mod, build instructions):**
  Add `verify` as step 1 after any JSON edit:
  > *"Run `verify` in the debug console to confirm your JSON is loadable
  > before testing. Pink output = parse error; fix before proceeding."*

- **On the site's health/lint page (when built):** Note that `verify` is
  the in-game equivalent of our build-time lint step — they should agree.
  A condition that passes `verify` but fails our cross-reference check
  means a dangling ref, not a parse error.

### Cross-validation

- `addcond`/`getcond` syntax confirms: condowner lookup is by
  `strName`, `strNameFriendly`, or ID. Our index covers strName; the
  "friendly name or ID" fallback is game-side only.
- `spawn` takes a strName directly → confirms item strNames in
  `condowners/` (or `loot/`) are the canonical lookup key.
- `verify` output = the game's own JSON parse check. If our build passes
  but `verify` fails on a modded file, the game uses something our parser
  doesn't check (LitJson quirks, field casing, etc.). Good test to document
  in modding onboarding.

---

## Haiku look ahead

Priority scoring (0–10) for scanning main mechanic files. 0 = skip entirely. 10 = important counter-intuitive info, soft blocking next step.

| Page | Score | Notes |
|------|-------|-------|
| Health and Safety | 9 | Stat/ThreshStat definitions + stat bars → condition mapping (primary cross-validation hook) |
| Managing Atmosphere | 9 | Gas mechanics: O2/N2/CO2 pressures, temp ranges. Counter-intuitive: gas instant-equalizes vs. slow leak through doors. Blocks atmosphere condition work. |
| First Aid | 8 | Injury/disease/treatment conditions. Validates health-related condition effects. |
| Traits | 8 | Cross-validates traits in conditions/condowners. Wiki list validates index coverage. |
| Skills | 7 | Internal skill names (SkillEngCivil format) confirm strName patterns. Validates conditions folder. |
| Ship Building | 7 | Ship schemas, room designations. Moderate priority for data structure understanding. |
| Character creation | 6 | Newcomer onboarding; starting stats/traits. Gameplay-heavy, lower data explorer relevance. |
| Crew | 5 | Hiring/control mechanics. Frames interactions/condowners but no deep struct insights. |
| Orders | 4 | Build/ship management UI. Gameplay-focused, low data-structure relevance. |
| Gameplay Loop | 3 | Big-picture gameplay orientation. Low data-explorer relevance; skip for now. |

---

## Up next (not yet processed)

Remaining Main Mechanics pages from the wiki home page. Priority order
suggested below based on data-explorer relevance:

| Page | Relevance | Notes |
|------|-----------|-------|
| Traits | Cross-validation | Traits are likely `conditions/` or `condowners/` — list from wiki validates our index |
| Character creation | Newcomer onboarding | Explains starting stats, trait picks; frames conditions/condowners for beginners |
| Health and Safety | Site sprinkles | Stat threshold effects — directly maps to Thresh* conditions |
| Crew | Site sprinkles | Roster, shifts, duties — frames interactions/condowners |
| Orders | Site sprinkles | Install/task queue — frames interactions |
| Gameplay Loop | Newcomer onboarding | Big-picture orientation, low data-explorer relevance |
| Ship Building | Modder reference | Ship data schemas |
| Managing Atmosphere | Sprinkles | Gas condition names confirmed here |
| Skills | Cross-validation | Skill names → likely `conditions/` strNames |
| First Aid | Cross-validation | Injury/treatment conditions list |
| All others | Lower priority | Mostly gameplay, low modder/data relevance |
