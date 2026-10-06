# Day 13 — Reconnection Strategy, Response Validator and Where HTTPS Is Used

> **Sources:**
> - Audio transcript, existing notes, and the class video (recorded 21 Nov 2024).
> - Drawings and Studio screens marked *drawing* or *screen* are read from the recording.
> - Slide images: [slides/day13](../slides/day13/).

## 1. Overview

Day 12 covered target variable and response timeout. This session completes the HTTP Request best practices:

1. Recap: target variable, response timeout and reconnection exist on many connectors
2. **Reconnection strategy** — why, how it works, Standard / None / Forever
3. When **Forever** is acceptable — source-side connectors (Salesforce "On New Object")
4. Aside: how real APIs handle many concurrent requests (instances, servers, load balancer)
5. **Response validator** — success / failure status code validators
6. HTTP vs. HTTPS between API-led layers

*Drawing — response timeout recap:* Req → Listener → Log → **HTTP Req** → TM → Log; the weather API responds in ~100 ms; "500 ms — Response Timeout"; **default — 10000 ms — 10 secs**; HTTP Timeout error. Beside it: **Connector config → RT → default**; 1st HTTP Req → 800 ms, 2nd HTTP Req → 500 ms (operation-level overrides); and "RS — try for 3 times with a gap of 1000 ms".

> - Target variable and reconnection strategy are **common to most connectors** (Salesforce, Database, HTTP…).
> - Learn them once; apply everywhere.
> - The response validator is specific to HTTP Request.

---

## 2. Reconnection Strategy

### 2.1 The problem

- Our weather API calls OpenWeatherMap with an HTTP Request.
- That call travels over a **network** (private or internet).
- Networks can have small **glitches** — a few milliseconds without connectivity.

**Mobile signal analogy:**
- When the signal drops, the phone reconnects automatically in milliseconds.
- Imagine having to restart the phone every time the signal blinks.
- Automatic retry is clearly better.

### 2.2 Without a reconnection strategy

```text
Request ──► connectivity error ──► error response immediately
```

Even if the next attempt a moment later would have succeeded, the error goes straight back.

Two kinds of problems:

| Problem | Example | Can retries help? |
|---|---|---|
| Long outage | Network down for half an hour | No — nothing can be done |
| **Intermittent glitch** | A few milliseconds of failure, frequently | **Yes** — this is what reconnection strategy is for |

### 2.3 With a reconnection strategy

**Configuration:** if a connectivity error occurs, retry **3 times, every 2,000 ms**.

```text
Attempt 1 (normal attempt)   ✘ connectivity error
   wait 2 s
Reconnect 1                  ✘
   wait 2 s
Reconnect 2                  ✘
   wait 2 s
Reconnect 3                  ✔ connected → response processed normally, no error
```

If every reconnection attempt fails, the error is raised.

> The first, normal attempt is not counted. "3 reconnection attempts" means 1 normal + 3 retries.

**Cost:** a response that normally takes 150 ms takes about 4+ seconds if two 2-second retries were needed. Acceptable in exchange for not failing on small glitches.

**Instructor's view:** using a reconnection strategy is a **mandatory best practice** in real projects. It applies to any connector that connects to another system over a network — HTTP Request, Database, Salesforce.

*Drawing:* Req → API → … → HTTP request ✗ (network → internet) → weather API; **HTTP Connectivity Error**. "General: ① connectivity error ② ″ ③ connectivity ✓ (response) ④ ″ → error"; **Reconnection Strategy → 2000 ms, 3 times**; RC: ① Standard ② None ③ Forever; normal response time 150 ms.

### 2.4 Options

| Strategy | Behaviour |
|---|---|
| **None** | No reconnection (same as not configuring it) |
| **Standard** | Retry a fixed number of times at a fixed interval. Configure **frequency (ms)** and **reconnection attempts**. Studio default: **2,000 ms, 2 attempts**. **Instructor's recommendation:** 2,000 ms × 3 — finalise values with the team |
| **Forever** | Keep retrying at the given frequency **until** it connects |

Frequency is in **milliseconds**.

### 2.5 Why Forever is wrong in a request–response flow

- A consumer is waiting for our API's response.
- If the network is down for half an hour, "Forever" keeps retrying for half an hour while the consumer waits.
- Use **Standard** in the middle of a request–response flow, so it eventually returns an error.

### 2.6 When Forever is acceptable — source connectors

Some connectors are **sources** that pull data automatically, without any consumer waiting.

**Example — Salesforce:**

- Salesforce stores data in **objects** (like tables in a database), e.g. a **Customer** object.
- **Requirement:** whenever a new customer is inserted (or updated), process it — e.g. insert it into a database.
- The Salesforce connector has source operations **On New Object** and **On Modified Object**. They go in the **Source** section (they won't work in Process).
- On New Object connects to Salesforce, checks for new records periodically, picks them up and starts the flow.

```text
Source: Salesforce — On New Object (Customer)   ← reconnection: Forever is OK
Process: Transform Message → Database Insert   ← reconnection: Standard
```

If the network fails, nobody is waiting for a response, so retrying **forever** (e.g. every 2,000 ms until connected) harms no one. **Instructor's observation:** Forever is used at such source endpoints; in normal request–response processing it isn't.

On New Object / On Modified Object are operations of the Salesforce connector that act as **source (inbound) endpoints**.

### 2.7 Where to configure it

Two places (same pattern as response timeout):

| Level | Location | Applies to |
|---|---|---|
| Connector configuration | Global element → **Connection** → Reconnection → "Use reconnection"? strategy | All operations using that configuration |
| Operation | HTTP Request → **Advanced** → Reconnection strategy | Only that operation |

**Example:** one Salesforce configuration used by both an On Modified Object source (Forever) and a Create operation in Process (Standard) — set them at **operation** level because they need different strategies.

If you know a setting exists but can't remember where, check the operation's tabs and the connector configuration.

---

## 3. Aside — How Real APIs Handle Many Requests

### 3.1 Concurrency

Testing in Postman, we send one request, wait, then send the next. Production doesn't work like that.

- An API has a **capacity** — it can process many requests at the same time (e.g. 10, 50, 100, 500) by creating **instances**.
- Requests beyond capacity are **rejected** with an error.
- The same code (including the reconnection strategy) runs for each request **independently**. A request whose first attempt succeeds never uses reconnection; another request hitting a glitch at that moment retries on its own.

### 3.2 Scaling across servers

**Illustrative example (Swiggy):** 1 lakh people across India order food at the same time. Processing one by one, the last person waits too long.

```text
              ┌──► Server 1 (≈5,000 requests/min)
Users ──► Load Balancer ──► Server 2
              ├──► …
              └──► Server 30–40
```

- The application is deployed on **many servers**; a **load balancer** sends each request to a server with free capacity.
- **Why not one big server?** If it goes down, the entire application stops. Multiple servers also give reliability.

---

## 4. Response Validator

### 4.1 Default behaviour

Without any configuration, after an HTTP Request:

| Status code | Treated as |
|---|---|
| 2xx | **Success** — flow continues to the next component |
| 3xx, 4xx, 5xx | **Error** — e.g. 3xx redirection, 400 bad request, 500 server error |

### 4.2 Changing what counts as success

HTTP Request → **Response** section → **Response validator**:

| Validator | Meaning |
|---|---|
| **Success status code validator** | Codes listed are treated as **success**; others as failure |
| **Failure status code validator** | Codes listed are treated as **failure**; others as success |

**Value syntax:**

```text
200,404          → 200 and 404 are success
200..299,404     → ranges use two dots
400..499         → the whole 4xx range
```

Also available at connector configuration level.

**When?** Rarely — only when a business requirement says a non-2xx response should be treated as normal. When that happens, use this option.

*Drawing:* REST service ↔ HTTP Request inside the flow; **200 → series — success; 400 → client-side error; 500 → server-side error**; "Success status code validator → 200 (201, 205, 206)" — anything else listed as an error.

### 4.3 Demonstration

1. Without a validator: a valid city → status code **200** (seen in the debugger).
2. A wrong city name → OpenWeatherMap returns **404 Not Found** → treated as an error.
3. Configured Request → **Response** → Response validator **Success status code validator**, Values **`200,400`** (*screen*, 49:05).
4. Sent a wrong city (`{"city": "M"}`) → still **`HTTP:NOT_FOUND`**: "HTTP GET on resource 'http://api.openweathermap.org:80/data/2.5/weather' failed: not found (404)." (*screen*, 53:52) — `200,400` lists only 200 and 400, not 404.
5. With the validator widened to the 4xx range (the audio says "let's give 400 to 499", i.e. `200,400..499`), the 404 was treated as **success** and the flow continued. The Transform Message then failed with "You called the function '-' with these arguments: Null, Number (273.15)" (*screen*, 56:38), because a 404 body has no `main` — a separate, expected issue.

Practise with both validators and different status codes.

---

## 5. HTTP or HTTPS Between Layers?

So far our APIs (Listeners) are **HTTP**, while OpenWeatherMap is **HTTPS**. Consuming an HTTPS service sometimes needs extra settings — **trust store** and **key store** — covered in a separate HTTPS session.

### Scenario

```text
External consumer (internet)
        │  HTTPS
        ▼
┌─── Organisation network ──────────────────────────────┐
│ Experience API ──HTTP──► Process API ──HTTP──► System API │
└────────────────────────────────────────────────────────┘
```

**Instructor's example:**
- The Experience API is exposed to the outside world, so it uses **HTTPS**.
- Experience → Process and Process → System are inside the enterprise network and use **HTTP** in this scenario.
- That is why both HTTP and HTTPS appear in real projects.

> **Technical clarification:** this is a common setup, not a rule. As noted on Day 06, many organisations (especially regulated ones) use HTTPS for internal calls too.

### Why HTTPS (recap)

- A request with a name and a credit-card number sent over HTTP travels as plain text — anyone sniffing the internet can read it.
- With HTTPS it is encrypted; without the key/algorithm the sniffer cannot decrypt it.
- HTTPS secures data **only while travelling** from consumer to API.
- APIs also have other security (username/password, policies).

---

## 6. Important Terminology

| Term | Meaning |
|---|---|
| Connectivity error | Failure to connect to the target system |
| Reconnection strategy | Automatic retries on connectivity errors |
| Standard / None / Forever | Fixed retries / no retries / retry until connected |
| Frequency | Wait between reconnection attempts (ms) |
| Reconnection attempts | Number of retries after the first attempt |
| On New Object / On Modified Object | Salesforce source operations that trigger on new/changed records |
| Instance | A parallel processing unit of an API handling a request |
| Load balancer | Distributes requests across servers |
| Response validator | HTTP Request setting for which status codes are success/failure |
| Success / failure status code validator | List of codes treated as success / failure |
| Trust store / key store | Certificate stores used for HTTPS (later) |

---

## 7. Interview Questions

### Q1. What is a reconnection strategy and why use it?
It automatically retries a connector's connection when a connectivity error occurs, so brief network glitches don't fail requests. It is a recommended best practice on connectors that connect over a network.

### Q2. What are the reconnection strategy options?
None, Standard (fixed number of attempts at a fixed frequency — default 2,000 ms × 2), and Forever (retry until connected).

### Q3. When would you use Forever?
For source connectors that poll or listen to a system without a waiting consumer — e.g. Salesforce On New Object. Not in request–response flows, where a caller is waiting.

### Q4. With Standard, 2,000 ms and 3 attempts, how many total tries happen?
One normal attempt plus three reconnection attempts — four in total — with 2-second gaps.

### Q5. Where can reconnection strategy be configured?
At the connector configuration (applies to all operations) or at the operation level (Advanced tab).

### Q6. By default, which status codes does HTTP Request treat as success?
2xx. Anything else raises an error.

### Q7. How do you treat a 404 as success?
Configure the success status code validator in the Response section, e.g. `200,404` (ranges use `..`, e.g. `200..299`).

### Q8. Do all API-led layers need HTTPS?
Typically the externally exposed Experience API uses HTTPS; internal calls may use HTTP depending on the organisation's security policy.

---

## 8. Must Remember

1. Target variable, response timeout and reconnection appear on many connectors; learn once.
2. **Reconnection strategy** retries on **connectivity errors** — handles short glitches, not long outages.
3. **Standard** = N attempts every X ms (Studio default 2,000 ms × 2; instructor suggests × 3); first attempt not counted.
4. **None** = no retry; **Forever** = until connected.
5. Use **Standard** in request–response flows; **Forever** only on source connectors (e.g. Salesforce On New Object).
6. Configure at **connector** level (shared) or **operation** level (specific).
7. Production APIs process requests **concurrently**; scaled across servers behind a **load balancer**.
8. HTTP Request default: **2xx = success**, others = error.
9. **Response validator**: success/failure status code lists, e.g. `200,404`, `400..499`.
10. Experience API (external) → HTTPS; internal layers often HTTP; HTTPS needs trust/key stores (later).
