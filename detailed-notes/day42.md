# Day 42 — Detailed Notes: Scatter-Gather

> **Watch alongside:**
> - The price-comparison drawing explains the whole point: independent calls run in parallel, so the total time is the slowest route, not the sum.
> - The second half covers what interviewers now ask — the shape of the gathered output, what happens to variables modified in routes, max concurrency 1, and how to stop one failed route from failing everything.

> **Video-verified:** written from the cleaned transcript and the class recording (7 Jan 2025). Slide images: [slides/day42](../slides/day42/).

---

## 1. Sequential vs. Parallel

![Scatter-Gather drawing](../slides/day42/03-drawing-scatter-gather.jpg)

```mermaid
flowchart LR
    In["iPhone price request"] --> SG{"Scatter-Gather"}
    SG --> A["Route 0: Amazon<br/>250 ms"]
    SG --> F["Route 1: Flipkart<br/>350 ms"]
    SG --> T["Route 2: Tata Cliq<br/>400 ms"]
    A --> G["Gather"]
    F --> G
    T --> G
    G --> Out["Next processors (200 ms)"]
```

| | Sequential | Scatter-Gather |
|---|---|---|
| Time | 250 + 350 + 400 + 200 = **1200 ms** | 400 + 200 = **600 ms** |
| Use when | Calls depend on each other | Calls are independent |

- At least 2 routes; every route gets the same payload, attributes and variables.

---

## 2. Properties

![Scatter-Gather properties](../slides/day42/09-sg-properties.jpg)

| Property | Meaning |
|---|---|
| Timeout | Per-route wait (ms) |
| Target | Store the result in a variable |
| Max Concurrency | Parallel routes; **1 = sequential** |

---

## 3. The Gathered Output

![Gathered output](../slides/day42/13-sg-output-json.jpg)

```mermaid
flowchart LR
    SG["Scatter-Gather result<br/>LinkedHashMap size 3"] --> K0["0: attributes, payload …"]
    SG --> K1["1: attributes, payload …"]
    SG --> K2["2: attributes, payload …"]
```

- An **object of objects** (not an array), keyed from "0".
- It's Java — add a Transform (`output application/json` / `payload`) or Postman shows it unreadable.

---

## 4. Variables Across Routes

![Variables merged](../slides/day42/19-vars-merged.jpg)

| Case | After the Scatter-Gather |
|---|---|
| Set before, unchanged | Same value |
| Modified in one route | That value |
| Modified in two routes | **Collection** of both values |
| Created in a route | Available outside |

---

## 5. Errors in a Route

```mermaid
flowchart TB
    R2["Route 2 fails: 1 * &quot;a&quot;"] --> Others["Other routes still complete"]
    Others --> CR["COMPOSITE_ROUTING → 500<br/>Exception(s) were found for route(s): Route 2"]
    Fix["Try + On Error Continue in EACH route<br/>Set Payload errorMessage + route failed"] --> OK["200 — failed route reported<br/>alongside successful routes"]
```

![Try inside a route](../slides/day42/23-try-in-route.jpg)

- Putting the whole Scatter-Gather in a Try continues the flow but loses the route results.
- Try inside each route keeps every result; the error payload tells you which route failed.
- Key order can change between runs (parallel) — label each route's result.

---

## Quick Recap
- Scatter-Gather runs independent routes in parallel; time = slowest route.
- Output: object of objects keyed "0", "1", "2" — convert to JSON.
- Timeout per route; Target to a variable; Max Concurrency 1 = sequential.
- Variables modified in several routes become a collection; new route variables are visible afterwards.
- A failed route gives COMPOSITE_ROUTING after all routes finish; handle with Try + On Error Continue in every route.
