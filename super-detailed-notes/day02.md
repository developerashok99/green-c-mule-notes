# Day 02 — Prerequisites, API vs. Integration, Course Content and the MuleSoft Developer's Role

## 1. Overview

Agenda of this session:

1. What a MuleSoft developer builds: **REST APIs** and **integrations**
2. API vs. integration, with two examples (bank balance check, nightly Salesforce-to-database job)
3. Anypoint Platform (first mention of its sub-tools)
4. Prerequisites that will be taught before core MuleSoft
5. Common integration project requirements (the 80% list), in more detail than Day 01
6. Software needed for practice and its cost
7. System configuration
8. Full course content walkthrough
9. Certifications and salary discussion
10. How a real project team is organised and what a MuleSoft developer does day to day
11. Q&A (connectors, front-end, practice, API-led layers, security)

---

## 2. What Does a MuleSoft Developer Build?

At a high level, MuleSoft developers build two kinds of things:

1. **REST APIs**
2. **Integrations**

An API is itself a kind of integration (it connects systems), but the two are discussed separately because they are triggered and used differently.

```text
                Integration (broad category)
                 /                       \
   API (exposed, called on demand,      Scheduled / background integration
        request → response)             (no caller; runs on a timer)
```

Both are built the same way in MuleSoft: mostly drag-and-drop, with roughly 10–20% of the effort spent writing transformations in DataWeave.

---

## 3. Example A — API: Bank Balance Check

### 3.1 Scenario

**Illustrative example (ICICI Bank):** A customer logs in to the bank's mobile or desktop application and taps **Check Balance**. The app sends a request and displays the response — for example **₹25,000**.

```text
Mobile / Desktop app   ──request──►   API   ──query──►   Database
   (front-end)         ◄──response──        ◄──result──   (back-end)
```

### 3.2 Front-end

- The system the customer directly sees and uses: the mobile app or website.
- Called **front-end** or **user-experience system** because the customer experiences it.
- Usually built with technologies such as React and JavaScript.

### 3.3 Back-end

- Where the data is actually stored. In this example, a **database** that holds customer details, name and account balance.
- Usually built on a different technology stack (e.g., Java-based services and a database).

### 3.4 Why put an API between them?

1. **Different technologies.** The front-end and back-end are built with different technologies and data formats.
2. **Security.** If the front-end connected directly to the database, an attacker could hit the database directly and steal data. A controlled layer in between is needed.

> **Technical clarification:** The front-end and database are not literally incapable of communicating. The point is that exposing a database directly to client applications is unsafe and tightly couples the two. An API provides a controlled, secure and stable contract.

### 3.5 What the API does step by step

1. Receives the request from the front-end — e.g., the account number (and, if more detail is needed, the customer ID).
2. Converts the request into a database query.
3. Receives the database result — the balance for that account.
4. Sends a response back to the front-end.
5. The front-end formats the response and displays: "Your account balance is ₹25,000".

The API acts as the **middle layer between the front-end system and the back-end system**. It is triggered **on demand** by a request and returns a response.

---

## 4. Example B — Integration: Nightly Salesforce → Database Job

### 4.1 Scenario

**Requirement:** Every day, data must be copied from Salesforce into a database.

```text
Scheduler (e.g., every night at 10 or 11 PM)
      │
      ▼
Salesforce connector ── get data
      │
      ▼
Transform Message ── convert to the database's structure
      │
      ▼
Database connector ── insert
```

### 4.2 What makes it an integration but not an API

- Nobody calls it; it is **not exposed** for another system to consume.
- A **scheduler** triggers it automatically at a fixed time.
- It still connects two systems and transforms data, so it is an **integration**.

### 4.3 Summary

| | API | Scheduled integration |
|---|---|---|
| Trigger | A request from a consumer | A scheduler / timer |
| Exposed to other systems? | Yes | No |
| Returns a response to a caller? | Yes, immediately | No caller waiting |
| Example | Balance check | Nightly Salesforce → DB sync |

> An API is a type of integration, but not every integration is an API.

---

## 5. Anypoint Platform — First Mention

The **Anypoint Platform** is MuleSoft's web-based platform for the API lifecycle. It contains sub-tools such as:

- **Design Center**
- **Exchange**
- **Runtime Manager**
- **Visualizer**
- **Monitoring**
- and more

The instructor intentionally keeps this brief here; it is explained on Day 07.

---

## 6. Prerequisites Covered Before Core MuleSoft

Since the batch contains non-IT students, IT students and freshers, these are taught from scratch over the next 3–4 sessions:

| Prerequisite | What will be covered |
|---|---|
| Monolithic application | What it is and its problems |
| Microservices architecture | How the industry moved from monolithic to microservices, and how microservices are implemented in MuleSoft |
| APIs and web services | What they are; REST vs. SOAP; why REST is used more |
| Integration | What integration is |
| Environments | Development, testing, pre-production, production, disaster recovery — why they exist and the purpose of each |
| Data formats | JSON, XML, CSV |
| HTTP | REST APIs depend on HTTP: how requests are sent, how responses look on success and on error, how different errors are returned |

Also covered as part of the introduction: **orchestration, transformation and enrichment** (introduced on Day 01).

---

## 7. Common Integration Project Requirements (The 80% List)

> **Instructor's principle:** Most projects repeat the same 5–6 requirement types. Learning these deeply covers about 75–80% of project work — "learn less, achieve more".

### 7.1 REST services
- Created most of the time; consumers (other systems) ask for REST APIs.
- The course covers both **creating** and **consuming** REST services.

### 7.2 SOAP services
- Usually **consumed, not created**. If an existing system already exposes a SOAP service, the MuleSoft application calls it.
- Less common in new work, but asked in interviews, so it is covered.

### 7.3 File, FTP and SFTP
- Common requirement: pick up a file from an FTP/SFTP server, transform it into another format, and deliver it to another system.
- Plan: download and install an FTP server, connect to it, and learn when to use File vs. FTP vs. SFTP and what extra configuration each needs.

### 7.4 Databases
- Present in almost every project. MySQL will be installed and used for hands-on database operations.

### 7.5 JMS (Java Message Service)
- Queuing/messaging services. The **ActiveMQ** broker will be downloaded and used.
- Topics to be covered:
  - when and why JMS is used — mainly to **decouple** systems and work **asynchronously**
  - terminology used inconsistently in the industry: **publisher, producer, sender** (different names for the side that sends messages)
  - **queue vs. topic** and when to use each
  - operations such as publish, consume, and acknowledgement modes

> **Technical clarification:** The transcript expands JMS as "Java Messaging Services". The standard name is **Java Message Service**.

### 7.6 System connectors
- Examples: Azure, Salesforce, AWS.
- **Salesforce** is the main focus because it is asked frequently in interviews.
- The instructor plans to add **one more connector** later for this batch, probably **AWS** (not finalised at the time).

---

## 8. Software Needed and Cost

**Headline:** Practising MuleSoft costs nothing. Everything needed is free to download or use for learning.

| Software | Purpose |
|---|---|
| Anypoint Platform account | Web platform for design, Exchange, deployment and lifecycle management. Free trial account; if it expires you can create a new account with another email/username |
| Anypoint Studio | The IDE where Mule applications are built. Development use has no time limit; deployment uses the platform |
| Mule Runtime (standalone) | Needed to practise **on-premises** deployment locally |
| Postman | Testing APIs (already used in the Day 01 demo) |
| Notepad++ | General text editing |
| MySQL | Database practice |
| FTP server software, ActiveMQ broker | For the File/FTP and JMS sessions |

### System configuration
- Windows 10 or later, about a 2 GHz processor, and enough RAM to run Anypoint Studio smoothly.
  > **Transcript unclear:** the RAM figure is lost ("a GB … one point five"); the exact recommended value could not be reliably recovered.
- A student with a lower-spec machine was told to try it: if Studio installs and runs reasonably fast, it is fine; if it is slow, upgrade the configuration once, because a slow system makes practice slow.

---

## 9. Course Content Walkthrough

The instructor walked through the full syllabus so students know what they will learn.

| # | Topic | Notes from the lecture |
|---|---|---|
| 1 | Introduction | MuleSoft, API, integration; orchestration, transformation, enrichment; Anypoint Studio, Anypoint Platform and its modules |
| 2 | Basics — building an application | Listener, Database, Logger, Transform Message and the Studio options for each (the Day 01 demo explained properly) |
| 3 | Project structure | How a Mule project is organised |
| 4 | Testing with Postman | |
| 5 | Debugging | Running the flow step by step from first to last component |
| 6 | DataWeave | MuleSoft's transformation language; 2–4 sessions from basics |
| 7 | Deployment strategies | **CloudHub** (cloud), on-premises, hybrid |
| 8 | CI/CD pipelines | Continuous integration / continuous delivery / continuous deployment using tools such as Jenkins and Bamboo; deploying from a code repository |
| 9 | Create and consume REST services | |
| 10 | Consume SOAP services | Operations and how to call them |
| 11 | File, FTP, SFTP | Differences, extra configuration, when to use each |
| 12 | MySQL database operations | Install, connect, perform operations |
| 13 | Properties | Different environments (Dev, Testing, UAT, Pre-prod, Prod, DR) use different servers — e.g., a separate database per environment. Properties keep these values out of code. "Very, very important"; 1–1.5 sessions |
| 14 | Object Store | Database = permanent storage; **Object Store = temporary storage**. Not needed in every project, but you must know it when a requirement comes |
| 15 | Routing | **Choice** router: "if condition 1 → these steps; if condition 2 → those steps". Also sending the **same request to multiple systems** |
| 16 | JMS | Queue and topic; publish, consume, on-new-message, acknowledgement modes |
| 17 | DataWeave in depth | Beyond the basics |
| 18 | Error handling | Very important |
| 19 | MUnit | MuleSoft's unit-testing framework. Two ways to build tests: **recording** option and **manual**. Each session ~1.5–2 hours. Unit testing is the **developer's responsibility**; every code change can break something, so tests are written regularly in real projects |
| 20 | API-Led Connectivity | Architecture with **Experience, Process and System** layers |
| 21 | API design with RAML | First step of the API lifecycle (see below) |
| 22 | API security policies | Basic Authentication, Client ID Enforcement, OAuth, Rate Limiting, Spike Control, plus 2–3 more |
| 23 | Data processing | **For Each**, **parallel processing**, **Batch processing** for huge data, **asynchronous** processing — "very, very important" for interviews and real work |
| 24 | Code repository | Bitbucket, GitHub, GitLab |
| 25 | Additional connector | To be announced later (probably AWS) |

### 9.1 API design — the blueprint analogy

The API lifecycle has steps: **design, implementation, security, deployment, monitoring**. Design comes first.

When building a house, you first go to an architect and get a **blueprint**. Similarly, before building a REST API, you design it:

- what the request looks like
- what the success response looks like
- what the error response looks like

This is written in **RAML** (RESTful API Modeling Language), a simple, English-like modelling language, in the **Design Center** of Anypoint Platform. A use case will be used to demonstrate it.

### 9.2 Code repository — why it is needed

When you drag and drop components in Anypoint Studio, **XML code is generated in the background**. If Studio crashes or the local copy is corrupted, that code could be lost. Code repositories (Bitbucket, GitHub, GitLab) store the code in the cloud. The course covers the commands to push code and how repositories connect to CI/CD deployment pipelines.

### 9.3 Teaching style

Each use case is first explained theoretically, then implemented and deployed in Anypoint Studio (hands-on).

A student asked about **Anypoint Code Builder** (MuleSoft's newer IDE). **Instructor's advice:** not needed now; learn it later on the job if required — don't spend time on it at this stage.

> **Transcript unclear:** this answer is partly garbled (it also mentions the JMS connector as something to "learn in the future when you need it"); the advice above is the most consistent reading.

---

## 10. Certifications

- Four major MuleSoft certifications: **MCD Level 1, MCD Level 2, MCIA, MCPA**.
  - MCD = MuleSoft Certified Developer
  - MCIA = MuleSoft Certified Integration Architect
  - MCPA = MuleSoft Certified Platform Architect
- The exam costs about **US $200**. Free vouchers used to be available through classes; that is no longer the case.
- **Instructor's suggestion:** you may mention MCD Level 1 readiness on your resume first, and pay for the exam after getting a job.
- **Instructor's claim:** completing this course is enough to clear MCD Level 1, which is sufficient for developers.

---

## 11. Salary Discussion

> **Instructor's market observation — not a guarantee.** Achieving the higher end requires significant effort.

Rule of thumb given (example: 3 years of experience):

```text
General norm ≈ years × 2  →  3 × 2 = 6 LPA
Maximum      ≈ years × 5  →  3 × 5 = 15 LPA
```

> **Transcript unclear:** right after "3 × 2 = 6 LPA" the instructor says "minimum is 3 × 3, maximum 3 × 5 is 15 LPA", so it is not certain whether the lower bound is ×2 or ×3.

LPA = lakhs per annum. Students also mentioned figures like ₹10–25 LPA for 3–5 years in their networks.

---

## 12. How a Real Project Team Works

### 12.1 Team formation

**Illustrative example:** a service company (TCS) runs a MuleSoft project for a client (Airtel). The team includes business analysts, delivery managers, technical architects and MuleSoft developers; if other technologies are needed, people with those skills join too.

### 12.2 From requirement to developer

```text
Client users / business
      │  regular workshops to explain requirements
      ▼
Business team / Business Analysts ──► Functional specification / BRD
      │
      ▼
Technical / Solution Architect
      │  feasibility check
      │  High-Level Design (HLD): systems, architecture, overall approach
      │  Low-Level Design (LLD): API-by-API detail, how to integrate
      ▼
Leads  (e.g., 100–150 APIs split across 3–4 leads)
      │
      ▼
Developers, testers, BAs under each lead
      │  e.g., you receive 10–20 APIs
      ▼
MuleSoft Developer (you)
```

- **BRD** — Business Requirements Document
- **HLD** — High-Level Design
- **LLD** — Low-Level Design

### 12.3 The developer's job

Main job: **develop APIs and integrations**, covering the lifecycle steps:

1. **Design** the API
2. **Implement** (develop) it — **unit testing is part of implementation**
3. **Secure** it with API policies
4. **Deploy** it
5. **Monitor** it

To understand a requirement — what the request is, what the response is, what the error response is — the developer:

1. reads the **HLD**, **BRD** and **LLD**,
2. clarifies doubts with the **lead** and **architect**,
3. clarifies business questions with the **Business Analyst**.

**Instructor's view:** the developer role is easier than lead or architect, because the documents are already prepared; the developer follows them step by step and asks the right questions.

### 12.4 Other daily activities

- The **testing team** and BA team test the application; the developer fixes reported bugs.
- Deploying applications to different environments, often through pipelines.
- Daily **scrum calls** in Agile: status and blockers.
- **Communication** is as important as technical knowledge.

### 12.5 Dependencies on other teams

If an API connects to Salesforce and a database, the developer depends on the **Salesforce team** for Salesforce details and the **database team** for database details. Timelines are planned with these dependencies in mind.

### 12.6 Effort estimation

**Instructor's typical figures (working days):**

| API complexity | Effort |
|---|---|
| Easy | 3–5 days |
| Medium | 5–7 days |
| Complex | 7–10 days (sometimes 10–12) |

Estimation is calculated by the **technical architect and lead**, and depends on the organisation.

---

## 13. Questions Discussed

### Q. There are 300+ connectors. How can anyone know all of them?
Nobody does. **Instructor's experience:** in their whole career they used about 10–15 connectors.

Approach for a new connector — **instructor's example: MongoDB connector**, never used before:

1. Say clearly in the meeting that you have not used it and will do a POC first.
2. Read the official documentation.
3. Build a POC (Proof of Concept); spend a few hours.
4. Start the real implementation.

Even for one connector, not every operation is used. **Instructor's example:** the Salesforce connector has around 100 operations, but 3–4 are used most; the course covers those.

Exam analogy: "If there are 10 chapters and 3 chapters give you 70% of the marks, focus on those 3."

### Q. Do we work with the front-end?
No. MuleSoft developers do not build the front-end. **Postman** is used in place of a front-end to test the API. Once the front-end team is ready, the two are tested together, or a tester tests through the front-end and reports issues to the responsible team.

### Q. How should we practise? Are there assignments?
- Attend the class, then watch the recording again.
- Each class has theory and demonstration: learn the theory, repeat the demonstration hands-on.
- No extra assignments needed; if you finish and want more, ask.
- **Instructor's advice:** repeat even small demos — such as the Day 01 database application — many times (the instructor says 20 times); each repetition teaches something new.
- "Just watching videos will not make you capable." If you only watch, you won't know where to start when you open Studio.

### Q. What are the three types of APIs?
**Experience API, Process API and System API** (API-Led Connectivity, covered on Day 04). "Finally, an API is an API": the way you design and build each is the same. What differs is **when** and **why** each layer is used — an architecture decision.

### Q. Is the design of Experience, Process and System APIs the same? What about security?
- The design process is the same.
- The **Experience API** is exposed to the external world, so security policies are most important there.
- There is no hard and fast rule. Some organisations don't secure APIs that are consumed only internally.
- In regulated industries — for example banks that must follow **RBI** (Reserve Bank of India) rules — APIs may have to be secured regardless.
- The right level of security depends on the industry and organisation.

### Q. Course duration?
55–60 sessions, 1.5 hours each, Monday to Thursday (about 6 hours per week).

---

## 14. Important Terminology

| Term | Meaning |
|---|---|
| REST API | An API built on HTTP, the most common API type built in MuleSoft |
| Integration | Any program that connects two or more systems to move/transform data |
| Front-end | The system the user interacts with (mobile app, website) |
| Back-end | The system where data is stored and processed (e.g., a database) |
| Scheduler | Component that triggers a flow at a fixed time or interval |
| Anypoint Platform | MuleSoft's web platform (Design Center, Exchange, Runtime Manager, monitoring, …) |
| JMS | Java Message Service — messaging standard (queues and topics) |
| ActiveMQ | A message broker that implements JMS |
| Queue / Topic | Two messaging models; covered in the JMS sessions |
| Object Store | MuleSoft storage for temporary data |
| Choice router | Routes a message based on conditions (if/else) |
| MUnit | MuleSoft's unit-testing framework |
| RAML | RESTful API Modeling Language — used to design APIs |
| Design Center | Anypoint Platform tool where APIs are designed |
| CloudHub | MuleSoft's cloud deployment platform |
| CI/CD | Continuous Integration / Continuous Delivery or Deployment |
| BRD / HLD / LLD | Business Requirements Document / High-Level Design / Low-Level Design |
| POC | Proof of Concept |

---

## 15. Interview Questions

### Q1. What is the difference between an API and an integration?
An integration is any program that connects systems to move or transform data. An API is a type of integration that is exposed and called on demand, returning a response. A scheduled job that copies Salesforce data into a database every night is an integration but not an API.

### Q2. Why do we need an API between a front-end and a database?
The two use different technologies and formats, and exposing a database directly to clients is a security risk. The API provides a controlled layer that receives requests, queries the back-end and returns a properly formatted response.

### Q3. What are the common requirements in MuleSoft integration projects?
Creating and consuming REST services, consuming SOAP services, File/FTP/SFTP processing, database operations, JMS messaging (e.g., ActiveMQ), and system connectors such as Salesforce.

### Q4. Do MuleSoft developers usually create SOAP services?
Usually not. SOAP services typically already exist in older systems; MuleSoft developers mostly consume them.

### Q5. What is the role of a MuleSoft developer in a project?
Develop APIs and integrations: understand requirements from the BRD, HLD and LLD; design (RAML) if needed; implement in Anypoint Studio including unit tests (MUnit); apply security policies; deploy; fix bugs from testing; support monitoring.

### Q6. Who does unit testing in a MuleSoft project?
The developer, using MUnit.

### Q7. What is the difference between a database and Object Store?
A database is used for permanent storage. Object Store is used for temporary storage within MuleSoft.

### Q8. Why do we need property files?
Each environment (Dev, Test, UAT, Prod, DR) uses different servers and credentials. Properties keep these values outside the code so the same application can run in each environment.

### Q9. What are the three API-led layers?
Experience, Process and System APIs. They are built the same way; they differ in purpose and position in the architecture.

### Q10. How would you work with a connector you have never used?
Read its documentation, build a quick POC, then implement — and be transparent with the team about the ramp-up.

---

## 16. Must Remember

1. MuleSoft developers build **REST APIs and integrations**.
2. **API = on-demand, exposed, request/response.** Scheduled job = integration but not an API.
3. Bank balance example: **front-end → API → database**; API is needed for technology differences and **security**.
4. 80% list: **REST, SOAP (consume), File/FTP/SFTP, Database, JMS, Salesforce**.
5. Practice software is free: Anypoint Platform, Studio, Mule Runtime, Postman, MySQL, ActiveMQ.
6. **Database = permanent, Object Store = temporary**; **Choice** router = conditional routing.
7. **Unit testing (MUnit) is the developer's job.**
8. Project flow: **BA → BRD → Architect → HLD/LLD → Lead → Developer**.
9. Design first (RAML in Design Center), like an architect's blueprint.
10. New connector → **documentation + POC**; practise every demo repeatedly.
