# Day 37 — Detailed Notes: IP Allowlist/Blocklist, Threat Protection, Rate Limiting, SLA Tiers and Spike Control

> **Watch alongside:**
> - Once the first two policies work, the rest go fast — each one is "Add policy → configure → hit it from Postman".
> - Focus on the difference between **rate limiting** (reject now) and **spike control** (queue and retry), and on why threat protection belongs at the gateway rather than in APIkit.

> **Video-verified:** written from the cleaned transcript and the class recording (26 Dec 2024). Slide images: [slides/day37](../slides/day37/).

---

## 1. IP Allowlist and Blocklist

![IP Allowlist configuration](../slides/day37/03-ip-allowlist-config.jpg)

```mermaid
flowchart LR
    PM["Postman"] -->|"X-Forwarded-For"| GW["Gateway: IP policy"]
    GW -->|"IP in allowlist /<br/>not in blocklist"| App["policies-demo-api → 200"]
    GW -->|"otherwise"| R["403 The IP Address is invalid"]
```

- IP expression: `#[attributes.headers['x-forwarded-for']]` — a default header sent even when you add none.
- Give a single IP, a **CIDR range** (with a slash), or more rows.
- *Screen:* allowlist `10.1.25.45` → **403** "The IP Address is invalid: 122.169.236.221"; adding `122.169.236.221` fixed it.
- Blocklist with the same IP → **403**.
- **Instructor's experience:** rarely used — cloud workers get new IPs when replaced, so a consumer's IP can change.

---

## 2. JSON Threat Protection

![JSON Threat Protection configuration](../slides/day37/10-json-threat-config.jpg)

```mermaid
flowchart LR
    Req["Huge or deeply nested JSON"] --> GW["Gateway: JSON Threat Protection"]
    GW -->|"within limits"| L["Listener → APIkit Router → flow"]
    GW -->|"over a limit"| R["400 Container depth has been exceeded"]
```

| Field | Class value |
|---|---|
| Max container depth | 1 (object + array = 2) |
| Max string value length | 25 |
| Max object entry name length | 20 |
| Max object entry count | 6 |
| Max array element count | 0 |

- Defaults are **-1** = no limit.
- *"Between the Listener and the APIkit Router, memory is allocated for attributes, payload... Something can happen in that time."* — why the gateway is better than RAML validation for this.
- **XML Threat Protection** has the equivalents: node depth, attribute count, child count, text length, attribute length, comment length.

![400 Container depth exceeded](../slides/day37/11-json-depth-400.jpg)

---

## 3. Rate Limiting and Rate Limiting SLA

```mermaid
flowchart TB
    T["SLA Tiers<br/>silver 2/30 s · gold 3/30 s · diamond 5/30 s"] --> RA["Exchange → Request access<br/>pick application + tier"]
    RA --> C["Contract (approve if tier is Manual)"]
    C --> P["Rate Limiting SLA policy<br/>(client ID + limit per consumer)"]
    P -->|"over the tier's limit"| E["429 Quota has been exceeded"]
```

- **Rate Limiting:** 3 requests per 1 minute → 4th gives **429 Too Many Requests**; after a minute it works again.
- **Rate Limiting SLA:** limits are **per consumer**; can't be combined with a separate Client ID Enforcement policy.
- Changing an existing consumer's tier = **Revoke → Delete** contract, then request access again.

![Contracts with SLA tiers](../slides/day37/19-contracts-sla-applied.jpg)

---

## 4. Policy Order

- Reorder with the up/down arrows — policies run top to bottom.
- Logical order: rate limiting → JSON threat protection → basic auth.
- Too many policies hurt performance.

---

## 5. Spike Control (Throttling)

![Spike Control values](../slides/day37/23-spike-control-values.jpg)

```mermaid
flowchart TB
    In["Request arrives"] --> Q{"Quota left in<br/>sliding window?"}
    Q -->|"yes"| OK["Process → 200"]
    Q -->|"no"| QL{"Queue full?"}
    QL -->|"yes"| Rej["Reject: Too Many Requests"]
    QL -->|"no"| W["Wait delay time (1000 ms)"]
    W --> A{"Attempts left?<br/>(delay attempts = 2)"}
    A -->|"yes"| Q
    A -->|"no"| Rej
```

- Class values: **5 requests / 10000 ms**, delay time 1000 ms, delay attempts 2.
- Keep the delay small — request-reply must respond quickly.

| | Rate Limiting | Spike Control |
|---|---|---|
| Extra requests | Rejected immediately | Queued, retried |
| Result in class | 429 | 200 after waiting |

---

## Quick Recap
- IP policies read `X-Forwarded-For`; allowlist lets only listed IPs/ranges through, blocklist rejects listed ones — both give **403**.
- JSON/XML Threat Protection caps depth, lengths and counts at the gateway (-1 = no limit); exceeding gives **400**.
- Rate Limiting rejects over-limit requests with **429**.
- Rate Limiting SLA = client ID + per-consumer limits from **SLA tiers** chosen at request-access time.
- Policy order matters; apply only what you need.
- Spike Control queues extra requests and retries them after a delay; only the HTTP caching policy is left.
