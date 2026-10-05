# Day 17 — Deployment Strategies: CloudHub, On-Premises, Hybrid, Runtime Fabric; Load Balancing and Scaling

> **Sources:** audio transcript, existing notes, and the class video (recorded 28 Nov 2024). This session was taught on the whiteboard; text marked *drawing* is read from it. Slide images: [slides/day17](../slides/day17/).

## 1. Overview

So far applications were developed and tested **locally**. A local app works only while your laptop is on, and nobody else can use it. This session covers where and how applications are deployed.

1. Why deployment is needed; environments and servers
2. Three main strategies — **CloudHub, on-premises, hybrid** (plus **Runtime Fabric**)
3. Why organisations choose differently (regulation, cost, maintenance)
4. Deciding the strategy: **control plane** and **runtime plane**
5. CloudHub deployment flow and **workers**
6. Data centres
7. **Load balancers** — round robin, shared vs. dedicated; high availability
8. **Scaling** up/down and **auto-scaling**
9. Ports for shared vs. dedicated load balancers
10. Runtime Fabric; career notes

---

## 2. Why Deploy?

Environments: **Dev, SIT/QA/Test, UAT, Pre-prod, Prod, DR**. Each environment has **servers**. Deploying means putting the application on the server of that environment (Dev server, SIT server, …).

Who provides the servers? The organisation decides. MuleSoft gives options:

- Deploy on **your own** servers → **on-premises**
- Log in and deploy on **MuleSoft's cloud** → **CloudHub**
- A **combination** → **hybrid**

**Instructor's observation:** CloudHub is used most; hybrid and on-premises less. Nobody has to work in all models.

---

## 3. The Three Strategies — First Look

### 3.1 On-premises

**Illustrative example:** ICICI Bank buys its own servers, installs the software, configures networking, and deploys the Mule application. It is exposed to internal or external users. → **On-premises.**

### 3.2 CloudHub

"I don't want the tension of maintenance." Develop locally, log in to Anypoint Platform, deploy to the **CloudHub** environment, fully managed by MuleSoft. → **CloudHub** (MuleSoft's cloud-based solution).

### 3.3 Hybrid

Applications run on **your own** servers, but some services (management) come from MuleSoft's cloud. → **Hybrid**.

---

## 4. Why Different Organisations Choose Differently

### 4.1 Regulated industries — data location

- CloudHub runs in MuleSoft cloud **regions** — e.g. Singapore (Asia), US, UK.
- If an Indian bank used a Singapore region, its data and logs would be stored outside India.
- **RBI (Reserve Bank of India)** rules: banking data must stay in India.
- **Instructor's statement:** MuleSoft did not have a CloudHub region in India (at the time), so Indian banks don't use CloudHub — not because cloud is banned, but because no in-country CloudHub region was available.
- **US example:** US regulators may allow cloud if data stays in the country. CloudHub has US regions, so a US bank can use CloudHub.

### 4.2 Smaller organisations

**Illustrative example:** a small e-commerce site with ~1,000 customers a day, no strict data regulations, and no budget for servers and a 24×7 team. CloudHub is easy: log in, develop, deploy — no server maintenance, patches or network teams.

### 4.3 What CloudHub really is

> CloudHub is MuleSoft's solution built on top of cloud providers.

AWS/Azure provide raw cloud infrastructure. They don't run Mule apps out of the box; MuleSoft prepares the Mule-ready infrastructure on top and offers it as CloudHub.

**Instructor's statement:** originally AWS was used; Azure is also used for some services.

> **Technical clarification:** MuleSoft documents CloudHub as running on AWS infrastructure. Treat the Azure remark as the instructor's understanding.

**Why learn this as a developer?** Many people in real projects are unsure whether they're on hybrid or on-premises. Knowing the difference lets you speak confidently in meetings.

---

## 5. Deciding the Strategy — Control Plane and Runtime Plane

### 5.1 Control plane

> Components used to **control/manage** Mule applications.

*Drawing:* "The components which are used to control the aspects of Mule apps will fall under **control plane**: ① Runtime Manager ② API Manager ③ Exchange — Management Center → Anypoint Platform — hosted by MuleSoft / own."

| Component | Use |
|---|---|
| Runtime Manager | Deploy, start, stop, restart apps; check logs |
| API Manager | Apply policies to protect APIs |
| Exchange | Centralised repository to publish and share assets |

Together these are often called the **Anypoint Management Center**. With an Anypoint Platform account, MuleSoft provides them — in the cloud.

You could host them on your own servers instead: procure hardware (CPU, memory), install software, configure networking, install the MuleSoft management software, patch it, and maintain it 24×7 with staff. Possible, but a huge cost and maintenance burden.

### 5.2 Runtime plane

> Components used while the application **runs**.

*Drawing:* "The components which are used while runtime aspects of MuleSoft app fall under **runtime plane**: ① Mule runtime ② connectors & components ③ logging → MuleSoft / own."

- A Java app runs on a server with Java installed. A Mule app runs on a server with the **Mule runtime** installed.
- The **Mule runtime** is the software that executes Mule applications.
- Connectors execute, and logs are written, where the app runs.

### 5.3 The matrix

*Drawing:* a table with columns **Deployment model | Control plane | Runtime plane**, rows CloudHub, on-premises, hybrid and RTF, with workers on AWS/Azure noted beside CloudHub.

| Strategy | Control plane | Runtime plane |
|---|---|---|
| **CloudHub** | MuleSoft | MuleSoft |
| **Hybrid** | MuleSoft | Your own (physical servers or your own cloud account) |
| **On-premises** | Your own | Your own |

> **Technical clarification:** a fully self-hosted control plane is MuleSoft's **Anypoint Platform Private Cloud Edition**. Many teams calling themselves "on-premises" actually run their own Mule runtimes managed from MuleSoft's cloud control plane — which is **hybrid**.

---

## 6. CloudHub

### 6.1 Deployment flow

```text
Develop and test locally (Studio)
      │
Export JAR
      │
Runtime Manager (Anypoint Platform) — app name, JAR, region, settings → Deploy
      │
MuleSoft region (e.g. US) → MuleSoft sets up a WORKER (mini server)
      │
Application runs → test it
```

Both planes are MuleSoft's → CloudHub.

### 6.2 Worker

> A **worker** is a mini server in CloudHub where your Mule application runs.

Details in the next session.

### 6.3 Region

Choose the region in Anypoint Platform (e.g., US or Europe/London). MuleSoft has a limited number of regions.

---

## 7. On-Premises and Hybrid in More Detail

### 7.1 On-premises

- Own servers for the runtime **and** own control plane.
- Mule provides the runtime software; you deploy and maintain everything.
- Chosen by **highly regulated** industries — healthcare, banks, financial institutions — because of sensitive data (credit-card numbers, account numbers, balances) and regulations.
- More secure, more maintenance, high cost.

### 7.2 Hybrid

- **Control plane** from MuleSoft (Runtime Manager etc.), **runtime** on your own servers. When connectivity between them is established, you manage on-premises runtimes from Runtime Manager.

**Question:** can the bank use the cloud for its own runtime? Yes — its **own** AWS/Azure account in an **Indian region**, set up by the bank. That is still **hybrid**, because MuleSoft isn't managing that cloud runtime; it's a third-party service the bank manages itself.

> Many people call hybrid "on-premises". If you use MuleSoft's control plane, it's hybrid — whether your runtime is a physical server or your own cloud.

**Difference from CloudHub:** in CloudHub, MuleSoft has already made AWS/Azure Mule-ready. In hybrid with your own cloud, *you* must make it Mule-ready.

---

## 8. Data Centres

- A company buys servers, places them in a location, configures them and deploys applications — a **data centre**. Big organisations have their own.
- Some companies run a **data-centre business**: thousands of servers, renting e.g. 50 to ICICI, 50 to HDFC, etc.
- **Analogy:** co-working/office spaces — a big building is leased to many companies; the owner handles cleaning, coffee, meeting rooms; tenants use the services and pay rent.

---

## 9. Load Balancing and High Availability

### 9.1 One server isn't enough

If an app runs on one server and that server has an issue for an hour, every request fails — for an e-commerce platform that's a huge business loss and poor customer experience.

Deploy on **multiple servers** (workers) with a **load balancer** in front.

### 9.2 Load balancer

```text
Consumer ──► Load balancer ──► Worker 1
                         └──► Worker 2
```

It decides which server receives each request.

**Round robin** (most used):

```text
Request 1 → Worker 1     Request 3 → Worker 1
Request 2 → Worker 2     Request 4 → Worker 2   …
```

With 1,000 requests a day, each worker handles ~500.

### 9.3 Why two workers? High availability

**Question:** does processing speed improve? **No.** The main reason is **high availability**: if worker 1 goes down, the load balancer sends all traffic to worker 2. The load balancer handles that automatically.

If one worker cannot handle the full load alone, it may crash too — that's a capacity question. With 3–4 workers, the application stays available.

### 9.4 Shared vs. dedicated load balancer (CloudHub)

*Drawing:* "LB → Load balancer: SLB (shared), DLB (dedicated)"; deploy app → load balancer (round robin) → workers → high availability, less downtime; CloudHub (US east) with 0.1 vCore workers.

| | Shared Load Balancer (SLB) | Dedicated Load Balancer (DLB) |
|---|---|---|
| Who uses it | Many companies in the CloudHub environment | Only your organisation |
| Setup | Provided by default | Premium; created and configured (mapped to your apps) by your team |
| Guarantees | Not guaranteed | Dedicated |

**Example:** ABC company has an app on 2 workers; XYZ company has an app on 3 workers. Both companies' requests go through the same shared load balancer. With a DLB, only ABC's traffic goes through ABC's DLB.

### 9.5 Ports (CloudHub)

*Drawing:* "SLB: HTTP — 8081 (port), HTTPS — 8082; DLB: HTTP — 8091, HTTPS — 8092".

| Load balancer | HTTP listener port | HTTPS listener port |
|---|---|---|
| Shared | 8081 | 8082 |
| Dedicated | 8091 | 8092 |

If the wrong port is used, the app won't work through that load balancer. This is why the Listener port is externalised (Day 14).

### 9.6 Workers in trial accounts

A trial account can deploy on **one worker** only. Real production apps use multiple workers for high availability; only unimportant apps (where 30 minutes of downtime is acceptable) use one.

---

## 10. Scaling

### 10.1 Example

- Each worker handles ~5,000 requests/day.
- Normal traffic: up to 8,000/day → **2 workers**.
- Festive week: 20,000/day → 2 workers can't handle it.
- **Scale up** to 5 workers (25,000 capacity, with headroom).
- After the festival, **scale down** to 2–3.

### 10.2 Cloud vs. own servers

In the cloud: change the worker count in Runtime Manager; unused capacity isn't paid for. On own servers: buy, set up and maintain hardware — a long process.

### 10.3 Auto-scaling

**Auto-scaling** (premium, extra licensing) senses rising traffic and adds workers, then removes them when traffic falls. Without it, increase workers manually in Runtime Manager.

### 10.4 Who decides the number of workers?

- The **architect**, based on **non-functional requirements** from the business: traffic per day/hour/minute, policies, etc.
- **Performance testing** confirms how many workers are needed.
- If unknown, start small, monitor and increase.
- **At least two workers** for important apps.
- Each worker consumes CPU/memory measured in **vCores**; MuleSoft charges by vCore — more workers, more cost.

### 10.5 Unexpected spikes

If capacity is 8,000/day and 15,000 arrive unexpectedly, the system can crash.

**Instructor's experience:** a worker crashed; it took 5–10 minutes for CloudHub to recover and assign a replacement worker, while the other workers handled traffic. If a sudden spike exceeds total capacity, workers can go down and come back repeatedly.

---

## 11. On-Premises: What You Set Up Yourself

```text
Server 1: Java + Maven + Mule runtime → deploy JAR
Server 2: Java + Maven + Mule runtime → deploy JAR
Load balancer: another server with load-balancing software, mapped to servers 1 and 2
```

You also need: server maintenance team, network team, load-balancer expertise, staff for 3 shifts (24×7), a second location for DR, and all of this for **each environment** (Dev, SIT, UAT, Prod).

Upgrades (Mule runtime, Java, Linux patches) are your organisation's job — Mule developers raise them with the responsible teams.

**Why the cloud is growing:** organisations want to focus on their **core business** instead of maintaining infrastructure.

**Analogy:** a working couple outsources cleaning to a maid for a few thousand rupees a month, freeing time for careers and family. Businesses outsource infrastructure to the cloud the same way.

---

## 12. Runtime Fabric (RTF)

Another deployment strategy.

- Runs on **your own servers**, in **containers**.
- MuleSoft provides an RTF software layer; **MuleSoft applies patches and Mule-related updates automatically**, reducing your burden.
- Connected to MuleSoft's control plane.
- Data and logs stay under **your** control.

**Is it faster than CloudHub?** Not inherently — it depends on the network and infrastructure.

---

## 13. Career Notes (Instructor's View)

- **Instructor's experience:** worked on **hybrid, CloudHub and RTF**, never on a complete on-premises setup. A client moved to CloudHub in FY 2024–25.
- You don't need experience in every model. If you've only used CloudHub in 3 years, say so honestly in interviews.
- **Don't bluff** about things you haven't worked on.

---

## 14. Important Terminology

| Term | Meaning |
|---|---|
| Deployment strategy | Where/how Mule apps run: CloudHub, on-premises, hybrid, RTF |
| CloudHub | MuleSoft-managed cloud for running Mule apps |
| On-premises | Own runtime and own control plane |
| Hybrid | MuleSoft control plane + own runtime |
| Runtime Fabric | Container-based runtime on own infrastructure, maintained with MuleSoft automation |
| Control plane | Management components: Runtime Manager, API Manager, Exchange |
| Runtime plane | Where the app executes: Mule runtime, connectors, logs |
| Mule runtime | Software that executes Mule apps |
| Worker | CloudHub mini server running an app |
| Region | Geographic location of CloudHub infrastructure |
| Data centre | Facility housing servers |
| Load balancer | Distributes requests across servers |
| Round robin | Requests distributed in turn |
| SLB / DLB | Shared / Dedicated Load Balancer |
| High availability | App stays available if a server fails |
| Scaling up/down | Adding/removing capacity |
| Auto-scaling | Automatic scaling (premium) |
| vCore | CPU/memory unit for licensing |
| Non-functional requirements | Traffic, performance, policies, etc. |

---

## 15. Interview Questions

### Q1. What deployment options does MuleSoft provide?
CloudHub (MuleSoft-managed cloud), on-premises (own runtime and control plane), hybrid (MuleSoft control plane, own runtime), and Runtime Fabric (containerised runtime on own infrastructure).

### Q2. How do you decide which deployment model is used?
By who provides the control plane (Runtime Manager, API Manager, Exchange) and the runtime plane (where the Mule runtime runs): both MuleSoft → CloudHub; MuleSoft control + own runtime → hybrid; both own → on-premises.

### Q3. Why might a bank not use CloudHub?
Regulations require data to stay in the country; if no CloudHub region exists there, data and logs would leave the country. Such banks use hybrid or on-premises.

### Q4. A company runs Mule runtimes in its own AWS account and manages them from Runtime Manager. Which model?
Hybrid — the runtime is self-managed even though it's in the cloud.

### Q5. What is a worker?
A dedicated mini server (instance) in CloudHub running a Mule application.

### Q6. Why deploy on multiple workers?
High availability. If one worker fails, the load balancer sends traffic to the others. More workers also add capacity.

### Q7. Shared vs. dedicated load balancer?
Shared is used by many customers and provided by default; dedicated is only for your organisation, configured by you, and costs extra. Ports: SLB 8081/8082, DLB 8091/8092.

### Q8. What is round robin?
Requests are distributed to servers in turn.

### Q9. What is auto-scaling?
A premium feature that adds or removes workers based on traffic. Without it, scaling is manual.

### Q10. Who decides worker count?
Architects, based on non-functional requirements and performance testing; cost (vCores) is also considered.

---

## 16. Must Remember

1. Local deployment isn't usable by others → deploy to environment servers.
2. **CloudHub** (MuleSoft both planes), **hybrid** (MuleSoft control, own runtime), **on-premises** (own both), **RTF** (containers on own infra).
3. **Control plane** = Runtime Manager, API Manager, Exchange; **runtime plane** = Mule runtime, connectors, logs.
4. Own cloud account + MuleSoft control plane = **hybrid**, not CloudHub.
5. Regulated industries (banks, healthcare) → hybrid/on-prem for data residency.
6. **Worker** = CloudHub mini server; trial = 1 worker.
7. Multiple workers + **load balancer** = **high availability** (not faster requests).
8. **Round robin** distribution; **SLB** (shared) vs **DLB** (dedicated, premium).
9. Ports: **SLB 8081/8082, DLB 8091/8092**.
10. **Scale up/down** in Runtime Manager; **auto-scaling** is premium; workers cost vCores.
