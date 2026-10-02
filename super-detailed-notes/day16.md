# Day 16 — Error Handling (Part 2): ANY Order, Parent/Child Flows, On Error Continue, Error Mapping, Global Handler, Try, Raise Error, Choice

## 1. Overview

1. Adding an **ANY** handler; copying components through the XML
2. Demonstration: ANY at the top vs. at the bottom
3. How On Error Propagate works across **parent and child flows** (Flow Reference)
4. **On Error Continue** — difference from On Error Propagate
5. Error handler XML structure
6. **Error mapping** — converting an error type into your own
7. Three levels: **flow, application (global), component (Try)**
8. **Raise Error** for business errors
9. **Choice router** for conditional routing

---

## 2. Adding an ANY Handler

Day 15 had two On Error Propagate handlers: `HTTP:NOT_FOUND` and `MULE:EXPRESSION`. Any other error went to Mule's default handler. Instead, add a catch-all:

- Drag another **On Error Propagate**. Leave **Type empty** (or choose **ANY**) — it matches all errors.
- It needs the same Logger and Transform Message as the others.

### Copying via XML — technique

Instead of copy/paste in the canvas (which adds "Copy of" names):

1. Right-click a component → **Go to XML** — the editor jumps to its XML.
2. Find the range: e.g., Logger on line 82, Transform Message from 83 to 97 (use the collapse icon on line 83 to see where it ends).
3. Select lines 82–97 → **Ctrl+C**.
4. The new On Error Propagate is written as a single self-closing tag; to get an opening and closing tag, drag a **dummy Logger** into it.
5. Go to its XML, place the cursor between the opening and closing tags, **paste**.
6. Studio asks about **duplicate doc IDs** → click **Yes** to regenerate them.
7. Delete the dummy Logger.

Then adjust values — for ANY, keep **500 Internal Server Error**, since unknown errors are usually server-side. In real projects, the error structure is defined in the specification; often error handling is **reused** from existing projects.

Everything you drag and drop is XML in Configuration XML. The flow's tags enclose source, process and the `<error-handler>`; copying must respect these opening and closing tags.

---

## 3. Demonstration — ANY at the Top vs. the Bottom

### 3.1 ANY at the top

Using XML: the ANY handler (lines 99–116) was **cut** (Ctrl+X) and **pasted** at the start of the error handler (line 63).

```text
<error-handler>
   On Error Propagate  type=ANY            ← first
   On Error Propagate  type=HTTP:NOT_FOUND
   On Error Propagate  type=MULE:EXPRESSION
</error-handler>
```

A `MULE:EXPRESSION` error was triggered. It should go to the MULE:EXPRESSION handler — but it went to **ANY**. Handlers are checked in order; ANY matched first.

(The order isn't visible as a "rule" anywhere — it happens in the background based on position.) The instructor also remarked that if the expression type were unticked in that handler's type selection, the error would not go there.

> **Transcript unclear:** it isn't clear from the recording how the type selection was shown on screen. The reliable rule is the one demonstrated: an ANY handler placed first catches everything.

### 3.2 ANY at the bottom

ANY was moved back to the end (cut and pasted before `</error-handler>`).

- `MULE:EXPRESSION` → its own handler. ✔
- A wrong weather host → `HTTP:CONNECTIVITY` → no specific handler → **ANY**. ✔
- Without ANY, it would go to the **default** error handler.

### 3.3 How many specific handlers?

Common ones: bad gateway, bad request, unauthorized, not found, method not allowed, connectivity… — about 5–6. Rare errors go to ANY.

---

## 4. On Error Propagate — Summary and Parent/Child Flows

### 4.1 Single flow

> On Error Propagate catches errors whose type matches, executes its components (set payload, variables, log), and **propagates the error to the next level**. In a Listener flow, the next level is the source: the Listener sends its **Error Response**.

```text
Success:  Listener → components → Listener "Response" section
Error:    Listener → component fails → On Error Propagate (match)
                   → Listener "Error Response" section
```

### 4.2 Parent and child flows

Real projects have many flows; one flow calls another with **Flow Reference**.

- **Parent flow** = calling flow; **child flow** = called flow. With three flows A → B → C, A is parent of B, B is parent of C.

```text
Parent flow:  Listener → … → Flow Reference ──► Child flow: … error!
              (error handler)                    (error handler?)
```

**Case 1 — child has no error handling (or none matches):** the error propagates to the **parent**. If the parent's handler matches, it executes and the error goes to the Listener's Error Response.

**Case 2 — child has a matching On Error Propagate:** it executes in the child, then propagates the error to the parent. If the parent also has a matching handler, that executes too; then the Listener's Error Response is used.

> On Error Propagate passes the error response from one level to the level above until it reaches the source.

These modules are learned separately now and combined in an end-to-end use case later.

---

## 5. On Error Continue

### 5.1 Meaning

> **On Error Continue** catches the error, executes its components, and sends a **success** response to the next level — not an error.

| | On Error Propagate | On Error Continue |
|---|---|---|
| After handling | Propagates the **error** | Continues as **success** |
| Listener section used | Error Response | **Response** (success) |
| Default status | Error (e.g., 500) | **200 OK** |
| Usage | Most of the time | ~10–25% of the time |

### 5.2 Demonstration

The ANY handler was replaced with On Error Continue (same Logger and Transform Message). A wrong host caused `HTTP:CONNECTIVITY`.

Result: **200 OK** — even though the transform set `statusCode = 500`. The response went through the Listener's **success** Response section, which doesn't use those variables.

### 5.3 Real usage

Using On Error Continue for a whole flow, as above, is **not** a real use case. It is used with the **Try** scope (§8): when an error in one component or a group of components should not stop the rest of the flow — e.g. inside **For Each** or **Scatter-Gather** (shown later).

---

## 6. Error Handler XML Structure

- An empty flow has **no** `<error-handler>` tag.
- Dragging an On Error Propagate/Continue into the error section creates `<error-handler> … </error-handler>`.

```xml
<flow name="consume-rest-service-7303Flow">
  <http:listener ... />
  <!-- process components -->
  <error-handler>
    <on-error-propagate type="HTTP:NOT_FOUND"> ... </on-error-propagate>
    <on-error-propagate type="MULE:EXPRESSION"> ... </on-error-propagate>
    <on-error-continue type="ANY"> ... </on-error-continue>
  </error-handler>
</flow>
```

A handler with no inner components is a single self-closing tag (`<on-error-continue … />`). That's why the dummy-component trick is needed to paste between tags.

The error handling configured inside a flow is **flow-level** error handling. If flow B is called from flow A via Flow Reference, A's handler also applies to errors propagated from B. Independent flows don't share flow-level handlers.

---

## 7. Error Mapping

### 7.1 Idea

Convert a connector's error type into a **custom, meaningful** type.

**Example:** HTTP Request to the weather API → `HTTP:CONNECTIVITY` becomes `WEATHER:CONNECTIVITY`.

### 7.2 How

HTTP Request → **Error Mapping** tab → add a mapping:

| Source error type | Target error type |
|---|---|
| `HTTP:CONNECTIVITY` | `WEATHER:CONNECTIVITY` |

```xml
<http:request config-ref="Weather_Request_config" method="GET" path="${weather.path}">
  <error-mapping sourceType="HTTP:CONNECTIVITY" targetType="WEATHER:CONNECTIVITY" />
</http:request>
```

(Representative.)

### 7.3 Result

The error object showed **`WEATHER:CONNECTIVITY`**. A handler for `HTTP:CONNECTIVITY` would **no longer** match; handlers must use the new type. In the demo it went to ANY.

Used in **very rare** instances; asked in certification questions.

---

## 8. Three Levels of Error Handling

| Level | How | Scope |
|---|---|---|
| **Flow level** | Handlers in a flow's error-handling section | That flow (and child flows it calls) |
| **Application / global level** | A named **Error Handler** in a separate XML, referenced by flows or set as the default | All flows that use it |
| **Component level** | **Try** scope around one component or a group | Only those components |

### 8.1 Application (global) level — steps

1. Right-click → New → **Mule Configuration File**, e.g. `common-error-handler.xml`.
2. Drag an **Error Handler** component (a scope/box) onto the canvas. On Error Propagate alone can't be dropped at top level — it must be inside an Error Handler.

   > Error Handler: executes when an error is raised and routes it to the **first matching** handler. It can contain any number of On Error Continue / On Error Propagate handlers, matched by error type or a DataWeave expression.

3. Move the existing handlers into it: in the main flow's XML, cut everything between `<error-handler>` and `</error-handler>`; in the new file drop a dummy component to get the Error Handler's tags; paste; delete the dummy.
4. Remove the now-empty `<error-handler>` tag from the main flow.
5. Use it:
   - **Per flow:** in the flow's error-handling section, set a **reference** to the named error handler; or
   - **Default for the whole application:** **Global Elements → Create → Global Configurations → Configuration** → **Default Error Handler** = the named handler.

```xml
<!-- common-error-handler.xml -->
<error-handler name="common-error-handler">
  <on-error-propagate type="HTTP:NOT_FOUND"> ... </on-error-propagate>
  <on-error-propagate type="MULE:EXPRESSION"> ... </on-error-propagate>
  <on-error-propagate type="ANY"> ... </on-error-propagate>
</error-handler>

<!-- global configuration -->
<configuration defaultErrorHandler-ref="common-error-handler" />
```

(Representative.)

**Result:** `WEATHER:CONNECTIVITY` was handled by the global handler even though the flow had no handler of its own. All flows in the project use the same handler. **Instructor:** in real time, error handling is usually maintained separately like this. Shown again in the end-to-end project.

### 8.2 Component level — Try scope

**Why?** A success status code validator applies only to one HTTP Request. What if a group of components (e.g. HTTP Request + Transform Message) should continue even if they fail?

1. Select the components (click first, Shift+click last) → right-click → **Wrap in → Try**. (Or drag **Try** from Core → Scopes and move components into it.)
2. Inside Try's error handling, add **On Error Continue** (optionally a Logger printing `error.description`).

```text
Flow
 ├── Logger
 ├── Try
 │    ├── HTTP Request (weather)
 │    ├── Transform Message
 │    └── Error handling: On Error Continue → Logger(error.description)
 └── Logger            ← continues even if Try's components failed
```

**Demo:** the weather call failed (connectivity), then mapping failed; each time On Error Continue handled it inside Try, and processing continued → success response.

On Error Continue inside Try can even be empty — it just swallows the error and continues.

Better use cases (For Each, Scatter-Gather) come later.

### 8.3 Components for error handling in Mule 4

**On Error Propagate, On Error Continue, Raise Error, Error Handler, Try scope.**

---

## 9. Raise Error

### 9.1 Why

Technical errors (HTTP connectivity, timeouts, …) are raised **automatically**. Some **business** situations are technically fine but must be rejected. Use **Raise Error** to raise them yourself, with your own error type.

### 9.2 Example — loan application age

**Rule (illustrative):** applicant's age must be **> 17 and < 66** (18–65). A 67-year-old applicant may not repay → reject with an error even though nothing technically failed.

### 9.3 Demo application

```text
Listener (path /raiseError)
Choice
  ├── when: payload.age > 17 and payload.age < 66
  │         → Set Payload "Loan application is successful"
  └── default
            → Raise Error
                type: BUSINESS:AGE_NOT_IN_BRACKET
                description: "Age is not in the specified limits"
Logger
```

**Raise Error configuration:**

| Field | Value |
|---|---|
| Type | `namespace:identifier` — namespace = main category (here `BUSINESS`), identifier = specific error (age not in bracket) |
| Description | `Age is not in the specified limits` |

(Exact identifier text approximated from the transcript.)

### 9.4 Result

Request body `{ "age": 45 }` → success message. `{ "age": 68 }` → default route → Raise Error → error object with **errorType = BUSINESS:…** and **description = "Age is not in the specified limits"**. No error handler → default handler → 500 with the description.

**Port note:** another app was still running in Studio, so the new one couldn't start (the instructor also noted that Debug mode itself uses port **6666**). Stop the other app first.

---

## 10. Choice Router

> **Choice** routes the message based on conditions — like if / else if / else.

- Each route has a **When** condition (DataWeave expression).
- The **Default** route runs when no condition matches.
- Routes are evaluated **in order**; the **first** matching route runs; later ones are skipped.
- A route can contain any number of components.

### Adding routes

Drag a component onto the Choice; a **black line** shows where a new route will be created.

### Example with three ranges

| Route | Condition | Action |
|---|---|---|
| 1 | `payload.age > 17 and payload.age < 30` | Set Payload "Loan processing — 18 to 29" |
| 2 | `payload.age >= 30 and payload.age < 41` | Set Payload "Loan processing — 30 to 40" |
| 3 | `payload.age >= 41 and payload.age < 66` | Set Payload "Loan processing different for 41 to 65" |
| Default | — | Raise Error |

(Ranges as described; exact boundaries approximated.)

Age 35: route 1 doesn't match → route 2 matches → its response. Choice is used regularly for conditional logic.

---

## 11. Important Terminology

| Term | Meaning |
|---|---|
| ANY | Error type matching all errors |
| Go to XML | Jump to a component's XML |
| Doc ID | Unique ID of each component in XML |
| Parent / child flow | Calling flow / flow called via Flow Reference |
| On Error Continue | Handle the error and continue as success |
| Error mapping | Convert a connector's error type into a custom type |
| Error Handler (component) | Container of handlers; can be global and named |
| Default error handler (configuration) | Global setting to apply a named handler to all flows |
| Try scope | Component-level error handling for one or more components |
| Raise Error | Raise a custom (business) error with type and description |
| Choice router | Conditional routing; first matching route + default |

---

## 12. Interview Questions

### Q1. Difference between On Error Propagate and On Error Continue?
Propagate handles the error and re-throws it to the next level (Listener returns its Error Response). Continue handles the error and returns a success to the next level (Listener returns its success Response, 200 by default).

### Q2. Why must ANY be last?
Handlers are evaluated in order and the first match handles the error. ANY matches everything, so specific handlers after it are never reached.

### Q3. If a child flow called with Flow Reference raises an error, where is it handled?
In the child's matching handler (then propagated up); if none matches, it propagates to the parent flow's handler; ultimately to the Listener.

### Q4. What is error mapping?
A connector-operation setting that converts its error type (e.g. `HTTP:CONNECTIVITY`) into a custom type (e.g. `WEATHER:CONNECTIVITY`). Handlers must then match the custom type.

### Q5. What are the levels of error handling?
Flow level, application/global level (named Error Handler referenced or set as default in a Configuration global element), and component level (Try scope).

### Q6. How do you make one error handler apply to all flows?
Create a named Error Handler in a separate XML file and set it as the Default Error Handler in a Configuration global element.

### Q7. When do you use the Try scope?
When errors in one component or a group of components must be handled separately — often with On Error Continue so the flow continues (e.g. in For Each or Scatter-Gather).

### Q8. When do you use Raise Error?
To raise business errors (rules that aren't technical failures), with a custom `namespace:identifier` type and description.

### Q9. How does the Choice router evaluate conditions?
In order; the first true condition's route executes; if none is true, the default route executes.

---

## 13. Must Remember

1. ANY = catch-all; **always last**. Demonstrated: ANY at top stole a MULE:EXPRESSION error.
2. Copy components via **Go to XML** (+ dummy component trick); accept doc ID regeneration.
3. On Error Propagate passes the error **up** (child → parent → Listener Error Response).
4. On Error Continue returns **success (200)** → used mainly with **Try**.
5. **Error mapping**: `HTTP:CONNECTIVITY` → `WEATHER:CONNECTIVITY`; handlers must match the new type.
6. **Global error handler**: named Error Handler in its own XML + **Configuration → Default Error Handler** (or reference per flow).
7. Three levels: **flow, application, component (Try)**.
8. **Raise Error** for business rules; type `NAMESPACE:IDENTIFIER` + description.
9. **Choice**: ordered conditions, first match wins, **default** otherwise.
10. Error handling components: **On Error Propagate, On Error Continue, Raise Error, Error Handler, Try**.
