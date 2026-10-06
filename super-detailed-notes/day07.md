# Day 07 — The Mule Event (Payload, Attributes, Variables) and Anypoint Platform Setup

> **Sources:**
> - Audio transcript, existing notes, and the class video (recorded 7 Nov 2024).
> - Slide text, drawings and Studio/Postman/Anypoint screens marked *slide*, *drawing* or *screen* are read from the recording.
> - Slide images: [slides/day07](../slides/day07/).

## 1. Overview

Day 06 covered the HTTP request from the outside. This session follows the request **inside** the Mule application.

1. How the HTTP Listener converts an HTTP request into a **Mule event**
2. Structure of the Mule event: **message (payload + attributes), variables, error**
3. Live debugger demonstration — inspecting payload, attributes and variables
4. Accessing values with DataWeave expressions (case sensitivity)
5. How connectors **overwrite** payload and attributes, and why **variables** exist
6. Set Payload vs. Set Variable vs. Transform Message
7. How the response goes back to the client
8. Creating an Anypoint Platform account and installing Anypoint Studio
9. Tour of Anypoint Platform modules and MuleSoft roles
10. Practice task: Hello World application

> If you understand this session, everything later becomes easier. If not, "it will be like working in confusion all the time."

---

## 2. From HTTP Request to Mule Event

### 2.1 The Listener's job

```text
Postman / client
   │  HTTP request: method, URL (host, port, path, query params, URI params),
   │                headers, body
   ▼
HTTP Listener (first component — the source)
   │  converts the HTTP request into a Mule event
   ▼
Next processor (Logger, Database, …) ──► … ──► end of flow
```

The Mule application does not work with the raw HTTP request directly. The Listener converts it into MuleSoft's internal structure — the **Mule event** — and passes it on.

*Drawing:* (JSON) HTTP Req → [MS] API ↔ DB, (JSON) Res back; below it, **HTTP listener → Mule message event**.

### 2.2 What is a Mule event?

*Slide* — **Mule Event:** Mule Event contains the core information processed by Mule Runtime · It travels through components inside Mule application following the logic configured · A Mule Event consists of three components – payload, attributes and variables.

> The **Mule event** contains the core information processed by the Mule runtime.

It is the object that **travels through each component** in the flow. Each component can read it, change it and pass it on.

### 2.3 Structure

```text
Mule event
├── Message
│   ├── payload
│   └── attributes
├── variables
└── error          (only when an error has been raised)
```

- A Mule event has **payload, attributes and variables**.
- **Payload + attributes together are called the Mule message.**
- When an error is raised, **error information** also becomes part of the Mule event.

This is a common **certification and interview question**.

*Slide* — **Transformation of HTTP Request to Mule 4 Event:** HTTP Request (HTTP Method, URL, Headers; Body) → Mule 4 event (Message: Payload (includes attachments), Attributes; Variables; Exception message). Arrows were drawn in class from **Body → Payload** and from **Method/URL/Headers → Attributes**.

### 2.4 How HTTP parts map into the Mule event

| HTTP request | Mule event |
|---|---|
| **Body** | **payload** |
| **Query params, URI params, headers** (and method, path, etc.) | **attributes** |
| Nothing from outside | **variables** — start **empty**; created only inside the flow |

Day 05 example: the employee ID was sent in the **body** (`{"empid": 120}`), so it was read as `payload.empid`.

---

## 3. Live Demonstration in the Debugger

### 3.1 Setup

- Breakpoint on the first component after the Listener.
- **Debug** the project (right-click on white space → Debug). Studio warned "errors exist in the project" — continue.
- Request from Postman (*screen*): GET `http://localhost:8081/empdetails?empid=123`, JSON body `{"empid": 120}`, **one query parameter** (`empid=123`), **no headers** set explicitly.

### 3.2 What the Mule Debugger showed

The **Mule Debugger** view shows three entries: **Attributes, Payload, Vars**.

**Payload:** exactly the body sent from Postman, still in JSON format. → *body became payload.*

**Vars:** **0**. No variables exist yet, because none were created in the flow; nothing from outside goes into variables.

**Attributes** (copied out with Ctrl+A, Ctrl+C to inspect):

| Field | What was there |
|---|---|
| `uriParams` | Empty — no URI params were sent |
| `queryParams` | The one query parameter sent. If 3–5 are sent, all appear |
| `headers` | **9 headers**, even though none were set in Postman — default headers added automatically by the client/system (e.g. `host`, `accept`, `connection`, `content-type`) |
| `listenerPath`, `relativePath`, `requestPath` | Path information |
| `localAddress` | `127.0.0.1` — this machine |
| `queryString`, `method`, `scheme`, … | Other request details |

The important parts for development are **headers, query params and URI params**.

*Screen* — the attributes as pasted into Notepad++:

```text
org.mule.extension.http.api.HttpRequestAttributes
{
   Request path=/empdetails
   Raw request path=/empdetails
   Method=GET
   Listener path=/empdetails
   Local Address=/127.0.0.1:8081
   Query String=empid=123
   Relative Path=/empdetails
   Masked Request Path=null
   Remote Address=/127.0.0.1:63610
   Request Uri=/empdetails?empid=123
   Raw request Uri=/empdetails?empid=123
   Scheme=http
   Version=HTTP/1.1
   Headers=[
      content-type=application/json
      user-agent=PostmanRuntime/7.42.0
      accept=*/*
      cache-control=no-cache
      postman-token=…
      host=localhost:8081
      accept-encoding=gzip, deflate, br
      connection=keep-alive
      content-length=22
   ]
   Query Parameters=[
      empid=123
   ]
   URI Parameters=[]
}
```

Evaluating `attributes.headers` in the debugger listed the same 9 entries (`size = 9`); Postman's own Headers tab showed them as auto-generated.

---

## 4. Reading Values — DataWeave Expressions

### 4.1 Evaluate expression

In the Mule Debugger, the **x+y** (evaluate expression) button runs a DataWeave expression against the current Mule event. Useful for learning syntax.

### 4.2 Syntax

| What | Expression |
|---|---|
| Whole payload | `payload` |
| Field in the payload | `payload.empid` |
| All query params | `attributes.queryParams` |
| One query param | `attributes.queryParams.empid` |
| URI params | `attributes.uriParams` (or `attributes.uriParams.id`) |
| All headers | `attributes.headers` |
| One header | `attributes.headers.'content-type'` |
| A variable | `vars.employeeID` |

### 4.3 Case sensitivity — demonstrated mistakes

- `Payload.empid` (capital P) → **doesn't work**. The keyword is `payload` in lower case.
- `queryParams` → lower-case **q**, upper-case **P**. A typo (missing letter) returned nothing.
- Header names: `attributes.headers.'Content-Type'` returned nothing; the header key is stored in **lower case** (`content-type`). Header names containing `-` must be written in quotes.
- Variable/parameter names are case-sensitive too — the class variable was `employeeID`, so `vars.employeeId` would not find it.

---

## 5. The Overwrite Problem and Why Variables Exist

### 5.1 What happened after the Database Select

Stepping past the **Database Select** in the debugger:

```text
Before DB Select                    After DB Select
payload    = request body           payload    = database result (Java) ← overwritten
attributes = headers, queryParams…  attributes = null                  ← lost
vars       = (whatever was set)     vars       = unchanged              ← safe
```

*Screen:* at the Logger after the Select, the debugger showed `attributes = null`, `payload = {CaseInsensitiveHashMap} size = 1` (the DB row), and `vars` still holding `employeeID = "123"`.

> When a component connects to an external system (database, HTTP request, etc.), **payload and attributes can be overwritten**.

### 5.2 The problem

If you need the original query parameter **after** the database call, it is gone.

### 5.3 The solution — variables

> Before a step that would overwrite data you still need, **store that data in a variable**.

A variable is a **placeholder**. Payload and attributes can be overwritten; a variable remains until the flow ends, unless you change it or remove it with **Remove Variable**.

You don't need to store everything — e.g., only the query param, not headers or URI params.

---

## 6. Creating a Variable — Hands-On

### 6.1 Where to place Set Variable

A student asked: before or after the Select? **Before** — the attributes are still available there; after the Select they are cleared.

```text
HTTP Listener
   ▼
Set Variable   name = employeeID
               value = attributes.queryParams.empid      (expression mode, fx)
   ▼
Logger
   ▼
Database Select     (payload and attributes overwritten)
   ▼
Transform Message   (can still use vars.employeeID)
```

### 6.2 Configuration

- **Name:** `employeeID` (*screen*)
- **Value:**
  - Click **fx** (expression mode — enables DataWeave) and write the expression reading the query param.
  - The key name must match exactly what was sent (case-sensitive).
  - *Screen:* the flow became Listener → Logger → **Set Variable** → Select → Logger → Transform Message → Logger, with Value `#[ attributes.queryParams.empid ]`. (The audio says "EMPID"; the Postman key was `empid`.)

### 6.3 Result

- Saving (Ctrl+S) rebuilds and redeploys automatically.
- Sent the request again. **Vars** changed from 0 to **1**: `employeeID = "123"` (*screen* — a string, because query parameters always arrive as text).
- The variable's media type showed **Java** (`application/java`) because no output format was declared.
  - That is fine — it is a single value used internally, not sent to the consumer.
  - Declaring `output application/json` would store it as JSON.
- After the Database Select, payload and attributes changed, but **the variable was still there**, all the way to the end.

### 6.4 Accessing and lifetime

- Syntax: `vars.<variableName>` → `vars.employeeID`
- Lifetime: until the end of the flow (more precisely, the Mule event), unless removed with **Remove Variable** or overwritten by setting it again.

---

## 7. Set Payload vs. Set Variable vs. Transform Message

### 7.1 Two ways to set the payload

1. **Set Payload** component
2. **Transform Message** component

### 7.2 Two ways to create a variable

1. **Set Variable** component
2. **Transform Message** → **Add new target** → choose **Variable** → give the name → write the script

### 7.3 Capabilities

| Component | Can set |
|---|---|
| Set Payload | Payload only |
| Set Variable | One variable only |
| Transform Message | Payload, variables **and** attributes |

- There is no "Set Attributes" component; attributes can be created only through Transform Message.
- In practice you rarely create attributes — attributes hold minimal information (headers, query params, URI params).
- Transform Message is used mostly for **payload** and **variables**.

### 7.4 When to use which

- Simple values → Set Payload / Set Variable are fine.
- Complex transformations → Transform Message.
- **Instructor's habit:** uses Transform Message for almost everything, including simple payloads and variables. Either approach is acceptable.

### 7.5 Same thing in both

Transform Message:

```dataweave
%dw 2.0
output application/json
---
payload
```

The same script can be written in **Set Payload**'s value. If you write only `payload` without the `output application/json` header, the payload stays in Java format and is not converted.

---

## 8. How the Response Goes Back

### 8.1 End-to-end

```text
Postman ──HTTP request──► HTTP Listener ──Mule event──► Logger ──► DB Select
                                                                       │
Postman ◄──HTTP response── HTTP Listener ◄──Mule event── Logger ◄── Transform Message
```

1. The Listener receives the HTTP request and converts it to a Mule event.
2. The Mule event travels through each component, which changes it as needed.
3. After the last component, the event returns to the **Listener**.
4. The Listener converts the Mule event into an **HTTP response**:
   - **body** ← current payload (JSON here)
   - **status code** and **reason phrase** — `200 OK` by default for a successful flow
   - **headers** — default response headers; custom ones can be added

### 8.2 The response JSON

The response was an **array containing an object** — the database returns a list of rows. Why the Select returns an array is explained in the database sessions.

*Screen* (Postman, 200 OK):

```json
[
  {
    "emp_salary": 80000.0,
    "emp_status": "true",
    "emp_name": "ravi",
    "emp_designation": "software engineer",
    "emp_id": 120
  }
]
```

The keys are the table's column names. The fields could be renamed through transformation (e.g. `empSalary`, `empStatus`); that is done later.

### 8.3 Questions

**How does the Listener know whether the response is JSON or XML?**

- It sends whatever the payload is.
- The Transform Message already converted it to JSON, so the body is JSON.
- The Listener is configured by default to send the payload as the response body with `200 OK`.

**How does the Listener know the flow is complete?**
When there are no more components in the flow, processing ends and the event returns to the source (Listener).

**What if there is no Transform Message?**

- The payload stays in Java format.
- The Listener cannot send it as a valid HTTP body → error ("invalid data", as seen on Day 05).
- That's why it is converted to JSON first.

**Some applications send tokens — how?**
That belongs to API security. 8–10 policies will be covered later, including one that uses a token and one that uses username/password.

---

## 9. Anypoint Platform Account

*Slide* — **Agenda for today** (second part): Anypoint Platform and Anypoint Studio overview · Download & Install Anypoint Studio · Download & Install Postman · Q&A session. *Drawing:* MuleSoft → Anypoint Platform; Anypoint Studio → IDE.

1. Go to Anypoint Platform → **Sign up**.
2. Fill in first name, last name, email (Gmail is fine), job title (e.g., software engineer), country, state, company name (any), number of employees, username and password. Phone and industry are optional.
3. Tick "I'm not a robot", agree, **Create account**.
4. Verify the email.
5. **Sign in** with the username and password.

**Trial:** the account works for about **30 days**. After that, create a new account (new username with the same email, or a new email).

---

## 10. Installing Anypoint Studio

1. In Anypoint Platform, click the **Anypoint Studio download** option. A download page opens.
2. Product: **Anypoint Studio**. Version: **latest**. OS: Windows / Mac / Linux.
3. Enter details (email is mandatory) → **Download**. A **ZIP** file downloads (15–20 minutes).
4. **Extract** the ZIP (right-click → Extract All / Extract Here).
5. Place it in a short path such as `C:\` — not deep inside Downloads. Optionally rename the folder with the version.
6. Open the folder → double-click **AnypointStudio.exe**.

Notes:

- The instructor uses version **7.12**; a newer version (e.g. 7.17) is fine — differences are mostly Java/performance related.
- Older versions required installing Java and Maven separately. Current versions have them **embedded** — just download, unzip and run.

*Screen:* Studio's project tree showed **Mule Server 4.4.0 EE**, **JRE System Library [JDK 8 (Embedded)]** and **HTTP [v1.6.0]**.

*Slide* — **Anypoint Studio:** It is a user-friendly IDE( Integrated Development Environment) used for implementing and testing Mule applications. *Drawing:* MuleSoft → APIs & Integrations.

**Anypoint Studio** is a user-friendly integrated development environment used for implementing and testing Mule applications. Developers spend most of their time here.

---

## 11. MuleSoft Roles

| Role | Notes |
|---|---|
| Developer | Most openings ("thousands of jobs"); course focus |
| Admin | Very few openings. Creates users, gives permissions/roles, sets up environments. Usually done by **DevOps** or senior team members |
| Architect / Lead | Requires many years of experience |
| MuleSoft tester | A few roles; MuleSoft apps can also be tested by general API testers |
| Business Analyst | Generic role; gathers requirements |

*Drawing* (on the Anypoint Monitoring slide): "MuleSoft developer / Mule ESB developer"; MuleSoft → API & integrations, RPA, Composer, Databases(?); Studio → 7.x; Mule → **4.x** and 3.x. A **3.x app → Mule Migration Agent → 4.x** converts about **60–70%** automatically; the rest is manual.

---

## 12. Anypoint Platform Modules

The two main MuleSoft components: **Anypoint Platform** (web) and **Anypoint Studio** (IDE).

### 12.1 Anypoint Code Builder

- A newer IDE introduced recently.
- **Instructor's view:** it still needs more capabilities; about 99% of the industry currently uses Anypoint Studio.
- The course uses Studio.

### 12.2 Design Center

**Output: the API specification** — a detailed document of the API:

- request schema (data types — number, string, …) and request examples
- response schema and examples
- error response schema and examples
- resources and methods
- security

*Slide* — **Design Center:** Design API specifications using RAML(0.8 or 1.0) or OAS(2.0 or 3.0) · RAML – RESTful API Modelling Language · OAS – Open API Specification. *Drawing:* Design Center (APP) → supports RAML & OAS; 1.0 circled; OAS marked ✗ for this course, with "(Swagger)".

**Language:** **RAML** (RESTful API Modeling Language). Versions **0.8** (old) and **1.0**.

**Alternative:**
- **OAS** (OpenAPI Specification), formerly called **Swagger**.
- Design Center supports it too.
- Non-Mule projects (e.g. Spring Boot) mostly use OAS; MuleSoft projects mostly use RAML.

**Instructor's experience:**
- Has worked only with RAML.
- In one project the APIs were already designed in OAS and no changes were needed.
- Knowing RAML makes OAS easy to pick up — the concepts are the same with small syntax differences.
- In an interview, you can say that clearly.

Opening it: **Start designing** on the home page, or the menu (☰) → **Design Center**.

### 12.3 Anypoint Exchange

**A central repository** for MuleSoft resources. **Analogy:** like Microsoft SharePoint, where documents are kept in one place.

- Can store API specifications, connectors, APIs, examples, templates, policies, fragments, libraries.
- Anything saved in Exchange is an **asset**. Saving to Exchange is called **publishing**.
- Assets can be shared with multiple developers and team members.
- Exchange shows both **MuleSoft-provided assets** and **your organisation's assets** (the company name given at sign-up).
- Opening it: **Discover and share** on the home page, or menu → **Exchange**.

*Slide* — **Anypoint Exchange:** Central repository to share Mulesoft resources such as API specifications, Connectors, Templates, Examples etc. within or outside organization. *Screen:* **All assets** listed MuleSoft connectors (Salesforce, Slack, HTTP, Database, Workday…); the organisation's own root showed two API specs.

### 12.4 Runtime Manager

> Used to **deploy and manage applications** from one central location.

- An app running on your laptop can't be accessed by others. It must be deployed to a server — e.g. **CloudHub**.
- In Runtime Manager you give the application name, upload the JAR file and deploy.
- Operations: **deploy, start, stop, restart**, view **logs**, basic statistics.
- Manages apps running on cloud, hybrid and on-premises.

*Slide* — **Runtime Manager:** It is used to deploy and manage all your applications from one central location, whether your apps are running on cloud or on-premises (edited live to "cloud or hybrid").

*Screen* — **Deploy Application** (Sandbox): application name, Deployment Target **Shared Space (CloudHub 2.0)**, Application File (choose JAR); Runtime tab — Release Channel **Edge**, Runtime Version **4.8.1:6e**, Java Version **Java 8** / Java 17, Replica Count **1**, Replica size **0.1 vCores**, Deployment model **Rolling update**. The Applications list showed apps on CloudHub with runtime 4.8.0.

### 12.5 API Manager

Manages APIs (that reside in Exchange):

- applies **policies** to secure APIs — all policies are applied here,
- **alerts** for failures,
- **SLAs** (Service Level Agreements).

*Slide* — **API Manager:** It helps to manage APIs that reside in Exchange · Manage policies, alerts, clients, SLAs. *Screen:* an API's **Policies** page (Automated policies; API-level policies → Add policy).

**SLA example (Netflix/Prime analogy):** a free tier can send up to 1,000 requests per day; a premium tier up to 10,000. API Manager lets you treat the two groups differently.

### 12.6 Anypoint Monitoring

*Slide:* Monitor the performance of APIs such as CPU usage, Memory usage etc. *Screen:* Monitoring → "Using built-in dashboards" (choose environment and resource).

Monitors memory usage, CPU, performance, requests and responses. Runtime Manager shows minimal monitoring; Anypoint Monitoring gives more detail through dashboards (select the API and environment).

### 12.7 Others

| Module | Notes |
|---|---|
| Visualizer | Similar to monitoring with extra features; used by leads/architects, not developers (instructor has never used it as a developer) |
| Data Graph | Instructor has never used it |
| API Governance | Mentioned only |
| Access Management | Admin activity: create users, give permissions, create environments (Dev, SIT, UAT, Prod) |
| Secrets Manager | Stores certificates; seen again with HTTPS. Mostly accessed by senior people |

**Developers mainly use:** **Design Center, Exchange, API Manager and Runtime Manager.**

---

## 13. Other Software

- **Postman** — main testing tool (SoapUI is an alternative).
- **Notepad++** — download and use.
- MySQL Workbench / database, FTP server, ActiveMQ — installed when their sessions arrive.

---

## 14. Practice Task — Hello World Application

For students without a database:

```text
New Mule project (e.g. hello-world)
   HTTP Listener   (default config, path e.g. /hello)
   Set Payload     value: "Hello World"
   Logger
```

Send a request from Postman → response "Hello World".

*Screen* — the instructor built it at the end of class: project **hello-world-demo-app**, flow `hello-world-demo-appFlow` = Listener (`HTTP_Listener_config`, path **`/helloworld`**) → Set Payload → Logger. Two errors came up while switching apps:

| Postman result | Cause |
|---|---|
| **404 Not Found** — `No listener for endpoint: /helloworld` | The old `db-select-demo` app was still the one running on 8081 |
| `Error: connect ECONNREFUSED 127.0.0.1:8081` | Sent while the runtime was restarting — nothing listening on 8081 yet |

After redeploying, the console showed `hello-world-demo-app … DEPLOYED`.

Then practise:

- debug it and inspect payload, attributes, variables,
- add a **Set Variable** and check it in the debugger,
- create a variable with **Transform Message → Add new target**,
- observe how components overwrite the payload.

(If a project with the same name already exists, Studio shows an error.)

---

## 15. Important Terminology

| Term | Meaning |
|---|---|
| Mule event | Object carrying data through a flow: message + variables (+ error) |
| Mule message | Payload + attributes |
| Payload | Main data; HTTP body becomes the payload |
| Attributes | Metadata: headers, query params, URI params, method, path … |
| Variables (`vars`) | Values created inside the flow; start empty; persist through the flow |
| Overwrite | A connector replacing payload/attributes with its own output |
| Expression mode (fx) | Field mode for writing DataWeave |
| Evaluate expression (x+y) | Debugger tool to test expressions |
| Set Payload / Set Variable / Remove Variable | Components to set payload / create / remove a variable |
| Transform Message | DataWeave component that can set payload, variables and attributes |
| Target | Where Transform Message's output is written (payload, variable, attribute) |
| Asset / publish | Item in Exchange / saving it to Exchange |
| SLA | Service Level Agreement — tiered limits for consumers |

---

## 16. Interview Questions

### Q1. What is a Mule event? What does it contain?
The object processed by the Mule runtime as it travels through a flow. It contains the **message** (payload and attributes), **variables**, and **error** information when an error occurs.

### Q2. What does the HTTP Listener do?
Receives the HTTP request, converts it into a Mule event (body → payload; headers, query and URI params → attributes) and passes it to the next processor. At the end of the flow, it converts the Mule event back to an HTTP response.

### Q3. Where do query parameters and headers go in the Mule event?
Into **attributes**: `attributes.queryParams`, `attributes.uriParams`, `attributes.headers`.

### Q4. Do variables come from the incoming request?
No. Variables are always empty at the start; they are created inside the flow (Set Variable or Transform Message).

### Q5. Why do we need variables?
Payload and attributes can be overwritten by connectors such as Database or HTTP Request. Values needed later are stored in variables, which persist through the flow.

### Q6. How do you access payload, query params, headers and variables?
`payload.field`, `attributes.queryParams.name`, `attributes.headers.'header-name'`, `vars.name`. All are case-sensitive.

### Q7. Difference between Set Payload and Transform Message?
Set Payload sets only the payload. Transform Message can set payload, variables and attributes, and is used for complex transformations.

### Q8. How can you create a variable?
With the Set Variable component, or in Transform Message using "Add new target" → Variable.

### Q9. What is the scope/lifetime of a variable?
Until the end of the flow/event processing, unless removed with Remove Variable or overwritten.

### Q10. What is Anypoint Exchange?
A central repository where API specifications, connectors, templates, examples and other assets are published and shared across teams.

### Q11. What is the difference between Runtime Manager and API Manager?
Runtime Manager deploys and manages applications (start/stop/logs). API Manager manages APIs — applying policies, SLAs and alerts.

### Q12. RAML vs. OAS?
- Both are API specification languages.
- RAML is most common in MuleSoft projects; OAS (formerly Swagger) is common elsewhere.
- Design Center supports both.

---

## 17. Must Remember

1. **Listener converts HTTP request → Mule event**, and Mule event → HTTP response at the end.
2. **Mule event = message (payload + attributes) + variables (+ error).**
3. **Body → payload; headers/query/URI params → attributes; variables start empty.**
4. Syntax: `payload`, `attributes.queryParams.x`, `attributes.uriParams.x`, `attributes.headers.'x'`, `vars.x` — **case-sensitive**; header keys are lower case.
5. Connectors **overwrite payload and attributes**; save needed values in **variables before** the connector.
6. Variables live until the flow ends unless removed (Remove Variable).
7. **Set Payload** (payload only), **Set Variable** (one variable), **Transform Message** (payload, variables, attributes).
8. Without `output application/json`, values stay Java; without conversion the HTTP response fails.
9. Developer's main Anypoint modules: **Design Center, Exchange, Runtime Manager, API Manager**.
10. Studio: download ZIP, extract to a short path, run the EXE (Java/Maven embedded); trial account ≈ 30 days.
