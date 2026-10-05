# Day 05 — First Hands-On Mule Application: HTTP Listener → Database Select → JSON

> **Sources:** audio transcript, existing notes, and the class video (recorded 5 Nov 2024). Names, SQL, configuration values, errors and responses marked *screen* are read from the recording. Slide images: [slides/day05](../slides/day05/).

## 1. Overview

This session builds the first complete Mule application in Anypoint Studio and tests it with Postman.

Agenda:

1. The requirement: get employee details by employee ID
2. Creating a Mule project
3. HTTP Listener and its configuration (host, port, path)
4. Logger and why it is needed
5. Database connector: adding the module, MySQL configuration, JDBC driver, test connection
6. Writing a dynamic SELECT query
7. Transform Message: Java → JSON
8. Running the application and testing with Postman
9. Real errors encountered and how they were fixed
10. Run vs. Debug, breakpoints and the Mule Debugger
11. Q&A: `localhost` vs. real servers, firewalls, `telnet`, port uniqueness, GET with a body, why DB results are Java

*Slide — "Agenda for today":* what is HTTP request structure? · what is Mule event structure? · demonstration of MuleSoft application in APS · debug Mule application & Logger component · Set Variable component · Q&A session.

*Drawing — "HTTP Request":* ① body → important info ② headers ③ query parameters ④ URI parameters ⑤ URL (protocol + host + port + resource path) ⑥ method ⑦ authorization information. (Explained on Day 06.)

Account creation, Studio/Postman installation, the Mule Event and the full HTTP request structure are deferred to the next sessions.

> **Terminology:** in MuleSoft, **project**, **application** and **API** are used interchangeably depending on context. A "DB select demo" or an "ActiveMQ demo" are all called projects/applications.

---

## 2. The Requirement

> Send an **employee ID** and receive that **employee's details** from the employee database.

```text
Postman (acts as front-end)
     │  request: employee ID   (JSON)
     ▼
Mule API  (runs on HTTP)
     │  SELECT ... WHERE employee id = <id>
     ▼
Employee database (MySQL)
     │  employee row  (Java format)
     ▼
Mule API  converts to JSON
     │
     ▼
Postman: employee details (JSON)
```

Decisions made **before** building:

- Request format: **JSON**
- Response format: **JSON**
- Transport: **HTTP**
- Testing: **Postman**, because there is no front-end

Why JSON? It is **lightweight** and **widely accepted** by different systems — mobile apps, desktop applications, other services.

To build the request correctly you must understand the parts of an HTTP request — URL, query parameters, URI parameters, headers, body. These are covered in detail on Day 06.

---

## 3. Components Needed and Why

| Order | Component | Why |
|---|---|---|
| 1 | **HTTP Listener** | Listens for the incoming HTTP request and passes it into the Mule application |
| 2 | **Logger** | Prints "flow started" — needed to trace execution in production |
| 3 | (optional) **Transform Message** | Only if the request must be reshaped before the database call |
| 4 | **Database — Select** | Fetches the employee's row using the ID |
| 5 | **Logger** | Prints "query executed successfully" |
| 6 | **Transform Message** | Converts the Java result to JSON |
| 7 | **Logger** | Prints "process completed" |

The Database connector has many operations — **insert, select, update, delete**, etc. **Select** is used because we are fetching data. The Database connector gets its own 2–3 sessions later.

Software used: a **database** (MySQL), **Postman** for testing, **Anypoint Studio** for development.

---

## 4. Step 1 — Create the Project

1. **File → New → Mule Project**
2. Name: `db-select-demo` *(screen)* — the flow is created as `db-select-demoFlow` (a random name for now; naming conventions are covered later with a real use case)
3. Click **Finish**

Studio creates an empty project from a template with many folders and files. Studio uses **Maven** in the background to create this structure. The structure is explained in detail later (Day 08) — ignore it for now.

---

## 5. Step 2 — HTTP Listener

### 5.1 Adding it

- The **Mule Palette** on the right shows modules. **HTTP** is there by default.
- Click **HTTP** → drag **Listener** onto the canvas. A flow is created automatically with a generated name.
- Names used for this: HTTP module / HTTP connector / **Listener operation**.

### 5.2 Connector configuration

Click **+** next to *Connector configuration*:

| Setting | Value used | Explanation |
|---|---|---|
| Protocol | HTTP | |
| Host | Default **All Interfaces [0.0.0.0]** *(screen)* — `localhost` also works | Where the application is deployed. On your laptop it is localhost. On a real server it would be that server's IP (e.g. `10.1.2.50`) |
| Port | `8081` (default) | Any free port can be used: 8085, 8090, 8080, … |

**Address analogy:** to deliver a letter to a house you need its full address. Host + port + path is the full address of your API.

### 5.3 Path

In the Listener's general settings, set the **path**: `/empdetails` *(screen — Postman URL `http://localhost:8081/empdetails`)*.

Full URL to call the API:

```text
http://localhost:8081/empdetails
  │       │       │      │
  │       │       │      └── path (resource)
  │       │       └── port
  │       └── host
  └── protocol
```

Once deployed, any request sent to this URL is received by the Listener and passed to the next component.

---

## 6. Step 3 — Logger

- Search for **Logger** in the Mule Palette and drag it after the Listener.
- Message used: something like `DB select flow started`.

### Why loggers matter

In a **local** Studio you can debug step by step. In **production** you cannot attach a debugger. The only way to know what happened is the **logs**. If loggers are not placed, nothing is printed and you have no visibility.

**Logger placement as a diagnostic tool:**

```text
Logger "flow started"          ✔ printed
Database Select                ✘ failed here
Logger "query executed"        ✘ not printed
Logger "process completed"     ✘ not printed
```

If the second logger does not print, the failure is in the database step. Placing loggers at the right points with meaningful messages is an important development habit; a proper logging strategy is covered later.

---

## 7. Step 4 — Database Connector

### 7.1 Adding the module

- New projects include **HTTP** and **Sockets** modules by default. **Database is not included.**
- In the Mule Palette click **Add Modules** → drag **Database** into the module list. The Database module is now part of the project.
- Drag the **Select** operation into the flow.

### 7.2 Who provides database details?

In real projects a separate **database team** (DB administrators) provides:

- host, port
- username, password (a user created for the application)
- database name
- table names and column names

**If they don't give you these, you must ask. That is the developer's responsibility.**

In practice sessions, there is no database team, so MySQL is installed locally and everything is configured ourselves.

### 7.3 Connection configuration

Click **+** next to *Connector configuration*.

| Field | Value / explanation |
|---|---|
| Connection | **MySQL Connection** (Oracle → Oracle connection; Microsoft → Microsoft SQL Server connection) |
| JDBC Driver | Required library that lets the Mule application connect to the database. Click **Configure → Add recommended libraries**; Studio downloads the driver JAR and configures it |
| Host | Where the database server runs. Real projects: an IP like `10.1.25.50` or a hostname. Here: `localhost` |
| Port | **`330`** *(screen)* — the port the instructor's MySQL was installed on. (MySQL's default is **3306**; use whatever port your installation uses.) |
| User | `root` |
| Password | The password set when MySQL was installed |
| Database | **`mule11`** *(screen)* — `mule3` and `mule4` were tried first; `mule11` was created during the demo |

**Visual cue:** a **red** mark next to a field means it is **mandatory** and missing; the connector won't work until it is filled. It turns **green** once satisfied.

### 7.4 Test Connection

Click **Test Connection**.

- Success → MuleSoft can reach the database with these details.
- Failure → check the details. The instructor notes a failed test connection is a signal to debug; the actual runtime error at deployment is also informative.

---

## 8. Creating the Database and Table (MySQL Workbench)

**MySQL Workbench** is the UI used to work with MySQL; the database itself runs as a Windows service.

SQL run in Workbench *(screen)* (SQL syntax itself is covered in the database sessions):

```sql
CREATE DATABASE `mule11`;
USE `mule11`;

CREATE TABLE `EMPLOYEES_INFO` (
  `emp_id`          int          NOT NULL,
  `emp_name`        varchar(255) DEFAULT NULL,
  `emp_status`      varchar(20)  NOT NULL,
  `emp_salary`      double       DEFAULT NULL,
  `emp_designation` varchar(50)  DEFAULT NULL,
  PRIMARY KEY (`emp_id`)
);

INSERT INTO EMPLOYEES_INFO VALUES (120, 'ravi',   'true', 80000,  'software engineer');
INSERT INTO EMPLOYEES_INFO VALUES (104, 'Dinesh', 'true', 100000, 'Seniorsoftware engineer');
INSERT INTO EMPLOYEES_INFO VALUES (101, 'Hari',   'true', null,   'software engineer');

SELECT * FROM EMPLOYEES_INFO;
```

**A mistake seen in Workbench:** `select * from EMPLOYEE_INFO` (missing "S") → `Error Code: 1146. Table 'mule11.employee_info' doesn't exist`. The table name must match exactly.

---

## 9. Step 5 — The SELECT Query

### 9.1 Static vs. dynamic

```sql
select * from EMPLOYEES_INFO where emp_id = 120;   -- hard-coded: works only for 120
```

Should the ID be hard-coded or dynamic? **Dynamic.** The ID comes from the request sent by Postman.

### 9.2 Where does the ID come from?

- Postman sends the ID in the request **body**: `{ "empid": 120 }` *(screen)*.
- Inside the Mule application, the body is available as the **payload**.
- So the value is read as `payload.empid`.

### 9.3 How it is written (best practice)

The query uses a **named parameter**, and its value is supplied in the **Input Parameters** section of the Select operation:

*Screen — Select operation (connector configuration `Database_Config`):*

```sql
select * from EMPLOYEES_INFO where emp_id = :emp_id;
```

Input Parameters (fx):

```dataweave
{
  "emp_id": payload.empid
}
```

`:emp_id` in the query is filled from the `emp_id` key of the input parameters. Writing `payload.empid` directly inside the SQL string also works, but passing it as an input parameter is the **best practice**. The reasons are explained in the database sessions.

---

## 10. Step 6 — Transform Message (Java → JSON)

- The database result comes back in **Java** format.
- The consumer expects **JSON**.
- Drag **Transform Message** after the Select. Set the output to JSON:

```dataweave
%dw 2.0
output application/json
---
payload
```

Then add the final Logger, e.g. `DB select process completed successfully`.

The flow:

```text
┌─────────────────────────────── DB Select Demo flow ───────────────────────────────┐
│ Source:   HTTP Listener  (localhost:8081/empdetails)                              │
│ Process:  Logger → Select → Logger → Transform Message → Logger   (db-select-demoFlow) │
│ Error handling: (empty, created automatically)                                    │
└───────────────────────────────────────────────────────────────────────────────────┘
```

After the last component, control returns to the Listener (source), which sends the response to the caller.

---

## 11. Running the Application

### 11.1 Run vs. Debug

Right-click the project → **Run As / Debug As → Mule Application**.

| Run | Debug |
|---|---|
| Request → processing → response, without stopping | Execute **step by step** |
| You don't see intermediate states | You inspect what happens at each component |

What happens: Studio **builds** the project and deploys it to an **embedded Mule runtime** (a server that comes with Studio). The **Console** shows the deployment status — e.g. `DEPLOYED`.

Saving with **Ctrl+S** triggers an automatic build because "Build automatically" is enabled.

### 11.2 Testing with Postman

1. In Postman, click **+** for a new request.
2. Method: **GET** (as used in the demo).
3. URL: `http://localhost:8081/empdetails` — host and port separated by a colon, followed by the path.
4. **Body → raw → JSON**:

```json
{ "empid": 120 }
```

5. Click **Send**.

---

## 12. Errors Encountered During the Demo

This was real troubleshooting; each error teaches something.

### Error 1 — Request sent without a body

```text
You called the function 'valueSelector' with these arguments ...
```

**Cause:** the query expects the employee ID from the payload, but no body was sent.
**Fix:** send the ID in the body as JSON.

### Error 2 — Access denied

In Test Connection:

```text
Test connection failed — could not obtain connection from data source
Access denied for user 'root'@'localhost' (using password: YES)
```

At runtime the same problem returned **500 Server Error** in Postman, with this body *(screen)*:

```text
Cannot get connection for URL jdbc:mysql://localhost:330/mule11?logger=... :
Access denied for user 'root'@'localhost' (using password: YES)
```

The console showed **Error type: `DB:CONNECTIVITY`**, and only the first logger ("DB select flow started") had printed.

**Cause:** a wrong password in the database configuration (one digit was wrong).
**Fix:** correct the password; Test Connection then showed **"Test connection successful"**, and the request worked.

**Systematic check when a DB connection fails:**

```text
Host correct?  → Port correct?  → Username correct?
     → Password correct?  → Database name exists?  → Database running?
```

**Analogy:** like Gmail — if the username or password is wrong, it won't work no matter how many times you try. Every detail must be correct.

### Error 3 — Database not running

- MySQL runs as a Windows service. Check with **services.msc**.
- If the service is stopped, the error is different — a **communications link failure** — because there is no database to connect to.
- MySQL Workbench is just a UI; it is not the database. **The database service must be running.**

### Successful response

After fixing the password and redeploying:

Postman showed **200 OK** with *(screen)*:

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

The keys are the **table's column names**, and the result is an **array** containing one object — a Select always returns a list of rows (explained on Day 07 and Day 30).

The **Console** shows three `INFO` lines — one per logger:

```text
INFO  ... DB select flow started
INFO  ... DB select query executed successfully
INFO  ... DB select process completed successfully
```

In the failed attempts only the first logger had printed, showing the failure was at the database step.

---

## 13. Debugging Step by Step

### 13.1 Why debug?

This flow has only a few components. Real flows have 10–15 connectors and components. When something fails, stepping through shows exactly where.

### 13.2 How

1. Stop the running application.
2. Right-click the project → **Debug**.
3. Right-click a component → **Add breakpoint**.
4. Send the request from Postman. Execution **stops** at the breakpoint.
5. Open the **Mule Debugger** tab. Click **Next processor** to execute one component at a time.

   *Screen:* the **Variables and watches** panel lists the processor (e.g. `Select`), **`attributes`** (`HttpRequestAttributes`), **`correlationId`**, **`payload`**, **`rootId`** and **`vars`** (`size = 0` — no variables yet).

Observations:

- A component that hasn't executed yet is shown with a **dotted line** around it.
- After the Logger executes, its message appears in the Console.
- After the Database Select executes, the debugger shows the **payload** — a list of records in **Java** format. Expanding index `0` shows the employee's fields.
- After Transform Message executes, the payload's **media type** shows `application/json` — proof the conversion happened.
- When the flow ends, the response goes back via the Listener (source) to Postman.

Breakpoints can be placed on any component, including the source. **Remove breakpoint** → the flow runs fully even in Debug mode.

### 13.3 Experiment — remove Transform Message

The instructor deleted the Transform Message (right-click → Delete), saved, and resent the request.

```text
java.lang.RuntimeException: Attempted to send invalid data through http response.
→ Postman: 500 Server Error
```

**Reason:** the payload is still a Java object; the Listener cannot send it as a valid HTTP response body, and the consumer expects JSON anyway.

**Lesson:** the request format, response format and error response must be agreed with business analysts, architects and leads **before** development (the design step). When that is clear, the developer's job is straightforward. Adding the Transform Message back fixed the problem.

---

## 14. Questions Discussed

### Q. You used `localhost` for the database. If we deploy to CloudHub, will it still work?
No.

- `localhost` works only because the Mule application and MySQL are **on the same laptop**.
- **CloudHub** is MuleSoft's cloud. Suppose the app is deployed in the **US region** and the database is in a **Mumbai** data centre. They are on different networks; the app cannot reach "localhost" in Mumbai.
- To connect, the **firewall/port openings** between the two networks must be done. This depends on the enterprise network.
- The database team provides the real host, port, database name, username and password. The instructor's drawing: app on **CloudHub (US region)** → Emp DB in the **Mumbai DC**, with the DB team giving host **10.1.25.50**, port **8090**, DB **mule10**, user and password.
- If the app is deployed to CloudHub without connectivity, the **application deploys and runs**, but requests that need the database fail with a connectivity error.

### Q. Same question for on-premises?
Even on-premises, the Mule application may be on **Server 1** and the database on **Server 2** within the same enterprise network. The network team must establish connectivity between them; then you configure the real IP, port, username and password.

### Q. How do we know if connectivity to a database server is open?
Use **telnet** from the machine where the app runs (Windows command prompt):

```text
telnet <server-ip> <port>
e.g.  telnet 10.1.2.5 8801
```

| Result | Meaning |
|---|---|
| Blank screen | Connection established — network path is open |
| "Could not open connection" / not connected | No connectivity from this system to that server |

If not connected: inform your **team lead** and raise a request with the **network team** with the necessary approvals. Opening connectivity usually takes **one or two days**. (The telnet client must be enabled on Windows; it was not enabled on the instructor's machine.)

### Q. Why is there an "Error handling" section in the flow even though we didn't add one?
It is created automatically. Every flow has three parts: **Source**, **Process** and **Error handling**. Explained later.

### Q. Who decides the Listener's host and port? The database's host and port?
- Database host/port/credentials → **database team**.
- Listener host/port → your API; decided based on the requirement and deployment target (on-premises or CloudHub). Which ports to use on CloudHub (e.g. 8081 vs. 8091) is covered in deployment sessions.

### Q. Can the Listener use the database's port?
No. **One port can be used by only one active application at a time.** MySQL is already using its port (330 on the instructor's machine, 3306 by default); using it again fails with "port already in use".

**Analogy:** if two houses on a street had the same house number, a parcel could not be delivered correctly. A port must be a unique address. That's why 8081 was used.

### Q. How did Postman reach the API? Do Postman and Studio need to be linked?
No linking is needed. They are independent software. The application runs on the embedded server on your laptop (your laptop is the server: `localhost`). Postman sends an HTTP request to `localhost:8081/empdetails`; if host, port and path match the Listener and the app is running, the Listener receives it. If the port is wrong, it fails. A colleague on a different laptop cannot call your localhost unless there is network connectivity. An app deployed to CloudHub is reachable over the internet.

### Q. You used GET but sent a body. Isn't GET only for fetching?
**There is no strict rule that GET cannot have a body, but it is not recommended.**

The instructor changed the method to **POST** and even **DELETE** and resent — the response still came back. **Reason:** no **allowed methods** restriction was configured in the Listener, so it accepts any method. When and how to use and restrict methods is covered next session.

### Q. Why does the database return Java and not JSON?
The database connectivity is built on Java (JDBC), so results come as Java objects. The consumer sends and expects JSON. The two don't "speak the same language" — that is exactly why **integration/mediation platforms** exist. A single request may need several systems, each expecting a different format (XML, Java, CSV …). The mediation platform receives one format, converts for each system, and builds the final response.

---

## 15. What Happens to the Request Inside Mule (Preview)

```text
HTTP request (method, URL, headers, query params, body …)
        │
        ▼  HTTP Listener converts it
Mule event
   ├── payload     ← the HTTP body
   ├── attributes  ← headers, query params, method, path …
   └── variables
```

The HTTP request structure, the Mule event, and exactly how the Listener maps one to the other are explained in the next sessions (Days 06–07).

---

## 16. Important Terminology

| Term | Meaning |
|---|---|
| Mule project / application / API | Used interchangeably |
| Mule Palette | Panel listing modules and their operations |
| HTTP Listener | Source component that receives HTTP requests |
| Connector configuration | Reusable connection settings (e.g., host/port for HTTP; DB details) |
| Host | Machine where the app (or DB) runs; `localhost` = this machine |
| Port | Number identifying an application on a host; must be unique per active app |
| Path | Resource part of the URL, e.g. `/empdetails` |
| Logger | Writes messages to the log/Console |
| Database connector | Module for DB operations (select, insert, update, delete) |
| JDBC driver | Library that lets the app connect to a specific database |
| Test Connection | Verifies connector configuration |
| Transform Message | Runs a DataWeave script to transform data |
| Payload | The main data of the message; the HTTP body becomes the payload |
| Embedded runtime | The Mule server bundled in Studio, used for local runs |
| Run / Debug | Execute fully / execute step by step |
| Breakpoint | A point where execution pauses in Debug mode |
| Mule Debugger | Studio view to step through and inspect the message |
| telnet | Command to test network connectivity to host:port |

---

## 17. Interview Questions

### Q1. Which components are needed for an API that returns DB data as JSON?
HTTP Listener (source), Database Select operation with a DB configuration, Transform Message to convert Java to JSON, and Loggers at key points.

### Q2. Why do we use Logger?
To trace execution through logs, especially in deployed environments where debugging is not possible. If a logger doesn't print, you know where the flow failed.

### Q3. What is the JDBC driver used for in the Database connector?
It is the library that enables the Mule application to connect to a particular database (MySQL, Oracle, SQL Server). Studio can add it via "Add recommended libraries".

### Q4. Why should query values be passed as input parameters instead of hard-coded?
Values must be dynamic (from the request), and passing them as parameters is the recommended practice compared with concatenating them into the SQL string.

### Q5. Why does the database response need a Transform Message?
The Database connector returns Java objects; consumers expect JSON (or another agreed format). Without conversion the HTTP response fails with "invalid data" (500).

### Q6. Difference between Run and Debug?
Run executes the flow end to end. Debug lets you set breakpoints and execute one processor at a time, inspecting the payload and other data.

### Q7. Why doesn't `localhost` work for a database after deploying to CloudHub?
`localhost` refers to the machine the app runs on. In CloudHub the app runs on MuleSoft's servers; the database is elsewhere. Use the real host and establish network/firewall connectivity.

### Q8. How do you check network connectivity to a database server?
`telnet <ip> <port>`. A blank screen means connected; otherwise ask the network team to open the connectivity.

### Q9. Can two applications listen on the same port?
No. A port can be used by only one active application at a time.

### Q10. If the Listener receives a POST but you expected GET, will it fail?
Not unless allowed methods are configured on the Listener. Without restriction it accepts any method.

---

## 18. Must Remember

1. Flow: **Listener → Logger → DB Select → Logger → Transform (Java→JSON) → Logger**.
2. URL = `http://localhost:8081/empdetails` = protocol + host + port + path.
3. HTTP and Sockets modules are default; **Database must be added via Add Modules**.
4. DB config: connection type, **JDBC driver** (Add recommended libraries), host, port (330 here, MySQL default 3306), user, password, database (`mule11`).
5. Query values should be **dynamic** and passed as **input parameters**.
6. DB results are **Java**; convert with Transform Message (`output application/json`).
7. Loggers are your eyes in production; their order tells you where a failure occurred.
8. Failures: wrong password → *access denied*; DB stopped → *link failure*; no body → *valueSelector* error; no transform → *invalid data* 500.
9. **Debug**: breakpoint → Mule Debugger → Next processor; dotted line = not executed yet.
10. **localhost only works locally**; real servers need firewall/network openings (check with `telnet`); **ports must be unique**.
