# Day 58 — Detailed Notes: Logging Levels, Verbose Logging, and DataWeave flatten, flatMap, Custom Functions, XML and CSV

> **Watch alongside:**
> - The agenda slide says "Consume SOAP Webservice", but the class actually cleared the pending-topics list: logging levels, verbose logging, and DataWeave transformations.
> - Two demos didn't work live — `flatMap` and writing the bookstore `category` as an XML attribute. The instructor promised to send working scripts; the notes show only the documented syntax that appeared on screen.

> **Video-verified:** written from the cleaned transcript and the class recording (9 Feb 2025). Slide images: [slides/day58](../slides/day58/) — e.g. [log levels](../slides/day58/04-log-levels-hierarchy.jpg), [flatten](../slides/day58/09-dw-flatten.jpg), [custom function](../slides/day58/15-custom-function.jpg), [XML root error](../slides/day58/20-xml-root-error.jpg), [CSV output](../slides/day58/27-csv-output.jpg).

---

## 1. Logging Levels and the Hierarchy

```mermaid
flowchart LR
    T["TRACE<br/>very detailed"] --> D["DEBUG<br/>for debugging"] --> I["INFO<br/>(Logger default)"] --> W["WARN<br/>potentially harmful"] --> E["ERROR<br/>process affected"] --> F["FATAL<br/>app may terminate"]
```

- Selecting a level prints **that level and everything to its right**.
- INFO → INFO + WARN + ERROR. DEBUG → DEBUG + INFO + WARN + ERROR. TRACE → everything.
- The Logger dropdown has DEBUG, ERROR, INFO, TRACE, WARN — no FATAL.
- Warnings are usually ignored; errors are what we focus on.
- On one Logger: level ERROR prints only on errors; choose **INFO** to print every time.

*"Whatever level we select, everything below it is printed."*

---

## 2. Debug Logs on a Deployed App

```mermaid
flowchart TB
    RM["Runtime Manager → application"] --> S["Settings → Logging<br/>(default INFO)"]
    S --> L["Select DEBUG + package"]
    L --> All["org.mule<br/>→ whole application"]
    L --> One["Connector package<br/>e.g. org.mule.extension.http, S3, Salesforce<br/>→ only that connector"]
    All --> Ap["Apply Changes → detailed logs on every request"]
    One --> Ap
```

- Copy the package name from the **connector's configuration**.
- Detailed logs show inputs, connections, even access keys and secrets.
- *Screen:* `log4j2.xml` also has commented-out loggers (HTTP wire logging, DEBUG categories) that can be enabled.

---

## 3. Verbose Logging

```mermaid
flowchart LR
    P["Issue you can't identify<br/>or replicate in non-prod"] --> V["Enable verbose (DEBUG) logging<br/>for ONE connector package"]
    V --> Fix["Find and fix the issue"]
    Fix --> Off["Disable immediately"]
    V -.->|"left on"| Slow["Too many logs → slow app,<br/>performance issues"]
```

- **Verbose logging = detailed logging.**
- Normally stay at INFO; DEBUG is usually enough; TRACE is rare.

---

## 4. flatten and flatMap

```mermaid
flowchart LR
    In["[1, 2, 3, [4, 5], [8]]"] -->|"flatten"| Out["[1, 2, 3, 4, 5, 8]"]
    Deep["second-level [6, 7]"] -->|"needs flatten twice"| Out2["fully flat"]
    AB["a + b<br/>[obj, obj, [obj]]"] -->|"flatten"| Three["[obj, obj, obj]"]
```

- `flatten` removes only the **first level** of sub-arrays.
- **flatMap = map + flatten**. Tooltip on screen:

```text
flatMap(items: Array<T>, mapper: (item: T, index: Number) -> Array<R>): Array<R>
```

- The class attempt `arr flatMap $.empDesignation` / empId failed: *"Expecting type Array but got … empId 100"* — the mapper returned an object/value, not an array.
- The docs example on screen: `[[1,5],[0.5,1.5]] flatMap (value, index) -> value`.
- The docs cookbook script (`myExternalFunction` returning `[]`, `[{name: 3}, {name:5}]` or `[data]`, then `myData flatMap ((item, index) -> myExternalFunction(item))`) was pasted, but not explained to the end.
- **Status:** the instructor said he'd show flatMap properly later and send the script.

---

## 5. Custom Functions

```mermaid
flowchart LR
    Def["Header: fun add(n, m) = n + m"] --> C1["add(1, 2) → 3"]
    Def --> C2["add(5, 2) → 7"]
    Def --> C3["add(100, 2) → 102"]
```

- `fun` + name + parameters + `=` + expression.
- Declare in the header, reuse anywhere in the body — for anything repetitive.

---

## 6. XML Structure

```mermaid
flowchart TB
    H["Header: version, encoding"] --> R["Root tag: bookstore"]
    R --> B1["book category=&quot;cooking&quot;"]
    R --> B2["book category=&quot;children&quot;"]
    R --> B3["book …"]
    B1 --> Sub["title lang=&quot;en&quot; · author · year · price"]
```

- Books are **siblings** (same level, same parent).
- Attributes = metadata, in the opening tag, values in **double quotes**.
- JSON is more popular (lightweight, easy for JavaScript); XML is a rarer requirement.

---

## 7. XML ↔ JSON

```mermaid
flowchart TB
    X["XML bookstore"] -->|"payload"| J1["JSON — elements only,<br/>no category"]
    X -->|"payload.bookstore.*book map ..."| J2["Array of book objects"]
    J2 -->|"item.@category"| J3["Each book's own category"]
    J["JSON books"] -->|"just payload"| Err["Fails — no root"]
    J -->|"{ bookstore: { book: payload } }"| XO["XML with one root"]
```

- `payload.bookstore.book.@category` returns only the **first** book's category ("cooking" for all).
- Two roots → *"Trying to output second root, bookstore, while writing Xml"*.
- Writing attributes (blog Method 2, on screen):

```dataweave
name @(lastName: person.LastName, age: person.Age): person.name
```

- **Status:** the bookstore version (category as an attribute of `book`) failed in class; a hard-coded `@(category: "C")` put "C" on every book. Script promised later.

---

## 8. CSV ↔ JSON

```mermaid
flowchart LR
    CSV["empid,empsalary,empdes,empname<br/>100,3000,software,mahesh"] -->|"output application/json"| JS["JSON array"]
    JS -->|"output application/csv"| C2["CSV with header"]
    JS -->|"header=false"| C3["CSV without header"]
    JS -->|"map: employeeid: item.empid ..."| C4["CSV with renamed columns"]
```

*"Most important is JSON. Very rarely we get CSV, and XML sometimes"* — but XML attributes and CSV appear in a question or two on the certification.

---

## Quick Recap
- Log levels: **TRACE < DEBUG < INFO < WARN < ERROR < FATAL**; a level prints itself and everything more severe; INFO is the default.
- Debug a deployed app via **Runtime Manager → Settings → Logging**, with `org.mule` (whole app) or one connector's package.
- **Verbose logging** slows the app — enable for one connector, briefly, then disable.
- `flatten` removes one level of nesting; `flatMap` = map + flatten (class demo failed; script promised).
- Custom function: `fun add(n, m) = n + m`.
- XML: one root, elements, double-quoted attributes; read attributes with `item.@category` over `*book`.
- JSON → XML needs a single root; attributes with `@( … )` (bookstore demo failed; script promised).
- CSV: `output application/csv`, `header=false`, rename keys in a `map`.
- Pending: CI/CD with Jenkins, one-way/two-way TLS, CloudHub 1.0 vs 2.0.
