# Day 45 — DataWeave: map, mapObject, distinctBy, groupBy, reduce, orderBy, pluck, update, Dates and Number Formatting (Playground)

> **Sources:**
> - Cleaned audio transcript ([transcripts-cleaned/day45.txt](../transcripts-cleaned/day45.txt)) and the class video (recorded 10 Jan 2025).
> - Text marked *screen* is read from the recording.
> - Slide images: [slides/day45](../slides/day45/).

## 1. Overview

1. Recap — filter vs. filterObject
2. **map** — transform every array item
3. Interview tip — keep the expected output in the Playground; `indent=false`
4. **mapObject** — transform keys/values; `(key)` in parentheses
5. **distinctBy** — remove duplicates
6. **groupBy** — group into an object of arrays
7. **reduce** — accumulator, array → number/object/array
8. **orderBy** — ascending / descending
9. **pluck** — object → array
10. **update** operator
11. Dates — `now()`, time zones, formats, string → date
12. Number formatting and coercion with `as`

---

## 2. Recap — filter vs. filterObject

| | Input | Output |
|---|---|---|
| filter | Array | Array |
| filterObject | Object | Object |

- Interview: explain it exactly like that.

---

## 3. map

*Screen — Tutorial 7.2:* `map(Array<T>, ((T, Number) -> R)): Array<R>`.

- "Transforming every item in an array to something else" — a very common integration use case.
- Like filter, it takes an array and a lambda.
- **Input array → output array.**
- Parameters: **item, index** (`$`, `$$`).
- Very useful from an interview point of view.
- **Instructor's view:** he never reads the type definition — just remember array in/out, item and index.

*Screen — Playground:*

```dataweave
payload map ((item, index) -> item + 1)
```

on `[1,2,3,4,5]` → `[2,3,4,5,6]` (or `item * 2`).

- It iterates **as many times as there are items**.

### 3.1 Exercise — map to objects

*Screen:* map each element to `{"value": …, "index": …}`:

```dataweave
payload map ((i, ix) -> { "value": i, "index": ix })
```

or with shorthand:

```dataweave
payload map { "value": $, "index": $$ }
```

- Renamed parameters must be used consistently.
- **Instructor's preference:** write the parameters; but recognise the `$` form in existing projects.

---

## 4. Interview Tip — Keep the Output in View

- In screen-share interviews, the input/output are given in the Teams/Zoom chat.
- Paste the input into the Playground and keep the **expected output** there too (e.g. in a `var out = …`), so you don't switch screens.
- *Screen — docs:* **Use Constant Directives** (`var baseUrl = …` in the header, `++` to build URLs).
- *Screen — docs:* **Set Reader and Writer Configuration Properties**.
- **`output application/json indent=false`** — prints the JSON on one line (*screen*), saving space.

---

## 5. mapObject

*Screen — Tutorial 8.2:* transform each key/value of an object.

*Screen:*

```dataweave
payload mapObject (value, key, index) -> { (upper(key)): value }
```

→ all keys **upper case**.

- Parameters: **value, key, index** (`$`, `$$`, `$$$`).
- `upper()` converts to upper case; `lower()` to lower case.
- The result must be in **curly braces** (an "invalid input" error without them).
- **On the left side, wrap the key in parentheses** — `(key)` means "the actual key"; plain `key` is taken as the literal word "key" (hard-coding).
- The right side (value) doesn't need parentheses — `upper(value)` changes values.

Shorthand:

```dataweave
payload mapObject { (upper($$)): $ }
```

---

## 6. distinctBy

*Screen:*

```dataweave
payload distinctBy $.id
```

- Removes **duplicate items** from an array based on a key (`id` repeated → kept once).
- Camel case: `distinctBy`.
- Uniqueness can be on a combination — concatenate two fields.

---

## 7. groupBy

*Screen — Tutorial 7.4:* `groupBy(Array<T>, (T, Number) -> R): Object`.

- "Grouping together items in an array based on some value."
- **Returns an object, not an array** — an object of arrays.

*Screen — Playground:*

```dataweave
payload groupBy (n, idx) -> isEven(n)
```

on `[1..10]` →

```json
{"false": [1,3,5,7,9], "true": [2,4,6,8,10]}
```

*Screen — exercise:* group calendar events by **`dayOfWeek`** → keys Wednesday (3 items), Saturday, Sunday…; changing a value creates another group.

---

## 8. reduce

*Screen — Tutorial 7.5:* `(item, accumulator) -> …`.

- "A general-purpose looping tool."
- Can transform an array into **any other type**; can do the work of map, filter, distinctBy, groupBy.
- Common interview question: **how do you convert an array into an object?** → **reduce**.
- **Object → array** → **pluck**.

**Instructor's experience:** use depends on the project — last project mostly `upper`/`lower`, the one before `map` and `default`. Most integration projects are easy-to-medium; DataWeave scripts rarely exceed 50–100 lines.

### 8.1 Sum

*Screen:*

```dataweave
payload reduce ((n, total) -> total + n)
```

on `[1,2,3]` → **6** (array → number).

**How the accumulator works** (renamed `i` = item, `a` = accumulator), on `[5, 2, 3]`:

| Accumulator default | Iterations |
|---|---|
| **None** | a = 5 (first item), i starts at 2: 5+2 = 7, 7+3 = **10** |
| `a = 0` | 0+5, 5+2, 7+3 = 10 |
| `a = 12` | i starts at 5: 12+5 = 17, 17+2 = 19, 19+3 = **22** |

- No default → accumulator = **first item**, items start from the **second**.
- With a default → items start from the **first**.

### 8.2 Array of objects → one object

*Screen — MuleSoft tutorial:* "DataWeave reduce function: How to loop through and transform an Array into a different type".

*Screen:*

```dataweave
payload reduce ((item, acc = {}) -> acc ++ { (item.name): item.id })
```

- Accumulator starts as an **empty object** because the output is an object.
- Key from `item.name` (dev, test, uat, prod) in parentheses; value `item.id`.

### 8.3 Array → array (DZone)

*Screen — DZone:* "DataWeave and the Reduce Operator: Part I" — sum of a list, more complex arithmetic, array-to-array.

```dataweave
payload reduce ((value, acc = []) -> acc ++ [value.country ++ "-" ++ value.capital])
```

- Accumulator = empty array; each "country-capital" string is added.
- **Without `acc = []`:** the accumulator is the first item (an **object**) → error *"You called the function ++ with these arguments: Object, String"* — you can't add a string to an object (it needs a key).

*Screen — DZone Part II:* array to string (`acc ++ character`) and array to an object keyed by ClubID.

> **Instructor's view:** these articles explain more simply than the official docs. reduce alone could take 2–3 hours — practise use cases.

---

## 9. orderBy

*Screen — docs:* `orderBy` — objects by value or key; arrays by criteria. (Not in the tutorial.)

- Default: **ascending** (alphabetical for letters).
- **Descending:** put a minus — `orderBy -$.letter`.

*Screen — Playground:*

```dataweave
payload orderBy ((item, index) -> item.age)
```

- Order objects by a **key inside** them — ordering by the object itself errors: *"You cannot compare a value of the type Object."*
- `item.name` → Mahesh first; `-$.age` reverses.

---

## 10. pluck

*Screen — Tutorial 8.3:* "Transform an object into an array."

```dataweave
payload pluck (v, k, idx) -> {(k): v}
```

- Each key–value pair becomes an item → an array of objects.
- reduce: array → object; **pluck: object → array**.

---

## 11. update Operator

*Screen — Tutorial 8.4:* change specific fields of an object.

- `update` with `case … at .field`:
  - `.status!` → **adds** a new field (status "retired") that wasn't there.
  - `case age at .age -> age + 1` → **modifies** an existing field.
  - Changing first name — modified.
- **Instructor's experience:** never used it in real time; explore it.

> **Instructor's view:** what's covered so far is more than enough to start; learn more on the go.

---

## 12. Dates

- **`now()`** — the server's current date-time (shown in Indian time locally).
- Convert time zones with **`>>`** — e.g. `now() >> "IST"`, `>> "GMT"`.
- **CloudHub servers use UTC.**
- Types: **Date** vs **DateTime**.

**Formatting:**

| Pattern | Meaning |
|---|---|
| `yyyy` / `yy` | Year (small letters) |
| `MM` | Month number (**caps**) |
| `MMM` | Month name |
| `dd` | Day (small) |

- e.g. `yyyy-MM-dd` → `dd-MM-yy`.

**String → date in a new format** (JSON dates arrive as **String** — `typeOf` → String):

1. First convert the string **in its existing format** to a Date.
2. Then format that Date into the new format.

```dataweave
("10-01-2025" as Date {format: "dd-MM-yyyy"}) as String {format: "yyyy-MM-dd"}
```

- The values above are illustrative — the two steps are what was shown.
- Converting directly from the string to a different format **won't work** — it doesn't coerce.

---

## 13. Number Formatting and Coercion

*Screen — Salesforce help:* "How to format numbers in DataWeave" — `as String {format: "#,###.00"}`.

*Screen — MuleSoft blog:* "Training Talks: How to Format Numbers in DataWeave" — `#` vs `0` in patterns.

*Screen — Medium:* Coercing with `as` — `price as Number`, `as Number {class: "java.lang.Double"}`, `as DateTime {format: …}`.

*Screen — Playground:*

```dataweave
100 as String {format: "#,##"}
```

```dataweave
var price = "100"
---
price as Number as String {format: "###.00"}   // "100.00"
```

- Formatting a number means converting it **to a String** with a format.
- What matters is how these combine.

**Pending:** CSV and XML handling — at the end of the course.

---

## 14. Important Terminology

| Term | Meaning |
|---|---|
| map | Transform each array item → array |
| mapObject | Transform each key/value → object |
| `(key)` | Dynamic key in an object constructor |
| distinctBy | Remove duplicates by a criterion |
| groupBy | Group items into an object of arrays |
| reduce | Loop with an accumulator → any type |
| Accumulator | Running value in reduce; defaults to the first item |
| orderBy | Sort; minus for descending |
| pluck | Object → array |
| update | Change or add specific fields |
| `>>` | Shift a date-time to another time zone |
| `as` | Coerce a value to another type (with format) |
| indent=false | Writer property — compact one-line output |

---

## 15. Interview Questions

### Q1. map vs. mapObject?
map works on arrays (item, index) and returns an array; mapObject works on objects (value, key, index) and returns an object.

### Q2. How do you convert an array into an object?
reduce with an empty-object accumulator, e.g. `payload reduce ((item, acc = {}) -> acc ++ {(item.name): item.id})`.

### Q3. How do you convert an object into an array?
pluck, e.g. `payload pluck (v, k) -> {(k): v}`.

### Q4. What does reduce use as the accumulator if none is given?
The first item; iteration then starts from the second item.

### Q5. What does groupBy return?
An object whose keys are the group values and whose values are arrays of items.

### Q6. How do you sort descending?
`orderBy -$.field`.

### Q7. How do you remove duplicates?
`distinctBy $.id` (or on a combination of fields).

### Q8. How do you change a date string's format?
Coerce it to Date using its current format, then format it as a String in the new format.

### Q9. What time zone do CloudHub servers use?
UTC.

---

## 16. Must Remember

1. map: array → array; mapObject: object → object.
2. Dynamic keys go in parentheses: `{(upper(key)): value}`.
3. distinctBy removes duplicates.
4. groupBy returns an **object of arrays**.
5. reduce: no default → accumulator = first item.
6. Array → object = reduce; object → array = pluck.
7. orderBy ascending; `-` for descending; order by a key, not an object.
8. `now() >> "IST"`; CloudHub = UTC.
9. String date → Date (existing format) → String (new format).
10. Format numbers with `as String {format: "…"}`.
