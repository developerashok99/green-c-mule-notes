# Day 34 — Client Credentials and Resource Owner Password Grants, Token Caching (Object Store), and JWT Validation

> **Sources:**
> - Audio transcript, existing notes, and the class video (recorded 21 Dec 2024).
> - Slide text marked *slide*, diagrams marked *drawing* and pages marked *screen* are read from the recording.
> - Slide images: [slides/day34](../slides/day34/).

## 1. Overview

1. **Client credentials grant** — Zomato ↔ Domino's (server-to-server)
2. OAuth protecting **our** experience API — what we give the client, token lifetime, reuse
3. Where the client keeps the token: caching; in MuleSoft: **Object Store** (not variables, not DB)
4. **Resource owner password grant** — Zomato order history
5. Recap: which grant type when
6. **JWT** — structure (header.payload.signature), Base64, jwt.io
7. **JWT validation policy** — avoiding a call to the authorization server for every request; private/public certificates; letter analogy
8. Next: implementing the policies

---

## 2. Client Credentials Grant

> **Grant type** decides how the access token is generated. Here the token is generated using **client credentials** — client ID and client secret — without an authorization code.

### 2.1 Example — Zomato and Domino's

- A user selects **Domino's** on Zomato to order pizza.
- Zomato (the **client**) needs Domino's **pizza types** from Domino's **resource server**, protected by OAuth.
- Domino's has an **authorization server**.

1. **Registration (once):** when Zomato ties up with Domino's, it registers as a client. Domino's authorization server generates a **client ID and client secret** for Zomato and shares them (mail or another channel).
2. Domino's also gives the **token endpoint** — a URL, e.g. `https://<auth-server>.com/.../token` (the endpoint is the path at the end).
3. Zomato sends **client ID + client secret** to the token endpoint.
4. The authorization server returns an **access token**.
5. Zomato calls **get pizza types** with the token.
6. The resource server validates the token and responds.

```text
Zomato server ── client ID + secret ──► Domino's auth server (token endpoint)
Zomato server ◄──────── access token ──
Zomato server ── GET pizza types + token ──► Domino's resource server ──► validate ──► response
```

*Slide:* "OAuth 2.0 Flow — Client Credentials Grant" — Zomato → `/token + Client_ID + Client_Secret` → Authorization Server → `accessToken` → `/getPizzaTypes + accessToken` → Resource Server (Pizza Types, Offers, Restaurants) → `/validate + accessToken` → Pizza Types. Summary slide: *access token is generated using the client credentials · no ownership of resources, the data is common to everyone · server-to-server communication.*

### 2.2 Why fewer steps?

- Authorization code grant: authorization code sent to get the token. Here: **client credentials** sent directly.
- **No browser involved** — it's **server-to-server** communication over a secure network. With a browser (HTML/CSS front end), things are exposed to everyone; here they aren't, so the flow can be simple.

**Instructor's observation:** in the API field, **client credentials** is the grant type mostly used.

---

## 3. OAuth on Our API — End-to-End

### 3.1 Setup

```text
Third-party client ──► [OAuth] Our Experience API (ABC company) ──► process/system APIs …
        │
        └──► Our company's authorization server (token endpoint)
```

- **Authorization server:** e.g. **Okta**, **Auth0**. Most enterprises use a separate identity provider (they already use it for **single sign-on**).

> **Technical clarification:**
> - The instructor mentioned that MuleSoft can also provide an OAuth server for companies without the budget.
> - To be precise: MuleSoft offers an **OAuth 2.0 Provider** (a module you deploy as a Mule app) and API Manager can be connected to external **client providers** (e.g. Okta, PingFederate, OpenAM).
> - API Manager itself isn't an authorization server.

### 3.2 What we give the client

- **Client ID / secret** (client registered).
- **Token endpoint details** — the authorization server exposes an API for token generation: how the request/body/query or URI params should be, how to send authorization.
- **Our API details** — how to call our resources.

*Drawing:* ABC company's OAuth server (Okta / Auth0, "AS"), registered client with CID/CS, `/token` valid 1 hour ("1 hr → 100 reqs", token valid until 11 am), token kept in an **object store**, then token + API request.

### 3.3 Token lifetime and reuse

Token valid for **1 hour** (illustrative):

| Time | Request | What happens |
|---|---|---|
| 10:00 | 1st | Generate token (valid until 11:00), call API with token |
| 10:05 | 2nd | Call API directly with the **same token** (still valid) |
| 11:05 | 3rd | **Invalid token** (expired) → client generates a new token |

The token is sent in the **Authorization header**.

### 3.4 How does the client keep the token for an hour?

- The client is also an application with code.
- It keeps the token in a **cache** — e.g. for ~**55 minutes** (slightly less than the 1-hour validity).
- When the cache entry expires, the next request generates a new token and caches it again.

**Advantages:** less load on the authorization server, more speed, less resource use.

**Why not a variable?** A variable lives only while that request is processed; the next request has no access to it.

### 3.5 MuleSoft calling an OAuth-protected API — where to keep the token?

- Scenario: our **experience API** calls our **process API**, which is also protected by OAuth.
- Same process: register a client, get client ID/secret and token endpoint, generate the token.
- Where to keep it for an hour?

| Option | Verdict |
|---|---|
| **Variable** | ✗ — lives only for one request/event; the next request starts fresh |
| **Database** | Works, but every save/read is a call to an external system — costly ("can do it for ₹20, why pay ₹100?") |
| **Object Store** | ✓ — temporary storage inside the MuleSoft ecosystem; reusable across requests |

**Instructor's view:** not using Object Store isn't "wrong", but efficient code is what separates a good developer from a normal one. (Object Store is covered in its own session.)

### 3.6 HTTP caching policy on the token endpoint?

- Question: with Object Store on our side, is an HTTP caching policy still needed?
- The authorization server is owned by **another team**; whether they put an HTTP caching policy on their token API is their decision.
- Ideally they should — there's no guarantee every client caches.
- But caching on the client side (Object Store) is more efficient, because client and server are different parties and each call between them takes time.

---

## 4. Resource Owner Password Grant

### 4.1 Ownership of resources

- Domino's **pizza types** are the same for Ramesh, Ravi or anyone → nobody **owns** them; common data.
- Ramesh's **order history** on Zomato belongs to **Ramesh** → he is the **resource owner**.

### 4.2 Example — Zomato order history

- Ramesh already has a Zomato account and places orders.
- Zomato has its own **authorization server** and an **orders resource server** protected by OAuth.
- No third-party servers involved.

1. Ramesh logs in on the Zomato front end; the request goes to Zomato's web server (backend).
2. The backend sends **client credentials + Ramesh's username/password** to the token endpoint.
3. Access token returned.
4. **Get orders** + token → validation → Ramesh's order details.

*Slide:* "OAuth 2.0 Flow — Resource Owner Password Grant" — `/token + Client Credentials + User Credentials` → `accessToken` → `/getOrders + accessToken` → Resource Server (Orders, Memberships, Offers, Favourites) → Orders Details.

**Name:** the **resource owner's** credentials (password) are sent to generate the token → **resource owner password grant**.

**Downside:** less secure — the user's credentials are used as part of the request.

> **Technical clarification:** current OAuth security guidance discourages the password grant (it's removed in the OAuth 2.1 draft) because the client handles the user's password. It's taught here because it still exists in older systems and interviews.

### 4.3 Instructor's note

- Question in class from someone who used client credentials in a project without the full picture.
- **Instructor's view:** people with 5–10 years' experience often can't answer "Why client credentials and not authorization code?" — not for lack of talent but because of the comfort zone.
- These are the minimum skills.

---

## 5. Grant Types — Recap

| Grant type | Token generated using | Resource ownership | When |
|---|---|---|---|
| **Authorization code** | Authorization code (+ client ID/secret) | Belongs to the **user**, on the **third-party** app (e.g. Facebook profile) | Sign up / log in with Google, Facebook, LinkedIn |
| **Client credentials** | Client ID + client secret | **Common** to everyone (pizza types) — no individual owner | **Server-to-server** communication (most used for APIs) |
| **Resource owner password** | Client credentials + user's username/password | Belongs to the **user** (order history) | Getting a specific user's data from the client app's own server |

---

## 6. JWT — JSON Web Token

### 6.1 Definition

> **JWT (JSON Web Token)**: a **compact, self-contained** token in JSON format. Three parts — **Header**, **Payload**, **Signature** — **Base64-encoded** and **separated by dots**.

```text
xxxxx.yyyyy.zzzzz
header . payload . signature
```

### 6.2 Demo — jwt.io

- The encoded token on **jwt.io** is shown in three colours: **red = header**, **purple = payload** (actual body), **blue = signature**.
- Decoding shows the header and payload as **JSON objects**.
- *Screen:* decoded header `{"alg": "HS256", "typ": "JWT"}`, payload `{"sub": "1234567890", "name": "John Doe", "iat": 1516239022}`, and VERIFY SIGNATURE `HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), your-256-bit-secret)` → "Signature Verified". The jwt.io home page: "JSON Web Tokens are an open, industry standard RFC 7519 method for representing claims securely between two parties."
- Signing method shown: **HS256** (to be discussed later).
- Our tokens will look the same — bigger or smaller depending on the details inside.

### 6.3 Demo — Base64 in Notepad++

Base64 is a standard **encoding** format (encryption, by contrast, uses a key/algorithm).

- Text "Hello Mahesh, I have a message" → **Plugins → MIME Tools → Base64 Encode** → unreadable string.
- **Plugins → MIME Tools → Base64 Decode** → original text.
- Online tools do the same.

> **Technical clarification:**
> - Base64 is **not** security — anyone can decode a JWT's header and payload.
> - JWT security comes from the **signature** (tampering is detected), not from hiding the content.
> - Don't put secrets in the payload.

---

## 7. Why the JWT Validation Policy?

### 7.1 Problem with plain OAuth validation

- A client sends on average **10,000 requests per hour**.
- It saves the token, so token **generation** is fine (once per hour).
- But for each request, our API (resource server) asks the authorization server to **validate** the token → **10,000 calls** to the auth server per hour.

HTTP caching doesn't really help — each request still needs validation. Can we remove this step?

*Drawing:* client (CID/CS) → `/token` from the AS; then request + token → gateway (GW) in front of the runtime on the worker (RS) → gateway asks the AS to validate every time (×) — the cost JWT removes.

### 7.2 Answer — JWT validation

> The **JWT validation policy** is also an OAuth-type policy, but "more intelligent": the API validates the token **itself**, without calling the authorization server for each request.

### 7.3 How — private and public certificates

```text
Authorization server: holds PRIVATE certificate (never shared)
   └── signs JWT with private certificate ──► client ──► our API (API Manager / gateway)
Authorization server ── PUBLIC certificate ──► configured in API Manager (JWT validation policy)
Gateway: verify signature with public certificate → valid: process; invalid: reject
```

*Drawing:* "JWT validation policy → Authorization server → Okta, Auth0"; client gets a JWT from `/token` (auth server holds the **private cert**); 1,00,000 requests go to the API with the JWT; the **JWT policy** on the resource server holds the **public cert** and validates without calling the auth server. A separate drawing: sender encrypts with key 1, receiver decrypts with key 2 — **symmetric** (same key) vs **asymmetric** (key pair) encryption.

- The authorization server **signs** the JWT with its **private certificate**.
- It gives us the matching **public certificate**; we configure it at **API Manager** level.
- For each request, the gateway checks the **signature** with the public certificate.
  - Correct → process.
  - Wrong → reject.
- No call to the authorization server per request → that step is removed.

**The private certificate is never shared** — not with the client, not with anyone. It stays with whoever (person/machine) generated it; only the public certificate is shared.

> **Technical clarification:**
> - Strictly these are a private **key** and public key (often distributed as a certificate or via a **JWKS** URL).
> - This applies to asymmetric algorithms like **RS256**.
> - **HS256** (the jwt.io default shown) is symmetric — the same shared secret signs and verifies.

### 7.4 Keeping the public certificate up to date

| Method | Notes |
|---|---|
| **Manual / static** | Configure the certificate once. If the auth server changes its private certificate (e.g. after a year) and nobody updates ours, all requests fail |
| **Automatic** | Fetch the public certificate from a URL periodically (e.g. every hour / once a day). After a change, at most one or two requests fail before it updates |

Both will be shown in the implementation.

### 7.5 Letter analogy

- Before writing to you, I give you a **sample of my signature** → the **public certificate**.
- I write a letter, sign it, send it.
- The **postman is a hacker**: replaces the letter and forges a signature.
- You already have my real signature → you compare and detect the forgery.

### 7.6 Why it matters

- The main job of the client and resource server is **processing requests**.
- If token generation, validation and security take a lot of time, overall response time suffers — like a company outsourcing small work to focus on its core business.
- JWT validation reduces that overhead.

OAuth and JWT are **generic** concepts (any technology). Knowing why they work this way is what makes applying them in MuleSoft meaningful.

**Next:** implementing all the policies.

---

## 8. Important Terminology

| Term | Meaning |
|---|---|
| Client credentials grant | Token from client ID + secret; server-to-server |
| Resource owner password grant | Token from client credentials + user's username/password |
| Token endpoint | URL of the auth server that issues tokens |
| Single sign-on (SSO) | One login across company apps (via identity provider) |
| Object Store | Mule temporary key-value storage reusable across requests |
| JWT | JSON Web Token: header.payload.signature |
| Base64 | Reversible encoding (not encryption) |
| jwt.io | Site to decode/inspect JWTs |
| Signature | Proves the token wasn't tampered with |
| Private / public certificate (key) | Sign / verify |
| JWT validation policy | Gateway validates JWT signature locally |
| HS256 / RS256 | Symmetric / asymmetric signing algorithms |

---

## 9. Interview Questions

### Q1. What is the client credentials grant and when is it used?
The client sends its client ID and secret to the token endpoint to get a token; used for server-to-server (API-to-API) communication with no user involved.

### Q2. Why client credentials instead of authorization code for APIs?
No user or browser is involved and the data isn't owned by an individual user; the authorization code flow is for users granting a third-party app access to their data.

### Q3. What is the resource owner password grant? Its drawback?
The client sends the user's username/password plus client credentials to get a token, to access that user's own data. Less secure — the client handles the password.

### Q4. Compare the three grant types.
- Authorization code: third-party sign-in, user-owned data.
- Client credentials: server-to-server, common data.
- Password: user's own data on the client's own system.

### Q5. How should a client handle token expiry?
Reuse the token while valid (cache it slightly shorter than its lifetime); regenerate after expiry.

### Q6. In Mule, where would you store an OAuth token for reuse?
In an Object Store — variables die after each request, and a database adds costly external calls.

### Q7. What is a JWT? Its structure?
A compact, self-contained JSON token: header, payload, signature, Base64-encoded and dot-separated.

### Q8. Is a JWT encrypted?
No — Base64 encoded; anyone can decode it. The signature protects integrity.

### Q9. How does JWT validation differ from OAuth token validation?
OAuth validation calls the authorization server for each request; JWT validation verifies the signature locally with the public key/certificate.

### Q10. Why fetch the public certificate automatically?
If the issuer rotates its private key, a manually configured certificate breaks all requests; automatic refresh picks up the new one.

---

## 10. Must Remember

1. **Client credentials** = client ID + secret → token; **server-to-server**; most used for APIs.
2. Token in the **Authorization header**; reuse until expiry, then regenerate.
3. Client caches the token a bit less than its lifetime (e.g. 55 of 60 minutes).
4. In Mule: **Object Store**, not variables (one request) or DB (costly).
5. **Resource owner password** = user's credentials + client credentials; user-owned data; **less secure**.
6. Authorization code (third-party sign-in) / client credentials (common data) / password (own user data).
7. **JWT** = **header.payload.signature**, Base64, dot-separated; inspect on **jwt.io**.
8. Base64 is **encoding, not encryption**.
9. **JWT validation**: signed with **private** key, verified with **public** key at the gateway — no per-request call to the auth server.
10. Private key never shared; refresh the public certificate **automatically**.
