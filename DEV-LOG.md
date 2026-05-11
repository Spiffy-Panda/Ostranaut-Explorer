# DEV-LOG

Reverse-chronological. Add an entry before every commit — at minimum a one-liner, ideally a short paragraph when the change is non-obvious. Tag with ISO date.

---

## 2026-05-10 — fire-system handoff: flicker dropdown UX correction

Late catch on the Section 2a expansion: the handoff was framing the flicker-disable counter-play as "set `nFlickerAmount < 0`," which sounded like a magic-number / Custom-Parameters trick — and a player who screenshotted the Video settings tab pointed out (correctly) that there's no slider visible. The fix is to lead with the player-facing UI label instead of the raw integer.

`GUIOptions.cs:71-85` builds the dropdown from a three-entry dictionary literal: `{ -1 → "Off", 1 → "Soft", 2 → "Full" }`. Default is `nFlickerAmount = 2` ("Full") per `JsonUserSettings.cs:157`. So the counter-play is "open the options panel, find the Flicker Amount dropdown on the **General** tab (not Video), choose **Off**" — no Custom Parameters editing required. Tab placement confirmed against the live build in this repo (0.15.0.x) by the player after pointing.

Edits in [notes/handoff/fire-system-deep-dive.html](notes/handoff/fire-system-deep-dive.html): rewrote the Section-2a "User has flicker enabled" gate description to lead with the labelled dropdown, added the side-effect note (`Powered.cs:107-112` and `Visibility.cs:71-84` both branch on the same flag, so visual electrical flicker on lights also dies — most fire-averse players will accept the trade); rewrote the matching counter-play bullet under "In-game, by the player" the same way; added two confidence-table rows (dropdown-label mapping verified against `GUIOptions.cs:71-85`, General-tab placement verified in-game). Post-edit counts: 34 verified-ok (was 32), 3 verified-inferred (was 3 net — added two and promoted one).

Same fair-use posture as the prior wave: a new small JSON-style C# dictionary literal (3 keys, 3 string values) is the only new excerpt; everything else is rewording of existing prose.

---

## 2026-05-10 — fire-system handoff: Section 2a expansion + site-wide discoverability fix

Follow-up to the fire-system handoff. Two motivations: (1) the original Section 2a ("Continuous background sparking — `Ship.Sparks()`") was a one-paragraph summary that elided several practically-important behaviours; (2) the handoffs as a section were only discoverable from `explorer.html`'s nav — visitors landing on the root [index.html](src/Ostranauts.Site/index.html), or any of the inspector pages, would never find out the handoffs section existed.

**Section 2a expansion in [notes/handoff/fire-system-deep-dive.html](notes/handoff/fire-system-deep-dive.html).** Broken into six sub-headings: pre-draw gates (with the `nFlickerAmount < 0` user-setting kill switch called out — a player can disable background sparking entirely from the graphics options, and this is worth knowing when troubleshooting "fires keep starting on my fireproofed ship"); the per-frame chance breakdown (`0.02 × time-scale × mapICOs.Count/1200`, so big ships and fast-forward both increase fire risk); the shuffled-candidate-list mechanism (one Sparks() call pops one candidate, list rebuilt from fresh state when drained); the per-candidate check (power-network gate, ≥50 %-damage gate, one-spark-per-call cap); the self-damage death-spiral (each spark adds `min(0.01, StatDamageMax/800)` to its source's StatDamage, eventually pushing it past `IsDamaged` and removing it from `TIsSparkableConduits` — sparks are self-terminating for the item emitting them); and the `break`-on-fail iteration quirk. Added a worked back-of-envelope estimate (~1 fire per ~3 s of walkaround on a damaged-but-pressurised ~1000-CO rust bucket if the room is hot and Earth-mix). Added an Option F-1b modder-troubleshooting callout: if a player reports "I fireproofed everything and fires still start," it's almost always because the spread roll lands on some *other* untagged flammable target in the same room, not because the sparkable source was missed — audit room contents, not just the sparkable.

Three new rows in the confidence table — `nFlickerAmount < 0` disables sparking (verified at `Ship.cs:2062-2065`), one-spark-per-call + ship-size scaling (verified at `Ship.cs:2066-2101`), and the self-damage spiral (verified at `Ship.cs:2092-2095` + `condtrigs.json:2369`). Bumped a row in the counter-play list to add "Disable the flicker setting" as a player-side mitigation that doesn't require modding. Verified counts post-edit: 32 verified-ok, 3 verified-inferred, 9 H4 sub-headings (up from 5), 4 details disclosures, 5 tables. Page is now ~52 KB / ~13 000 px tall.

**Discoverability fix — three site-wide changes:**

1. **Root index card.** Added an 11th tab-card to [src/Ostranauts.Site/index.html](src/Ostranauts.Site/index.html) for "Handoffs" (linking to `handoff/`), at the end of the existing grid. Card summary calls out fire/sprite/OKLG/needs guides as concrete examples and surfaces the verified-vs-inferred tagging convention.
2. **Sibling-page nav links.** Added `<a href="handoff/">Handoffs</a>` to the `<nav>` of [ship-inspector.html](src/Ostranauts.Site/ship-inspector.html), [save-inspector.html](src/Ostranauts.Site/save-inspector.html), [save-map.html](src/Ostranauts.Site/save-map.html), and [rooms-reference.html](src/Ostranauts.Site/rooms-reference.html). Previously only `explorer.html` had this link, so anyone walking into the site through the inspector flow (the most common path for save-edit work) would never see the handoffs section.
3. **No layout regressions.** Mirrored all edits into `build/`, verified in preview at `localhost:8765`: root index now has 11 cards with `Handoffs → handoff/` as the last entry; all four inspector pages return their full nav list with the new `Handoffs` entry; the handoff index serves at `/handoff/` with status 200 and renders unchanged.

This is the "the handoffs section needs to be discoverable from the site's actual landing points" follow-up that should have been part of the original fire-system handoff commit but slipped through. Same fair-use posture as the original (factor 1-2-3-4 unchanged — only adds modder-facing prose and nav links, no new game data quoted).

---

## 2026-05-10 — handoff: fire system deep dive

Added [notes/handoff/fire-system-deep-dive.html](notes/handoff/fire-system-deep-dive.html), a modder-facing reference for everything that controls fire in the game: ignition paths, spread mechanics, host/crew damage, gas + heat side-effects, doom-loops, counter-play, and the JSON-vs-code split for each tunable. Indexed from [notes/handoff/index.html](notes/handoff/index.html). Twenty-one verified claims, three inferred (the "fires self-arrest by running out of O<sub>2</sub>" practical-consequence claim, the BeatManager `dictEventChances` seed-file path, and the extinguisher-survives-burning-room claim). All structural facts (fields, condtriggers, attack-mode JSON shapes, GetRoomChance formula, tier coefficients) cited against either a `data/` JSON path or a `decomp/Assembly-CSharp/` `.cs:line` location.

Key findings worth surfacing:

- **The room-chance formula** in `VFXFire.cs:472-482` is `(StatGasPpO2² × StatGasTemp) / (20 × StatGasPressure × 293)`. At Earth-mix that's ~21 % per draw, then multiplied by the target's tier (Fireproof 0 / Flammable 6× / Burnable 2.5× / nothing 0.25×) and a per-fire amplifier of 5× before the actual coin-flip in `VFXFireInstance.ProcessFireEffects`.
- **Four ignition paths.** Ship-weapon hits (`DamageSystem.ApplyDamageToCell`, gated by per-attack `fFireChanceCoeff` from `data/attackmodes/shipAttacks/shipAttacks.json`); damaged powered items / power conduits (`Ship.Sparks` + `VFXSparks.AddSparkAt` → `VFXFire.Spread(0.5×)`); crew welding (`Crew.Sparks` setter at `0.005×`, with `IsMaintenanceTechNPC` exempt — found in `Crew.cs:787-791`); explosions (`Explosion.cs:178-194`, no `fFireChanceCoeff` multiplier so flammable items light at 90 %).
- **The user-asked-about doom-loop is real and lives at the spark↔damage↔fire boundary**: damaged conduit → spark → `Spread(0.5×)` → fire on flammable adjacent → fire damages new conduits → more sparks. The fire's damage to the host is `Random.Range(1, 3) × tier modifier` per 5 s tick (`VFXFireInstance.cs:141-166`), so a flammable cushion takes 1–3 / tick, a steel wall 0.25–0.75. The 2nd-order loop is **room heating** (Stefan–Boltzmann radiating off `StatSolidTemp=1073K` via `Heater.cs`) pushing `StatGasTemp` up, which is in the numerator of `GetRoomChance` — so a single fire literally raises the spread chance of every other fire in the same room while it burns. Self-arrests when O<sub>2</sub> bottoms out (PpO<sub>2</sub> in numerator squared).
- **What's data vs. code.** `fFireChanceCoeff` (per ship-weapon), the sparkable/spreadable condition trigger sets, the per-item `IsFlammable`/`IsBurnable`/`IsFireproof` tagging, fire's heat output (`StatSolidTemp`, `StatHeatArea`), and gas conversion ratios are all editable from JSON. The tier multipliers (6× / 2.5× / 0.25× for spread, 0.9 / 0.5 / 0.25 for ignition), `MAX_FIRES = 170`, `DURATION = 5.0`, `Crew.Sparks`'s `0.005`, and the `Heater` math are hard-coded in C#.
- **Both test saves have zero active fires** (verified by parsing all 141 ships in `cares catherine ruiz_1778427283.zip` — `aFires` empty everywhere, no `SysFire` in any `aCOs`). The page calls this out so modders don't expect to find fires in the inspector. The 127 `bPrefill == true` derelicts haven't run their first-load break-in yet — fires only get going on derelicts after the player boards once and `BreakIn()` damages systems into sparkable territory.

Built two scrap scripts as part of the investigation: [scrap_scripts/python/13_fire_save_search.py](scrap_scripts/python/13_fire_save_search.py) (per-ship fire/spark/burn counts across a save zip) and [scrap_scripts/python/14_rustbucket_fire_audit.py](scrap_scripts/python/14_rustbucket_fire_audit.py) (single-ship audit dumping sparkable conduits + per-room `GetRoomChance` previews). Both anchor via `Path(__file__).resolve().parents[2]` so they're invocation-location independent per the [CLAUDE.md](CLAUDE.md) scripts policy.

Verified in preview at `http://localhost:8765/handoff/fire-system-deep-dive.html` after copying the file into `build/handoff/`. Page is ~12 000 px tall (long doc) — `preview_screenshot` times out on the full render but `preview_snapshot` + `preview_eval` confirmed structure: 12 H2 sections, 5 tables, 4 details disclosures, 6 callouts, 29 verified-ok tags, 3 verified-inferred tags. CSS theme matches the existing handoffs (same `--bg`, `--accent`, callout-warn/good/pit variants).

**Pre-push fair-use note.** Factor 1 transformative — this is a modder reference explaining JSON-and-code mechanics, not a player-facing walkthrough of fire as a gameplay feature. Factor 2 our prose + field names + condtrigger names + small JSON excerpts (the `SysFire` condowner record, the `Fire` respire profile, three small condtrigger one-liners) + C# identifier-level citations; no game art, no narrative text, no large strName tables. Factor 3 the largest JSON quote is the 20-line `Fire` respire profile from `gasrespires.json` — minimal representative extract. C# is cited by line range, not pasted. Factor 4 the page is useless without a running install of Ostranauts; no substitution risk. All four factors clear; pushing.

---

## 2026-05-10 — handoff: sprite scaling bump-map bug — flagged as decomp-snapshot-only

Tightened the inventory bump-map bug claim in [notes/handoff/sprite-scaling-for-item-mods.html](notes/handoff/sprite-scaling-for-item-mods.html) to make it clear the verification is against the `decomp/Assembly-CSharp/` snapshot in this repo, which predates the current live game build. Patches have shipped since; whether `Item.SetUpInventoryMaterial`'s `_BumpMap` mis-binding (loading `strImgOverride` instead of `strImgNormOverride`) is still present in the live `Assembly-CSharp.dll` is unverified. Modders who depend on the bug's presence/absence should re-decompile their local DLL and re-check `Item.cs:447-449`.

Edits, all in the same file: (a) added a "snapshot caveat" paragraph to the existing decomp-explainer callout near the top of the page, scoping the caveat to engine-bug claims (structural claims like field names and footprint formulas move slowly and remain trustworthy); (b) reworded the pit-callout that announces the bug to say "verified against an older decomp — may be patched in the live build" and added a third paragraph telling readers how to verify against their own decomp; (c) re-tagged the confidence-table row from `verified` to `verified vs. older decomp`; (d) softened the quick-reference card's "broken in the engine regardless" line. No structural changes to the page, no new sections, no other claims touched.

Fair-use four-factor check: still clears all four. This edit only reframes a claim that's already on the page — adds caveat language, doesn't add new game prose or new excerpts. Factor 3 unchanged (no new C# or JSON quoted). Pushing to GitHub.

---

## 2026-05-10 — handoff: sprite scaling for item mods (v2)

Additive v2 pass on [notes/handoff/sprite-scaling-for-item-mods.html](notes/handoff/sprite-scaling-for-item-mods.html). Three additions:

**1. Installables section.** Wall-mounted fixtures (light fixtures, capacitors, reactor modules, etc.) use two separate item definitions linked by an `installables/` record. The installed form uses `TILFixtureAdds` sockets and carries `IsInstalled=1.0x1` / `IsHiddenInv=1.0x1` starting conditions; the loose (inventory) form uses `TILItemAdds` sockets and can be freely carried. Each form has its own `strImg` and the standard `nCols × 16 px` / `(aSocketAdds.Count / nCols) × 16 px` formula applies independently to each. Worked example: `ItmCapacitor01` (2 wide × 5 tall, 32×80 px installed) vs. `ItmCapacitor01Loose` (2 wide × 3 tall, 32×48 px loose), linked via `Capacitor01Install` / `Capacitor01Uninstall` records in `data/installables/installables.json`. The sprite scaling code path is identical for installables — no special branch.

**2. Bump map bug confirmed.** `Item.cs:447-449` (`SetUpInventoryMaterial`) guards on `strImgNormOverride != "blank"` but then loads `strImgOverride + ".png"` (the diffuse texture) for `_BumpMap` instead of `strImgNormOverride + ".png"`. The world-render path (`DataHandler.GetMaterial`, `DataHandler.cs:3464-3466`) does this correctly. Effect: inventory icons receive no functional normal map even when `strImgNorm` is set — the bump-map slot gets a second copy of the diffuse texture. Was flagged as "unverified aside" in v1; now marked verified.

**3. Decomp foldouts + decompiled-source callout.** Added a green callout near the top explaining what the `decomp/Assembly-CSharp/*.cs` files are (ILSpy/dnSpy decompile of `Assembly-CSharp.dll`, ground truth for what the engine reads). Added `<details>`/`<summary>` foldouts citing specific C# lines for every claim that previously relied on JSON-only evidence: `Item.cs:271-272` (logical footprint), `Item.cs:282-289` (visual footprint + `_Aspect`), `GUIInventoryItem.cs:156` (no separate icon field), `DataHandler.cs:3464-3468` (world BumpMap binding), `Item.cs:447-449` (inventory BumpMap bug), `CondOwner.cs:7357-7363` (mapPoints offsets only). Confidence table updated: **9 verified, 0 inferred** (was 6 verified, 0 inferred).

**Pre-push fair-use note (v2 additions).** Factor 1 transformative — modder explainer, not game guide. Factor 2 our prose + C# identifiers from decompile + field names; no game art or string tables. Factor 3 two small JSON excerpts (10 fields each) from `data/items/items.json` and `data/installables/installables.json` as representative examples, plus 5–12 line C# snippets per foldout — minimal representative extracts. Factor 4 no substitution risk; data is useless without the local game install. All four factors clear.

---

## 2026-05-10 — handoff: sprite scaling for item mods

Added [notes/handoff/sprite-scaling-for-item-mods.html](notes/handoff/sprite-scaling-for-item-mods.html), a modder-facing explainer for the three-symptom cluster (too-big / off-center / no inventory icon) that comes from mismatching PNG pixel dimensions against the game's logical tile footprint. Investigation confirmed all six claims as verified (0 inferred) against decompiled C# and live data:

1. Tile-size constant is **16 px** — hard-coded literal in `Item.cs:285-286`, `GUIInventoryItem.cs:173,177`, and `CondOwner.cs:7360`.
2. Logical footprint is `nWidthInTiles = jid.nCols` / `nHeightInTiles = aSocketAdds.Count / jid.nCols` — confirmed at `Item.cs:271-272`, cross-checked against four items in `data/items/items.json`.
3. Visual footprint is `vScale = round(texturePx / 16f)` clamped to minimum 1 — `Item.cs:285-286`; same formula in the animated path at `Item.cs:196-197`.
4. Inventory icon uses the same `strImg` PNG; there is no separate icon field on `JsonItemDef` — `GUIInventoryItem.cs:156`, `JsonItemDef.cs` field list.
5. `strImgNorm` is optional; drives the `_BumpMap` shader slot — `Item.cs:447-449` (`SetUpInventoryMaterial`).
6. `mapPoints` controls named interaction-point offsets only (used by `GetPos` in `CondOwner.cs:7357-7363`), not the sprite anchor — sprite origin is always the renderer center set in `Item.ResetTransforms`.

Motivating observation: community thread, BlueBottleGames Discord #modding-discussion, 2026-05-08 to 2026-05-10.

Also updated [notes/handoff/index.html](notes/handoff/index.html) with a new list entry for the page.

**Pre-push fair-use note.** Factor 1 transformative — modder tooling explaining mechanics, not reproducing game prose. Factor 2 our prose + field names + C# identifiers; no game text or art included. Factor 3 two short JSON snippets (field names + values) from `data/items/items.json` as representative examples — minimal extract, well within fair use. Factor 4 the page is useless without the game's data files present locally; no substitution risk. All four factors clear.

---

## 2026-05-10 — save-map page (ship positions from objSS)

Shipped a save-map view at
[src/Ostranauts.Site/save-map.html](src/Ostranauts.Site/save-map.html)
that plots every ship in an Ostranauts save zip at its
`objSS.(vPosx, vPosy)` position. Icon area is sqrt-scaled from
`fShallowMass` (a 132 t station vs. a 1 t pod is ~11× area, not 130×)
and icons are colored by `fLastVisit` existence — blue if the player
has ever visited (`fLastVisit > 0`), gray if not (`0.0`). Hovering an
icon shows a tooltip with public name / regID / designation / make
& model / mass / orbit-body / visit state; clicking locks a detail
panel below the canvas with the full metadata and a deep link into
[save-inspector.html#/ship/<reg>](src/Ostranauts.Site/save-inspector.html)
for that ship.

**Per-ship metadata lives at end-of-file** (`objSS` and `fShallowMass`
are written *after* the giant `aItems[]` / `aRooms[]` blocks in the
save's per-ship JSON), so there's no fast header-only path — every
ship must be fully decompressed and JSON-parsed. The page parallelizes
4 decompressions at a time via `Promise.all` workers, re-rendering the
canvas after every batch so the map fills in visibly while loading.
For the test save (`cares catherine ruiz_1778371145.zip`, 142 ships,
~250 MB total uncompressed) the full plot lands in ~5-10 seconds.
Discarded fields are GC'd immediately — only the small per-ship
record (reg, name strings, mass, position, visit timestamps) survives.

**Phyllotaxis spiral for co-located ships.** A station and the ships
docked at it share an exact (`vPosx`, `vPosy`) within ~6-decimal
precision; without per-ship offset the 13 visited ships in the test
save rendered as a single blue dot occluded behind the station's gray
disk, making the "colored by last visited" signal invisible. The fix
groups ships by quantized (x, y) and spirals each cluster's members
out by small canvas-pixel offsets (5 px × √i) along the golden angle.
Within a cluster, unvisited+heaviest sort to the center and visited
land on the outer ring so the visit-state color is most visible at
the periphery. Hit-testing applies the same offset, so clicking a
spiraled dot still maps to the right ship.

**Standalone module.** save-map.js doesn't share inspector-core.js —
the map page has no progress / bucket / room sections, only a canvas
plus picker plus selection panel. It does share `inspector.css`
(.ship-picker, .empty-hint, etc.) for picker UX consistency and adds
.map-canvas / .map-tooltip / .map-selected / .map-legend rules
beside the existing inspector styles. The vendored
[save-zip-reader.js](src/Ostranauts.Site/save-zip-reader.js)
(DecompressionStream-based, no third-party dep) is reused verbatim.

**Persistence.** None — the save-map is a read-only visualization; no
checkbox state to track. Like the save-inspector, the uploaded zip
itself is not persisted across reloads (re-upload required). Hash
routing is intentionally absent because the URL can't carry the zip
bytes the page needs to render anything.

**Cross-page nav wired.** Both ship-inspector and save-inspector now
link to the save map in their nav bar and in their picker's link
row. The save-map's picker links back to save-inspector ("drill into
one ship") and ship-inspector ("vanilla ships").

**Verified via preview.** Loaded the same 42 MB test save:
142 ships plotted in ~6 seconds, 13 visited / 129 not (matches a hand
count of `fLastVisit > 0` entries). Hovering over the spiraled blue
cluster pops the tooltip for individual ships (e.g. "Nothing To Lose
J-LMWS · Survey · Testudo Ibex · mass 23.1 t · orbiting 1036
Ganymed · visited"). Clicking locks the selection panel with the
full field set including `Position: 1.050504, -1.557869` and
`Visited: epoch 65627889354.8 (first 65627889249.4)`. Deep link
`→ Open J-LMWS in save inspector` resolves to
`save-inspector.html#/ship/J-LMWS`. Visit-state and mass signal both
read correctly in the rendered canvas (1024 blue pixels concentrated
into a single dot in the pre-spiral version became 3151 pixels
spread across a 75×68 ring after the spiral landed).

**Spiral removed, replaced with stack-list UX.** Modder feedback after
the cluster-coordinate fix: the phyllotaxis spiral was synthetic — the
spread it showed wasn't in the save file, and that obscured the game's
actual nav-display behavior. The three reference screencaps from the
in-game nav (`debug/` folder of save `1778427283`, 0.89 km / 480 km /
4894 km zoom range) show the game just renders each ship at its actual
position and uses log-scale zoom to resolve sub-km separations. Map
now matches: every ship plots at raw `vPos`, overlapping icons just
stack into a single visual dot, and a multi-hit hover/click surfaces
the list. `ZOOM_MAX` bumped from 50× to 1e9× so the modder can keep
scrolling until ships meters apart are individually distinct (data
has separations down to ~1e-8 AU ≈ 1.5 km — requires ~6e5× scale to
resolve as a pixel apart).

Stack interaction: hover over an icon → if 1 ship there, single-line
tooltip; if 2+, list-style tooltip with first 10 rows (regID, name,
mass, visit dot) plus "+ N others" footer. The tooltip's header line
shows the count and the most-common `boPORShip` across stack members
("87 ships at this pixel · near 1036 Ganymed"). Click → selection
panel below the canvas; if a stack, renders a scrollable list of every
ship at the pixel with click-to-swap, and the active ship's full detail
block + deep link to save-inspector renders below.

Verified: at autoFit on the test save, K-Leg collapses to a single
visited (blue) dot. Hover finds 87 ships there. Click locks the panel
with all 87 rows; clicking any swaps the detail block. At 60 wheel
ticks (~6.5e5× zoom centered on the cluster), the same canvas pixel
now overlaps just 2 ships (OKLG and OKLG_FLOT — 1e-5 AU apart in vPos,
on the edge of resolvable at that zoom).

**Cluster coordinate-frame fix.** The game stores `JsonShipSitu` such
that for any ship orbiting or docked at a body, `vPos` is the **body's**
absolute system-frame position and the actual ship-vs-body separation
lives in `vBOOffset` (typical magnitude ~1e-6 world units, sub-pixel at
any reasonable map scale). The math is verified at
[ShipSitu.cs:164,251](decomp/Assembly-CSharp/ShipSitu.cs):
`vPos = boReference.dXReal + vBOOffset`. Consequence: a station and
every ship moored to it all collapse to the same dot — they share the
station's `vPos`. Sub-stations of a port (OKLG, OKLG_RES, OKLG_FLOT,
OKLG_ATC, OKLG_NAV0, …) each declare themselves as their own BO and
end up at *nearly* the same `vPos` (differing by 1e-8 to 1e-4) too.

Initial map shipped with a phyllotaxis-cluster bucket of `EPS=1e-5`,
which was tight enough that sub-stations sometimes landed in
**different** buckets (round(1.05050/1e-5)=105050 vs.
round(1.05051/1e-5)=105051), defeating the merge and rendering K-Leg
sub-stations as separate single-ship dots a fraction of a canvas
pixel apart. The user reported "OKLG and OKLG_RES are far from one
another" — they weren't: same vPos to 8 decimals; the bucketing just
fragmented the cluster. Coarsened `EPS` to 1e-3 (1 milli-AU) so every
ship at K-Leg/Ganymed merges into one big spiral. The matched data
sample: OKLG (1.050504689989, -1.557869569732), OKLG_RES
(1.050504696633, -1.557869586158), OKLG_BIZ (1.050504694411,
-1.557869579891), OKLG_FLOT (1.050515128634, -1.557867884994), …
all now in bucket (1051, -1558) together with BWVN, B-REG, the
visited cluster, and the unvisited stragglers around Ganymed.

**Hollow center for big clusters.** The user also reported "the
cluster surrounds a random ship opposed to a hollow where Ganymede is
supposed to be." That random ship was the heaviest-unvisited at the
cluster (BWVN before the bucket fix, others after), sitting at spiral
index 0 — i.e. at the cluster's exact center. That center conceptually
belongs to the body these ships orbit; filling it with a member ship
reads as "this ship IS Ganymed." For clusters of size ≥3 the spiral
now starts at index 1 with an additional 10 px inner gap, leaving a
visible ~20 px hollow at autoFit (scales with zoom). Until we plot
bodies separately (a v2 — would require parsing
`objSystem.aBOs[]` from the top-level `<PlayerName>.json` GameSave
inside the zip), the hollow communicates "a body sits here" implicitly.

**Zoom + pan.** Wheel zooms around the cursor (deltaY → 1.15× per tick,
clamped to 0.4×–50×); the world point under the cursor is re-pinned
after every zoom step so the modder doesn't lose what they were
looking at. Drag-pan is left-mousedown + mousemove (tracked at
document level so dragging off the canvas keeps panning) with a 4 px
threshold to distinguish a pan from a click — pans suppress the
following mouseup-click so they don't accidentally select a ship.
Top-right corner has +/− buttons (zoom around the canvas center) and
a reset (⟲) button. The bottom-left scale hint adapts to current
effective scale, switching between AU / milli-AU / micro-AU as the
modder zooms in; current zoom multiplier renders in the bottom-right
when ≠ 1×. Cluster spiral offsets and ship positions both scale with
zoom (so a tightly clustered station's docked-ship spiral opens up
when zoomed in), but icon radius stays fixed (so tiny pods don't
disappear as you zoom out). Hit-testing applies the same view
transform so clicking a ship at high zoom still resolves correctly.
Verified: 6× wheel zoom centered on the visited cluster keeps the
Weaver's Needle (BWVN) ship pinned to the cursor pixel; reset returns
to auto-fit; drag dispatches without errors and re-renders.

**Pre-push fair-use note.** Factor 1 transformative — modder save-
visualization tool, no game prose. Factor 2 our prose + JS + Python,
no game prose included; canvas-rendered dots from numeric position
fields are not creative content. Factor 3 no new game data shipped to
the public bundle — save zips stay on the modder's disk (everything
client-side). Factor 4 useless without owning the game (you can't
produce a save to load without playing). Cleared.

## 2026-05-10 — save-inspector page + inspector-core extraction

Shipped a save-file inspector at
[src/Ostranauts.Site/save-inspector.html](src/Ostranauts.Site/save-inspector.html)
that lets a modder upload an Ostranauts save zip (the
`<name>_<epoch>.zip` from any `Saves/<name>_<epoch>/` folder), enumerates
the per-ship JSONs inside it, and renders the picked ship through the
same component checklist / floor plan / room cards the ship-inspector
page uses. The save-format per-ship JSON is a runtime superset of
`data/ships/<reg>.json` — same `aItems[]` with `fX`/`fY`/`strName`,
same `aRooms[]`, plus runtime extras (`aCondOverrides[]` carrying
per-item damage state, `aCOs[]` of CondOwners) that the inspector
ignores. No bucket-classification step is needed because the existing
upload-path prefix-pattern fallback (`inferBucket(strName)`) already
covers save-shape items that lack the `_bucket` annotation.

**Refactor.** Hoisted the shared rendering core out of
[ship-inspector.js](src/Ostranauts.Site/ship-inspector.js) into
[inspector-core.js](src/Ostranauts.Site/inspector-core.js) — exposes
`window.InspectorCore.{ init, activateShip, clearShip, uploadError,
isShipShaped, el, djb2, friendlyName, ... }`. Each consumer page builds
its own picker UI, then calls `InspectorCore.init({ rootEl, lsPrefix,
friendlyNames, rooms })` to stand up the progress / visual / rooms /
components sections, and `InspectorCore.activateShip(key, shipDict,
label)` whenever the user picks a ship. ship-inspector.js shrank from
920 lines to 270; the new save-inspector.js is 290. Page-local CSS
moved to [inspector.css](src/Ostranauts.Site/inspector.css) so both
pages share an identical visual treatment without a 500-line `<style>`
duplicate. Verified ship-inspector still renders pixel-identically
(canned-ship dropdown, prior-state restore, hash routing, component
counts all unchanged).

**ZIP reading.** No third-party dependency —
[save-zip-reader.js](src/Ostranauts.Site/save-zip-reader.js) uses the
platform `DecompressionStream("deflate-raw")` API (Chrome/Firefox 113+,
Safari 16.4+) plus a hand-rolled central-directory walker. Entries
are lazy: `readEntries(uint8Array)` returns metadata immediately
(filename, sizes, method, LFH offset) and only decompresses one entry
when the modder picks that ship. Skip-list: ZIP64 and compression
methods other than STORE/DEFLATE — game saves don't use either. The
page feature-detects DecompressionStream at boot and shows a clear
"upgrade your browser" banner if missing rather than failing silently.

**Save identity + state.** The save zip is *not* persisted across
reloads (a 42 MB zip blows past localStorage's 5 MB cap and even
IndexedDB churn doesn't justify itself for v1). Per-ship checkbox /
pin state IS persisted, keyed by `<saveHash>:<shipReg>` so two saves
with the same reg stay isolated. `saveHash` is a sampled djb2 over the
zip's head + middle + tail + length — stable across re-uploads of the
same file, fast, non-cryptographic. Re-uploading the same save brings
each ship's state back. Cross-page keys are namespaced under
`save-inspector:` / `ship-inspector:` prefixes.

**Picker UX.** Same shell as ship-inspector with two changes: the
upload control accepts `.zip` instead of `.json`, and the canned-ship
dropdown becomes a "ships in this save" dropdown that's disabled until
a zip is uploaded. A save-summary line below the dropdown shows
playerName / shipName / version pulled from the bundled `saveInfo.json`
(the load-screen sidecar that lives next to the zip's main payload).
Each option label is `<reg> (<size>)` — friendly per-ship name
resolution is deferred to v2 (would require decompressing every ship
on upload to read `strName`; the active ship's friendly name *is*
resolved and shown in the header label once the modder picks it).

**Verified via preview.** Loaded `cares catherine ruiz_1778371145.zip`
(42 MB, 142 ships, 0.15.0.25): dropdown populates with all 142
`ships/*.json` entries in <2s, save-summary line shows player "Cares
Catherine Ruiz" + flagship "K-Leg: Azikiwe Commercial". Picking B-REG
renders the floor plan (192×168 canvas, 60% pixel coverage), 6 buckets
totalling 273 components (39 walls / 134 floors / 3 doors / 36
conduits / 1 container / 60 other), and 4 room cards (BridgeRoom,
Airlock, Engineering, Blank — matches the per-room screenshot PNGs
that exist for B-REG in the zip). Setting a wall count to 3 + pinning
BridgeRoom + switching to B-1XFL (0/114) + switching back to B-REG
restores the 3-wall count and the pinned BridgeRoom. localStorage keys
`save-inspector:counts:707f8e0f:B-REG` and `pinned-specs:707f8e0f:B-REG`
appear with the expected values.

**Pre-push fair-use note.** Factor 1 transformative — modder save-
file inspection tool, no game prose. Factor 2 our prose + JS, no game
prose included; the save-zip parser is hand-rolled from the public ZIP
spec, not derived from any game binary. Factor 3 nothing new shipped
to the public bundle — the save zips themselves stay on the modder's
disk (uploads are processed entirely client-side). Factor 4 useless
without the game (you can't even produce a save without playing it).
Cleared.

## 2026-05-10 — PLAN-BUILDER Phase 3: ship-inspector page

Shipped Phase 3 of the ship-inspector axis. New self-contained page at
[src/Ostranauts.Site/ship-inspector.html](src/Ostranauts.Site/ship-inspector.html)
plus its module
[src/Ostranauts.Site/ship-inspector.js](src/Ostranauts.Site/ship-inspector.js).
Modder picks a canned ship from a dropdown (driven by the Phase 1
manifest, 43 entries) or uploads their own ship JSON; the page lays out
a coarse 2D wall/floor plan computed from `aItems[].fX`/`fY` binned to
integer tiles, lists components grouped by bucket with per-instance
checkboxes, and shows per-room requirement cards with pin-to-top
behavior using the Phase 2 `window.renderRoomCard` shared renderer.

**Loader plumbing.** Added a small step to
[utils/python/build_ship_inspector_data.py](utils/python/build_ship_inspector_data.py)
that emits a `.js` wrapper next to each Phase 1 `.json` artifact:
`canned-ships/<reg>.js` self-registers into
`window.SHIP_INSPECTOR_CANNED["<reg>"]`, the manifest exposes
`window.SHIP_INSPECTOR_MANIFEST`, the friendly-name map exposes
`window.SHIP_FRIENDLY_NAMES`. The `.json` originals stay as-is — modders
read `id-friendly-names.json` directly, the canned ship JSONs round-
trip through `python -m json.tool` for off-browser inspection. Picked
the script-wrapper path over `fetch()` because Chrome blocks `fetch()`
on `file://` and the rest of the site already loads its data via
`<script src="data/*.js">` (see `explorer.html`'s `graph.js` /
`properties.js` block). Per-ship scripts are injected lazily on
selection, so loading the page costs only the manifest + friendly-name
map.

**Upload cache.** Skipped lz-string compression for v1; uploads are
stored uncompressed in localStorage with a 4 MB raw-text cap (refused
above that with a friendly error). The compression path is documented
in the JS module header for whichever phase wants to revisit it;
vendoring lz-string adds a dependency for what is, for now, a
usability nice-to-have rather than a blocker.

**State and persistence.** localStorage keys per the PLAN-BUILDER
table: `ship-inspector:active-ship`, `ship-inspector:checkboxes:<key>`,
`ship-inspector:pinned-rooms:<key>`, `ship-inspector:upload-cache:<hash>`,
`ship-inspector:upload-meta:<hash>`. Upload identity is a djb2 hash of
the JSON text — non-cryptographic but stable and synchronous,
sufficient for "did the modder re-upload the same ship?" cache lookup.
Bucket filter pills + free-text search both live on the components
section; filter state itself persists under `ship-inspector:bucket-
filters`.

**Visual layout.** A single `<canvas>` rendered client-side: items are
binned to `Math.round(fX, fY)`, walls overdraw floors, all other
buckets render transparent — a 3-color plan (wall / floor / empty) per
spec. Pixel size adapts to the container width with a 12 px cap, so
the 105-tile-wide RF-72m fits without horizontal scroll. The Phase 1
spec's "OR a room's tile list claims it" floor-paint rule is deferred:
`aRooms[].aTiles` are flat indices into an `nRows × nCols` grid in a
coordinate space that doesn't trivially align with the `fX/fY` item
plane, and items alone already cover the full hull on every canned
ship inspected. Re-instating it would be a v1.5 once the index→coord
mapping is reconciled.

**Modded-component tooltip.** The component list resolves friendly
names via `window.SHIP_FRIENDLY_NAMES`; misses get a small "mod?"
badge with a `title="this ID isn't in the shipped name table — likely
a mod component"` tooltip, and the line falls back to the raw
`strName`. Uploaded ships whose items are missing `_bucket` (because
they didn't go through `make ship-inspector-data`) get a best-effort
prefix-pattern bucket guess (`ItmWall*` → walls, `ItmFloor*` → floors,
`ItmConduit/Wire/Power*` → conduits, etc.) so the foldouts still
populate; the inferred bucket only fires when `_bucket` is absent.

**Layout gotcha worth flagging.** [style.css](src/Ostranauts.Site/style.css)
has a global `main { display: grid; grid-template-columns: 240px 1fr; }`
to drive the explorer's sidebar+detail layout. The inspector uses a
single-column flow, so `main.inspector { display: block; }` overrides
that explicitly in the page-local `<style>` block. Any new top-level
page added later will hit this same trap.

**Print stylesheet.** `@media print` hides the header chrome, the ship
picker, the search/filter controls, the visual canvas section, and the
unpinned rooms list — leaving the progress bar, pinned room cards, and
component checklist with checkboxes preserving their state. Foldouts
print whichever sections the user has opened; no auto-expand magic for
v1.

**Room-card CSS duplicated for now.** rooms-reference.html keeps the
card styles in its page-local `<style>` block (Phase 2 left them
there). The inspector duplicates the `.room-card` rule set inline
because it needs the same render. The natural follow-up is to lift the
shared rules into `style.css` and drop both copies — flagged in the
inspector's `<style>` comment so the next pass knows where to look.

**Verified via preview.** Coffin selection from the dropdown renders
the visual layout (314 components, 27×15 hull), the six populated
buckets with manifest-matching counts (66 walls / 149 floors / 1 door /
63 conduits / 27 equipment / 8 other), and two room cards (both Blank).
Checking a wall checkbox + pinning the BridgeArea-spec card, then
reloading and re-selecting Coffin via the dropdown, restores both
checkbox and pin from localStorage. Switching to Katydid then back to
Coffin preserves Coffin's state independently. The deep-link
`#/ship/Coffin` selects that ship on cold load.

**Pre-push fair-use note.** Factor 1 transformative — modder build-
checklist tooling, no game prose. Factor 2 our prose + JS + Python +
derived bucket counts; the canned-ship payloads are stripped data
already shipped from Phase 1 and judged passable then. Factor 3
nothing new of substance — just one more page consuming the same data
feeds. Factor 4 useless without owning the game (and even more useless
without the modder building a ship). Cleared.

Phase 4 handoff written at
[notes/agent-prompts/ship-inspector-builder-phase4.md](notes/agent-prompts/ship-inspector-builder-phase4.md)
covering the explorer-nav edit (one link, no backlink for v1).

## 2026-05-10 — PLAN-BUILDER Phase 2: rooms.js extraction

Shipped Phase 2 of the ship-inspector axis. The `window.ROOMS` data array
and the per-room foldout card render code lifted out of
[src/Ostranauts.Site/rooms-reference.html](src/Ostranauts.Site/rooms-reference.html)
into a new shared module
[src/Ostranauts.Site/rooms.js](src/Ostranauts.Site/rooms.js)
that exports two globals: `window.ROOMS` (the schema-documented spec
array, lifted verbatim) and `window.renderRoomCard(spec, options)` —
a pure data → DOM function returning a fresh `HTMLDetailsElement`,
reading no globals other than `document` and writing none. Options:
`idPrefix` (default `"room-"`), `pinned` (Phase 3 visual marker —
adds an `is-pinned` class), `onPin` (optional callback that, when
provided, appends a Pin/Unpin button to the summary), `openByDefault`.
Phase 3 (`ship-inspector.html`) will plumb the pin / persistence /
deep-link consumer behaviors that the `onPin` option is meant to
support; Phase 2 deliberately stays out of that.

`rooms-reference.html` shrinks to a small page-local glue script: it
keeps the priority-table render (this page only — the inspector won't
use that table) and delegates each foldout card to
`window.renderRoomCard(r, { idPrefix: "room-" })`. The deep-link
behavior (`#room-Reactor` opens that card on load) and the Esc-clears-
active-row keyboard handler operate on the rendered DOM regardless of
who built it, so they keep working unchanged. Verified via the preview
server: pre-refactor and post-refactor DOM dumps of every priority-row
and every card's `summary`/`body` `outerHTML` compare byte-identical
(18 rows, 18 cards, first/last entries hashed).

The card markup is preserved exactly — `summary` still emits five
spans (name, friendly, three meta) so the existing CSS grid template
`auto auto 1fr auto auto auto` (the leading `auto` is the `::before`
chevron) renders identically. The pin button is only added when an
`onPin` callback is supplied; rooms-reference doesn't pin so the
button is absent there and the visual layout is unaffected. Page-local
`<style>` rules (`.room-card`, `.req-line`, `.count-pill`,
`.meta-pill`, `.note`, `.summary-*`) checked against
[style.css](src/Ostranauts.Site/style.css): no overlap, so the rules
stay where they are. Consolidating the page-local block into
`style.css` would be a speculative broaden of this refactor — left
for a follow-up only if a second consumer wants the same tokens
themed.

Acceptance test: `rooms-reference.html` renders pixel-identically
before vs. after. Preview screenshot of the Reactor card open shows
the same body content + same gotcha note styling; deep-link to
`#room-Reactor` opens that card; clicking a priority row highlights
it and opens the corresponding card; Esc clears the highlight. The
JS module loads cleanly (no console errors).

Phase 3 handoff written at
[notes/agent-prompts/ship-inspector-builder-phase3.md](notes/agent-prompts/ship-inspector-builder-phase3.md)
covering the inspector page itself — consumes the four Phase 1
artifacts under `src/Ostranauts.Site/data/` plus this Phase 2
`renderRoomCard` API. Flagged for the next agent that the
`canned-ships/*.json` files are intentional single-line compact JSON
(build artifacts, regenerated by `make ship-inspector-data`) and must
not be reformatted in Phase 3 — that's a 10× commit-footprint
inflation for zero review value.

Pre-push fair-use: factor 1 transformative (modder-tooling JS module
refactor — our prose, our schema documentation, our renderer), factor
2 our prose + JS — no game prose included; the room-spec data is
identifier names + numeric thresholds + our explanatory notes lifted
verbatim from the prior page (which already cleared the four-factor
check), factor 3 nothing newly taken — the move is internal, factor 4
trivially clear (the module is useless without the surrounding site).
All four clear.

---

## 2026-05-10 — PLAN-BUILDER Phase 1: ship-inspector data extraction

Shipped Phase 1 of the ship-inspector axis (PLAN-BUILDER.md). New utility
[utils/python/build_ship_inspector_data.py](utils/python/build_ship_inspector_data.py)
walks the five `Random*` ship loot tables in `data/loot/loot.json`, dedups
the resulting registry list, strips each `data/ships/<reg>.json` to
inspector-relevant fields, classifies every component into one of eight
buckets, and emits four artifacts under `src/Ostranauts.Site/data/`:
`canned-ships/<reg>.json` (43 files), `canned-ships-manifest.json` (the
dropdown driver), and `id-friendly-names.json` (a 2,243-entry base-game
`strName → strNameFriendly` map). Idempotent — re-running yields an empty
diff. Wired as a `ship-inspector-data` Makefile target with `site` /
`site-mods` depending on it; outputs are checked in (~10 MB across
canned-ships/, ~129 KB for the friendly-name map). The original Phase 1
prompt called for pretty-printed (indent=2) ship JSONs; reversed during
implementation after the first dry-run produced a 722,788-line commit.
Ships are pure build artifacts consumed by JS at runtime, never read by
humans, and a regenerated diff is "everything changed" anyway — so each
ship file is now a single-line compact JSON. Manifest + friendly-name
map kept pretty-printed because modders are encouraged to read them.

The plan's Phase 1 spec needed two reconciliations once the actual data
shape was inspected, both now documented in PLAN-BUILDER.md's Phase 1
section: (a) ship items live in `aItems` with reference-only entries
(`strName, fX, fY, fRotation, strID`), not in `aCOs` with inline
`aStartingConds` — so the script preserves the source key and adds
`_bucket` per item; (b) the `aStartingConds` flags reach an `aItems`
entry only via a `strCOBase` chain through `data/items/` and
`data/cooverlays/` into `data/condowners/`, so the classifier resolves
that chain (max depth 8) before bucket-matching. The flag the game uses
on installed equipment is `IsInstalled` (not the spec's `IsInstallable`,
which doesn't exist anywhere in the data); `IsCarried` likewise doesn't
appear, so the `decorative` bucket lands at zero on canned ships, as
expected for ship templates (carried/loose items aren't installed).

Resulting bucket distribution across all 43 ships and 60,471 components:
56% floors, 17% conduits, 17% walls, 7% equipment, 3% other,
~0.5% doors, ~0.3% containers, 0% decorative. Sensible — small ships
(Coffin: 314 components, 66 walls / 149 floors / 1 door) and large ones
(02: 2,766 components, 417 walls / 1,761 floors / 9 doors) classify
plausibly. `RandomShip` is empty in vanilla and `RandomShipOld`'s ships
are all already in `RandomDerelictBig`, so the dedup is doing real work
even though only three of the five tables actually contribute new regs.

One stray observation worth noting: `condowners_navmods.json` ships with
a UTF-8 BOM the other condowner files don't carry. Loader uses
`utf-8-sig` to swallow it; might be a coverage-gap data point worth
filing in [notes/coverage-gaps.md](notes/coverage-gaps.md) later.

Phase 2 handoff written at
[notes/agent-prompts/ship-inspector-builder-phase2.md](notes/agent-prompts/ship-inspector-builder-phase2.md)
covering the `rooms.js` extraction (lift `window.ROOMS` + the per-card
render function out of `rooms-reference.html` into a shared module
consumable by both `rooms-reference.html` and the future
`ship-inspector.html`).

Pre-push fair-use: factor 1 transformative (modder-tooling data feed +
schema-derived bucket classifier, our extraction code), factor 2 our
shape + identifier names + base-game JSON values (no creative prose
included — `description` fields are passed through but they're already
on the public wiki / store page), factor 3 derived counts and IDs not
creative content (the `aItems` arrays are positions + IDs, not
narrative), factor 4 useless without owning the game (the data names
nothing without the engine resolving them). All four clear.

---

## 2026-05-10 — PLAN-BUILDER: ship-inspector axis opened + Phase 1 agent handoff

Pulled from a community ask in the BlueBottleGames Discord modding channel: **El** asked whether someone could build a tool that takes a ship file and emits a component checklist (how many walls, floors, conduits, lights — to assemble a "kit" for building from scratch). **Ne** seconded. **Ro** proposed the rough shape — make a DTO of the ship + enumerate components by ID, then dump the list — and identified the load-bearing complication: friendly-name resolution would need the user's local game install path so the tool can read the base-game data tree. Talked through it with user; observation: that resolution **already lives on the explorer** (we ship `properties.js`/`graph.js` derived from `data/condowners/` + `data/cooverlays/`), so a static-site tool layered on the explorer's data avoids the install-path problem entirely. Picked option 1 of three (site-side tool inside the explorer) over a static handoff guide or a standalone CLI. No verbatim chat content quoted; pre-existing rule in CLAUDE.local.md against full-handles in tracked notes still applies, abbreviated initials used here for workflow brevity.

[PLAN-BUILDER.md](PLAN-BUILDER.md) is the fourth plan axis after EXPLORER / AST / DESIGN. Four phases: (1) Python data extractor that walks `RandomShip` / `RandomDerelict{Small,Medium,Big}` / `RandomShipOld` loot tables, strips each `data/ships/<reg>.json` to inspector-relevant fields, classifies every CO into one of eight buckets (walls/floors/doors/conduits/containers/equipment/decorative/other) by `aStartingConds`, emits a manifest + canned-ship JSONs + a base-game-wide ID→friendly-name table; (2) refactor `window.ROOMS` and the per-room card render function out of `rooms-reference.html` into a shared `rooms.js`; (3) the `ship-inspector.html` page itself — dropdown + upload, coarse 2D wall/floor/empty grid, foldout component checklists with persistent localStorage state, pinnable per-room requirement cards, gzip-compressed upload caching so re-opens rehydrate; (4) add a "Ship Inspector" link on the right side of the `explorer.html` nav (no backlink for v1; surrounding site isn't ready for cross-linking).

[notes/agent-prompts/ship-inspector-builder.md](notes/agent-prompts/ship-inspector-builder.md) is a self-contained Phase-1 handoff for a fresh agent session — required-reading list in dependency order, exact deliverable spec, sanity-check criteria, commit hygiene, and instructions to write a Phase-2 prompt at `notes/agent-prompts/ship-inspector-builder-phase2.md` when Phase 1 lands. New `notes/agent-prompts/` folder convention is intentionally distinct from `notes/handoff/` (modder-facing HTML guides) — agent prompts are project-internal bootstrap docs, not redistributable artifacts.

PLAN.md routing not yet updated; that's a follow-up coordination edit (move from "three plans" to "four plans" in the routing summary).

Pre-push fair-use: factor 1 transformative (project planning + agent-bootstrap docs, our prose), factor 2 our writing — no game prose, no decompiled C# excerpts, factor 3 nothing taken, factor 4 no substitution risk. All four trivially clear.

---

## 2026-05-10 — Land deferred frontend + housekeeping batch

Catch-up commit landing several stretches of frontend + tooling whose DEV-LOG entries were committed in `1d29d3e` but whose code hadn't been staged yet:

- **Items socket grid + Num Rows** (entry above) — `GraphExporter.cs` socket-array passthrough, `app.js` socket-grid renderer, `style.css` socket cells, `comment_mod/data/schemas/items-schema.json` overlay, CodeDocs sync.
- **Facets / Plots meta-pages + mode-aware sidebars** (entry above) — `app.js` Facets / Plots / paired-pattern code, `style.css` meta-sidebar styling, `explorer.html` Facets + Plots tabs.
- **Loader-derived schema discovery + 39 generated overlays** (entry above) — `utils/python/decomp_loader_table.py`, `generate_missing_schemas.py`, the 39 generated `comment_mod/data/schemas/*-schema.json` overlays, audit-script switch to discovery.

Plus three smaller pieces that didn't have their own entry:

- **Search-scope filters + landing page.** Search input grows a glossary / strName / description checkbox row + folder filter (persisted in `localStorage`); empty-search state shows a landing card explaining the four scopes. `explorer.html` `<div id="search-filters">`, `app.js` `searchFilters` state + `renderSearchLanding`, `style.css` `.search-filters` / `.search-landing-*`.
- **Potentially-missed-references panel.** New `utils/python/coverage_strname_occurrences.py` walks every JSON tree to find strName occurrences the parser didn't emit edges for, filters known false-positive fields via the graph's `fieldDescriptions` map, and writes `build/data/coverage_misses.js`. Site reads the payload and shows a `.cov-misses-block` warning panel on detail pages where the strName has unresolved external mentions. Makefile public-bundle stub line added so the empty-data deploy still loads. `utils/README.md` registers the script.
- **Pipes mod-idea spikes.** [notes/mod-ideas/pipes.md](notes/mod-ideas/pipes.md) gains an "Implementation explorations" section linking two new spike notes: [pipes-porter-drone.md](notes/mod-ideas/spikes/pipes-porter-drone.md) (data-only strawman using a porter-drone CondOwner — workable but visibly worse than a real pipe) and [pipes-bepin-poc.md](notes/mod-ideas/spikes/pipes-bepin-poc.md) (minimal BepIn POC using `aUpdateCommands` + signal-wire hookup, active intake + passive output, no logistics intelligence yet).

Housekeeping in the same commit:

- **Local-fixtures rename: `testdata_mods/` → `test-data/mods/`.** `.gitignore` widened from `/testdata_mods/` to `/test-data/` — the new parent also holds `test-data/save/` (used by the save-fix handoff above to validate save-format claims). Tracked references in [notes/user-stories/](notes/user-stories/) (3 mod story files) and [notes/design/claude-designer-brief.md](notes/design/claude-designer-brief.md) updated to the new path. Historical mention preserved in this and the 2026-05-03 entry so the rename is discoverable.
- **`.gitignore` adds Python bytecode** (`__pycache__/`, `*.pyc`) — was missing, was about to leak compiled outputs from the new audit scripts.

## 2026-05-10 — Save-fix handoff: escape the OKLG Public Enemy doom loop

New modder-facing handoff at [notes/handoff/save-fix-public-enemy-doom-loop.html](notes/handoff/save-fix-public-enemy-doom-loop.html) — recipe for digging a single crew member out of the spiral where station combat in OKLG zones permanently flags them as `CrimeOKLGThreat`, licenses every OKLG NPC to attack via `TIsAIReportCrimeValidVictim`, and accumulates per-target `fAnimosity` until *My Standings* reads four-digit negative. Sourced from a real modder question observed in BlueBottleGames Discord, #modding-discussion, 2026-05-09.

The investigation traced two distinct systems and explains why fixing one isn't enough: (a) the **binary Public Enemy flag** lives in `data/conditions/conditions.json` as `CrimeOKLGThreat` (`fDuration: 0.0`, no auto-decay), is granted by `data/crime/crime.json`'s `OKLGAssault` row, and is the gate `TIsAIReportCrimeValidVictim` ([data/condtrigs/condtrigs.json:344](data/condtrigs/condtrigs.json:344)) checks before letting AI swing — making self-defense in OKLG zones into a fresh OKLGAssault that re-stamps the flag; (b) the **rep accumulator** lives in each humanoid CondOwner's `social.aRelationships2[].fAnimosity` float and tallies independently. Both need clearing to break the spiral.

Save-format claims grounded by walking a real `<character>_<id>/` folder via [scrap_scripts/python/10_validate_save_format.py](scrap_scripts/python/10_validate_save_format.py) (gitignored). Verified: folder contains zip + sidecar metadata; zip contains `<Character>.json` (player file, no humanoid NPCs — 40,168 CondOwners with 0 social-populated) plus `ships/<reg>.json` per ship/station; humanoids serialize into whichever ship file represents their physical location; humanoid `strID == strFriendlyName == full name`; `JsonRelationship` carries three numeric accumulators not listed in the decomp class file (`fAnimosity` / `fFamiliarity` / `fKindness` — observed range 0–94 / 0–262 / 0–175 in a peaceful save). The handoff's confidence table flags one inferred claim explicitly: the exact aggregation formula from per-relationship `fAnimosity` to the displayed standing wasn't traced end-to-end, but the surgical edit (zero `fAnimosity` per OKLG-faction relationship) is the right operation regardless.

Recipe surfaces: strip four `Crime*` cond-strings from `aConds[]`; zero `fAnimosity` on each relationship whose `strPSpec` is an OKLG-faction NPC (or delete `aRelationships2` wholesale as a lazy shortcut); reload. Permanent-fix sidebar lists three options ranked by disruption — physical relocation away from OKLG (zero code), demote `OKLGAssault` to warrant in `crime.json`, or add `IsCrew` to `TIsAIReportCrimeValidVictim.aForbids` so AI never treats player crew as fair game even when flagged. The handoff's *Confidence* table marks each claim as verified or inferred so a future modder can spot which steps to double-check on their own data.

Pre-push fair-use: factor 1 transformative (modder-tooling save-fix recipe with original prose), factor 2 our writing + condition/field names, factor 3 short representative excerpts only (one before/after relationship sample + one crime-row excerpt), factor 4 useless without owning the game. All four clear.

**Site wiring.** New [notes/handoff/index.html](notes/handoff/index.html) lists every handoff (currently two — the new save-fix page plus the existing needs-suppression mod guide), so the deploy URL `<site>/handoff/` resolves to a browsable directory rather than a 403. New "Handoffs" tab added to [src/Ostranauts.Site/explorer.html](src/Ostranauts.Site/explorer.html) nav pointing at `handoff/` so the index is reachable from every explorer page; clicking it leaves the SPA into the regular handoff page (browser back returns). Existing handoff page wiring (Makefile copy from `notes/handoff/` into `build/handoff/` and `build-public/handoff/`) is unchanged — both new files ride the same path.

---

## 2026-05-10 — Item footprint: Num Rows calculated field + socket-grid visualiser

`items/` detail pages now show a derived `Num Rows` field appended to the Fields block (with an `f(x)` badge) and a CSS-grid visualisation of the three socket arrays (`aSocketAdds` body, `aSocketForbids` halo, `aSocketReqs` halo). Decompiled `Item.cs:271-272` sets `nWidthInTiles = jid.nCols` and `nHeightInTiles = aSocketAdds.Count / jid.nCols` — i.e. the height of an item's footprint is implicit from the body-array length, not a JSON key — so we compute "Num Rows" client-side from those two values. Naming incongruity vs. the schema's `nCols`/`nRows` convention is intentional: it's a derived display value, not a JSON field, so giving it a human-friendly label keeps it from being mistaken for a real schema key.

Builder change: [GraphExporter.cs](src/Ostranauts.DataModel/GraphExporter.cs) `WritePropertiesFile` gains a narrow data-side exception — `items/` entries pass through the three socket arrays. They aren't graph edges (they describe the in-inventory tile footprint) so they were filtered out under the existing scalar-only rule; the site now needs them to render the grid + derive the calculated row. Code-side nodes' existing array/object opt-in (`Folder.StartsWith("code-")`) is unchanged.

Site change: [renderFieldsBlock](src/Ostranauts.Site/app.js) filters `aSocketAdds`/`aSocketForbids`/`aSocketReqs` out of the alphabetical scalar list (they're not meaningful as inline values) and appends a calculated `Num Rows` row outside the sort. New helpers `renderItemSocketGrid` + `renderSocketGrid` emit three labeled `display: grid` figures with cells coloured by socket kind (green = Add, red = Forbid, blue = Req) and a dashed outline on the inner body-region cells of the halo grids so the (nCols+2)×(nRows+2) padding ring reads at a glance. Matching CSS in [style.css](src/Ostranauts.Site/style.css). Verified across four canonical shapes:

| Item                  | nCols | aSocketAdds.length | Body footprint | Halo (forbids/reqs) |
| --------------------- | ----- | ------------------ | -------------- | ------------------- |
| ItmWeaponNightstick01 | 1     | 1                  | 1×1            | 3×3                 |
| ItmWeaponNightstick02 | 2     | 2                  | 2×1 (horiz)    | 4×3                 |
| ItmDrinkFlask01 (4L)  | 1     | 1                  | 1×1            | 3×3                 |
| ItmDrinkFlask02 (8L)  | 1     | 2                  | 1×2 (vert)     | 3×4                 |

The 8L flask being 1-wide × 2-tall (vs the 4L flask at 1×1) is the user-visible distinction this change makes legible. Non-`items/` pages are unaffected — they don't run the socket-grid path or the calculated-row injection.

CodeDocs: [GraphExporter.md](CodeDocs/sources/Ostranauts.DataModel/GraphExporter.md) and [io/outputs.md](CodeDocs/io/outputs.md) updated to call out the items-folder array exception. No schema-version bump — the new keys are purely additive on a folder that already had partial coverage in `properties.js`, and older site versions ignore the array values gracefully (the existing scalar-only loop just skips them).

---

## 2026-05-07 — Mod-ideas notes folder seeded; sacks-and-buckets deep dive + mod scaffold

Started [notes/mod-ideas/](notes/mod-ideas/) as the home for in-flight mod design notes. Two opening files: [sacks-and-buckets.md](notes/mod-ideas/sacks-and-buckets.md) (single-type containers from dismantle, 2–4× backpack capacity for the immobile bucket variant) and [pipes.md](notes/mod-ideas/pipes.md) (item routing where each downstream's accept rules *are* the filter — pairs with single-type buckets so a network of buckets sorts loot for free). Each file carries its own data-folders pointer and open-questions list; cross-link between them where the bucket-as-implicit-filter idea bridges. Strict design-only — no implementation yet, no schema changes.

Followed up with an implementation deep-dive on sacks-and-buckets: [notes/mod-ideas/sacks-and-buckets-implementation.md](notes/mod-ideas/sacks-and-buckets-implementation.md). Verdict: **data-only**, no BepIn. The whole mod is a recombination of vanilla mechanisms — `TIsFitContainer*` family for single-type filtering (10+ existing examples), `IsOversized + IsRigid + IsCrate` for the dragged-installable bucket (mirrors `ItmCrate01`), `mapGUIPropMaps → guipropmaps → strLoot → loot-table aLoots` for kiosk stocking. Identified the 12 dismantle-yield items as build targets via a 154-table sweep of `*Dismantle$|*Decon$|*Strip$|*Tear|*Wreck$|*Salvage$` loot tables; ranked by occurrence count. Confirmed every one of the 12 already carries a unique distinguishing marker in `aStartingConds` — zero new marker conditions required. Course-corrected one user hypothesis: "items added via `GUITradeKiosk.aInverse`" was directionally right (a list of strNames to extend) but the wrong field — `aInverse` is the response-interaction ladder, the actual stock list is in the kiosk CO's `mapGUIPropMaps → Trader → guipropmaps entry → strLoot` chain.

Built the v1 mod under [spiffy-mods/mods/SacksAndBuckets/](spiffy-mods/mods/SacksAndBuckets/) (new top-level folder, MIT-licensed even after eventual move out of this repo; right now it's as much a test case for the data-only thesis as a shipping mod). Mirrors base-game `data/<folder>/<file>.json` filenames for the load-order match convention. Four files, ~1,737 lines: README + 12 fit-gates in `condtrigs/condtrigs.json` + 24 container CO entries in `condowners/condowners.json` (12 sacks at 4×4 grid + 12 buckets at 8×8 grid) + 3 vanilla-copied supply-kiosk tables with 24 stock-line appends each in `loot/loot.json`. Sacks alias `ItmBackpack02` art, buckets alias `ItmCrate01` art — distinct identities live in `strNameFriendly`/`strDesc`; custom sprites are a v2 task. Sack and bucket of the same item type **share the fit gate** — same accepted item, same gate; 12 condtrigs not 24. Bucket capacity is intentionally generous (4× the backpack — "modders should aim overpowered to demonstrate the mechanic"; trim to scrap-only when upstreaming).

Per-mod generators live with the mod under [spiffy-mods/util/SacksAndBuckets/](spiffy-mods/util/SacksAndBuckets/) (per CLAUDE.md "mod tooling lives with the mod" rule — they re-emit tracked content into the mod's `data/` folder). Initial pass was two PowerShell scripts; ported to Python + YAML in commit `fd4acda` so config could live in [config.yaml](spiffy-mods/util/SacksAndBuckets/config.yaml) and be edited as the source of truth. Current scripts: [emit_condowners.py](spiffy-mods/util/SacksAndBuckets/emit_condowners.py) (24 container CO entries + the kiosk), [emit_items.py](spiffy-mods/util/SacksAndBuckets/emit_items.py) (per-item ItemDef so each container has its own sprite), [emit_loot.py](spiffy-mods/util/SacksAndBuckets/emit_loot.py) (kiosk stock loot table — re-sync after a vanilla content patch since the mod's loot.json is a full-copy override by `strName`), [emit_sprites.py](spiffy-mods/util/SacksAndBuckets/emit_sprites.py) (PIL/Pillow compositor), and [emit_all.py](spiffy-mods/util/SacksAndBuckets/emit_all.py) (orchestrator).

## 2026-05-07 — Tier-1 meta-pages: Facets, Plot beats, paired sidebars

Three new clarity surfaces on top of the graph that already exists. None of them required schema changes; all three derive their structure from name patterns that the data already follows but no single page had been pivoting on.

**1. Facet aggregator** (`#/facets`, `#/facet/<strName>`). 814 strNames live in 3+ folders simultaneously — `Itm*` accounts for 747 of them, `Wound*` 20, `Outfit*` 14, plus a long tail. The facet page shows every folder one strName appears in as a stacked card (folder badge, strType pill if present, file path, in/out edge counts), then renders a **unified inbound block** that deduplicates incoming references across all facets by `(sourceId, sourceField)` and tags each row with the facet folder(s) it actually resolves into. The index page groups names by family ("Itm", "Wound", "Outfit", "Plot", "CT", "Other") in a 3-column lookup. Existing object detail pages get a small `view as facet ↗` pill in `.meta-page-links` near the head whenever the strName appears in 3+ folders. Reuses [renderFolderBadge](src/Ostranauts.Site/app.js), [splitId](src/Ostranauts.Site/app.js), and the `incoming` / `outgoing` indices already built at app init — no new payloads.

**2. Plot-beat aggregator** (`#/plots`, `#/plot/<suffix>`). Pivots on the shared **suffix** across the five plot prefix conventions: `plot_beats:<X>`, `plots:<X>`, `condtrigs:CTPLOT_<X>`, `loot:CONDPLOT_<X>`, `conditions:Plot<X>`, `interactions:PLOT_<X>` / `Plot<X>`. Index page is a sortable table with a per-surface column count strip (PB / PL / CT / L / C / IA) so a modder can scan which beats are fully coordinated vs. partial. Detail page renders each surface as a labeled bucket with a one-paragraph explanation of what role it plays in the beat. 2,600 distinct suffixes total — only 2 are "fully coordinated" (4+ surfaces sharing the exact same suffix). The granularity reflects the data: most plot suffixes are phase-level (`MedHeist_PlanInMotionResist`) rather than beat-level, so the per-suffix view shows one phase at a time, not the whole arc. Beat-container pages (`plot_beats/`, `plots/`) get the same `view as plot beat ↗` affordance.

**3. Paired-pattern sidebars** on existing object detail pages, reusing the existing `.thresh-panel` styling so they read as one consistent visual class:

- **`TIs<X>` ↔ `Is<X>` twin** — On a `TIs*` condtrig: shows the boolean form (`Is<X>` in `conditions/` or `conditions_simple/`) if it exists, with an empty-state explainer when it doesn't (the 90.4% of `TIs*` triggers that compute their truth from `aReqs` chains rather than a static twin). Inverse direction on `Is<X>` condition pages links back to the trigger. Pure name-pattern lookup, no schema cost.
- **Discomfort ladder** — On `Stat<X>` condition pages, links to the `Dc<X>` CondRule that watches it (when the subject names match exactly — `Stat<X>`/`Dc<X>` is loose enough across the data that some pairings like `StatAge`/`DcAging` need hand-tuning later). On `Dc<X>` CondRule pages, lists the regulated stat + leveled `Dc<X>NN` conditions + `CONDDc<X>NN` grant loot tables in one panel — verified live against `DcAging`, which fans out to 5 levels + 5 grant loots. On a leaf `Dc<X>NN` condition, traces back to the parent rule and stat.

Two new tabs landed in [explorer.html](src/Ostranauts.Site/explorer.html) ("Facets" between Schemas and Coverage; "Plots" right after). New CSS in [style.css](src/Ostranauts.Site/style.css) covers `.facet-cards` (auto-fill grid), `.facet-card` (folder-coloured left edge), `.facet-inbound-folder` (left-border indented list), `.facets-name-list` (3-column list with responsive 2/1-col fallback), `.plot-bucket-list`, `.plots-table`, and `.meta-page-link` (dashed-pill banner-tinted). All tokens taken from the hi-fi system shipped 2026-05-07 — no new design vocabulary introduced.

What this unblocks: the `mod-npc-vendor` user story now has a single landing page for the OKLG Fixer plot beat (was: walk five folders manually). The needs/atrophy diagnostic the `crew-exercise-invisible-need` story asks for now has the discomfort-ladder ancestry visible on every `Dc*` page. The conditions/conditions_simple click-chain misroute (the 13,733 dangling-edge issue surfaced in the prior coverage report) is visible on the TIs/Is twin sidebar even before the schema `x-targets` fix lands — the panel will show the boolean even when the structural `aReqs` link is dangling.

What's deferred (per the user's "regroup after 1–3" framing): T-verb subject-centric view (`AirPump` → all condtrigs that test on it across `TIs*`/`TUp*`/`TDn*`/`TCan*`/`THas*`), prefix-family glossary cards, name-breakdown chip on detail pages, folder-page convention banner. All on the menu for the next round.

**Follow-up (same session): mode-aware sidebar.** The folder rail only makes sense in Explorer mode — on Schemas / Coverage / Data Health / LLM Candidates it's irrelevant noise; on Facets / Plots it should be a clustered nav for the meta-pattern, not a folder list. So:
- `<main>` gets a `data-mode` attribute (`explorer` / `facets` / `plots` / `nosidebar`) set by `renderRoute()`.
- On `nosidebar` modes the aside is `display: none` via CSS, letting the detail panel claim the full width.
- On Plots, the rail becomes a "Plot arcs" cluster — every suffix's leading prefix (`MedHeist_PlanInMotionResist` → `MedHeist`), counts per arc, click scrolls the main panel to that arc's section. Singletons (one suffix per arc, ~280 of them) fold into a single bottom block so the multi-beat arcs read cleanly. Top arcs in the live data: `_Whodunnit` (358 beats), `Merga` (226), `Meat` (140), `Beat` (112), `MessengerRomantic` (103).
- On Facets, the rail becomes a family cluster — Itm (747), Wound (20), Outfit (14), Plot (1), CT, Other — same click-to-scroll mechanic.
- The Plots index render swapped from "fully coordinated vs. partial" buckets to **per-arc** sections (`<arc> (N beats)` heading + table inside), each with `data-scroll-anchor="plot-arc-<prefix>"` for the sidebar to target. Same `[data-scroll-anchor]` mechanism used by facet families.
- Click-to-scroll briefly highlights the landing block via `.scroll-flash` (1.2s box-shadow pulse on the banner-edge token) so the user's eye finds the new position without searching.

Caught one footgun while wiring this: `folderListEl` was `const`-cached at module load, but the aside's innerHTML is now rewritten when the sidebar swaps mode — converting the cache to a `let` and re-resolving it inside `renderFolderListSidebar` keeps the rail re-renderable across mode swaps.

Pre-push fair-use: factor 1 transformative tooling, factor 2 our prose + our derived structure, factor 3 trivial — facet/plot pages aggregate strName references the modder already has, factor 4 explorer-without-game still useless. All four clear.

## 2026-05-07 — Loader-derived schema discovery + 39 generated overlays

Closed the scope bug in the schema audit pipeline. The two existing audit scripts (`decomp_schema_table.py`, `decomp_schema_crosscheck.py`) carried a hand-curated `CLASS_TO_SCHEMA` allowlist of 14 `Json*` DTOs, even though the decomp ships **126 `Json*.cs` files** and `DataHandler.LoadAllData` dispatches into ~80 of them. Folders the loader knew about but the allowlist didn't (installables, ads, cooverlays, careers, …) silently fell through every audit pass — the Coverage tab's blind-spot cohort was the visible symptom.

Three changes:

1. **New `utils/python/decomp_loader_table.py`** — parses `DataHandler.cs` for every `LoadModJsons<JsonXxx>(strFolderPath + "yyy/", …)` line and yields the ground-truth (class, parser-folder) table the game itself uses. Folder key is the *top-level* `data/<folder>` segment (matches `DataLoader.cs:63`'s `Path.GetFileName(folderPath)` semantics) so multi-DTO loaders like `attackmodes/{coAttacks,shipAttacks}`, `blueprints/{asteroids,clusters}`, `racing/{leagues,tracks}`, `market/{Markets,CoCollections,Production,CargoSpecs}` collapse onto a single schema key with a DTO union. Skips the `JsonSimple` cohort (string tables — no refs to discover) and the `DataLoader.SkippedFolders` set (`schemas`, `strings`, `tsv`, `ai_training`, `glossary`).

2. **Both audit scripts switched to discovery.** `CLASS_TO_SCHEMA` is now `_build_class_to_schema()`, populated from `parse_loader_dispatches()`. Adding a new DTO to the loader auto-extends the audit's coverage on the next run; no allowlist edits required.

3. **New `utils/python/generate_missing_schemas.py` + 39 generated overlays.** For each unmodeled folder, the generator parses the bound `Json*` DTO(s) for properties + plain fields, cross-references `build/data/ref_candidates.js` (the RefCandidateDetector's output) to classify ref carriers, and emits `comment_mod/data/schemas/<folder>-schema.json`. Encoded-only candidates (e.g. `installables.aInputs[*]` → condtrigs via `=`-split) get the `condition string` marker phrase that promotes StringArray → CondStringArray during rule derivation. Multi-target candidates (e.g. `installables.strActionCO` → loot/condowners/items) get `x-targets` for existence-aware fallback. Multi-DTO folders union the field sets so one schema covers all DTOs the loader binds to that folder. Fields without detector signal still get declared (with `(no auto-detected ref signal — hand-tune…)` placeholder text) so the field surfaces in the Coverage tab and on Field-block tooltips, even before someone hand-tunes its description.

Numbers (build before vs. after):

|                              | before | after  | delta   |
|------------------------------|-------:|-------:|--------:|
| graph rules                  |     74 |    167 |   +93   |
| graph edges                  | 63,829 |129,155 | +65,326 |
| uncovered detector candidates|    184 |    111 |   −73   |

Largest yields: `installables` (14 ref rules), `cooverlays` (7), `blueprints` (7 across both asteroid + cluster DTOs), `careers` (6), `slot_effects` (5). Of the 27 non-code blind-spot folders that remain, all are expected: pure terminal data (`colors`, `audioemitters`, `headlines`, `music`, `tips`, `tokens`), `JsonSimple` cohorts (`names_*`, `manpages`, `verbs`, `traitscores`), or hand-tune territory where the DTO is mostly nested objects (`star_systems` → `JsonStarSystemSave`).

The generated overlays are intentionally hand-revisable — re-running the generator regenerates only the unmodeled folders (anything with a tracked schema is left alone), so a follow-up pass that hand-tunes `aInverse` shapes, sparse-field descriptions, or ghost markers won't get clobbered.

Pre-push fair-use: factor 1 transformative (modder-facing schema overlays), factor 2 our prose synthesised from the DTO field names + detector statistics, factor 3 minimal — schema files name fields and target folders but carry no in-game prose, factor 4 visual reference is useless without the data-explorer context. All four clear.

`utils/README.md` updated with the two new tools and their position in the audit pipeline.

## 2026-05-07 — Hi-fi visual system landed in `src/Ostranauts.Site/` (12 slices)

The Phase-2 hi-fi visual system from the designer handoff is now the live look. Twelve incremental slices on the `claude-hifi-proto-implement` branch were cherry-picked onto master, each one keeping the site working at every commit. The handoff itself (the prototype HTML mocks, `tokens.json`, original `explorer.css`, audit ledger) **stays on the branch** — it carries unsupported features (the mod-layer view, friendly-name field, six full surface mocks) that we don't want in master until they have a home. Read the prototype via `git checkout claude-hifi-proto-implement -- notes/design/hifi-prototype/`.

What landed (each was its own commit; see `git log` for individual messages):

1. **Token foundation.** Full hi-fi token system at the top of `style.css` — paper/ink, the 12-color frequency-ranked OKLCH folder palette (`--pal-01..--pal-12` + `-edge` companions), three semantic accents (banner / mismatch / callout), font/type/spacing/radius/shadow scales, plus the `[data-theme="dark"]` override block (industrial cyberpunk: condensation-white ink, coolant blues, amber action color, plasma cyan rationed, rust patina decorative-only).
2. **Folder palette.** `app.js` switched from hashed folder color to the v0.18.2 frequency-ranked `fNN` mapping (conditions=01, items=02, …, condowners=11; everything else=12 parchment). Badges emit `class="folder-badge fNN"`; CSS sets `--badge-color` per fNN. The selector also broadened from `.refs-block / .detail-head` scopes to global so badges anywhere on the page pick up the palette.
3. **Folder list swatches.** Each `#folder-list` row gets a 9-px square swatch coloured by fNN. Per HANDOFF rule, dark-mode swatches use the *light-mode* L≈0.84 fills (the only place the dark override flips this way) so the rail reads as indicator lights against the dark ground.
4. **Semantic accents.** `.prefix-explainer` (UX 1.2) maps to **banner** (coolant blue, pedagogical context). `.folder-mismatch-note` (UX 1.9) maps to **mismatch** (gunmetal dashed, neutral observation). `.edit-this-callout` (UX 1.10) maps to **callout** (amber edge + amber-on-dark copy-path button — the single point of brightest emphasis in dark mode).
5. **Detail-head folder edge.** A 6-px coloured left edge per fNN — the loudest folder cue on the page. Folder-scoped detail-heads (object, code-class/method, folder, schema-folder) get the colour; non-folder-scoped pages (schema overview, coverage, llm-candidates) keep a transparent edge so layouts line up.
6. **Filter pills.** `.filter-pill` adopts the hi-fi pill states: `--paper` bg + `--ink` border default, `--paper-2` hover, **inverted** active (ink bg + paper text), 2-px amber focus ring, dashed-transparent clear.
7. **strType badge.** Monochrome + dashed (`--paper-2` bg, `--bw` dashed `--ink-2` border). The dashed border is the kind cue distinguishing it from the solid-edge folder badge.
8. **Search dropdown + glossary card.** Input/dropdown migrate to `--paper`/`--ink`/`--paper-2`/`--paper-3`. Glossary cards adopt the **banner** semantic accent — pedagogical context, exact-match for "this is a concept, not an object."
9. **Topbar + tabs + legacy-token aliasing.** Header and `#tabs` consume `--paper-2`/`--ink`/`--ink-2`/`--ink-3`; active tab inverts to `--paper` to fuse with the page below; dark mode adds an amber 2-px indicator strip. The load-bearing piece: legacy `--bg`/`--fg`/`--accent`/`--warn`/etc. are now aliased to their hi-fi equivalents inside `[data-theme="dark"]`, so all ~150 unmigrated references inherit the hi-fi vocabulary without per-rule edits.
10. **Detail polish.** `.thresh-panel` consumes `--accent-banner-{bg,edge}` directly (replacing hardcoded `rgba(108,180,255,…)` blue tints); `.thresh-empty` warn variant tracked to `--accent-callout-*` (amber). `#folder-list` active row uses `--paper-3` + bold (the swatch already carries the colour cue; an extra coloured rule would compete).
11. **Theme toggle + light mode.** New `theme-toggle.js` mounts in `<head>` *before* the stylesheet so first paint is correct: synchronously sets `data-theme` from `localStorage`, then `prefers-color-scheme`, then default-dark. Adds a pill button to `<header>` that flips and persists. New `[data-theme="light"]` block aliases the legacy tokens to hi-fi *light* values (paper cream, ink black, banner-edge pedagogical blue, custom darker amber for `--warn` since the prototype's light-mode callout-edge is plain ink). Round-trip verified.
12. **Print stylesheet** (~80 lines). Token override forces black-on-white regardless of `[data-theme]`, suppresses chrome (header/tabs/folder rail/theme-toggle/etc.), folder colours fall to monochrome with edge thickness still distinguishing kinds, key cards (detail-head, banner, mismatch, callout, thresh-panel, refs-block group) get `page-break-inside: avoid`. Discharges HANDOFF Open question #6.

Acceptance per PLAN-DESIGN: every shipped UX slice (glossary search, prefix banners, folder-mismatch note, inline descriptions, filter pills, DSL primer, Edit-this callout, strType tooltip, Thresh panel) keeps working through all twelve commits — verified via `preview_eval` on computed styles at each step. localStorage keys unchanged. No console errors at any commit. Mini-graph drag-positioning untouched.

Pre-push fair-use: factor 1 transformative tooling, factor 2 our prose + our CSS, factor 3 trivial real-strName volume in the prototype's hands but the prototype itself isn't merged here, factor 4 visual reference useless without the data-explorer context. All four clear.

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

## 2026-05-03 — User stories from `test-data/mods/` source mods

Five new story files in `notes/user-stories/`, derived from studying two real mods sitting in a local `test-data/mods/` working tree (jwebmeister's `FreeTraits_and_StarterShipPlus`, Voideka's `HygieneStation`). Same modder-as-audience framing as the rest of the user-stories folder. (Originally `testdata_mods/`; renamed 2026-05-10 when the local-fixtures tree was unified under `test-data/` to also hold save folders for handoff investigations.)

- `mod-free-traits.md` — tuning mod (`traitscores.json` `aValues` cond-string, position 2 = age years; flip non-zero rows to `0`). Covers the careers `aSkillsHobby` companion override.
- `mod-hygiene-station.md` — full "add a new installable" mod, exercising condowners (installed + loose variants), items, conditions_simple, condtrigs, the `aInverse` interaction state machine, loot (`bNested`/`bSuppress` spawn-contents, `strType: interaction` destroy delegate), and installables (install / uninstall / dismantle / undamage).
- `mod-starter-ship.md` — character-creation chain `loot[strType:ship] ← lifeevents[strShipRewards] ← career[aEventsShip]`, plus the `bShipOwned` / `fShipMortgage` / `fShipDmgMax` / `fStartATCRange` / `strStartATC` field set on the life-event side.
- `mod-suppress-needs.md` — captured Discord exchange about a player-trait that flatlines needs. The mod path is the `Thresh<StatName>` pattern (additive, save-safe). Includes an explicit acceptance criterion ("…without needing to ask on Discord").
- `explore-needs-loop.md` — a meta-story (explicitly disclaimed up top as "designer exploration, not a mod-making story") on what the explorer needs to surface so a designer can see why the needs loop reads as a treadmill. Two paths: (1) conversational agency — `StatSocialization` / `StatBelonging` are real but `nDisplaySelf=0` until crisis; (2) drain/refill asymmetry — passive drain vs. active refill, rates buried in tick-effect loot edges. Findings feed into `mod-suppress-needs.md` and into UX 1.1 / 1.4 / 1.10 component requirements.

`.gitignore` adds `/testdata_mods/` (later widened to `/test-data/`) — the source mods are local working material, not redistributable. Stories cite their paths but the trees themselves stay local.

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
