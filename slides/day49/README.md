# Day 49 — Slides and On-Screen Drawings

Screens and drawings from the Day 49 class (18 Jan 2025): inserting employee records with For Each (per-record success/error collection), Bulk insert as the alternative, then Parallel For Each — threads, aggregated output, error handling, and how to choose Max Concurrency. Repeated and blank frames have been removed. Times are positions in the video.

Notes for this day: [detailed-notes/day49.md](../../detailed-notes/day49.md) · [super-detailed-notes/day49.md](../../super-detailed-notes/day49.md) · [summary](../../day49.md)

| # | Time | Content |
|---|---|---|
| 01 | 0:58 | foreach-db-insert-demo: Listener → Start Logger → Is not empty collection → Transform → **For Each** [Try: Before DB Insert Logger → Create employee records into DB → After DB Insert Logger → Success Response; On Error Continue: Fail Logger → Error Response] |
| 02 | 11:28 | DB Insert inside For Each: `insert into EMPLOYEES_INFO values (:emp_id,:emp_name,:emp_status,:emp_salary,:emp_designation)` |
| 03 | 13:03 | Input parameters: `emp_id: payload.empId as Number`, `emp_status: if (payload.empStatus == true) "active" else "inactive"` … |
| 04 | 15:26 | Postman request body: an array of employee records (empId, empName, empSalary, active, empDesignation) |
| 05 | 16:47 | Database Config (MySQL Connection) for the demo |
| 06 | 17:00 | MySQL Workbench — EMPLOYEES_INFO rows before/after the run |
| 07 | 24:24 | Success Response: `vars.successResponse ++ [payload.empId]` (collect inserted IDs) |
| 08 | 25:39 | Error Response in On Error Continue: `vars.errorResponse ++ [{"errorReason": error.description} ++ payload]` |
| 09 | 30:56 | Debugger inside For Each — counter, rootMessage, current record as payload |
| 10 | 31:54 | Error "Cannot coerce Array ([]) to Number" — `payload.empId as Number` evaluated on the whole array instead of one record |
| 11 | 37:03 | Final response `{"success": [1000, 1001, 1002, 1003], "error": []}` |
| 12 | 39:53 | Second run: `{"success": [1004, 1005, 1006], "error": [{… "errorReason": "Duplicate entry '1003' for key 'employees_info.PRIMARY'"}]}` |
| 13 | 42:36 | Alternative flow with **Bulk insert** — Transform `payload map …` to a list of records, then one Bulk insert |
| 14 | 44:02 | Bulk insert: `insert into EMPLOYEES_INFO values (:emp_id,:emp_name,:emp_status,:emp_salary,:emp_designation)` — one call for all records |
| 15 | 47:47 | *Drawing:* For Each scope — payload, vars and the modified result coming out |
| 16 | 47:54 | *Drawing:* For Each = sequential, one DB call per record (stop/continue on error) vs Bulk insert = one call |
| 17 | 52:16 | *Drawing:* DB connection lifecycle — create connection, establish, insert record, close connection |
| 18 | 55:22 | Agenda: Parallel For Each — propagation of payload and variables, error handling, max concurrency, differences from For Each |
| 19 | 64:38 | *Drawing:* For Each → new value / payload / modified vars; Parallel For Each response overwrites payload, new vars not accessible outside |
| 20 | 64:40 | *Drawing:* For Each single-threaded, stops on error, sequential vs Parallel For Each multi-threaded, waits for all, aggregated response in random order |
| 21 | 69:52 | *Drawing:* [1,2,3,4,5] split and processed concurrently — total time = slowest record, aggregated response |
| 22 | 70:23 | *Drawing:* CPU-intensive tasks: max concurrency ≤ number of cores; blocking (I/O) tasks: ≤ cores / (1 − blocking factor) |
| 23 | 72:00 | parallel-for-each demo flow: Listener → Start Logger → Set Payload [1,2,3,4,5] → **Parallel For Each** [Try: Logger → Transform → outsidePFE …] |
| 24 | 84:09 | Console logs — each record processed on a different thread (CPU_LITE / processor threads) |
| 25 | 88:06 | Parallel For Each output — array of Mule messages (payload, attributes, exceptionPayload) in the order given |
| 26 | 90:33 | One record failing ("a" * 10): its error text is kept in that element's payload, the others succeed |
| 27 | 94:10 | Postman → 500 "Expecting Array or Object but got Null" when a variable set inside PFE is used outside it |
| 28 | 99:51 | Task Manager — CPU cores (used to pick Max Concurrency) |
| 29 | 103:33 | *Drawing:* 4 cores, DB wait 100 ms of 400 ms → blocking factor 0.25 → 4 / 0.75 ≈ 5.3 threads |

---

### 01 — foreach-db-insert-demo: Listener → Start Logger → Is not empty collection → Transform → **For Each** [Try: Before DB Insert Logger → Create employee records into DB → After DB Insert Logger → Success Response; On Error Continue: Fail Logger → Error Response]
![foreach-db-flow](01-foreach-db-flow.jpg)

### 02 — DB Insert inside For Each: `insert into EMPLOYEES_INFO values (:emp_id,:emp_name,:emp_status,:emp_salary,:emp_designation)`
![insert-query](02-insert-query.jpg)

### 03 — Input parameters: `emp_id: payload.empId as Number`, `emp_status: if (payload.empStatus == true) "active" else "inactive"` …
![input-params](03-input-params.jpg)

### 04 — Postman request body: an array of employee records (empId, empName, empSalary, active, empDesignation)
![request-array](04-request-array.jpg)

### 05 — Database Config (MySQL Connection) for the demo
![db-config](05-db-config.jpg)

### 06 — MySQL Workbench — EMPLOYEES_INFO rows before/after the run
![workbench-table](06-workbench-table.jpg)

### 07 — Success Response: `vars.successResponse ++ [payload.empId]` (collect inserted IDs)
![success-response-var](07-success-response-var.jpg)

### 08 — Error Response in On Error Continue: `vars.errorResponse ++ [{"errorReason": error.description} ++ payload]`
![error-response-var](08-error-response-var.jpg)

### 09 — Debugger inside For Each — counter, rootMessage, current record as payload
![debugger-foreach](09-debugger-foreach.jpg)

### 10 — Error "Cannot coerce Array ([]) to Number" — `payload.empId as Number` evaluated on the whole array instead of one record
![coerce-error](10-coerce-error.jpg)

### 11 — Final response `{"success": [1000, 1001, 1002, 1003], "error": []}`
![final-success](11-final-success.jpg)

### 12 — Second run: `{"success": [1004, 1005, 1006], "error": [{… "errorReason": "Duplicate entry '1003' for key 'employees_info.PRIMARY'"}]}`
![duplicate-error](12-duplicate-error.jpg)

### 13 — Alternative flow with **Bulk insert** — Transform `payload map …` to a list of records, then one Bulk insert
![bulk-insert-flow](13-bulk-insert-flow.jpg)

### 14 — Bulk insert: `insert into EMPLOYEES_INFO values (:emp_id,:emp_name,:emp_status,:emp_salary,:emp_designation)` — one call for all records
![bulk-insert-query](14-bulk-insert-query.jpg)

### 15 — *Drawing:* For Each scope — payload, vars and the modified result coming out
![drawing-foreach-scope](15-drawing-foreach-scope.jpg)

### 16 — *Drawing:* For Each = sequential, one DB call per record (stop/continue on error) vs Bulk insert = one call
![drawing-foreach-vs-bulk](16-drawing-foreach-vs-bulk.jpg)

### 17 — *Drawing:* DB connection lifecycle — create connection, establish, insert record, close connection
![drawing-db-connection](17-drawing-db-connection.jpg)

### 18 — Agenda: Parallel For Each — propagation of payload and variables, error handling, max concurrency, differences from For Each
![parallel-agenda](18-parallel-agenda.jpg)

### 19 — *Drawing:* For Each → new value / payload / modified vars; Parallel For Each response overwrites payload, new vars not accessible outside
![drawing-pfe-propagation](19-drawing-pfe-propagation.jpg)

### 20 — *Drawing:* For Each single-threaded, stops on error, sequential vs Parallel For Each multi-threaded, waits for all, aggregated response in random order
![drawing-single-vs-multi](20-drawing-single-vs-multi.jpg)

### 21 — *Drawing:* [1,2,3,4,5] split and processed concurrently — total time = slowest record, aggregated response
![drawing-concurrency-math](21-drawing-concurrency-math.jpg)

### 22 — *Drawing:* CPU-intensive tasks: max concurrency ≤ number of cores; blocking (I/O) tasks: ≤ cores / (1 − blocking factor)
![drawing-max-concurrency](22-drawing-max-concurrency.jpg)

### 23 — parallel-for-each demo flow: Listener → Start Logger → Set Payload [1,2,3,4,5] → **Parallel For Each** [Try: Logger → Transform → outsidePFE …]
![parallel-foreach-flow](23-parallel-foreach-flow.jpg)

### 24 — Console logs — each record processed on a different thread (CPU_LITE / processor threads)
![console-threads](24-console-threads.jpg)

### 25 — Parallel For Each output — array of Mule messages (payload, attributes, exceptionPayload) in the order given
![pfe-output](25-pfe-output.jpg)

### 26 — One record failing ("a" * 10): its error text is kept in that element's payload, the others succeed
![pfe-error-message](26-pfe-error-message.jpg)

### 27 — Postman → 500 "Expecting Array or Object but got Null" when a variable set inside PFE is used outside it
![postman-500](27-postman-500.jpg)

### 28 — Task Manager — CPU cores (used to pick Max Concurrency)
![task-manager-cores](28-task-manager-cores.jpg)

### 29 — *Drawing:* 4 cores, DB wait 100 ms of 400 ms → blocking factor 0.25 → 4 / 0.75 ≈ 5.3 threads
![drawing-blocking-calc](29-drawing-blocking-calc.jpg)

