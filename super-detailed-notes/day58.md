# Day 58 — Logging Levels, Verbose Logging, and DataWeave: flatten, flatMap, Custom Functions, XML and CSV Conversions

> **Sources:**
> - Cleaned audio transcript ([transcripts-cleaned/day58.txt](../transcripts-cleaned/day58.txt)) and the class video (recorded 9 Feb 2025).
> - Text marked *screen* is read from the recording.
> - Slide images: [slides/day58](../slides/day58/).

## 1. Overview

The agenda slide said **"Consume SOAP Webservice, Q&A session"**, but the class actually worked through the **pending topics** document:

1. **Logging levels** — TRACE, DEBUG, INFO, WARN, ERROR, FATAL and their hierarchy
2. Enabling **DEBUG** logs for a deployed app (Runtime Manager → Settings → Logging) — whole app vs. one connector package
3. **Verbose logging** — what it is and when (not) to use it
4. DataWeave **`flatten`**
5. DataWeave **`flatMap`** — the in-class demo failed; scripts promised later
6. **Custom (named) functions** — `fun add(n, m) = n + m`
7. **XML basics** — header, root tag, elements, attributes, siblings
8. **XML → JSON** — reading elements and attributes (`@category`)
9. **JSON → XML** — single root element, writing attributes with `@( … )` (the bookstore attribute demo failed; script promised later)
10. **CSV ↔ JSON** — `output application/csv`, `header=false`, renaming keys
11. Remaining: CI/CD with Jenkins, HTTPS one-way/two-way TLS, CloudHub 1.0 vs 2.0

*Screen:* pending-topics doc — Transformation (CSV/XML formats, custom function, flatten, flatMap), logging levels, verbose logging, CI/CD with Jenkins, HTTPS one-way/two-way TLS, CloudHub 1.0 vs 2.0. The AWS S3 connector item is marked complete.

---

## 2. Logging Levels

*Screen:* the Logger component's **Level** dropdown — DEBUG, ERROR, **INFO (default)**, TRACE, WARN.

- By default the Logger prints at **INFO**.
- The full list of levels is TRACE, DEBUG, INFO, WARN, ERROR, FATAL.
- FATAL is **not** in the Logger dropdown.

*Screen (Notepad++):*

```text
Hierarchy: Log levels are organized in a hierarchy, with each level encompassing the
levels below it. The order is typically: TRACE < DEBUG < INFO < WARN < ERROR < FATAL.

Severity: Each log level represents a different severity of an event or issue.
TRACE: Very detailed information, useful for in-depth debugging.
DEBUG: Information for debugging purposes.
INFO: General information about the application's state.
WARN: Potentially harmful situations that might require attention.
ERROR: Errors that might allow the application to continue running.
FATAL: Severe errors that might cause the application to terminate.
```

### 2.1 What each level is used for

| Level | Instructor's explanation |
|---|---|
| **INFO** | Information logs — select it when you want to print information every time |
| **ERROR** | The main reason for an error with minimal details — where it came from, which line, which component |
| **WARN** | Potentially harmful situations; most of the time warnings are **ignored**, because they don't affect the process |
| **DEBUG** | Detailed information about a component/connector; enabled when info/error logs aren't enough to find the cause |
| **TRACE** | Even more in-depth than DEBUG; uses more space; used in very rare cases |

- Errors **do** affect the process — the app may fail to deploy, or a request errors out — so we focus on errors.
- In real time, **DEBUG** is what you usually enable when you can't find the reason for a failed request or transaction.

### 2.2 The hierarchy — what gets printed

Whatever level you select, that level **and everything below it** (towards ERROR) is printed:

| Selected level | Printed |
|---|---|
| TRACE | TRACE, DEBUG, INFO, WARN, ERROR |
| DEBUG | DEBUG, INFO, WARN, ERROR |
| INFO | INFO, WARN, ERROR |
| WARN | WARN, ERROR |
| ERROR | ERROR only |

**On a single Logger component:**

- If the Logger's level is **ERROR**, it prints only when there is an error.
- If it's **WARN**, it prints only when there's a warning.
- Choose **INFO** if you want it printed every time — e.g. the S3 demo logger printed the bucket on every request.

---

## 3. Enabling DEBUG Logs for a Deployed Application

*Screen:* `log4j2.xml` — commented-out loggers that can be enabled (HTTP wire logging, DEBUG categories).

*Screen:* Runtime Manager — deployed applications list (CloudHub, runtime 4.8.x, status Started).

Steps shown:

1. **Runtime Manager** → select the deployed application.
2. **Settings → Logging**. The default is **INFO**.
3. Select **DEBUG** and enter a **package** name.
4. **Apply Changes** — detailed logs are printed after every request.

### 3.1 Whole application vs. one connector

| Package entered | What gets debug logs |
|---|---|
| `org.mule` | The **whole application** — listener, logger, transform message, all connectors |
| The Amazon S3 connector's package | **Only** the S3 connector |
| `org.mule.extension.http` | Only HTTP listener and request |
| The Salesforce connector's package (`org.mule…salesforce`) | Only Salesforce |

- Where to find the package: open that **connector's configuration** and copy its package name.
- "Detailed" means: which input goes where, which connections, which access key, which secret — all printed.

---

## 4. Verbose Logging

- **Verbose logging = detailed logging** — it prints as much as you ask for.
- Lots of logs → the application becomes **slow** → scope for **performance issues**.
- **Do not** keep verbose logging always on.
- Enable it only when you face a problem you can't identify, or can't **replicate in the non-prod environments**.
- Don't enable it for the whole application — identify the **particular connector** and give only its package.
- **Disable it immediately** after the issue is solved.

> **Instructor's suggestion:** normally keep the same level — print at INFO and check the info logs. TRACE is rarely needed; most of the time DEBUG works.

---

## 5. DataWeave `flatten`

*Screen:* DataWeave Playground (dataweave.mulesoft.com/learn/dataweave).

- `flatten` works on **arrays** that contain **sub-arrays**.
- It removes the **first level** of inner arrays and merges their values into the main array.

```dataweave
flatten([1, 2, 3, [4, 5], [8]])
// → [1, 2, 3, 4, 5, 8]
```

**Only one level:**

- If a sub-array contains another array (e.g. `[6, 7]` at the second level), one `flatten` leaves it as an array.
- To flatten that too, apply `flatten` **again** (flatten twice).

### 5.1 Combining two arrays of employees

*Screen:* two variables of employee objects:

```dataweave
%dw 2.0
output application/json
var a = [
  { "empid": 100, "empSalary": 50000, "empDesignation": "software engineer", "empName": "mahesh" },
  { "empid": 101, "empSalary": 60000, "empDesignation": "senior software engineer", "empName": "rajes" }
]
var b = [
  { "empid": 103, "empSalary": 50000, "empDesignation": "software engineer", "empName": "naresh" }
]
---
flatten(a + b)
```

- `a + b` adds array **b** as one element: two objects, then an **array** containing the third object.
- `flatten(...)` removes that inner array → an array of **3 objects**.
- *Screen:* a typo `flattea+b` gave **"Unable to resolve reference of: `flaa`"** — fixed by spelling `flatten`.

---

## 6. DataWeave `flatMap` (Demo Did Not Work in Class)

- **flatMap = map + flatten** in one function.

*Screen:* `arr map $.empId` on the employees → `[100, 101, 102]`.

*Screen:* `arr flatMap $.empDesignation` — attempted as "map and flatten in one step".

*Screen (tooltip):*

```text
flatMap(items: Array<T>, mapper: (item: T, index: Number) -> Array<R>): Array<R>
```

**What happened in class:**

- `map` gave the employee IDs, but the third one (103) came inside an array.
- The `flatMap` attempt failed: *"Expecting type Array but got … empId 100"* — an object was coming, not an array.
- The instructor went to the documentation.

> **Technical note (from the tooltip):** the mapper must **return an array** for each item. Returning a single value (like `$.empId`) is why the type error appeared.

### 6.1 Documentation shown

*Screen (MuleSoft docs — flatMap):* iterates over each item and flattens the results:

```dataweave
[[1,5],[0.5,1.5]] flatMap (value, index) -> value
```

*Screen:* Jerney.io article — a flatMap use case: adding data between existing array items.

*Screen (docs cookbook — Map and Flatten an Array), copied into the Playground:*

```dataweave
%dw 2.0
output application/json
var myData = [{name:1},{name:2},{name:3}]
fun myExternalFunction(data): Array =
    if(data.name == 1)
        []
    else if(data.name == 2)
        [{name: 3}, {name:5}]
    else
        [data]
---
//flatten(myData map ((item, index) -> myExternalFunction(item)))
myData flatMap ((item, index) -> myExternalFunction(item))
```

- The commented line (`map` then `flatten`) and the `flatMap` line give the same result.
- *Screen:* pasting the whole script into the **payload** pane gave *"Unexpected character '%' at payload"* — it belongs in the script pane.
- **Instructor:** "I'll show you flatten and flatMap properly later" — the flatMap script was promised to be sent to the group.

---

## 7. Custom (Named) Functions

- So far we used **predefined** functions such as `map`.
- You can create your own and reuse them: define at the **top** (header) of the script, then call by name.

**Syntax:** `fun` keyword → function name → parameters → `=` → what to execute.

```dataweave
%dw 2.0
output application/json
fun add(n, m) = n + m
---
{
  a: add(1, 2),     // 3
  b: add(5, 2),     // 7
  c: add(100, 2)    // 102
}
```

- Values passed in place of `n` and `m` are used automatically.
- The same pattern works for multiplication or anything repetitive.
- Also called a **named function**.

---

## 8. XML Basics

*Screen:* the bookstore XML (books with category, title, author, year, price).

```xml
<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
  <book category="cooking">
    <title lang="en">Everyday Italian</title>
    <author>…</author>
    <year>…</year>
    <price>…</price>
  </book>
  <book category="children"> … </book>
  <book category="…"> … </book>
</bookstore>
```

| Part | Meaning |
|---|---|
| Header | XML version and encoding — minimum details, comes by default |
| **Root tag** | `bookstore` — opening and closing tags hold everything |
| **Elements** | `book` — children of the root; each has opening and closing tags |
| Sub-elements | `title`, `author`, `year`, `price` — values between the tags |
| **Attributes** | `category="cooking"`, `lang="en"` — metadata (data about data) |
| **Siblings** | book 1, book 2, book 3 — same level, same parent |

**Attributes:**

- Written in the **opening tag**: a space, the attribute name, `=`, the value in **double quotes**.
- Element values have no double quotes; attribute values **must** have them.
- You could make `category` a separate element — not wrong — but metadata is best represented as an attribute.

**Why XML and JSON:**

- Both are used to transport/share data and are human-readable.
- JSON is more popular: lightweight (faster responses), and front-end JavaScript parses it easily.
- XML is still used — but it's a rare requirement in our work.
- Minimum XML knowledge helps spot simple problems, e.g. an opening tag without a closing tag.

---

## 9. XML → JSON

*Screen:* Playground — input XML, `output application/json`, script `payload` → converted automatically.

- The **elements** come through, but the **attribute** (`category`) does **not**.

### 9.1 Building an array of books

```dataweave
%dw 2.0
output application/json
---
payload.bookstore.*book map ((item, index) -> {
  title: item.title,
  author: item.author,
  year: item.year,
  price: item.price
})
```

- `payload.bookstore.*book` — the `*` (multi-value selector) gives an **array** of all books.
- `map` turns each into an object → an array of objects.

### 9.2 Reading the attribute

*Screen:* `{category: payload.bookstore.book.@category}` reads an attribute.

- `@` reads an attribute.
- `payload.bookstore.book.@category` gave **"cooking" for every book** — it only reads the **first** book.
- Inside the `map`, use the current item instead:

```dataweave
category: item.@category
```

- Now each book shows its own category — cooking, children, ….

---

## 10. JSON → XML

### 10.1 A single root element

*Screen:* `output application/xml` with the books JSON.

- Just `payload` doesn't work — XML needs a **root element**.
- The root must be given as a key–value **inside an object**:

```dataweave
%dw 2.0
output application/xml
---
{
  "bookstore": {
    "book": payload
  }
}
```

- `book: payload` repeats the `book` element for each item automatically.

*Screen:* error **"Trying to output second root, bookstore, while writing Xml"** — XML can have only **one** root element.

### 10.2 Writing attributes — documented syntax

*Screen:* DZone article "JSON to XML Transformation Using DataWeave" and a blog "MuleSoft 4 Transformation: Convert JSON to XML" (Method 1 simplest; Method 2 changing format with attributes).

The blog's requirement: in the Profiles JSON, put `lastName` and `age` as **attributes** of the `name` tag. *Screen (Method 2):*

```dataweave
name @(lastName: person.LastName, age: person.Age): person.name
```

- Pattern: element name, then `@( attr: value, … )`, then `:` and the element's value.
- The blog maps `payload.Profiles map (person, index)` into a `Candidates` object with country, skills and profession inside.
- *Screen:* Playground output shows `lastName` and `age` as attributes and **John** as the name value.

### 10.3 Bookstore attribute demo — did not work

- Applying the pattern to the bookstore (`category` as an attribute on `book`) kept failing — "trying to output second root, bookstore", and an "array can't be converted to string" error.
- A hard-coded attempt (`@(category: "C")`) put **"C" on all three books**, not each book's own category.
- **Instructor:** "I'll check it and send it" — the JSON→XML bookstore script was promised later.

---

## 11. CSV ↔ JSON

- CSV = **comma-separated values**.

*Screen:* CSV input → `output application/json` / `payload`:

```text
empid,empsalary,empdes,empname
100,3000,software,mahesh
```

- Converted to JSON properly.

**JSON → CSV:**

- Set `output application/csv` (a student pointed out it had been left out).
- By default the **header** row (the keys) is included; `header=false` removes it.

**Renaming the keys:**

```dataweave
%dw 2.0
output application/csv
---
payload map ((item, index) -> {
  employeeid: item.empid,
  employeesalary: item.empsalary
})
```

*Screen:* while typing, *"Missing Object Field Expression"* until the value was completed.

> **Instructor's view:** JSON matters most; CSV is very rare and XML only sometimes — but XML/CSV (especially attributes) come up in one or two **certification** questions, so learn them.

---

## 12. Next Session

- Still pending: **CI/CD with Jenkins**, **HTTPS one-way / two-way TLS**, **CloudHub 1.0 vs 2.0**.
- Also: sending the flatMap and JSON→XML scripts.
- An extra session on the following Friday or Saturday, announced in the group.
- CloudHub 1.0 vs 2.0 differences — "I ask about it a lot in interviews."

---

## 13. Important Terminology

| Term | Meaning |
|---|---|
| Log level | Severity of a log event: TRACE, DEBUG, INFO, WARN, ERROR, FATAL |
| Verbose logging | Detailed logging (DEBUG/TRACE) — slows the app; enable briefly for one package |
| Package (logging) | The Java package a log category applies to, e.g. `org.mule`, `org.mule.extension.http` |
| `log4j2.xml` | The app's logging configuration file |
| `flatten` | Removes one level of nested arrays |
| `flatMap` | `map` then `flatten`; the mapper must return an array |
| Named / custom function | `fun name(params) = expression`, declared in the header |
| Root element | The single top-level XML tag |
| Attribute | Metadata in an XML opening tag, value in double quotes |
| `@` selector | Reads (or with `@( … )`, writes) XML attributes |
| `*` multi-value selector | Returns all repeated elements as an array, e.g. `*book` |
| Siblings | XML elements at the same level under one parent |

---

## 14. Interview Questions

### Q1. What are the log levels and their order?
TRACE < DEBUG < INFO < WARN < ERROR < FATAL. Selecting a level prints that level and everything more severe — e.g. INFO prints INFO, WARN and ERROR.

### Q2. How do you get more detail for a production issue on CloudHub?
Runtime Manager → the app → Settings → Logging → set DEBUG for a package — the specific connector's package (e.g. `org.mule.extension.http`) rather than `org.mule` for the whole app — apply, reproduce, then turn it back off.

### Q3. Why shouldn't verbose logging stay on?
It prints a lot, uses space and slows the application, causing performance issues. Use it only when you can't find or replicate the issue otherwise, and disable it right after.

### Q4. flatten vs. flatMap?
`flatten` removes one level of nested arrays. `flatMap` maps each item and flattens the result in one step; its mapper must return an array.

### Q5. How do you write a custom function in DataWeave?
In the header: `fun add(n, m) = n + m`, then call `add(1, 2)` in the body.

### Q6. How do you read an XML attribute in DataWeave?
With `@` — e.g. `item.@category` inside a map over `payload.bookstore.*book`. `payload.bookstore.book.@category` only gives the first book's value.

### Q7. Why does JSON → XML fail with "Trying to output second root"?
XML allows only one root element. Wrap the output in a single-key object, e.g. `{ bookstore: { book: payload } }`.

### Q8. How do you write an attribute when producing XML?
`name @(lastName: person.LastName, age: person.Age): person.name`.

### Q9. How do you drop the header row in CSV output?
`output application/csv header=false`.

---

## 15. Must Remember

1. Hierarchy: **TRACE < DEBUG < INFO < WARN < ERROR < FATAL**; INFO is the Logger default; FATAL isn't in the dropdown.
2. A selected level prints itself and everything more severe.
3. DEBUG for a deployed app: Runtime Manager → Settings → Logging → package → Apply Changes.
4. `org.mule` = whole app; a connector's package = only that connector.
5. Verbose logging slows the app — enable briefly, for one connector, then disable.
6. `flatten` removes **one** level; flatten twice for deeper nesting.
7. `flatMap` = map + flatten; the mapper returns an array. The class demo failed — scripts were promised.
8. Custom function: `fun name(params) = expression`, in the header.
9. XML: one root, elements, attributes (double-quoted metadata), siblings.
10. `*book` gives an array; `item.@category` reads each book's attribute.
11. JSON → XML needs a single root key; attributes via `@( … )`.
12. CSV output: `output application/csv`, `header=false` to drop the header.
