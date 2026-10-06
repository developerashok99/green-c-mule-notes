# Day 37 — Slides and On-Screen Drawings

Screens from the Day 37 class (26 Dec 2024): applying and testing IP allowlist/blocklist, JSON and XML threat protection, rate limiting, rate limiting SLA tiers and spike control on policies-demo-api. Repeated and blank frames have been removed. Times are positions in the video.

Notes for this day: [detailed-notes/day37.md](../../detailed-notes/day37.md) · [super-detailed-notes/day37.md](../../super-detailed-notes/day37.md) · [summary](../../day37.md)

| # | Time | Content |
|---|---|---|
| 01 | 0:01 | API Administration: policies-demo-app and policies-demo-api Active (instances 20128624 / 20129892) |
| 02 | 5:38 | Add a policy → search "ip": IP Allowlist and IP Blocklist |
| 03 | 7:29 | Configure IP Allowlist: IP expression `#[attributes.headers['x-forwarded-for']]`, allowlist 10.1.25.45 |
| 04 | 12:31 | Postman (client_id / client_secret headers) → **403 Forbidden** "The IP Address is invalid: 122.169.236.221" |
| 05 | 12:38 | Allowlist updated with the caller's own IP 122.169.236.221 → request allowed |
| 06 | 15:17 | Remove policy (IP Allowlist) — "the policy was removed successfully" |
| 07 | 16:43 | Configure IP Blocklist: same IP expression, blocklist 122.169.236.221 |
| 08 | 19:26 | Blocked IP → 403 "The IP Address is invalid: 122.169.236.221" |
| 09 | 19:05 | Add a policy → JSON Threat Protection |
| 10 | 20:05 | Configure JSON Threat Protection: max container depth, string value length, object entry name length, entry count, array element count (-1 = no limit) |
| 11 | 35:16 | Nested `addresses` object with depth 1 allowed → **400 Bad Request** "Container depth has been exceeded. Maximum allowed is: 1" |
| 12 | 43:12 | Runtime Manager logs: JSON threat protection errors (container depth / array element count exceeded) |
| 13 | 46:03 | Configure XML Threat Protection: max node depth, attribute count, child count, text length, attribute length, comment length |
| 14 | 49:03 | Configure Rate Limiting: identifier (optional), limits — 3 requests per 1 time period |
| 15 | 56:40 | SLA Tiers → Add SLA Tier: silver, Manual approval, 2 requests / 30 seconds |
| 16 | 57:40 | SLA tiers: silver, gold, diamond — all Active, automatic approval |
| 17 | 57:59 | Exchange → Request access: API instance v1:20129892, application consumer-1, SLA tier silver (2 requests / 30 s) |
| 18 | 58:50 | Contracts → Revoke / Delete contract (to re-request access with an SLA tier) |
| 19 | 61:48 | Contracts: consumer-1 silver, consumer-2 gold, consumer-3 diamond — Approved |
| 20 | 62:05 | Over the tier's limit → **429 Too Many Requests** "Quota has been exceeded" |
| 21 | 67:48 | Reorder policies with the up/down arrows (order of execution matters) |
| 22 | 71:23 | Configure Spike Control: 1 request per 1000 ms, delay 1000 ms, delay attempts, queuing limit |
| 23 | 80:08 | Spike Control: 5 requests / 10000 ms, delay time 1000 ms, delay attempts 2 |
| 24 | 82:02 | With spike control the extra requests wait and are retried → 200 "policy tested successfully" |

---

### 01 — API Administration: policies-demo-app and policies-demo-api Active (instances 20128624 / 20129892)
![api-list](01-api-list.jpg)

### 02 — Add a policy → search "ip": IP Allowlist and IP Blocklist
![ip-policy-search](02-ip-policy-search.jpg)

### 03 — Configure IP Allowlist: IP expression `#[attributes.headers['x-forwarded-for']]`, allowlist 10.1.25.45
![ip-allowlist-config](03-ip-allowlist-config.jpg)

### 04 — Postman (client_id / client_secret headers) → **403 Forbidden** "The IP Address is invalid: 122.169.236.221"
![ip-allowlist-403](04-ip-allowlist-403.jpg)

### 05 — Allowlist updated with the caller's own IP 122.169.236.221 → request allowed
![ip-allowlist-own-ip](05-ip-allowlist-own-ip.jpg)

### 06 — Remove policy (IP Allowlist) — "the policy was removed successfully"
![remove-policy](06-remove-policy.jpg)

### 07 — Configure IP Blocklist: same IP expression, blocklist 122.169.236.221
![ip-blocklist-config](07-ip-blocklist-config.jpg)

### 08 — Blocked IP → 403 "The IP Address is invalid: 122.169.236.221"
![ip-blocklist-403](08-ip-blocklist-403.jpg)

### 09 — Add a policy → JSON Threat Protection
![json-threat-search](09-json-threat-search.jpg)

### 10 — Configure JSON Threat Protection: max container depth, string value length, object entry name length, entry count, array element count (-1 = no limit)
![json-threat-config](10-json-threat-config.jpg)

### 11 — Nested `addresses` object with depth 1 allowed → **400 Bad Request** "Container depth has been exceeded. Maximum allowed is: 1"
![json-depth-400](11-json-depth-400.jpg)

### 12 — Runtime Manager logs: JSON threat protection errors (container depth / array element count exceeded)
![json-threat-logs](12-json-threat-logs.jpg)

### 13 — Configure XML Threat Protection: max node depth, attribute count, child count, text length, attribute length, comment length
![xml-threat-config](13-xml-threat-config.jpg)

### 14 — Configure Rate Limiting: identifier (optional), limits — 3 requests per 1 time period
![rate-limiting-config](14-rate-limiting-config.jpg)

### 15 — SLA Tiers → Add SLA Tier: silver, Manual approval, 2 requests / 30 seconds
![add-sla-tier](15-add-sla-tier.jpg)

### 16 — SLA tiers: silver, gold, diamond — all Active, automatic approval
![sla-tiers-list](16-sla-tiers-list.jpg)

### 17 — Exchange → Request access: API instance v1:20129892, application consumer-1, SLA tier silver (2 requests / 30 s)
![request-access-sla](17-request-access-sla.jpg)

### 18 — Contracts → Revoke / Delete contract (to re-request access with an SLA tier)
![revoke-contract](18-revoke-contract.jpg)

### 19 — Contracts: consumer-1 silver, consumer-2 gold, consumer-3 diamond — Approved
![contracts-sla-applied](19-contracts-sla-applied.jpg)

### 20 — Over the tier's limit → **429 Too Many Requests** "Quota has been exceeded"
![sla-429](20-sla-429.jpg)

### 21 — Reorder policies with the up/down arrows (order of execution matters)
![reorder-policies](21-reorder-policies.jpg)

### 22 — Configure Spike Control: 1 request per 1000 ms, delay 1000 ms, delay attempts, queuing limit
![spike-control-config](22-spike-control-config.jpg)

### 23 — Spike Control: 5 requests / 10000 ms, delay time 1000 ms, delay attempts 2
![spike-control-values](23-spike-control-values.jpg)

### 24 — With spike control the extra requests wait and are retried → 200 "policy tested successfully"
![spike-control-200](24-spike-control-200.jpg)

