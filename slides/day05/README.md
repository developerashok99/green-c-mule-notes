# Day 05 — Slides and On-Screen Drawings

Frames captured from the Day 5 class recording (MuleSoft Telugu Course Day 5, recorded 5 Nov 2024): the db-select-demo build in Anypoint Studio, MySQL Workbench and Postman. Frames showing the database password are deliberately left out. Repeated and blank frames have been removed. Times are positions in the video.

Notes for this day: [detailed-notes/day05.md](../../detailed-notes/day05.md) · [super-detailed-notes/day05.md](../../super-detailed-notes/day05.md) · [summary](../../day05.md)

| # | Time | Content |
|---|---|---|
| 01 | 0:01 | Agenda — HTTP request, Mule event, demo, debugging, Set Variable |
| 02 | 2:24 | HTTP request — body, headers, query/URI params, URL, method, authorization (drawing) |
| 03 | 25:27 | Consumer → Listener → Logger → DB → Transform → JSON response; Postman; Emp DB (drawing) |
| 04 | 15:41 | HTTP Listener config — HTTP, All Interfaces 0.0.0.0, port 8081 |
| 05 | 43:02 | MySQL Workbench — CREATE TABLE EMPLOYEES_INFO |
| 06 | 43:43 | Workbench — INSERT rows (120 ravi, 104 Dinesh, 101 Hari) and error 1146 |
| 07 | 51:45 | Select — query with :emp_id and input parameter payload.empid |
| 08 | 58:55 | Console — Cannot get connection for jdbc:mysql://localhost:330/mule11 |
| 09 | 63:58 | Postman — 500 Server Error, access denied for user root |
| 10 | 65:52 | Postman — 200 OK, employee 120 returned as an array |
| 11 | 69:43 | Mule Debugger — attributes, correlationId, payload, rootId, vars size 0 |
| 12 | 73:01 | Postman — 500, "Attempted to send invalid data through http response" (no Transform Message) |
| 13 | 68:52 | CloudHub (US) vs Mumbai DC database; on-prem servers (drawing) |
| 14 | 80:13 | Agenda annotated — MuleSoft → REST APIs → HTTP (drawing) |

---

### 01 — Agenda — HTTP request, Mule event, demo, debugging, Set Variable
![agenda](01-agenda.jpg)

### 02 — HTTP request — body, headers, query/URI params, URL, method, authorization (drawing)
![http-request-parts-drawing](02-http-request-parts-drawing.jpg)

### 03 — Consumer → Listener → Logger → DB → Transform → JSON response; Postman; Emp DB (drawing)
![api-architecture-drawing](03-api-architecture-drawing.jpg)

### 04 — HTTP Listener config — HTTP, All Interfaces 0.0.0.0, port 8081
![http-listener-config](04-http-listener-config.jpg)

### 05 — MySQL Workbench — CREATE TABLE EMPLOYEES_INFO
![create-table-employees-info](05-create-table-employees-info.jpg)

### 06 — Workbench — INSERT rows (120 ravi, 104 Dinesh, 101 Hari) and error 1146
![insert-rows-and-errors](06-insert-rows-and-errors.jpg)

### 07 — Select — query with :emp_id and input parameter payload.empid
![select-query-input-parameter](07-select-query-input-parameter.jpg)

### 08 — Console — Cannot get connection for jdbc:mysql://localhost:330/mule11
![db-connectivity-error-console](08-db-connectivity-error-console.jpg)

### 09 — Postman — 500 Server Error, access denied for user root
![postman-500-access-denied](09-postman-500-access-denied.jpg)

### 10 — Postman — 200 OK, employee 120 returned as an array
![postman-200-response](10-postman-200-response.jpg)

### 11 — Mule Debugger — attributes, correlationId, payload, rootId, vars size 0
![mule-debugger-variables](11-mule-debugger-variables.jpg)

### 12 — Postman — 500, "Attempted to send invalid data through http response" (no Transform Message)
![postman-invalid-data-500](12-postman-invalid-data-500.jpg)

### 13 — CloudHub (US) vs Mumbai DC database; on-prem servers (drawing)
![cloudhub-vs-enterprise-db-drawing](13-cloudhub-vs-enterprise-db-drawing.jpg)

### 14 — Agenda annotated — MuleSoft → REST APIs → HTTP (drawing)
![agenda-annotated](14-agenda-annotated.jpg)

