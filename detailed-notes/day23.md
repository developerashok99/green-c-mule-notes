# Day 23 — Detailed Notes: Hands-On RAML — Building the Employee API Spec, Live

> **Watch alongside:** the first genuinely complete, real RAML file gets built here, line by line — including two real, live bugs (an `additionalProperties` ordering mistake, and an unresolved "Try It" enum validation bug) that are worth watching precisely because they're authentic, not staged.

---

## 1. Design Center's Four Project Types

```mermaid
flowchart TB
    New["Create New..."] --> Spec["New API Specification<br/>⭐ the default, used here"]
    New --> Frag["New Fragment<br/>(reusable RAML pieces —<br/>deferred to a future session)"]
    New --> Async["New Async API<br/>(rare, recently introduced)"]
    New --> Import["Import from File /<br/>Sync from GitHub<br/>(when RAML already exists elsewhere)"]
```

---

## 2. The Critical Naming Rule: Nouns, Plural, No Verbs

```mermaid
flowchart LR
    subgraph "❌ WRONG — verbs as resource names"
    W1["/employees/add"]
    W2["/employees/update"]
    W3["/employees/fetch"]
    end
    subgraph "✅ CORRECT — one noun resource, method carries the action"
    R["/employees"] --> M1["POST → create"]
    R --> M2["PATCH → update"]
    R --> M3["GET → fetch"]
    end
```

**The reasoning, precisely**: *"employee is not noun... it should be plural. The action point should not be there"* — the HTTP method already communicates the action; the resource name should describe *what thing* is being acted upon.

**Honest real-world caveat**: *"unless there is a very strict architect... they say they will keep it as they like"* — this convention is well-established but not universally enforced in practice.

---

## 3. RAML Is Indentation-Sensitive (YAML-Based)

```mermaid
flowchart TB
    Employees["employees:"] --> Post["  post:<br/>(tab-indented → nested under employees)"]
    Employees --> Patch["  patch:<br/>(tab-indented → nested under employees)"]
    Employees --> Get["  get:<br/>(tab-indented → nested under employees)"]
```

A misaligned tab silently changes what's nested under what — exactly the same YAML mechanics from Day 14's property files, now applied to RAML. **Copy-paste-then-edit** is a genuinely efficient, real authoring technique for near-identical blocks (demonstrated directly for the `origin`/`language` headers).

---

## 4. Two Real, Live Bugs — Worth Studying As-Is

### Bug #1: `additionalProperties` Placement Order
```mermaid
flowchart TB
    subgraph "❌ Wrong order — error: 'expecting boolean, null provided'"
    Obj1["object:"] --> Props1["properties: {...}"] --> AddProps1["additionalProperties: false<br/>(placed AFTER properties)"]
    end
    subgraph "✅ Correct order"
    Obj2["object:"] --> AddProps2["additionalProperties: false<br/>(placed BEFORE properties)"] --> Props2["properties: {...}"]
    end
```
A small, genuinely easy structural mistake — found live through direct, careful experimentation, not by guessing.

### Bug #2: "Try It" Enum Validation — Honestly Unresolved
```mermaid
flowchart LR
    Test["Send a value that IS in the allowed enum list"] --> Fail["❌ Still returns 'bad request'<br/>related to enum validation"]
    Fail --> Response["Instructor: 'I am unable to trace it out...<br/>even if you fix it, it will always appear as an issue'"]
    Response --> Pivot["Pivot: use a separate<br/>Mocking Service instead<br/>(covered next session)"]
```

**The honest, direct lesson**: built-in vendor tooling doesn't always behave perfectly — a real developer's response is finding an **alternative verification path**, not getting stuck waiting for one tool to cooperate.

---

## 5. Field-Name Case Sensitivity — A Precise, Easy Trap

```mermaid
flowchart LR
    Spec["Spec defines: transactionId"] --> Sent["Consumer sends: TransactionId or transactionID"]
    Sent --> Result["❌ NOT recognized — treated as a different field entirely<br/>→ 400 Bad Request"]
```

*"Even if they send it in capital T... that won't work — you have to throw a bad request."* Exact casing match is required.

---

## 6. `default` — Solving the "Optional String" Gotcha

```mermaid
flowchart LR
    Optional["language header,<br/>required: false, type: string"] --> Problem{"Header genuinely<br/>not sent by caller"}
    Problem --> Issue["❌ 'Expecting string' error —<br/>a truly absent value still<br/>doesn't satisfy 'string' type cleanly"]
    Issue --> Fix["✅ Add default: null (or a sensible string)<br/>so an absent header has a<br/>well-defined fallback"]
```

A genuinely subtle RAML behavior — an optional field still needs a defined fallback to behave cleanly when actually omitted.

---

## 7. Documentation and "Try It" Are Auto-Generated, Free

```mermaid
flowchart LR
    RAML["RAML you write"] --> Docs["Auto-generated documentation<br/>(title, resources, methods,<br/>headers, schemas — live-updating)"]
    RAML --> TryIt["'Try It' — a built-in mock tester,<br/>works like Postman, no extra tool needed"]
```

Zero separate documentation-writing effort — this is one of RAML's most concrete, immediate productivity payoffs.

---

## 8. The Closing Motivation: Why Modularize Next

> *"How many lines of code is there now? 300 and plus... if there is something called reusability — headers is repeated three times — if I write it once and refer to it, it will be easy."*

This directly foreshadows RAML's **Traits** (header-level reuse) and **Resource Types** (method-level reuse) — the exact mechanisms already covered in depth in the April-batch course's `apr25.md`, now about to be applied concretely to this real, growing spec.

---

## Quick Recap
- **Resources should be nouns, plural, no action verbs** — the method carries the action — though enforcement varies by organization.
- **RAML is indentation-sensitive**; copy-paste-then-edit is a real, efficient authoring habit for near-identical blocks.
- **Two real live bugs were worked through honestly**: an `additionalProperties` ordering mistake (resolved), and a "Try It" enum validation bug (not resolved within the session — pivoted to a different verification approach instead).
- **Field names must match exactly, case-sensitively.** **Optional string fields need an explicit `default`** to behave cleanly when actually omitted.
- **Documentation and mock testing are free, automatic byproducts of writing RAML** — a concrete, immediate payoff for doing Design properly.
