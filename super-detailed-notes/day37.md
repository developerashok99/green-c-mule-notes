# Day 37 — IP Allowlist/Blocklist, JSON and XML Threat Protection, Rate Limiting, Rate Limiting SLA and Spike Control (Hands-On)

> **Sources:**
> - Cleaned audio transcript ([transcripts-cleaned/day37.txt](../transcripts-cleaned/day37.txt)) and the class video (recorded 26 Dec 2024).
> - Text marked *screen* is read from the recording.
> - Slide images: [slides/day37](../slides/day37/).

## 1. Overview

1. CloudHub 1.0 vs. 2.0 — a few high-level differences
2. API Manager statistics for policies-demo-api
3. **IP Allowlist** — single IP, ranges, the `X-Forwarded-For` header
4. **IP Blocklist**
5. **JSON Threat Protection** — depth, lengths and counts
6. **XML Threat Protection** — the XML equivalents
7. **Rate Limiting** — 429 Too Many Requests
8. **Rate Limiting SLA** — SLA tiers attached to client applications
9. **Order of policies**
10. **Spike Control** — queueing and retrying instead of rejecting
11. Pending: HTTP caching policy

---

## 2. CloudHub 1.0 vs. 2.0 (High Level)

- With the same application name, the app doesn't deploy on CloudHub 2.0; the instructor found a workaround (rename, Day 36).
- Nobody in the instructor's circle works on CloudHub 2.0, and the documentation is high-level.
- Differences you can mention to show you're updated:
  - Workers are different (2.0 uses **replicas**).
  - The **VM** concept (covered later with JMS and queues) is **not supported** on CloudHub 2.0.
  - On 1.0 the smallest size is 0.1 vCore, so at most **10 applications per vCore**.
  - On 2.0 there's a smaller **0.05** vCore, so more applications fit per vCore.
- All the steps we do are basically the same; performance is better on 2.0.
- **Instructor's view:** Mule 3 vs. Mule 4 is a huge difference; CloudHub 1.0 vs. 2.0 is "nothing to worry about".

---

## 3. API Manager Statistics

- *Screen:* **API Administration** lists all APIs — policies-demo-app and policies-demo-api, both **Active** (instances 20128624 / 20129892).
- The API shows basic statistics from the previous day's tests:
  - Total requests: **27**.
  - Client applications: **2** (consumer-1 and consumer-2).
  - Error rate: **48%** — from the many unauthorized hits.

---

## 4. IP Allowlist

**Add policy:** API → Policies → Add policy → search "ip" → *screen:* **IP Allowlist** and **IP Blocklist**.

- **IP Allowlist** — only the listed IPs are allowed.
- **IP Blocklist** — the listed IPs are blocked.

### 4.1 Which IPs to allow

- In an enterprise, 100 developers don't share one IP — each has one, usually in a **range** (10.1.25.1, 10.1.25.2, … 10.1.25.100).
- A range is given with a slash — **CIDR** notation — so the whole range is allowed.
- There's no limit on how many entries; add more **rows** for more IPs or ranges.
- In practice you ask consumers for the IP range they'll call from and put it here.

*Screen — Configure IP Allowlist:*

```text
IP expression : #[attributes.headers['x-forwarded-for']]
IPs           : 10.1.25.45
```

### 4.2 Testing

1. Logs show the policy applied (`ip-allowlist`).
2. Basic auth was already disabled; Client ID Enforcement is still on, so Postman sends `client_id` / `client_secret` headers.
3. *Screen:* **403 Forbidden** — `The IP Address is invalid: 122.169.236.221` (the instructor's own IP).
4. **Edit configuration** → add `122.169.236.221` → *screen:* request allowed.

- Normally you'd find your IP with `ipconfig` or a similar command; here it was taken from the error.

### 4.3 How the IP is identified

- By default from the **`X-Forwarded-For`** header.
- Postman sends some headers automatically (hidden); you don't create them.
- Like the default headers you see in a Mule app's `attributes`, X-Forwarded-For arrives even if you send no headers.

### 4.4 Real-time usage

- **Instructor's experience:** used rarely in real time, but simple, and knowing it is an advantage.
- **Difficulty — cloud IPs change dynamically:**
  1. An app is deployed to a worker that gets an IP.
  2. The worker crashes; for availability, another worker is started and the app is deployed there.
  3. The new worker has a **different IP**.
  4. So a cloud-hosted consumer's IP can change, and the allowed IP no longer matches.
- There are ways to fix IPs in the cloud — a different subject.

**Instructor's experience (interview):** a candidate with ~6.5 years in integration had used only Client ID Enforcement and couldn't explain basic auth vs. client ID enforcement. To show depth, know at least the minimum of each policy.

---

## 5. IP Blocklist

1. Remove the allowlist — *screen:* "the policy was removed successfully".
2. Add **IP Blocklist** with the same IP expression and `122.169.236.221`.
3. Hit the request → *screen:* **403** `The IP Address is invalid: 122.169.236.221`.

---

## 6. JSON Threat Protection

### 6.1 Why

- The dummy app ignores the body, but normally a JSON body is sent.
- Someone could send **1,00,000 characters** instead of a name like "Suresh" — memory may not handle it.
- RAML can set min/max length, but that's checked in the app.
- Someone could send **one lakh extra properties** — `additionalProperties` defaults to **true**, so extras are accepted and the system may crash.
- JSON Threat Protection handles threats coming from outside / third parties.

**Q (student): Can't the APIkit Router do this?**

- The APIkit Router validates only after the request is **inside the application**.
- Between the Listener and the APIkit Router, memory is already allocated for attributes, payload etc.
- Something can happen in that time — the policy rejects it before it reaches the app.

### 6.2 Configuration

*Screen — Configure JSON Threat Protection:*

| Field | Meaning |
|---|---|
| Maximum container depth | Maximum nesting depth (objects/arrays inside objects) |
| Maximum string value length | Longest allowed string value |
| Maximum object entry name length | Longest allowed key name |
| Maximum object entry count | Number of entries (keys) in an object |
| Maximum array element count | Number of elements in an array |

- Defaults are **-1** — any negative number means **no limit**.
- Applying with defaults is the same as not applying it.
- It took a while to take effect — shared space (a private space would be faster).

### 6.3 Choosing values (as in class)

| Field | Value | Reason |
|---|---|---|
| Container depth | 1 | All fields were at the first level |
| String value length | 25 | Take the longest field (names ~25, designation ~30) |
| Entry name length | 20 | Key names are short |
| Entry count | 6 | The object had 6 entries |
| Array element count | 0 | No array in the request |

- If the request had a nested object (e.g. communication address), depth would be **2**.
- Setting 5 would let callers nest deeper and still pass — decide from your request's structure.

### 6.4 Testing

- *Screen:* nested `addresses` with depth 1 allowed → **400 Bad Request** `Container depth has been exceeded. Maximum allowed is: 1`.
- *Screen:* Runtime Manager logs filtered by error show the JSON threat protection errors (container depth / array element count exceeded).
- Removing the addresses (and fixing an extra bracket) → it works.
- An object containing an array = depth **2** (first level object, second level array) — so depth 1 rejects it; setting 2 allows it.

---

## 7. XML Threat Protection

*Screen — Configure XML Threat Protection:* terms differ slightly but map to the JSON ones.

| XML field | Like |
|---|---|
| Max node depth | Container depth |
| Max attribute count | Number of properties |
| Max child count | Number of children inside a node |
| Max text length | String value length |
| Max attribute length | Key length |
| Max comment length | Length of comments |

- JSON Threat Protection is for a JSON body; XML Threat Protection for an XML body.
- XML data format is discussed at the end of the course — try this policy then.

---

## 8. Rate Limiting

- Accepts requests up to a limit in a time frame.
- *Screen — Configure Rate Limiting:* **Identifier** (optional) and **Limits** — requests, time period, time unit.
- Class value: **3 requests per 1 minute** (easy to test).

| Request | Result |
|---|---|
| 1st–3rd within a minute | 200 |
| 4th | **429 Too Many Requests** — "Quota has been exceeded" |
| After one minute | Works again |

- Use it when you want to restrict the number of requests per time frame.

**Instructor's advice:** learn with the crowd, and learn 2-3 points extra — that puts you in the top 20% of a group of 100; the top 1-2% needs in-depth detail.

---

## 9. Rate Limiting SLA

- A combination of **client ID enforcement + rate limiting** in the background.
- Client ID and secret are sent exactly as before.
- It can't be applied alongside a separate **Client ID Enforcement** policy — the conflict is highlighted.

### 9.1 SLA tiers

API → **SLA Tiers** → **Add SLA Tier**:

| Tier | Limit | Approval |
|---|---|---|
| silver | 2 requests / 30 seconds | Manual (on screen), later automatic |
| gold | 3 requests / 30 seconds | Automatic |
| diamond | 5 requests / 30 seconds | Automatic |

- *Screen:* silver, gold, diamond — all **Active**.

### 9.2 Attaching a tier to a consumer

- A tier is chosen when **requesting access**, so an existing consumer needs a **new contract**.
- Cancel the old one: **Contracts → Revoke → Delete**.
  - **Q:** Do we usually have these permissions? **Instructor:** no — not even in his organization.
- **Exchange → Request access** → *screen:* API instance `v1:20129892`, application consumer-1, SLA tier **silver (2 requests / 30 s)**.
- With a **manual** tier, the contract must be approved in Contracts (in a company this might go to the team lead).
- *Screen:* Contracts — consumer-1 silver, consumer-2 gold, consumer-3 diamond — **Approved**.

### 9.3 Testing

| Consumer | Allowed | Then |
|---|---|---|
| consumer-1 (silver) | 2 | 3rd → **429** "Quota has been exceeded" |
| consumer-2 (gold) | 3 | 4th fails |
| diamond | 5 | 6th, 7th, 8th fail; after 30 s, 5 again |

- The limit applies **per consumer**, not overall.

**Instructor's view:** he doesn't ask this in interviews and it's not used much, but he'd suggest implementing it if given a free hand — teams usually take a reactive approach instead of preventive measures.

---

## 10. Order of Policies

- *Screen:* reorder with the **up/down arrows**; order of execution matters.
- Example: basic auth, then rate limiting → move rate limiting up.
- Logical order: **rate limiting → JSON threat protection → basic auth**.
- Don't apply too many policies — performance suffers; apply only what's required.

---

## 11. Spike Control

- These concepts are generic; MuleSoft just implements them as policies.
- Spike control is generally called **throttling**.
- In Spring Boot or TIBCO you'd need extra configuration/a security module; in MuleSoft it's configuration only.

### 11.1 Configuration

*Screen — Configure Spike Control:*

| Field | Default (screen) | Class value |
|---|---|---|
| Number of requests | 1 | 5 |
| Time period (ms) | 1000 | 10000 |
| Delay time (ms) | 1000 | 1000 |
| Delay attempts | — | 2 |
| Queuing limit | — | — |

- **Delay time:** keep it small (1 second) — in request-reply you must respond in the shortest time; never minutes.
- **Delay attempts:** 2 or 3; once used up, the request is rejected.
- **Queuing limit:** how many requests can wait in the queue; beyond it, requests are rejected.

### 11.2 How it works (sliding window)

Example: 5 requests per 30 seconds.

1. 5 requests arrive within the first 15 seconds (at different seconds).
2. 2 more arrive in the next 15 seconds.
3. Looking back 30 seconds, the quota is used, so they can't be processed immediately.
4. They go into the **queue**.
5. After the delay (1 s) the window slides; if quota is available, the request is processed.
6. If not, it waits another delay and checks again.
7. After the delay attempts (2) with no quota, it's rejected.

### 11.3 Testing

- *Screen:* extra requests wait and are retried → **200** "policy tested successfully".
- If the queue is full, the next request is rejected with Too Many Requests.

### 11.4 Rate limiting vs. spike control

| | Rate Limiting | Spike Control |
|---|---|---|
| Extra requests | Rejected straight away (429) | Queued and retried in the background |
| Rejected when | Over the limit | Queue full or delay attempts exhausted |

- Try both with the same window (e.g. 5 seconds) to see the difference.

---

## 12. Pending

- Basic auth and JSON threat protection were disabled at the end.
- Only the **HTTP caching** policy remains — it can wait.

---

## 13. Important Terminology

| Term | Meaning |
|---|---|
| IP Allowlist | Policy allowing only listed IPs/ranges |
| IP Blocklist | Policy blocking listed IPs/ranges |
| CIDR range | IP range given with a slash |
| X-Forwarded-For | Header the IP policies read the caller's IP from |
| JSON Threat Protection | Limits depth, lengths and counts in a JSON body |
| Container depth | Nesting level of objects/arrays |
| XML Threat Protection | Same idea for XML (node depth, attributes, children…) |
| Rate Limiting | Limits requests per time window; 429 when exceeded |
| SLA tier | Named limit (silver/gold/diamond) chosen per client application |
| Rate Limiting SLA | Client ID enforcement + rate limiting per SLA tier |
| Spike Control | Throttling — queues extra requests and retries them |
| Delay attempts / queuing limit | Retries before rejecting / requests allowed to wait |

---

## 14. Interview Questions

### Q1. IP Allowlist vs. IP Blocklist?
Allowlist lets only the listed IPs or ranges through; blocklist rejects the listed ones. Both read the caller's IP from `X-Forwarded-For` by default and return 403 when rejecting.

### Q2. Why is IP allowlisting tricky for cloud consumers?
Cloud workers get new IPs when they're replaced (e.g. after a crash), so a consumer's IP can change and stop matching the allowed list.

### Q3. Why use JSON Threat Protection if RAML already validates?
RAML/APIkit validation happens inside the app, after memory is allocated for the request. The policy rejects oversized or deeply nested bodies at the gateway, before they reach the app.

### Q4. What does -1 mean in JSON Threat Protection?
No limit. Applying the policy with all -1 defaults is the same as not applying it.

### Q5. What does Rate Limiting return when exceeded?
429 Too Many Requests — "Quota has been exceeded".

### Q6. Rate Limiting vs. Rate Limiting SLA?
Rate limiting applies one limit to everyone. SLA-based limiting attaches a tier (e.g. silver 2/30 s, gold 3/30 s) to each client application's contract, so limits are per consumer; it includes client ID enforcement.

### Q7. Rate Limiting vs. Spike Control?
Rate limiting rejects extra requests immediately. Spike control (throttling) queues them and retries after a delay for a set number of attempts, rejecting only if the queue is full or attempts run out.

### Q8. Does policy order matter?
Yes — policies run in the listed order; reorder with the arrows. A logical order is rate limiting, then threat protection, then authentication.

---

## 15. Must Remember

1. IP policies read `#[attributes.headers['x-forwarded-for']]`; rejection is **403**.
2. Use CIDR ranges and multiple rows for many IPs.
3. JSON threat protection defaults of **-1** = no limit.
4. Object containing an array = container depth **2**.
5. Threat protection rejects at the gateway with **400**, before memory is spent in the app.
6. Rate limiting over the limit → **429** "Quota has been exceeded".
7. Rate Limiting SLA can't coexist with a separate Client ID Enforcement policy.
8. To change a consumer's tier: revoke/delete the contract and request access again.
9. Spike control = throttling: queue + delay + attempts.
10. Apply only the policies you need, in a sensible order.
