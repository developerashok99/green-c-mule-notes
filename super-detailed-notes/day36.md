# Day 36 — Fixing the CloudHub 2.0 Deployment, Basic Authentication and Client ID Enforcement (Hands-On)

> **Sources:**
> - Cleaned audio transcript ([transcripts-cleaned/day36.txt](../transcripts-cleaned/day36.txt)) and the class video (recorded 25 Dec 2024).
> - Text marked *screen* is read from the recording.
> - Slide images: [slides/day36](../slides/day36/).

## 1. Overview

1. Why the Day 35 deployment hung — three corrections
2. Name vs. **artifactId** — why two projects must never share an artifactId
3. A fresh **policies-demo-api** deployed to CloudHub 2.0
4. **Rolling update vs. Recreate**
5. Checking the API turns **Active** in API Manager
6. **Basic Authentication – Simple** — apply, test, 401 when wrong
7. How the `Authorization: Basic …` header is built
8. **Client ID Enforcement** — request access, applications, contracts, where the secret is
9. Custom-expression credentials (`client_id` / `client_secret` headers, renamed to `c_id` / `c_secret`)
10. Next: rate limiting, SLA, IP allow/block list

---

## 2. Why the Deployment Hung (Day 35 Fix)

CloudHub 2.0 behaves differently from 1.0. Three things were corrected:

| # | Problem | Fix |
|---|---|---|
| 1 | Property keys typed as `anypoint.platform.clientid` | Must be **`anypoint.platform.client_id`** and **`anypoint.platform.client_secret`** (underscore) |
| 2 | The API instance ID in the Autodiscovery element had a stray "34" in it | Re-checked the ID in API Manager and corrected it |
| 3 | The application name matched an existing asset, so CloudHub 2.0 found a conflict and never moved forward | Renamed the project **and** its `artifactId`, then redeployed |

- The wrong key names didn't make the deployment fail — the deployment **hung**.
- *Screen:* after renaming, the deployment went through and the logs showed the app starting.

---

## 3. Project Name vs. artifactId

**Renaming:** right-click the project → **Refactor → Rename**.

- Renaming changes the project name and the `<name>` in `pom.xml`.
- It does **not** change the **`<artifactId>`** — you must edit that yourself.
- *Screen:* `pom.xml` — groupId `com.mycompany`, artifactId `policies-demo-app-test`.

**Why the artifactId matters:**

- Applications in an organization are stored in a repository and found by **artifactId**, not by name.
- The name is just a reference; the artifactId is the project's **unique ID**.
- Like saving two files with the same name in one folder — the system asks to replace or rename.
- If two projects share an artifactId, publishing again collides with the existing one.

**Live demo of the clash:**

1. Import the same jar again and rename the project to `…-1`.
2. Studio shows red marks on **both** projects: *"Conflicting Maven coordinates with other projects."*
3. Cause: both still have the same artifactId.
4. Change the artifactId in one `pom.xml` and save — the error disappears.

The same clash happens in real teams when two developers' code with the same coordinates is merged.

> **Instructor's suggestion:** keep the **artifactId and the application name the same**. Some organizations use a different format, but keeping them identical is simplest.

> **Instructor's view:** in a real organization you would not rename an application at all — once its name is fixed and its Bitbucket/GitHub repository exists, the name stays. The rename here was only to get past the deployment problem.

---

## 4. Fresh Application: policies-demo-api

Built from scratch so the policy tests are clean:

```text
policies-demo-api
  HTTP Listener  (path /policy)
  Logger         "policy demo flow started"
  Transform      {"message": "policy tested successfully"}
  Logger         "policy demo flow ended"
```

Steps:

1. **API Manager → Add API → Create new API** with the same name; copy the new **API instance ID**.
   - *Screen:* policies-demo-api, instance ID **20129892**, status **Unregistered**.
2. **Global Elements → API Autodiscovery** with that instance ID and the main flow.
3. **Export** the jar (Downloads → replace).
4. **Runtime Manager → Deploy application** → upload the jar, shared space.
5. **Properties (text view):** `anypoint.platform.client_id` and `anypoint.platform.client_secret` — new values, because the Anypoint account changed.

**Runtime parameters:** a value like the API ID can also be passed as a property here, if the app reads it from a `${…}` placeholder.

### 4.1 Name conflict with the Exchange asset

- Creating the API in API Manager also creates an asset in the background.
- That asset was **not visible** in Exchange, but deploying an app with the same name still conflicted with it.
- After the rename, CloudHub 2.0 checked Exchange, found no matching artifactId, and deployed.
- This didn't happen on CloudHub 1.0.

### 4.2 When an issue takes days

**Instructor's experience:** one issue took 15 days. Nothing worked until a small workaround change was deployed. Typical issues take half a day to 3 days.

Escalation path:

1. Research it yourself.
2. Discuss it in the team.
3. Get experts from other teams.
4. Raise a **support ticket with MuleSoft**, who investigate and schedule a call.

---

## 5. Rolling Update vs. Recreate

Matters when **redeploying** an application that consumers are already using.

| Strategy | What happens | Availability |
|---|---|---|
| **Rolling update** | New version deploys while the old one keeps running; the old one is killed only after the new one is up | **100%** — no gap |
| **Recreate** | The running app is killed first, then the new one deploys | Gap while it redeploys — consumers get errors |

- **Most of the time, rolling update is used.**
- In real projects this is set in the **CI/CD pipeline**; we look at it here for understanding.

### 5.1 vCores on CloudHub 2.0

- 0.1 vCore was **500 MB** on CloudHub 1.0; on CloudHub 2.0 it comes with **1.2 GB**.
- Paid organizations can also choose **0.05 vCore** — more memory for fewer vCores.

### 5.2 Reading the deployment

- Warnings in the logs can be ignored; look for **errors**.
- It takes a while to reach **Running** (green).
- *Screen:* logs show API autodiscovery — the gateway downloading the policies for the API instance.

---

## 6. API Becomes Active

- Before deploying: **Unregistered**.
- After deploying: *screen* — policies-demo-api **Active**.
- **Active** means Runtime Manager and API Manager can talk; policies can now be applied.

**Where policies are applied:** API Manager → the API → **Policies** (left menu).

### 6.1 Testing before any policy

- URL from **Runtime Manager → application → public endpoint**.
- CloudHub 2.0 gives an **HTTPS** endpoint by default.
  - Shared load balancer recap: 8081 for HTTP, 8082 for HTTPS.
  - On CloudHub 1.0, port 8081 worked with HTTP only.
- `GET https://…cloudhub.io/policy` → *"policy tested successfully"*.

---

## 7. Basic Authentication – Simple

**Add a policy** → search "basic" → **Basic Authentication – Simple** (there's also an LDAP variant).

*Screen:* User Name `akash`, User Password `akash@123`.

### 7.1 Advanced options (common to all policies)

| Option | Meaning |
|---|---|
| Policy version | Latest by default (1.3.1 on screen) |
| Apply to all API methods & resources | The usual choice |
| Apply to specific methods & resources | e.g. only POST on three resources (URI template regex) |

- If a policy is applied to only some methods, the others are **open**.
- If a username/password leaks (e.g. in a data breach), you'll be asked to change it.

### 7.2 Confirming it's applied

*Screen:* Runtime Manager logs — `Applied policy http-basic-authentication … to API policies-demo-api (20129892)`. It takes 1–2 minutes.

### 7.3 Testing (Postman is the client here)

| Request | Result |
|---|---|
| Authorization → Basic Auth, akash / akash@123 | **200** "policy tested successfully" |
| Wrong password (`akash@12345`) | **401** `{"error": "Authentication Attempt Failed"}` |
| No credentials / user removed | **401** |

- A rejected request **never reaches the app** — the **gateway** rejects it, so nothing appears in the app's logs or loggers.
- **Instructor's view:** "I don't know how to see that gatekeeper['s logs]."

### 7.4 Correlation IDs

- Each request's log lines carry a different correlation ID.
- They let you trace "request 1 started … request 1 ended" — or see that a request never arrived.
- Logs can be filtered by date range, timestamp and log level.

---

## 8. How the `Authorization: Basic` Header Is Built

When Postman's Basic Auth is used, it sends a header (*screen:* `Authorization: Basic YWthc2g6YWthc2hAMTIz`):

```text
Authorization: Basic <Base64 of "username:password">
```

To send it manually: Base64-encode `username:password`, prefix `Basic` and a space, and put it in the **Authorization** header.

| Test | Works? |
|---|---|
| Header name `authorization` (lower case) | Yes — header names aren't case-sensitive |
| Header name misspelt (`authorizatio`) | No |
| Prefix `basic` (lower case) | No — `Basic` is case-sensitive |

> **Technical clarification:** HTTP header names are case-insensitive by standard. The scheme in the value is also case-insensitive in the HTTP standard, but the gateway rejected lower-case `basic` here, so send `Basic` exactly.

---

## 9. Client ID Enforcement

**Basic auth vs. client ID enforcement:** with basic auth all five consumers share one username/password; with client ID enforcement each consumer gets its **own** client ID and secret.

**Multiple policies on one API:** allowed. The order they run in is a separate topic.

### 9.1 Credentials origin

*Screen:* **Configure Client ID Enforcement** offers:

1. **HTTP Basic Authentication Header** — client ID goes in the username place, secret in the password place.
2. **Custom Expression** — defaults `#[attributes.headers['client_id']]` and `#[attributes.headers['client_secret']]`.

### 9.2 Where the client ID and secret come from

The policy itself has no "generate" button. Steps:

1. **Exchange → policies-demo-api → Request access** (sometimes under the three-dots menu).
2. Choose the **API instance** (Sandbox, instance ID from API Manager).
3. **Create new application** — e.g. `consumer-1`, defaults.
4. *Screen:* "Your request has been received and approved" — a **client ID and client secret** are shown.
5. Share them with that consumer.
6. For another consumer (`consumer-2`), repeat — it gets its own pair.

### 9.3 Contracts

- **API Manager → the API → Contracts:** each request-access creates a contract.
- *Screen:* consumer-1 **Approved** (automatic approval here).
- With manual approval, the status stays pending until someone approves it.
- Expanding a contract shows the **client ID** but **not the secret**.

**Where the secret is:** **Exchange → My applications** → the application shows both client ID and secret.

### 9.4 Testing with the basic-header option

- Postman Basic Auth: client ID as username, client secret as password.
- Or set the `Authorization` header manually: `Basic ` + Base64 of `clientId:clientSecret`.
- If both the Authorization tab and a manual header are set, the header gets overwritten.

**Turning off the basic-auth policy:** three dots → untick **enable** (disable) — or **Remove policy** to delete it. A disabled policy stays listed but isn't applied.

### 9.5 Custom-expression option

- **Edit configuration** → Custom Expression.
- Consumers then send two headers: `client_id` and `client_secret` (case-sensitive).
- *Demo:* renamed them to **`c_id`** and **`c_secret`** to show they can be customized.
- Whatever names you define, consumers must send exactly those — share them (e.g. in a cURL or Postman collection).

| Request | Result |
|---|---|
| `c_id` / `c_secret` headers with consumer-1's values | **200** |
| No client headers / Authorization header only | **401** "Invalid Client" |
| Old `client_id` / `client_secret` names after the rename | **401** — the policy expects `c_id` |

> **Instructor's suggestion:** keeping the defaults `client_id` / `client_secret` is better; the rename was only to show it's possible.

**Instructor's experience:** "To understand all this, it took me around 6 months" — at first doing it blindly, then working out what could be changed.

### 9.6 Each consumer, own credentials

- consumer-1 (Mahesh) and consumer-2 (Mani) each call the API with their own pair — both work.
- Internal consumers (e.g. marketing and finance departments) may share **one** client ID/secret if the architect decides — acceptable because they're internal.

---

## 10. Next Session

Remaining policies: **rate limiting, rate limiting SLA, IP allowlist, IP blocklist** (and the rest), now faster because the steps are the same.

---

## 11. Important Terminology

| Term | Meaning |
|---|---|
| artifactId | The project's unique ID in Maven/repositories; separate from the display name |
| Conflicting Maven coordinates | Studio error when two projects share groupId + artifactId |
| Rolling update | Redeploy keeping the old version up until the new one runs — no downtime |
| Recreate | Kill the old version, then deploy the new one — brief downtime |
| Active / Unregistered | API Manager status: connected to a running app / not yet |
| Basic Authentication – Simple | Policy checking one shared username/password |
| Client ID Enforcement | Policy checking a per-consumer client ID and secret |
| Request access | Exchange action that creates an application and its client ID/secret |
| Contract | API Manager record of an application's approved access to an API |
| Custom expression (credentials) | Where the policy reads the client ID/secret from, e.g. a header |

---

## 12. Interview Questions

### Q1. Why must the artifactId be unique?
Repositories and deployments identify a project by its artifactId, not its name. Two projects with the same artifactId collide ("Conflicting Maven coordinates"); renaming a project in Studio doesn't change it.

### Q2. Rolling update or recreate?
Rolling update keeps the old version serving until the new one is up — no downtime — so it's the usual choice. Recreate kills the app first, causing a gap.

### Q3. Where do you get a client ID and secret for Client ID Enforcement?
Request access to the API in Exchange; that creates an application with its own client ID and secret. The secret is visible under Exchange → My applications.

### Q4. Basic Authentication vs. Client ID Enforcement?
Basic auth uses one username/password for all consumers. Client ID enforcement gives each consumer its own ID/secret, so you know who called and can revoke one consumer.

### Q5. How do consumers send client credentials?
Either as HTTP Basic (ID as username, secret as password, i.e. `Authorization: Basic …`) or in custom headers defined by the policy's expression, e.g. `client_id` / `client_secret`.

### Q6. Does a request rejected by a policy reach the Mule app?
No — the gateway rejects it (401), so it doesn't show in the app's logs.

---

## 13. Must Remember

1. Property keys: `anypoint.platform.client_id` / `anypoint.platform.client_secret`.
2. Renaming a project doesn't change its **artifactId** — edit `pom.xml`.
3. Same artifactId on two projects → "Conflicting Maven coordinates".
4. **Rolling update** = no downtime; **Recreate** = brief downtime.
5. API Manager status turns **Active** once the deployed app connects via Autodiscovery.
6. Policy rejections (401) happen at the **gateway**, not in the flow.
7. `Authorization: Basic <Base64(user:password)>`; `Basic` must be written exactly.
8. Client ID/secret come from **Exchange → Request access**; the secret is under **My applications**.
9. Every request-access creates a **contract** in API Manager.
10. Custom-expression header names must be sent exactly as defined.
