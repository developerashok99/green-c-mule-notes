# Day 38 — Slides and On-Screen Drawings

Screens from the Day 38 class (27 Dec 2024): the HTTP Caching policy, then the JWT Validation policy with Auth0 as the authorization server — machine-to-machine app, client-credentials token, jwt.io, JWKS — and a recap of the policy drawings. Repeated and blank frames have been removed. Times are positions in the video.

Notes for this day: [detailed-notes/day38.md](../../detailed-notes/day38.md) · [super-detailed-notes/day38.md](../../super-detailed-notes/day38.md) · [summary](../../day38.md)

| # | Time | Content |
|---|---|---|
| 01 | 0:43 | Add a policy → search "http": HTTP Caching (Quality of service) |
| 02 | 3:51 | Configure HTTP Caching: caching key `#[attributes.requestPath]`, max cache entries 10000, entry time to live 600 s, distributed / persistent cache |
| 03 | 19:15 | Conditional request caching `#[attributes.method == 'GET' or attributes.method == 'HEAD']` and response caching on status codes 200, 203, 204, 206, 300, 301, 404, 405, 410, 414, 501 |
| 04 | 23:34 | Apply to specific methods: GET only |
| 05 | 26:10 | Logs: first request reaches the flow ("policy demo flow started"), repeats are answered from the cache |
| 06 | 28:21 | Caching key changed to `#[attributes.queryParams.empid]` — Postman GET …/policy?empid=1000 → 200 |
| 07 | 32:20 | Caching key from a header — `#[attributes.headers.empid]` |
| 08 | 37:25 | Add a policy → search "jwt": JWT Validation (Security) |
| 09 | 38:18 | Configure JWT Validation: JWT origin Custom Expression `#[attributes.headers['jwt']]`, signing method RSA, key length 256 |
| 10 | 48:57 | JWT key origin **JWKS** — JWKS URL, caching TTL 60 min, service connection timeout 10000 ms; Skip Client ID validation; optional audience / expiration / not-before claims |
| 11 | 52:06 | Auth0 by Okta — "Secure access for everyone, but not just anyone" (free sign-up used as the authorization server) |
| 12 | 53:26 | Auth0 dashboard (dev tenant): Getting Started — Create Application |
| 13 | 55:27 | Create application → type **Machine to Machine Applications** ("AP JWT Policy") |
| 14 | 55:38 | Authorize Machine to Machine Application: Auth0 Management API, permissions (read/create/update/delete client_grants, users …) |
| 15 | 56:07 | AP JWT Policy → Quickstart: client ID; "Getting an access token for your API" with cURL / C# / Java / Node.js … examples |
| 16 | 57:34 | Postman → Import the cURL: POST https://dev-…auth0.com/oauth/token (client_id, client_secret, audience, grant_type client_credentials) |
| 17 | 58:51 | Response 200: access_token (long JWT), scope, expires_in, token_type Bearer |
| 18 | 60:15 | jwt.io — "JSON Web Tokens are an open, industry standard RFC 7519 method…" |
| 19 | 60:26 | Token pasted into the jwt.io debugger: header alg RS256, typ JWT, kid; payload iss https://dev-…auth0.com/, sub …@clients, aud …/api/v2/, iat, exp, scope |
| 20 | 60:49 | jwt.io: "Signature Verified" (public key fetched from the issuer) |
| 21 | 66:44 | Auth0 docs — JSON Web Key Sets: JWKS endpoint https://{tenant}.auth0.com/.well-known/jwks.json, RS256 vs HS256 |
| 22 | 67:40 | The tenant's /.well-known/jwks.json — keys (kty RSA, use sig, n, e, kid, x5c) |
| 23 | 69:42 | Auth0 Tenant Settings → Signing Keys: rotate / revoke signing key, list of valid keys |
| 24 | 74:35 | JWKS URL pasted into the JWT Validation policy (JWKS origin) |
| 25 | 80:30 | Request without the jwt header → **400 Bad Request** "JWT Token is required" |
| 26 | 80:52 | jwt header with the Auth0 access token → 200 "policy tested successfully" |
| 27 | 87:58 | *Drawing (recap):* Rate Limiting SLA = client ID + rate limit; consumers with 10 / 15 / 25 req/min |
| 28 | 88:05 | *Drawing (recap):* steps to apply Basic Auth — publish spec, create API in API Manager, apply policy, configure Autodiscovery and deploy to RTM |
| 29 | 88:11 | *Drawing (recap):* rate limiting fixed window — 100 req/hour, 429 Too many requests |
| 30 | 88:22 | Next agenda: Scatter-Gather use case and hands-on, Choice Router use case and hands-on, Q&A |

---

### 01 — Add a policy → search "http": HTTP Caching (Quality of service)
![http-caching-search](01-http-caching-search.jpg)

### 02 — Configure HTTP Caching: caching key `#[attributes.requestPath]`, max cache entries 10000, entry time to live 600 s, distributed / persistent cache
![http-caching-config](02-http-caching-config.jpg)

### 03 — Conditional request caching `#[attributes.method == 'GET' or attributes.method == 'HEAD']` and response caching on status codes 200, 203, 204, 206, 300, 301, 404, 405, 410, 414, 501
![http-caching-conditions](03-http-caching-conditions.jpg)

### 04 — Apply to specific methods: GET only
![http-caching-get-only](04-http-caching-get-only.jpg)

### 05 — Logs: first request reaches the flow ("policy demo flow started"), repeats are answered from the cache
![caching-logs](05-caching-logs.jpg)

### 06 — Caching key changed to `#[attributes.queryParams.empid]` — Postman GET …/policy?empid=1000 → 200
![caching-key-queryparam](06-caching-key-queryparam.jpg)

### 07 — Caching key from a header — `#[attributes.headers.empid]`
![caching-key-header](07-caching-key-header.jpg)

### 08 — Add a policy → search "jwt": JWT Validation (Security)
![jwt-validation-search](08-jwt-validation-search.jpg)

### 09 — Configure JWT Validation: JWT origin Custom Expression `#[attributes.headers['jwt']]`, signing method RSA, key length 256
![jwt-validation-config](09-jwt-validation-config.jpg)

### 10 — JWT key origin **JWKS** — JWKS URL, caching TTL 60 min, service connection timeout 10000 ms; Skip Client ID validation; optional audience / expiration / not-before claims
![jwt-jwks](10-jwt-jwks.jpg)

### 11 — Auth0 by Okta — "Secure access for everyone, but not just anyone" (free sign-up used as the authorization server)
![auth0-home](11-auth0-home.jpg)

### 12 — Auth0 dashboard (dev tenant): Getting Started — Create Application
![auth0-dashboard](12-auth0-dashboard.jpg)

### 13 — Create application → type **Machine to Machine Applications** ("AP JWT Policy")
![auth0-create-app](13-auth0-create-app.jpg)

### 14 — Authorize Machine to Machine Application: Auth0 Management API, permissions (read/create/update/delete client_grants, users …)
![auth0-m2m-authorize](14-auth0-m2m-authorize.jpg)

### 15 — AP JWT Policy → Quickstart: client ID; "Getting an access token for your API" with cURL / C# / Java / Node.js … examples
![auth0-quickstart](15-auth0-quickstart.jpg)

### 16 — Postman → Import the cURL: POST https://dev-…auth0.com/oauth/token (client_id, client_secret, audience, grant_type client_credentials)
![postman-import-curl](16-postman-import-curl.jpg)

### 17 — Response 200: access_token (long JWT), scope, expires_in, token_type Bearer
![postman-access-token](17-postman-access-token.jpg)

### 18 — jwt.io — "JSON Web Tokens are an open, industry standard RFC 7519 method…"
![jwt-io](18-jwt-io.jpg)

### 19 — Token pasted into the jwt.io debugger: header alg RS256, typ JWT, kid; payload iss https://dev-…auth0.com/, sub …@clients, aud …/api/v2/, iat, exp, scope
![jwt-decoded](19-jwt-decoded.jpg)

### 20 — jwt.io: "Signature Verified" (public key fetched from the issuer)
![jwt-signature-verified](20-jwt-signature-verified.jpg)

### 21 — Auth0 docs — JSON Web Key Sets: JWKS endpoint https://{tenant}.auth0.com/.well-known/jwks.json, RS256 vs HS256
![auth0-jwks-docs](21-auth0-jwks-docs.jpg)

### 22 — The tenant's /.well-known/jwks.json — keys (kty RSA, use sig, n, e, kid, x5c)
![jwks-json](22-jwks-json.jpg)

### 23 — Auth0 Tenant Settings → Signing Keys: rotate / revoke signing key, list of valid keys
![auth0-signing-keys](23-auth0-signing-keys.jpg)

### 24 — JWKS URL pasted into the JWT Validation policy (JWKS origin)
![jwks-url-in-policy](24-jwks-url-in-policy.jpg)

### 25 — Request without the jwt header → **400 Bad Request** "JWT Token is required"
![postman-jwt-missing](25-postman-jwt-missing.jpg)

### 26 — jwt header with the Auth0 access token → 200 "policy tested successfully"
![postman-jwt-200](26-postman-jwt-200.jpg)

### 27 — *Drawing (recap):* Rate Limiting SLA = client ID + rate limit; consumers with 10 / 15 / 25 req/min
![drawing-recap-sla](27-drawing-recap-sla.jpg)

### 28 — *Drawing (recap):* steps to apply Basic Auth — publish spec, create API in API Manager, apply policy, configure Autodiscovery and deploy to RTM
![drawing-recap-steps](28-drawing-recap-steps.jpg)

### 29 — *Drawing (recap):* rate limiting fixed window — 100 req/hour, 429 Too many requests
![drawing-recap-rate-limit](29-drawing-recap-rate-limit.jpg)

### 30 — Next agenda: Scatter-Gather use case and hands-on, Choice Router use case and hands-on, Q&A
![next-agenda](30-next-agenda.jpg)

