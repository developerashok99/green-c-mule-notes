# Day 39 — MUnit Introduction: Unit Testing, Coverage and Recording a Test

## Session Agenda
- What is **MUnit**
- Components of an MUnit test
- Capabilities of MUnit
- Recording a test for the GET flow of the HR system API

## What Is MUnit
- MuleSoft's application testing framework for automated tests; integrated with **Maven** for CI/CD.
- Like JUnit for Java.
- Two ways: **recording** (Mule 4.3+, success cases) and **manual** (error cases).

## Unit Testing vs. QA
- Developers unit-test each API (car example: test each part before assembly).
- QA does **SIT** across experience, process and system APIs; then UAT, performance testing, production.
- Unit tests catch side effects of later small changes.

## MUnit in CI/CD
- One step in the Jenkins/Bamboo pipeline.
- **Coverage** = covered components ÷ total; below the org's benchmark (e.g. 80%) the deployment fails.

## Test Structure and Capabilities
- **Behaviour** (mocks, input), **Execution** (run the flow), **Validation** (assert).
- Processors: **Mock** (most used), **Spy**, **Verify**.
- Ignore tests, tag tests, coverage report.
- Tests in `src/test/munit`; resources in `src/test/resources`.

## Recording a Test
- Right-click flow → MUnit → **Record test for this flow** (or Create blank test).
- Test locally first, set MUnit run-config arguments, comment out Autodiscovery.
- Send the input within ~1–2 minutes; recording works only on success.
- Names: `<flow>-test` in `<xml>-suite`.
- Mock the Flow Reference — the pipeline can't reach the DB.
- Generated: Mock when + Set Event (payload, attributes, variables from `.dwl` files) + Assert payload; pom gains `munit-runner` / `munit-tools`.

## Running and Coverage
- Run MUnit suite → 1 run, 0 failed; green ticks show coverage.
- Default test timeout 120,000 ms (MUnit Errors view).
- Coverage report: 9.52% → 14.2% after testing both Choice routes.

## Quick Recap
- MUnit automates unit tests and gates deployments by coverage.
- Behaviour, Execution, Validation.
- Record success cases; mock external calls.
- Next: POST tests and manual error-scenario tests.
