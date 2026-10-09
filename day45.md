# Day 45 — DataWeave: map, mapObject, groupBy, reduce, orderBy, pluck, update, Dates and Numbers

## Session Agenda
- **map** and **mapObject**
- **distinctBy** and **groupBy**
- **reduce** and the accumulator
- **orderBy**, **pluck**, **update**
- Dates and time zones
- Number formatting and coercion with `as`

## map and mapObject
- map: array → array, `(item, index)` / `$`, `$$` — e.g. `item + 1`.
- mapObject: object → object, `(value, key, index)` — e.g. `{ (upper(key)): value }`.
- Dynamic keys go in **parentheses**.
- `indent=false` prints JSON on one line; keep the expected output in the Playground during interviews.

## distinctBy and groupBy
- `payload distinctBy $.id` removes duplicates.
- groupBy returns an **object of arrays** — e.g. even/odd → `{"false": […], "true": […]}`; events by `dayOfWeek`.

## reduce
- General-purpose loop with an item and an **accumulator**.
- No default → accumulator = first item, items start at the second.
- Array → object: `payload reduce ((item, acc = {}) -> acc ++ { (item.name): item.id })`.
- Array → array needs `acc = []`.

## orderBy, pluck, update
- orderBy ascending; `-$.age` for descending; order by a key, not an object.
- pluck: object → array (`{(k): v}`).
- update: modify (`case age at .age -> age + 1`) or add (`.status!`) fields — rarely used.

## Dates and Numbers
- `now()`, `>> "IST"`; CloudHub servers use UTC.
- `MM` = month, `dd`, `yy`; `MMM` = month name.
- String date → Date in its existing format → String in the new format.
- `price as Number as String {format: "###.00"}` → "100.00".

## Quick Recap
- Array → object = reduce; object → array = pluck.
- groupBy → object; distinctBy → unique array.
- CSV and XML handling come at the end of the course.
