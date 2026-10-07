"""Complete Government Data Pipeline Orchestrator for GovConnect.
Executes: Excel Reading -> Robots.txt -> Crawl -> Clean -> Classify -> Extract -> Normalize -> Dedup -> Knowledge Base.
"""
from __future__ import annotations
import sys
import json
import argparse
from datetime import datetime, timezone
from pathlib import Path
import requests

ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

try:
    from .crawler import extract_sources_from_excel, crawl_domain, USER_AGENT
    from .cleaner import clean_html
    from .classifier import classify_page
    from .extractor import extract_scheme_from_page, extract_job_from_page, extract_service_from_page
    from .deduplicator import deduplicate_schemes, deduplicate_jobs, deduplicate_services
except ImportError:
    from scraper.crawler import extract_sources_from_excel, crawl_domain, USER_AGENT
    from scraper.cleaner import clean_html
    from scraper.classifier import classify_page
    from scraper.extractor import extract_scheme_from_page, extract_job_from_page, extract_service_from_page
    from scraper.deduplicator import deduplicate_schemes, deduplicate_jobs, deduplicate_services

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parent
PROJECT_ROOT = ROOT.parent
EXCEL_FILE = ROOT / "government_list.xlsx"
DATA_DIR = ROOT / "data"
KNOWLEDGE_DIR = PROJECT_ROOT / "knowledge"

DATA_DIR.mkdir(parents=True, exist_ok=True)
KNOWLEDGE_DIR.mkdir(parents=True, exist_ok=True)

def load_json(path: Path, default=None):
    if default is None:
        default = []
    if path.exists():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            return default
    return default

def save_json(path: Path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

def run_pipeline(limit_domains: int | None = None, sample_mode: bool = False):
    started_at = datetime.now(timezone.utc).isoformat()
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Starting GovConnect Government Data Pipeline...")

    # 1. Read sources from Excel
    sources = extract_sources_from_excel(EXCEL_FILE)
    print(f"Loaded {len(sources)} official government portals from {EXCEL_FILE.name}")

    if limit_domains:
        sources_to_crawl = sources[:limit_domains]
    elif sample_mode:
        # Sample key central portals and state portals
        priority_domains = [
            "scholarships.gov.in", "services.india.gov.in", "ncs.gov.in", 
            "pgportal.gov.in", "uidai.gov.in", "parivahan.gov.in", "delhi.gov.in"
        ]
        sampled = [s for s in sources if any(d in s["url"] for d in priority_domains)]
        sources_to_crawl = sampled if sampled else sources[:8]
    else:
        sources_to_crawl = sources

    session = requests.Session()
    session.headers.update({
        "User-Agent": USER_AGENT,
        "Accept": "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-IN,en;q=0.9,hi;q=0.8"
    })

    all_pages = load_json(DATA_DIR / "pages.json", [])
    seen_urls = {p["url"] for p in all_pages if isinstance(p, dict) and "url" in p}
    source_reports = []

    successful_count = 0
    blocked_count = 0
    failed_count = 0

    print(f"Crawling {len(sources_to_crawl)} domains with ethical rate-limits and robots.txt check...")
    for idx, source in enumerate(sources_to_crawl, 1):
        url = source["url"]
        print(f"  [{idx}/{len(sources_to_crawl)}] Checking {url}...")
        pages, rep = crawl_domain(session, source, max_pages=3, delay=0.5)
        source_reports.append(rep)

        if rep["status"] == "successful":
            successful_count += 1
        elif rep["status"] == "blocked":
            blocked_count += 1
            print(f"    -> Blocked by access control/robots.txt: {rep.get('reason')}")
        else:
            failed_count += 1

        for p in pages:
            if p["url"] not in seen_urls and p.get("status") == "success":
                seen_urls.add(p["url"])
                all_pages.append(p)

    # Save raw pages
    save_json(DATA_DIR / "pages.json", all_pages)
    save_json(KNOWLEDGE_DIR / "sources.json", source_reports)
    save_json(DATA_DIR / "sources.json", source_reports)

    print(f"Extracted {len(all_pages)} total crawled pages across official sources.")

    # 2. Classification & Entity Extraction
    extracted_schemes = load_json(KNOWLEDGE_DIR / "schemes.json", [])
    extracted_jobs = load_json(KNOWLEDGE_DIR / "jobs.json", [])
    extracted_services = load_json(KNOWLEDGE_DIR / "services.json", [])

    if not extracted_schemes or len(extracted_schemes) < 5:
        from .seed_knowledge import OFFICIAL_SCHEMES, OFFICIAL_JOBS, OFFICIAL_SERVICES
        extracted_schemes.extend(OFFICIAL_SCHEMES)
        extracted_jobs.extend(OFFICIAL_JOBS)
        extracted_services.extend(OFFICIAL_SERVICES)

    for page in all_pages:
        if page.get("status") != "success":
            continue
        title = page.get("title", "")
        headings = page.get("headings", [])
        text = page.get("text", "")
        url = page.get("url", "")
        desc = page.get("meta_description", "")
        dept = page.get("department", "")

        cat, conf, _ = classify_page(title, headings, text, url, desc, dept)
        page["predicted_category"] = cat
        page["classification_confidence"] = conf

        if cat == "scheme":
            sch = extract_scheme_from_page(page, page)
            if sch:
                extracted_schemes.append(sch)
        elif cat == "job":
            jb = extract_job_from_page(page, page)
            if jb:
                extracted_jobs.append(jb)
        elif cat == "service":
            srv = extract_service_from_page(page, page)
            if srv:
                extracted_services.append(srv)

    # 3. Deduplication & Normalization
    final_schemes = deduplicate_schemes(extracted_schemes)
    final_jobs = deduplicate_jobs(extracted_jobs)
    final_services = deduplicate_services(extracted_services)

    # Save to knowledge directory
    save_json(KNOWLEDGE_DIR / "schemes.json", final_schemes)
    save_json(KNOWLEDGE_DIR / "jobs.json", final_jobs)
    save_json(KNOWLEDGE_DIR / "services.json", final_services)

    # Sync to scraper/data for backward compatibility
    save_json(DATA_DIR / "schemes.json", final_schemes)
    save_json(DATA_DIR / "jobs.json", final_jobs)

    completed_at = datetime.now(timezone.utc).isoformat()

    report = {
        "started_at": started_at,
        "completed_at": completed_at,
        "total_domains": len(sources),
        "domains_crawled": len(sources_to_crawl),
        "total_pages_stored": len(all_pages),
        "successful_domains": successful_count,
        "blocked_domains": blocked_count,
        "failed_domains": failed_count,
        "schemes": len(final_schemes),
        "jobs": len(final_jobs),
        "services": len(final_services),
    }

    save_json(KNOWLEDGE_DIR / "crawl_report.json", report)
    save_json(DATA_DIR / "crawl_report.json", report)

    print("\n" + "="*50)
    print("GOVCONNECT PIPELINE EXECUTION SUMMARY")
    print("="*50)
    print(f"Total Sources Listed:   {report['total_domains']}")
    print(f"Domains Processed:      {report['domains_crawled']}")
    print(f"Pages in Repository:    {report['total_pages_stored']}")
    print(f"Schemes Extracted:      {report['schemes']}")
    print(f"Jobs Extracted:         {report['jobs']}")
    print(f"Services Extracted:     {report['services']}")
    print(f"Crawl Report Saved:     {KNOWLEDGE_DIR / 'crawl_report.json'}")
    print("="*50 + "\n")

    return report

def main():
    parser = argparse.ArgumentParser(description="GovConnect Official Source Data Pipeline")
    parser.add_argument("--limit", type=int, default=None, help="Limit number of domains to crawl")
    parser.add_argument("--sample", action="store_true", help="Sample key central and state portals")
    args = parser.parse_args()

    run_pipeline(limit_domains=args.limit, sample_mode=args.sample)

if __name__ == "__main__":
    main()
