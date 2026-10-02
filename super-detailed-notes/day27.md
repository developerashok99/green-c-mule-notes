# Day 27 — Implementing the Employee API: Project Structure, Global Config, Reused Error Handler, Database Connector and MySQL Setup

## 1. Overview

On Day 26 the scaffolded app was tested as-is. Now the real implementation starts, following best practices:

1. What each operation must do (POST insert, PATCH update, GET select)
2. Folders: **common** and **implementation**
3. **Global config** XML holding all global elements (and a Studio display glitch)
4. Reusing an **error handler** from another project
5. Deleting the **APIkit console** flow; flows can live in any XML file
6. Implementation XML per operation; private flows + **Flow Reference**
7. Database module: Insert / Update / Select; loggers around external calls
8. Copy-paste mistakes: duplicate flow names, missing SQL
9. Property files, connector naming, DB driver, secure properties
10. Installing **MySQL** and **MySQL Workbench**; services.msc
11. Domain projects recap (on-premises only)
12. Q&A: invalid token troubleshooting

---

## 2. What Each Operation Must Do

| Method | Implementation |
|---|---|
| POST | Receive an employee record → **insert** it into the database |
| GET | Receive the employee ID → **fetch** that employee from the database |
| PATCH | Receive updated details → **update** the employee in the database |

Implementation is **not** done in the main (scaffolded) file. For each operation, create an implementation file; the scaffolded flow calls it with a **Flow Reference**. The request goes to the implementation flow, and after processing, control returns to the main flow and the Listener sends the response.

---

## 3. Folder Structure

Right-click `src/main/mule` → **New → Folder**:

```text
src/main/mule/
├── hr-employees-sapi.xml        ← main flow + scaffolded resource flows
├── common/
│   ├── global-config.xml         ← all global elements
│   └── common-error-handler.xml  ← shared error handler
└── implementation/
    ├── post-employee.xml
    ├── patch-employee.xml
    └── get-employee.xml
```

**Why?** With 10 resources and their implementations all mixed together, it becomes unorganised and confusing. Common things in one place, implementations in another. Not mandatory — but it gives clarity.

---

## 4. Global Config

### 4.1 Idea

Each time you create a connector configuration (Listener, DB, …) it becomes a global element in whatever XML you're in. Over time they scatter. **Best practice:** keep **all global elements in one XML** — named e.g. `global-config` or `common-config`.

### 4.2 Steps

1. Right-click → New → **Mule Configuration File** → `global-config` (it may be created in `src/main/mule`; **drag it into `common`**).
2. Open the main XML → right-click → **Go to XML**. Find the **Listener config** (lines 3–5) and the **APIkit router config** (line 6). **Cut** (Ctrl+X).
3. In `global-config.xml` → Configuration XML → place the cursor inside `<mule> … </mule>` before the closing tag → paste.
4. **Save all.**

The Listener still finds its configuration — global elements are available to the whole project wherever they are.

### 4.3 Studio glitch

After moving, Studio showed "**name must be unique**" (as if the configs existed twice). Saving and refreshing didn't clear it. **Close and reopen the project** → fixed.

Also: **Project Explorer** didn't show files properly here; **Package Explorer** did.

From now on, create new global elements in `global-config`.

---

## 5. Reusing an Error Handler

Building the error handler again would take 20–30 minutes. Instead **copy** the error handler XML from a previous project:

1. In Package Explorer, select the error-handler XML in the old project → **Ctrl+C**.
2. Collapse all projects (minimise icon), expand the new project, select `common` → **Ctrl+V**.

It already has handlers for: bad request, not found, method not allowed, DB connectivity, DB SQL syntax, and a custom "DB – no data found" type; each with an error logger (`error.description`) and a Transform Message setting the payload and status (and reason phrase if required).

Adjust the error **payload structure** in Transform Message to this project's spec.

### Remove the generated error handler from the main file

Go to XML → delete the `<error-handler>` block (lines 17–96: click line 17, Shift+click line 96, delete). Reference the common error handler instead (per flow or as the default error handler — Day 16).

---

## 6. Delete the APIkit Console Flow

> **APIkit Console** is a web-based UI to interact with and test APIs, generated from the RAML.

We test with Postman, so the console flow isn't needed. The instructor deletes it.

### Flows don't have to stay in the main XML

The router sends requests based on the generated **flow name**, not file location. Moving a resource flow to another XML file still works.

---

## 7. Implementation Flows

### 7.1 POST first

Without data in the DB, update and fetch have nothing to work on, so implement POST first.

### 7.2 Steps

1. `implementation` → New → Mule Configuration File → `post-employee`.
2. Drag a **Flow** in; name it in **kebab-case**: `post-employee-implementation-flow`.
3. In the main XML's POST flow, drag a **Flow Reference** → select `post-employee-implementation-flow`. Rename it e.g. "Flow reference to post employee" — otherwise you can't tell where it goes without clicking.
4. Move the scaffolded **Transform Message** (example response) into the implementation (private) flow; rename it "Create employee final response".

### 7.3 Database operation

- Mule Palette → **Add Modules** → drag **Database** into the project.
- POST → **Insert**.
- The DB module has many operations; **90–95% of the time** only 4–5 are used (select, insert, update, delete…).

### 7.4 Loggers around external calls

```text
post-employee-implementation-flow
  Logger  "Before DB insert"           ← before external call
  Database Insert
  Logger  "After DB insert"            ← after external call
  Transform Message  (final response)
```

- A DB call goes **outside** the Mule application — an **external call**. Good practice: a logger **before** and **after** every external call.
- Plus a **start logger** and an **end logger** for the flow (the transaction starts and ends here).
- Many loggers for a small flow? Still worth it — logs show exactly where processing stopped.

### 7.5 PATCH and GET by copy-paste

- Copy the POST implementation XML → paste → rename to `patch-employee`; change the **operation to Update**, rename the flow, rename the final Transform Message ("Update employee final response").
- In the main PATCH flow: delete old components, add a Flow Reference to the patch implementation flow ("Flow reference to patch"). The URI-parameter variable Transform Message stays in the main flow (not needed later).
- GET: same, with **Select**.

### 7.6 Errors from copy-pasting

| Error | Cause | Fix |
|---|---|---|
| "Flow name should be unique" | Copied flow kept the same name | Rename each flow — names must be unique in the project |
| "Required element SQL query text is missing" | Query not written yet | Write the SQL in the operation |

Copy-paste builds structure quickly; you still must change names and fill the operation-specific configuration.

---

## 8. Properties, Connector Configuration and Security

### 8.1 Property files

`src/main/resources` → folder (e.g. `config`) → environment files. Listener values (host, port, path such as `/api/*`) stay externalised. Response timeout etc. can be set as needed; nothing to change for the APIkit router config.

### 8.2 Database configuration — name it well

From the implementation flow, click **+** next to the DB connector configuration. It's created as a **global element** — in `global-config`.

- **Name every connector configuration meaningfully**, e.g. `MySQL_HR_Database_Config`. Default names like "Database_Config" and "Database_Config_1" confuse people about which DB is used.
- Goal: neat work — a new person should understand quickly. Same reason for comment headings in property files.

### 8.3 Values from properties

- Use property keys for host, port, user, password, database: `${db.host}`, `${db.port}`, …
- Sensitive values (password, and per the instructor even host/port) go in the **secure** section → `${secure::db.password}`.
- Secure Properties module added via **Add Modules**; config with **AES / CBC**.
- **Don't accidentally change AES/CBC** (scrolling the mouse over the drop-down changed it). Algorithm and mode must match what was used to encrypt, or decryption fails.

### 8.4 JDBC driver

Required library — three options:

1. **Use local file** — a driver JAR (e.g. from colleagues).
2. **Maven dependency**.
3. **Add recommended libraries** — used here.

> The driver establishes the connection between Mule and the database.

After configuring, red marks remain until all details are entered. Another import error appeared — **closing and reopening** the project fixed it.

---

## 9. Setting Up MySQL Locally

### 9.1 In real projects

A **database team** configures the database, creates tables, and emails you host, port, database name, username and password. You put them in property files, test the connection, and report if credentials don't work.

### 9.2 In class — install yourself

- Run the **MySQL installer** (a downloaded archive) → Next → choose products → **Execute** → accept terms → **Install** (Visual Studio/Excel plugins not needed) → Finish.
- Installs the **MySQL Server** (database) and **MySQL Workbench** (UI).

### 9.3 Why a UI?

**Analogy:** in Flipkart you use the app (UI) to order; the data sits in back-end systems you never see. **MySQL Workbench** is the UI for MySQL — write select, insert, update, delete, create table. For Oracle, **SQL Developer**.

### 9.4 Database service

`services.msc` → MySQL service:

- running status; **Start / Stop / Pause / Restart**,
- **Startup type** (automatic at boot, or manual).

In real time the DB team manages this.

**Testing reconnection strategy (idea):** configure Standard reconnection (e.g. 3 attempts) on the DB config, stop the MySQL service, start it again in between — the first attempts fail, a later one succeeds. (Mentioned as a way to test; not demonstrated.)

### 9.5 Next steps

Create the database and table in Workbench, map records, write queries, test POST end-to-end (success and errors), then PATCH, then GET.

---

## 10. Domain Projects — Recap

**Question:** can the global config and common properties of this project be used in another project?

- Normally each project is independent.
- **On-premises:** a **domain project** can hold global/connector configurations; multiple applications inherit them.
- **Not** CloudHub or RTF: deployments are container-based — one worker is one isolated container with no communication between workers, so shared domains don't work.

---

## 11. Q&A — Invalid Token (400) When Calling an API

A student's case: OAuth token generated with client ID, client secret, grant type and scope; calling the API with it returns 400 / invalid token.

Checks:

1. Are client ID, secret, grant type and scope exactly what the provider specified?
2. Is the token sent **where and how** the provider specified (header name, format)? An extra or missing word like **`Bearer`** breaks it.
3. Has the token **expired**? E.g. valid for 1 hour, usable multiple times within that hour.
4. Is it a **one-time** token? Like an SMS OTP — the second use is invalid.

---

## 12. Important Terminology

| Term | Meaning |
|---|---|
| Implementation flow | Private flow with the actual processing |
| Flow Reference | Calls another flow |
| Global config | XML file holding all global elements |
| Common error handler | Shared error handler XML |
| APIkit console | Generated testing UI (deleted) |
| External call | Call leaving the Mule app (DB, HTTP…) |
| Insert / Update / Select | DB operations for create / update / fetch |
| JDBC driver | Library to connect to a DB |
| MySQL Workbench / SQL Developer | UIs for MySQL / Oracle |
| services.msc | Windows services manager |
| Domain project | Shared configs for on-premises apps |

---

## 13. Interview Questions

### Q1. How do you structure a Mule project's code?
Keep the scaffolded main/resource flows thin, use Flow References to implementation flows in separate XMLs, keep global elements in a global-config XML and shared error handling in a common error handler; keep properties in `src/main/resources`.

### Q2. Why put loggers before and after external calls?
To know from logs whether a call started and whether it completed — showing where a failure occurred.

### Q3. Must a resource flow stay in the same XML as the APIkit Router?
No. The router routes by flow name; the flow can be in any XML of the project.

### Q4. Which DB operations map to POST, PATCH, GET?
Insert, Update, Select.

### Q5. Why give connector configurations meaningful names?
So anyone can tell which system/config is used; default names like Database_Config_1 cause confusion.

### Q6. Can configurations be shared across apps on CloudHub?
No. Domain projects work only on-premises; CloudHub/RTF workers are isolated.

### Q7. How do you troubleshoot an "invalid token" error?
Verify the token-generation parameters, how the token is sent (header and Bearer format), expiry, and whether it's single-use.

---

## 14. Must Remember

1. POST → **Insert**, PATCH → **Update**, GET → **Select**; implement POST first.
2. Folders: **common** (global-config, error handler) and **implementation**.
3. **All global elements in global-config**; close/reopen the project if Studio shows stale errors.
4. **Reuse** a tested error handler; adapt payload structure; remove the generated one.
5. Delete the **APIkit console** flow; flows can live in any XML.
6. Scaffolded flow → **Flow Reference** → implementation flow (kebab-case, unique names).
7. **Logger before and after external calls**, plus start/end loggers.
8. After copy-paste: rename flows, fill SQL.
9. Name connector configs clearly; externalise DB details; secure sensitive ones; keep AES/CBC unchanged.
10. DB team normally provides DB details; locally use MySQL + Workbench; domain projects are on-prem only.
