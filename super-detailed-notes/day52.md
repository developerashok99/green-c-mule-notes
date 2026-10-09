# Day 52 — The Object Store: Key-Value Storage, Access Tokens, Watermarking, Transient vs. Persistent

> **Sources:**
> - Cleaned audio transcript ([transcripts-cleaned/day52.txt](../transcripts-cleaned/day52.txt)) and the class video (recorded 22 Jan 2025).
> - Text marked *slide* or *drawing* is read from the recording.
> - Slide images: [slides/day52](../slides/day52/).

## 1. Overview

A short, theory-only session (the demo follows on Day 53):

1. **What is the Object Store** — simple key-value storage
2. Why not just use a database
3. Use case 1 — **storing an access token**; why a variable isn't enough; handling token expiry
4. The **Cache** module uses an object store
5. **Transient vs. persistent** — memory vs. disk
6. Use case 2 — **watermarking** a scheduler-based DB → Salesforce sync
7. Which storage type for which use case

---

## 2. What Is the Object Store?

*Slide:*

- "Object Store is a Mule component that allows for simple **key-value** storage."
- Mainly for **synchronization info** such as **watermarks**, and **temporary data** such as **access tokens**.
- The **Cache** module uses an object store.
- Available as **transient** or **persistent** storage.

**Points from the explanation:**

- The object store is a **generic concept**, not MuleSoft-specific; we learn how to implement it in Mule.
- Example: an employee's whole address (lines 1 to 5) saved as the **value** under one **key**.

### 2.1 Why not the database?

- A database operation is a **costly** operation (an external call).
- It's right for **permanent** information.
- For **temporary** information, a cheaper storage option is better — hence the object store.
- Two typical uses: **watermarks** and **tokens**.

---

## 3. Use Case 1 — Storing an Access Token

*Drawing:* storing an access token in the object store so repeated calls reuse it instead of requesting a new one.

**Without an object store:**

1. Our API must call another API protected by **OAuth / JWT**.
2. For each request: call the **token server**, get the token, keep it in a variable/payload.
3. Pass it to the **HTTP Request** (header) and call the endpoint.
4. Transform the response and reply.

- The token is valid for **1 hour**. With **25 requests** in that hour, we hit the token server **25 times**.

**With an object store:**

| Request | What happens |
|---|---|
| 1st | Retrieve → nothing there → generate the token → **Store** it → call the API |
| 2nd … 25th | Retrieve → token found → call the API directly |

- Token calls in the hour: **1 instead of 25** — 24 avoided, no token-generation load each time.

### 3.1 Why a variable isn't enough

**Q (student): can't we keep the token in a variable?**

- A variable exists only for **that request's instance**.
- When the request finishes, its variables are **killed**.
- The second request can't see the first request's variable — so it would generate a new token.
- The object store is shared across requests for as long as you configure it.

### 3.2 When the token expires

- The endpoint responds **"invalid token"**.
- Wrap the call in a **Try**; in **On Error Continue**, a **Flow Reference** to the sub-flow that generates and stores a new token; then call the endpoint again and continue.
- The student confirmed: the same token sub-flow is reused through the flow reference.

---

## 4. Cache Uses an Object Store

- **Cache** is also temporary storage (caching).
- HTTP Caching (done earlier) is stored, in the background, in an **object store**.

---

## 5. Transient vs. Persistent

| | Transient | Persistent |
|---|---|---|
| Stored in | **Memory** | **Disk** |
| Speed | **Faster** | A bit slower |
| After restart / redeploy / crash | **Lost** | **Kept** |

- The app gets some CPU and memory on its server; memory is fast but cleared when the app restarts (like RAM vs. ROM); disk space isn't cleared.

### 5.1 Which for the access token?

- A student answered "persistent"; the instructor's answer: **transient**.
- If the app restarts at the 10th request, the token is lost — the only cost is **one extra token call**.
- In return, every retrieve is faster (memory).

---

## 6. Use Case 2 — Watermarking

*Drawing:* upsert — if the record exists in SF it's updated, otherwise created; SF → Mule (On New Object / scheduler) → insert into the DB (Oracle).

*Drawing:* scheduler-based sync with a watermark kept in the object store — each run picks up only records after the last saved point.

**Requirement:** a scheduler triggers daily at **8 am**; employees in a database must be inserted into a Salesforce **Employee** object.

- Inserting employee **100** twice → error, because the ID is unique (primary key).
- So: all employees the first time, then **only new** ones.

### 6.1 Worked example

| Day | In DB | Watermark before | Query | Picked up | Watermark after |
|---|---|---|---|---|---|
| 25 Jan | 100–104 | none → **default 99** | `employee ID > 99` | 100–104 (5) | **104** |
| 26 Jan | +105–108 | 104 | `employee ID > 104` | 105–108 (4) | **108** |
| 27 Jan | +109–111 | 108 | `employee ID > 108` | 109–111 | 111 |

- A student suggested a **date** condition; the class used the last **employee ID**.
- The query is **dynamic** — it uses the stored value each run.
- "Where we stop — where we mark — is the watermark."

### 6.2 The flow

```text
Scheduler (8 am daily)
  Object Store Retrieve   (key for the employee ID; default 99 if empty)
  DB Select               select * from employees where employee ID > <watermark>
  Salesforce Create
  Object Store Store      max of the employee IDs
```

*Drawing (Q&A):* employee IDs 101…110 processed in batches; the last processed ID/time is stored and the next run continues from there.

### 6.3 Why persistent here

- If the app restarts at **10 pm** with a **transient** store, the watermark is gone.
- The next run uses the **default 99** → starts from the beginning → **duplicate records** / Salesforce errors.
- Unlike a token, there's no system to "get it again" — you'd have to query Salesforce to find where you stopped.
- So watermarks need **persistent** storage — it survives crashes and restarts.

---

## 7. Summary — Which Storage Type

| Use case | Storage | Why |
|---|---|---|
| Access token | **Transient** | Faster; losing it costs only one token call |
| Watermark | **Persistent** | Losing it means reprocessing everything and duplicates |

---

## 8. Important Terminology

| Term | Meaning |
|---|---|
| Object Store | Mule key-value storage component |
| Key / value | The name under which a value is stored / the stored data |
| Access token | Short-lived credential (e.g. 1 hour) for an OAuth/JWT-protected API |
| Token server | Server that issues tokens |
| Watermark | The last processed point (ID or time) for incremental syncs |
| Transient | In-memory store; fast; lost on restart |
| Persistent | Disk-backed store; slower; survives restarts |
| Cache module | Caching component that uses an object store internally |
| Upsert | Update if the record exists, otherwise create |

---

## 9. Interview Questions

### Q1. What is the Object Store used for?
Simple key-value storage of temporary or synchronization data — typically access tokens and watermarks — without the cost of a database call.

### Q2. Why not store the token in a variable?
Variables live only for one request; the next request can't see them. The object store is shared across requests.

### Q3. Transient or persistent for an access token? For a watermark?
Token: transient — faster, and losing it only costs one more token call. Watermark: persistent — losing it after a restart would reprocess everything and create duplicates.

### Q4. What is watermarking?
Remembering where the last run stopped (e.g. max employee ID) so the next scheduled run selects only newer records: `where id > :watermark`, then store the new max.

### Q5. How do you handle an expired token?
Wrap the call in Try; on the "invalid token" error, On Error Continue calls (via Flow Reference) the token sub-flow to regenerate and store it, then retries.

### Q6. What does the Cache module have to do with the Object Store?
Cache stores its data in an object store in the background.

---

## 10. Must Remember

1. Object Store = **key-value** storage; generic concept.
2. Database calls are costly — use the object store for temporary data.
3. Two main uses: **access tokens** and **watermarks**.
4. Variables die with the request; the object store is shared.
5. One token per hour instead of one per request.
6. **Transient** = memory, fast, lost on restart; **persistent** = disk, slower, kept.
7. Token → transient; watermark → **persistent**.
8. Watermark: Retrieve (default) → Select `> watermark` → Create → Store **max**.
9. Cache and HTTP caching use an object store underneath.
