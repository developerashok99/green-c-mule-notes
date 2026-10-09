# Day 38 — HTTP Caching Policy and JWT Validation with Auth0 (Hands-On)

> **Sources:**
> - Cleaned audio transcript ([transcripts-cleaned/day38.txt](../transcripts-cleaned/day38.txt)) and the class video (recorded 27 Dec 2024).
> - Text marked *screen* or *drawing* is read from the recording.
> - Slide images: [slides/day38](../slides/day38/).

## 1. Overview

1. **HTTP Caching** policy — what it caches and when
2. Caching key, max entries, time to live
3. A real use case — caching a DB-credentials API
4. Persistent and distributed cache
5. Conditional request/response caching
6. Hands-on test (caching didn't take effect in class)
7. **JWT Validation** policy — JWT origin, signing method
8. Symmetric vs. asymmetric keys (RSA)
9. JWT key origin — manual public key vs. **JWKS**
10. **Auth0** — machine-to-machine application, token via client credentials
11. Decoding the token on **jwt.io**
12. JWKS URL, signing keys, applying and testing the policy
13. Token caching on the consumer side
14. Recap drawings and next agenda

---

## 2. HTTP Caching — What It Does

- *Screen:* Add a policy → search "http" → **HTTP Caching** (Quality of service).
- When the same request comes multiple times, the response is stored in a cache and returned immediately.
- The request does **not** reach the API's processing.
- "Same request" = same value of the parameter you choose as the key.

**Which methods?**

- **Not** POST, PUT or PATCH — they insert/replace data; every request is different.
- Use it for data that doesn't change often — e.g. employees who resigned on a past date.
- So it works with **GET** (and **HEAD**, included by default).
- **Instructor's view:** he has never used HEAD.

---

## 3. Configuration Fields

*Screen — Configure HTTP Caching:*

```text
HTTP Caching Key       : #[attributes.requestPath]
Maximum Cache Entries  : 10000
Entry Time To Live     : 600   (seconds)
Distributed            : (unticked)
Persistent Cache       : (unticked)
```

### 3.1 Caching key

- Extracts from the request what to cache **by**.
- Example: `GET /resignedemployees?resignedDate=…` → key `attributes.queryParams.resignedDate`.
  1. First request for 25 November — not cached → gets data, saves response.
  2. Next request for 25 November → cached response returned.
  3. Runtime Manager logs appear **only the first time** — that's how you validate it.

### 3.2 Maximum cache entries

- How many entries are stored; when full, a new one replaces another (e.g. limit 500 → 501st replaces).
- Default 10,000 — you'd reduce it.
- Don't keep huge payloads in the cache (e.g. 5,000 employees resigned in one day).

### 3.3 Entry time to live

- How long a response stays cached — 600 s = 10 minutes.
- After that, the entry expires and the next request is processed again.
- For 24 hours, calculate the seconds.
- Generally caching is kept within 24 hours (access tokens typically live 1–3 hours).

---

## 4. Use Case — Caching a DB-Credentials API

**Instructor's experience:**

1. Database connectors were used directly in ~20 APIs (15 process, 5 system).
2. The **Oracle password changes every three months** — mandatory.
3. Changing the password in 20 APIs in production every 3 months is painful.
4. The proper API-led design: one or two system APIs do all DB operations, called by the process APIs.
5. To develop fast they'd put DB access in all 20 — so they built a small API that returns DB host, port, username and password.
6. **HTTP caching** on that API with a **48-hour** TTL → each API fetches credentials once per 48 hours.

- "A small hack — whether it's right or wrong, there are many better ways."
- A caching module inside our own API also exists — covered later.

---

## 5. Persistent and Distributed Cache

| Option | Meaning |
|---|---|
| **Persistent cache** | Survives redeployments and worker restarts; without it the cache is temporary and cleared on redeploy |
| **Distributed** | For an app on **multiple workers** — the cache is shared across them |

- Without persistence, the first request after a restart just reprocesses — not much burden.
- Some situations need persistence (explained later with the **Object Store** module).
- Apps are usually on multiple workers for high availability and load sharing — hence distributed.
- At the gateway, a persistent cache uses a small database at the back; otherwise memory.

---

## 6. Conditional Caching

*Screen:*

```text
Request caching condition : #[attributes.method == 'GET' or attributes.method == 'HEAD']
Response caching condition: status codes 200, 203, 204, 206, 300, 301, 404, 405, 410, 414, 501
```

- Only responses where the condition is true are cached.
- The cache shouldn't hold error responses — why 404 or 501?
- **Instructor's suggestion:** cache only **200** — success is enough. Redirects are fine.
- Invalidation headers — left as default.
- *Screen:* applied to specific methods — **GET** only.

---

## 7. Hands-On Test

1. Query parameter `empid=1000`, TTL **60 seconds**.
2. Listener path `/api/*`.
3. Expectation: first request prints both loggers (start/end); repeats within a minute print nothing.
4. Logs: "Applied policy http-caching".
5. *Screen:* caching key `#[attributes.queryParams.empid]`, `GET …/policy?empid=1000` → 200.
6. *Screen:* also tried a header key — `#[attributes.headers.empid]`.

**Result:** the loggers printed on every request (1, 2, 3 … 7) — caching **did not take effect** in class.

- Other policies were removed — still didn't work.
- Warning seen: *"The HTTP listener does not define a star in its path; the full request path is used to check against policy resource matching."*
- The instructor said he'd figure it out later; the concept is what matters.
- The dummy listener has no method restriction, so POST/PUT/DELETE also reach it.

---

## 8. JWT Validation — Configuration

*Screen:* Add a policy → search "jwt" → **JWT Validation** (Security).

### 8.1 JWT origin

| Option | How the consumer sends it |
|---|---|
| Bearer authentication header | `Authorization: Bearer <token>` |
| Custom expression | A header named by you — class used `#[attributes.headers['jwt']]` |

- The team decides; class sent it in a `jwt` header.

*Screen:*

```text
JWT Origin       : Custom Expression  #[attributes.headers['jwt']]
Signing Method   : RSA
Signing Key Length: 256
```

### 8.2 Symmetric vs. asymmetric

| | Symmetric | Asymmetric (RSA) |
|---|---|---|
| Keys | One key encrypts and decrypts | A **pair** — private key signs, public key verifies |
| Security | Less | More |

- The **authorization server** signs the token with its **private key** (kept private).
- The API gateway verifies with the **public key**, which can be shared with anyone.
- With the public key you can only **verify** — not sign.

**Analogy:** selling a house — you give the mediator the main-door key, but not the key to the bedroom locker with the jewellery. One key for everything is less secure.

**Same idea as basic auth vs. client ID:** with one shared credential you can't tell which of five consumers leaked it; with five pairs you can identify and block one.

- Identifying misuse needs logs at the administrator level (Access Management); the instructor doesn't have that access as a developer.

### 8.3 JWT key origin

| Option | How |
|---|---|
| Manual (text) | Get the public key from the auth team and paste it |
| **JWKS** | Give a JWKS URL; the gateway downloads the public key |

- **Problem with manual:** if they rotate the private key and forget to send the new public key, all requests fail until you update it.
- With **JWKS**, the key at the URL updates automatically.
- *Screen:* **caching TTL 60 min** (fetched once an hour), service connection timeout 10000 ms.
- If the key changes, the cache can be invalidated immediately.
- **Instructor's suggestion:** JWKS is always advisable.

Other options (*screen*): **Skip Client ID validation**, optional **audience**, **expiration** and **not-before** claims — kept as default.

---

## 9. Auth0 as the Authorization Server

- *Screen:* **auth0.com** — Auth0 by Okta — *"Secure access for everyone, but not just anyone."*
- Sign up free with a Google account; the class used a dev tenant.
- In real projects the Auth0/security team does this and gives you the details or public key.

### 9.1 Create the application

1. *Screen:* dashboard → **Create Application**.
2. Name: **AP JWT Policy**.
3. Type: **Machine to Machine Applications**.
   - Not single-page or regular web — requests come from a front-end **server** (mobile app → its web server → our API).
4. *Screen:* **Authorize Machine to Machine Application** → select **Auth0 Management API**.
5. Permissions (scopes) can be restricted; class selected all → **Authorize**.

### 9.2 Get a token

1. *Screen:* **Quickstart** shows code for cURL, C#, Java, Node.js …
2. Copy the **cURL** (client URL) → Postman → **Import** → paste → import without saving.
3. *Screen:* request:

```text
POST https://dev-…auth0.com/oauth/token
Content-Type: application/json

{
  "client_id": "…",
  "client_secret": "…",
  "audience": "https://dev-…auth0.com/api/v2/",
  "grant_type": "client_credentials"
}
```

4. *Screen:* **200** — `access_token` (long JWT), `scope`, `expires_in`, `token_type: Bearer`.

- The **token endpoint** is what you give the client after registering it.

---

## 10. Decoding on jwt.io

*Screen:* jwt.io — *"JSON Web Tokens are an open, industry standard RFC 7519 method…"*

- Token is Base64-encoded; three parts separated by **dots**:
  - **Red** — header
  - **Purple** — payload
  - **Blue** — signature

**Header:** `alg: RS256`, `typ: JWT`, `kid` (ignore).

**Payload claims:**

| Claim | Meaning |
|---|---|
| `iss` | Issuer — the Auth0 tenant domain |
| `sub` | Subject — client ID + `@clients` |
| `aud` | Audience — domain + `/api/v2/` |
| `iat` | Issued at — **epoch time** (hover: Fri, 27 Dec, 8:36) |
| `exp` | Expiry — 24 hours later (default; usually set to 1–2 hours by the auth team) |
| `scope` | All permissions granted |
| `gty` | Grant type — client-credentials |
| `azp` | Authorized party — the client ID |

- *Screen:* **"Signature Verified"**.

---

## 11. JWKS URL and Signing Keys

1. Search Auth0 docs for JWKS → *screen:* endpoint `https://{tenant}.auth0.com/.well-known/jwks.json` (RS256 vs HS256 explained there).
2. *Screen:* the tenant's `/.well-known/jwks.json` — keys with `kty: RSA`, `use: sig`, `n`, `e`, `kid`, `x5c`.
   - The public key is identified from these (the instructor thinks `n` and `e`).
3. *Screen:* **Tenant Settings → Signing Keys** — rotate/revoke signing key, list of valid keys.
4. Auth0 also has settings like refresh-token time.
5. Free trial here; enterprise use is paid.

### 11.1 Student questions

**Q: Could we write Java code instead of using an authorization server?**
Auth0 is like MuleSoft — Java underneath, made easy. Building it all yourself takes time; people use these for convenience and flexibility.

**Q: Couldn't we check a username/password from a property file inside the app?**
- There are multiple ways; decide by budget, time, convenience and knowledge.
- For tokens, a separate OAuth server is better.
- **Instructor's experience:** Okta and Auth0 are used most — all his clients used Okta, one used Auth0.
- On a standalone system he once put credentials in a property file and used the Spring module.

---

## 12. Applying and Testing

- *Screen:* JWKS URL pasted into the policy → apply.

**Flow:**

1. Consumer generates a token from the token URL.
2. Consumer calls the API with the token.
3. Gateway verifies the signature with the public key (downloaded from JWKS once an hour).
4. If valid, the request goes to the app.

| Request | Result |
|---|---|
| No `jwt` header | **400 Bad Request** "JWT Token is required" |
| `jwt` header with the Auth0 access token | **200** "policy tested successfully" |
| Same token again | 200 — valid for a day |

---

## 13. Token Caching on the Consumer Side

**Q: How does a mobile app send it?** Its web server's background code generates the token, **caches** it for its lifetime (1–2 hours) and passes it on each call — not a new token every time.

**Scenario — a Mule process API calling this JWT-protected API:**

1. HTTP Request 1 → token endpoint → token.
2. HTTP Request 2 → the API with the token.
3. Saving the token in a **variable** is wrong — a variable dies with each request, so every request hits the token URL again.
4. Save it in the **Object Store** or a cache — the next request finds it and reuses it.

- It doesn't break anything, but time and resources are wasted.
- Even if the auth server caches, the network call still happens — caching on our side removes it.
- JWT removes a step at the gateway too: it validates locally with the public key instead of calling a validation URL every time.

---

## 14. Recap Drawings and Next Agenda

- *Drawing:* **Rate Limiting SLA = client ID + rate limit**; consumers with 10 / 15 / 25 req/min.
- *Drawing:* steps to apply basic auth — publish spec, create API in API Manager, apply policy, configure Autodiscovery and deploy to Runtime Manager.
- *Drawing:* rate limiting fixed window — 100 req/hour, 429 Too many requests.
- *Screen — next agenda:* **Scatter-Gather** use case and hands-on, **Choice Router** use case and hands-on, Q&A.

---

## 15. Important Terminology

| Term | Meaning |
|---|---|
| HTTP Caching policy | Gateway caches responses and replies without reaching the app |
| Caching key | Expression deciding what a cached entry is keyed by |
| Entry time to live | Seconds a cached response is kept |
| Persistent cache | Cache that survives redeploys/restarts |
| Distributed cache | Cache shared across multiple workers |
| JWT Validation | Policy that verifies a JSON Web Token's signature and claims |
| RSA / RS256 | Asymmetric signing — private key signs, public key verifies |
| JWKS | JSON Web Key Set — URL publishing the public keys |
| Auth0 | Okta-owned authorization server used in class |
| Machine to Machine app | Auth0 app type for server-to-server calls |
| Client credentials | Grant type exchanging client ID/secret for a token |
| Epoch time | Numeric timestamp used by `iat` / `exp` |

---

## 16. Interview Questions

### Q1. Which requests can the HTTP Caching policy cache?
GET (and HEAD). POST/PUT/PATCH change data, so each request is different.

### Q2. How do you check the caching policy works?
The first request prints the flow's loggers; repeats within the TTL return from the cache, so no logs appear in Runtime Manager.

### Q3. Persistent vs. distributed cache?
Persistent survives redeploys and restarts; distributed shares the cache across multiple workers.

### Q4. Why RSA for JWT?
It's asymmetric: the auth server signs with a private key, and the gateway verifies with the public key, which can be shared safely and can't be used to sign.

### Q5. Why JWKS rather than pasting the public key?
If the auth server rotates its key, JWKS picks up the new public key automatically (cached e.g. 60 minutes); a pasted key breaks all requests until updated manually.

### Q6. What are the parts of a JWT?
Header (alg, typ, kid), payload (iss, sub, aud, iat, exp, scope…) and signature, separated by dots and Base64-encoded.

### Q7. What happens if the JWT header is missing?
The gateway returns 400 Bad Request "JWT Token is required".

### Q8. A Mule API calls a JWT-protected API — how do you handle tokens?
Get the token once and store it in the Object Store or a cache for its lifetime, rather than a variable, so you don't hit the token endpoint on every request.

---

## 17. Must Remember

1. HTTP caching = GET/HEAD only; repeats don't reach the app.
2. Key, max entries and TTL decide what and how long to cache.
3. Cache only **200** responses (instructor's suggestion).
4. Persistent = survives restart; distributed = across workers.
5. JWT origin: Bearer header or custom header (class: `jwt`).
6. RSA: private key signs, public key verifies.
7. Use **JWKS** (`/.well-known/jwks.json`) so key rotation is automatic.
8. Auth0 M2M app + `grant_type: client_credentials` → access token.
9. Missing JWT → **400** "JWT Token is required".
10. Consumers should cache tokens (Object Store), not regenerate each request.
