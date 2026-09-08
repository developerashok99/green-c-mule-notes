# Day 10 — URI Parameters vs. Query Parameters (Deep Dive)

## Topics Covered
- URI parameters vs. query parameters — precise distinction and when to use each
- Filtering, sorting, and pagination via query parameters
- Strict validation (API Kit Router) and `additionalProperties` in RAML
- Why "best practices" often aren't followed in the real world

## URI Parameters ("Path Parameters")
- **URI = Unique Resource Identifier.** A URI parameter is embedded directly in the URL path itself: `.../employees/101`.
- **Use when identifying one specific, unique resource** — e.g. an employee ID, a bank account number — where the value is essentially **mandatory** for the request to make sense at all (you can't ask "get employee details" with no ID at all).
- **Access syntax:** `attributes.uriParams.employeeId`
- Multiple URI params are supported: e.g. `.../departments/{deptId}/employees/{empId}`.
- Defined either directly on the Listener path, or (more commonly, in real projects) as part of the **RAML API specification**.

## Query Parameters
- Appended to the URL after a `?`: `.../employees?status=active&orderBySalary=asc`
- **Access syntax:** `attributes.queryParams.status`
- **Three canonical use cases:**
  1. **Filter** — narrow down a result set (e.g. `status=inactive` → only resigned employees).
  2. **Sort** — order the results (e.g. `orderBySalary=asc` or `desc`).
  3. **Paginate** — return results in manageable chunks using **`offset`** and **`limit`**.

### Pagination Mechanics (offset & limit)
- `limit` = how many records to return per "page."
- `offset` = where in the full result set to start from.
- Example with `limit=15`: page 1 → `offset=0` (records 1-15); page 2 → `offset=15` (records 16-30); page 3 → `offset=30` (records 31-45); etc.
- **Why paginate:** loading, say, 8,500 records into a front-end UI at once is slow and resource-heavy — sending manageable chunks (e.g. 100 at a time) keeps the experience responsive. The exact chunk size (15, 25, 100...) is typically decided through actual performance testing, not guesswork.
- **Business context matters for how much latency is acceptable:** a customer-facing app (e.g. Flipkart search) needs near-instant responses (customers abandon slow apps within seconds) — internal/back-office tools (e.g. an HR report) can tolerate a multi-second wait with no real business cost.

## URI Params vs. Query Params — Decision Rule
> **If the parameter is mandatory to make sense of the request at all → URI parameter.**
> **If it's optional / used to filter, sort, or page an otherwise-valid request → query parameter.**

Example: `.../employees` alone (no query params) still returns a valid, sensible result (e.g. all active employees, unsorted) — proving `status`/`orderBySalary` are legitimately *optional* query parameters, not required path components.

## Strict Validation (API Kit Router)
- A common misconception: defining exactly N query parameters or headers in your RAML spec does **not**, by itself, reject extra/unexpected ones at runtime — MuleSoft will happily accept more than what was specified unless you explicitly turn on enforcement.
- **Fix:** after importing the RAML into Studio, the generated **API Kit Router** configuration has explicit settings — **"Query Parameters Strict Validation"** and **"Headers Strict Validation."** Enabling these makes the router **reject** any request containing parameters/headers beyond exactly what's declared in the spec.
- **Why this matters for security:** without strict validation, nothing stops a malicious caller from sending, say, 120 query parameters instead of the intended 5 (potentially oversized/malformed data), which can crash or degrade the application. Strict validation is a real defense mechanism, not just documentation — most real teams under-enable it, but it's considered a best practice you should be able to explain and defend in an interview.
- **URI parameters don't need this setting** — since they're baked directly into the URL structure itself, there's no way to "send extra" ones the way you can with query params or headers.

## `additionalProperties` in RAML (Body-Level Equivalent)
- For the **request body** (not headers/query params), RAML supports an `additionalProperties: false` tag on a `type` definition.
- Default behavior (if omitted): `additionalProperties` is effectively `true` — extra fields beyond the declared schema are **silently accepted**.
- Setting it to `false` makes the API **reject** any request body containing fields not explicitly declared in the schema.
- Field-level constraints can also be defined precisely — e.g. `minLength`/`maxLength` on a string field — again enforced only if explicitly configured, not automatically.

## Why Best Practices Aren't Always Followed
- Candid framing from the instructor: these validations exist and are well-understood, but in practice many real organizations don't rigorously enable strict validation or field-length limits everywhere — similar to how not everyone follows every traffic rule even though the rules exist for good reason.
- **Enforcement tends to correlate with how strict the architect/organization is**, and with how exposed the API is — e.g. APIs consumed by **external third parties** (the example given: a bank's API consumed by multiple partner NBFCs) are far more likely to have strict validation enabled than a purely internal API, since external exposure raises the real security stakes.

## Key Takeaway
> URI params = mandatory, identifies *what* resource; query params = optional, refines *how* you want the result (filtered/sorted/paginated). Neither is automatically "locked down" to only what you declared in RAML — strict validation (API Kit Router settings) and `additionalProperties: false` are the actual mechanisms that enforce that, and both are commonly under-used in real projects despite being genuine security best practices.
