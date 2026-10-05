# Day 24 — RAML Best Practices: Externalising Examples and Data Types

> **Sources:** audio transcript, existing notes, and the class video (recorded 9 Dec 2024). File names and RAML marked *screen* are read from the recording. Slide images: [slides/day24](../slides/day24/).

## 1. Overview

The specification from Day 23 works but is ~300 lines in one file with no best practices. Today:

1. Why best practices: **readability** and **modularity**
2. Folder structure for **examples** (requests / responses / error responses)
3. Externalising examples as JSON files with **`!include`**
4. What a **data type** (schema) is and why it matters
5. Externalising data types as RAML `DataType` files, declared under **`types`** and used with **`type`**
6. Reuse within the same spec — when the same structure can be reused
7. Indentation shortcuts (Tab / Shift+Tab)
8. Limits: this reuse works only inside one API → **fragments** for reuse across APIs
9. Templates for new specifications
10. Next: **traits**

---

## 2. Why Best Practices?

- **Readability:** the main file shows only the important lines — resources, methods, headers, references. Details sit in separate files.
- **Modularity / maintainability:** a change is made once in its own file.
- When the spec is imported into Studio, the same folder structure appears there, neatly organised.

---

## 3. Examples Folder

### 3.1 Structure

In Design Center: **+ → New folder**.

```text
examples/                      (screen)
├── errorResponses/
│   ├── 400ErrorResponseExample.json
│   └── 500ErrorResponseExample.json
├── requests/
│   ├── patchRequestExample.json
│   └── postRequestExample.json
└── responses/
    ├── patchResponseExample.json
    └── postResponseExample.json
dataTypes/
├── errorResponses/
├── requests/
│   └── postRequestDataType.raml
└── responses/
```

Subfolders aren't mandatory, but with many resources (e.g., 25) separate folders make files easy to find.

### 3.2 Moving an example out

1. In the main file, select the POST request example → **Ctrl+X**.
2. In `examples/requests` → **New file → Other** → name e.g. `postRequestExample.json` → paste → right-click → **Format**.
3. On the file, click **⋮ → Copy path**.
4. In the main file:

```raml
        example: !include examples/requests/postRequestExample.json
```

`!include` pulls the file's content in at that place. The example is still validated against the type — e.g., `empSalary` as a string gave "should be number".

### 3.3 Responses and error responses

Same steps:

```raml
      responses:
        201:
          body:
            application/json:
              example: !include examples/responses/postResponseExample.json
        400:
          body:
            application/json:
              example: !include examples/errorResponses/400ErrorResponseExample.json
        500:
          body:
            application/json:
              example: !include examples/errorResponses/500ErrorResponseExample.json
```

- **Duplicate** an existing file (e.g. 400 → 500) and edit it instead of creating from scratch.
- Error examples are often the same for all resources; reuse them for PATCH and GET.
- Organisations often keep a **template** of error responses and reuse it.
- Use readable file names — you should understand a file from its name.

The **root file** is the main RAML file (`#%RAML 1.0`), marked in Design Center; other files are JSON or fragment files.

---

## 4. Data Types

### 4.1 What a data type is

> A **data type** (also called a **schema**) defines the structure: "the request is an object with these properties; this one is a string, that one is a number…"

- Example values can change (salary 80,000 or 1 lakh) — still valid.
- A **string** where the type says number → rejected.

That's why custom data types are defined from built-in types (string, number, boolean, object, array…) and used for requests and responses.

### 4.2 Folder

```text
dataTypes/          (screen)
├── errorResponses/
├── requests/
└── responses/
```

(Subfolders optional.)

### 4.3 Creating a data type file

1. `dataTypes/requests` → **New file** → type **RAML data type** → e.g. `postRequestDataType.raml`. The first line is the fragment header.
2. Cut `type: object … properties …` from the main file (Ctrl+X), paste it into the new file.
3. Fix indentation: select the lines → **Shift+Tab** (backward indentation) until aligned. (Tab = forward.)

```raml
#%RAML 1.0 DataType
type: object
additionalProperties: false
properties:
  empName:
    description: this field defines the name of an employee
    type: string
    required: true
    example: "mahesh"
  empId:
    description: this field defines the id of an employee
    type: number
    required: true
    example: 1000
  ...
```

(*Screen:* `dataTypes/requests/postRequestDataType.raml`. Pasting without fixing indentation first gave "Syntax error in the following text: ' properties: …'".)

### 4.4 Declaring and using it — different from examples

Examples are placed directly with `!include`. Data types are first **declared under `types`** with an **alias**, then **used by name**:

```raml
#%RAML 1.0
title: hr-employees-sapi-7303
...
types:
  postRequestDataType: !include /dataTypes/requests/postRequestDataType.raml

/employees:
  post:
    description: This endpoint will help to create a new employee in HR databse
    headers: ...
    body:
      application/json:
        type: postRequestDataType
        example: !include /examples/requests/postRequestExample.json
    responses:
      201:
        body:
          application/json:
            example: !include /examples/responses/postResponseExample.json
```

(*Screen* for the `types` line and the resource; the response data types were added the same way. A reference project from an earlier batch used aliases like `addRequestDataType`.)

- Declare `types` at the top of the root file.
- If a referenced type doesn't exist, the editor shows an error and suggests existing type names.

### 4.5 Result

POST now has: headers, body (`type` + `example`), responses (`type` + `example`). Short and readable — modularity achieved. Same for PATCH and GET (request, response, 400, 500).

---

## 5. Reuse Within the Spec

**Observation:** the create response (`statusCode`, `message`) and the class's error response have the **same structure**. A type can be declared once and **referenced in several places**.

- In this class example, the error responses could reuse the response type.
- **Real projects:** error responses usually have extra fields (e.g. event/correlation ID), so they are separate types.
- Always look for reuse — not only in RAML. "If a piece of code is used in many places, define it once and reuse it. That's how a developer should think."

**Caution:** check carefully where each block starts and ends when cutting and pasting; errors in RAML can show up in another file than where the mistake is. It feels slow at first; after practising 3–4 times it becomes quick.

---

## 6. Limits — Reuse Across APIs Needs Fragments

Types and examples defined inside this specification can be reused **only within this API**. Another API (e.g. a new spec in Design Center) can't use them.

> To reuse across API specifications, create a **fragment** — a separate Design Center project that is not a full API specification — and import it into each API.

### Fragment example — address

Fifty APIs need an `address` field with the same structure (house number, street, …; maybe communication, permanent, billing addresses). Create an `Address` type in a fragment; each API imports it and uses `type: Address` for its address field. The rest of the request stays in the API.

**Common fragment usage:** things that repeat across projects — **headers** and **error responses**. Main requests and success responses usually differ per API.

Fragments are covered next session.

---

## 7. Starting New Specifications — Templates

Two kinds of requirements:

1. **New API** — create a new specification in Design Center.
2. **Enhancement** — add a resource or change a request in an existing API: update the spec in Design Center, re-import it into Studio, and update the implementation.

For new APIs, organisations keep a **template** (in Design Center/Exchange) with the folder structure (examples, data types, request/response/error-response folders). **Duplicate** the template, rename it, and fill in the files — saves 10–15 minutes and keeps the whole organisation consistent. Without a template, duplicate an existing project and follow its structure, deleting extras.

---

## 8. Next — Traits

Headers repeat in every method. RAML has **traits** for that: define headers once in the same project, use them in methods; later move them to a fragment to share across APIs.

---

## 9. Important Terminology

| Term | Meaning |
|---|---|
| Best practices (RAML) | Organising the spec for readability and modularity |
| `!include` | Insert another file's content |
| Copy path | Design Center option to copy a file's relative path |
| Root file | Main RAML file (`#%RAML 1.0`) |
| Data type / schema | Structure definition of data |
| `types:` | Section declaring custom types (with aliases) |
| `type:` | Use a type by name |
| `#%RAML 1.0 DataType` | Header of a data-type file |
| Shift+Tab | Backward indentation |
| Fragment | Reusable RAML project shared across APIs |
| Template | Pre-built structure duplicated for new projects |
| Enhancement | Change to an existing API |

---

## 10. Interview Questions

### Q1. How do you keep a large RAML specification maintainable?
Split it into folders and files — examples (JSON), data types (RAML DataType files), traits — and reference them from the root file.

### Q2. How do you reference an external example?
`example: !include examples/requests/postRequestExample.json`.

### Q3. How do you reference an external data type?
Declare it under `types:` with an alias (`MyType: !include /dataTypes/....raml`), then use `type: MyType`.

### Q4. What's the difference between an example and a data type?
An example shows sample values; a data type defines structure and constraints and is used to validate.

### Q5. Can types defined in one API spec be used in another?
No. Use a fragment published to Exchange for cross-API reuse.

### Q6. What is commonly put in fragments?
Repeated items such as headers (traits), error response types, and common objects like addresses.

---

## 11. Must Remember

1. Best practices → **readability + modularity**.
2. Folders: `examples/` and `dataTypes/`, each with `requests`, `responses`, `errorResponses`.
3. Examples: JSON files + **`!include`** (use Copy path).
4. Data types: `#%RAML 1.0 DataType` files → declare under **`types:`** with an alias → use **`type: alias`**.
5. Data types validate structure; examples are just sample values.
6. Reuse types where structures are identical; real error responses often have extra fields.
7. **Tab / Shift+Tab** for indenting blocks.
8. In-spec reuse only → **fragments** for cross-API reuse (e.g. address type, headers, errors).
9. Use **templates** to start new specs consistently.
10. Next: **traits** for headers.
