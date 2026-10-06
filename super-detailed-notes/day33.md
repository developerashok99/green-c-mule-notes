# Day 33 — OAuth 2.0: Authentication vs. Authorization, the Authorization Code Grant, and OAuth Terminology

> **Sources:** audio transcript, existing notes, and the class video (recorded 20 Dec 2024). Slide text marked *slide* and diagrams marked *drawing* are read from the instructor's "MuleSoft OAuth 2.0.pptx" in the recording. Slide images: [slides/day33](../slides/day33/).

## 1. Overview

All other policies have been covered in theory; OAuth is the remaining one. Plan: OAuth theory (this session and the next), then **JWT**, then a practical demo of all policies.

1. What OAuth 2.0 is (and why "2.0")
2. **Authentication vs. authorization** — hotel analogy and API mapping
3. Ways to create an account: directly vs. "Sign in with Google/Facebook" — live GeeksforGeeks demo
4. **Authorization code grant** — the full flow (Zomato + Facebook example)
5. Why the code is exchanged for a token in the backend
6. **OAuth actors**, **OAuth dance/flow**
7. Terminology: resource owner, client, resource server, authorization server, authorization code, access token, refresh token, scope, grant type, redirect URI
8. Next session: client credentials and resource owner password grants, then JWT

---

## 2. What Is OAuth 2.0?

- **OAuth = Open Authorization.**
- **Why 2.0?** There was an **OAuth 1.0** — less secure and no longer used in the industry. **OAuth 2.0** is more secure, has been around for many years, and is the most widely used API security mechanism.

> **OAuth 2.0 is an authorization framework, not an authentication protocol.**

*Slide (annotated):* "OAuth 2.0 → 1.0 — less secure"; *drawing:* ① Authentication — verify the user's identity, ② Authorization — providing restricted access → OAuth; authentication is handled by OpenID Connect.

Its standard definition: a standard for authorization **where a user allows an application to access their resources hosted on another application, on their behalf, without sharing their credentials.** (The flow in §5 makes this concrete.)

---

## 3. Authentication vs. Authorization

### 3.1 Hotel analogy

A family books a hotel online for a summer trip and arrives at reception.

1. Reception asks for the **booking ID** and **ID / address proof**. If the name on the booking and the proofs don't match → no room. If they match → continue. → **Verifying identity = authentication.**
2. The hotel has 100 rooms, but you booked one. They give you the key to **room 405 only**, not all rooms. You can't open room 407. → **Restricted access = authorization.**

| | Meaning | Question |
|---|---|---|
| **Authentication** | Verifying the user's identity — is it the right user? | Who are you? |
| **Authorization** | Granting restricted access to specific resources/actions | What can you access? |

**Order:** authentication happens **first**, then authorization.

### 3.2 In API terms

An API has several resources (R1, R2, R3, R4) and methods.

- Is the request coming from the **right user/client/consumer**? (e.g. consumers 1–3 have client IDs/secrets; someone else sending wrong credentials must be rejected) → **authentication**.
- The client was given access only to R1 — can it call R2? No → **authorization**.

### 3.3 OAuth vs. OpenID Connect

Strictly, **OAuth** handles **authorization** and **OpenID Connect** handles **authentication** (identity, on top of OAuth). In regular usage people mix both and just say "OAuth".

---

## 4. Two Ways to Create an Account

On apps like Zomato, Swiggy, LinkedIn:

1. **Directly** — give your email/phone, password, name. The app stores everything.
2. **Using an existing account** — "Continue with Google / Facebook / LinkedIn / GitHub".

**Why option 2?** Convenience — you don't need to remember a username/password for every app.

### 4.1 Live demo — GeeksforGeeks sign-up with Google

1. GeeksforGeeks → **Sign up** ("Please Login To Continue"). *Screen:* options e-mail / password / institution-organisation, or **Google, Facebook, LinkedIn, GitHub**. The class first clicked **Facebook** — consent page: "GeeksforGeeks is requesting access to: Your name and profile picture and email address" (Continue / Cancel) — then repeated it with Google in an incognito window, which is the run below.
2. Click **Google** → the page moves to **accounts.google.com** (we're on Google now, not GeeksforGeeks).
3. Enter the Gmail and password **on Google's page**.
4. **Consent screen:** "By continuing, Google will share your **name, email address, language preference and profile picture** with GeeksforGeeks." Continue (or cancel).
5. Redirected back to GeeksforGeeks — the **account is created**. Profile → Edit profile shows the **email ID** taken from Google (a profile photo would be imported too, if present).

*Screen:* Zomato's own sign-up dialog was also opened (full name, e-mail, or "Sign in as …" with Google) — Zomato is the client in the flow diagram below.

**Key point:** you never gave your Google password to GeeksforGeeks. Giving it would be like handing your account to a friend — a compromise. Instead the site gets **restricted access** to a few details.

We do this daily without noticing the steps.

---

## 5. Authorization Code Grant — The Flow

**Illustrative example:** Ramesh wants to create a **Zomato** account using his **Facebook** account.

Facebook has:

- a **resource server** hosting APIs/resources: profile details, friends list, photos, location tags, …
- an **authorization server** handling login, consent and tokens.

### 5.1 Prerequisite — registration

Zomato has **registered** with Facebook's authorization server beforehand (otherwise the "Login with Facebook" option couldn't exist). Registration gives Zomato a **client ID and client secret**, and Zomato's **redirect URI** (where to send the code back) is known to the authorization server.

### 5.2 Steps

*Slide:* "OAuth 2.0 Flow — Authorization Code Grant" — User → Login + User Credentials, Consent Form, /authorize → Authorization Server (Facebook); authCode → /token + authCode + clientCredentials → accessToken → /getProfiles + accessToken → /validate + accessToken → Resource Server (Profile Details, Friends List, Photos, Location Tags) → Profile Details. *Annotations:* Ramesh (FB), redirect URI, browser (front end) vs back end, and get/post/patch/delete next to the resource server.

```text
 Ramesh (browser)        Zomato (client)        Facebook Auth Server     Facebook Resource Server
      |  1 click "Facebook"   |                        |                          |
      |---------------------->|  2 redirect to FB login (+ redirect URI)         |
      |<-----------------------------------------------|                          |
      |  3 username/password (to Facebook only)        |                          |
      |----------------------------------------------->|                          |
      |  4 consent page: "share name, email, photo?"  |                          |
      |<-----------------------------------------------|                          |
      |  5 OK                                          |                          |
      |----------------------------------------------->|                          |
      |  6 redirect to Zomato's redirect URI with AUTHORIZATION CODE              |
      |---------------------->|                        |                          |
      ======== above: front end / browser ======== below: back end ========
      |                       | 7 code + client ID + client secret -> token endpoint
      |                       |----------------------->|                          |
      |                       | 8 ACCESS TOKEN          |                          |
      |                       |<-----------------------|                          |
      |                       | 9 GET profile + access token -------------------->|
      |                       |                        |<-- 10 validate token ----|
      |                       |                        |--- valid --------------->|
      |                       | 11 profile details (only consented fields) <------|
      |                       | 12 create Zomato account                          |
```

1. Ramesh clicks the Facebook button on Zomato.
2. Zomato redirects the browser to the Facebook login page.
3. Ramesh enters his Facebook username/password — **on Facebook**.
4. Facebook validates them and shows the **consent page** (which details will be shared).
5. Ramesh clicks OK → authorization given.
6. The authorization server generates an **authorization code** (alphanumeric) and sends it to Zomato via the **redirect URI**. All of this happens in the browser — tabs switch to Facebook and back.
7. Zomato's backend sends **client ID + client secret + authorization code** to Facebook's **token endpoint**.
8. The authorization server returns an **access token**. (The account isn't created yet.)
9. Zomato calls **GET profile details** on the resource server with the token.
10. The resource server asks the authorization server to **validate the token**.
11. Valid → profile details returned. Invalid → request rejected.
12. Zomato uses the details to create the account.

### 5.3 Why only "get profile"?

Ramesh's consent covered only a few details. Zomato gets **GET** only — no edit, update or delete (POST/PATCH/DELETE), so it can't change Ramesh's phone number or email on Facebook. That's authorization: restricted access.

### 5.4 Why not use the code directly as the token?

Up to step 6 everything happens in the **browser**, so the **authorization code is visible**. If it worked as an access token, anyone who intercepted it could call the resource server. So the code is exchanged for the access token **in the backend** (Zomato ↔ Facebook server-to-server), together with the client ID/secret.

> **Technical clarification:** the code by itself is useless to an attacker because exchanging it requires the client secret (and it's short-lived and single-use). This is exactly why the exchange happens in the backend with the secret.

### 5.5 How often does this happen?

**Rare** — once when the account is created. After a while (e.g. a week or 10 days) the session/token expires and the same process runs again to log in.

### 5.6 When to use the authorization code grant

When a user signs up or logs in to a **third-party application** using an account from Google, Facebook, LinkedIn or another authorization service provider.

---

## 6. OAuth Dance and OAuth Actors

> **OAuth dance** (or **OAuth flow**): the series of steps in the OAuth process — redirecting the user to the authorization server to grant permission, exchanging the authorization code for an access token, and using the access token to access protected resources.

**Interview:** "Explain the OAuth dance for the authorization code grant" → describe the steps in §5.2.

> **OAuth actors:** the agents involved in the flow.

| Actor | In the example | Definition |
|---|---|---|
| **Resource owner** | Ramesh (the user; owner of the Facebook profile) | The user who owns the account being accessed |
| **Client** (client application) | Zomato | The application requesting access to protected resources on behalf of the user |
| **Authorization server** | Facebook auth server (in companies: e.g. **Okta**, **Auth0**) | Handles authentication/authorization and issues access tokens |
| **Resource server** | Facebook resource server | Hosts the protected resources |

*Drawing — the same roles in a company:* a mobile app (MA) talks to its MA server, which holds a client ID/secret registered with the **OAuth server**; the MA server gets a token and calls the resource server (an API — here "GAPI" — protected by OAuth).

**Mapping to MuleSoft:** our APIs are deployed on CloudHub **workers** — in this context the worker/runtime hosting the API is the **resource server**. The authorization server is a separate identity provider the company chooses (Okta, Auth0, …).

---

## 7. Using OAuth With Our API

```text
Client ──► Authorization server (token endpoint) ──► access token
Client ──► Our API (request + token)
           Our API ──► Authorization server: is the token valid?
           valid   → process and respond
           invalid → reject
```

---

## 8. Terminology Details

### 8.1 Authorization code
A **temporary code** the client receives after the user authorizes the request.

### 8.2 Access token
A token the client uses to make requests to the resource server. Lifetime is configured — typically **1 hour, 2 hours, or 24 hours**.

### 8.3 Refresh token
A **long-lived** token used to obtain a **new access token** when the current one expires.

**Illustrative example:** access token valid 1 hour; refresh token valid 10 days. When the access token expires, the client uses the refresh token to get a new access token from the authorization server without repeating the whole flow.

**Instructor's observation:** clear in concept, but used less; many people don't know about it.

> **Technical clarification:** the authorization server doesn't renew tokens on its own. The **client** sends the refresh token to the token endpoint (grant type `refresh_token`) and receives a new access token.

### 8.4 Scope
Specific **permissions** the client requests; the level of access within a resource.

**Illustrative example — a file with read, write, delete:**

| User | Scope | Can |
|---|---|---|
| User 1 | read | read only |
| User 2 | read, write | read and edit, not delete |
| Owner | read, write, delete | everything |

### 8.5 Grant type
> The method by which the client obtains the access token. It decides **how and through which process** the token is generated.

OAuth 2.0 defines several:

- **Authorization code grant** — this session (the token is generated using the auth code, hence the name).
- **Client credentials grant** — **instructor's observation:** the one mostly used in the API field; covered next session.
- **Resource owner password grant** — next session.

Each grant type has its own flow and use case. If you've worked with an OAuth policy, check which grant type it used.

### 8.6 Redirect URI
> The URI to which the authorization server redirects the user after they authorize the request. It's specified by the client when it initiates authorization (and registered beforehand).

It travels in the backend request when the Facebook login is opened, so the authorization server knows where to send the code.

### 8.7 Authentication / authorization (formal)
- **Authentication:** verifying a user's identity; in OAuth it takes place at the **authorization server**.
- **Authorization:** granting permission to perform specific actions; in OAuth 2.0 it happens **after** authentication, when the user grants the client permission. The **scope** determines the level of access.

**Side discussion — 2-step verification:** a question came up whether Google/Facebook 2-step verification follows the same process. Not answered in detail; noted that 2-step verification is a more secure way of protecting an account.

---

## 8A. Slides Flicked Through at the End

*Screen:* at about 71:30 the instructor scrolled through the rest of the deck — "OAuth 2.0 Flow — Client Credentials Grant", "OAuth 2.0 Flow — Resource Owner Password Grant", the three "Grant type" summary slides, and "JWT — JSON Web Token: compact, self-contained JSON object; three parts header, payload and signature separated by dots". These are taught on Day 34 (see [day34](day34.md)); the authorization-code summary slide reads: *access token is generated using the authorization code · sign up using third-party apps · ownership of resource data lies with the user (resource owner) on the third-party app.*

---

## 9. Important Terminology

| Term | Meaning |
|---|---|
| OAuth | Open Authorization |
| OAuth 2.0 | Current authorization framework (1.0 obsolete) |
| OpenID Connect | Authentication layer on top of OAuth |
| Authentication | Verifying identity |
| Authorization | Granting restricted access |
| Resource owner | User who owns the data |
| Client | App requesting access on the user's behalf |
| Authorization server | Issues tokens (Okta, Auth0, …) |
| Resource server | Hosts protected resources |
| Authorization code | Temporary code after user consent |
| Access token | Token used to call resources |
| Refresh token | Long-lived token to get new access tokens |
| Scope | Permission level |
| Grant type | How the token is obtained |
| Redirect URI | Where the auth server sends the user/code back |
| Token endpoint | Endpoint that issues tokens |
| OAuth dance / flow | The full sequence of steps |
| OAuth actors | Resource owner, client, auth server, resource server |

---

## 10. Interview Questions

### Q1. What is OAuth 2.0?
Open Authorization 2.0 — an authorization framework that lets an application access a user's resources on another application on their behalf, without sharing credentials.

### Q2. Is OAuth authentication or authorization?
Authorization. Authentication is handled by OpenID Connect, though people commonly use "OAuth" for both.

### Q3. Authentication vs. authorization?
Authentication verifies identity (who you are); authorization grants restricted access (what you can do). Authentication comes first.

### Q4. Explain the OAuth dance for the authorization code grant.
User clicks login with provider → redirected to provider login → enters credentials → consent → auth code sent to client's redirect URI → client exchanges code + client ID/secret for an access token at the token endpoint → client calls resource server with token → resource server validates token → data returned.

### Q5. Who are the OAuth actors?
Resource owner, client, authorization server, resource server.

### Q6. Why isn't the authorization code used as the access token?
It passes through the browser and can be seen; the token is obtained in the backend using the code plus client secret.

### Q7. Access token vs. refresh token?
Access token: short-lived, used to call resources. Refresh token: long-lived, used to get a new access token after expiry.

### Q8. What is a scope?
The permissions the client requests — e.g. read only vs. read/write.

### Q9. What is a grant type? Name three.
The method of obtaining a token: authorization code, client credentials, resource owner password.

### Q10. What is a redirect URI?
The registered URI where the authorization server sends the user (and code) after authorization.

### Q11. When is the authorization code grant used?
When users sign in to third-party apps with Google/Facebook/LinkedIn accounts.

---

## 11. Must Remember

1. **OAuth = Open Authorization**; **2.0** is current, 1.0 obsolete.
2. OAuth is an **authorization framework**, not an authentication protocol (OpenID Connect = authentication).
3. **Authentication** (identity) first, then **authorization** (restricted access) — hotel: ID check, then room 405 key.
4. User credentials go only to the provider; the client gets **restricted access** after **consent**.
5. Auth code flow: login → consent → **code via redirect URI** → **code + client ID/secret → token** → call resource → **validate token**.
6. The code is browser-visible; the token exchange is **backend**.
7. Actors: **resource owner, client, authorization server, resource server**.
8. **Access token** short-lived (1–24 h); **refresh token** long-lived.
9. **Scope** = permission level; **grant type** = how the token is obtained.
10. Next: **client credentials** (most used for APIs), **resource owner password**, then **JWT**.
