# Day 51 — Slides and On-Screen Drawings

Screens and drawings from the Day 51 class (21 Jan 2025): JMS concepts (broker, queue vs topic, operations, acknowledgement modes), installing and running ActiveMQ Classic with its web console, then the JMS connector in Mule — Publish, On New Message, manual Ack and publish-consume. Repeated and blank frames have been removed. Times are positions in the video.

Notes for this day: [detailed-notes/day51.md](../../detailed-notes/day51.md) · [super-detailed-notes/day51.md](../../super-detailed-notes/day51.md) · [summary](../../day51.md)

| # | Time | Content |
|---|---|---|
| 01 | 13:14 | *Drawing:* sender → JMS server / broker (ActiveMQ) with a queue or topic → receiver (subscriber/consumer); further processing handled by the receiver |
| 02 | 13:23 | *Drawing:* JMS = Java Messaging Service; brokers — RabbitMQ, Apache ActiveMQ, Apache Kafka, IBM MQ; Anypoint MQ (licensed); benefits: decoupling, asynchronous |
| 03 | 36:04 | *Drawing:* new employee published to a topic → finance, payroll, mailing systems each receive it |
| 04 | 36:12 | *Drawing:* Queue — pipeline of messages where the sender pushes and the receiver consumes; one-to-one (point-to-point) |
| 05 | 38:09 | *Drawing:* Topic — one-to-many: one message delivered to receiver 1, 2, 3 |
| 06 | 39:09 | *Drawing:* JMS operations — publish (to Q or T), consume (from Q or T), On New Message (listener, starts a flow), publish-consume (synchronous) |
| 07 | 42:44 | *Drawing:* order app → queue → delivery and inventory systems — decoupled, asynchronous processing |
| 08 | 42:46 | *Drawing:* New Emp → topic → finance/payroll, HR, operations; to do: download and install ActiveMQ, JMS operations |
| 09 | 44:24 | *Drawing:* acknowledgement modes — AUTO, DUPS_OK, MANUAL, IMMEDIATE; JMS listener (On New Message), DLQ for failed messages |
| 10 | 45:23 | activemq.apache.org — Download: ActiveMQ Classic / Artemis |
| 11 | 45:41 | ActiveMQ Classic release table — 6.1.x / 5.18.x stable, Java compatibility, JMS 1.1 / Jakarta JMS 2/3 |
| 12 | 45:56 | ActiveMQ Classic 5.18.6 — Windows zip (apache-activemq-5.18.6-bin.zip) |
| 13 | 48:15 | Extracted folder apache-activemq-5.18.6 → binwin64 → activemq.bat / wrapper.exe |
| 14 | 48:27 | `activemq start` console — broker starting, KahaDB, transport connectors (openwire 61616, amqp 5672, stomp, mqtt, ws) |
| 15 | 50:44 | Console: "Apache ActiveMQ 5.18.6 … started", Web console at http://127.0.0.1:8161/ |
| 16 | 51:56 | ActiveMQ web console http://localhost:8161 — sign in admin / admin |
| 17 | 52:33 | ActiveMQ console home — broker name localhost, version 5.18.6, uptime, store/memory usage |
| 18 | 52:59 | Queues page — create a queue (name), list with pending / consumers / enqueued / dequeued |
| 19 | 53:11 | Topics page — ActiveMQ.Advisory topics and a user topic |
| 20 | 55:40 | Send a JMS Message form — destination, Queue or Topic, correlation ID, persistent delivery, message body |
| 21 | 60:07 | Studio: Add Modules — searching Exchange for the JMS connector (Anypoint login) |
| 22 | 65:58 | JMS **Publish** operation: destination, destination type QUEUE, message body `output json …` |
| 23 | 66:57 | JMS Config — connection type **ActiveMQ Connection**; required libraries ActiveMQ client / broker / KahaDB (Configure…) |
| 24 | 69:13 | DZone article — MuleSoft Integration With RabbitMQ (AMQP connector) for comparison |
| 25 | 73:12 | JMS Config: username/password, broker URL tcp://localhost:61616, factory configuration |
| 26 | 80:39 | Postman → localhost:8081/publish — message published to the queue |
| 27 | 81:07 | ActiveMQ console: queue shows 1 pending message |
| 28 | 97:33 | **On New Message** source listening on the queue — the published message triggers the flow |
| 29 | 105:47 | On New Message → Acknowledgement mode dropdown: AUTO, MANUAL, IMMEDIATE, DUPS_OK |
| 30 | 112:42 | Manual acknowledgement — the **Ack** operation in the flow; message stays pending until it runs |
| 31 | 115:36 | Postman `/publishConsume` → `{"message": "message published successfully"}` — publish-consume waits for the reply |

---

### 01 — *Drawing:* sender → JMS server / broker (ActiveMQ) with a queue or topic → receiver (subscriber/consumer); further processing handled by the receiver
![drawing-jms-overview](01-drawing-jms-overview.jpg)

### 02 — *Drawing:* JMS = Java Messaging Service; brokers — RabbitMQ, Apache ActiveMQ, Apache Kafka, IBM MQ; Anypoint MQ (licensed); benefits: decoupling, asynchronous
![drawing-jms-providers](02-drawing-jms-providers.jpg)

### 03 — *Drawing:* new employee published to a topic → finance, payroll, mailing systems each receive it
![drawing-topic-fanout](03-drawing-topic-fanout.jpg)

### 04 — *Drawing:* Queue — pipeline of messages where the sender pushes and the receiver consumes; one-to-one (point-to-point)
![drawing-queue](04-drawing-queue.jpg)

### 05 — *Drawing:* Topic — one-to-many: one message delivered to receiver 1, 2, 3
![drawing-topic](05-drawing-topic.jpg)

### 06 — *Drawing:* JMS operations — publish (to Q or T), consume (from Q or T), On New Message (listener, starts a flow), publish-consume (synchronous)
![drawing-operations](06-drawing-operations.jpg)

### 07 — *Drawing:* order app → queue → delivery and inventory systems — decoupled, asynchronous processing
![drawing-decoupling](07-drawing-decoupling.jpg)

### 08 — *Drawing:* New Emp → topic → finance/payroll, HR, operations; to do: download and install ActiveMQ, JMS operations
![drawing-new-emp-topic](08-drawing-new-emp-topic.jpg)

### 09 — *Drawing:* acknowledgement modes — AUTO, DUPS_OK, MANUAL, IMMEDIATE; JMS listener (On New Message), DLQ for failed messages
![drawing-ack-modes](09-drawing-ack-modes.jpg)

### 10 — activemq.apache.org — Download: ActiveMQ Classic / Artemis
![activemq-download](10-activemq-download.jpg)

### 11 — ActiveMQ Classic release table — 6.1.x / 5.18.x stable, Java compatibility, JMS 1.1 / Jakarta JMS 2/3
![activemq-versions](11-activemq-versions.jpg)

### 12 — ActiveMQ Classic 5.18.6 — Windows zip (apache-activemq-5.18.6-bin.zip)
![activemq-518-download](12-activemq-518-download.jpg)

### 13 — Extracted folder apache-activemq-5.18.6 → binwin64 → activemq.bat / wrapper.exe
![activemq-bin](13-activemq-bin.jpg)

### 14 — `activemq start` console — broker starting, KahaDB, transport connectors (openwire 61616, amqp 5672, stomp, mqtt, ws)
![activemq-start](14-activemq-start.jpg)

### 15 — Console: "Apache ActiveMQ 5.18.6 … started", Web console at http://127.0.0.1:8161/
![activemq-started](15-activemq-started.jpg)

### 16 — ActiveMQ web console http://localhost:8161 — sign in admin / admin
![web-console-login](16-web-console-login.jpg)

### 17 — ActiveMQ console home — broker name localhost, version 5.18.6, uptime, store/memory usage
![web-console-home](17-web-console-home.jpg)

### 18 — Queues page — create a queue (name), list with pending / consumers / enqueued / dequeued
![queues-page](18-queues-page.jpg)

### 19 — Topics page — ActiveMQ.Advisory topics and a user topic
![topics-page](19-topics-page.jpg)

### 20 — Send a JMS Message form — destination, Queue or Topic, correlation ID, persistent delivery, message body
![send-jms-message](20-send-jms-message.jpg)

### 21 — Studio: Add Modules — searching Exchange for the JMS connector (Anypoint login)
![add-jms-module](21-add-jms-module.jpg)

### 22 — JMS **Publish** operation: destination, destination type QUEUE, message body `output json …`
![jms-publish-config](22-jms-publish-config.jpg)

### 23 — JMS Config — connection type **ActiveMQ Connection**; required libraries ActiveMQ client / broker / KahaDB (Configure…)
![jms-config](23-jms-config.jpg)

### 24 — DZone article — MuleSoft Integration With RabbitMQ (AMQP connector) for comparison
![dzone-rabbitmq](24-dzone-rabbitmq.jpg)

### 25 — JMS Config: username/password, broker URL tcp://localhost:61616, factory configuration
![jms-config-broker-url](25-jms-config-broker-url.jpg)

### 26 — Postman → localhost:8081/publish — message published to the queue
![postman-publish](26-postman-publish.jpg)

### 27 — ActiveMQ console: queue shows 1 pending message
![queue-pending](27-queue-pending.jpg)

### 28 — **On New Message** source listening on the queue — the published message triggers the flow
![on-new-message](28-on-new-message.jpg)

### 29 — On New Message → Acknowledgement mode dropdown: AUTO, MANUAL, IMMEDIATE, DUPS_OK
![ack-mode-dropdown](29-ack-mode-dropdown.jpg)

### 30 — Manual acknowledgement — the **Ack** operation in the flow; message stays pending until it runs
![manual-ack](30-manual-ack.jpg)

### 31 — Postman `/publishConsume` → `{"message": "message published successfully"}` — publish-consume waits for the reply
![publish-consume](31-publish-consume.jpg)

