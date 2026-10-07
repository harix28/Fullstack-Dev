"""HTML Text Cleaner for GovConnect Scraper.
Removes navigation, boilerplate, scripts, styles, and extracts clean citizen text.
"""
from __future__ import annotations
import re
from bs4 import BeautifulSoup

BOILERPLATE_PATTERNS = [
    r"(?i)all rights reserved",
    r"(?i)copyright\s*©.*",
    r"(?i)terms of use",
    r"(?i)privacy policy",
    r"(?i)skip to main content",
    r"(?i)screen reader access",
    r"(?i)last updated on",
    r"(?i)visitors? count:?\s*\d+",
    r"(?i)designed and developed by nic",
    r"(?i)hosted by national informatics centre",
    r"(?i)cookie policy",
    r"(?i)disclaimer",
]

def clean_html(html_content: str) -> dict[str, any]:
    """Clean raw HTML and extract title, headings, clean text, and links."""
    soup = BeautifulSoup(html_content, "html.parser")

    # Extract title
    title = ""
    if soup.title and soup.title.string:
        title = soup.title.string.strip()
    elif soup.find("h1"):
        title = soup.find("h1").get_text(" ", strip=True)

    # Extract meta description
    meta_desc = ""
    meta_tag = soup.find("meta", attrs={"name": re.compile(r"description", re.I)}) or \
                soup.find("meta", attrs={"property": re.compile(r"og:description", re.I)})
    if meta_tag and meta_tag.get("content"):
        meta_desc = meta_tag["content"].strip()

    # Extract headings
    headings = []
    for h in soup.find_all(["h1", "h2", "h3"]):
        text = h.get_text(" ", strip=True)
        if text and len(text) > 3 and text not in headings:
            headings.append(text[:200])

    # Decompose unwanted elements (nav, footer, script, style, ads, etc.)
    for tag in soup(["script", "style", "noscript", "svg", "header", "footer", "nav", "aside", "form"]):
        tag.decompose()

    # Also decompose elements with boilerplate class or id
    for tag in soup.find_all(attrs={"class": re.compile(r"nav|menu|footer|sidebar|breadcrumb|cookie", re.I)}):
        tag.decompose()
    for tag in soup.find_all(attrs={"id": re.compile(r"nav|menu|footer|sidebar|breadcrumb|cookie", re.I)}):
        tag.decompose()

    # Extract clean text
    raw_text = " ".join(soup.stripped_strings)
    
    # Normalize multiple whitespace
    cleaned_text = re.sub(r"\s+", " ", raw_text)

    # Filter out pure boilerplate lines
    for pattern in BOILERPLATE_PATTERNS:
        cleaned_text = re.sub(pattern, " ", cleaned_text)
    cleaned_text = re.sub(r"\s+", " ", cleaned_text).strip()

    return {
        "title": title,
        "meta_description": meta_desc,
        "headings": headings[:15],
        "text": cleaned_text[:35000],  # Cap text to reasonable limit
    }
