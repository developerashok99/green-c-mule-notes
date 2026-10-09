# Day 43 — Async Scope, and DataWeave Basics: Playground, Script Anatomy, MIME Types and Selectors (Hands-On)

> **Sources:**
> - Cleaned audio transcript ([transcripts-cleaned/day43.txt](../transcripts-cleaned/day43.txt)) and the class video (recorded 8 Jan 2025).
> - Text marked *screen* or *drawing* is read from the recording.
> - Slide images: [slides/day43](../slides/day43/).

## 1. Overview

1. Synchronous vs. asynchronous processing
2. Use case — uploading loan documents in the background
3. Hands-on: async-scope-demo — parent and child flows
4. Port and listener-path conflicts
5. Plain Flow Reference (synchronous) vs. Flow Reference inside **Async**
6. Errors in the async part and reliability
7. **DataWeave Playground** and tutorial
8. What DataWeave is; versions
9. Where scripts are written; **script anatomy** (header, `---`, body)
10. **MIME types**, default Java, `header=false`, `skipNullOn`
11. A quick `map` example (CSV → JSON)
12. Data types
13. **Selectors** — single value, index, range, multi-value, descendants

---

## 2. Synchronous vs. Asynchronous

*Drawing:* consumer → request → API steps (one calls the DB) → response.

**Synchronous:**

- The consumer sends a request and **waits** for the response.
- Components execute **in sequence**; each waits for the previous one's response.
- E.g. a DB call — we send the request and wait for the DB's response.

**Asynchronous:** the opposite — something runs **independently** alongside the main process, without making anyone wait.

---

## 3. Use Case — Loan Documents

1. A loan request arrives with details (name, addresses, PAN, phone, email) and **scanned documents** (ID proof, address proof, PAN card).
2. The app checks eligibility — PAN, Aadhaar, CIBIL score, bracket, age.
3. Decision: loan approved.
4. The documents must be saved — on an **FTP / SFTP / file server** — which takes ~**4 seconds**.
5. The rest of the process takes ~**500 ms**.

- Don't make the consumer wait 4 seconds for the upload.
- Respond immediately ("your loan application is accepted…"), and upload in the **background**.

*Drawing:* the last step, **Doc Upload**, is wrapped in an **Async** scope — the response goes back without waiting; the upload writes to the FTP server in the background.

---

## 4. Hands-On: async-scope-demo

1. *Screen:* new project **async-scope-demo** — Listener (path **`/async`**), Start Logger, Set Payload, Set Variable, End Logger.
2. Copy the flow (right-click → XML, Ctrl+C / Ctrl+V) to make a **child flow**: Set Payload **"child flow payload"**, Set Variable.
3. *Screen:* two flows — `async-scope-demo-parent-flow` and `async-scope-demo-child-flow`.
4. *Screen:* **Flow Reference** in the parent → flow name `async-scope-demo-child-flow`.

- A Flow Reference always goes to the **first component**, not the source — so the child's source can be removed.
- "Parent" just means the calling flow; if the child calls another flow, it becomes a parent.

### 4.1 Port in use

- On a company remote desktop, **8081** may already be used by another process → "port already in use".
- Same machine, same port can't serve two services — like two houses with the same house number on one street.
- Fix: change the listener's port to a vacant one (8082, 8083, 8085…).

### 4.2 Listener path conflict

- *Screen:* deploy error — **"Already exists a listener matching that path and methods"** — both flows had a Listener on the same path.
- Fix: delete the child's listener (not needed), or give different paths (`/parentasync`, `/childasync`) with the **same** listener config/port.
- Analogy: two brothers' houses in one compound with one house number — mark them 1 and 2.
- Rare in real time, but it can confuse you in a POC.

---

## 5. Flow Reference: Sync vs. Async

### 5.1 Plain Flow Reference

- *Screen — debugger:* the Flow Reference **waits** for the child; after it returns, payload is "child flow payload" and its variable is visible in the parent.
- *Screen:* Postman `GET http://localhost:8081/async` → **200 "child flow payload"**.

### 5.2 Flow Reference inside Async

- **Core → Scopes → Async**, or right-click → **Wrap in → Async** (like Try), or drag the Flow Reference into it.
- An Async scope can hold **multiple** components.
- *Screen:* parent flow: Listener → Start Logger → Set Payload → Set Variable → **Async [Flow Reference]** → End Logger.

**Result:**

- The response comes as soon as the End Logger finishes; the child completes **afterwards**.
- *Screen:* console shows the async branch running separately.
- *Screen:* Postman → **200 "parent flow payload"** — the child's payload/variables **don't come back**.

- This is **fire and forget**.
- At the Async, a **copy** of the event goes into it, and the same event continues to the next component.

| | Flow Reference | Flow Reference in Async |
|---|---|---|
| Parent waits? | Yes | No |
| Child's payload/vars return? | Yes | No |
| Response in class | "child flow payload" | "parent flow payload" |

---

## 6. Errors in the Async Part

**Q: If the async part fails, how does the consumer see it?**

- It doesn't go to the consumer — they don't need it.
- Publish the error to a **queue** and process it from there, or check the logs and correct it.

**Q: If the loan is sanctioned but documents are missing?**

- That's why you need **reliability** — no message loss.
- A rejected loan without documents isn't a big problem; a sanctioned one must have them (e.g. if fraud is suspected later).
- The upload must handle errors without losing the message — senior people design this; follow their approach.

---

## 7. DataWeave Playground

*Screen:* **dataweave.mulesoft.com/learn/dataweave** — input (payload), script and output panes.

- A UI from MuleSoft to **practise DataWeave** or check expressions.
- Left = input; middle = script; right = output.
- Has a **Tutorial**; the **docs** are more detailed.

> **Instructor's view:** learning all of DataWeave takes months; learn the 20–25% that gives 70–80% of results, and check the docs for anything new.

**Sensitive data:** the Playground is **online** — pasting banking/financial payloads there can break guidelines. Use Studio's **Preview** or the debugger's **evaluate expression** instead.

---

## 8. What DataWeave Is

- A **programming / expression language** for transforming messages in MuleSoft.
- Format conversions: JSON ↔ XML, CSV ↔ JSON …
- **Enrichment** — e.g. first + last name → full name (concatenation).

**Versions:**

- DW **1.0** (old) — ignore.
- We write **2.0**; the latest is around 2.6 (the instructor wasn't sure). 2.x minor versions have small changes only.
- The version is in the header.

---

## 9. Where Scripts Are Written and Script Anatomy

- In **Transform Message, Set Payload, Set Variable**, etc.
- *Screen:* input `{"message": "Hello world"}`, script `payload.message` → only the value.
- **Why Transform Message?** It pre-fills `%dw 2.0`, `output application/java` and `---`; in Set Payload/Set Variable you write everything.

```dataweave
%dw 2.0
output application/json
---
payload.message
```

| Part | Meaning |
|---|---|
| **Header (directives)** | Version (`%dw 2.0`), `input`, `output` directives |
| **`---`** | The **delimiter** separating header and body |
| **Body** | The transformation |

- `output application/json` / `application/xml` / `application/csv`; newer versions accept the short `json`, `xml`, `csv`.
- Transform Message also has the graphical editor (two-pane / single-pane) and **Preview** (needs sample input; sometimes stuck on "resolving metadata").
- **Instructor's preference:** the Playground or evaluate-expression while debugging.

### 9.1 Tutorial 1.3 — Script Anatomy

*Screen:*

```dataweave
%dw 2.0
input payload json
output csv header=false
---
payload
```

- Line 1 — version: "a necessary formality, as other factors determine which DataWeave version is used."
- `input` is **optional** — we never write it in Studio because the metadata is already defined before the Transform.
- `input` names where the input is (payload or a variable) and its **MIME type** (data format).

---

## 10. MIME Types and Writer Properties

*Screen — Tutorial 1.2:* `application/json`, `application/xml`, `application/csv`; also others like dw, Java.

- **Default internal MIME type = Java.**
- Don't convert unnecessarily — converting back and forth costs a little performance. Convert only when you need XML/CSV etc.
- Input JSON → output JSON: no change; → CSV: changes; `header=false` drops the header.
- These output properties are rarely used.

**skipNullOn:**

```dataweave
%dw 2.0
output application/json skipNullOn="everywhere"
---
payload
```

- A `null` in the second object was **removed** from the output.
- *Screen:* on CSV output it errors — **"Invalid input 's', expected ','"** — skipNullOn isn't a CSV property.
- *Screen:* docs — **Skip Null On** (`elements`, `attributes`, `everywhere`) for XML / JSON.
- **Q: Does it skip empty strings?** No — only nulls.

---

## 11. A Quick map Example

*Screen:* CSV payload in the Playground:

```dataweave
%dw 2.0
output application/json
---
payload map ((item, index) -> {
  "fullName": item.firstName ++ " " ++ item.lastName,
  "age": item.age
})
```

- Mistake fixed: the input type was set to JSON while the payload was CSV.
- Each CSV row becomes an object → an **array of objects**.
- `map` is discussed in detail later.

---

## 12. Data Types

- Strings, numbers, booleans (true/false), arrays, objects.
- A DataWeave **array can hold mixed types** (string, number…) — unlike some languages.
- Objects: curly braces, key–value pairs separated by commas.

---

## 13. Selectors

### 13.1 Single value selector — `.`

*Screen — Tutorial 3.1:* `payload.environment`, `payload.name`.

- The **dot** (period); e.g. `payload.age`, `payload.stage`.
- Returns the value (object, number or array).
- With **two keys of the same name**, it returns the **first** only.

### 13.2 Index selector — `[n]`

*Screen — Tutorial 3.2:* `payload[1]`, `payload[-1]` ("ua").

- Arrays index from **0**: `["prod", "qa", "dev"]` → `payload[2]` = "dev".
- Nested arrays: `payload[1][…]`.
- Arrays of objects: combine — e.g. `payload[2][0][0].age`.
- **Negative** indexes count from the end: `-1` = last, `-2`, `-3` = first of three.

### 13.3 Range selector — `[a to b]`

*Screen — Tutorial 3.3:* `payload[0 to 1]` → `["prod", "qa"]`; reversed range with negative indexes.

- An extension of the index selector.
- Needn't start at 0 (e.g. 2 = dev, 3 = uat, 4 = pre-prod).
- A range beyond the array end returned only the existing values.
- `-3 to -1` works too.
- **Q: Can you write `3-1` instead of `to`?** No — `-` is subtraction, so `payload[3-1]` = `payload[2]`.
- Rarely used.

### 13.4 Multi-value selector — `.*`

*Screen — Tutorial 3.4:* `payload.*name` → `["Emilia", "Isobel", "Euphemia", "Rose"]`; `payload.*price` on an array.

- "Returns an array containing any value that matches the key."
- With only one `name`: `payload.name` gives a **string**, `payload.*name` gives an **array** with that value.
- Works on arrays too.
- *Screen:* XML — `payload.movies.*title` → `["The Terminator", "Titanic", "Avatar"]` (repeated tags); add an index to pick one.

### 13.5 Descendants selector — `..`

*Screen — Tutorial 3.5:* `payload..echo`.

- "The perfect tool when you need the values for a certain key no matter where they appear."
- `payload.echo` → first value; `payload.*echo` → first-level values only.
- `payload..echo` → values at **any depth** (first level, inside sequence, inside try/success).

*Screen:* selector mistakes (a wrong path) return **null**.

| Selector | Use |
|---|---|
| Single value + index | **Most used** combination |
| Range, multi-value | Rare |
| Multi-value, descendants | Arrays / data-intensive projects |

---

## 14. Important Terminology

| Term | Meaning |
|---|---|
| Synchronous | Caller waits for each step's response |
| Asynchronous / fire and forget | Work runs independently; the caller doesn't wait |
| Async scope | Runs its processors in the background on a copy of the event |
| Reliability | No message loss |
| DataWeave Playground | Online editor for practising DataWeave |
| Directives / header | Version, input and output declarations |
| Delimiter (`---`) | Separates header from body |
| MIME type | Data format (json, xml, csv, java…) |
| skipNullOn | Writer property removing nulls (JSON/XML) |
| Selectors | `.`, `[n]`, `[a to b]`, `.*`, `..` |

---

## 15. Interview Questions

### Q1. What does the Async scope do?
Runs its processors independently on a copy of the event, so the flow continues and responds without waiting (fire and forget).

### Q2. Does the async part's payload come back to the parent?
No — the parent continues with its own payload and variables.

### Q3. Give a use case for Async.
Uploading loan documents to an FTP server after approval — respond immediately and upload in the background.

### Q4. What's the structure of a DataWeave script?
A header with directives (`%dw 2.0`, optional `input`, `output`), the `---` delimiter, and the body.

### Q5. What's DataWeave's default MIME type?
Java. Convert only when needed, for performance.

### Q6. Single value vs. multi-value selector?
`.` returns the first matching value; `.*` returns all matching values at that level as an array (even if only one).

### Q7. Multi-value vs. descendants selector?
`.*` only checks the current level; `..` finds the key at any depth.

### Q8. How do you get the last element of an array?
`payload[-1]`.

---

## 16. Must Remember

1. Async = fire and forget; a copy of the event goes into it.
2. Flow Reference goes to the first processor, not the source.
3. Same listener path in two flows → "Already exists a listener matching that path and methods".
4. Async failures need their own handling (queue/logs) — reliability matters.
5. Don't paste sensitive data into the online Playground.
6. Header → `---` → body; `input` is optional.
7. Default MIME type is Java.
8. `skipNullOn="everywhere"` for JSON/XML, not CSV.
9. Indexes from 0; `-1` = last; ranges use `to`.
10. `.` first match, `.*` all at one level, `..` any depth.
