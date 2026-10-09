# Day 44 — DataWeave: Variables, Logical and Equality Operators, default, if/else, match, filter and filterObject (Playground)

> **Sources:**
> - Cleaned audio transcript ([transcripts-cleaned/day44.txt](../transcripts-cleaned/day44.txt)) and the class video (recorded 9 Jan 2025).
> - Text marked *screen* is read from the recording.
> - Slide images: [slides/day44](../slides/day44/).

## 1. Overview

1. Recap — selectors and data types
2. **Variables** in a DataWeave script (`var`) and their scope
3. **Logical operators** — comparison, `!`/`not`, `and`/`or`
4. **`==` vs. `~=`** (similar operator) and `typeOf`
5. The **`default`** operator; `++` on strings and objects
6. **if / else / else if**; local variables with `do`
7. **Pattern matching** with `match`
8. Working with arrays — **filter**, `$` / `$$`
9. **filterObject** — keys are of type Key

---

## 2. Recap

- Selectors: single value, index, range, multi-value, descendants — **single value and index** are used regularly.
- Data types used most: strings, numbers, booleans, arrays, objects — mainly JSON with string data.

---

## 3. Variables in a Script

*Screen — Tutorial 4.1 Variable Access:* `var <name> = <expression>` in the header.

- A Set Variable / Transform variable is accessed with `vars.name`.
- A **script variable** is declared in the header with `var` and used by **name only** (no `vars.`).
- **Scope:** only inside that script (anywhere in its 1000 lines) — not after the Transform/Set Variable.
- Value can be hard-coded or an expression; arrays/objects work too (use indexes/selectors on them).

*Screen — Playground:*

```dataweave
%dw 2.0
var test = payload
var demo = test.message
output application/json
---
{
  var1: test.message,
  var2: demo
}
```

→ both `"Hello world!"`.

- One variable can be built from another.
- **Readability:** for long or repeated paths (e.g. `payload.secondlevel.id`), assign `var test = payload.secondlevel` and write `test.id`.
- *Screen:* tutorial examples with `payload..id` and `payload.*id` — without `*`, the first `id` is taken.

---

## 4. Logical Operators

*Screen — Tutorial 4.2:* `>`, `<`, `>=`, `<=`, `==`, `~=`, `not`, `!`, `and`, `or`.

| Operator | Meaning |
|---|---|
| `==` / `!=` | Equal / not equal (e.g. `test.*id[1] == 2` → 22 vs 2 → false) |
| `~=` | Similar to — coerces types |
| `!` / `not` | Negation (e.g. `!isBlank("abc")`) |
| `and` | Both conditions true |
| `or` | Either condition true |

- `upper(...)` on both sides made a case-different comparison true with `==`.
- `isEmpty`, `isBlank` return booleans; `!` flips them.
- *Screen — Tutorial 4.3 Challenge:* build an array of names and addresses from a data variable.

---

## 5. `==` vs. `~=`

*Screen — MuleSoft developer tutorial:* "How to compare different data types in DataWeave using equality operators".

*Screen:*

```dataweave
"1" == 1                       // false
"true" == true                 // false
|2020-01-01| == "2020-01-01"   // false
/a/ == "a"                     // false
```

- With **`~=`** the same comparisons are **true** — "The similar operator tries to coerce one value to the type of the other."
- *Screen — Playground:* `payload.number1 ~= payload.number2` (100 vs "100") → **true**; `==` → false.

### 5.1 typeOf

- `typeOf(payload)` → `Object`; `typeOf(payload.id)` → `Number`; `true` → `Boolean` (only lower-case `true`/`false`).
- `typeOf("abc") == "String"` → **false** with `==`.

*Screen:*

```dataweave
if (typeOf(payload.number1) == "Number" and typeOf(payload.number2) == "Number")
  "number"
else
  "not a number"
```

- Always gave "not a number" — *screen tooltip:* comparing `Type<100>` with `"Number"` always returns false; use `~=`.
- With **`~=`**: both numbers → "number"; one string → "not a number".
- `typeOf` returns a **type**, not a string.

---

## 6. The `default` Operator

- If an expected key doesn't come, its value is **null**.

*Screen:*

```dataweave
payload.number1 + (payload.number2 default 0)
```

- If `number2` comes, it's used; otherwise **0**.
- Default can be any value — number, string, array or object.

### 6.1 With `++`

*Screen:* `payload.test1 ++ payload.test2` with a missing field → error **"Unable to call ++ with (String, Null)"**.

```dataweave
payload.test1 ++ (payload.test2 default "")
```

- `++` concatenates **string + string**, **object + object** (merged into one object), **array + array**.
- An object with a missing one → `default {}`.
- A misspelt `default` was the cause of one error.

---

## 7. if / else

*Screen — Tutorial 5.1:*

```dataweave
%dw 2.0
var action = if (payload.price < 100) "buy" else "hold"
output application/json
---
{ price: payload.price, action: action }
```

- Price 120 → **hold**.
- Syntax: `if (condition) value else value`.

### 7.1 Multiple conditions

*Screen:*

```dataweave
if ((payload.price < 100) and payload.action == "buy") "buy" else "hold"
```

- No `action` in payload → null == "buy" → false → `{price: 80, action: "hold"}`.
- `"Buy"` vs `"buy"` — **case sensitive**.
- `or`: true if either is true; false or false → hold.
- Three or more conditions: put them in brackets.

### 7.2 else if

*Screen — exercise:* add "sell" above 140.

```dataweave
if (payload.price < 100) "buy"
else if (payload.price > 140) "sell"
else "hold"
```

| Price | Action |
|---|---|
| < 100 | buy |
| 100–140 | hold |
| > 140 | sell |

- Outputs can be objects or arrays too.
- The condition can be written directly in the body; the tutorial uses a variable to keep the body clean.

### 7.3 Local variables with `do`

- `var` in the header is usable anywhere in the script.
- `do` creates a variable scoped to one part — saves a little memory in a huge script.
- **Instructor's view:** a very rare requirement; he's barely used it.

---

## 8. Pattern Matching — `match`

*Screen — Tutorial 5.2:* literal pattern matching — `match { case … -> … else -> … }`.

*Screen:*

```dataweave
payload.action match {
  case "buy"  -> "Buy at market price"
  case "sell" -> "…"
  case "hold" -> "Hold asset"
  else        -> "Invalid input"
}
```

- Like **switch** in other languages.
- Copying from Notepad can change double quotes — be careful.
- Rarely used; focus on if/else.

---

## 9. Working with Arrays — filter

*Screen — Tutorial 7:* filter, map, distinctBy, groupBy, reduce.

- Removing duplicates, grouping, sorting — needed regularly, like SQL on databases.

*Screen — Tutorial 7.1:*

```text
filter(Array<T>, (item: T, index: Number) -> Boolean): Array<T>
```

- **Input array → output array.** For objects use **filterObject**.
- *Screen — Tutorials 6.1/6.2/6.3:* named functions (`fun`), lambdas (`(arg) -> body`), functions as values — `filter(payload, (n, idx) -> (n mod 2) == 1)`.

### 9.1 Even numbers

*Screen — Playground:*

```dataweave
payload filter ((item, index) -> isEven(item))
```

on `[1, 2, … 10]` → `[2, 4, 6, 8, 10]`.

1. Takes item 1 — even? No — dropped.
2. Item 2 — yes — kept.
3. …and so on, building a new array.

- Odd: `!isEven(item)` or `isOdd(item)`.
- Without isEven: `(item mod 2) == 0` (even) / `!= 0` (odd).
- Parameters can be renamed (`x`, `i`) but must be used consistently — renaming one caused an error.
- Order is fixed by the function: **item first, then index**.

### 9.2 Employees by salary

*Screen:* employee list (mahesh / ramesh / rajesh):

```dataweave
payload filter ((item, index) -> item.salary > 50000)
```

- Each object is an item → Ramesh (80,000) and Mahesh (1 lakh) returned.

### 9.3 `$` and `$$`

*Screen:*

```dataweave
payload filter ($.salary > 50000)
```

| Symbol | Means (filter) |
|---|---|
| `$` | item |
| `$$` | index |

- Useful to recognise in others' code.
- *Screen:* using `filter` on a string payload → error *"You called the function filter with these arguments…"*.

---

## 10. filterObject

- **filter / map** → arrays; **filterObject / mapObject** → objects.
- Auto-suggest shows filterObject when the input is an object.
- Parameters: **value, key, index** (`$`, `$$`, `$$$`).

*Screen — Tutorial 8.1:*

```dataweave
payload filterObject (value, key, index) -> key ~= "age"
```

- With `key == "age"` → empty `{}` — *"All object keys in DataWeave are of type Key, regardless of how the objects are created… that is why key == "age" returned false."*
- Fixes: **`~=`**, or **`(key as String) == "age"`**.
- `as` converts types (String, Number); if it can't convert → error.

*Screen:* `payload filterObject (value, key, index) -> value == "age"` → `{}` — that filters on **values**, not keys.

> **Interview tip:** filter is only for arrays — don't say strings. "The aim is to clear the interview rather than show off our knowledge."

**Q: Are there for loops?** For-each is a **scope** in Mule, not a DataWeave function — and even easier.

---

## 11. Important Terminology

| Term | Meaning |
|---|---|
| `var` | Script-level variable in the header, used by name |
| `do` | Creates a locally scoped variable (rare) |
| `~=` | Similar operator — compares after type coercion |
| `typeOf` | Returns a value's type |
| `default` | Fallback value when an expression is null |
| `++` | Concatenation of strings, objects or arrays |
| `match` | Pattern matching (switch-like) |
| `filter` | Keeps array items matching a condition |
| `filterObject` | Keeps object key-value pairs matching a condition |
| `$`, `$$`, `$$$` | Shorthand for item/value, index/key, index |
| Key type | Type of object keys — not a String |

---

## 12. Interview Questions

### Q1. What's the scope of a `var` in DataWeave?
Only that script; it's used by name and isn't available after the Transform/Set Variable.

### Q2. `==` vs. `~=`?
`==` requires the same type and value; `~=` coerces one value to the other's type first, so `"1" ~= 1` is true.

### Q3. How do you avoid null errors when a field is missing?
Use `default`, e.g. `payload.number2 default 0` or `payload.test2 default ""`.

### Q4. What does `++` do on objects?
Merges them into one object (also concatenates strings and arrays).

### Q5. filter vs. filterObject?
filter works on arrays (item, index) and returns an array; filterObject works on objects (value, key, index) and returns an object.

### Q6. Why does `key == "age"` fail in filterObject?
Keys are of type Key, not String. Use `~=` or `key as String`.

### Q7. What do `$` and `$$` mean in filter?
`$` is the item, `$$` is the index.

---

## 13. Must Remember

1. `var name = expr` in the header; use `name`, not `vars.name`.
2. `~=` coerces; `==` doesn't.
3. `typeOf` returns a type — compare with `~=`.
4. `default` fixes nulls (`Unable to call ++ with (String, Null)`).
5. `++` merges objects.
6. `if (…) … else if (…) … else …`; strings are case sensitive.
7. `match { case … -> … else -> … }` is rare.
8. filter: array in → array out; item then index.
9. filterObject: value, key, index; keys are type Key.
10. For-each is a Mule scope, not a DW function.
