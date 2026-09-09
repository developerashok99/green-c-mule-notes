# Day 29 — Detailed Notes: Masking Mechanics, Real Database Setup, and Service Accounts

> **Watch alongside:** this session turns yesterday's masking *cliffhanger* into working code, then pivots to something equally important — actually building the real MySQL database and wiring MuleSoft to it safely. The one rule worth internalizing hardest here: **never use a human account for machine-to-machine communication** — always a dedicated service account, because it must keep working even if the person who owns it resigns.

---

## 1. The `mask` Function — Import, Then Apply

```mermaid
flowchart LR
    Lib["dw::util::values library<br/>(NOT loaded by default)"] -->|"import * from dw::util::values"| Avail["mask() function now available"]
    Avail --> Call["mask(payload, {fields: ['mobileNumber','memberId']})"]
    Call --> Out["Matching fields replaced with **** in log output"]
```

*"This mask function will be in the availability of the data [library]... we have to import the utility from the values library."* Exact syntax: `import * from dw::util::values`.

---

## 2. Masking at the Global Connector Level — One Setting, Not Fifty Calls

```mermaid
flowchart TB
    Manual["❌ Manual: call mask() inside\nEVERY logger's message expression\n(e.g. 50 out of 100 loggers)"] --> Cost["Repetitive, error-prone,\neasy to forget on a new logger"]
    Global["✅ JSON Logger's GLOBAL connector config\nhas a 'masking fields' setting\n(comma-separated: mobileNumber, memberId)"] --> Auto["Applies automatically to EVERY\nlogger using that configuration"]
```

*"I am using masking around 50 times out of 100 logs. Is it better to do it 50 times or one time? One time."*

---

## 3. How to Actually Learn MuleSoft Documentation

```mermaid
flowchart LR
    Start["Start here:\nDZone articles / YouTube\n(community + official channel)"] --> Build["Build fundamentals\nstep by step"]
    Build --> Goal["Goal (3-4 months in):\ncomfortably read OFFICIAL\nMuleSoft documentation"]
    Goal --> Daily["Daily practice once fluent:\nsearch official docs for a\nSPECIFIC new function when needed"]
```

**A frank, direct admission**: *"if we read the mules of documentation in the beginning, it gives us a lot of confusion... if 100 people read it, 5% will agree [understand it]. But 95%... will not understand."*

---

## 4. Building the Real Database and Table

```mermaid
flowchart TB
    C1["CREATE DATABASE mule"] --> C2["USE mule"]
    C2 --> C3["CREATE TABLE employees_info (...)"]
    C3 --> Cols
    subgraph Cols["Column definitions"]
        direction TB
        A["EMP_ID — INT, NOT NULL, PRIMARY KEY"]
        B["Employee name — TEXT (nullable, for contrast only)"]
        C["Employee status — TEXT, NOT NULL"]
        D["Employee salary — DOUBLE (accepts decimals)"]
        E["Employee designation — TEXT(50), default NULL"]
    end
    C3 --> Insert["INSERT INTO employees_info VALUES (...)"]
    Insert --> Select["SELECT * FROM employees_info"]
```

**Primary key's two guarantees, stated directly**: *"if the employee ID is not given when you insert it, it will not get inserted... if you give the same employee ID again, then it will not be inserted. It should be unique."*

**A live length-limit bug**: an employee name value exceeding the 255-character column limit throws a red error — directly illustrating why you must ask the DB team for exact column data types/lengths even without direct database access: *"you don't have access to the database... their team is handling it. Then how do you know? You have to ask him."*

---

## 5. Why a Local App Can't Reach a Remote Database

```mermaid
flowchart TB
    Local["Local MuleSoft app + Local MySQL\n(same machine, THIS demo only)"] --> Works["Works — no real network needed"]
    Cloud["CloudHub-deployed MuleSoft app +\nREMOTE database (real org scenario)"] --> Fails["❌ Fails without network path"]
    Fails --> Fix["Fix: PRIVATE NETWORK connection\nbetween CloudHub and DB's location\n(set up by network/infra teams)"]
```

*"This is in your local, so it is not yet shared... there is no [network] connection between our system and your system... database servers are placed in a shared location. So, they give connectivity to the database location and to the cloud hub... by giving a connection through a private network."*

---

## 6. Property Files — a Real Environment-Count Mismatch

```mermaid
flowchart LR
    App["Application side:\nDev, SIT, UAT, Prod (4 envs)"] -.->|"mismatch!"| DB["Database team side:\nDev, UAT, Prod (3 envs — no SIT DB)"]
    DB --> Decide["Team discussion required:\nshould app's SIT point at\nDB's Dev or UAT instance?"]
```

*"Don't get confused if you face such situations... before we take a decision, just discuss with other team people as well and take a final decision."* Host/port → regular property file; username/password → **Secure Properties** (same pattern as the earlier property-files session).

---

## 7. Reconnection Strategy: Standard vs. Forever, Applied to the DB

```mermaid
flowchart TB
    Q{"Does this call's success/failure\nmatter to the rest of the transaction?"}
    Q -->|"Yes — normal request-response,\nrequest is 'in the middle'"| Standard["STANDARD\n(e.g. 3 attempts every 2 seconds)"]
    Q -->|"No — pure source connector,\nor fire-and-forget async work"| Forever["FOREVER\n(keeps retrying indefinitely)"]
```

*"It is better to set standard when the transaction is in the middle or when the request is lost... when do we set forever? When there is no dependency [on the outcome]."*

---

## 8. A Live Secure-Key Mismatch Bug

```mermaid
flowchart LR
    Encrypted["Encrypted DB password\nin Secure Properties"] -->|"decrypt with WRONG/unknown key"| Fail["❌ Decryption fails silently /\nconnection doesn't work"]
    Fix["Fix: create a FRESH global property\nfor a known secure key,\nre-encrypt the password with it"] --> Works["✅ Works — key is now tracked"]
```

Directly reinforces the Day 27 AES-key warning: lose track of the encryption key, and previously-encrypted values become permanently unreadable — the fix here isn't recovery, it's re-encrypting with a newly-tracked key.

---

## 9. Root vs. Service Accounts — the Session's Most Important Rule

```mermaid
flowchart TB
    Root["❌ Root DB credentials"] --> Danger["Full permissions: create, delete,\neverything — never handed to app teams"]
    Named["❌ Human/named account\n(e.g. 'Mahesh')"] --> Fragile["Breaks conceptually if that\nperson resigns/changes role"]
    Service["✅ Dedicated SERVICE account\n(scoped: only insert/update/select, etc.)"] --> Durable["Keeps working regardless of\nstaffing changes — non-human, org-owned"]
```

**The single most emphasized line of the session**: *"when we connect programmatically, when we communicate mission to mission, when we communicate application to application, you should never use human-related accounts. You should always use service-related users or service-related accounts."*

---

## 10. Dynamic Input Parameters in the Insert Query

```mermaid
flowchart LR
    Query["INSERT INTO employees_info\nVALUES (:EMP_ID, :EMP_NAME, ...)"] --> Params["Input Parameters mapping"]
    Params --> P1["EMP_ID → fx payload.employeeId"]
    Params --> P2["EMP_NAME → fx payload.employeeName"]
    Params --> P3["... same pattern per column"]
```

**Naming discipline, stated directly**: *"it is always a good practice to maintain the same column names"* as placeholder keys — scales cleanly even to "50 fields or 100 fields."

**Live `fx` gotcha**: `payload.employeeId` typed directly (without enabling `fx`/expression mode) fails — *"it is working only in expression mode. `Payload.` is not an expression"* by default; the `fx` toggle must be explicitly turned on.

---

## 11. Live Test: Success, Duplicate-Key Error, and DB-Down Reconnection

```mermaid
flowchart TB
    Req["POST /employees"] --> Router["API Kit Router validates & routes"]
    Router --> Success["✅ Success: 'Post employees flow started'\nlogged, DB insert succeeds"]
    Router --> Dup["Re-send SAME employee ID"]
    Dup --> DupErr["❌ DB Query Execution / SQL syntax\n(duplicate key on EMP_ID)\n→ existing error handler → 400"]
    Router --> Stop["MySQL service STOPPED mid-test"]
    Stop --> ConnErr["❌ DB connectivity error:\n'could not obtain connection from data source'"]
    ConnErr --> Restart["MySQL service restarted,\ndebugger resumed"]
    Restart --> Retry["✅ Reconnection Strategy retries\nand succeeds — insert completes"]
```

**The catch-all fallback, reiterated from Day 27's error handler design**: *"if these two types don't match, anything will come down here"* — any unmatched error type falls through to the `ANY` handler.

---

## Quick Recap
- **`mask()` lives in `dw::util::values`** — must be explicitly imported before use, same as any Studio module.
- **Masking is best configured ONCE**, at the JSON Logger's global connector configuration ("masking fields"), rather than repeated per logger.
- **Learn MuleSoft docs via DZone/YouTube first**, official documentation as a 3-4-month fluency goal, then targeted searches once fluent.
- **The real Employees database/table exist now**: `EMP_ID INT NOT NULL PRIMARY KEY`, name/status/designation as text, salary as `DOUBLE` — tested with working `INSERT`/`SELECT` and a caught length-limit error.
- **A local app only reaches a database it has real network access to** — real orgs bridge CloudHub to remote databases via **private network connections**.
- **DB config**: host/port in regular properties, username/password in **Secure Properties** — with realistic environment-count mismatches requiring cross-team resolution.
- **Reconnection Strategy**: Standard for normal request-response DB calls; Forever only when there's no dependency on the outcome.
- **Never use a human account for machine-to-machine communication** — always a dedicated service account, so it survives staffing changes.
- **Live-tested**: success path, a duplicate-primary-key SQL error (400 via the existing error handler), and a DB-connectivity failure recovered live by the Reconnection Strategy after restarting the MySQL service.
