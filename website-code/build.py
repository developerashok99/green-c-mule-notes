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


# --- mind maps --------------------------------------------------------------
MARKMAP_JS = "https://cdn.jsdelivr.net/npm/markmap-autoloader@0.18"
SKIP_SECTIONS = re.compile(r"terminology|interview question|must remember|next session|sources|quick recap|"
                           r"checklist|glossary|references", re.I)


def slugify(value, sep="-"):
    """Same algorithm as Python-Markdown's toc.slugify (what MkDocs uses for heading ids)."""
    import unicodedata
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    value = re.sub(r"[^\w\s-]", "", value).strip().lower()
    return re.sub(r"[{}\s]+".format(sep), sep, value)


def heading_plain(text):
    text = re.sub(r"!?\[([^\]]*)\]\([^)]*\)", r"\1", text)     # links/images → text
    text = re.sub(r"<[^>]+>", "", text)                           # html tags
    return text.replace("`", "").replace("*", "").strip()


def outline(md_text):
    """[(level, text, anchor)] for every heading, with ids as MkDocs generates them."""
    seen, out, fence = {}, [], False
    for line in md_text.split("\n"):
        if re.match(r"^\s*(```|~~~)", line):
            fence = not fence
            continue
        m = None if fence else re.match(r"^(#{1,6})\s+(.+?)\s*#*\s*$", line)
        if not m:
            continue
        text = m.group(2)
        slug = slugify(heading_plain(text)) or "_"
        if slug in seen:
            seen[slug] += 1
            slug = f"{slug}_{seen[slug]}"
        else:
            seen[slug] = 0
        out.append((len(m.group(1)), text, slug))
    return out


def topic_label(text):
    text = re.sub(r"^\d+(\.\d+)*\.?\s+", "", text)               # drop "4.1 " numbering
    return text.replace("[", "(").replace("]", ")")


def lecture_topics(sid):
    """[(label, anchor, [(label, anchor), ...])] from the super-detailed notes (topics only)."""
    f = REPO / "super-detailed-notes" / f"{sid}.md"
    if not f.exists():
        return []
    topics, cur = [], None
    for level, text, anchor in outline(normalize_lists(f.read_text(encoding="utf-8"))):
        if level == 2:
            cur = None if SKIP_SECTIONS.search(text) else (topic_label(text), anchor, [])
            if cur:
                topics.append(cur)
        elif level == 3 and cur:
            cur[2].append((topic_label(text), anchor))
    return topics


def markmap_block(md, expand):
    opts = "---\nmarkmap:\n  initialExpandLevel: %d\n  maxWidth: 320\n  autoFit: true\n---\n" % expand
    return ('<div class="markmap mm-full">\n<script type="text/template">\n'
            + opts + md + "\n</script>\n</div>\n\n"
            + f'<script src="{MARKMAP_JS}"></script>\n')


MM_HELP = ("*Click a circle to expand or collapse a branch · scroll to zoom · drag to move · "
           "click a topic to open it in the notes.*")


def lecture_mindmap_page(sid):
    notes = f"../../lectures/{sid}/notes/"
    lines = [f"# [{label(sid)} — {short_title(sid)}](../../lectures/{sid}/)"]
    for t, a, subs in lecture_topics(sid):
        lines.append(f"## [{t}]({notes}#{a})")
        for st, sa in subs:
            lines.append(f"### [{st}]({notes}#{sa})")
    return (f"# {label(sid)} — Mind Map\n\n{MM_HELP}\n\n"
            f"[:octicons-arrow-left-24: Back to the lecture](../lectures/{sid}/index.md)\n\n"
            + markmap_block("\n".join(lines), 3))


def course_mindmap_page(ids):
    lines = ["# MuleSoft Course"]
    groups = [(f"Phase {i} — {n}", [f"day{d:02d}" for d in r]) for i, (n, r, _) in enumerate(PHASES, 1)]
    groups.append((f"Phase {len(PHASES) + 1} — Interview Preparation", INTERVIEW))
    for gname, sids in groups:
        lines.append(f"## {gname}")
        for sid in sids:
            if sid not in ids:
                continue
            lines.append(f"### [{label(sid)} — {short_title(sid)}]({sid}/)")
            for t, a, _ in lecture_topics(sid):
                lines.append(f"#### [{t}](../lectures/{sid}/notes/#{a})")
    toc = ["", "## Mind map for each lecture", ""]
    for gname, sids in groups:
        toc += [f"**{gname}**", ""] + [f"- [{label(s)} — {short_title(s)}]({s}.md)" for s in sids if s in ids] + [""]
    return ("# Course Mind Map\n\nThe whole course on one page: phases → lectures → main topics. "
            "Open a lecture's own map for its subtopics.\n\n" + MM_HELP + "\n\n"
            + markmap_block("\n".join(lines), 2) + "\n".join(toc))


# --- quizzes, flashcards, practice -------------------------------------------
STUDY = HERE / "data" / "study"          # one <sid>.json per lecture: {"quiz": [...], "cards": [...]}
DATAWEAVE = HERE / "data" / "dataweave.json"


def validate_study(sid, d):
    errs = []
    quiz, cards = d.get("quiz", []), d.get("cards", [])
    if not isinstance(quiz, list) or not isinstance(cards, list):
        return [f"{sid}: 'quiz' and 'cards' must be lists"]
    for n, q in enumerate(quiz, 1):
        if not isinstance(q.get("q"), str) or not q["q"].strip():
            errs.append(f"{sid} quiz {n}: missing 'q'")
        opts = q.get("options")
        if not isinstance(opts, list) or not 3 <= len(opts) <= 6 or not all(isinstance(o, str) and o.strip() for o in opts):
            errs.append(f"{sid} quiz {n}: 'options' must be 3–6 non-empty strings")
        elif len(set(opts)) != len(opts):
            errs.append(f"{sid} quiz {n}: duplicate options")
        a = q.get("answer")
        if not isinstance(a, int) or not isinstance(opts, list) or not 0 <= a < len(opts):
            errs.append(f"{sid} quiz {n}: 'answer' must be a valid 0-based option index")
        if not isinstance(q.get("explain"), str) or not q["explain"].strip():
            errs.append(f"{sid} quiz {n}: missing 'explain'")
    for n, c in enumerate(cards, 1):
        if not (isinstance(c.get("front"), str) and c["front"].strip() and isinstance(c.get("back"), str) and c["back"].strip()):
            errs.append(f"{sid} card {n}: needs non-empty 'front' and 'back'")
    return errs


def load_study(sid):
    f = STUDY / f"{sid}.json"
    if not f.exists():
        return None
    try:
        d = json.loads(f.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        raise SystemExit(f"{f}: invalid JSON — {e}")
    errs = validate_study(sid, d)
    if errs:
        raise SystemExit("\n".join(errs))
    return d


def embed(kind, data):
    blob = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
    return f'<div data-study="{kind}">\n<script type="application/json">{blob}</script>\n</div>\n'


def quiz_page(sid, d):
    return (f"# {label(sid)} — Quiz\n\n{len(d['quiz'])} questions on {short_title(sid)}. "
            "Options are shuffled each time; after each answer you'll see why.\n\n" + embed("quiz", d["quiz"]))


def cards_page(sid, d):
    return (f"# {label(sid)} — Flashcards\n\n{len(d['cards'])} cards. Read the front, answer in your head, "
            "then flip. **Again** sends the card to the back of the deck; **Know it** removes it.\n\n"
            + embed("cards", d["cards"]))


def phase_of(sid):
    if not sid.startswith("day"):
        return "Interview Preparation"
    n = int(sid[3:])
    for name, rng, _ in PHASES:
        if n in rng:
            return name
    return "Other"


def drill_data(ids):
    out = []
    for sid in ids:
        d = load_study(sid)
        if d:
            for c in d["cards"]:
                out.append({"front": c["front"], "back": c["back"], "phase": phase_of(sid),
                            "lecture": label(sid), "src": f"../../lectures/{sid}/"})
    return out


def dataweave_page():
    if not DATAWEAVE.exists():
        return None
    data = json.loads(DATAWEAVE.read_text(encoding="utf-8"))
    for n, x in enumerate(data, 1):
        for k in ("title", "level", "task", "input", "answer"):
            if not isinstance(x.get(k), str) or not x[k].strip():
                raise SystemExit(f"dataweave.json item {n}: missing '{k}'")
        if x["level"] not in ("easy", "medium", "hard"):
            raise SystemExit(f"dataweave.json item {n}: level must be easy/medium/hard")
        if x.get("sid"):
            x["lecture"], x["src"] = label(x["sid"]), f"../../lectures/{x['sid']}/notes/"
    counts = {lv: sum(1 for x in data if x["level"] == lv) for lv in ("easy", "medium", "hard")}
    return ("# DataWeave Practice\n\n"
            f"{len(data)} exercises ({counts['easy']} easy, {counts['medium']} medium, {counts['hard']} hard), "
            "built from the DataWeave sessions (Days 43–45, 58) and the interview Q&A. "
            "Try each one in the [DataWeave Playground](https://dataweave.mulesoft.com/learn/dataweave) "
            "before opening the answer.\n\n" + embed("dataweave", data))


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
        summary = rewrite((REPO / f"{sid}.md").read_text(encoding="utf-8"), "summary")
        head, _, rest = summary.partition("\n")
        summary = (head + "\n\n[:material-graph-outline: Mind map of this lecture](../../mindmaps/"
                   f"{sid}.md){{ .md-button }}\n" + rest)
        write(base / "index.md", summary)
        write(DOCS / "mindmaps" / f"{sid}.md", lecture_mindmap_page(sid))
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
        sd = load_study(sid)
        if sd and sd["quiz"]:
            write(base / "quiz.md", quiz_page(sid, sd))
            pages.append(("Quiz", "quiz.md"))
        if sd and sd["cards"]:
            write(base / "flashcards.md", cards_page(sid, sd))
            pages.append(("Flashcards", "flashcards.md"))
        nav_sessions[sid] = pages

    # lectures index + study plan
    write(DOCS / "lectures" / "index.md", lectures_index(ids))
    write(DOCS / "plan.md", plan_page(ids))
    write(DOCS / "mindmaps" / "index.md", course_mindmap_page(ids))

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
    mm_nav = [{"Course Map": "mindmaps/index.md"}]
    for name, rng, _ in PHASES:
        mm_nav.append({name: [{f"{label(s)} — {short_title(s)}": f"mindmaps/{s}.md"}
                              for s in (f"day{d:02d}" for d in rng) if s in nav_sessions]})
    mm_nav.append({"Interview Prep": [{f"{label(s)} — {short_title(s)}": f"mindmaps/{s}.md"}
                                      for s in INTERVIEW if s in nav_sessions]})
    nav.append({"Mind Maps": mm_nav})

    practice = []
    dw = dataweave_page()
    if dw:
        write(DOCS / "practice" / "dataweave.md", dw)
        practice.append({"DataWeave Practice": "practice/dataweave.md"})
    drill = drill_data(ids)
    if drill:
        write(DOCS / "assets" / "drill.json", json.dumps(drill, ensure_ascii=False))
        write(DOCS / "practice" / "drill.md",
              "# Interview Drill\n\n"
              f"{len(drill)} flashcards from every lecture with a deck, shuffled together. "
              "Pick a phase to focus on, or drill everything.\n\n"
              '<div data-study="drill" data-src="../../assets/drill.json"></div>\n')
        practice.append({"Interview Drill": "practice/drill.md"})
    if practice:
        nav.append({"Practice": practice})
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
    if (STUDY / f"{sid}.json").exists():
        links += [f"[Quiz]({sid}/quiz.md)", f"[Flashcards]({sid}/flashcards.md)"]
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
