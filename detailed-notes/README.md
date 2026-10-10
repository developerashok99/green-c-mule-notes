# Detailed Notes

Deep, example-rich, diagram-heavy versions of each day's notes — built for **learning the concepts thoroughly** (e.g. alongside re-watching a lecture), not just for a quick review. For the short/concise version, see the [top-level notes](../).

Every file includes: plain-English explanations with analogies, worked examples with real numbers, Mermaid diagrams (flowcharts, sequence diagrams) for every major mechanism, comparison tables, common pitfalls, and a "Quick Recap" at the end.

## Index

| Day | Focus |
|---|---|
| [day01.md](day01.md) | What is MuleSoft, the translator analogy, why MuleSoft specifically, career framing |
| [day02.md](day02.md) | API vs. Integration precisely, the 80% rule, where a developer sits in a real team |
| [day03.md](day03.md) | API vs. web service, REST vs. SOAP full comparison, why so many environments exist |
| [day04.md](day04.md) | API Lifecycle, point-to-point vs. ESB, monolithic vs. microservices, API-Led Connectivity |
| [day05.md](day05.md) | Building the first Mule app step by step, debugging real errors, Run vs. Debug |
| [day06.md](day06.md) | HTTP methods, full request anatomy, every response code, JSON data types |
| [day07.md](day07.md) | The Mule Event model (payload/attributes/variables) and the overwrite trap |
| [day08.md](day08.md) | Mule 4 project structure, Maven, `pom.xml`, flow anatomy |
| [day09.md](day09.md) | Anypoint Studio UI, project lifecycle operations, workspaces |
| [day10.md](day10.md) | URI vs. query params, pagination mechanics, strict validation |
| [day11.md](day11.md) | HTTP Request connector, consuming third-party REST services, API-Led Connectivity in practice |
| [day12.md](day12.md) | Shaping responses, DataWeave Playground, Target Variable, Response Timeout |
| [day13.md](day13.md) | Reconnection Strategy, Response Validator, HTTPS placement |
| [day14.md](day14.md) | Property files, environment externalization, Run Configurations, Secure Properties |
| [day15.md](day15.md) | Error handling — Error Object, On Error Propagate, the "ANY must be last" rule |
| [day16.md](day16.md) | Error Mapping, 3 levels of error handling, On Error Continue, Raise Error, Choice |
| [day17.md](day17.md) | Deployment strategies: Control Plane vs. Runtime Plane model |
| [day18.md](day18.md) | CloudHub: Worker, vCore, horizontal/vertical scaling, a real live bug |
| [day19.md](day19.md) | On-Premises: Mule Runtime folder structure, wrapper.conf, Domain Projects |
| [day20.md](day20.md) | Hybrid deployment, a real unresolved bug, MuleSoft Community, troubleshooting philosophy |
| [day21.md](day21.md) | API Lifecycle revisited, RAML vs OAS, the Employee use case, API-Led cost trade-offs |
| [day22.md](day22.md) | Multiple consumers, naming conventions, JSON debugging, schema defaults, sequence diagrams |
| [day23.md](day23.md) | Hands-on RAML authoring, live — two real bugs worked through in full |
| [day24.md](day24.md) | Externalizing RAML examples and data types — reuse within one spec |
| [day25.md](day25.md) | Traits vs. Fragments — the scope boundary that matters most |
| [day26.md](day26.md) | Publishing to Exchange, importing a published API, scaffolding, the flow-naming golden rule |
| [day27.md](day27.md) | Full implementation build-out, Database connector, property files, Domain Projects, OAuth token Q&A |
| [day28.md](day28.md) | Initial variables, JSON logger, and masking (intro) |
| [day29.md](day29.md) | Masking mechanics, real database setup, and service accounts |
| [day30.md](day30.md) | PATCH/GET build-out, RAML sync, and the Validation module |
| [day31.md](day31.md) | API Manager, gateways, and the policy layer begins |
| [day32.md](day32.md) | Rate Limiting, Spike Control, caching, and JSON Threat Protection |
| [day33.md](day33.md) | OAuth 2.0, Authentication vs. Authorization, and the Authorization Code Grant |
| [day34.md](day34.md) | Client Credentials, Resource Owner Password, Object Store caching, and JWT |
| [day35.md](day35.md) | Create an API instance, Autodiscovery, and deploying to CloudHub 2.0 |
| [day36.md](day36.md) | Fixing the CloudHub 2.0 deployment, Basic Authentication and Client ID Enforcement |
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
| [interview-part3.md](interview-part3.md) | Interview Preparation Part 3 — DataWeave Q&A (continued), API-led, Runtime Manager, deployment, clustering / load balancers, HTTPS / TLS |

> 💡 GitHub renders the Mermaid diagrams in these files natively — just view them on github.com (diagrams won't render in a plain text editor or terminal `cat`).
