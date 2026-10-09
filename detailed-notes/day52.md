# Day 52 — Detailed Notes: The Object Store — Access Tokens, Watermarking, Transient vs. Persistent

> **Watch alongside:**
> - A short theory session. The whole idea fits in two use cases: cache a 1-hour access token so 25 requests make one token call, and remember the last processed employee ID so each daily run picks up only new rows.
> - The key decision is storage type — transient for the token, persistent for the watermark — and the reasoning is "what does it cost me if this value disappears on restart?"

> **Video-verified:** written from the cleaned transcript and the class recording (22 Jan 2025). Slide images: [slides/day52](../slides/day52/) — [what is Object Store](../slides/day52/01-what-is-object-store.jpg) and the drawings.

---

## 1. What It Is

```mermaid
flowchart LR
    OS["Object Store<br/>key → value"] --> T["Temporary data<br/>access tokens"]
    OS --> W["Sync info<br/>watermarks"]
    OS --> C["Used by the Cache module<br/>(HTTP caching)"]
    DB["Database"] -.->|"costly call — for permanent data"| X["Not for temporary info"]
```

- A generic concept; MuleSoft provides it as a component.

---

## 2. Use Case 1 — Access Token

```mermaid
sequenceDiagram
    participant C as Client
    participant M as Our API
    participant OS as Object Store
    participant TS as Token server
    participant API as Protected API
    C->>M: Request 1
    M->>OS: Retrieve token
    OS-->>M: none
    M->>TS: Get token (valid 1 h)
    M->>OS: Store token
    M->>API: Call with token
    C->>M: Requests 2 … 25
    M->>OS: Retrieve token
    OS-->>M: token
    M->>API: Call directly (no token call)
```

- A **variable** won't do — it dies when its request ends.
- **Expiry:** "invalid token" → Try / **On Error Continue** → Flow Reference to the token sub-flow → store → retry.

---

## 3. Transient vs. Persistent

```mermaid
flowchart TB
    Tr["Transient<br/>memory · fast · lost on restart"] --> Tok["Access token<br/>loss = one extra token call"]
    Pe["Persistent<br/>disk · slower · survives restart/crash"] --> Wm["Watermark<br/>loss = reprocess all + duplicates"]
```

*"If it's persistent, from disk space; if transient, from memory. Since it's in memory... fast."*

---

## 4. Use Case 2 — Watermarking

```mermaid
flowchart LR
    S["Scheduler 8 am"] --> R["Retrieve watermark<br/>(default 99)"]
    R --> Q["Select … where employee ID > watermark"]
    Q --> SF["Salesforce Create"]
    SF --> St["Store max(employee ID)"]
```

| Day | Watermark | Picks up | Stores |
|---|---|---|---|
| 25 Jan | 99 (default) | 100–104 | 104 |
| 26 Jan | 104 | 105–108 | 108 |
| 27 Jan | 108 | 109–111 | 111 |

- Re-inserting an existing ID fails (unique primary key) — so only new rows must go.
- Transient here: a 10 pm restart resets to 99 → **duplicates**. So **persistent**.

---

## Quick Recap
- The **Object Store** is key-value storage for temporary/sync data; cheaper than a database call.
- **Access token:** store once, reuse for its validity; handle expiry with Try → On Error Continue → regenerate.
- Variables live for one request only — they can't share a token.
- **Transient** = memory (fast, lost on restart); **persistent** = disk (slower, kept).
- **Watermarking:** Retrieve (default) → Select `> watermark` → Create → Store max.
- Token → **transient**; watermark → **persistent**.
- Cache and HTTP caching use an object store underneath.
