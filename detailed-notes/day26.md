# Day 26 — Detailed Notes: Publishing to Exchange and Importing a Published API

> **Watch alongside:** this session's payoff is the "golden rule" in section 4 — the API Kit Router matches on auto-generated flow names, and breaking that naming pattern silently breaks routing. Everything before it (Exchange, asset types, import options) is setup for understanding *why* that pattern exists and where it comes from.

---

## 1. Why Publish to Exchange At All

```mermaid
flowchart LR
    Spec["Completed API<br/>specification (base + fragment)"] --> Q{"Could keep working<br/>with it unpublished?"}
    Q -->|"Technically yes"| Unpub["...but NOT standard practice"]
    Q -->|"Standard practice"| Publish["Publish to EXCHANGE<br/>immediately once ready"]
    Publish --> R1["Reason 1: Studio's import<br/>pulls FROM Exchange"]
    Publish --> R2["Reason 2: API Manager policies<br/>also source the asset FROM Exchange"]
```

Exchange is *"a central repository where all MuleSoft assets will be saved and published"* — other Anypoint Platform modules, not just developers, depend on it being there.

---

## 2. Exchange's Asset Model

```mermaid
flowchart TB
    Exchange["Exchange"] --> All["All Assets<br/>(MuleSoft-provided + your org's own)"]
    Exchange --> Mine["Your org's own account<br/>(REST APIs, Fragments you published)"]
    Exchange --> Shared["Shared with Me<br/>(explicitly shared by colleagues)"]
    Exchange --> MyApps["My Applications"]
    All --> Types["Types: connectors, custom assets,<br/>DataWeave libraries, examples, policies,<br/>fragments, REST/SOAP APIs, templates..."]
```

**Type assignment on publish**:

```mermaid
flowchart LR
    A["Publish FROM Design Center<br/>or FROM Exchange itself"] -->|auto-detected| B["Type set automatically<br/>(API spec / Fragment)"]
    C["Publish a project<br/>FROM SCRATCH"] -->|must specify manually| D["Name, Asset Type<br/>(example/API/SOAP/REST/Async),<br/>Lifecycle status (Dev/Stable)"]
```

---

## 3. Sharing an API Spec for Testing — Two Mechanisms

```mermaid
flowchart TB
    Share["Exchange Share options"] --> Collab["Collaborators (by email)<br/>→ lands in THEIR 'Shared with Me'"]
    Share --> Portal["Public Portal<br/>toggle a version → Public → Save"]
    Portal --> URL["Shareable public URL"]
    URL --> Anyone["ANYONE with the link can test —<br/>no Anypoint Platform login needed"]
```

A live demo removes a comma from a test request through the public portal and gets a correct **"Invalid schema"** error back — proving schema validation is genuinely live through the public URL, not a static mock.

**Default internal visibility, stated directly**: once published normally, *"it will be accessible to all the developers who are part of that organization"* — no extra sharing step needed internally.

---

## 4. Creating the Project and Importing — Three Options Compared

```mermaid
flowchart TB
    New["New Mule Project"] --> Opt1["1. Import a Published API<br/>(from Exchange)"]
    New --> Opt2["2. Import RAML from Local File<br/>(a downloaded .zip)"]
    New --> Opt3["3. Download RAML from Design Center<br/>(direct connection)"]

    Opt1 -->|"✅ used most in real practice"| Used["'Most of the time,<br/>we use import-published API'"]
    Opt2 -->|"fallback only"| Fallback["Used when SSL/connectivity<br/>issues block Studio↔Platform"]
    Opt3 -->|"good, but..."| Seamless["Exchange has the more<br/>seamless always-current<br/>version sync"]
```

**Live import steps**: `+` next to dependencies → From Exchange → Add Account → select **organization/SSO domain** (ask colleagues if you lack Access Management visibility) → sign in → select published version (`1.0.0`) → import.

---

## 5. Scaffolding — What It Actually Generates

```mermaid
flowchart TB
    Import["API spec imported"] --> Scaffold["Scaffolding process"]
    Scaffold --> Listener["ONE Listener flow<br/>(all requests land here)"]
    Scaffold --> Router["API Kit Router component<br/>(inspects request against spec)"]
    Scaffold --> Flows["ONE flow PER resource-method<br/>e.g. post:\employee, get:\employee\{id}"]
    Router -->|routes matching request to| Flows
```

**Honesty note**: a badly broken spec fails scaffolding visibly (red error), but a spec with subtler structural issues can scaffold "successfully" without visible failure — clean scaffolding is not proof of correctness; test the flows regardless.

---

## 6. The Golden Rule of Flow Naming

```mermaid
flowchart LR
    Spec["API spec resource/method order"] -->|generates matching pattern| Names["Scaffolded flow names<br/>e.g. post:\employee"]
    Router["API Kit Router"] -->|matches incoming request against| Names
    Rename["❌ Rename or reorder<br/>this generated pattern"] --> Break["Router gets confused —<br/>cannot find where to route"]
```

> *"If I change this, the API Kit Router will be confused and it will not understand where to send it... post or application should be in the same order as this order... same goes for every resource, every flow."*

**What's safe vs. not**:

```mermaid
flowchart TB
    Safe["✅ SAFE to rename freely:<br/>custom/private flows YOU create"] 
    Unsafe["❌ NEVER rename:<br/>auto-generated resource-method<br/>flow names (post:\employee, etc.)"]
```

**Extending a live production API** (adding a 4th resource to 3 already-live ones): go back to Design Center → add resource + data types/examples → republish (version bumps) → re-pull in Studio. Same golden rule applies: *"we should not touch anything for this order or combination."*

**How the router actually knows where to send requests**: its auto-generated router configuration's **API Definition** field points straight at the imported spec (fragment included) — the router validates the full data type/schema, not just the URL path.

**Main flow vs. private flow, precisely**:

```mermaid
flowchart LR
    Main["Main flow"] -->|has| Source["A SOURCE component"]
    Main -->|has| ErrH["Its own error handling"]
    Private["Private (sub)flow"] -->|has NEITHER| NoSource["No source, no error handling"]
```

The generated **API Console flow** (also a main flow, used for a lightweight built-in test GUI) is typically deleted in real projects — *"not required 90% of the time."*

---

## 7. Live Debug-Mode Test

```mermaid
sequenceDiagram
    participant Client
    participant Listener
    participant Router as API Kit Router
    participant GetFlow as GET employee flow
    participant PostFlow as POST employee flow

    Client->>Listener: GET /employees/{id}
    Listener->>Router: forward
    Router->>GetFlow: route (path + schema OK)
    GetFlow-->>Client: 200 + employee data

    Client->>Listener: GET /employees1 (wrong path)
    Listener-->>Client: ❌ rejected at LISTENER level

    Client->>Listener: POST /employees (malformed body)
    Listener->>Router: forward
    Router-->>Client: ❌ 400 Bad Request<br/>(schema validation failure, ROUTER level)
```

**Postman efficiency tip**: copy a full working header block (Ctrl+A, Ctrl+C) and paste into a new request's Headers tab via **Bulk Edit (Ctrl+B)** instead of retyping.

**How the 400 error response gets its shape**: the generated error handling sets an `httpStatus` variable and a `payload` automatically — corresponding to the **Error Responses Mapping** section of the Listener config, mapping error types to status codes/payload shapes (built in an earlier session, now seen live end-to-end).

---

## Quick Recap
- **Publishing to Exchange is standard practice**, not optional — Studio import and API Manager policies both depend on it.
- **Exchange organizes many asset types** with type auto-detected on publish from Design Center/Exchange, manual when publishing from scratch.
- **Public Portal** shares a fully-testable API outside the org with zero login required.
- **"Import a Published API" (from Exchange) is what's actually used in real practice** — the other two options are fallbacks.
- **Scaffolding generates a listener + router + one flow per resource-method** using an exact naming pattern the router depends on.
- **Never rename or reorder the auto-generated resource-method flow names** — custom flows you create yourself remain freely renameable.
- **The API Kit Router does real schema validation**, demonstrated live via a correctly-routed GET and a correctly-rejected malformed POST (400).
