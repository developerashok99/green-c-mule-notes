# Day 46 — Slides and On-Screen Drawings

Screens from the Day 46 class (13 Jan 2025): creating a Salesforce trial org, accounts, leads and the Object Manager, then connecting from Mule with the Salesforce connector (Basic Authentication with security token) and running a SOQL query (credentials as shown on screen, 2025 trial org). Repeated and blank frames have been removed. Times are positions in the video.

Notes for this day: [detailed-notes/day46.md](../../detailed-notes/day46.md) · [super-detailed-notes/day46.md](../../super-detailed-notes/day46.md) · [summary](../../day46.md)

| # | Time | Content |
|---|---|---|
| 01 | 12:30 | New Mule project salesforce-demo — adding the Salesforce module (Studio fetches its dependencies) |
| 02 | 16:13 | developer.salesforce.com — signing up for a free Salesforce developer / trial org |
| 03 | 16:47 | Salesforce "Start your free trial today" sign-up form |
| 04 | 20:21 | Gmail: "Welcome to Salesforce: Verify your account" — Verify Account button, org URL and username |
| 05 | 20:57 | Salesforce Change Your Password (first login) with security question |
| 06 | 21:40 | Salesforce Lightning home — "Welcome, Mani": create your first contact / lead / deal |
| 07 | 25:23 | Accounts tab → All Accounts (empty list) |
| 08 | 25:49 | New Account form — Account Name, Website, Type, Description, addresses |
| 09 | 26:11 | Sales app → Leads → All Open Leads (list views: My Unread, Recently Viewed, Today's Leads) |
| 10 | 32:14 | Setup → Object Manager — standard objects (Account, Activity, Address, Asset …) |
| 11 | 34:52 | Object Manager → Account → Fields & Relationships (field label, API name, data type) |
| 12 | 38:32 | Object Manager → Contact → Fields & Relationships |
| 13 | 41:40 | Account record "Mahesh" created (Hyderabad shipping address, history) |
| 14 | 43:41 | Studio: Salesforce **Query** operation dragged after the Listener and Logger |
| 15 | 45:32 | Instructor's notes: CRM, standard and custom objects, org username, password Test@123, security token, org URL |
| 16 | 46:47 | Salesforce Config → Connection: **Basic Authentication** (username, password, security token, authorization URL) |
| 17 | 47:30 | Connection options: Basic Authentication, OAuth v2.0, OAuth JWT, OAuth SAML, OAuth Username Password |
| 18 | 60:47 | Salesforce query: `select Name, AccountNumber, Website from Account` |
| 19 | 67:47 | Notes: SOQL = Salesforce Object Query Language; environments (dev, SIT testing, UAT qa, prod) |
| 20 | 67:51 | Error: "No such column 'AccountNumber' on entity 'Account'… append the '__c' after the custom field name" — wrong field API name |
| 21 | 68:32 | Object Manager → Account fields: AccountNumber exists (Text(40)) — checking the field API names |
| 22 | 70:56 | All Accounts list with the new record (Mahesh, website, billing state) |
| 23 | 75:18 | Studio console — project built and deployed (BUILD SUCCESS) |
| 24 | 76:14 | Postman GET http://localhost:8081/sfquery → 200 JSON with the queried accounts |
| 25 | 77:02 | Mule Debugger: payload — query result rows (Name, Website …) |
| 26 | 80:19 | Final Postman response after the Transform — account records as JSON |

---

### 01 — New Mule project salesforce-demo — adding the Salesforce module (Studio fetches its dependencies)
![new-project](01-new-project.jpg)

### 02 — developer.salesforce.com — signing up for a free Salesforce developer / trial org
![sf-developers](02-sf-developers.jpg)

### 03 — Salesforce "Start your free trial today" sign-up form
![sf-free-trial](03-sf-free-trial.jpg)

### 04 — Gmail: "Welcome to Salesforce: Verify your account" — Verify Account button, org URL and username
![verify-account-email](04-verify-account-email.jpg)

### 05 — Salesforce Change Your Password (first login) with security question
![change-password](05-change-password.jpg)

### 06 — Salesforce Lightning home — "Welcome, Mani": create your first contact / lead / deal
![sf-home](06-sf-home.jpg)

### 07 — Accounts tab → All Accounts (empty list)
![all-accounts](07-all-accounts.jpg)

### 08 — New Account form — Account Name, Website, Type, Description, addresses
![new-account](08-new-account.jpg)

### 09 — Sales app → Leads → All Open Leads (list views: My Unread, Recently Viewed, Today's Leads)
![all-open-leads](09-all-open-leads.jpg)

### 10 — Setup → Object Manager — standard objects (Account, Activity, Address, Asset …)
![object-manager](10-object-manager.jpg)

### 11 — Object Manager → Account → Fields & Relationships (field label, API name, data type)
![account-fields](11-account-fields.jpg)

### 12 — Object Manager → Contact → Fields & Relationships
![contact-fields](12-contact-fields.jpg)

### 13 — Account record "Mahesh" created (Hyderabad shipping address, history)
![account-mahesh](13-account-mahesh.jpg)

### 14 — Studio: Salesforce **Query** operation dragged after the Listener and Logger
![query-operation](14-query-operation.jpg)

### 15 — Instructor's notes: CRM, standard and custom objects, org username, password Test@123, security token, org URL
![notes-credentials](15-notes-credentials.jpg)

### 16 — Salesforce Config → Connection: **Basic Authentication** (username, password, security token, authorization URL)
![salesforce-config](16-salesforce-config.jpg)

### 17 — Connection options: Basic Authentication, OAuth v2.0, OAuth JWT, OAuth SAML, OAuth Username Password
![connection-types](17-connection-types.jpg)

### 18 — Salesforce query: `select Name, AccountNumber, Website from Account`
![soql-query](18-soql-query.jpg)

### 19 — Notes: SOQL = Salesforce Object Query Language; environments (dev, SIT testing, UAT qa, prod)
![soql-notes](19-soql-notes.jpg)

### 20 — Error: "No such column 'AccountNumber' on entity 'Account'… append the '__c' after the custom field name" — wrong field API name
![soql-error](20-soql-error.jpg)

### 21 — Object Manager → Account fields: AccountNumber exists (Text(40)) — checking the field API names
![account-number-field](21-account-number-field.jpg)

### 22 — All Accounts list with the new record (Mahesh, website, billing state)
![account-list](22-account-list.jpg)

### 23 — Studio console — project built and deployed (BUILD SUCCESS)
![build-success](23-build-success.jpg)

### 24 — Postman GET http://localhost:8081/sfquery → 200 JSON with the queried accounts
![postman-query](24-postman-query.jpg)

### 25 — Mule Debugger: payload — query result rows (Name, Website …)
![debugger-payload](25-debugger-payload.jpg)

### 26 — Final Postman response after the Transform — account records as JSON
![postman-final](26-postman-final.jpg)

