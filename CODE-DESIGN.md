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
├── sources/                       one .md per source file, mirrors src/ tree
│   ├── Ostranauts.DataModel/
│   │   ├── CondString.md
│   │   ├── DataLoader.md
│   │   ├── DataObject.md
│   │   ├── GraphExporter.md
│   │   ├── ObjectIndex.md
│   │   ├── Reference.md
│   │   ├── ReferenceExtractor.md
│   │   ├── SchemaCatalog.md
│   │   └── SchemaLoader.md
│   └── Ostranauts.Site.Builder/
│       └── Program.md
└── io/                            file format specs the schemas don't cover
    ├── inputs.md                  files this project READS
    └── outputs.md                 files this project WRITES
```

### What's in each file kind

**`00_PROJECT.md`** — small. The architectural recap an agent needs before drilling into anything specific: what the projects are, how they connect, the v0/v1/v2 split at a sentence each. This is the file you read top-to-bottom on session start. For longer-form rationale see `PROJECT-PITCH.md`; for the user-facing pitch see `README.md`.

**`sources/<Project>/<File>.md`** — per-source-file overview. Each one carries:
- File path
- Status (real / stubbed / partial)
- Purpose (one short paragraph)
- Public API (signatures of every public type and member)
- Depends on / Used by

The signatures should be complete enough that you can call into the API correctly without opening the `.cs`. Internal/private members are omitted.

**`io/inputs.md` and `io/outputs.md`** — file-format specs for things the system reads or produces, when those formats aren't already documented by a JSON schema. The Ostranauts data tree's `data/schemas/*-schema.json` files ARE authoritative for the shape of input data — `inputs.md` only adds context the schemas don't cover (which folders are in scope, how files are discovered, what the loader does with them). `outputs.md` describes our generated artifacts (`graph.json`, future per-object files, `build/` layout).

Self-explanatory formats — HTML, CSS, JS — don't need entries. The HTML is the spec.

## Sync protocol

`CodeDocs/` is only useful if it stays accurate. The rules live in `CLAUDE.md` ("CodeDocs sync" section) but the short version:

1. Before any commit, every changed source file's overview must reflect the new state. If you added a public method, the overview lists it. If you changed a signature, the overview matches.
2. If you write or change a generated/consumed file format, update `io/inputs.md` or `io/outputs.md` to match.
3. If you notice a drift while reading (overview claims a method that no longer exists, or vice versa), don't just patch the one — audit the whole tree against the current code and re-sync everything that's stale.

## Subagent forwarding

When delegating to an Agent, include this directive in the prompt: *"Read `CODE-DESIGN.md` and `CodeDocs/00_PROJECT.md` before navigating any source file. If your work touches code, update the matching `CodeDocs/sources/.../X.md` before reporting completion."*
