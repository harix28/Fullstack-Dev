"""Deduplicator for GovConnect Records.
Deduplicates schemes, jobs, and services using key combinations and aggregates source provenance.
"""
from __future__ import annotations
import re
from difflib import SequenceMatcher

def string_similarity(a: str, b: str) -> float:
    return SequenceMatcher(None, a.lower().strip(), b.lower().strip()).ratio()

def simplify_key(title: str) -> str:
    cleaned = re.sub(r"[^a-zA-Z0-9\s]", "", title.lower())
    return " ".join(cleaned.split())

def deduplicate_schemes(schemes: list[dict]) -> list[dict]:
    deduped: dict[str, dict] = {}
    for s in schemes:
        name = s.get("name") or s.get("title") or ""
        norm_key = simplify_key(name)
        if not norm_key:
            continue

        matched_key = None
        for existing_key in deduped:
            if string_similarity(norm_key, existing_key) > 0.88:
                matched_key = existing_key
                break

        if matched_key:
            # Merge sources and details
            target = deduped[matched_key]
            # Merge benefits & eligibility
            for b in s.get("benefits", []):
                if b not in target.get("benefits", []):
                    target.setdefault("benefits", []).append(b)
            for e in s.get("eligibility", []):
                if e not in target.get("eligibility", []):
                    target.setdefault("eligibility", []).append(e)
            for doc in s.get("required_documents", []):
                if doc not in target.get("required_documents", []):
                    target.setdefault("required_documents", []).append(doc)
            # Merge source URLs
            src = s.get("source_url")
            if src:
                sources = target.setdefault("source_urls", [])
                if src not in sources:
                    sources.append(src)
        else:
            s_copy = dict(s)
            if s.get("source_url"):
                s_copy["source_urls"] = [s["source_url"]]
            deduped[norm_key] = s_copy

    return list(deduped.values())

def deduplicate_jobs(jobs: list[dict]) -> list[dict]:
    deduped: dict[str, dict] = {}
    for j in jobs:
        title = j.get("title") or ""
        org = j.get("organization") or ""
        key = simplify_key(f"{title} {org}")
        if not key:
            continue

        matched_key = None
        for existing_key in deduped:
            if string_similarity(key, existing_key) > 0.88:
                matched_key = existing_key
                break

        if matched_key:
            target = deduped[matched_key]
            for q in j.get("qualification", []):
                if q not in target.get("qualification", []):
                    target.setdefault("qualification", []).append(q)
            for sk in j.get("skills", []):
                if sk not in target.get("skills", []):
                    target.setdefault("skills", []).append(sk)
            src = j.get("source_url")
            if src:
                sources = target.setdefault("source_urls", [])
                if src not in sources:
                    sources.append(src)
        else:
            j_copy = dict(j)
            if j.get("source_url"):
                j_copy["source_urls"] = [j["source_url"]]
            deduped[key] = j_copy

    return list(deduped.values())

def deduplicate_services(services: list[dict]) -> list[dict]:
    deduped: dict[str, dict] = {}
    for s in services:
        name = s.get("name") or ""
        dept = s.get("department") or ""
        state = s.get("state") or ""
        key = simplify_key(f"{name} {dept} {state}")
        if not key:
            continue

        matched_key = None
        for existing_key in deduped:
            if string_similarity(key, existing_key) > 0.85:
                matched_key = existing_key
                break

        if matched_key:
            target = deduped[matched_key]
            for doc in s.get("documents", []):
                if doc not in target.get("documents", []):
                    target.setdefault("documents", []).append(doc)
            src = s.get("source_url")
            if src:
                sources = target.setdefault("source_urls", [])
                if src not in sources:
                    sources.append(src)
        else:
            s_copy = dict(s)
            if s.get("source_url"):
                s_copy["source_urls"] = [s["source_url"]]
            deduped[key] = s_copy

    return list(deduped.values())
