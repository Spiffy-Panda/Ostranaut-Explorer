"""Fetch an Ostranauts wiki page once and cache it locally.

Uses the MediaWiki action API to grab raw wikitext, which is dramatically
more LLM-friendly than scraped HTML — already-structured headings, lists,
inline links, no presentation noise.

Usage:
    python utils/python/wiki_cache.py <url-or-page-title> [...]

Examples:
    python utils/python/wiki_cache.py https://ostranauts.wiki.gg/wiki/Modding/Data_Modding
    python utils/python/wiki_cache.py Modding/CondOwners

Idempotent: skips fetch if the cache file already exists. Pass --refresh
to force a re-fetch.

Outputs:
    wiki_cache/raw/<slug>.json       full API response (debugging, future re-extracts)
    wiki_cache/markdown/<slug>.md    extracted wikitext with a small frontmatter header
"""

from __future__ import annotations

import argparse
import json
import sys
import urllib.parse
import urllib.request
from pathlib import Path

WIKI_HOST = "https://ostranauts.wiki.gg"
API_ENDPOINT = f"{WIKI_HOST}/api.php"

REPO_ROOT = Path(__file__).resolve().parents[2]
CACHE_DIR = REPO_ROOT / "wiki_cache"
RAW_DIR = CACHE_DIR / "raw"
MD_DIR = CACHE_DIR / "markdown"


def url_to_title(arg: str) -> str:
    """Accept a full wiki URL or a bare page title; return the page title."""
    if arg.startswith("http://") or arg.startswith("https://"):
        path = urllib.parse.urlparse(arg).path
        prefix = "/wiki/"
        if not path.startswith(prefix):
            raise ValueError(f"unexpected wiki URL shape: {arg}")
        return urllib.parse.unquote(path[len(prefix):])
    return arg.lstrip("/")


def title_to_slug(title: str) -> str:
    """Filename-safe slug. Slashes become double-underscores so the
    page hierarchy is still readable."""
    return title.replace("/", "__").replace(" ", "_")


def fetch(title: str) -> dict:
    params = {
        "action": "parse",
        "page": title,
        "prop": "wikitext|displaytitle|categories|sections|links",
        "format": "json",
        "formatversion": "2",
        "redirects": "1",
    }
    url = f"{API_ENDPOINT}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers={"User-Agent": "OstranautDataExplorer/0.1 (local cache)"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def to_markdown(title: str, payload: dict) -> str:
    if "error" in payload:
        err = payload["error"]
        raise RuntimeError(f"wiki API error for '{title}': {err.get('code')}: {err.get('info')}")
    parsed = payload["parse"]
    wikitext = parsed["wikitext"]
    display_title = parsed.get("displaytitle", title)
    sections = parsed.get("sections", [])
    section_count = len(sections)

    header = (
        f"---\n"
        f"source_title: {title}\n"
        f"display_title: {display_title}\n"
        f"source_url: {WIKI_HOST}/wiki/{urllib.parse.quote(title)}\n"
        f"section_count: {section_count}\n"
        f"---\n\n"
    )
    return header + wikitext


def cache_one(arg: str, refresh: bool) -> Path:
    title = url_to_title(arg)
    slug = title_to_slug(title)
    raw_path = RAW_DIR / f"{slug}.json"
    md_path = MD_DIR / f"{slug}.md"

    if md_path.exists() and not refresh:
        print(f"hit  {title}  ->  {md_path.relative_to(REPO_ROOT)}")
        return md_path

    print(f"fetch {title}")
    payload = fetch(title)
    raw_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
    md_path.write_text(to_markdown(title, payload), encoding="utf-8")
    print(f"     ->  {md_path.relative_to(REPO_ROOT)}  ({md_path.stat().st_size} bytes)")
    return md_path


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("pages", nargs="+", help="URL(s) or page title(s)")
    parser.add_argument("--refresh", action="store_true", help="re-fetch even if cached")
    args = parser.parse_args()

    RAW_DIR.mkdir(parents=True, exist_ok=True)
    MD_DIR.mkdir(parents=True, exist_ok=True)

    failures = 0
    for arg in args.pages:
        try:
            cache_one(arg, args.refresh)
        except Exception as exc:
            print(f"FAIL {arg}: {exc}", file=sys.stderr)
            failures += 1

    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
