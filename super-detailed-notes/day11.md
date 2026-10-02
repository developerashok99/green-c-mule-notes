# Day 11 — HTTP Request Connector: Consuming a Third-Party REST Service

## 1. Overview

Prerequisites, HTTP, the Mule event and Studio basics are done. Now the course starts on the common "80% requirements", beginning with **consuming REST services** using the **HTTP Request** operation.

1. Recap of the 80% requirement list
2. Listener vs. Request; inbound vs. outbound endpoints
3. HTTP Request in API-led connectivity; consumer/provider terminology
4. What information you need to call any REST API
5. Practical friction with third-party APIs (documentation, Postman collections, SPOC)
6. Demo: an API that returns weather for a city using **OpenWeatherMap**
7. Debugging the outgoing request; payload/attributes overwritten by HTTP Request

---

## 2. The 80% Requirement List (Recap)

| Requirement | Scope |
|---|---|
| REST | Create and consume |
| SOAP | Consume only (creating is rare, complex and tedious) |
| JMS (Java Message Service) | Messaging |
| Database | |
| System connectors | Salesforce; possibly one more (e.g. AWS) for this batch |
| File, FTP, SFTP | |

**Why these transfer well:** learning **JMS** makes **VM** (and Anypoint MQ) almost the same; learning **FTP and SFTP** helps with other file-type connectors. With these, you can understand 70–80% of a new project's requirements quickly.

**Instructor's note:** even with long experience, nobody understands 100% of a new project immediately. You learn, explore, ask people who did it before, accumulate knowledge, then start.

So far, small apps have used the HTTP protocol (Hello World, DB fetch). Full REST service creation with RAML comes later; after 5–6 sessions a complete use case is built end to end.

---

## 3. Listener vs. Request

### 3.1 The new scenario

Previously, the API received a request and fetched data from a **database** using the Database connector. Now the data must come from **another REST service** (third-party or internal). The API calls it, transforms the response, and returns it.

```text
Consumer ──► Our API (Listener) ──► HTTP Request ──► Third-party REST API
                                   ◄── response ◄──
         ◄── transformed response ──
```

> "API A talks to API B" really means API A uses an **HTTP Request** to consume API B — just like consuming a database with the Database connector.

### 3.2 Which component for which purpose

| | HTTP Listener | HTTP Request |
|---|---|---|
| Purpose | **Expose** our API (create REST services) | **Consume** another REST/HTTP service |
| Flow section | **Source** only | **Process** only |
| Endpoint type | **Inbound endpoint** — accepts incoming requests | **Outbound endpoint** — calls the outside world |

Studio enforces placement: Listener in Process → not allowed; Request in Source → not allowed. A process component can be placed in Process (and inside error handling), not in Source.

**Terminology:** "inbound calls" (coming to us) and "outbound calls" (from us to others) are used in project discussions.

### 3.3 The HTTP module operations

The HTTP module (added to every project by default) has four operations, including **Listener** and **Request**. **99% of the time only these two are used.** Focus on what's important rather than learning everything.

> **Instructor's view:** a MuleSoft developer uses the HTTP Request operation **every day**.

---

## 4. HTTP Request in API-Led Connectivity

### 4.1 Between layers

Experience, Process and System APIs are all **REST APIs**, so one layer calls the next with an **HTTP Request**. **Instructor's estimate:** this is how it's done 99.9% of the time.

### 4.2 Worked example

```text
Mobile app
   │
   ▼
Experience API ──HTTP Request──► Process API
                                   │
                ┌──HTTP Request────┼──HTTP Request────┬──HTTP Request──┐
                ▼                  ▼                  ▼                │
         System API 1        System API 2        System API 3          │
         (third-party REST)  (Salesforce)        (Database)            │
                │                  │                  │                │
          REST service        Salesforce            DB                 │
```

- The architect decides to build three System APIs: one calls a third-party REST service, one connects to Salesforce (Salesforce connector), one to the database (Database connector).
- The Process API calls the System APIs — **three HTTP Requests** — in the required order, combines the data and returns it to the Experience API, which returns it to the mobile app.
- Inside each System API, the matching connector is used (Database connector for DB, Salesforce connector for Salesforce, HTTP Request for a REST service).

### 4.3 Who is who

| Role | Other names | In the example |
|---|---|---|
| **Consumer** | Client, source | Mobile app (of Experience API); Experience API (of Process API); Process API (of System APIs) |
| **Service provider** | Producer | Experience API (for mobile app); Process API (for Experience API); System APIs (for Process API) |
| **Target** | | The system being called (Salesforce, DB, …) |

Different teams use different terms; recognise them all.

---

## 5. What You Need to Call Any REST API

Before configuring an HTTP Request, collect:

| Item | Example |
|---|---|
| Method | GET / POST / … |
| Protocol | HTTP / HTTPS |
| Host | `api.openweathermap.org` |
| Port | 443 (HTTPS default) |
| Base path | `/` |
| Path | `/data/2.5/weather` |
| Query parameters | `q`, `appid` |
| URI parameters | none here |
| Authorization / security | API key, username/password, token… |
| Headers | e.g. `Content-Type` |
| Body | JSON/XML, if required |

Not every API needs every item, but you must know exactly what each target API requires.

**Example:** you develop the Process API; developers 1, 2 and 3 develop System APIs 1, 2 and 3. Each System API may need a different request — one has a body, one has query params, one has different security. You need each one's details.

Our own Hello World API worked only when the exact protocol, host, port and path were used; anything wrong and it fails. The same applies when we call others.

---

## 6. Practical Friction With Other Teams' APIs

### Q. They gave us an endpoint but not the mandatory body fields. If we don't send them we get errors. Whose fault?

The consumer must obtain the details. Ask the providing organisation for:

- the mandatory fields and request structure,
- ideally their **Postman collection** for all their services — test it yourself to see whether it works.

If you send a string where they expect a number, they return **400 Bad Request**, and a good API states the expectation in the error ("expected number").

### Where are restrictions defined?

In the provider's **RAML**. **Example:** a weather request with `city`, `minTemp`, `maxTemp`, `tempUnit`; `city` is mandatory with **max length 10**. A longer city name is rejected before processing.

Our own demo APIs accept anything (any method, any body) because nothing is restricted yet. That is not the right way — each resource should define allowed methods, etc., in RAML (covered later).

### Q. The existing internal APIs were built by people who left. Nobody knows them.

- Find where they are deployed and get the code from **Bitbucket/GitHub**; import it into Studio.
- Read the **RAML** for request and response details.
- Usually other developers are available to ask.

### Q. I was told to call a service through a gateway, copy an existing configuration, but there's no contact and the documentation doesn't name the fields. What do I do?

Find the **SPOC (Single Point of Contact)** for that service and **escalate**. Providers should give documentation (often in Confluence) and contact persons.

**Instructor's observations:**

- Documentation is often unclear — some understand it, some (even seniors) don't. Getting used to it takes time.
- Junior developers should spend 30–60 minutes studying the documentation, note down questions, then approach the right people in that organisation.
- "Whenever a different service provider is there, you almost always face trouble." Very few organisations provide complete details and quick responses.

---

## 7. Demo — Weather API Using OpenWeatherMap

### 7.1 Requirement

Build an API that accepts a **city name** and returns that city's weather by calling the free **OpenWeatherMap** REST service, returning only the details the consumer needs.

```text
Request to our API (body, JSON):     { "city": "Hyderabad" }
Our API ──► OpenWeatherMap (query params: q=<city>, appid=<key>)
Our response: selected fields (city, min/max temperature, unit …)
```

**Temperature unit:** in India temperature is measured in **Celsius**; OpenWeatherMap returns **Kelvin** by default. The response must be converted — like converting weight between kilograms and pounds. Conversion and response shaping are done next session.

Use **Transform Message** for complex transformations; Set Payload for small ones; Set Variable when storing values (also possible inside Transform Message).

### 7.2 Why do third-party APIs exist?

Many free and paid APIs exist on the internet. Organisations specialise in an area (weather, geocoding), build APIs and expose them to others, often charging for them. If you need weather details, it's easier to call their API than build everything yourself.

### 7.3 Get access

1. Go to **openweathermap.org** → **Create account** (username, email, password) → sign in.
2. Browse APIs: e.g. Road Risk, Air Pollution, Fire Weather, Geocoding, Current Weather. Some free, some paid.
3. Read the documentation — it explains how to call each API: host, path, parameters, keys.
4. **API key:** click your name → **My API keys** → copy (or generate) the key.

### 7.4 Test in Postman first

From the documentation:

```text
GET https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
```

| Part | Value |
|---|---|
| Protocol | HTTPS |
| Host | `api.openweathermap.org` |
| Port | Not shown → HTTPS default **443** (`api.openweathermap.org:443` works the same). HTTP default is 80 |
| Path | `/data/2.5/weather` |
| Query params | `lat` (latitude), `lon` (longitude), `appid` (API key) |

**Troubleshooting sequence:**

1. Placeholder `{API key}` → **"Invalid API key"**.
2. Real key from the account page → **"Bad request: wrong latitude"** (placeholder coordinates).
3. Documentation's example values `lat=44.34`, `lon=10.99` → **success**.
4. The documentation also offers city name: `q=Hyderabad` → success.

Well-documented APIs often provide a downloadable Postman collection to import and test directly.

### 7.5 The response

```json
{
  "coord": { "lon": 10.99, "lat": 44.34 },
  "weather": [ { "id": 803, "main": "Clouds", "description": "broken clouds", "icon": "04d" } ],
  "base": "stations",
  "main": {
    "temp": 278.0,
    "feels_like": ...,
    "temp_min": ...,
    "temp_max": ...,
    "pressure": ...,
    "humidity": ...,
    "sea_level": ...,
    "grnd_level": ...
  },
  "visibility": ...,
  "wind": { ... },
  ...
}
```

(Shape as shown; values abbreviated.)

- `temp: 278` is clearly not Celsius — it's **Kelvin** (the unit is in the documentation).
- Sending everything to our consumer would be sending unnecessary details. We pick only what's needed and convert units.

### 7.6 Postman details

The request tab showed **hidden auto-generated headers** (click "hide auto-generated headers" to show/hide). Postman adds default headers to every request.

### 7.7 Building the Mule application

**Naming:** a name should reflect source, target and business process. The instructor's project name combined "consume rest service" with the batch name. Naming conventions are covered later.

```text
Flow
 Source:   HTTP Listener     path: /weather  (or /weatherOfCity)
 Process:  Logger            message: payload.city
           HTTP Request      GET https://api.openweathermap.org:443/data/2.5/weather
                             query params: q = payload.city, appid = "<api key>"
           Logger
```

**Listener configuration:** created with **+** → stored as a **global element**, usable from other XML files.

**HTTP Request configuration (global element):**

| Setting | Value |
|---|---|
| Protocol | HTTPS |
| Host | `api.openweathermap.org` |
| Port | 443 |
| Base path | `/` |

**HTTP Request operation:**

| Setting | Value |
|---|---|
| Method | GET |
| Path | `/data/2.5/weather` |
| Query parameter `q` | `payload.city` (dynamic — comes from our request body) |
| Query parameter `appid` | `"<api key>"` (hard-coded — same for every request) |
| URI parameters | none |

**URL composition:** `host:port / base path / path ? query params`.

> **Transcript unclear:** the instructor says the base path was left as a single `/` and reads the path out as "data slash 2.5 … slash weather". The exact split between base path and path on screen could not be fully recovered. Either way the full URL is `/data/2.5/weather`.

**Domain names:** `api.openweathermap.org` (like `www.google.com`) is a **domain name**. Behind it is an IP (e.g. `10.1.25.50`) and a port. The domain name maps to that server and port.

### 7.8 A red mark — error or not?

- A red mark appeared on the component. Not every red mark is a real error; check the configuration and the Configuration XML.
- The real problem: the query-parameter values were in **fx (expression)** mode. In DataWeave, a literal value must be a quoted string:

```dataweave
{
  q: payload.city,
  appid: "1234abcd..."      // literal must be in double quotes
}
```

After quoting the key, the error disappeared. Fields can be edited in table form or in fx mode.

**Student question:** is `payload.city` configured in the Listener? No. The Listener just listens and converts the HTTP request to a Mule event; the body becomes the payload. Since the city is sent in the body, it is read as `payload.city`.

### 7.9 Testing and debugging

Request from Postman (body `{"city": "Mumbai"}`) to `http://localhost:8081/weather`, with a breakpoint.

**At the first component:**

- payload: `{"city": "Mumbai"}` (JSON)
- attributes: query params empty, URI params empty, but **default headers** present (Postman sends them)

**At the HTTP Request (inspect before it executes):** the debugger shows the outgoing request:

| Item | Value |
|---|---|
| Method | GET |
| Path | `/data/2.5/weather` |
| Query params | `q=Mumbai`, `appid=...` |
| Body | the current payload `{city: Mumbai}` — sent by default but ignored by the API |
| Config | host, port, base path |

> **Note:** the HTTP Request sends the current payload as the body by default. For GET it is ignored here, but be aware of it.

**After the HTTP Request:**

- **payload** = OpenWeatherMap's response (the city payload is gone)
- **attributes** = the response's attributes: headers, **statusCode 200**, **reasonPhrase OK** (the original attributes are gone)

The Logger printed `Mumbai` before the request. After the flow ends, control returns to the Listener, which sends the payload as the HTTP response body (Listener → **Responses** section has a success response and an error response — covered next session).

---

## 8. HTTP Request Overwrites Payload and Attributes

> Any connector operation — HTTP Request, Database, etc. — **overwrites the payload and attributes**. Variables are not overwritten.

If you need the original city or headers later, store them **before** the request:

```text
Set Variable  originalPayload = payload           ← before HTTP Request
HTTP Request                                        (payload/attributes replaced)
Later:        vars.originalPayload.city   → "Mumbai"
```

Note the syntax: `vars.originalPayload.city`, not `payload.city`.

There is also another option to avoid overwriting the payload (**target variable**) — covered next session along with HTTP Request best practices: **reconnection strategy** and **response (success code) validator**.

---

## 9. Important Terminology

| Term | Meaning |
|---|---|
| HTTP Request | Operation to call (consume) an HTTP/REST service |
| Inbound endpoint | Listener — receives requests |
| Outbound endpoint | Request — sends requests to others |
| Consumer / client / source | Caller of an API |
| Service provider / producer | API that answers |
| Postman collection | Saved set of requests shared by an API provider |
| SPOC | Single Point of Contact for a service |
| API key | Secret key identifying the caller (OpenWeatherMap `appid`) |
| Domain name | Human-readable name mapped to an IP and port |
| Default ports | HTTP 80, HTTPS 443 |
| Base path / path | Common prefix (in config) / resource path (in operation) |
| fx / expression mode | Field contains DataWeave; literals must be quoted |

---

## 10. Interview Questions

### Q1. What is the difference between HTTP Listener and HTTP Request?
Listener is a source that exposes our API and receives inbound requests. Request is a processor that calls (consumes) other HTTP/REST services — outbound.

### Q2. How do APIs in different API-led layers communicate?
Each layer is a REST API, so the calling layer uses an HTTP Request to call the next (Experience → Process → System).

### Q3. What information do you need before configuring an HTTP Request?
Method, protocol, host, port, base path, path, query/URI parameters, headers, security details and body format.

### Q4. What happens to payload and attributes after an HTTP Request?
Both are replaced by the response's payload and attributes (status code, headers). Values needed later must be stored in variables first.

### Q5. What do you do if a third-party API's documentation is unclear?
Ask for a Postman collection, test it, study the documentation, and contact the provider's SPOC; escalate if needed.

### Q6. Why not return the third-party response as is?
It contains unnecessary data and may use units/structures the consumer doesn't want; we transform it into what our consumer needs.

### Q7. When would you hard-code a query parameter value?
When it's the same for every request (e.g. an API key) — though in real projects such values go into property files (Day 14).

---

## 11. Must Remember

1. **Listener = inbound, Source; Request = outbound, Process.**
2. HTTP Request connects all API-led layers (Experience → Process → System).
3. Consumer/client/source calls; producer/service provider answers.
4. Before calling an API: **method, protocol, host, port, base path, path, params, headers, auth, body**.
5. Get a **Postman collection**; unclear docs → **SPOC**.
6. HTTPS default port **443** (HTTP 80); domain names map to IP + port.
7. In fx mode, literal values must be in **double quotes**.
8. HTTP Request sends the current payload as body by default.
9. **HTTP Request overwrites payload and attributes** → save values in variables first.
10. Next: transform the weather response, set status code/reason phrase, target variable, reconnection strategy, response (success code) validator.
