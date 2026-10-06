# Day 15 — Error Handling (Part 1): Default vs. Custom, the Error Object, On Error Propagate, ANY

> **Sources:**
> - Audio transcript, existing notes, and the class video (recorded 26 Nov 2024).
> - Slide text, drawings and Studio/Postman screens marked *slide*, *drawing* or *screen* are read from the recording.
> - Slide images: [slides/day15](../slides/day15/).

## 1. Overview

Error handling takes 2–3 sessions. This first session covers:

1. Why error handling matters
2. Default error handler vs. custom error handling
3. The Listener's **Response** and **Error Response** sections
4. The **error object** — description, detailed description, error type (namespace, identifier)
5. Mule 4 error components: On Error Propagate, On Error Continue, Raise Error, Try scope, Error Handler
6. Building custom error handling with **On Error Propagate** (HTTP:NOT_FOUND, MULE:EXPRESSION)
7. Unmatched errors → default handler
8. The **ANY** error type and why it must be **last**

*Slide* — **Agenda for today:** Error Handling in Mule 4.x · Default Error Handling and Listener configuration · Error Object · On Error Propagate · On Error Continue · Global Error Handler. (On Error Continue and the global handler were done on Day 16.)

---

## 2. Why Error Handling Matters

- There is usually **one success response**, but **many possible errors**.
- If we tell the consumer the **exact reason**, they can understand and correct the problem on their side (or know the problem is on ours).

**Examples:**

| Situation | Response |
|---|---|
| Consumer sends wrong data | 400 Bad Request |
| Consumer sends wrong security information | 401 Unauthorized |
| Our database is down | 500 Internal Server Error |

### Question: can we use custom codes like ERR-1700?

Yes, if the consumer and provider agree (e.g. "ERR-1700 means bad request"). But when exposing APIs to external organisations, **standard HTTP status codes** are generally used.

### Question: a third party returns a misleading error code

Third parties usually return correct codes. If the same request works from Postman but fails from your API, the problem is probably your configuration — debug what your API actually sends and compare with Postman.

---

## 3. Default vs. Custom Error Handling

Until now we did no error handling, yet errors still came back. Why?

> If you do nothing, Mule uses a **default error handler**.

| | Default error handler | Custom error handling |
|---|---|---|
| Configured by | Mule automatically | The developer |
| Behaviour | Generic response; doesn't know your specific requirement | Specific, designed responses per error type |

---

## 4. Where Responses Come From — the Listener

Success or error, the final HTTP response is sent by the **HTTP Listener**: the whole flow executes, then the Listener converts the result into an HTTP response.

HTTP Listener → **Responses** tab has two sections:

| Section | Used when | Fields |
|---|---|---|
| **Response** | Flow completed successfully | Body, Headers, Status code, Reason phrase |
| **Error Response** | An error reached the Listener | Body, Headers, Status code, Reason phrase |

- **Status code** — e.g. 200; **reason phrase** — its short description, e.g. "OK".
- If not configured, Mule fills them automatically (success → 200 OK, payload as body).
- Default **Error Response body**: the error's description as **plain text**:

```dataweave
output text/plain
---
error.description
```

### Demo of the default

- A wrong city ("Mumbaii") was sent.
- Because the success status code validator from Day 13 still included 404, the request didn't fail at the HTTP Request; it failed later in the mapping.
- The default handler returned a **500** with the plain-text description — unstructured, not useful to a consumer.

---

## 5. The Error Object

### 5.1 When it exists

- The **error object** is created **only when an error is raised**.
- During successful processing, the Mule Debugger shows no error object.
- When the error occurs (red dotted outline on the component), it appears.

### 5.2 Contents

| Expression | Meaning |
|---|---|
| `error.description` | Short description of the error — used most |
| `error.detailedDescription` | Longer description; often the same |
| `error.errorType` | Type of error, e.g. `MULE:EXPRESSION`, `HTTP:NOT_FOUND` |
| `error.errorType.namespace` | Part before the colon, e.g. `MULE`, `HTTP` |
| `error.errorType.identifier` | Part after the colon, e.g. `EXPRESSION`, `NOT_FOUND` |

Accessing it is like accessing other parts of the event (`vars.x`, `attributes.queryParams.x`, `payload.x`).

### 5.3 Two errors seen

| Cause | Error type | Why |
|---|---|---|
| Mapping did `null − 273.15` | `MULE:EXPRESSION` | DataWeave expression failed inside Mule |
| Wrong city name (after removing 404 from the success validator) | `HTTP:NOT_FOUND` | OpenWeatherMap returned 404 |

Error types depend on the component: HTTP errors (`HTTP:NOT_FOUND`, `HTTP:CONNECTIVITY`, `HTTP:UNAUTHORIZED`, …), DB errors, expression errors, etc.

---

## 6. Mule 4 Error Handling Components

In the Mule Palette → **Core → Error Handling**:

| Component | Purpose |
|---|---|
| **Error Handler** | Container that groups handlers |
| **On Error Propagate** | Handle the error, then propagate it to the next level |
| **On Error Continue** | Handle the error and continue (covered next) |
| **Raise Error** | Raise a custom error (covered next) |

**Try** is under **Core → Scopes**; it is also used for error handling.

**On Error Propagate** is the most used; it is explained in detail here.

---

## 7. On Error Propagate

### 7.1 Meaning

> When an error occurs and its **type matches**, On Error Propagate **catches** it, executes its inner components, then **propagates the error to the next level**.

For a flow that starts with a Listener, the next level is the **Listener**, which uses its **Error Response** section. (With Flow References, behaviour differs — covered next session.)

```text
Process ── error ──► Error handling
                       On Error Propagate (type matches?)
                         │ yes → Logger, Transform Message (payload + vars)
                         ▼
                     HTTP Listener → Error Response section
                       body / status code / reason phrase from payload & vars
```

### 7.2 Building it — HTTP:NOT_FOUND

*Drawing:* Error handler, On Error Propagate, On Error Continue, Raise Error → error handling in Mule; Try scope → component-level error handling. And: "On Error Propagate — it will stop the process and propagate the error response to the next level".

**Step 1 — Add On Error Propagate** to the flow's **Error handling** section.

**Step 2 — Set Type.** Click the search icon next to **Type**: a list of error types for the modules in the project (HTTP, MULE, …). Select **`HTTP:NOT_FOUND`**. (There is also a **When** field for conditions.)

**Step 3 — Logger** inside it: `error.description`.

**Step 4 — Transform Message** to build a structured JSON error. The real structure is defined in the API specification and agreed with the consumer.

Payload target:

```dataweave
%dw 2.0
output application/json
---
{
  errorStatusCode: 400,
  message: error.description
}
```

**Add new target → Variable** `statusCode`:

```dataweave
400
```

**Add new target → Variable** `reasonPhrase`:

```dataweave
"Bad Request"
```

(In class the `statusCode` variable was first set to 404 and later changed to 400 so that it matched the payload's `errorStatusCode`. *Screen:* with the mismatch, Postman showed **"404 Bad Request"** — status code 404 from the variable, reason phrase "Bad Request" — for GET `http://localhost:8081/weather/city` with body `{"city": "M"}`.)

- Why 400 when the third party returned 404?
- The consumer sent a wrong city — a client-side data problem — so 400 Bad Request was chosen.
- **There is no hard rule** on 400 vs. 500 here; what matters is that the consumer understands the error.

**Step 5 — Map the Listener's Error Response section:**

| Field | Value |
|---|---|
| Body | `payload` |
| Status code | `vars.statusCode` |
| Reason phrase | `vars.reasonPhrase` |

Tip: copy variable names into Notepad and paste them, to avoid spelling mistakes.

### 7.3 Result

Wrong city → `HTTP:NOT_FOUND` → matched → Logger printed the description → payload and two variables set → Listener returned:

```text
HTTP/1.1 400 Bad Request
{ "errorStatusCode": 400, "message": "HTTP GET on resource 'http://api.openweathermap.org:80/data/2.5/weather' failed: not found (404)." }
```

The message can be more helpful, e.g. "City name not in the right format, please send the right city." Real error responses may have 5–10 fields. The **consumer and provider must agree** on the error format.

### 7.4 Rename components

Right-click → **Rename** to give clear display names — in class: `Error Logger` and `Set Error Response, status code and reason phrase` (*screen*). When copying (Ctrl+C/Ctrl+V), "Copy of" is added — rename it.

---

## 8. When No Handler Matches

### 8.1 Setup

A wrong encrypted value for the weather API key was used in the property file, expecting `HTTP:UNAUTHORIZED`.

### 8.2 What happened

The error type was actually **`MULE:EXPRESSION`** — description: *exception while executing `p('secure::…')`* — the decryption itself failed before the request was sent.

The only handler was for `HTTP:NOT_FOUND` → **no match** → **default error handler** processed it.

### 8.3 Why the response showed `"city": "Mumbai"`

- The Error Response body was `payload`.
- The error happened **before** the HTTP Request, so the payload was still the original request `{ "city": "Mumbai" }`.
- Status code and reason phrase variables were never set, so defaults were used.

> Map the Error Response carefully; if no handler sets the payload/variables, whatever is currently there is sent.

### 8.4 Adding a handler for MULE:EXPRESSION

1. Drag another **On Error Propagate**.
2. Copy the Logger and Transform Message from the first handler; rename them.
3. Type: **`MULE:EXPRESSION`** — select it from the type list so the full `namespace:identifier` is used. (In class there was brief confusion about writing only `EXPRESSION`; selecting the full type from the list avoids mistakes.)
4. Values: **500**, reason phrase **"Internal Server Error"** — a mapping/decryption problem is **our** fault (server side).

Result: `500 Internal Server Error` with the JSON body.

---

## 9. The ANY Error Type

### 9.1 Problem

There can be hundreds of possible errors; we can't write a handler for each, and we don't know them all in advance.

### 9.2 Solution

Write handlers for errors you know (and common ones: unauthorized, connectivity…). Add a final handler with type **ANY** to catch everything else in a generic way.

### 9.3 Order matters — ANY must be last

Handlers are checked **top to bottom**; the **first match** handles the error.

```text
Correct                              Wrong
1. HTTP:NOT_FOUND                    1. ANY            ← matches everything
2. MULE:EXPRESSION                   2. HTTP:NOT_FOUND ← never reached
3. ANY                               3. MULE:EXPRESSION← never reached
```

- **ANY at the bottom:** specific handlers are tried first; ANY catches only what's left.
- **ANY first or in the middle:** every error (or every error reaching it) goes to ANY; the handlers below never run.

> **ANY must always be at the bottom of the error handler.**

The instructor said they would demonstrate this practically in the next session.

---

## 10. Important Terminology

| Term | Meaning |
|---|---|
| Default error handler | Mule's built-in handling when none is configured |
| Custom error handling | Developer-designed error handling |
| Error Response (Listener) | Body/headers/status/reason used on errors |
| Error object | Created when an error is raised: `error.*` |
| `error.description` / `detailedDescription` | Short / long message |
| `error.errorType` | e.g. `HTTP:NOT_FOUND`; namespace `HTTP`, identifier `NOT_FOUND` |
| On Error Propagate | Handles a matched error, then re-throws it to the next level |
| Type / When | Error-type match / condition on an error handler |
| ANY | Error type matching every error |

---

## 11. Interview Questions

### Q1. What happens if no error handling is configured?
Mule's default error handler handles it; the Listener returns a generic error (typically 500 with the error description as plain text).

### Q2. What is in the error object?
`description`, `detailedDescription`, `errorType` (with `namespace` and `identifier`), among others. It exists only when an error is raised.

### Q3. What does On Error Propagate do?
Catches errors matching its type, executes its components, then propagates the error to the next level — for a Listener flow, the Listener returns its Error Response.

### Q4. How do you return a custom status code and message?
In the error handler, set the payload (error body) and variables such as `statusCode` and `reasonPhrase`; map them in the Listener's Error Response (body, status code, reason phrase).

### Q5. What is the ANY error type and where should it be placed?
A catch-all for any error. It must be last, because handlers are evaluated in order and the first match wins.

### Q6. If an error doesn't match any handler?
The default error handler processes it.

### Q7. How do you decide between 4xx and 5xx?
4xx when the client sent something wrong; 5xx when the problem is on the server/API side. The final choice is a design decision agreed with the consumer.

---

## 12. Must Remember

1. Many more error cases than success cases → **custom error handling** gives clear reasons.
2. No handler → **default error handler** (generic, plain-text description, 500).
3. Listener has **Response** and **Error Response**: body, headers, status code, reason phrase.
4. **Error object** exists only after an error: `error.description`, `error.detailedDescription`, `error.errorType` (`namespace:identifier`).
5. Components: **On Error Propagate, On Error Continue, Raise Error, Error Handler; Try** (Scopes).
6. **On Error Propagate** = catch matching type → run inner logic → propagate to next level (Listener's Error Response).
7. Set **payload + vars.statusCode + vars.reasonPhrase**; map them in the Listener's Error Response.
8. Select error types from the list (`namespace:identifier`, e.g. `MULE:EXPRESSION`) so they match exactly.
9. Unmatched error → default handler; the current payload may leak into the response.
10. **ANY = catch-all, always last.**
