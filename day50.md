# Day 50 — Batch Processing: Phases, Batch Job / Step / Aggregator, and On Complete

## Session Agenda
- Synchronous vs. asynchronous (drawings; the Async scope wasn't demoed)
- When to use **batch** — data larger than memory, reliability
- The three **phases**
- **Batch Job, Batch Step, Batch Aggregator** and their properties
- Demo with a Scheduler; the **On Complete** result
- Use case — weekly customer CSV from FTP

## Why Batch
- For Each and Parallel For Each are **synchronous**; batch is **asynchronous**.
- Use batch when the data set is **larger than memory**.
- **Reliability:** if the app restarts mid-way, batch resumes; For Each / Parallel For Each lose the rest.

## Phases
- **Load and Dispatch** — invisible; splits input into a **persistent queue** (disk).
- **Process Records** — one or more batch steps.
- **On Complete** — a summary (loaded, processed, successful, failed records) — not individual responses.

## Components and Properties
- **Batch Job:** Max Failed Records (**-1** = continue always, 0 = stop at first), Job Instance Id, Batch Block Size (**100**), Max Concurrency (threads).
- **Batch Step:** Accept Expression (filter, e.g. only numbers); Accept Policy **NO_FAILURES** (default), **ONLY_FAILURES**, ALL.
- **Batch Aggregator:** aggregator size groups **successful** records only; it goes inside a step.
- Input should be Java, JSON or XML.

## Demo
- `[1, 2, 3, 4, 5, "a", "b", 6]` × 20; letters fail; a second step handles them.
- Records processed out of order (3 threads); aggregator groups like `[20, 40, 80, 100]`.
- Triggered by a **Scheduler** (fixed frequency / cron).
- On Complete: **BatchJobResult** — 8 processed, 7 successful, 1 failed on screen.

## Use Case
- Every Friday 10 PM: customer CSV (~5,000–12,500 rows) on FTP → Java → batch → DB insert + Salesforce create; failures to another table via ONLY_FAILURES.

## Quick Recap
- Batch = async, multi-threaded, reliable.
- Load and Dispatch → Process Records → On Complete.
- Failures continue by default; the aggregator gets only successes.
- EDI needs Anypoint Partner Manager / X12 (rare).
