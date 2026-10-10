#!/usr/bin/env python3
"""Validate quiz/flashcard files without building the site.
Usage: python3 check_study.py [sid ...]    (no args = all files in data/study/)"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import build  # noqa: E402

sids = sys.argv[1:] or sorted(p.stem for p in build.STUDY.glob("*.json"))
ok = True
for sid in sids:
    try:
        d = build.load_study(sid)
    except SystemExit as e:
        ok = False
        print(f"FAIL {sid}\n{e}")
        continue
    if d is None:
        ok = False
        print(f"MISSING {sid}")
        continue
    print(f"ok   {sid}: {len(d['quiz'])} questions, {len(d['cards'])} cards")
sys.exit(0 if ok else 1)
