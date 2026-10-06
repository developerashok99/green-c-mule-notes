# Day 32 — Rate Limiting, Rate Limiting SLA, Spike Control, HTTP Caching, JSON Threat Protection, IP Allow/Block Lists (Theory)

> **Sources:** audio transcript, existing notes, and the class video (recorded 19 Dec 2024). Diagrams marked *drawing* are read from the instructor's "MULESOFT Policies.pptx" in the recording; this class was theory only. Slide images: [slides/day32](../slides/day32/).

## 1. Overview

This is a theory session on policies; applying them in API Manager is quick and comes in the practical sessions.

1. Recap: error codes from authentication policies (401 vs. 400)
2. **Rate Limiting** — fixed window algorithm, 429, when the window starts
3. **Rate Limiting SLA** — different limits per consumer tier
4. **Spike Control** — queue instead of reject; sliding window algorithm
5. **HTTP Caching** — PAN-verification and HR examples
6. **JSON Threat Protection** — gateway-level payload limits
7. **IP Allowlist / Blocklist**
8. Which policies are most used; homework

---

## 2. Recap — Error Codes From Authentication Policies

| Situation (as stated in class) | Response |
|---|---|
| Wrong username and/or password | **401 Unauthorized** |
| Username/password not sent at all (required field missing) | **400 Bad Request** |

**Why it matters:** knowing which error appears tells you what went wrong and where to look.

> **Technical clarification:** the exact status for **missing** credentials depends on the policy and its version. MuleSoft's Basic Authentication policy normally returns **401** when the `Authorization` header is missing too. Confirm with your own test instead of relying on one rule.

---

## 3. Rate Limiting Policy

### 3.1 Idea

> **Rate limiting** limits the **number of requests** an API accepts within a time window. Requests beyond the limit are **rejected immediately** (not queued).

**Why:** if traffic exceeds what the servers can handle, the app crashes ("WhatsApp is down", "Facebook crashed" — one common reason is more traffic than expected).

**Illustrative example:** server capacity is 100 requests/minute. Set the policy to **95 per minute**. In one window, requests 96, 97, 98… are rejected.

### 3.2 The error — 429

Rejected requests get **429 Too Many Requests**.

Why a **4xx** (client-side) code and not 5xx? Rate limiting is a **contract** between us and the consumers: "we have told you not to send more than this." Exceeding it is the client's problem; our application is fine.

### 3.3 Fixed window algorithm — when does the window start?

Rate limiting uses the **fixed window algorithm**.

```text
App (re)deployed at 10:05 ── no requests ──
First request at 10:06  →  window 1: 10:06–10:07  (95 allowed, rest → 429)
                           window 2: 10:07–10:08  (quota resets: 95 again)
                           window 3: 10:08–10:09  ...
```

- The window starts at the **first request**, not at a clock boundary and not at deploy time.
- *Drawing:* deploy at 10:00 am, first request at 10:10 am → windows 10:10–10:11, 10:11–10:12, 10:12–10:13…; limit 95/min (capacity 100); consumers C1/C2/C3 sending 30 + 40 + 10…; the 96th → "reject the request with **429** error — Too many requests".
- After a **redeploy/restart**, the window starts again from the first request after it.
- **Within a window:** if 95 arrive in the first 30 seconds, everything else in the remaining 30 seconds is rejected. The next window accepts 95 again.
- **Instructor's observation:** "99.99%" of people are unclear about where the window starts.

### 3.4 Per consumer or total?

Three consumers send 30 + 40 + 60 within one minute. The limit (95) is for **all consumers together** — the API's capacity is what's being protected. Whichever requests come after the 95th in that window are rejected, regardless of consumer.

**Rejected requests aren't processed or tracked by us** — the consumer must retry. If consumers complain a lot, increase capacity (workers) and raise the limit.

> **Technical clarification:** newer versions of the Rate Limiting policy can also group the count by a key (an identifier expression, e.g. a header). By default, as taught here, the limit applies to the API as a whole.

### 3.5 How is the limit decided?

Through **performance / load testing**:

**Illustrative example:** test at 500 requests/hour, then 1000, 2000 — fine up to 2000; beyond that the system (3 workers) crashes. That's the capacity; set the limit below it.

**Another scenario:** your API calls a third-party API that allows only 10,000 requests per minute/hour. Limit your API accordingly, so you don't send them 11,000. (*Drawing:* our API → **Okta API**, 10,000 req/hour.)

**Instructor's observation:** in real time the policy is used less, since CloudHub can scale to handle more requests. Applied mainly where a limit is compulsory or there's a risk of unexpected traffic.

### 3.6 Where is it enforced?

In **API Manager** — the **gateway** checks the limit and rejects **before** the request reaches the application.

Rate limiting is a **general API concept**, not MuleSoft-specific. Here we learn how MuleSoft implements it.

### 3.7 Why so much depth for a rarely used policy?

**Instructor's view:** interviews ask about policies. Saying "I only used basic authentication" in 3–5 years of experience won't look good. Know at least the minimum depth: fixed window, where the window starts, 429 when the quota is reached.

---

## 4. Real-World Correlations

- **Netflix / Prime Video / Aha:** free vs. premium accounts; premium level 1 = up to 5 devices (more → error), level 2 = unlimited.
- **Antivirus licences:** limited number of devices.

These tiered limits are the same idea — you meet the concept daily without knowing the name.

---

## 5. Rate Limiting SLA

### 5.1 The problem

You **commercialise** your API and offer membership levels — **silver, gold, diamond** — each with a different number of requests per minute. Plain rate limiting can't do this: its limit is one total for everyone.

### 5.2 The policy

> **Rate Limiting SLA** (SLA = **Service Level Agreement**) applies **different limits per consumer**, based on the consumer's **SLA tier**.

**Illustrative example** (deliberately tiny numbers):

| Tier | Limit |
|---|---|
| Silver | 1 request/minute |
| Gold | 2 requests/minute |
| Diamond | 5 requests/minute |

A gold member can send 2 per minute; the 3rd gets **429**.

*Drawing (second example):* API limit 100/min — **Gold** C1 50 req/min, **Silver** C2 25 req/min, **Bronze** C3 10 req/min; "Rate Limiting SLA → RL + CID" (rate limiting plus client ID).

**How consumers are told apart:** like **client ID enforcement** — each consumer has its own client ID/secret. You create **SLA tiers** in API Manager, consumers are linked to a tier, and the SLA-based policy refers to them. (Practical shown later.)

### 5.3 Difference (interview)

| Rate Limiting | Rate Limiting SLA |
|---|---|
| One limit for the **whole API** | Limit **per consumer / client** (per SLA tier) |
| Counts requests from **all consumers together** and rejects regardless of consumer | Rejects only the consumer who exceeded **their** limit (429) |

**Instructor's experience:** never implemented Rate Limiting SLA in real projects — but interviews ask about it.

---

## 6. Spike Control

### 6.1 Idea

> **Spike Control** also enforces a limit, but requests beyond the limit are **queued**, not rejected immediately. When capacity frees up, queued requests are processed.

- Some people call it **throttling** (generic term); in MuleSoft it's **Spike Control**.
- Queuing happens in the background — nothing manual.

**Rate limiting vs. spike control:** rate limiting rejects extra requests; spike control keeps them in a queue and processes them later.

### 6.2 The trade-off — response time

APIs follow the **request–reply** pattern: the consumer waits for the response. A queued request gets a **delayed** response.

**Question in class:** can the window be 30 minutes, or 100 requests per 5 minutes with the queue waiting 3–4 minutes? **No** — making the consumer wait minutes is bad user experience. Spike control is designed for **short time frames** (seconds). Plan to respond within about **5–10 seconds**; if it takes longer, the request times out and is rejected.

> **Technical clarification:** in MuleSoft's Spike Control policy you configure the number of requests per time period, plus a **delay between attempts** and **number of attempts** (and a queue size). A request that still can't be processed after the attempts is rejected with **429**.

### 6.3 Sliding window algorithm

Spike control uses the **sliding window algorithm**.

- **Fixed window:** fixed blocks — 10:01–10:02, 10:02–10:03…
- **Sliding window:** at each new request, look **back** over the configured duration from **that moment** and count requests in that range. The window moves with time.

*Drawing:* "Spike control (Throttling) — 5 reqs / 5 sec"; requests numbered along a timeline (10:01 … 10:05 … 10:16) with the window sliding; "Rate limiting → fixed window (10:00 to 11:00, 1000 reqs/hour)" vs "Spike control → sliding window algorithm". Another drawing: 7 requests against 5 req / 5 sec — 2 wait, retried; still over → 429.

**Illustrative example** (limit 5 requests per 5 minutes):

```text
Requests at 10:00:10, 10:00:40, 10:01:20, 10:02:00, 10:04:30   (5 used)
6th request at 10:05:20
  Fixed window (10:00–10:05 / 10:05–10:10): new window → allowed, but
      a burst right at a boundary can let 2× the limit in a short time
  Sliding window: look back 10:00:20–10:05:20 → 4 requests in range
      (10:00:10 has dropped out) → 1 slot available → allowed
```

**Advantage stated:** capacity frees continuously as old requests leave the window, so more requests can be handled in less time; combined with the queue, extra requests are absorbed instead of rejected.

---

## 7. HTTP Caching Policy

### 7.1 Idea

> **Caching** stores a response temporarily (in a **cache** — temporary memory). If the same request comes again within the cache period, the stored response is returned without processing again.

```text
1st request (PAN X) ──► API ──► third-party PAN service (₹10) ──► save in cache ──► response
2nd request (PAN X) ──► API ──► found in cache ──────────────────────────────────► response
… until the cache expires; then the next request is processed fully again
```

### 7.2 Example 1 — PAN verification (third-party cost)

- PAN numbers are verified via an API from an organisation such as NSDL (like UIDAI for Aadhaar), under a paid agreement — e.g. **₹10 per call**.
- A bank receives loan applications; one step is PAN verification (genuine? active?).
- The same person applies for a two-wheeler loan, a home loan, and another loan on the **same day** → 3 calls → ₹30, though the PAN details don't change within a day.
- With caching: one call, ₹10; the next two are served from cache.

### 7.3 Example 2 — HR resignations

- HR1 asks: employees who resigned in November (25). HR2 asks the same list. The data doesn't change quickly → serve from cache.
- *Drawing:* HR1/HR2/HR3 → API → HR DB; Nov → 25, Oct → 50, Dec → 10+ (the current month keeps changing, so it must not be served from an old cache).

### 7.4 Cache duration

Keep it short. **15 days** → thousands of different responses stored → cache memory under pressure. Typically **1–2 days** (based on the data).

**When to use:** frequently requested data that **doesn't change often**.

**Instructor's observation:** asked mainly for 5–8 years of experience; below 5 years, interviews focus on rate limiting, spike control, OAuth, basic auth, client ID.

---

## 8. JSON Threat Protection

### 8.1 Problem

The body is validated by the RAML/APIkit Router (e.g., a field is `string`). But how big a string? What if a consumer sends a **huge** message — e.g. **1 lakh (100,000) properties** instead of 5 (`additionalProperties` is `true` by default)? The API may run out of memory and crash, again and again.

### 8.2 The policy

> **JSON Threat Protection** sets limits on the JSON structure — e.g. max **properties per object**, max **array size**, max **string length**, max **nesting depth** — and rejects violating requests **at the gateway**.

### 8.3 Why not just RAML?

```text
Without policy:  Request ─► Listener ─► APIkit Router (RAML validation) ─► reject
                             (already inside the app, memory used)
With policy:     Request ─► GATEWAY (JSON Threat Protection) ─► reject
                             (never enters the app)
```

RAML validation happens **after** the request enters the application. The policy rejects it **before** — more secure; protects vulnerable APIs from attacks.

**Instructor's preference:** "If someone gives me a free hand, I love to use this." Two or three examples will be shown in practice. (An **XML Threat Protection** policy does the same for XML.)

---

## 9. IP Allowlist and Blocklist

| Policy | Behaviour |
|---|---|
| **IP allowlist** (whitelist) | Accept requests **only** from listed IPs |
| **IP blocklist** (blacklist) | Reject requests from listed IPs; accept others |

**Illustrative example:** allowlist `10.1.25.1`, `10.1.25.2`, `10.1.25.3`. A request from `10.1.25.50` → not in the list → the gateway rejects it.

*Drawing:* **API IPW** (allowlist) — `10.1.25.1`, `10.1.25.2`, `10.1.25.3` allowed; a request from `10.1.25.25` is rejected. **API IPB** (blocklist) — `10.1.25.100`, `.101`, `.102` blocked; requests from those three are rejected, every other address is accepted.

> **Transcript unclear:** the rest of the spoken explanation is lost in a speech-to-text repetition loop; the drawing above is what was shown.

---

## 10. Which Policies Are Most Used

**Instructor's observation:**

- About 8–9 policies are regularly used in the market; most common: **Basic Auth, Client ID Enforcement, Rate Limiting, Spike Control, OAuth**.
- **Experience layer:** OAuth (mostly compulsory).
- **Internal communication** (process/system): Client ID Enforcement or Basic Auth.

Applying these takes minutes — that's why the theory was covered first.

**Next:** OAuth needs a full ~1.5-hour session; then policies are applied practically.

**Homework:** deploy the application and keep it ready for the next session.

---

## 11. Important Terminology

| Term | Meaning |
|---|---|
| Rate Limiting | Limit requests per window; reject extra |
| Fixed window | Window starting at first request, fixed blocks |
| 429 Too Many Requests | Limit exceeded |
| SLA | Service Level Agreement |
| SLA tier | Consumer level with its own limit |
| Rate Limiting SLA | Per-consumer limits by tier |
| Spike Control | Limit with queue for extra requests |
| Throttling | Generic name for controlling request rate |
| Sliding window | Window looking back from each request |
| HTTP Caching | Store responses temporarily and reuse |
| JSON Threat Protection | Limits on JSON structure at the gateway |
| IP allowlist / blocklist | Accept only / reject listed IPs |

---

## 12. Interview Questions

### Q1. What does the Rate Limiting policy do and which algorithm does it use?
Limits requests per time window; extra requests are rejected with 429. It uses a fixed window that starts with the first request (and restarts after redeploy).

### Q2. Why is 429 a 4xx error?
Because the limit is a contract with the consumer; exceeding it is a client-side issue.

### Q3. Is the rate limit per consumer?
No — by default it counts requests from all consumers together.

### Q4. Rate Limiting vs. Rate Limiting SLA?
Rate limiting: one limit for the whole API. Rate Limiting SLA: different limits per consumer, based on SLA tiers linked to client IDs.

### Q5. Rate Limiting vs. Spike Control?
Rate limiting rejects extra requests (fixed window). Spike control queues them and retries (sliding window), only for short durations.

### Q6. Why keep spike control time frames short?
APIs are request–reply; consumers waiting minutes is bad experience and leads to timeouts.

### Q7. Explain the sliding window algorithm.
For each request, count requests in the configured period backward from now; the window moves with time.

### Q8. When would you use HTTP Caching?
For frequently requested, rarely changing data — e.g. a paid PAN-verification call repeated on the same day.

### Q9. Why JSON Threat Protection if RAML validates the body?
RAML validation runs inside the application; the policy rejects oversized/malicious JSON at the gateway before it enters.

### Q10. IP allowlist vs. blocklist?
Allowlist accepts only listed IPs; blocklist rejects listed IPs.

### Q11. Which policies are most common and where?
Basic auth, client ID enforcement, rate limiting, spike control, OAuth; OAuth for experience APIs, client ID/basic auth internally.

---

## 13. Must Remember

1. **Rate limiting** = reject beyond limit → **429**; **fixed window** starting at the **first request**.
2. The limit is for **all consumers combined**; decided by **load testing**.
3. **Rate Limiting SLA** = per-consumer tiers (silver/gold/diamond), based on client IDs.
4. **Spike control** = **queue**, **sliding window**, **short** time frames (seconds).
5. Spike control is also called **throttling**.
6. **HTTP caching**: same request → cached response; cache for **1–2 days**, not long.
7. **JSON Threat Protection** blocks oversized JSON **at the gateway**, before the app.
8. **IP allowlist** = only these; **blocklist** = not these.
9. Most used: **Basic Auth, Client ID, Rate Limiting, Spike Control, OAuth**.
10. Know each policy's depth — interviews test it.
