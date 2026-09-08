# Day 03 — APIs, Web Services, REST vs SOAP, Environments

## Topics Covered
- What is an API, what is a web service, and how they relate
- REST vs. SOAP (deep comparison)
- Different real-world environments (Dev, SIT/QA, UAT, Pre-Prod, Prod, DR) and why they exist

## API vs. Web Service
- **All web services are APIs, but not all APIs are web services.**
- The distinguishing factor is the **network** used:
  - Uses the **internet** → it's a **web service**.
  - Uses a **private/internal network** → it's just an **API** (not exposed publicly).
- Analogy: an API needs a "vehicle" (network) to deliver a request — internet = web service; private network = internal API.

## Generic Analogy: Restaurant
Customer (front-end) → Waiter (API) → Kitchen/Chef (back-end). The waiter mediates between customer and kitchen, neither of whom talk to each other directly — exactly like an API mediates between a front-end app and a database/back-end system, regardless of which front-end (mobile, iOS, web) is making the request.

## REST vs. SOAP

| | REST | SOAP |
|---|---|---|
| Full form | REpresentational State Transfer | Simple Object Access Protocol |
| Data formats | JSON, XML, HTML, plain text — flexible | **XML only** |
| Protocol | Uses HTTP | Can use multiple protocols (commonly HTTP too) |
| Design language | **RAML** (Restful API Modeling Language) | **WSDL** (Web Service Description Language) |
| Resource usage | Lightweight, fewer resources | Heavier — requires more bandwidth |
| Caching | Supported | Not practically supported |
| Security | Flexible, can be layered on as needed | Built for very high-security/strict scenarios |
| Usage today | ~99-100% of new MuleSoft API development | Rare — mostly legacy systems; usually only **consumed**, not newly created |

- **Why JSON over XML:** JSON is lightweight (same data takes less space — no repeated opening/closing tags) and is the most widely accepted format across systems, so it's used the vast majority of the time.
- **Caching example:** if a query's result can't change (e.g. "employees who resigned before Oct 15" — a past date, so the list is permanently fixed), the response can be cached instead of re-querying the database every time, improving performance. This works well for REST but is largely impractical with SOAP due to how the protocol works.
- **When to use SOAP:** legacy systems, or scenarios demanding very high/strict security guarantees. Otherwise, default to REST for modern integrations.

## API Design Basics (teaser, detailed later in `day04`/RAML sessions)
- API lifecycle starts with **Design**: define the request format, response format (success + error), security, using a modeling language — **RAML** for REST.
- Example resource: `localhost:8081/db` — the design phase decides exactly what such a path, its request body, and its responses look like *before* implementation begins.

## Real-World Environments
Different stages an application passes through before reaching real users, and why each exists:

| Environment | Purpose |
|---|---|
| **Dev** | Developer builds and does basic functional testing locally/in Anypoint Studio |
| **SIT / QA / Testing** | Dedicated QA/testing team does rigorous testing — checks edge cases, error responses, invalid inputs, etc., in an isolated environment with its own database/Salesforce/etc. so it doesn't interfere with other teams' testing |
| **UAT** (User Acceptance Testing) | Business team / actual clients test that the requirement genuinely satisfies their needs before sign-off |
| **Pre-Prod / Performance** | Performance testing under expected load (tools like JMeter, LoadRunner) — determines memory/CPU/scaling needs; decides how many concurrent users the app must support |
| **Production (Prod)** | Live environment; deployments happen in **non-business hours**, done by a dedicated deployment team with proper approvals |
| **Disaster Recovery (DR)** | A geographically separate replica environment (e.g. a second data center) for business continuity if the primary center goes down — common in banking/finance where extended downtime causes major business loss |

- Not every organization has all six environments — it depends on budget and requirements. In practice, many companies run with just **Dev → Test → Prod** (3-4 environments), while regulated/high-scale industries (banking) tend to have the full set including DR.
- **Why separate environments matter for a developer:** each environment typically points to a different database/Salesforce org/etc. so QA testing one feature doesn't corrupt data another team depends on, and so production data/systems are never touched by non-production testing.

## Key Takeaway
> REST (JSON, HTTP, RAML-designed) is the default choice for ~99% of new MuleSoft development; SOAP is legacy-consumption-only in most modern projects. Environments exist to isolate development, testing, business validation, performance validation, and live traffic from each other — each with its own dedicated backend systems.
