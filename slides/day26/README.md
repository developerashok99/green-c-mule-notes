# Day 26 — Slides and On-Screen Drawings

Frames captured from the Day 26 class recording (MuleSoft Telugu Course Day 26, recorded 12 Dec 2024). Login screens and Studio's Anypoint sign-in dialogs are not included. Repeated and blank frames have been removed. Times are positions in the video.

Notes for this day: [detailed-notes/day26.md](../../detailed-notes/day26.md) · [super-detailed-notes/day26.md](../../super-detailed-notes/day26.md) · [summary](../../day26.md)

| # | Time | Content |
|---|---|---|
| 01 | 82:04 | Agenda — API specification implementation using RAML |
| 02 | 2:04 | Design Center — Publishing to Exchange: asset version 1.0.0, API version v1, lifecycle Stable (screen) |
| 03 | 3:11 | Exchange — All assets: hr-employees-sapi-7303 and common-headers-fragment (screen) |
| 04 | 9:22 | Exchange asset page — hr-employees-sapi-7303, REST API, v1.0.0 Stable, endpoints (screen) |
| 05 | 9:55 | Exchange documentation — headers and body with Try it (screen) |
| 06 | 10:26 | Exchange — Share the asset (screen) |
| 07 | 11:15 | Public developer portal — "Welcome to your developer portal!" (screen) |
| 08 | 15:05 | Studio — New Mule Project → API implementation: import a published API / RAML; Scaffold flows (screen) |
| 09 | 34:28 | Scaffolded flows — post/patch/get flows with Transform Message placeholders (screen) |
| 10 | 39:39 | APIkit Router configuration — hr-employees-sapi-7303-config, outboundHeaders, httpStatus (screen) |
| 11 | 56:32 | pom.xml — the API specification added as a dependency (screen) |
| 12 | 65:33 | post flow Transform Message — statusCode 201, "employee details created successfully in the db" (screen) |
| 13 | 75:59 | Postman POST /api/employees → 201 Created (screen) |
| 14 | 79:56 | Postman — 404 "Resource not found" for a wrong path (screen) |
| 15 | 82:36 | Postman — 501 "Not Implemented" (screen) |

---

### 01 — Agenda — API specification implementation using RAML
![agenda](01-agenda.jpg)

### 02 — Design Center — Publishing to Exchange: asset version 1.0.0, API version v1, lifecycle Stable (screen)
![publish-to-exchange](02-publish-to-exchange.jpg)

### 03 — Exchange — All assets: hr-employees-sapi-7303 and common-headers-fragment (screen)
![exchange-all-assets](03-exchange-all-assets.jpg)

### 04 — Exchange asset page — hr-employees-sapi-7303, REST API, v1.0.0 Stable, endpoints (screen)
![exchange-asset-page](04-exchange-asset-page.jpg)

### 05 — Exchange documentation — headers and body with Try it (screen)
![exchange-try-it](05-exchange-try-it.jpg)

### 06 — Exchange — Share the asset (screen)
![exchange-share](06-exchange-share.jpg)

### 07 — Public developer portal — "Welcome to your developer portal!" (screen)
![public-portal](07-public-portal.jpg)

### 08 — Studio — New Mule Project → API implementation: import a published API / RAML; Scaffold flows (screen)
![new-project-import-api](08-new-project-import-api.jpg)

### 09 — Scaffolded flows — post/patch/get flows with Transform Message placeholders (screen)
![scaffolded-flows](09-scaffolded-flows.jpg)

### 10 — APIkit Router configuration — hr-employees-sapi-7303-config, outboundHeaders, httpStatus (screen)
![apikit-router-config](10-apikit-router-config.jpg)

### 11 — pom.xml — the API specification added as a dependency (screen)
![pom-api-dependency](11-pom-api-dependency.jpg)

### 12 — post flow Transform Message — statusCode 201, "employee details created successfully in the db" (screen)
![post-flow-transform](12-post-flow-transform.jpg)

### 13 — Postman POST /api/employees → 201 Created (screen)
![postman-201-created](13-postman-201-created.jpg)

### 14 — Postman — 404 "Resource not found" for a wrong path (screen)
![postman-404-resource-not-found](14-postman-404-resource-not-found.jpg)

### 15 — Postman — 501 "Not Implemented" (screen)
![postman-501-not-implemented](15-postman-501-not-implemented.jpg)

