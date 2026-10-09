# Day 44 — DataWeave: Variables, Operators, default, if/else, match, filter and filterObject

## Session Agenda
- Variables inside a DataWeave script
- Logical and equality operators (`==` vs `~=`)
- The `default` operator and `++`
- `if` / `else if` / `else` and `match`
- `filter` on arrays and `filterObject` on objects

## Variables
- `var name = expression` in the header; used by name (no `vars.`).
- Scope: only that script.
- Handy for long repeated paths.

## Operators
- `>`, `<`, `>=`, `<=`, `==`, `!=`, `~=`, `!`/`not`, `and`, `or`.
- `~=` coerces types: `"1" ~= 1` is true, `"1" == 1` is false.
- `typeOf(x) == "Number"` is always false — use `~=`.

## default and ++
- `payload.number2 default 0` when a field is missing.
- `++` on a null → "Unable to call ++ with (String, Null)" — fix with `default ""`.
- `++` merges objects, joins strings and arrays.

## Conditions
- `if (payload.price < 100) "buy" else if (payload.price > 140) "sell" else "hold"`.
- String comparisons are case sensitive.
- `do` for local variables and `match` for switch-like cases — both rare.

## filter and filterObject
- `filter`: array → array; `(item, index)` or `$` / `$$` — e.g. `isEven(item)`, `$.salary > 50000`.
- `filterObject`: object → object; `(value, key, index)`.
- Keys are type **Key** — use `key ~= "age"` or `key as String`.

## Quick Recap
- `var` is script-scoped.
- `~=` vs `==`.
- `default` prevents null errors.
- filter for arrays, filterObject for objects.
- For-each is a Mule scope, not a DW function.
