# Day 26 — Publishing the Specification to Exchange, Importing It into Studio, Scaffolding and the APIkit Router

> **Sources:** audio transcript, existing notes, and the class video (recorded 12 Dec 2024). Design Center, Exchange, Studio and Postman screens marked *screen* are read from the recording. Slide images: [slides/day26](../slides/day26/).

## 1. Overview

The specification (with its fragment) is complete. This session:

1. Why publish the API specification to **Exchange**
2. Exchange tour: all assets, organisation assets, asset types, connectors, shared with me, public portal
3. Testing and sharing from Exchange (collaborators, public portal)
4. Creating a Mule project and importing the specification — three options
5. **Scaffolding**: listener flow, **APIkit Router**, one flow per resource-method
6. The golden rule: don't change generated flow names
7. Router configuration, dependencies added to pom.xml, console flow, main/private/sub flows
8. Folder organisation: implementation and common
9. Debug test: GET success, wrong resource, POST with a bad body → 400

*Slide* — **Agenda for today:** API Specification Implementation using RAML · Q&A session.

---

## 2. Why Publish to Exchange?

You *can* work without publishing, but in industry, **as soon as the spec is ready it is published to Exchange**, because:

1. **Studio imports** the specification **from Exchange**.
2. **API Manager** creates the API asset (for applying policies) **from Exchange**.

Exchange is a shared repository used by developers **and** by other Anypoint Platform modules.

Publish from Design Center: **Publish → Publish to Exchange** (the root file is published). *Screen* — Publishing to Exchange: **Asset version 1.0.0**, **API version v1**, **LifeCycle State: Stable**; the asset page then showed `hr-employees-sapi-7303` — REST API, v1, Latest 1.0.0, Stable, with endpoints `/employees` and `/{empid}`.

---

## 3. Exchange Tour

| Section | Contains |
|---|---|
| **All assets** | MuleSoft-provided assets + your organisation's assets |
| Your organisation (named after the account's organisation) | Your API specifications and fragments — e.g. 100 APIs in the company appear here |
| **Provided by MuleSoft** | Connectors, templates, examples, policies, … |
| **Shared with me** | Assets others shared with you |
| **My applications** | Explained with policies |
| **Public portal** | Share specifications with people outside the organisation |

### Asset types

Filtering your organisation's assets by type shows only **REST API** and **Fragment** (what you published). Across all assets: **connectors, custom, DataWeave libraries, examples, policies, fragments, REST APIs, SOAP APIs, templates**, etc.

- Publishing from Design Center sets the type automatically.
- Publishing something else (e.g. a template project from Studio): **Publish new asset** → give name, choose **asset type** (example, REST API, SOAP API, async API, …), **lifecycle state** (development/stable) → publish.

### Connectors

Provided by MuleSoft → type **Connector**: Salesforce, SAP S/4HANA, SAP, Amazon S3, Twilio, MongoDB, Einstein Analytics, Workday, and many more. If a connector isn't in your Studio project, search Exchange from Studio (log in) and import it — as done for Secure Properties (Day 14).

> **Exchange** is the central repository where MuleSoft assets are saved and published.

---

## 4. Testing and Sharing from Exchange

Open the API asset:

- **Download** the spec, view endpoints (employees → post …) and **test** them from Exchange too.

**Share**:

1. **Collaborators** — invite people from your organisation by email; it shows in their **Shared with me**.
2. **Public portal** — choose **Public**, select the version, save. Exchange gives a public portal URL. **Anyone** with the URL can view and test.

Test: removing a comma from the body gave **"Invalid schema"**.

Once published, every developer in the organisation can find it by searching Exchange.

---

## 5. Creating the Project and Importing the Specification

### 5.1 New project

File → New → **Mule Project** (or right-click in Package Explorer) → name **`hr-employees-sapi-7303`** (*screen*).

**Runtime:** choose the Mule runtime (4.4.0 used). **Install Runtimes** lets you install other runtime versions (e.g. 4.3 … 4.8) from Studio.

### 5.2 API implementation — three options

> "Add an API implementation to your project to automatically set up an APIkit Router and create placeholder flows for each resource method."

| Option | What it does | Usage |
|---|---|---|
| **Import a published API** | Import the spec published in Exchange | **Used most** |
| **Import RAML from local file** | Select the spec ZIP downloaded from Design Center (Download button) | When the organisation blocks Studio–platform connectivity (e.g. SSL restrictions); rarely needed |
| **Download RAML from Design Center** | Studio connects to Design Center and fetches it | Possible; but with Exchange there is a seamless connection and the latest published versions are available |

### 5.3 Importing from Exchange — steps

1. Click **+** → **From Exchange**.
2. **Add account** — log in with Anypoint Platform credentials (old trial accounts expire; add a new one).
3. Organisations often use **SSO with a custom domain** (e.g. the bank's domain): choose custom domain → enter the organisation's domain name (find it in Access Management or ask colleagues) → continue → log in.
4. Search the API, select version **1.0.0** → add.

### 5.4 Two options before Finish

- **Use default location** — the project goes into the current workspace (e.g. `D:\WSAPS`), or browse to another.
- **Scaffold flows from these API specifications** — keep checked.

---

## 6. Scaffolding

### 6.1 What it generates

> **Scaffolding** uses the API specification to generate flows: one **main flow** with a Listener and the **APIkit Router**, plus **one flow per resource-method**.

```text
hr-employees-sapi-7303-main                                  (screen)
  Listener (path /api/*)
     ▼
  APIkit Router  ── validates the request against the spec, then routes
     ├─► post:\employees:application\json:hr-employees-sapi-7303-config
     ├─► patch:\employees:application\json:hr-employees-sapi-7303-config
     └─► get:\employees\(empid):hr-employees-sapi-7303-config
  Error handling: On Error Propagate per APIkit error
     (APIKIT:BAD_REQUEST, APIKIT:NOT_FOUND, APIKIT:METHOD_NOT_ALLOWED,
      APIKIT:NOT_ACCEPTABLE, APIKIT:UNSUPPORTED_MEDIA_TYPE, APIKIT:NOT_IMPLEMENTED)
```

Without scaffolding, you'd create a separate listener and flow for every method yourself.

- If scaffolding fails, Studio shows red errors. Even if the spec has some issues it may not fail — so test the flows.
- If the folder structure in Package Explorer looks re-ordered after import, it's cosmetic.

### 6.2 What the APIkit Router does

> **APIkit Router** validates the incoming request against the API specification (resource, method, headers, body schema…) and **routes** it to the matching flow. Invalid requests are rejected.

**Router configuration** (*screen*): Name **`hr-employees-sapi-7303-config`**, API Definition `hr-employees-sapi-7303`, Outbound headers map name `outboundHeaders`, HTTP status var name `httpStatus`, Keep RAML/OAS base URI ☐, Disable Validations ☐ (Query parameters / Headers Strict Validations ☐), Parser AUTO (Default). **API definition** points to the imported spec (root RAML, data types, examples, the headers fragment) — it has everything needed to validate.

### 6.3 The golden rule — don't rename generated flows

The generated flow name (e.g. `post:\employees:application\json:hr-employees-sapi-7303-config`) encodes **method : resource : media type : config**. The router uses it to find the flow.

> Change it and the router can't route (requests fail). **Never change these generated flow names.** Other (your own) flows can be named freely.

**Enhancement example:** an API in production has three resources; you must add a fourth. Add the resource (data types, examples) in Design Center → publish a new version → update the dependency in Studio → implement the new flow. Don't touch existing generated flow names.

### 6.4 Console flow

A **console flow** (with an APIkit console operation) is also generated — for console-based testing. It is a main flow too. **Instructor:** 90% of the time not used; deleted in real projects.

### 6.5 Main, private and sub flows

| Type | Source | Error handling |
|---|---|---|
| Main flow | Yes (e.g. Listener) | Yes |
| Private flow | **No** | Yes |
| Sub flow | **No** | **No** |

The generated per-resource flows have no source — they're private flows called by the router.

**Tip:** right-click canvas → **Collapse all / Expand all**.

### 6.6 Dependencies added

pom.xml now contains:

- the **API specification** (and its fragment) from Exchange, and
- the **APIkit module** (e.g. 1.5.11, `mule-plugin`).

*Screen:*

```xml
<dependency>
  <groupId>9756392d-0db8-4065-b2c4-989d3e2d4e05</groupId>   <!-- organisation ID -->
  <artifactId>hr-employees-sapi-7303</artifactId>
  <version>1.0.0</version>
  <classifier>raml</classifier>
  <type>zip</type>
</dependency>
<dependency>
  <groupId>org.mule.modules</groupId>
  <artifactId>mule-apikit-module</artifactId>
  <version>1.5.11</version>
  <classifier>mule-plugin</classifier>
</dependency>
```

(The project itself: groupId `com.mycompany`, artifactId `hr-employees-sapi-7303`, `app.runtime` 4.4.0-20220221.)

Update versions in pom.xml or via the module view if a newer version (e.g., from Exchange) is needed. Studio must stay connected to Exchange (account not expired).

The APIkit module has operations **router** and **console**; we use **router**.

---

## 7. Organising Implementation (Preview)

The instructor showed a structure used in real projects:

```text
src/main/mule/
├── hr-employees-sapi.xml          ← generated main + resource flows (keep small)
├── implementation/
│   ├── post-employee.xml          ← actual business processing
│   ├── patch-employee.xml
│   └── get-employee.xml
└── common/
    ├── common-error-handler.xml   ← shared error handler
    └── global-config.xml          ← all global elements (connector configs)
src/main/resources/                ← property files
```

- Generated resource flows contain only a **Flow Reference** to the implementation flow.
- Logging (with masking of sensitive data), database operations etc. go in the implementation.
- No strict rule — the folders bring clarity. Create folders: right-click → New → Folder.
- Built in the next session.

### What the generated flows contain

From the spec's examples, each generated flow has a **Transform Message** returning the **example response** — *screen*, POST flow:

```dataweave
%dw 2.0
output application/json
---
{
  statusCode: 201,
  message: "employee details created successfully in the db"
}
```

For GET, an extra Transform Message stores the **URI parameter** in a variable (the GET flow has two Transform Messages).

---

## 8. Debug Test

Two loggers were added to visualise routing; app run in **Debug** mode.

### 8.1 GET — success

- Postman: `http://localhost:8081/api/employees/<empid>` (*screen* — scaffolded listener path `/api/*`).
- **Headers:** copy the headers from the earlier mock test (Ctrl+A, Ctrl+C) and paste in Postman **Headers → Bulk edit** — faster than adding each key.
- The router routed to the GET flow; the response was the spec's **example** employee data.

### 8.2 Wrong resource

`http://localhost:8081/api/employees1` → no such resource in the spec → the **router** rejects it: *screen* — **404 Not Found**, `{"message": "Resource not found"}`. Earlier (without APIkit) the **Listener** rejected unknown paths because the path was configured in the Listener; now the Listener accepts `/api/*` and the router validates.

*Screen:* POST `http://localhost:8081/api/employees` with the example body (`empId` 1000, `empName` "Suresh", `empSalary` 80000, `active` true, `empDesignation` "software engineer") → **201 Created**, `{"statusCode": 201, "message": "employee details created successfully in the db"}`. A request to a method the spec declares but which wasn't wired returned **501 Not Implemented**, `{"message": "Not Implemented"}`.

### 8.3 POST — bad body

A slightly wrong body → **400 Bad Request**. The router validated the body against the spec's schema and rejected it — no implementation code needed.

### 8.4 Where the error response comes from

The generated error handler has On Error Propagate blocks for APIkit errors (bad request, not found, method not allowed, …). Each sets a **variable `httpStatus`** (e.g. 400) and a **payload** (message). The Listener's **Error Response** maps body = `payload`, status code = `vars.httpStatus` (**default 500** if not set). All generated automatically; change messages as required.

(A mismatched variable name in the error mapping cost the instructor half an hour of debugging — check names carefully.)

---

## 9. Important Terminology

| Term | Meaning |
|---|---|
| Exchange | Central repository for MuleSoft assets |
| Asset type | REST API, fragment, connector, template, example, policy, … |
| Public portal | Public page to view/test a spec |
| Import a published API | Create a project from a spec in Exchange |
| Scaffolding | Generating flows from the spec |
| APIkit Router | Validates requests against the spec and routes them |
| Router configuration / API definition | Global config pointing to the spec |
| Console flow | Generated testing console flow (usually deleted) |
| Private flow / sub flow | No source / no source and no error handling |
| `vars.httpStatus` | Variable used for error status codes in scaffolded handlers |
| Bulk edit (Postman) | Paste many headers as text |

---

## 10. Interview Questions

### Q1. Why publish an API specification to Exchange?
So it can be imported into Studio for implementation and used by API Manager to apply policies; also to share it across the organisation.

### Q2. How do you start implementing an API from a RAML specification?
Create a Mule project, choose "Import a published API" from Exchange, and let Studio scaffold flows.

### Q3. What is scaffolding?
Generating a main flow (Listener + APIkit Router), one flow per resource/method, and an error handler from the specification.

### Q4. What does the APIkit Router do?
Validates requests against the spec (resources, methods, headers, query params, body schema) and routes valid requests to the correct flow; invalid ones raise APIkit errors (e.g., 400, 404, 405).

### Q5. Can you rename scaffolded flows?
No. The router relies on the generated names (method, resource, media type, config). Renaming breaks routing.

### Q6. Difference between private flow and sub flow?
A private flow has no source but can have error handling; a sub flow has neither.

### Q7. How do you share a spec with someone outside the organisation?
Make it public via Exchange's public portal and share the URL.

### Q8. How do you handle an enhancement (new resource)?
Update and republish the spec in Design Center, update the dependency version in Studio, implement the new flow; don't change existing generated flow names.

---

## 11. Must Remember

1. Publish specs to **Exchange** — Studio and API Manager take them from there.
2. Exchange: all assets, org assets, provided by MuleSoft (connectors…), shared with me, public portal.
3. Share via **collaborators** (email) or **public portal** (URL for anyone).
4. New project → **Import a published API** (most used); local ZIP / Design Center are alternatives.
5. **Scaffold flows**: Listener + **APIkit Router** + one flow per resource-method + error handler.
6. **Router validates then routes**; config points to the API definition.
7. **Never rename generated flow names.**
8. Console flow → usually deleted. Private flow (no source), sub flow (no source, no error handling).
9. pom.xml gains the **spec dependency** and **APIkit module**.
10. Bad body → **400** from router; error handler sets `vars.httpStatus` + payload → Listener Error Response.
