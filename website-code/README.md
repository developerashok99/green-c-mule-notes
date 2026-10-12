# Study website (MkDocs Material)

Live site: https://developerashok99.github.io/green-c-mule-notes/ — rebuilt and deployed by
`.github/workflows/pages.yml` on every push to `main`.

## How it is built

| File | Role |
|---|---|
| `build.py` | Copies the repo's notes and slides into `docs/` (generated, not committed) and writes `mkdocs.gen.yml` with the nav. Adds the lecture section bar, "Next step" box, mind maps, quiz/flashcard pages, practice pages and glossary. **The source notes are never modified.** |
| `mkdocs.yml` | Theme, palette (custom calm colours), features (instant navigation, auto-hiding header), Markdown extensions. |
| `overrides/` | `main.html` removes the separate tab row; `partials/header.html` puts the tabs in the header row (no site title). |
| `pages/` | Hand-written pages (`index.md` = home/dashboard) and assets: `extra.css` (layout, typography, widgets) and `study.js` (all interactive study tools). |
| `data/study/<sid>.json` | Quiz questions and flashcards per lecture. Validate with `python3 check_study.py`. |
| `data/dataweave.json` | DataWeave practice exercises (all answers verified with the DataWeave CLI 2.12). |

Local preview: `python3 build.py && mkdocs serve -f mkdocs.gen.yml`

## Reading layout

- **Wide (default):** text fills the whole content column between the sidebars; in Focus mode it fills the screen (3% margins).
- **Narrow (↔ button):** text is capped at `--st-measure` ≈ 40× the body font size (≈ 75–80 characters per line) in a centred 1180 px column — easier line tracking. The choice is saved as `mule.width`.
- **A− / A+** scale the body text (`--st-scale`); **Focus** hides header, tabs and sidebars and requests browser fullscreen (Esc leaves).

## Saved progress (browser only, `localStorage`)

| Key | Format | Used by |
|---|---|---|
| `mule.srs` | `{cardId: [box, dueDay]}` — boxes 0–5, intervals 0/1/3/7/21/60 days | Flashcards, Review Today, Mock Interview, dashboard |
| `mule.mistakes` | `{questionId: timesMissed}` | Every quiz/test, My Mistakes, dashboard |
| `mule.last` | `{href, title, at}` | "Continue" and "Next in plan" on the dashboard |
| `mule.font` | number 0.8–1.5 | A− / A+ |
| `mule.width` | `"wide"` / `"narrow"` | ↔ text width |
| `mule.navHidden` | `true` / `false` | header button / `[` key — hide the left lecture list |
| `sessionStorage["focus-mode"]` | `"1"` / `""` | Focus mode across pages |

Card ids are `<sid>-c<n>` and question ids `<sid>-q<n>` (position in the lecture's JSON file), so reordering a file's items changes which saved entries they match.

## Keyboard

Quiz: **1–4** answer · **Enter** next. Flashcards: **Space** (or Enter on the focused card) flip · **←** Again · **→** Know it. Mock interview: **Space** reveal · **1/2/3** rate. Site search: **/**. Hide/show the left lecture list: **[**.
