# Day 47 — Slides and On-Screen Drawings

Screens and drawings from the Day 47 class (16 Jan 2025): creating Salesforce accounts from Mule (Create, transform, per-record results and errors), the upsert idea, the On New Object and On Modified Object sources, and the Scheduler with fixed frequency and cron expressions. Repeated and blank frames have been removed. Times are positions in the video.

Notes for this day: [detailed-notes/day47.md](../../detailed-notes/day47.md) · [super-detailed-notes/day47.md](../../super-detailed-notes/day47.md) · [summary](../../day47.md)

| # | Time | Content |
|---|---|---|
| 01 | 0:03 | Course module list (Notepad++) — remaining modules: File/FTP/SFTP, Object Store, Routing, JMS, Transformation, Scopes, Salesforce, CI/CD, AWS S3, HTTPS |
| 02 | 1:21 | Module status update — DWL concepts done (Flatten and Flatmap pending), Salesforce connector operations: Create, Query, On New Object |
| 03 | 3:09 | salesforce-account-demo: Listener → Logger → Transform Message → Salesforce **Create** → Transform Message → Logger |
| 04 | 3:17 | Create operation: connector config Salesforce_Config, Type **Account**, Records `payload` |
| 05 | 11:01 | Transform to the Salesforce format: `payload map ((item, index) -> { Name: item.name, AccountNumber: item.accountNumber, AnnualRevenue: item.annualRevenue as Number })` with `output application/java` |
| 06 | 24:47 | Postman POST http://localhost:8081/create with an array of accounts (name, accountNumber, annualRevenue) |
| 07 | 26:40 | Mule Debugger: the transformed Java payload going into the Create operation |
| 08 | 31:08 | Create response (Notepad++): `items` with `success: true`, Salesforce record `id`, `statusCode`, `successful: true` |
| 09 | 33:25 | Playground: `payload.items.successful` → [true, true, true] — reading the result of each record |
| 10 | 33:58 | Salesforce All Accounts — ABC / DEF / XYZ Company records created from Mule |
| 11 | 34:17 | XYZ Company account record in Salesforce |
| 12 | 40:49 | Debugger: "Failed to send request to https://site-customization-…my.salesforce.com" — SALESFORCE:CONNECTIVITY |
| 13 | 42:02 | Salesforce Config → Test Connection (Basic Authentication with username, password and security token) |
| 14 | 44:22 | Create response with **INVALID_TYPE_ON_FIELD_IN_RECORD** — "Annual Revenue: invalid number: abcde"; `successful: false` |
| 15 | 44:32 | `payload.items.successful` — one record false, the others true (partial success) |
| 16 | 52:05 | *Drawing:* **upsert** — if the record is available in SF it will update; if not, it will create |
| 17 | 55:22 | *Drawing:* SF → Mule (On New Object) → insert into the DB (Oracle) — XYZ company sync |
| 18 | 60:46 | Salesforce **On New Object** source: object type Account, scheduling strategy Fixed Frequency (frequency, start delay, time unit) |
| 19 | 67:38 | Docs — Scheduler Endpoint (Trigger): fixed frequency or cron, single-node in a cluster |
| 20 | 69:16 | Docs — Cron Expressions (seconds, minutes, hours, day of month, month, day of week, year) with examples |
| 21 | 70:49 | Docs — Change a Time Zone (`>>` operator) and the list of Time Zone IDs |
| 22 | 75:16 | New Account in Salesforce (A Company, Hyderabad address) to trigger On New Object |
| 23 | 76:02 | Salesforce: "Account 'A Company' was created" |
| 24 | 77:23 | On New Object payload: the full new Account record (BillingCity Hyderabad, BillingPostalCode 500008, Website, CreatedDate …) |
| 25 | 82:42 | **On Modified Object** source — fires when an existing record is updated |
| 26 | 82:02 | Editing an account in Salesforce ("Your changes are saved") to trigger On Modified Object |
| 27 | 86:41 | *Drawing:* Scheduler-based sync — SF → Mule → DB on a schedule (upsert) |
| 28 | 88:27 | Scheduler component in Studio — scheduling strategy (fixed frequency / cron) |

---

### 01 — Course module list (Notepad++) — remaining modules: File/FTP/SFTP, Object Store, Routing, JMS, Transformation, Scopes, Salesforce, CI/CD, AWS S3, HTTPS
![course-modules](01-course-modules.jpg)

### 02 — Module status update — DWL concepts done (Flatten and Flatmap pending), Salesforce connector operations: Create, Query, On New Object
![modules-status](02-modules-status.jpg)

### 03 — salesforce-account-demo: Listener → Logger → Transform Message → Salesforce **Create** → Transform Message → Logger
![create-flow](03-create-flow.jpg)

### 04 — Create operation: connector config Salesforce_Config, Type **Account**, Records `payload`
![create-config](04-create-config.jpg)

### 05 — Transform to the Salesforce format: `payload map ((item, index) -> { Name: item.name, AccountNumber: item.accountNumber, AnnualRevenue: item.annualRevenue as Number })` with `output application/java`
![create-transform](05-create-transform.jpg)

### 06 — Postman POST http://localhost:8081/create with an array of accounts (name, accountNumber, annualRevenue)
![postman-create-request](06-postman-create-request.jpg)

### 07 — Mule Debugger: the transformed Java payload going into the Create operation
![debugger-create-input](07-debugger-create-input.jpg)

### 08 — Create response (Notepad++): `items` with `success: true`, Salesforce record `id`, `statusCode`, `successful: true`
![create-response](08-create-response.jpg)

### 09 — Playground: `payload.items.successful` → [true, true, true] — reading the result of each record
![dw-items-successful](09-dw-items-successful.jpg)

### 10 — Salesforce All Accounts — ABC / DEF / XYZ Company records created from Mule
![sf-accounts-created](10-sf-accounts-created.jpg)

### 11 — XYZ Company account record in Salesforce
![xyz-company-record](11-xyz-company-record.jpg)

### 12 — Debugger: "Failed to send request to https://site-customization-…my.salesforce.com" — SALESFORCE:CONNECTIVITY
![create-connection-error](12-create-connection-error.jpg)

### 13 — Salesforce Config → Test Connection (Basic Authentication with username, password and security token)
![test-connection](13-test-connection.jpg)

### 14 — Create response with **INVALID_TYPE_ON_FIELD_IN_RECORD** — "Annual Revenue: invalid number: abcde"; `successful: false`
![invalid-type-error](14-invalid-type-error.jpg)

### 15 — `payload.items.successful` — one record false, the others true (partial success)
![dw-successful-false](15-dw-successful-false.jpg)

### 16 — *Drawing:* **upsert** — if the record is available in SF it will update; if not, it will create
![drawing-upsert](16-drawing-upsert.jpg)

### 17 — *Drawing:* SF → Mule (On New Object) → insert into the DB (Oracle) — XYZ company sync
![drawing-sf-to-db](17-drawing-sf-to-db.jpg)

### 18 — Salesforce **On New Object** source: object type Account, scheduling strategy Fixed Frequency (frequency, start delay, time unit)
![on-new-object](18-on-new-object.jpg)

### 19 — Docs — Scheduler Endpoint (Trigger): fixed frequency or cron, single-node in a cluster
![scheduler-docs](19-scheduler-docs.jpg)

### 20 — Docs — Cron Expressions (seconds, minutes, hours, day of month, month, day of week, year) with examples
![cron-expressions](20-cron-expressions.jpg)

### 21 — Docs — Change a Time Zone (`>>` operator) and the list of Time Zone IDs
![time-zone-docs](21-time-zone-docs.jpg)

### 22 — New Account in Salesforce (A Company, Hyderabad address) to trigger On New Object
![sf-new-account](22-sf-new-account.jpg)

### 23 — Salesforce: "Account 'A Company' was created"
![account-created-toast](23-account-created-toast.jpg)

### 24 — On New Object payload: the full new Account record (BillingCity Hyderabad, BillingPostalCode 500008, Website, CreatedDate …)
![on-new-object-payload](24-on-new-object-payload.jpg)

### 25 — **On Modified Object** source — fires when an existing record is updated
![on-modified-object](25-on-modified-object.jpg)

### 26 — Editing an account in Salesforce ("Your changes are saved") to trigger On Modified Object
![sf-edit-record](26-sf-edit-record.jpg)

### 27 — *Drawing:* Scheduler-based sync — SF → Mule → DB on a schedule (upsert)
![drawing-scheduler](27-drawing-scheduler.jpg)

### 28 — Scheduler component in Studio — scheduling strategy (fixed frequency / cron)
![scheduler-component](28-scheduler-component.jpg)

