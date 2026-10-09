# Day 40 — MUnit Continued: PATCH/POST Tests, Error-Handler Tests and Full Coverage

## Session Agenda
- Recording tests for the **PATCH** and **POST** flows
- How database mocks replay recorded responses
- **Manual error-handler tests** with Mock when raising errors
- Validating with **expected error type** and **Assert equals**
- Running all suites and the coverage report

## PATCH and POST
- Save the requests into the local Postman folder.
- Main-flow tests mock the **Flow Reference**; implementation tests mock the **DB processor**.
- A different XML gets its own suite file.
- POST: use a new ID per recording (1050, 1051) — a duplicate insert fails and isn't recorded.

## Error-Handler Tests
- Errors can't be recorded — create a **blank test** (flow-ref to the main flow).
- A flow-ref starts at the first processor (APIkit Router), not the listener.
- **Mock when** the APIkit Router → return an error (`APIKIT:BAD_REQUEST`).
- Set the test's **expected error type** to the same → pass.
- Copy the test per error type (edit names/types in the UI) → 10 tests, error handler 100%.
- Ignore / enable tests from the right-click menu.

## Asserts
- **Assert equals** on `#[payload.message]` and `#[vars.httpStatus]` (500 for DB:CONNECTIVITY).
- For inputs, copy a recorded **Set Event**.
- The DB:CONNECTIVITY test failed with an InterceptionException and was deleted.

## Running Everything
- MUnit run configuration: remove the leftover single suite so all suites run; `mule.env` / `secure.key` set globally.
- 18 tests green; coverage report **100%** (Choice isn't counted).
- 80% is fine for big real projects.

## Quick Recap
- Record success tests; build error tests manually.
- Mock when can return an error; expected error type validates it.
- Run all suites and check the coverage report.
- A student's Mule 4.8.0 recording error (`MimeTypeParseException`) was left for Monday.
