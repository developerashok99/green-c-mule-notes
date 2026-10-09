# Day 58 — Logging Levels, Verbose Logging, and DataWeave flatten, flatMap, Custom Functions, XML and CSV

## Session Agenda
- The agenda slide said "Consume SOAP Webservice, Q&A" — the class covered the pending topics instead
- **Logging levels** and their hierarchy
- Enabling **DEBUG** logs on a deployed app; **verbose logging**
- DataWeave **flatten**, **flatMap**, **custom functions**
- **XML ↔ JSON** (root element, attributes) and **CSV ↔ JSON**

## Logging Levels
- Order: **TRACE < DEBUG < INFO < WARN < ERROR < FATAL**.
- INFO is the Logger default; FATAL isn't in the Logger dropdown.
- A selected level prints itself and everything more severe (INFO → INFO, WARN, ERROR).
- Warnings are usually ignored; errors affect the process.

## Debug and Verbose Logging
- Runtime Manager → app → **Settings → Logging** → DEBUG + package → Apply Changes.
- `org.mule` = whole app; a connector's package (e.g. `org.mule.extension.http`) = only that connector.
- Verbose (detailed) logging slows the app — enable it for one connector only when needed, then disable it.

## flatten, flatMap, Custom Functions
- `flatten` removes one level of sub-arrays: `[1,2,3,[4,5],[8]]` → `[1,2,3,4,5,8]`; flatten twice for deeper levels.
- `flatMap` = map + flatten; its mapper must return an array. The class demo failed — script promised later.
- Custom function: `fun add(n, m) = n + m`, then `add(1, 2)` → 3.

## XML and CSV
- XML: header, single **root tag**, elements, sibling elements, **attributes** (metadata in double quotes).
- XML → JSON: `payload.bookstore.*book map …`; read attributes with `item.@category`.
- JSON → XML: wrap in one root — `{ bookstore: { book: payload } }`; two roots give "Trying to output second root".
- Attributes in XML output: `name @(lastName: person.LastName, age: person.Age): person.name` (bookstore demo failed; script promised).
- CSV: `output application/csv`, `header=false`, rename keys in a `map`.

## Quick Recap
- Logging levels and when to use DEBUG/verbose logging.
- flatten, flatMap and custom functions in DataWeave.
- XML/CSV conversions — JSON matters most, but XML attributes appear in the certification.
- Next: CI/CD with Jenkins, one-way/two-way TLS, CloudHub 1.0 vs 2.0.
