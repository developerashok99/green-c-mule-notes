# Day 24 — Detailed Notes: RAML Best Practices — Externalizing Examples and Data Types

> **Watch alongside:** this is where a 300-line, hard-to-navigate RAML file becomes a genuinely maintainable, modular structure — the mechanics here (examples vs. data types using different reference syntax) are worth building yourself, not just reading about.

---

## 1. The Core Problem and the Two Different Fixes

```mermaid
flowchart TB
    Big["One 300+ line RAML file<br/>everything inline"] --> Problem["Hard to read,<br/>hard to maintain,<br/>changes buried everywhere"]
    Problem --> Fix1["Externalize EXAMPLES<br/>via !include"]
    Problem --> Fix2["Externalize DATA TYPES<br/>via types: (import) + type: (apply)"]
```

**These are genuinely different mechanisms, not the same technique twice** — this is the single most important distinction of the session.

---

## 2. Externalizing Examples

```mermaid
flowchart LR
    Main["Main RAML file"] -->|"body → example:<br/>!include examples/requests/post-request-example.json"| File["post-request-example.json<br/>(plain JSON, illustrative only)"]
```

```
examples/
├── requests/post-request-example.json
├── responses/post-response-example.json
└── error-responses/{400,500}-error-example.json
```

Reference obtained via **right-click → Copy Path** (avoiding manual typing errors) — then wired in with `!include`.

---

## 3. Externalizing Data Types — A Genuinely Different Mechanism

```mermaid
flowchart LR
    Main["Main RAML file"] -->|"1. types: PostRequestDataType:<br/>!include data-types/requests/post-request-datatype.raml"| Import["Data type IMPORTED,<br/>given an alias"]
    Main -->|"2. body → type: PostRequestDataType"| Apply["Data type APPLIED<br/>to a specific field/body"]
```

**Why this two-step process exists, and why it matters more than examples**: a data type is the **actual validation/enforcement layer**, not just illustrative text.

```mermaid
flowchart TB
    Test1["Example value: 80,000 → 1,00,000<br/>(still a number)"] --> Pass1["✅ Accepted — schema only<br/>cares about TYPE, not exact value"]
    Test2["Value: '80000' (a string)<br/>where the type says 'number'"] --> Fail["❌ REJECTED —<br/>this is the schema genuinely<br/>doing validation, not just documenting"]
```

---

## 4. Reuse Should Be Deliberate, Not Automatic — A Real Worked Judgment Call

```mermaid
flowchart TB
    Success["POST success response:<br/>{statusCode, message}"] --> Check1{"Genuinely identical<br/>across POST/PATCH?"}
    Check1 -->|Yes| Reuse["✅ REUSE — same shared reference"]

    Error["Error response schema"] --> Check2{"Genuinely identical?"}
    Check2 -->|"No — has 4-5 EXTRA fields<br/>(event ID, etc.)"| Separate["❌ Keep SEPARATE —<br/>superficially similar ≠ actually identical"]
```

**The generalized principle, stated directly, worth internalizing beyond RAML**: *"we should not develop blindly — is there any possibility of reusability? ... it is better to reuse it. That's the way a developer should think."* But reuse only after **verifying** genuine sameness — not because two things merely look similar.

---

## 5. The Scope Boundary — Setting Up Day 25

```mermaid
flowchart LR
    ThisSession["Data types & examples<br/>built THIS session"] -.->|"Scoped to"| OneSpec["ONE API specification only"]
    OneSpec -.->|"❌ Cannot be reused in"| OtherSpec["A different API specification"]
    OtherSpec -.->|"✅ Requires"| Fragment["Fragment<br/>(next session's topic)"]
```

---

## 6. Templates — A Real, Practical Time-Saver

```mermaid
flowchart LR
    Scratch["Build folder structure<br/>from scratch: ~10-15 min<br/>EVERY new API spec"] -->|"vs."| Template["Duplicate an existing<br/>template project,<br/>rename, fill in specifics"]
```

The entire organization following the same duplicated template also produces **structural consistency** across every project, not just individual time savings.

---

## Quick Recap
- **Examples use `!include` (illustrative only). Data types use `types:`/`type:` (actual enforcement)** — genuinely different mechanisms for genuinely different purposes.
- **A data type's real job is validation**, proven directly by a type-mismatch getting correctly rejected.
- **Reuse decisions require verification, not assumption** — success responses were reused because genuinely identical; error responses were kept separate because closer inspection revealed real differences.
- **Everything built here is scoped to one API spec** — cross-spec reuse needs Fragment (Day 25).
- **Templates eliminate repeated scaffolding work** and enforce organization-wide structural consistency.
