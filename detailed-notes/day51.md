# Day 51 — Detailed Notes: JMS with ActiveMQ — Queues, Topics, Operations, Acknowledgement Modes and VM

> **Watch alongside:**
> - The first hour is concepts and drawings (broker, queue vs. topic, decoupling, the new-employee design exercise); the second half is ActiveMQ installation and the JMS connector.
> - The thing to watch in the demo is the ActiveMQ console counters — pending, enqueued, dequeued — changing (or not) as the acknowledgement mode changes.

> **Video-verified:** written from the cleaned transcript and the class recording (21 Jan 2025). Slide images: [slides/day51](../slides/day51/) — e.g. [overview drawing](../slides/day51/01-drawing-jms-overview.jpg), [operations](../slides/day51/06-drawing-operations.jpg), [web console](../slides/day51/16-web-console-login.jpg), [JMS config](../slides/day51/25-jms-config-broker-url.jpg), [ack modes](../slides/day51/29-ack-mode-dropdown.jpg), [manual ack](../slides/day51/30-manual-ack.jpg).

---

## 1. The Broker Model

```mermaid
flowchart LR
    P["Producer / publisher / sender"] -->|"publish"| B["JMS broker (ActiveMQ)<br/>queue or topic"]
    B -->|"consume"| C["Consumer / subscriber / receiver<br/>further processing"]
```

- **JMS = Java Messaging Service**; brokers: RabbitMQ, **ActiveMQ** (open source), Kafka, IBM MQ, Anypoint MQ (licensed, cloud-only).
- **Decoupled** (no producer–consumer connection) and **asynchronous** (producer sends and forgets).
- Message = **headers + body** → in Mule, **attributes + payload**.
- Examples: Salesforce customer → SAP/DB/microservice; logs → queue → ELK; orders → queue → SAP (message waits if SAP is down; kept ~7–10 days).

---

## 2. Queue vs. Topic

```mermaid
flowchart TB
    subgraph Q["Queue — point-to-point"]
        S1["Sender"] --> QQ["queue"] --> R1["One receiver<br/>(message then deleted)"]
    end
    subgraph T["Topic — one-to-many"]
        S2["Sender"] --> TT["topic"]
        TT --> RA["Receiver 1"]
        TT --> RB["Receiver 2"]
        TT --> RC["Receiver 3"]
    end
```

---

## 3. Design Exercise — New Employee

```mermaid
flowchart LR
    HR["HR front end"] --> L["Listener"] --> DB[("HR DB")] --> Resp["Set response (~200 ms)"]
    Resp --> Pub["Publish to topic"]
    Pub --> F["Finance API"]
    Pub --> Py["Payroll API"]
    Pub --> Mk["Marketing API"]
```

| Approach | Note |
|---|---|
| Sequential calls | ~1150 ms total |
| Scatter-Gather | Parallel, still waits |
| **Publish to topic** | Fast response, no dependency, republish from DB if it fails |

- Batch processing is for **huge** volumes; one new employee is a single record — the topic gives near real-time delivery.

---

## 4. JMS Operations and Ack Modes

```mermaid
flowchart TB
    Ops["JMS connector"] --> Pub["Publish — async"]
    Ops --> Con["Consume — when the flow reaches it"]
    Ops --> ONM["On New Message — SOURCE (listener)"]
    Ops --> PC["Publish Consume — sync, waits for reply"]
    Ops --> Ack["Ack — manual acknowledgement"]
    ONM --> Modes["Ack modes"]
    Modes --> A1["AUTO (default): flow succeeds"]
    Modes --> A2["IMMEDIATE: on receipt"]
    Modes --> A3["DUPS_OK: like auto, duplicates possible"]
    Modes --> A4["MANUAL: Ack with attributes.ackId"]
```

- Most used: **AUTO** and **MANUAL**. Publish vs. Publish Consume is a certification topic.
- *Drawing:* failed messages can go to a **DLQ**.

---

## 5. ActiveMQ Setup

```mermaid
flowchart LR
    D["Download ActiveMQ Classic 5.18.6<br/>(Java 11; 5.16 = Java 1.8; 6.1.5 = Java 17)"] --> X["Extract → bin → win64"]
    X --> Bat["activemq.bat → broker starts<br/>openwire 61616"]
    Bat --> Web["Web console localhost:8161<br/>admin / admin"]
    Web --> QT["Create q.test / t.test<br/>pending · consumers · enqueued · dequeued"]
```

- Console actions: **Send To** (test message), **Delete** (queue), **Purge** (messages), **Pause**.

---

## 6. The JMS Connector

| Item | Value |
|---|---|
| Module | Add Modules → **JMS** |
| Connection | **ActiveMQ Connection** (Generic for other brokers) |
| Libraries | **ActiveMQ client** (mandatory); broker, KahaDB optional |
| Broker URL | `tcp://localhost:61616` |
| Publish | Destination `q.test`, type Queue, JSON body |
| On New Message | Queue consumer, reconnection **forever** |

```mermaid
sequenceDiagram
    participant PM as Postman
    participant App as Mule app
    participant AMQ as ActiveMQ q.test
    PM->>App: GET /publish
    App->>AMQ: Publish (async)
    Note over AMQ: pending 1 · enqueued 1
    AMQ->>App: On New Message (AUTO)
    App->>App: flow runs (breakpoint holds it)
    App-->>AMQ: ack when flow completes
    Note over AMQ: dequeued 1
```

- ActiveMQ **auto-creates** a queue you publish to; Anypoint MQ says "destination not found".
- Ask the messaging team for broker URL, credentials, queue/topic names.
- A string payload holding JSON → `read(payload, "application/json")`; `write` does the reverse (e.g. JSON into a text DB column).

---

## 7. VM vs. Brokers

```mermaid
flowchart LR
    subgraph App1["Application 1"]
        F1["Flow A"] -->|"VM publish"| VMQ["VM queue"] -->|"VM listener"| F2["Flow B"]
    end
    App1 -->|"JMS / Anypoint MQ"| Br["Broker"] --> App2["Application 2"]
```

- **VM** = intra-app only; JMS brokers / Anypoint MQ = inter-app.

---

## Quick Recap
- **JMS** decouples systems with asynchronous messages through a broker; ActiveMQ is the free one used in class.
- **Queue** = one consumer; **topic** = every subscriber.
- Operations: **Publish** (async), **Consume**, **On New Message** (source), **Publish Consume** (sync), **Ack**.
- Ack modes: **AUTO** (default), **IMMEDIATE**, **DUPS_OK**, **MANUAL** (`attributes.ackId`).
- ActiveMQ 5.18.6: console `localhost:8161` (admin/admin), broker `tcp://localhost:61616`, ActiveMQ client library.
- ActiveMQ auto-creates queues — use exact names.
- `read`/`write` convert between strings and structured data.
- **VM** connector = same operations, within one application only.
