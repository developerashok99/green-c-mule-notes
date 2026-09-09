# Day 28 — Detailed Notes: Initial Variables, JSON Logger, and Masking (Intro)

> **Watch alongside:** the single idea that unlocks this whole session is that **HTTP Request connectors overwrite `attributes`** — everything about capturing headers/URI-params/query-params/correlation-ID into *variables* immediately at flow start exists solely to survive that overwrite. Once that clicks, the four different "how to create variables" methods are just style choices; the `now()`/timezone/asynchronous-logging/masking material builds logging discipline on top of that same foundation.

---

## 1. The Attribute-Overwrite Problem — Why Initial Variables Exist At All

```mermaid
sequenceDiagram
    participant Req as Incoming Request
    participant Flow as Implementation Flow
    participant Vars as Variables (safe)
    participant HTTPReq as HTTP Request connector
    Req->>Flow: attributes.headers, attributes.queryParams,<br/>attributes.uriParams arrive
    Flow->>Vars: Set Variable / Transform Message<br/>captures them NOW
    Flow->>HTTPReq: later, calls a third-party API
    HTTPReq-->>Flow: response REPLACES attributes<br/>(original request data gone from attributes)
    Flow->>Vars: but variables are untouched — still readable
```

**Stated directly**: *"When we see in the HTTP request, the attributes are overwritten... variables cannot be overwritten, right? Unless we overwrite it [deliberately]. Actually, not wanted, not deliberate. That's why we create these variables here."*

---

## 2. Four Ways to Create the Same Initial Variables

```mermaid
flowchart TB
    Need["Need: headers, URI params,<br/>query params, correlation ID,<br/>transaction ID as variables"]
    Need --> M1["Method 1: 5x Set Variable<br/>(1 component = 1 variable)"]
    Need --> M2["Method 2: 1x Transform Message<br/>outputting 5 INDEPENDENT variables"]
    Need --> M3["Method 3: 1 variable = 1 nested object<br/>{queryParams, uriParams, headers, ...}"]
    Need --> M4["Method 4: also save payload<br/>into its own variable"]
    M1 --> Verdict["No right or wrong method —<br/>org/architect convention decides"]
    M2 --> Verdict
    M3 --> Verdict
```

*"There is no right or wrong method. You can follow anything."* The instructor even recommends cloning an existing API from Bitbucket specifically to see which convention that project already follows — a working developer needs to read and adapt to whatever pattern is already in use.

---

## 3. The One Real Constraint: Independent vs. Dependent Variables

```mermaid
flowchart LR
    Q["Query params VALUE depends on<br/>a URI param's already-computed value"] -->|"created together<br/>in ONE Transform Message?"| Fail["❌ FAILS — dependency not resolved yet"]
    Fix["Create URI param variable FIRST<br/>(separate Set Variable/step)"] --> Then["THEN create the query-param<br/>variable that depends on it"]
    Indep["Values with NO dependency<br/>on each other"] --> Together["✅ Can all be created<br/>in ONE Transform Message at once"]
```

*"There is a dependency... after the URL parameter is formed, we have a dependency on it, so we have to create a set variable in the next variable... independent variables can create multiple variables in the transform message."*

---

## 4. JSON Logger — A Custom Connector, Configured Once Globally

```mermaid
flowchart TB
    Global["Global Connector Configuration<br/>(JSON Logger config, created ONCE)"] -->|"selected by"| L1["Logger 1 (post flow)"]
    Global -->|"selected by"| L2["Logger 2 (patch flow)"]
    Global -->|"selected by"| L3["Logger 3 (get flow)"]
    Global -.->|"contains shared settings, e.g."| Mask["masking fields (Day 29)<br/>indent setting"]
```

**Why not just use the plain built-in `Logger`?** *"We use JSON logger. Actually, there are some extra beneficial functionalities in it... it depends on the organization and depends on the integration architect."*

**The reuse story ties directly back to Exchange (Day 26)**: *"if we don't have JSON Loggers, it's difficult to build custom Loggers for this particular organization... you publish them in the exchange and import them from the exchange."* Exactly the same mechanism used earlier for reusable connectors/fragments.

---

## 5. `indent` — Readability vs. Transportation

```mermaid
flowchart LR
    True["indent = true (DEFAULT)"] --> Pretty["Multi-line, aligned, readable —<br/>easier for a human to scan"]
    False["indent = false"] --> Compact["Single line, no line breaks —<br/>lighter for transport/storage"]
```

*"Visibility, readability. This readability will be good [true]. This readability will not be there [false]. But tell me if this is good for transportation... Lightweight."*

---

## 6. Log Levels — A Quick Preview (fuller treatment deferred)

```mermaid
flowchart LR
    Info["INFO level"] -->|"prints EVERY time"| Always["Always visible in logs"]
    Debug["DEBUG level"] -->|"prints ONLY when there is an error"| Rare["Space-efficient — silent<br/>unless something goes wrong"]
```

*"If you occupy too much space, the logger will not print [everything]. It will print only when there is an error."* Explicitly deferred: *"I don't want to confuse you with the functionality... we will discuss it separately."*

---

## 7. `app.name` / `flow.name` — Self-Reporting Identity

```mermaid
flowchart TB
    Hardcode["❌ Hardcoded flow name in message"] --> Risk["Copy-paste to a NEW flow →<br/>logger still reports the OLD flow's name"]
    Dynamic["✅ flow.name / app.name tokens"] --> Auto["Copy-paste to a NEW flow →<br/>automatically reports THIS flow's own name"]
```

*"Since it is in our post resource flow, that particular flow name will be printed... When this travels, if it is in any flow, that flow name will be printed."* This is what makes a copy-pasted logger template safe to reuse across many flows without manual editing.

---

## 8. Trace Points and a Structured Logger Message Shape

```mermaid
flowchart LR
    Start["START logger<br/>trace point: 'start'"] --> BeforeDB["BEFORE-DB logger<br/>trace point: 'before DB'"]
    BeforeDB --> DB[("Database call")]
    DB --> AfterDB["AFTER-DB logger<br/>trace point: 'after DB'"]
    AfterDB --> End["END logger<br/>trace point: 'end'"]
```

**Recommended structured fields, given directly**: application name · flow name · **source** · **destination** · **transaction ID** · **member/employee ID** — built once for the start logger, then copy-pasted and adapted (swap `start time`→`end time`, `start DB time`→`end DB time`) for the rest.

---

## 9. Measuring Elapsed Time with `now()`

```mermaid
sequenceDiagram
    participant F as Flow
    participant V as Variables
    F->>V: startTime = now()
    Note over F: ... request processing ...
    F->>V: startDbTime = now()
    F->>F: Database call
    F->>V: endDbTime = now()
    Note over V: dbDuration = endDbTime - startDbTime
    F->>V: endTime = now()
    Note over V: totalDuration = endTime - startTime
```

**The live timezone gotcha**: `now()` initially printed what looked like a wrong hour (*"2 am is visible here"*) — resolved as **UTC**, because *"which server will take this now? In general, where the application is deployed"* — local deployment → local timezone; CloudHub → UTC by default (*"if we want, we have to change it"*).

**Explicitly situational, not default-everywhere tooling**: *"Will you put it on everyone? There is no need to put it. But at one time, a situation like this came... If we know that this is there now, will it be useful?"*

---

## 10. Logging Is Asynchronous — It Does Not Cost Response Time

```mermaid
flowchart LR
    Component["Flow component<br/>hands log line to Logger"] -->|"~1ms, async, non-blocking"| Continue["Flow immediately<br/>continues processing"]
    Logger["Logger"] -.->|"actual write happens<br/>independently, ~5ms"| Written["Log eventually written"]
```

**The printer-queue analogy, given directly**: *"you have a PDF for 100 printouts... it will be printed one by one. But did I give the information that I need to the printer? Yes... Will it work if it is in the queue? Yes, it will work. Can I do my work now? Yes."* The direct reassurance: *"I don't have an impact on business during response time, right? Many people will have confusion in real time"* about exactly this point.

---

## 11. Why Production Logs Get Removed

```mermaid
flowchart LR
    Prod["Production incident"] --> Handoff["All logs stripped/removed<br/>before handoff — a real recounted incident"]
    Handoff --> Cost["Retaining large log volumes<br/>has an ongoing storage/insurance cost"]
```

*"How do I check the logs in a production?... A production happened to us recently. In that, all the logs were reverted and sold to us."*

---

## 12. Sensitive Information and Masking — Setting Up the Problem

```mermaid
flowchart TB
    Payload["Full request payload logged naively"] --> Leak["❌ Aadhaar / PAN / mobile number /<br/>employee SALARY exposed in plaintext logs"]
    Leak --> Risk1["Internal risk: colleagues' salaries<br/>readable by any dev with log access"]
    Leak --> Risk2["Regulatory risk: RBI-style audit<br/>finds unmasked sensitive data → formal warning"]
    Leak --> Fix["Fix (Day 29): DataWeave mask() function"]
```

**A concrete personal example given directly**: a newly-hired colleague's exact salary was visible in a production log the developer happened to check for an unrelated reason — *"I interviewed him. He is going to join the company... I immediately went to the production and checked the log. See if I know his salary here... Is that clarity clear?"*

**The compliance framing, stated directly with a named regulator**: *"someone from banks like... Reserve Bank of India, will suddenly come for audit. They will show your logs in production... you can't deny them."* Banking specifically treats PAN, Aadhaar, card numbers, email, and phone numbers as compulsory sensitive fields — unmasked exposure draws formal audit warnings with real reputational stakes for a public listed company.

**Deliberately left as a cliffhanger**: *"There is a masking function in the data view... we will see it tomorrow."*

---

## Quick Recap
- **HTTP Request connectors overwrite `attributes`** — the entire reason initial values must be captured into **variables** immediately, since variables survive where attributes don't.
- **Four valid patterns exist** for creating those initial variables (multiple Set Variables / one multi-output Transform Message / a single nested-object variable / a payload-plus-others hybrid) — no single right answer, only the constraint that **dependent variables must be sequenced**, not created together.
- **JSON Logger is a custom connector** with a **global connector configuration**, reusable across every logger in the project — and, like other connectors, publishable to and importable from Exchange.
- **`indent`** trades human readability (default `true`) against transport/storage efficiency (`false`).
- **`app.name`/`flow.name`** make a copy-pasted logger self-report its own containing flow, instead of a stale hardcoded name.
- **Structured logger fields** (application, flow, source, destination, transaction ID, member/employee ID) plus named **trace points** (start/end/before-DB/after-DB) give end-to-end request visibility.
- **`now()` reflects the deployment server's timezone** — UTC on CloudHub by default — and paired with start/end variables is a situational tool for measuring elapsed time, including isolating DB call duration specifically.
- **Logging is asynchronous** and does not add to response time — proven by direct analogy to a print queue.
- **Sensitive data (Aadhaar, PAN, mobile, salary) must never be logged unmasked** — both an internal-trust risk and a real regulatory/audit risk — with the actual DataWeave `mask()` mechanism explicitly deferred to Day 29.
