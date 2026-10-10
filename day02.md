# Day 02 — Prerequisites Overview, API vs Integration, Course Content Deep-Dive, MuleSoft Developer Role

## Session Agenda
1. Prerequisites needed before core MuleSoft topics
2. Common integration project requirements
3. Course content, walked through in detail
4. Software needed to practise, and costs (no charges expected)
5. Recommended system configuration
6. Role of a MuleSoft developer in real time
7. Q&A

---

## 1. What MuleSoft Developers Actually Build (Two Things)
- **MuleSoft development is, at a high level, building two kinds of things — REST APIs, and Integrations.**
- An API is also part of integration, but the two are discussed separately (see the two examples below).
- Both are mostly drag-and-drop; about **10–20%** of the time goes into writing transformations.
- The board drawing: MuleSoft → {REST APIs, Integrations} → built in **Anypoint Studio (development)**, managed in **Anypoint Platform**.

## 2. API vs. Integration — Worked Through with Two Concrete Examples

### Example A: API — ICICI Bank Balance Check
```
Mobile App (front-end) → request (account no., customer ID) → API → request → Database (back-end) → response → API → Mobile App shows "₹25,000"
```
- **Front-end**: the system the customer experiences (mobile app, desktop app) — a "user experience system." Usually built with React, JavaScript, etc.
- **Back-end**: where the data lives — here a database holding customer details and the balance; a different technology (e.g., Java).
- **Why not connect them directly?**
  1. Different technologies — they can't communicate with each other.
  2. **Security** — hackers could hit the database directly and steal data. A layer in between is needed.
- **The API's job**: take the request, turn it into a database request, get the balance, and send the response back.
- The front-end arranges the response and shows "₹25,000 in your account."
- The API is the **middle layer between the front-end and the back-end**.

### Example B: Integration (non-API) — Nightly Salesforce → Database Job
```
Scheduler (e.g., 10 or 11 PM every night) → Get data from Salesforce → Transform → Insert into Database
```
- A scheduler triggers it automatically every day.
- It is **not exposed** for another system to consume — "a regular job is going on."
- It still connects two systems and transforms data, so it is an **integration**, not an API.
- The instructor's summary: *"Mostly the work we do with MuleSoft is to develop REST APIs and integrations."*

## 3. Anypoint Platform — First Mention of Its Sub-Modules
- Sub-tools named: **Design Center, Exchange, Runtime Manager, Visualizer, Monitoring**, and more; the drawing also lists **API Manager**.
- The platform home was shown: Anypoint Code Builder, Design Center; Management Center — API Manager, API Governance, Runtime Manager.
- The platform covers the API lifecycle steps; details later — "if I say it now, it will be overwhelming."

## 4. Full Prerequisites List (slide)
- **Monolithic applications**
- **Microservices architecture** — how the industry migrated from monolithic, and how microservices are implemented in MuleSoft
- **APIs, web services, REST and SOAP services** — why REST is used more, SOAP less
- **API life cycle**
- **Different environments in real time** — development, testing, pre-prod, prod, disaster recovery: why they exist and the significance of each
- **JSON, CSV and XML data formats**
- **HTTP discussion** — REST depends on HTTP: how requests are sent, how responses behave on success and on error, how different errors are returned
- The batch mixes non-IT students, IT students and freshers, so these are taught from scratch over **3–4 sessions**.

## 5. Common Integration Project Requirements — the "80% Rule," Elaborated Further

| Requirement (slide) | Detail given |
|---|---|
| **Consume and provide REST services** | What consumers most often ask for. |
| **Consume SOAP service** | If a system already exposes SOAP, we consume it — we don't create it. Rare, but asked in interviews. |
| **Consume File, FTP and SFTP services** | Common: move a file from an FTP/SFTP server to another system, transforming it. Plan: download and install an FTP server, connect to it, learn when to use FTP vs SFTP. |
| **Consume database service** | Constant requirement. |
| **Consume JMS service** | Queuing services; download the **ActiveMQ** broker; when and why to use JMS, and its operations. |
| **Consume system connectors** | Azure, Salesforce, AWS and others. **Salesforce** is the focus — asked a lot in interviews. One more connector to be added for this batch, maybe **AWS**. |

- Focusing on these 5–6 requirements is said to cover **75–80%** of a project — "learn less, achieve more."
- JMS terminology promised: **publisher / producer / sender** are names for the same side; **queue vs topic** and when to use each; **decoupling** and **asynchronous** messaging.

### JMS preview drawings (shown in class; the audio here is lost in a repetition loop)
- Publisher/producer/sender → message (headers + body) → broker / JMS server (ActiveMQ) holding a **queue or topic** → subscriber/consumer/receiver.
- **Queue** — a pipeline of messages, one-to-one.
- **Topic** — a new employee published once, received by finance/payroll, HR, marketing/operations.
- Operations: **publish, consume, On New Message, publish-consume** (synchronous).
- **Acknowledgement modes**: auto, manual, immediate, dups_ok; **DLQ**; persistent vs transient queues.
- JMS brokers: Apache ActiveMQ, RabbitMQ, IBM MQ; **Anypoint MQ** costs an extra licence.

## 6. Software & Costs to Practice MuleSoft (practical logistics)
- The instructor's headline: most probably **no charges at any point** for practice.
- Software requirements slide:
  - **Anypoint Studio** — the IDE, similar to Eclipse; development use has lifetime access
  - **Active Anypoint Platform account** — if it expires, create a new account with a different username/email
  - **Mule Runtime** — to practise on-premises
  - **Advanced REST Client (Postman)** — for testing (used in the Day 01 demo)
  - **Notepad++**
  - **FTP server**
  - **MySQL Database and MySQL Workbench**
  - **ActiveMQ server**

## 7. Recommended System Configuration
- Slide: **8 GB RAM or above (16 GB is ideal)**, **Windows 10 or above**, **2 GHz processor**.
- If Anypoint Studio runs slowly, fix the configuration once, up front — a slow system makes practice slow.
- A student with a lower-spec machine ("one point five" — unclear) was told it should be fine.

## 8. Full Course Content — Expanded Walkthrough
Shown from the course-content file in Notepad++, in this order:

1. **Prerequisites** (above).
2. **Module 1 — Introduction of Mule ESB**: P2P integration and its problems, how ESB overcomes them; orchestration, transformation, enrichment; MuleSoft, Anypoint Studio, Anypoint Platform.
3. **Module 2 — Mule ESB basics**: Hello World app (Listener, Database, Logger, Transform Message explained properly); Mule event; Studio; **Postman** testing; **Mule 4.x project structure**; **debugging** step by step; DataWeave intro.
4. **DataWeave** — 2–3 or 3–4 sessions, from the basics.
5. **Module 3 — Deployment strategies**: **CloudHub** (cloud), on-premises (standalone server registered in Runtime Manager), **hybrid**.
6. **CI/CD pipelines**: continuous integration / delivery / deployment with Jenkins, Bamboo; code repository (Bitbucket/GitHub) and a Jenkins pipeline.
7. **Module 4 — Create and consume REST services; consume SOAP services.**
8. **Module 5 — File, FTP, SFTP**: differences, extra configuration, when to use each (the SFTP part is garbled — "we don't have the provision for SFTP").
9. **Module 6 — MySQL database**: install, connect; Select, Update, Insert, Bulk Insert.
10. **Module 7 — Properties**: Dev, testing, UAT, prod, pre-prod and DR use different servers (e.g., a database per environment); externalising and securing properties. "Very, very important"; 1–1.5 sessions.
11. **Module 8 — Object Store** (and watermarking): database = **permanent** storage, Object Store = **temporary** storage. Not a regular requirement, but needed when it comes.
12. **Module 9 — Routing**: **Choice** router (if condition 1 → these steps, condition 2 → those steps); sending the **same request to multiple systems** (Scatter-Gather on screen).
13. **Module 10 — JMS**: queue and topic; publish, consume, On New Message, acknowledgement modes.
14. **DataWeave in depth.**
15. **Error handling and MUnit**: MUnit tests built with the **recording** option or **manually**; ~1.5–2 hours per session. **Unit testing is the developer's responsibility.**
16. **API-led connectivity**: **Experience, Process, System** layers.
17. **API design with RAML** — the first lifecycle step, like an architect's **blueprint** for a house: request, success response, error response. RAML is simple, English-like; done in **Design Center**.
18. **API security policies**: **Basic Authentication, Client ID Enforcement, OAuth, Rate Limiting, Spike Control**, plus 2–3 more. API Manager's policy list was shown (JWT Validation, IP Allowlist/Blocklist, XML/JSON Threat Protection, Basic Auth – LDAP …).
19. **Data processing**: **For Each**, parallel processing, **Batch** for huge data, **asynchronous** — "very, very important" for interviews and real work.
20. **Code repositories**: Studio generates **XML code** in the background; if Studio crashes or gets corrupted, the code must be safe. **Bitbucket, GitHub, GitLab** — the commands to push code, and CI/CD deployment.
21. **One more connector** — to be released later for this batch.

> Q&A: "Will you explain with the application?" — Yes: every use case is explained theoretically, then built and deployed in Studio. On **Anypoint Code Builder** the answer is garbled; the gist is not to spend time on it now — learn it later when needed.

## 9. MuleSoft Certifications, Revisited With More Detail
- **Four major certifications**: **MCD Level 1, MCD Level 2, MCIA, MCPA.**
- The drawing marks **MCD Level 1** as the entry certification (about **200 USD**) and crosses out MCIA/MCPA (architect level).
- Free exam vouchers used to be available through classes; now everyone pays the 200 USD.
- Completing this course should be enough to clear MCD Level 1 — "more than enough for developers."

## 10. Salary Discussion (numbers as stated by the instructor — illustrative, not guaranteed)
- Board example for **3 years** of experience:
  - Norm: 3 × 2 = **6 LPA**
  - Minimum: 3 × 3 = **9 LPA**
  - Maximum: 3 × 5 = **15 LPA**
- The maximum is achievable with MuleSoft, but needs a lot of effort.
- Students quoted figures like ₹10–25 LPA for 3–5 years (garbled).

## 11. Real Project Team Structure & the MuleSoft Developer's Actual Role
- **Example:** a service company (**TCS**) runs a MuleSoft project for a client (**Airtel**).
- TCS forms a team: business analysts, delivery managers, technical architect, MuleSoft people, plus other technologies if needed.
- **Process flow** (board drawings):
  1. Airtel's users conduct regular **workshops** to give the requirements to the business team and solution architect team.
  2. The business team documents them as a **BRD (Business Requirement Document)** or **FSD (Functional Specification Document)**.
  3. The **technical architect** checks feasibility and produces the **HLD (High-Level Design)** — systems, architecture — then the **LLD (Low-Level Design)** — API-by-API detail.
  4. A large project (e.g., **100–150 APIs**) is split across **3–4 leads**; each lead has developers, testers and BAs.
  5. You, a developer, get a slice — e.g., 10–20 APIs. The drawing: a technical lead with **5 developers + 1 tester**; 10 APIs, about 2 per developer; Dev → QA → UAT → Prod.
- **The developer's job**: *"developing APIs plus developing integrations"* — **API design → API implementation + unit testing → secure API → deploy → monitor**.
- Implementation = development, and **unit testing is part of implementation**.
- The role slide: go through the **BRD** and **TDD (Technical Design Document)**; discuss queries with the business team and architect/technical lead; design, develop and unit test (developer); QA testing (testing team); UAT and production.
- **Getting unblocked**: read the HLD, BRD and LLD; ask the **lead** and **architect**; ask the **business analyst** for business questions.
- Why the developer job is easier than lead/architect: the request, response and error response are already documented — follow them step by step and ask the right questions.
- **Dependencies**: if your API connects to Salesforce and a database, you depend on the Salesforce team and the database team for their details.
- **Testing**: the testing and BA teams test; you fix the bugs they raise. You also deploy to the different environments and pipelines.
- **Communication**: daily **Agile scrum calls** (status, blockers); communication and technical knowledge together make the job easier.
- **Estimation** (working days): easy API **3–5**, medium **5–7**, complex **7–10** (or 10–12). Calculated by the **technical architect and lead**; depends on the organisation.
- **300+ connectors?** Nobody knows them all; the instructor worked with **10–15** in his whole career.
- For a new one (his example: **MongoDB connector**): read the official documentation, say in the meeting you'll do a **POC** first, spend a few hours, then start.
- Even the **Salesforce connector** has ~100 operations, of which 3–4 are used majorly — the course covers those.
- Exam analogy: of 10 chapters, learning 3 can give 70% — "learn less, more marks."
- **Front-end**: MuleSoft developers have no relationship with the front-end; **Postman** is used to test the API.
- Later the front-end and API are tested together, or a tester checks through the front-end and reports issues to the front-end team.
- **Practice**: attend class, rewatch the recording; learn the theory and repeat the demo hands-on. No extra assignments needed — ask if you want more.
- Rebuild even the small DB demo app **~20 times** — each time teaches something new.
- *"Just by watching videos, nothing will come… it's a drama."* Without practice, you won't know where to start when you open Studio.

## 12. API-Led Connectivity — First Direct Mention (fuller depth on Day 04)
- **Three API types**: **Experience API, Process API, System API.**
- *"Finally, an API is an API"* — the design is the same; what differs is **when and why** each layer is used (an architecture topic).
- The **Experience API** is exposed to the external world, so security matters most there.
- **No hard and fast rule**: some organisations don't secure APIs consumed only internally.
- Some banks, under **RBI** rules, must secure exposed APIs compulsorily.
- The right level of security depends on the industry and the organisation; policies are covered later.

## 13. Instructor's Market Touch (as stated)
- Has conducted **250+ interviews** and sits on interview panels with colleagues.
- Attends **5–10 interviews a year** himself to evaluate the market; students share their interview experiences.
- Changes the course content from time to time based on this.

## Quick Recap
- **API = a part of integration** — the exposed, request/response kind. A scheduled job is integration too, but not an API.
- The **front-end/API/back-end** split exists because of **different technologies** and **security**.
- Course: 55–60 sessions of 1.5 hours, Monday–Thursday (~6 hours a week), focused on the 80% common requirements (REST, SOAP consumption, File/FTP/SFTP, DB, JMS/ActiveMQ, Salesforce + one more connector).
- Practice software is free to get; the system should have 8 GB RAM or more (16 GB ideal).
- A developer's job: read BRD/HLD/LLD → design → implement (**including MUnit unit tests**) → secure → deploy → monitor, with leads/architects/BAs having done the up-front work.
- Target MCD Level 1; learn the most-used connectors deeply; **practise relentlessly**.
