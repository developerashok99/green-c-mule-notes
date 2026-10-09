# Day 42 — Scatter-Gather: Parallel Routes, Gathered Output, Variables Across Routes and Error Handling (Hands-On)

> **Sources:**
> - Cleaned audio transcript ([transcripts-cleaned/day42.txt](../transcripts-cleaned/day42.txt)) and the class video (recorded 7 Jan 2025).
> - Text marked *screen* or *drawing* is read from the recording.
> - Slide images: [slides/day42](../slides/day42/).

## 1. Overview

1. Use case — a price-comparison API calling three e-commerce APIs
2. Sequential (1200 ms) vs. Scatter-Gather (600 ms)
3. When **not** to use Scatter-Gather (dependencies); minimum routes
4. Hands-on: scatter-gather-demo with three routes
5. Properties — **Timeout, Target, Max Concurrency**
6. What each route receives; the **gathered output**
7. Converting the output to JSON
8. **Variables** across routes — modified and new
9. **Max concurrency = 1** → sequential
10. **Errors** in a route — COMPOSITE_ROUTING
11. Handling with **Try + On Error Continue** in each route
12. Summary / interview points

The session intro also named the **Async scope** as the next component.

---

## 2. The Use Case

- The name says it: **scatter** the request, then **gather** the responses.
- A **mobile price-comparison website** collects prices from **Amazon, Flipkart and Tata Cliq**, which expose REST APIs.
- The comparison site's backend API gets "compare prices for an iPhone" from the front end.
- Each e-commerce API is called with an **HTTP Request** connector.

### 2.1 Sequential

*Drawing:*

| Step | Time |
|---|---|
| Amazon | 250 ms |
| Flipkart | 350 ms |
| Tata Cliq | 400 ms |
| Other processing | 200 ms |
| **Total** | **1200 ms** |

- Is Amazon's request or response needed for Flipkart or Tata Cliq? **No dependency** — yet we wait for each before the next.

### 2.2 Scatter-Gather

*Drawing:* the same three calls in parallel **routes**, gathered at the end.

1. The request is scattered into route 1 (Amazon), route 2 (Flipkart), route 3 (Tata Cliq) — all at the same time.
2. At 250 ms Amazon finishes and **waits** at the gather point.
3. At 350 ms Flipkart, at 400 ms Tata Cliq.
4. Scatter-Gather time = the **slowest route** = 400 ms.
5. Total = 400 + 200 = **600 ms**.

- Advantage: **time saving** / performance.
- It's all **one API** — one HTTP connector per route instead of three in a row.

---

## 3. When to Use It

- Use it when calls are **independent** — scope for parallel processing.
- **Can't** use it when there's a dependency (Amazon's response is Flipkart's input, or Flipkart must run after Amazon).
- Sequential isn't wrong; Scatter-Gather is for better performance.

**Number of routes:**

- At least **two** — with one there's no point.
- Maximum: the instructor has used 4–5 and hasn't seen a restriction.

**Input:** every route gets the **same copy** of payload, attributes and variables.

---

## 4. Hands-On: scatter-gather-demo

1. *Screen:* new project **scatter-gather-demo** — Listener path **`/scattergather`**, Start Logger.
2. *Screen:* **Core → Routers → Scatter-Gather**.
3. Add routes the same way as for the Choice router.
4. *Screen:* three routes, each **Route N Logger + Transform Message**, then **End Logger**.

*Screen — a route's Transform:*

```dataweave
%dw 2.0
output application/json
---
{"route3": "route 2 executed successfully"}
```

- Any message processors can go in a route.
- No real price-comparison APIs here — loggers and transforms keep it simple.

---

## 5. Properties

*Screen:* **Timeout, Target, Max Concurrency**.

| Property | Meaning |
|---|---|
| **Timeout** | Milliseconds to wait for **each route**; if a route doesn't respond in time, it times out. Default = wait for the longest route |
| **Target** | Target variable — the whole Scatter-Gather result goes there instead of overwriting the payload |
| **Max Concurrency** | Maximum parallelism — how many routes run at once |

- Mostly left as default; set Target only if needed.
- Target variable and reconnection strategy are common across connectors (as with HTTP).

**Analogy for concurrency:** three tasks at home — one person does them one after another; three people do them in parallel. Scatter-Gather assigns **one thread per route**.

---

## 6. Debugging the Flow

A **Set Payload** ("SG Payload") was added before the Scatter-Gather.

| Point | What the debugger shows |
|---|---|
| Before | *Screen:* payload "SG Payload", default headers, empty query/URI params, vars size 0 |
| Inside a route | *Screen:* every route receives the same payload "SG Payload" |
| After | *Screen:* payload is a **LinkedHashMap of size 3** — keys **"0", "1", "2"** |

- The debugger shows the parallel routes one by one.

### 6.1 The gathered output

*Screen:*

```json
{
  "0": { "attributes": {…}, "payload": {"route1": "…"}, … },
  "1": { "attributes": {…}, "payload": {…}, … },
  "2": { "attributes": {…}, "payload": {…}, … }
}
```

- One **Mule message per route**: inbound attachment names, exception payload, inbound/outbound property names, attributes, payload.
- Routes are numbered from **"0"**, not 1.
- Certification answer: the output is **an object of all route responses** — an **object of objects**, not an array.

---

## 7. Converting to JSON

- *Screen:* Postman response unreadable — the gathered map is **Java**.
- *Screen:* add a Transform after the Scatter-Gather:

```dataweave
%dw 2.0
output application/json
---
payload
```

- *Screen:* Postman → **200** with all three route results as JSON (keys 0, 1, 2).

---

## 8. Variables Across Routes

*Screen:* **Set Variable** before the Scatter-Gather — `test = "before SG"`.

- Visible inside **every** route (same copy).

*Screen:* Set Variable inside the routes:

- Route 1 overwrites `test` ("inside route1 SG").
- Route 2 also modifies `test` and creates a **new** variable.
- Route 3 does nothing.

*Screen — after the Scatter-Gather:* all variables present.

| Case | Value after Scatter-Gather |
|---|---|
| Variable modified in **one** route | That single value |
| Variable modified in **two** routes | A **collection** of the modified values (`vars.test` → an array of both) |
| New variable created in a route | **Accessible** after the Scatter-Gather |

**Instructor's experience (interviews):**

- 1.5–3 years ago they asked "what's the total time?"
- Now: how do you handle errors in Scatter-Gather; what's a modified variable's value afterwards; can a route's new variable be accessed outside.

---

## 9. Max Concurrency = 1

- Doesn't limit it to one route — it runs the routes **sequentially**: route 1, then 2, then 3.
- Interview answer to "how do you make Scatter-Gather sequential?" → **max concurrency 1**.
- Empty = it decides automatically and runs routes in parallel.

---

## 10. An Error in a Route

*Screen:* route 2 has a Set Variable with `1 * "a"`:

```text
You called the function '*' with these arguments:
  1: Number (1)
  2: String ("a")
```

**What happens:**

1. All routes start.
2. Route 2 fails — but the **other routes still complete**.
3. The Scatter-Gather waits for all routes, then raises the error.
4. No error handler → default handler.
5. *Screen:* Postman → **500** *"Exception(s) were found for route(s): Route 2: … ExpressionRuntimeException"* (**COMPOSITE_ROUTING**).

- The message tells you which route failed.
- The flow **stops** — it doesn't continue past the Scatter-Gather.

---

## 11. Handling Route Errors

Component-level handling → **Try** scope. Two ideas:

### 11.1 Scatter-Gather inside a Try

- *Screen:* On Error Continue (no error type = any error).
- The flow continues, but you **lose the routes' responses** — dropped.

### 11.2 Try inside each route

*Screen:* a Try with its own **On Error Continue** inside a route.

- With an empty On Error Continue, that route's payload is just the **input payload** — no error information.
- Add a **Set Payload** in the On Error Continue:

```dataweave
output json
---
{"errorMessage": error.description, "route1": "failed"}
```

- Now the gathered output shows which route failed and why.
- Do it in **every** route (Wrap in → Try, copy the Set Payload, change the route label).

*Screen — gathered output:* route 1 `{"errorMessage": "You called the function '*' …", "route1": "failed"}`; the other routes succeed.

*Screen:* Postman → **200** — the failed route's error alongside the successful routes.

**Order:** in this run, key "0" held route 2, "1" route 3, "2" route 1 — the order can change because routes run in parallel; the labels tell you which is which.

> **Interview answer:** "To continue without failing, use a Try scope with On Error Continue in each and every route."

---

## 12. Summary

1. Output = **object of objects** (one per route), not an array.
2. Variable modified in one route → single value; in two routes → collection.
3. New variables in routes are accessible after the Scatter-Gather.
4. Max concurrency 1 → sequential.
5. A failed route doesn't stop the others; the Scatter-Gather then errors (COMPOSITE_ROUTING) unless each route has Try + On Error Continue.

---

## 13. Important Terminology

| Term | Meaning |
|---|---|
| Scatter-Gather | Router that sends a copy of the event to all routes in parallel and gathers the results |
| Route | One branch of the Scatter-Gather |
| Timeout | Per-route wait limit |
| Target | Variable to hold the result instead of the payload |
| Max Concurrency | Maximum routes running in parallel; 1 = sequential |
| COMPOSITE_ROUTING | Error raised when one or more routes fail |
| Try scope | Component-level error handling |
| On Error Continue | Handles the error and continues |

---

## 14. Interview Questions

### Q1. When do you use Scatter-Gather?
When independent calls can run in parallel — e.g. fetching prices from three e-commerce APIs. Total time becomes the slowest route plus the rest of the flow.

### Q2. When can't you use it?
When one call depends on another's response or must run after it.

### Q3. What does Scatter-Gather return?
An object (LinkedHashMap) keyed "0", "1", "2"…, each holding that route's Mule message — an object of objects, not an array.

### Q4. A variable defined before is modified in two routes — what's its value after?
A collection of both modified values. Modified in one route, it's that value; new variables created in routes are available afterwards.

### Q5. How do you make Scatter-Gather sequential?
Set Max Concurrency to 1.

### Q6. What happens if one route fails?
The other routes still finish, then a COMPOSITE_ROUTING error is raised and the flow stops (500 by default).

### Q7. How do you continue even if a route fails?
Wrap each route's processors in a Try scope with On Error Continue, and set a payload describing the error so the gathered result shows which route failed.

---

## 15. Must Remember

1. Scatter = same copy to every route; gather = combine results.
2. At least 2 routes.
3. Time = slowest route.
4. Output keys start at **"0"**.
5. Convert the gathered Java map to JSON with a Transform.
6. Timeout is per route; Target stores the result in a variable.
7. Max concurrency 1 → sequential.
8. Modified in 2 routes → collection; new route variables survive.
9. Route failure → COMPOSITE_ROUTING after all routes finish.
10. Try + On Error Continue in **each** route, with an error payload.
