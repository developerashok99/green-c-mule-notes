# Day 49 — For Each with a DB Insert, Bulk Insert, and Parallel For Each

## Session Agenda
- For Each use case — insert an array of employees, collect successes and failures
- **Bulk insert** as the alternative
- For Each payload/variable propagation recap
- **Parallel For Each** — threads, aggregated output, errors, variables
- Choosing **max concurrency**

## For Each DB Insert
- Validate non-empty input; init `successResponse` and `errorResponse` as `[]`.
- For Each → Try → Insert (target variable) → `vars.successResponse ++ [payload.empId]`.
- On Error Continue → `vars.errorResponse ++ [{"errorReason": error.description} ++ payload]`.
- Results: `{"success": [1000…1003], "error": []}`, then a **duplicate entry '1003'** error captured while 1004–1006 succeeded.
- The insert response shows only affected rows — keep the record with a target variable, rootMessage or a variable.
- Performance-test with the volumes in the non-functional requirements.

## Bulk Insert
- For Each with batch size 2 → `map` keys to DB names → **Bulk insert**.
- One connection lifecycle (create, establish, insert, close) per batch instead of per record.

## For Each Recap
- Payload not overwritten (rootMessage); modified vars come out; new vars available; counter/rootMessage removed.

## Parallel For Each
- Multi-threaded (like Scatter-Gather); 100 × 150 ms drops from ~15 s to about a fifth with 5 threads.
- Aggregated array of Mule messages **overwrites the payload** unless Target is set.
- Uses more memory — too much data → batch processing.
- On error: waits for running threads, then propagates.
- Outside variables stay **unmodified**; variables created inside are **not accessible** outside.

## Max Concurrency
- CPU-intensive: ≤ number of cores.
- Blocking I/O: cores / (1 − blocking factor) — e.g. 4 / 0.75 ≈ 5.
- Don't set random values like 100.

## Quick Recap
- For Each + Try for per-record results; Bulk insert for speed.
- Parallel For Each: faster, more memory, different propagation.
- Assignment: time 100 records with For Each vs. Parallel For Each.
