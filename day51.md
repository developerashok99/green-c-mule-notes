# Day 51 — JMS with ActiveMQ: Queues, Topics, the JMS Connector and Acknowledgement Modes

## Session Agenda
- What **JMS** is; brokers; decoupling and asynchronous communication
- **Queue vs. topic**
- Design exercise — new employee to three departments
- JMS **operations**
- Installing **ActiveMQ** and its web console
- JMS connector demo — Publish, On New Message, **acknowledgement modes**, Consume
- `read` / `write`; **VM** vs. brokers

## JMS Concepts
- JMS = **Java Messaging Service** — message-based communication through a **broker**.
- Brokers: **ActiveMQ** (open source), RabbitMQ, Kafka, IBM MQ, **Anypoint MQ** (licensed, cloud-only).
- Producer → queue/topic → consumer; they don't know each other — **decoupled** and **asynchronous**.
- Message = headers + body → attributes + payload in Mule.
- Examples: Salesforce → SAP/DB/microservice; logs → queue → ELK; orders → queue → SAP.

## Queue vs. Topic
- **Queue** — point-to-point; one consumer, then the message is removed.
- **Topic** — one-to-many; every subscriber gets it.
- New-employee design: DB insert → respond → publish to a topic for finance, payroll, marketing.

## Operations and Ack Modes
- **Publish** (async), **Consume**, **On New Message** (source/listener), **Publish Consume** (sync), **Ack**.
- Ack modes: **AUTO** (default, after the flow succeeds), **IMMEDIATE**, **DUPS_OK** (duplicates possible), **MANUAL** (Ack with `attributes.ackId`).

## ActiveMQ Demo
- ActiveMQ Classic **5.18.6** (Java 11) → `bin/win64/activemq.bat`.
- Web console **localhost:8161**, **admin/admin**; queue `q.test`, topic `t.test`; pending/enqueued/dequeued counters.
- JMS Config: ActiveMQ Connection, **ActiveMQ client** library, broker URL **`tcp://localhost:61616`**.
- ActiveMQ auto-creates queues on publish; Anypoint MQ gives "destination not found".
- String payload with JSON → `read(payload, "application/json")`; `write` converts the other way.

## VM Connector
- Same operations (Publish, Consume, Publish Consume, Listener).
- **Intra-app** only; JMS brokers and Anypoint MQ are **inter-app**.

## Quick Recap
- JMS decouples systems asynchronously.
- Queue = one consumer; topic = many.
- AUTO and MANUAL are the most used ack modes.
- VM for within-app queues.
