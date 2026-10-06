# Day 40 — Slides and On-Screen Drawings

Screens from the Day 40 class (31 Dec 2024): recording MUnit tests for the PATCH and POST flows, testing the common error handler with mocked errors (APIKIT:BAD_REQUEST, DB:CONNECTIVITY) and asserts, and debugging students' MUnit errors. Repeated and blank frames have been removed. Times are positions in the video.

Notes for this day: [detailed-notes/day40.md](../../detailed-notes/day40.md) · [super-detailed-notes/day40.md](../../super-detailed-notes/day40.md) · [summary](../../day40.md)

| # | Time | Content |
|---|---|---|
| 01 | 0:33 | get-employee-implementation-flow (Before DB Logger → Select → After DB Logger → Choice) — starting point for more MUnit tests |
| 02 | 1:58 | A student's Studio (Mule 4.8.0): test recording fails — "Cannot load class 'javax.activation.MimeTypeParseException'" (classloader issue) |
| 03 | 7:26 | mock_payload.dwl recorded for the GET test — employee 1000 details |
| 04 | 8:48 | patch-employee-implementation-flow: Logger → Update Employee Details in HR DB → Logger → Is number → Update Employee Final Response → Logger |
| 05 | 15:06 | Record test for patch-employee-implementation-flow — Set input and assert output (payload, attributes, variables) |
| 06 | 15:21 | Generated PATCH test: Mock when (Update) + Set Input → Flow-ref → Assert payload |
| 07 | 19:40 | post-employee-implementation-flow: Before HR DB Logger → Create Employee Record in HR DB → After HR DB Logger → Create Employee Final Response |
| 08 | 20:00 | MySQL Workbench: EMPLOYEES_INFO rows used for the POST test |
| 09 | 22:44 | Record test for post-employee-implementation-flow |
| 10 | 29:57 | New MUnit suite hr-employees-sapi-7303-error-test-suite for the error handler |
| 11 | 34:12 | Error test: Execution → Flow-ref to hr-employees-sapi-7303-main |
| 12 | 36:11 | Mock when → Pick a target processor from the flow (e.g. the APIkit Router / DB operation) |
| 13 | 46:05 | common-error-handler: On Error Propagate DATABASE:NO_DATA_FOUND and ANY (Error Logger → Final Error Response); Transform `{message: "Bad request"}` |
| 14 | 46:14 | Mock when → Then return an **error** of type APIKIT:BAD_REQUEST (simulate the router error) |
| 15 | 45:18 | The error test in XML — `munit-tools:mock-when … then-return error typeId="APIKIT:BAD_REQUEST"`, flow-ref to the main flow |
| 16 | 76:21 | Assert equals on the error payload — run fails (1 error): "2 issues found", expected vs actual |
| 17 | 77:31 | Assert equals error message `#[payload.message]` and Assert equals status code `#[vars.httpStatus]` |
| 18 | 79:50 | Debugger: error test for DB:CONNECTIVITY — errorType DB:CONNECTIVITY, InterceptionException, description empty |
| 19 | 86:59 | DB:CONNECTIVITY handler test — payload `{statusCode: 500, message: ""}`; asserts on message and 500 |
| 20 | 94:43 | StackOverflow: "MUnit test case getting InterceptionException error" — set expectedErrorType on the MUnit test |
| 21 | 95:25 | MuleSoft Help Center thread: "Mule 4 MUnit Error" (schema / classloader errors when running MUnit) |
| 22 | 100:37 | Global Configuration Elements while running MUnits (properties, secure properties, mule.env / secure.key global properties) |
| 23 | 102:52 | MUnit run — all tests passed (green), coverage report regenerated |
| 24 | 110:47 | A student's Postman test of the policy-demo-api: GET http://:8081/policy with Basic Auth (client ID / secret as username/password) |
| 25 | 114:54 | Student's pom.xml — app.runtime 4.8.0 vs Studio runtime mismatch while debugging their MUnit error |

---

### 01 — get-employee-implementation-flow (Before DB Logger → Select → After DB Logger → Choice) — starting point for more MUnit tests
![get-flow](01-get-flow.jpg)

### 02 — A student's Studio (Mule 4.8.0): test recording fails — "Cannot load class 'javax.activation.MimeTypeParseException'" (classloader issue)
![student-recording-error](02-student-recording-error.jpg)

### 03 — mock_payload.dwl recorded for the GET test — employee 1000 details
![mock-payload-dwl](03-mock-payload-dwl.jpg)

### 04 — patch-employee-implementation-flow: Logger → Update Employee Details in HR DB → Logger → Is number → Update Employee Final Response → Logger
![patch-flow](04-patch-flow.jpg)

### 05 — Record test for patch-employee-implementation-flow — Set input and assert output (payload, attributes, variables)
![record-patch-test](05-record-patch-test.jpg)

### 06 — Generated PATCH test: Mock when (Update) + Set Input → Flow-ref → Assert payload
![patch-test-generated](06-patch-test-generated.jpg)

### 07 — post-employee-implementation-flow: Before HR DB Logger → Create Employee Record in HR DB → After HR DB Logger → Create Employee Final Response
![post-flow](07-post-flow.jpg)

### 08 — MySQL Workbench: EMPLOYEES_INFO rows used for the POST test
![workbench-rows](08-workbench-rows.jpg)

### 09 — Record test for post-employee-implementation-flow
![record-post-test](09-record-post-test.jpg)

### 10 — New MUnit suite hr-employees-sapi-7303-error-test-suite for the error handler
![error-test-suite](10-error-test-suite.jpg)

### 11 — Error test: Execution → Flow-ref to hr-employees-sapi-7303-main
![main-flow-ref](11-main-flow-ref.jpg)

### 12 — Mock when → Pick a target processor from the flow (e.g. the APIkit Router / DB operation)
![mock-when-processor](12-mock-when-processor.jpg)

### 13 — common-error-handler: On Error Propagate DATABASE:NO_DATA_FOUND and ANY (Error Logger → Final Error Response); Transform `{message: "Bad request"}`
![common-error-handler](13-common-error-handler.jpg)

### 14 — Mock when → Then return an **error** of type APIKIT:BAD_REQUEST (simulate the router error)
![mock-throw-error](14-mock-throw-error.jpg)

### 15 — The error test in XML — `munit-tools:mock-when … then-return error typeId="APIKIT:BAD_REQUEST"`, flow-ref to the main flow
![test-xml](15-test-xml.jpg)

### 16 — Assert equals on the error payload — run fails (1 error): "2 issues found", expected vs actual
![assert-equals-fail](16-assert-equals-fail.jpg)

### 17 — Assert equals error message `#[payload.message]` and Assert equals status code `#[vars.httpStatus]`
![assert-error-message](17-assert-error-message.jpg)

### 18 — Debugger: error test for DB:CONNECTIVITY — errorType DB:CONNECTIVITY, InterceptionException, description empty
![debugger-db-connectivity](18-debugger-db-connectivity.jpg)

### 19 — DB:CONNECTIVITY handler test — payload `{statusCode: 500, message: ""}`; asserts on message and 500
![connectivity-assert](19-connectivity-assert.jpg)

### 20 — StackOverflow: "MUnit test case getting InterceptionException error" — set expectedErrorType on the MUnit test
![stackoverflow-mock-error](20-stackoverflow-mock-error.jpg)

### 21 — MuleSoft Help Center thread: "Mule 4 MUnit Error" (schema / classloader errors when running MUnit)
![mule-forum](21-mule-forum.jpg)

### 22 — Global Configuration Elements while running MUnits (properties, secure properties, mule.env / secure.key global properties)
![global-elements-test](22-global-elements-test.jpg)

### 23 — MUnit run — all tests passed (green), coverage report regenerated
![suite-success](23-suite-success.jpg)

### 24 — A student's Postman test of the policy-demo-api: GET http://:8081/policy with Basic Auth (client ID / secret as username/password)
![student-basic-auth](24-student-basic-auth.jpg)

### 25 — Student's pom.xml — app.runtime 4.8.0 vs Studio runtime mismatch while debugging their MUnit error
![student-pom](25-student-pom.jpg)

