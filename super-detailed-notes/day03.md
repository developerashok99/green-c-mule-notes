# Day 03 — APIs, Web Services, REST vs. SOAP, Caching and Real-Time Environments

## 1. Overview

Prerequisite topics start from this session.

1. What is an API (definition, restaurant analogy, bank balance example)
2. Why one API can serve many front-ends (Android, iOS, web)
3. API vs. web service
4. Data formats used with APIs (JSON vs. XML size comparison)
5. Caching (student question, worked example)
6. REST — definition and characteristics
7. API lifecycle and design (first look)
8. SOAP — definition, WSDL, characteristics
9. REST vs. SOAP — comparison and when to use which
10. Real-time environments: Dev, SIT/QA, UAT, performance/pre-prod, Prod, DR

---

## 2. Integration and API — Recap

**Integration** is any program, software or tool that connects two or more applications.

Examples:

- Take data from Salesforce, apply small transformations, and insert it into a database — integration.
- Receive a request from another system, process it, and send a response — also integration.

An **API is a type of integration** — a part of integration. Almost all work in MuleSoft is building **REST APIs**, so it is important to understand clearly what an API is.

---

## 3. What Is an API?

### 3.1 Definition

**API = Application Programming Interface.**

> An API is a piece of code that helps two or more different systems communicate and exchange data with each other.

### 3.2 Where is the code in MuleSoft?

In MuleSoft you mostly drag and drop components. Behind the scenes, Anypoint Studio **generates XML code** automatically. Because you write very little code by hand, MuleSoft is called a **low-code tool**.

### 3.3 API as a layer

```text
Mobile application  ──►  API  ──►  Database
(front-end)          ◄──      ◄──  (back-end)
```

The two systems use different technologies and data formats ("they don't understand each other's language"), so the API sits in the middle and:

1. establishes communication between them, and
2. exchanges data between them, converting formats as needed.

---

## 4. Generic Example — The Restaurant

### 4.1 Scenario

1. A customer enters a restaurant and sits at a table.
2. The **waiter** brings the menu.
3. The customer selects items and gives the order to the waiter.
4. The waiter takes the order to the **kitchen / chef**.
5. The chef prepares the food and calls the waiter.
6. The waiter takes the prepared food and serves it at the table.

### 4.2 Mapping

| Restaurant | Software |
|---|---|
| Customer | Front-end (mobile app, website) |
| Kitchen / chef | Back-end (database, systems) |
| Waiter | **API** — the mediator between the two |
| Order | Request |
| Served food | Response |

The customer never goes into the kitchen; the kitchen never comes to the table. All communication goes through the waiter.

---

## 5. Technical Example — Bank Balance Check

### 5.1 Request flow

1. The customer taps **Check Balance** in the mobile app.
2. A request goes to the API, for example in JSON:

```json
{
  "accountNumber": "12345",
  "requestType": "balanceCheck"
}
```

3. The API builds and sends a query to the database. The instructor's illustrative query:

```sql
SELECT account_balance
FROM balance_check
WHERE account_number = 1234;
```

4. The database returns the balance (e.g. 50,000).
5. The API converts the result into **JSON** and returns it.
6. The mobile app shows the balance properly.

### 5.2 One API, many front-ends

The same balance request can come from:

- an **Android** mobile app,
- an **iOS** app,
- **net banking** in a Chrome browser on a desktop or laptop.

These front-ends are built with different languages and technologies. The **same single API** serves all of them.

```text
Android app ─┐
iOS app ─────┼──►  Balance Check API  ──►  Database
Net banking ─┘
```

Without the API, each front-end would need its own separate way of talking to the database — one for Android, one for iOS, one for web. The API is **language independent**: it accepts a request in its defined format, processes it and returns a response, regardless of which client called it.

---

## 6. API vs. Web Service

### 6.1 The instructor's rule

> **All web services are APIs, but not all APIs are web services.**

- If an API communicates over the **internet**, it is called a **web service**.
- If it communicates over a **private / internal enterprise network**, the instructor calls it just an **API**.

### 6.2 The vehicle analogy

To travel somewhere you need a medium — bike, car, bus, train or flight. An API also needs a medium to carry requests and responses: the **network**.

```text
API + internet network          → web service
API + private/enterprise network → API (not a web service, per the lecture)
```

> **Technical clarification:** The commonly used definition is that a *web service* is an API that is accessed over a network using web protocols (HTTP, SOAP, etc.). Web services can also run inside private networks. Many APIs are not web services at all — for example, a library's programming interface or an operating-system API, which are called within the same program/machine. The statement "all web services are APIs, but not all APIs are web services" is correct; the internet-vs-private-network split is the instructor's simplified way to explain it.

---

## 7. Data Formats Used With APIs

### 7.1 Student question: what about JSON, XML and CSV?

- **REST** can accept and return **JSON, XML, HTML and plain text**, among others.
- **CSV and Excel** files are usually found on **FTP/SFTP servers** and are used in **scheduled/batch integrations**, not in normal API request/response bodies.
- **Instructor's experience:** they have rarely used CSV/XML in API work and never used Excel in real time. **JSON is the most widely used**, so the course focuses on it.

### 7.2 Why JSON is lighter than XML

Same data in JSON:

```json
{
  "accountNumber": "12345",
  "requestType": "balanceCheck"
}
```

Same data in XML — every value needs an opening and a closing tag:

```xml
<request>
  <accountNumber>12345</accountNumber>
  <requestType>balanceCheck</requestType>
</request>
```

**Instructor's analogy:** a document with 1 lakh words is larger than one with 10,000 words. XML adds extra text (tags) for the same data, so the message is heavier. JSON is lighter, so **REST with JSON uses fewer resources**.

---

## 8. Caching

### 8.1 What is cache?

**Cache** is a temporary memory location where the result of a previous activity is stored. If the same request comes again, the stored result is reused instead of doing the same work again.

### 8.2 Browser example

When you open `www.google.com`, images and data that rarely change (for example the home-page image) are stored in the **browser cache**. On the next visit they are loaded from the cache rather than travelling over the network again, so the page loads faster.

### 8.3 API example — resigned employees

**Scenario:** an API returns all employees who resigned on **15 October** (spoken as "October 2004" in the transcript — most likely 2024, the year of the course; the exact year doesn't affect the point).

```text
Front-end ──► API ──► Employee database
                     SELECT * FROM employees
                     WHERE resignation_date = '2024-10-15';
                     → 5 employees: 105, 106, 108, 109, 112
```

The same request comes **20 times a day**. Should the API query the database 20 times?

- The date is in the **past**; nobody can be added to "resigned on 15 Oct 2024" later.
- The answer **will never change**.
- So the result can be stored in **cache** the first time and served from cache afterwards.

```text
Request ──► Is the result in cache?
                │yes ──► return cached result (no DB call)
                │no  ──► query DB ──► store in cache ──► return result
```

**Rule:** cache only when the data will not change (or changes rarely). If the data can change — for example "employees who resigned as of today" — caching would return stale data.

### 8.4 Where does the cache live?

The application is deployed on a **server** — a cloud server or an on-premises server; the organisation decides (e.g., a bank such as ICICI may choose on-premises; another company may choose cloud). Any application uses server memory while processing a request. A cache is a part of that server memory used to keep results for reuse.

Caching in MuleSoft (e.g., with Object Store) is covered later in the course.

### 8.5 Performance

The instructor also notes that caching is one way to improve API performance; removing unnecessary processing is another. A few such techniques are usually enough.

---

## 9. REST

### 9.1 Definition

**REST = REpresentational State Transfer.**

- REST web services use the **HTTP protocol** to transfer requests and responses.
- **HTTP = HyperText Transfer Protocol.**
- Example: when you type `www.google.com`, the browser shows `https://www.google.com` — the request is transferred over the internet using HTTP(S).

> **Technical clarification:** REST is an architectural style, not a protocol. REST APIs typically use HTTP as the protocol.

### 9.2 Characteristics

- Accepts multiple formats: JSON, XML, HTML, plain text.
- Lightweight; uses fewer resources.
- Caching is possible.
- **Instructor's experience:** 99–100% of the services developed in the MuleSoft ecosystem are REST.

HTTP methods, response codes, and HTTP vs. HTTPS are covered in dedicated sessions (Day 06 onward). Without these fundamentals, working on APIs feels like "building without a base".

---

## 10. API Lifecycle and Design (First Look)

### 10.1 Lifecycle steps

```text
Design ──► Develop ──► Secure ──► Deploy ──► Monitor
```

Detailed on Day 04.

### 10.2 Design — the blueprint

Before constructing a building, an architect designs a **blueprint**. Before developing an API, we **design** it:

- what the request looks like,
- what the response looks like, with examples,
- the data format,
- what the error response looks like,
- what security the API uses,
- the **resource path** — e.g. in `http://localhost:8081/db`, the `/db` part.

REST APIs are designed with **RAML** (RESTful API Modeling Language).

### 10.3 Securing an API — the house analogy

A house can be secured in different ways: solar/electric fencing, a guard dog, a security guard. In the same way, REST and SOAP services can be secured in different ways. The security schemes are defined in the design (RAML or WSDL).

---

## 11. SOAP

### 11.1 Definition

**SOAP = Simple Object Access Protocol.** It is also a type of web service.

### 11.2 Characteristics

| Point | Detail |
|---|---|
| Protocols | Can work over multiple protocols; most often HTTP |
| Format | Accepts **only XML** as input and returns **only XML** |
| Design language | **WSDL** — Web Service Description Language |
| Bandwidth | Needs more bandwidth because XML is heavier; SOAP is also stricter |
| Caching | **Instructor's statement:** caching is not possible with SOAP due to technical challenges |
| Usage today | Mostly old **legacy systems**; before REST became popular, most services were SOAP |

> **Technical clarification on caching:** SOAP requests are normally sent with HTTP POST, which standard HTTP caches do not cache, so SOAP does not benefit from HTTP-level caching the way REST GET requests do. Application-level caching of SOAP results is still possible if implemented separately.

### 11.3 WSDL vs. RAML

| | REST | SOAP |
|---|---|---|
| Design language | RAML | WSDL |
| Defines | Resource details, requests, responses, examples, security schemes | The same kinds of details for SOAP services |

### 11.4 What we do with SOAP in MuleSoft

- **REST:** create REST services *and* consume REST services provided by others.
- **SOAP:** **consume only** — call SOAP services that already exist.

**Instructor's experience:** they have never designed a SOAP web service, and consumed one only once or twice, long ago — not in the latest 2–3 projects. Still, consuming SOAP is covered because it is asked in interviews.

---

## 12. REST vs. SOAP

| Aspect | REST | SOAP |
|---|---|---|
| Full form | REpresentational State Transfer | Simple Object Access Protocol |
| Nature | Flexible, easy to use, easy to learn | Strict and heavier |
| Formats | JSON, XML, HTML, plain text, … | XML only |
| Resources / bandwidth | Lightweight, fewer resources | More bandwidth |
| Scalability | Easily scalable (e.g., an API receiving 10,000 requests a day) | Harder to scale |
| Caching | Possible | Not practical (see clarification above) |
| Design language | RAML | WSDL |
| Typical use | Modern applications — about 99% of new APIs | Highly secure applications; legacy systems |

### When to use which

- **REST** — whenever flexibility and scalability are needed; almost all modern applications.
- **SOAP** — **instructor's view:** when designing highly secure, enterprise-security applications.

> **Technical clarification:** SOAP's security advantage comes from standards such as WS-Security, which provide message-level security. REST APIs are commonly secured using HTTPS, OAuth 2.0 and similar mechanisms, and can also be highly secure.

### A student asked: do we need to know every protocol (SMTP, UDP, …)?

**Instructor's answer:** No one knows everything. A teacher is ahead of you only in their subject. The instructor does not use SMTP or UDP in MuleSoft work, so cannot explain why those are used; with 1–2 years of practice students can surpass the instructor. Focus on the protocols actually used.

---

## 13. Real-Time Environments

### 13.1 Why have multiple environments?

Different stages of development and testing need **separate, isolated infrastructure** — separate application servers, databases and connected systems (e.g., Salesforce) — so that work in one stage does not interfere with another.

### 13.2 Worked use case

An API receives a request, reads data from a **database**, sends it to **Salesforce**, transforms the Salesforce response and returns it. Follow it through the environments:

```text
Local (Anypoint Studio)
      │ build and test on your machine
      ▼
DEV ──► SIT / QA ──► UAT ──► Performance (Pre-Prod) ──► PROD
                                                         │
                                                         └── DR (replica)
```

### 13.3 Development (Dev)

- Developers build the API in **Anypoint Studio** and test it locally.
- When it works, they deploy it to the **development environment**, where it connects to the Dev database and Dev Salesforce.
- Developer testing is functional and high-level: send a request, get a response.

### 13.4 SIT / QA / Testing

Names used: **SIT (System Integration Testing)**, **QA**, or **testing environment**.

Why a separate tester? Testers test **like a critic**:

- Does every error return the correct error response?
- If a string is sent where a number is expected, does the right error come back?
- Does each feature behave correctly in all cases?

Isolation: the QA environment has its **own database, own Salesforce, own application server**. For example, if feature 1 is under test, unrelated changes from feature 2 do not confuse the results.

### 13.5 UAT (User Acceptance Testing)

- Again a separate application server, database and Salesforce.
- Testers here are **users** — the business team or the clients.
- They test different business use cases to confirm the requirement is met.
- When satisfied, they give **sign-off**: "Everything works as expected, go to the next step."

### 13.6 Performance testing (pre-production)

- Separate **performance testers** test how the application behaves with the expected number of users in an hour, half hour or 24 hours.
- Results decide how much **memory and CPU** the application needs, and whether multiple servers are required.
- **Example given:** if an API suddenly receives 500 requests per minute and is not sized for it, it can crash.
- Whether performance testing happens depends on the organisation and expected traffic.

> **Technical clarification:** the transcript doesn't name a separate environment for performance testing or any tool. It's usually done in pre-production with tools such as JMeter or LoadRunner.

### 13.7 Production (Prod)

- After testing, the developer emails the testing team and business/BA stakeholders confirming completion and test results.
- A **separate production deployment team** handles deployment, with **permissions and approvals**.
- Deployment is done in **non-business hours**. **Example:** a bank whose business hours are about 9 AM to 9 PM may deploy at around 10 PM–12 AM.
- The developer often cannot deploy directly; they **guide** the deployment person and then **observe and check** the application.

### 13.8 Disaster Recovery (DR)

- Mostly in **financial institutions and banks**.
- **Illustrative example:** a bank (ICICI) has customers worldwide, an on-premises data centre in **Mumbai**, and all services run on its own servers. If that data centre goes down and takes 4 days to recover, customers cannot be served for 4 days — a huge business loss.
- Solution: a **second data centre** (e.g. Hyderabad) with the **same replica** of everything. If the primary fails, the DR site takes over.
- DR is very expensive — servers and separate environments are a huge cost — so it exists only where the business needs it.

### 13.9 How many environments do companies have?

| Ideal (6) | Common in reality (3–4) |
|---|---|
| Dev, SIT/QA, UAT, Pre-Prod, Prod, DR | Dev, Testing, Prod — or Dev, SIT, UAT, Prod |

The number depends on the organisation's requirements and budget.

| Environment | Who uses it | Purpose |
|---|---|---|
| Dev | Developers | Build and do basic functional testing |
| SIT / QA | Testing team | Detailed testing of all scenarios and errors |
| UAT | Business users / clients | Validate business requirements; give sign-off |
| Pre-Prod / Performance | Performance testers | Load testing; decide memory/CPU/servers |
| Prod | Real users | Live system; deployed in non-business hours by a separate team |
| DR | Used during disaster | Replica of production in another data centre |

---

## 14. Important Terminology

| Term | Meaning |
|---|---|
| API | Code that lets two or more systems communicate and exchange data |
| Low-code | Most code is generated by the tool (XML in MuleSoft); little is written by hand |
| Web service | An API accessed over a network/the web (instructor: over the internet) |
| REST | REpresentational State Transfer; uses HTTP; many formats |
| SOAP | Simple Object Access Protocol; XML only |
| HTTP | HyperText Transfer Protocol |
| RAML | RESTful API Modeling Language — design language for REST |
| WSDL | Web Service Description Language — design language for SOAP |
| Cache | Temporary memory used to reuse previous results |
| Legacy system | An older system still in use |
| SIT | System Integration Testing |
| UAT | User Acceptance Testing |
| Sign-off | Formal approval from users/business to move ahead |
| DR | Disaster Recovery — a replica environment in another data centre |
| Non-business hours | Time window when production changes are deployed |

---

## 15. Interview Questions

### Q1. What is an API?
A piece of code that enables two or more systems to communicate and exchange data. It acts as a middle layer — like a waiter between customer and kitchen — receiving requests, processing them with the back-end and returning responses.

### Q2. What is the difference between an API and a web service?
All web services are APIs, but not all APIs are web services. A web service is an API accessed over a network using web protocols (the instructor's simplification: over the internet). Other APIs — such as library or operating-system APIs — are not web services.

### Q3. What is REST?
REpresentational State Transfer — an architectural style for web services that uses HTTP. It is flexible, lightweight, supports formats such as JSON and XML, is easily scalable and supports caching.

### Q4. What is SOAP?
Simple Object Access Protocol — a web-service protocol that uses only XML, is described with WSDL, needs more bandwidth and is stricter. It is mostly found in legacy systems.

### Q5. Differences between REST and SOAP?
REST: many formats, lightweight, scalable, cacheable, designed with RAML. SOAP: XML only, heavier, stricter, not practically cacheable at HTTP level, designed with WSDL.

### Q6. When would you choose SOAP over REST?
When an existing system already exposes SOAP, or when a highly secure, strictly contracted enterprise service is required. For new modern APIs, REST is preferred.

### Q7. Why is JSON preferred over XML?
JSON is lighter (no opening/closing tags), easier to read and uses fewer resources.

### Q8. What is caching and when should it be used?
Storing results temporarily to reuse them for repeated requests. Use it when the data doesn't change (e.g., employees who resigned on a past date), to avoid repeated back-end calls and improve performance.

### Q9. What do MuleSoft developers usually do with SOAP services?
Consume existing SOAP services; they rarely create new ones.

### Q10. What environments are used in real projects and why?
Dev, SIT/QA, UAT, Pre-Prod (performance), Prod and DR. Each has its own servers and systems so development, testing, business validation, load testing and live traffic don't interfere. Many companies use only 3–4.

### Q11. What is UAT?
User Acceptance Testing — the business team or clients test the application against business requirements and give sign-off.

### Q12. What is Disaster Recovery?
A replica of production in a separate data centre that takes over if the primary data centre fails, avoiding long outages and business loss.

---

## 16. Must Remember

1. **API** = code that lets systems communicate and exchange data; MuleSoft generates **XML** behind drag-and-drop (low-code).
2. Restaurant: **customer = front-end, waiter = API, kitchen = back-end**.
3. One API serves Android, iOS and web — the API is language independent.
4. **All web services are APIs; not all APIs are web services.**
5. REST = HTTP, many formats, lightweight, scalable, cacheable, **RAML**. SOAP = XML only, heavier, **WSDL**, legacy.
6. MuleSoft: **create and consume REST; consume SOAP**.
7. **JSON** is the main format; CSV/Excel appear in file-based jobs.
8. **Cache only data that does not change.**
9. Environments: **Dev → SIT/QA → UAT → Pre-Prod → Prod (+ DR)**; each with its own DB/Salesforce/server.
10. Prod deployments happen in **non-business hours** by a separate team after approvals.
