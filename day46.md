# Day 46 — Salesforce Connector Part 1: CRM, Objects, Basic Auth and a SOQL Query

## Session Agenda
- What Salesforce (CRM) is
- Salesforce terminology — objects, fields, records
- Creating a free trial org and exploring the Object Manager
- Security token and the **Basic Authentication** connection
- Connection pooling
- Writing a **SOQL** query and reading the result

## Salesforce
- A SaaS **CRM** that manages lead → customer → service; ~28% market share.
- Salesforce acquired MuleSoft (and Tableau).
- We integrate with it; a separate Salesforce team works on the org.

## Terminology
- Table → **object**; column → **field**; row → **record**.
- **Standard** objects (Account, Contact) are predefined; **custom** objects end with `__c`.
- Use **API names / field names** in queries, not labels.
- Picklist = fixed-choice field (like an enum).

## Connecting
- Trial org from developer.salesforce.com (30 days).
- Reset My Security Token from Settings.
- Salesforce Config → **Basic Authentication**: username, password, security token (class: `mcp292519-0cah@force.com` / `Test@123` / token as shown).
- Other types: OAuth v2.0, OAuth JWT, OAuth SAML, OAuth Username Password.
- Use a service account and property files; map Mule environments to Salesforce's.
- Connection pooling keeps connections ready to cut latency.

## SOQL Query
- `select Name, Website, Type from Account` — list fields; no `*`.
- "No such column 'AccountNumber'" (SALESFORCE:INVALID_INPUT) — ask the Salesforce team when a given field fails.
- Result is Java: always an array of records (empty if none); transform to JSON.

## Quick Recap
- Salesforce = CRM; object/field/record.
- Basic auth = username + password + security token.
- SOQL needs explicit field names.
- Next: create and update operations.
