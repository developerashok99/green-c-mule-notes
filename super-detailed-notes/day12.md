# Day 12 — Shaping the Weather Response, DataWeave Playground, Target Variable and Response Timeout

> **Sources:** audio transcript, existing notes, and the class video (recorded 20 Nov 2024). Slide text and Studio/Postman/Playground screens marked *slide* or *screen* are read from the recording. Slide images: [slides/day12](../slides/day12/).

## 1. Overview

On Day 11 the weather API returned OpenWeatherMap's raw response. This session:

1. Transforms the response into our API's own response structure
2. Revisits Set Payload / Set Variable / Transform Message (multiple targets and dependencies)
3. Uses the **DataWeave Playground** to work out the mapping
4. Converts **Kelvin → Celsius**; `typeOf` and `as Number`
5. Revisits **propagation**: what a connector overwrites
6. **Target Variable** — store a connector's response in a variable instead of the payload
7. **Response Timeout** — default, connector level vs. operation level, real project example, how to test it

Reconnection strategy and response validator follow on Day 13.

*Slide* — **Agenda for today:** Demonstration of consume REST service in APS · Propagation of payload, attributes, and variables across HTTP Request · Target Variable, Response Timeout, Response Validator and Reconnection Strategy · Q&A session.

---

## 2. Transforming the Response

### 2.1 Options

- **Set Payload** — fine for simple values; you write a DataWeave expression in fx mode.
- **Transform Message** — for complex transformations; can also create variables and attributes via **Add new target**.

The instructor uses Transform Message.

### 2.2 Multiple targets — and a dependency rule

In one Transform Message you can create the payload **and** several variables (instead of several Set Variable components).

**But:** if the **second variable depends on the first**, don't create both in the same Transform Message. Create the first with one Set Variable (or Transform Message) and the second in a **separate component after it**.

```text
Independent values  → one Transform Message with several targets is fine
Dependent values    → Set Variable (A)  →  Set Variable (B uses vars.A)
```

> **Technical clarification:** all targets of one Transform Message are evaluated against the same incoming event, so one target cannot read a variable created by another target in the same component. That's why dependent values need separate, sequential components.

### 2.3 Our response structure

The request/response of our API were decided in advance (design first):

```json
// Request
{ "city": "Mumbai" }

// Response (as designed on the class slide)
{
  "city": "Mumbai",
  "minTemp": 35,
  "maxTemp": 45,
  "tempUnit": "celcius"
}
```

(*Slide/screen* — the class used these exact keys; "celcius" is spelled that way in class. The drawing also showed the URL shape `http://host:port/basepath/path`.) The output of the final Transform Message must be **`application/json`** (not Java), because our consumer expects JSON. The Listener then sends the payload as the response body.

The instructor pasted the target structure into Transform Message and mapped each field. A red mark caused by the pasted double quotes was a formatting issue, not a real error.

### 2.4 Where does the city come from?

The city is in **our request** and also in the weather response (`name`). But after the HTTP Request, our original payload is gone.

**Solution used** (*screen*): a **Set Variable** named `request` before the HTTP Request, holding the incoming payload. In the transform, read `vars.request.city`. The flow became Listener → Logger → **Set Variable** → Request → Transform Message → Logger.

---

## 3. DataWeave Playground

MuleSoft's **online DataWeave Playground** lets you try transformations without running a Mule app.

1. Search "DataWeave Playground".
2. Paste the sample input (the weather JSON) into the payload/input pane.
3. Write expressions; the output updates instantly.

| Expression | Result |
|---|---|
| `payload` | Whole payload |
| `payload.main` | The `main` object |
| `payload.main.temp` | Temperature (e.g., 300) |
| `payload.main.temp_min`, `payload.main.temp_max` | Min/max temperature (*screen*, Hyderabad: 288.38 / 289.88) |

---

## 4. Kelvin → Celsius

### 4.1 Finding the formula

A temperature of ~300 is clearly not Celsius (normal is ~22°C). The value is in **Kelvin**. The documentation should state the unit (this free API didn't make it obvious).

**Instructor:** "I don't know the formula — so what do I do? Google it", or check the documentation.

```text
Celsius = Kelvin − 273.15        e.g. 300 − 273.15 = 26.85
```

### 4.2 Data types — `typeOf` and `as Number`

DataWeave usually treats numeric JSON values as numbers, so `payload.main.temp - 273.15` works. If a value arrives as a **string** (e.g. `"300"`), subtraction fails.

```dataweave
typeOf(payload.main.temp)          // → Number (or String)
typeOf("300")                      // → String
"300" as Number                    // → 300
("300" as Number) - 273.15         // → 26.85
```

- `typeOf(...)` — capital **O** — returns the data type.
- `as Number` — converts to a number.

DataWeave sometimes converts automatically; many languages don't. Convert explicitly when a value might be a string.

*Screen (Playground):* `"110" - 24` returned **86**, with the warning `[dw] Auto-Coercing type from: "110" to: Number` … "HINT: To avoid this warning please coerce the argument to match". Google gave **300 K = 26.85 °C** (K − 273.15).

### 4.3 Final transformation (*screen*)

First version (reading the payload):

```dataweave
%dw 2.0
output application/json
---
{
  "city": vars.request.city,
  "minTemp": payload.main.temp_min - 273.15,
  "maxTemp": payload.main.temp_max - 273.15,
  "tempUnit": "celcius"
}
```

---

## 5. Propagation — What Gets Overwritten

Debugging after the HTTP Request:

| Part of the Mule event | After a connector operation |
|---|---|
| Payload | **Overwritten** by the connector's response |
| Attributes | **Overwritten** by the response's attributes |
| Variables | **Not overwritten** — they remain unless you change them (e.g. another Set Variable with the same name) |

This behaviour is called **propagation** — how payload, attributes and variables pass from one component to the next. It applies to connectors in general.

> If you need any payload or attribute value after a connector, save it in a variable first.

In this demo, the final Transform Message also overwrote the payload with the new response structure.

---

## 6. Target Variable

### 6.1 Two ways to keep the payload

1. Before the connector, save what you need in a variable (Set Variable / Transform Message) — the connector still overwrites the payload.
2. **Target Variable:** tell the connector to put its **response into a variable** instead of the payload.

### 6.2 Configuring it

HTTP Request → **Advanced** tab → **Target Variable**: `weatherResponse`.

### 6.3 What happened

| | Without target variable | With target variable `weatherResponse` |
|---|---|---|
| payload after HTTP Request | Weather response | **Unchanged** — still `{ "city": "Hyderabad" }` |
| attributes after HTTP Request | Response attributes | **Unchanged** — original request attributes (default headers, empty query/URI params) |
| variables | Unchanged | New variable `weatherResponse` = the weather response |

### 6.4 The mapping broke — as expected

The transform still read `payload.main.temp_min`. The payload no longer contains `main`:

```text
You called the function '-' with these arguments:
  1: Null (null)
  2: Number (273.15)
```

(*Screen:* error type `MULE:EXPRESSION` in the debugger; Postman showed **500 Server Error** with the same message.)

`null − 273.15` is not possible.

**Fix:** read from the variable:

```dataweave
"city": vars.request.city,
"minTemp": vars.weatherResponse.main.temp_min - 273.15,
"maxTemp": vars.weatherResponse.main.temp_max - 273.15,
"tempUnit": "celcius"
```

After saving (Build Automatically redeploys), the request worked. *Screen (Postman):* GET `http://localhost:8081/weather`, body `{"city": "Mumbai"}` → **200 OK**:

```json
{ "city": "Mumbai", "minTemp": 22.94, "maxTemp": 24.99, "tempUnit": "celcius" }
```

### 6.5 Notes

- Target variables exist on connector operations generally (HTTP Request, Database, Salesforce, …), in the **Advanced** section.
- They behave like normal variables; the difference is that they hold a connector's response.
- They are created inside the connector — there is no Set Variable component for them. Someone reading the flow may wonder where `vars.weatherResponse` came from, so check connectors' Advanced sections and name target variables clearly.

---

## 7. Response Timeout

### 7.1 The problem

**Illustrative example:** a user adds a phone to the cart and the spinner keeps rotating because the API doesn't respond for 10 minutes. Poor user experience → customers lost → large business loss.

- APIs serving front-ends must respond **fast**.
- Background/bulk processing (thousands or lakhs of records, document processing) can take minutes — acceptable because no one is waiting on a screen.

If a called system is not responding, it's better to stop waiting and reply "please try again after some time" than wait 10 minutes.

### 7.2 What it is

> **Response timeout** = how long the HTTP Request waits for a response. If the response doesn't arrive in time, the connector raises an **`HTTP:TIMEOUT`** error.

- **Default: 10,000 ms (10 seconds)** when nothing is configured.
- Values are in **milliseconds**: 5,000 = 5 seconds.

### 7.3 Two places to configure it

| Level | Where | Applies to |
|---|---|---|
| **Connector configuration** | Request configuration → Edit → Settings → (default) response timeout | **All** operations using that configuration |
| **Operation** | HTTP Request operation → **Response** section → Response timeout | Only that operation (*screen:* set to **5000**, with Response validator **None**) |

**Why two?** One Request configuration (same host and port) can be reused by several operations with different methods and paths.

```text
HTTP Request config (host/port)  ← timeout 11000 → applies to both
   ├── GET  /orders    (operation timeout 5000  → overrides for GET)
   └── POST /orders    (operation timeout 10000 → overrides for POST)
```

- Same timeout for all → set it once at connector level.
- Different timeouts → set them at operation level.

### 7.4 Real project example (instructor's experience)

The team deployed 8 applications to production early in the morning and was monitoring support. One app consumed a third-party API that takes about **120 seconds** (requests took 90–110 seconds). This was a **background** process, so the business accepted it.

With the default 10-second timeout, **every** request would time out even though the target eventually processes it. So they **increased the response timeout** for that call.

**Instructor's advice:** check through trial and error with the provider team whether they can reduce their response time.

### 7.5 How to test a timeout (two applications)

OpenWeatherMap responds in milliseconds, so it can't demonstrate a timeout. Instead build two apps:

```text
Application 2 (slow API):
   Listener → Transform Message (wait 10 seconds) → response

Application 1 (caller):
   Listener → HTTP Request to App 2 (response timeout 5,000 ms) → response
```

DataWeave has a **wait** function to delay output:

```dataweave
%dw 2.0
import * from dw::Runtime
output application/json
---
{ message: "done" } wait 10000
```

(Illustrative.)

**Result:** App 1 waits 5 s → `HTTP:TIMEOUT`. App 1 does not wait for App 2's eventual reply. Set App 1's timeout to 12–15 s and it succeeds.

### 7.6 Setting the right value

**Example:** front end → Experience API → Process API → two System APIs. The whole response should take ~500 ms. One System API usually takes ~5 seconds; setting its timeout to 6 seconds avoids errors, but **5–6 seconds per request is still a poor experience** for a live user. Not timing out ≠ fast enough.

Background operations (document upload/processing, huge data, run in non-business hours) can take 5–10 times longer — that's acceptable. Different data-processing strategies are used for different cases.

---

## 8. Important Terminology

| Term | Meaning |
|---|---|
| Target (Transform Message) | Where output goes: payload, a variable, or attributes |
| DataWeave Playground | Online tool to test DataWeave |
| `typeOf` | DataWeave function returning a value's type |
| `as Number` | DataWeave type conversion to number |
| Propagation | How payload/attributes/variables pass through components |
| Target Variable | Connector setting (Advanced) to store the response in a variable |
| Response timeout | Max time to wait for a response; default 10,000 ms |
| `HTTP:TIMEOUT` | Error raised when a response timeout is exceeded |
| `wait` | DataWeave function (dw::Runtime) that delays output |

---

## 9. Interview Questions

### Q1. After an HTTP Request, what happens to payload, attributes and variables?
Payload and attributes are replaced by the response; variables are unchanged (propagation).

### Q2. What is a target variable?
A connector option (Advanced tab) that stores the operation's result in a named variable instead of the payload, so the existing payload and attributes are preserved.

### Q3. If you set a target variable, how do you access the response?
`vars.<targetVariableName>`, e.g. `vars.weatherResponse.main.temp`.

### Q4. What is response timeout and its default?
The time the HTTP Request waits for a response before raising `HTTP:TIMEOUT`. Default 10,000 ms.

### Q5. Response timeout at connector level vs. operation level?
Connector level applies to all operations using that configuration; operation level applies to (and overrides for) one operation.

### Q6. Can one Transform Message create two variables where the second depends on the first?
No — targets in the same Transform Message can't see each other's results. Create them in separate sequential components.

### Q7. How would you test a response timeout?
Build a slow API (using DataWeave `wait`) and call it with a shorter timeout; the caller gets `HTTP:TIMEOUT`.

### Q8. How do you check and convert a data type in DataWeave?
`typeOf(value)` to check; `value as Number` (or other types) to convert.

---

## 10. Must Remember

1. Shape third-party responses into **your API's documented response**, output **JSON**.
2. Use **DataWeave Playground** to build mappings quickly.
3. Kelvin → Celsius: **−273.15**; check types with **`typeOf`**, convert with **`as Number`**.
4. **Propagation:** connectors overwrite **payload and attributes**, not variables.
5. Save needed values in variables **before** connectors (class: `vars.request.city`).
6. **Target Variable** (Advanced) stores the response in a variable; payload and attributes stay unchanged.
7. Using a target variable means downstream mappings must read **`vars.<name>`**, not payload.
8. Dependent variables → **separate sequential components**, not one Transform Message.
9. **Response timeout default = 10,000 ms** → `HTTP:TIMEOUT`; set at connector or operation level.
10. Front-end calls must be fast; background processing can tolerate long timeouts.
