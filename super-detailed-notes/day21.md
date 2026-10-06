# Day 21 — API Lifecycle Revisited, RAML Introduction and the Employee Use Case

> **Sources:**
> - Audio transcript, existing notes, and the class video (recorded 6 Dec 2024).
> - Slide text and drawings marked *slide* or *drawing* are read from the recording.
> - Slide images: [slides/day21](../slides/day21/).

## 1. Overview

The course now starts building a complete API. Plan:

```text
API lifecycle (revision, in more depth)
   → Employee use case
   → API specification in RAML (RAML concepts)
   → Implementation in Studio (with best practices)
   → Policies
```

This session covers:

1. API lifecycle: design (design → simulate → feedback → validate), implementation, management
2. Anypoint modules used at each step; tools (Postman, Notepad++)
3. RAML: definition, what a specification contains (requests, responses, schemas, examples, resources, methods, security), versions
4. OAS (Swagger)
5. "RAML is ready" vs. "API specification is ready"
6. The **Employee** use case: create, update (partial), fetch
7. Source vs. target
8. Applying API-led connectivity and microservices to the use case; cost
9. Security per layer (preview)
10. What developers receive from architects

---

## 2. API Lifecycle — Revisited

### 2.1 Three stages

```text
DESIGN                    IMPLEMENTATION            MANAGEMENT
Design → Simulate →       Develop (Studio)          Secure (API Manager)
Feedback → Validate       Test                      Deploy (Runtime Manager)
→ API specification                                 Monitor (Runtime Manager / Monitoring)
```

### 2.2 Design

1. **Design** the API from the requirement document.
2. **Simulate** — create a **mocking service** from the specification so users can see how requests and responses will look.
3. **Feedback** — users/business test the mock (send the expected request, check the response, check error responses) and give feedback.
4. **Validate** the feedback. If changes are needed, update and repeat; otherwise finish.

**Output:** the **API specification**.

- The **developer** prepares the specification.
- **Instructor's observation:** in real projects the business often doesn't test the mock, but it's a good practice to share the mock URL or a Postman collection and ask them to test.
- **Blueprint analogy:** before building a house you prepare and check the blueprint; before building an API you prepare and check the specification.

### 2.3 Implementation

- **Development** in **Anypoint Studio** — an IDE with powerful features.
- **Anypoint Code Builder** is newer. **Instructor's observation:** in the industry it is used mostly for demos/theory; real projects use Studio.
- Testing with **Postman**, because the consumer (front-end, third party, other team) may not be ready yet.

### 2.4 Management

| Activity | Module |
|---|---|
| Secure — apply policies | **API Manager** |
| Deploy, start/stop, logs, horizontal/vertical scaling | **Runtime Manager** |
| Monitor logs | Runtime Manager |
| High-level monitoring (performance) | **Anypoint Monitoring** |

To apply policies, the specification is first published from Design Center to **Exchange**.

### 2.5 Anypoint Platform vs. its modules

> **Anypoint Platform** is the console/user interface for management activities — a package of smaller applications: **Design Center, Exchange, API Manager, Runtime Manager, Anypoint Monitoring**, …

Developers mostly use **Design Center, Exchange, API Manager, Runtime Manager**; Anypoint Monitoring for high-level monitoring.

### 2.6 Notepad++

Handy for developers: many tabs, and unsaved tabs survive closing and reopening.

### 2.7 Interview question: "Explain the API lifecycle"

The course's interview Q&A document gives a compact answer: **design, implementation, test, deploy, monitor** — and what happens in each step.

---

## 3. RAML

*Slide* — **What is RAML?** RAML stands for RESTful API Modeling Language · RAML is a YAML-based modeling language to describe RESTful APIs and design API Specification · We define requests, responses, schemas, examples, resources, methods, security schemes in API Spec · Design Center of Anypoint Platform supports RAML and OAS (Swagger).

### 3.1 Where and how

The specification is prepared in **Design Center** using **RAML** (or **OAS**). **RAML** is used most in MuleSoft projects, so the course uses it.

### 3.2 Definition

> **RAML = RESTful API Modeling Language** — a **YAML-based** modelling language to describe RESTful APIs and design API specifications.

- Like the YAML property files (Day 14), with extra features.
- Simple, English-like; not complicated.

### 3.3 What an API specification contains

> An **API specification** is a document/file describing the request, response, error response, security and schemas/examples — a **contract between consumer and service provider**.

| Element | Meaning |
|---|---|
| Requests | What the consumer sends |
| Responses | What the API returns |
| Error responses | How errors look |
| **Schemas** | The **structure** of request/response/error |
| **Examples** | Sample request/response values |
| Resources | The API broken into resources (e.g. `/employees`) |
| Methods | Allowed methods per resource |
| Security schemes | How the API is secured |

### 3.4 Schema vs. example — table analogy

- A table with four columns: the **columns** (names and types) never change — that's the **schema**.
- The **rows** (values) change — that's data.
- A schema defines the structure; an **example** shows sample values.

### 3.5 Versions

- **RAML 1.0** and **RAML 0.8**; Design Center supports both. **1.0** has been used in the market for 5–6 years.
- **Interview tip:** if asked which version you know — **1.0**. If asked the latest version, check before the interview.
- RAML is backed and promoted by MuleSoft, which is why it became popular.

---

## 4. OAS (Swagger)

- **OAS = OpenAPI Specification**; old name **Swagger**.
- Formats: **JSON** and **YAML**. Versions: **2.0** and **3.0**.
- Widely used in **non-MuleSoft** projects and other web-service tools.
- **Interview tip:** "I haven't had an opportunity to work on OAS; I worked mostly on RAML. If needed, I can learn it — it's easy after RAML."

---

## 5. Terminology: "RAML Is Ready"

People say "**Is RAML ready?**" meaning "Is the API specification ready?". RAML is the language, not the document.

**Xerox analogy:** we say "give me a Xerox" for a photocopy, though Xerox is a company name.

- Common usage: "RAML ready", "API spec ready", "API contract ready".
- Official, diplomatic term: **"API specification is ready."**

---

## 6. The Employee Use Case

### 6.1 Requirement

An **HR application** (small web/mobile front-end) works with an **employees database**:

- HR enters a new employee's details and clicks **Create** → our API creates the employee in the DB.
- **Update** employee details.
- **Fetch** employee details.

### 6.2 REST or SOAP?

**REST.** No very high security requirement (where SOAP might be chosen); REST is lightweight, scalable and supports caching. Most modern applications use REST; SOAP is rarely used.

### 6.3 Source and target

```text
Source (front-end HR app; Postman for testing)
   ──► Our API ──► Target / back-end (Employees database)
```

- **Source:** where the request comes from.
- **Target:** where the request is finally processed/saved.
- A common interview question: "What source and target systems have you worked on?"
- There can be multiple sources and targets; what matters is where the request originates and where it finally lands.

### 6.4 Methods

| Operation | Method | Reasoning |
|---|---|---|
| Create employee | **POST** | Creating a resource |
| Update employee | **PATCH** | **Partial update** — e.g. on promotion only designation, salary (maybe roles) change out of 10–20 fields |
| Fetch employee | **GET** | Fetching |

### 6.5 One resource or several?

- Option A: separate resources for create, update, fetch.
- Option B: **one resource** (`/employees`) with **multiple methods**: POST = create, PATCH = update, GET = fetch.

> If methods clearly distinguish operations under one resource, use one resource. If not, use different resources.

The instructor planned Option B here. *Drawing:* "Employees use case — REST APIs → methods: ① Create emp → POST ② Update emp → PATCH (partial update) (PUT) ③ Fetch emp by id → GET; (resource) /employees: /post → create, /patch → update, /get → fetch"; source HR app (FE) → API → target DB, tested with Postman.

> **Correction (from the Day 23 video):** the RAML the class built in Design Center (`hr-employees-sapi-7303`) had the endpoints `/employees` and `/employees/{empid}` — i.e. Option B. A reference project from an earlier batch, opened in Studio, used `/employees/add` etc.; the earlier note confused the two.

---

## 7. Applying API-Led Connectivity

### 7.1 Layers for this use case

*Drawing* — **API-led architecture:** source → HR app (web or mobile); target → HR database (Oracle or MySQL); context → employee details; type of API → system, process or exp. Naming: `hr-employees-sys-api` (**kebab case**), also `hr-employees-sys-app`, `hr-employees-sapi`; `dbGetResponse` (**camel case**); a longer name `mobile-hr-employees-db-sapi` shortened to `mob-hr-emp-db-sapi` (CloudHub limit ~42 characters).

```text
Consumer (HR web app)
   │  HTTPS (internet)
   ▼
Experience API ──► Process API ──► System API ──► Employees DB
   ◄──────────────────────────────────────────────── response
```

- **Experience API:** exposed to the consumer; little logic.
- **Process API:** business logic.
- **System API:** connects to the database.

### 7.2 Is a Process API needed here?

This use case has little business logic. The architect might still include a Process API for **future** extended functionality if resources allow — otherwise skip it.

**Cost example:**
- Three layers × 0.1 vCore = **0.3 vCore** for a simple requirement; skipping one saves 0.1 vCore.
- More services → more vCores → more licensing cost.
- Know when to skip a layer.
- API-led architecture is **flexible**, not mandatory.

### 7.3 This is microservices

- A small, **meaningful** business service (create/update/fetch employee) is built as its own APIs.
- **Example:** customers, employees and vendors each get their own set of APIs — clear business boundaries.
- Breaking a big service into small, meaningful, **reusable** services = **microservices implemented through API-led architecture**.
- The **System API** for the database can be **reused** by other functionalities that need the same DB.

### 7.4 Know the whole picture

You may build only the System API, but when explaining your project (e.g., in an interview), you must understand the **total functionality** — not just "I built the system API."

---

## 8. Security per Layer (Preview)

| Layer | Exposure | Suggested security (instructor) |
|---|---|---|
| Experience API | Internet — first layer attacked | **HTTPS** + **OAuth** (commonly used now) |
| Process API | Internal | HTTP/HTTPS + lighter policy, e.g. **client ID enforcement** or **basic authentication** |
| System API | Internal | Similar to Process API — depends on the organisation |

- Why OAuth on top of HTTPS? Explained in the OAuth session.
- **Analogy:** logging in to Gmail requires username and password — only authorised users get in. Policies do the same for APIs.

### Why not just one API between consumer and DB?

- For a simple, isolated requirement with no other users of the DB and no complex transformations, a single API is fine.
- Enterprises have many requirements and many APIs, so the layered design pays off.
- Decide per requirement.

---

## 9. What Developers Receive

By the time development starts, the architect has done high-level design and gives the developer a document:

- request, response and error response (schemas) for each API (experience, process, system),
- methods, protocol, policies.

The developer prepares the **RAML** from it (simple English-like syntax), clarifies doubts with the lead, peers and architect, then implements.

**Instructor's view:** don't fear the developer role — MuleSoft is low-code and the document is in front of you. Transformation-heavy projects are rare.

The course discusses the reasoning behind designs so you can question designs (e.g., "this uses PUT, but it's a partial update — shouldn't it be PATCH?").

---

## 10. Important Terminology

| Term | Meaning |
|---|---|
| Simulate / mocking service | Fake API from the specification for early testing |
| Feedback / validate | Users test the mock; changes validated |
| API specification / spec / contract | Design document of the API |
| RAML | RESTful API Modeling Language (YAML-based) |
| OAS / Swagger | OpenAPI Specification |
| Schema | Structure of data |
| Example | Sample values |
| Resource | API entity, e.g. `/employees` |
| Source / target | Where requests come from / where they're processed |
| Partial update | Changing only some fields (PATCH) |

---

## 11. Interview Questions

### Q1. Explain the API lifecycle.
Design (design, simulate with a mock, gather feedback, validate → API specification in Design Center), implementation (develop and test in Studio), and management (secure with API Manager, deploy and manage in Runtime Manager, monitor with Runtime Manager/Anypoint Monitoring), with specs shared via Exchange.

### Q2. What is RAML?
RESTful API Modeling Language — a YAML-based language to define RESTful API specifications (resources, methods, requests, responses, schemas, examples, security).

### Q3. Which RAML version do you use?
RAML 1.0.

### Q4. RAML vs. OAS?
- Both describe REST APIs.
- RAML is common in MuleSoft projects; OAS (formerly Swagger, JSON/YAML, v2/v3) is common elsewhere.
- Design Center supports both.

### Q5. What is an API specification?
A contract between consumer and provider defining resources, methods, request/response/error structures, examples and security.

### Q6. Schema vs. example?
Schema defines structure (fields and types); example shows sample values.

### Q7. Which methods for create, partial update and fetch?
POST, PATCH, GET.

### Q8. Do you always need all three API-led layers?
No. Skip layers (e.g., Process) when not needed — each API costs vCores. It depends on requirements and future reuse.

---

## 12. Must Remember

1. Lifecycle: **Design (design → simulate → feedback → validate) → Implementation → Management (secure, deploy, monitor)**.
2. Output of design = **API specification**.
3. Modules: **Design Center, Exchange, API Manager, Runtime Manager, Anypoint Monitoring**; Studio for development.
4. **RAML** = YAML-based; **1.0** is the version to know. **OAS** = Swagger (2.0/3.0).
5. Spec contains **requests, responses, errors, schemas, examples, resources, methods, security**.
6. "RAML ready" (casual) = "API specification ready" (official).
7. Employee use case: **POST create, PATCH update, GET fetch** — on `/employees` and `/employees/{empid}` (as built on Day 23).
8. **Source** = HR app (Postman for now); **target** = employees DB.
9. Every extra layer costs vCores — skip the Process API when not needed.
10. Experience API: **HTTPS + OAuth**; internal layers: lighter policies (client ID enforcement / basic auth).
