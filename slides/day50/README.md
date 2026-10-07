# Day 50 — Slides and On-Screen Drawings

Screens and drawings from the Day 50 class (20 Jan 2025): synchronous vs asynchronous processing, why batch (restart/reliability), the Batch Job / Batch Step / Batch Aggregator components and properties, the On Complete result, and an FTP-to-DB batch use case. Repeated and blank frames have been removed. Times are positions in the video.

Notes for this day: [detailed-notes/day50.md](../../detailed-notes/day50.md) · [super-detailed-notes/day50.md](../../super-detailed-notes/day50.md) · [summary](../../day50.md)

| # | Time | Content |
|---|---|---|
| 01 | 0:01 | Agenda: Synchronous processing, Asynchronous processing – Async scope, Batch processing discussion |
| 02 | 0:44 | *Drawing:* synchronous — the request waits until every processor has finished, then the response returns |
| 03 | 8:23 | *Drawing:* asynchronous — the response returns while the Async part keeps processing in the background |
| 04 | 8:22 | *Drawing:* For Each over 100 records fails on the 50th / Parallel For Each on the 30th → app restart loses progress; batch auto-restarts |
| 05 | 8:28 | *Drawing:* Batch components — Batch Job, Batch Step, Batch Aggregator; handles huge data asynchronously, reliability; 3 phases: load and dispatch, process records, on complete |
| 06 | 0:52 | Batch Job scope diagram (MuleSoft docs) — Process Records with Batch Steps and Batch Aggregator, then On Complete |
| 07 | 19:07 | *Drawing:* records loaded into a persistent queue; processing in memory vs persistent (disk) |
| 08 | 18:36 | batch-process-demo flow: Listener → Set Payload → **Batch Job** [Process Records: Batch_Step (Logger → Set Payload → Logger → Batch Aggregator), Batch_Step1] → On Complete |
| 09 | 23:25 | Batch Job properties: Max Failed Records, Scheduling Strategy ORDERED_SEQUENTIAL, Job Instance Id, Batch Block Size, Max Concurrency |
| 10 | 33:46 | Batch Step: Accept Expression and Accept Policy — NO_FAILURES (default), ONLY_FAILURES, ALL |
| 11 | 42:51 | Batch Aggregator: Aggregator Size (or Streaming) — groups records before writing |
| 12 | 48:32 | Set Payload with an array of records sent into the Batch Job |
| 13 | 48:47 | *Drawing:* 100 records split into blocks (block size) processed by threads T1 … T4 |
| 14 | 56:03 | Batch flow triggered by a Scheduler instead of the Listener |
| 15 | 58:46 | Console — "Starting loading phase", "8 records were loaded", "Started execution of instance … for job batch-process-demo-3Batch_Job" |
| 16 | 59:58 | One record fails in a step (`"a" * 10`) — "You called the function '*' with these arguments" |
| 17 | 61:44 | On Complete payload — BatchJobResult: loadedRecords, processedRecords, successfulRecords, failedRecords, elapsedTimeInMillis |
| 18 | 62:37 | Console exception summary — Exception Type, Step (Batch_Step), Count |
| 19 | 62:57 | "Finished execution for instance … Total Records processed: 8. Successful records: 7. Failed Records: 1" |
| 20 | 65:02 | Batch Aggregator logs — records written in groups (e.g. [20, 40, 80, 100]) |
| 21 | 85:12 | *Drawing (use case):* every Friday 10 PM — CSV file of customers on an FTP server (~5000+ records, max 12500) → DB insert and Salesforce create, scheduled with cron |
| 22 | 85:38 | Studio: ftp-db-insert flows — Scheduler → Read employee CSV from FTP → CSV to Java → For Each insert vs Bulk insert into the database |
| 23 | 86:51 | CSV to Java Transform: `payload map ((item) -> { empId: item.emp_id as String, … })` |
| 24 | 87:12 | Remaining course modules (Notepad++) — File/FTP/SFTP, Object Store, JMS, CI/CD, AWS S3, HTTPS, CloudHub 1.0 vs 2.0 |

---

### 01 — Agenda: Synchronous processing, Asynchronous processing – Async scope, Batch processing discussion
![agenda](01-agenda.jpg)

### 02 — *Drawing:* synchronous — the request waits until every processor has finished, then the response returns
![drawing-sync](02-drawing-sync.jpg)

### 03 — *Drawing:* asynchronous — the response returns while the Async part keeps processing in the background
![drawing-async](03-drawing-async.jpg)

### 04 — *Drawing:* For Each over 100 records fails on the 50th / Parallel For Each on the 30th → app restart loses progress; batch auto-restarts
![drawing-restart](04-drawing-restart.jpg)

### 05 — *Drawing:* Batch components — Batch Job, Batch Step, Batch Aggregator; handles huge data asynchronously, reliability; 3 phases: load and dispatch, process records, on complete
![drawing-batch-components](05-drawing-batch-components.jpg)

### 06 — Batch Job scope diagram (MuleSoft docs) — Process Records with Batch Steps and Batch Aggregator, then On Complete
![batch-job-diagram](06-batch-job-diagram.jpg)

### 07 — *Drawing:* records loaded into a persistent queue; processing in memory vs persistent (disk)
![drawing-batch-queue](07-drawing-batch-queue.jpg)

### 08 — batch-process-demo flow: Listener → Set Payload → **Batch Job** [Process Records: Batch_Step (Logger → Set Payload → Logger → Batch Aggregator), Batch_Step1] → On Complete
![batch-demo-flow](08-batch-demo-flow.jpg)

### 09 — Batch Job properties: Max Failed Records, Scheduling Strategy ORDERED_SEQUENTIAL, Job Instance Id, Batch Block Size, Max Concurrency
![batch-job-props](09-batch-job-props.jpg)

### 10 — Batch Step: Accept Expression and Accept Policy — NO_FAILURES (default), ONLY_FAILURES, ALL
![batch-step-filters](10-batch-step-filters.jpg)

### 11 — Batch Aggregator: Aggregator Size (or Streaming) — groups records before writing
![batch-aggregator](11-batch-aggregator.jpg)

### 12 — Set Payload with an array of records sent into the Batch Job
![set-payload-array](12-set-payload-array.jpg)

### 13 — *Drawing:* 100 records split into blocks (block size) processed by threads T1 … T4
![drawing-block-size](13-drawing-block-size.jpg)

### 14 — Batch flow triggered by a Scheduler instead of the Listener
![scheduler-trigger](14-scheduler-trigger.jpg)

### 15 — Console — "Starting loading phase", "8 records were loaded", "Started execution of instance … for job batch-process-demo-3Batch_Job"
![console-batch-loading](15-console-batch-loading.jpg)

### 16 — One record fails in a step (`"a" * 10`) — "You called the function '*' with these arguments"
![record-error](16-record-error.jpg)

### 17 — On Complete payload — BatchJobResult: loadedRecords, processedRecords, successfulRecords, failedRecords, elapsedTimeInMillis
![on-complete-payload](17-on-complete-payload.jpg)

### 18 — Console exception summary — Exception Type, Step (Batch_Step), Count
![exception-summary](18-exception-summary.jpg)

### 19 — "Finished execution for instance … Total Records processed: 8. Successful records: 7. Failed Records: 1"
![finished-instance](19-finished-instance.jpg)

### 20 — Batch Aggregator logs — records written in groups (e.g. [20, 40, 80, 100])
![aggregator-output](20-aggregator-output.jpg)

### 21 — *Drawing (use case):* every Friday 10 PM — CSV file of customers on an FTP server (~5000+ records, max 12500) → DB insert and Salesforce create, scheduled with cron
![drawing-friday-job](21-drawing-friday-job.jpg)

### 22 — Studio: ftp-db-insert flows — Scheduler → Read employee CSV from FTP → CSV to Java → For Each insert vs Bulk insert into the database
![ftp-sync-flows](22-ftp-sync-flows.jpg)

### 23 — CSV to Java Transform: `payload map ((item) -> { empId: item.emp_id as String, … })`
![csv-to-java](23-csv-to-java.jpg)

### 24 — Remaining course modules (Notepad++) — File/FTP/SFTP, Object Store, JMS, CI/CD, AWS S3, HTTPS, CloudHub 1.0 vs 2.0
![course-modules](24-course-modules.jpg)

