# Day 02 — Slides and On-Screen Drawings

Slides and drawings from the Day 2 class: prerequisites, common integration requirements (with a JMS preview), software and system requirements, the Anypoint Platform tour, the course syllabus, and the role of a MuleSoft developer within a project team. Repeated and blank frames have been removed. Times are positions in the video.

Notes for this day: [detailed-notes/day02.md](../../detailed-notes/day02.md) · [super-detailed-notes/day02.md](../../super-detailed-notes/day02.md) · [summary](../../day02.md)

| # | Time | Content |
|---|---|---|
| 01 | 3:07 | Agenda: prerequisites, common integration requirements, course content, software and system requirements, role of a MuleSoft developer, Q&A |
| 02 | 3:08 | Prerequisites for learning MuleSoft — monolithic apps, microservices, APIs / web services / REST and SOAP, API life cycle, real-time environments, JSON/CSV/XML, HTTP |
| 03 | 3:12 | *Drawing:* front-end (web or mobile) → MuleSoft REST API → back-end (HR database) |
| 04 | 14:20 | *Drawing:* MuleSoft → REST APIs and integrations over HTTP; Anypoint Studio (development) and Anypoint Platform (Design Center, Exchange, Runtime Manager, API Manager) |
| 05 | 18:39 | Common integration project requirements — consume/provide REST, consume SOAP, File/FTP/SFTP, databases, JMS (ActiveMQ), system connectors (Salesforce …) |
| 06 | 26:34 | *Drawing (JMS preview):* producer → JMS server (queue / topic) → consumer; new employee published to finance, HR, mailing |
| 07 | 26:58 | *Drawing:* Queue — pipeline of messages where the sender pushes and the receiver consumes; one-to-one |
| 08 | 27:05 | *Drawing:* publish, consume, On New Message, publish-consume (synchronous) |
| 09 | 27:15 | *Drawing:* new employee → topic → finance/payroll, HR, operations; to do: install ActiveMQ, JMS operations; decoupled, asynchronous |
| 10 | 27:20 | *Drawing:* acknowledgement modes — auto, manual, immediate, dups-ok; JMS listener On New Message; DLQ |
| 11 | 27:36 | *Drawing:* JMS = Java Messaging Service — Apache ActiveMQ, RabbitMQ, IBM MQ; Anypoint MQ (extra licence cost) |
| 12 | 27:47 | Software requirements — Anypoint Studio (IDE like Eclipse), Anypoint Platform account, Mule runtime, Postman, Notepad++, FTP server, MySQL + Workbench, ActiveMQ |
| 13 | 29:44 | Anypoint Platform sign-in |
| 14 | 29:48 | Anypoint Platform home — Code Builder, Design Center, Exchange, Anypoint Studio; Management Center (API Manager, Runtime Manager, Monitoring, Access Management, Secrets Manager) |
| 15 | 31:14 | System configuration for practising MuleSoft — 8 GB RAM or above (16 GB ideal), Windows 10 or above, 2 GHz processor |
| 16 | 32:12 | Role of a MuleSoft developer — go through the BRD and TDD, discuss queries with the business team and architect / technical lead, design, develop, unit test; QA, UAT and production |
| 17 | 34:18 | Course content (Notepad++) — Module 1 Mule ESB, Module 2 Mule ESB basics, Module 3 deployment strategies, Module 4 REST/SOAP … |
| 18 | 38:47 | Syllabus — database, externalised properties, Object Store and watermarking, routing, JMS, DataWeave, error handling, MUnit |
| 19 | 46:07 | API Manager — APIs list (oauth-demo-api) as a preview of policies |
| 20 | 46:29 | Add a policy — JWT validation, Basic Auth, IP blocklist, OAuth 2.0, JSON threat protection, tokenization … |
| 21 | 56:44 | *Drawing:* client (Airtel) and service company (TCS) — business team, technical architect, BRD / HLD / LLD, lead, developers, testers |
| 22 | 56:47 | *Drawing:* team structure — BRD (business requirements), FSD (functional specification), HLD (high-level design), technical lead, 5 developers + 1 tester, SAPI / PAPI layers |
| 23 | 56:53 | *Drawing:* BRD (FSD) → HLDs → LLDs → lead → developer (MuleSoft): API design → API implementation + unit testing → secure API → deploy → monitor |
| 24 | 54:39 | *Drawing:* MCD level 1 — about 200 USD; MCIA / MCPA for architects |
| 25 | 65:10 | *Drawing:* career gap 7 years — salary ranges (e.g. 3 × 2 = 6 LPA; min 3 yrs ≈ 9 LPA; max ≈ 15 LPA) |
| 26 | 68:51 | *Drawing:* MongoDB etc. — 10–15 connectors used most of the time; 80% of projects use the same set |
| 27 | 72:25 | *Drawing (recap):* MuleSoft → REST APIs and integrations; front end → API → back end; Anypoint Studio and Anypoint Platform modules |

---

### 01 — Agenda: prerequisites, common integration requirements, course content, software and system requirements, role of a MuleSoft developer, Q&A
![agenda](01-agenda.jpg)

### 02 — Prerequisites for learning MuleSoft — monolithic apps, microservices, APIs / web services / REST and SOAP, API life cycle, real-time environments, JSON/CSV/XML, HTTP
![prerequisites](02-prerequisites.jpg)

### 03 — *Drawing:* front-end (web or mobile) → MuleSoft REST API → back-end (HR database)
![drawing-api-overview](03-drawing-api-overview.jpg)

### 04 — *Drawing:* MuleSoft → REST APIs and integrations over HTTP; Anypoint Studio (development) and Anypoint Platform (Design Center, Exchange, Runtime Manager, API Manager)
![drawing-mulesoft-tools](04-drawing-mulesoft-tools.jpg)

### 05 — Common integration project requirements — consume/provide REST, consume SOAP, File/FTP/SFTP, databases, JMS (ActiveMQ), system connectors (Salesforce …)
![integration-requirements](05-integration-requirements.jpg)

### 06 — *Drawing (JMS preview):* producer → JMS server (queue / topic) → consumer; new employee published to finance, HR, mailing
![drawing-jms-overview](06-drawing-jms-overview.jpg)

### 07 — *Drawing:* Queue — pipeline of messages where the sender pushes and the receiver consumes; one-to-one
![drawing-queue](07-drawing-queue.jpg)

### 08 — *Drawing:* publish, consume, On New Message, publish-consume (synchronous)
![drawing-jms-operations](08-drawing-jms-operations.jpg)

### 09 — *Drawing:* new employee → topic → finance/payroll, HR, operations; to do: install ActiveMQ, JMS operations; decoupled, asynchronous
![drawing-topic](09-drawing-topic.jpg)

### 10 — *Drawing:* acknowledgement modes — auto, manual, immediate, dups-ok; JMS listener On New Message; DLQ
![drawing-ack-modes](10-drawing-ack-modes.jpg)

### 11 — *Drawing:* JMS = Java Messaging Service — Apache ActiveMQ, RabbitMQ, IBM MQ; Anypoint MQ (extra licence cost)
![drawing-jms-brokers](11-drawing-jms-brokers.jpg)

### 12 — Software requirements — Anypoint Studio (IDE like Eclipse), Anypoint Platform account, Mule runtime, Postman, Notepad++, FTP server, MySQL + Workbench, ActiveMQ
![software-requirements](12-software-requirements.jpg)

### 13 — Anypoint Platform sign-in
![anypoint-signin](13-anypoint-signin.jpg)

### 14 — Anypoint Platform home — Code Builder, Design Center, Exchange, Anypoint Studio; Management Center (API Manager, Runtime Manager, Monitoring, Access Management, Secrets Manager)
![anypoint-home](14-anypoint-home.jpg)

### 15 — System configuration for practising MuleSoft — 8 GB RAM or above (16 GB ideal), Windows 10 or above, 2 GHz processor
![system-config](15-system-config.jpg)

### 16 — Role of a MuleSoft developer — go through the BRD and TDD, discuss queries with the business team and architect / technical lead, design, develop, unit test; QA, UAT and production
![developer-role](16-developer-role.jpg)

### 17 — Course content (Notepad++) — Module 1 Mule ESB, Module 2 Mule ESB basics, Module 3 deployment strategies, Module 4 REST/SOAP …
![course-syllabus](17-course-syllabus.jpg)

### 18 — Syllabus — database, externalised properties, Object Store and watermarking, routing, JMS, DataWeave, error handling, MUnit
![syllabus-modules](18-syllabus-modules.jpg)

### 19 — API Manager — APIs list (oauth-demo-api) as a preview of policies
![api-manager](19-api-manager.jpg)

### 20 — Add a policy — JWT validation, Basic Auth, IP blocklist, OAuth 2.0, JSON threat protection, tokenization …
![policies-list](20-policies-list.jpg)

### 21 — *Drawing:* client (Airtel) and service company (TCS) — business team, technical architect, BRD / HLD / LLD, lead, developers, testers
![drawing-project-roles](21-drawing-project-roles.jpg)

### 22 — *Drawing:* team structure — BRD (business requirements), FSD (functional specification), HLD (high-level design), technical lead, 5 developers + 1 tester, SAPI / PAPI layers
![drawing-team-structure](22-drawing-team-structure.jpg)

### 23 — *Drawing:* BRD (FSD) → HLDs → LLDs → lead → developer (MuleSoft): API design → API implementation + unit testing → secure API → deploy → monitor
![drawing-delivery-flow](23-drawing-delivery-flow.jpg)

### 24 — *Drawing:* MCD level 1 — about 200 USD; MCIA / MCPA for architects
![drawing-certification](24-drawing-certification.jpg)

### 25 — *Drawing:* career gap 7 years — salary ranges (e.g. 3 × 2 = 6 LPA; min 3 yrs ≈ 9 LPA; max ≈ 15 LPA)
![drawing-salary](25-drawing-salary.jpg)

### 26 — *Drawing:* MongoDB etc. — 10–15 connectors used most of the time; 80% of projects use the same set
![drawing-connectors](26-drawing-connectors.jpg)

### 27 — *Drawing (recap):* MuleSoft → REST APIs and integrations; front end → API → back end; Anypoint Studio and Anypoint Platform modules
![drawing-recap](27-drawing-recap.jpg)

