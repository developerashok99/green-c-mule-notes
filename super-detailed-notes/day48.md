# Day 48 — The For Each Scope: Collection, Counter, Batch Size, rootMessage, Error Handling and Collecting Results

> **Sources:**
> - Cleaned audio transcript ([transcripts-cleaned/day48.txt](../transcripts-cleaned/day48.txt)) and the class video (recorded 17 Jan 2025).
> - Text marked *screen* or *drawing* is read from the recording.
> - Slide images: [slides/day48](../slides/day48/).

## 1. Overview

*Slide (agenda):* For Each scope discussion.

1. What For Each does — split a collection, process each item, move on
2. Use cases — employees into the DB (and Salesforce)
3. Key behaviours — sequential, stops on error, **no response**, payload unchanged
4. Bulk insert / Salesforce limits / Scatter-Gather — "it depends on the scenario"
5. Understanding the business before building
6. The employee-insert design (`foreach-db-insert-demo`)
7. For Each configuration — **Collection**, **Counter Variable Name**, **Batch Size**, **Root Message Variable Name**
8. Why the payload is **restored** after For Each
9. Simple demo — `[1,2,3,4,5] × 20`, debugger variables
10. A failing element — the loop stops; **Try + On Error Continue** fixes it
11. Collecting results — variable inside (overwritten) vs. initialised outside (accumulated with `++`)
12. Variable propagation summary; Flow Reference inside For Each

---

## 2. What For Each Does

- One of the most important components — "difficult to write any program without for-each".
- Input: a **collection** of items — basically an array, e.g. `[1, 2, 3, 4, 5]`.
- It **splits** the collection and takes items **one by one** (each pass is an **iteration**).
- Each iteration runs **all the components** placed in the scope (it's a scope — like a flow).
- After the last item it comes out and passes the event to the next processor.
- `[1,2,3,4,5]` with "× 10" inside → **five iterations**.
- You can do **multiple operations** inside, not just one.

---

## 3. Use Cases

*Drawing:* create new employees — an array of employee objects `[{E1}, {E2} …]` → insert each into the DB.

1. A REST API receives an array of employees (name, email, designation, salary) → **insert each** into the database.
2. Same, but insert into the DB **and** create in **Salesforce** — two operations per employee.

### 3.1 Key behaviours

*Drawing:* For Each processes records sequentially; on a failure it can skip that record and the remaining records are still handled (Oracle / MySQL).

| Behaviour | Detail |
|---|---|
| **Synchronous / sequential** | Items processed in the array's order |
| **Stops on error** | If the 3rd fails (e.g. DB down), the 4th and 5th don't happen |
| Continue on error | Wrap in **Try + On Error Continue** |
| **No response** | For Each just does the work inside; it returns nothing |
| **Payload unchanged** | The payload before For Each is the payload after it |

- The API's response ("all employees inserted successfully") doesn't come from the For Each.

*Drawing:* the input can arrive as **JSON, XML or Java** — the collection is the array of records. Items can be objects, numbers, strings ….

### 3.2 Bulk insert? Salesforce? Scatter-Gather?

- **Bulk insert** might work — it depends on the scenario, the solution architect, pros and cons.
- **Salesforce** accepts at most **200** records at once — 300 won't work → you need For Each (or split into batches).
- DB **Insert** takes a single record; Salesforce **Create** takes an **array** — so inside the loop, wrap the single employee object in an array in the Transform before Salesforce Create.
- Student scenario (fewer than 100 each time): bulk insert to DB and Salesforce Create might work; with 500 records Salesforce's limit means splitting.
- No dependency between DB and Salesforce → **Scatter-Gather** is possible.

### 3.3 Understand the business first

> **Instructor's suggestion:** understand the business scenario, break it down step by step (how much data, which steps), then map it to the components you know. Many developers understand only 5–10% of the business and proceed; it usually works, but if you want to grow, change this approach — especially in your first 3–4 years.

---

## 4. The Employee-Insert Design

*Screen:* `foreach-db-insert-demo`:

```text
Listener
  Start Logger (payload)
  Is not empty collection
  Transform Message   → vars successResponse = [], errorResponse = []
  For Each
    Try
      Before DB Insert Logger
      Create employee records into DB  (Insert)
      After DB Insert Logger
      Success Response
    On Error Continue
      Fail Logger
      Error Response
  Final Response
```

*Screen (Validation **Is not empty collection**):* Values `#[payload]`, message **"No data to process"**.

*Screen (Insert):*

```sql
insert into EMPLOYEES_INFO values (:emp_id,:emp_name,:emp_status,:emp_salary,:emp_designation)
```

with input parameters such as `"emp_id": payload.empId as Number`.

*Screen (Success Response):*

```dataweave
vars.successResponse ++ payload
```

*Screen (Error Response, in On Error Continue):*

```dataweave
vars.errorResponse ++ payload ++ {"errorReason": error.description}
```

*Screen (Final Response):*

```dataweave
{"success": vars.successResponse, "error": vars.errorResponse}
```

- Goal: respond with which employees succeeded and which failed. (Run in full on Day 49.)

---

## 5. For Each Configuration

*Screen:* Collection `#[payload]`, Counter Variable Name `counter`, Batch Size `1`, Root Message Variable Name `rootMessage`.

| Setting | Default | Meaning |
|---|---|---|
| **Collection** | `#[payload]` | The input collection. Can be a variable, e.g. `vars.employees` set from `payload.employees` |
| **Counter Variable Name** | `counter` | Variable counting iterations — 1 in the first, 8 in the 8th; starts at **1** |
| **Batch Size** | `1` | Items per iteration |
| **Root Message Variable Name** | `rootMessage` | Variable holding the For Each's original input |

- The instructor never changes the counter name.
- Use the counter while debugging to see which iteration you're in.

### 5.1 Batch size

*Drawing:* For Each iterates the payload array — each iteration gets one object (`{"name": "mahesh", "dept": "software", "salary": 75000}`).

*Drawing:* `[1,2,3,4,5]` with batch size 2 → iterations `[1,2]`, `[3,4]`, `[5]`.

| Batch size | Iterations of `[1,2,3,4,5]` |
|---|---|
| 1 | 1 · 2 · 3 · 4 · 5 (single values) |
| 2 | `[1,2]` · `[3,4]` · `[5]` |
| 3 | `[1,2,3]` · `[4,5]` |

- With batch size > 1, each iteration gets an **array** — even a single leftover (`[5]`).
- "× 10" then **fails** — an array can't be multiplied. Change the processing to match the batch size.
- A single-record **Insert** won't take two records — use **bulk insert** for batches.
- **Instructor:** "Even among experienced people, about 70% won't understand this much."

### 5.2 counter and rootMessage

*Drawing:* inside For Each — `counter` (iteration number) and `rootMessage` (the original full payload) as variables.

- Two variables are created as For Each starts: **counter** and **rootMessage**.
- `rootMessage` saves the For Each's input (e.g. `[1,2,3,4,5]`).
- Both are **removed automatically** when the For Each finishes — like a background Remove Variable.

**Q (student): is rootMessage always the payload?** No — if the Collection is a variable, rootMessage holds that variable's value.

---

## 6. Why the Payload Is Unchanged

*Drawing:* after For Each the payload is the original collection again — results must be collected in variables.

- The input is saved in **rootMessage** and used throughout the process.
- So the payload after For Each is the **same** as before — nothing is overwritten, and there's **no output**.
- Interview answer: "no change to the payload before and after For Each — because of rootMessage, and For Each has no response."

---

## 7. Simple Demo — `[1,2,3,4,5] × 20`

*Screen:* `for-each-demo-7303` flow — Listener (`/foreach`) → Logger → For Each [Logger → Set Payload (`payload * 20`) → Logger] → Logger.

- Postman: `POST http://localhost:8081/foreach`, body raw JSON `[1, 2, 3, 4, 5]`.
- (An earlier version created the input inside the app as a variable `initialPayload`.)

*Screen (debugger):*

| Iteration | payload in | counter | rootMessage |
|---|---|---|---|
| 1 | 1 → 20 | 1 | `[1,2,3,4,5]` (in its typed value) |
| 2 | 2 → 40 | 2 | unchanged |
| … | … | … | … |

- Inside For Each the attributes are ignored — rarely useful there.
- `Set Payload` overwrites the payload **inside** the iteration (logger prints 20).
- After the loop: counter/rootMessage gone; payload = `[1,2,3,4,5]`; the response is the **same payload**.
- Order is **sequential** — `1, 2, "a", …` processed exactly in array order.

---

## 8. A Failing Element

*Screen:* Postman `POST /foreach` with `[1, 2, "a", 4, "b"]`.

*Screen:*

```text
You called the function '*' with these arguments:
  1: String ("a")
  2: Number (20)
```

- 1 → 20 and 2 → 40 logged; then `"a"` broke it.
- Everything after `"a"` is **not processed**; the error goes to error handling.

### 8.1 Try + On Error Continue

*Screen:* For Each with a **Try** scope and **On Error Continue** — the failing element no longer stops the loop.

- `"a"` fails → On Error Continue logs it → next iteration continues.
- Output: 20, 40, error logged for "a", 60, error logged for "b", 100 → done.

---

## 9. Collecting Results

- The **counter** only tells the iteration, not which values succeeded.
- The payload is overwritten every iteration — need variables.

### 9.1 Variable created inside — overwritten

*Screen:* Set Variable inside the loop (`successResponse` / `errorResponse`).

- Initialising the variable **inside** resets it each iteration.
- At the end: `successResponse` = **100**, `errorResponse` = **"b"** — only the **last** iteration's values.
- Learned: a variable created **inside** For Each **is accessible outside**, with its **last** value.

### 9.2 Initialised outside — accumulated

- Create `successResponse = []` and `errorResponse = []` in a Transform **before** the For Each.
- Inside, set the **same names**:

```dataweave
vars.successResponse ++ payload      // in the main path
vars.errorResponse ++ payload        // in On Error Continue
```

- Iteration 1: `[] ++ 20` → `[20]`; iteration 2 → `[20, 40]`; ….
- `++` adds the number/string into the array.
- **Same name** is essential — a different name would start from empty each time.
- Final Transform (JSON) after the loop.

*Screen:* Postman **200**:

```json
{"successResponseResults": [20, 40, 80, …], "failedResponseResults": ["a", "b"]}
```

> **Interview answer:** "For Each has no response. To return aggregated successes and failures, initialise two empty array variables before the For Each and accumulate into them with `++` — one in the main path, one in On Error Continue."

---

## 10. Propagation Summary

| Case | After For Each |
|---|---|
| Payload | **Same** as before (rootMessage) |
| Variable created **outside**, modified inside | **Modified** value |
| Variable created **outside**, used inside | Accessible inside |
| Variable created **inside** | Accessible outside — **last iteration's** value |
| counter, rootMessage | Removed |

**Q (student): a Flow Reference inside For Each?** It goes to that flow, does the work, comes back, completes the iteration, then the next — synchronous.

> **Instructor's view:** we don't go to this depth in real time; with a use case you do a POC. Practising it now means you'll recognise it later. The DB use case follows next session (~10 minutes).

---

## 11. Important Terminology

| Term | Meaning |
|---|---|
| For Each | Scope that iterates a collection sequentially |
| Collection | The input array (default `#[payload]`) |
| Iteration | One pass over one item (or one batch) |
| counter | Auto-created iteration-number variable (starts at 1) |
| rootMessage | Auto-created variable holding the original input |
| Batch size | Items per iteration; >1 gives an array |
| Is not empty collection | Validation operation that fails on an empty array |
| On Error Continue | Handler that swallows the error so the loop continues |
| `++` | DataWeave concatenation — adds items to an array |

---

## 12. Interview Questions

### Q1. What does For Each return?
Nothing — it has no response. The payload after it is the same as before.

### Q2. Why isn't the payload changed after For Each?
The input is stored in the `rootMessage` variable and restored; For Each produces no output.

### Q3. What variables does For Each create?
`counter` and `rootMessage` — both removed when it finishes.

### Q4. What does batch size do?
Sets how many items each iteration gets. With 2, `[1,2,3,4,5]` becomes `[1,2]`, `[3,4]`, `[5]` — each an array, so the inner logic must handle arrays.

### Q5. What happens when one item fails?
The loop stops and the rest aren't processed — unless the inner logic is wrapped in Try with On Error Continue.

### Q6. How do you return which records succeeded and failed?
Initialise empty arrays before the loop; inside, accumulate with `vars.successResponse ++ …` and, in On Error Continue, `vars.errorResponse ++ …`; build the response after the loop.

### Q7. Variable propagation in For Each?
Outside variables modified inside keep the modified value; variables created inside are available outside with the last iteration's value.

### Q8. Is For Each sequential or parallel?
Sequential, in array order (Parallel For Each is the multi-threaded one).

---

## 13. Must Remember

1. For Each splits a collection and runs the scope **once per item**, **in order**.
2. **No response**; payload **unchanged** (rootMessage).
3. Config: **Collection** (`#[payload]`), **counter**, **Batch Size 1**, **rootMessage**.
4. Batch size > 1 → each iteration gets an **array**.
5. counter starts at **1**; counter and rootMessage are removed afterwards.
6. An error **stops** the loop — use **Try + On Error Continue**.
7. Initialise result arrays **outside**, accumulate with `++` using the **same names** inside.
8. A variable created inside is visible outside with its **last** value.
9. Salesforce Create takes at most **200** records and needs an array.
10. Understand the business scenario before choosing For Each / bulk / Scatter-Gather.
