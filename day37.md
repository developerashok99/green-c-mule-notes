# Day 37 — IP Allowlist/Blocklist, Threat Protection, Rate Limiting, SLA Tiers and Spike Control

## Session Agenda
- A few CloudHub 1.0 vs. 2.0 differences
- **IP Allowlist** and **IP Blocklist**
- **JSON** and **XML Threat Protection**
- **Rate Limiting** and **Rate Limiting SLA** with SLA tiers
- Order of policies
- **Spike Control**

## CloudHub 1.0 vs. 2.0
- 2.0 uses replicas and offers 0.05 vCore, so more apps fit per vCore (1.0: max 10 per vCore).
- The VM concept isn't supported on CloudHub 2.0.
- The steps are basically the same.

## IP Allowlist / Blocklist
- The caller's IP comes from the **`X-Forwarded-For`** header (`#[attributes.headers['x-forwarded-for']]`).
- Give single IPs, **CIDR ranges**, or multiple rows.
- Rejected callers get **403** "The IP Address is invalid".
- Rarely used: cloud consumers' IPs change when workers are replaced.

## JSON / XML Threat Protection
- Limits container depth, string length, key length, entry count and array count (-1 = no limit).
- Rejects at the gateway with **400** (e.g. "Container depth has been exceeded") before the app spends memory — better than relying on APIkit validation.
- XML version: node depth, attribute count, child count, text, attribute and comment length.

## Rate Limiting and SLA
- **Rate Limiting:** e.g. 3 requests/minute; the 4th gets **429 Too Many Requests**.
- **SLA tiers:** silver 2/30 s, gold 3/30 s, diamond 5/30 s; chosen when requesting access.
- **Rate Limiting SLA** applies the tier's limit per consumer; it includes client ID enforcement.
- To change a consumer's tier, revoke/delete the contract and request access again.

## Policy Order
- Reorder with the arrows; e.g. rate limiting → threat protection → auth.
- Too many policies hurt performance.

## Spike Control
- Throttling: extra requests are **queued** and retried after a delay time, for a number of delay attempts.
- Rejected only if the queue is full or attempts run out.

## Quick Recap
- IP policies → 403; threat protection → 400; rate limiting → 429.
- Rate limiting rejects immediately; spike control waits and retries.
- SLA tiers give each consumer its own limit.
- Only the HTTP caching policy remains.
