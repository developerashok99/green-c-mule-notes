# Day 30 — Slides and On-Screen Drawings

Screens from the Day 30 class (17 Dec 2024): Remove Variable, enriching the POST response (RAML 1.0.1), the Update and Select queries, Is number + error mapping, and the Choice for not-found. Repeated and blank frames have been removed. Times are positions in the video.

Notes for this day: [detailed-notes/day30.md](../../detailed-notes/day30.md) · [super-detailed-notes/day30.md](../../super-detailed-notes/day30.md) · [summary](../../day30.md)

| # | Time | Content |
|---|---|---|
| 01 | 0:36 | Main flow: Listener → Create Initial Variables → APIkit Router → Remove Variable (Core); Remove Variable needs a variable Name |
| 02 | 5:07 | Reference sys-app Insert "Create Emp using DB Insert": `insert into EMPLOYEES_INFO values (:emp_id,:emp_name,:emp_status,:emp_salary,:emp_designation)` with input parameters from payload |
| 03 | 5:31 | Reference "Post Final Response Transformation": `{statusCode: 201, message: "employee details created successfully in the db", transactionId: vars.origAttributes.headers.'transaction-id', employeeId: vars.origPayload.empId}` |
| 04 | 11:48 | Design Center (hr-employees-sapi-7303): editing postResponseExample.json — syntax errors until keys are quoted, and the RAML "should have required property 'message'" |
| 05 | 13:14 | postResponseDataType.raml gets the new properties (statusCode, message, transactionId, employeeId) |
| 06 | 20:37 | Publishing to Exchange: asset version 1.0.1 (1.0.0 published 5 days ago), API version v1, LifeCycle Stable |
| 07 | 26:12 | Studio pom.xml: the RAML dependency (artifactId hr-employees-sapi-7303, classifier raml, type zip) bumped to version 1.0.1 |
| 08 | 36:33 | Router config: API Definition `resource::9756392d-…:hr-employees-sapi-7303:1.0.0:raml:zip:hr-employees-sapi-7303.raml` still on 1.0.0 → deploy fails "Raml not found" |
| 09 | 31:17 | patch-employee-implementation-flow: Update "Update Employee Details in HR DB" — `UPDATE EMPLOYEES_INFO SET emp_salary = :emp_salary, emp_designation = :emp_designation WHERE emp_id= :emp_id` |
| 10 | 40:35 | Postman PATCH (empId 1000, empSalary 100000, empDesignation "senior software engineer") → 200 "employee details updated successfully in the db" |
| 11 | 51:40 | Validation **Is number** after the Update: Value `#[payload.affectedRows]`, Min 1, Max 1, Number type INTEGER |
| 12 | 46:29 | Reference sys-app Error Mapping on Is number: VALIDATION:INVALID_NUMBER → DATABASE:NO_DATA_FOUND |
| 13 | 57:12 | Class project: Error Mapping picker — ANY, VALIDATION:INVALID_NUMBER, EXPRESSION, STREAM_MAXIMUM_SIZE_EXCEEDED; custom error namespace APP |
| 14 | 55:36 | common-error-handler: On Error Propagate type DATABASE:NO_DATA_FOUND (Error Logger + Final Error Response) |
| 15 | 54:45 | Debugger for a non-existent empId: error "Employee doesn't exist in HR database", errorType VALIDATION:INVALID_NUMBER |
| 16 | 61:31 | Postman PATCH empId 10000 → 500 `{"statusCode": 500, "message": "Employee doesn't exist in HR database"}` |
| 17 | 67:18 | Reference sys-app fetch flow: Select `select * from EMPLOYEES_INFO where emp_id=:emp_id;`, input parameter `emp_id: attributes.uriParams.empid` |
| 18 | 69:36 | get-employee-implementation-flow: Logger → Select → Logger → "Get Employee Final Response" → Logger |
| 19 | 81:25 | Playground: Select returns an **array** — mapping `payload[0].empId …`, `active: if(payload[0].emp_status=="active") true else false` |
| 20 | 92:03 | Postman GET /api/employees/1000 → 200 but every field null except active (mapping used camelCase keys) |
| 21 | 94:19 | Debugger Evaluate DataWeave: `payload[0].emp_id`, `emp_name`, `emp_salary`, `emp_designation` → correct values |
| 22 | 85:04 | Choice router: When `#[!isEmpty(payload)]` → Get Employee Final Response; Default → Transform Message (not-found message) |
| 23 | 95:12 | GET /api/employees/1000 → 200 `{"empId": 1000, "empName": "Suresh", "empSalary": 100000.0, "active": true, "empDesignation": "senior software engineer"}` |
| 24 | 97:23 | GET /api/employees/1000111 → 200 `{"message": "employee details not found in the database"}` |
| 25 | 98:38 | Student's project: "There was an error running build" — mvn clean package fails |
| 26 | 101:19 | Cause: `common-error-handling.xml:8: Global element 'error-handler' does not provide a name attribute` |

---

### 01 — Main flow: Listener → Create Initial Variables → APIkit Router → Remove Variable (Core); Remove Variable needs a variable Name
![remove-variable](01-remove-variable.jpg)

### 02 — Reference sys-app Insert "Create Emp using DB Insert": `insert into EMPLOYEES_INFO values (:emp_id,:emp_name,:emp_status,:emp_salary,:emp_designation)` with input parameters from payload
![insert-input-params](02-insert-input-params.jpg)

### 03 — Reference "Post Final Response Transformation": `{statusCode: 201, message: "employee details created successfully in the db", transactionId: vars.origAttributes.headers.'transaction-id', employeeId: vars.origPayload.empId}`
![post-final-response](03-post-final-response.jpg)

### 04 — Design Center (hr-employees-sapi-7303): editing postResponseExample.json — syntax errors until keys are quoted, and the RAML "should have required property 'message'"
![design-center-example-errors](04-design-center-example-errors.jpg)

### 05 — postResponseDataType.raml gets the new properties (statusCode, message, transactionId, employeeId)
![post-response-datatype](05-post-response-datatype.jpg)

### 06 — Publishing to Exchange: asset version 1.0.1 (1.0.0 published 5 days ago), API version v1, LifeCycle Stable
![publish-exchange-101](06-publish-exchange-101.jpg)

### 07 — Studio pom.xml: the RAML dependency (artifactId hr-employees-sapi-7303, classifier raml, type zip) bumped to version 1.0.1
![pom-version-101](07-pom-version-101.jpg)

### 08 — Router config: API Definition `resource::9756392d-…:hr-employees-sapi-7303:1.0.0:raml:zip:hr-employees-sapi-7303.raml` still on 1.0.0 → deploy fails "Raml not found"
![router-api-definition](08-router-api-definition.jpg)

### 09 — patch-employee-implementation-flow: Update "Update Employee Details in HR DB" — `UPDATE EMPLOYEES_INFO SET emp_salary = :emp_salary, emp_designation = :emp_designation WHERE emp_id= :emp_id`
![update-query](09-update-query.jpg)

### 10 — Postman PATCH (empId 1000, empSalary 100000, empDesignation "senior software engineer") → 200 "employee details updated successfully in the db"
![postman-patch-200](10-postman-patch-200.jpg)

### 11 — Validation **Is number** after the Update: Value `#[payload.affectedRows]`, Min 1, Max 1, Number type INTEGER
![is-number-validation](11-is-number-validation.jpg)

### 12 — Reference sys-app Error Mapping on Is number: VALIDATION:INVALID_NUMBER → DATABASE:NO_DATA_FOUND
![error-mapping](12-error-mapping.jpg)

### 13 — Class project: Error Mapping picker — ANY, VALIDATION:INVALID_NUMBER, EXPRESSION, STREAM_MAXIMUM_SIZE_EXCEEDED; custom error namespace APP
![error-mapping-picker](13-error-mapping-picker.jpg)

### 14 — common-error-handler: On Error Propagate type DATABASE:NO_DATA_FOUND (Error Logger + Final Error Response)
![handler-no-data-found](14-handler-no-data-found.jpg)

### 15 — Debugger for a non-existent empId: error "Employee doesn't exist in HR database", errorType VALIDATION:INVALID_NUMBER
![debugger-invalid-number](15-debugger-invalid-number.jpg)

### 16 — Postman PATCH empId 10000 → 500 `{"statusCode": 500, "message": "Employee doesn't exist in HR database"}`
![postman-patch-not-found](16-postman-patch-not-found.jpg)

### 17 — Reference sys-app fetch flow: Select `select * from EMPLOYEES_INFO where emp_id=:emp_id;`, input parameter `emp_id: attributes.uriParams.empid`
![select-query](17-select-query.jpg)

### 18 — get-employee-implementation-flow: Logger → Select → Logger → "Get Employee Final Response" → Logger
![get-final-response](18-get-final-response.jpg)

### 19 — Playground: Select returns an **array** — mapping `payload[0].empId …`, `active: if(payload[0].emp_status=="active") true else false`
![playground-get-mapping](19-playground-get-mapping.jpg)

### 20 — Postman GET /api/employees/1000 → 200 but every field null except active (mapping used camelCase keys)
![get-nulls](20-get-nulls.jpg)

### 21 — Debugger Evaluate DataWeave: `payload[0].emp_id`, `emp_name`, `emp_salary`, `emp_designation` → correct values
![evaluate-expression](21-evaluate-expression.jpg)

### 22 — Choice router: When `#[!isEmpty(payload)]` → Get Employee Final Response; Default → Transform Message (not-found message)
![choice-isempty](22-choice-isempty.jpg)

### 23 — GET /api/employees/1000 → 200 `{"empId": 1000, "empName": "Suresh", "empSalary": 100000.0, "active": true, "empDesignation": "senior software engineer"}`
![get-200](23-get-200.jpg)

### 24 — GET /api/employees/1000111 → 200 `{"message": "employee details not found in the database"}`
![get-not-found-200](24-get-not-found-200.jpg)

### 25 — Student's project: "There was an error running build" — mvn clean package fails
![student-build-failure](25-student-build-failure.jpg)

### 26 — Cause: `common-error-handling.xml:8: Global element 'error-handler' does not provide a name attribute`
![student-error-handler-name](26-student-error-handler-name.jpg)

