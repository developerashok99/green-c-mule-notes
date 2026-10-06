# Day 36 — Slides and On-Screen Drawings

Screens from the Day 36 class (25 Dec 2024): connecting the app to API Manager, then applying and testing the Basic Authentication – Simple and Client ID Enforcement policies (credentials as shown on screen, 2024 trial accounts). Repeated and blank frames have been removed. Times are positions in the video.

Notes for this day: [detailed-notes/day36.md](../../detailed-notes/day36.md) · [super-detailed-notes/day36.md](../../super-detailed-notes/day36.md) · [summary](../../day36.md)

| # | Time | Content |
|---|---|---|
| 01 | 0:01 | Runtime Manager logs for policies-demo-app-test — the app starts, gateway initialising |
| 02 | 0:29 | API Manager — policies-demo-app API Summary: status **Active**, instance 20128624, Mule 4.6.1 (app is connected via Autodiscovery) |
| 03 | 2:43 | pom.xml — groupId com.mycompany, artifactId policies-demo-app-test, Mule runtime 4.4.0 (renamed project for the new deployment) |
| 04 | 14:28 | API Administration list: policies-demo-app Active, policies-demo-api / hr-employees-sapi / consumer-rest-service Unregistered |
| 05 | 14:54 | Add API → Create new API (policies-demo-api) — published to Exchange in stable state |
| 06 | 15:31 | policies-demo-api API Summary — new instance ID 20129892, Unregistered |
| 07 | 16:44 | Runtime Manager applications: consumer-rest-service, policies-demo-app-test, case-error-demo, test-app (CloudHub 2.0 shared space) |
| 08 | 18:45 | Deploy properties (text view): anypoint.platform.clientId / clientSecret from the business group |
| 09 | 31:46 | Logs — API autodiscovery: the gateway downloads policies for the API instance |
| 10 | 35:56 | Policies → Add a policy: categories — HTTP Caching, Spike Control, Rate Limiting – SLA based, … |
| 11 | 37:41 | Search "basic": Basic Authentication – Simple and Basic Authentication – LDAP |
| 12 | 38:31 | Configure Basic Authentication – Simple: User Name akash, User Password akash@123 |
| 13 | 39:26 | Advanced options: policy version 1.3.1 (latest); apply to all API methods & resources or to specific methods / URI template regex |
| 14 | 40:03 | API-level policies: Basic Authentication – Simple applied (Security) |
| 15 | 41:07 | Logs: "Applied policy http-basic-authentication … to API policies-demo-api (20129892)" |
| 16 | 45:40 | Postman GET https://policies-demo-test-api-so4xz2.5sc6y6-1.usa-e2.cloudhub.io/policy, Basic Auth akash / akash@123 → 200 "policy tested successfully" |
| 17 | 46:18 | Wrong password (akash@12345) → **401 Unauthorized** `{"error": "Authentication Attempt Failed"}` |
| 18 | 53:38 | The Authorization header is `Basic YWthc2g6YWthc2hAMTIz` — Base64 of akash:akash@123 (Postman code snippet) |
| 19 | 49:51 | Configure Client ID Enforcement: credentials origin — HTTP Basic Authentication Header or **Custom Expression** `#[attributes.headers['client_id']]` / `#[attributes.headers['client_secret']]` |
| 20 | 56:17 | With both policies: 401 "Http Basic filter doesn't know how to handle header basic YWthc2g6YWthc2hAMTIz" |
| 21 | 60:26 | Exchange → policies-demo-api asset → **Request access** |
| 22 | 61:18 | Request access → Create new application (consumer-1) |
| 23 | 61:42 | "Your request has been received and approved" — Client ID a01dfe7fec2e4f7f86e8905cd684dd76, Client Secret bfB8AE1B4E264445bb7cCBFD57294940 |
| 24 | 63:40 | API Manager → Contracts: consumer-1 Approved (owner, client ID, Revoke) |
| 25 | 65:07 | Wrong / missing client headers → 401 "Invalid Client" |
| 26 | 68:53 | Both policies listed — Basic Authentication – Simple and Client ID Enforcement; policy menu: enable/disable, edit configuration |
| 27 | 78:10 | Postman headers client_id / client_secret → 200 "policy tested successfully" |
| 28 | 79:42 | A second application (consumer-2) gets its own client ID and secret — one pair per consumer |

---

### 01 — Runtime Manager logs for policies-demo-app-test — the app starts, gateway initialising
![deploy-logs](01-deploy-logs.jpg)

### 02 — API Manager — policies-demo-app API Summary: status **Active**, instance 20128624, Mule 4.6.1 (app is connected via Autodiscovery)
![api-active](02-api-active.jpg)

### 03 — pom.xml — groupId com.mycompany, artifactId policies-demo-app-test, Mule runtime 4.4.0 (renamed project for the new deployment)
![pom-artifact](03-pom-artifact.jpg)

### 04 — API Administration list: policies-demo-app Active, policies-demo-api / hr-employees-sapi / consumer-rest-service Unregistered
![api-list](04-api-list.jpg)

### 05 — Add API → Create new API (policies-demo-api) — published to Exchange in stable state
![create-new-api](05-create-new-api.jpg)

### 06 — policies-demo-api API Summary — new instance ID 20129892, Unregistered
![api-summary-new](06-api-summary-new.jpg)

### 07 — Runtime Manager applications: consumer-rest-service, policies-demo-app-test, case-error-demo, test-app (CloudHub 2.0 shared space)
![runtime-apps](07-runtime-apps.jpg)

### 08 — Deploy properties (text view): anypoint.platform.clientId / clientSecret from the business group
![deploy-properties](08-deploy-properties.jpg)

### 09 — Logs — API autodiscovery: the gateway downloads policies for the API instance
![logs-autodiscovery](09-logs-autodiscovery.jpg)

### 10 — Policies → Add a policy: categories — HTTP Caching, Spike Control, Rate Limiting – SLA based, …
![add-policy](10-add-policy.jpg)

### 11 — Search "basic": Basic Authentication – Simple and Basic Authentication – LDAP
![basic-auth-search](11-basic-auth-search.jpg)

### 12 — Configure Basic Authentication – Simple: User Name akash, User Password akash@123
![basic-auth-config](12-basic-auth-config.jpg)

### 13 — Advanced options: policy version 1.3.1 (latest); apply to all API methods & resources or to specific methods / URI template regex
![basic-auth-advanced](13-basic-auth-advanced.jpg)

### 14 — API-level policies: Basic Authentication – Simple applied (Security)
![policy-applied](14-policy-applied.jpg)

### 15 — Logs: "Applied policy http-basic-authentication … to API policies-demo-api (20129892)"
![logs-policy-applied](15-logs-policy-applied.jpg)

### 16 — Postman GET https://policies-demo-test-api-so4xz2.5sc6y6-1.usa-e2.cloudhub.io/policy, Basic Auth akash / akash@123 → 200 "policy tested successfully"
![postman-basic-200](16-postman-basic-200.jpg)

### 17 — Wrong password (akash@12345) → **401 Unauthorized** `{"error": "Authentication Attempt Failed"}`
![postman-basic-401](17-postman-basic-401.jpg)

### 18 — The Authorization header is `Basic YWthc2g6YWthc2hAMTIz` — Base64 of akash:akash@123 (Postman code snippet)
![basic-header-base64](18-basic-header-base64.jpg)

### 19 — Configure Client ID Enforcement: credentials origin — HTTP Basic Authentication Header or **Custom Expression** `#[attributes.headers['client_id']]` / `#[attributes.headers['client_secret']]`
![client-id-config](19-client-id-config.jpg)

### 20 — With both policies: 401 "Http Basic filter doesn't know how to handle header basic YWthc2g6YWthc2hAMTIz"
![basic-filter-error](20-basic-filter-error.jpg)

### 21 — Exchange → policies-demo-api asset → **Request access**
![exchange-request-access](21-exchange-request-access.jpg)

### 22 — Request access → Create new application (consumer-1)
![create-application](22-create-application.jpg)

### 23 — "Your request has been received and approved" — Client ID a01dfe7fec2e4f7f86e8905cd684dd76, Client Secret bfB8AE1B4E264445bb7cCBFD57294940
![client-credentials-issued](23-client-credentials-issued.jpg)

### 24 — API Manager → Contracts: consumer-1 Approved (owner, client ID, Revoke)
![contracts](24-contracts.jpg)

### 25 — Wrong / missing client headers → 401 "Invalid Client"
![postman-invalid-client](25-postman-invalid-client.jpg)

### 26 — Both policies listed — Basic Authentication – Simple and Client ID Enforcement; policy menu: enable/disable, edit configuration
![policies-order](26-policies-order.jpg)

### 27 — Postman headers client_id / client_secret → 200 "policy tested successfully"
![postman-client-id-200](27-postman-client-id-200.jpg)

### 28 — A second application (consumer-2) gets its own client ID and secret — one pair per consumer
![consumer-2](28-consumer-2.jpg)

