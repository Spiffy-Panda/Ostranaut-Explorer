# DEV-LOG

Reverse-chronological. Add an entry before every commit — at minimum a one-liner, ideally a short paragraph when the change is non-obvious. Tag with ISO date.

---

## 2026-05-03 — Ghost-rule preservation in schemas

Per the user's "keep ghosts, document them in editor as ghosts" decision: instead of removing the 18 `JsonInteraction` and 5 `JsonPlot` schema fields that `07_decomp_schema_table.py` flagged as not-in-decomp, marked them with a JSON Schema `x-ghost: true` extension. The flag rides through `SchemaCatalog.FieldRule.IsGhost` → `GraphExporter` (graph.js v3 adds `isGhost` on rule entries) → site `#/schemas` and `#/schema/<folder>` views (rendered with a 👻 badge in italics + warn color, dim treatment skipped on ghost zero-edge rules).

Rationale: ghost fields might be referenced in older docs, used by mods, or restored by future game updates — modders editing JSON benefit from "I see this field name documented but the game won't read it." Each ghost description starts with `[GHOST: ...]` so even tooltip-style views surface the status without the `x-ghost` machinery.

Also: `strPledgeRemove`, which I had added in the Slice A interactions overlay on (incorrect) wiki authority, was downgraded to ghost — the decomp showed `JsonInteraction` only deserializes `strPledgeAdd`/`strPledgeAddThem`, with no removal counterpart. Net: rules grew 62 → 74 (+12 ghosts; 5 are non-string-shaped so don't manifest as rules); edge count unchanged at 63,829.

graph.js schema bumped 2 → 3. Tests 60 → 61 (one new round-trip test).

## 2026-05-02 — Decomp cross-check script + dev infrastructure

Added `scrap_scripts/python/06_decomp_schema_crosscheck.py`, a Python audit tool that diffs the decompiled C# `Json*.cs` classes in `decomp/Assembly-CSharp/` against our JSON schemas in `data/schemas/` and `comment_mod/data/schemas/`. It reports three things per matched pair: fields present in C# but absent from the schema (coverage gaps), fields in the schema but absent from C# (possible errors or legacy docs), and unmatched classes/schemas that have no mapping yet.

The decomp folder (`decomp/Assembly-CSharp/`) contains 126 `Json*.cs` files that are the authoritative source of truth for which fields the game actually deserializes — they are the ground truth the schemas should reflect. 12 of those classes map directly to folders we already have schemas for.

Also: created this file, updated CLAUDE.md with the dev-log commit rule and a note that the game uses LitJson for JSON deserialization (affects field naming conventions and edge case parsing behavior).
