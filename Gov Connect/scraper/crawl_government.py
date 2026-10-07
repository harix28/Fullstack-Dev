"""GovConnect Government Source Crawler Entry Point.
Executes the modular pipeline: Excel Reader -> Crawler -> Classifier -> Extractor -> Normalizer -> Deduplicator -> Knowledge Base.
"""
from __future__ import annotations
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from scraper.pipeline import run_pipeline

if __name__ == "__main__":
    sample = "--full" not in sys.argv
    limit = None
    for arg in sys.argv:
        if arg.startswith("--limit="):
            limit = int(arg.split("=")[1])
    run_pipeline(limit_domains=limit, sample_mode=sample)
