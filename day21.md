# Day 21 — API Lifecycle Revisited: Design-Simulate-Validate, RAML Basics, and the Employee Use Case Setup

## Session Agenda
- Revisiting the **API Lifecycle** (first covered on Day 04) with a deeper, more granular breakdown of the **Design** phase specifically
- **RAML vs. OAS** — a second, more detailed pass
- Real naming conventions and terminology used in industry ("is RAML ready?" vs. the "technically correct" phrasing)
- Introducing the **Employee use case** — the running example the course will build hands-on across the coming sessions
- Applying **API-Led Connectivity** concretely to this use case, including the judgment call of when to skip the Process layer

## Why Revisit the API Lifecycle — Stated Directly
*"We discussed the API lifecycle in the prerequisites section, but now we will try to revise it and learn a little bit more than what we learnt exactly... what steps are we going to take now? We will get an idea clearly."* This session goes deeper specifically into the **Design** step, since the course is about to spend real time building against a RAML specification for the first time.

## The API Lifecycle, Broken Into Three Higher-Level Stages
- **Design → Implementation → Management** — with **Design** itself broken further into a precise sub-cycle:

```
Design → Simulate (mock the API) → Test/Validate (get feedback) → [repeat if changes needed] → API Specification (final output)
```

- **Simulate, precisely explained**: before any real implementation exists, a **mocking service** is created directly from the RAML spec (Anypoint Platform can auto-generate a mock endpoint from a RAML file) — this lets consumers **test the shape of the API** (does sending the expected request produce the expected response and expected error response?) *before* any real backend logic is built.
- **Who actually does this testing, addressed directly and honestly**: *"this feedback can [be given by] evaluate[ors]... they can test it like a demo service... but in real time, most of the time, they don't test the business [use case directly]— it is always a good practice to share the URL or Postman collection and ask them to test it."* Business stakeholders/consumers are given a testable mock and asked to validate against it — this is the same "blueprint before construction" analogy used since Day 04, now applied concretely to the mocking step specifically.
- **The output of the entire Design phase, stated directly and simply**: *"the output of the first step [is the] API specification."*

## The Full Lifecycle, Mapped Back Onto Anypoint Platform Modules (Recap, Reinforced)
| Lifecycle step | Anypoint Platform module |
|---|---|
| Design (incl. simulate/validate) | **Design Center** |
| Implementation | **Anypoint Studio** |
| Secure | **API Manager** |
| Deploy, monitor logs, scale | **Runtime Manager** |
| High-level monitoring | **Anypoint Monitoring** |
| Sharing the finished API spec for others to build against | **Exchange** |

- **A direct clarification on Anypoint Code Builder's real-world adoption, restated and reinforced from earlier sessions**: *"it is not changing much in the industry — they are using it only for theoretical knowledge and demos... in real time, everyone is using [Anypoint] Studio. It is more powerful."*
- **A precise, useful clarification on the relationship between Anypoint Platform and its modules, given directly**: *"Anypoint Platform is a console or user interface where you can do your management activities... Anypoint Platform is nothing but a package of different small applications. One part of it is the Design Center."* Design Center, Exchange, API Manager, Runtime Manager, and Monitoring are all sub-applications packaged together under the umbrella term "Anypoint Platform" — not separate, unrelated products.

## RAML vs. OAS — a Second, More Precise Pass
- **RAML, precisely defined again, with the full expansion given directly**: *"RAML stands for Restful API Modeling Language... it is a YAML-based modeling language to describe RESTful APIs and design API specifications."* **A direct, useful clarification on RAML's relationship to YAML**: *"if you observe, we have designed the YAML file [in property files, Day 14] — it will be [that] type only, but a little enhanced... it's in simple English, easy to understand, not very complicated."*
- **What actually goes inside a RAML specification, listed directly and precisely**: requests, responses, **schemas** (the *structure* something must follow, regardless of the specific values — the table-with-fixed-columns analogy is given directly: *"the table is a schema, and the values inside it will come under the data... the column name and details are the same — that's schema"*), **examples** (concrete sample values matching a given schema), and the breakdown into **resources, methods, and security schemes.**
- **RAML versions, precisely stated**: Design Center supports **1.0 and 0.8** — but **1.0 has been the dominant, real-world standard for 5-6 years**, and 0.8 is explicitly flagged as something almost nobody has real experience with anymore: *"will we use 0.8? What will they say if we ask them if they have experience? No... even I have used 0.8 version till now [rarely, if at all]."* **Direct interview guidance given**: if asked which RAML version you're comfortable with, say **1.0**; if asked the latest version, "just check in Google and keep it in mind" — an honest acknowledgment that exact version numbers aren't something to memorize blindly.
- **A precise organizational fact given directly**: RAML is *"an organization... promoted by MuleSoft... I think MuleSoft backed and supported [it] — that's why it became famous"* — explaining directly *why* RAML, despite being one of several possible specification languages, is the dominant one specifically within the MuleSoft ecosystem.
- **OAS, precisely reiterated**: two supported formats (**JSON and YAML**), two versions (**2.0 and 3.0**) — used heavily for **non-MuleSoft** projects and general web-service development elsewhere in the industry. **Interview framing, restated directly**: *"if you say I came to OAS — no problem, I have never got an opportunity to work on OAS — mostly I worked on RAML-related things only... if I get the opportunity, I can learn and do it."*

## A Genuinely Useful Real-World Terminology Note: "Is RAML Ready?" vs. the Technically Correct Phrase
- **A direct, memorable analogy given to explain a real, common informal usage**: *"if we want a photocopy, we go to a Xerox shop and ask for Xerox — Xerox is a company name, but it has become the word for photocopy."* Similarly, in real MuleSoft teams, people casually ask *"is RAML ready?"* even though the technically precise phrase is *"is the API specification ready?"* — **the instructor's own direct guidance**: use whichever phrasing your team actually uses day-to-day (RAML is the common, informal shorthand), but know that **"API specification"** is the officially correct, diplomatic term — useful specifically for more formal communication or documentation.

## The Employee Use Case — Introduced, Fully Specified

### The Requirement
A front-end (mobile or web) HR application needs to:
1. **Create** a new employee record.
2. **Update** an employee record (specifically framed as a **partial** update — e.g. after a promotion, only `designation` and `salary` change, not all 10-20 employee fields).
3. **Fetch** an employee's details.

### Deciding REST vs. SOAP, and the Right HTTP Method for Each Operation
- **REST chosen directly, with the reasoning restated concisely**: *"there is no need to secure it very high here... when we need scalability, even if it's a lightweight application, we can go for REST"* — SOAP is reserved for high-security scenarios, which this use case doesn't require (echoing Day 03/13's established REST-vs-SOAP framing).
- **The precise method mapping, worked through directly**:

| Operation | Method | Reasoning |
|---|---|---|
| Create employee | **POST** | New resource creation |
| Update employee (partial) | **PATCH** | *"His designation and salary [change]... if there are 10-20 fields, it changes to 2 or 3 — whether we are partially updating or completely replacing... partially updating, then PATCH"* |
| Fetch employee | **GET** | Retrieval only |

- **A direct, precise design decision walked through**: should Create/Update/Fetch be **three separate resources**, or **one resource supporting three methods**? *"Can I differentiate clearly under one resource itself? If you cannot differentiate like that, I should go for different resources."* Since POST/PATCH/GET on the *same* `/employee` resource are already clearly distinguishable by method alone, **one resource with multiple methods** is the natural, sufficient design here — multiple resources would only be needed if the methods alone couldn't disambiguate intent.

## Applying API-Led Connectivity to the Employee Use Case, Concretely

```
Consumer (HR app, via Postman for now) → Experience API → Process API → System API → Database
```

- **A direct, important architectural judgment call revisited from Day 04, now with a concrete cost trade-off attached**: *"already have an idea for the architect — can I reuse this Process [layer] again? ... to be honest, we don't need this functionality [right now] — maybe in the future some extended functionality will come — that's why I'm putting it in front [i.e., building it anyway]."* But immediately, directly, the **cost of over-building is quantified**: *"for a simple requirement, I have to spend 0.3 vCore [instead of 0.1]... more services, more vCore, more licensing cost — got it? So it's very important to know when to skip what."* This directly ties the abstract Day 04 "should I skip the Process layer?" question to a **concrete, real, dollar-and-vCore cost** — reinforcing that this is a genuine architectural trade-off, not a purely theoretical one.
- **A direct, explicit confirmation that this use case IS microservices architecture, worked through precisely**: *"is microservices architecture being implemented with API-Led architecture? ... a big service, we break it and make it [into smaller pieces] properly... employee creation, updation, fetching is a meaningful business service, and it is a small service"* — distinguished directly from unrelated business domains (*"there are customers, there are employees, there are vendors... I am breaking that business-wise — there is a clear line of difference"* — each gets its own separate, purpose-built set of APIs).
- **A direct, important professional-responsibility point, worth remembering precisely**: even if you personally only build the **System API** for this use case, *"whenever you wanted to go out of your project and explain your project... will you agree if I say I don't know more than that [about the Process/Experience layers]? No — you should understand the total function[ality]."* A developer is expected to understand the **whole** flow their piece fits into, not just their own isolated component, specifically for the purpose of speaking confidently about the *end-to-end* project in an interview or a cross-team discussion.

## Security Policy Placement, Layer by Layer — A Concrete, Worked Decision
- **Experience API** (internet-facing, HR web app): **HTTPS is mandatory** — *"this is the first layer being attacked by any malicious agent"* — plus, for higher security, **OAuth** is introduced as an *additional* layer beyond HTTPS, with the precise distinction explicitly deferred: *"I will tell you how secure HTTPS is when we discuss OAuth — this is a little tricky"* (full OAuth depth flagged for a future policies-focused session).
- **Process API** (internal to the enterprise network): **lower-security policies are sufficient** — *"we can use less security... basic authentication or client ID enforcement"* — since it's not directly internet-exposed.
- **System API** (internal, closest to the database): similar reasoning to Process API — the actual policy choice is, once again, **architect-dependent, not automatic**: *"again, it is dependent, exactly."*
- **The core recurring principle, restated directly, tying back to Day 04's original security discussion**: security requirements scale with **actual exposure**, not with an assumption that "internal" automatically means "low-risk" — the specific policy choice at each layer is a deliberate decision made by the architect based on real risk, not a fixed formula.

## Quick Recap
- **The Design phase of the API Lifecycle has its own internal cycle**: Design → Simulate (mock the API) → Validate (get consumer feedback) → repeat if needed → final API Specification — this mocking step is the concrete mechanism behind the "blueprint before construction" analogy used since Day 04.
- **RAML (YAML-based, MuleSoft-backed, version 1.0 dominant) vs. OAS (JSON/YAML, versions 2.0/3.0, used more broadly outside MuleSoft)** — know RAML 1.0 as your practical baseline; admitting no OAS experience is a completely acceptable, honest interview answer.
- **The Employee use case** (Create/Update/Fetch, mapped to POST/PATCH/GET on one resource) is the running example for the rest of this arc of the course — REST was chosen over SOAP for the same reasons established since Day 03.
- **API-Led Connectivity, applied here, surfaces a real cost trade-off**: building a Process layer "just in case" costs real vCore/licensing money — the decision to include or skip it is a genuine architectural judgment, not a default.
- **Security policy choice scales with actual exposure per layer** (HTTPS/OAuth for the internet-facing Experience API; lighter policies for internal Process/System APIs) — always a deliberate, architect-level decision, never automatic.
