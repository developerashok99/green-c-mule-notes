# Day 29 — Slides and On-Screen Drawings

Screens from the Day 29 class (16 Dec 2024): masking with dw::util::Values, secure properties and the Secure Properties Generator, the DB Insert, and testing DB error handlers. Repeated and blank frames have been removed. Times are positions in the video.

Notes for this day: [detailed-notes/day29.md](../../detailed-notes/day29.md) · [super-detailed-notes/day29.md](../../super-detailed-notes/day29.md) · [summary](../../day29.md)

| # | Time | Content |
|---|---|---|
| 01 | 3:00 | Reference project (transaction-sapi) Start Logger: `import * from dw::util::Values` plus `"requestpayload": (vars.requestPayload mask field("mobileNumber") with "********" mask field("memberId") with "********")` |
| 02 | 4:24 | DataWeave Playground without the import: "Unable to resolve reference of: `mask`", "`field`", "`vars`" |
| 03 | 10:33 | Playground with the import: payload `mask field("mobileNumber") with "#####" mask field("memberId") with "#####"`; tooltip for `mask(value, selector: PathElement)` |
| 04 | 11:56 | Output: mobileNumber and memberId replaced by "#####", message left as is |
| 05 | 14:13 | MuleSoft docs, dw::util::Values `mask(value: Any, selector: PathElement)` — replaces simple elements matching the criteria (since DW 2.2.2) |
| 06 | 14:56 | Docs example: array of name/password objects, `mask field("password") with "*****"` |
| 07 | 16:33 | Docs example output: every password shown as "*****" |
| 08 | 41:01 | Database Config (MySQL Connection): host `${database.host}`, port `${database.port}`, user `${secure::database.username}`, password from secure properties |
| 09 | 44:51 | Test Connection fails: "Couldn't find configuration property value for key ${mule.env}" — Studio's tooling can't resolve `mule.env` |
| 10 | 50:27 | Secure Properties Generator (secure-properties-api.us-e1.cloudhub.io): Operation Encrypt/Decrypt, Algorithm AES, State CBC, Key, Value |
| 11 | 54:51 | Global Configuration Elements: HTTP Listener config, Router, MySQL80_Database_Config, Configuration properties, Secure_Properties_Config, Global Property `mule.env`, Global Property `secure.key` |
| 12 | 54:58 | Global Property dialog: Name `secure.key`, Value typed in |
| 13 | 66:12 | Debug Configurations → Environment → New Environment Variable `secure.key` (key supplied at run time instead of in the project) |
| 14 | 60:38 | post-employee-implementation-flow (sys-app): Create Emp using DB Insert, `insert into EMPLOYEES_INFO values (:emp_id,:emp_name,:emp_status,:emp_salary,:emp_designation)` |
| 15 | 61:43 | Input Parameters: emp_id ← payload.empId, emp_name ← payload.empName, emp_status ← `if(payload.active == true) "active" else "inactive"`, emp_salary, emp_designation |
| 16 | 67:48 | Deploy fails: "Could not find ErrorType for the given identifier: 'DATABASE:NO_DATA_FOUND'" — application hr-employees-sapi-7303 FAILED |
| 17 | 68:45 | common-error-handler: On Error Propagate with type `DATABASE:NO_DATA_FOUND` (not a real error type — the DB namespace is `DB`) |
| 18 | 69:31 | common-error-handler XML: Error Logger + Final Error Response `{"statusCode": 500, "message": error.description}`, variable httpStatus 500 |
| 19 | 70:45 | After the fix: app started; plugins Database 1.12.1, Sockets 1.2.2, secure-properties 1.2.7, HTTP 1.6.0, APIKit 1.5.11; libraries RAML, common-headers fragment, mysql-connector-java 5.1.48 |
| 20 | 75:50 | Postman POST localhost:8081/api/employees (empId 1000, Suresh, 80000, active true, software engineer) → 201 "employee details created successfully in the db" |
| 21 | 77:01 | Same request again: debugger shows error DB:QUERY_EXECUTION, "Duplicate entry '1000' for key 'employees_info.PRIMARY'" (MySQLIntegrityConstraintViolationException) |
| 22 | 78:25 | Console: Error type DB:QUERY_EXECUTION, message Duplicate entry '1000'… |
| 23 | 79:02 | Handled by the DB:BAD_SQL_SYNTAX, DB:QUERY_EXECUTION handler → 400 Bad Request with the duplicate-entry message |
| 24 | 80:56 | Windows Services: stopping the MySQL80 service to simulate the DB being down |
| 25 | 81:45 | Debugger: "Could not obtain connection from data source" (ConnectionException) |
| 26 | 82:47 | On Error Propagate type DB:CONNECTIVITY → Error Logger + Final Error Response (statusCode 500, error.description) |
| 27 | 83:24 | Postman → 500 Server Error, "Could not obtain connection from data source" |
| 28 | 85:07 | MySQL Workbench: `select * from EMPLOYEES_INFO` — rows 120 ravi, 1000 Suresh, 1001 Suresh |

---

### 01 — Reference project (transaction-sapi) Start Logger: `import * from dw::util::Values` plus `"requestpayload": (vars.requestPayload mask field("mobileNumber") with "********" mask field("memberId") with "********")`
![start-logger-mask](01-start-logger-mask.jpg)

### 02 — DataWeave Playground without the import: "Unable to resolve reference of: `mask`", "`field`", "`vars`"
![playground-mask-errors](02-playground-mask-errors.jpg)

### 03 — Playground with the import: payload `mask field("mobileNumber") with "#####" mask field("memberId") with "#####"`; tooltip for `mask(value, selector: PathElement)`
![playground-mask-tooltip](03-playground-mask-tooltip.jpg)

### 04 — Output: mobileNumber and memberId replaced by "#####", message left as is
![playground-mask-output](04-playground-mask-output.jpg)

### 05 — MuleSoft docs, dw::util::Values `mask(value: Any, selector: PathElement)` — replaces simple elements matching the criteria (since DW 2.2.2)
![docs-mask-pathelement](05-docs-mask-pathelement.jpg)

### 06 — Docs example: array of name/password objects, `mask field("password") with "*****"`
![docs-mask-example](06-docs-mask-example.jpg)

### 07 — Docs example output: every password shown as "*****"
![docs-mask-output](07-docs-mask-output.jpg)

### 08 — Database Config (MySQL Connection): host `${database.host}`, port `${database.port}`, user `${secure::database.username}`, password from secure properties
![db-config-secure](08-db-config-secure.jpg)

### 09 — Test Connection fails: "Couldn't find configuration property value for key ${mule.env}" — Studio's tooling can't resolve `mule.env`
![test-connection-mule-env](09-test-connection-mule-env.jpg)

### 10 — Secure Properties Generator (secure-properties-api.us-e1.cloudhub.io): Operation Encrypt/Decrypt, Algorithm AES, State CBC, Key, Value
![secure-properties-generator](10-secure-properties-generator.jpg)

### 11 — Global Configuration Elements: HTTP Listener config, Router, MySQL80_Database_Config, Configuration properties, Secure_Properties_Config, Global Property `mule.env`, Global Property `secure.key`
![global-properties](11-global-properties.jpg)

### 12 — Global Property dialog: Name `secure.key`, Value typed in
![global-property-secure-key](12-global-property-secure-key.jpg)

### 13 — Debug Configurations → Environment → New Environment Variable `secure.key` (key supplied at run time instead of in the project)
![run-config-env-var](13-run-config-env-var.jpg)

### 14 — post-employee-implementation-flow (sys-app): Create Emp using DB Insert, `insert into EMPLOYEES_INFO values (:emp_id,:emp_name,:emp_status,:emp_salary,:emp_designation)`
![db-insert-query](14-db-insert-query.jpg)

### 15 — Input Parameters: emp_id ← payload.empId, emp_name ← payload.empName, emp_status ← `if(payload.active == true) "active" else "inactive"`, emp_salary, emp_designation
![db-insert-params](15-db-insert-params.jpg)

### 16 — Deploy fails: "Could not find ErrorType for the given identifier: 'DATABASE:NO_DATA_FOUND'" — application hr-employees-sapi-7303 FAILED
![deploy-failed](16-deploy-failed.jpg)

### 17 — common-error-handler: On Error Propagate with type `DATABASE:NO_DATA_FOUND` (not a real error type — the DB namespace is `DB`)
![on-error-wrong-type](17-on-error-wrong-type.jpg)

### 18 — common-error-handler XML: Error Logger + Final Error Response `{"statusCode": 500, "message": error.description}`, variable httpStatus 500
![error-handler-xml](18-error-handler-xml.jpg)

### 19 — After the fix: app started; plugins Database 1.12.1, Sockets 1.2.2, secure-properties 1.2.7, HTTP 1.6.0, APIKit 1.5.11; libraries RAML, common-headers fragment, mysql-connector-java 5.1.48
![deployed-plugins](19-deployed-plugins.jpg)

### 20 — Postman POST localhost:8081/api/employees (empId 1000, Suresh, 80000, active true, software engineer) → 201 "employee details created successfully in the db"
![postman-201](20-postman-201.jpg)

### 21 — Same request again: debugger shows error DB:QUERY_EXECUTION, "Duplicate entry '1000' for key 'employees_info.PRIMARY'" (MySQLIntegrityConstraintViolationException)
![debugger-duplicate](21-debugger-duplicate.jpg)

### 22 — Console: Error type DB:QUERY_EXECUTION, message Duplicate entry '1000'…
![console-duplicate](22-console-duplicate.jpg)

### 23 — Handled by the DB:BAD_SQL_SYNTAX, DB:QUERY_EXECUTION handler → 400 Bad Request with the duplicate-entry message
![postman-400](23-postman-400.jpg)

### 24 — Windows Services: stopping the MySQL80 service to simulate the DB being down
![windows-services](24-windows-services.jpg)

### 25 — Debugger: "Could not obtain connection from data source" (ConnectionException)
![debugger-no-connection](25-debugger-no-connection.jpg)

### 26 — On Error Propagate type DB:CONNECTIVITY → Error Logger + Final Error Response (statusCode 500, error.description)
![connectivity-handler](26-connectivity-handler.jpg)

### 27 — Postman → 500 Server Error, "Could not obtain connection from data source"
![postman-500](27-postman-500.jpg)

### 28 — MySQL Workbench: `select * from EMPLOYEES_INFO` — rows 120 ravi, 1000 Suresh, 1001 Suresh
![workbench-rows](28-workbench-rows.jpg)

---

### Not included — credential screens

Three screens are left out because they show the real encryption key and decrypted DB login. In the notes they're described with **placeholder** values (see [super-detailed-notes/day29.md §10](../../super-detailed-notes/day29.md)):

- 0:36 — `dev.yaml` with encrypted username/password — placeholder `![Xy3dEmOuSeRnAmE1==]` / `![Pq9dEmOpAsSwOrD2==]`
- 51:14 — Secure Properties Generator, Decrypt username — key `DEMOKEY123456789` → `root`
- 54:55 — Secure Properties Generator, Decrypt password — same key → `<mysql-root-password>`
