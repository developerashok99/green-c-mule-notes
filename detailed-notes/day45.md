# Day 45 — Detailed Notes: map, mapObject, distinctBy, groupBy, reduce, orderBy, pluck, update, Dates and Numbers

> **Watch alongside:**
> - The Playground session that covers the array and object functions you'll use most. Watch the reduce part twice — the accumulator rules (first item by default, or your own start value) are what interviewers check.
> - Remember the two conversions: array → object with **reduce**, object → array with **pluck**.

> **Video-verified:** written from the cleaned transcript and the class recording (10 Jan 2025). Slide images: [slides/day45](../slides/day45/).

---

## 1. Which Function for Which Shape

```mermaid
flowchart LR
    A["Array"] -->|"map / filter / distinctBy / orderBy"| A2["Array"]
    A -->|"groupBy"| O1["Object of arrays"]
    A -->|"reduce (acc = {})"| O2["Object"]
    A -->|"reduce"| N["Number / string / anything"]
    O["Object"] -->|"mapObject / filterObject"| O3["Object"]
    O -->|"pluck"| A3["Array"]
```

---

## 2. map and mapObject

![mapObject upper](../slides/day45/07-mapobject-upper.jpg)

| Function | Example | Result |
|---|---|---|
| map | `payload map ((item, index) -> item + 1)` | [2,3,4,5,6] |
| map | `payload map { "value": $, "index": $$ }` | array of objects |
| mapObject | `payload mapObject (value, key, index) -> { (upper(key)): value }` | keys upper case |

- `(key)` in parentheses = the real key; without them it's the literal text "key".
- `indent=false` prints JSON on one line — handy when keeping the expected output in the Playground during an interview.

---

## 3. distinctBy and groupBy

![groupBy isEven](../slides/day45/11-groupby-iseven.jpg)

- `payload distinctBy $.id` — drop duplicates.
- `payload groupBy (n, idx) -> isEven(n)` → `{"false": [1,3,5,7,9], "true": [2,4,6,8,10]}`.
- Calendar events grouped by `dayOfWeek`.

---

## 4. reduce

![reduce to object](../slides/day45/16-reduce-to-object.jpg)

```mermaid
flowchart LR
    S["[5, 2, 3]<br/>no default"] --> I1["acc = 5, item = 2 → 7"]
    I1 --> I2["acc = 7, item = 3 → 10"]
    D["[5, 2, 3]<br/>acc = 12"] --> J1["12 + 5 = 17"]
    J1 --> J2["17 + 2 = 19"]
    J2 --> J3["19 + 3 = 22"]
```

- `payload reduce ((item, acc = {}) -> acc ++ { (item.name): item.id })` — array → object.
- `acc = []` + `acc ++ [value.country ++ "-" ++ value.capital]` — array → array; without `[]` you get "++ with Object, String".

---

## 5. orderBy, pluck, update

| Function | Example | Note |
|---|---|---|
| orderBy | `payload orderBy ((item, index) -> item.age)` | `-$.age` for descending; can't order by a whole object |
| pluck | `payload pluck (v, k, idx) -> {(k): v}` | object → array |
| update | `case age at .age -> age + 1`, `.status!` | modify or add a field; rarely used |

---

## 6. Dates and Numbers

![Number formatting](../slides/day45/26-as-string-format.jpg)

```mermaid
flowchart LR
    S["&quot;10-01-2025&quot; (String)"] -->|"as Date {format: existing}"| D["Date"]
    D -->|"as String {format: new}"| N["&quot;2025-01-10&quot;"]
    S -.->|"direct to new format"| X["Doesn't work"]
```

- `now()`; `>> "IST"` / `>> "GMT"`; CloudHub servers use **UTC**.
- `MM` month (caps), `dd`/`yy` small, `MMM` month name.
- `price as Number as String {format: "###.00"}` → "100.00"; `#` vs `0` in patterns.

---

## Quick Recap
- map/mapObject transform arrays/objects; dynamic keys need parentheses.
- distinctBy removes duplicates; groupBy returns an object of arrays.
- reduce loops with an accumulator — first item by default — and can return any type; array → object is the classic use.
- orderBy sorts (minus = descending); pluck turns an object into an array; update changes fields.
- Dates: convert the string using its own format first, then reformat; CloudHub is UTC.
- Numbers are formatted by converting to String with a format pattern.
