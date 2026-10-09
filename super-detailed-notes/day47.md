# Day 47 — Salesforce Connector Part 2: Create, Per-Record Results, Upsert, On New / On Modified Object and the Scheduler (Hands-On)

> **Sources:**
> - Cleaned audio transcript ([transcripts-cleaned/day47.txt](../transcripts-cleaned/day47.txt)) and the class video (recorded 16 Jan 2025).
> - Text marked *screen* or *drawing* is read from the recording.
> - Slide images: [slides/day47](../slides/day47/).

## 1. Overview

1. Course status — what's done and pending
2. Recap — Query and SOQL
3. The **Create** operation — mapping sheet, Type, Records
4. Transforming to the Salesforce format — **Java** vs JSON, `as Number`
5. The **200-record limit** — batches, For Each, bulk jobs
6. Testing Create — reading `successful` and `items`
7. Errors — misleading CONNECTIVITY, **INVALID_TYPE_ON_FIELD_IN_RECORD**, partial success
8. **Upsert**, Update, Delete
9. Source operations — **On New Object** and **On Modified Object**
10. Use case — Salesforce → database sync; scheduler alternative
11. Reconnection **forever** on a source
12. **Fixed frequency**, start delay and **cron** expressions; time zones
13. The **Scheduler** component; integration vs. API

---

## 2. Course Status

*Screen — module list:* File/FTP/SFTP, Object Store, Routing, JMS, Transformation, Scopes, Salesforce, CI/CD, AWS S3, HTTPS.

| Done | Pending |
|---|---|
| SOAP, Scatter-Gather, Async scope | Object Store |
| DWL concepts | DWL: CSV and XML handling, **flatten** and **flatMap** |
| Salesforce (finishing today: Create, Query, On New Object) | For Each, Parallel For Each |
| — | Deployment (CI/CD), AWS S3 |

---

## 3. Recap

- Insert, retrieve or delete in Salesforce objects uses **SOQL** (like SQL with small differences).
- Query output is **Java** — an array of objects; we converted it.

---

## 4. The Create Operation

*Screen — flow* `salesforce-account-demo`: Listener → Logger → Transform Message → Salesforce **Create** → Transform Message → Logger.

### 4.1 Mapping sheet

- The Salesforce team shares the object's fields in an **Excel/Word table** — mandatory and optional.
- We must send all **mandatory** fields, mapped as per the **mapping sheet**.
- If our source lacks a mandatory field, raise it while discussing the use case end-to-end; enrich it if possible.

### 4.2 Configuration

*Screen:* connector config `Salesforce_Config`, **Type: Account**, **Records: `payload`**.

- **Type** = the object; a drop-down appears after refresh — if not, type the object's **API name**.

### 4.3 The Transform before Create

*Screen:*

```dataweave
%dw 2.0
output application/java
---
payload map ((item, index) -> {
  Name: item.name,
  AccountNumber: item.accountNumber,
  AnnualRevenue: item.annualRevenue as Number
})
```

- Left side = Salesforce **field names** (`Name`, `AnnualRevenue` — capitals); right side = our input.
- **map** because the input is an **array** of accounts.
- `annualRevenue` arrives as a **string**; Salesforce expects a **number** → `as Number`. Resolve type conflicts before sending.
- AccountNumber was later removed (it didn't work in the Day 46 query).

**Java vs JSON:**

- Many say only Java works.
- **Instructor's experience:** without dates, both work; with **dates**, JSON sends strings while Java has a date type → conflicts in insert/upsert.
- **Good practice:** always send **Java** for inserts.

**Why a separate Transform** (instead of writing DataWeave inside Records)?

- You can **log** exactly what you're sending; otherwise you'd copy the script into a logger too.
- Not mandatory, but common in real projects.

---

## 5. The 200-Record Limit

- Salesforce Create accepts up to **200 records** per call — 500 won't go.

| Option | How |
|---|---|
| Ask the source | Don't send more than 200 per request (easiest, if they agree) |
| Batches | Split and insert several times — e.g. **For Each** with a batch size (500 → 150 + 150 + 150 + 50) |
| **Bulk operations** | **Create Job** — submits a job and returns a **job ID**; check the job status with it |

- A very common issue — know when to use which.

---

## 6. Testing Create

1. Studio error on deploy ("SfdcCreate" duplicate) → clean the project.
2. *Screen:* Postman **`POST http://localhost:8081/create`** with an array of three accounts (name, accountNumber, annualRevenue).
3. *Screen — debugger:* the transformed Java payload — **ArrayList** 0, 1, 2; `as Number` evaluates to Number.
4. Create inserts and responds in **Java**.

*Screen — response (as JSON):*

```json
{
  "items": [
    { "id": "…", "success": true, "statusCode": …, "successful": true },
    { … },
    { … }
  ],
  "successful": true
}
```

| Expression | Meaning |
|---|---|
| `payload.successful` | **true** only if **all** records succeeded |
| `payload.items.successful` | Per-record results — *screen:* `[true, true, true]` |
| `payload.items[0].successful` | First record's result |

- One record to create → send an **array of one object**.
- Branch on these with a Choice if needed.
- *Screen:* Salesforce **All Accounts** — **ABC / DEF / XYZ Company** created; *screen:* XYZ Company record.
- Show Annual Revenue via **Select fields to display**; the Salesforce team verifies the data.

**Numbers as strings:** sent GHI / HIJ / IJK Company with revenue as strings, unconverted → all inserted — Salesforce converted them. Some fields won't accept that, so **convert anyway**.

---

## 7. Errors

### 7.1 Misleading CONNECTIVITY error

- Annual Revenue is **Currency(18)** (Object Manager); sent a value over the limit (X / Y / Z company).
- *Screen:* **"Failed to send request to https://site-customization-…my.salesforce.com"** — **SALESFORCE:CONNECTIVITY**, no detail.
- *Screen:* **Test Connection** succeeds — so it isn't really connectivity.

**How to debug:**

1. Connectivity error → check connectivity (Test Connection).
2. If it connects, the issue is something else (e.g. the amount).
3. The Salesforce developer checks the **logs** for the integration user and tells you what's wrong.

- Expected behaviour would have been: other records succeed, that one fails.

### 7.2 Invalid type — partial success

- *Screen:* **INVALID_TYPE_ON_FIELD_IN_RECORD** — *"Annual Revenue: invalid number: abcde"*; `successful: false`.
- *Screen:* `payload.items.successful` — one **false**, others **true**.
- Overall executed, not all succeeded — identify which record failed from `items`.
- Reconnection strategies and connection pooling apply here too.

---

## 8. Upsert, Update, Delete

*Drawing:* **upsert** — if the record is available in SF it updates; if not, it creates.

| Operation | Does |
|---|---|
| **Upsert** | Update + insert — updates existing fields or creates a new record |
| **Update** | Update only |
| **Delete** | Delete |

- Configured the same way as Create — try them.

---

## 9. Source Operations

- **On New Object** and **On Modified Object** go in the flow's **source**, like a Listener.

*Screen — On New Object:* Object type **Account**; scheduling strategy **Fixed Frequency** (frequency, start delay, time unit).

- Periodically checks the object; picks up changes and processes them automatically.

| Source | Fires on |
|---|---|
| **On New Object** | A **new** record in the object |
| **On Modified Object** | An **updated** existing record |

- An update is **not** picked by On New Object.

---

## 10. Use Case — Salesforce → Database

*Drawing:* SF → Mule (On New Object) → insert into the DB (Oracle) — XYZ company sync.

1. A Salesforce user creates an account (e.g. XYZ company) in the UI.
2. On New Object (frequency **1000 ms**) checks every second and brings it into Mule.
3. Transform — DB field names differ a bit.
4. Insert into the database.

### 10.1 Scheduler alternative

*Drawing:* Scheduler-based sync — SF → Mule → DB on a schedule (upsert).

1. **Scheduler** source every 1 or 5 minutes (first run on deploy).
2. Salesforce **Query** for accounts → transform → DB insert.
3. Remember where you stopped (a sequence number in an **Object Store**); next run, query only newer accounts.

- On New Object = scheduler + select done automatically — less work.

---

## 11. Reconnection Forever on a Source

- Reconnection options: **none, standard, forever** — standard is used regularly.
- On a **source** like On New Object, use **forever** (Advanced → Reconnection strategy) — it keeps trying until it connects; nothing else waits.
- On **Create** (inside a request), forever would block sending the response.

---

## 12. Fixed Frequency, Start Delay and Cron

### 12.1 Fixed frequency

- Default: **1000 ms**, start delay 0.
- Every 5 hours: frequency 5, unit hours — deployed at 10:00 → runs 10:00, 15:00, 20:00, 01:00.
- **Start delay** 1 hour → first run at 11:00, then 16:00, 21:00, 02:00. Rarely used.

### 12.2 Cron

- Fixed frequency can't say "**every day at 8 PM IST**" — use **cron**.
- *Screen — docs:* Scheduler Endpoint (Trigger) — fixed frequency or cron; runs single-node in a cluster.
- Use online **cron expression generators**; paste it here or into a property file.

*Screen — docs:* Cron Expressions — positions: **seconds, minutes, hours, day of month, month, day of week, year**.

| Expression (from docs) | Meaning |
|---|---|
| `0/15 * * * * ?` | Every 15 seconds |
| Run every 2 seconds of the day | — |
| `0 15 10 ? * *` | 10:15 AM every day |
| `0 15 10 * * ? 2019` | 10:15 AM every day in 2019 only |
| `0 0 20 * * ?` | 8 PM every day (class example: 0 s, 0 min, 20 h) |

- "There is no default cron expression."
- **Instructor's experience:** he doesn't remember the syntax — 5–10 minutes of research.

### 12.3 Time zone

- Deployed in a **US region**, CloudHub uses the US time zone unless you set one.
- *Screen — docs:* Change a Time Zone (`>>`) and **Time Zone IDs** — India = **`Asia/Kolkata`**.

---

## 13. Testing the Sources

**On New Object:**

1. The flow polls every second; with no new records, nothing comes; it doesn't send a response anywhere — it just ends and starts again.
2. *Screen:* new account **A Company** (Hyderabad address) → *"Account 'A Company' was created"*.
3. *Screen — payload:* the full new record in **Java** — **55 fields** (BillingCity Hyderabad, BillingPostalCode 500008, Website, CreatedDate…).
4. Created D, E and F Company — records came **one at a time, each as a single object** (not an array).

**Exercise:** create an account table in the DB, take 4–5 fields and insert them — since it's an object, shape it (e.g. with mapObject). That's a small Salesforce → DB project.

**On Modified Object:**

- Edited A Company's website to `acompany.com` → On New Object didn't fire.
- *Screen:* "Your changes are saved" → the **On Modified Object** flow received the record with all fields.
- *Screen:* the On Modified Object source.

---

## 14. The Scheduler Component

**Q: Run something every day at 10 or every 5 hours, without Salesforce?**

- Use the **Scheduler** source (*screen:* scheduling strategy fixed frequency / cron).
- Example: every day at 10, copy data from DB 1 to DB 2:
  1. Scheduler (**cron**, time zone set).
  2. Database select (DB 1).
  3. Transform Message.
  4. Database insert (DB 2).
  5. Logger.
- A regular pattern.

### 14.1 Integration vs. API

- The Salesforce → DB flow and the DB 1 → DB 2 flow are **integrations**, not APIs — nothing is exposed to a consumer and no response is returned.
- An **API** is exposed to a consumer who sends a request and gets a response — REST or SOAP; in MuleSoft (and modern ecosystems) REST 95–99% of the time.
- An API is also an integration — it integrates systems — but not every integration is an API.

---

## 15. Important Terminology

| Term | Meaning |
|---|---|
| Create | Inserts records into a Salesforce object |
| Mapping sheet | Field-by-field source → target mapping with mandatory/optional |
| Type (Create) | The target object's API name |
| 200-record limit | Max records per Create call |
| Create Job (bulk) | Asynchronous bulk insert with a job ID |
| `successful` / `items` | Overall and per-record result of Create |
| INVALID_TYPE_ON_FIELD_IN_RECORD | Wrong data type for a field |
| Upsert | Update if exists, else insert |
| On New Object / On Modified Object | Sources polling for new / updated records |
| Fixed frequency | Run every N time units |
| Start delay | Wait before the first run |
| Cron expression | Run at specific times (sec min hour dom month dow year) |
| Scheduler | Core source triggering a flow on a schedule |

---

## 16. Interview Questions

### Q1. How do you insert records into Salesforce from Mule?
Map the source to the object's field names (per the mapping sheet) in a Transform with `output application/java`, then use Create with the object as Type and the payload as Records.

### Q2. Why Java rather than JSON for Create?
Dates: JSON carries them as strings, Java as date types, so JSON can cause type conflicts. Without dates both work, but Java is the safe practice.

### Q3. How many records can one Create call take?
200. For more, split into batches (e.g. For Each with a batch size), ask the source to limit, or use bulk Create Job.

### Q4. How do you know which records failed?
`payload.successful` is true only if all succeeded; `payload.items[n].successful` gives each record's result.

### Q5. Create vs. Upsert?
Create always inserts; Upsert updates an existing record or inserts if it doesn't exist.

### Q6. On New Object vs. On Modified Object?
Both are polling sources; On New Object fires for new records, On Modified Object for updated ones.

### Q7. Fixed frequency vs. cron?
Fixed frequency runs every N units (with optional start delay); cron runs at specific times, e.g. every day at 8 PM in a given time zone.

### Q8. Which reconnection strategy suits a Salesforce source?
Forever — a source can keep retrying without blocking a response.

### Q9. Is a scheduler-based DB-to-DB flow an API?
No — it's an integration; an API is exposed to consumers and returns responses.

---

## 17. Must Remember

1. Get the mapping sheet; send all mandatory fields.
2. Transform to **Java** before Create; convert types (`as Number`).
3. Max **200** records per Create — batch, limit the source, or use bulk jobs.
4. `payload.successful` (all) vs. `payload.items[n].successful` (each).
5. A CONNECTIVITY error with a passing Test Connection = a data problem — ask the Salesforce team to check logs.
6. Upsert = update or insert.
7. On New Object (new) / On Modified Object (updated) are sources; records arrive one object at a time.
8. Use reconnection **forever** on sources.
9. Cron for fixed times; set the time zone (`Asia/Kolkata`) — CloudHub otherwise uses its region's zone.
10. Integration ≠ API: an API responds to a consumer.
