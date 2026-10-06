# Day 39 — Slides and On-Screen Drawings

Screens from the Day 39 class (30 Dec 2024): what MUnit is, recording an MUnit test for the GET flow, the generated test (mock, set input, assert), running it and the coverage report, plus a Q&A on JWT and Azure OAuth. Repeated and blank frames have been removed. Times are positions in the video.

Notes for this day: [detailed-notes/day39.md](../../detailed-notes/day39.md) · [super-detailed-notes/day39.md](../../super-detailed-notes/day39.md) · [summary](../../day39.md)

| # | Time | Content |
|---|---|---|
| 01 | 0:01 | Agenda: What is MUnit? Components of an MUnit test, capabilities of MUnit |
| 02 | 0:44 | What is MUnit? — a Mule application testing framework for automated tests of integrations and APIs; full suite of integration and unit test capabilities, integrated with Maven for CI/CD |
| 03 | 19:03 | *Drawing:* developer → MuleSoft → MUnit (unit test); then assembly → QA testing (SIT) → shown flow of stages |
| 04 | 11:05 | *Drawing:* CI/CD pipeline (DevOps team) — Jenkins or Bamboo: code → build → MUnit (≥ 80% coverage) → deploy |
| 05 | 21:01 | Components of an MUnit test — Execution (run the flow with the input event), Behaviour (define the test behaviour), Validation (validate the result) |
| 06 | 19:04 | *Drawing:* MUnit — record or write manually; success cases, not only failure cases |
| 07 | 38:11 | hr-employees-sapi-7303 in Studio: main flow, implementation flows (post / patch / get) |
| 08 | 39:42 | pom.xml before adding MUnit — groupId com.mycompany, app.runtime 4.4.0, mule maven plugin 3.5.4 |
| 09 | 46:20 | Run the project (get flow) locally before recording the test |
| 10 | 47:38 | Postman GET http://localhost:8081/api/employees/1000 → 200 employee 1000 |
| 11 | 48:32 | config/dev.yaml — listener 0.0.0.0:8081 api/*, database localhost 330 mule12, encrypted credentials, autodiscovery.id |
| 12 | 49:43 | Run Configurations → Arguments: -M-Dmule.env=dev -M-Dsecure.key=… |
| 13 | 56:10 | globall-config.xml — the API Autodiscovery element (commented out to run locally without the platform) |
| 14 | 58:57 | Right-click flow → MUnit → **Record test for this flow**: New Recorded Test wizard (file name, test name) |
| 15 | 60:53 | Configure Test — "Set input and assert output": the recorded payload / attributes / variables become the test input |
| 16 | 67:09 | Generated test get:employees(empid):hr-employees-sapi-7303-config-test — Behavior: Mock when + Set Input; Execution: Flow Reference; Validation: Assert payload |
| 17 | 69:24 | pom.xml now has munit-runner and munit-tools 2.3.9 (scope test) and the munit-maven-plugin |
| 18 | 77:01 | src/test/resources/…/set-event_attributes.dwl — recorded headers (transaction-id, origin, language …), method GET, requestUri /api/employees/1000 |
| 19 | 77:47 | Set Input → Variables: headers, outboundHeaders, queryParams, requestPayload, startTime read from the recorded .dwl files |
| 20 | 81:08 | Recorded attributes headers file (transaction-id abcdefgh-jxbv8599-sjdf762-3746bb …) |
| 21 | 86:11 | mock_payload.dwl — mocked response { empId 1000, empName Suresh, empSalary 100000.0, active true, empDesignation "senior software engineer" } |
| 22 | 91:04 | Run the MUnit suite → **Tests run: 1, Failed: 0, Errors: 0** (SUCCESS) |
| 23 | 92:03 | MUnit Coverage → Generate Report: overall coverage 9.52% (per-flow breakdown) |
| 24 | 96:21 | Assert payload: `import getemployeeimplementationflowtest::assert_expression_payload` / `assert_expression_payload::main({payload, attributes, vars})` |
| 25 | 101:43 | A second recorded test for get-employee-implementation-flow (Choice: data found / not found) |
| 26 | 106:30 | Q&A — a student's JWT validation log: "Token signature is not trusted" → 401 (WWW-Authenticate: Bearer) |
| 27 | 107:23 | Q&A — Postman: Azure OAuth token (client_id, client_secret, grant_type client_credentials, scope https://graph.microsoft.com/.default) |

---

### 01 — Agenda: What is MUnit? Components of an MUnit test, capabilities of MUnit
![agenda](01-agenda.jpg)

### 02 — What is MUnit? — a Mule application testing framework for automated tests of integrations and APIs; full suite of integration and unit test capabilities, integrated with Maven for CI/CD
![what-is-munit](02-what-is-munit.jpg)

### 03 — *Drawing:* developer → MuleSoft → MUnit (unit test); then assembly → QA testing (SIT) → shown flow of stages
![drawing-testing-flow](03-drawing-testing-flow.jpg)

### 04 — *Drawing:* CI/CD pipeline (DevOps team) — Jenkins or Bamboo: code → build → MUnit (≥ 80% coverage) → deploy
![drawing-cicd-pipeline](04-drawing-cicd-pipeline.jpg)

### 05 — Components of an MUnit test — Execution (run the flow with the input event), Behaviour (define the test behaviour), Validation (validate the result)
![munit-components](05-munit-components.jpg)

### 06 — *Drawing:* MUnit — record or write manually; success cases, not only failure cases
![drawing-record](06-drawing-record.jpg)

### 07 — hr-employees-sapi-7303 in Studio: main flow, implementation flows (post / patch / get)
![project-flows](07-project-flows.jpg)

### 08 — pom.xml before adding MUnit — groupId com.mycompany, app.runtime 4.4.0, mule maven plugin 3.5.4
![pom-before](08-pom-before.jpg)

### 09 — Run the project (get flow) locally before recording the test
![run-project](09-run-project.jpg)

### 10 — Postman GET http://localhost:8081/api/employees/1000 → 200 employee 1000
![postman-local-get](10-postman-local-get.jpg)

### 11 — config/dev.yaml — listener 0.0.0.0:8081 api/*, database localhost 330 mule12, encrypted credentials, autodiscovery.id
![dev-yaml](11-dev-yaml.jpg)

### 12 — Run Configurations → Arguments: -M-Dmule.env=dev -M-Dsecure.key=…
![run-configurations](12-run-configurations.jpg)

### 13 — globall-config.xml — the API Autodiscovery element (commented out to run locally without the platform)
![global-config-autodiscovery](13-global-config-autodiscovery.jpg)

### 14 — Right-click flow → MUnit → **Record test for this flow**: New Recorded Test wizard (file name, test name)
![record-test-welcome](14-record-test-welcome.jpg)

### 15 — Configure Test — "Set input and assert output": the recorded payload / attributes / variables become the test input
![record-set-input](15-record-set-input.jpg)

### 16 — Generated test get:employees(empid):hr-employees-sapi-7303-config-test — Behavior: Mock when + Set Input; Execution: Flow Reference; Validation: Assert payload
![recorded-test](16-recorded-test.jpg)

### 17 — pom.xml now has munit-runner and munit-tools 2.3.9 (scope test) and the munit-maven-plugin
![pom-munit-deps](17-pom-munit-deps.jpg)

### 18 — src/test/resources/…/set-event_attributes.dwl — recorded headers (transaction-id, origin, language …), method GET, requestUri /api/employees/1000
![set-event-attributes](18-set-event-attributes.jpg)

### 19 — Set Input → Variables: headers, outboundHeaders, queryParams, requestPayload, startTime read from the recorded .dwl files
![set-input-variables](19-set-input-variables.jpg)

### 20 — Recorded attributes headers file (transaction-id abcdefgh-jxbv8599-sjdf762-3746bb …)
![recorded-headers](20-recorded-headers.jpg)

### 21 — mock_payload.dwl — mocked response { empId 1000, empName Suresh, empSalary 100000.0, active true, empDesignation "senior software engineer" }
![mock-payload](21-mock-payload.jpg)

### 22 — Run the MUnit suite → **Tests run: 1, Failed: 0, Errors: 0** (SUCCESS)
![munit-success](22-munit-success.jpg)

### 23 — MUnit Coverage → Generate Report: overall coverage 9.52% (per-flow breakdown)
![coverage-report](23-coverage-report.jpg)

### 24 — Assert payload: `import getemployeeimplementationflowtest::assert_expression_payload` / `assert_expression_payload::main({payload, attributes, vars})`
![assert-payload](24-assert-payload.jpg)

### 25 — A second recorded test for get-employee-implementation-flow (Choice: data found / not found)
![second-test](25-second-test.jpg)

### 26 — Q&A — a student's JWT validation log: "Token signature is not trusted" → 401 (WWW-Authenticate: Bearer)
![jwt-error-doc](26-jwt-error-doc.jpg)

### 27 — Q&A — Postman: Azure OAuth token (client_id, client_secret, grant_type client_credentials, scope https://graph.microsoft.com/.default)
![azure-oauth](27-azure-oauth.jpg)

