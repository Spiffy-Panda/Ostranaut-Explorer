"""render_user_stories.py

Renders every notes/user-stories/*.md file to a styled HTML page in
src/Ostranauts.Site/user-stories/ (gitignored — generated artifact),
plus an index.html that lists them with their PLAN.md routing
classification (EXPLORER / AST / partial / dangling).

Output lives alongside the site source so direct file:// preview of
src/Ostranauts.Site/index.html resolves the User Stories tab card.
The Makefile's site / site-public targets cp -r SITE_SRC/. into the
build output, picking the rendered HTML up automatically.

Stdlib only. The markdown subset supported is whatever the existing
user-story files actually use:

  - # / ## / ### / #### headers
  - paragraphs (blank-line separated)
  - fenced code blocks (``` with optional language hint)
  - inline code spans (`...`)
  - bold (**...**), italic (*...* and _..._)
  - links [text](url) — sibling .md targets are rewritten to .html
  - blockquotes (> ...)
  - bullet lists (-) and ordered lists (1.)
  - horizontal rules (---)
  - GFM-style tables

No nested lists, no setext headers, no images, no footnotes. If a story
adds something fancier, extend this file.

Usage:
    python utils/python/render_user_stories.py
    python utils/python/render_user_stories.py --in notes/user-stories --out path/to/output
"""

from __future__ import annotations

import argparse
import html
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_IN = REPO_ROOT / "notes" / "user-stories"
DEFAULT_OUT = REPO_ROOT / "src" / "Ostranauts.Site" / "user-stories"


# Routing classification, mirrors PLAN.md's user-story table. Update both
# together when stories are added or rerouted.
ROUTING: dict[str, tuple[str, str]] = {
    "anti-g-loc-leggings":            ("EXPLORER", "Skilled-modder traversal: leggings → ThreshStatGrav threshold-shift dial."),
    "anti-g-loc-newcomer":            ("EXPLORER", "Same destination as leggings story but the explorer has to teach the rungs."),
    "crew-exercise-invisible-need":   ("EXPLORER + AST partial", "Tick-effect tracing is data-side; the AI-scoring 'why leisure when needs green' piece needs PLAN-AST Phase 2."),
    "explore-needs-loop":             ("DANGLING",  "Designer-exploration story; spans data + code + a framing gap. Neither plan addresses the diagnostic-framing UX."),
    "mod-free-traits":                ("EXPLORER", "traitscores schema + folder navigation; covered by basic search + ref blocks."),
    "mod-hygiene-station":            ("EXPLORER", "Template-hub pages (UX 3.2) + cross-folder ref traversal from the Sink pattern."),
    "mod-starter-ship":               ("EXPLORER", "Folder index + cross-folder ref traversal from character-creation entries to ships."),
    "mod-suppress-needs":             ("EXPLORER", "Mostly served by the shipped needs-suppression handoff page; remaining gaps are schema descriptions."),
    "rewire-co2-alarm-to-remote-pump": ("AST",     "Phase 3 territory. Runtime-wired panel ports rendered as dashed edges with explainer banners."),
    "trace-engine-emitted-condition":  ("AST",     "Phase 2 territory. Engine-emitted conditions get populated detail pages with code:component producers."),
    "debug-broken-aupdatecommands-line": ("AST",   "Phase 2 territory. Structured positional-arg render of aUpdateCommands entries with resolution-failure markers."),
}


# ─── inline rendering ──────────────────────────────────────────────────

CODE_SPAN_RE = re.compile(r"`([^`\n]+)`")
LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)\s]+)(?:\s+\"[^\"]*\")?\)")
BOLD_RE = re.compile(r"\*\*([^*\n]+)\*\*")
ITALIC_AST_RE = re.compile(r"(?<!\w)\*([^*\n]+)\*(?!\w)")
ITALIC_UND_RE = re.compile(r"(?<!\w)_([^_\n]+)_(?!\w)")


def rewrite_link_target(target: str) -> str:
    """Sibling user-story links (foo.md or ./foo.md) → foo.html.

    Anything else (relative path with ../, absolute URL, anchor) passes
    through unchanged. The rendered tree is flat, so a sibling .md
    becomes a sibling .html in the output dir.
    """
    if target.startswith(("http://", "https://", "#", "mailto:")):
        return target
    # Strip a leading ./ if present.
    cleaned = target[2:] if target.startswith("./") else target
    if "/" in cleaned:
        return target  # cross-folder repo path; leave alone (will 404 in this output, fix later)
    if cleaned.endswith(".md"):
        return cleaned[:-3] + ".html"
    return target


def render_inline(text: str) -> str:
    """Markdown → HTML for a single line's worth of inline content.

    Order matters: extract code spans into placeholders (their contents
    must NOT be processed for emphasis), then escape HTML, then handle
    everything else, then substitute the code spans back in.
    """
    placeholders: list[str] = []

    def stash_code(m: re.Match) -> str:
        placeholders.append(html.escape(m.group(1)))
        return f"\x00CODE{len(placeholders) - 1}\x00"

    text = CODE_SPAN_RE.sub(stash_code, text)
    text = html.escape(text)
    text = LINK_RE.sub(
        lambda m: f'<a href="{html.escape(rewrite_link_target(m.group(2)))}">{m.group(1)}</a>',
        text,
    )
    text = BOLD_RE.sub(r"<strong>\1</strong>", text)
    text = ITALIC_AST_RE.sub(r"<em>\1</em>", text)
    text = ITALIC_UND_RE.sub(r"<em>\1</em>", text)
    for i, code in enumerate(placeholders):
        text = text.replace(f"\x00CODE{i}\x00", f"<code>{code}</code>")
    return text


# ─── block rendering ───────────────────────────────────────────────────

HEADER_RE = re.compile(r"^(#{1,6})\s+(.+?)\s*$")
HR_RE = re.compile(r"^-{3,}\s*$")
ULIST_RE = re.compile(r"^\s*[-*]\s+(.+)$")
OLIST_RE = re.compile(r"^\s*\d+\.\s+(.+)$")
TABLE_SEP_RE = re.compile(r"^\s*\|?[\s|:-]+\|[\s|:-]+\s*$")


def is_block_break(line: str) -> bool:
    """True if this line starts a new block — used to terminate paragraphs."""
    if not line.strip():
        return True
    if line.startswith("```"):
        return True
    if HEADER_RE.match(line):
        return True
    if HR_RE.match(line):
        return True
    if ULIST_RE.match(line) or OLIST_RE.match(line):
        return True
    if line.lstrip().startswith(">"):
        return True
    if line.lstrip().startswith("|"):
        return True
    return False


def render_table(rows: list[str]) -> str:
    """Render a GFM-style table. rows[0] is the header, rows[1] is the
    separator (already validated by caller), rest are body rows."""
    def split_cells(line: str) -> list[str]:
        s = line.strip()
        if s.startswith("|"):
            s = s[1:]
        if s.endswith("|"):
            s = s[:-1]
        return [c.strip() for c in s.split("|")]

    headers = split_cells(rows[0])
    body = [split_cells(r) for r in rows[2:]]
    out = ["<table>", "<thead><tr>"]
    out.extend(f"<th>{render_inline(h)}</th>" for h in headers)
    out.append("</tr></thead><tbody>")
    for row in body:
        out.append("<tr>")
        out.extend(f"<td>{render_inline(c)}</td>" for c in row)
        out.append("</tr>")
    out.append("</tbody></table>")
    return "".join(out)


def render_md(text: str) -> str:
    lines = text.splitlines()
    out: list[str] = []
    i = 0
    while i < len(lines):
        line = lines[i]

        # Fenced code block.
        if line.startswith("```"):
            lang = line[3:].strip()
            i += 1
            block: list[str] = []
            while i < len(lines) and not lines[i].startswith("```"):
                block.append(html.escape(lines[i]))
                i += 1
            i += 1  # skip closing fence
            cls = f' class="lang-{html.escape(lang)}"' if lang else ""
            out.append(f"<pre><code{cls}>{chr(10).join(block)}</code></pre>")
            continue

        # Header.
        m = HEADER_RE.match(line)
        if m:
            level = len(m.group(1))
            out.append(f"<h{level}>{render_inline(m.group(2))}</h{level}>")
            i += 1
            continue

        # Horizontal rule.
        if HR_RE.match(line):
            out.append("<hr>")
            i += 1
            continue

        # Blockquote: collect contiguous > lines, recurse on the inner.
        if line.lstrip().startswith(">"):
            block = []
            while i < len(lines) and lines[i].lstrip().startswith(">"):
                stripped = lines[i].lstrip()[1:]
                if stripped.startswith(" "):
                    stripped = stripped[1:]
                block.append(stripped)
                i += 1
            out.append(f"<blockquote>{render_md(chr(10).join(block))}</blockquote>")
            continue

        # Table: header line followed by separator.
        if line.lstrip().startswith("|") and i + 1 < len(lines) and TABLE_SEP_RE.match(lines[i + 1]):
            tbl: list[str] = []
            while i < len(lines) and lines[i].lstrip().startswith("|"):
                tbl.append(lines[i])
                i += 1
            out.append(render_table(tbl))
            continue

        # List (ul or ol).
        if ULIST_RE.match(line) or OLIST_RE.match(line):
            ordered = bool(OLIST_RE.match(line))
            tag = "ol" if ordered else "ul"
            items: list[str] = []
            while i < len(lines) and (ULIST_RE.match(lines[i]) or OLIST_RE.match(lines[i])):
                m = OLIST_RE.match(lines[i]) if ordered else ULIST_RE.match(lines[i])
                if m is None:
                    break
                content = m.group(1)
                i += 1
                # Pull continuation lines that are indented or just plain
                # paragraph text under the same item, until next list
                # marker or block break.
                cont: list[str] = [content]
                while i < len(lines) and lines[i].strip() and not is_block_break(lines[i]):
                    cont.append(lines[i].strip())
                    i += 1
                items.append("<li>" + render_inline(" ".join(cont)) + "</li>")
            out.append(f"<{tag}>{''.join(items)}</{tag}>")
            continue

        # Blank line.
        if not line.strip():
            i += 1
            continue

        # Paragraph: collect contiguous non-block lines.
        para: list[str] = []
        while i < len(lines) and lines[i].strip() and not is_block_break(lines[i]):
            para.append(lines[i].strip())
            i += 1
        out.append(f"<p>{render_inline(' '.join(para))}</p>")

    return "\n".join(out)


# ─── HTML wrapper ──────────────────────────────────────────────────────

PAGE_TEMPLATE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title} — Ostranaut Explorer user stories</title>
<link rel="stylesheet" href="../style.css">
<style>
  main.story {{
    max-width: 56rem;
    margin: 0 auto;
    padding: 2rem 1.5rem 4rem;
  }}
  main.story nav.crumb {{ font-size: 0.8125rem; margin-bottom: 1.5rem; }}
  main.story nav.crumb a {{ color: var(--muted); }}
  main.story nav.crumb a:hover {{ color: var(--accent); }}
  main.story h1 {{ margin-top: 0; }}
  main.story h2 {{ margin-top: 2rem; border-bottom: 1px solid var(--border); padding-bottom: 0.25rem; }}
  main.story h3 {{ margin-top: 1.5rem; }}
  main.story p, main.story li {{ line-height: 1.6; }}
  main.story blockquote {{
    margin: 0.75rem 0;
    padding: 0.5rem 1rem;
    border-left: 3px solid var(--accent-dim);
    background: var(--bg-elev);
    color: var(--fg);
  }}
  main.story blockquote p:first-child {{ margin-top: 0; }}
  main.story blockquote p:last-child {{ margin-bottom: 0; }}
  main.story pre {{
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 0.75rem 1rem;
    overflow-x: auto;
    font-size: 0.875em;
  }}
  main.story code {{
    background: var(--bg-elev);
    padding: 0.05em 0.35em;
    border-radius: 3px;
  }}
  main.story pre code {{ background: none; padding: 0; }}
  main.story hr {{ border: none; border-top: 1px solid var(--border); margin: 2rem 0; }}
  main.story table {{ border-collapse: collapse; margin: 1rem 0; width: 100%; }}
  main.story th, main.story td {{
    text-align: left;
    padding: 0.4rem 0.6rem;
    border: 1px solid var(--border);
  }}
  main.story th {{ background: var(--bg-elev); }}
  .routing-tag {{
    display: inline-block;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.75rem;
    padding: 0.1rem 0.4rem;
    border-radius: 3px;
    background: var(--bg-elev);
    border: 1px solid var(--border);
    color: var(--muted);
  }}
  .routing-tag.ast {{ color: var(--accent); border-color: var(--accent-dim); }}
  .routing-tag.dangling {{ color: var(--warn); border-color: var(--warn); }}
</style>
</head>
<body>
  <header>
    <h1>Ostranaut Explorer</h1>
    <p class="status">user story · <span class="routing-tag {tag_class}">{tag}</span></p>
  </header>
  <main class="story">
    <nav class="crumb"><a href="index.html">← user stories</a> · <a href="../index.html">cover</a></nav>
{body}
  </main>
</body>
</html>
"""


INDEX_TEMPLATE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>User stories — Ostranaut Explorer</title>
<link rel="stylesheet" href="../style.css">
<style>
  main.cover {{ max-width: 56rem; margin: 0 auto; padding: 2rem 1.5rem 4rem; }}
  main.cover nav.crumb {{ font-size: 0.8125rem; margin-bottom: 1.5rem; }}
  main.cover nav.crumb a {{ color: var(--muted); }}
  main.cover nav.crumb a:hover {{ color: var(--accent); }}
  main.cover .lead {{ color: var(--muted); margin-bottom: 2rem; }}
  main.cover h2 {{
    font-size: 0.8125rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--muted);
    margin: 2rem 0 0.875rem;
    font-weight: 600;
  }}
  main.cover ul.story-list {{ list-style: none; padding: 0; margin: 0; }}
  main.cover ul.story-list li {{
    padding: 0.875rem 1rem;
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: 6px;
    margin-bottom: 0.625rem;
  }}
  main.cover ul.story-list a {{ font-weight: 600; }}
  main.cover ul.story-list .summary {{ color: var(--fg); font-size: 0.9375rem; margin-top: 0.25rem; }}
  main.cover ul.story-list .meta {{
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.75rem;
    color: var(--muted);
    margin-top: 0.5rem;
  }}
  .routing-tag {{
    display: inline-block;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.75rem;
    padding: 0.1rem 0.4rem;
    border-radius: 3px;
    background: var(--bg);
    border: 1px solid var(--border);
    color: var(--muted);
  }}
  .routing-tag.ast {{ color: var(--accent); border-color: var(--accent-dim); }}
  .routing-tag.dangling {{ color: var(--warn); border-color: var(--warn); }}
</style>
</head>
<body>
  <header>
    <h1>Ostranaut Explorer</h1>
    <p class="status">user stories — scoring scenarios for "is the explorer good enough"</p>
  </header>
  <main class="cover">
    <nav class="crumb"><a href="../index.html">← cover</a></nav>
    <p class="lead">Each story is an end-to-end scenario a modder (or designer) is meant to walk smoothly. The classification tag points at which planning axis carries it — see <code>PLAN.md</code> at the repo root for the routing rationale and dangling section.</p>
{body}
  </main>
</body>
</html>
"""


def tag_class_for(routing_tag: str) -> str:
    if routing_tag.startswith("AST"):
        return "ast"
    if "DANGLING" in routing_tag:
        return "dangling"
    return ""


def extract_title_and_lead(md_text: str) -> tuple[str, str]:
    """Pull the H1 and the first paragraph after it for the index summary."""
    lines = md_text.splitlines()
    title = ""
    lead = ""
    for i, line in enumerate(lines):
        if line.startswith("# "):
            title = line[2:].strip()
            for j in range(i + 1, len(lines)):
                if lines[j].strip():
                    para: list[str] = []
                    while j < len(lines) and lines[j].strip() and not is_block_break(lines[j]):
                        para.append(lines[j].strip())
                        j += 1
                    lead = " ".join(para)
                    break
            break
    return title, lead


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--in", dest="indir", default=str(DEFAULT_IN))
    p.add_argument("--out", dest="outdir", default=str(DEFAULT_OUT))
    args = p.parse_args()

    indir = Path(args.indir)
    outdir = Path(args.outdir)

    if not indir.is_dir():
        print(f"Error: input directory not found: {indir}", file=sys.stderr)
        return 1

    outdir.mkdir(parents=True, exist_ok=True)

    md_files = sorted(indir.glob("*.md"))
    if not md_files:
        print(f"No .md files in {indir}", file=sys.stderr)
        return 1

    index_entries: list[tuple[str, str, str, str, str]] = []  # (slug, title, lead, tag, summary)

    for md_path in md_files:
        slug = md_path.stem
        text = md_path.read_text(encoding="utf-8")
        title, lead = extract_title_and_lead(text)
        body_html = render_md(text)
        tag, summary = ROUTING.get(slug, ("UNROUTED", "Not yet classified in PLAN.md."))
        page = PAGE_TEMPLATE.format(
            title=html.escape(title or slug),
            tag=html.escape(tag),
            tag_class=tag_class_for(tag),
            body=body_html,
        )
        out_path = outdir / f"{slug}.html"
        out_path.write_text(page, encoding="utf-8")
        index_entries.append((slug, title or slug, lead, tag, summary))

    # Group index by tag for the listing.
    groups: dict[str, list[tuple[str, str, str, str, str]]] = {
        "EXPLORER": [],
        "EXPLORER + AST partial": [],
        "AST": [],
        "DANGLING": [],
        "UNROUTED": [],
    }
    for entry in index_entries:
        groups.setdefault(entry[3], []).append(entry)

    body_chunks: list[str] = []
    for group_name in ("EXPLORER", "EXPLORER + AST partial", "AST", "DANGLING", "UNROUTED"):
        rows = groups.get(group_name, [])
        if not rows:
            continue
        body_chunks.append(f"<h2>{html.escape(group_name)}</h2>")
        body_chunks.append('<ul class="story-list">')
        for slug, title, _lead, tag, summary in rows:
            body_chunks.append(
                f'<li><a href="{slug}.html">{render_inline(title)}</a>'
                f'<div class="summary">{render_inline(summary)}</div>'
                f'<div class="meta"><span class="routing-tag {tag_class_for(tag)}">{html.escape(tag)}</span> · <code>notes/user-stories/{slug}.md</code></div></li>'
            )
        body_chunks.append("</ul>")

    index_html = INDEX_TEMPLATE.format(body="\n".join(body_chunks))
    (outdir / "index.html").write_text(index_html, encoding="utf-8")

    print(f"Rendered {len(md_files)} stories + index.html -> {outdir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
