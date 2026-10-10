#!/usr/bin/env python3
"""Build the study website's docs/ folder from the notes in this repo.

Usage (from website-code/):
    python3 build.py              # writes docs/ and mkdocs.gen.yml
    mkdocs serve -f mkdocs.gen.yml
    mkdocs build -f mkdocs.gen.yml

Nothing in the repo's notes is modified; everything is copied and links are rewritten.
"""
import json
import re
import shutil
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parent
DOCS = HERE / "docs"
PAGES = HERE / "pages"          # hand-written pages (home, styles, scripts)
GITHUB = "https://github.com/developerashok99/green-c-mule-notes/blob/main"

PHASES = [
    ("Foundations", range(1, 11),
     "API vs integration, REST, HTTP, the Mule event, your first Listener → DB → Transform app"),
    ("Core Building", range(11, 21),
     "Calling APIs, properties and secure properties, error handling, deployment models"),
    ("API Design", range(21, 31),
     "RAML, Exchange, scaffolding, full CRUD, Database connector, Validation"),
    ("Security & Policies", range(31, 39),
     "API Manager, OAuth 2.0, JWT, rate limiting, client ID, caching, threat protection"),
    ("Testing & Processing", range(39, 51),
     "MUnit, SOAP, Scatter-Gather, Async, DataWeave, Salesforce, For Each, Batch"),
    ("Connectors & DevOps", range(51, 59),
     "JMS, Object Store, FTP/SFTP/File, CI/CD with Jenkins, Amazon S3, logging"),
]
INTERVIEW = ["interview-part1", "interview-part2", "interview-part3"]


def sessions():
    """All session ids in course order."""
    ids = [f"day{d:02d}" for d in range(1, 59) if (REPO / f"day{d:02d}.md").exists()]
    return ids + [i for i in INTERVIEW if (REPO / f"{i}.md").exists()]


def title_of(sid):
    first = (REPO / f"{sid}.md").read_text(encoding="utf-8").splitlines()[0]
    return first.lstrip("# ").strip()


def short_title(sid):
    """'Day 36 — Fixing …' → 'Fixing …' (for nav labels)."""
    t = title_of(sid)
    return re.sub(r"^(Day \d+|Interview Preparation Part \d)\s*[—-]\s*", "", t)


def label(sid):
    if sid.startswith("day"):
        return f"Day {int(sid[3:])}"
    return f"Interview Part {sid[-1]}"


# --- link rewriting -------------------------------------------------------
SID_RE = r"(day\d{2}|interview-part\d)"


LIST_RE = re.compile(r"^(?P<q>(?:> ?)*)(?P<ind> *)(?P<mark>[-*+]|\d+[.)])\s")


def normalize_lists(text):
    """GitHub-style lists → Python-Markdown: blank line before a list that follows
    a paragraph, and nested items indented 4 spaces per level instead of 2."""
    out, fence = [], False
    for line in text.split("\n"):
        if re.match(r"^(?:> ?)*\s*(```|~~~)", line):
            fence = not fence
            out.append(line)
            continue
        m = None if fence else LIST_RE.match(line)
        if m:
            q, ind = m.group("q"), m.group("ind")
            if ind:
                line = q + " " * (len(ind) * 2) + line[len(q) + len(ind):]
            prev = out[-1] if out else ""
            prev_body = prev[len(q):].strip() if prev.startswith(q.rstrip()) else prev.strip()
            if not ind and prev_body and not LIST_RE.match(prev) \
                    and not prev_body.startswith(("|", "#", "<")) and (prev.startswith(">") == bool(q)):
                out.append(q.rstrip())
        out.append(line)
    return "\n".join(out)


def rewrite(text, kind):
    text = normalize_lists(text)
    """kind: 'summary' (repo root), 'detailed' (detailed-notes/), 'notes' (super-detailed-notes/).
    Output pages live at docs/lectures/<sid>/<page>.md."""
    page_for = {"summary": "index.md", "detailed": "detailed.md", "notes": "notes.md"}

    # slide images / folders
    text = re.sub(r"\]\((?:\.\./)?slides/" + SID_RE + r"/([^)]*)\)",
                  lambda m: f"](../../slides/{m.group(1)}/{m.group(2)})" if m.group(2)
                  else f"](../{m.group(1)}/slides.md)", text)
    # transcripts → GitHub
    text = re.sub(r"\]\((?:\.\./)?(transcripts(?:-cleaned)?/[^)]+)\)",
                  lambda m: f"]({GITHUB}/{m.group(1)})", text)
    # cross-references between note levels
    text = re.sub(r"\]\((?:\.\./)?detailed-notes/" + SID_RE + r"\.md(#[^)]*)?\)",
                  lambda m: f"](../{m.group(1)}/detailed.md{m.group(2) or ''})", text)
    text = re.sub(r"\]\((?:\.\./)?super-detailed-notes/" + SID_RE + r"\.md(#[^)]*)?\)",
                  lambda m: f"](../{m.group(1)}/notes.md{m.group(2) or ''})", text)
    # bare sibling links like (day36.md) or (../day36.md)
    same = page_for[kind]

    def sib(m):
        dots, sid, anchor = m.group(1), m.group(2), m.group(3) or ""
        if kind != "summary" and dots:          # ../dayNN.md from a sub-folder = the summary
            return f"](../{sid}/index.md{anchor})"
        return f"](../{sid}/{same}{anchor})"
    text = re.sub(r"\]\((\.\./)?" + SID_RE + r"\.md(#[^)]*)?\)", sib, text)
    # folder index links
    text = re.sub(r"\]\((?:\.\./)?detailed-notes/?\)", "](../index.md)", text)
    text = re.sub(r"\]\((?:\.\./)?super-detailed-notes/?\)", "](../index.md)", text)
    return text


def slides_page(sid):
    readme = REPO / "slides" / sid / "README.md"
    if not readme.exists():
        return None
    src = readme.read_text(encoding="utf-8")
    intro = src.split("| # |")[0].strip().splitlines()
    intro = [l for l in intro[1:] if not l.startswith("Notes for this day")]
    out = [f"# {label(sid)} — Slides", ""] + intro + [""]
    for m in re.finditer(r"^### (.+)\n!\[([^\]]*)\]\(([^)]+)\)", src, re.M):
        cap, alt, img = m.groups()
        out += [f"### {cap}", "", f"![{alt}](../../slides/{sid}/{img}){{ loading=lazy }}", ""]
    return "\n".join(out)


def write(path, text):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def main():
    if DOCS.exists():
        shutil.rmtree(DOCS)
    DOCS.mkdir()
    ids = sessions()

    # hand-written pages and assets
    for p in PAGES.rglob("*"):
        if p.is_file():
            dest = DOCS / p.relative_to(PAGES)
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(p, dest)

    # slide images
    for sid in ids:
        sdir = REPO / "slides" / sid
        if sdir.exists():
            shutil.copytree(sdir, DOCS / "slides" / sid, ignore=shutil.ignore_patterns("README.md"))

    # lecture pages
    nav_sessions = {}
    for sid in ids:
        base = DOCS / "lectures" / sid
        pages = [("Summary", "index.md")]
        write(base / "index.md", rewrite((REPO / f"{sid}.md").read_text(encoding="utf-8"), "summary"))
        for kind, folder, name, lab in [("detailed", "detailed-notes", "detailed.md", "Detailed Notes"),
                                        ("notes", "super-detailed-notes", "notes.md", "Super-Detailed Notes")]:
            f = REPO / folder / f"{sid}.md"
            if f.exists():
                write(base / name, rewrite(f.read_text(encoding="utf-8"), kind))
                pages.append((lab, name))
        sp = slides_page(sid)
        if sp:
            write(base / "slides.md", sp)
            pages.append(("Slides", "slides.md"))
        nav_sessions[sid] = pages

    # lectures index + study plan
    write(DOCS / "lectures" / "index.md", lectures_index(ids))
    write(DOCS / "plan.md", plan_page(ids))

    # nav → mkdocs.gen.yml (inherits mkdocs.yml)
    def entry(sid):
        return {f"{label(sid)} — {short_title(sid)}":
                [{lab: f"lectures/{sid}/{name}"} for lab, name in nav_sessions[sid]]}
    lectures_nav = [{"All Lectures": "lectures/index.md"}]
    for name, rng, _ in PHASES:
        lectures_nav.append({name: [entry(f"day{d:02d}") for d in rng if f"day{d:02d}" in nav_sessions]})
    nav = [
        {"Home": "index.md"},
        {"Study Plan": "plan.md"},
        {"Lectures": lectures_nav},
        {"Interview Prep": [entry(i) for i in INTERVIEW if i in nav_sessions]},
    ]
    gen = "INHERIT: mkdocs.yml\nnav: " + json.dumps(nav, ensure_ascii=False) + "\n"
    (HERE / "mkdocs.gen.yml").write_text(gen, encoding="utf-8")
    print(f"built {len(ids)} sessions into {DOCS}")


def lectures_index(ids):
    out = ["# All Lectures", "",
           "Every session has a **Summary**, **Detailed Notes** (with diagrams), "
           "**Super-Detailed Notes** (with interview Q&A) and the **Slides** from the class.", ""]
    for name, rng, desc in PHASES:
        out += [f"## {name}", "", f"*{desc}*", "", "| Session | Topic | Pages |", "|---|---|---|"]
        for d in rng:
            sid = f"day{d:02d}"
            if sid in ids:
                out.append(row(sid))
        out.append("")
    out += ["## Interview Preparation", "", "| Session | Topic | Pages |", "|---|---|---|"]
    out += [row(i) for i in INTERVIEW if i in ids]
    return "\n".join(out) + "\n"


def row(sid):
    links = [f"[Summary]({sid}/index.md)", f"[Detailed]({sid}/detailed.md)",
             f"[Notes]({sid}/notes.md)", f"[Slides]({sid}/slides.md)"]
    return f"| **{label(sid)}** | {short_title(sid)} | {' · '.join(links)} |"


def plan_page(ids):
    out = ["# Study Plan", "",
           "One session per day (two if it is mostly theory). For each session:", "",
           "1. **Read the Summary** (5 min) so you know what's coming.",
           "2. **Watch the class** with the **Detailed Notes** open — redraw each diagram.",
           "3. **Build it yourself** in Anypoint Studio the same day; use the **Slides** for exact screens.",
           "4. **Answer the interview questions** in the **Super-Detailed Notes** out loud *before* reading the answers.",
           "5. **Next day:** re-read the *Must Remember* section before starting the new session.", "",
           "At the end of each phase, build one small project that combines that phase's topics — without the video.", ""]
    n = 0
    for pi, (name, rng, desc) in enumerate(PHASES, 1):
        days = [f"day{d:02d}" for d in rng if f"day{d:02d}" in ids]
        out += [f"## Phase {pi} — {name}", "", f"**Goal:** {desc}.", "",
                "| Study day | Session | Topic |", "|---|---|---|"]
        for sid in days:
            n += 1
            out.append(f"| {n} | [{label(sid)}](lectures/{sid}/index.md) | {short_title(sid)} |")
        out += ["", f"!!! tip \"Phase {pi} checkpoint\"",
                f"    Build a small app using {desc.split(',')[0].lower()} and the rest of this phase's topics, without watching the videos.", ""]
    out += [f"## Phase {len(PHASES) + 1} — Interview Preparation", "",
            "**Goal:** résumé, self-introduction, and the full interview Q&A.", "",
            "| Study day | Session | Topic |", "|---|---|---|"]
    for sid in INTERVIEW:
        if sid in ids:
            n += 1
            out.append(f"| {n} | [{label(sid)}](lectures/{sid}/index.md) | {short_title(sid)} |")
    out += ["", "!!! tip \"Tip\"",
            "    Start reading the interview sessions once you are past Day 40 — not only at the very end."]
    return "\n".join(out) + "\n"


if __name__ == "__main__":
    main()
