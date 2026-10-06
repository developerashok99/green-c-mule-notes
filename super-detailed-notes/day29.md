# Day 29 — Masking, Reading Documentation, Creating the MySQL Table, Database Configuration and Testing the POST Flow

> **Sources:**
> - Audio transcript, existing notes, and the class video (recorded 16 Dec 2024).
> - Code, configuration and output marked *screen* are read from the recording.
> - Slide images: [slides/day29](../slides/day29/).

## 1. Overview

1. The DataWeave **`mask`** function (import from `dw::util::Values`)
2. Masking once in the JSON Logger global configuration
3. How to approach MuleSoft documentation
4. Databases: RDBMS vs. NoSQL; SQL dialects
5. Creating the database and table, inserting and selecting in MySQL Workbench
6. Connectivity: local DB vs. CloudHub
7. Environment mismatches between Mule and the DB team
8. Database configuration in `global-config`, reconnection strategy
9. **Service accounts** vs. root/human accounts
10. Global properties for local testing
11. Insert query with **input parameters**
12. Testing: duplicate key, DB down, reconnection

---

## 2. Masking with DataWeave

### 2.1 Example

The request contains a mobile number and a member ID that must not appear in logs.

*Screen — reference project's Start Logger (core Logger, `transaction-sapi`):*

```dataweave
%dw 2.0
import * from dw::util::Values
output application/json indent = false
---
{
  "applicationName": app.name,
  ...
  "memberId": vars.requestPayload.memberId,
  "requestpayload": (vars.requestPayload mask field("mobileNumber") with "********" mask field("memberId") with "********"),
  "startTime": vars.StartTime,
  "tracePoint": "START",
  "message": "post members transactions flow started"
}
```

### 2.2 Import the library

`mask` is not available by default. Like adding a module in Studio, you **import** the DataWeave library that contains it:

```dataweave
%dw 2.0
import * from dw::util::Values
output application/json
---
payload mask field("mobileNumber") with "*****"
```

> **Technical clarification:** the module is `dw::util::Values` (capital V). Syntax: `<value> mask field("<key>") with <replacement>`.

*Screen — DataWeave Playground:* without the import the output is `Unable to resolve reference of: mask` (and of `field`; `vars` doesn't exist in the Playground either, so the class switched to `payload`). With the import and payload `{"message": "Hello world!", "mobileNumber": "1234567890", "memberId": "1234"}`:

```dataweave
%dw 2.0
import * from dw::util::Values
output application/json
---
{
  "requestpayload": (payload mask field("mobileNumber") with "#####" mask field("memberId") with "#####")
}
```

→ `{"requestpayload": {"message": "Hello world!", "mobileNumber": "#####", "memberId": "#####"}}`.

### 2.3 Masking several fields

The result of one `mask` is the input to the next — use brackets so the order is clear:

```dataweave
(payload mask field("mobileNumber") with "*****")
    mask field("memberId") with "*****"
```

The field name must match the key in the payload exactly; a wrong name doesn't mask.

### 2.4 Mask once — JSON Logger global configuration

- Writing `mask` in 50 of 100 loggers is repetitive.
- The **JSON Logger global configuration** has a field for **fields to mask** (comma-separated: `mobileNumber,memberId`).
- Since every JSON Logger uses that configuration, masking applies everywhere.

> *Screen:* this was explained only; the class project uses the core Logger, where `mask` goes in the message expression.

> Once at global level vs. 50 times in loggers — once is better.

**Instructor's observation:** JSON Logger is a custom logger; an **enterprise integration team** in many organisations builds such custom loggers and adds features like this. If not available, use the DataWeave `mask` function.

---

## 3. How to Read MuleSoft Documentation

**Student question:** how do you know `mask` is in `dw::util::Values`?

Search the **DataWeave functions documentation**; the instructor didn't remember the library either and looked it up.

**Instructor's advice:**

- Official documentation is confusing at first — "of 100 people reading it, maybe 5 understand".
- Start with easier material: **DZone** articles by developers/architects, YouTube videos (including MuleSoft's channel).
- Build up step by step; aim to understand the official documentation within **3–4 months**.
- When you need a new function, search the official docs and its examples to find which library to import.

---

## 4. Databases — Basics

> A **database** stores data **permanently**.

| Type | Data | Examples |
|---|---|---|
| **RDBMS** (Relational) | Structured data in tables | Oracle, Microsoft SQL Server, MySQL |
| **NoSQL** | Unstructured / objects | MongoDB |

**SQL dialects:** MySQL SQL and Oracle SQL are 90–95% the same with small differences (different vendors) — unlike Java vs. .NET, which differ a lot.

**How much DB knowledge do you need?**
- Basic commands (create table, insert, select, update, delete).
- The DB team usually creates users, databases and tables.
- For a new requirement, search and learn.
- **Instructor:** "I can manage to a medium level; if interested, learn more."

One database **server** can host many logical **databases**.

---

## 5. Creating the Database and Table (MySQL Workbench)

- Run a statement: select it → **Execute** (lightning icon).
- Result panel: green = success; red = error.
- SQL keywords aren't case-sensitive; table/column names may be.

### 5.1 Database

```sql
CREATE DATABASE mule12;      -- "1 row(s) affected"
-- running again → error: "Can't create database 'mule12'; database exists"
USE mule12;
```

### 5.2 Table

*Screen — the class DDL:*

```sql
CREATE TABLE `EMPLOYEES_INFO` (
  `emp_id` int NOT NULL,
  `emp_name` varchar(255) DEFAULT NULL,
  `emp_status` varchar(20) NOT NULL,
  `emp_salary` double DEFAULT NULL,
  `emp_designation` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`emp_id`)
)
```

| Column | Type | Notes |
|---|---|---|
| emp_id | int, NOT NULL | **Primary key** — every employee must have one |
| emp_name | varchar(255), default NULL | Left nullable to show the difference (normally mandatory) |
| emp_status | varchar(20), NOT NULL | |
| emp_salary | double, default NULL | Accepts decimals (e.g. 20000.20); only numbers |
| emp_designation | varchar(50), default NULL | |

**Primary key:**

1. Can't be null — a record without EMP_ID isn't inserted.
2. Must be **unique** — inserting the same EMP_ID again fails.

### 5.3 Insert and select

```sql
SELECT * FROM EMPLOYEES_INFO;     -- empty initially

INSERT INTO EMPLOYEES_INFO VALUES (120, 'ravi', 'active', 80000, 'software engineer');

SELECT * FROM EMPLOYEES_INFO;     -- 120 | ravi | active | 80000 | software engineer
```

*Screen — Workbench output panel:*
- A very long name (`'ravi qqqq…'`) → `Error Code: 1406. Data too long for column 'emp_name' at row 1`.
- A wrong table name → `Error Code: 1146. Table 'mule12.employee_info' doesn't exist`.

Without DB access, **ask the DB team** for table name, column names, data types and maximum lengths.

---

## 6. Connectivity

**Question:** with my host, port, user, password and DB name, can your Mule app connect to my database?

No — it's on my local machine; there's no network connection between your system and mine.

- Locally it works because both app and DB are on the same machine.
- On CloudHub, the app can't reach a DB on someone's laptop.
- **In real projects:** DB servers are in a shared location, and connectivity is set up between the DB location and CloudHub (e.g., via a private network). Then the app reaches the DB through that channel.

---

## 7. Property Files and Environment Mismatch

DB details must come from **property files** — each environment uses a different database. Hard-coding Dev values means changing them for SIT, UAT, Prod.

### Mismatch example

| Mule environments | DB environments |
|---|---|
| Dev, SIT, UAT, Prod | Dev, UAT, Prod |

- Prod ↔ Prod, UAT ↔ UAT, Dev ↔ Dev — but which DB does Mule SIT use (Dev or UAT)?
- **Discuss with the teams** and decide.
- Such mismatches happen in both directions.

---

## 8. Database Configuration

Create it in **global-config**. Values from properties (host `localhost`, port `330` — the instructor's MySQL port, as seen on screen in the Day 05 video; MySQL's default is 3306 — database `mule12`), username and password from **secure properties**.

*Screen — `dev.yaml` / `prod.yaml`:*

```yaml
#### MySQL Database Config Details #####
database:
  host: "localhost"
  port: "330"
  db: "mule12"          # was "mule8" (copied from the sys-app) until changed in class
  username: "![GLXPpiI1r4jRxD7uEXR5Iw==]"   # encrypted (as on screen)
  password: "![1rfh04McIxNQi/bKeObUKA==]"   # encrypted (as on screen)
```

*Screen — Database Config (MySQL Connection):* Host `${database.host}`, Port `${database.port}`, User `${secure::database.username}`, Password from the secure property, Database `${database.db}`; config name `MySQL80_Database_Config`.

Select the configuration in the POST Insert operation — it's available to the whole project.

### Reconnection

Use **Standard** (not Forever) — the request is mid-transaction; Forever could keep the caller waiting.

Forever only when nothing depends on the result: the connector is a **source**, or an **asynchronous** step at the end.

**Instructor's suggestion:** 3 attempts every 2 seconds (2000 ms). Architects may say otherwise (e.g., 5 attempts).

---

## 9. Service Accounts — Never Root or Human Accounts

**Who provides the username and password?** The DB team.

- **Not root.** Root can do everything (create, delete…).
  - The DB team creates a **user** with only the permissions needed (insert, update, select, delete…).
  - Extra permissions (e.g., create table) only if justified.
- In practice the class uses `root` — real projects never get root.

**Human vs. service accounts:**

- A DB user created for a person (e.g. "Mahesh") is accessible to him; if he resigns, it's removed and integrations break.
- A **service account** is a non-human account created for the application.

> For **application-to-application** (machine-to-machine) communication, **never use human accounts**. Always use **service accounts**.

---

## 10. Global Properties for Local Testing

- `mule.env` and `secure.key` are normally passed in the Run Configuration.
- Alternatively create **Global Property** elements (Global Elements → Create → Global Property) — in class a `secure.key` global property was created (and `mule.env` can be set the same way).
- They're picked up whether or not a run configuration is used.

**Remove these global properties before pushing code to Bitbucket/GitHub** — they're only for local testing.

**Live issue (screen):** *Test Connection* on the Database Config failed with `Couldn't find configuration property value for key ${mule.env}` — Studio's design-time tooling doesn't see run-configuration arguments. Fix: Global Elements now list **Global Property `mule.env`** and **Global Property `secure.key`**.

- The encrypted values had been copied from the sys-app, so the instructor wasn't sure which key encrypted them (*"I think I took it from the Sys app"*).
- They checked in the **Secure Properties Generator** (`secure-properties-api.us-e1.cloudhub.io`, Operation **Decrypt**, AES, CBC): decrypting with the sys-app key gave back the expected username and password, so the same key went into `secure.key`.
- The key can also be added under Debug/Run Configurations → Environment → New Environment Variable `secure.key`.
- Keep track of keys.

> **Values as shown on screen** (2024 demo setup, now expired):
>
> | Where | What it is | Value |
> |---|---|---|
> | Secure key (Global Property / env var `secure.key`) | 16-character AES key | `ABCD1234DEFG5678` |
> | `database.username` in yaml | `![<base64 ciphertext>]` | `![GLXPpiI1r4jRxD7uEXR5Iw==]` |
> | `database.password` in yaml | `![<base64 ciphertext>]` | `![1rfh04McIxNQi/bKeObUKA==]` |
> | Decrypted username | DB user | `root` (the class used the MySQL root user — see §9) |
> | Decrypted password | DB password | `Vision@2022` |
>
> Decrypt check in the generator: Operation **Decrypt**, Algorithm **AES**, State **CBC**, Key `ABCD1234DEFG5678`, Value `GLXPpiI1r4jRxD7uEXR5Iw==` → Result `root`.

---

## 11. Insert Query with Input Parameters

*Screen — Insert "Create Employee Record in HR DB"* (connector config `MySQL80_Database_Config`):

```sql
insert into EMPLOYEES_INFO values (:emp_id,:emp_name,:emp_status,:emp_salary,:emp_designation);
```

**Input parameters** (fx / expression mode), as in the sys-app reference:

```dataweave
{
  "emp_id": payload.empId,
  "emp_name": payload.empName,
  "emp_status": if(payload.active == true) "active" else "inactive",
  "emp_salary": payload.empSalary,
  "emp_designation": payload.empDesignation
}
```

- The **keys** in input parameters must match the **`:placeholders`** in the query.
- **Good practice:** use the **same names as the DB columns** — with 50–100 columns, no confusion.
- Input parameters must be in **fx (expression) mode** — `payload.x` is an expression; without fx it doesn't work.
- If Studio shows lingering errors after edits, delete and re-add the component.

### A custom error

- The reused error handler included an On Error Propagate for type `DATABASE:NO_DATA_FOUND` (to be raised later with Raise Error in the GET flow).
- *Screen:* the app then **failed to deploy** — `Could not find ErrorType for the given identifier: 'DATABASE:NO_DATA_FOUND'`, status FAILED.
- A custom type can't be referenced in a handler until something in the app can raise it.
- The fix in class: comment out that `<on-error-propagate>` block (`<!-- … -->`) in `common-error-handler.xml`; the app then started (plugins Database 1.12.1, Sockets 1.2.2, secure-properties 1.2.7, HTTP 1.6.0, APIKit 1.5.11; `mysql-connector-java-5.1.48.jar`).

---

## 12. Testing the POST Flow (Debug)

Postman: `POST http://localhost:8081/api/employees` with headers and body:

```json
{ "empId": 1000, "empName": "Suresh", "empSalary": 80000, "active": true, "empDesignation": "software engineer" }
```

*Screen:* **201 Created** — `{"statusCode": 201, "message": "employee details created successfully in the db"}`.

1. Request arrives; variables: headers saved, query params empty, **start time** set.
2. APIkit Router validates and routes to POST.
3. JSON Logger prints: "post employees flow started", trace point START, start time.

### Scenario 1 — duplicate key

The same request again (empId 1000 now exists). *Screen — debugger and console:*

```text
Message    : Duplicate entry '1000' for key 'employees_info.PRIMARY'
Error type : DB:QUERY_EXECUTION
```

(exception `MySQLIntegrityConstraintViolationException`). Matched by the **DB:BAD_SQL_SYNTAX, DB:QUERY_EXECUTION** On Error Propagate → **400 Bad Request**, `{"statusCode": 400, "message": "Duplicate entry '1000' for key 'employees_info.PRIMARY'"}`.

If no specific handler matched, **ANY** (at the end) would handle it.

### Scenario 2 — DB down

MySQL80 service stopped (Windows Services) → "Could not obtain connection from data source" → handled by the **DB:CONNECTIVITY** On Error Propagate (Error Logger + Transform `{"statusCode": 500, "message": error.description}`) → *screen:* **500 Server Error**, `{"statusCode": 500, "message": "Could not obtain connection from data source"}`.

### Scenario 3 — reconnection

1. Breakpoint at the start of the POST implementation; send the request; **Resume** to the breakpoint.
2. With the DB still down, step to the Insert — reconnection attempts start.
3. Start the MySQL service during the attempts.
4. A later attempt connects → the record is **inserted**. No duplicate error, because the earlier failed attempt hadn't inserted anything.

*Screen:* the retried request (empId 1001) went through After HR DB Logger → Create Employee Final Response; Workbench then showed rows 120 ravi, 1000 Suresh, 1001 Suresh.

### Next

HTTPS, consuming services, and policies.

---

## 13. Important Terminology

| Term | Meaning |
|---|---|
| `dw::util::Values` | DataWeave module containing `mask` |
| `mask field(...) with ...` | Replace a field's value |
| DZone | Developer article site |
| RDBMS / NoSQL | Relational / non-relational databases |
| Primary key | Unique, non-null identifier column |
| MySQL Workbench | UI for MySQL |
| Service account | Non-human account for app-to-app access |
| Root user | Full-permission DB account |
| Global Property | Global element defining a property value |
| Input parameters | Values bound to `:placeholders` in DB queries |
| DB:QUERY_EXECUTION / DB:CONNECTIVITY | DB connector error types |

---

## 14. Interview Questions

### Q1. How do you mask a field in DataWeave?
`import * from dw::util::Values` then `payload mask field("fieldName") with "****"`; chain for multiple fields.

### Q2. How can masking be applied consistently in logs?
Configure the fields to mask in the JSON Logger global configuration, applying to all loggers.

### Q3. Why use input parameters in DB queries?
Values come dynamically from the request; parameters map cleanly to `:placeholders` (best practice compared with concatenating values into SQL).

### Q4. What account should a Mule app use to connect to a database?
A service account with only the needed permissions — never root or a personal account.

### Q5. What happens if you insert a duplicate primary key?
The DB rejects it with a DB:QUERY_EXECUTION error (duplicate entry), which the error handler can map to 400.

### Q6. How do you test the reconnection strategy?
Stop the DB, send a request, start the DB during the retry window; a later attempt succeeds.

### Q7. Mule has 4 environments but the DB team 3 — what do you do?
Agree with the teams which DB environment each Mule environment uses.

---

## 15. Must Remember

1. `import * from dw::util::Values` → `payload mask field("x") with "****"`; chain with brackets.
2. Mask **once** in JSON Logger global config instead of in every logger.
3. Docs: start with **DZone/YouTube**, master official docs in 3–4 months.
4. DB basics: `CREATE DATABASE`, `USE`, `CREATE TABLE`, `INSERT`, `SELECT`; **primary key = unique + not null**.
5. Ask the DB team for table/column names, types, lengths.
6. Local DB isn't reachable from CloudHub; real projects set up network connectivity.
7. DB config in **global-config** with properties/secure properties; reconnection **Standard** (3 × 2 s).
8. **Service accounts** for app-to-app — never root/human accounts.
9. **Global properties** for local testing; remove before pushing code.
10. Insert with **input parameters** (keys = placeholders = column names, fx mode); tested duplicate key (400), DB down, reconnection success.
