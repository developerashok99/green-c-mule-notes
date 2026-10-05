# Day 06 — Slides and On-Screen Drawings

Frames captured from the Day 6 class recording (MuleSoft Telugu Course Day 6, recorded 6 Nov 2024). Repeated and blank frames have been removed. Times are positions in the video.

Notes for this day: [detailed-notes/day06.md](../../detailed-notes/day06.md) · [super-detailed-notes/day06.md](../../super-detailed-notes/day06.md) · [summary](../../day06.md)

| # | Time | Content |
|---|---|---|
| 01 | 3:54 | Agenda for today |
| 02 | 6:46 | HTTP request sent over HTTP or HTTPS to the API (drawing on the agenda slide) |
| 03 | 9:37 | What is HTTP? |
| 04 | 24:16 | Studio: HTTP_Listener_config — Protocol HTTP (Default), 0.0.0.0, port 8081, TLS tab (screen) |
| 05 | 18:43 | HTTP methods — Postman → API → Emp DB, employee 102 (slide + drawing) |
| 06 | 24:55 | URL = protocol + host + port + resource path (drawing) |
| 07 | 46:09 | HTTP request: body, headers, query params, URI params, URL, method, authorization (drawing) |
| 08 | 20:21 | Query parameters — XYZ company, filter/sort/paginate, ?salary=10000 & sortBySal=DESC (drawing) |
| 09 | 49:21 | Postman: Query Params empid=123 → ?empid=123 (screen) |
| 10 | 49:04 | URI params — Unique Resource Identifier, /api/employees/{empid} (drawing) |
| 11 | 66:04 | Postman: GET with query param and body {"empid":120} → 200 OK, employee 120 (screen) |
| 12 | 66:27 | Postman: /empdetails1 → 404 Not Found, "No listener for endpoint" (screen) |
| 13 | 46:06 | Transformation of HTTP Request to Mule 4 Event (preview of Day 07) |
| 14 | 48:53 | Mule Event — payload, attributes, variables (preview of Day 07) |
| 15 | 48:59 | HTTP response codes — 1xx to 5xx |
| 16 | 62:18 | 200 OK, 201 Created, 204 No Content ("200 series → success responses") |
| 17 | 58:46 | 400 Bad Request, 401 Unauthorized, 403 Forbidden |
| 18 | 62:35 | 404 Not Found, 405 Method not allowed, 415 Unsupported media type |
| 19 | 67:30 | 500 Internal Server Error, 501 Not Implemented, 502 Bad Gateway |
| 20 | 67:47 | 503 Service Unavailable, 504 Gateway Timeout |
| 21 | 73:00 | JSON — JavaScript object notation; employee example with array, null and nested object (drawing) |
| 22 | 83:05 | Data types accepted by JSON — no date type (drawing) |
| 23 | 83:10 | JSON properties — key/value, "XYZ1000" string (drawing) |

---

### 01 — Agenda for today
![agenda](01-agenda.jpg)

### 02 — HTTP request sent over HTTP or HTTPS to the API (drawing on the agenda slide)
![http-https-request-drawing](02-http-https-request-drawing.jpg)

### 03 — What is HTTP?
![what-is-http](03-what-is-http.jpg)

### 04 — Studio: HTTP_Listener_config — Protocol HTTP (Default), 0.0.0.0, port 8081, TLS tab (screen)
![studio-listener-protocol-http](04-studio-listener-protocol-http.jpg)

### 05 — HTTP methods — Postman → API → Emp DB, employee 102 (slide + drawing)
![http-methods-drawing](05-http-methods-drawing.jpg)

### 06 — URL = protocol + host + port + resource path (drawing)
![url-structure-drawing](06-url-structure-drawing.jpg)

### 07 — HTTP request: body, headers, query params, URI params, URL, method, authorization (drawing)
![http-request-parts-drawing](07-http-request-parts-drawing.jpg)

### 08 — Query parameters — XYZ company, filter/sort/paginate, ?salary=10000 & sortBySal=DESC (drawing)
![query-params-drawing](08-query-params-drawing.jpg)

### 09 — Postman: Query Params empid=123 → ?empid=123 (screen)
![postman-query-params](09-postman-query-params.jpg)

### 10 — URI params — Unique Resource Identifier, /api/employees/{empid} (drawing)
![uri-params-drawing](10-uri-params-drawing.jpg)

### 11 — Postman: GET with query param and body {"empid":120} → 200 OK, employee 120 (screen)
![postman-200-ok](11-postman-200-ok.jpg)

### 12 — Postman: /empdetails1 → 404 Not Found, "No listener for endpoint" (screen)
![postman-404-not-found](12-postman-404-not-found.jpg)

### 13 — Transformation of HTTP Request to Mule 4 Event (preview of Day 07)
![http-request-to-mule-event](13-http-request-to-mule-event.jpg)

### 14 — Mule Event — payload, attributes, variables (preview of Day 07)
![mule-event](14-mule-event.jpg)

### 15 — HTTP response codes — 1xx to 5xx
![response-code-series](15-response-code-series.jpg)

### 16 — 200 OK, 201 Created, 204 No Content ("200 series → success responses")
![response-codes-2xx](16-response-codes-2xx.jpg)

### 17 — 400 Bad Request, 401 Unauthorized, 403 Forbidden
![response-codes-4xx-1](17-response-codes-4xx-1.jpg)

### 18 — 404 Not Found, 405 Method not allowed, 415 Unsupported media type
![response-codes-4xx-2](18-response-codes-4xx-2.jpg)

### 19 — 500 Internal Server Error, 501 Not Implemented, 502 Bad Gateway
![response-codes-5xx-1](19-response-codes-5xx-1.jpg)

### 20 — 503 Service Unavailable, 504 Gateway Timeout
![response-codes-5xx-2](20-response-codes-5xx-2.jpg)

### 21 — JSON — JavaScript object notation; employee example with array, null and nested object (drawing)
![json-example-drawing](21-json-example-drawing.jpg)

### 22 — Data types accepted by JSON — no date type (drawing)
![json-data-types-drawing](22-json-data-types-drawing.jpg)

### 23 — JSON properties — key/value, "XYZ1000" string (drawing)
![json-properties-drawing](23-json-properties-drawing.jpg)

