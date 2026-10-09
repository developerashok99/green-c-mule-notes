# Day 53 — Detailed Notes: Watermarking with the Object Store

> **Watch alongside:**
> - A short, single-demo session: the Object Store remembers the last employee ID so each scheduled run picks up only new rows.
> - Watch for the two surprises — the first run used **120**, not the default 99, because the store is persistent; and the second run failed with `max(null)` until a Choice was added.

> **Video-verified:** written from the cleaned transcript and the class recording (23 Jan 2025). Slide images: [slides/day53](../slides/day53/) — e.g. [watermark flow](../slides/day53/02-watermark-flow.jpg), [Object Store config](../slides/day53/03-object-store-config.jpg), [watermark select](../slides/day53/05-select-watermark.jpg), [max null error](../slides/day53/11-max-null-error.jpg), [Choice fix](../slides/day53/12-choice-not-empty.jpg).

---

## 1. The Watermark Flow

```mermaid
flowchart TB
    Sch["Scheduler — every 5 min"] --> R["Retrieve key empWatermark<br/>default 99 → vars.empWatermark"]
    R --> S["Select * from EMPLOYEES_INFO<br/>where emp_id > :emp_id"]
    S --> Ch{"sizeOf(payload) > 0 ?"}
    Ch -->|"yes"| SF["(Salesforce Create)"] --> St["Store empWatermark =<br/>max(payload.emp_id)"]
    Ch -->|"no"| L["Logger: no data"]
```

- Use case: DB employees → Salesforce, only new ones each run.
- Object Store comes from **Add Modules**; only **Store** and **Retrieve** are needed (others: Clear, Contains, Remove, Retrieve All, Retrieve All Keys).

---

## 2. Object Store Configuration

| Setting | Meaning |
|---|---|
| Persistent | Default **on**; off = transient. Watermarks need persistent |
| Max entries | Cap on the number of entries |
| Entry TTL | How long a value is valid |
| Expiration interval | How often expired values are deleted |

```mermaid
sequenceDiagram
    participant OS as Object Store
    participant Ex as Expiration check (every 30 min)
    Note over OS: 10:00 store watermark=100, TTL 1 h
    Note over OS: 11:00 value expires (still present)
    Ex->>OS: 11:00/11:30 check → delete expired entry
    Note over OS,Ex: Interval 2 h instead → removed only at 12:00
```

- Keep the **interval shorter than the TTL**.
- Watermark: leave expiry at defaults (instructor: "around 30 days", not sure). Tokens: TTL of 1–2 hours.

---

## 3. The Run

```mermaid
flowchart LR
    DB["EMPLOYEES_INFO<br/>38 rows: 100–120, 1000–1009"] --> R1["Run 1: watermark = 120<br/>(persisted from an earlier run)"]
    R1 --> Rec["17 rows returned<br/>max = 1009 → stored"]
    Rec --> R2["Run 2 (5 min later): watermark 1009"]
    R2 --> E["No rows → max(null) error"]
```

- Persistence survived the redeploy — that's why 120 came, not 99.
- The watermark column must be **sequential and incremental** (gaps are fine).

---

## 4. The Null Error

*Screen:* "You called the function 'max' with these arguments: 1: Null (null) — but it expects … Array".

- Empty payload → `payload.emp_id` is null.
- Fix: **Choice** `#[sizeOf(payload) > 0]` → Store; default → log "no data".
- `isEmpty(payload)` is the better emptiness check — `sizeOf` loads the whole payload.

**Homework:** build the access-token use case with a **transient** store (uncheck Persistent).

---

## Quick Recap
- Watermarking = **Retrieve** (with default) → Select `> watermark` → process → **Store** `max(id)` under the same key.
- Object Store is **persistent by default** — the value survives redeploys.
- **Entry TTL** = validity; **expiration interval** = cleanup; keep interval < TTL.
- Use an **incremental** column for the watermark.
- Guard `max()` with a **Choice** on payload size — empty payload → null error.
- Next week: DataWeave leftovers, CI/CD, AWS S3, one-way/two-way TLS, CloudHub 1.0 vs 2.0.
