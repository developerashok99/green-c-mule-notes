# Interview Preparation Part 2 — Slides and On-Screen Drawings

Screens from the second interview-preparation session: RAML questions, sharing specs through Exchange, API Manager and policy questions, the OAuth 2.0 and JWT slides, error-handling questions with drawings, and DataWeave questions. Repeated and blank frames have been removed. Times are positions in the video.

| # | Time | Content |
|---|---|---|
| 01 | 0:06 | RAML Q&A (continued) — traits, resource types, libraries, the differences between them, fragments |
| 02 | 1:43 | RAML Q&A — built-in data types (string, number, integer, boolean, date-only, time-only, datetime), custom types, the "type" keyword |
| 03 | 1:44 | RAML Q&A — restricting extra properties (`additionalProperties: false`), maxProperties / minProperties, maxItems / minItems |
| 04 | 1:47 | RAML Q&A — baseUri, RAML version (1.0), Swagger/OAS, one method per path, supported HTTP methods, multiple data formats in the body |
| 05 | 37:49 | RAML Q&A — sharing the API spec with internal and external stakeholders (Design Center share, Exchange public portal, mocking service) |
| 06 | 39:30 | GoTo meeting — "MuleSoft Project Training" |
| 07 | 39:49 | Anypoint Platform — Runtime Manager (hello-world app on CloudHub) |
| 08 | 39:56 | Exchange — Cloud Technologies assets (hr-employees-sapi-730am, hr-employees-sapi-9pm, hello-world) |
| 09 | 40:10 | Exchange asset → Share (collaborators / public portal) |
| 10 | 40:31 | Public developer portal — "Welcome to your developer portal!" with the published assets |
| 11 | 58:21 | API Manager Q&A — what is an API proxy, API gateway vs proxy, security policies used (Basic Auth, Client ID, HTTP caching, rate limiting, JWT) |
| 12 | 59:05 | What is OAuth 2.0? — Open Authorization, an authorization framework, not an authentication protocol |
| 13 | 59:08 | OAuth 2.0 Flow — Authorization Code Grant (Zomato and Facebook example) with annotations |
| 14 | 59:09 | OAuth 2.0 terminologies — resource owner, resource server, client, authorization server |
| 15 | 59:13 | OAuth 2.0 Flow — Client Credentials Grant (Domino's pizza types) |
| 16 | 59:14 | OAuth 2.0 Flow — Resource Owner Password Grant (orders, memberships) |
| 17 | 60:30 | Policies Q&A — Basic Auth vs Client ID enforcement, HTTP caching, rate limiting (429), rate limiting SLA, spike control, throttling |
| 18 | 68:11 | OAuth Q&A — explain OAuth, grant types and when to use client credentials, OpenID token enforcement, authentication vs authorization |
| 19 | 71:48 | OAuth 2.0 terminologies — grant, redirect URI |
| 20 | 73:06 | Grant type — authorization code (sign up with third-party apps) |
| 21 | 73:07 | Grant type — client credentials (server-to-server, no resource ownership) |
| 22 | 78:58 | Q&A — OAuth dance, JWT validation policy (signature check with public key), access denied when the JWT is invalid |
| 23 | 86:03 | JWT — JSON Web Token: compact, self-contained JSON object; header, payload and signature separated by dots |
| 24 | 86:05 | jwt.io debugger — decoded token, "Signature Verified" |
| 25 | 87:59 | Error-handling Q&A — explain error handling, business errors, On Error Continue vs Propagate, raising errors, errors in sub-flows / For Each / Parallel For Each / Scatter-Gather, global error handler |
| 26 | 91:45 | Studio — an error handler with On Error Propagate (APIKIT:BAD_REQUEST, NOT_FOUND) and Transform Messages |
| 27 | 92:15 | Global Elements — Configuration properties (`config/${env}.yaml`) and secure properties |
| 28 | 117:37 | *Drawing:* consumer → flow with error handlers (On Error Continue / Propagate) and where each error ends up |
| 29 | 127:41 | *Drawing:* Scatter-Gather with a failing route — Try scope + On Error Continue so the other routes' results are kept |
| 30 | 130:05 | DataWeave Q&A — complex transformations, flatten, distinctBy, keys, splitBy, lookup, read / write functions |
| 31 | 130:45 | DataWeave Q&A — skipNullOn, data formats, DataWeave version (2.x), p() function for properties, logging, masking, joinBy, null checks |
| 32 | 151:35 | DataWeave Q&A — reduce, default, custom functions with `fun`, ways to create variables, selectors |
| 33 | 152:02 | Playground — `read(payload, "application/json")` example |

---

### 01 — RAML Q&A (continued) — traits, resource types, libraries, the differences between them, fragments
![raml-qa](01-raml-qa.jpg)

### 02 — RAML Q&A — built-in data types (string, number, integer, boolean, date-only, time-only, datetime), custom types, the "type" keyword
![raml-datatypes](02-raml-datatypes.jpg)

### 03 — RAML Q&A — restricting extra properties (`additionalProperties: false`), maxProperties / minProperties, maxItems / minItems
![additional-properties](03-additional-properties.jpg)

### 04 — RAML Q&A — baseUri, RAML version (1.0), Swagger/OAS, one method per path, supported HTTP methods, multiple data formats in the body
![raml-baseuri-versions](04-raml-baseuri-versions.jpg)

### 05 — RAML Q&A — sharing the API spec with internal and external stakeholders (Design Center share, Exchange public portal, mocking service)
![share-api-spec](05-share-api-spec.jpg)

### 06 — GoTo meeting — "MuleSoft Project Training"
![project-training-meeting](06-project-training-meeting.jpg)

### 07 — Anypoint Platform — Runtime Manager (hello-world app on CloudHub)
![runtime-manager](07-runtime-manager.jpg)

### 08 — Exchange — Cloud Technologies assets (hr-employees-sapi-730am, hr-employees-sapi-9pm, hello-world)
![exchange-assets](08-exchange-assets.jpg)

### 09 — Exchange asset → Share (collaborators / public portal)
![exchange-share](09-exchange-share.jpg)

### 10 — Public developer portal — "Welcome to your developer portal!" with the published assets
![developer-portal](10-developer-portal.jpg)

### 11 — API Manager Q&A — what is an API proxy, API gateway vs proxy, security policies used (Basic Auth, Client ID, HTTP caching, rate limiting, JWT)
![api-manager-qa](11-api-manager-qa.jpg)

### 12 — What is OAuth 2.0? — Open Authorization, an authorization framework, not an authentication protocol
![what-is-oauth](12-what-is-oauth.jpg)

### 13 — OAuth 2.0 Flow — Authorization Code Grant (Zomato and Facebook example) with annotations
![auth-code-flow](13-auth-code-flow.jpg)

### 14 — OAuth 2.0 terminologies — resource owner, resource server, client, authorization server
![oauth-terms-1](14-oauth-terms-1.jpg)

### 15 — OAuth 2.0 Flow — Client Credentials Grant (Domino's pizza types)
![client-credentials-flow](15-client-credentials-flow.jpg)

### 16 — OAuth 2.0 Flow — Resource Owner Password Grant (orders, memberships)
![password-grant-flow](16-password-grant-flow.jpg)

### 17 — Policies Q&A — Basic Auth vs Client ID enforcement, HTTP caching, rate limiting (429), rate limiting SLA, spike control, throttling
![policies-qa](17-policies-qa.jpg)

### 18 — OAuth Q&A — explain OAuth, grant types and when to use client credentials, OpenID token enforcement, authentication vs authorization
![oauth-qa](18-oauth-qa.jpg)

### 19 — OAuth 2.0 terminologies — grant, redirect URI
![oauth-terms-2](19-oauth-terms-2.jpg)

### 20 — Grant type — authorization code (sign up with third-party apps)
![grant-auth-code](20-grant-auth-code.jpg)

### 21 — Grant type — client credentials (server-to-server, no resource ownership)
![grant-client-credentials](21-grant-client-credentials.jpg)

### 22 — Q&A — OAuth dance, JWT validation policy (signature check with public key), access denied when the JWT is invalid
![jwt-qa](22-jwt-qa.jpg)

### 23 — JWT — JSON Web Token: compact, self-contained JSON object; header, payload and signature separated by dots
![jwt-slide](23-jwt-slide.jpg)

### 24 — jwt.io debugger — decoded token, "Signature Verified"
![jwt-io](24-jwt-io.jpg)

### 25 — Error-handling Q&A — explain error handling, business errors, On Error Continue vs Propagate, raising errors, errors in sub-flows / For Each / Parallel For Each / Scatter-Gather, global error handler
![error-handling-qa](25-error-handling-qa.jpg)

### 26 — Studio — an error handler with On Error Propagate (APIKIT:BAD_REQUEST, NOT_FOUND) and Transform Messages
![studio-error-handler](26-studio-error-handler.jpg)

### 27 — Global Elements — Configuration properties (`config/${env}.yaml`) and secure properties
![configuration-properties](27-configuration-properties.jpg)

### 28 — *Drawing:* consumer → flow with error handlers (On Error Continue / Propagate) and where each error ends up
![drawing-error-flow](28-drawing-error-flow.jpg)

### 29 — *Drawing:* Scatter-Gather with a failing route — Try scope + On Error Continue so the other routes' results are kept
![drawing-scatter-gather-error](29-drawing-scatter-gather-error.jpg)

### 30 — DataWeave Q&A — complex transformations, flatten, distinctBy, keys, splitBy, lookup, read / write functions
![dataweave-qa](30-dataweave-qa.jpg)

### 31 — DataWeave Q&A — skipNullOn, data formats, DataWeave version (2.x), p() function for properties, logging, masking, joinBy, null checks
![dataweave-qa-2](31-dataweave-qa-2.jpg)

### 32 — DataWeave Q&A — reduce, default, custom functions with `fun`, ways to create variables, selectors
![reduce-default-qa](32-reduce-default-qa.jpg)

### 33 — Playground — `read(payload, "application/json")` example
![read-function](33-read-function.jpg)

