# Interview Preparation Part 3 — DataWeave Q&A (continued), API-led Connectivity, Runtime Manager, Deployment, Clustering and Load Balancers, and HTTPS / TLS

## Session Agenda
- **DataWeave** Q12–Q32, continued from Part 2 — default, custom functions, variables, selectors, dates, pluck / map / mapObject, skipNullOn, `p()`, log, joinBy, isEmpty, mask, if-else, readUrl
- What the instructor sees when interviewing senior candidates
- **API-led connectivity** — layers, extra experience APIs, pros and cons, API lifecycle
- **Runtime Manager** — vCore, workers, horizontal vs vertical scaling, Mule runtime
- **Deployment models** — CloudHub, on-premise, hybrid, RTF; control vs runtime plane; CloudHub vs on-premise
- **Cluster vs server group**, with a load-balancer drawing
- **URLs, VPC, VPN, shared vs dedicated load balancer**
- **Domain project**, ways to deploy, disabling CloudHub logs
- **HTTPS / TLS** — keystore, truststore, keys, SSL vs TLS, one-way / two-way handshakes, certificates

## DataWeave
- **default** fills absent or null values: `payload.name default "XYZ Bank"`.
- Custom functions: `fun name(p) = …` in the header.
- **Variables:** Set Variable, target variables, Transform Message, Scripting, DW global `var` (only inside that Transform Message), DW local (scope only).
- **Selectors:** `.key` single, `.*key` one level, `..key` all levels, `[i]` / `[-1]` / `[0 to 2]` index and range, `.@attr` XML attribute.
- **Dates:** `now() >> "IST"`, `as Date {format: "yyyy-MMM-dd"}`, `|PT15M|`, `|P10D|`, `.year`. JSON dates arrive as strings — parse them first, then reformat.
- `++` concat. **pluck** object → array; **reduce** array → object.
- **map** `$` item, `$$` index. **mapObject** `$` value, `$$` key, `$$$` index.
- `skipNullOn = "everywhere"` on the output line. `p('x')` / `p('secure::x')`. `log(prefix, value)`. lookup can't call a sub-flow.
- **joinBy** array → string. **isEmpty** = null check. `mask field("age") with "***"`. `app.name` / `flow.name` in the Logger only.
- **readUrl** reads the files the MUnit recorder saves.
- Using DataWeave 2.0; the latest is 2.6.0. Keep up through meetups and release notes.

## API-led Connectivity
- **System** fetches data with no logic. **Process** applies the business logic. **Experience** wraps it and carries all the policies.
- Build more than one experience API only when consumers need different data or policies.
- **Pros:** reusability, contained failures, faster time to market in the long run. **Cons:** more initial time, more vCores.
- Layers talk over the HTTP Request connector.
- 3 systems + 2 consumers → 6 APIs (5 if one experience API fits both).
- **Lifecycle:** design → implementation → testing → deploy → monitor.

## Runtime Manager and Deployment
- **Runtime Manager:** deploy / undeploy, stop / restart, logs, runtime version, worker size, scaling.
- 1 app per worker · 10 apps per vCore · 0.1–16 vCores · max 8 workers.
- **Horizontal scaling** = more workers (more requests, high availability). **Vertical scaling** = bigger worker (bigger payloads).
- **CloudHub:** MuleSoft runs both planes. **On-premise:** the client runs both. **Hybrid:** MuleSoft control plane, client runtime. **RTF:** containers on the client side.
- **Control plane** = Design Center, Exchange, Management Center. **Runtime plane** = runtime, connectors, services.
- **CloudHub vs on-premise:** CloudHub has 10 apps per vCore, no domain project, little maintenance and Anypoint MQ. On-premise allows more apps per vCore and domain projects, needs more maintenance, costs more and gives more control.
- Mention only what you can explain. Admit what you haven't done.

## Cluster, Network and Load Balancers
- **Cluster:** up to 8 servers. The nodes share state and fail over to each other.
- **Server group:** isolated nodes; it only saves deployment effort.
- CloudHub clusters automatically, round robin across data centers.
- **Implementation URL** = the deployed app's URL. **Proxy URL** = where the policies apply. Share the load balancer URL with consumers.
- **VPC** = a dedicated, isolated CloudHub space. **VPN** = a private link from the on-premise network to the VPC.
- **SLB:** 8081/8082, default, lower regional rate limit → 503.
- **DLB:** 8091/8092, inside a VPC, custom certificates, one domain, two-way auth.
- **Domain project:** shared configs; on-premise only.
- **Deploy:** JAR via Runtime Manager, Studio, CI/CD with Jenkins, or drop the JAR into the runtime (`.anchor` file).
- CloudHub logs: about 100 MB. Disable them and send logs to Splunk — only the system logs stay.

## HTTPS / TLS
- **Keystore** = your private key and certificates. **Truststore** = the certificates you trust.
- The private key stays secret; the public key is shared.
- **TLS** replaced the older, weaker SSL.
- **One-way:** the client verifies the server. **Two-way (mTLS):** both verify.
- **Expose HTTPS:** keytool genkey → HTTPS on the Listener → keystore in the TLS section.
- **Consume HTTPS:** HTTPS on the Requester → truststore in the TLS section.
- **Symmetric** = one key. **Asymmetric** = a key pair.
- A **digital certificate** is a CA-issued identity. A **self-signed** certificate is unsafe for public apps.

## Quick Recap
- DataWeave: finish Q12–Q32 in the Playground — selectors, dates and `$` notation are the commonly confused ones.
- API-led: three layers; extra experience APIs only for different data or policies; the five lifecycle phases.
- Workers: 1 app, 0.1–16 vCores, max 8. Horizontal vs vertical scaling.
- Deployment models are split by who runs the control and runtime planes.
- Cluster (shared state, failover) vs server group (deployment only).
- SLB (8081/8082, 503) vs DLB (8091/8092, custom certificates, VPC).
- Domain project on-premise only. Four ways to deploy.
- TLS: keystore vs truststore, one-way vs two-way, Listener keystore / Requester truststore.
