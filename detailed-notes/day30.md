# Day 30 — Detailed Notes: PATCH/GET Build-Out, RAML Sync, and the Validation Module

> **Watch alongside:** the single most valuable moment in this session is the live router-configuration bug — after bumping the RAML spec's version and updating `pom.xml`, the API Kit Router itself *still* pointed at the old version string in its own config, causing a "resource not found" error that had nothing to do with the actual flow logic. This exact failure mode (two separate places tracking "the current API version," only one of which gets updated) is worth reproducing yourself.

---

## 1. Remove Variable — Deliberate Memory Hygiene

```mermaid
flowchart LR
    Var["Heavy variable, no longer\nneeded mid-flow"] -->|"Remove Variable\n(by name)"| Freed["Memory freed,\navailable to other resources"]
```

*"If it is small variables, that's okay. But if it is big variables, what can we do? We can use remove variable option."*

---

## 2. PATCH's Update Query — Left/Right Mapping Discipline

```mermaid
flowchart LR
    Left["LEFT side = table COLUMN NAMES\n(EMP_ID, employee_salary, employee_designation)"] -->|"maps to"| Right["RIGHT side = VALUES\n(payload.employeeId, payload.salary, ...)"]
```

**Stated directly, repeatedly, because it's a common confusion**: *"left side should match with these [table columns]... right side are the values we map... many developers get confused about which side to put left and which side to put right."*

**Why not just hardcode values inline?** Valid, but less maintainable: *"it is always a good practice to maintain [column-name mapping] for neat and clean code... since it is SQL code, it needs to be neat and presentable."*

---

## 3. Keeping RAML and Implementation in Sync — The Full Cycle

```mermaid
sequenceDiagram
    participant DC as Design Center
    participant Ex as Exchange
    participant St as Studio (pom.xml + Router Config)
    DC->>DC: Add transactionId, employeeId to<br/>response EXAMPLE and DATA TYPE
    DC->>Ex: Publish → version bumps 1.0.0 → 1.0.1
    Note over St: Studio does NOT auto-update!
    St->>St: Right-click → Manage Modules →<br/>update dependency to 1.0.1<br/>(or edit pom.xml directly)
    St->>St: ⚠️ ALSO update Router Config's<br/>API Definition field to 1.0.1<br/>(separate from pom.xml!)
```

**Why this matters at all, stated directly**: *"RAML thinks the response structure is like this. But when it comes to implementation, if you check here, it is different... they will get confused again."* Any consumer trusting the spec needs the implementation to actually match it.

**What re-scaffolding does NOT touch**: *"we won't overwrite all our changes? No, we won't... all the old resources already have private flows. We won't change them, they will remain the same."* Only a brand-new resource gets an empty private flow generated.

---

## 4. The Live Router-Configuration Bug

```mermaid
flowchart TB
    Bump["pom.xml dependency bumped\nto 1.0.1"] --> Test["Test PATCH request"]
    Test --> Fail["❌ 'RAML not found resource'"]
    Fail --> Diagnose["Diagnosis: NOT a flow/code bug —\nit's the API Kit Router's OWN config"]
    Diagnose --> Found["Router's API Definition field\nstill references stale version string"]
    Found --> Fix["Manually update Router Config's\nAPI Definition → 1.0.1"]
    Fix --> Success["✅ PATCH succeeds"]
```

*"The issue came from the global, router configuration... how is the API definition?... this will search for 1.0.0.1. Is it here? We have already updated it with 1.0.1, right?... then change it here."* Two separate places track "current API version" — a pom.xml dependency and the router config's own field — and bumping one does not automatically bump the other.

---

## 5. Validation Module + Error Mapping = Custom Error Types

```mermaid
flowchart TB
    IsNumber["isNumber(payload.affectedRows,\nmin: 1, max: 1)"] -->|"fails default check"| DefaultErr["Default error:\nVALIDATION:INVALID_NUMBER"]
    DefaultErr -->|"Error Mapping\n(remap left→right)"| Custom["Custom error:\nDB:NO_DATA_FOUND"]
    Custom --> Handler["Existing error handler (Day 27)\nrecognizes DB:NO_DATA_FOUND\n→ sets response + status code"]
```

**Error Mapping's scope, stated directly**: *"error mapping is for every component... it is not for Logger. It is available for database connector, HTTP request connector, etc. It is very rarely used [elsewhere]. Error mapping is mostly available in [and used with] this validation module."*

**Exact required syntax, given directly**: *"it is similar to `HTTP:CONNECTIVITY` and `DB:CONNECTIVITY`. In the same way, it is enough if the structure is followed"* — `NAMESPACE:IDENTIFIER`, here **`DB:NO_DATA_FOUND`**, directly reusing the same custom error type already present in the Day 27 reused error handler.

**A live-caught bug — defining ≠ mapping**: deploying before actually wiring the mapping causes the error type to not exist anywhere in the application yet, so the error handler can't catch it. Both steps — define the custom type AND map a component to raise it — are required.

---

## 6. GET: Select's Array-of-Objects Response Shape

```mermaid
flowchart LR
    Select["Database Select operation"] --> JavaArr["Response: Java-format\nARRAY of objects\n(even for ONE matching row)"]
    JavaArr -->|"payload[0]"| First["Access first/only element"]
    First --> TM["Transform Message:\nJava → JSON, field-by-field mapping"]
    TM --> Final["Final JSON response"]
```

**Why an array even for one row, explained by direct analogy to a JSON body with multiple employees**: *"is this an array?... this is an object. Is this an array of objects? Yes. Each object is represented by one employee."* A Select scoped to a single ID still returns a one-element array — *"even then, it will come the same. But, only one object will come."*

---

## 7. "Not Found" Is a Success (200), Not an Error

```mermaid
flowchart TB
    SelectResult["Select query result"] --> Choice{"!isEmpty(payload)?"}
    Choice -->|"true — data exists"| Normal["Map full employee JSON,\nreturn 200 with details"]
    Choice -->|"false — no match"| NotFound["Return 200 OK,\nmessage: 'employee details not found'\n(explicitly NOT an error)"]
```

**Stated directly, as a deliberate design choice**: *"you should not send the error response. You should send the success response... employee details not found in the database... then it will come to 200 OK."*

**`isEmpty`/`!isEmpty` vs. `sizeOf(payload) == 0` — a performance distinction, stated directly**: *"the problem with the size of payload is that the payload is very large... it will load all the data, check the size... performance wise, [isEmpty] is better."* `isEmpty` can short-circuit without loading/counting a potentially large array.

---

## 8. Live Test Summary

```mermaid
flowchart LR
    PatchTest["PATCH: salary→1 lakh,\ndesignation→Senior SWE"] --> PatchOK["✅ affectedRows: 1"]
    GetFound["GET existing employee ID"] --> GetOK["✅ full JSON detail returned"]
    GetMissing["GET non-existent employee ID"] --> GetNF["✅ payload size 0 →\n'not found' 200 response"]
    Bug["Closing live bug:\n'Error Handler does not provide\nname attribute on error'"] --> BugFix["Fixed: copy the correctly-formed\n'name' attribute from a working\nerror type onto the new one"]
```

---

## Quick Recap
- **Remove Variable** frees memory for heavy variables no longer needed — a hygiene practice, not a blanket rule.
- **PATCH's Update query follows the same left(=columns)/right(=values) mapping discipline as POST's Insert** — a genuinely common source of confusion.
- **RAML and implementation must stay in sync**: Design Center first, publish, then update BOTH the Studio dependency (pom.xml/Manage Modules) AND the API Kit Router's own API Definition reference — these are two separate version pointers.
- **The Validation module + Error Mapping** lets a generic error (e.g. `VALIDATION:INVALID_NUMBER`) be remapped to a meaningful custom type (`DB:NO_DATA_FOUND`), following the `NAMESPACE:IDENTIFIER` structure — but defining a custom type and actually mapping a component to raise it are two separate required steps.
- **Select always returns an array of objects**, even for a single matching row — Java format, converted to JSON via Transform Message, accessed via `payload[0]`.
- **"Not found" is a 200 success response, not an error** — implemented via `!isEmpty(payload)`, which also outperforms `sizeOf(payload) == 0` on large datasets.
