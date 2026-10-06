# Day 28 — Initial Variables, JSON Logger, Timing with `now()`, Asynchronous Logging and Sensitive Data

> **Sources:** audio transcript, existing notes, and the class video (recorded 14 Dec 2024). Code, configuration and output marked *screen* are read from the recording. Slide images: [slides/day28](../slides/day28/).

## 1. Overview

The skeleton is ready; now it's improved step by step:

1. **Initial variables** — capturing headers, params, IDs and payload in variables at the start; where to do it
2. Several ways to create them; the dependency rule
3. **JSON Logger** instead of the plain Logger; global configuration; custom loggers via Exchange
4. JSON Logger fields: indent, log level, `app.name`, `flow.name`, trace points, content
5. Timing: `now()`, time zones, measuring DB time
6. Logging is **asynchronous**
7. Header names with hyphens
8. **Sensitive information** and why it must be masked (masking itself next session)

---

## 2. Initial Variables

### 2.1 Why

Values such as **headers, correlation ID, transaction ID, query params, URI params** and the original **payload** are needed later (for logging, mapping, calling other systems). But connectors (e.g. HTTP Request) **overwrite payload and attributes**. **Variables** aren't overwritten unless you deliberately do it.

> Standard practice in many companies: capture these values into **variables** right at the beginning of the request.

### 2.2 Where

Two choices:

- In **each resource flow** → repeated for every resource.
- In the **main flow, before the APIkit Router** → done once for all resources (**reusable**).

The instructor puts a **Flow Reference** to an "initial variables" **sub flow** in the main flow, before the router (a sub flow, because it only creates variables and needs no source or error handling of its own).

```text
Main flow:
  HTTP Listener
  Flow Reference → initialize-variables-sub-flow   (creates initial variables)
  APIkit Router
```

*Screen:* the sub flow is `initialize-variables-sub-flow` and lives in a common XML file. It holds one Transform Message, display name **"Create Initial Variables"**, with five `ee:set-variable` entries and an empty `ee:message`, so the payload is untouched:

```xml
<sub-flow name="initialize-variables-sub-flow">
  <ee:transform doc:name="Create Initial Variables">
    <ee:message>
    </ee:message>
    <ee:variables>
      <ee:set-variable variableName="queryParams">attributes.queryParams default ""</ee:set-variable>
      <ee:set-variable variableName="uriParams">attributes.uriParams default ""</ee:set-variable>
      <ee:set-variable variableName="headers">attributes.headers</ee:set-variable>
      <ee:set-variable variableName="startTime">now()</ee:set-variable>
      <ee:set-variable variableName="requestPayload">%dw 2.0
output application/json
---
payload</ee:set-variable>
    </ee:variables>
  </ee:transform>
</sub-flow>
```

(The real XML wraps each expression in `<![CDATA[...]]>`; shortened here.)

> **Technical clarification:** before the APIkit Router runs, **URI parameters are not yet extracted** (the Listener path is `/api/*`), so `attributes.uriParams` is empty there. The instructor hinted at this ("we'll get an issue with URI params"). Capture URI params inside the resource flow instead.

*Screen:* that's what the class did — the PATCH/GET resource flows set a variable from `attributes.uriParams.empid` before the Flow Reference to the implementation flow. Tested in Postman: PATCH returned **200** with `"employee details updated successfully in the db"`.

### 2.3 Example (Transform Message with several variables)

| Variable | Value |
|---|---|
| `requestPayload` | `payload` |
| `queryParams` | `attributes.queryParams default ""` |
| `uriParams` | `attributes.uriParams default ""` |
| `headers` | `attributes.headers` |
| `startTime` | `now()` |

`default ""` avoids `null` when the value is missing.

### 2.4 Different ways to do it

| Way | Notes |
|---|---|
| One Transform Message creating several variables (targets) | Works when the variables are **independent** |
| Several **Set Variable** components | One variable each — 5 values → 5 Set Variables (e.g., if the architect wants only Set Variable) |
| **One variable holding an object** | e.g. `originalRequest = { queryParams: attributes.queryParams, uriParams: attributes.uriParams, headers: attributes.headers }`; read later as `vars.originalRequest.queryParams` |
| Individual IDs | Some companies store `correlationId`, `transactionId` as separate variables |

**There's no right or wrong way** — each organisation decides. Learn to recognise all of them; when you join, clone an existing API from Bitbucket and see how they did it.

### 2.5 Dependency rule

If one variable depends on another (e.g. query-param value needs a URI-param value), they can't be created in the same Transform Message. Create the first, then the second in a later component.

---

## 3. JSON Logger

> *Screen:* in class the loggers were the **core Logger** with a JSON-structured DataWeave message (below); the JSON Logger connector itself was only explained, not added to the project.

### 3.1 Why not the plain Logger?

**Instructor's observation:** many organisations use the **JSON Logger** (extra useful features), or build their own **custom logger**.

With the plain Logger, every logger must be filled manually with transaction ID, correlation ID, etc. JSON Logger has a **global connector configuration** (like HTTP Request) applied to **every** logger in the project.

### 3.2 Where it comes from

JSON Logger is a **custom connector**. Organisations publish it (or their own custom logger) to **Exchange** and import it into projects from there — like importing a JAR in Java. Build once, reuse 100 times.

### 3.3 Fields

| Field | Meaning |
|---|---|
| **Indent** | Pretty-print the JSON log (default **true**). `false` → single line |
| **Priority / level** | INFO, DEBUG, ERROR, … |
| **Application name** | `app.name` |
| **Flow name** | `flow.name` |
| **Trace point** | Where the logger sits: START, END, BEFORE_REQUEST, AFTER_REQUEST, FLOW, … |
| **Message** | A short general message |
| **Content** | Structured content you choose (IDs, times, …) |

### 3.4 Indent

| `indent = true` (default) | `indent = false` |
|---|---|
| Multi-line, aligned — readable | Single line — not readable, but **lightweight** |

### 3.5 Log level

INFO prints every time. Other levels (DEBUG, ERROR) relate to what is printed depending on configuration. Covered separately later.

*Screen:* the core Logger's **Level** dropdown offers **INFO, DEBUG, WARN, ERROR, TRACE**.

*Screen — `src/main/resources/log4j2.xml`* (opened in class):
- A **RollingFile** appender named `file`, writing to `${sys:mule.home}/logs/<app-name>.log`, with `SizeBasedTriggeringPolicy size="10 MB"` and `DefaultRolloverStrategy max="10"`. Pattern starts `%-5p %d [%t] [processor: %X{processorPath}; event: %X{correlation…` (level, date, thread, processor path, correlation ID).
- Commented-out loggers you can enable, e.g. HTTP wire logging (`org.mule.service.http.impl.service.HttpMessageLogger` at **DEBUG**).
- `<AsyncRoot level="INFO">` → the root logger is **asynchronous** and INFO by default (see section 5).

> **Technical clarification:** a logger at DEBUG prints only if that logger's category is set to DEBUG (e.g. in `log4j2.xml`); the default level is INFO. It's not tied to whether an error happened.

### 3.6 `app.name` and `flow.name`

Use these instead of hard-coding names. The same logger copied into another flow automatically prints **that** flow's name, so the logs show exactly which flow a line came from.

### 3.7 Trace points

| Position | Trace point |
|---|---|
| Start of processing | START |
| End of processing | END |
| Before an external call (DB, HTTP) | BEFORE_REQUEST (class: **BEFORE_DB**) |
| After an external call | AFTER_REQUEST (class: **AFTER_DB**) |
| In between | FLOW |

The APIkit Router isn't the start; the start logger is in the resource/implementation flow.

### 3.8 Content — example

*Screen — reference project's "Start Logger"* (shown first as the model):

```dataweave
%dw 2.0
output application/json indent = false
---
{
  "applicationName": app.name,
  "flowName": flow.name,
  "source": "front-end",
  "destination": "SFDC",
  "transactionId": vars.headers.'x-transaction-id',
  "memberId": vars.requestPayload.memberId,
  "startTime": vars.StartTime,
  "tracePoint": "START",
  "message": "post members transactions flow started"
}
```

*Screen — the class's "Before HR DB" logger* in `post-employee-implementation-flow`, placed before the DB Insert:

```dataweave
%dw 2.0
output application/json indent = false
---
{
  "applicationName": app.name,
  "flowName": flow.name,
  "source": "front-end",
  "destination": "HR DB",
  "transactionId": vars.headers.'transaction-id',
  "employeeId": vars.requestPayload.empId,
  "startDBTime": now(),
  "tracePoint": "BEFORE_DB",
  "message": "post employees implementation flow started"
}
```

The **After DB** logger after the Insert is a copy with `"endDBTime": now()` and trace point AFTER_DB.

*Screen — DataWeave Playground:* the same object with `indent = false` prints on one line, e.g. `{"applicationName":...,"flowName":...,...}`.

**End logger:** copy the start logger, change the trace point to END and swap times (end time instead of start time). For the DB: **before** logger with `startDbTime`, **after** logger with `endDbTime`.

### 3.9 Header names with hyphens

If a key contains a hyphen (e.g. `transaction-id`), reference it in **quotes**: `vars.headers.'transaction-id'`. Without quotes, DataWeave treats the hyphen as a minus sign.

---

## 4. Timing With `now()`

### 4.1 `now()`

*Screen:* in the DataWeave Playground, `now()` returned the current date-time with a `Z` (UTC) offset.

DataWeave function returning the current **date and time**, including milliseconds.

```dataweave
now()     // e.g. 2024-12-04T02:16:30.123Z
```

### 4.2 Time zone

In the DataWeave Playground the time looked wrong (2 AM) — it was **UTC**. `now()` uses the time zone of the **server where the app runs**:

- Locally → your laptop's time zone.
- **CloudHub → UTC by default** (change it if required).

### 4.3 Measuring time

- `startTime = now()` at the start; log `now()` at the end. The difference shows how long the request took.
- For the DB: set `startDbTime` before the DB call and log `endDbTime` after; difference = DB time:

```dataweave
now() - vars.startDbTime
```

Not mandatory everywhere. Useful when someone asks "where is the time going?" — e.g., the instructor's team once had to find which component was slow.

---

## 5. Logging Is Asynchronous

**Question:** don't many loggers slow the API?

> Logging in Mule is **asynchronous**. The flow hands the message to the logger and moves on immediately; writing happens in the background.

**Illustration:** writing a log might take 5 ms; the flow passes the logger in about 1 ms; ~4 ms saved per logger.

**Printer analogy:** you send 100 pages to a printer; they print one by one, but once the job is in the queue you can continue your work.

Loggers therefore don't affect response time in a way that hurts the business.

---

## 6. Sensitive Information

### 6.1 The problem

Many developers log the **whole payload**. The payload may contain:

- **Aadhaar** number, **PAN**, **mobile** number,
- **salary**,
- in banking: credit/debit card numbers, email IDs, phone numbers.

These are **sensitive information** — they can be misused. Each organisation (and regulations, e.g. banking) decides what's sensitive.

**Examples:**

- A mobile number like 9876543210 shouldn't appear in full in logs.
- **Instructor's example:** a new colleague's record was created; checking production logs, the instructor could see the salary. Salaries visible to 100 developers would cause problems.

### 6.2 Audits

Regulators such as the **RBI** can audit and ask to see production logs; you can't refuse. If logs show sensitive data, they issue warnings. Data leaks or employee misuse damage the company's reputation (especially for listed companies).

### 6.3 Fix — masking

**Masking** hides part of a value (e.g., show only the last 4 digits of an Aadhaar or mobile number). DataWeave has a **`mask`** function — covered next session.

> **Technical clarification:** the JSON Logger connector can also mask configured fields in its own configuration; the lecture uses the DataWeave approach.

---

## 7. Important Terminology

| Term | Meaning |
|---|---|
| Initial variables | Variables created at request start from headers, params, payload |
| `default` | Fallback value when an expression is null |
| JSON Logger | Custom connector producing structured JSON logs |
| Custom connector | Connector built by an organisation and shared via Exchange |
| Indent | Pretty-printing of JSON output |
| Trace point | Logger position: START, END, BEFORE_REQUEST, … |
| `app.name` / `flow.name` | Current app / flow names |
| `now()` | Current date-time |
| UTC | CloudHub's default time zone |
| Asynchronous logging | Logs written in the background |
| Sensitive information | Data that must not be exposed (Aadhaar, PAN, …) |
| Masking | Hiding part of a value |

---

## 8. Interview Questions

### Q1. Why capture headers and parameters into variables at the beginning?
Connectors overwrite payload and attributes; variables persist, so the values remain available throughout the flow.

### Q2. Where would you create common initial variables?
Once, in the main flow before the APIkit Router (for all resources) — but URI params are only available after routing.

### Q3. Why use JSON Logger over the default Logger?
Structured JSON logs, global configuration applied to all loggers, trace points, consistent fields (correlation/transaction IDs), masking support.

### Q4. What do `app.name` and `flow.name` give you?
The application and current flow names, so copied loggers report the right flow automatically.

### Q5. What is `now()` and which time zone does it use?
The current date-time of the server; CloudHub uses UTC by default.

### Q6. Do loggers slow down Mule applications?
Logging is asynchronous, so the impact is minimal.

### Q7. Why must sensitive data be masked in logs?
To prevent misuse and meet regulatory/audit requirements (e.g. banking regulators).

---

## 9. Must Remember

1. Capture **headers, params, IDs, payload** into variables at the start — connectors overwrite attributes.
2. Put them **before the APIkit Router** for reuse; URI params come only after routing.
3. Several ways (Transform Message targets, Set Variables, one object variable) — **dependent variables need separate steps**.
4. **JSON Logger**: global config, custom connector from Exchange.
5. Fields: **indent** (default true), level, **app.name**, **flow.name**, **trace point**, content.
6. Loggers at **START/END** and **BEFORE/AFTER every external call**.
7. Quote hyphenated keys: `vars.headers.'transaction-id'`.
8. `now()` = server time; **CloudHub = UTC**; use start/end variables to measure DB time.
9. Logging is **asynchronous** — printer-queue analogy.
10. Never log **sensitive data** (Aadhaar, PAN, mobile, salary, cards); **mask** it (next session).
