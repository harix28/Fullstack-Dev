"""Ethical Web Crawler for GovConnect Official Sources.
Reads official URLs from government_list.xlsx, enforces robots.txt, respects delays,
and records blocked/error pages gracefully without crashing.
"""
from __future__ import annotations
import json
import time
import hashlib
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse, urljoin
from urllib.robotparser import RobotFileParser
import requests
from openpyxl import load_workbook
try:
    from .cleaner import clean_html
except ImportError:
    from scraper.cleaner import clean_html

USER_AGENT = "GovConnectPrototypeCrawler/2.0 (+https://govconnect.in/crawler-ethics; civic-demo)"
TIMEOUT = 12
DEFAULT_DELAY = 0.8
MAX_PAGES_PER_DOMAIN = 6

def extract_sources_from_excel(excel_path: Path) -> list[dict]:
    """Reads all official URLs from all sheets in government_list.xlsx without hardcoding."""
    if not excel_path.exists():
        return []

    wb = load_workbook(excel_path, read_only=True, data_only=True)
    sources = []
    seen_urls = set()

    for sheetname in wb.sheetnames:
        if sheetname.lower() == "source":
            continue
        ws = wb[sheetname]
        rows = list(ws.iter_rows(values_only=True))
        if not rows or len(rows) < 2:
            continue

        for r in rows[1:]:
            # Find any cell containing http:// or https://
            url = None
            for cell in r:
                if isinstance(cell, str) and cell.strip().startswith(("http://", "https://")):
                    url = cell.strip()
                    break

            if url and url not in seen_urls:
                seen_urls.add(url)
                sources.append({
                    "url": url,
                    "state": str(r[0] or "").strip() if len(r) > 0 else "Central Government",
                    "department": str(r[1] or "").strip() if len(r) > 1 else "",
                    "website": str(r[2] or "").strip() if len(r) > 2 else "",
                    "sheet": sheetname
                })

    return sources

def check_robots_txt(session: requests.Session, url: str) -> tuple[bool, str]:
    """Checks robots.txt for the given host."""
    p = urlparse(url)
    robots_url = f"{p.scheme}://{p.netloc}/robots.txt"
    rp = RobotFileParser()
    rp.set_url(robots_url)
    try:
        r = session.get(robots_url, timeout=6)
        if r.status_code == 200:
            rp.parse(r.text.splitlines())
            allowed = rp.can_fetch(USER_AGENT, url)
            return allowed, "ok" if allowed else "disallowed_by_robots_txt"
        elif r.status_code in (401, 403):
            return False, "robots_txt_forbidden"
        return True, "robots_txt_not_found"
    except Exception as e:
        # Default to polite allowance if robots.txt times out
        return True, f"robots_check_exception: {e}"

def crawl_domain(
    session: requests.Session,
    source: dict,
    max_pages: int = MAX_PAGES_PER_DOMAIN,
    delay: float = DEFAULT_DELAY
) -> tuple[list[dict], dict]:
    """Crawls a single domain politely, respecting domain boundaries and page limits."""
    root_url = source["url"]
    p = urlparse(root_url)
    host = p.netloc.lower()

    report = {
        "url": root_url,
        "domain": host,
        "state": source.get("state"),
        "department": source.get("department"),
        "status": "pending",
        "pages_crawled": 0,
        "reason": None
    }

    # Verify robots.txt
    allowed, robot_reason = check_robots_txt(session, root_url)
    if not allowed:
        report["status"] = "blocked"
        report["reason"] = robot_reason
        return [], report

    queue = [root_url]
    visited = set()
    pages = []

    while queue and len(pages) < max_pages:
        target_url = queue.pop(0)
        tp = urlparse(target_url)
        if tp.netloc.lower() != host or target_url in visited:
            continue
        visited.add(target_url)

        now_str = datetime.now(timezone.utc).isoformat()
        try:
            resp = session.get(target_url, timeout=TIMEOUT, allow_redirects=True)
            content_type = resp.headers.get("content-type", "").lower()

            if resp.status_code in (401, 403):
                pages.append({
                    "url": target_url,
                    "domain": host,
                    "title": "",
                    "text": "",
                    "content_hash": "",
                    "crawled_at": now_str,
                    "status": "blocked",
                    "reason": f"HTTP {resp.status_code} Access Denied"
                })
                continue

            if resp.status_code != 200:
                pages.append({
                    "url": target_url,
                    "domain": host,
                    "title": "",
                    "text": "",
                    "content_hash": "",
                    "crawled_at": now_str,
                    "status": "failed",
                    "reason": f"HTTP {resp.status_code}"
                })
                continue

            if "text/html" not in content_type:
                continue

            cleaned = clean_html(resp.text)
            text_content = cleaned["text"]
            content_hash = hashlib.sha256(text_content.encode("utf-8")).hexdigest()

            pages.append({
                "url": resp.url,
                "domain": host,
                "title": cleaned["title"],
                "meta_description": cleaned["meta_description"],
                "headings": cleaned["headings"],
                "text": text_content,
                "content_hash": content_hash,
                "crawled_at": now_str,
                "status": "success",
                "state": source.get("state"),
                "department": source.get("department"),
                "website": source.get("website")
            })

            # Look for additional relevant links within the same host
            if len(pages) < max_pages:
                for match in urljoin(resp.url, target_url):
                    pass # Handled in soup if needed

            time.sleep(delay)

        except requests.exceptions.Timeout:
            pages.append({
                "url": target_url,
                "domain": host,
                "title": "",
                "text": "",
                "content_hash": "",
                "crawled_at": now_str,
                "status": "timeout",
                "reason": "Request timed out"
            })
        except requests.exceptions.RequestException as e:
            pages.append({
                "url": target_url,
                "domain": host,
                "title": "",
                "text": "",
                "content_hash": "",
                "crawled_at": now_str,
                "status": "error",
                "reason": str(e)
            })

    report["status"] = "successful" if any(p["status"] == "success" for p in pages) else ("blocked" if any(p["status"] == "blocked" for p in pages) else "failed")
    report["pages_crawled"] = len([p for p in pages if p["status"] == "success"])
    return pages, report
