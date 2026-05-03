# CODE-DESIGN.md — LLM navigation index

This file is written for AI agents working in this repo. It tells you where to look for high-signal information about the code without having to read every source file.

## Why this exists

Reading source files burns context budget. Most of the time an agent only needs the *shape* of a class — its public API, its purpose, what it depends on, what depends on it — not the implementation. `CodeDocs/` holds those summaries so you can answer questions and plan changes without opening the underlying `.cs` file.

Open the actual source only when:
- You're about to modify it.
- You need behavior detail the overview doesn't capture.
- The overview looks stale and you need to verify against ground truth.

## Layout of `CodeDocs/`

```
CodeDocs/
├── 00_PROJECT.md                  high-level architecture; read first
├── iverifiable-ref-map.md         decompiled IVerifiable.GetVerifiables() map — ground truth for ref fields
├── sources/                       one .md per .cs source file, mirrors src/ tree
│   ├── Ostranauts.DataModel/      C# library — parsing, indexing, graph
│   └── Ostranauts.Site.Builder/   CLI driver
└── io/                            file format specs the schemas don't cover
    ├── inputs.md                  files this project READS
    └── outputs.md                 files this project WRITES
```

The directory listing is the source of truth for what's there — the rule is "one `.md` per `.cs` source file." `Ostranauts.Site/` is intentionally not covered (HTML/CSS/JS is self-explanatory; the file IS the spec).

### What's in each file kind

**`00_PROJECT.md`** — small. The architectural recap an agent needs before drilling into anything specific: what the projects are, how they connect, the v0/v1/v2 split at a sentence each. This is the file you read top-to-bottom on session start. For longer-form rationale see `PROJECT-PITCH.md`; for active work see `PLAN.md`; for the user-facing pitch see `README.md`.

**`iverifiable-ref-map.md`** — extracted from the game's own `IVerifiable.GetVerifiables()` calls in `decomp/`. Authoritative map of which fields on which `Json*` classes resolve to which target folders. The schema-driven extractor's reference rules are validated against this; new schema overlays get sanity-checked here before they ship.

**`sources/<Project>/<File>.md`** — per-source-file overview. Each one carries:
- File path
- Status (real / stubbed / partial)
- Purpose (one short paragraph)
- Public API (signatures of every public type and member)
- Depends on / Used by

The signatures should be complete enough that you can call into the API correctly without opening the `.cs`. Internal/private members are omitted.

**`io/inputs.md` and `io/outputs.md`** — file-format specs for things the system reads or produces, when those formats aren't already documented by a JSON schema. `inputs.md` covers the five input surfaces — `data/`, `data/schemas/`, `comment_mod/data/schemas/`, `wiki_cache/`, `decomp/` — and the structural context the schemas don't (folder discovery, multi-root overlay, what each consumer does with each surface). `outputs.md` describes our generated artifacts (`graph.js`, `properties.js`, `code_refs.js`, `ref_candidates.js`, the static-site files copied verbatim).

Self-explanatory formats — HTML, CSS, JS source — don't need entries. The HTML is the spec.

## Sync protocol

`CodeDocs/` is only useful if it stays accurate. The rules live in `CLAUDE.md` ("CodeDocs sync" section) but the short version:

1. Before any commit, every changed source file's overview must reflect the new state. If you added a public method, the overview lists it. If you changed a signature, the overview matches.
2. If you write or change a generated/consumed file format, update `io/inputs.md` or `io/outputs.md` to match.
3. If you notice a drift while reading (overview claims a method that no longer exists, or vice versa), don't just patch the one — audit the whole tree against the current code and re-sync everything that's stale.

## Subagent forwarding

When delegating to an Agent, include this directive in the prompt: *"Read `CODE-DESIGN.md` and `CodeDocs/00_PROJECT.md` before navigating any source file. If your work touches code, update the matching `CodeDocs/sources/.../X.md` before reporting completion."*
