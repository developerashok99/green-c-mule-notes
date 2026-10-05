# Day 07 — Slides and On-Screen Drawings

Frames captured from the Day 7 class recording (MuleSoft Telugu Course Day 7, recorded 7 Nov 2024). Sign-up and login screens are not included because they show account details. Repeated and blank frames have been removed. Times are positions in the video.

Notes for this day: [detailed-notes/day07.md](../../detailed-notes/day07.md) · [super-detailed-notes/day07.md](../../super-detailed-notes/day07.md) · [summary](../../day07.md)

| # | Time | Content |
|---|---|---|
| 01 | 2:44 | Mule Event — payload, attributes and variables |
| 02 | 30:56 | Transformation of HTTP Request to Mule 4 Event — body → payload, method/URL/headers → attributes (slide + drawing) |
| 03 | 31:36 | HTTP listener → Mule message event (drawing) |
| 04 | 13:42 | Attributes pasted into Notepad++ — paths, query string, 9 headers, queryParams empid=123, URI params [] (screen) |
| 05 | 18:50 | Debugger: Evaluate DataWeave expression attributes.headers → size = 9 (screen) |
| 06 | 38:39 | Set Variable — Name employeeID, Value attributes.queryParams.empid (screen) |
| 07 | 41:50 | Debugger after Select — attributes = null, vars employeeID = "123" (screen) |
| 08 | 25:30 | Postman: 200 OK with the employee row as JSON (screen) |
| 09 | 49:59 | Agenda — Anypoint Platform and Studio overview, install Studio and Postman |
| 10 | 50:55 | Anypoint Studio — user-friendly IDE (slide + drawing) |
| 11 | 50:57 | Design Center — RAML (0.8 or 1.0) or OAS (2.0 or 3.0), "Swagger" (slide + drawing) |
| 12 | 51:40 | Anypoint Exchange — central repository |
| 13 | 72:58 | API Manager — policies, alerts, clients, SLAs |
| 14 | 73:01 | Runtime Manager — deploy and manage apps from one place |
| 15 | 51:13 | Anypoint Monitoring; Mule 3.x → Migration Agent → 4.x, 60–70% (slide + drawing) |
| 16 | 54:21 | Anypoint Platform home — Code Builder, Design Center, Exchange, Management Center (screen) |
| 17 | 72:20 | Exchange — All assets (connectors) (screen) |
| 18 | 74:46 | Runtime Manager — Deploy Application, CloudHub 2.0 shared space (screen) |
| 19 | 74:47 | Deploy settings — Edge 4.8.1, Java 8, 1 replica × 0.1 vCores, rolling update (screen) |
| 20 | 77:24 | API Manager — an API's Policies page (screen) |
| 21 | 78:38 | Anypoint Monitoring — built-in dashboards (screen) |
| 22 | 85:38 | Hello World app — Listener → Set Payload → Logger (screen) |
| 23 | 86:54 | Postman: 404 "No listener for endpoint: /helloworld" — old app still deployed (screen) |
| 24 | 88:03 | Postman: ECONNREFUSED 127.0.0.1:8081 while the runtime restarts (screen) |

---

### 01 — Mule Event — payload, attributes and variables
![mule-event](01-mule-event.jpg)

### 02 — Transformation of HTTP Request to Mule 4 Event — body → payload, method/URL/headers → attributes (slide + drawing)
![http-request-to-mule-event](02-http-request-to-mule-event.jpg)

### 03 — HTTP listener → Mule message event (drawing)
![listener-to-mule-event-drawing](03-listener-to-mule-event-drawing.jpg)

### 04 — Attributes pasted into Notepad++ — paths, query string, 9 headers, queryParams empid=123, URI params [] (screen)
![attributes-in-notepad](04-attributes-in-notepad.jpg)

### 05 — Debugger: Evaluate DataWeave expression attributes.headers → size = 9 (screen)
![evaluate-headers](05-evaluate-headers.jpg)

### 06 — Set Variable — Name employeeID, Value attributes.queryParams.empid (screen)
![set-variable-config](06-set-variable-config.jpg)

### 07 — Debugger after Select — attributes = null, vars employeeID = "123" (screen)
![vars-after-select](07-vars-after-select.jpg)

### 08 — Postman: 200 OK with the employee row as JSON (screen)
![postman-response](08-postman-response.jpg)

### 09 — Agenda — Anypoint Platform and Studio overview, install Studio and Postman
![agenda-platform](09-agenda-platform.jpg)

### 10 — Anypoint Studio — user-friendly IDE (slide + drawing)
![anypoint-studio](10-anypoint-studio.jpg)

### 11 — Design Center — RAML (0.8 or 1.0) or OAS (2.0 or 3.0), "Swagger" (slide + drawing)
![design-center](11-design-center.jpg)

### 12 — Anypoint Exchange — central repository
![anypoint-exchange](12-anypoint-exchange.jpg)

### 13 — API Manager — policies, alerts, clients, SLAs
![api-manager](13-api-manager.jpg)

### 14 — Runtime Manager — deploy and manage apps from one place
![runtime-manager](14-runtime-manager.jpg)

### 15 — Anypoint Monitoring; Mule 3.x → Migration Agent → 4.x, 60–70% (slide + drawing)
![monitoring-and-migration-drawing](15-monitoring-and-migration-drawing.jpg)

### 16 — Anypoint Platform home — Code Builder, Design Center, Exchange, Management Center (screen)
![platform-home](16-platform-home.jpg)

### 17 — Exchange — All assets (connectors) (screen)
![exchange-assets](17-exchange-assets.jpg)

### 18 — Runtime Manager — Deploy Application, CloudHub 2.0 shared space (screen)
![runtime-deploy-application](18-runtime-deploy-application.jpg)

### 19 — Deploy settings — Edge 4.8.1, Java 8, 1 replica × 0.1 vCores, rolling update (screen)
![runtime-deploy-settings](19-runtime-deploy-settings.jpg)

### 20 — API Manager — an API's Policies page (screen)
![api-manager-policies](20-api-manager-policies.jpg)

### 21 — Anypoint Monitoring — built-in dashboards (screen)
![monitoring-dashboards](21-monitoring-dashboards.jpg)

### 22 — Hello World app — Listener → Set Payload → Logger (screen)
![hello-world-flow](22-hello-world-flow.jpg)

### 23 — Postman: 404 "No listener for endpoint: /helloworld" — old app still deployed (screen)
![hello-world-404](23-hello-world-404.jpg)

### 24 — Postman: ECONNREFUSED 127.0.0.1:8081 while the runtime restarts (screen)
![hello-world-econnrefused](24-hello-world-econnrefused.jpg)

