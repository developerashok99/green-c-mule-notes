# Day 39 — MUnit Introduction: Unit Testing, Coverage and Recording a Test for the GET Flow (Hands-On)

> **Sources:**
> - Cleaned audio transcript ([transcripts-cleaned/day39.txt](../transcripts-cleaned/day39.txt)) and the class video (recorded 30 Dec 2024).
> - Text marked *screen*, *slide* or *drawing* is read from the recording.
> - Slide images: [slides/day39](../slides/day39/).

## 1. Overview

1. What is **MUnit**?
2. Unit testing explained with a car-manufacturing example
3. Unit testing vs. QA/SIT testing; environments
4. MUnit in the **CI/CD pipeline** and **coverage percentage**
5. Recording vs. manual tests
6. Components of an MUnit test — **Behaviour, Execution, Validation**
7. MUnit capabilities — mock, spy, verify, ignore, tags, coverage report
8. Project structure — `src/test/munit`, `src/test/resources`
9. Hands-on: recording a test for the GET flow
10. The generated test — mock, Set Event, assert
11. Debugging, MUnit Errors view and test timeout
12. Running, coverage report, a second test for the implementation flow
13. Interview relevance; Q&A (JWT, Azure OAuth)

---

## 2. What Is MUnit?

*Slide:* "a Mule application testing framework for automated tests of integrations and APIs; full suite of integration and unit test capabilities, integrated with Maven for CI/CD".

- An **application testing framework** provided by MuleSoft.
- A framework = everything is ready for us, which reduces our work.
- Used to create **automated tests** for applications, integrations and APIs.
- Fully integrated with **Maven** — so it runs easily in the CI/CD pipeline.
- Java has **JUnit**; Mule is Java-based, so MuleSoft created **MUnit**.

**Two ways to create tests:**

| Way | Notes |
|---|---|
| **Recording** | Mule **4.3 and above**; used most of the time |
| **Manual** | Needed for error/failure scenarios |

- In practice a combination of both is used.

---

## 3. Unit Testing — Car Example

1. A car is built from many parts: steering, gearbox, engine, seats, body, brakes, tyres…
2. Each part is tested **individually** (some are even outsourced).
3. The parts are assembled and the whole car is tested.
4. If the tyres fail, replace them and test again.
5. Then it goes to the sales office.

**In MuleSoft:**

- An API has many individual flows.
- The developer creates tests (recorded or manual) for those flows and runs them.
- *Drawing:* developer → MuleSoft → MUnit (unit test); then assembly → QA testing (SIT).

---

## 4. Unit Testing vs. QA Testing

**Example ecosystem:** experience API → process API → three system APIs; five developers, one API each. Each developer unit-tests their own API.

**Q (student): The testing team does integration testing anyway — why unit tests?**

- When you make a small change later, running all the tests shows whether it affected anything else.
- That's the developer's responsibility, not the testing team's.

**QA team (SIT):** checks the whole integration (experience → process → system):

- Success and error responses
- Bad data
- What the consumer gets if one or more systems are down, or the process API is down

**Environments:**

1. **SIT** (also called testing / QA environment)
2. **UAT** — User Acceptance Testing
3. Performance testing
4. **Production**

---

## 5. MUnit in the CI/CD Pipeline

*Drawing:* CI/CD pipeline (DevOps team) — **Jenkins** or **Bamboo**: code → build → MUnit (≥ 80% coverage) → deploy.

- A pipeline is a set of automated steps ending in deployment.
- **Jenkins** is widely used (open source); GitHub, Bitbucket, Azure and AWS also provide pipelines.
- The **DevOps team** usually creates pipelines.
- **Instructor's experience:** he knows how to trigger a pipeline and check logs on failure; basic knowledge helps him pick up new things faster.

**Minimum steps:**

1. Push code to the repository.
2. Run the tests.
3. Build and publish the jar to a repository.
4. One step is **MUnit**.

### 5.1 Coverage percentage

- The org sets a benchmark — e.g. **80%** or 90%.
- If coverage is met and all tests pass, the pipeline moves on; otherwise the **deployment fails**.
- **Coverage = components touched by the tests ÷ total components.**

| Example | Coverage | Benchmark 80% |
|---|---|---|
| 30 of 40 components covered | 75% | **Fails** |
| Add tests → 35 of 40 | 87.5% | Passes |

- That's why multiple tests are created — to touch all components (main flow, resource flows, implementation flows, error handler).

---

## 6. Recording vs. Manual

*Drawing:* MUnit — record or write manually; success cases, not only failure cases.

- **Success** cases → recording option.
- **Failure** cases → recording doesn't work, so create them **manually**.
- MuleSoft plans to support error scenarios in recording in future.

---

## 7. Components of an MUnit Test

*Slide:* Execution (run the flow with the input event), Behaviour (define the test behaviour), Validation (validate the result).

Like a flow has source, process and error sections, a test has three:

| Section | Purpose |
|---|---|
| **Behaviour** | Defines how things behave while the test runs (mocks, inputs) |
| **Execution** | Triggers the flow with the required input event |
| **Validation** | Holds the expected output; pass if the result matches, fail otherwise |

- Manually, a tester triggers input in Postman and checks the response by eye.
- MUnit automates it: input and expected output are both defined; a failure means find out why and fix.

---

## 8. MUnit Capabilities

- Create automated tests manually or by recording.
- MUnit has its own **components** (message processors):

| Processor | Meaning |
|---|---|
| **Mock** | Behaves like the real component and gives the same result, without the actual call (like a mock interview) — used the most |
| **Spy** | Stands aside and watches whether the process is happening correctly |
| **Verify** | Used in the validation section |

- **Ignore** a test (e.g. skip 2 of 10).
- **Tag** tests (e.g. error vs. success scenarios).
- **Coverage report** — see the percentage visually in Studio.

---

## 9. Project Structure

| Folder | Holds |
|---|---|
| `src/main/mule` | Flows |
| `src/main/resources` | Property files, logging, DataWeave files |
| `src/test/munit` | **Test cases** |
| `src/test/resources` | **Test resources and inputs** (also has its own `log4j2`) |

- Categorizing makes files easy to identify; MuleSoft creates the structure.
- Mule 4 projects are **Mavenized** by default; Mule 3 weren't.
- **Instructor's view:** interviews in 2021–22 asked Mule 3 vs 4; now they ask CloudHub 1.0 vs 2.0.

---

## 10. Hands-On: Preparing to Record

*Screen:* hr-employees-sapi-7303 — main flow, implementation flows (post / patch / get).

*Screen:* `pom.xml` before MUnit — groupId `com.mycompany`, `app.runtime` 4.4.0, mule maven plugin 3.5.4 — searching "munit" → *String not found*.

**Right-click the flow → MUnit:**

- **Record test for this flow** — recording option.
- **Create blank test for this flow** — manual option.
- Choosing one adds the MUnit dependencies automatically.

### 10.1 Get the input ready

- After the pop-up you have about **1–2 minutes** to send the input, else start again.
- Postman pointed to CloudHub — wrong for local recording.
  - Add a folder **local** → Save As → `GET http://localhost:8081/api/employees/1000` → *screen:* 200, employee 1000.

**Request path:** Listener → APIkit Router → GET flow → Logger → Transform Message → Flow Reference (implementation) → back → Listener.

### 10.2 Problems hit and fixes

1. "No listener for endpoint" — the API path had been cleared; **test the app first** before recording.
2. **Run configuration for MUnit:** Run Configurations → MUnit → test recording configuration for the project.
   - *Screen:* Arguments `-M-Dmule.env=dev -M-Dsecure.key=…` (variables passed with `-D`).
   - *Screen:* `config/dev.yaml` — listener `0.0.0.0:8081`, `api/*`, database localhost, encrypted credentials, `autodiscovery.id`.
3. *Screen:* in `globall-config.xml`, the **API Autodiscovery** element was **commented out** to run locally without the platform.
   - A student: in his current organization it's disabled locally but runs in the pipeline.
4. The database wasn't available at first — fixed, then recorded.

### 10.3 Recording

1. Right-click the GET flow → MUnit → **Record test for this flow**.
2. The app deploys; a pop-up waits for input.
3. Hit the request in Postman — the input is recorded.

- Recording happens **only if the request completes successfully** — if the DB fails mid-way, recording fails.

---

## 11. Configuring the Recorded Test

*Screen:* New Recorded Test wizard — **file name** and **test name**.

- Test name = flow name + `-test`.
- File name = the API's XML name + **`-suite`**.
- A **suite** = a set of test cases; all tests for that XML go into it.
- You can pick an existing suite from the drop-down.
- The test is for the **GET flow only** (where you right-clicked), not the listener flow.

### 11.1 Why mock the Flow Reference

*Screen:* "Set input and assert output".

1. Locally, Studio and the database (localhost) are connected.
2. In **Jenkins**, the MUnit step runs the flow — but Jenkins has **no DB connectivity**.
3. The DB call fails → the test fails.
4. So **mock the Flow Reference**: use the recorded input/response instead of going into the flow.

*Screen — preview:* test `get:employees(empid):hr-employees-sapi-7303-config-test`:

```text
Behavior   : Mock when (flow reference) + Set Input (Set Event)
Execution  : Flow Reference (the GET flow)
Validation : Assert payload
```

- Finish → a suite file appears in `src/test/munit`.
- MUnit components appear in the palette only inside an MUnit test (once MUnit is added).

---

## 12. What Got Generated

### 12.1 pom.xml

*Screen:* `munit-runner` and `munit-tools` **2.3.9** (scope `test`) and the **munit-maven-plugin**.

- `munit-tools` has the components used in tests.

### 12.2 Set Input / Set Event

- **Set Event** sets an **event** = payload + attributes + variables (+ error).
- It can be in the behaviour or execution section — automatic recording puts it in behaviour; manual testers sometimes put it in execution.
- Values use `readUrl` with `classpath` → files in `src/test/resources/<test folder>/`:
  - `set-event_payload.dwl` — empty string (GET has no body).
  - `set-event_attributes.dwl` — *screen:* recorded headers (transaction-id, origin, language…), method GET, requestUri `/api/employees/1000`; URI params set, query params empty.
  - Variables — *screen:* `headers`, `outboundHeaders` (ignore), `queryParams`, `requestPayload`, `startTime`, `uriParams` — each from a `set-event_variable_N.dwl` (output `application/java`); only `startTime` had a value.
  - `mock_payload.dwl`, mock variables.

*Screen — mock_payload.dwl:*

```json
{
  "empId": 1000,
  "empName": "Suresh",
  "empSalary": 100000.0,
  "active": true,
  "empDesignation": "senior software engineer"
}
```

- This is what the flow reference returned when recorded; the mock returns it without executing the flow.

### 12.3 Assert

*Screen:*

```dataweave
import getemployeeimplementationflowtest::assert_expression_payload
---
assert_expression_payload::main({payload: payload, attributes: attributes, vars: vars})
```

- **Assert Expression** compares the final payload (and attributes/vars) against the expected one.
- **Assert That** checks a single thing — covered later.

---

## 13. Debugging and Timeout

1. Right-click → **Debug** — no breakpoint needed; it stops automatically.
2. Step with Next → into the GET flow; the flow reference doesn't execute — the mock's payload is used.
3. The MUnit tab turned **red** — an error.
4. **Window → Show View → Other → MUnit Errors** → the error: **timeout 120,000 ms** (2 minutes) — debugging took longer.
5. Click the test → **Test timeout** (ms), default 1,20,000 — e.g. 2,40,000 for 4 minutes on a big test.

---

## 14. Running and Coverage

- Right-click white space → **Run MUnit suite** → *screen:* **Tests run: 1, Failed: 0, Errors: 0**.
- Covered processors show **green tick marks** in the flow; the implementation flow isn't covered (mocked).
- **MUnit Coverage → Show coverage / Generate report** → *screen:* overall **9.52%**, per-flow breakdown.

### 14.1 Second test — the implementation flow

- *Screen:* recorded test for get-employee-implementation-flow (Choice: data found / not found).
- It creates a **different suite file** — because it's a different XML file.
- Mock **all external calls** — select the database call → **Mock this processor** (default: payload and variables mocked).
  - We mocked the flow reference earlier because it would lead to the external calls.
- Another resource folder appears in `src/test/resources`.

**Covering both Choice paths:**

1. The first test went through one route.
2. Record another for the **default** route — put "default" in the test name.
3. Run both → green, errors 0, failures 0.
4. GET implementation flow goes from ~83.3% to **100%**.

- Overall coverage after this: **14.2%** — only GET done.
- Next: other GET parts, POST success, error scenarios (manual), running all tests and coverage.

---

## 15. Interview Relevance

- **Instructor's experience:** few interviewers ask — maybe 3 in 10: what MUnit is, components used, structure.
- In real projects you **must** write MUnit tests for each flow.

**Q&A (end of class):**

- *Screen:* a student's JWT validation log — "Token signature is not trusted" → **401** (`WWW-Authenticate: Bearer`).
- *Screen:* Postman — Azure OAuth token (client_id, client_secret, grant_type client_credentials, scope `https://graph.microsoft.com/.default`).
- If the token has an invalid signature, it's rejected.

---

## 16. Important Terminology

| Term | Meaning |
|---|---|
| MUnit | MuleSoft's testing framework for Mule apps |
| Unit test | Test of an individual flow/component by the developer |
| SIT / UAT | System integration testing (QA) / user acceptance testing |
| Coverage | Covered components ÷ total components |
| Suite | File holding a set of tests (`<xml>-suite`) |
| Behaviour / Execution / Validation | The three sections of a test |
| Mock | Fakes a processor's result without the real call |
| Spy / Verify | Watch the process / verify in validation |
| Set Event | Sets payload, attributes and variables as input |
| Assert Expression / Assert That | Compare result to expected / check one thing |
| munit-runner, munit-tools | Test-scope dependencies added to the pom |

---

## 17. Interview Questions

### Q1. What is MUnit?
MuleSoft's testing framework for automated unit/integration tests of Mule applications, integrated with Maven so it runs in CI/CD.

### Q2. What are the sections of an MUnit test?
Behaviour (mocks and inputs), Execution (runs the flow) and Validation (asserts the result).

### Q3. How is MUnit coverage calculated, and why does it matter?
Components touched by tests divided by total components. The pipeline enforces a benchmark (e.g. 80%); below it, the deployment fails.

### Q4. Recording vs. manual tests?
Recording (Mule 4.3+) captures a successful run's inputs and responses; error scenarios must be written manually.

### Q5. Why mock external calls?
The pipeline (e.g. Jenkins) usually has no connectivity to databases or other systems; mocking returns the recorded response so the test doesn't depend on them.

### Q6. Where do MUnit tests and their resources live?
`src/test/munit` and `src/test/resources`.

### Q7. What dependencies does MUnit add?
`munit-runner` and `munit-tools` (test scope) and the `munit-maven-plugin`.

---

## 18. Must Remember

1. MUnit = Mule's test framework; Maven-integrated.
2. Behaviour → Execution → Validation.
3. Coverage = covered ÷ total components; below the benchmark the pipeline fails.
4. Record success cases (Mule 4.3+); write error cases manually.
5. Recording works only if the request completes successfully.
6. Mock external calls (and flow references leading to them).
7. Set Event = payload + attributes + variables, read from `.dwl` files via `readUrl(classpath)`.
8. Suite name = XML name + `-suite`; a different XML → a different suite.
9. Default test timeout = 120,000 ms.
10. Cover every Choice route with its own test.
