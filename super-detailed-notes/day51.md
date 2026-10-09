# Day 51 — JMS with ActiveMQ: Brokers, Queues vs. Topics, the JMS Connector, Acknowledgement Modes, and VM

> **Sources:**
> - Cleaned audio transcript ([transcripts-cleaned/day51.txt](../transcripts-cleaned/day51.txt)) and the class video (recorded 21 Jan 2025).
> - Text marked *screen* or *drawing* is read from the recording.
> - Slide images: [slides/day51](../slides/day51/).

## 1. Overview

1. **What is JMS** — a generic messaging concept; brokers on the market
2. The broker architecture — producer → queue/topic → consumer; **decoupling** and **asynchronous**
3. Real-time examples — Salesforce → SAP/DB/microservice, log streaming, orders to SAP
4. Message structure — **headers and body**
5. Design exercise — new employee to finance, payroll and marketing (three approaches)
6. **Queue vs. topic**
7. JMS **operations** — Publish, Consume, On New Message, Publish Consume, Ack
8. Installing and starting **ActiveMQ Classic**; the **web console** (admin/admin)
9. The **JMS connector** in Studio — config, libraries, broker URL
10. Demo — Publish to `q.test`; ActiveMQ auto-creates queues
11. The `read` and `write` functions
12. **On New Message** and the **acknowledgement modes** — AUTO, IMMEDIATE, DUPS_OK, MANUAL
13. **Consume**, **Publish Consume**, topics
14. **VM connector** vs. Anypoint MQ / ActiveMQ — intra-app vs. inter-app

---

## 2. What Is JMS?

- In regular integration projects the requirements are **REST, SOAP, database, JMS, Salesforce, AWS S3** — JMS is one of the most important.
- **JMS = Java Messaging Service** — communication between systems in a **message** format.
- A **generic concept** — like databases from many vendors (MySQL, Oracle, Microsoft).

*Drawing:* brokers — **RabbitMQ, Apache ActiveMQ, Apache Kafka, IBM MQ**; **Anypoint MQ** (licensed); benefits: **decoupling, asynchronous**.

| Broker | Note |
|---|---|
| **Apache ActiveMQ** | Open source (Apache Software Foundation), free — used for the demo |
| RabbitMQ, Kafka, IBM MQ | Licence-based (per the instructor) |
| **Anypoint MQ** | MuleSoft's own; paid separately even with a Mule licence; **cloud-only** — not practised |

- The terminology is the same across brokers — queue, topic, publisher, subscriber, producer, consumer, message.
- In the industry, ActiveMQ is used more than Anypoint MQ; it depends on the organization.

---

## 3. The Broker Architecture

*Drawing:* sender → JMS server / broker (ActiveMQ) with a queue or topic → receiver (subscriber/consumer); further processing handled by the receiver.

| Sends | Receives |
|---|---|
| Sender | Receiver |
| Producer | Consumer |
| Publisher | Subscriber |

- The producer **publishes/produces** a message into a **queue or topic** in the broker.
- The consumer **consumes** it and does the further business process.
- The broker is a **mediator** between applications.

**Key points:**

- Consumers **don't know** who sent the message — no connection between producer and consumer.
- A message isn't necessarily removed immediately — it's removed when **acknowledged**.
- Why not a database? There you'd delete records yourself; the JMS system handles removal automatically.

### 3.1 Decoupling and asynchronous

- **Decoupling** — process several applications/business processes **independently**.
- **Asynchronous** — the producer sends and **forgets**; whether it was processed isn't its concern.
- Synchronous would mean waiting for a response back through JMS.

---

## 4. Real-Time Examples

**Salesforce customer → SAP, DB, microservice:**

- A customer created in Salesforce is published to a **topic**.
- SAP, the database and a **microservice** (an API built in Java/Spring Boot) each consume it and create it in their own systems.
- Architects decide whether a requirement is synchronous or asynchronous.

**Log streaming:**

- CloudHub logs are limited (100–150 MB) or deleted within **30 days**.
- To keep them 1–2 years: send logs to **queues**; a system like the **ELK stack** (Elasticsearch, Kibana) consumes and stores them.

**Instructor's experience — Salesforce orders to SAP:**

- A new-object consumer in a Salesforce API publishes each new order to a **queue**.
- Another API consumes it and uses the **SAP connector** to create the order in SAP — in milliseconds.
- If SAP is **down**, the message stays in the broker; it's consumed when SAP is back.
- Messages are typically kept **7–10 days** before automatic deletion.

---

## 5. Message Structure

- Like an HTTP message, a JMS message has a structure: **headers** and **body**.
- Headers = information about the body (size, structure …).
- In Mule: JMS **headers → attributes**, **body → payload**.

---

## 6. Design Exercise — New Employee to Three Departments

*Drawing:* new employee published to a topic → finance, payroll, mailing systems each receive it.

The HR front end calls a Mule API; the employee must be saved in the HR database **and** sent to finance, payroll and marketing.

| Approach | Response time / trade-off |
|---|---|
| 1. Sequential calls to each system, then respond | Adds up — e.g. 200 + 400 + 300 + 250 ms ≈ 1150 ms |
| 2. **Scatter-Gather** (student's idea) | Parallel, but still waits |
| 3. Listener → DB insert → set response → **publish to a topic** | Response in ~200 ms; each department has its own consumer API |

- Approach 3: no dependency; if the publish fails, the record is in the DB and can be republished.
- Three approaches shown so you can discuss them with an architect.

**Q (student): could batch processing be used?**

- Batch suits **huge data** (e.g. many customers a day in e-commerce).
- New employees are a single record, few per day; the topic gives near **real-time** delivery to all three. Choose by size and requirement.

---

## 7. Queue vs. Topic

*Drawing:* Queue — pipeline of messages where the sender pushes and the receiver consumes; **one-to-one (point-to-point)**.

*Drawing:* Topic — **one-to-many**: one message delivered to receiver 1, 2, 3.

| | Queue | Topic |
|---|---|---|
| Communication | **Point-to-point** (one-to-one) | **One-to-many** |
| After a consumer receives | Message is deleted | Every subscriber gets the same message |
| Use when | One system sends to one system | Multiple consumers need the message |

- Queues (and their retention, FIFO/LIFO types) are created by the **ActiveMQ / JMS team**; we need only what each is and when to use it.

---

## 8. JMS Operations

*Drawing:* publish (to Q or T), consume (from Q or T), On New Message (listener, starts a flow), publish-consume (synchronous).

| Operation | Type | What it does |
|---|---|---|
| **Publish** | Processor | Sends a message to a queue/topic — **asynchronous** |
| **Consume** | Processor | Takes a message when the flow reaches it |
| **On New Message** | **Source** | Listener — triggers the flow as soon as a message arrives (like scheduler + consume; like Salesforce On New Object) |
| **Publish Consume** | Processor | Publishes and **waits** for the response — **synchronous** |
| **Ack** | Processor | Manually acknowledges a message |
| Recover Session | Processor | "Even I'm not aware of it" — not used |

- Publish Consume vs. Publish **appears in the certification**.
- In some Studio versions **On New Message** is named **Listener** — same thing (Studio 7.12 here).
- Dragging **Publish** or **Consume** into the source area doesn't work — they're processors.

*Drawing:* acknowledgement modes — AUTO, DUPS_OK, MANUAL, IMMEDIATE; JMS listener (On New Message), **DLQ** for failed messages.

- **Acknowledgement** = telling the broker "I have successfully processed it".

---

## 9. Installing and Starting ActiveMQ

*Screen:* activemq.apache.org — Download: **ActiveMQ Classic** / Artemis.

*Screen:* Classic release table — 6.1.x / 5.18.x stable, Java compatibility, JMS 1.1 / Jakarta JMS 2/3.

- Choose the version by your **Java** version:

| ActiveMQ | Java |
|---|---|
| 5.16.0 (instructor's older one, now discontinued) | 1.8 |
| **5.18.6** | 11 |
| 6.1.5 | 17 |

- **Instructor's suggestion:** next batch, go for Java 17 (long-term version) and the matching ActiveMQ.

*Screen:* ActiveMQ Classic 5.18.6 — Windows zip `apache-activemq-5.18.6-bin.zip`.

1. Extract the zip.
2. Open `bin` → **`win64`** (64-bit Windows).
3. Double-click **`activemq.bat`** — the server starts.

*Screen:* `activemq start` console — broker starting, **KahaDB**, transport connectors (**openwire 61616**, amqp 5672, stomp, mqtt, ws).

*Screen:* "Apache ActiveMQ 5.18.6 … started", Web console at **http://127.0.0.1:8161/**.

### 9.1 The web console

*Screen:* **http://localhost:8161** — sign in **admin / admin** (default).

- **Manage ActiveMQ broker** → the management console — like MySQL Workbench for a database.
- *Screen:* home — broker name localhost, version 5.18.6, uptime, store/memory usage.

*Screen:* Queues page; Topics page (ActiveMQ.Advisory topics — default, don't delete — and a user topic).

- Create a queue: type a name → **Create**. Same for topics.
- Class names: **`q.test`** (queue) and **`t.test`** (topic) — just a q/t prefix.

**Queue columns:**

| Column | Meaning |
|---|---|
| Number of Pending Messages | Waiting to be consumed |
| Number of Consumers | Connected consumers |
| Messages Enqueued | Messages that came in |
| Messages Dequeued | Messages processed/removed |

- Example: 10 enqueued, 5 dequeued → **5 pending**.

### 9.2 Sending from the console

*Screen:* Send a JMS Message — destination, Queue or Topic, correlation ID, persistent delivery, message body.

- **Send To** → message body `testMessage` → Send → **pending 1, enqueued 1, dequeued 0** (no consumer yet).

| Action | Effect |
|---|---|
| **Delete** | Deletes the queue |
| **Purge** | Deletes the messages |
| **Pause** | Pauses the queue |

---

## 10. The JMS Connector in Studio

*Screen:* Add Modules — searching Exchange for the JMS connector (Anypoint login).

- Not in the palette — **Add Modules → JMS**.
- Works the same for other brokers.

### 10.1 JMS Config

*Screen:* JMS Config — connection type **ActiveMQ Connection**; required libraries ActiveMQ client / broker / KahaDB (**Configure…**).

| Setting | Value |
|---|---|
| Connection | **ActiveMQ Connection** (a **Generic** connection exists for other brokers) |
| Libraries | **ActiveMQ client** — mandatory; broker and KahaDB — optional. Configure → **Add recommended libraries** (turns green; added to `pom.xml`) |
| Username / password | Broker credentials |
| Factory configuration → **Broker URL** | **`tcp://localhost:61616`** |

- Libraries are like the JDBC driver for a database.
- 61616 came from the openwire line in the startup console (also in the `conf` folder).
- **Ask the ActiveMQ team for:** broker URL, username/password, and the **queue and topic names** (they create them).
- **Instructor's experience:** mostly ActiveMQ, Apache Kafka and Confluent Kafka; never RabbitMQ or IBM MQ.

*Screen:* DZone article — MuleSoft integration with **RabbitMQ** uses an **AMQP connector**.

### 10.2 Publish operation

*Screen:* JMS **Publish** — destination, destination type **QUEUE**, message body `output json …`.

| Field | Value |
|---|---|
| Destination | `q.test` |
| Destination type | **Queue** (or Topic) |
| Message → body | A JSON message |
| User Properties | Optional headers/properties |
| Reconnection | Standard — 3 attempts, 2000–3000 ms (Publish) |

---

## 11. Demo — Publish to the Queue

- Listener path **`/publish`**, port 8081.

*Screen:* Postman → `localhost:8081/publish` — message published.

*Screen:* ActiveMQ console — `q.test` shows **1 pending message**.

**ActiveMQ auto-creates queues:**

- `q.test` had disappeared (restart); publishing **created it automatically**.
- ActiveMQ creates any queue name you publish to; **Anypoint MQ** gives **"destination not found"**.
- **Instructor's suggestion:** create configurations properly and use the exact queue name — be very careful.

**Q (student): On New Message should consume it automatically?**

- Another flow was consuming a different queue (`q.consumer`), not `q.test` — a mismatch to check.
- The payload after Publish is **not overwritten** — it stays the same.

---

## 12. `read` and `write`

- A consumed message arrived as a **String** (`typeOf(payload)` → String) whose content was JSON.
- **`read(payload, "application/json")`** converts a string/binary into its **underlying format**.
- If it already comes as JSON (`typeOf` → Object), `read` isn't needed.

*Playground demo (steps reconstructed from the class — the exact script wasn't captured):*

```dataweave
%dw 2.0
output application/json
var s = write({message: "hello"}, "application/json")   // object → String
---
read(s, "application/json").message                     // String → Object → field
```

- `write(…, "application/json")` turns an object into a **string**; `typeOf` → String; `.message` doesn't work on it.
- `read` turns it back into an **Object**; then `.message` works.
- **Use case:** a DB column accepts **text** — `write` the JSON to store it; when you select it back, `read` it.
- Works for XML too. Rare, but that's how read/write are used.

---

## 13. On New Message and Acknowledgement Modes

*Screen:* **On New Message** source listening on the queue.

| Setting | Value |
|---|---|
| Connector config | Same JMS_Config |
| Destination | The queue to consume |
| Consumer type | **Queue consumer** (or Topic consumer + topic name) |
| Reconnection | **Forever** (it's a source) |

- Without a breakpoint, a sent message was processed straight away.
- With a breakpoint, the counters didn't change until the flow finished — then **enqueued and dequeued** both updated.
- **Dequeue** = the message is removed from the queue; it can't be consumed again.

*Screen:* Acknowledgement mode dropdown — **AUTO, MANUAL, IMMEDIATE, DUPS_OK**.

| Mode | When the message is acknowledged (dequeued) |
|---|---|
| **AUTO** (default) | When the **whole flow succeeds** |
| **IMMEDIATE** | As soon as it's received — whether processed or not |
| **DUPS_OK** | Like AUTO, but **duplicates possible** — not for orders; only when duplicates are OK |
| **MANUAL** | When you run the **Ack** operation |

- Most used: **AUTO** and **MANUAL**. With IMMEDIATE you can't tell if it was processed.

### 13.1 Manual acknowledgement

*Screen:* the **Ack** operation in the flow; the message stays pending until it runs.

- Each message has an acknowledgement ID: **`attributes.ackId`**.
- Ack operation → acknowledgement ID `#[attributes.ackId]`.
- Use for long processes — acknowledge only near the end.

---

## 14. Consume, Publish Consume, Topics

**Consume:**

- Consumes only when the flow is triggered (On New Message is listener + consume).
- Published JSON (employee ID, name, designation) stayed **pending** until Consume ran.
- Consume's acknowledgement here was **immediate** — dequeued at once; set MANUAL if needed.

**Publish Consume:**

*Screen:* Postman `/publishConsume` → `{"message": "message published successfully"}` — waits for the reply.

- Try it yourself — give the destination etc.

**Topics:** same steps — create the topic; Publish with destination type **Topic**; On New Message with **Topic consumer**.

---

## 15. VM Connector vs. Anypoint MQ / ActiveMQ

- **Anypoint MQ:** MuleSoft's queuing, extra licence, **cloud-based deployments only** — on-premises can't use it.
- **VM connector** (Add Modules → VM): Consume, Publish, Publish Consume, **Listener** (same as On New Message).

| | VM | Anypoint MQ / ActiveMQ |
|---|---|---|
| Scope | **Intra-app** — within the same application | **Inter-app** — between applications (or within one) |
| App 1 publishes, app 2 consumes? | **No** | Yes — a fully-fledged broker |

- Use VM for asynchronous communication **within** one application.
- **Instructor:** "In CloudHub 2.0 I think they're discontinuing it, but in CloudHub 1.0 it's there."
- Learning JMS gives you VM too — same operations.

---

## 16. Important Terminology

| Term | Meaning |
|---|---|
| JMS | Java Messaging Service — message-based communication |
| Broker | Server holding queues/topics (ActiveMQ, RabbitMQ, Kafka, IBM MQ, Anypoint MQ) |
| Producer / publisher / sender | Sends messages |
| Consumer / subscriber / receiver | Receives messages |
| Queue | Point-to-point destination; a message goes to one consumer |
| Topic | One-to-many destination |
| Decoupling | Producer and consumer have no direct connection |
| Enqueued / dequeued / pending | Messages in / removed / waiting |
| Purge | Delete all messages in a queue |
| Broker URL | e.g. `tcp://localhost:61616` (openwire) |
| On New Message | JMS listener source |
| Publish Consume | Synchronous publish that waits for a reply |
| Acknowledgement | Confirming a message was processed so it's dequeued |
| `attributes.ackId` | The message's acknowledgement ID for manual Ack |
| DLQ | Dead-letter queue for failed messages |
| `read` / `write` | DataWeave: string/binary → structured, and structured → string |
| VM connector | In-app queues (intra-app) |

---

## 17. Interview Questions

### Q1. Queue vs. topic?
A queue is point-to-point — each message is consumed by one consumer and then removed. A topic is one-to-many — every subscriber gets the same message.

### Q2. Publish vs. Publish Consume?
Publish is asynchronous — send and move on. Publish Consume is synchronous — it publishes and waits for the reply.

### Q3. Consume vs. On New Message?
Consume is a processor that takes a message when the flow reaches it. On New Message is a source (listener) that triggers the flow as soon as a message arrives.

### Q4. What are the JMS acknowledgement modes?
AUTO (default — ack when the flow succeeds), IMMEDIATE (ack on receipt), DUPS_OK (like auto but duplicates possible), MANUAL (ack with the Ack operation using `attributes.ackId`). AUTO and MANUAL are most used.

### Q5. Why use JMS?
To decouple systems and communicate asynchronously — the producer doesn't wait, consumers process independently, and messages survive while a downstream system is down.

### Q6. VM vs. JMS / Anypoint MQ?
VM queues work only within one application (intra-app). JMS brokers and Anypoint MQ work between applications (inter-app).

### Q7. What do you need from the messaging team?
Broker URL, username and password, and the queue/topic names.

### Q8. A consumed message is a String containing JSON — what do you do?
`read(payload, "application/json")`.

### Q9. What happens in ActiveMQ if you publish to a queue that doesn't exist?
ActiveMQ creates it automatically (Anypoint MQ returns "destination not found").

---

## 18. Must Remember

1. JMS = **Java Messaging Service**; a generic concept with many brokers.
2. **ActiveMQ** is open source; **Anypoint MQ** is licensed and cloud-only.
3. Benefits: **decoupling** and **asynchronous**.
4. **Queue** = point-to-point; **topic** = one-to-many.
5. Headers → **attributes**, body → **payload**.
6. Operations: Publish (async), Consume, **On New Message** (source), Publish Consume (sync), Ack.
7. ActiveMQ 5.18.6: `bin/win64/activemq.bat`; console **localhost:8161**, **admin/admin**; broker **tcp://localhost:61616**.
8. Add the **ActiveMQ client** library to the JMS config.
9. ActiveMQ **auto-creates** queues on publish — use exact names.
10. Ack modes: **AUTO** (default), IMMEDIATE, DUPS_OK, **MANUAL** (`attributes.ackId`).
11. `read()` string → structured; `write()` structured → string.
12. **VM** = intra-app; JMS/Anypoint MQ = inter-app.
