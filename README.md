# MuleSoft Foundations Course — Notes (Green Cloud Batch)

Structured notes from a MuleSoft foundations course (Anypoint Platform / Mule 4), covering everything from "what is MuleSoft" through Studio internals, HTTP/REST fundamentals, API design basics, consuming third-party services, and error handling. This is a beginner-oriented course — more foundational than the April interview-prep batch.

> 📘 Want deeper, example-rich notes with diagrams? See **[detailed-notes/](detailed-notes/)**.
>
> 📄 Want the original raw English transcripts these notes were built from? See **[transcripts/](transcripts/)**.
>
> 🧹 Cleaned transcripts for Days 1–58 (terms corrected, repetition removed, screen text added): **[transcripts-cleaned/](transcripts-cleaned/)**.

## Index

| Day | Focus |
|---|---|
| [day01.md](day01.md) | Course intro: what is MuleSoft, why learn it, career FAQs, live demo |
| [day02.md](day02.md) | Prerequisites overview, API vs. Integration, MuleSoft developer's role |
| [day03.md](day03.md) | APIs, web services, REST vs. SOAP, real-world environments (Dev/SIT/UAT/Prod/DR) |
| [day04.md](day04.md) | API lifecycle, ESB architecture, monolithic vs. microservices, API-Led Connectivity |
| [day05.md](day05.md) | First hands-on Mule app: HTTP Listener + Database connector + Transform Message |
| [day06.md](day06.md) | HTTP deep dive: methods, request anatomy, response codes, JSON format |
| [day07.md](day07.md) | The Mule Event model (payload/attributes/variables), Anypoint Platform setup |
| [day08.md](day08.md) | Mule 4 project structure, Maven, `pom.xml`, flow anatomy |
| [day09.md](day09.md) | Anypoint Studio UI tour, project management, workspaces |
| [day10.md](day10.md) | URI params vs. query params, filtering/sorting/pagination, strict validation |
| [day11.md](day11.md) | The HTTP Request connector: consuming third-party REST services, inbound/outbound terminology |
| [day12.md](day12.md) | Shaping responses with Transform Message, DataWeave Playground, Target Variable, Response Timeout |
| [day13.md](day13.md) | Reconnection Strategy, Response Validator, HTTPS in API-Led Connectivity |
| [day14.md](day14.md) | Property files, environment externalization, Run Configurations, Secure Properties/encryption |
| [day15.md](day15.md) | Error handling: the Error Object, On Error Propagate, the "ANY must be last" rule |
| [day16.md](day16.md) | Error Mapping, 3 levels of error handling, On Error Continue, Raise Error, Choice router |
| [day17.md](day17.md) | Deployment strategies: Control Plane vs. Runtime Plane, CloudHub/On-Prem/Hybrid/RTF |
| [day18.md](day18.md) | CloudHub deep dive: Worker, vCore, horizontal/vertical scaling, live deployment |
| [day19.md](day19.md) | On-Premises deployment: Mule Runtime standalone, folder structure, Domain Projects |
| [day20.md](day20.md) | Hybrid deployment, MuleSoft Community, a troubleshooting philosophy |
| [day21.md](day21.md) | API Lifecycle revisited (Design-Simulate-Validate), RAML/OAS, the Employee use case |
| [day22.md](day22.md) | Multiple consumers, naming conventions, JSON debugging, schema depth, real documentation |
| [day23.md](day23.md) | Hands-on RAML: building the HR Employee API spec, live, in Design Center |
| [day24.md](day24.md) | RAML best practices: externalizing examples and data types for reuse |
| [day25.md](day25.md) | Traits vs. Fragments: reuse within one spec vs. across the whole organization |
| [day26.md](day26.md) | Publishing to Exchange, asset types, importing a published API, scaffolding, the flow-naming golden rule |
| [day27.md](day27.md) | Full implementation build-out: common/implementation folders, reused error handler, Database connector, property files, Domain Projects recap, OAuth token Q&A |
| [day28.md](day28.md) | Initial variable strategy, JSON logger, sensitive-data masking (intro) |
| [day29.md](day29.md) | The `mask` function, reading MuleSoft docs, setting up the real database |
| [day30.md](day30.md) | Remove variable, full PATCH/GET build-out, RAML-Studio sync, the Validation module |
| [day31.md](day31.md) | Course progress recap, interview prep planning, introducing API Manager, gateways, and policies |
| [day32.md](day32.md) | Rate Limiting, Rate Limiting SLA, Spike Control, HTTP Caching, JSON Threat Protection (theory) |
| [day33.md](day33.md) | OAuth 2.0 deep dive: Authentication vs. Authorization, the Authorization Code Grant Type |
| [day34.md](day34.md) | Client Credentials & Resource Owner Password Grant Types, Object Store for tokens, JWT |
| [day35.md](day35.md) | Applying policies in practice: Create new API, API Autodiscovery, deploying to CloudHub 2.0 |
| [day36.md](day36.md) | Fixing the CloudHub 2.0 deployment, artifactId, Basic Authentication and Client ID Enforcement |
| [day37.md](day37.md) | IP allowlist/blocklist, threat protection, rate limiting, SLA tiers and spike control |
| [day38.md](day38.md) | HTTP Caching policy and JWT validation with Auth0 |
| [day39.md](day39.md) | MUnit intro: unit testing, coverage and recording a test |
| [day40.md](day40.md) | MUnit continued: PATCH/POST tests, error-handler tests and full coverage |
| [day41.md](day41.md) | Consuming a SOAP service with the Web Service Consumer |
| [day42.md](day42.md) | Scatter-Gather: parallel routes, output, variables and error handling |
| [day43.md](day43.md) | Async scope and DataWeave basics: Playground, script anatomy and selectors |
| [day44.md](day44.md) | DataWeave: variables, operators, default, if/else, match, filter and filterObject |
| [day45.md](day45.md) | DataWeave: map, mapObject, groupBy, reduce, orderBy, pluck, update, dates and numbers |
| [day46.md](day46.md) | Salesforce connector part 1: CRM, objects, Basic Auth and a SOQL query |
| [day47.md](day47.md) | Salesforce connector part 2: Create, Upsert, On New / On Modified Object and the Scheduler |
| [day48.md](day48.md) | The For Each scope: collection, counter, batch size, rootMessage, errors and collecting results |
| [day49.md](day49.md) | For Each with DB insert, Bulk insert, and Parallel For Each (propagation, errors, max concurrency) |
| [day50.md](day50.md) | Batch processing: why batch, three phases, Batch Job / Step / Aggregator, On Complete |
| [day51.md](day51.md) | JMS with ActiveMQ: queues vs. topics, JMS connector, acknowledgement modes, VM |
| [day52.md](day52.md) | Object Store: key-value storage, access tokens, watermarking, transient vs. persistent |
| [day53.md](day53.md) | Watermarking with the Object Store: Retrieve, select newer rows, Store the new max |
| [day54.md](day54.md) | FTP with FileZilla: CSV to DB, DB rows to a file, File / SFTP connectors |
| [day55.md](day55.md) | CI/CD with Jenkins: concepts, required software, creating the GitHub repository |
| [day57.md](day57.md) | Amazon S3: buckets and objects, access keys, Create Bucket / Put Object / Get Object |
| [day58.md](day58.md) | Logging levels, verbose logging, DataWeave flatten/flatMap, custom functions, XML and CSV |
| [interview-part1.md](interview-part1.md) | Interview Preparation Part 1 — résumé, cover letter, self-introduction, web services / HTTP Q&A |
| [interview-part2.md](interview-part2.md) | Interview Preparation Part 2 — RAML, API Manager and policies, OAuth 2.0 / JWT, error handling, DataWeave Q&A |

## Topic Quick-Reference

| Topic | Where |
|---|---|
| What is MuleSoft / Integration | [day01](day01.md) |
| API vs. Integration | [day02](day02.md) |
| REST vs. SOAP | [day03](day03.md) |
| Environments (Dev/SIT/UAT/Prod/DR) | [day03](day03.md) |
| API Lifecycle | [day04](day04.md) |
| ESB / Point-to-Point Integration | [day04](day04.md) |
| Monolithic vs. Microservices | [day04](day04.md) |
| API-Led Connectivity (Experience/Process/System) | [day04](day04.md) |
| First Mule App (Listener, DB, Transform Message) | [day05](day05.md) |
| HTTP Methods & Response Codes | [day06](day06.md) |
| JSON Format | [day06](day06.md) |
| Mule Event (payload/attributes/variables) | [day07](day07.md) |
| Anypoint Platform Modules | [day07](day07.md) |
| Mule 4 Project Structure / `pom.xml` | [day08](day08.md) |
| Anypoint Studio UI | [day09](day09.md) |
| URI Params vs. Query Params | [day10](day10.md) |
| Pagination (offset/limit) | [day10](day10.md) |
| API Strict Validation | [day10](day10.md) |
| HTTP Request Connector (consuming APIs) | [day11](day11.md) |
| Target Variable / Response Timeout | [day12](day12.md) |
| Reconnection Strategy / Response Validator | [day13](day13.md) |
| Property Files / Secure Properties / Encryption | [day14](day14.md) |
| Error Handling (Error Object, On Error Propagate) | [day15](day15.md) |
| Error Mapping / On Error Continue / Raise Error / Choice | [day16](day16.md) |
| Deployment Strategies (Control/Runtime Plane) | [day17](day17.md) |
| CloudHub (Worker, vCore, Scaling) | [day18](day18.md) |
| On-Premises Deployment (Mule Runtime, Domain Projects) | [day19](day19.md) |
| Hybrid Deployment / MuleSoft Community | [day20](day20.md) |
| API Lifecycle (Design-Simulate-Validate) | [day21](day21.md) |
| Multiple Consumers / JSON Debugging / Documentation | [day22](day22.md) |
| Hands-On RAML Authoring | [day23](day23.md) |
| RAML Best Practices (Examples/Data Types) | [day24](day24.md) |
| RAML Traits vs. Fragments | [day25](day25.md) |
| Publishing to Exchange / Asset Types | [day26](day26.md) |
| Importing a Published API / Scaffolding | [day26](day26.md) |
| Database Connector (Insert/Update/Select) | [day27](day27.md) |
| Domain Projects (recap) / OAuth Token Troubleshooting | [day27](day27.md) |
| Sensitive-Data Masking / JSON Logging | [day28](day28.md) |
| DataWeave `mask` Function / Reading MuleSoft Docs | [day29](day29.md) |
| Full CRUD Build-Out (PATCH/GET) / Validation Module | [day30](day30.md) |
| API Manager / Gateways / Policies (intro) | [day31](day31.md) |
| Rate Limiting / Spike Control / HTTP Caching / JSON Threat Protection | [day32](day32.md) |
| OAuth 2.0 / Authorization Code Grant Type | [day33](day33.md) |
| Client Credentials & Resource Owner Password Grant Types / JWT | [day34](day34.md) |
| API Instance / Autodiscovery / CloudHub 2.0 Deployment | [day35](day35.md) |
| Basic Authentication / Client ID Enforcement (hands-on) | [day36](day36.md) |
| IP Allowlist/Blocklist / Threat Protection / Rate Limiting SLA / Spike Control (hands-on) | [day37](day37.md) |
| HTTP Caching Policy / JWT Validation (Auth0, JWKS) | [day38](day38.md) |
| MUnit (Behaviour/Execution/Validation, recording, coverage) | [day39](day39.md) |
| MUnit Error-Handler Tests / Assert Equals / Full Coverage | [day40](day40.md) |
| Consuming SOAP (WSDL, Web Service Consumer) | [day41](day41.md) |
| Scatter-Gather | [day42](day42.md) |
| Async Scope / DataWeave Selectors | [day43](day43.md) |
| DataWeave Operators / default / if-else / match / filter / filterObject | [day44](day44.md) |
| DataWeave map / mapObject / groupBy / reduce / orderBy / pluck / dates | [day45](day45.md) |
| Salesforce Connector (objects, SOQL Query) | [day46](day46.md) |
| Salesforce Create / Upsert / On New Object / Scheduler / Cron | [day47](day47.md) |
| For Each Scope | [day48](day48.md) |
| Bulk Insert / Parallel For Each / Max Concurrency | [day49](day49.md) |
| Batch Processing (Job, Step, Aggregator) | [day50](day50.md) |
| JMS / ActiveMQ / Queues vs. Topics / Ack Modes / VM | [day51](day51.md) |
| Object Store (theory, tokens, watermarking) | [day52](day52.md) |
| Object Store Watermarking (hands-on) | [day53](day53.md) |
| FTP / File / SFTP Connectors | [day54](day54.md) |
| CI/CD with Jenkins / GitHub | [day55](day55.md) |
| Amazon S3 Connector | [day57](day57.md) |
| Logging Levels / Verbose Logging / flatten / flatMap / XML & CSV | [day58](day58.md) |
| Interview Prep: Résumé, Cover Letter, Tell Me About Yourself, REST/SOAP/HTTP Q&A | [interview-part1](interview-part1.md) |
| Interview Prep: RAML, Policies, OAuth/JWT, Error Handling, DataWeave Q&A | [interview-part2](interview-part2.md) |

---
*Notes generated from Telugu-language lecture recordings, transcribed and translated to English via local speech-to-text (Whisper), then organized into structured notes.*
