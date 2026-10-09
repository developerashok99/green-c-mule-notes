# Day 46 — Salesforce Connector Part 1: CRM Basics, Trial Org, Objects and Fields, Basic Auth Connection and a SOQL Query (Hands-On)

> **Sources:**
> - Cleaned audio transcript ([transcripts-cleaned/day46.txt](../transcripts-cleaned/day46.txt)) and the class video (recorded 13 Jan 2025).
> - Text marked *screen* is read from the recording.
> - Slide images: [slides/day46](../slides/day46/).

## 1. Overview

1. Why a Salesforce connector
2. What Salesforce is — **CRM**, the customer journey, market position
3. Salesforce terminology — **objects** (standard / custom), fields, records
4. The Salesforce module and its operations
5. Creating a free **trial org**
6. Exploring accounts, leads, the **Object Manager**, field labels vs. API names
7. Resetting the **security token**
8. Studio: the **Query** operation and **Basic Authentication** config
9. Environments mapping (Mule vs. Salesforce)
10. **Connection pooling**
11. Writing **SOQL**; the "No such column" error
12. Testing — query results as an array of records

---

## 2. Why a Salesforce Connector

- To talk to Salesforce we could write code — MuleSoft's **Salesforce connector** makes it drag, drop and configure.
- Give username/password details and connect.
- Activities: **insert, query, update** data and more.

---

## 3. What Salesforce Is

- **CRM — Customer Relationship Management**, delivered as a **SaaS** product.
- **Salesforce acquired MuleSoft** — MuleSoft is now a Salesforce product.
- Like **AWS, Azure, GCP** lead cloud, Salesforce leads the CRM segment.

**The customer journey (Amazon example):**

1. Marketing → a person's phone/email comes in — a **lead**.
2. Repeated ads → they buy → a **customer**.
3. **Service** — returns, damage, warranty.

- Managing this is hard for medium and big organizations; Salesforce captures it in an easy cloud solution, **per-user subscription**.

**Market:**

- An early entrant; ~**28%** CRM market share; the next player ~10–15%.
- Acquired **Tableau** (reporting) and **MuleSoft** (integration); aggressive on new features.
- MuleSoft is among the top 2–3 integration tools.

---

## 4. Salesforce Terminology

| Database | Salesforce |
|---|---|
| Table | **Object** |
| Column | **Field** |
| Row | **Record** |
| SELECT | **Query** |
| INSERT | **Create** |
| SQL | **SOQL** (Salesforce Object Query Language) |

**Objects:**

| Type | Meaning | Naming |
|---|---|---|
| **Standard** | Predefined by Salesforce (e.g. Account, Contact) | `Account` |
| **Custom** | Created by you when a standard object doesn't fit | ends with **`__c`** |

- Standard objects can also get extra fields.
- Speak their language — "is the record created in the Account object?", not "account table". It makes communication easy.

**Our role:** like with databases, we don't work on Salesforce itself — a separate Salesforce team does. We get details from them and configure the MuleSoft side.

---

## 5. The Salesforce Module

- *Screen:* new project **salesforce-demo** → **Add Modules → Salesforce** (Studio fetches dependencies; *screen:* Salesforce v10.16.7).
- 20–30+ operations; we'll use 3–4 — **Query, Update, Upsert, Create**…
- **Source-based operations** — trigger a flow when something happens in a Salesforce object (seen later).

**Instructor's experience:** he regularly used 4–5 operations; for a new requirement he reads that operation's docs — connecting is already known.

---

## 6. Creating a Trial Org

1. *Screen:* **developer.salesforce.com** — sign up for a free developer / trial org.
2. *Screen:* "Start your free trial today" form — name **Mani C**, title Software Developer, a student's email, company.
3. **30-day free trial**, no credit card; after it expires, create another account.
4. *Screen:* Gmail "Welcome to Salesforce: Verify your account" → **Verify Account** (org URL and username in the mail).
5. *Screen:* **Change Your Password** on first login, with a security question.
6. *Screen:* Lightning home — "Welcome, Mani": create your first contact / lead / deal.

- Salesforce has many products (Marketing Cloud, CPQ…) — don't get confused.
- The instructor's own trial had expired, so a student's email was used.

---

## 7. Exploring the Org

- *Screen:* **Accounts → All Accounts** — empty (older orgs had dummy data).
- *Screen:* **New Account** form — Account Name (red = **mandatory**), Website, Type, Description, addresses (optional).
- *Screen:* **Sales app → Leads → All Open Leads** (list views: My Unread, Recently Viewed, Today's Leads).
- Contacts hold phone, email etc.

### 7.1 Object Manager

- Gear icon → **Advanced Setup** → **Object Manager** (the UI changes over time).
- *Screen:* standard objects — Account, Activity, Address, Asset… (Type: Standard Object).
- An object is like a table — a structure for saving data.

*Screen — Account → Fields & Relationships:* field label, API name, data type.

| Use | Which name |
|---|---|
| Object in a query | **API name** (labels can contain spaces) |
| Field in a query | **Field name** (no spaces) |
| Label | Display only |

- Fields: Account Name, Account Number, Account Owner, Account Site, Account Source, Annual Revenue…
- Data types: **Name** (like string), **Text**, **Lookup(User)**, **Currency**, **Number**, **Picklist** (like an enum — choose from fixed values).
- "Relationships" — links between objects.
- Fields can be added or deleted here.
- *Screen:* **Contact → Fields & Relationships** — Account Name, Assistant, Assistant Phone, Birthdate…

### 7.2 A record

- Created account **Mahesh** with only mandatory details (later with website and type **Partner**).
- *Screen:* the record (Hyderabad shipping address, history).
- A piece of data in an object = a **record**.

---

## 8. Security Token

1. Profile icon → **Settings**.
2. **My Personal Information → Reset My Security Token** → **Reset Security Token**.
3. The token is emailed.

- Needed with **username + password** for **Basic Authentication** from MuleSoft.

*Screen — instructor's notes (2025 trial org, as shown):*

```text
SALESFORCE IS A CRM - CUSTOMER RELATIONSHIP MANAGEMENT
Object - Standard and Custom

mcp292519-0cah@force.com
Test@123
Security token: ALNrSnuCwtS71pZHfVslUrxIf

https://site-customization-4381.my.salesforce.com
```

---

## 9. Studio: Query and Connection

1. Listener (path **`/sfquery`**) → Logger → *screen:* **Salesforce Query**.
2. Create the connector configuration.

*Screen — Salesforce Config:* Connection **Basic Authentication** — Username, Password, Security token, Authorization URL (default `https://login.salesforce.com/services/Soap/u/…`); tabs General, Connection Pool Config, Security, Advanced.

*Screen — connection types:*

| Type | Notes |
|---|---|
| **Basic Authentication** | Username, password, security token — used in class |
| OAuth v2.0 | Consumer key, consumer secret… |
| **OAuth JWT** | Seen often in real projects; different process |
| OAuth SAML | — |
| OAuth Username Password | — |

- Ask the Salesforce team **which connection type** they provide, then ask for the matching details.
- Organizations usually create a separate **service account** for MuleSoft and give its username, password and token.
- Store them in **property files** — they differ per environment.
- **Test Connection** → success (after fixing a wrongly copied token).

---

## 10. Environments Mapping

| MuleSoft | Salesforce (example) |
|---|---|
| Dev | Dev |
| SIT | Testing / QA |
| UAT | QA (no UAT) |
| Prod | Prod |

- Confirm with the Salesforce team which of their environments maps to each of ours.
- SIT and UAT property files may end up almost the same.
- *Screen — notes:* SOQL = Salesforce Object Query Language; environments (dev, SIT testing, UAT qa, prod).

---

## 11. Connection Pooling

**Without pooling (per request):** create connection → connect to Salesforce → send → response → close → next component.

**With pooling:** connections are created in advance and kept in a **pool**; requests use a ready connection.

- **Analogy:** you know a guest is coming, so you leave the door open — no bell ring, no walking down to open it.
- With thousands of requests, this reduces **latency** (delay) — e.g. 100 ms → 90 ms.
- Enabled automatically for HTTP Request and Salesforce; must be **configured for the Database connector**.
- An advanced concept — a minimum understanding is enough.

Other common Advanced settings: **target variable**, **reconnection strategy**, **error mapping** (change the error type) — the same across connectors.

---

## 12. Writing SOQL

*Screen:*

```sql
select Name, AccountNumber, Website from Account
```

- Almost like SQL, **but `*` doesn't work** — list every field name.
- Get field names from Object Manager → Account → Fields & Relationships.
- Object = its **API name** (Details tab).
- No condition → all records.
- If stuck, the **Salesforce developers** help — write it with them once or twice, or research and get it validated.

**Result format:**

- Returned in **Java**, like the Database select.
- Always an **array**: many records → many items; one → array of one; none → empty array.
- Convert with a Transform: `output json` / `payload`.

### 12.1 The error

- *Screen — error:* **SALESFORCE:INVALID_INPUT** — *"No such column 'AccountNumber' on entity 'Account'… append the '__c' after the custom field name"*.
- *Screen:* Object Manager shows **AccountNumber** exists (Text(40)) — still failing.
- Workaround in class: query **Name, Website, Type** instead.
- **Instructor's view:** if a field the Salesforce team gave you errors when you've done it correctly, ask them to check their configuration — it's their side.
- Salesforce teams often share all fields in an Excel sheet, with mandatory ones marked.

---

## 13. Testing

- *Screen:* console — BUILD SUCCESS, deployed.
- *Screen:* Postman `GET http://localhost:8081/sfquery` → **200** JSON with the accounts.
- *Screen — debugger:* payload size **1**, media type **Java**, a collection (HashMap per record) with **Name, Website, Type** plus extra **Id** and **type**.
- The payload is **overwritten** by the query result (no target variable).
- *Screen:* final Postman response — account records as JSON: an **array of one object**.
- Condition for a non-existent account (Rajesh) → size **0** — an **empty array**.

**Next session:** creating records and the rest of the Salesforce operations.

---

## 14. Important Terminology

| Term | Meaning |
|---|---|
| CRM | Customer Relationship Management |
| Lead | Prospect's details before they buy |
| Object | Salesforce's table |
| Standard / custom object | Predefined / user-created (`__c`) |
| Field / record | Column / row |
| API name / field name | Names used in queries |
| Picklist | Field with fixed choices |
| SOQL | Salesforce Object Query Language |
| Security token | Extra secret for basic-auth API logins |
| Service account | Dedicated Salesforce user for the integration |
| Connection pooling | Reusing pre-created connections |
| SALESFORCE:INVALID_INPUT | Error for bad input such as an unknown field |

---

## 15. Interview Questions

### Q1. What is Salesforce?
A SaaS CRM platform managing the customer journey from lead to customer to service. It owns MuleSoft.

### Q2. Standard vs. custom objects?
Standard objects are predefined (Account, Contact); custom objects are created by the org and end with `__c`.

### Q3. What do you need for Basic Authentication to Salesforce?
Username, password and security token (usually of a service account), kept in property files per environment.

### Q4. Which connection types does the Salesforce connector support?
Basic Authentication, OAuth v2.0, OAuth JWT, OAuth SAML and OAuth Username Password.

### Q5. How is SOQL different from SQL?
Similar syntax, but you query objects using API names and must list fields — `select *` isn't supported.

### Q6. What does a Salesforce query return?
A Java collection — always an array of records (empty if nothing matches).

### Q7. What is connection pooling?
Keeping connections ready in a pool so requests skip connect/close steps, reducing latency.

---

## 16. Must Remember

1. Salesforce = CRM (SaaS); owns MuleSoft.
2. Object/field/record = table/column/row.
3. Custom objects/fields end with `__c`.
4. Use **API names** and **field names**, never labels.
5. Basic auth = username + password + **security token**.
6. Ask which connection type; get a service account; use property files.
7. Map environments with the Salesforce team.
8. SOQL has no `*`.
9. Query → array (possibly empty), in Java — transform to JSON.
10. Connection pooling is automatic for HTTP/Salesforce, manual for Database.
