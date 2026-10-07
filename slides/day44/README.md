# Day 44 — Slides and On-Screen Drawings

Screens from the Day 44 class (9 Jan 2025) in the DataWeave Playground and tutorial: variables, logical and equality operators (== vs ~=), default, if/else and match, functions and lambdas, filter and filterObject. Repeated and blank frames have been removed. Times are positions in the video.

Notes for this day: [detailed-notes/day44.md](../../detailed-notes/day44.md) · [super-detailed-notes/day44.md](../../super-detailed-notes/day44.md) · [summary](../../day44.md)

| # | Time | Content |
|---|---|---|
| 01 | 1:08 | DataWeave tutorial 4 — Variables & Logical Operators |
| 02 | 1:20 | Tutorial 4.1 Variable Access — `var <name> = <expression>` in the header; descendant / multi-value examples with `payload..id`, `payload.*id` |
| 03 | 7:37 | Playground: `var test=payload` / `var demo=test.message` → `{var1: test.message, var2: demo}` → both "Hello world!" |
| 04 | 12:06 | Tutorial 4.2 Logical Operators — >, <, >=, <=, ==, ~=, not, !, and, or |
| 05 | 16:36 | Tutorial 4.3 Challenge — build an array of names and addresses from a data variable |
| 06 | 17:48 | MuleSoft developer tutorial: "How to compare different data types in DataWeave using equality operators" |
| 07 | 17:57 | `"1" == 1`, `"true" == true`, `|2020-01-01| == "2020-01-01"`, `/a/ == "a"`, `typeOf("abc") == "String"` → all **false** with `==` |
| 08 | 22:36 | The same examples with the **similar operator `~=`** — values are coerced, so they return true |
| 09 | 24:39 | Playground: `payload.number1 ~= payload.number2` (100 vs "100") → true |
| 10 | 28:59 | `if (typeOf(payload.number1) == "Number" and typeOf(payload.number2) == "Number") … else "not a number"` — tooltip: comparing Type<100> with "Number" always returns false; use `~=` |
| 11 | 36:55 | `default` operator: `payload.number1 + (payload.number2 default 0)` when a field is missing |
| 12 | 40:39 | `payload.test1 ++ payload.test2` with a missing field → error "Unable to call ++ with (String, Null)"; fixed with `default ""` |
| 13 | 44:18 | Tutorial 5.1 If Else — `var action = if (payload.price < 100) "buy" else "hold"` |
| 14 | 48:42 | `if ((payload.price < 100) and payload.action == "buy") "buy" else "hold"` → `{price: 80, action: "hold"}` |
| 15 | 60:31 | Exercise: else-if chain adding a "sell" action when the price exceeds 140 |
| 16 | 60:39 | Tutorial 5.2 Pattern Matching with Literal Values — `match { case … -> …  else -> … }` |
| 17 | 62:52 | `payload.action match { case "buy" -> "Buy at market price"  case "sell" -> …  case "hold" -> "Hold asset"  else -> "Invalid input" }` |
| 18 | 64:13 | Tutorial 7 Working with Arrays — filter, map, distinctBy, groupBy, reduce |
| 19 | 65:36 | Tutorial 7.1 filter — `filter(Array<T>, (item: T, index: Number) -> Boolean): Array<T>` |
| 20 | 66:16 | Tutorials 6.1 Named Functions (`fun`) and 6.2 Lambdas (`(arg) -> body`) |
| 21 | 66:31 | Tutorial 6.3 Functions as Values — `filter(payload, (n, idx) -> (n mod 2) == 1)` |
| 22 | 71:33 | Playground: `payload filter ((item, index) -> isEven(item))` on [1..10] → [2, 4, 6, 8, 10] |
| 23 | 78:55 | `payload filter ((item, index) -> item.salary > 50000)` on an employee list (mahesh / ramesh / rajesh) |
| 24 | 82:29 | `payload filter ($.salary > 50000)` — shorthand with `$`; error when used on a string payload |
| 25 | 83:53 | Tutorial 8.1 filterObject — `payload filterObject (value, key, index) -> key ~= "age"` (keys are of type Key, so `==` fails) |
| 26 | 91:17 | Playground: `payload filterObject (value, key, index) -> value == "age"` → `{}` — filters on values, not keys |

---

### 01 — DataWeave tutorial 4 — Variables & Logical Operators
![dw-variables-tutorial](01-dw-variables-tutorial.jpg)

### 02 — Tutorial 4.1 Variable Access — `var <name> = <expression>` in the header; descendant / multi-value examples with `payload..id`, `payload.*id`
![variable-access](02-variable-access.jpg)

### 03 — Playground: `var test=payload` / `var demo=test.message` → `{var1: test.message, var2: demo}` → both "Hello world!"
![playground-vars](03-playground-vars.jpg)

### 04 — Tutorial 4.2 Logical Operators — >, <, >=, <=, ==, ~=, not, !, and, or
![logical-operators](04-logical-operators.jpg)

### 05 — Tutorial 4.3 Challenge — build an array of names and addresses from a data variable
![challenge](05-challenge.jpg)

### 06 — MuleSoft developer tutorial: "How to compare different data types in DataWeave using equality operators"
![compare-types-article](06-compare-types-article.jpg)

### 07 — `"1" == 1`, `"true" == true`, `|2020-01-01| == "2020-01-01"`, `/a/ == "a"`, `typeOf("abc") == "String"` → all **false** with `==`
![equality-examples](07-equality-examples.jpg)

### 08 — The same examples with the **similar operator `~=`** — values are coerced, so they return true
![similar-operator](08-similar-operator.jpg)

### 09 — Playground: `payload.number1 ~= payload.number2` (100 vs "100") → true
![playground-similar](09-playground-similar.jpg)

### 10 — `if (typeOf(payload.number1) == "Number" and typeOf(payload.number2) == "Number") … else "not a number"` — tooltip: comparing Type<100> with "Number" always returns false; use `~=`
![typeof-check](10-typeof-check.jpg)

### 11 — `default` operator: `payload.number1 + (payload.number2 default 0)` when a field is missing
![default-operator](11-default-operator.jpg)

### 12 — `payload.test1 ++ payload.test2` with a missing field → error "Unable to call ++ with (String, Null)"; fixed with `default ""`
![concat-null-error](12-concat-null-error.jpg)

### 13 — Tutorial 5.1 If Else — `var action = if (payload.price < 100) "buy" else "hold"`
![if-else-tutorial](13-if-else-tutorial.jpg)

### 14 — `if ((payload.price < 100) and payload.action == "buy") "buy" else "hold"` → `{price: 80, action: "hold"}`
![if-else-and](14-if-else-and.jpg)

### 15 — Exercise: else-if chain adding a "sell" action when the price exceeds 140
![else-if-chain](15-else-if-chain.jpg)

### 16 — Tutorial 5.2 Pattern Matching with Literal Values — `match { case … -> …  else -> … }`
![pattern-matching](16-pattern-matching.jpg)

### 17 — `payload.action match { case "buy" -> "Buy at market price"  case "sell" -> …  case "hold" -> "Hold asset"  else -> "Invalid input" }`
![match-example](17-match-example.jpg)

### 18 — Tutorial 7 Working with Arrays — filter, map, distinctBy, groupBy, reduce
![working-with-arrays](18-working-with-arrays.jpg)

### 19 — Tutorial 7.1 filter — `filter(Array<T>, (item: T, index: Number) -> Boolean): Array<T>`
![filter-signature](19-filter-signature.jpg)

### 20 — Tutorials 6.1 Named Functions (`fun`) and 6.2 Lambdas (`(arg) -> body`)
![named-functions-lambdas](20-named-functions-lambdas.jpg)

### 21 — Tutorial 6.3 Functions as Values — `filter(payload, (n, idx) -> (n mod 2) == 1)`
![functions-as-values](21-functions-as-values.jpg)

### 22 — Playground: `payload filter ((item, index) -> isEven(item))` on [1..10] → [2, 4, 6, 8, 10]
![filter-iseven](22-filter-iseven.jpg)

### 23 — `payload filter ((item, index) -> item.salary > 50000)` on an employee list (mahesh / ramesh / rajesh)
![filter-salary](23-filter-salary.jpg)

### 24 — `payload filter ($.salary > 50000)` — shorthand with `$`; error when used on a string payload
![filter-dollar-error](24-filter-dollar-error.jpg)

### 25 — Tutorial 8.1 filterObject — `payload filterObject (value, key, index) -> key ~= "age"` (keys are of type Key, so `==` fails)
![filterobject](25-filterobject.jpg)

### 26 — Playground: `payload filterObject (value, key, index) -> value == "age"` → `{}` — filters on values, not keys
![filterobject-value](26-filterobject-value.jpg)

