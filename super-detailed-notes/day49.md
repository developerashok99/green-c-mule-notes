# Day 49 — For Each with a Database Insert, Bulk Insert, and Parallel For Each (Propagation, Errors, Max Concurrency)

> **Sources:**
> - Cleaned audio transcript ([transcripts-cleaned/day49.txt](../transcripts-cleaned/day49.txt)) and the class video (recorded 18 Jan 2025).
> - Text marked *screen* or *drawing* is read from the recording.
> - Slide images: [slides/day49](../slides/day49/).

## 1. Overview

1. A real-time For Each use case — insert an array of employees into the DB, collecting **successes and failures**
2. Non-functional requirements and performance testing
3. Capturing the inserted employee ID — target variable / root message / variable
4. Running it — the coerce error, the success response, the duplicate-key error
5. **Bulk insert** with For Each batch size 2
6. Why bulk is faster — the DB connection lifecycle
7. For Each summary — payload and variable propagation
8. **Parallel For Each** — threads, aggregated output, memory
9. For Each vs. Parallel For Each — threading, errors, order, memory
10. The Parallel For Each demo — threads, output, a failing record, variables
11. Choosing **Max Concurrency** — CPU-intensive vs. blocking tasks
12. Assignment — 100 records, For Each vs. Parallel For Each timing

---

## 2. The Use Case — Insert Employees with For Each

- A REST API receives an **array of employees** and inserts them into the database record by record.
- Capture which records succeeded and which failed; handle errors with a **Try** inside the For Each.

*Screen:* `foreach-db-insert-demo`:

```text
Listener
  Start Logger
  Is not empty collection        (Validation module)
  Transform  → vars successResponse = [], errorResponse = []
  For Each
    Try
      Before DB Insert Logger
      Create employee records into DB   (Insert, target variable dbResponse)
      After DB Insert Logger
      Success Response   (Transform → vars.successResponse)
    On Error Continue
      Fail Logger
      Error Response     (Transform → vars.errorResponse)
  Final response { success, error }
```

### 2.1 Non-functional requirements

- Before going live, **test with around 5,000 or 10,000 records**.
- How many requests per day/hour the API gets is a **non-functional requirement**, stated by the business analysts/team in the document.
- If not stated, have your own expectation.
- E.g. 5,000 requests/day → divide by 24 for per hour → test higher than that.
- Then allocate memory, and test the number of cores and workers.

---

## 3. The Insert and Its Parameters

*Screen:*

```sql
insert into EMPLOYEES_INFO values (:emp_id,:emp_name,:emp_status,:emp_salary,:emp_designation)
```

*Screen (input parameters):*

```dataweave
{
  emp_id: payload.empId as Number,
  emp_name: payload.empName,
  emp_status: if (payload.empStatus == true) "active" else "inactive",
  emp_salary: payload.empSalary,
  emp_designation: payload.empDesignation
}
```

### 3.1 Which employee was inserted?

- The insert's response only says **one row inserted** (`affectedRows`) — not which employee.
- Ways to get the employee ID:

| Option | How |
|---|---|
| **Target variable** on the insert (Advanced) | The payload isn't overwritten → use `payload.empId` |
| **rootMessage** | For Each keeps the input in `rootMessage` |
| A variable set before the insert | Holds the employee ID |

- The class used a **target variable** (`dbResponse`) — the DB response wasn't important.
- Capture **only the employee ID**, not the full record — accumulating 100 full records wastes memory.

### 3.2 Collecting results

*Screen (Success Response):*

```dataweave
vars.successResponse ++ [payload.empId]
```

*Screen (Error Response, in On Error Continue):*

```dataweave
vars.errorResponse ++ [{"errorReason": error.description} ++ payload]
```

- Could also wrap the ID in an object with a key — then an array of objects builds up.

### 3.3 The request

- Built from the **POST example in the RAML** (`src/main/resources` → the API spec of the HR employees app, 7303).
- The POST example is a single object → wrap in `[ ]` and paste copies separated by commas → an **array**.
- Employee IDs must be **unique** — checked against MySQL Workbench (`select * from employees_info`, mule DB).

*Screen:* Postman body — array of employees (empId, empName, empSalary, active, empDesignation).

---

## 4. Running It

*Screen:* **"Cannot coerce Array ([]) to Number"** — `payload.empId as Number` evaluated on the whole array instead of one record. Fixed (saved the For Each config) → the payload inside became a single **object**.

*Screen (debugger inside For Each):* variables — **counter**, **dbResponse** (target), **rootMessage**, **successResponse**, **errorResponse**; current record as payload.

*Screen (first run):*

```json
{"success": [1000, 1001, 1002, 1003], "error": []}
```

*Screen (second run, reusing 1003 in the last record):*

```json
{"success": [1004, 1005, 1006],
 "error": [{ "errorReason": "Duplicate entry '1003' for key 'employees_info.PRIMARY'", … }]}
```

- The last iteration failed, On Error Continue captured it, and the For Each continued.

---

## 5. Bulk Insert

*Screen:* alternative flow — **For Each with batch size 2** → Transform `payload map …` → **Bulk insert**.

*Screen:*

```sql
insert into EMPLOYEES_INFO values (:emp_id,:emp_name,:emp_status,:emp_salary,:emp_designation)
```

- With batch size 2, each iteration gets an **array of 2** employees.
- Use **map** to change every object's keys to the DB names (`empId` → `emp_id`, `empName` → `emp_name`, status → active/inactive), in the query's order.
- One Bulk insert per batch:

| Records sent | Bulk inserts |
|---|---|
| 4 | 2 |
| 10 | 5 |
| 9 | 5 (last has 1) |
| 3 | 2 (second is an array of **one**) |

- The incoming payload is an **ArrayList**; records are picked from the first one in order (1007, 1008, then 1009).

### 5.1 Why bulk is faster

*Drawing:* For Each = sequential, one DB call per record (stop/continue on error) vs. Bulk insert = one call.

*Drawing:* DB connection lifecycle — **create** connection → **establish** → **insert** record → **close** connection.

- Five records one by one = this lifecycle **five times**; bulk = **once** → better performance, faster results.

---

## 6. For Each Summary — Propagation

*Drawing:* For Each scope — payload, vars and the modified result coming out.

| Item | After For Each |
|---|---|
| Payload | **Not overwritten** — same as the input (it's kept in **rootMessage**) |
| Variable 1 (existed, modified inside) | **Modified** |
| Variable 2 (existed, not modified) | Unchanged |
| New variable created inside | **Available** outside |
| `counter`, `rootMessage` | Created for the For Each; **removed** when it completes |

---

## 7. Parallel For Each

*Slide (agenda):* propagation of payload and variables, error handling, max concurrency, differences from For Each.

- For Each processes records one by one (per batch size); **Parallel For Each** processes them **in parallel**, in any order.
- Example: 100 records × 150 ms each → For Each ≈ **15 seconds**.
- With **max concurrency 5**: 5 threads (5 "routes") — like **Scatter-Gather** — 5 records in ~150 ms → about a fifth of the time.

### 7.1 Aggregated responses and memory

- Parallel For Each **captures every iteration's response** automatically (in For Each we accumulated manually).
- Downside: **more memory** — it stores everything, not just what you need.
- Too much → **out-of-memory** → that's when you go to **batch processing**.
- Rough guide given: For Each for small sets (up to 1,000–2,000); Parallel For Each depends on the worker memory (500 MB or 1 GB?); 50,000 / 1 lakh / 20 lakh records → batch. It depends on the use case.

---

## 8. For Each vs. Parallel For Each

*Drawing:* For Each single-threaded, stops on error, sequential vs. Parallel For Each multi-threaded, waits for all, aggregated response.

| | For Each | Parallel For Each |
|---|---|---|
| Threads | **Single** | **Multiple** |
| Time | More | Less |
| Order of processing | Sequential | Random |
| Output | Payload not overwritten | **Aggregated response overwrites payload** (unless a target variable is set) |
| On error (no Try) | Stops and propagates | **Waits for the other running threads**, then stops and propagates; doesn't start the next iteration |
| Memory | Less | **More** |
| Existing variable modified inside | Modified value comes out (last iteration's) | **Unmodified** — original value |
| New variable created inside | Available outside | **Not accessible** outside |

*Drawing:* `[1,2,3,4,5]` split and processed concurrently — total time = slowest record, aggregated response.

- "Split, process, aggregate."
- Students disagreed on the aggregated order ("randomly" / "in the same order"); *screen:* the output array was in the **order given**, while processing happened in random order.

**Why the variable isn't modified:** with thousands of records processed in parallel in no fixed order, there's no single "last" modification to keep.

---

## 9. Parallel For Each Configuration

| Setting | Meaning |
|---|---|
| Collection | Default **payload**; or a variable / part of the payload via expression |
| Timeout | Each route must finish within this time (like Scatter-Gather) |
| **Max concurrency** | Maximum parallelism — set automatically by default; don't give random values |
| Target | Save the aggregated result in a variable instead of overwriting the payload |

---

## 10. The Parallel For Each Demo

*Screen:* `parallel-for-each` flow — Listener (path PFE) → Start Logger → Set Payload `[1,2,3,4,5,…]` (numbers and strings) → variable `outsidePFE` → **Parallel For Each** [Try: Logger → set `insidePFE` → Transform (`payload * 10`) …; On Error Continue → Transform `error.description`].

- Another app was already running on the port — stop it first.

*Screen (console):* each record processed on a **different thread** — logs in random order (4, b, 5, 1, a); **5 threads** based on the system's capacity.

- Debugging can't really show five threads at once.

*Screen (output):* an **array of Mule messages** — each with payload, attributes, exceptionPayload, inbound attachment names, property names … — one per iteration (7 here). 10,000 records → 10,000 objects.

*Screen:* the failing record (`"a" * 10`) — its element's payload holds *"You called the function '\*' with these arguments: String "a" and Number"*; the others succeed.

*Screen:* Postman **500 "Expecting Array or Object but got Null"** — a variable set inside the Parallel For Each used outside it.

- After the scope: `outsidePFE` (and the employees variable) unchanged; payload **overwritten**.

---

## 11. Choosing Max Concurrency

*Screen:* Task Manager — CPU cores.

*Drawing:*

| Task type | Examples | Formula |
|---|---|---|
| **CPU-intensive** | DataWeave-heavy work | max concurrency **≤ number of available cores** |
| **Blocking (I/O)** | Database, HTTP request, Salesforce | max concurrency = **cores / (1 − blocking factor)** |

- Cores = your machine's locally; the server's when deployed.
- **Blocking factor** must be **> 0 and < 1** (at 1 the divisor is 0).

*Drawing (example):* 4 cores, DB wait **100 ms of 400 ms** → blocking factor **0.25** → 4 / 0.75 ≈ **5.3** → about **5 threads**.

> **Instructor's experience:** in interviews with 5–10-year candidates he asks "I want max concurrency 100 — will it work?" and very few answer. Even if you don't remember the formula exactly, say you don't give 100 or 200 randomly — it's calculated.

---

## 12. Assignment

- Implement the DB insert use case with **100 records** in **For Each** and in **Parallel For Each**.
- Run in **run mode**, not debug.
- Log a timestamp at the start and end (or read Postman's response time) and compare.
- Report observations in the next session.

---

## 13. Important Terminology

| Term | Meaning |
|---|---|
| Non-functional requirement | Expected load (requests per day/hour) used for performance testing |
| Target variable | Stores a component's result without overwriting the payload |
| rootMessage | For Each variable holding the original input |
| counter | For Each iteration counter |
| Bulk insert | One DB call inserting many records |
| Batch size (For Each) | Records per iteration |
| Parallel For Each | Multi-threaded For Each with aggregated output |
| Max concurrency | Maximum parallel threads |
| CPU-intensive task | Work bound by CPU (e.g. DataWeave) |
| Blocking task | Work that waits on I/O (DB, HTTP, Salesforce) |
| Blocking factor | Fraction of time a task waits (0 < f < 1) |

---

## 14. Interview Questions

### Q1. For Each vs. Parallel For Each?
For Each is single-threaded and sequential, doesn't overwrite the payload, and propagates modified variables. Parallel For Each is multi-threaded, faster, uses more memory, overwrites the payload with an aggregated array of messages, keeps outside variables unmodified, and hides variables created inside.

### Q2. How do you know which records were inserted inside a For Each?
The insert response only has affected rows — use a target variable so the payload keeps the record (or rootMessage, or a variable) and collect `payload.empId` into an accumulator variable; collect errors in On Error Continue.

### Q3. Why is Bulk insert faster?
One connection lifecycle (create, establish, insert, close) for many records instead of one per record.

### Q4. What happens on an error in Parallel For Each?
It waits for the other running threads to finish, then stops and propagates the error.

### Q5. How do you choose max concurrency?
CPU-intensive: ≤ number of cores. Blocking/I/O: cores / (1 − blocking factor). E.g. 4 cores, 0.25 blocking → ~5. Don't set arbitrary values like 100.

### Q6. When does Parallel For Each become a problem?
When storing every iteration's response exhausts memory — then use batch processing.

### Q7. Why isn't For Each's payload overwritten?
The input is kept in rootMessage; each iteration's payload is taken from it, and the original is restored after the scope.

---

## 15. Must Remember

1. Use **Try + On Error Continue** inside For Each to keep going and capture failures.
2. Accumulate with `vars.x ++ [value]` — store only the ID.
3. Insert response = affected rows; use a **target variable** to keep the record.
4. Bulk insert = one connection lifecycle; For Each batch size sets records per call.
5. For Each: payload **not overwritten**; modified vars come out; new vars available; counter/rootMessage removed.
6. Parallel For Each: **multi-threaded**, **aggregated output overwrites payload**, more memory.
7. PFE: outside vars **unmodified**; inside vars **not accessible** outside.
8. PFE error: waits for running threads, then propagates.
9. Max concurrency: CPU ≤ cores; I/O = cores / (1 − blocking factor).
10. Test with realistic volumes from the non-functional requirements.
