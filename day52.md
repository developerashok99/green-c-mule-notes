# Day 52 — The Object Store: Access Tokens, Watermarking, Transient vs. Persistent

## Session Agenda
- **What is the Object Store** and why not a database
- Use case 1 — storing an **access token**
- **Transient vs. persistent**
- Use case 2 — **watermarking** a DB → Salesforce scheduler sync

## The Object Store
- A Mule component for simple **key-value** storage — a generic concept.
- Database calls are costly; the object store suits temporary data.
- Main uses: **access tokens** and **watermarks**; the **Cache** module uses it internally.
- Available as **transient** or **persistent**.

## Access Token Use Case
- A 1-hour token: without a store, 25 requests make 25 token calls; with a store, one.
- A **variable** can't hold it — it dies when the request ends.
- On "invalid token": Try → On Error Continue → Flow Reference to the token sub-flow → store → retry.

## Transient vs. Persistent
- Transient = memory: fast, lost on restart/redeploy/crash.
- Persistent = disk: a bit slower, survives restarts.
- Token → **transient** (losing it costs one extra call).

## Watermarking Use Case
- Daily 8 am: send only new employees from the DB to Salesforce (re-inserting an ID fails).
- Retrieve watermark (default 99) → `select … where employee ID > watermark` → Salesforce Create → Store the max ID.
- 25 Jan: 100–104, store 104; 26 Jan: 105–108, store 108.
- Watermark → **persistent**; a transient store would reset to the default after a restart and create duplicates.

## Quick Recap
- Object Store = key-value storage for tokens and watermarks.
- Transient for tokens, persistent for watermarks.
- Demo in Studio on the next day.
