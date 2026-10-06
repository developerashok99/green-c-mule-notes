# Day 31 — Slides and On-Screen Drawings

Screens and drawings from the Day 31 class (18 Dec 2024): course status, creating the API instance in API Manager, auto-discovery, and the policy catalogue with drawings for each policy. Repeated and blank frames have been removed. Times are positions in the video.

Notes for this day: [detailed-notes/day31.md](../../detailed-notes/day31.md) · [super-detailed-notes/day31.md](../../super-detailed-notes/day31.md) · [summary](../../day31.md)

| # | Time | Content |
|---|---|---|
| 01 | 3:15 | Alternative to Choice: one Transform Message with `if(!isEmpty(payload)) {empId: payload[0].emp_id, …} else {"message": "employee details not found in the database"}` |
| 02 | 7:14 | Course module list: Module 15 Design APIs, Module 16 Manage APIs (API Manager, secure APIs, policies — Basic Auth, Client ID enforcement, OAuth, Rate Limiting, Spike Control), 17 Scopes, 18 Salesforce, 19 CI/CD |
| 03 | 16:42 | Interview-prep folder: sample MuleSoft developer résumé (objective, profile summary, projects, responsibilities) |
| 04 | 45:21 | *Drawing:* Basic Authentication — username/password per client; steps: 1 publish API spec to Exchange, 2 create an asset in API Manager (instance ID), 3 configure Autodiscovery in the API implementation, 4 deploy to RTM |
| 05 | 45:37 | API Manager → Add API → Runtime: Flex Gateway (new) vs **Mule Gateway**; proxy type "Connect to existing application (basic endpoint)" vs "Deploy a proxy application"; Mule 4 |
| 06 | 52:54 | Select API from Exchange: hr-employees-sapi-7303, asset type RAML/OAS, API version v1 (Latest), asset version 1.0.1 (Latest) |
| 07 | 54:51 | API Summary: hr-employees-sapi-7303 (v1), asset 1.0.1, API Instance ID **20120438**, status Unregistered — "connect this API to your Mule application using Autodiscovery" |
| 08 | 78:28 | *Drawing:* API Manager instance ID ↔ app in RTM via Autodiscovery (instance ID) + client ID/secret; Flex Gateway in front of Java Spring Boot and MuleSoft APIs |
| 09 | 58:05 | globall-config.xml Global Elements now include **API Autodiscovery** (plus Listener, Router, MySQL80_Database_Config, Configuration properties, Secure_Properties_Config, mule.env, secure.key) |
| 10 | 59:04 | API Manager → Policies → Add a policy: JSON/XML Threat Protection, Basic Authentication – Simple, IP Allowlist, Basic Authentication – LDAP, IP Blocklist, OAuth 2.0, JWT, Tokenization (permission needed) |
| 11 | 80:02 | *Drawing:* Basic Authentication — client sends username/password (e.g. mahesh / mahesh@123) to the API gateway in front of the worker (CH/RTM); API Manager holds the policy |
| 12 | 72:24 | *Drawing:* Client ID Enforcement — one client ID + secret per client; OAuth on experience layer, client ID / basic auth on internal process and system layers |
| 13 | 72:14 | *Drawing:* Spike Control — sliding window; e.g. 5 req per 5 s, extra requests queued/delayed and retried |
| 14 | 78:30 | *Drawing:* Rate Limiting — fixed window; e.g. 100 req/min; requests over the limit rejected with **429 Too Many Requests** |
| 15 | 79:37 | *Drawing:* Rate Limiting SLA — tiers per client (Silver 1 req/min, Gold 2, Diamond 5) with client ID; summary of policy list |
| 16 | 79:57 | *Drawing:* HTTP Caching — repeated identical requests answered from the cache (Object Store), saving calls to the back end |
| 17 | 79:52 | *Drawing:* JSON Threat Protection — gateway checks JSON structure/size before it reaches the API (also XML) |
| 18 | 80:06 | *Drawing:* Mule gateway (Mule apps on the worker) vs Flex Gateway (Mule, Java and Python apps); other gateways: Kong, Apigee (Google), Tyk |
| 19 | 56:36 | dev.yaml with the encrypted DB username/password and `autodiscovery.id: "19942054"` (from the sys-app; to be replaced with instance ID 20120438) |
| 20 | 23:05 | Anypoint Platform sign-in (anypoint.mulesoft.com/login) before opening API Manager |
| 21 | 23:09 | Anypoint Platform home (org EPAM): Code Builder, Design Center, Management Center → API Manager, API Governance, Runtime Manager |

---

### 01 — Alternative to Choice: one Transform Message with `if(!isEmpty(payload)) {empId: payload[0].emp_id, …} else {"message": "employee details not found in the database"}`
![get-if-else](01-get-if-else.jpg)

### 02 — Course module list: Module 15 Design APIs, Module 16 Manage APIs (API Manager, secure APIs, policies — Basic Auth, Client ID enforcement, OAuth, Rate Limiting, Spike Control), 17 Scopes, 18 Salesforce, 19 CI/CD
![course-modules](02-course-modules.jpg)

### 03 — Interview-prep folder: sample MuleSoft developer résumé (objective, profile summary, projects, responsibilities)
![sample-resume](03-sample-resume.jpg)

### 04 — *Drawing:* Basic Authentication — username/password per client; steps: 1 publish API spec to Exchange, 2 create an asset in API Manager (instance ID), 3 configure Autodiscovery in the API implementation, 4 deploy to RTM
![drawing-basic-auth-steps](04-drawing-basic-auth-steps.jpg)

### 05 — API Manager → Add API → Runtime: Flex Gateway (new) vs **Mule Gateway**; proxy type "Connect to existing application (basic endpoint)" vs "Deploy a proxy application"; Mule 4
![api-manager-runtime](05-api-manager-runtime.jpg)

### 06 — Select API from Exchange: hr-employees-sapi-7303, asset type RAML/OAS, API version v1 (Latest), asset version 1.0.1 (Latest)
![api-manager-select-api](06-api-manager-select-api.jpg)

### 07 — API Summary: hr-employees-sapi-7303 (v1), asset 1.0.1, API Instance ID **20120438**, status Unregistered — "connect this API to your Mule application using Autodiscovery"
![api-summary](07-api-summary.jpg)

### 08 — *Drawing:* API Manager instance ID ↔ app in RTM via Autodiscovery (instance ID) + client ID/secret; Flex Gateway in front of Java Spring Boot and MuleSoft APIs
![drawing-autodiscovery](08-drawing-autodiscovery.jpg)

### 09 — globall-config.xml Global Elements now include **API Autodiscovery** (plus Listener, Router, MySQL80_Database_Config, Configuration properties, Secure_Properties_Config, mule.env, secure.key)
![global-elements-autodiscovery](09-global-elements-autodiscovery.jpg)

### 10 — API Manager → Policies → Add a policy: JSON/XML Threat Protection, Basic Authentication – Simple, IP Allowlist, Basic Authentication – LDAP, IP Blocklist, OAuth 2.0, JWT, Tokenization (permission needed)
![policy-catalogue](10-policy-catalogue.jpg)

### 11 — *Drawing:* Basic Authentication — client sends username/password (e.g. mahesh / mahesh@123) to the API gateway in front of the worker (CH/RTM); API Manager holds the policy
![drawing-basic-auth](11-drawing-basic-auth.jpg)

### 12 — *Drawing:* Client ID Enforcement — one client ID + secret per client; OAuth on experience layer, client ID / basic auth on internal process and system layers
![drawing-client-id-enforcement](12-drawing-client-id-enforcement.jpg)

### 13 — *Drawing:* Spike Control — sliding window; e.g. 5 req per 5 s, extra requests queued/delayed and retried
![drawing-spike-control](13-drawing-spike-control.jpg)

### 14 — *Drawing:* Rate Limiting — fixed window; e.g. 100 req/min; requests over the limit rejected with **429 Too Many Requests**
![drawing-rate-limiting](14-drawing-rate-limiting.jpg)

### 15 — *Drawing:* Rate Limiting SLA — tiers per client (Silver 1 req/min, Gold 2, Diamond 5) with client ID; summary of policy list
![drawing-rate-limiting-sla](15-drawing-rate-limiting-sla.jpg)

### 16 — *Drawing:* HTTP Caching — repeated identical requests answered from the cache (Object Store), saving calls to the back end
![drawing-http-caching](16-drawing-http-caching.jpg)

### 17 — *Drawing:* JSON Threat Protection — gateway checks JSON structure/size before it reaches the API (also XML)
![drawing-json-threat](17-drawing-json-threat.jpg)

### 18 — *Drawing:* Mule gateway (Mule apps on the worker) vs Flex Gateway (Mule, Java and Python apps); other gateways: Kong, Apigee (Google), Tyk
![drawing-gateways](18-drawing-gateways.jpg)

### 19 — dev.yaml with the encrypted DB username/password and `autodiscovery.id: "19942054"` (from the sys-app; to be replaced with instance ID 20120438)
![dev-yaml-autodiscovery](19-dev-yaml-autodiscovery.jpg)

### 20 — Anypoint Platform sign-in (anypoint.mulesoft.com/login) before opening API Manager
![anypoint-login](20-anypoint-login.jpg)

### 21 — Anypoint Platform home (org EPAM): Code Builder, Design Center, Management Center → API Manager, API Governance, Runtime Manager
![anypoint-home](21-anypoint-home.jpg)
