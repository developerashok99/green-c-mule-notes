# Day 06 — HTTP in Depth: HTTPS, Methods, Request Structure, Status Codes and JSON

## 1. Overview

On Day 05 a request was sent and a response received. This session explains **how** that request is structured and how responses and errors are expressed, following REST/HTTP standards.

1. HTTP vs. HTTPS
2. HTTP methods: GET, POST, PUT, PATCH, DELETE
3. URL structure
4. Other parts of the request: body, headers, authorization, query parameters, URI parameters
5. HTTP status codes (1xx–5xx)
6. JSON format and data types

Why it matters: REST APIs depend on HTTP. **Instructor's observation:** in MuleSoft interviews, 3–4 questions on HTTP/REST/SOAP are typically asked before the MuleSoft-specific questions. These are standards — understand them rather than memorising blindly.

Next session: how the HTTP request is converted into a **Mule event** inside the application.

---

## 2. HTTP vs. HTTPS

### 2.1 The problem

- On Day 05 we sent an employee ID. If a hacker intercepts ("sniffs") it, not much harm is done.
- If a **credit card number** is sent the same way and intercepted, the damage is serious.

### 2.2 HTTP — plain text

With HTTP the request travels in a **readable** form. Anyone who intercepts it can read and misuse it.

### 2.3 HTTPS — encrypted in transit

**Encryption** converts readable data into an unreadable form using a **key** and an **algorithm**. Without the key/algorithm, the attacker cannot read it.

```text
HTTP:   Consumer ── {"cardNumber":"1234..."} ──► [hacker can read] ──► API

HTTPS:  Consumer ── "X9#kQ2...@!" (encrypted) ──► [hacker sees gibberish] ──► API
                                                                             │
                                                         decrypted at the API end
```

### 2.4 What HTTPS protects — and what it doesn't

- HTTPS secures data **only during transport**, from consumer to API.
- Once it reaches the API, it is **decrypted** and processed normally. HTTPS does not protect it after that.

### 2.5 When to use HTTPS

- Whenever more security is needed.
- **Instructor's observation:** HTTPS is used for most external communication and often for internal communication too.

### 2.6 HTTP vs. HTTPS in MuleSoft

- The Day 05 Listener was built with **HTTP**, so calling it with `https://` will not work.
- HTTPS uses the **same HTTP connector** with extra configuration (certificates/TLS settings); covered later.

> **HTTP** = HyperText Transfer Protocol — used to structure and transfer requests and responses over the internet. **HTTPS** = HTTP Secure.

---

## 3. HTTP Methods

### 3.1 The five widely used methods

**GET, POST, PUT, PATCH, DELETE.** Other HTTP methods exist; the instructor uses these five almost exclusively.

On Day 05 methods were used randomly. In real projects the method must match the **purpose** of the operation.

### 3.2 GET — fetch data

**Use case:** send an employee ID and fetch that employee's details (the Day 05 requirement).

> Use GET to **fetch available resources/data**.

The API is designed in advance to accept GET for this resource; if another method is sent, it returns an error ("wrong method" → 405).

### 3.3 POST — create a new resource

**Use case:** a new employee joins. Send ID, name, salary, designation and **insert** (create) the record in the database.

> Use POST when **creating** a resource in the back end.

With POST, the record should not already exist. If it does, the API typically returns an error: "record already exists".

### 3.4 PUT — full update, or create if missing

**Use case:** employee **102** exists. Send all of 102's details (e.g., with a new email and phone number). The **entire** record is replaced with the new details.

> PUT: if the resource exists → **completely update** (replace) it; if it doesn't exist → **create** it.

### 3.5 PATCH — partial update

**Use case:** change only employee 102's email or phone number, leaving the other fields untouched.

> PATCH: **partial** update.

### 3.6 DELETE — remove

**Use case:** employees who resigned 10–20 years ago no longer need to be kept in the database.

> DELETE: remove the resource.

### 3.7 Summary

| Method | Purpose | Example |
|---|---|---|
| GET | Fetch data | Get employee 120's details |
| POST | Create new resource | Create a new employee |
| PUT | Replace entire resource; create if absent | Replace all of employee 102's details |
| PATCH | Update part of a resource | Change only 102's phone number |
| DELETE | Remove resource | Delete an old employee record |

### 3.8 Standards, not hard rules — the traffic-rule analogy

Using POST to fetch or GET to create will technically work if the API allows it (as shown on Day 05). But when everyone sees GET, they immediately understand "fetch". Like traffic rules — sometimes people deviate slightly, but don't break them completely. **Follow the standard so everyone understands; deviate only with reason.**

### 3.9 Common interview questions

- **POST vs. PUT:** POST always creates a new resource (error if it already exists, by design). PUT replaces the resource if it exists, or creates it if not.
- **PUT vs. PATCH:** PUT replaces the whole resource. PATCH updates only specific fields.

> **Technical clarification:** HTTP itself does not force POST to fail on duplicates — the API's design does. Also, PUT is *idempotent* (sending the same PUT twice gives the same result), while POST is not.

---

## 4. URL Structure

```text
http://localhost:8081/empdetails
└─┬─┘  └───┬───┘ └┬─┘ └────┬───┘
protocol   host   port  resource path
```

| Part | Meaning |
|---|---|
| Protocol | `http` or `https` — depends on how the API (Listener) is built |
| `://` | Standard separator |
| Host | Server where the API is deployed. `localhost` = this laptop |
| Port | Identifies the application on that server. One port → one active application at a time (like a house number on a street). If an app stops, its port can be reused |
| Resource path | The resource, e.g. `/empdetails` |

Together these form the **URL** (Uniform Resource Locator; the instructor called it "unique resource locator").

The URL can also include an **API version** and a **base path** shared by all resources; explained later.

**All parts must match exactly.** On Day 05, changing the port or the resource name caused the request to fail.

---

## 5. Other Parts of the Request

In Postman a request has: **Params, Authorization, Headers, Body** (plus Pre-request Script, Tests, Settings, which are Postman features, not part of the HTTP request).

On Day 05 only a body was sent and it still worked — none of these parts is compulsory by default. **Which parts are mandatory is decided when the API is designed.**

### 5.1 Body

The **main and most important part** of the request — the message itself (JSON, XML, text…).

- **Create employee (POST):** the body carries ID, name, salary, designation.
- **Get employee (GET):** **as a general rule, GET should not carry a body.** The ID is passed through parameters instead (§5.4).

Sending a body in Postman: **Body → raw →** select format (**JSON**, XML, Text). If nothing is sent, Body shows **none**.

### 5.2 Headers

> Headers carry **data about data** (metadata).

Examples:

| Header | Purpose |
|---|---|
| `Content-Type: application/json` (or XML) | Format of the body |
| `source: mobile-application` / `source: web-application` | Which application sent the request |
| Application name, language, etc. | Other descriptive information |

**Are headers mandatory?** Only if the API design says so. Example: the API owner may define 2 mandatory and 2 optional headers. Missing a mandatory one → error. Optional ones are used if present and ignored if absent.

### 5.3 Authorization

Used to send **security information** when the API is secured.

**Example:** the API requires username `Mahesh` and password `Mahesh123`. The API checks them; if correct it processes the request, otherwise it rejects it.

Security information may be sent in the **Authorization** section or in **headers** — the API owner decides.

### 5.4 Parameters — query and URI

#### Query parameters

- Appended at the **end** of the URL.
- Start with `?`, then `key=value` pairs separated by `&`.

```text
http://localhost:8081/empdetails?employeeId=123&dept=IT&status=active
                                └──────────────── query parameters ───┘
```

**How to fetch with GET without a body:** pass the employee ID as a query parameter; the body is empty.

**Example — bank statement for a date range:**

```text
GET .../bankstatement?fromDate=2024-10-15&toDate=2024-10-31
```

#### URI parameters

- Part of the **path** itself; used for a value that **uniquely identifies** a resource.
- **Example:** a bank customer's account number or customer ID:

```text
GET .../customers/1234567890
```

Both are covered in depth on Day 10.

### 5.5 Student question: could Day 05's ID have been sent as a query parameter?

Yes, but the flow would need to change. On Day 05 the ID was sent in the **body**, which becomes the **payload** inside Mule, so the query used `payload.empid`. If the ID is sent as a query parameter, the payload is empty and `payload.empid` fails; the value must be read from another part of the Mule event (attributes). Explained in the next session.

### 5.6 The design decides everything

During the **design** step, the API owner decides:

- method(s) allowed,
- body structure and mandatory/optional fields,
- mandatory/optional headers,
- mandatory/optional query parameters,
- security.

A real HTTP request comprises: **protocol, URL (host, port, path), method, query/URI parameters, headers, authorization, body.**

---

## 6. HTTP Status Codes

After sending a request, Postman shows a **status code** and a **reason phrase** (e.g., `200 OK`). These codes are standards.

| Series | Meaning | Used in practice? |
|---|---|---|
| 1xx | Informational | Rarely |
| 2xx | Success | Yes |
| 3xx | Redirection | Rarely in APIs |
| 4xx | Client-side error | Yes |
| 5xx | Server-side error | Yes |

**Instructor's experience:** they have used 200, 400 and 500 series; never 100 or 300 series in APIs.

### 6.1 1xx — Informational

Meaning: request received, processing in progress.

**Instructor's example:** you submit a loan application at a bank; they say "we're processing it, we'll inform you". Similarly, if an API is asked for 50,000 resigned employees' data, it may immediately reply "request received, in progress" and process it in the background.

> **Technical clarification:** In HTTP, 1xx codes are interim responses (e.g., `100 Continue`). The "request accepted, processing later" scenario described above is normally answered with **`202 Accepted`**.

### 6.2 2xx — Success

| Code | Meaning | Example |
|---|---|---|
| **200 OK** | Request successful; requested data returned | Get employee 120 → details returned (seen in Postman on Day 05) |
| **201 Created** | Request successful; a new resource created | POST creates a new employee |
| **204 No Content** | Request successful; no data to return | Request is fine but there is nothing to send back |

**Instructor's observation:** many teams use 200 for everything, including POST. Ideally use 201 for creation and 204 for no data. Not a hard rule (traffic-rule analogy again).

Full list: search "HTTP response codes" online.

### 6.3 3xx — Redirection

Used when a page/resource has moved to another address.

**Example:** `icicibank.com/aboutus` is renamed to `icicibank.com/about`; the old address redirects to the new one using a 3xx code.

### 6.4 Client vs. server errors

```text
Client / consumer ──request──► API (server)

Problem with the request (client's mistake)   → 4xx
Problem on the API side (server's problem)    → 5xx
```

"Client" and "consumer" mean the same thing: whoever consumes the API.

**Example:** client sends a correct request but our database is down → server-side → 5xx.

### 6.5 4xx — Client errors

| Code | Meaning | Example |
|---|---|---|
| **400 Bad Request** | Request is malformed or invalid | A mandatory header or body field missing; wrong data type (salary sent as text `"80000"` instead of number `80000`) |
| **401 Unauthorized** | Security credentials missing or wrong | Username/password wrong, or not sent |
| **403 Forbidden** | Authenticated, but not permitted for this resource | Consumer has access only to resource 1, but calls resource 2 or 3 |
| **404 Not Found** | Resource doesn't exist | Sending `/empdetails1` instead of `/empdetails` |
| **405 Method Not Allowed** | Wrong method for this resource | API accepts only GET; client sends POST |
| **415 Unsupported Media Type** | Wrong body format | API accepts only JSON; client sends XML |

These are used regularly in real projects.

### 6.6 5xx — Server errors

| Code | Meaning | Example |
|---|---|---|
| **500 Internal Server Error** | Problem on the server side | Database is down; tell the consumer to try again later |
| **501 Not Implemented** | Server doesn't support the requested functionality | Request for an activity the back end doesn't support (rare) |
| **502 Bad Gateway** | Problem between the gateway and the API | See below |
| **503 Service Unavailable** | The API is down/unavailable | |
| **504 Gateway Timeout** | Gateway did not receive a timely response from the upstream server | See below |

### 6.7 API gateway and 502/504

**API gateway:** a component in front of the API. **Analogy:** a security guard at a house stops visitors, verifies them, then lets them in. The gateway checks credentials (e.g. username/password) and forwards valid requests to the API; otherwise rejects them.

```text
Consumer ──► API Gateway ──► API
                  │
     waits for the API's response up to its time limit
```

**Instructor's example:** the gateway expects the API to respond within 100 ms, but the API takes 150 ms. The gateway gives up and returns an error instead of the response. The instructor used this example for **502 Bad Gateway** and then said **504** "or even 502" can be used for it.

> **Technical clarification:** By the HTTP standard, **504 Gateway Timeout** is returned when the gateway does not get a response in time (the scenario above). **502 Bad Gateway** is returned when the gateway receives an **invalid** response from the upstream server (or cannot connect to it).

### 6.8 Error handling is hard

**Instructor's observation:** showing proper errors is challenging. In many systems, 60–70% of errors are shown well; 30–40% are confusing (one problem shows another error). Proper error responses are an important part of API design and error handling (Days 15–16).

---

## 7. JSON

### 7.1 Definition

**JSON = JavaScript Object Notation.** A text data format; widely popular because it is simple and easy to understand, so applications in many languages can easily produce and consume it.

Typical flow: front-end sends JSON → MuleSoft converts as needed for back-end systems → MuleSoft returns a JSON response.

### 7.2 Object and array

| Structure | Delimiters |
|---|---|
| **Object** | `{ }` curly braces ("flower braces") |
| **Array** | `[ ]` square brackets |

### 7.3 Data types JSON accepts

| Type | Rule | Example |
|---|---|---|
| String | In **double quotes** | `"designation": "Software Engineer"` |
| Number | **No quotes** | `"salary": 100000` |
| Object | `{ ... }` | `"address": { "city": "Hyderabad" }` |
| Array | `[ ... ]` | `"hobbies": ["reading books", "watching movies"]` |
| Boolean | `true` / `false` **without quotes** | `"resigned": false` |
| Null | `null` **without quotes** | `"address": null` |

**Traps:**

- `"true"` (quoted) is a **string**, not a boolean.
- `"null"` (quoted) is a **string**, not null.
- `"XYZ1000"` mixes letters and digits → string.

**No date type.** `25 October 2024` cannot be a native JSON type. Dates are sent as **strings**; DataWeave handles conversion inside Mule.

### 7.4 Object rules

- An object consists of **properties**; each property is a **key–value pair**.
- **Keys** are always in **double quotes**.
- Key and value are separated by a **colon** `:`.
- Properties are separated by a **comma** `,`.

### 7.5 Example built in class

```json
{
  "name": "Mahesh",
  "designation": "Software Engineer",
  "salary": 100000,
  "employeeCode": "XYZ1000",
  "hobbies": ["reading books", "watching movies", "learning new things"],
  "resigned": false,
  "joiningDate": "25 October 2024",
  "address": null
}
```

(Key names are representative; the values and types follow the transcript.)

**Why an array for hobbies?** Instead of:

```json
{ "hobby1": "reading books", "hobby2": "watching movies", "hobby3": "learning new things" }
```

use one key with an array — compact, and it handles any number of values of the same kind.

**Address:**

- No data → `null`, or some systems send an empty string `""`. Both indicate "no data".
- With data → a string such as `"Plot no ..., Green Nagar, Hyderabad, 500080"`, or an object with separate fields.

**Nesting:** objects can contain arrays and arrays can contain objects (e.g. an array of employee objects). These are practised later.

---

## 8. Important Terminology

| Term | Meaning |
|---|---|
| HTTP | HyperText Transfer Protocol |
| HTTPS | HTTP Secure — encrypted in transit |
| Encryption / decryption | Converting data to unreadable form with a key/algorithm, and back |
| Sniffing | Intercepting network traffic |
| HTTP method | The action: GET, POST, PUT, PATCH, DELETE |
| URL | Protocol + host + port + resource path |
| Resource path | The resource part of the URL |
| Body | Main message of the request |
| Header | Metadata ("data about data") |
| Authorization | Security credentials section |
| Query parameter | `?key=value&key2=value2` at the end of the URL |
| URI parameter | Value inside the path identifying a resource |
| Status code / reason phrase | e.g., `200 OK`, `404 Not Found` |
| Client / consumer | The caller of an API |
| API gateway | Component in front of APIs that checks and forwards requests |
| JSON | JavaScript Object Notation |
| Property | A key–value pair in a JSON object |

---

## 9. Interview Questions

### Q1. Difference between HTTP and HTTPS?
HTTPS encrypts data in transit using keys/algorithms so intercepted data can't be read; HTTP sends plain text. HTTPS protects only during transport; data is decrypted at the receiving API.

### Q2. When do you use GET, POST, PUT, PATCH and DELETE?
GET fetches, POST creates, PUT replaces fully (or creates if absent), PATCH updates partially, DELETE removes.

### Q3. Difference between POST and PUT?
POST creates a new resource (by design, error if it exists). PUT updates the whole resource if it exists or creates it if it doesn't; PUT is idempotent.

### Q4. Difference between PUT and PATCH?
PUT replaces the entire resource; PATCH changes only the fields sent.

### Q5. What are the parts of an HTTP request?
Protocol, host, port, resource path (URL), method, query/URI parameters, headers, authorization and body.

### Q6. What is the difference between headers and body?
The body carries the main data; headers carry metadata about the request such as content type or source system.

### Q7. Should GET have a body?
As a standard, no. Use query or URI parameters to pass values for GET.

### Q8. Difference between query parameters and URI parameters?
Query parameters are key–value pairs after `?` at the end of the URL, typically for filtering. URI parameters are part of the path and identify a specific resource (e.g., an account number).

### Q9. What do 4xx and 5xx mean?
4xx: client-side error (bad request, unauthorized, forbidden, not found, method not allowed, unsupported media type). 5xx: server-side error (internal error, not implemented, bad gateway, unavailable, gateway timeout).

### Q10. Difference between 401 and 403?
401: credentials missing or wrong. 403: credentials valid, but the user isn't allowed to access that resource.

### Q11. When do you return 405 and 415?
405 when the method isn't allowed for the resource; 415 when the request body format isn't supported.

### Q12. Difference between 502 and 504?
Both involve a gateway/proxy. 504: the upstream server didn't respond in time. 502: the gateway got an invalid response (or couldn't connect).

### Q13. What data types does JSON support? Does JSON have a date type?
String, number, boolean, null, object and array. No date type — dates are sent as strings.

---

## 10. Must Remember

1. **HTTPS encrypts only in transit**; decrypted at the API.
2. **GET** fetch, **POST** create, **PUT** replace/create, **PATCH** partial update, **DELETE** remove — standards, not enforced unless designed.
3. **GET should not carry a body**; use query/URI parameters.
4. URL = **protocol://host:port/path** — all must match the Listener.
5. **Body** = main message; **headers** = data about data; **authorization** = security info.
6. Query params: `?k=v&k2=v2` (filters); URI params: in the path (unique ID).
7. Mandatory vs. optional parts are decided at **design** time.
8. **2xx success, 4xx client error, 5xx server error**; 1xx and 3xx rarely used in APIs.
9. Know: **200, 201, 204, 400, 401, 403, 404, 405, 415, 500, 501, 502, 503, 504**.
10. JSON: `{}` object, `[]` array; keys in double quotes; `true/false/null` unquoted; **no date type**.
