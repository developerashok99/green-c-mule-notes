# Day 50 — Detailed Notes: Batch Processing — Phases, Components, Properties and On Complete

> **Watch alongside:**
> - The agenda lists the Async scope, but the class covered sync vs. async only in drawings and spent the session on batch processing.
> - The demo is tiny (eight values, two of them letters) on purpose — watch the records come out of order, the letters fail, the aggregator group the successes in fours, and On Complete report the counts.

> **Video-verified:** written from the cleaned transcript and the class recording (20 Jan 2025). Slide images: [slides/day50](../slides/day50/) — e.g. [restart drawing](../slides/day50/04-drawing-restart.jpg), [batch job diagram](../slides/day50/06-batch-job-diagram.jpg), [job properties](../slides/day50/09-batch-job-props.jpg), [step filters](../slides/day50/10-batch-step-filters.jpg), [On Complete payload](../slides/day50/17-on-complete-payload.jpg), [use case](../slides/day50/21-drawing-friday-job.jpg).

---

## 1. Why Batch

```mermaid
flowchart TB
    In["100 records"] --> FE["For Each — fails at 50th, app restarts"]
    In --> PFE["Parallel For Each — fails at 30th, app restarts"]
    In --> BJ["Batch Job — fails at 50th, app restarts"]
    FE --> Lost["Remaining records lost"]
    PFE --> Lost
    BJ --> Resume["Resumes from 50th/51st<br/>(persistent queue) = reliability"]
```

| | For Each | Parallel For Each | Batch |
|---|---|---|---|
| Threads | 1 | Many | Many |
| Mode | Sync | Sync | **Async** |
| Output | None | Aggregated responses | **Summary only** |

- Use batch when data is **larger than memory** or **reliability** matters.

---

## 2. The Three Phases

```mermaid
flowchart LR
    Inp["Input<br/>(Java / JSON / XML)"] --> LD["1. Load and Dispatch<br/>(invisible) → persistent queue on disk"]
    LD --> PR["2. Process Records<br/>Batch Step 1 … n"]
    PR --> OC["3. On Complete<br/>BatchJobResult summary"]
```

- In-memory queues are wiped on restart; **persistent** ones (disk) aren't.

---

## 3. Threads, Blocks and Steps

```mermaid
flowchart TB
    Q["Persistent queue — 1000 records"] --> T1["Thread 1 — block of 100"]
    Q --> T2["Thread 2 — block of 100"]
    Q --> T3["Thread … (max concurrency)"]
    T1 --> S1["Step 1 (NO_FAILURES)"]
    S1 -->|"successes"| Ag["Batch Aggregator (size 4)"]
    S1 -->|"failures"| S2["Step 2 (ONLY_FAILURES)<br/>e.g. insert into failure table"]
```

| Setting | Default / meaning |
|---|---|
| Max Failed Records | **-1** = never stop; 0 = stop at first failure |
| Batch Block Size | **100** — leave unless performance-tested |
| Max Concurrency | Parallel threads |
| Job Instance Id | Auto; custom via `#[ ]` |
| Accept Expression | Filter, e.g. accept only numbers (`isNumber`) |
| Accept Policy | **NO_FAILURES** (default), ONLY_FAILURES, ALL |
| Aggregator size | Groups successes; failures never reach it |

---

## 4. The Demo

```mermaid
sequenceDiagram
    participant Sch as Scheduler (fixed frequency)
    participant BJ as Batch Job
    participant S1 as Batch_Step (× 20)
    participant Ag as Aggregator (4)
    participant S2 as Batch_Step1
    participant OC as On Complete
    Sch->>BJ: [1,2,3,4,5,"a","b",6]
    Note over BJ: 8 records loaded · main flow gets instance info (executing)
    BJ->>S1: records, out of order (3 threads)
    S1--xS1: "a" * 20 fails
    S1->>Ag: successes in groups, e.g. [20, 40, 80, 100]
    S1->>S2: a, b (failed / non-numeric)
    BJ->>OC: BatchJobResult (loaded, processed, successful, failed, elapsed)
```

- *Screen:* "Total Records processed: 8. Successful records: 7. Failed Records: 1"; in the run discussed aloud, 6 succeeded and 2 failed.
- The main flow's payload isn't overwritten — it's asynchronous.

---

## 5. Use Case — Friday 10 PM Customer File

```mermaid
flowchart LR
    Cron["Scheduler — cron, Friday 10 PM"] --> FTP["FTP Read CSV<br/>~5000+ (max 12,500)"]
    FTP --> TJ["CSV → Java"]
    TJ --> B["Batch Job"]
    B --> St1["Step 1: DB insert + Salesforce create"]
    St1 -->|"failures"| St2["Step 2: insert into another table"]
    B --> OC["On Complete"]
```

- Batch fits: huge data, automatic error handling, reliability for customer data.
- EDI files → Anypoint Partner Manager / X12 connector (licensed, rare — manufacturing, healthcare).

---

## Quick Recap
- Batch = **asynchronous**, multi-threaded, **reliable** processing for data larger than memory.
- Phases: **Load and Dispatch** (persistent queue) → **Process Records** (steps) → **On Complete** (summary).
- Components: **Batch Job**, **Batch Step**, **Batch Aggregator** (inside a step only).
- **Max Failed Records -1**, **block size 100**, **max concurrency** = threads.
- **Accept Expression** filters; **Accept Policy** NO_FAILURES / ONLY_FAILURES / ALL.
- The aggregator receives only successes; On Complete gives **BatchJobResult** counts.
- A **Scheduler** (fixed frequency or cron) can trigger the batch flow.
