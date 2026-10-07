"""Content Classifier for GovConnect Pipeline.
Classifies discovered pages using title, headings, page text, metadata, URL, and department context.
Possible categories: scheme, job, service, department, announcement, notice, faq, general, unknown.
"""
from __future__ import annotations
import re

SCHEME_KEYWORDS = [
    r"\byojana\b", r"\bscheme\b", r"\bscholarship\b", r"\bsubsidy\b", r"\bgrant\b",
    r"\bwelfare\b", r"\bbenefit\b", r"\bpension\b", r"\bdbt\b", r"\bassistance\b",
    r"\bpradhan mantri\b", r"\bfinancial aid\b", r"\bbeneficiary\b", r"\beligibility\b"
]

JOB_KEYWORDS = [
    r"\brecruitment\b", r"\bvacancy\b", r"\bvacancies\b", r"\bcareer\b", r"\bjob\b",
    r"\bjobs\b", r"\bexamination\b", r"\badmit card\b", r"\bnotification\b", r"\bpay scale\b",
    r"\bqualification\b", r"\bselection process\b", r"\bapplication deadline\b", r"\bpost\b",
    r"\bupsc\b", r"\bssc\b", r"\brrb\b", r"\bpsc\b"
]

SERVICE_KEYWORDS = [
    r"\bcitizen service\b", r"\bonline service\b", r"\be-service\b", r"\bcertificate\b",
    r"\blicense\b", r"\blicence\b", r"\bpassport\b", r"\baadhaar\b", r"\bpan card\b",
    r"\bration card\b", r"\bvoter id\b", r"\btelemedicine\b", r"\bdomicile\b",
    r"\bbirth certificate\b", r"\bdeath certificate\b", r"\bincome certificate\b",
    r"\bcaste certificate\b", r"\bland records\b", r"\bproperty tax\b", r"\bvehicle registration\b"
]

FAQ_KEYWORDS = [
    r"\bfaq\b", r"\bfaqs\b", r"\bfrequently asked\b", r"\bquestions and answers\b", r"\bhelpdesk\b"
]

NOTICE_KEYWORDS = [
    r"\bcircular\b", r"\btender\b", r"\bcorrigendum\b", r"\bpress release\b", r"\bgazette\b",
    r"\bannouncement\b", r"\bpublic notice\b"
]

DEPARTMENT_KEYWORDS = [
    r"\bministry of\b", r"\bdepartment of\b", r"\bdirectorate\b", r"\bcommission\b",
    r"\bsecretariat\b", r"\bgovernment of\b", r"\badministration\b", r"\babout us\b"
]

def score_category(text: str, keywords: list[str]) -> int:
    score = 0
    lower = text.lower()
    for pattern in keywords:
        matches = len(re.findall(pattern, lower))
        score += matches
    return score

def classify_page(
    title: str,
    headings: list[str],
    body_text: str,
    url: str,
    meta_desc: str = "",
    department_hint: str = ""
) -> tuple[str, float, dict[str, int]]:
    """Classifies government page content using multiple semantic signals.
    
    Returns:
        (category, confidence_score, debug_scores)
    """
    # Weight signals differently: title and headings have 3x weight, meta 2x, body 1x
    title_context = f"{title} {' '.join(headings)} {url}"
    extended_context = f"{title_context} {meta_desc} {department_hint}"
    sample_body = body_text[:8000]

    scheme_score = (score_category(title_context, SCHEME_KEYWORDS) * 3 +
                    score_category(extended_context, SCHEME_KEYWORDS) * 2 +
                    score_category(sample_body, SCHEME_KEYWORDS))

    job_score = (score_category(title_context, JOB_KEYWORDS) * 3 +
                 score_category(extended_context, JOB_KEYWORDS) * 2 +
                 score_category(sample_body, JOB_KEYWORDS))

    service_score = (score_category(title_context, SERVICE_KEYWORDS) * 3 +
                     score_category(extended_context, SERVICE_KEYWORDS) * 2 +
                     score_category(sample_body, SERVICE_KEYWORDS))

    faq_score = (score_category(title_context, FAQ_KEYWORDS) * 4 +
                 score_category(sample_body, FAQ_KEYWORDS))

    notice_score = (score_category(title_context, NOTICE_KEYWORDS) * 3 +
                    score_category(sample_body, NOTICE_KEYWORDS))

    dept_score = (score_category(title_context, DEPARTMENT_KEYWORDS) * 2 +
                  score_category(extended_context, DEPARTMENT_KEYWORDS))

    scores = {
        "scheme": scheme_score,
        "job": job_score,
        "service": service_score,
        "faq": faq_score,
        "notice": notice_score,
        "department": dept_score,
    }

    best_cat = max(scores, key=scores.get)
    max_score = scores[best_cat]

    if max_score == 0:
        if len(body_text.strip()) > 100:
            return "general", 0.40, scores
        return "unknown", 0.10, scores

    # Calculate confidence based on score separation
    total = sum(scores.values())
    confidence = round(min(0.98, max(0.50, max_score / (total if total > 0 else 1) + 0.2)), 2)

    return best_cat, confidence, scores
