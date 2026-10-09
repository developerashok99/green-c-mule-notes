# Day 53 — Watermarking with the Object Store

## Session Agenda
- Remaining modules for next week
- The use case — send only new DB employees to Salesforce
- Object Store **Retrieve** and **Store**
- Object Store configuration — persistent, max entries, **TTL**, **expiration interval**
- The **max(null)** error and the **Choice** fix

## The Watermark Flow
- Scheduler (every 5 min) → **Retrieve** `empWatermark` (default **99**, target variable) → Select `where emp_id > :emp_id` → process → **Store** `max(payload.emp_id)`.
- Storing under the same key overwrites the old watermark.
- The watermark column must be **sequential and incremental**.

## Object Store Configuration
- **Persistent** is the default; unchecked = transient.
- **Max entries** caps the number of entries.
- **Entry TTL** — how long a value is valid; **expiration interval** — how often expired values are deleted. Keep the interval less than the TTL.
- Defaults keep values "around 30 days" (instructor not sure).

## The Run
- The first run used **120**, not 99 — persisted from an earlier run, even after redeploying.
- 17 rows came back; **1009** was stored.
- Next run: no rows → **"You called the function 'max' with … Null"**.
- Fix: **Choice** `sizeOf(payload) > 0` → Store; default → log "no data". `isEmpty` is the better check.

## Quick Recap
- Retrieve → Select newer → Store max = watermarking.
- Persistent store keeps the watermark across redeploys.
- Guard `max()` against an empty payload.
- Homework: the access-token use case with a transient store.
