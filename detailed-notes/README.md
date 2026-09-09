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

> 💡 GitHub renders the Mermaid diagrams in these files natively — just view them on github.com (diagrams won't render in a plain text editor or terminal `cat`).
