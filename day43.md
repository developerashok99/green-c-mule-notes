# Day 43 — Async Scope and DataWeave Basics: Playground, Script Anatomy and Selectors

## Session Agenda
- Synchronous vs. asynchronous processing
- **Async scope** demo with parent and child flows
- **DataWeave Playground** and tutorial
- Script anatomy and MIME types
- **Selectors**: single value, index, range, multi-value, descendants

## Async Scope
- Synchronous: each step waits for the previous one; the consumer waits too.
- Use case: approve a loan in ~500 ms and upload the ~4 s documents to FTP in the background.
- Flow Reference alone waits → response "child flow payload".
- Flow Reference inside **Async** → **fire and forget** → response "parent flow payload"; the child's payload/vars don't return.
- Same listener path in two flows → "Already exists a listener matching that path and methods".
- Async errors don't reach the consumer — handle via queue/logs for reliability.

## DataWeave Basics
- An expression language for transformations (JSON/XML/CSV) and enrichment; we write **2.0**.
- Playground: input, script, output — online, so avoid sensitive data.
- Script = header (directives: `%dw 2.0`, optional `input`, `output`) + `---` delimiter + body.
- Default MIME type is **Java**; convert only when needed.
- `header=false` for CSV; `skipNullOn="everywhere"` for JSON/XML.
- Arrays can hold mixed types.

## Selectors
- `.` single value — first match.
- `[n]` index — from 0; `-1` is last.
- `[a to b]` range — rarely used.
- `.*` multi-value — all matches at one level as an array.
- `..` descendants — any depth.

## Quick Recap
- Async = don't wait for side tasks.
- Header, `---`, body.
- `.` and `[n]` are the everyday selectors.
