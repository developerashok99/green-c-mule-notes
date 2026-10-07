# Day 45 — Slides and On-Screen Drawings

Screens from the Day 45 class (10 Jan 2025) in the DataWeave Playground, tutorial and docs: map, mapObject, writer properties, distinctBy, groupBy, reduce (with DZone examples), orderBy, pluck, update, number formatting and coercion with as. Repeated and blank frames have been removed. Times are positions in the video.

Notes for this day: [detailed-notes/day45.md](../../detailed-notes/day45.md) · [super-detailed-notes/day45.md](../../super-detailed-notes/day45.md) · [summary](../../day45.md)

| # | Time | Content |
|---|---|---|
| 01 | 1:03 | DataWeave tutorial 7.2 The map Function — `map(Array<T>, ((T, Number) -> R)): Array<R>` |
| 02 | 5:14 | Playground: `payload map ((item, index) -> item + 1)` on [1,2,3,4,5] |
| 03 | 7:09 | Exercise: map each element to an object `{"value": …, "index": …}` |
| 04 | 10:21 | Docs cookbook — Use Constant Directives (`var baseUrl = …` in the header, `++` to build URLs) |
| 05 | 10:42 | Docs — Set Reader and Writer Configuration Properties (e.g. `output application/json indent=false`) |
| 06 | 13:36 | Tutorial 8.2 The mapObject function — transform each key/value of an object |
| 07 | 13:51 | `payload mapObject (value, key, index) -> { (upper(key)): value }` → all keys upper case |
| 08 | 19:15 | Writer property `indent=false` compresses the JSON output onto one line |
| 09 | 31:26 | Tutorial 7.4 The groupBy Function — `groupBy(Array<T>, (T, Number) -> R): Object` |
| 10 | 31:38 | `payload distinctBy $.id` — removes duplicate items by a key |
| 11 | 33:33 | Playground: `payload groupBy (n, idx) -> isEven(n)` on [1..10] → `{"false": [1,3,5,7,9], "true": [2,4,6,8,10]}` |
| 12 | 34:28 | groupBy exercise — group calendar events by `dayOfWeek` |
| 13 | 45:00 | Tutorial 7.5 reduce — `(item, accumulator) -> …`; first and second iterations explained |
| 14 | 46:30 | Playground: `payload reduce ((n, total) -> total + n)` on [1,2,3] → 6 |
| 15 | 47:10 | MuleSoft tutorial: "DataWeave reduce function: How to loop through and transform an Array into a different type" |
| 16 | 52:23 | `payload reduce ((item, acc = {}) -> acc ++ { (item.name): item.id })` — array of {id, name} turned into one object |
| 17 | 53:24 | DZone: "DataWeave and the Reduce Operator: Part I" — sum of a list, more complex arithmetic, array-to-array |
| 18 | 60:56 | DZone Part II: array to string (`acc ++ character`) and array to an object/map keyed by ClubID |
| 19 | 62:04 | Docs — `orderBy` (objects by value or key; arrays by criteria) |
| 20 | 71:08 | Playground: `payload orderBy ((item, index) -> item.age)` on a list of people |
| 21 | 71:25 | Tutorial 8.3 The pluck function — turn an object into an array: `payload pluck (v, k, idx) -> {(k): v}` |
| 22 | 73:50 | Tutorial 8.4 The update operator — change specific fields of an object |
| 23 | 88:28 | Salesforce help article — How to format numbers in DataWeave (`as String {format: "#,###.00"}`) |
| 24 | 88:59 | MuleSoft blog — Training Talks: How to Format Numbers in DataWeave (# vs 0 in patterns) |
| 25 | 91:15 | Medium article — Coercing with `as` (`price as Number`, `as Number {class: "java.lang.Double"}`, `as DateTime {format: …}`) |
| 26 | 91:40 | Playground: `100 as String {format: "#,##"}`, then `price as Number as String {format: "###.00"}` → "100.00" |

---

### 01 — DataWeave tutorial 7.2 The map Function — `map(Array<T>, ((T, Number) -> R)): Array<R>`
![map-tutorial](01-map-tutorial.jpg)

### 02 — Playground: `payload map ((item, index) -> item + 1)` on [1,2,3,4,5]
![map-playground](02-map-playground.jpg)

### 03 — Exercise: map each element to an object `{"value": …, "index": …}`
![map-value-index](03-map-value-index.jpg)

### 04 — Docs cookbook — Use Constant Directives (`var baseUrl = …` in the header, `++` to build URLs)
![constant-directives](04-constant-directives.jpg)

### 05 — Docs — Set Reader and Writer Configuration Properties (e.g. `output application/json indent=false`)
![reader-writer-props](05-reader-writer-props.jpg)

### 06 — Tutorial 8.2 The mapObject function — transform each key/value of an object
![mapobject-tutorial](06-mapobject-tutorial.jpg)

### 07 — `payload mapObject (value, key, index) -> { (upper(key)): value }` → all keys upper case
![mapobject-upper](07-mapobject-upper.jpg)

### 08 — Writer property `indent=false` compresses the JSON output onto one line
![indent-false](08-indent-false.jpg)

### 09 — Tutorial 7.4 The groupBy Function — `groupBy(Array<T>, (T, Number) -> R): Object`
![groupby-tutorial](09-groupby-tutorial.jpg)

### 10 — `payload distinctBy $.id` — removes duplicate items by a key
![distinctby](10-distinctby.jpg)

### 11 — Playground: `payload groupBy (n, idx) -> isEven(n)` on [1..10] → `{"false": [1,3,5,7,9], "true": [2,4,6,8,10]}`
![groupby-iseven](11-groupby-iseven.jpg)

### 12 — groupBy exercise — group calendar events by `dayOfWeek`
![groupby-exercise](12-groupby-exercise.jpg)

### 13 — Tutorial 7.5 reduce — `(item, accumulator) -> …`; first and second iterations explained
![reduce-tutorial](13-reduce-tutorial.jpg)

### 14 — Playground: `payload reduce ((n, total) -> total + n)` on [1,2,3] → 6
![reduce-sum](14-reduce-sum.jpg)

### 15 — MuleSoft tutorial: "DataWeave reduce function: How to loop through and transform an Array into a different type"
![reduce-article](15-reduce-article.jpg)

### 16 — `payload reduce ((item, acc = {}) -> acc ++ { (item.name): item.id })` — array of {id, name} turned into one object
![reduce-to-object](16-reduce-to-object.jpg)

### 17 — DZone: "DataWeave and the Reduce Operator: Part I" — sum of a list, more complex arithmetic, array-to-array
![dzone-reduce](17-dzone-reduce.jpg)

### 18 — DZone Part II: array to string (`acc ++ character`) and array to an object/map keyed by ClubID
![reduce-array-to-string](18-reduce-array-to-string.jpg)

### 19 — Docs — `orderBy` (objects by value or key; arrays by criteria)
![orderby-docs](19-orderby-docs.jpg)

### 20 — Playground: `payload orderBy ((item, index) -> item.age)` on a list of people
![orderby-playground](20-orderby-playground.jpg)

### 21 — Tutorial 8.3 The pluck function — turn an object into an array: `payload pluck (v, k, idx) -> {(k): v}`
![pluck](21-pluck.jpg)

### 22 — Tutorial 8.4 The update operator — change specific fields of an object
![update-operator](22-update-operator.jpg)

### 23 — Salesforce help article — How to format numbers in DataWeave (`as String {format: "#,###.00"}`)
![format-numbers](23-format-numbers.jpg)

### 24 — MuleSoft blog — Training Talks: How to Format Numbers in DataWeave (# vs 0 in patterns)
![training-talks-numbers](24-training-talks-numbers.jpg)

### 25 — Medium article — Coercing with `as` (`price as Number`, `as Number {class: "java.lang.Double"}`, `as DateTime {format: …}`)
![coercion](25-coercion.jpg)

### 26 — Playground: `100 as String {format: "#,##"}`, then `price as Number as String {format: "###.00"}` → "100.00"
![as-string-format](26-as-string-format.jpg)

