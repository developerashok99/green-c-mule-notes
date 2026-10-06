# Day 30 — Remove Variable, Keeping RAML in Sync, PATCH and GET Implementation, Validation Module and Error Mapping

> **Sources:**
> - Audio transcript, existing notes, and the class video (recorded 17 Dec 2024).
> - Code, configuration and output marked *screen* are read from the recording.
> - Slide images: [slides/day30](../slides/day30/).

## 1. Overview

1. **Remove Variable**
2. Insert query: hard-coded values vs. input parameters
3. Enriching the POST response — and why the **RAML must be updated** first
4. Updating the spec: Design Center → publish 1.0.1 → update dependency in Studio → **update the APIkit router's API definition**
5. PATCH: Update query, left/right mapping
6. Checking "no rows updated" — **Validation module** (`Is number`) and **error mapping** to a custom type
7. GET: Select query, response is an **array of objects** in Java, mapping with `payload[0]`
8. **Choice**: data found vs. "not found" (200); `isEmpty` vs. `sizeOf`
9. Testing; a student's error-handler bug

---

## 2. Remove Variable

- The **Remove Variable** component deletes a variable by name. One component per variable.
- Once a variable is no longer needed, removing it **frees the memory** for other parts of the application.
- Small variables don't matter much; for **big** variables (e.g. a large saved payload) in long flows, remove them when done.
- At the end of a flow it isn't needed — everything is cleared anyway.

*Screen:* Remove Variable (Core) was dropped after the APIkit Router in `hr-employees-sapi-7303-main` to show it; its only setting is the variable **Name** (required).

---

## 3. Insert Query — Hard-Coded Values vs. Input Parameters

Values can be written directly in the query text (e.g. `'Active'`, a number) instead of input parameters.

**Example:** all new employees are **active** at creation; only an update can make them inactive. So status can be hard-coded:

```sql
insert into EMPLOYEES_INFO values (:emp_id, :emp_name, 'active', :emp_salary, :emp_designation);
```

(*Screen:* the actual query keeps `:emp_status` as an input parameter — `insert into EMPLOYEES_INFO values (:emp_id,:emp_name,:emp_status,:emp_salary,:emp_designation);` — the hard-coded `'active'` version above is the spoken alternative.)

**Why keep other mappings in input parameters?** Neat, presentable code: column names on one side, mappings on the other — clean even for big queries.

---

## 4. Enriching the POST Response — Update the RAML First

### 4.1 New response

*Screen — the reference sys-app's "Post Final Response Transformation":*

```dataweave
%dw 2.0
output application/json
---
{
  statusCode: 201,
  message: "employee details created successfully in the db",
  transactionId: vars.origAttributes.headers.'transaction-id',
  employyeId: vars.origPayload.empId      // sic — typo on screen
}
```

The class response uses the same shape with `employeeId` and the initial variables (`vars.headers.'transaction-id'`, `vars.requestPayload.empId`).

Returning the transaction ID and employee ID tells the source which request and which employee were created.

### 4.2 Why change the RAML

The implementation now returns extra fields that aren't in the RAML. **APIs are permanent; people change.** A new team member checks the RAML first; if it doesn't match the implementation, they're confused, and may give consumers/third parties the wrong structure.

> - Keep the specification and implementation **consistent**.
> - Change the spec in **Design Center**, publish, and update Studio.
> - If urgent, change in Studio first, then update Design Center.

(The spec inside `src/main/resources/api` as an Exchange dependency is **read-only** in Studio. Importing the RAML as files into that folder makes it editable, but the normal flow is Design Center.)

### 4.3 Steps in Design Center

1. Update the POST **response example** (`examples/responses/...`) with `transactionId` and `employeeId`.
2. Update the POST **response data type** with the same properties.
3. Errors like "should have required property transactionId" mean example and type don't match yet. *Screen:* the pasted example had **unquoted keys** (copied from DataWeave), so Design Center showed `Syntax error : Expecting '"' but 'statusCode' found` (and for `message`, `transactionId`, `employeeId`) — JSON keys must be in double quotes.
4. **Publish** → *screen:* Publishing to Exchange with **Asset version 1.0.1** ("1.0.0 published 5 days ago"), **API version v1**, LifeCycle **Stable**.

### 4.4 Update the dependency in Studio

Studio is **not** updated automatically.

- Right-click the project → **Manage dependencies / modules** → API specs → select it → **Update version** (choose 1.0.1) → Apply and close.
- If that option doesn't appear: edit the version in **pom.xml** directly (1.0.0 → 1.0.1). *Screen:*

```xml
<dependency>
  <groupId>9756392d-0db8-4065-b2c4-989d3e2d4e05</groupId>   <!-- Anypoint org ID -->
  <artifactId>hr-employees-sapi-7303</artifactId>
  <version>1.0.1</version>
  <classifier>raml</classifier>
  <type>zip</type>
</dependency>
```

**Question: will re-scaffolding overwrite implemented flows?** No. For a **new** resource only an empty flow is generated; existing resource flows remain.

### 4.5 Update the APIkit router configuration — a live bug

After updating, a request failed: **"RAML not found / resource not found"**.

**Cause:** the **APIkit router configuration's API definition** (in global-config) referenced the spec **with the version**, so it searched for 1.0.0. *Screen:* API Definition `resource::9756392d-0db8-4065-b2c4-989d3e2d4e05:hr-employees-sapi-7303:1.0.0:raml:zip:hr-employees-sapi-7303.raml`; console `Raml not found at: resource::…`.

**Fix:** edit the router configuration → change the API definition to **1.0.1** → save → rebuild. Works.

> After updating a spec version, update **both** the dependency (pom.xml) **and** the router configuration's API definition when it includes the version.

---

## 5. PATCH — Update Query

### 5.1 Query

*Screen — Update "Update Employee Details in HR DB"* (connector config `MySQL80_Database_Config`):

```sql
UPDATE EMPLOYEES_INFO SET emp_salary = :emp_salary, emp_designation = :emp_designation WHERE emp_id= :emp_id;
```

Input parameters (fx):

```dataweave
{
  emp_salary: payload.empSalary,
  emp_designation: payload.empDesignation,
  emp_id: payload.empId
}
```

### 5.2 Left side vs. right side

> **Left side = keys** — placeholders, named like the **table columns** (what we send to the other system).
> **Right side = values** — mapped from our **payload or variables**.

Many developers get confused about this.

### 5.3 Scope

Here only salary and designation change (promotion). If the requirement allows changing many fields (first name, last name, phone…), build the query for that — complexity follows the requirement.

**Multiple queries?** One query per operation. For several, use **Execute Script** (multiple statements) or a **stored procedure** (instructor hasn't tried this).

Same logging as POST: start/end loggers, before/after DB loggers.

### 5.4 Test

- Employee 1000 → salary 1,00,000, designation "Senior Software Engineer".
- Response payload: **`affectedRows: 1`**.
- Verified in Workbench.

*Screen:* `PATCH http://localhost:8081/api/employees` with `{"empId": 1000, "empSalary": 100000, "empDesignation": "senior software engineer"}` → **200** `{"statusCode": 200, "message": "employee details updated successfully in the db"}`.

---

## 6. When No Row Is Updated — Validation Module

### 6.1 Problem

PATCH for an employee ID that doesn't exist → `affectedRows: 0` → no error, but nothing was updated. We should return an error.

### 6.2 Validation module

> The **Validation module** validates values — whether something is a number, an email, an IP, a URL, null, empty/blank string, empty collection (array), true/false, …

Add it via **Add Modules**.

### 6.3 `Is number`

| Field | Value |
|---|---|
| Value | `#[payload.affectedRows]` (fx) |
| Number type | INTEGER (options: DOUBLE, FLOAT, INTEGER, LONG, SHORT) |
| Minimum value | 1 |
| Maximum value | 1 |
| Message | "Employee doesn't exist in HR database" (*screen*; also suggested: "No data updated for the employee passed in the request") |

If the value isn't exactly 1 → raises **`VALIDATION:INVALID_NUMBER`**.

When using min/max, test the boundaries (e.g. for an age range 18–65, check 18 and 65 behave as expected).

### 6.4 Error mapping

The error handler has a custom type **`DATABASE:NO_DATA_FOUND`**. Map the validation error to it: `Is number` → **Error Mapping** tab:

| Source (component's error) | Target (custom) |
|---|---|
| `VALIDATION:INVALID_NUMBER` | `DATABASE:NO_DATA_FOUND` |

- *Screen:* the class's Error Mapping picker on Is number offers ANY, VALIDATION:INVALID_NUMBER, EXPRESSION, STREAM_MAXIMUM_SIZE_EXCEEDED, then "Mapping to custom error": Namespace (default `APP`) + Identifier — typed as `DATABASE` / `NO_DATA_FOUND`.
- Error mapping is available on components that raise errors (DB, HTTP Request, Validation…), not on Logger. **Instructor's observation:** mostly used with the Validation module.
- Format: **`NAMESPACE:IDENTIFIER`**, like `HTTP:CONNECTIVITY`, `DB:CONNECTIVITY`. Here namespace `DATABASE`, identifier `NO_DATA_FOUND` (names are your choice but must be meaningful).
- Certification-style question: if a DB connectivity error is mapped to a custom type, the handler must match the **custom** type, not the original.

### 6.5 Deployment failure before mapping

When the handler referenced `DATABASE:NO_DATA_FOUND` but nothing raised that type, **deployment failed** — the error type didn't exist anywhere in the app. After adding the mapping, it deployed.

> **Technical clarification:** Mule validates at deployment that every error type referenced in handlers exists (built-in, mapped or raised). A custom type must be produced somewhere (error mapping or Raise Error).

### 6.6 Result

PATCH with a non-existent ID → `affectedRows: 0` → `Is number` fails → mapped to `DATABASE:NO_DATA_FOUND` → no handler in the implementation flow → propagated to the main flow → matched → status and payload with `error.description` ("Employee does not exist in HR database"). (Status 500 was used randomly; decide with the team, e.g. 404.)

*Screen:* PATCH with `empId: 10000` → debugger shows `errorType VALIDATION:INVALID_NUMBER`, description "Employee doesn't exist in HR database" → Postman **500** `{"statusCode": 500, "message": "Employee doesn't exist in HR database"}`.

### 6.7 Alternative

A **Choice** (`payload.affectedRows == 0`) with **Raise Error** in that route works too. Validation also has **Is true / Is false**: e.g. `Is false` on `payload.affectedRows == 0`.

---

## 7. GET — Select Query

### 7.1 Query

*Screen* (reference sys-app's `fetch-employee-implementation-flow`, copied into the class `get-employee-implementation-flow`):

```sql
select * from EMPLOYEES_INFO where emp_id=:emp_id;
```

```dataweave
{ emp_id: attributes.uriParams.empid }
```

`vars.uriParams.empid` (from initial variables) works too.

### 7.2 Response format

- The DB returns **Java** format.
- A Select can return many rows, so the result is an **array of objects** — one object per row (like a JSON array of employees). Even with one matching row, it's an array with one object.
- In the debugger: `size: 1`, element `[0]` is a map (hash map) of columns.

### 7.3 Mapping

*Screen — "Get Employee Final Response"* (worked out in the DataWeave Playground first):

```dataweave
%dw 2.0
output application/json
---
{
  empId: payload[0].emp_id,
  empName: payload[0].emp_name,
  empSalary: payload[0].emp_salary,
  active: if(payload[0].emp_status=="active") true else false,
  empDesignation: payload[0].emp_designation
}
```

**Live bug (screen):**
- The first version used the response names on the right too (`payload[0].empId`, `payload[0].empName` …).
- GET `/api/employees/1000` returned **200 with every field `null`** except `active`.
- The debugger's *Evaluate DataWeave expression* with `payload[0].emp_id` … showed the real values — the keys must match the **DB column names**.

- **Left side** = our response fields (as per the consumer's contract); **right side** = DB values.
- `output application/json` converts Java → JSON.

---

## 8. Employee Not Found — Success, Not Error

**Decision (class):** if the employee doesn't exist, return a **success (200)** with a message like "Employee details not found in the database", rather than an error.

```text
Database Select
Choice
  ├── when: not isEmpty(payload)  → Transform Message (employee details)
  └── default                     → Transform Message (output JSON)
                                      { message: "Employee details not found in the database" }
```

### `isEmpty` vs. `sizeOf`

- `sizeOf(payload) > 0` works.
- **Instructor's view:** for large payloads (e.g., 100 objects), `sizeOf` counts everything; `isEmpty` just checks whether data exists → better performance.
- `!` (or `not`) reverses the condition: `!isEmpty(payload)`.

> **Technical clarification:** for an in-memory array both are cheap; the difference matters mainly for streamed data, where counting requires reading the whole stream.

### Test

- GET `…/employees/1000` (exists) → `size 1` → mapped details → 200. *Screen:* `{"empId": 1000, "empName": "Suresh", "empSalary": 100000.0, "active": true, "empDesignation": "senior software engineer"}`.
- GET non-existent ID → `size 0` → default route.
  - *Screen:* GET `/api/employees/1000111` → **200** `{"message": "employee details not found in the database"}`.
  - The first try returned Java (no `output application/json` in that Transform Message); after adding it, the JSON message returned.
- Port **6666** (debugger) was busy because the app was already running — stop it before debugging again.

> If you know the navigation in the debugger, 50–60% of the work is done.

---

## 9. Student Bug

**Error (screen):** `mvn clean package` → BUILD FAILURE: `[common/common-error-handling.xml:8]: Global element 'error-handler' does not provide a name attribute`.
**Cause:** the student's file had a second top-level `<error-handler>` with no `name` (the first one, `common-error-handlingError_Handler`, was fine). Every global error handler needs a `name` so flows can reference it.
**Fix:** give it a name (or merge the On Error Propagate blocks into the named handler) and make sure the referenced error handler name matches.

---

## 10. Important Terminology

| Term | Meaning |
|---|---|
| Remove Variable | Deletes a variable to free memory |
| Spec version | e.g. 1.0.0 → 1.0.1 after republishing |
| Manage dependencies | Studio option to update Exchange dependencies |
| Router API definition | APIkit config pointing to the spec (may include version) |
| `affectedRows` | Rows changed by Update/Insert |
| Validation module | Checks values (Is number, Is email, Is not empty, …) |
| Error mapping | Converts a component's error type to a custom one |
| `NAMESPACE:IDENTIFIER` | Error type format |
| Array of objects | Select result: one object per row |
| `payload[0]` | First element |
| `isEmpty` / `sizeOf` | Emptiness check / count |
| Execute Script / stored procedure | Running multiple SQL statements |

---

## 11. Interview Questions

### Q1. What does Remove Variable do?
Deletes a variable so its memory is freed — useful for large variables no longer needed.

### Q2. You changed the response structure. What else must change?
The RAML (example and data type) in Design Center; publish a new version; update the dependency in Studio and the APIkit router configuration's API definition if it includes the version.

### Q3. What does a Database Select return?
An array of objects (Java), one per row — even for one row. Access with `payload[0]`.

### Q4. How do you detect that an Update affected no rows?
Check `payload.affectedRows`; e.g. Validation `Is number` with min/max 1 or a Choice with Raise Error.

### Q5. What is error mapping?
A component setting that converts its error type (e.g. `VALIDATION:INVALID_NUMBER`) into a custom type (e.g. `DATABASE:NO_DATA_FOUND`) handled by your error handler.

### Q6. Why did deployment fail when the handler referenced a custom error type?
Because no component raised or mapped that type; Mule validates error types at deployment.

### Q7. Should "record not found" be an error?
It depends on the agreed design; here the team chose a 200 with a "not found" message for GET.

### Q8. `isEmpty` or `sizeOf`?
`isEmpty` checks existence; `sizeOf` counts — `isEmpty` is preferred for large/streamed data.

---

## 12. Must Remember

1. **Remove Variable** frees memory; use it for big variables mid-flow.
2. Values can be hard-coded in SQL (e.g. status `'Active'` on insert); keep others as input parameters for neatness.
3. Change the **RAML first** (example + data type), **publish** (1.0.1), update the **Studio dependency**.
4. Also update the **APIkit router config's API definition** version — else "resource not found".
5. Re-scaffolding doesn't overwrite existing flows.
6. Input parameters: **left = column-named keys, right = payload/variable values**.
7. `affectedRows: 0` → **Validation Is number (min 1, max 1)** → **error mapping** to `DATABASE:NO_DATA_FOUND`.
8. Custom error types must be raised or mapped somewhere, or deployment fails.
9. Select returns an **array of objects** in Java → `payload[0]`, convert to JSON.
10. GET not found → **Choice** with `!isEmpty(payload)` → 200 "not found" message.
