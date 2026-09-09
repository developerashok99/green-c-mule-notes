# Day 18 — Detailed Notes: CloudHub Deep Dive — Worker, vCore, Horizontal/Vertical Scaling

> **Watch alongside:** this session pairs theory with a genuinely messy, real, unresolved-within-the-session bug (a payload arriving in binary format after a runtime version jump) — worth watching specifically to see what real troubleshooting looks like, not just the clean end-state.

---

## 1. CloudHub = Integration Platform as a Service

```mermaid
flowchart LR
    AWS["Raw AWS/Azure Cloud<br/>(NOT Mule-ready by itself)"] -->|"MuleSoft pre-configures it:<br/>Java, Maven, Mule Runtime,<br/>networking, all pre-installed"| CloudHub["CloudHub<br/>(Mule-ready environment)"]
    CloudHub --> Worker["Your app deploys to a Worker<br/>(a mini-server inside CloudHub)"]
```

You can't deploy a Mule app directly to raw AWS — MuleSoft's entire value-add is doing that preparation work for you, so deployment is just "log in and upload a JAR."

---

## 2. Worker and vCore — The Actual Units

```mermaid
flowchart LR
    App[Your Application] -->|"deploys to exactly ONE"| Worker["Worker<br/>(1 worker = 1 app, hard rule)"]
    Worker --> Size{"vCore size"}
    Size -->|0.1| M1["500 MB (default, sufficient<br/>for most applications)"]
    Size -->|0.2| M2["1 GB"]
    Size -->|1.0| M3["1.5 GB"]
```

**The phone-memory analogy for why sizing matters**: 2GB of phone memory handles 10-15 apps fine; 25-30 apps causes lag/failure. An under-provisioned worker behaves the same way under real request load — not a slowdown, a crash.

**Real cost anchor**: enterprise vCore licensing runs roughly $25,000/vCore over 2-3 years, with a realistic minimum around ₹70-80 lakhs — explicitly framed as enterprise-scale pricing, not something small organizations take on lightly.

---

## 3. Horizontal vs. Vertical Scaling — Fully Distinguished

```mermaid
flowchart TB
    Q{"What changed?"}
    Q -->|"MORE requests,<br/>SAME payload size"| H["Horizontal Scaling<br/>→ ADD MORE WORKERS"]
    Q -->|"SAME request volume,<br/>BIGGER payload size"| V["Vertical Scaling<br/>→ INCREASE vCore SIZE"]
```

### Horizontal — Worked Example With Real Numbers
```mermaid
flowchart LR
    Normal["1 lakh req/day<br/>÷ 3 workers × 40k capacity each<br/>= 120k total capacity"] -->|"Festive sale:<br/>3 lakh req/day"| Crash["❌ Exceeds 120k capacity — CRASH"]
    Crash --> Fix["✅ Fix: ADD more workers<br/>(proactively, before the sale)"]
```
Real ceiling: max 8 workers per application in practice — going beyond that is described as genuinely rare.

### Vertical — Worked Example, With a Critical Uniformity Rule
```mermaid
flowchart LR
    Payload["200KB payload,<br/>fine on 0.1 vCore"] -->|"Business change:<br/>payload grows ~10x"| OOM["❌ Out of memory on 0.1 vCore"]
    OOM --> Fix2["✅ Fix: increase vCore<br/>(e.g. to 0.2) — for ALL workers"]
```

**A critical, proven-live constraint**: vCore size cannot be mixed across an application's own worker pool — *"if you give 0.2, you have to apply it to ALL of them."* Since Round Robin distributes requests indiscriminately across all workers, every worker must handle the full expected payload range uniformly, or some requests will randomly fail depending on which worker they land on.

---

## 4. A Real, Live, Unresolved Bug — Worth Studying As-Is

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant App as App built on Runtime 4.4.0
    participant CH as CloudHub 2.0, deployed on Runtime 4.8.1

    Dev->>CH: Deploy old app to newer runtime
    CH->>CH: payload.city fails to evaluate
    Note over CH: Payload arriving in unexpected BINARY format
    Dev->>Dev: "Maybe payload.message.city?"<br/>"I haven't migrated to 2.0 before"
    Note over Dev: Investigation continues into Day 19
```

This bug is genuinely **not resolved within this session** — and that's presented as valuable precisely because it's authentic. The direct lesson drawn from it: *"it's always a good practice — first develop and test locally... after going [to a shared environment], the application will be deployed for 15-20 minutes, and it will fail — double time will be wasted."* (Day 19 resolves it: an outdated HTTP connector dependency version needed upgrading via `pom.xml`.)

---

## 5. CloudHub 1.0 vs. 2.0 — Terminology Map

| Concept | 1.0 | 2.0 |
|---|---|---|
| Compute unit | Worker | **Replica** |
| Sizing unit | vCore | **Replica Size** |
| Isolation | (implicit) | **Shared Space** vs. **Private Space** (hotel room analogy: shared room vs. dedicated room) |
| Fractional sizing | 0.1 minimum | Smaller fractions (e.g. 0.05) with *more* memory per fraction than 1.0's equivalent |

---

## 6. Logs and Correlation ID

```mermaid
flowchart LR
    Logs["Runtime Manager → App → Logs"] --> Filter["Filter by time range"]
    Logs --> CorrID["Filter/search by Correlation ID<br/>(a unique per-request tracking ID<br/>sent in headers)"]
    CorrID --> Trace["Isolate ALL log lines belonging<br/>to ONE specific request,<br/>even amid many concurrent requests"]
```

Log retention on trial/default tiers: 30 days OR 100MB, whichever comes first — real organizations needing longer retention typically add a separate dedicated logging system.

---

## Quick Recap
- **Worker = 1 mini-server, exactly 1 app** (hard rule). **vCore = the memory/sizing unit** — 0.1 (500MB) handles most real applications.
- **Horizontal scaling (more workers)** = more requests, same size. **Vertical scaling (bigger vCore)** = same volume, bigger payloads — and vCore size must be uniform across all of an app's workers.
- **A real, unresolved version-compatibility bug was demonstrated live** — reinforcing "always test locally before deploying to a shared/higher environment."
- **CloudHub 2.0 renames Worker→Replica, vCore→Replica Size**, with generally better fractional sizing.
- **Correlation IDs are the real tool for isolating one request's logs** in a busy, concurrent log stream.
