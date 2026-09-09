# Day 27 — Detailed Notes: Full Implementation Build-Out, Database Connector, and a Live Token Q&A

> **Watch alongside:** this is the session where the project actually becomes real — a thin routing layer (from Day 26's scaffolding) gets real business logic wired behind it: folders for organization, a reused error handler, and Insert/Update/Select database operations, all externalized through property files. The live copy-paste bugs here (duplicate flow names, blank SQL query) are worth reproducing yourself — they're the exact mistakes this workflow is prone to.

---

## 1. Organizing the Project

```mermaid
flowchart TB
    Root["src/main/mule"] --> Common["common/<br/>global-config.xml (all connector configs)<br/>error-handler.xml (reused, see §3)"]
    Root --> Impl["implementation/<br/>post-employee-implementation.xml<br/>patch-employee-implementation.xml<br/>get-employee-implementation.xml"]
    Root --> Scaffold["(scaffolded) main flows<br/>listener + API Kit Router + resource flows"]
```

**Stated explicitly as convention, not platform rule**: *"there is no rule... we kept it so that there would be some clarity."* The motivating problem: with 10 resources, unorganized flows in one place become impossible to navigate.

---

## 2. Building Global Config — and a Recurring Studio Glitch

```mermaid
flowchart LR
    Create["New Mule Config file:<br/>global-config"] --> Move["Drag & drop into common/"]
    Move --> Cut["Cut Listener config +<br/>API Kit Router config<br/>from main flow's XML"]
    Cut --> Paste["Paste inside global-config's<br/>&lt;mule&gt; tag"]
    Paste --> Glitch["⚠️ Stale display:<br/>'name must be unique' /<br/>looks duplicated"]
    Glitch --> Fix["Fix: Save All →<br/>if still stale, CLOSE + REOPEN project<br/>(plain Refresh does NOT fix it)"]
```

**Why centralize globally at all**: *"if we want to create something new, where should we create it? We should create it globally... if we do it somewhere else, everything will scatter."*

---

## 3. Reusing an Existing Error Handler by Copy-Paste

```mermaid
flowchart LR
    Prev["Previous project's<br/>completed error-handler.xml"] -->|"Ctrl+C, minimize,<br/>switch project, Ctrl+V"| This["THIS project's common/ folder"]
    This --> Adapt["Adapt: Transform Message<br/>payload SHAPE per this project's<br/>response contract"]
    This --> Keep["Keep as-is: error TYPE coverage<br/>(Bad Request, Not Found, Not Allowed,<br/>DB connectivity, DB SQL syntax,<br/>DB no-data-found)"]
```

*"I don't want to waste time... I will copy and paste the Error Handler we made for this project."* Once wired in, the now-redundant inline error handler is deleted from the main flow's own XML.

---

## 4. Deleting API Console — and a Direct Routing Clarification

```mermaid
flowchart TB
    Console["API Kit Console<br/>(web-based test GUI)"] -->|"real testing already<br/>done via Postman/Debug"| Delete["Deleted as unneeded"]
```

**A genuinely common point of confusion, resolved directly**: does an implementation flow need to be in the *same* XML file as the API Kit Router?

```mermaid
flowchart LR
    Router["API Kit Router"] -->|"matches by FLOW NAME"| AnyFile["Flow can live in ANY XML file<br/>in the project — routing still works"]
```

*"Even if you create another XML file and copy and paste this flow, API Kit Router can send that particular request to this particular flow. There is nothing like that [restriction]."* Routing is name-based, not file-location-based.

---

## 5. Full Implementation Build-Out (POST → PATCH → GET)

```mermaid
flowchart TB
    Public["Public resource flow<br/>(e.g. post:\employee)"] -->|"Flow Reference"| Private["Private implementation flow<br/>(kebab-case name)"]
    Private --> TM1["Transform Message:<br/>URI parameter mapping"]
    Private --> Logger1["Logger (before external call)"]
    Private --> DB["Database operation:<br/>Insert (POST) / Update (PATCH) / Select (GET)"]
    Private --> Logger2["Logger (after external call)"]
    Private --> TM2["Transform Message:<br/>'final response'"]
```

**Why isolate logic in a private flow at all**: keeps the public/scaffolded flow thin (routing only); the private flow is independently testable and navigable — *"where is better? It should be in the private flow."*

**Database operation coverage, stated as a direct usage reality**: *"there are a lot of inserts, delete, updates... almost like 90–95% of the time, we used 4-5"* operations — a small handful covers nearly all real work.

**External-call logging discipline, stated directly as best practice**: *"when it goes out [of the application]... put a logger before an external call... it is a good habit to put a logger after an external call"* — bracketing the DB call in addition to the flow-level start/end loggers already established.

### Two live, caught copy-paste bugs

```mermaid
flowchart LR
    Copy["Copy POST's implementation flow<br/>to build PATCH's"] --> Bug1["❌ Bug: same flow name retained<br/>→ 'flow name should be unique' error"]
    Bug1 --> Fix1["Fix: rename immediately after paste"]

    Copy2["Copy structure for GET,<br/>swap to Select operation"] --> Bug2["❌ Bug: SQL query text left blank<br/>→ 'required elements SQL query text missing'"]
    Bug2 --> Fix2["Fix: copy-paste builds STRUCTURE only —<br/>still must fill in operation-specific config"]
```

**Flow Reference naming discipline**: naming it descriptively (e.g. "Flow Reference to Patch") costs nothing functionally, but *"we will not know where this flow reference will go [without it]"* at a glance.

---

## 6. Database Connector: Naming, Property Files, Secure Properties

```mermaid
flowchart TB
    Config["Database connector configuration"] --> Bad["❌ Vague name (e.g. arbitrary IT/server label)<br/>→ 'database config' vs 'database config 1' confusion"]
    Config --> Good["✅ Descriptive name<br/>(clearly identifies: THIS is the MySQL config)"]
```

*"Is it wrong to say this is wrong?... whatever we do should be neat... even if a new person comes, it should be understood easily and quickly."*

**Externalization split, directly mirroring the earlier property-files session**:

```mermaid
flowchart LR
    Host["host, port"] --> Regular["Regular property file<br/>(plaintext)"]
    User["username, password"] --> Secure["Secure Properties<br/>(AES/CBC encrypted)"]
    Secure --> Warn["⚠️ AES key/mode must stay CONSTANT —<br/>changing it breaks decryption<br/>of already-encrypted values"]
```

**Required driver library**: three options at connector setup — local file / Maven dependency / **Add Recommended Libraries** (used here). *"It will help to establish the connection with the database."*

**Recurring Studio glitch again**: an import-related error appeared after wiring dependencies; same fix as §2 — close and reopen the project.

---

## 7. Installing MySQL Locally — Standing in for a Real Database Team

```mermaid
flowchart LR
    RealWorld["Real org: a separate<br/>DATABASE TEAM"] --> Provides["Provides: host, port, DB name,<br/>username, password (via email)"]
    Provides --> Dev["Developer just plugs these into<br/>property file + Secure Properties,<br/>then tests the connection"]
    Training["THIS training context<br/>(no DB team provisioned)"] --> SelfInstall["Developer installs/configures<br/>MySQL themselves, as a stand-in"]
```

**Workbench explained by direct analogy**:

```mermaid
flowchart LR
    App["Mobile app"] -.is the UI for.-> Backend["Backend systems"]
    Workbench["MySQL Workbench<br/>(or Oracle SQL Developer)"] -.is the UI for.-> DB["The database engine"]
```

**Managing the MySQL service via `services.msc`**: start / stop / pause / set startup type (automatic vs. manual) — used directly to **live-test Reconnection Strategy** by deliberately stopping the DB service mid-session and observing configured retry attempts (e.g. 3 attempts, succeeding on the 3rd) — the same Reconnection Strategy concept from an earlier session, now demonstrated against a real interrupted connection rather than a simulated one.

**Stated next steps closing the session**: create the database + table(s), map implementation-flow queries to the real table structure, then test **POST → PATCH → GET** end-to-end, success and error scenarios each.

---

## 8. Domain Projects — Direct Recap

```mermaid
flowchart TB
    Q["Can THIS project's common/<br/>global config be reused by<br/>a DIFFERENT project?"] --> OnPrem["✅ On-Premises: YES,<br/>via a dedicated DOMAIN PROJECT<br/>(define once, inherited by multiple apps)"]
    Q --> Cloud["❌ CloudHub / RTF: NO"]
    Cloud --> Why["Container-based, per-worker isolation —<br/>'does that worker have any communication<br/>with another worker? No.'"]
```

*"Because it is individual and isolated, the concept of domains... does not work in such a worker-based environment."*

---

## 9. Closing Live Q&A: OAuth "Invalid Token" Troubleshooting

```mermaid
flowchart TB
    Error["'Invalid Token' / 400 error"] --> Check1{"Client ID/secret,<br/>scope, grant type<br/>all correct?"}
    Check1 -->|No| Fix1["Fix credentials/config with provider"]
    Check1 -->|Yes| Check2{"Request format correct?<br/>(e.g. extra/misplaced 'Bearer')"}
    Check2 -->|No| Fix2["Fix request format"]
    Check2 -->|Yes| Check3{"Token TIME-expired?<br/>e.g. valid only 1 hour"}
    Check3 -->|Yes| Fix3["Regenerate token"]
    Check3 -->|No| Check4["Token might be SINGLE-USE<br/>(like an SMS OTP) —<br/>already used once?"]
```

**The single-use point, given by direct analogy**: *"we have one time password. We get one time password in SMS. If you use it for the second time, will it be valid? It won't be valid."* A 400 can stem from reusing a single-use token, entirely separate from any time-based expiry — both must be checked, not assumed.

---

## Quick Recap
- **`common`/`implementation` folder split** is a clarity convention for growing projects, not a platform requirement.
- **A well-built error handler is directly reusable by copy-paste** across projects — only the response payload shape needs adapting.
- **API Kit Router routing is name-based, not file-location-based** — implementation flows can live in any XML file.
- **Insert/Update/Select cover ~90-95% of real Database connector usage.**
- **Connector naming matters as much as flow naming** — vague names reproduce the exact confusion good naming discipline exists to prevent.
- **host/port go in regular properties; username/password go in Secure Properties** — same AES/CBC mechanism from the earlier property-files session, with the same "don't change the key" warning.
- **Domain Projects solve cross-app shared config only On-Premises** — CloudHub/RTF's isolated worker model has no equivalent.
- **A 400/"Invalid Token" error has multiple distinct root causes** (bad request format, time expiry, single-use reuse) — check each systematically.
