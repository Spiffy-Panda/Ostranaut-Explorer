# Wiki review queue

Items the deterministic extractor (`scrap_scripts/python/03_wiki_extract_schemas.py`)
couldn't confidently resolve. Review in batches; check the box once handled
(either by adding to `PAGE_TO_FOLDER`, editing the wiki page, or hand-curating
the affected schema file).

## Conditions

- [ ] **strName** — no .json target found in description
  > This is the code name of the condition as referenced in data types and places within code.
- [ ] **strNameFriendly** — no .json target found in description
  > This is the user accessible name in the Log, tooltips and the MTT, usually longer and more descriptive.
- [ ] **strDesc** — no .json target found in description
  > A longer description that explains what the cond is and sometimes what it's for. Usually shown in tooltips when hovering…
- [ ] **strColor** — no .json target found in description
  > Display color of the cond on the MTT and in the Log when added/removed.
- [ ] **strAnti** — no .json target found in description
  > Antithetical cond (not required). First removes an antithetical before adding more copies of the cond. (E.g. Feeble and …
- [ ] **nDisplaySelf** — non-string-shaped field
  > Should the condition be displayed when inspecting oneself in the MTT or in the QAB. Many conditions are used outside of …
- [ ] **nDisplayOther** — non-string-shaped field
  > Like nDisplaySelf but for inspecting other people. Some conditions should be visible on oneself immediately but may requ…
- [ ] **nDisplayType** — non-string-shaped field
  > Differentiates where to display the cond on the MTT. - 0 : Regular cond list like a tag - 2 : Numerical Conds like press…
- [ ] **strDisplayBonus** — no .json target found in description
  > Extra details for factoring in how to display the conds. if nDisplayType 1, use this string as a unit. if nDisplayType 2…
- [ ] **fConversionFactor** — non-string-shaped field
  > Number to convert by when displaying the numerical value of the cond (currently unused by any conds).
- [ ] **bFatal** — non-string-shaped field
  > Whether the cond kills the CO gaining it.
- [ ] **bKO** — non-string-shaped field
  > Whether the cond knocks out the CO gaining it.
- [ ] **bAlert** — non-string-shaped field
  > Whether to slow down time when the main character gains this CO.
- [ ] **bResetTimer** — non-string-shaped field
  > Whether getting a new stack of this condition resets the duration.
- [ ] **bRemoveAll** — non-string-shaped field
  > Whether to remove ALL stacks of this condition when it gets removed, instead of the amount specified.
- [ ] **bRoom** — non-string-shaped field
  > Whether this condition is spread to the room.

## Modding__CondOwners

- [ ] **strID** — no .json target found in description
  > Unique identifier for save games and code "NPC_12847_John"
- [ ] **strCODef** — no .json target found in description
  > Type definition (links to Data:CondOwners) "COHuman" or "COWrenchBasic"
- [ ] **strName** — no .json target found in description
  > Default display name "John Smith" or "Wrench"
- [ ] **strNameFriendly** — no .json target found in description
  > Custom renamed version Your custom ship name
- [ ] **strNameShort** — no .json target found in description
  > Abbreviated for UI space "J. Smith" or "Wrench"

## Modding__Interactions

- [ ] **CTTestUs** — no .json target found in description
  > Does the actor meet requirements? Can't repair if you lack tools
- [ ] **CTTestThem** — no .json target found in description
  > Does the target meet requirements? Can't eat if target isn't food

## Modding__Loot

- [ ] **aCOs** — no .json target found in description
  > Direct outputs (items, condition equations, triggers). Same table as parent loot
- [ ] **aLoots** — no .json target found in description
  > References to other loot tables. Enables nesting/recursion. Same table as parent loot

## Modding__Pledges

- [ ] **strName** — no .json target found in description
  > string Yes Unique identifier
- [ ] **strType** — no .json target found in description
  > string Yes Pledge type (must be registered)
- [ ] **strNameFriendly** — no .json target found in description
  > string No Display name in UI
- [ ] **strIATrigger** — no .json target found in description
  > string Yes Interaction name that triggers pledge
- [ ] **strIAEmergency** — no .json target found in description
  > string No Emergency interaction name
- [ ] **strThemID** — no .json target found in description
  > string No Target: null, "[them]", "[3rd]"
- [ ] **bThemAllowDocked** — non-string-shaped field
  > bool No Allow target on docked ships (default: false)
- [ ] **bThemForgetOnDo** — non-string-shaped field
  > bool No Clear target after execution (default: false)
- [ ] **nPriority** — non-string-shaped field
  > int Yes Priority 1-10 (10 = highest)

