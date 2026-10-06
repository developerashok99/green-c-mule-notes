# Day 42 — Slides and On-Screen Drawings

Screens and drawings from the Day 42 class (7 Jan 2025): why Scatter-Gather (parallel vs sequential calls), building a three-route demo, what the gathered output looks like, variables across routes, and handling a failed route with Try and On Error Continue. Repeated and blank frames have been removed. Times are positions in the video.

Notes for this day: [detailed-notes/day42.md](../../detailed-notes/day42.md) · [super-detailed-notes/day42.md](../../super-detailed-notes/day42.md) · [summary](../../day42.md)

| # | Time | Content |
|---|---|---|
| 01 | 0:02 | *Drawing:* an API calling Amazon, Flipkart and TATA Cliq REST services one after another — 250 + 350 + 400 ms |
| 02 | 7:56 | *Drawing:* sequential total = 250 + 350 + 400 + 200 = **1200 ms** |
| 03 | 11:37 | *Drawing:* Scatter-Gather — the same three calls sent in parallel routes and gathered at the end |
| 04 | 15:20 | *Drawing:* with Scatter-Gather the time is the slowest route + 200 = 400 + 200 = **600 ms** |
| 05 | 16:38 | New project scatter-gather-demo — Listener (path /scattergather) and Start Logger |
| 06 | 17:37 | Scatter-Gather dragged from Core → Routers; routes added |
| 07 | 22:08 | Three routes, each a Route N Logger + Transform Message, then End Logger |
| 08 | 23:38 | Route Transform: `output application/json` / `{"route3": "route 2 executed successfully"}` |
| 09 | 28:04 | Scatter-Gather properties: Timeout, Target, Max Concurrency |
| 10 | 30:36 | Debugger before the Scatter-Gather: payload "SG Payload", attributes, vars size 0 (a Set Payload added before it) |
| 11 | 31:01 | Inside a route: every route receives the same input payload "SG Payload" |
| 12 | 31:50 | After the Scatter-Gather: payload is a **LinkedHashMap of size 3** — keys "0", "1", "2" |
| 13 | 33:01 | Scatter-Gather output: `{"0": {attributes, payload: {"route1": …}}, "1": {…}, "2": {…}}` — one Mule message per route |
| 14 | 37:03 | Postman response unreadable — the gathered map is Java, so a Transform to JSON is needed after the Scatter-Gather |
| 15 | 38:00 | Final Transform Message after the Scatter-Gather: `output application/json` / `payload` |
| 16 | 41:51 | Postman → 200 with all three route results as JSON (keys 0, 1, 2) |
| 17 | 41:59 | Set Variable before the Scatter-Gather (test = "before SG") — visible inside every route |
| 18 | 42:45 | Set Variable inside a route ("inside route1 SG") — route variables are merged after the Scatter-Gather |
| 19 | 51:01 | Debugger after the Scatter-Gather: vars from all routes present (test, route1 …) |
| 20 | 57:15 | Error in route 2 — `1 * "a"` → "You called the function '*' with these arguments: 1: Number (1) 2: String ("a")" |
| 21 | 58:05 | Postman → **500** "Exception(s) were found for route(s): Route 2: … ExpressionRuntimeException" (COMPOSITE_ROUTING) |
| 22 | 61:49 | Error handling with On Error Continue on the flow |
| 23 | 64:21 | A **Try** scope inside route 2 with its own On Error Continue (handles the error inside the route) |
| 24 | 71:53 | On Error Continue Set Payload: `output json` / `{"errorMessage": error.description, "route1": "failed"}` |
| 25 | 75:34 | Gathered output: route 1 `{"errorMessage": "You called the function '*' …", "route1": "failed"}`, other routes succeed |
| 26 | 76:55 | Postman → 200 — the failed route's error message returned alongside the successful routes |

---

### 01 — *Drawing:* an API calling Amazon, Flipkart and TATA Cliq REST services one after another — 250 + 350 + 400 ms
![drawing-sequential](01-drawing-sequential.jpg)

### 02 — *Drawing:* sequential total = 250 + 350 + 400 + 200 = **1200 ms**
![drawing-sequential-total](02-drawing-sequential-total.jpg)

### 03 — *Drawing:* Scatter-Gather — the same three calls sent in parallel routes and gathered at the end
![drawing-scatter-gather](03-drawing-scatter-gather.jpg)

### 04 — *Drawing:* with Scatter-Gather the time is the slowest route + 200 = 400 + 200 = **600 ms**
![drawing-sg-total](04-drawing-sg-total.jpg)

### 05 — New project scatter-gather-demo — Listener (path /scattergather) and Start Logger
![new-project](05-new-project.jpg)

### 06 — Scatter-Gather dragged from Core → Routers; routes added
![drag-scatter-gather](06-drag-scatter-gather.jpg)

### 07 — Three routes, each a Route N Logger + Transform Message, then End Logger
![three-routes](07-three-routes.jpg)

### 08 — Route Transform: `output application/json` / `{"route3": "route 2 executed successfully"}`
![route-transform](08-route-transform.jpg)

### 09 — Scatter-Gather properties: Timeout, Target, Max Concurrency
![sg-properties](09-sg-properties.jpg)

### 10 — Debugger before the Scatter-Gather: payload "SG Payload", attributes, vars size 0 (a Set Payload added before it)
![debugger-before](10-debugger-before.jpg)

### 11 — Inside a route: every route receives the same input payload "SG Payload"
![debugger-route](11-debugger-route.jpg)

### 12 — After the Scatter-Gather: payload is a **LinkedHashMap of size 3** — keys "0", "1", "2"
![debugger-after](12-debugger-after.jpg)

### 13 — Scatter-Gather output: `{"0": {attributes, payload: {"route1": …}}, "1": {…}, "2": {…}}` — one Mule message per route
![sg-output-json](13-sg-output-json.jpg)

### 14 — Postman response unreadable — the gathered map is Java, so a Transform to JSON is needed after the Scatter-Gather
![postman-garbled](14-postman-garbled.jpg)

### 15 — Final Transform Message after the Scatter-Gather: `output application/json` / `payload`
![final-transform](15-final-transform.jpg)

### 16 — Postman → 200 with all three route results as JSON (keys 0, 1, 2)
![postman-sg-json](16-postman-sg-json.jpg)

### 17 — Set Variable before the Scatter-Gather (test = "before SG") — visible inside every route
![vars-before](17-vars-before.jpg)

### 18 — Set Variable inside a route ("inside route1 SG") — route variables are merged after the Scatter-Gather
![vars-in-routes](18-vars-in-routes.jpg)

### 19 — Debugger after the Scatter-Gather: vars from all routes present (test, route1 …)
![vars-merged](19-vars-merged.jpg)

### 20 — Error in route 2 — `1 * "a"` → "You called the function '*' with these arguments: 1: Number (1) 2: String ("a")"
![route-error](20-route-error.jpg)

### 21 — Postman → **500** "Exception(s) were found for route(s): Route 2: … ExpressionRuntimeException" (COMPOSITE_ROUTING)
![postman-500-composite](21-postman-500-composite.jpg)

### 22 — Error handling with On Error Continue on the flow
![on-error-continue](22-on-error-continue.jpg)

### 23 — A **Try** scope inside route 2 with its own On Error Continue (handles the error inside the route)
![try-in-route](23-try-in-route.jpg)

### 24 — On Error Continue Set Payload: `output json` / `{"errorMessage": error.description, "route1": "failed"}`
![try-error-payload](24-try-error-payload.jpg)

### 25 — Gathered output: route 1 `{"errorMessage": "You called the function '*' …", "route1": "failed"}`, other routes succeed
![output-with-failed-route](25-output-with-failed-route.jpg)

### 26 — Postman → 200 — the failed route's error message returned alongside the successful routes
![postman-200-with-error](26-postman-200-with-error.jpg)

