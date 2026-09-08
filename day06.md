# Day 06 — HTTP Deep Dive: Methods, Request Structure, Response Codes, JSON

## Topics Covered
- HTTP vs. HTTPS
- The 5 core HTTP methods and when to use each
- Full anatomy of an HTTP request (URL, params, headers, body, authorization)
- HTTP response status codes (100s–500s)
- JSON syntax and data types in depth

## HTTP vs. HTTPS
- **HTTP**: plain text — anyone intercepting traffic (a hacker/sniffer) can read the data as-is.
- **HTTPS**: encrypts data end-to-end **during transport only** — decrypted once it reaches the API. Use HTTPS whenever sensitive data (e.g. credit card numbers) is involved; use it as the default for any external-facing or internet-crossing traffic.

## HTTP Methods — When to Use Each

| Method | Use case | Example |
|---|---|---|
| **GET** | Fetch/retrieve existing data | Get employee details by ID |
| **POST** | Create a new resource | Create a new employee record |
| **PUT** | Fully update a resource, or create it if it doesn't exist | Replace an employee's entire record |
| **PATCH** | Partially update a resource | Change just an employee's phone number |
| **DELETE** | Remove a resource | Remove a resigned employee's record |

- These are **conventions, not hard technical enforcement** — like traffic rules: nothing stops you from sending a body on a GET, but it's not advisable and can confuse consumers of your API.
- Best practice: **GET should never require a body** — use query/URI parameters instead.

## Anatomy of an HTTP Request
`<protocol>://<host>:<port>/<resource-path>` — e.g. `http://localhost:8081/empdetails`

| Component | Purpose |
|---|---|
| **Protocol** | `http` or `https` |
| **Host** | Where the server is (`localhost` when local; an IP/domain in real deployments) |
| **Port** | Which application on that host to reach — must be unique among currently-active applications on that host |
| **Resource path** | Identifies the resource/endpoint (e.g. `/employees`) |
| **Method** | GET/POST/PUT/PATCH/DELETE |
| **Body** | The main payload/message (e.g. JSON data) — used for POST/PUT/PATCH, generally not GET |
| **Headers** | Metadata *about* the request — content type, source system, etc. Optional unless the API design marks specific ones as mandatory. |
| **Authorization** | Security credentials (username/password, token) — can also be sent via headers depending on design choice |
| **Query Parameters** | `?key=value&key2=value2` appended to the URL — see `day10.md` for full depth |
| **URI Parameters** | Embedded directly in the path (e.g. `/employees/101`) — see `day10.md` for full depth |

> Whether a given header/param is mandatory or optional is a **design-time decision**, defined in the API specification (RAML) — the API can be built to reject requests missing mandatory fields, or accept requests regardless of what's present if nothing is marked mandatory.

## HTTP Response Status Codes

| Range | Meaning | Notes |
|---|---|---|
| **100–199** | Informational | Rarely used in practice (e.g. "request received, processing") |
| **200–299** | Success | **200** OK (most common), **201** Created (new resource created, e.g. after POST), **204** No Content (successful but nothing to return) |
| **300–399** | Redirection | Rarely used for APIs (more common for web page redirects) |
| **400–499** | Client-side error | The **caller** sent something wrong |
| **500–599** | Server-side error | The **problem is on the API/server's side** |

### Common 400-series (client errors)
| Code | Meaning |
|---|---|
| **400** Bad Request | Missing/malformed required field, wrong data type sent |
| **401** Unauthorized | Missing or incorrect security credentials |
| **403** Forbidden | Authenticated, but not permitted to access this specific resource |
| **404** Not Found | Resource/URL doesn't exist |
| **405** Method Not Allowed | Wrong HTTP method used for this resource |
| **415** Unsupported Media Type | Wrong content format sent (e.g. XML when only JSON is accepted) |

### Common 500-series (server errors)
| Code | Meaning |
|---|---|
| **500** Internal Server Error | Generic server-side failure (e.g. DB is down) |
| **501** Not Implemented | The requested function doesn't exist on the server |
| **502** Bad Gateway | An API Gateway didn't get a timely response from the API behind it |
| **503** Service Unavailable | The API itself is down |
| **504** Gateway Timeout | Similar to 502 — upstream server didn't respond in time |

> These codes aren't strictly enforced by any technical rule — they're **industry convention** for clear, consistent communication between systems. Deviating "works" technically but confuses consumers and interviewers alike.

## JSON Format In Depth
- **Object**: `{ }` — a set of key-value pairs ("properties"), each key in double quotes, key:value separated by `:`, properties separated by `,`.
- **Array**: `[ ]` — an ordered list of values (can hold objects, strings, numbers, etc.).
- **Data types JSON accepts:**
  - **String** — double-quoted text, e.g. `"Mahesh"`
  - **Number** — no quotes, e.g. `80000`
  - **Boolean** — `true`/`false` (unquoted — quoting turns it into a string)
  - **Null** — `null` (unquoted — `"null"` is a string, not a null value)
  - **Object** — nested `{ }`
  - **Array** — nested `[ ]`, useful when you have multiple similar values (e.g. a list of hobbies) instead of numbering separate keys (`hobby1`, `hobby2`, ...)
- **Dates are NOT a native JSON type** — dates must be sent as **strings** (e.g. `"2024-10-25"`) and parsed/handled inside Mule (via DataWeave) as needed.

## Key Takeaway
> Every HTTP request/response detail (method, status code, header, param) follows *convention*, not hard enforcement — but following convention is what makes an API predictable, debuggable, and interview-ready. JSON's five real data types (string, number, boolean, null, object/array) and the "no native date type" gotcha are foundational for everything built in DataWeave later.
