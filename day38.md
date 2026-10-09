# Day 38 — HTTP Caching Policy and JWT Validation with Auth0

## Session Agenda
- **HTTP Caching** policy — key, entries, TTL, persistent/distributed, conditions
- A real use case: caching a DB-credentials API
- **JWT Validation** policy — JWT origin, RSA, JWKS
- **Auth0** machine-to-machine app and client-credentials token
- Decoding the token on **jwt.io**
- Caching tokens on the consumer side

## HTTP Caching
- Repeated requests are answered from the gateway cache without reaching the app.
- Only for **GET/HEAD** — POST/PUT/PATCH change data.
- **Caching key** (e.g. `#[attributes.queryParams.empid]`), **max cache entries** (default 10000) and **entry TTL** (600 s) control it.
- **Persistent** survives redeploys; **distributed** is shared across workers.
- Cache only 200 responses (instructor's suggestion).
- Use case: an API returning Oracle DB credentials, cached for 48 hours.
- In class the caching didn't take effect — to be checked later.

## JWT Validation
- Token sent in a custom `jwt` header (`#[attributes.headers['jwt']]`) or as a Bearer header.
- **RSA** is asymmetric: the auth server signs with its private key; the gateway verifies with the public key.
- **JWKS** URL (`/.well-known/jwks.json`) keeps the public key current, cached 60 minutes; a pasted key breaks when the provider rotates it.

## Auth0 and jwt.io
- Created a **Machine to Machine** app "AP JWT Policy", authorized for the Auth0 Management API.
- Imported the quickstart cURL into Postman: `POST /oauth/token` with client_id, client_secret, audience and `grant_type: client_credentials`.
- jwt.io shows header (RS256), payload (iss, sub, aud, iat, exp, scope, gty, azp) and a verified signature.
- No `jwt` header → **400** "JWT Token is required"; with the token → **200**.

## Token Caching
- Consumers generate a token once and cache it for its lifetime.
- In a Mule API, store it in the **Object Store** or a cache — not a variable.

## Quick Recap
- Caching policy = fewer hits to the app for repeated GETs.
- JWT = signed token verified at the gateway with a JWKS public key.
- Auth0 M2M + client credentials → access token.
- Next: Scatter-Gather and Choice Router.
