# Day 22 — Multiple Consumers, Naming Conventions, Schema Depth, and Real API Documentation Practices

## Session Agenda
- How many APIs are actually needed when there are multiple front-end consumers (mobile + web) and multiple backend systems
- Real, industry naming conventions for Experience/Process/System APIs (kebab-case)
- JSON validation tools and troubleshooting malformed JSON, hands-on
- Schema depth: field-level constraints (min/max length, mandatory/optional), and where tokens/correlation IDs actually belong
- Real API documentation practices: Confluence, high-level diagrams, API landscape diagrams, sequence diagrams, and field-mapping sheets

## Counting APIs for Multiple Consumers and Multiple Systems — A Full Worked Example

**Scenario given directly**: 2 experience systems (mobile app, web app) + 2 backend systems (a Database, a Salesforce system).

```
Mobile App ─┐                    ┌─ Database
            ├─ Process API (shared) ─┤
Web App ────┘                    └─ Salesforce
```

- **The precise count, worked through directly**: *"how many APIs are required for this? ... there are two experience systems... two experience APIs... [and] one for each system — one Database system API, one Salesforce system API... how many APIs are there overall? 5 APIs."* (2 Experience + 1 Process + 2 System = 5.)
- **The reuse confirmed directly**: *"can we reuse the Process API [across both Experience APIs]? Yes"* — exactly the same reuse pattern already established on Day 04's Order History example, now reapplied to this new use case.
- **A direct, realistic extension of the "who calls whom" question, worth remembering**: APIs aren't only called by your own organization's front-ends — *"other companies can call our APIs from anywhere... otherwise, in our own company, another department [e.g. finance, marketing] can call [our] API too."* Cross-department internal consumption is just as real a scenario as external third-party consumption, and doesn't change the underlying API-Led design principles.
- **Why mobile and web get separate Experience APIs even when the underlying data is identical, restated and sharpened**: *"web application requires more data — there is more space for presentation, because of that, more data is expected... Process API has the same data for [both] experience APIs, but [the] experience API [shapes/filters] as per the consumer."* The Process layer does the same underlying work either way; the Experience layer is where consumer-specific shaping actually happens.

## Real Naming Conventions for Experience/Process/System APIs

- **The dominant convention, named directly and precisely**: **kebab-case** — *"each word is separated by hyphen... it's not underscore, it is hyphen"* (a direct, useful clarification since the two look visually similar and are easy to confuse when typed quickly).
- **A direct, practical constraint reiterated from Day 18's application-naming rules**: *"it is always advisable to keep your name as short as possible"* — long, fully-descriptive names can run into the same length limits already encountered during CloudHub deployment.
- **Real-world naming variation, explicitly acknowledged as organization-specific, not a universal standard**: some organizations suffix System APIs with `-sapi` (e.g. `hr-sapi`), others use different conventions entirely — *"some organizations do like this... this is not wrong — you can put any name you want, no problem, everything will work... some people do [follow a more] standard practice."* The lesson: **learn and follow whatever convention your specific team already uses**, rather than assuming there's one single universally-correct format.

## JSON Validation — A Real, Hands-On Debugging Session

- **The motivating problem, stated directly**: *"there are some validators [some companies restrict using external websites for] — like jsonlint.com — if your company is restricting [external tool use], how do you identify [errors] yourself?"* — i.e., you need to be able to spot JSON errors **by eye**, not just by pasting into a validator tool, since some workplaces don't allow external tools for security reasons.
- **The core visual-inspection checklist, given directly**: *"object[s]... key[s] also should be in double quotes"* — and a specific, sneaky real-world gotcha directly called out: *"sometimes these double quotes are printed differently — they are written in words, they are written in text"* — i.e., copying JSON from a **PowerPoint slide or Word document** can silently convert straight double-quotes (`"`) into "smart quotes" (curly `"`/`"`), which **look identical to the eye** but are technically different Unicode characters that break JSON parsing.
- **A real, live debugging example worked through directly**: an actual JSON parse error — `"error: parse... expecting EOF"` — traced by careful re-reading to a **stray trailing comma** at the end of the object. **The instructor's own direct habit-forming advice**: *"if you have read this 4-5 times, you will understand it easily"* — methodical, repeated close reading, not a single glance, is the realistic way to actually spot these small syntax errors.
- **Postman as a practical validation fallback, demonstrated directly**: pasting a JSON body into Postman's Body → raw → JSON view will flag malformed JSON directly (though, as shown live, it won't always pinpoint *exactly* which character is wrong) — genuinely useful as a second-opinion check alongside careful manual reading.

## Schema Depth — Field-Level Constraints, Fully Worked

- **The precise motivating anxiety, named and defused directly**: *"when we get a new API request, if you have 120 fields, you will get scared. What should we do without getting scared? We will break them one by one"* — go through fields systematically rather than being overwhelmed by sheer volume.
- **The exact per-field checklist demonstrated directly, using an `employeeId` field as the worked example**:
  - **Data type**: e.g. `string`.
  - **Length constraints**: `minLength` and `maxLength` — e.g. maximum 20 characters — directly connecting back to Day 10's strict-validation discussion on field-level restrictions.
  - **Mandatory or optional**: *"required — it is required by default... if it is not required, [you set] false"* — **a precise, useful RAML default fact, stated directly**: fields are treated as **required by default** unless explicitly marked otherwise, the inverse of `additionalProperties`'s own "permissive by default" behavior covered on Day 10 — worth keeping the two defaults straight, since they point in opposite directions.
- **Who actually decides mandatory vs. optional, addressed directly**: *"do we decide on our own, or do the team leaders decide?... they decide, most of the time — because they say it in the initial business discussion"* — this is a business-requirements decision, documented and confirmed upfront, not something a developer infers or guesses independently.

## Where Tokens and Correlation IDs Actually Belong — Not in the Body

- **A direct, precise clarification, worth remembering exactly**: *"can I send a token in the body? ... it's not a mistake [technically], I can send it — but it doesn't look nice, right?"* Exactly like the HTTP-method conventions from Day 06 (nothing technically stops you, but it violates expected convention), **security tokens and correlation IDs belong in headers, not the request body** — this is a **standard, not a hard rule**, reusing the same traffic-rule framing applied throughout the course to every other convention-vs-enforcement discussion.
- **The realistic authentication flow, sketched directly**: *"HR application[s] generate tokens... they take the token [and send it]... API Manager [checks it]... if the API Manager checks and everything is correct, then the experience API request will come [through]... if the token is wrong, [the] API Manager will reject it"* — i.e., a gateway/API Manager layer validates the token **before** the request ever reaches your actual Experience API implementation, which is why the architecture is genuinely more layered than a simple "consumer → API" picture suggests.
- **Correlation ID, reiterated directly, tying back to Day 18's own log-tracing usage**: a unique per-request identifier, sent in headers, used specifically to trace one request's full journey across logs and systems.

## Real API Documentation Practices — What Actually Gets Produced and Where It Lives

- **Confluence, named directly as the standard real-world tool**: *"you manage it in Confluence — there is already a structure there... you can create a template... and provide the details."* The instructor directly notes this mirrors informal note-taking (e.g. in WordPad) but with an organized, shared, searchable structure for the whole team.
- **The concrete artifacts that get documented, listed directly**:
  - **API request/response details, data types, schema.**
  - **Postman collections** — per environment (Dev/UAT/Prod).
  - **High-level design diagrams** — an overall visual map of how the project's pieces connect.
  - **API landscape diagrams** — precisely defined directly: *"how many APIs are there for that [particular] business functionality"* — a map specifically of the API layer, distinct from a full technical architecture diagram.
  - **Sequence diagrams** — precisely motivated with a direct, concrete worked example: *"I have an experience API, there are [two Process APIs], there are 4 system APIs from the Process APIs — there should be an explanation of which sequence to go, and how to go... as a developer, you don't have an idea [without this diagram]"* on your own — a sequence diagram is specifically what tells a developer the **order of calls** across a multi-layer API-Led architecture, information that isn't otherwise obvious just from looking at the individual API specs in isolation.

### A Fully Worked, Realistic Scenario Tying Sequence Diagrams to a Real Decision
- **The exact scenario given directly**: an API needs to support a `sysToken` across **4 endpoints**. One endpoint (`checkUserExistence`) goes to a specific System API (`cprv`); the other three route through Process-layer endpoints instead. **The precise question posed and answered directly**: *"should I implement this `sysToken` for only one, or the rest three? ... validation is only for one, `cprv` — that's it."* Because token **validation** logic specifically lives only in the `cprv` System API (per the sequence diagram/documentation), only that one endpoint's implementation actually needs the token-handling logic — the other three don't, even though all four are part of the same broader API. This is a direct, concrete illustration of *why* sequence diagrams and precise documentation matter: without them, a developer might assume all 4 endpoints uniformly need identical token handling, when in fact the real requirement is far more targeted.

### Field-Mapping Sheets — a Genuinely Practical, Often-Needed Artifact
- **The precise motivating problem, given directly**: connecting a System API's request fields to a real database's actual column names, when **the names don't already match cleanly**. *"Do you think all the names are matching like this in real time? No — there are different mappings... that's where you have to put your brain there."*
- **The concrete artifact, described directly**: a simple table mapping each incoming field (e.g. `employee_salary`, `employee_name`, `employee_status`) to its corresponding real database column — created collaboratively, often requiring **a direct discussion with the business/data team** rather than being guessable independently: *"arrange a call and let's have a discussion... that way it happens exactly."*

## A Direct, Personal, Time-Management Aside — Worth Preserving
Responding to a question about whether reusing/copying existing code/config is "cheating" or lazy: *"copy and paste is not wrong in my opinion — but you should know what to copy, what to paste, and how to make [the] minimal changes [needed]... the less time we can work [while still doing quality work], the better — because the time remaining can be utilized for useful things"* — spending time with family, learning something new, resting — rather than treating long hours as inherently virtuous. **Direct, practical career advice on how to actually get good at this specific skill**: *"many people do it from scratch without [reusing anything] — I don't suggest that... if you follow it for 2-3 months, from the 3rd month to the 4th month, slowly reuse what is there and add something to it — that is a very smart move, and it will save a lot of time in the industry."* Deliberate, judicious reuse — built up gradually as real project familiarity grows — is framed directly as a genuine professional skill, not a shortcut to be embarrassed about.

## Quick Recap
- **Counting APIs for multiple consumers/systems is mechanical once you know the pattern**: one Experience API per distinct consumer type, System APIs one-per-backend-system, and a shared Process API reused across Experience APIs where the underlying business logic is genuinely the same.
- **Kebab-case is the dominant real-world naming convention**, but exact conventions vary by organization — follow your specific team's existing pattern.
- **JSON errors are often invisible-looking** (smart quotes from PowerPoint/Word, trailing commas) — methodical, repeated manual reading plus a Postman/validator second-opinion check is the realistic debugging approach.
- **Fields in RAML are mandatory by default** (the opposite default from `additionalProperties`) — and mandatory/optional status is a business decision, documented upfront, not a developer's independent call.
- **Tokens and correlation IDs belong in headers, not the body** — a convention, not a hard technical rule, exactly like every other HTTP convention covered throughout the course.
- **Real documentation (Confluence, high-level diagrams, API landscape diagrams, sequence diagrams, field-mapping sheets) exists precisely to answer questions a developer can't otherwise infer alone** — like *which specific endpoint actually needs a given token check*, as shown in the worked `sysToken`/`cprv` example.
- **Deliberate, judicious code/config reuse is a genuine professional skill worth building over your first few months**, not something to feel guilty about.
