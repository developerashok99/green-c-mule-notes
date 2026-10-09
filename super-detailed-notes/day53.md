# Day 53 — Watermarking with the Object Store: Retrieve, Select Newer Rows, Store the New Max

> **Sources:**
> - Cleaned audio transcript ([transcripts-cleaned/day53.txt](../transcripts-cleaned/day53.txt)) and the class video (recorded 23 Jan 2025).
> - Text marked *screen* is read from the recording.
> - Slide images: [slides/day53](../slides/day53/).

## 1. Overview

1. Remaining modules for next week
2. The use case — DB employees → Salesforce, picking up only **new** records
3. Object Store **operations** — Store and Retrieve (and the others)
4. **Retrieve** with a **default value** and a target variable
5. **Object Store configuration** — Persistent, Max entries, **Entry TTL**, **Expiration interval**
6. The **Select** using the watermark — `emp_id > :emp_id`
7. **Store** the new max — `max(payload.emp_id)`
8. Running it — persistence across redeploys, 17 records, watermark 1009
9. The **null error** when no new rows come, and the **Choice** fix
10. Homework — the access-token use case with a transient store

---

## 2. Remaining Modules

*Screen (Notepad++):* Object Store and watermarking, JMS, transformation (pending: custom function, flatten, flatMap), CI/CD, AWS S3, HTTPS, CloudHub 1.0 vs 2.0.

Five topics for next week:

1. The rest of **DataWeave** (custom function, flatten, flatMap) — "hardly 15–20 minutes"
2. **CI/CD** pipeline deployment
3. **AWS S3** connector
4. **One-way TLS and two-way TLS**
5. **CloudHub 1.0 vs 2.0**

Planned over three sessions (Friday, Saturday, Sunday).

---

## 3. The Use Case

- Employee records are in the **database**; they must be created in **Salesforce**.
- Run on a schedule; each run should send only the employees **added since the last run**.
- The last processed employee ID — the **watermark** — is kept in the **Object Store**.

*Screen:* `object-store-demo` flow:

```text
Scheduler  (fixed frequency, every 5 minutes)
  Retrieve           key empWatermark → target variable
  Logger
  Database Select    emp_id > watermark
  Logger
  Transform Message
  Store              key empWatermark = max(payload.emp_id)
  Logger
```

- In a real flow, add a **Salesforce Create** where the records are sent — "you don't have to do anything more than that".
- The class runs every **5 minutes** instead of every day, to make it easier.

---

## 4. Object Store Operations

- Not in the palette by default — **Add Modules → Object Store**.

| Operation | What it does |
|---|---|
| **Store** | Saves a **value** under a **key** |
| **Retrieve** | Gets the value for a key |
| Retrieve All | Gets all key–values |
| Retrieve All Keys | Gets all keys |
| Contains | Checks if a key exists |
| Remove | Removes a key |
| Clear | Clears the store |

- For the watermark use case only **Store** and **Retrieve** are needed.
- **Store:** after creating the employees in Salesforce, store the employee ID under a key.
- **Retrieve:** give the key name and the object store returns its value.

---

## 5. Retrieve — Key, Default Value, Target Variable

*Screen:* Retrieve operation — key and a **default value** for the very first run (no watermark stored yet).

| Field | Value |
|---|---|
| Key | `empWatermark` (employee watermark) |
| **Default value** | `99` — used when nothing is stored yet |
| Object store | `Object_store` |
| Advanced → **Target variable** | `empWatermark` — same as the key name, easier to remember |

---

## 6. Object Store Configuration

*Screen:* Object Store config — name **Object_store**, **Persistent**, Max entries, Entry TTL (HOURS), Expiration interval.

*Screen:* Global Configuration Elements — Database Config and Object_store.

| Setting | Meaning |
|---|---|
| **Persistent** | **Default: checked (persistent)**. Uncheck → **transient**. Watermarking needs persistent |
| **Max entries** | Limit on how many entries the store can hold (e.g. 10, 100, 500) — irrelevant here, we store just one |
| **Entry TTL** (+ unit) | **Time to live** — how long a value is valid; seconds, minutes, hours or days |
| **Expiration interval** (+ unit) | How often a background check runs to **delete** expired entries |

### 6.1 TTL vs. expiration interval

- Example: watermark **100** stored at **10:00** with TTL **1 hour** → it **expires at 11:00**.
- Expiring does **not** remove it — the **expiration interval** does: every 30 minutes, like a scheduler, it deletes expired entries.

**Keep the expiration interval less than the TTL:**

| TTL | Interval | Result |
|---|---|---|
| 1 hour | 30 minutes | Expired values removed within 30 minutes |
| 1 hour | **2 hours** | Created 10:00, expires 11:00, next check 12:00 → stays an extra hour |

- With five keys created at 10:00, 10:15, 10:30, 10:45 and 11:00, each expires at a different time — the interval decides when each is cleaned up.

### 6.2 What the class used

- Left the expiry settings at defaults — a watermark must **not** expire.
- **Instructor:** "By default — I don't remember exactly — the object store keeps values for around **30 days**."
- For a **token** that expires in 1–2 hours, you'd set TTL accordingly.

---

## 7. Select Using the Watermark

*Screen:*

```sql
select * from EMPLOYEES_INFO where emp_id > :emp_id
```

- Input parameter: `emp_id` = **`vars.empWatermark`**.
- Only records **newer** than the stored watermark come back.

---

## 8. Store the New Max

- After the records are created in Salesforce, store the **highest** employee ID:

```dataweave
max(payload.emp_id)
```

- Same key `empWatermark` → the new value **overwrites** the old (e.g. 99 → 106).
- Next run: `> 106` → nothing new, or 107–110 → create them, store **110**.

> **Instructor's rule:** the watermark column must be **sequential and incremental** — e.g. an auto-incremented ID. If not the employee ID, use another incremental number such as a serial number. Gaps are fine; it continues.

---

## 9. Running the Demo

*Screen:* MySQL Workbench — local instance; `use muledb`; EMPLOYEES_INFO rows (IDs 100 … 120, then 1000–1009).

- `select count(*)` → **38** records. Expected 38 on a first run with default 99.
- Debugged with a breakpoint.

**What actually happened:**

1. The retrieved watermark was **120**, not 99 — stored by an **earlier run**.
2. Because the store is **persistent**, the value survived stopping and redeploying the app.
3. The Select returned **17 records** (38 − 21 records from 100 to 120).
4. *Screen:* debugger — the list of records (emp_salary, emp_status, emp_name, emp_designation, emp_id); output 1006 … 1009.
5. Highest ID **1009** → stored.
6. While debugging, 5 minutes passed and the scheduler fired again — Retrieve now showed **1009**.

---

## 10. The Null Error and the Choice Fix

*Screen:* error

```text
You called the function 'max' with these arguments:
  1: Null (null)
But it expects arguments of these types:
  1: Array
```

- On the second run nothing was greater than 1009 → empty payload → `payload.emp_id` is **null** → `max(null)` fails.

*Screen:* Fix — a **Choice**:

```text
Choice
  when  #[sizeOf(payload) > 0]
      (Salesforce Create)
      Store  empWatermark = max(payload.emp_id)
  default
      Logger  "no data"
```

- Records returned → create them and store the new watermark.
- None → go to default and log "no data".
- Checking the logs every 5 minutes, you'll see either path.

**sizeOf vs. isEmpty** (refer back to the earlier session):

- `sizeOf` loads the whole payload and returns its size.
- `isEmpty` is **better** just to check whether the payload is empty.

---

## 11. Homework — Access Token Use Case

- Implement the **access-token** use case explained in the previous session.
- Use a **transient** store — uncheck **Persistent**.
- Then stopping and redeploying gives a fresh value.

---

## 12. Important Terminology

| Term | Meaning |
|---|---|
| Watermark | The last processed value (e.g. max emp_id) used to fetch only newer records |
| Object Store | Mule key–value store |
| Store / Retrieve | Save a value under a key / read it back |
| Default value | Returned by Retrieve when the key doesn't exist yet |
| Persistent | Values survive restarts/redeploys (default) |
| Transient | Values are lost on restart |
| Max entries | Limit on the number of entries |
| Entry TTL | Time to live — when an entry expires |
| Expiration interval | How often expired entries are deleted |
| Incremental column | A column whose value grows with each new record |

---

## 13. Interview Questions

### Q1. How do you implement watermarking in Mule?
Scheduler → Object Store **Retrieve** (with a default value) → DB Select `where id > :lastId` → process → **Store** `max(payload.id)` under the same key. Use a persistent store.

### Q2. Entry TTL vs. expiration interval?
TTL is how long a value is valid; the expiration interval is how often expired entries are actually deleted. Keep the interval shorter than the TTL.

### Q3. Persistent vs. transient object store?
Persistent (default) keeps values across restarts and redeploys — needed for watermarks. Transient loses them — fine for things like a short-lived access token.

### Q4. What breaks when there are no new records?
`max(payload.emp_id)` gets null and fails ("expects Array"). Guard it with a Choice — `sizeOf(payload) > 0` (or `isEmpty`).

### Q5. What column makes a good watermark?
A sequential, incremental one — an auto-increment ID or serial number.

### Q6. Why did the first run use 120 instead of the default 99?
A value from an earlier run was already stored, and the persistent store kept it across the redeploy.

---

## 14. Must Remember

1. Object Store comes from **Add Modules**.
2. Watermark = **Retrieve → Select newer → process → Store max**.
3. Retrieve's **default value** handles the very first run.
4. Store under the **same key** to overwrite the watermark.
5. **Persistent is the default**; watermarks need it.
6. **TTL** = validity; **expiration interval** = cleanup frequency; interval < TTL.
7. Default retention is "around 30 days" (instructor not sure).
8. The watermark column must be **incremental**.
9. Guard `max()` with a **Choice** — empty payload means null.
10. `isEmpty` is better than `sizeOf` for an emptiness check.
