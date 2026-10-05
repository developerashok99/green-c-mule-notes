# Day 04 — API Lifecycle, Point-to-Point vs. ESB, Monolithic vs. Microservices, API-Led Connectivity

> **Sources:** audio transcript, existing notes, and the class video (recorded 4 Nov 2024). The class used two slide decks, "MULESOFT 3rd Day" (lifecycle, point-to-point, ESB) and "MULESOFT 4th Day" (monolithic, microservices, API-led). Text marked *slide* or *drawing* is taken from the screen. Slide images: [slides/day04](../slides/day04/).

## 1. Overview

This is the densest conceptual session of the prerequisites. Four connected ideas:

| Topic | Question it answers |
|---|---|
| API lifecycle | What steps does an API go through, and which MuleSoft tool is used for each? |
| Point-to-point vs. ESB | Why did integration move from direct connections to a central bus? Why is MuleSoft called an ESB tool? |
| Monolithic vs. microservices | How should applications be split? (general software architecture) |
| API-Led Connectivity | How does MuleSoft recommend applying microservices to APIs? (Experience / Process / System layers) |

---

## 2. The API Lifecycle

### 2.1 What is a lifecycle?

*Slide — "API Life Cycle":* **Design** – Design Center · **Implementation** – Anypoint Studio · **Deploy** – Runtime Manager · **Test** – QA team · **Secure** – API Manager · **Monitor** – API Monitor.

Software development has a lifecycle (SDLC): requirements gathering, development, testing, etc. An API also has a lifecycle — a defined sequence of steps.

The steps listed in this lecture:

```text
Design ──► Implementation ──► Deploy ──► Test ──► Secure ──► Monitor
```

### 2.2 House-construction analogy

*Drawing — "Generic Example – Home construction":*

1. Buy the plot and finalise the requirements – Hyd(erabad)
2. Go to the architect – GHMC rules – discuss requirements – plan – apply for approval
3. Take the plan and start construction – engineer and construction workers
4. House construction is done – secure – electrical fence and dog
5. House-warming ceremony and occupying the house

| House construction | API |
|---|---|
| Look at a plot; if it fits the requirements, buy it | Requirement |
| Go to an architect. They check measurements and local rules (e.g. **GHMC** rules in Hyderabad), gather your requirements, prepare a **plan/blueprint** and get approval | **Design** — the API specification |
| Engineers and construction workers build; the architect is consulted | **Implementation** |
| Secure the house — watchman, solar/electric fencing, a dog — based on your convenience and budget | **Secure** |
| House-warming and moving in | **Deploy** and use |

### 2.3 Step 1 — Design

**What:** Decide everything about the API before building it, like a blueprint:

- the request (request **example** and request **schema**)
- the success response (example and schema)
- the error response (example and schema)
- security to be applied
- resource paths

(Schema vs. example is explained in later sessions.)

**Where:** **Design Center**, a module of the **Anypoint Platform**.

**Language:** **RAML** — RESTful API Modeling Language. An alternative is **OAS** (OpenAPI Specification), but **instructor's experience:** almost all MuleSoft projects use RAML.

**Output:** the **API specification**. Also called **API spec** or **API contract**. "API specification" is the most common term.

> MuleSoft has two main components for development: **Anypoint Studio** and **Anypoint Platform**. Anypoint Platform has many sub-modules — Design Center is one of them.

### 2.4 Step 2 — Implementation (development)

**What:** Build the actual logic.

**Example:** A JSON request arrives. The API sends data to Salesforce, receives the response, modifies it, sends it to a database and receives the database response. All of this — sending requests, receiving responses, transforming data — is development work.

"Development" and "implementation" mean the same thing here.

**Where:** **Anypoint Studio** — an **IDE (Integrated Development Environment)**. In Studio we use connectors and components, drag and drop, and write transformations, enrichments and orchestration. Studio also lets us run (deploy locally) and test the application immediately, as in the Day 01 demo.

### 2.5 Step 3 — Deploy

**What:** Put the application on a server so it can run.

- **On-premises server** — the company's own server.
- **CloudHub** — MuleSoft's cloud solution, for companies that don't want to manage their own servers.

MuleSoft supports both.

**Where:** **Runtime Manager** (in Anypoint Platform). It is also used to **start, stop and restart** applications and **check logs**.

### 2.6 Step 4 — Test

- Developers test their own work, but a separate **QA / testing team** does detailed testing.
- Tools: **Postman**, **SoapUI** and others. Postman is the most widely used, and developers use it too.
- **Performance testing** happens in pre-prod with tools like **JMeter** and **LoadRunner**, done by separate performance testers. Developers are not involved; it would require learning those tools separately.

**Why developers must know Postman:**

```text
Front-end (React/JS) ──► API ──► Database
     not ready yet

Postman ──► API ──► Database        ← we can test without waiting for the front-end
```

If the front-end team's application is not ready, we would have to wait for it before testing. Postman acts as the front-end: we send requests to the API and check responses.

### 2.7 Step 5 — Secure

**What:** Protect the API, like a watchman, fencing or a dog protects a house.

**Where:** **API Manager** (in Anypoint Platform).

**Why the platform isn't shown yet:** a new Anypoint Platform account is a **trial of about one month**. Creating it now would mean re-creating it later, so account creation is deferred by 3–4 sessions; each module is then shown practically.

### 2.8 Step 6 — Monitor

**What:** Track the number of requests and responses, failures and successes, and response times (minimum, maximum).

**Where:** the slide says **"API Monitor"** — i.e. **Anypoint Monitoring**. Runtime Manager also shows some basic statistics and the **logs**.

### 2.9 Summary table

*Drawing — which part of MuleSoft does each step:*

```text
Anypoint Platform                         Anypoint Studio
  Design Center    → API spec               → Implementation
  Runtime Manager  → Deploy                   & Development
  API Manager      → Secure
  API Monitoring   → Monitor
  Runtime Manager  → Logs
```

On the lifecycle slide the instructor also noted: MuleSoft is used for **APIs and integrations** — mostly **REST APIs**; Design is done in Design Center with **RAML**; Test by the QA team uses **Postman**; every other step is in Anypoint Platform.

| Step | What happens | MuleSoft tool |
|---|---|---|
| Design | Define request, response, errors, security | Design Center (RAML) |
| Implementation | Build connectors, transformations, logic | Anypoint Studio |
| Deploy | Run on CloudHub or on-premises | Runtime Manager |
| Test | QA testing; performance testing | Postman / SoapUI; JMeter / LoadRunner |
| Secure | Apply security | API Manager |
| Monitor | Requests, failures, response times | Anypoint Monitoring (+ Runtime Manager) |

**Exchange** is also part of Anypoint Platform — a repository for assets (explained later).

### 2.10 Why this matters — full API lifecycle management

MuleSoft provides its own sub-tool for **every** step. If a platform lacks one step, the project must buy a third-party tool:

- extra licensing cost,
- integrating that tool into the existing ecosystem,
- learning another tool.

This is one of the technical reasons MuleSoft is popular.

### 2.11 Question: why does "Secure" come after "Test"?

A student asked about the order.

- Developers already do basic testing and local deployment during **development**: send a request, check whether a response or error comes back.
- Detailed testing by QA needs the application deployed to a proper environment first.
- After security is applied, the application goes to a **security testing team**, which checks whether the security level is adequate and compatible with enterprise standards.
- The instructor placed Secure later to avoid confusion; in practice it could also appear earlier. The steps overlap in real projects.

The same lifecycle is revisited in much more detail about 10–15 sessions later (Day 21).

> **Technical clarification:** MuleSoft's own documentation describes the lifecycle with more stages (for example design, simulate, validate, build, test, deploy, secure, operate). The six steps here are the instructor's simplified version.

---

## 3. Point-to-Point Integration

### 3.1 What it is

*Slide — "Point-to-Point Integration":* two applications need to be integrated. Disadvantages: the number of integrations is more; a change in one application will force you to implement the change in other applications.

Before ESB architecture, organisations integrated systems by building a **direct integration for every pair** of systems that needed to communicate.

### 3.2 Conference analogy (from Day 01)

*Slide diagram:* four languages — **Japanese, Spanish, French, Hindi** — need **six** pairwise translators: J↔S, J↔F, J↔H, S↔H, S↔F, H↔F. The instructor then drew a new language joining (each needing lines to every existing language), and finally the fix: **one "Translator" in the middle** connected to every language — the ESB idea.

Japanese, Spanish, French and Hindi speakers need a translator for each pair. When a **German** delegate joins, new translators are needed for German↔Japanese, German↔Spanish, German↔Hindi and German↔French — four new pairings for one new person. The next new language adds five, and so on.

### 3.3 Enterprise version

```text
   A ─────── B
   │ ╲     ╱ │
   │   ╲ ╱   │
   │   ╱ ╲   │
   │ ╱     ╲ │
   C ─────── D        4 systems → up to 6 direct integrations
```

> **Technical clarification:** for n systems that all need to talk to each other, the number of direct links can reach n × (n − 1) / 2 — with 50 systems, up to 1,225 integrations. (The formula isn't from the lecture; it just quantifies the instructor's point.)

### 3.4 Disadvantages

1. **Adding a new system adds many integrations.** Each new system needs a connection to every system it must talk to.
2. **A change in one system forces changes in every integration connected to it.** If 50 systems are integrated with one system and that system changes, all 50 integrations may need changes. The instructor calls this **the biggest disadvantage**.
3. Maintainability becomes very hard and complexity grows.

**Instructor's observation:** they have seen almost **4,000 APIs** in one organisation. With that scale, direct connections are unmanageable. This is why most organisations moved to **ESB architecture**. (There was also an intermediate architecture between point-to-point and ESB, which was not sufficient either.)

---

## 4. ESB — Enterprise Service Bus

### 4.1 Idea

*Slide — "ESB (Enterprise Service Bus)":* more applications need to be integrated. Features of an ESB tool: allows **orchestration** logic · allows **transformations** (XML to JSON) · allows **enrichments** (first name, middle name and last name to full name).

Like the **common translator** at the conference: all systems connect to one central mediator, which handles communication with every other system. Adding a system means connecting it once to the bus.

```text
  System A    System B    System C    System D
      │           │           │           │
══════╧═══════════╧═══════════╧═══════════╧═══════  Enterprise Service Bus
                                                     (e.g., MuleSoft)
      │           │
  System E    New system → one new connection
```

### 4.2 Why "bus"?

No matter how many systems you have, the architecture is built like a **bus** to which any number of systems can be attached through connectors.

### 4.3 MuleSoft and ESB

- MuleSoft is an **ESB tool**.
- Job postings say "MuleSoft developer" or "Mule ESB developer" — **same role**, only different terminology.
- Other tools in the market: **TIBCO, Boomi, WSO2, SnapLogic**, and more.

### 4.4 When to use an ESB

- **Only two systems?** Not necessary. A simple point-to-point integration is easier.
- **Many systems?** Use an ESB. An enterprise typically has ERP systems such as SAP, CRM such as Salesforce, multiple databases, front-end and back-end applications. All must communicate, so an ESB tool is good practice.

### 4.5 The three features that make a tool an ESB tool

#### (1) Orchestration

Deciding **in which sequence** systems are called, and coordinating them.

**Analogy — music conductor:** the conductor stands in the middle of the stage and tells each musician when to start. Without coordination, musicians playing randomly produce noise, not music.

**Example (Flipkart order, illustrative):**

*Slide — "Flipkart (Enterprise) – Mule ESB Integration":* applications **Inventory Mgmt, CRM (Salesforce), Billing (Geneva), Delivery App, Payment (Razorpay)**. The Mule application receives the **request** and orchestrates: **Source → IM connector → SF connector → Transformation → Enrichment → P connector → B connector → D connector**, with **Error handling** around it.

```text
Mobile app ──► MuleSoft API
                 1. SAP          — is the phone in stock?
                 2. Salesforce   — customer, billing and delivery address
                 3. Payment
                 4. Billing
                 5. Delivery
              ◄── final response
```

The sequence and logic of "first this system, then that one" is orchestration.

#### (2) Transformation

Converting data from **one format to another** and setting the fields the target system needs.

**Example:** the mobile app sends **JSON**. SAP needs **XML** with its own structure. MuleSoft converts JSON → XML, sets the required fields and sends it. SAP replies in XML; MuleSoft converts the needed parts back. For the next system (Salesforce), data is converted again — the instructor notes the Salesforce connector accepts **Java** format data.

> **Technical clarification:** "Java format" means MuleSoft's in-memory Java objects (`application/java`, e.g. maps and lists). The Salesforce connector operations take this kind of input, so DataWeave output is set to Java before calling it.

Transformations are written in **DataWeave**.

#### (3) Enrichment

**Enrichment is a part of transformation** in which existing data is **enhanced**.

**Example:** Salesforce returns `firstName` and `lastName` separately. Concatenating them gives `fullName`.

Another example given: receiving a date of birth and calculating **age** from it.

```text
firstName + " " + middleName + " " + lastName  ──►  fullName   (slide example)
dateOfBirth                 ──►  age
```

MuleSoft provides all three — **orchestration, transformation, enrichment** — so it is an ESB tool. It provides many more features, but these three are the defining ones.

---

## 5. Monolithic Applications

### 5.1 Definition

*Slide — "Monolithic Application":* collection of all business services into one application — login, password reset, user ID recover, check balance, fund transfer. *(Drawing: ICICI bank front-end (MA) → one application → back-end database.)*

> **Monolithic application: a collection of all business services in one application.**

**Mono** means single.

### 5.2 Example — banking app

**Illustrative example (ICICI bank mobile app / net banking):**

```text
┌──────────────── One application ────────────────┐
│ Login            (check username/password)       │
│ Password reset                                   │
│ User ID recovery                                 │
│ Balance check                                    │
│ Fund transfer                                    │
│ Mobile number change, email change,              │
│ address/demographic changes, … (hundreds more)   │
└──────────────────────────────────────────────────┘
Front-end ──►            this application            ──► Database
```

Each feature has its own code, but all the code is packaged and deployed as **one application**. This is how applications were built before microservices.

### 5.3 Advantages

*Slide:* simple to develop · faster to develop · easy to test · easy to deploy.

- Easy to develop (one application)
- Easy to test
- Easy to deploy

Fine for small applications; problems appear at **enterprise** scale.

### 5.4 Disadvantages

*Slide:* complexity increases with time · difficult to understand · slower response – huge application · deploy the entire application even for a small update – makes even other services not working · non-reliable · dependent.

*Drawing:* consumer → one application (Login, Password reset, Balance check, Fund transfer, User ID recovery … n). A small issue in one feature → bug fix → **production deployment of the whole application, 1–2 hours of maintenance, during which no other service works**.

**1. Complexity increases as services increase.**
10 services become 20 in the same application; understanding the application becomes very difficult over time.

**2. Response time becomes slow.**
- **Mobile analogy:** a phone with 2 GB RAM runs 10 apps fine; with 20 apps it slows down.
- **Document analogy:** a 10,000-word document opens faster than a 2-lakh-word document because there is more to load.
- A heavy application responds slowly. **Example:** if placing an order on Flipkart is slow every day, the user experience is poor and customers are lost.

**3. Full redeployment for any small change → downtime for everything.**
A small change in password reset requires redeploying the whole application. During that downtime, **all** other services (login, balance check, fund transfer) are also unavailable.

**4. Not reliable / dependent.**
If the application is down, every service is down. Changing password reset requires taking all features down.

### 5.5 How microservices came about

As enterprise complexity increased, a group of experts studied these problems and defined the **microservices architecture** with principles that address them.

---

## 6. Microservices Architecture

### 6.1 Principles

*Slide — "Microservices":* split the entire project into smaller processes · develop each business service as a separate project or application. *(Drawing: the ICICI mobile app and a new mutual-funds mobile app both using the same separate **Login** service.)*

1. **Split the project into multiple smaller processes** — but **meaningful** processes, not random splits.
2. **Develop each business service as a separate project/application.**

```text
Login service      Password-reset service      User-ID-recovery service
Balance-check service      Fund-transfer service
   (each built, deployed and run separately)
```

### 6.2 Reuse example

The bank plans a new **mutual funds** app (another front-end). Because login is an independent service, the mutual funds app can **reuse** the same login service. In a monolith, login code is bundled with everything else and cannot be reused like this.

### 6.3 Advantages

*Slide:* less complexity · develop faster · easy to understand · easy to manage · easy to reuse · scalable easily · reliable · independent. The instructor annotated "develop faster" with **"initial (takes more time)"**.

| Advantage | Explanation |
|---|---|
| Less complexity | Each service is smaller and easier to check |
| Faster development (in the long run) | Initially it takes **more** time, because more services are built. Later, many services are reused. **Instructor's example:** if 30–40% of a new feature can reuse existing services, only 60–70% of the effort remains |
| Easy to understand and manage | **Analogy:** a big chapter is confusing; split it into important topics and read each |
| Reusable | A service can be reused by other applications or features |
| Scalable | Increase resources only for the services that need it (see below) |
| Reliable | Changing password reset → redeploy only that service; only it has downtime, the rest keep working |
| Independent | Each service is separate. If two services need to communicate, communication is established explicitly |

### 6.4 Scalability — worked example

**Illustrative example (Flipkart, festive season):**

- Normal day: about **1 lakh** customers.
- Festive season: traffic doubles or triples — about **3 lakh** per day.
- If the system can handle at most **1.5 lakh**, it will crash.

> **Transcript vs. drawing:** the audio gives 1 lakh → 3 lakh per day; the instructor's drawing on the slide reads **"10000"** normally and **"FE 30000 / 1 day"** in the festive season (the same 3× jump), with the extra capacity added only to the busy services. The exact figures could not be reconciled; the point — scale only the services that need it — is the same.

**Car analogy:** a car rated for 1,000 kg might move with 3,000 kg, but it won't last.

**Scalability** = increasing servers, CPU and memory to handle more traffic.

- **Monolith:** resources must be increased for the entire application, including services that don't need it — wasted resources.
- **Microservices:** if only 20 out of 100 services get the extra traffic, increase resources for those 20 only.

### 6.5 Question: can we auto-scale?

- **Auto-scaling** is a **premium MuleSoft feature** at extra cost.
- Without it, organisations increase resources **manually** before known events — e.g. sale days like **Big Billion Days** — and reduce them afterwards.

### 6.6 Disadvantages

*Slide:* establish inter-service communication · impact of change in one service on other services · **vCore availability – Mule – 0.1 = 500 MB** (each extra application consumes vCores).

| Disadvantage | Explanation |
|---|---|
| More resources | Many applications need more total CPU, memory and servers than one application |
| Inter-service communication | Inside a monolith, features communicate internally in code. Separate services must communicate **over the network**, which must be built and maintained |
| Impact of change | If a service's request/response format changes, every service consuming it must change too |
| Higher MuleSoft cost | MuleSoft licensing is based on **vCore** (a unit of CPU and memory). More applications → more vCores → higher cost |

### 6.7 Who decides how to split?

- The **solution architect** decides — **not the developer**.
- Developers still need enough understanding of the terminology, advantages and disadvantages to follow why a service is or isn't separated.
- Splitting into meaningless tiny applications is not recommended.

**Travel analogy:** Hyderabad to Vizag — you can walk, drive, take a bus, train or flight. The choice depends on your budget and needs. Enterprises are large organisations that can afford extra cost for better customer experience, so most choose microservices.

**Hybrid in practice:** combining 2–3 related business services into one application saves memory, CPU and servers when there are thousands of services. Organisations weigh advantages and disadvantages and choose.

**Instructor's notes:**
- The move from monolithic to microservices has happened over decades (the instructor says about 30 years).
- Monolithic and microservices are **generic** architecture terms, not specific to MuleSoft, Java or .NET.

---

## 7. Microservices in MuleSoft → API-Led Connectivity

### 7.1 The bridge

- If all business services of an application are packed into **one** Mule application → that is a **monolithic** Mule application.
- If they are split into **multiple Mule applications/APIs** → that is **microservices architecture in MuleSoft**.

To guide how to split, MuleSoft introduced **API-Led Connectivity**: "If you implement microservices in MuleSoft this way, you will get the best results."

### 7.2 Definition

*Slide — "API-Led Connectivity":* integration strategy to transfer data between applications in a methodical way through reusable and purposeful APIs · APIs are developed to play a specific role such as accessing data from source systems, combining this data in processes, or providing an experience for the end user · **best practice specified by MuleSoft** · **not mandatory**.

*Slide diagram (MuleSoft's standard picture):* **Experience APIs** — innovation and digital products; **Process APIs** — agility and new value creation; **System APIs** — decentralised access to core assets (SaaS apps, mainframe, FTP/files, databases, web services, legacy systems). Ownership runs from **Central IT** (system) through **LoB Dev/IT** (process) to **App Dev** (experience), with a **C4E** (Centre for Enablement) sharing assets.

> **API-Led Connectivity** is an integration strategy to transfer data between applications in a methodical way through **reusable** and **purposeful** APIs.

Before building an API, ask:

- Is there a real business purpose?
- Can it be reused by other services in the future?

> APIs are developed to play a specific role: **accessing data from source systems**, **combining/processing that data**, or **providing an experience for the end user**.

### 7.3 The three layers

Earlier examples showed a single API between front-end and back-end. In API-led connectivity there are three layers:

```text
Front-end (experience systems: mobile app, desktop app, IoT/watch)
        │
        ▼
┌───────────────────┐
│  Experience API   │  exposed to the front-end
└─────────┬─────────┘
          ▼
┌───────────────────┐
│   Process API     │  business logic, orchestration, transformation
└─────────┬─────────┘
          ▼
┌───────────────────┐
│   System API(s)   │  connect to one back-end system, get/send data
└─────────┬─────────┘
          ▼
Back-end systems: Salesforce, Workday (SaaS), databases, FTP/file servers,
mainframe, SAP, legacy systems, REST/SOAP web services
```

**Legacy system:** an old system that the company keeps running on old technology without changing it (e.g., mainframe).

#### Experience API

*Slide:* reconfigure data consumed from the **downstream** API so that it is easily consumed by the intended audience. Example – mobile app and web app.

- **Exposed to the front-end** (the experience system).
- The front-end is called the experience system because the user experiences it; the API exposed to it is the Experience API.
- Receives the request and passes it to the Process API; returns the final response.
- MuleSoft definition: reconfigures data so that it is easily consumed by the intended audience.

#### Process API

*Slide:* consume data from System APIs and shape data as per the requirement. Example – **order history** (Salesforce – order management).

- Contains the **business logic**: which systems to call, in what order, how to transform data, how to build the final response.
- Consumes data from System APIs and shapes it as per the requirement.
- May call one or many System APIs, and may call other Process APIs.

#### System API

*Slide:* reusable system calls · consume data from the system and pass it to the **upstream** API · examples of systems: Salesforce, databases, FTP, web services.

- **Connects to one system** and gets or sends data. No business logic.
- MuleSoft definition: reusable system calls that consume data from systems and pass it to the **upstream** API.
- Usually **one System API per back-end system** (one for Salesforce, one for the database, one for the FTP server). A very complex system may have more than one.

> **Upstream / downstream:** from the System API's point of view, the Process and Experience APIs above it are **upstream**; the back-end system below it is **downstream**.

### 7.4 It is a best practice, not mandatory

- MuleSoft recommends three layers; it is **not compulsory**.
- If no business logic is needed, skip the Process API: **Experience API → System API** directly, saving resources.
- The **architect** analyses the requirement. If future processing is expected, the Process API may be created anyway.

### 7.5 Example — mobile vs. desktop (same data, different needs)

```text
Mobile app ──► Mobile Experience API ─┐
                                      ├──► Process API ──► System API (Salesforce)
Desktop app ─► Desktop Experience API ┘                ──► System API (Database)
                                                       ──► System API (SAP)
```

- The mobile app needs **less** data; the desktop app needs **more**.
- Each Experience API filters/shapes the response for its consumer.
- The **Process API and System APIs are reused** as they are.

Why separate Experience APIs? Different experience systems may need different **security**, different **amount of data**, or a different **response structure**.

### 7.6 Example — Flipkart order history

*Slide diagram — "Implementation of microservices using API-led connectivity" (Flipkart, MA = mobile app, WA = web app):*

```text
Experience:  Mobile API                Web app API
Process:     Shipment status   Order status   Customers   Order history
System:      Toll shipments  UPS shipments  SAP customers  Salesforce customers  Orders
```

**Customers** (process) uses **SAP customers** and **Salesforce customers**; **Order history** uses Customers and **Orders**; **Shipment status** uses **Toll** and **UPS** shipments. The instructor drew a red line straight from the **Mobile API to Toll shipments** to show skipping the Process layer (§7.7).

**Illustrative example:** a user who has used Flipkart for a year opens **order history** in the mobile app.

```text
Mobile app
   │ request: customer details + date range
   ▼
Mobile Experience API
   ▼
Order History Process API
   ├──► Customer Process API
   │        ├──► System API (SAP)
   │        └──► System API (Salesforce)
   │        → consolidates customer data
   └──► Order Process API
            └──► System APIs for order systems
            → order data
   ▼
Order History Process API combines customer + order data, applies logic,
builds the response
   ▼
Mobile Experience API ──► Mobile app
```

Observations:

- Experience → Process → Process → System: **a Process API can call another Process API**.
- When the **web application** needs order history, a **Web Experience API** is created that **reuses** the same Order History Process API and System APIs.
- The same Experience API can serve both if their needs are identical — it depends on the requirement. Usually each different experience system gets its own Experience API.

### 7.7 Example — shipment status (skipping the Process layer)

**Case A:** shipment status comes from **two** systems. The Process API calls both, combines and modifies the data → Process API needed.

**Case B:** shipment status comes from **one** system, and the System API response is already in the right shape. The Experience API calls the System API **directly**, skipping the Process API and saving its resources.

The architect may still require a Process API if future requirements are expected and resources allow.

### 7.8 Question: if Experience calls System directly inside the enterprise, is security needed?

Internal communication happens inside the enterprise network, but **security is still applied**.

- **Banks and financial institutions** are audited by the **RBI** (Reserve Bank of India) and must meet compliance rules.
- **Instructor's example:** Paytm faced licence action after repeated compliance issues.
- Enterprise architectures also restrict access to allowed devices/networks.

"It is internal" is not a reason to skip security, especially in regulated industries.

### 7.9 Advantages of API-Led Connectivity

*Slide:* reusability · scalability · time to market is faster in the long run · easy to manage · any change in one layer, no changes required in other layers.

| Advantage | Explanation |
|---|---|
| Reusability | Process and System APIs reused by many Experience APIs |
| Targeted scalability | During festive season, increase resources only for order-status and shipment-status APIs, not order history |
| Faster time to market (long run) | Initially more APIs to build; later, reuse speeds delivery |
| Easy to manage | Smaller, purposeful APIs |
| Change isolation | Changing a layer's **internal logic** needs no change elsewhere |

**Change isolation — precise rule:**

- If the System API's **internal** logic changes (e.g. how it connects to the system) but its **response structure** stays the same → no change in Process/Experience APIs.
- If the System API's **response structure** changes → every API that consumes it (e.g. Order History and Order Status Process APIs) must change.

### 7.10 Disadvantages

*Slide:* instead of one API we are developing more APIs, so it takes more time in the initial phase · more APIs – more vCores purchase – increases cost.

- More APIs → **more initial development time**.
- More APIs → **more memory and CPU** → higher cost.
- More **inter-service communication** to establish and maintain.

Keep a balance; apply API-led connectivity according to the requirement.

---

## 8. Important Terminology

| Term | Meaning |
|---|---|
| API lifecycle | Design → Implementation → Deploy → Test → Secure → Monitor |
| API specification (spec / contract) | The design document of an API, written in RAML (or OAS) |
| RAML | RESTful API Modeling Language |
| OAS | OpenAPI Specification — alternative to RAML |
| Design Center | Anypoint Platform module for designing APIs |
| Anypoint Studio | IDE for implementing Mule applications |
| Runtime Manager | Deploy, start/stop applications, view logs |
| API Manager | Apply security/policies to APIs |
| Anypoint Monitoring | Monitor requests, failures, response times |
| CloudHub | MuleSoft's cloud deployment platform |
| Point-to-point integration | Direct integration between every pair of systems |
| ESB | Enterprise Service Bus — a central integration architecture/tool |
| Orchestration | Coordinating calls to systems in the right sequence |
| Transformation | Converting data between formats/structures |
| Enrichment | Enhancing data (part of transformation) |
| Monolithic | All business services in one application |
| Microservices | Each meaningful business service as a separate application |
| Scalability | Ability to increase resources to handle more traffic |
| Auto-scaling | Automatic resource increase; premium MuleSoft feature |
| vCore | MuleSoft licensing unit representing CPU and memory |
| API-Led Connectivity | MuleSoft's three-layer API strategy |
| Experience / Process / System API | The three layers of API-led connectivity |
| Upstream | The calling side (above) |
| Legacy system | Old system kept running without change |

---

## 9. Interview Questions

### Q1. What are the stages of the API lifecycle and which Anypoint tool is used for each?
Design (Design Center, RAML), Implementation (Anypoint Studio), Deploy (Runtime Manager, to CloudHub or on-premises), Test (Postman/SoapUI; JMeter/LoadRunner for performance), Secure (API Manager), Monitor (Anypoint Monitoring, with basic stats in Runtime Manager).

### Q2. What is an API specification?
The design document of an API, also called API spec or API contract. It defines resources, requests, responses (success and error), examples, schemas and security. In MuleSoft it is usually written in RAML in Design Center.

### Q3. What is point-to-point integration and what are its disadvantages?
Direct integrations between each pair of systems. Adding a system adds many integrations, and changing one system forces changes in all integrations connected to it, making maintenance very hard at enterprise scale.

### Q4. What is an ESB? Why is MuleSoft called an ESB tool?
An Enterprise Service Bus is a central architecture to which all systems connect. MuleSoft provides the core ESB capabilities — orchestration, transformation and enrichment — and connects many systems.

### Q5. Explain orchestration, transformation and enrichment.
Orchestration: calling systems in the correct sequence (check stock → payment → bill → delivery). Transformation: converting data between formats/structures (JSON → XML for SAP). Enrichment: enhancing data (first + last name → full name).

### Q6. When is an ESB not needed?
When only two systems need to be integrated — simple point-to-point is enough.

### Q7. What is a monolithic application? What are its disadvantages?
All business services in one application. Complexity and response time increase, any change requires redeploying everything (downtime for all services), and it is not reliable — if it is down, every service is down.

### Q8. What is microservices architecture? Advantages and disadvantages?
Splitting an application into meaningful, separately developed and deployed services. Advantages: less complexity, reusability, independent scalability, reliability, faster development in the long run. Disadvantages: more resources and cost, inter-service communication, impact of contract changes on consumers.

### Q9. What is API-Led Connectivity?
MuleSoft's strategy for connecting applications through reusable and purposeful APIs organised in three layers: Experience (exposed to consumers), Process (business logic), System (access to back-end systems).

### Q10. Is it mandatory to have all three layers?
No. It is a best practice. If no business logic is needed, the Experience API can call the System API directly. The architect decides based on current and future requirements.

### Q11. Why would mobile and web have different Experience APIs?
They may need different amounts of data, different response structures or different security. The Process and System APIs are reused.

### Q12. If a System API's internal logic changes, do the Process and Experience APIs need to change?
Not if the System API's response structure stays the same. If the response structure changes, all consuming APIs must be updated.

### Q13. What is vCore?
MuleSoft's unit of CPU and memory capacity used for licensing and sizing. More applications use more vCores, increasing cost.

---

## 10. Must Remember

1. **Lifecycle:** Design (Design Center) → Implement (Studio) → Deploy (Runtime Manager) → Test (Postman) → Secure (API Manager) → Monitor (Monitoring).
2. Design output = **API specification / spec / contract**, written in **RAML** (alternative OAS).
3. **Point-to-point** breaks at scale: new systems and changes ripple everywhere.
4. **ESB** = central bus; MuleSoft developer = Mule ESB developer.
5. ESB features: **orchestration, transformation, enrichment** (enrichment ⊂ transformation).
6. **Monolithic** = all services in one app → slow, full redeploy, not reliable.
7. **Microservices** = meaningful separate services → reusable, scalable, reliable; costs more (vCore) and needs inter-service communication.
8. Architect decides how to split; hybrids are common; auto-scaling is a premium feature.
9. **API-led:** Experience (front-end facing) → Process (business logic) → System (one per back-end).
10. Process layer can be skipped; internal APIs still need security; internal changes don't ripple, contract changes do.
