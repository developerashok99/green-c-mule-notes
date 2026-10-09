# Day 50 — Batch Processing: Why Batch, the Three Phases, Batch Job / Step / Aggregator, and On Complete

> **Sources:**
> - Cleaned audio transcript ([transcripts-cleaned/day50.txt](../transcripts-cleaned/day50.txt)) and the class video (recorded 20 Jan 2025).
> - Text marked *screen* or *drawing* is read from the recording.
> - Slide images: [slides/day50](../slides/day50/).

## 1. Overview

*Slide (agenda):* Synchronous processing, Asynchronous processing – Async scope, Batch processing discussion.

The class covered sync vs. async through drawings, then spent the session on **batch processing** (the Async scope itself wasn't demoed):

1. Three ways to process data — For Each, Parallel For Each, **batch**
2. When to use batch — data **larger than memory**, and **reliability**
3. **Synchronous vs. asynchronous**
4. The **three phases** — Load and Dispatch, Process Records, On Complete
5. **Persistent vs. in-memory queues**
6. Components — **Batch Job, Batch Step, Batch Aggregator**
7. Batch Job properties — **Max Failed Records**, scheduling strategy, Job Instance Id, **block size**, **max concurrency**
8. Batch Step — **Accept Expression**, **Accept Policy**
9. Batch Aggregator — **aggregator size**
10. The demo — 8 records, Scheduler trigger, failures, **On Complete** result
11. Use case — weekly customer CSV from FTP into DB and Salesforce
12. Q&A — file formats, EDI

---

## 2. Three Ways to Process Data

| Scope | Threads | Mode |
|---|---|---|
| For Each | Single | Synchronous |
| Parallel For Each | Multiple | Synchronous — waits and aggregates the output |
| **Batch Job** | Multiple | **Asynchronous** |

---

## 3. When to Use Batch

### 3.1 Data larger than memory

- "Large data set" is **relative** — like a car's price relative to a salary.
- Compare with the app's **memory** (e.g. 500 MB), which holds payloads and variables.
- When the data set is **larger than the memory can handle** → batch.
- In practice people move to batch at 20,000–40,000 records, but **for interviews** say: data sets larger than memory.

### 3.2 Reliability

*Drawing:* For Each over 100 records fails on the 50th / Parallel For Each on the 30th → app restart loses progress; batch auto-restarts.

- If the app restarts in the middle of For Each or Parallel For Each, the rest of the records are **lost** — same as any request-reply request when the app stops.
- They have no option to continue.
- **Batch** remembers where it failed and, after restart, **resumes** from the 50th/51st record.
- **Reliability** = not losing data.
- With Parallel For Each you'd have to push messages to a queue manually and reprocess; batch does it automatically.
- Batch is worth it even for **less data** when you need reliability.

---

## 4. Synchronous vs. Asynchronous

*Drawing:* synchronous — the request waits until every processor has finished, then the response returns.

*Drawing:* asynchronous — the response returns while the async part keeps processing in the background.

- For Each and Parallel For Each run **synchronously** — we wait for the output.
- Batch runs **asynchronously**.

> **When to use batch:** huge data that memory can't handle, processed asynchronously — or whenever you need a reliable pattern.

---

## 5. The Three Phases

*Drawing:* Batch components — Batch Job, Batch Step, Batch Aggregator; handles huge data asynchronously, reliability; 3 phases: load and dispatch, process records, on complete.

*Screen:* Batch Job scope diagram (MuleSoft docs) — Process Records with Batch Steps and Batch Aggregator, then On Complete.

| Phase | What happens |
|---|---|
| **1. Load and Dispatch** | Automatic, in the background, **not visible** — the input is split and saved into **persistent queues** |
| **2. Process Records** | One or more **batch steps** do the processing |
| **3. On Complete** | A **summary** — records loaded, processed, succeeded, failed |

### 5.1 Persistent vs. in-memory queues

*Drawing:* records loaded into a persistent queue; processing in memory vs persistent (disk).

| Queue type | On restart/crash |
|---|---|
| In-memory | Data is **deleted** (memory is erased) |
| **Persistent** | Saved on **disk** — processing continues from where it stopped |

- This is where batch's reliability comes from. (Queues are covered again with JMS.)

### 5.2 Summary, not responses

- For Each gives no aggregated output — you build a summary yourself.
- Parallel For Each aggregates all thread responses.
- Batch gives **only a summary** — e.g. of 1 lakh records, 95,000 succeeded, 5,000 failed — not each record's response.

---

## 6. Components

- Palette → search "batch" → **Core**: **Batch Job**, **Batch Step**, **Batch Aggregator** (ignore the Salesforce batch items).

*Screen:* `batch-process-demo` flow:

```text
Listener (later replaced by a Scheduler)
  Set Payload    [1, 2, 3, 4, 5, "a", "b", 6]
  Batch Job
    Process Records
      Batch_Step
        Logger  (payload)
        Set Payload  (payload * 20)
        Logger
        Aggregator: Batch Aggregator (size 4) → Logger
      Batch_Step1
        Logger
    On Complete
      Transform (to JSON) → Logger
```

- Drag in a **Batch Job** → you see **Process Records** and **On Complete** (Load and Dispatch is invisible).
- Process Records has **one** step by default; drag in more **Batch Steps** as needed.
- A **Batch Aggregator** can only go in a step's **aggregator section** — it's optional.
- Input must be **JSON, XML or Java** (per the documentation) — otherwise add a Transform Message first.
- Renaming the job changes its name in the instance logs.

---

## 7. Batch Job Properties

*Screen:* Max Failed Records, Scheduling Strategy **ORDERED_SEQUENTIAL**, Job Instance Id, Batch Block Size, Max Concurrency.

| Property | Meaning |
|---|---|
| **Max Failed Records** | **-1** (default) — continue no matter how many fail. E.g. 100 → stop once more than 100 fail. **0** → stop at the first failure |
| Scheduling Strategy | ORDERED_SEQUENTIAL shown |
| **Job Instance Id** | Generated automatically; can be custom with a `#[ ]` expression (no fx button). Usually left to the system |
| **Batch Block Size** | **100** (default) — records each thread takes from the queue at a time |
| **Max Concurrency** | Number of parallel threads — same formula as Parallel For Each |
| Target variable | Optional |

- Error handling: in Parallel For Each you needed Try + On Error Continue; batch **continues automatically** on failed records.

### 7.1 Block size and threads

*Drawing:* 100 records split into blocks (block size) processed by threads T1 … T4.

- 1,000 records saved in the queue; say 5 threads.
- Each thread takes a **block of 100**, processes them one by one, then takes the next 100.
- **Instructor's suggestion:** leave block size at the default unless you test and observe performance (trial and error).

### 7.2 The main flow's payload

- Batch is asynchronous — it **doesn't overwrite** the main flow's payload with the results.
- After the Batch Job, the payload showed the job **instance info** — record count **8**, status **executing**.

---

## 8. Batch Step — Accept Expression and Accept Policy

*Screen:* Accept Expression and Accept Policy — **NO_FAILURES (default)**, ONLY_FAILURES, ALL.

**Accept Expression** — a filter:

- Letters and numbers coming, accept only numbers → `#[isNumber(payload)]`-style expression with `isNumber`.
- `a` and `b` are filtered out of that step.

**Accept Policy:**

| Policy | Records accepted into the step |
|---|---|
| **NO_FAILURES** (default) | Only records that haven't failed |
| **ONLY_FAILURES** | Only records that **failed** in earlier steps |
| ALL | Everything |

**Example:** 1,000 records; step 1 → 950 succeed, 50 fail. Step 2 with **ONLY_FAILURES** gets those 50 and inserts them into a separate failure table for manual handling.

### 8.1 Q&A — what if the app goes down mid-process?

- Student: 9 records processed in a For Each, the app stops on the 10th — are all 10 failed?
- No — the 9 inserts are done, the 10th failed. You'd check the input against the DB manually.
- **Edge cases, very rare.** A **redeploy** (e.g. through a pipeline) waits for current processing to finish.
- An on-premises server restart stops all apps; you can't restart a live production server except outside business time.
- Still, keep it in mind when designing.

---

## 9. Batch Aggregator

*Screen:* Aggregator Size (or Streaming) — groups records before writing.

- Optional. Collects successfully processed records and does an activity on them together.
- **Aggregator size 4** in the demo → every 4 successful records are passed on together.
- **Failed records never reach the aggregator** — only successes.
- At the end, a smaller leftover group is passed on (e.g. the last 2).

---

## 10. The Demo

- Input: `[1, 2, 3, 4, 5, "a", "b", 6]`; step 1 multiplies each by 20.
- `"a" * 20` fails — *screen:* **"You called the function '\*' with these arguments …"**.
- Step 2 (`Batch_Step1`) handles the strings separately — e.g. insert invalid data into a DB, per the business process. Its logger: "Exclude other than numeric values."

### 10.1 Scheduler instead of Listener

*Screen:* Batch flow triggered by a **Scheduler**.

- Deleted the listener; **Scheduler** as the source — **fixed frequency** (e.g. every 5 minutes) or **cron**.
- It kept re-triggering at each interval.

*Screen (console):* "Starting loading phase", "**8 records were loaded**", "Started execution of instance … for job batch-process-demo-3Batch_Job".

- Records came **out of order** (4 first, then b, 1 …) — multi-threaded; **3 threads** were created.

### 10.2 On Complete result

*Screen:* On Complete payload — **BatchJobResult**: `loadedRecords`, `processedRecords`, `successfulRecords`, `failedRecords`, `elapsedTimeInMillis`, `failedOnCompletePhase`.

*Screen:* exception summary — Exception Type, Step (`Batch_Step`), Count.

*Screen:* "Finished execution for instance … Total Records processed: **8**. Successful records: **7**. Failed Records: **1**".

- In the run discussed aloud: 8 processed, **6 successful, 2 failed** (`a` and `b`).
- The result is converted to **JSON** before logging, for readability.

*Screen:* aggregator logs — records in groups, e.g. `[20, 40, 80, 100]`; the last call had only 2 because no more records were left.

**Homework:** try all the combinations — e.g. Max Failed Records **0** stops at the first failure.

---

## 11. Use Case — Weekly Customer File

*Drawing:* every **Friday 10 PM** — CSV file of customers on an FTP server (**~5,000+ records, max 12,500**) → DB insert and Salesforce create, scheduled with **cron**.

```text
Scheduler (cron: Friday 10 PM)
  FTP Read  (customers CSV)          ← outside the batch
  Transform  CSV → Java              (Java is ideal for the batch)
  Batch Job
    Batch Step 1
      Transform → DB Insert
      Transform → Salesforce Create
    Batch Step 2 (ONLY_FAILURES)
      Insert failures into another table
    On Complete
```

- Assumed always **new** customers (no exists-check), to keep it simple.
- Why batch: **huge data**, automatic **error handling**, and **reliability** — customer data must not be lost.
- Once a week, in **non-business hours** / non-working days.

> **Instructor's view:** requirements come in a big document; a developer's job is easier because everything is in front of you — deciding how (For Each? batch?) and doing it reliably is on you.

*Screen:* `ftp-db-insert` flows — Scheduler → Read employee CSV from FTP → CSV to Java → For Each insert vs. Bulk insert; transform `payload map ((item) -> { empId: item.emp_id as String, … })` — preview of the FTP session.

---

## 12. Q&A — File Formats and EDI

*Screen:* remaining modules — File/FTP/SFTP, Object Store, JMS, CI/CD, AWS S3, HTTPS, CloudHub 1.0 vs 2.0.

- Files are mostly **CSV**; **Excel** also comes.
- **EDI** formats: **Anypoint Partner Manager** (licensed separately) and the **X12 connector** — drag-and-drop EDI handling.
- EDI is rare — mostly **manufacturing** and **healthcare** standards.
- **Instructor's view:** "I know about 20–25% of MuleSoft" — there's much he hasn't had the opportunity to explore.

---

## 13. Important Terminology

| Term | Meaning |
|---|---|
| Batch Job | Scope that processes records asynchronously and reliably |
| Load and Dispatch | Hidden first phase — splits input into a persistent queue |
| Process Records | Phase containing batch steps |
| On Complete | Phase with the BatchJobResult summary |
| Batch Step | A processing stage inside Process Records |
| Batch Aggregator | Groups successful records within a step |
| Persistent queue | Disk-backed; survives restarts |
| In-memory queue | Lost on restart |
| Max Failed Records | Failure limit (-1 = unlimited, 0 = stop at first) |
| Batch Block Size | Records per thread fetch (default 100) |
| Max Concurrency | Parallel threads |
| Accept Expression | Filter on which records enter a step |
| Accept Policy | NO_FAILURES / ONLY_FAILURES / ALL |
| Job Instance Id | Unique ID of a batch run |
| BatchJobResult | loaded/processed/successful/failed records, elapsed time |
| Anypoint Partner Manager | Licensed MuleSoft solution for EDI (X12) |

---

## 14. Interview Questions

### Q1. When would you use batch processing over For Each / Parallel For Each?
When the data set is larger than the app's memory can handle, or when you need reliability — batch persists records and resumes after a restart, and runs asynchronously.

### Q2. What are the phases of a batch job?
Load and Dispatch (split into a persistent queue, invisible), Process Records (batch steps), On Complete (summary).

### Q3. What does Max Failed Records do?
Limits how many records may fail before the job stops: -1 = no limit (default), 0 = stop at the first failure, N = stop after N.

### Q4. How do you process only failed records?
Add another batch step with Accept Policy **ONLY_FAILURES**.

### Q5. Do failed records reach the Batch Aggregator?
No — only successfully processed records.

### Q6. What do batch block size and max concurrency control?
Block size = how many records a thread takes from the queue at a time (default 100); max concurrency = how many threads run in parallel.

### Q7. Does the batch return each record's response?
No — On Complete gives only a summary (loaded, processed, successful, failed records, elapsed time).

### Q8. Is batch synchronous?
No — it's asynchronous; the main flow continues with the job instance info, and its payload isn't overwritten.

---

## 15. Must Remember

1. For Each and Parallel For Each are **synchronous**; batch is **asynchronous**.
2. Batch for data **larger than memory** and for **reliability**.
3. Phases: **Load and Dispatch → Process Records → On Complete**.
4. Records go into a **persistent queue** (disk) — resume after restart.
5. Components: **Batch Job, Batch Step, Batch Aggregator** (aggregator only inside a step).
6. Input as **Java, JSON or XML**; Java is ideal.
7. **Max Failed Records -1** = continue always; 0 = stop at first.
8. **Block size 100**, **max concurrency** = threads.
9. Accept Policy **NO_FAILURES** (default), **ONLY_FAILURES**, ALL; Accept Expression filters.
10. Aggregator gets **only successes**.
11. On Complete = **BatchJobResult** summary.
12. Records are processed **out of order** (multi-threaded).
