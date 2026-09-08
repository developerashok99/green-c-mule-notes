# Day 02 — Prerequisites Overview, API vs Integration, Course Content Deep-Dive, MuleSoft Developer Role

## Session Agenda
1. Prerequisites needed before core MuleSoft topics
2. Common Integration Requirements
3. Course content, explained in real detail this time (10-15 min deep-dive, expanding on Day 01's preview)
4. What software is needed to practice, and costs (spoiler: effectively free)
5. Recommended system configuration
6. Real-time role/activities of a MuleSoft developer
7. Q&A

---

## 1. What MuleSoft Developers Actually Build (Two Things)
The instructor frames this precisely: **MuleSoft development is, at a high level, building two kinds of things — REST APIs, and Integrations.** (API is technically a *subset/part* of integration, but is treated as its own category because it's built and consumed differently — see the full API vs. Integration distinction below.)

## 2. API vs. Integration — Worked Through with Two Concrete Examples

### Example A: API — ICICI Bank Balance Check
```
Mobile App (front-end) → sends request → API → queries → Database (back-end) → API converts response → Mobile App displays "₹25,000"
```
- **Front-end**: the system the customer directly experiences (mobile app, desktop/net banking) — called "front-end" or "user experience system" *because* the customer experiences it directly. Typically built in React, JavaScript, etc.
- **Back-end**: where the actual data lives — e.g. a database holding customer data, balances, etc. Often built in a different technology stack (e.g. Java-based) than the front-end.
- **Why can't front-end and back-end just talk directly?**
  1. They're built in different, mutually-incompatible technologies/languages.
  2. **Security** — directly exposing a database to a front-end app is a serious risk; a hacker could potentially hit the database directly and steal data. A layer in between is necessary.
- **The API's exact job**: receives the request (e.g. "check balance for account X"), translates/queries the back-end appropriately, receives the raw response, and returns a properly formatted response to the front-end — which then displays it nicely to the user.
- This is explicitly called "**API**" because it is triggered on-demand by a specific request and returns an immediate response.

### Example B: Integration (non-API) — Nightly Salesforce → Database Sync
```
Scheduler (fires nightly, e.g. 10-11 PM) → Get data from Salesforce → Transform → Insert into Database
```
- No consumer sends a request; there's no "expose this to be consumed" step at all. It's just a job that runs automatically on a schedule.
- Still absolutely an **integration** (it moves/transforms data between two systems) — but it is **not** an API, because nothing calls it on-demand and nothing gets an immediate response back.
- **The precise takeaway stated by the instructor:** *"Mostly the work we do with MuleSoft is to develop REST APIs and integrations"* — treating these as two related-but-distinct categories of deliverable, built with the same underlying tools (mostly drag-and-drop, ~10-20% DataWeave scripting for the transformation logic in either case).

## 3. Anypoint Platform — First Mention of Its Sub-Modules
Briefly previewed here (fuller treatment later, on Day 07): the Anypoint Platform contains multiple sub-tools — **Design Center, Exchange, Runtime Manager, Visualizer, Monitoring**, and more. The instructor deliberately avoids going deep here to prevent overwhelming students this early — "if I say it now, it will be overwhelming."

## 4. Full Prerequisites List (as detailed on Day 02)
- **Monolithic application** — what it is, its disadvantages
- **Microservices architecture** — what it is, advantages/disadvantages, and specifically **how microservices principles get implemented within MuleSoft** (this becomes the API-Led Connectivity topic on Day 04)
- **APIs, Web Services, REST and SOAP** — definitions and differences
- **Different real-time environments** — explicitly acknowledged that the cohort has a mix of non-IT students, IT-background students, and freshers, so this needs to be explained from scratch for some and reinforced for others: development, testing, pre-prod, prod, disaster recovery environments — why they exist and what each one's significance is
- **Data formats**: JSON, CSV, XML
- **HTTP protocol mechanics**: since REST APIs depend heavily on HTTP — how to structure requests, how responses behave on success vs. error, how to handle different error scenarios in different ways. This alone is allocated **3-4 dedicated sessions** later in the course (this maps directly onto what becomes Day 06's HTTP deep-dive content).
- Sequencing: **monolithic → microservices (industry-wide migration story) → how microservices gets implemented specifically in MuleSoft**, in that specific order.

## 5. Common Integration Project Requirements — the "80% Rule," Elaborated Further
Reiterating and expanding Day 01's framing with the actual list used in this course:

| Requirement | Detail given |
|---|---|
| **REST services** | Built new most of the time — this is what "consumers" (other systems/teams) most often ask you to expose |
| **SOAP services** | Almost always just **consumed**, not created — if an existing system already exposes SOAP, you consume it as-is; described as comparatively rare in modern projects but still important to know for interviews |
| **Files / FTP / SFTP** | Common requirement: migrate a file from an FTP/SFTP server to another system, transforming it along the way. Plan: **download and install an actual FTP server**, connect to it hands-on, and learn when to use plain FTP vs. SFTP specifically |
| **Databases** | Core, constant requirement across virtually every project |
| **JMS (Java Messaging Service)** | Queueing/messaging services — plan: **download and install an ActiveMQ broker** hands-on, understand when/why to use JMS, and the available operations. Explicitly promises full explanation of terminology that's often used inconsistently: **publisher, producer, sender** (all effectively synonyms in casual usage — clarified precisely), and **Queue vs. Topic** (when to use each), plus **asynchronous decoupling** — why you'd want systems to NOT wait on each other synchronously |
| **System Connectors** | Named examples: **Azure, Salesforce, AWS**, and others. **Salesforce is singled out as the one to focus on most**, specifically because it comes up very frequently in interviews (a direct consequence of the MuleSoft-Salesforce ownership relationship covered on Day 01). The instructor also mentions planning to add **one additional connector** to this specific batch's curriculum, tentatively leaning toward **AWS**, though not fully committed at time of recording |

- Reinforced number: focusing on these ~5-6 common requirement categories is claimed to cover **75-80% of real project work** — the explicit strategic bet of the whole course.

## 6. Software & Costs to Practice MuleSoft (practical logistics)
- **No cost at any point** for development/learning purposes is the headline claim — you only start incurring cost if/when you actually **deploy** an application (e.g. to a paid cloud environment), which isn't necessary for learning.
- **Anypoint Platform account** — free to create; used to be tied to lifetime access for development purposes in some respects, though trial-account specifics (e.g. ~30-day windows) are covered more precisely in later sessions when actually walking through account creation. If a trial expires, the workaround mentioned is simply creating a new account with a different email/username.
- **Anypoint Studio** — the IDE, free to download.
- **Mule Runtime** — needed if practicing on-premises deployment locally.
- **Postman** — for testing built APIs (already used informally in the Day 01 demo).
- **Notepad++** — a general-purpose text editor, used for miscellaneous editing tasks throughout the course.
- **MySQL** (a database) — needed for the database-connector hands-on work.
- **FTP server software** and **ActiveMQ broker** — needed later for the File/FTP and JMS hands-on sessions respectively.

## 7. Recommended System Configuration
- Roughly: **Windows 10 or better**, a reasonably modern processor (~2 GHz class), and enough RAM (the exact number is treated loosely/flexibly in the transcript — the point made is that if Anypoint Studio runs sluggishly on your machine, it's worth addressing the system configuration *once*, up front, rather than fighting slowness throughout the course). A student mentioning **1.5 GB RAM** is reassured it should be workable, though not ideal — the general framing is "try it, and adjust if it's genuinely too slow to practice effectively."

## 8. Full Course Content — Expanded Walkthrough (this is the detailed version of Day 01's roadmap)
Going topic by topic, roughly in the order the instructor lists them:

1. **Introduction** (already covered): what is MuleSoft/API/integration, orchestration/transformation/enrichment concepts, Anypoint Studio & Anypoint Platform overview and their sub-modules.
2. **Basics — building an application**: what a Listener is, what a Database connector is, what a Logger is, what a Transform Message is, and the general Studio options needed to use them (this directly maps to Day 05's hands-on build).
3. **Project structure**: how a Mule project is organized (maps to Day 08).
4. **Postman testing methodology** and **debugging** (step-by-step execution, "from the first to the last step") — maps to Day 05/Day 07's debugger usage.
5. **DataWeave** — the transformation language, allocated **2-4 dedicated sessions**, taught from scratch.
6. **Deployment strategies**: CloudHub (cloud-based deployment), on-premises deployment, hybrid deployment.
7. **CI/CD pipelines**: Continuous Integration / Continuous Delivery / Continuous Deployment concepts, tools named explicitly — **Jenkins, Bamboo**, and others — plus how to deploy via a CI/CD pipeline specifically, and how to connect a **code repository (Bitbucket, GitHub, or via Jenkins pipeline)** into that process.
8. **Create and consume REST services.**
9. **Consume SOAP services** (writing/consuming, available operations).
10. **File, FTP, SFTP**: differences between them, what extra configuration each needs, and specifically *when* to use plain File vs. FTP vs. SFTP.
11. **MySQL database operations**: install, connect, and perform various database operations hands-on.
12. **Properties**: why different environments (Dev, Testing, UAT, Production, Pre-Production, Disaster Recovery) need their own separate configuration (e.g. each pointing to its own separate database) rather than hardcoding one environment's settings — allocated roughly **1 to 1.5 sessions**, described as "very very important."
13. **Object Store**: introduced conceptually for the first time here — explicitly contrasted with a database (used for **permanent** storage) as being for **temporary storage**. Framed as something you might not need often, but that becomes essential the moment a specific requirement calls for it — so it's covered even though it's not a daily-use concept for everyone.
14. **Routing concepts**: conditional branching (e.g. "if condition A, do steps X; if condition B, do steps Y") via a **Choice router** component; also scenarios requiring sending the **same request to multiple systems simultaneously** (a preview of Scatter-Gather-type patterns).
15. **JMS deep-dive**: publish, consume, acknowledgment modes — practical operations building on the Day 02 terminology preview above.
16. **DataWeave, continued**: deeper coverage building on the earlier basics-level introduction.
17. **Error Handling and MUnit testing**: MUnit is MuleSoft's own unit-testing framework. Two ways to build MUnit tests are previewed: a faster **"recording" option** (record real execution and generate a test from it) and a **manual** approach for other scenarios — each MUnit-focused session estimated at **1.5-2 hours**. Explicitly stated: **unit testing is the developer's own responsibility** (not a separate QA-only task) — described as directly relevant both for real production work (since any code change risks silently breaking existing behavior, which MUnit tests catch) and for interview preparation.
18. **API-Led Connectivity**: the **Experience / Process / System** layered architecture (full depth covered on Day 04) is previewed here as the way MuleSoft recommends implementing microservices principles specifically for API design — tied back to the API Lifecycle's **Design** step (drawing a "blueprint" the same way a house architect would, using **RAML**, in the Design Center).
19. **API Security Policies**: named explicitly — **Basic Authentication, Client ID Enforcement, OAuth, Rate Limiting, Spike Control**, plus "2-3 more" not named individually at this point.
20. **Data processing patterns for volume**: **For Each** (process records one at a time), **parallel processing**, and **Batch processing** (for genuinely large data volumes) — with guidance on when to use which, and **asynchronous** processing patterns generally. Explicitly flagged as "very very important" both for interviews and real-world work.
21. **Code repositories**: what a code repository actually is, explained for those unfamiliar — when you drag-and-drop in Studio, XML code is automatically generated in the background; if your local Studio installation ever crashes/corrupts, that code needs to live somewhere safe. Tools named: **Bitbucket, GitHub, GitLab**. Covers the actual commands used to push code, and walks through **why** you'd use a tool like GitHub or Bamboo as part of a CI/CD deployment pipeline.
22. **The still-undecided additional connector** (see Day 01/this-file's Section 5 — tentatively AWS) — to be added at a later point in this specific batch.

> Explicitly addressed in Q&A: "Will you explain using the actual application, or just theory?" — Answer: **both, always** — every use case is explained theoretically first, and then demonstrated hands-on in Anypoint Studio. A student also asks about **Anypoint Code Builder** specifically for something like JMS — answer: not necessary to prioritize right now; it can be picked up later if/when a specific job actually requires it, echoing the "don't over-invest in things you don't yet need" theme from Day 01.

## 9. MuleSoft Certifications, Revisited With More Detail
- **Four major certifications**: **MCD Level 1, MCD Level 2, MCIA (MuleSoft Certified Integration Architect), MCPA (MuleSoft Certified Platform Architect).**
- Instructor holds 3 of these 4.
- Practical exam-cost tip reiterated: **$200 USD**, no more free vouchers (unlike in the past when the instructor could offer them in class) — suggested approach: **put "MCD Level 1 ready" on your resume before spending the money**, and only pay for and take the actual exam once you've secured a job, since the certification's main immediate value is resume-signaling rather than something employers verify before hiring.
- This course's stated target: **completing it should be sufficient preparation to clear MCD Level 1**, described as "more than enough for developers."

## 10. Salary Discussion (numbers as stated by the instructor — illustrative, from personal network observation, not guaranteed)
- A rough rule of thumb given: **experience (years) × 2 = minimum LPA, experience × 5 = maximum LPA.**
  - Example worked: 3 years experience → minimum ~₹6 LPA, maximum ~₹15 LPA.
- Additional network-based figures mentioned: 5-5.5/5.6 years experience professionals cited in the ₹10-25 LPA range in the instructor's own network, again framed as observed outcomes rather than promises, and explicitly tied to "you have to put in a lot of effort" — not treated as automatic.

## 11. Real Project Team Structure & the MuleSoft Developer's Actual Role (expanded from Day 02's fuller treatment)
- **Team composition**: Business Analysts, Delivery Managers, Technical/Solution Architects, plus developers with MuleSoft (and possibly other tool) expertise — often assembled across multiple client-side and vendor-side organizations (the example given: a joint team formed between a services company like TCS and a client company like Airtel).
- **Process flow**:
  1. **Workshops** are conducted regularly between the business/user side and the solution architect team to gather requirements.
  2. The **business team** documents requirements formally as a **Functional Specification Document (FSD/BRD)**.
  3. The **Technical Architect** assesses feasibility and produces a **High-Level Design (HLD)** — overall architecture, which systems are involved, what approach to take — then breaks that down into a **Low-Level Design (LLD)** — specific API-by-API detail: what needs to be built, how it should integrate.
  4. For a large project (example: **100-150 APIs**), the architect/lead structure typically **divides work across multiple leads** (e.g. 3-4 teams, each under its own lead), and each lead then has their own developers, testers, and BAs.
  5. **A developer (you) receives a specific slice** — e.g. "10 APIs" assigned to you from your lead's portion of the project.
- **The developer's actual day-to-day job, precisely defined**: *"developing APIs plus developing integrations"* — which breaks down into: design the API (or use an already-designed spec) → **implement** it (this **includes unit testing/MUnit** — implementation = development, and unit testing is explicitly part of that, not a separate downstream step) → secure it with the relevant API policies → deploy it → support monitoring.
- **How a developer actually gets unblocked on requirements**: read the **HLD**, the **BRD**, and the **LLD** to understand exactly what's expected; if anything is unclear, escalate specific questions to the **lead**, the **architect**, or the **Business Analyst** as appropriate — the point being that all of this is *already prepared* for the developer by the time it reaches them, which is explicitly why the instructor characterizes the developer role as comparatively **easier** than the lead/architect roles: *"they have prepared everything and put it there... we can easily handle all these topics in real time if we follow them properly."*
- **You are dependent on other teams' information** — e.g. if your API needs Salesforce data, you depend on the Salesforce team to supply connection/data details; if it needs database access, you depend on the database team similarly. This dependency is explicitly why estimation isn't purely up to the developer.
- **Testing responsibilities beyond the developer**: a separate testing team, a BA team, and a dedicated unit-testing discipline (again, MUnit is the *developer's own* unit testing, distinct from the separate QA/testing team's broader validation) all exist; bugs raised by any of them come back to the developer to fix.
- **Deployment and pipelines**: developers support deploying applications across different environments via CI/CD pipelines as part of the same overall workflow.
- **Communication matters as much as technical skill**: daily **Agile scrum calls** (status updates, blockers) are standard practice — the instructor states explicitly that being confident in *both* communication and technical knowledge together is what actually makes the job easier day-to-day.
- **Task estimation, precisely**: easy API ≈ **3-5 working days**; medium difficulty ≈ **5-7 working days**; more complex ≈ **7-10 (up to 10-12) working days**. This estimate is a **calculation typically made by the technical architect and lead**, not something the individual developer decides unilaterally — though it depends on the specific organization and lead.
- **On the "300+ connectors, how can anyone know them all?" concern (reiterated with a fresh concrete example)**: the instructor's own direct example — never having personally used a **MongoDB connector** before a specific project required it, the approach was: go to the **official MongoDB connector documentation**, study it, and be upfront in team meetings about the lack of prior hands-on experience, then run a **small POC (proof of concept)** first before beginning real implementation, budgeting "a few hours" for that ramp-up. Personal total career exposure estimated at only **10-15 connectors** actually worked with in depth, despite 300+ existing — reinforcing that deep familiarity with a handful, plus the *skill* of ramping up on a new one via documentation + POC, is the realistic and sufficient bar, not exhaustive connector knowledge.
- **A further concrete Salesforce example on the "don't learn everything" philosophy**: the Salesforce connector alone reportedly exposes around **100 operations**, of which only **3-4 are majorly used** in practice — the course focuses specifically on those 3-4 rather than attempting exhaustive connector coverage, explicitly framed with the exam analogy: *"if there are 10 chapters in an exam and you learn 3, you can still get 70%"* — i.e., disciplined focus on the highest-value subset beats attempting shallow coverage of everything.
- **No direct relationship with the front-end**: MuleSoft developers do not build or directly coordinate with a front-end team as part of their own job — **Postman substitutes for the front-end during development and testing**, since the actual front-end application is being built independently (possibly not even ready yet) by a separate team. Later, either the front-end and API teams test together once both are ready, or a dedicated tester validates the API's responses and reports any mismatches back to the front-end team directly, bypassing the API developer for that particular loop.
- **Practice philosophy, restated directly and forcefully**: *"Just by watching videos, nothing will come... until you start in real time, you don't even know where to go [in the studio]."* The instructor's specific advice: even a small "Hello World"-style demo app (like the DB-select app from Day 01/05) is worth rebuilding **~20 times**, since each repetition surfaces different small learnings — hands-on repetition is treated as the actual mechanism of skill-building, not a nice-to-have supplement to watching lectures.

## 12. API-Led Connectivity — First Direct Mention (fuller depth on Day 04)
- **Three API types previewed by name**: **Experience API, Process API, System API.**
- Clarified directly in Q&A: *"Finally, the API is an API"* — meaning the actual *design process* for building any one of these three types is the same; what differs is purely their **architectural role/purpose** — when and why you'd build one layer versus another. This distinction matters for **architecture decisions**, not for the mechanics of designing an individual API itself.
- **Security nuance directly addressed**: the **Experience API** is the one exposed to the outside/external world, so it typically receives the most security policy attention — but there's **no universal hard rule**. Some organizations don't secure certain APIs at all, specifically because they're consumed **only internally** within the organization's own network. However, regulated industries (the example given: **banks under RBI — Reserve Bank of India — compliance rules**) may be legally required to secure APIs regardless of whether they're internal-only, since "internal" doesn't automatically mean "exempt from compliance." **The right level of security is industry- and organization-dependent, not a fixed universal rule** — this exact theme resurfaces prominently in the Day 10 discussion of strict validation.

## Quick Recap
- **API = a subset of Integration** — specifically, the *on-demand, exposed, request/response* kind. A scheduled/batch job is integration too, but not an API.
- The **front-end/API/back-end** relationship exists because of both **incompatible technologies** and **security** — never let a front-end talk directly to a raw database.
- Course content is enormous by design (55-60 hours, deliberately longer than typical market courses) specifically to cover the "80% common requirements" (REST, SOAP consumption, File/FTP/SFTP, DB, JMS/ActiveMQ, Salesforce + one more TBD connector) in real depth, rather than spreading thin.
- All practice software is effectively free; only real cloud deployment costs money, and that's not needed to learn.
- A MuleSoft developer's real job = read HLD/BRD/LLD → design (if needed) → implement (**including MUnit testing, which is the developer's own job**) → secure → deploy → support monitoring, largely downstream of decisions already made by BAs/architects/leads — this is explicitly why the role is positioned as more approachable than architect/lead roles.
- Certifications (MCD Level 1 targeted by this course), realistic connector-knowledge expectations (10-15 deeply known, not 300+), and disciplined focus on the highest-value 80% are all part of the same underlying philosophy: **learn less, but learn the right things deeply, and practice relentlessly.**
