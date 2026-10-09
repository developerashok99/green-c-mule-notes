# Day 48 — The For Each Scope

## Session Agenda
- What **For Each** does and when to use it
- Configuration — **Collection, counter, Batch Size, rootMessage**
- Why the payload is unchanged after For Each
- Demo — `[1,2,3,4,5] × 20`, a failing element, **Try + On Error Continue**
- Collecting success and error results; variable propagation

## For Each Basics
- Splits a collection (JSON, XML or Java array) and runs every component in the scope once per item, **sequentially**.
- **No response**; the payload after For Each is the same as before.
- An error **stops** the loop unless wrapped in Try + On Error Continue.
- Use cases: each employee → DB insert (and Salesforce Create — array input, max 200 records).
- Bulk insert or Scatter-Gather may fit instead — it depends on the scenario.

## Configuration
- **Collection** — default `#[payload]`, or a variable.
- **Counter Variable Name** `counter` — iteration number, starts at 1.
- **Batch Size** — default 1; with 2, `[1,2,3,4,5]` → `[1,2]`, `[3,4]`, `[5]` (arrays).
- **Root Message Variable Name** `rootMessage` — holds the input; that's why the payload is restored.
- counter and rootMessage are removed when the loop ends.

## Demo
- `POST /foreach` `[1,2,3,4,5]` → 20, 40, 60, 80, 100; response = original payload.
- `[1,2,"a",4,"b"]` → "You called the function '*' with … String ("a")"; loop stopped.
- With Try + On Error Continue, failures are logged and the loop continues.

## Collecting Results
- A variable initialised inside is overwritten — only the last value survives.
- Initialise `successResponse = []` and `errorResponse = []` **before** the loop; accumulate with `++` using the same names.
- Result: `{"successResponseResults": [20, 40, 80 …], "failedResponseResults": ["a", "b"]}`.

## Quick Recap
- For Each: sequential, no response, payload unchanged.
- counter + rootMessage are internal.
- Batch size > 1 gives arrays.
- Try + On Error Continue to continue; accumulate results in outside variables.
- Next: the employee DB insert use case.
