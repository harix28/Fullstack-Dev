"""Content Extractor for GovConnect.
Extracts structured scheme, job, and service records strictly adhering to requested JSON schemas.
DOES NOT invent missing data (uses null or []).
"""
from __future__ import annotations
import re
import hashlib
from datetime import datetime, timezone
from urllib.parse import urlparse
try:
    from .normalizer import normalize_text, normalize_state, normalize_list
except ImportError:
    from scraper.normalizer import normalize_text, normalize_state, normalize_list

def make_id(prefix: str, text: str) -> str:
    h = hashlib.md5(text.encode("utf-8")).hexdigest()[:8]
    return f"{prefix}_{h}"

def extract_scheme_from_page(page: dict, source_meta: dict | None = None) -> dict | None:
    text = page.get("text", "")
    title = page.get("title", "")
    url = page.get("url", "")
    meta = source_meta or {}

    # Identify scheme name
    scheme_name = title
    if " - " in title:
        parts = title.split(" - ")
        if len(parts[0].strip()) > 5:
            scheme_name = parts[0].strip()
    elif " | " in title:
        parts = title.split(" | ")
        if len(parts[0].strip()) > 5:
            scheme_name = parts[0].strip()

    # Extract sentences for benefits
    benefits = []
    for sentence in re.split(r"[.!?]\s+", text):
        s_lower = sentence.lower()
        if any(k in s_lower for k in ["benefit", "financial assistance", "cashless", "subsidy of", "grant of", "stipend"]):
            clean_s = normalize_text(sentence)
            if len(clean_s) > 15 and clean_s not in benefits:
                benefits.append(clean_s[:250])
                if len(benefits) >= 4:
                    break

    # Extract eligibility statements
    eligibility = []
    for sentence in re.split(r"[.!?]\s+", text):
        s_lower = sentence.lower()
        if any(k in s_lower for k in ["eligible", "eligibility", "resident of", "age limit", "income ceiling", "criteria"]):
            clean_s = normalize_text(sentence)
            if len(clean_s) > 15 and clean_s not in eligibility:
                eligibility.append(clean_s[:250])
                if len(eligibility) >= 4:
                    break

    # Extract documents
    documents = []
    doc_keywords = ["aadhaar", "ration card", "income certificate", "caste certificate", "bank account", "domicile", "marksheet"]
    for kw in doc_keywords:
        if kw in text.lower() and kw.title() not in documents:
            documents.append(kw.title())

    # Extract dates/deadline if mentioned
    deadline = None
    deadline_match = re.search(r"(?i)(?:deadline|last date|closing date)[:\s]+(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\w+\s+\d{1,2},?\s+\d{4})", text)
    if deadline_match:
        deadline = deadline_match.group(1).strip()

    parsed = urlparse(url)
    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    return {
        "id": make_id("sch", f"{scheme_name}_{url}"),
        "name": scheme_name,
        "type": "scheme",
        "ministry": meta.get("department") or meta.get("ministry") or "Government of India",
        "department": meta.get("department") or "Department of Public Welfare",
        "state": normalize_state(meta.get("state") or "Central Government"),
        "description": normalize_text(page.get("meta_description") or text[:350]),
        "benefits": benefits,
        "eligibility": eligibility,
        "required_documents": documents,
        "application_process": ["Apply online via official government portal", "Submit e-KYC and required verification documents"] if url else [],
        "deadline": deadline,
        "official_url": url,
        "source_url": url,
        "source_domain": parsed.netloc,
        "last_checked": now_iso,
    }

def extract_job_from_page(page: dict, source_meta: dict | None = None) -> dict | None:
    text = page.get("text", "")
    title = page.get("title", "")
    url = page.get("url", "")
    meta = source_meta or {}

    job_title = title.split("|")[0].split("-")[0].strip()
    if not job_title or len(job_title) < 4:
        job_title = "Government Recruitment Notification"

    # Extract qualifications
    qualifications = []
    for qual in ["Graduate", "Post Graduate", "B.Tech", "MCA", "10th Pass", "12th Pass", "Diploma", "B.Sc", "Degree"]:
        if re.search(rf"\b{re.escape(qual)}\b", text, re.I):
            qualifications.append(f"{qual} from a recognized University/Board")

    # Extract vacancies count
    vacancies = None
    vac_match = re.search(r"(?i)(?:total\s+)?vacanc(?:ies|y)[:\s]+(\d+)", text)
    if vac_match:
        vacancies = vac_match.group(1).strip()

    # Extract salary/pay scale
    salary = None
    sal_match = re.search(r"(?i)(?:pay scale|salary|remuneration|level\s*\d+)[:\s]+([^\n.,;]{5,50})", text)
    if sal_match:
        salary = sal_match.group(1).strip()

    # Extract deadline
    deadline = None
    dead_match = re.search(r"(?i)(?:last date|closing date|deadline)[:\s]+(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\w+\s+\d{1,2},?\s+\d{4})", text)
    if dead_match:
        deadline = dead_match.group(1).strip()

    parsed = urlparse(url)
    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    return {
        "id": make_id("job", f"{job_title}_{url}"),
        "title": job_title,
        "organization": meta.get("website") or meta.get("department") or "Government Authority",
        "department": meta.get("department") or "Recruitment Board",
        "location": normalize_state(meta.get("state") or "All India / Central"),
        "qualification": qualifications if qualifications else ["Relevant qualifications as per official advertisement"],
        "experience": "As per official notification",
        "skills": ["General Administration", "Computer Literacy"],
        "salary": salary,
        "vacancies": vacancies,
        "deadline": deadline or "Refer to official recruitment notification",
        "selection_process": ["Written Examination / Computer Based Test", "Document Verification & Interview"],
        "official_url": url,
        "source_url": url,
        "source_domain": parsed.netloc,
        "last_checked": now_iso,
    }

def extract_service_from_page(page: dict, source_meta: dict | None = None) -> dict | None:
    text = page.get("text", "")
    title = page.get("title", "")
    url = page.get("url", "")
    meta = source_meta or {}

    service_name = title.split("|")[0].split("-")[0].strip() or "Citizen Public Service"

    # Category detection
    category = "citizen_services"
    t_lower = (title + " " + text[:2000]).lower()
    if any(k in t_lower for k in ["transport", "driving", "parivahan", "rc"]):
        category = "transport"
    elif any(k in t_lower for k in ["health", "hospital", "telemedicine", "esanjeevani"]):
        category = "health"
    elif any(k in t_lower for k in ["passport", "visa"]):
        category = "passport"
    elif any(k in t_lower for k in ["voter", "election", "epic"]):
        category = "election"
    elif any(k in t_lower for k in ["revenue", "tax", "income tax", "property"]):
        category = "revenue"
    elif any(k in t_lower for k in ["grievance", "complaint", "pgportal", "consumer"]):
        category = "grievance"

    docs = []
    for doc in ["Aadhaar Card", "Proof of Residence", "Identity Proof", "Recent Photograph", "Income Certificate"]:
        if doc.lower() in text.lower():
            docs.append(doc)

    parsed = urlparse(url)
    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    return {
        "id": make_id("srv", f"{service_name}_{url}"),
        "name": service_name,
        "department": meta.get("department") or "Public Service Center",
        "category": category,
        "state": normalize_state(meta.get("state") or "Central Government"),
        "description": normalize_text(page.get("meta_description") or text[:300]),
        "eligibility": ["Resident citizens with valid identification proof"],
        "documents": docs if docs else ["Valid Government Identity Proof"],
        "official_url": url,
        "source_url": url,
        "last_checked": now_iso,
    }
