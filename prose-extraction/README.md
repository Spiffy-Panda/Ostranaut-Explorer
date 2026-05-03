# prose-extraction/

Per-page provenance documents from the LLM-assist wiki extraction pass.

## What lives here

One markdown file per (wiki page, model) pair, named:

```
prose-extraction/<slug>-<model-family>.md
```

Where `<slug>` is the wiki cache slug (slashes → `__`, e.g. `Modding__CondOwners`)
and `<model-family>` is the short family name (`haiku` / `sonnet` / `opus`).
The full model snapshot ID (e.g. `claude-sonnet-4-6`) is recorded inside the
file's frontmatter for exact-build audit; the family name in the filename is
just a coarse handle.

## Why files, not a script that emits patches

These docs are the **deliverable** of the extraction pass. They're not
machine-applied — a downstream LLM step reads them and proposes the actual
schema diffs into `comment_mod/data/schemas/`. Keeping the prose intermediate
gives us:

- **Provenance.** Every claimed field has a verbatim wiki quote next to the
  model's interpretation. If a downstream patch looks wrong, you can trace it
  back to the exact reasoning.
- **Multi-model comparison.** Run the same page through haiku/sonnet/opus to
  calibrate where model spend pays off. Filenames already accommodate this
  (`<slug>-haiku.md` and `<slug>-opus.md` coexist).
- **Cheap re-runs.** Hallucinations land in a markdown file that's trivial to
  throw away. Patches landing in `comment_mod` directly would mean every wrong
  rule emits real (wrong) edges in the graph.

## Audit trail

Use `git log -- prose-extraction/<file>` to see prior extractions of the same
(page, model) pair. Re-runs overwrite the file; history preserves the diff.
