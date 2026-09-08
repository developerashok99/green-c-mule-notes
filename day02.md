# Day 02 — Prerequisites Overview, API vs Integration, MuleSoft Developer Role

## Topics Covered
- What prerequisites are needed before learning MuleSoft
- API vs. Integration (with examples)
- Common integration project requirements
- Software/licensing needed to practice
- Full course content walkthrough
- Role of a MuleSoft developer in a real project team

## API vs. Integration
- **Integration** = any program/tool connecting two or more applications to exchange data (broader concept).
- **API** (Application Programming Interface) = a specific *type* of integration — a piece of code (mostly auto-generated XML in MuleSoft, since it's a low-code/drag-and-drop tool) that lets two systems communicate and exchange data, usually exposed for on-demand consumption (e.g. a balance-check request/response).
- **Integration (non-API) example:** a scheduled job — e.g. a nightly scheduler pulls data from Salesforce, transforms it, and inserts it into a database. Nothing is "exposed" for external consumption; it just runs on a schedule.
- Both are built the same way in MuleSoft (drag-and-drop, ~80% of the time; DataWeave scripting the remaining ~10-20%).

## Front-End vs. Back-End vs. API (Bank Example)
- **Front-end**: the mobile/web app the customer interacts with (built in React/JavaScript etc.) — "user experience" layer.
- **Back-end**: where data actually lives (e.g. a database).
- **API**: the middle layer — receives the front-end's request, talks to the back-end, and returns a formatted response. Exists because front-end and back-end technologies don't natively understand each other, and because direct database access from the front end would be an unacceptable security risk.

## Common Integration Project Requirements (the ~80% the course focuses on)
- REST services (create) and SOAP services (mostly just consume, rarely create — legacy)
- File-based systems: File, FTP, SFTP connectors
- Databases
- Messaging services: JMS / ActiveMQ / Anypoint MQ (pub-sub, decoupling, queues vs. topics)
- System connectors: Salesforce (very common, heavily interview-tested), plus others like AWS depending on the batch

> Rationale: learn less, achieve more — 300+ connectors exist in the MuleSoft ecosystem, but no one uses even a fraction of them regularly. Master the common ~80% pattern and pick up new connectors via documentation/POC when a project needs them.

## Software Needed to Practice (all free for learning purposes)
- **Anypoint Platform account** (free trial, ~30 days access)
- **Anypoint Studio** (the IDE — free for development; licensing only matters for cloud deployment)
- **Postman** (for testing APIs)
- **MySQL / a database** (for the database connector)
- **Notepad++** (general text editor)
- Minimum system specs: reasonable RAM/CPU so Anypoint Studio runs smoothly (a slow system will make practicing painful)

## Full Course Content Roadmap (mentioned)
Prerequisites → Anypoint Platform/Studio basics → building applications (Listener, Database, Logger, Transform Message) → project structure & debugging → DataWeave (transformation language, 2-4 sessions) → deployment strategies (CloudHub, on-premises, hybrid) → CI/CD (Jenkins, Bitbucket/GitHub) → REST & SOAP services → File/FTP/SFTP → properties (per-environment config) → Object Store (temporary storage) → routing (Choice router, etc.) → JMS/queues → DataWeave deep-dive → error handling & MUnit testing → API-led connectivity (Experience/Process/System layers) → API policies (basic auth, client ID enforcement, OAuth, rate limiting, spike control) → batch/for-each/parallel processing → async patterns.

## Role of a MuleSoft Developer (Real Project Team Structure)
Typical team: Business Analysts → Technical Architect / Solution Architect → Leads → Developers/Testers.
- Business team documents functional requirements (BRD); architects produce high-level and low-level design documents.
- A developer's job: read the design docs (request/response shape, error handling expectations), clarify doubts with lead/architect/BA, then **implement** — design the API (or use it if already designed), build it in Studio, secure it, deploy it, and support unit testing (MUnit).
- Daily Agile scrum calls (status, blockers) — communication skill matters as much as technical skill.
- Task estimation (easy API: 3-5 days, medium: 5-7 days, complex: 7-10+ days) is typically done by leads/architects, not developers directly, though developers provide input.

## Q&A Highlights
- **Three API types** (Experience, Process, System) all follow the same underlying design process — the distinction is architectural role, covered in depth later (API-led connectivity).
- MuleSoft developers don't interact with the front end directly — Postman fills that gap during development/testing before a real front end is ready.
- Even senior engineers (8+ years) haven't used most of the 300+ connectors — the practical approach is to learn the common ones deeply and pick up new ones via official documentation + a small POC when a project requires it.
