# Day 43 — Slides and On-Screen Drawings

Screens and drawings from the Day 43 class (8 Jan 2025): the Async scope (parent and child flows, Flow Reference inside Async), then DataWeave basics in the Playground and tutorial — MIME types, script anatomy, map, skipNullOn, and the single, index, range, multi-value and descendants selectors. Repeated and blank frames have been removed. Times are positions in the video.

Notes for this day: [detailed-notes/day43.md](../../detailed-notes/day43.md) · [super-detailed-notes/day43.md](../../super-detailed-notes/day43.md) · [summary](../../day43.md)

| # | Time | Content |
|---|---|---|
| 01 | 4:23 | *Drawing:* consumer → request → API steps (one calls the DB) → response |
| 02 | 11:38 | *Drawing:* the last step, Doc Upload, wrapped in an **Async** scope — the response goes back without waiting for it |
| 03 | 12:29 | *Drawing:* the Async Doc Upload writes to an FTP server in the background while the consumer already has the response |
| 04 | 16:16 | New project async-scope-demo — Listener (path /async), Start Logger, Set Payload, Set Variable, End Logger |
| 05 | 18:46 | Two flows: async-scope-demo-parent-flow and async-scope-demo-child-flow (Set Payload "child flow payload", Set Variable) |
| 06 | 19:36 | Flow Reference in the parent flow → flow name async-scope-demo-child-flow |
| 07 | 22:24 | Deploy error: "Already exists a listener matching that path and methods" — both flows had a Listener on the same path; child flow source removed |
| 08 | 26:45 | Debugger with a plain Flow Reference: after the child flow returns, payload is "child flow payload" and its variable is visible in the parent |
| 09 | 27:47 | Postman GET http://localhost:8081/async → 200 "child flow payload" (synchronous: the child's result comes back) |
| 10 | 28:45 | Async scope dragged from Core → Scopes and the Flow Reference placed inside it |
| 11 | 29:19 | Parent flow: Listener → Start Logger → Set Payload → Set Variable → **Async [Flow Reference]** → End Logger |
| 12 | 30:27 | Console while the Async branch runs separately (Request Uri /async, headers) |
| 13 | 31:01 | With Async: Postman → 200 "parent flow payload" — the child flow's payload/variables do not come back to the parent |
| 14 | 35:46 | DataWeave Playground (dataweave.mulesoft.com/learn/dataweave) — payload, script and output panes |
| 15 | 46:02 | Studio Transform Message with output application/json and a `{"message": "Hello world"}` sample — the same script in the Playground |
| 16 | 50:29 | DataWeave tutorial 1.2 MIME Types — application/json, application/xml, application/csv; `output application/csv header=false` |
| 17 | 52:13 | Tutorial 1.3 Script Anatomy — header (`%dw 2.0`, `input payload json`, `output csv header=false`), `---`, body |
| 18 | 59:06 | `output application/csv header=true skipNullOn="everywhere"` — error "Invalid input 's', expected ','" (skipNullOn isn't a CSV writer property) |
| 19 | 59:31 | DataWeave Reference Documentation (docs.mulesoft.com) — Basic Example, String manipulation |
| 20 | 66:22 | Docs: **Skip Null On** — `output application/xml skipNullOn="everywhere"` (elements, attributes, everywhere) — for XML / JSON outputs |
| 21 | 66:09 | Playground: CSV payload → `payload map ((item, index) -> { "fullName": item.firstName ++ " " ++ item.lastName, "age": item.age })` |
| 22 | 69:18 | Tutorial 3.1 Single Value Selector — `payload.environment`, `payload.name` |
| 23 | 72:40 | Tutorial 3.2 Index Selector — `payload[1]`, negative index `payload[-1]` ("ua") |
| 24 | 82:53 | Tutorial 3.3 Range Selector — `payload[0 to 1]` → ["prod", "qa"]; reversed range with negative indexes |
| 25 | 84:50 | Tutorial 3.4 Multi Value Selector — `payload.*name` → ["Emilia", "Isobel", "Euphemia", "Rose"]; `payload.*price` on an array |
| 26 | 88:13 | `payload.movies.*title` on XML input → ["The Terminator", "Titanic", "Avatar"] |
| 27 | 89:01 | Tutorial 3.5 Descendants Selector — `payload..echo` finds a key at any depth |
| 28 | 89:39 | Selector mistakes in the Playground return null (e.g. a wrong path) |

---

### 01 — *Drawing:* consumer → request → API steps (one calls the DB) → response
![drawing-sync-flow](01-drawing-sync-flow.jpg)

### 02 — *Drawing:* the last step, Doc Upload, wrapped in an **Async** scope — the response goes back without waiting for it
![drawing-async-doc-upload](02-drawing-async-doc-upload.jpg)

### 03 — *Drawing:* the Async Doc Upload writes to an FTP server in the background while the consumer already has the response
![drawing-async-ftp](03-drawing-async-ftp.jpg)

### 04 — New project async-scope-demo — Listener (path /async), Start Logger, Set Payload, Set Variable, End Logger
![new-project](04-new-project.jpg)

### 05 — Two flows: async-scope-demo-parent-flow and async-scope-demo-child-flow (Set Payload "child flow payload", Set Variable)
![parent-child-flows](05-parent-child-flows.jpg)

### 06 — Flow Reference in the parent flow → flow name async-scope-demo-child-flow
![flow-reference](06-flow-reference.jpg)

### 07 — Deploy error: "Already exists a listener matching that path and methods" — both flows had a Listener on the same path; child flow source removed
![listener-collision](07-listener-collision.jpg)

### 08 — Debugger with a plain Flow Reference: after the child flow returns, payload is "child flow payload" and its variable is visible in the parent
![debugger-flowref](08-debugger-flowref.jpg)

### 09 — Postman GET http://localhost:8081/async → 200 "child flow payload" (synchronous: the child's result comes back)
![postman-child-payload](09-postman-child-payload.jpg)

### 10 — Async scope dragged from Core → Scopes and the Flow Reference placed inside it
![drag-async](10-drag-async.jpg)

### 11 — Parent flow: Listener → Start Logger → Set Payload → Set Variable → **Async [Flow Reference]** → End Logger
![async-scope-flow](11-async-scope-flow.jpg)

### 12 — Console while the Async branch runs separately (Request Uri /async, headers)
![console-async-request](12-console-async-request.jpg)

### 13 — With Async: Postman → 200 "parent flow payload" — the child flow's payload/variables do not come back to the parent
![postman-parent-payload](13-postman-parent-payload.jpg)

### 14 — DataWeave Playground (dataweave.mulesoft.com/learn/dataweave) — payload, script and output panes
![dw-playground](14-dw-playground.jpg)

### 15 — Studio Transform Message with output application/json and a `{"message": "Hello world"}` sample — the same script in the Playground
![transform-hello](15-transform-hello.jpg)

### 16 — DataWeave tutorial 1.2 MIME Types — application/json, application/xml, application/csv; `output application/csv header=false`
![dw-mime-types](16-dw-mime-types.jpg)

### 17 — Tutorial 1.3 Script Anatomy — header (`%dw 2.0`, `input payload json`, `output csv header=false`), `---`, body
![dw-script-anatomy](17-dw-script-anatomy.jpg)

### 18 — `output application/csv header=true skipNullOn="everywhere"` — error "Invalid input 's', expected ','" (skipNullOn isn't a CSV writer property)
![csv-skipnullon](18-csv-skipnullon.jpg)

### 19 — DataWeave Reference Documentation (docs.mulesoft.com) — Basic Example, String manipulation
![dw-reference-docs](19-dw-reference-docs.jpg)

### 20 — Docs: **Skip Null On** — `output application/xml skipNullOn="everywhere"` (elements, attributes, everywhere) — for XML / JSON outputs
![skip-null-on-docs](20-skip-null-on-docs.jpg)

### 21 — Playground: CSV payload → `payload map ((item, index) -> { "fullName": item.firstName ++ " " ++ item.lastName, "age": item.age })`
![map-fullname](21-map-fullname.jpg)

### 22 — Tutorial 3.1 Single Value Selector — `payload.environment`, `payload.name`
![single-value-selector](22-single-value-selector.jpg)

### 23 — Tutorial 3.2 Index Selector — `payload[1]`, negative index `payload[-1]` ("ua")
![index-selector](23-index-selector.jpg)

### 24 — Tutorial 3.3 Range Selector — `payload[0 to 1]` → ["prod", "qa"]; reversed range with negative indexes
![range-selector](24-range-selector.jpg)

### 25 — Tutorial 3.4 Multi Value Selector — `payload.*name` → ["Emilia", "Isobel", "Euphemia", "Rose"]; `payload.*price` on an array
![multi-value-selector](25-multi-value-selector.jpg)

### 26 — `payload.movies.*title` on XML input → ["The Terminator", "Titanic", "Avatar"]
![multi-value-xml](26-multi-value-xml.jpg)

### 27 — Tutorial 3.5 Descendants Selector — `payload..echo` finds a key at any depth
![descendants-selector](27-descendants-selector.jpg)

### 28 — Selector mistakes in the Playground return null (e.g. a wrong path)
![descendants-null](28-descendants-null.jpg)

