# Day 47 — Detailed Notes: Salesforce Create, Upsert, On New / On Modified Object and the Scheduler

> **Watch alongside:**
> - Create is easy once the Transform outputs **Java** with Salesforce field names. The useful parts are the **200-record limit** and reading `payload.successful` vs `payload.items[n].successful` for partial failures.
> - The second half moves to **source** operations — On New Object / On Modified Object — and the Scheduler with fixed frequency and cron, ending with the difference between an integration and an API.

> **Video-verified:** written from the cleaned transcript and the class recording (16 Jan 2025). Slide images: [slides/day47](../slides/day47/).

---

## 1. Creating Accounts

![Create transform](../slides/day47/05-create-transform.jpg)

```mermaid
flowchart LR
    PM["POST /create<br/>array of accounts (JSON)"] --> T["Transform → Java<br/>map: Name, AnnualRevenue as Number"]
    T --> C["Salesforce Create<br/>Type: Account · Records: payload"]
    C --> R["Result (Java)<br/>successful + items[]"]
    R --> J["Transform → JSON"]
```

- Use the Salesforce team's **mapping sheet** (mandatory/optional fields).
- **Java** output avoids date-type conflicts; convert strings to numbers with `as Number`.
- Keep the mapping in a separate Transform so you can log what you send.

**200-record limit:**

| Option | Notes |
|---|---|
| Source sends ≤ 200 | Easiest |
| Batches | For Each with a batch size |
| Bulk Create Job | Returns a job ID; check status later |

---

## 2. Reading the Result

![Partial success](../slides/day47/15-dw-successful-false.jpg)

| Expression | Value |
|---|---|
| `payload.successful` | true only if every record succeeded |
| `payload.items.successful` | e.g. [true, false, true] |
| `payload.items[0].successful` | first record |

- "abcde" for Annual Revenue → **INVALID_TYPE_ON_FIELD_IN_RECORD** on that record only.
- An over-limit Currency value gave a misleading **SALESFORCE:CONNECTIVITY** — Test Connection passed, so it's data; ask the Salesforce team to check their logs.
- **Upsert** = update if the record exists, else create; Update and Delete also exist.

---

## 3. Polling Sources

![On New Object](../slides/day47/18-on-new-object.jpg)

```mermaid
flowchart LR
    U["Salesforce user creates / edits an Account"] --> SF["Account object"]
    SF -->|"new record"| N["On New Object<br/>(every 1000 ms)"]
    SF -->|"updated record"| M["On Modified Object"]
    N --> T["Transform (one object per record)"]
    M --> T
    T --> DB["Database insert / update"]
```

- Records arrive **one object at a time** (55 fields for A Company).
- Use reconnection **forever** on sources (not on Create).
- Alternative: **Scheduler** + Query + remember the last sequence number in an Object Store.

---

## 4. Scheduling

![Cron expressions docs](../slides/day47/20-cron-expressions.jpg)

| Strategy | Example |
|---|---|
| Fixed frequency | Every 5 hours — 10:00, 15:00, 20:00…; start delay 1 h → 11:00, 16:00… |
| Cron | `0 0 20 * * ?` = every day 8 PM; `0/15 * * * * ?` = every 15 s |

- Cron positions: seconds, minutes, hours, day of month, month, day of week, year.
- Set the time zone (`Asia/Kolkata`) — CloudHub uses its region's zone otherwise.
- Use an online cron generator.

```mermaid
flowchart LR
    S["Scheduler (cron, daily 10:00)"] --> D1["DB 1 select"]
    D1 --> T["Transform"]
    T --> D2["DB 2 insert"]
    D2 --> L["Logger (no response — an integration, not an API)"]
```

---

## Quick Recap
- Create needs Salesforce field names, Java output and correct types; max 200 records per call.
- `payload.successful` covers all records; `items[n].successful` shows each.
- Upsert updates or inserts.
- On New Object / On Modified Object poll an object and deliver one record at a time.
- Scheduler: fixed frequency (with start delay) or cron with a time zone.
- A scheduled DB-to-DB or Salesforce-to-DB flow is an integration; an API responds to a consumer.
