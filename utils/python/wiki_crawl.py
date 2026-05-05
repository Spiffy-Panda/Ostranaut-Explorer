"""Recursively crawl the Ostranauts wiki from a seed page, caching every
reachable page that matches a path filter.

Reuses the cache machinery from wiki_cache.py. After fetching a page,
scans its wikitext for [[Internal Link]] references and queues any matching
the filter that aren't already cached.

Usage:
    python utils/python/wiki_crawl.py [--prefix Modding] [--max 200]

Defaults: seed = "Modding", prefix filter = "Modding", max pages = 200.
By default re-uses anything already cached on disk; pass --refresh to
re-fetch all pages reached during this crawl.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

# Re-use the existing single-page cache helpers from the sibling module.
sys.path.insert(0, str(Path(__file__).resolve().parent))
from wiki_cache import (
    url_to_title, title_to_slug, fetch, to_markdown,
    RAW_DIR, MD_DIR, REPO_ROOT,
)

# [[Target]] or [[Target|display text]] — capture the target part only.
INTERNAL_LINK = re.compile(r"\[\[([^\[\]|#]+)(?:\|[^\]]*)?\]\]")


def extract_links(wikitext: str) -> list[str]:
    """All unique [[Page]] targets found in the text. Preserves order."""
    seen = []
    for m in INTERNAL_LINK.finditer(wikitext):
        target = m.group(1).strip().replace(" ", "_")
        if target and target not in seen:
            seen.append(target)
    return seen


def matches_prefix(title: str, prefix: str) -> bool:
    """Title is in scope if it starts with the prefix (case-sensitive,
    treats Foo and Foo/Bar both as "in Modding")."""
    return title == prefix or title.startswith(prefix + "/")


def fetch_and_cache(title: str, refresh: bool, payload_cache: dict) -> tuple[Path, str] | None:
    """Returns (md_path, wikitext). Caches raw JSON + markdown to disk."""
    slug = title_to_slug(title)
    raw_path = RAW_DIR / f"{slug}.json"
    md_path = MD_DIR / f"{slug}.md"

    if md_path.exists() and not refresh:
        text = md_path.read_text(encoding="utf-8")
        # strip frontmatter to get raw wikitext for link scanning
        wikitext = text.split("---\n\n", 1)[-1] if text.startswith("---\n") else text
        return md_path, wikitext

    print(f"fetch {title}")
    try:
        payload = fetch(title)
    except Exception as exc:
        print(f"  FAIL: {exc}", file=sys.stderr)
        return None
    if "error" in payload:
        print(f"  API error: {payload['error'].get('info')}", file=sys.stderr)
        return None

    import json
    raw_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
    md_text = to_markdown(title, payload)
    md_path.write_text(md_text, encoding="utf-8")
    wikitext = payload["parse"]["wikitext"]
    return md_path, wikitext


def crawl(seed: str, prefix: str, max_pages: int, refresh: bool) -> dict[str, Path]:
    """Returns {title: cached_md_path}."""
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    MD_DIR.mkdir(parents=True, exist_ok=True)

    queue: list[str] = [seed]
    seen: set[str] = set()
    cached: dict[str, Path] = {}
    skipped_out_of_scope: set[str] = set()

    while queue and len(cached) < max_pages:
        title = queue.pop(0)
        if title in seen:
            continue
        seen.add(title)

        if not matches_prefix(title, prefix):
            skipped_out_of_scope.add(title)
            continue

        result = fetch_and_cache(title, refresh, payload_cache={})
        if result is None:
            continue
        md_path, wikitext = result
        cached[title] = md_path

        # enqueue every internal link in scope
        for link in extract_links(wikitext):
            if link not in seen and link not in queue:
                queue.append(link)

    print()
    print(f"crawled {len(cached)} pages (cap: {max_pages})")
    if len(queue) > 0:
        print(f"  {len(queue)} more in queue (cap reached); re-run with higher --max to continue")
    if skipped_out_of_scope:
        sample = sorted(skipped_out_of_scope)[:5]
        print(f"  skipped {len(skipped_out_of_scope)} out-of-scope link(s); examples: {sample}")
    return cached


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--seed", default="Modding", help="starting page title (default: Modding)")
    ap.add_argument("--prefix", default="Modding", help="only follow links whose title starts with this prefix (default: Modding)")
    ap.add_argument("--max", type=int, default=200, help="cap on total pages fetched in one run (default: 200)")
    ap.add_argument("--refresh", action="store_true", help="re-fetch every page reached, ignoring on-disk cache")
    args = ap.parse_args()

    cached = crawl(args.seed, args.prefix, args.max, args.refresh)
    if not cached:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
