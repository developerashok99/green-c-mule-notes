# Day 25 — Data Types (Theory), Traits, Fragments, Mocking Service and Sharing

> **Sources:**
> - Audio transcript, existing notes, and the class video (recorded 11 Dec 2024).
> - Slide text and Design Center/Studio screens marked *slide* or *screen* are read from the recording.
> - Slide images: [slides/day25](../slides/day25/).

## 1. Overview

- Examples and data types were externalised on Day 24.
- Headers were still repeated in every method.
- This session:

1. Data types — theory: built-in vs. custom types, `types` vs. `type`
2. **Traits** — reusable method-level pieces (used here for headers), with `is`
3. Testing with "Try it" after the changes
4. Sharing a specification with colleagues
5. **Fragments** — reuse across APIs in the organisation; creating, publishing to Exchange, versions; consuming as a dependency
6. **Mocking service** — making it public; testing from Postman
7. Postman collections: export/import, login and data safety
8. Other testing tools

---

## 2. Data Types — Theory

> **Data types describe and validate data** inside the API specification — e.g., "this is a string of 20 characters", "this is a number".

### 2.1 Built-in types

| Type | Meaning |
|---|---|
| `string` | Text |
| `number` | Numeric values |
| `integer` | Whole numbers |
| `boolean` | true / false |
| `date-only` | Date |
| `time-only` | Time |

- These are RAML's types — not all exist in JSON.
- JSON has no date type, so for a JSON body a date is accepted as a **string**.
- Use the RAML types that suit JSON.

### 2.2 Custom (user-defined) types

- RAML supports **custom data types** built from built-in ones — e.g. the employee request type.
- Data types define the structure of the **request body, response body and error body**.
- Headers and query params are defined separately in the method.

### 2.3 Keywords

| Keyword | Use |
|---|---|
| `types` | Import/declare data types into the root RAML (with a name) |
| `type` | Use a declared type at a body/property |

---

## 3. Traits

### 3.1 Definition

> **Traits** are **reusable components** in RAML — like functions in programming. They declare **common method-level properties**: description, headers, query parameters, security schemes, responses.

Under a method (e.g. `patch`) you have description, headers, body, responses. A trait can hold any of these that repeat.

### 3.2 Keywords

| Keyword | Use |
|---|---|
| `traits` | Import/declare traits in the root RAML |
| `is` | Apply traits to a method |

### 3.3 Benefits

- **Readability**
- **Reduce redundancy** — headers written once, not three times
- **Consistency** — add a header once and all methods get it

### 3.4 Creating a headers trait

1. **New folder** `traits`.
2. **New file → RAML → Trait**, name **`headersTraits.raml`** (*screen*).
3. Inside, type `headers:` (the editor suggests all method-level nodes: body, responses, security schemes…). Paste the three headers; fix indentation (Tab / Shift+Tab).

```raml
#%RAML 1.0 Trait
headers:
  transaction-id:
    description: tranaction-id is useful to track the journey of a request in Mulesoft layers
    type: string
    required: true
    minLength: 32
    maxLength: 32
    example: "abcdefgh-jxbv8599-sjdf762-3746bb"
  origin:
    description: This header will help us to understand from where the request is initiated
    type: string
    ...
  language:
    ...
```

(*Screen:* `/traits/headersTraits.raml` — the same three headers moved out of the root file.)

4. Declare it in the root file and apply it with `is`:

```raml
#%RAML 1.0
title: hr-employees-sapi-7303
...
types:
  postRequestDataType: !include /dataTypes/requests/postRequestDataType.raml
  postResponseDataType: !include /dataTypes/responses/postResponseDataType.raml
  patchRequestDataType: !include /dataTypes/requests/patchRequestDataType.raml
  patchResponseDataType: !include /dataTypes/responses/patchResponseDataType.raml
  getResponseDataType: !include dataTypes/responses/getResponseDataType.raml
  400errorResponseDataType: !include /dataTypes/errorResponses/400errorResponseDataType.raml
  500errorResponseDataType: !include /dataTypes/errorResponses/500errorResponseDataType.raml

traits:
  headersTraits: !include /traits/headersTraits.raml

/employees:
  post:
    is:
      - headersTraits
    body: ...
  patch:
    is:
      - headersTraits
  /{empid}:
    get:
      is:
        - headersTraits
```

(*Screen* for the `types` and `traits` blocks; the resource part follows the Day 23 structure.)

- Remove the old headers blocks from each method.
- Multiple traits: `is: [ traitA, traitB ]`.

### 3.5 Result

The root file went from ~330 lines to ~100 — easy to read: types, traits, then each method's trait, body (type + example), responses.

### 3.6 Questions

**Are headers the same for every API?** Most of the time yes — organisations usually standardise headers.

**Who sets this up?**
- For a new project, architects with a senior developer prepare a **template** (folder structure, traits, resource types).
- You fill it in.
- Structures vary (some put all data types directly in one folder).
- If you are asked to set it up, this approach is fine.

---

## 4. Testing After the Changes

Documentation → endpoint → **Try it**:

- Mandatory headers (`transactionId`, `origin`) are listed; optional `language` appears under **Show optional** (a toggle removes it).
- **Format** = pretty JSON over several lines; **Minify** = single line (less space).
- POST → **201** "employee details created successfully in the DB" (from the examples/types).
- PATCH → **200** "employee details updated successfully".
- GET without `origin` → "Request validation error: required header origin is missing".

The enum issue from Day 23 still showed when `enum` was present.

---

## 5. Sharing the Specification With Colleagues

In Design Center, **Share** the project → choose people from your organisation (by email; they need Anypoint Platform access). It then appears in their Design Center list.

---

## 6. Fragments

### 6.1 Why

- The headers trait is reusable only **within this API**.
- The experience, process and system APIs of this use case (and other APIs) use the same headers.
- Copy-pasting repeats code.

> A **fragment** is a reusable RAML component that can be used **across any API specification in the organisation**. Fragments can hold **security schemes, libraries, resource types, traits, data types**.

| | Trait (inside a spec) | Fragment |
|---|---|---|
| Scope | One API specification | All API specs in the organisation |
| Where | A file in the API project | A separate Design Center project, published to Exchange |
| Behaves as an API? | — | No — can't be documented/tested on its own; used as part of an API spec |

When a fragment changes, publish a new version and consumers import the latest version.

### 6.2 Creating a fragment

1. Design Center → **Create → New Fragment** (not New API Specification).
2. Name it meaningfully. *Screen:* the fragment project was **`common-headers-fragment`**, and its trait file **`businessHeadersTraits.raml`** — the instructor explained the "business headers" name:
   - `origin` and `language` describe business information about the request (where it comes from, what language).
   - Transaction/correlation IDs are technical IDs (identify the request, check logs).
   - "Every name should be meaningful and thoughtful."
3. Choose the fragment type (**Trait**, data type, resource type, …). The chosen file becomes the fragment's root file.
4. Paste the headers content.
5. If the project opens read-only (others may have it open), click **Edit spec**.

### 6.3 Publishing to Exchange

**Publish → Publish to Exchange**:

| Setting | Notes |
|---|---|
| Asset version | e.g. 1.0.0 |
| Lifecycle state | **Development** (still changing) or **Stable** (finalised) |
| Advanced: group ID, asset ID, asset name | Default to the project name; best to keep them unchanged |

> **Exchange** is the central repository for saving and sharing MuleSoft assets in the organisation (like SharePoint for documents).

**Versions:** republishing after a change creates **1.0.1**, then **1.0.2**, … Publish only when there's a change.

### 6.4 Using the fragment in the API

1. Open the API spec → left panel → **Dependencies** (Fragments) → **Add dependency** → choose the organisation's fragment → add.
2. It appears under **exchange_modules**.
3. Comment out (with `#`) the local trait reference and include the fragment's file from `exchange_modules/...` under `traits`.

```raml
traits:
  #headersTraits: !include /traits/headersTraits.raml
  headersTraits: !include /exchange_modules/<org-id>/common-headers-fragment/1.0.1/<trait file>
```

(*Screen:* `exchange_modules/<org id>/common-headers-fragment/1.0.1/` appeared in the file tree; the reference project opened in Studio used the same pattern.)

**Careful:** names must match; if the fragment's trait name differs from what methods use in `is`, you get errors. If the fragment changes, update the version/reference in each consuming API.

---

## 7. Mocking Service — Sharing With the Business

Business people don't have Anypoint Platform access. Documentation → **Mocking service configuration** → **Make public** → a public mock **URL**.

> A **mocking service** is a dummy service published on a dummy server, returning responses from the specification's examples.

Testing the mock URL in Postman:

- Missing `transactionId` → "transactionId is missing".
- Wrong `origin` (not `mobile`/`web`) → error.
- No body → "You must provide a body".
- With everything correct → the example response.

---

## 8. Postman Collections

- Group requests into a **collection**, **export** it to a file, share it; colleagues **import** it.
- Newer Postman versions push you to log in.
  - Logged-in data is saved in **Postman's cloud**.
  - With company APIs (sensitive information), especially on a free account, that's a risk.
- In an organisation: ask the team how Postman is used — log in with the office email if approved, and follow the company's practice.

---

## 9. Other Testing Tools

**Question:** what if a company uses another tool?

**Instructor's observation:** 90–95% use **Postman**; **SoapUI** mostly for SOAP services; other tools exist. The instructor used SoapUI 2–3 years ago and uses Postman now.

- Concepts are the same in every tool: create a request, set the path, body, headers, query parameters, send.
- Only navigation/import/export differ.
- Knowing one tool makes others easy (ask colleagues or watch a video).

---

## 10. Important Terminology

| Term | Meaning |
|---|---|
| Built-in / custom data type | RAML's own types / types built from them |
| `types` / `type` | Declare types / use a type |
| Trait | Reusable method-level definition (e.g. headers) |
| `traits` / `is` | Declare traits / apply traits to a method |
| Fragment | Reusable RAML asset shared across APIs via Exchange |
| Lifecycle state | Development or Stable |
| Asset version | e.g. 1.0.1; increments on republish |
| Dependencies / exchange_modules | Where imported fragments appear in an API project |
| Mocking service | Dummy service generated from the spec |
| Make public | Expose the mock URL to non-platform users |
| Postman collection | Saved set of requests (export/import) |

---

## 11. Interview Questions

### Q1. What are traits in RAML?
Reusable components declaring common method-level properties (headers, query params, responses, security schemes, description). Declared with `traits`, applied with `is`.

### Q2. Difference between a trait and a fragment?
A trait in a spec is reusable only in that spec. A fragment is a separate project published to Exchange and reusable by any API spec in the organisation (traits, data types, resource types, security schemes, libraries).

### Q3. How do you use a fragment in an API specification?
Add it as a dependency in Design Center; it appears under `exchange_modules`; include its file in `traits`/`types` and reference it.

### Q4. What happens when a fragment changes?
Publish a new version (e.g., 1.0.1 → 1.0.2); consumers update their dependency/reference.

### Q5. How can business users test an API before it's built?
Make the Design Center mocking service public and share the URL (or a Postman collection).

### Q6. RAML built-in types?
string, number, integer, boolean, date-only, time-only, etc. Custom types combine them.

---

## 12. Must Remember

1. **Data types** describe and validate; `types` declares, `type` uses.
2. Built-in types: string, number, integer, boolean, date-only, time-only; JSON dates are strings.
3. **Traits** = reusable method-level pieces; `traits` declares, **`is`** applies.
4. Traits → readability, less redundancy, consistency (330 → ~100 lines).
5. Trait inside a spec = **only that API**.
6. **Fragment** = reusable across the organisation; **New Fragment** → publish to **Exchange**.
7. Fragment lifecycle: **Development / Stable**; versions 1.0.0 → 1.0.1 → 1.0.2; keep default asset IDs.
8. Consume via **Dependencies → exchange_modules**; update references when versions change.
9. **Mocking service → Make public** for business testing.
10. Postman: share collections by export/import; be careful with cloud login for company data.
