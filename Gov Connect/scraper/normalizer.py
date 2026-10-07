"""Data Normalizer for GovConnect.
Normalizes text, URLs, organization names, dates, and state names across extracted records.
"""
from __future__ import annotations
import html
import re
from urllib.parse import urlparse, urlunparse

STATE_CANONICAL_MAP = {
    "andaman": "Andaman and Nicobar Islands",
    "andhra": "Andhra Pradesh",
    "arunachal": "Arunachal Pradesh",
    "assam": "Assam",
    "bihar": "Bihar",
    "chandigarh": "Chandigarh",
    "chhattisgarh": "Chhattisgarh",
    "cg": "Chhattisgarh",
    "delhi": "Delhi",
    "goa": "Goa",
    "gujarat": "Gujarat",
    "haryana": "Haryana",
    "himachal": "Himachal Pradesh",
    "jammu": "Jammu and Kashmir",
    "jk": "Jammu and Kashmir",
    "jharkhand": "Jharkhand",
    "karnataka": "Karnataka",
    "kerala": "Kerala",
    "ladakh": "Ladakh",
    "madhya pradesh": "Madhya Pradesh",
    "mp": "Madhya Pradesh",
    "maharashtra": "Maharashtra",
    "manipur": "Manipur",
    "meghalaya": "Meghalaya",
    "mizoram": "Mizoram",
    "nagaland": "Nagaland",
    "odisha": "Odisha",
    "orissa": "Odisha",
    "punjab": "Punjab",
    "puducherry": "Puducherry",
    "pondicherry": "Puducherry",
    "rajasthan": "Rajasthan",
    "sikkim": "Sikkim",
    "tamil nadu": "Tamil Nadu",
    "tn": "Tamil Nadu",
    "telangana": "Telangana",
    "tripura": "Tripura",
    "uttar pradesh": "Uttar Pradesh",
    "up": "Uttar Pradesh",
    "uttarakhand": "Uttarakhand",
    "uk": "Uttarakhand",
    "west bengal": "West Bengal",
    "wb": "West Bengal",
    "central": "Central Government",
    "india": "Central Government",
    "national": "Central Government"
}

def normalize_text(value: str | None) -> str:
    if not value:
        return ""
    # Unescape HTML entities
    unescaped = html.unescape(value)
    # Remove control characters and normalize spaces
    cleaned = re.sub(r"[\r\n\t]+", " ", unescaped)
    cleaned = re.sub(r"\s{2,}", " ", cleaned)
    return cleaned.strip()

def normalize_url(url: str | None) -> str:
    if not url:
        return ""
    url = url.strip()
    try:
        p = urlparse(url)
        # Ensure lowercase scheme & domain, strip trailing slash unless root
        scheme = p.scheme.lower() or "https"
        netloc = p.netloc.lower()
        path = p.path.rstrip("/") if p.path != "/" else "/"
        return urlunparse((scheme, netloc, path, "", p.query, ""))
    except Exception:
        return url

def normalize_state(state_input: str | None) -> str:
    if not state_input:
        return "Central Government"
    cleaned = state_input.strip().lower()
    for key, canonical in STATE_CANONICAL_MAP.items():
        if key in cleaned:
            return canonical
    return state_input.strip()

def normalize_list(items: list[str] | None) -> list[str]:
    if not items:
        return []
    result = []
    for item in items:
        cleaned = normalize_text(item)
        if cleaned and len(cleaned) > 2 and cleaned not in result:
            result.append(cleaned)
    return result
