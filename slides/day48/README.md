# Day 48 — Slides and On-Screen Drawings

Screens and drawings from the Day 48 class (17 Jan 2025): the For Each scope — collection, counter, rootMessage, batch size, why the payload is restored afterwards — with an employee-insert demo collecting success and error results, and Try / On Error Continue inside the loop. Repeated and blank frames have been removed. Times are positions in the video.

Notes for this day: [detailed-notes/day48.md](../../detailed-notes/day48.md) · [super-detailed-notes/day48.md](../../super-detailed-notes/day48.md) · [summary](../../day48.md)

| # | Time | Content |
|---|---|---|
| 01 | 0:04 | Agenda: For Each scope discussion |
| 02 | 4:57 | *Drawing:* create new employees — an array of employee objects [{E1}, {E2} …] → insert each into the DB |
| 03 | 9:41 | *Drawing:* For Each processes records sequentially; on a failure it can skip that record and the remaining records are still handled (Oracle / MySQL) |
| 04 | 13:13 | foreach-db-insert-demo: Listener → Start Logger → Is not empty collection → Transform Message → **For Each** [Try: Before DB Insert Logger → Create employee records into DB → After DB Insert Logger → Success Response; On Error Continue: Fail Logger → Error Response] |
| 05 | 14:44 | *Drawing:* the input can arrive as JSON, XML or Java — the For Each collection is the array of records |
| 06 | 21:26 | Validation **Is not empty collection** — Values `#[payload]`, message "No data to process" |
| 07 | 22:39 | For Each settings: Collection `#[payload]`, Counter Variable Name `counter`, Batch Size 1, Root Message Variable Name `rootMessage` |
| 08 | 29:48 | *Drawing:* For Each iterates the payload array — each iteration gets one object ({"name": "mahesh", "dept": "software", "salary": 75000}) |
| 09 | 33:22 | *Drawing:* [1,2,3,4,5] with batch size 2 → iterations [1,2], [3,4], [5] |
| 10 | 38:15 | *Drawing:* inside For Each — `counter` (iteration number) and `rootMessage` (the original full payload) as variables |
| 11 | 43:13 | *Drawing:* after For Each the payload is the original collection again — results must be collected in variables |
| 12 | 45:01 | DB Insert: `insert into EMPLOYEES_INFO values (:emp_id,:emp_name,:emp_status,:emp_salary,:emp_designation)` with `"emp_id": payload.empId as Number` … |
| 13 | 47:39 | Success Response (Transform to a variable): `vars.successResponse ++ payload` |
| 14 | 48:12 | Error Response in On Error Continue: `vars.errorResponse ++ payload ++ {"errorReason": error.description}` |
| 15 | 48:25 | Final Response: `{"success": vars.successResponse, "error": vars.errorResponse}` |
| 16 | 51:33 | for-each-demo-7303 flow: Listener → Logger → For Each [Logger → Set Payload → Logger] → Logger |
| 17 | 56:22 | Debugger inside For Each — counter, rootMessage and the current element as payload |
| 18 | 61:45 | Postman POST /foreach with `[1,2,"a",4,"b"]` — testing a failing element |
| 19 | 62:13 | Error for "a" — "You called the function '*' with these arguments: 1: String ("a") 2: Number (20)" |
| 20 | 64:07 | For Each with a Try scope and On Error Continue — the failing element no longer stops the loop |
| 21 | 68:45 | Set Variable inside the loop to collect results (successResponse / errorResponse arrays) |
| 22 | 83:10 | Postman → 200 `{"successResponseResults": [20, 40, 80 …], "failedResponseResults": ["a", "b"]}` |

---

### 01 — Agenda: For Each scope discussion
![agenda](01-agenda.jpg)

### 02 — *Drawing:* create new employees — an array of employee objects [{E1}, {E2} …] → insert each into the DB
![drawing-create-employees](02-drawing-create-employees.jpg)

### 03 — *Drawing:* For Each processes records sequentially; on a failure it can skip that record and the remaining records are still handled (Oracle / MySQL)
![drawing-sequential](03-drawing-sequential.jpg)

### 04 — foreach-db-insert-demo: Listener → Start Logger → Is not empty collection → Transform Message → **For Each** [Try: Before DB Insert Logger → Create employee records into DB → After DB Insert Logger → Success Response; On Error Continue: Fail Logger → Error Response]
![foreach-flow](04-foreach-flow.jpg)

### 05 — *Drawing:* the input can arrive as JSON, XML or Java — the For Each collection is the array of records
![drawing-input-formats](05-drawing-input-formats.jpg)

### 06 — Validation **Is not empty collection** — Values `#[payload]`, message "No data to process"
![is-not-empty-collection](06-is-not-empty-collection.jpg)

### 07 — For Each settings: Collection `#[payload]`, Counter Variable Name `counter`, Batch Size 1, Root Message Variable Name `rootMessage`
![foreach-config](07-foreach-config.jpg)

### 08 — *Drawing:* For Each iterates the payload array — each iteration gets one object ({"name": "mahesh", "dept": "software", "salary": 75000})
![drawing-foreach-objects](08-drawing-foreach-objects.jpg)

### 09 — *Drawing:* [1,2,3,4,5] with batch size 2 → iterations [1,2], [3,4], [5]
![drawing-batch-size](09-drawing-batch-size.jpg)

### 10 — *Drawing:* inside For Each — `counter` (iteration number) and `rootMessage` (the original full payload) as variables
![drawing-counter-root](10-drawing-counter-root.jpg)

### 11 — *Drawing:* after For Each the payload is the original collection again — results must be collected in variables
![drawing-payload-after](11-drawing-payload-after.jpg)

### 12 — DB Insert: `insert into EMPLOYEES_INFO values (:emp_id,:emp_name,:emp_status,:emp_salary,:emp_designation)` with `"emp_id": payload.empId as Number` …
![insert-query](12-insert-query.jpg)

### 13 — Success Response (Transform to a variable): `vars.successResponse ++ payload`
![success-response](13-success-response.jpg)

### 14 — Error Response in On Error Continue: `vars.errorResponse ++ payload ++ {"errorReason": error.description}`
![error-response](14-error-response.jpg)

### 15 — Final Response: `{"success": vars.successResponse, "error": vars.errorResponse}`
![final-response](15-final-response.jpg)

### 16 — for-each-demo-7303 flow: Listener → Logger → For Each [Logger → Set Payload → Logger] → Logger
![simple-foreach-flow](16-simple-foreach-flow.jpg)

### 17 — Debugger inside For Each — counter, rootMessage and the current element as payload
![debugger-counter](17-debugger-counter.jpg)

### 18 — Postman POST /foreach with `[1,2,"a",4,"b"]` — testing a failing element
![postman-array](18-postman-array.jpg)

### 19 — Error for "a" — "You called the function '*' with these arguments: 1: String ("a") 2: Number (20)"
![multiply-error](19-multiply-error.jpg)

### 20 — For Each with a Try scope and On Error Continue — the failing element no longer stops the loop
![try-on-error-continue](20-try-on-error-continue.jpg)

### 21 — Set Variable inside the loop to collect results (successResponse / errorResponse arrays)
![set-variable-results](21-set-variable-results.jpg)

### 22 — Postman → 200 `{"successResponseResults": [20, 40, 80 …], "failedResponseResults": ["a", "b"]}`
![postman-success-error](22-postman-success-error.jpg)

