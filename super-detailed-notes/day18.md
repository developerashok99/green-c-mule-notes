# Day 18 — CloudHub in Depth: Worker, vCore, Horizontal and Vertical Scaling, Deploying from Runtime Manager

> **Sources:** audio transcript, existing notes, and the class video (recorded 2 Dec 2024). Slide text and Runtime Manager screens marked *slide* or *screen* are read from the recording. Slide images: [slides/day18](../slides/day18/).

## 1. Overview

1. Recap: why some organisations can't use CloudHub
2. **CloudHub** as iPaaS
3. **Worker** — one dedicated Mule instance per application
4. **vCore** — worker sizes, memory, licensing
5. **Horizontal scaling** vs. **vertical scaling**
6. Live deployment from **Runtime Manager** (CloudHub 2.0 on a trial account): naming rules, runtime versions, replicas, properties, protected properties
7. Runtime version compatibility and upgrading
8. Viewing **logs**, retention, correlation ID
9. A real compatibility problem seen after deployment (not resolved in this session)

---

## 2. Recap — Why Not CloudHub Everywhere?

MuleSoft has no data centres of its own; it prepares AWS/Azure infrastructure for Mule. **Instructor's statement:** there was no MuleSoft-ready CloudHub region in India, so data would be stored in Singapore, London or the US. Organisations with data-residency rules therefore choose other strategies; others use CloudHub.

---

## 3. What Is CloudHub?

*Slide* — **What is CloudHub?** CloudHub is an integration platform as a service (iPaaS) where you can deploy Mule applications in the cloud environment provided by MuleSoft · Worker is a dedicated Mule instance that runs your Mule application · vCore – worker sizes are measured in vCores (0.1 vCores – 500 MB, 0.2 vCores – 1 GB, 1 vCore – 1.5 GB).

> **CloudHub is an integration platform as a service (iPaaS)** where you deploy Mule applications in a cloud environment provided by MuleSoft.

To deploy a Mule app on your own server, you'd install and configure Java, Maven and the Mule runtime. With raw AWS you'd still have to prepare everything yourself. MuleSoft takes AWS infrastructure, installs and prepares everything for Mule applications, and offers it as **CloudHub**.

---

## 4. Worker

### 4.1 Where apps run locally

In Studio's Package Explorer you see the **Mule server** (e.g. 4.4) — the embedded runtime where the app is deployed locally, with Java etc. ready.

### 4.2 In CloudHub

When you deploy, CloudHub creates a **worker** (like a container) and deploys your application in it.

> A **worker** is a **dedicated Mule instance** that runs your Mule application — a mini server.

- **One worker runs one application.** You cannot deploy a second application on the same worker — that's why it's called "dedicated".

---

## 5. vCore

### 5.1 Worker size

Worker capacity (CPU and memory) is measured in **vCores** — like distance in metres/kilometres.

| Worker size (CloudHub 1.0) | Memory |
|---|---|
| **0.1 vCore** (minimum) | 500 MB |
| **0.2 vCore** | 1 GB |
| **1 vCore** | 1.5 GB |

Larger sizes exist (up to 16 vCores).

### 5.2 Mobile analogy

A phone with 2 GB RAM runs 10–15 apps without lag; with 25–30 apps memory isn't enough and everything lags. Likewise a worker must have enough CPU and memory for its traffic.

### 5.3 How the size is decided

- **Performance (load) testing** in pre-prod: e.g. 10,000 requests/day → per hour → test a bit above that on one worker; check whether memory/CPU suffices.
- If traffic is low, teams may not do detailed load testing.
- **Instructor's experience:** 0.1 vCore handles most applications (80–90%); 500 MB is plenty. Rarely 0.2 or 0.3. But use **multiple workers** for high availability.

### 5.4 Licensing

MuleSoft charges by the **number of vCores** purchased.

> **Instructor's estimate (not verified):** about US $25,000 per vCore for a multi-year term; the minimum licence starts around ₹70–80 lakh. It suits enterprise-level organisations.

### 5.5 How many apps per vCore?

1 vCore ÷ 0.1 vCore per app = **10 applications** at the minimum size. If some apps need 0.2 or 0.3, fewer fit.

**Example:** six apps at 0.1 (0.6) + one at 0.2 (0.8) + one at 0.3 (1.1) → exceeds 1 vCore; one app can't be deployed.

Enterprise architects estimate how many apps are coming and buy vCores accordingly (production and non-production).

---

## 6. Horizontal Scaling

### 6.1 Example

**Illustrative example (Flipkart):**

```text
Consumers ──► Load balancer ──► Worker 1
                           ├──► Worker 2
                           └──► Worker 3
```

- Each worker handles up to **40,000 requests/day** (illustrative).
- 3 workers → 1,20,000/day. Normal traffic ~1 lakh/day — fine.
- Festive sale: ~3 lakh/day → would crash.
- Before the sale, increase workers (e.g., to 8 → 3,20,000 capacity), redeploy; the load balancer distributes the load.

### 6.2 Definition

*Slide* — **Horizontal Scaling:** The process of increasing number of workers and deploy application on multiple workers · If you want to process high frequency small payload requests, then go for HS · It provides high-availability. (*Drawing:* Flipkart sale, load balancer across workers, 1,00,000 → 3,40,000 requests.)

> **Horizontal scaling** = increasing the **number of workers** and deploying the application on multiple workers.

**When?** To process **high-frequency, small-payload** requests — the **number** of requests increases; the payload size stays the same.

**Benefits:** high availability; load distributed evenly.

**Limits:** minimum 1 worker; maximum **8 workers** per application. **Instructor's experience:** never needed more than 8.

---

## 7. Vertical Scaling

### 7.1 Example

- Payload normally ~**200 KB**; 0.1 vCore handles it.
- For some reason payloads grow ~**10×** (2,000 KB).
- If this exceeds the worker's memory → **out of memory** errors / crashes.

### 7.2 Definition

*Slide* — **Vertical Scaling:** The process of increasing the vCore size of a worker · If you want to process large payload requests with less frequency, then go for VS. (*Drawing:* payload 200 KB → 2000 KB; 0.1 → 0.2 vCore.)

> **Vertical scaling** = increasing the **vCore size** of the worker (more memory/CPU), e.g. 0.1 → 0.2.

**When?** When the **payload size** (data per request) grows and memory isn't enough.

### 7.3 Applies to all workers

The vCore size applies to **all** workers of an application; you can't size workers individually.

Why it matters: with round robin, if worker 1 were 0.2 and workers 2–3 were 0.1, request 1 succeeds, requests 2 and 3 run out of memory, request 4 succeeds, …

### 7.4 Summary

| | Horizontal scaling | Vertical scaling |
|---|---|---|
| What changes | Number of workers | vCore size of each worker |
| When | More requests, same payload size | Bigger payloads (more memory needed) |
| Benefit | High availability, more throughput | Handles large messages |

---

## 8. Deploying from Runtime Manager (Live Demo)

### 8.1 Environments

Runtime Manager shows environments. The trial account has **Design** and **Sandbox** (real orgs: Dev, SIT, UAT, Prod — names can be changed). The demo deployed to **Sandbox**.

### 8.2 Opening Runtime Manager

- Menu (☰) → **Runtimes → Runtime Manager**, or the home page tile.
- **Tip:** right-click the Runtime Manager link → **Open in new tab** to keep API Manager and Runtime Manager open side by side.

**Load Balancers** also appear in the Runtime Manager menu — usually managed by admins, DevOps or architects; developers request mapping of their apps.

### 8.3 Preparing the application

- Listener port in properties: Shared LB **8081** (HTTPS **8082**); Dedicated LB **8091**/**8092**.
- **Property file changes don't trigger auto-redeploy** in Studio; code changes do. After changing properties, stop and run again.
- A wrong host in properties doesn't stop deployment — the code is fine; the failure appears only when the request runs.
- **Export the JAR:** right-click → Export → Mule Deployable Archive → choose location (e.g., Downloads). Or right-click → Show in System Explorer → **target** folder.

**artifactId:** usually the same as the project name (~90% of the time). Built JARs are stored in repositories using these identifiers.

### 8.4 Deploy Application form

Applications → **Deploy application**:

**1. Application name** (green tick = valid)

| Rule | Detail |
|---|---|
| Characters | Lowercase letters, numbers, dashes |
| Start | Not with a number or a dash |
| Uniqueness | Must be available |
| Length | **Minimum 3, maximum 42** |

**Instructor's experience:** a project had an app name of 47–48 characters; the pipeline deployment failed. Use abbreviations: `conn` for consume, `svc` for service.

**2. Deployment target**

Options: CloudHub, **CloudHub 2.0**, Hybrid. On this account, CloudHub 1.0 was no longer in the list (discontinued for new trials) — CloudHub 2.0 **Shared Space**, region **US East (Ohio)**.

- Region set via **Access Management** (region profile) — an admin activity.
- CloudHub 2.0 is the latest version; differences mostly in performance and terminology. Many companies still run 1.0.

**3. JAR file** — upload the exported JAR.

**4. Runtime version, Java version (8 or 17)** — see §9.

**5. Size and instances**

| CloudHub 1.0 | CloudHub 2.0 |
|---|---|
| Worker | **Replica** |
| Worker size (vCore) | **Replica size** |
| Number of workers | **Replica count** (max 8 shown) |

Trial accounts normally allow one worker; this account showed more options. The size selected applies to all replicas.

**6. Properties** — key/value pairs, same names as in Studio's Run Configuration:

| Key | Value |
|---|---|
| `mule.env` | `prod` |
| `secure.key` | `<key>` |

**Protect** option: once protected, the value can't be viewed or retrieved by any user; can't be undone.

**In real projects:** properties are provided by the **CI/CD pipeline**, which DevOps usually builds (90% of the time).

> **Interview tip (instructor):** if asked whether you built a pipeline and you haven't, say: "I haven't built one, but I deployed my applications through the CI/CD pipeline and know what changes the application needs for it."

**7. Deploy** → "Uploaded successfully" → logs start.

---

## 9. Runtime Versions and Upgrades

### 9.1 Version numbers

`4.8.1` = **major.minor.patch**.

- **Major** (3.x → 4.x): big changes. Mule 3 vs. Mule 4 differed in error handling, the Mule message/event structure, fewer components/connectors, no target variables, performance.
- **Minor** (4.4 → 4.6 → 4.8): small changes and improvements. **Instructor's observation:** 4.4 was most common; now 4.6/4.7.

### 9.2 Compatibility

> An app built for a **lower** version can run on a **higher** runtime. An app built for a **higher** version won't deploy on a **lower** runtime (no backward compatibility).

E.g., built for 4.8 → won't deploy on 4.6. Built for 4.4 → can be deployed on 4.8.

### 9.3 Upgrading 4.4 → 4.8

1. Change `app.runtime` in `pom.xml` (and `minMuleVersion` in `mule-artifact.json`), e.g. `4.8.1`. Keep the main version; drop or adjust the patch as needed.
2. Test all connectors. If a connector version isn't compatible (e.g. HTTP 1.6.0 on 4.8.1), upgrade it in pom.xml (e.g. to 1.8.x) — Studio downloads the new version.
3. The project's Mule server library shows the runtime used locally.

**Release channel:** Runtime Manager also shows a release channel; the instructor's understanding: one channel gets new versions monthly with the latest features and a shorter support period.

> **Technical clarification:** MuleSoft offers an **Edge** channel (frequent releases, shorter support) and an **LTS** (long-term support) channel.

---

## 10. Logs in Runtime Manager

- **Applications** → select environment (Sandbox) → click the application → **Logs**.
- First logs show deployment progress: worker/replica created, running, "application started". Green status = deployed.
- The application URL is shown in the application details (CloudHub 2.0 lists it on the applications page).
- Filters: **errors only**, **time range**.
- **Correlation ID:** a unique ID sent in headers to identify a request; filter/search logs by it to follow one request.

### Retention

**Logs are kept up to 30 days or 100 MB** (whichever comes first). Older logs are lost. For longer retention, organisations use a separate logging system (paid). **Instructor's observation:** their current organisation uses only Runtime Manager logs and is discussing a separate system.

### Why logs matter

When something fails in a deployed app, logs are how you find where. Good logger placement (start and end of flows, meaningful messages) is a best practice.

---

## 11. The Problem After Deployment (Unresolved Here)

- Locally the app worked. On CloudHub 2.0 with runtime **4.8.1**, a request failed. Logs showed a **Mule expression error** at `payload.city` — the payload looked like **binary/base64** content ("expects one of these combinations").
- The first logger printed; the next didn't — the failure point was found from logs.
- **Instructor:** likely a 1.0 vs. 2.0 or version compatibility difference; they hadn't worked practically on CloudHub 2.0 and would investigate and show it next session.

### Lesson — always test locally first

Even small changes should be tested locally before deploying to Dev/SIT/UAT. A shared-environment deployment takes 15–20 minutes; failing there wastes double the time.

---

## 12. Important Terminology

| Term | Meaning |
|---|---|
| iPaaS | Integration Platform as a Service |
| Worker | Dedicated Mule instance running one app (CloudHub 1.0) |
| Replica | CloudHub 2.0 term for a worker |
| vCore | Unit of worker size (CPU/memory) and licensing |
| Replica size / count | CloudHub 2.0 size / number of replicas |
| Horizontal scaling | More workers |
| Vertical scaling | Bigger workers |
| Shared space | CloudHub 2.0 shared infrastructure option |
| Region | Geographic location of deployment |
| Protected property | Runtime Manager property whose value is hidden permanently |
| Major / minor / patch | Version number parts |
| Release channel | Edge / LTS runtime release track |
| Correlation ID | Unique ID to trace one request across logs |

---

## 13. Interview Questions

### Q1. What is CloudHub?
MuleSoft's iPaaS — a managed cloud environment, built on cloud infrastructure, where Mule applications are deployed without managing servers.

### Q2. What is a worker? Can one worker run multiple applications?
A dedicated Mule instance (mini server) running one application. No — one worker, one application.

### Q3. What is a vCore and what are common worker sizes?
The unit of worker capacity and licensing. 0.1 vCore ≈ 500 MB, 0.2 ≈ 1 GB, 1 vCore ≈ 1.5 GB.

### Q4. Horizontal vs. vertical scaling?
Horizontal adds workers — for more requests of the same size (also gives high availability). Vertical increases worker size — for larger payloads needing more memory.

### Q5. Can different workers of one app have different sizes?
No; the size applies to all workers.

### Q6. Maximum workers per CloudHub application?
8.

### Q7. CloudHub application naming rules?
Lowercase letters, numbers and dashes; can't start with a number or dash; 3–42 characters; unique.

### Q8. Can an app built on Mule 4.8 be deployed on 4.6?
No. Lower → higher works; higher → lower doesn't.

### Q9. How long are CloudHub logs retained?
Up to 30 days or 100 MB, whichever comes first; use an external logging system for longer retention.

### Q10. How do you pass environment properties when deploying to CloudHub?
In the Properties section of the deployment (or via the CI/CD pipeline), e.g. `mule.env=prod`, `secure.key=…`; sensitive ones can be protected.

---

## 14. Must Remember

1. CloudHub = **iPaaS**; MuleSoft prepares cloud infrastructure for Mule apps.
2. **Worker** = dedicated Mule instance; **one app per worker**.
3. **vCore**: 0.1 = 500 MB (minimum, enough for most apps), 0.2 = 1 GB, 1 = 1.5 GB; licensing by vCore.
4. 1 vCore at 0.1 each = **10 apps**.
5. **Horizontal** = more workers (more requests); max **8** workers.
6. **Vertical** = bigger vCore (bigger payloads); size applies to **all** workers.
7. App name: **lowercase, numbers, dashes; 3–42 chars**; not starting with number/dash.
8. CloudHub 2.0: worker → **replica**, size → **replica size**.
9. Runtime: **lower → higher compatible, not the reverse**; upgrade runtime + connectors in pom.xml.
10. Logs: **30 days / 100 MB**; use correlation IDs; **test locally before deploying**.
