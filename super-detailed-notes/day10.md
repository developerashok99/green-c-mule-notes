# Day 10 — URI Parameters vs. Query Parameters, Pagination, Strict Validation

> **Sources:** audio transcript, existing notes, and the class video (recorded 14 Nov 2024). Slide text, drawings and Studio screens marked *slide*, *drawing* or *screen* are read from the recording. Slide images: [slides/day10](../slides/day10/).

## 1. Overview

URI and query parameters were introduced briefly on Day 06. This session explains them in depth because, as the instructor says, even developers with 3–6 years of experience confuse them, and **"what is the difference between URI params and query params, and when do you use each?"** is a frequent interview question.

1. URI parameters — meaning, when to use, syntax, multiple URI params
2. Query parameters — filter, sort, paginate
3. Pagination with `offset` and `limit`
4. The rule: mandatory → URI param, optional → query param
5. **Strict validation** in APIkit Router (query params, headers)
6. **`additionalProperties`** and length restrictions in RAML
7. Why best practices are not always followed — and when they matter most
8. Preview: the HTTP Request connector

Usually the architect or lead decides parameter design, but a developer who understands the reasoning can contribute to the discussion.

---

## 2. URI Parameters

### 2.1 Meaning

*Slide* — **URI PARAM:** URI stands for Unique Resource Identifier · It is also known as Path Param · It is used to identify unique instance of a resource and passed as a parameter in URL · `http://localhost:8081/employees/{empid}` · `http://localhost:8081/employees/101` · Demonstration in APS. (Written beside it later: "attributes.uriParams.empid".)

*Drawing:* XYZ company → 50 employees → DB → employees. Table: Mahesh **100** Manager 200000 active · Dinesh **101** Lead 150000 active · Ramesh **102** Developer 75000 active, with the IDs circled as the unique values. `/employees/{empid}` → `http://localhost:8085/employees/101`; nested example `/branches/{branchId}/accounts/{acId}` → `/branches/101/accounts/12345`.

- **URI** — the instructor expands it as "Unique Resource Identifier".
- Also called a **path parameter**, because it is **part of the resource path**.

```text
http://localhost:8081/employees/101
                      └───┬───┘ └┬┘
                      resource   URI parameter (employee ID)
```

> **Technical clarification:** the standard expansion of URI is **Uniform Resource Identifier**. The instructor's "unique" wording reflects how it is used: to identify a unique resource.

### 2.2 When to use

A REST API exposes **resources**, e.g. an *employees* resource that can be created, read, updated or deleted. To work with **one specific** resource, you need a value that identifies it **uniquely**.

**Why not the name?** If you fetch by name "Mahesh" and there are 10 employees named Mahesh, you get 10 results. An **employee ID** is unique to one employee — use it as a URI parameter.

Other examples: **bank account number**, **customer ID** — each is unique to one customer.

> Use a URI parameter when the value **uniquely identifies a resource** and is **mandatory**. Without it the request makes no sense: `GET /employees/` — which employee?

### 2.3 Where it is defined

In the resource path — either in the **Listener path** or, normally in real projects, in the **API specification (RAML)**:

```text
Listener path:   /employees/{empId}
Request:         GET http://localhost:8081/employees/101
```

### 2.4 Reading it in Mule

URI parameters arrive in **attributes**:

```dataweave
attributes.uriParams.empId          // → "101"
```

Case matters: `uriParams` — lower-case **u**, upper-case **P**. The key must match the name in the path exactly. (The slide writes the key as `empid` — `attributes.uriParams.empid`; `empId` is used in these notes for readability.)

### 2.5 Multiple URI parameters

**Example:** each department in a company has a unique department ID; within it, each employee has an ID. (The class drawing used a bank: `/branches/{branchId}/accounts/{acId}` → `/branches/101/accounts/12345`.)

```text
/departments/{deptId}/employees/{empId}
GET /departments/10/employees/101
```

```dataweave
attributes.uriParams.deptId     // "10"
attributes.uriParams.empId      // "101"
attributes.uriParams            // all URI params: { deptId: "10", empId: "101" }
```

Writing just `attributes.uriParams` (or `attributes.queryParams`) without a key returns **all** of them as key–value pairs.

---

## 3. Query Parameters

### 3.1 Syntax

```text
/employees?key1=value1&key2=value2
          │           │
          ?  starts   & separates pairs
```

### 3.2 When to use

*Slide* — **QUERY PARAM:** Query Param is used to filter, sort and paginate the collection of a result · It is passed as key-value pair at the end of URL after a question mark · `http://localhost:8081/employees?status=active` (annotated: *key* = status, *value* = active; `key1=value1&key2=value2`) · Demonstration in APS.

> Query parameters are used to **filter**, **sort** and **paginate** a collection of results.

### 3.3 Filter — example 1: employee status

**Scenario:** a company has 50 employees:

| Status | Count |
|---|---|
| active | 45 |
| inactive (resigned/left) | 3 |
| other (e.g. resigned, still serving notice) | 2 |

**Requirement:** fetch all employees who left.

```text
GET /employees?status=inactive
```

In Mule:

```dataweave
attributes.queryParams.status       // "inactive"
```

Used in the query:

```sql
SELECT * FROM employees WHERE status = :status
-- input parameter: { status: attributes.queryParams.status }
```

*Drawing:* of 50 employees, 45 active, 3 inactive, 2 resigned. `GET /employees?status=active` → "Result → 45 employees"; with `status=inactive` the same API returns the inactive ones.

Result: the 3 inactive employees. Send `status=resigned` and the query automatically returns those instead.

**Student question: isn't a URI param also a filter?**
It also narrows results, but to **exactly one unique** resource (employee 101). `status=inactive` can match 0, 5, 10 or 20 employees — not unique — so it is a **query parameter**.

### 3.4 Filter — example 2: bank statement

A customer selects a date range in a mobile banking app, e.g. **10 Nov 2024 to 12 Nov 2024**.

```text
GET /statement?fromDate=10-11-2024&toDate=12-11-2024
(account number sent in the body)
```

The back end returns transactions between those dates.

### 3.5 Sort

**Requirement:** active employees sorted by salary.

```text
GET /employees?status=active&orderBySalary=asc     (or desc)
```

| Employee | Salary | Order (ascending) |
|---|---|---|
| Ramesh | 75,000 | 1 |
| Dinesh | 1,50,000 | 2 |
| Mahesh | 2,00,000 | 3 |

*Drawing (Q1):* "list of active emps → 45 → sort them in asc order by name" → `http://localhost:8081/emps?status=active&orderBySal=asc` (sort by name: ASC or DESC; Dinesh, Mahesh, Ramesh).

**Why follow the standard?** Traffic-rule analogy: with common rules, everyone travels more safely. With standards, anyone looking at an API immediately knows "this is a query parameter, this is the body, this is the main data".

### 3.6 Paginate

#### The problem

A company has **10,000 employees**, of which **8,500 are active**. Loading 8,500 records at once on a UI screen needs a lot of memory and time. Loading **100 at a time** is easy.

**Pagination** = sending results in consecutive chunks (pages).

#### `offset` and `limit`

| Parameter | Meaning |
|---|---|
| `limit` | How many records to send each time |
| `offset` | How many records to skip — where to start |

**Example with limit = 100:**

| Page | offset | limit | Records |
|---|---|---|---|
| 1 | 0 | 100 | 1–100 |
| 2 | 100 | 100 | 101–200 |
| 3 | 200 | 100 | 201–300 |
| 5 | 400 | 100 | 401–500 |

**Example with limit = 15 (e-commerce listing):** search "Samsung phones under ₹20,000" returns ~50 phones. The app shows 15 per page:

```text
Page 1: GET /phones?offset=0&limit=15     → 1–15
Page 2: GET /phones?offset=15&limit=15    → 16–30
Page 3: GET /phones?offset=30&limit=15    → 31–45
Page 4: GET /phones?offset=45&limit=15    → 46–50 (whatever remains)
```

*Drawings:*
- **Pagination** — "Flipkart → Samsung phone under 20000"; a phone screen showing **15** at a time; 15 + 15 + 15 + 15 + 15 + 15 + 10; loading everything → "more time"; "500 results" written at the side.
- **Limit/offset** — "100 results": `Limit=10, offset=0` · `Limit=10, offset=10` · `L=10, O=20` · `L=10, O=30` → pages 1, 2, 3, 4 … 10 (records start at 1, 11, 21 …).

The page size can be changed later (e.g., to 100 if the app gets faster) because the values are dynamic.

#### How is the page size decided?

Not randomly — through discussion and **performance testing**. E.g., 25 records may load in 75 ms; a larger page may be too slow for customers.

#### Business context

| Scenario | Does a slow response matter? |
|---|---|
| Customer searching phones on Flipkart (illustrative) | **Yes.** If it takes 10 seconds, the customer goes to Amazon or Google → business loss |
| HR fetching all employees who resigned this month (internal) | **No.** They can wait 5 seconds; no customer impact |

Design depends on who is waiting and what it costs.

**Instructor's experience:** pagination is a less frequent requirement; filter and sort are more common.

---

## 4. The Rule: Mandatory vs. Optional

> If the parameter is **mandatory** to identify a resource → **URI parameter**.
> If it is **optional** — used to filter, sort or paginate → **query parameter**.

Test:

- `GET /employees/` without the ID → meaningless. → ID is a URI parameter.
- `GET /employees?status=active` without `orderBySalary` → still works, but unsorted. Without `status` → returns all employees. → query parameters are optional.

A REST API request is made of: protocol, host, port, resource path, method, URI params, query params, headers, authorization, body. Understanding each one avoids designing requests randomly.

---

## 5. Strict Validation (APIkit Router)

### 5.1 Is there a limit on the number of query parameters?

The HTTP standard doesn't limit it. Your API specification declares which query parameters are expected.

### 5.2 The common misconception

> "I declared 5 query parameters in RAML, so if a client sends more than 5, they'll be rejected automatically."

**Wrong.** By default the extra parameters are **accepted**.

### 5.3 Why it matters — attack scenario

A hacker sends **125 query parameters** (instead of 5) with a huge amount of data. If nothing restricts it, the application may **crash**.

*Drawing:* "5 QP" declared, but the client sends ① string ② number ③ 50 ④ 20 more … → "125 QP" → **APIkit → strict validation**. A second sketch: an e-commerce mobile app (MA) → Flipkart API → back end, where "5 QP → 100 QP" is sent.

### 5.4 Where to fix it

After designing the API in RAML and importing it into Studio, the generated project has an **APIkit Router** (covered later). Its configuration has:

- **Query parameters strict validation**
- **Headers strict validation**

*Screen* — **Global Element Properties → Router** (project `hr-employees-sapi`), Router configuration tab:

| Field | Value |
|---|---|
| Name | `hr-employees-sapi-config` |
| API Definition | `hr-employees-sapi` |
| Outbound headers map name | `outboundHeaders` |
| HTTP status var name | `httpStatus` |
| ☐ Keep RAML/OAS base URI | |
| ☐ Disable Validations | |
| ☐ Query parameters Strict Validations | ← enable |
| ☐ Headers Strict Validations | ← enable |
| Parser | AUTO (Default) |

When enabled, only the query parameters/headers declared in the API specification are allowed; others are rejected with **400 Bad Request**.

**Instructor's note:** they ask this in interviews to people with 5–6 years of experience. Many say "it will be restricted automatically" — that's a myth.

### 5.5 Why not for URI parameters?

URI parameters are part of the URL path; the path either matches the defined resource or not, so extra URI params can't be sent.

### 5.6 Changing the allowed parameters later

If 2 more query parameters are needed, update the API specification (5 → 7) and the new ones will be accepted.

---

## 6. Restricting the Body: `additionalProperties`

### 6.1 The same myth for the request body

A RAML type describes the request body — e.g. for creating an employee (POST): employee ID, name, salary, active, designation.

> **`additionalProperties`** controls whether fields **not** defined in the type are accepted.

- **Default: `true`** — extra fields are accepted.
- Set to **`false`** — extra fields are rejected with an error.

*Screen* — the class project's request type, `dataTypes/requests/createEmpReqDataType.raml` (from the `hr-employees-sys-app` API spec):

```raml
#%RAML 1.0 DataType
type: object
properties:
  empId:
    description: emp id indicates the employee id of an employee and it should be unique
    type: string
    required: true
    example: P10300
  empName:
    type: string
    required: true
    example: mahesh
  empSalary:
    type: number
    required: true
    example: 50000
  active:
    type: boolean
    required: true
  # … empDesignation follows
```

Matching example request: `{"empId": "P10300", "empName": "Suresh", "empSalary": 80000, "active": true, "empDesignation": "software engineer"}`.

This type has **no** `additionalProperties` line, so extra fields are accepted. To reject them, add it under `type: object`:

```raml
type: object
additionalProperties: false
properties:
  ...
```

Body restrictions are set in **RAML**; header and query-parameter strictness is set in the **APIkit Router**.

### 6.2 Length restrictions

Each field should also be restricted. A plain `string` accepts any length.

*Screen* — `traits/headersTraits.raml` from the class project:

```raml
#%RAML 1.0 Trait
headers:
  transaction-id:
    description: transaction id is used to track the request in the api led architecture
    type: string
    required: true
    minLength: 20
    maxLength: 20
    example: abc12345qqqqqqqqqqbb
  origin:
    description: origin header helps to identify the system from where the transaction is initiated
    type: string
    required: true
    enum:
      - mobile
      - webApp
    example: webApp
  language:
    ...
```

`enum` is another restriction: `origin` accepts only `mobile` or `webApp`. The same idea for a body field:

```raml
employeeId:
  type: string
  minLength: 20
  maxLength: 50
```

- `minLength 20, maxLength 50` → 20–50 characters accepted.
- `minLength 20, maxLength 20` → exactly 20 (the class `transaction-id`); anything else → error.

---

## 7. Why Aren't Best Practices Always Followed?

**Student:** these are best practices — why don't teams follow them?

**Instructor's answer:** human nature. Like traffic rules — of 100 rules people follow 50. If the architect is strict, the team must follow. **Instructor's observation:** in the organisations they currently work with, strict validations are not enabled. When their team faced an issue once, they found this option in APIkit Router. It's better to plan these things during architecture.

### When it really matters — external consumers

**Illustrative example:** ICICI Bank ties up with 10 NBFCs (Non-Banking Financial Companies, e.g. Aditya Birla, Bajaj Finance) to approve and disburse loans for their customers. The bank's API is consumed by its own apps and by those **third parties**. With many external consumers, strict validation is strongly recommended.

### Attack scenario — security alone is not enough

```text
Internet ──► Experience API (secured: username/password)
                  │
                  ▼
             Process API ──► System API 1 ─► System 1
                         ──► System API 2 ─► System 2
                         ──► System API 3 ─► System 3
                         ──► System API 4 ─► System 4
```

- An insider who **knows the valid username and password** wants to crash the app.
- He sends correct credentials but puts **5 lakh characters** into one query parameter.
- Security passes (credentials are valid). The huge value travels into the application, which can't handle it → **crash**.
- With a length restriction (e.g. 20 characters), the request is rejected at validation.

> Decide how strong your validation must be. An API exposed to the internet needs the highest level.

---

## 8. Preview — HTTP Request Connector

Next sessions cover the common "80% requirements" one by one. First: **consuming a third-party service**.

*Slide* — next session's **Agenda for today:** Consume REST Service · Demonstration of consume REST service in APS · Q&A session.

- HTTP module → **Request** operation (the counterpart of Listener).
- Listener **exposes** your API; Request **calls** another API.
- Present in almost every project, so it gets 2–3 sessions, covering its important parameters in depth.

---

## 9. Important Terminology

| Term | Meaning |
|---|---|
| Resource | Entity exposed by a REST API (e.g. employees) |
| URI parameter / path parameter | Value in the path that uniquely identifies a resource |
| Query parameter | `?key=value` pairs for filter, sort, paginate |
| Filter | Return only matching records |
| Sort | Order the records (asc/desc) |
| Pagination | Return results in chunks |
| offset / limit | Records to skip / records per page |
| APIkit Router | Component generated from RAML that routes and validates requests |
| Strict validation | APIkit option to reject undeclared query params/headers |
| additionalProperties | RAML option to allow/reject undeclared body fields (default true) |
| minLength / maxLength | String length restrictions |
| NBFC | Non-Banking Financial Company |

---

## 10. Interview Questions

### Q1. What is the difference between URI parameters and query parameters?
URI parameters are part of the path and uniquely identify a resource (e.g., `/employees/101`); they are mandatory. Query parameters are appended after `?` and are optional, used to filter, sort or paginate a collection.

### Q2. When would you use a URI parameter?
When a value uniquely identifies the resource — employee ID, account number, customer ID.

### Q3. Give examples of query parameter usage.
`/employees?status=inactive` (filter), `?orderBySalary=asc` (sort), `?offset=100&limit=100` (pagination), `?fromDate=…&toDate=…` (date-range filter).

### Q4. How do you access them in Mule?
`attributes.uriParams.<name>` and `attributes.queryParams.<name>`.

### Q5. Explain pagination with offset and limit.
`limit` = records per page, `offset` = records to skip. Page n with limit L has offset (n−1)×L. Page 3 with limit 100 → offset 200 → records 201–300.

### Q6. If RAML declares 5 query parameters and a client sends 10, what happens?
By default the extra ones are accepted. To reject them, enable **query parameters strict validation** in APIkit Router (and **headers strict validation** for headers).

### Q7. How do you reject unexpected fields in the request body?
Set `additionalProperties: false` on the RAML type. The default is true.

### Q8. Why validate string lengths if the API is already secured?
A caller with valid credentials can still send a huge value that crashes the application. `minLength`/`maxLength` rejects it before it reaches processing.

### Q9. Why isn't strict validation needed for URI params?
They are part of the fixed path; extra ones cannot be added without changing the path.

---

## 11. Must Remember

1. **URI param** = in the path, **unique**, **mandatory** (`/employees/101`).
2. **Query param** = after `?`, **optional**, for **filter / sort / paginate**.
3. Access: `attributes.uriParams.x`, `attributes.queryParams.x` (no key → all of them).
4. Multiple URI params: `/departments/{deptId}/employees/{empId}`.
5. Pagination: **offset** = skip, **limit** = page size; size decided by performance testing.
6. Response time matters more for customer-facing APIs than internal ones.
7. RAML alone does **not** reject extra query params/headers → enable **APIkit strict validation**.
8. **`additionalProperties`** defaults to **true** → set `false` to reject extra body fields.
9. Add **minLength/maxLength** — authentication alone doesn't stop oversized input.
10. Next: **HTTP Request** connector for consuming third-party APIs.
