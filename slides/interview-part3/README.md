# Interview Preparation Part 3 — Slides and On-Screen Drawings

Screens and drawings from the third interview-preparation session: DataWeave questions, API-led connectivity, Runtime Manager and scaling, deployment models, a sample banking project (API landscape and flow diagram), clustering and load balancers, domain projects, and HTTPS/TLS questions. Repeated and blank frames have been removed. Times are positions in the video.

| # | Time | Content |
|---|---|---|
| 01 | 4:39 | DataWeave Q&A (continued) — default, custom functions with `fun`, ways to create variables (Set Variable, target variables, Transform Message, DW global / local variables) |
| 02 | 6:46 | DataWeave Q&A — selectors (single-value, multi-value, descendants, index, attribute `@`, range) |
| 03 | 10:27 | DataWeave Q&A — date-time functions: `now()`, time zones (`>> "IST"`), `as Date {format: …}`, adding periods (`|PT15M|`, `|P10D|`), year / month / day |
| 04 | 24:00 | DataWeave Q&A — concat (`++`), pluck, pluck vs mapObject, map vs mapObject, skipNullOn |
| 05 | 33:53 | DataWeave Q&A — `log("WARNING", "Houston, we have a problem")`, calling sub-flows with lookup, joinBy / splitBy |
| 06 | 35:07 | Playground — `output application/json skipNullOn = "everywhere"` example |
| 07 | 35:57 | DataWeave Q&A — null checks with isEmpty, masking (`payload mask field("age") with "***"`), app.name / flow.name, if-else, readUrl |
| 08 | 48:33 | API-led Q&A — why more than one experience API, why follow API-led architecture, advantages and disadvantages |
| 09 | 51:27 | API-led Q&A — system, process and experience layers explained |
| 10 | 51:23 | Q&A — explain the API life cycle in MuleSoft (design, implementation, testing, deploy, monitor) |
| 11 | 53:11 | Runtime Manager Q&A — what is Runtime Manager, vCore, worker, features of workers, apps per worker |
| 12 | 62:15 | Q&A — worker sizes (0.1–16 vCores), max 8 workers, horizontal vs vertical scaling and when to use each |
| 13 | 63:13 | Q&A — Mule runtime, deployment models (CloudHub, on-premise, hybrid, RTF), control plane vs runtime plane |
| 14 | 78:17 | MuleSoft project — Transaction and Loyalty Management module, Banking domain |
| 15 | 78:20 | Training approach slide — LPP model, online and offline sessions, recordings, 35 hours |
| 16 | 78:24 | API landscape — experience, process and system layers with the banking project's APIs |
| 17 | 78:26 | Flow diagram — banking project: transaction, loyalty and coupon flows across Mule layers to SFDC, partner API and MySQL |
| 18 | 78:28 | *Drawing:* ICICI Bank (client) and TCS (service company) — business team, technical team (architect), BRD/FSD, HLD, developers, lead, testers |
| 19 | 78:33 | "Thanks for attending the session — Any questions?" |
| 20 | 83:11 | Q&A — what is a cluster, server group, cluster vs server group, how to achieve clustering in MuleSoft |
| 21 | 83:38 | *Drawing:* client → load balancer URL → several workers / servers (10.1.2.5 … 10.1.2.8) |
| 22 | 104:30 | Q&A — implementation URL vs proxy URL, Anypoint VPC, VPN, load balancer, shared (SLB) vs dedicated load balancer (DLB) and their ports |
| 23 | 107:49 | Q&A — SLB vs DLB differences, domain projects, ways of deploying Mule applications, disabling CloudHub logs |
| 24 | 112:31 | Studio — transaction-sapi MUnit suite: Set Input reads the recorded payload with `readUrl("classpath://…/set-event_payload.dwl")` (shown during the domain-project discussion) |
| 25 | 117:28 | Q&A — CloudHub vs on-premise (control and runtime plane, maintenance, cost) |
| 26 | 137:34 | HTTPS / TLS Q&A — steps to expose and consume HTTPS, generating certificates (keytool, OpenSSL), symmetric vs asymmetric encryption, digital and self-signed certificates |
| 27 | 137:39 | Q&A — keystore vs truststore, private key, public key |

---

### 01 — DataWeave Q&A (continued) — default, custom functions with `fun`, ways to create variables (Set Variable, target variables, Transform Message, DW global / local variables)
![dw-custom-functions](01-dw-custom-functions.jpg)

### 02 — DataWeave Q&A — selectors (single-value, multi-value, descendants, index, attribute `@`, range)
![dw-selectors](02-dw-selectors.jpg)

### 03 — DataWeave Q&A — date-time functions: `now()`, time zones (`>> "IST"`), `as Date {format: …}`, adding periods (`|PT15M|`, `|P10D|`), year / month / day
![dw-date-time](03-dw-date-time.jpg)

### 04 — DataWeave Q&A — concat (`++`), pluck, pluck vs mapObject, map vs mapObject, skipNullOn
![dw-concat-pluck](04-dw-concat-pluck.jpg)

### 05 — DataWeave Q&A — `log("WARNING", "Houston, we have a problem")`, calling sub-flows with lookup, joinBy / splitBy
![dw-log](05-dw-log.jpg)

### 06 — Playground — `output application/json skipNullOn = "everywhere"` example
![playground-skipnull](06-playground-skipnull.jpg)

### 07 — DataWeave Q&A — null checks with isEmpty, masking (`payload mask field("age") with "***"`), app.name / flow.name, if-else, readUrl
![dw-mask-ifelse](07-dw-mask-ifelse.jpg)

### 08 — API-led Q&A — why more than one experience API, why follow API-led architecture, advantages and disadvantages
![api-led-qa](08-api-led-qa.jpg)

### 09 — API-led Q&A — system, process and experience layers explained
![api-led-layers](09-api-led-layers.jpg)

### 10 — Q&A — explain the API life cycle in MuleSoft (design, implementation, testing, deploy, monitor)
![api-lifecycle-qa](10-api-lifecycle-qa.jpg)

### 11 — Runtime Manager Q&A — what is Runtime Manager, vCore, worker, features of workers, apps per worker
![runtime-manager-qa](11-runtime-manager-qa.jpg)

### 12 — Q&A — worker sizes (0.1–16 vCores), max 8 workers, horizontal vs vertical scaling and when to use each
![scaling-qa](12-scaling-qa.jpg)

### 13 — Q&A — Mule runtime, deployment models (CloudHub, on-premise, hybrid, RTF), control plane vs runtime plane
![deployment-models-qa](13-deployment-models-qa.jpg)

### 14 — MuleSoft project — Transaction and Loyalty Management module, Banking domain
![mulesoft-project](14-mulesoft-project.jpg)

### 15 — Training approach slide — LPP model, online and offline sessions, recordings, 35 hours
![training-approach](15-training-approach.jpg)

### 16 — API landscape — experience, process and system layers with the banking project's APIs
![api-landscape](16-api-landscape.jpg)

### 17 — Flow diagram — banking project: transaction, loyalty and coupon flows across Mule layers to SFDC, partner API and MySQL
![flow-diagram](17-flow-diagram.jpg)

### 18 — *Drawing:* ICICI Bank (client) and TCS (service company) — business team, technical team (architect), BRD/FSD, HLD, developers, lead, testers
![drawing-project-team](18-drawing-project-team.jpg)

### 19 — "Thanks for attending the session — Any questions?"
![thanks-slide](19-thanks-slide.jpg)

### 20 — Q&A — what is a cluster, server group, cluster vs server group, how to achieve clustering in MuleSoft
![cluster-qa](20-cluster-qa.jpg)

### 21 — *Drawing:* client → load balancer URL → several workers / servers (10.1.2.5 … 10.1.2.8)
![drawing-load-balancer](21-drawing-load-balancer.jpg)

### 22 — Q&A — implementation URL vs proxy URL, Anypoint VPC, VPN, load balancer, shared (SLB) vs dedicated load balancer (DLB) and their ports
![vpc-lb-qa](22-vpc-lb-qa.jpg)

### 23 — Q&A — SLB vs DLB differences, domain projects, ways of deploying Mule applications, disabling CloudHub logs
![domain-project-qa](23-domain-project-qa.jpg)

### 24 — Studio — transaction-sapi MUnit suite: Set Input reads the recorded payload with `readUrl("classpath://…/set-event_payload.dwl")` (shown during the domain-project discussion)
![domain-project-studio](24-domain-project-studio.jpg)

### 25 — Q&A — CloudHub vs on-premise (control and runtime plane, maintenance, cost)
![onprem-vs-cloud](25-onprem-vs-cloud.jpg)

### 26 — HTTPS / TLS Q&A — steps to expose and consume HTTPS, generating certificates (keytool, OpenSSL), symmetric vs asymmetric encryption, digital and self-signed certificates
![tls-qa](26-tls-qa.jpg)

### 27 — Q&A — keystore vs truststore, private key, public key
![keystore-truststore](27-keystore-truststore.jpg)

