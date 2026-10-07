# Day 58 — Slides and On-Screen Drawings

Screens from the Day 58 class (9 Feb 2025): logger levels and their hierarchy, then DataWeave — flatten, flatMap (docs and use cases), custom functions, XML ↔ JSON (single root, attributes) and CSV conversions. Repeated and blank frames have been removed. Times are positions in the video.

Notes for this day: [detailed-notes/day58.md](../../detailed-notes/day58.md) · [super-detailed-notes/day58.md](../../super-detailed-notes/day58.md) · [summary](../../day58.md)

| # | Time | Content |
|---|---|---|
| 01 | 2:16 | Agenda: Consume SOAP Webservice, Q&A session |
| 02 | 2:23 | Pending topics doc — Transformation (CSV/XML formats, custom function, flatten, flatMap), logging levels, verbose logging, CI/CD with Jenkins, HTTPS one-way/two-way TLS, CloudHub 1.0 vs 2.0 |
| 03 | 2:40 | Logger Level dropdown — DEBUG, ERROR, INFO (default), TRACE, WARN |
| 04 | 3:27 | Log levels explained — hierarchy TRACE < DEBUG < INFO < WARN < ERROR < FATAL, with the meaning of each |
| 05 | 8:06 | log4j2.xml — commented-out loggers you can enable (HTTP wire logging, DEBUG categories) |
| 06 | 8:53 | Runtime Manager — deployed applications list (CloudHub, runtime 4.8.x, status Started) |
| 07 | 16:51 | DataWeave Playground — XML bookstore payload; `{category: payload.bookstore.book.@category}` reads an attribute |
| 08 | 20:45 | Playground: `arr map $.empId` on an array of employees → [100, 101, 102] |
| 09 | 21:02 | `flatten(arr)` — combines nested arrays into one array |
| 10 | 22:53 | `arr flatMap $.empDesignation` — map and flatten in one step |
| 11 | 23:22 | Tooltip — `flatMap(items: Array<T>, mapper: (item: T, index: Number) -> Array<R>): Array<R>` |
| 12 | 30:52 | MuleSoft docs — flatMap: iterates over each item and flattens the results; `[[1,5],[0.5,1.5]] flatMap (value, index) -> value` |
| 13 | 31:35 | Jerney.io article — DataWeave flatMap use case: adding data between existing array items |
| 14 | 32:57 | Docs cookbook — Map and Flatten an Array (`myData map … flatten` vs `flatMap`, with a custom function `myExternalFunction`) |
| 15 | 34:12 | Playground: `fun myExternalFunction(data): Array = if (data.name == 1) [] else …` then `myData flatMap ((item, index) -> myExternalFunction(item))` |
| 16 | 41:00 | The bookstore XML used for XML ↔ JSON examples (books with category, title, author, year, price) |
| 17 | 49:11 | Playground: XML bookstore → JSON (`output application/json` / `payload`) |
| 18 | 53:19 | `payload.bookstore.*book map ((item, index) -> { title: item.title, author: item.author, year: item.year, price: item.price })` |
| 19 | 67:23 | JSON books → XML: `output application/xml` / `{"bookstore": {"book": payload}}` |
| 20 | 74:18 | Error "Trying to output second root, bookstore, while writing Xml" — XML needs a single root element |
| 21 | 75:22 | DZone article — JSON to XML Transformation Using DataWeave (books example with attributes) |
| 22 | 77:21 | Blog — MuleSoft 4 Transformation: Convert JSON to XML (Method 1 simplest, Method 2 changing format with attributes) |
| 23 | 78:25 | Method 2: `name @(lastName: person.LastName, age: person.Age): person.name` — writing XML attributes |
| 24 | 89:15 | Playground: the Profiles JSON → XML with candidates and attributes |
| 25 | 97:35 | Notepad++: bookstore XML and the equivalent JSON (book array) side by side |
| 26 | 106:07 | Playground: CSV input (empid, empsalary, empdes, empname) → `output application/json` / `payload` |
| 27 | 108:47 | `output application/csv` with `payload map ((item, index) -> { employeeid: item.empid, employeesalary: … })` |
| 28 | 111:21 | Remaining modules doc — CI/CD with Jenkins, HTTPS (one-way / two-way TLS), CloudHub 1.0 vs 2.0 |

---

### 01 — Agenda: Consume SOAP Webservice, Q&A session
![agenda](01-agenda.jpg)

### 02 — Pending topics doc — Transformation (CSV/XML formats, custom function, flatten, flatMap), logging levels, verbose logging, CI/CD with Jenkins, HTTPS one-way/two-way TLS, CloudHub 1.0 vs 2.0
![pending-topics](02-pending-topics.jpg)

### 03 — Logger Level dropdown — DEBUG, ERROR, INFO (default), TRACE, WARN
![logger-levels](03-logger-levels.jpg)

### 04 — Log levels explained — hierarchy TRACE < DEBUG < INFO < WARN < ERROR < FATAL, with the meaning of each
![log-levels-hierarchy](04-log-levels-hierarchy.jpg)

### 05 — log4j2.xml — commented-out loggers you can enable (HTTP wire logging, DEBUG categories)
![log4j2-loggers](05-log4j2-loggers.jpg)

### 06 — Runtime Manager — deployed applications list (CloudHub, runtime 4.8.x, status Started)
![runtime-manager-apps](06-runtime-manager-apps.jpg)

### 07 — DataWeave Playground — XML bookstore payload; `{category: payload.bookstore.book.@category}` reads an attribute
![dw-xml-payload](07-dw-xml-payload.jpg)

### 08 — Playground: `arr map $.empId` on an array of employees → [100, 101, 102]
![dw-map-employees](08-dw-map-employees.jpg)

### 09 — `flatten(arr)` — combines nested arrays into one array
![dw-flatten](09-dw-flatten.jpg)

### 10 — `arr flatMap $.empDesignation` — map and flatten in one step
![dw-flatmap](10-dw-flatmap.jpg)

### 11 — Tooltip — `flatMap(items: Array<T>, mapper: (item: T, index: Number) -> Array<R>): Array<R>`
![flatmap-tooltip](11-flatmap-tooltip.jpg)

### 12 — MuleSoft docs — flatMap: iterates over each item and flattens the results; `[[1,5],[0.5,1.5]] flatMap (value, index) -> value`
![flatmap-docs](12-flatmap-docs.jpg)

### 13 — Jerney.io article — DataWeave flatMap use case: adding data between existing array items
![jerney-flatmap](13-jerney-flatmap.jpg)

### 14 — Docs cookbook — Map and Flatten an Array (`myData map … flatten` vs `flatMap`, with a custom function `myExternalFunction`)
![map-and-flatten-docs](14-map-and-flatten-docs.jpg)

### 15 — Playground: `fun myExternalFunction(data): Array = if (data.name == 1) [] else …` then `myData flatMap ((item, index) -> myExternalFunction(item))`
![custom-function](15-custom-function.jpg)

### 16 — The bookstore XML used for XML ↔ JSON examples (books with category, title, author, year, price)
![bookstore-xml](16-bookstore-xml.jpg)

### 17 — Playground: XML bookstore → JSON (`output application/json` / `payload`)
![xml-to-json](17-xml-to-json.jpg)

### 18 — `payload.bookstore.*book map ((item, index) -> { title: item.title, author: item.author, year: item.year, price: item.price })`
![map-books](18-map-books.jpg)

### 19 — JSON books → XML: `output application/xml` / `{"bookstore": {"book": payload}}`
![json-to-xml](19-json-to-xml.jpg)

### 20 — Error "Trying to output second root, bookstore, while writing Xml" — XML needs a single root element
![xml-root-error](20-xml-root-error.jpg)

### 21 — DZone article — JSON to XML Transformation Using DataWeave (books example with attributes)
![dzone-json-to-xml](21-dzone-json-to-xml.jpg)

### 22 — Blog — MuleSoft 4 Transformation: Convert JSON to XML (Method 1 simplest, Method 2 changing format with attributes)
![mulesoft4-json-xml](22-mulesoft4-json-xml.jpg)

### 23 — Method 2: `name @(lastName: person.LastName, age: person.Age): person.name` — writing XML attributes
![attributes-in-xml](23-attributes-in-xml.jpg)

### 24 — Playground: the Profiles JSON → XML with candidates and attributes
![playground-profiles](24-playground-profiles.jpg)

### 25 — Notepad++: bookstore XML and the equivalent JSON (book array) side by side
![nested-book-xml](25-nested-book-xml.jpg)

### 26 — Playground: CSV input (empid, empsalary, empdes, empname) → `output application/json` / `payload`
![csv-to-json](26-csv-to-json.jpg)

### 27 — `output application/csv` with `payload map ((item, index) -> { employeeid: item.empid, employeesalary: … })`
![csv-output](27-csv-output.jpg)

### 28 — Remaining modules doc — CI/CD with Jenkins, HTTPS (one-way / two-way TLS), CloudHub 1.0 vs 2.0
![remaining-modules](28-remaining-modules.jpg)

