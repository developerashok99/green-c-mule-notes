# Day 40 — MUnit Continued: PATCH and POST Tests, Error-Handler Tests with Mocked Errors, Asserts and Full-Suite Coverage (Hands-On)

> **Sources:**
> - Cleaned audio transcript ([transcripts-cleaned/day40.txt](../transcripts-cleaned/day40.txt)) and the class video (recorded 31 Dec 2024).
> - Text marked *screen* is read from the recording.
> - Slide images: [slides/day40](../slides/day40/).

## 1. Overview

1. A student's recording error (`MimeTypeParseException`)
2. Recap — what the recording created for GET
3. Recording tests for **PATCH** (main flow + implementation flow)
4. Recording tests for **POST** — a new ID for each recording
5. How a database mock replays the response
6. **Error-handler tests** — blank test, Mock when → raise an error
7. Expected error type; copying a test for each error type
8. Running the error suite, ignore/enable tests
9. Validating message and status with **Assert equals**; reusing a recorded Set Event
10. The DB:CONNECTIVITY test that failed (InterceptionException)
11. Running **all suites** — run configuration, coverage report 100%
12. Debugging the student's error

---

## 2. A Student's Recording Error

- *Screen:* a student's Studio (Mule **4.8.0**): test recording fails — *"Cannot load class 'javax.activation.MimeTypeParseException'"* (classloader issue).
- The app ran normally and answered Postman; only recording failed.
- Checked the run configuration → **test recording** entry; resolved at the end of class (section 13).

---

## 3. Recap — What Recording Creates

- `src/test/resources` gets a small folder **per test**, with mock variables, payloads etc.
- The recording captures everything — don't worry about how many files it creates; you don't have to write them by hand.
- *Screen:* `mock_payload.dwl` for the GET test — employee 1000 details.
- GET so far: **three tests** — main GET flow, implementation flow regular route, implementation flow default route.

---

## 4. PATCH Tests

*Screen:* patch-employee-implementation-flow: Logger → Update Employee Details in HR DB → Logger → Is number → Update Employee Final Response → Logger.

1. In Postman, **Save As** the PATCH request into the **local** folder; change the URL to localhost.
2. **Main XML PATCH flow:** right-click → MUnit → Record test for this flow → hit the request.
   - Same suite as the main XML; names unchanged.
   - **Mock the flow reference** — don't make the actual call.
3. **PATCH implementation flow:** record again with the same request.
   - Mock **"Update employee details in HR DB"**.
   - A separate XML → a **separate suite file**.

*Screen:* generated PATCH test — Mock when (Update) + Set Input → Flow-ref → Assert payload.

---

## 5. POST Tests

*Screen:* post-employee-implementation-flow: Before HR DB Logger → Create Employee Record in HR DB → After HR DB Logger → Create Employee Final Response.

- An insert can't use the **same request twice** — the second insert errors and the recording fails.
- Use one ID for the main-flow recording and another for the implementation flow.
- *Screen:* MySQL Workbench — `EMPLOYEES_INFO` rows (or check with GET).

| Recording | Employee ID | Mock |
|---|---|---|
| Main POST flow | **1050** | Flow reference |
| POST implementation flow | **1051** | Create DB processor |

**Q (student): If it's mocked, does the recording still hit the DB?**

- Yes — recording only captures what **actually ran successfully**, so the flow executes during recording.
- When the test runs later, the mocked processor isn't called.

---

## 6. How a Database Mock Works

1. During recording, the DB connector's response is saved.
2. In the test's **behaviour** section, **Mock when** says "don't call it — use this".
3. The mock's payload = the DB response, loaded from `classpath` → `post-employees-implementation-flow-test/mock_payload.dwl` in `src/test/resources`.
4. So the test never goes to the database.

---

## 7. Error-Handler Tests (Manual)

- Error handling **can't be recorded** — do it manually.

### 7.1 Create a blank test

1. Main XML → right-click the main flow → MUnit → **Create blank test for this flow**.
2. A separate XML is created — behaviour and validation empty, execution has a **Flow Reference** to the main flow.
3. Alternative: drag the MUnit **Test** component from the palette, then a flow reference — more steps.
4. Rename the test **`apikit-bad-request-test`**.
5. Rename the suite to **`hr-employees-sapi-7303-error-test-suite`** — for better organizing (*screen*).

- MUnit and MUnit Tools palettes are visible only when an MUnit test exists.

### 7.2 Where the flow reference lands

*Screen:* Execution → Flow-ref to `hr-employees-sapi-7303-main`.

- A flow reference to a flow with a source goes to the **first component of the process section**, not the source.
- So it starts at the **APIkit Router** — no need to hit the listener.

### 7.3 Raising an error with Mock when

1. Drag **Mock when** (MUnit Tools) into behaviour.
2. *Screen:* **Pick a target processor** — collapse the flows, go to the main flow → APIkit Router.
3. Choose the attribute — **config reference** (doc ID is also possible).
4. Mock when has **payload, attributes and error** sections — set an **error type ID** in the error section to raise it.
5. *Screen:* common-error-handler — On Error Propagate types incl. `APIKIT:BAD_REQUEST`, `DATABASE:NO_DATA_FOUND`, `ANY` (Error Logger → Final Error Response; Transform `{message: "Bad request"}`).
6. Copy `APIKIT:BAD_REQUEST` → paste in the Mock when error type → **save** (the picked processor was lost once because it wasn't saved).

*Screen — the test in XML (shape):*

```xml
<munit:test name="apikit-bad-request-test" expectedErrorType="APIKIT:BAD_REQUEST">
  <munit:behavior>
    <munit-tools:mock-when processor="apikit:router">
      <munit-tools:with-attributes>
        <munit-tools:with-attribute attributeName="config-ref" whereValue="…"/>
      </munit-tools:with-attributes>
      <munit-tools:then-return>
        <munit-tools:error typeId="APIKIT:BAD_REQUEST"/>
      </munit-tools:then-return>
    </munit-tools:mock-when>
  </munit:behavior>
  <munit:execution>
    <flow-ref name="hr-employees-sapi-7303-main"/>
  </munit:execution>
</munit:test>
```

### 7.4 Expected error type (the simple hack)

- Click the test → **Expected error type** = `APIKIT:BAD_REQUEST`.
- Since it's an error test, getting the **same** error = pass.
- A simple test with two components.

**Debug walk-through:**

1. Main flow → APIkit Router → the mock raises `APIKIT:BAD_REQUEST`.
2. It goes to the matching handler in the common error handler and executes.
3. The error type matches the expected error type → **test succeeds**.
4. The error handler now shows as covered.

### 7.5 One test per error type

1. Open the XML; the test is lines 11–25 (`<munit:test>` to its end tag).
2. Copy and paste it **nine** times; accept new doc IDs.
3. Errors appear — duplicate test names.
4. For each copy, in the **UI**: change the test name, the Mock when error type and the expected error type.
   - `APIKIT:NOT_FOUND`, unsupported media type, `APIKIT:NOT_IMPLEMENTED`, the DB errors, `ANY`…

> **Instructor's suggestion:** use the XML only for copying; edit in the UI — in XML you must check every bracket and double quote.

---

## 8. Running the Error Suite

- Right-click → **Run MUnit suite** → **10 tests**, errors 0, failures 0 — all green.
- Error handler coverage **100%**; overall **38%**.

**Ignore / enable:**

| Option | Effect |
|---|---|
| Right-click → **Ignore test** | That test doesn't run |
| **Enable test** | Runs again |
| **Ignore other tests** | Only this one runs |

---

## 9. Validating Message and Status Code

Instead of only the expected error type, check the **error message** and **status code**.

### 9.1 Inputs for a manual test

**Q (student): Variables and Transform Message get null without input — does the flow fail?**

- No — that's why it works without a **Set Event**.
- If components do need input, add **Set Event** (MUnit palette, not MUnit Tools) in behaviour or execution.
- **Hack:** don't write `readUrl` by hand — **record a test for the flow** (any request, e.g. POST with ID **1052**) and **copy its Set Event**.
  - Make sure you open the right recorded files (the 7303 main test's `set-event_payload` / `set-event_attributes`, not the GET test's).
- For this error test the Set Event wasn't needed after all.

### 9.2 Assert equals

- Validation options: **Assert expression** (payload/attributes/vars — complicated), **Assert that**, **Assert equals**.
- **Assert equals** = actual vs. expected.

*Screen:*

```text
Assert equals  actual: #[payload.message]   expected: <error message from the handler>
Assert equals  actual: #[vars.httpStatus]   expected: 500
```

- For DB:CONNECTIVITY the common error handler returns **500**.
- The expected value can also be kept in a `.dwl` file under `src/test/resources` and read with `readUrl`, like Set Event does.
- If an assert fails, it shows the message — *screen:* "2 issues found", expected vs. actual.

---

## 10. The DB:CONNECTIVITY Test That Failed

- *Screen:* debugger — errorType **DB:CONNECTIVITY**, **InterceptionException**, description empty.
- Without validation or expected error type → the test **errors**.
- With the two asserts it still failed with the interception error.
- *Screen:* payload `{statusCode: 500, message: ""}` — empty string vs. null mismatch; changed expected to empty — still failing.
- Found a wrong expression — corrected to **`vars.httpStatus`**.
- Commented out (Ctrl+Shift+/) and then **deleted** the test; the instructor will investigate.
- *Screen:* StackOverflow — "MUnit test case getting InterceptionException error" (suggests `expectedErrorType`); *screen:* MuleSoft Help Center "Mule 4 MUnit Error" — not the same issue.

**When an error message is unclear:** go back to basics — check the raised error type, the expected error type and the validation.

---

## 11. Running All Suites

1. **Run Configurations → MUnit →** the app (7303) is preselected.
2. Provide `mule.env` and `secure.key`.
3. Only the **error test suite** was listed on the right — kept from the previous run of a single suite.
4. **Remove it** — empty = **all suites, all tests** (and all test resources). Apply.

- *Screen:* Global Configuration Elements — `mule.env` / `secure.key` were set as **global properties**, so it works even without them in the run configuration; without either, MUnit runs would have failed.

**Result:**

- *Screen:* **18 tests**, all green (ignore the warnings); a red one = failed.
- **MUnit Coverage → Generate report → 100%**.

### 11.1 Reading the report

| Column | Meaning |
|---|---|
| Containers | Flows (one container = one flow) |
| Weight | This XML's components ÷ the whole project's components (e.g. 14%, 9.52%) |
| Coverage | Percentage of this XML's components covered |

- Main XML: APIkit router flow + post, patch, get = 4 flows, 100%.
- Common error handler: 100%.
- The **Choice** itself isn't counted as a component.
- Real big projects rarely reach 100%; **at least 80%** is fine.

> **Instructor's view:** in real time MUnit is compulsory — almost no project is without it. Practice it.

---

## 12. Student Q&A

- *Screen:* a student's Postman test of policy-demo-api — `GET http://…:8081/policy` with **Basic Auth** (client ID / secret as username/password).

---

## 13. Debugging the Student's Error

- Checked the test recording run configuration and Autodiscovery (comment it out if present).
- Same error on any flow: *"Cannot load class … MimeTypeParseException"*.
- No MUnit dependencies in the pom yet — the test was never created.
- *Screen:* student's `pom.xml` — `app.runtime` **4.8.0** vs. the Studio runtime (mismatch).
- Left to continue on Monday.

---

## 14. Important Terminology

| Term | Meaning |
|---|---|
| Blank test | Manually built test with an empty behaviour/validation and a flow-ref |
| Mock when | Replaces a processor's result — payload, attributes or an error |
| Pick target processor | Choosing which processor Mock when replaces (by config-ref / doc ID) |
| Expected error type | Test attribute — pass if the flow raises this error |
| Assert equals | Validation comparing an actual expression with an expected value |
| Set Event | Sets payload/attributes/variables for a test |
| Ignore test | Skip a test in a run |
| Weight (coverage report) | Share of the project's components in one XML |

---

## 15. Interview Questions

### Q1. Can error scenarios be recorded?
No. Recording captures only successful runs; error tests are built manually with Mock when raising an error.

### Q2. How do you test an error handler?
Create a blank test with a flow-ref to the main flow, mock the APIkit Router (or DB processor) to return an error type, and set the test's expected error type — or assert on the resulting message and status.

### Q3. Where does a flow reference start in a flow with a source?
At the first processor of the process section — the source isn't executed.

### Q4. Why can't you record two POST tests with the same input?
The insert would fail the second time (duplicate), and a failed run isn't recorded.

### Q5. How do you run all MUnit suites?
Run Configurations → MUnit → clear the selected suites so all are run, with the env/secure-key properties provided.

### Q6. What coverage is acceptable?
The org's benchmark — commonly 80%. 100% is hard on big projects.

---

## 16. Must Remember

1. Record PATCH/POST like GET; mock the flow-ref in main flows and the DB processor in implementation flows.
2. Use a **new ID** for each POST recording.
3. Error tests are manual: blank test → Mock when → error type.
4. **Expected error type** = simplest error-test validation.
5. Copy tests in XML, edit names/types in the UI.
6. Assert equals on `#[payload.message]` and `#[vars.httpStatus]`.
7. Copy a recorded Set Event instead of writing `readUrl` by hand.
8. Empty suite list in the MUnit run configuration = run everything.
9. Provide `mule.env` / `secure.key` (globally or in the run configuration).
10. Class result: 18 tests, 100% coverage.
