# Day 23 — Writing the Employee API Specification in RAML (Design Center)

## 1. Overview

Everything needed is ready — request, response, error response, headers — so this session writes the RAML.

1. Opening Design Center; project types (API specification, fragment, async API, import)
2. Creating the project: name, "guide me" vs. "my own way", RAML/OAS choice
3. Design Center layout and auto-suggestions
4. Root-level information: title, description, version, protocols, media type
5. Resources and sub-resources; resource naming best practice
6. Headers: `transactionId`, `origin` (enum), `language` (optional)
7. Request body with properties, examples and `additionalProperties`
8. Responses: 201 success, 400, 500
9. Update (PATCH) and fetch (GET) resources
10. Documentation panel and "Try it" (an enum-related error — not resolved)
11. Optional headers and `default`
12. Why modularise next (300+ lines)

---

## 2. Opening Design Center

Anypoint Platform home → **Start designing** or **Design Center** (same page). The **Projects** page is empty initially. Click **Create**:

| Option | Use |
|---|---|
| **New API Specification** | Create a REST API specification — used today |
| **New Fragment** | Reusable RAML pieces (explained in coming sessions) |
| **New AsyncAPI** | Specification for asynchronous APIs (recently introduced) |
| **Import from file** | Bring in an existing RAML file |
| **Sync from existing GitHub repo** | Import a RAML stored in GitHub (rare) |

> An **API specification** is a blueprint containing all resources, requests, responses, error responses, schemas and examples.

---

## 3. Creating the Project

- **Name:** `hr-employees-sapi` (plus the batch number in class to avoid a clash when importing into Studio). Real projects may also include the target system, e.g. `hr-employees-db-sapi`. Follow the naming convention (Day 22).
- **Guide me through it** gives tips; **I'm comfortable designing it my own way** was chosen.
- **Specification language:** RAML 1.0 / RAML 0.8 / OAS 2.0 / OAS 3.0 (OAS in JSON or YAML). Chose **RAML 1.0**.

### Layout

```text
Left: files of the project | Middle: RAML editor | Right: auto-generated documentation
```

**Auto-suggestions:** pressing Enter at the right indentation shows suggested keywords (e.g. typing `desc` offers `description`).

---

## 4. Root-Level Information

```raml
#%RAML 1.0
title: hr-employees-sapi
description: This API will facilitate creating, updating and fetching employee details using the HR database.
version: v1
protocols: [ HTTP, HTTPS ]
mediaType: application/json
```

- **Version:** `v1`. Minor additions → v1.1, v1.2; major changes → v2. The instructor doesn't suggest "1.0" style.
- **Protocols** and **mediaType** are good practice. Some fields (e.g. baseUri) are optional.

---

## 5. Resources and Sub-Resources

### 5.1 Best practice for resource names

- A resource name should be a **noun** (a thing or person) and **plural**: `/employees`.
- It should **not** contain an **action** ("createEmployee", "add") — the **method** (POST/PATCH/GET) already indicates the action.

### 5.2 What was built

**Instructor's observation:** in real projects teams often name things their own way unless the architect is strict. In class, the `employees` resource got three **sub-resources**, one per operation:

```raml
/employees:
  /add:
    post:
      ...
  /update:
    patch:
      ...
  /fetch:
    get:
      ...
```

- Indentation (a tab) under `/employees` makes `add`, `update`, `fetch` its **sub-resources**: `/employees/add`, `/employees/update`, `/employees/fetch`.
- The editor's **minimise** icons collapse blocks to check the structure.

> **Note:** the strict best-practice alternative is a single `/employees` resource with `post`, `patch` and `get` methods.

---

## 6. POST — Headers

```raml
/employees:
  /add:
    post:
      description: This endpoint will help to create a new employee in the HR database.
      headers:
        transactionId:
          description: Unique ID to trace the transaction
          type: string
          required: true
          minLength: 32
          maxLength: 32
          example: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6"
        origin:
          description: Identifies the application the request comes from
          type: string
          enum: [ mobile, web ]
          example: mobile
        language:
          description: Language used by the user
          type: string
          required: false
          example: English
```

(Representative; values follow the design document from Day 22.)

### Rules

- The consumer must send headers **exactly** as named. `TransactionId` or `transactionID` won't match → bad request.
- **`required`** defaults to **true**. Write `required: false` for optional.
- Length: `minLength` / `maxLength` (exactly 32 → both 32).
- **Alignment matters** — properties of a header are indented one level below the header name; the next header is at the same level as the previous one.

### `enum`

Restricts a value to a list:

```raml
enum: [ mobile, web ]
```

- A value not in the list (e.g., `iot`, or `Mobile` with a capital M) → error. To allow `iot`, add it to the enum.
- The example must be one of the enum values.

### Writing faster

Headers have the same shape: copy one header (Ctrl+C), paste (Ctrl+V), then change the name and values. Or type each one. Both are fine.

---

## 7. POST — Request Body

```raml
      body:
        application/json:
          type: object
          additionalProperties: false
          properties:
            employeeId:
              type: string
              description: Unique ID of the employee
            employeeName:
              type: string
            employeeSalary:
              type: number
            employeeDesignation:
              type: string
            active:
              type: boolean
          example:
            employeeId: "EMP001"
            employeeName: "Suresh"
            employeeSalary: 100000
            employeeDesignation: "Software Engineer"
            active: true
```

(Representative; names approximate the class example.)

- Description: writing descriptions is a good practice.
- **Example errors:** with an example, the editor showed "should have required property active / employeeDesignation / …". All properties are required by default, so the example must contain them. Careful alignment (select lines → Tab) fixed the structure.
- **Fix document typos:** the design document had some inconsistent names (e.g. `EMP status` lower-case). Correct them in the document and RAML — documents aren't always 100% right.

### `additionalProperties`

- Default **true** — extra fields are accepted.
- Set **false** to reject fields not listed.
- **Position:** put it **after `type: object` and before `properties`**. Placing it elsewhere gave errors ("expecting boolean, null provided").

### Saving

Design Center **auto-saves**. A **star (*)** on the file name means unsaved; it disappears after saving. If it doesn't save, check.

---

## 8. POST — Responses

```raml
      responses:
        201:
          body:
            application/json:
              type: object
              properties:
                statusCode: number
                message: string
              example:
                statusCode: 201
                message: "Employee created successfully"
        400:
          body:
            application/json:
              type: object
              properties:
                statusCode: number
                message: string
              example:
                statusCode: 400
                message: "Bad request"
        500:
          body:
            application/json:
              type: object
              properties:
                statusCode: number
                message: string
              example:
                statusCode: 500
                message: "Internal server error"
```

- Here the error responses have the same structure as success; in real APIs error responses often differ.
- **Indent multiple lines:** select them and press **Tab** (repeat for more levels) — no need to indent one by one.
- Copy-paste the 400 block for 500 and change values.

Order built: **method → headers → body → responses (success, errors)**.

---

## 9. PATCH and GET

### 9.1 Update (PATCH)

Copy the POST block (similar structure), change:

- method to `patch`, description,
- examples (e.g. updated designation),
- success code **200**, message "Updated successfully".

The same `additionalProperties` placement rule applies.

### 9.2 Fetch (GET)

- Method `get`.
- **Employee ID** is passed as a **URI parameter** (unique resource identifier) → `uriParameters` with `employeeId`.
- Response **200** with the employee details.

---

## 10. Documentation and "Try It"

The right panel generates **documentation** automatically: title, version, endpoints, methods, headers (mandatory vs. optional), body.

**Try it** (like Postman, against a **mock**):

- Click the endpoint → POST → **Try it**.
- Mandatory headers are shown; optional ones (language) appear under **Show optional**.
- `origin` shows a **drop-down** with only the enum values.
- The body is pre-filled from the example. **Minify** puts it on one line.
- **Send** → expected 201.

### Error seen

Every attempt returned **400 Bad Request** — "Request validation error … enum value". Removing a mandatory field changed the error to "Required key employeeId not found", proving validation works. **The instructor couldn't trace the enum issue** (seen in 2–3 batches); it works without the enum. Testing will be done with a separate **mocking service** instead.

---

## 11. Optional Headers and `default`

**Question:** `language` is optional and of type string. If the consumer sends it empty or as null, what happens?

It fails — the header expects a string. Allow it with a **default** value (e.g. `default: null` or a default string) in RAML.

---

## 12. Why Modularise

The specification now has **300+ lines**. Headers are repeated three times. As in any programming language, large repeated code is hard to read and maintain.

Next session — best practices:

- create a **folder structure**,
- move pieces into separate files,
- write headers once and **reference** them,

for **readability** and **modularity** (fewer lines).

---

## 13. Important Terminology

| Term | Meaning |
|---|---|
| Design Center project | Workspace containing RAML files |
| Fragment | Reusable RAML piece |
| AsyncAPI | Spec format for asynchronous APIs |
| Resource / sub-resource | `/employees` / `/employees/add` |
| `headers`, `uriParameters`, `body`, `responses` | RAML sections of a method |
| `required` | Mandatory flag; default true |
| `enum` | Allowed values list |
| `minLength` / `maxLength` | String length rules |
| `additionalProperties` | Allow/reject undeclared properties (default true) |
| `example` | Sample value |
| `default` | Value used when absent |
| Mock / Try it | Simulated API generated from the spec |

---

## 14. Interview Questions

### Q1. What are the main parts of a RAML method definition?
Description, headers, query/URI parameters, body (type, properties, example) and responses per status code.

### Q2. Resource naming best practice?
Plural nouns (e.g. `/employees`), no action verbs; the HTTP method indicates the action.

### Q3. How do you restrict a header to certain values?
Use `enum`, e.g. `enum: [mobile, web]`.

### Q4. Is a RAML property mandatory by default?
Yes. Use `required: false` for optional.

### Q5. How do you reject unexpected fields in the body?
`additionalProperties: false`, placed after `type: object` and before `properties`.

### Q6. How can you test a RAML spec before implementation?
Use the mocking service (Try it in Design Center's documentation), or share the mock URL/Postman collection.

### Q7. How do you handle an optional header that may be sent as null?
Give it a `default` value in RAML.

---

## 15. Must Remember

1. Design Center → **Create → New API Specification** → name (e.g. `hr-employees-sapi`) → **RAML 1.0**.
2. Root: `title`, `description`, `version: v1`, `protocols`, `mediaType`.
3. Best practice: **plural noun resources, no verbs**; class used `/employees/add|update|fetch` sub-resources.
4. Headers: names must match exactly; `required` default **true**; `minLength`/`maxLength`; **`enum`** for allowed values.
5. Body: `type: object`, **`additionalProperties: false`** (before `properties`), properties, example.
6. Responses: **201** create, **200** update/fetch, **400**, **500** with examples.
7. GET uses employee ID as a **URI parameter**.
8. **Indentation matters**; select lines + Tab to indent; copy-paste similar blocks.
9. Documentation and **Try it** are auto-generated; an enum issue prevented testing there (unresolved).
10. 300+ lines → modularise with folders and references next.
