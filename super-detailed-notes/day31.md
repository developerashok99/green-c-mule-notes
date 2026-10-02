# Day 31 — Course Status, API Manager, Gateways, Auto-Discovery and First Policies (Basic Authentication, Client ID Enforcement)

## 1. Overview

1. Alternatives for the GET "not found" logic; low-code loops (preview)
2. Course progress: what's done, what remains
3. Interview preparation material, resume session, certification, practice dumps
4. Next step for the API: **security / policies**
5. **API Manager** — creating an API instance from Exchange
6. **Gateways**: watchman analogy; **Flex Gateway vs. Mule Gateway**
7. **Proxy** vs. basic endpoint
8. How Runtime Manager and API Manager communicate: **platform client ID/secret** + **API instance ID / Auto-Discovery**
9. Policy catalogue and why policy knowledge matters in interviews
10. **Basic Authentication** and **Client ID Enforcement** — differences, which layer gets what security

---

## 2. GET "Not Found" — Alternatives

- Implemented with **Choice**; could also be done with the **Validation** module.
- Whether to return an error or a success with a "not found" message depends on the business requirement.
- If/else logic can also be written inside Transform Message.

**Low-code loops:** in programming you write a for loop. In Mule you drag in **For Each** and configure it — the looping code runs in the background. For Each, Parallel For Each and Batch processing are covered in later sessions.

---

## 3. Course Progress

**Instructor's check:** more than **40 hours** of content completed.

| Done | Pending |
|---|---|
| Basics, debugging, expressions (full **DataWeave** reserved for 2–3 dedicated sessions) | Consuming **SOAP** |
| Deployment: standalone, registration, CloudHub | **File / FTP / SFTP** |
| Consuming REST | Database operations: **bulk** operations |
| Database operations (insert/select/update) | **Object Store** |
| Properties, secure properties | **Scatter-Gather** |
| Choice router, scaffolding, Try scope | **For Each, Parallel For Each, Batch, Async scope** |
| Error handling | **Salesforce connector**, **CI/CD pipeline** |
| | Possibly **AWS S3** |

**Estimate:** about 11–12 hours more (e.g., SOAP ~1 session, Scatter-Gather ~half a session).

---

## 4. Interview Preparation Material

- Interview Q&A documents and videos prepared about 6–7 months earlier, after interview patterns changed.
- **Instructor's view:** if you can answer **6–7 out of 10** questions well, that's what interviewers expect — this material gives 60–70% of the preparation.
- **Resume:** a sample resume and a ~1–1.25 hour session on what to include/exclude and how to write responsibilities.
- **Certification:** with this course and the previous questions, the **first-level** MuleSoft certification is achievable; practice is needed — questions can be tricky.
- **Previous dumps:** shared for practice. **Instructor's opinion:** dumps alone aren't very helpful; use them as practice.

---

## 5. Next Step — Securing the API

Before deploying, apply **security** through **policies** (client ID/secret, etc.).

- MuleSoft provides many ready policies; **90–95%** of the time existing policies are used.
- **Custom policies** (and custom connectors) can be built — advanced and rare. **Instructor's experience:** only built them for practice, never needed in real projects.

---

## 6. API Manager — Creating an API Instance

To apply policies, create an **API** (asset/instance) in **API Manager** for our API (`hr-employees-sapi`). Normally it is taken from **Exchange** (the published spec); you can also create one without Exchange.

**API Manager → Add API → Add new API** → choose gateway → …

---

## 7. Gateways

### 7.1 Watchman analogy

A delivery arrives at a house. The **watchman** checks the delivery person and lets them in only if everything is correct (or rejects them).

> An **API gateway** sits between consumers and the API (service provider). It checks whether the request comes from the right client and follows the policies; if yes, the request proceeds to processing; otherwise it is rejected at the gateway.

### 7.2 Two gateway types (Anypoint Platform)

The old platform had three options; now two:

| | **Flex Gateway** | **Mule Gateway** |
|---|---|---|
| What | Independent API gateway "designed to manage and secure APIs running anywhere" | Gateway **embedded in the Mule runtime** |
| Protects | **Mule and non-Mule** APIs (Java/Spring Boot, TIBCO, …) | **Mule applications only** |
| Setup | Installed/configured separately on its own server (cloud or own) — admins/architects do it; developers select it | Nothing extra — runs inside the app's worker |
| Comparable to | Kong, Tyk, Azure/AWS gateways | — |

### 7.3 Choosing

- Only Mule APIs → **Mule Gateway** (no extra servers/configuration).
- Mule and non-Mule → **Flex Gateway** (one gateway for all).
- Architects compare Flex Gateway with Kong, Tyk etc. on cost and features. **Instructor's opinion:** Kong is a gateway specialist; but if 80–85% of apps are MuleSoft, using MuleSoft's gateway avoids paying for another tool.

**Why it matters:** complete API lifecycle management inside MuleSoft — no third-party gateway needed, lower cost.

The class selects **Mule Gateway** (Mule version 4).

---

## 8. Proxy vs. Basic Endpoint

### 8.1 Options

- **Connect to an existing application (basic endpoint):** API Manager connects to the already deployed app via **auto-discovery** — no extra application.
- **Deploy a proxy application:** a **separate** proxy app is deployed in Runtime Manager in front of the real app. Requests hit the proxy first, which passes them on.

### 8.2 Trade-off

A proxy is another application — **its own workers, CPU and memory** (cost).

**When a proxy makes sense:** for the **experience** layer exposed to the outside world, if you don't want the experience API exposed directly. For process/system APIs, which aren't exposed outside, a proxy wastes resources.

The class connects to the **existing application**.

---

## 9. How API Manager and Runtime Manager Communicate

API Manager and Runtime Manager are separate modules. How does a deployed app get its policies?

### 9.1 Two pieces

1. **Platform client ID and client secret** — given as properties when deploying (besides `mule.env` and `secure.key`). They let the runtime **authenticate to the Anypoint control plane** (API Manager).
2. **API instance ID** — created in API Manager for this API (unique per API instance — 100 APIs → 100 IDs). Configured in the app through **Auto-Discovery**; the app uses it to identify its API in API Manager and download the policies.

```text
Runtime Manager (deployed app)                         API Manager
  properties: anypoint.platform.client_id / secret ───► authenticates
  Auto-Discovery: apiId = ${api.id} (instance ID)  ───► finds API instance → policies
                                                          status: Unregistered → Active
```

> **Technical clarification:** the platform client ID/secret are the **environment's** credentials (Access Management → Environments), different from the per-consumer credentials of the Client ID Enforcement policy.

**Instructor's observation:** even people with 4–5 years of experience are often unclear on this. Simply: **client ID/secret = communication; instance ID + auto-discovery = finding the API.**

### 9.2 Creating the API instance — steps

1. Add new API → **Mule Gateway** → Mule 4.
2. **Select API from Exchange** → `hr-employees-sapi` → **asset version 1.0.1** (latest; 1.0.0 also exists). Fields fill automatically; keep defaults.
3. **Client provider:** default **Anypoint** (it generates client IDs/secrets for Client ID Enforcement). Other providers can be selected.
4. Save → you get the **API instance ID**; status **Unregistered**.

API Manager → **API administration** lists all APIs (search, status, version, instance ID, request counts).

### 9.3 Auto-Discovery configuration in the app

1. Put the instance ID in the property file: `api.id: "<instance id>"`.
2. **Global Elements → Create → API Autodiscovery**:
   - API ID: `${api.id}`
   - Flow name: the **main flow** (with the Listener and router)
3. Deploy with the platform client ID/secret properties. Status becomes **Active** — the app and API Manager communicate, and policies are applied.

**Interview question:** "What is the role of auto-discovery / API instance ID?" — Auto-discovery uses the instance ID to link the running app to its API in API Manager so policies are fetched and enforced.

---

## 10. Policy Catalogue

API Manager → API → **Policies → Add policy**. Categories (as shown):

| Category | Examples |
|---|---|
| Security | OAuth 2.0 token enforcement, JWT validation, XML/JSON threat protection, tokenization, Basic authentication (simple, LDAP), IP allowlist / blocklist |
| Quality of service | HTTP caching, Spike control, Rate limiting, Rate limiting – SLA based |
| Compliance | Client ID enforcement, CORS |
| Troubleshooting | Message logging |
| Transformation | Header injection, header removal |

The course covers ~8–9: Basic authentication, Client ID enforcement, Rate limiting, Rate limiting SLA, Spike control, JSON/XML threat protection, IP allowlist/blocklist, OAuth, JWT.

### Why it matters (instructor's interview experiences)

- A candidate in a recent face-to-face interview knew only rate limiting and OAuth, and couldn't answer OAuth follow-ups.
- A candidate with ~7 years in MuleSoft knew only client ID enforcement, and couldn't explain it in detail.

**Instructor:** not to belittle them — the point is that exploring each topic properly puts you ahead. **About 15–20% more knowledge than peers** is enough; avoid the comfort zone.

---

## 11. Basic Authentication

### 11.1 Why any policy?

Without restrictions, anyone who gets the API URL (e.g., shared by an authorised consumer) can call it.

### 11.2 What it does

> **Basic authentication:** the consumer sends a **username and password**; the gateway checks them; if correct, the request is processed; otherwise rejected.

### 11.3 Weakness

The **same** username/password is shared with **all** consumers (consumer 1, 2, 3, and later 4). It's generic, so it can be shared further; you can't tell consumers apart. Less secure.

---

## 12. Security per Layer

```text
Client (external) ──► Experience API ──► Process API ──► System API ──► DB
                     MORE security       less / none     less / none
                     HTTPS + OAuth       (inside network)
```

- **Experience API:** exposed externally — **more** security: **HTTPS** plus **OAuth**-related policies (stronger than basic auth).
- **Process / System APIs:** inside the network — **less** security is enough, or none.

**But regulated industries:** the **RBI** audits banks every quarter/half-year — applications, data masking, security mechanisms — and can cancel licences after warnings. Banks may therefore apply at least **basic authentication** on process/system APIs.

**Who sends what:**

- Process API → System API: the system API's basic-auth credentials.
- Experience API → Process API: the process API's basic-auth credentials.
- Client → Experience API: OAuth details.

**Consumers:** the client consumes the experience API; experience consumes process; process consumes system; system consumes the database.

---

## 13. Client ID Enforcement

### 13.1 What it does

> A **client ID and client secret** pair is generated **for each consumer**. The consumer sends them; the gateway validates the pair; if valid, the request is processed.

Consumer 1 gets CID1/secret1, consumer 2 gets CID2/secret2, … a new consumer 6 gets new ones. Client ID/secret are like a username/password but look like random strings; generated by the client provider (Anypoint by default) and shared securely (e.g., encrypted email).

### 13.2 Basic auth vs. client ID enforcement

| | Basic authentication | Client ID enforcement |
|---|---|---|
| Credentials | One username/password for everyone | Separate client ID/secret per consumer |
| Security | Less | **More** (track which client called) |
| Effort | Fewer steps | More steps (generate per consumer) |

(The instructor asked this exact difference to the 7-year candidate.)

### 13.3 Not for the external layer

The client ID/secret are **static** (same every call). OAuth generates a **new token** each time, so it's more secure. **Instructor's view:** don't use only client ID enforcement on APIs exposed to the external world.

### 13.4 Internal consumers

If two experience APIs call one process API: each can get its own client ID/secret (traceability — you know which client called), or share one pair internally (then it's effectively like basic auth). The organisation decides; the instructor prefers separate credentials for tracking.

---

## 14. Important Terminology

| Term | Meaning |
|---|---|
| API Manager | Module to manage APIs and apply policies |
| API instance / instance ID | API Manager entry for an API / its unique ID |
| API gateway | Layer that enforces policies before the API |
| Flex Gateway | Independent gateway for Mule and non-Mule APIs |
| Mule Gateway | Gateway embedded in the Mule runtime |
| Proxy application | Separate app deployed in front of the API |
| Auto-Discovery | Global element linking an app to its API instance |
| Platform client ID/secret | Environment credentials for runtime ↔ control plane |
| Client provider | System that issues consumer client IDs (default Anypoint) |
| Unregistered / Active | API instance status before/after the app connects |
| Basic authentication | Username/password policy |
| Client ID enforcement | Per-consumer client ID/secret policy |

---

## 15. Interview Questions

### Q1. What is an API gateway?
A layer between consumers and APIs that enforces policies (authentication, rate limits, …) and forwards only valid requests.

### Q2. Flex Gateway vs. Mule Gateway?
Flex Gateway is independent and protects Mule and non-Mule APIs; Mule Gateway is embedded in the Mule runtime and protects Mule apps only.

### Q3. What is API auto-discovery?
Configuration that links a deployed Mule app to its API instance in API Manager using the API instance ID, so policies are applied.

### Q4. How does a deployed app communicate with API Manager?
It authenticates with the environment's platform client ID/secret and identifies its API via the auto-discovery instance ID.

### Q5. When would you deploy a proxy?
To front an externally exposed API without exposing the implementation directly; it costs extra resources, so not for internal APIs.

### Q6. Basic authentication vs. client ID enforcement?
Basic auth uses one shared username/password; client ID enforcement gives each consumer its own client ID/secret — more secure and traceable.

### Q7. Which policies on experience vs. system APIs?
Experience (external): HTTPS + OAuth. Process/system (internal): lighter policies such as client ID enforcement or basic auth, depending on regulations.

---

## 16. Must Remember

1. 40+ hours done; pending: SOAP, File/FTP, Object Store, Scatter-Gather, For Each/Batch/Async, Salesforce, CI/CD, DataWeave.
2. Policies are applied in **API Manager** on an API instance created **from Exchange**.
3. **Gateway = watchman**; **Flex** (Mule + non-Mule, separate) vs. **Mule Gateway** (embedded, Mule only).
4. **Proxy** = extra app and resources; only for exposed experience APIs.
5. Runtime ↔ API Manager: **platform client ID/secret** + **API instance ID via Auto-Discovery**.
6. Auto-Discovery global element: `${api.id}` + main flow name; status **Unregistered → Active**.
7. Policy categories: security, QoS, compliance, troubleshooting/transformation.
8. **Basic auth** = one shared credential (weak); **Client ID enforcement** = per-consumer credentials.
9. Experience API → HTTPS + **OAuth**; internal APIs → lighter policies (but banks may need more).
10. Learn each policy deeply — it sets you apart in interviews.
