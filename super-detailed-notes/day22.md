# Day 22 — Designing the Employee API: Counting APIs, Naming, JSON Validation, the Design Document and Project Documentation

## 1. Overview

Continuing the employee use case before writing RAML:

1. Source systems and how many Experience/Process/System APIs are needed
2. Who else can call our APIs
3. Naming conventions (kebab-case, `-sapi`, keep names short)
4. Validating JSON (online validators, Postman, smart-quote problems)
5. Why JSON is popular
6. The design document: requests, responses, field rules, mandatory fields, schema
7. Where tokens and correlation IDs go (headers) — and the gateway
8. The system API specification in the design document (headers, body, field levels)
9. Mapping sheets and documentation (Confluence, diagrams, sequence diagrams)
10. Copy-paste and reuse

---

## 2. How Many APIs Are Needed?

### 2.1 Source

The **source** is where the request starts — here the HR front-end (mobile or web).

### 2.2 Interview-style example

**Scenario:** two experience systems (mobile app, web app), two back-end systems (database, Salesforce), one simple functionality.

```text
Mobile app ──► Experience API (mobile) ─┐
                                        ├──► Process API ──► System API (DB) ──► Database
Web app   ──► Experience API (web)    ─┘                └──► System API (SF) ──► Salesforce
```

| Layer | Count | Why |
|---|---|---|
| Experience | 2 | One per experience system |
| Process | 1 | One functionality; **reused** by both experience APIs |
| System | 2 | One per back-end system |
| **Total** | **5** | |

**Why separate experience APIs?** The web app has more screen space and may need **more data**; the mobile app less. The process API returns the same data to both; each experience API shapes it for its consumer.

### 2.3 Who else can call our APIs?

- Front-end applications (mobile, web).
- Other companies' APIs.
- Other departments in our company — e.g. finance or marketing team APIs calling our experience API.
- Our own APIs internally (experience → process → system).

### 2.4 Interview question

"What source and target systems have you worked on?" — answer with the systems in your project (e.g. web/mobile front-ends; database, Salesforce).

---

## 3. Naming Conventions

Names are decided from the context: business functionality (employee), layer (experience/process/system), source/target.

- **Keep names short** — CloudHub limits app names to 42 characters; long names are rejected.
- Most organisations use **kebab-case**: every word separated by a **hyphen** (`-`), not an underscore.
- Examples of styles: `hr-employee-exp-api`, `hr-employee-sys-api`, or with abbreviations like **`hr-sapi`** (SAPI = system API).
- Each organisation follows its own structure; any name works technically. Follow your team's convention.

(Example names are illustrative.)

---

## 4. Validating JSON

### 4.1 Tools

- Online validators (e.g. "JSON validator online", jsonlint). Some companies **block** such external sites.
- **Postman**: Body → raw → JSON — it highlights invalid JSON (without always showing the exact position).

### 4.2 What to check yourself

- Objects in `{ }`, arrays in `[ ]`.
- **Keys in double quotes.**
- Commas between properties — **no trailing comma** after the last one.
- Double quotes copied from slides/documents can be **different characters** ("smart quotes") that look the same but break JSON. Retype them.

### 4.3 Live debugging

A validator showed: `Error: Parse error … Expecting 'EOF'` near `"active": true`. Cause: a **comma** at the end. Removing it fixed the error; then "bad string" errors appeared from copied double quotes.

**Instructor's advice:** read error messages 4–5 times; they become easy to understand.

---

## 5. Why JSON Is Popular

1. **Human-readable** — easy to understand.
2. **Lightweight**.
3. **Easily used by many programming languages**.

**Student question: how do you know which language a front-end is written in?** The instructor doesn't know and has no front-end experience; front-end developers know. HTML/CSS/JavaScript/React applications can all call our API.

---

## 6. The Design Document (API Blueprint)

### 6.1 Request (create employee)

Example request body (illustrative field set based on the class):

```json
{
  "employeeId": "E1001",
  "employeeName": "Mahesh",
  "employeeSalary": 100000,
  "employeeDesignation": "Software Engineer",
  "active": true,
  "dateOfJoining": "2024-10-25",
  "hobbies": ["reading books"]
}
```

### 6.2 Responses

**Success:** a JSON object (e.g. a message confirming creation, with the employee ID).

**Error:** a status code and a message:

| Situation | Status code |
|---|---|
| Consumer sends wrong data | 400 Bad Request |
| Our database is down | 500 |

The design document — request, response, error response — is the **understanding between consumer and service provider** (an "API blueprint").

### 6.3 Many fields? Don't panic

A request may have 120 fields. Break them down **one by one**: name, type (string, number, boolean…), mandatory or optional, length. Note them; discuss unclear ones with the team lead.

### 6.4 Mandatory vs. optional

- Decided by **team leads / business** in the initial discussion, not by the developer alone.
- **Example:** `employeeId` is **mandatory** — it is the **primary key**; without it the DB record can't be inserted.

### 6.5 Schema

> The schema defines the structure: "this body is an object; it has key `employeeId` of type string with max length 20; key `employeeSalary` of type number; …"

In RAML a property is **required by default**; mark it `required: false` (or `?`) to make it optional. Length rules are written as `minLength` / `maxLength`.

---

## 7. Tokens, Correlation IDs and the Gateway

### 7.1 Where does a token go?

**Student question:** can we send the token in the body?

Technically yes — nothing breaks. But it's not the standard (traffic-rule analogy again). **Tokens and correlation IDs go in headers**; the **body** carries the main business data for processing.

### 7.2 Gateway flow

```text
HR app ──(1) get token from authorisation server
       ──(2) request + token in header ──► API Manager / gateway (policy)
                                             │ token valid?
                                             ├─ yes → Experience API
                                             └─ no  → rejected; never reaches the API
```

The real architecture is more layered than "consumer → API"; policies sit in the gateway. Explained fully in the policies sessions.

### 7.3 Correlation ID

A unique ID per request, sent in a header, used for **traceability** across APIs and logs. Not used for main processing.

---

## 8. The Employee API Design

### 8.1 Resource and methods

`/employees` with **POST** (create), **PATCH** (partial update), **GET** (fetch, using the employee ID as a URI parameter — the unique resource identifier).

For each: query params (none), URI params, headers, body, method, protocol (HTTP/HTTPS), data format (JSON), success response, error response.

### 8.2 Which layer?

Ideally experience, process and system APIs, each with its own request/response. For this simple use case the class builds one API to cover the concepts (from Day 23 it is the system API `hr-employees-sapi`).

> **Transcript unclear:** this part of the recording is badly garbled (long repetition loops), so the exact reasoning for building a single API, and parts of the document walkthrough below, could not be fully recovered.

**Another scenario:** an experience API must talk to an Oracle database and a MySQL database → two system APIs, each with its own request/response.

### 8.3 System API section of the document

A typical system API design document lists:

| Item | Example content |
|---|---|
| Resource / endpoint | the system API path and method |
| Headers | e.g. `transactionId` — string, min/max length (e.g. 32 characters), mandatory; `originMarket` — country from which the transaction is initiated, string, mandatory; `client_id` — passed as a header because **client ID enforcement** policy applies (internal API) |
| Query / URI params | none (if not listed, they don't exist) |
| Request body | example plus **field rules**: name, type, length, mandatory, **level** |
| Response body | example plus field rules (e.g. fields inside a `data` object are level 2) |
| Sequence diagram | experience → process → system → DB |

- "String 32" means a string of up to 32 characters, written in RAML as `minLength`/`maxLength`.
- **Field level:** a field directly in the root object is level 1; a field inside a nested object (e.g. `data`) is level 2.

**Instructor:** with such a document, the developer's job is straightforward — follow the structure, understand the systems, talk to leads and peers, and within 1–2 months it becomes easy.

### 8.4 Mapping sheet

The system API must map request fields to database columns:

| API field | DB column |
|---|---|
| employeeId | employee_id |
| employeeSalary | employee_salary |
| employeeName | employee_name |
| employeeStatus | employee_status |
| designation | … |

In class the names matched; in real projects they often don't. Work out the mapping — if unclear, ask the business: "Please arrange a call and let's discuss."

---

## 9. Documentation

Teams document APIs, usually in **Confluence**, using existing templates:

- request, response, data types, schema
- **Postman collections** per environment (Dev, UAT, Prod)
- **High-level diagram** of the whole project
- **API landscape diagram** — how many APIs exist for the business functionality
- **Sequence diagram** — the order of calls (e.g. one experience API → two process APIs → four system APIs)
- functional/technical specification documents

As a developer you can't know the sequence without these.

### Real example — token validation (instructor's project)

A requirement: support a `sysToken` in an API with **4 endpoints**. One endpoint (`checkUserExistence`) goes to a system API called `cprv`; the other three go to process APIs. **Token validation is only in the cprv system API.** Question: implement the token for all four or one? **Only the one** going to cprv. The documentation/sequence diagram makes this clear.

---

## 10. Copy-Paste and Reuse

**Instructor's opinion:** copying and pasting is **not wrong** — know **what** to copy, **where** to paste and what **minimal changes** to make.

- Finish an 8-hour task in 4 hours and use the remaining time for family or learning.
- Don't build everything from scratch forever. After 2–3 months, start reusing existing pieces and adding to them — it saves a lot of time.
- Practice gives you the judgement to adapt copied code correctly.

---

## 11. Important Terminology

| Term | Meaning |
|---|---|
| Source / target | Where requests start / where they're processed |
| Kebab-case | words separated by hyphens |
| SAPI / PAPI / EAPI | System / Process / Experience API |
| JSON validator | Tool to check JSON syntax |
| Smart quotes | Curly quote characters that break JSON |
| Design document / API blueprint | Agreed requests, responses, errors, schemas |
| Field rules | Type, length, mandatory, level for each field |
| Primary key | Unique identifier column in a DB table |
| Correlation ID / transaction ID | Unique ID for tracing a request |
| Mapping sheet | Source field → target field mapping |
| Confluence | Documentation tool |
| API landscape diagram | Diagram of all APIs for a functionality |
| Sequence diagram | Order of calls between systems |

---

## 12. Interview Questions

### Q1. Two experience systems, two back-end systems, one functionality — how many APIs?
Five: two experience APIs, one process API (reused), two system APIs.

### Q2. Why separate experience APIs for mobile and web?
They may need different data volume/structure or security; the process API is shared.

### Q3. Where should tokens and correlation IDs be sent?
In headers; the body carries business data.

### Q4. What naming convention do MuleSoft projects use?
Usually kebab-case with layer indicators (e.g., `-sapi`), kept short; each organisation has its own standard.

### Q5. How do you find errors in JSON?
Validate with a JSON validator or Postman; check quotes around keys, commas (no trailing comma), braces/brackets, and smart quotes from copied text.

### Q6. Who decides whether a field is mandatory?
The business/team lead during requirements discussion, documented in the design.

### Q7. What is a mapping sheet?
A document mapping fields between systems (e.g. API request fields to DB columns).

### Q8. What documents describe an integration project?
High-level design, API landscape diagram, sequence diagrams, API specifications (requests/responses/schemas), Postman collections, typically in Confluence.

---

## 13. Must Remember

1. API count = **experience per consumer + shared process + system per back-end** (example: 5).
2. Experience APIs differ by consumer needs; process API is reused.
3. Our APIs may be called by front-ends, other companies or other departments.
4. Names: **kebab-case**, short, team convention (e.g. `-sapi`).
5. Validate JSON: keys quoted, no trailing comma, beware **smart quotes**; Postman can validate.
6. JSON is popular: readable, lightweight, language-friendly.
7. Field rules: type, length, mandatory (decided by business), level; employee ID = primary key.
8. **Tokens / correlation IDs → headers**; the gateway validates tokens before the API.
9. Mapping sheets map API fields to DB columns; ask the business when unclear.
10. Documentation in **Confluence**: diagrams, sequence diagrams, specs, Postman collections; reuse wisely.
