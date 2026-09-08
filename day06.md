# Day 06 — HTTP Deep Dive: HTTP vs HTTPS, Methods, Request Structure, Response Codes, JSON

## Session Agenda
- Recap: how a request is sent, how a response comes back, how errors come back (from yesterday's demo)
- HTTP vs. HTTPS
- HTTP methods (in depth, with when-to-use-which)
- Full HTTP request structure: URL, methods, parameters, headers, body, authorization
- HTTP response status codes (100s through 500s)
- JSON format, revisited in full depth

## Why This Session Matters — Stated Directly, Twice
- *"We should not remember all these blindly — there is no logic [we're inventing]; when they gave us the standards for REST API, we are discussing those standards today. We should remember them and use them."*
- **Explicit interview framing**: *"Even if it is not related to MuleSoft, there will be more chances to ask [about HTTP]... I will definitely ask [in an interview]... a minimum of 3-4 questions [on HTTP/REST/SOAP] before going to the actual MuleSoft interview [questions]."* This is presented as foundational, near-universal interview material — not MuleSoft-specific trivia.

## HTTP vs. HTTPS — Explained With a Concrete Sniffing Scenario

- **Starting question posed directly**: an employee ID being intercepted by a hacker isn't a big deal — *"even if a hacker comes between us and sniffs it and steals it, it is not a big deal."* But **a credit card number** being intercepted the same way is a real problem. This contrast is used specifically to motivate *why* HTTP vs. HTTPS matters at all, rather than presenting it as an abstract rule.
- **What "encryption" concretely means, explained step by step**: a normal HTTP request travels as **plain, readable data** — if a hacker intercepts it, they can read it directly and understand exactly what it says (e.g. swap in a credit card number instead of an employee ID, and sniff *that* just as easily). An **encrypted** request instead looks like unreadable garbage (example given: `"XYZ12345678"`-style scrambled text) — produced using a **key and an algorithm**. Without knowing that specific key/algorithm, an interceptor cannot decrypt and read the actual content, making it **secure** even if intercepted.
- **Precisely what HTTPS protects, and what it does *not*, stated directly**: *"It will only secure in transportation... once it is received at the API end, it will be decrypted... it will not secure [anything] after that."* HTTPS encrypts data **only while it's traveling across the network** — from the moment it's decrypted at the receiving end (the API), HTTPS's protection no longer applies to whatever happens to that data next.
- **HTTPS = "Hypertext Transfer Protocol Secure"** — used specifically for structuring requests/responses **over the internet** securely.
- **When should you actually use HTTPS?** *"Whenever we wanted more security... for internal communication [too], HTTPS will [often still] follow. When there is external communication, most of the time HTTPS follows."* — i.e., HTTPS isn't purely an "internet-facing only" concern; it's a general default whenever meaningful security matters, internal or external.

## HTTP Methods — the 5 Core Methods, Each Explained With Its Own Worked Scenario

- **The five methods named as most important/widely-used, explicitly**: **DELETE, GET, POST, PUT, PATCH.**
- **Framing given directly, correcting yesterday's improvised usage**: *"I used it randomly in the session yesterday [Day 05's demo, where GET vs. POST made no functional difference], but I shouldn't use it like that — for a specific purpose, I should take a use case and do some data activity on the back end in order to use that particular method [correctly]."* This session exists specifically to correct that informality with precise guidance.

### GET — worked example continued directly from Day 05's demo
- **Use case**: *"I am trying to fetch employee details by passing an employee ID"* — the exact Day 05 scenario, now formally analyzed.
- **Rule stated directly**: *"When we want to fetch available resources or available data, we use GET method."*
- **How an API can enforce this at design time**: *"we specify our APIs in advance — when we receive this request, we [only] send the GET method... if they send something else instead of GET, we send an error response saying you are sending the wrong method."* (This directly foreshadows the **405 Method Not Allowed** response code covered later in this same session, and connects back to Day 05's demonstration that *nothing* enforces this unless the API is explicitly configured to.)

### POST — worked example
- **Use case**: a **new** employee needs to be created in the database — i.e., inserting a brand-new record.
- **Rule stated directly**: *"if we are creating a resource in the backend, we should use POST method."* "Insert" and "create" are treated as the same underlying operation here.

### PUT — worked example, with its dual behavior explicitly contrasted against POST
- **Use case**: employee **102** already exists in the backend, and you want to **fully replace** their record (e.g. update email and phone number) by sending a complete new set of details.
- **The precise dual-behavior rule, stated directly**: *"if [the resource] is there in the background, it will completely update that resource; if it is not there, it will create something new."* This is explicitly contrasted against POST: *"What is POST? It should definitely NOT be there already — if it is [already there], POST will [correctly] give an error response saying this record already exists."* PUT, by contrast, tolerates either case (update-if-exists, create-if-not) — this dual tolerance is the single defining trait that separates PUT from POST.
- **The traffic-rule analogy, reused here specifically for method conventions**: *"there is a traffic rule that you should go left, and there's a rule you shouldn't go the wrong way in a one-way — we take some deviations from those rules to go faster sometimes, but we don't break them completely. Method conventions are the same kind of standard — it will be easy for everyone to understand if you follow it, [and] if you don't follow it, nothing breaks technically, but it's not a suggestible thing."*

### PATCH — worked example
- **Use case**: only **part** of employee 102's record needs to change — e.g. just the email address or just the phone number, leaving everything else untouched.
- **Rule stated directly**: *"if we want to [only] partially update [a record] in the background, we have to use the PATCH method."* This is the precise distinction from PUT: PUT replaces the *whole* resource; PATCH changes *only* the specific fields sent.

### DELETE — worked example
- **Use case given directly**: an employee who resigned 10 or 20 years ago, whose record the business no longer wants retained in the backend at all.
- **Rule stated directly**: use the **DELETE** method to remove the resource entirely.

### Interview Framing, Restated Directly
*"What is the difference between POST and PUT? What is the difference between PUT and PATCH?"* — flagged explicitly as real, common interview questions, with the precise, ready-to-use answers being exactly the distinctions worked through above: **POST creates only (errors if it already exists); PUT fully replaces or creates if absent; PATCH updates only specific fields.** The instructor adds a personal honesty note: of the many methods that technically exist in HTTP, *"I mostly use the maximum [amount] on these 5 methods"* — reinforcing, once again, the course's repeated "focus on the common, high-value subset" philosophy rather than trying to master every theoretical HTTP method that exists.

## Full URL Anatomy — Component by Component

Format: `<protocol>://<host>:<port>/<resource-path>`

| Component | Explanation given, precisely |
|---|---|
| **Protocol** | HTTP or HTTPS — determined by how the underlying API/Listener was actually built. **Directly clarified**: *"our API is built by HTTP — if I want it to work over HTTPS, there are a few extra steps [needed], which we will discuss in the future."* You can't just change the URL's protocol prefix and expect it to work if the Listener itself wasn't configured for HTTPS. |
| **Host** | Where the API is actually deployed — `localhost` for local development, or a real server's address in a real deployment (as covered in full in Day 05's networking Q&A). |
| **Port** | *"Just like a house number is allocated to a street, a port number can be allocated to only one application [while it's active] — if that app goes down, the same port can be reused by another application, but never two active applications at once."* Direct callback to Day 05's port-uniqueness rule. |
| **Resource Path** | The specific endpoint identifier — e.g. `/empdetails`. |
| *(Combined)* | Together, protocol + host + port + resource path form the **URL** — Unique Resource Locator. **Directly demonstrated as strict**: changing *any one* of these (port, resource name, etc.) without correspondingly updating the Listener configuration **breaks the request entirely** — exactly as was shown live in Day 05's session when a mismatched port/path caused failures. |
| **(Extra scope in the URL)** | Briefly flagged: there's additional room within a URL structure for things like an **API version** or a **base path** applying to all resources under it — not elaborated on in full depth in this particular session, but flagged as something to understand further later. |

## The Rest of the HTTP Request — Params, Headers, Body, Authorization

- **Explicitly framed as all *optional by default*, unless a specific API design makes something mandatory**: *"when we sent a request yesterday, we didn't send [most of] this — so what is the significance? ... all these are not compulsory. But based on the requirement, we need to know what to use in any situation."*

### Body
- **Precise definition given**: *"the main important part of the request is a message... I am trying to send one complete message [in whatever format — JSON, XML, etc.] about the employee."* The body carries the substantive payload of a request — e.g. all the fields needed to **create** an employee via POST (ID, name, salary, designation, etc.), versus something as minimal as just an employee ID for a **GET**-style lookup (as in Day 05's demo).
- **The GET+body rule, restated directly, now as a formal principle rather than just an observed demo quirk**: *"the general rule of GET is that GET should not [have data] sent to the body."* (Alternative approaches for passing identifying data on a GET — i.e. query/URI parameters — are explicitly flagged as "I will show you a different way," setting up Day 10's URI/query parameter deep-dive.)
- **How to actually send a JSON body in Postman**: **Body → raw → select JSON** from the format dropdown (XML and plain text are equally selectable there if needed) — demonstrated directly as the mechanical steps.

### Headers
- **Precise definition given, memorably phrased**: *"we send data about data to the headers... content type, application/JSON or XML — data about data is also sent in the header."* Headers carry **metadata describing the request**, not the substantive payload itself.
- **Worked examples of header content given directly**: identifying which client/source sent the request (e.g. a custom header indicating "source: mobile application" vs. "source: web application"), and stating the format of the data being sent (e.g. `Content-Type: application/json`).
- **Mandatory or not?** *"No need [by default] — it depends on how the API was designed."* Directly tied back to the design-time decision framing already established: *"in the headers, this [particular header] is optional, and this [other] one is mandatory — that's what I mentioned in my API specification. If it comes, it will be taken; even if it doesn't come, it won't [necessarily] be an error [unless it was marked mandatory]. Since we are the owner of the API, when we design it, we decide that."*

### Authorization
- **Precise purpose given**: securing the API by sending credentials — e.g. a username and password — which the API checks before deciding whether to actually process the request. Worked example given directly: username `Mahesh`, password `Mahesh123` — if wrong, reject the request.
- **Where this information can actually be sent — explicitly flexible, an owner's design choice, not a fixed rule**: *"some people design it as sending it to headers, some people design it as sending it in [the dedicated] authorization [section]... it depends on the decision of the owner of the API."* Both are legitimate, real-world approaches — there is no single mandated place security credentials must go.

### The Design-Time Discipline, Stated Directly and Generally
*"Where do we mention all this [what's mandatory, what's optional, which method, what security]? When you develop an API, you design it — [that's] the first step."* This ties the entire request-structure discussion directly back to the **API Lifecycle's Design step** (Day 04) — every one of these decisions (mandatory vs. optional headers, which method is accepted, what security applies) is something a design document should specify **before** implementation begins, not something improvised during coding (exactly the informal approach Day 05's demo admittedly used, which this session is explicitly correcting).

## Query Parameters and URI Parameters — First Formal Mention (full depth deferred to Day 10)
- **Two parameter types in HTTP, named directly**: **query parameters** and **URI parameters.**
- **Query parameters, mechanics shown directly**: appended to the end of a URL, starting with a **`?`**, in **key=value** pairs, with additional pairs joined by **`&`** (e.g. `?employeeId=123&employeeNumber=456`).
- **A concrete banking example given, previewing filtering use cases fully covered on Day 10**: generating a bank statement for a specific date range (example: October 15th to October 31st) — the **from-date** and **to-date** values would naturally be sent as **query parameters** on a GET request, since GET can't carry this identifying information in a body.
- **A direct clarification tying this back to yesterday's demo**: a student asks whether Day 05's dynamic `payload.employeeId` binding could instead have been a query parameter. **Answer given directly**: *"since I sent it to the body [in yesterday's demo], I wrote `payload.employeeId` — the body becomes payload [in the Mule Event]. If I pass it as a query parameter instead, that expression would actually error, because there's no `payload` field for it there — it would need to be read from a completely different part of the Mule Event [attributes], which we'll get into."* This is the exact, concrete seed of the full **Mule Event / `attributes.queryParams` vs. `payload`** distinction covered fully the very next session and expanded further on Day 10.
- **Where each is placed, stated directly**: URI parameters live embedded directly *inside* the URL path itself, whereas query parameters are appended at the *end* of the URL after a `?` — full depth on defining and using both is explicitly deferred to a dedicated future session (Day 10).

## HTTP Response Status Codes — Full Walkthrough, Series by Series

- **Framing given directly, on which series actually matter in practice**: *"we don't use [the] 300 series... we use 200, 400, 500 [as the practically relevant ones]."*

### 1xx — Informational (100-199)
- **Meaning**: *"request received and the process is in progress"* — the server has accepted the request but hasn't finished/returned a full result yet.
- **Concrete example given to motivate it**: a bank loan application — the bank *receives* your signed application and tells you *"we are processing it, we'll inform you once it's done"* rather than making you wait synchronously for the entire process to complete before responding at all. A large data-generation task (the instructor's example: fetching 50,000 employees' resignation data) could similarly acknowledge receipt immediately via a 1xx-style response while the actual heavy processing happens separately in the background.
- **Instructor's own honest practical note**: *"in real time, most of the time they don't use 100 [series]... even if you ask me when I'll use 100 or 101, I will not tell you, because I never used it and didn't get the requirement to use it."* Explicitly flagged as low-priority to memorize.

### 2xx — Success (200-299)
| Code | Meaning, precisely | Worked example |
|---|---|---|
| **200** | *"The request was successful and the server has returned the requested data."* | Employee-details GET request succeeds and returns the employee's data — exactly Day 05's demo outcome |
| **201** | *"Request was successful and a new resource has been created on the server."* | A POST that successfully creates a new employee record |
| **204** | *"The request was successful but there is no data to return."* | Employee details were requested, but genuinely no data exists to send back (as opposed to an *error* case) |

- **Instructor's candid real-world note on strict adherence**: *"if you are asked to design it [with a hard rule], it will not [always be] followed... there is nothing wrong in using 200 for a POST"* — the "ideal" mapping (201 specifically for successful creation) is a best practice, not something universally, strictly enforced in every real team's actual API design, echoed by the same traffic-rule framing used for HTTP methods above.

### 3xx — Redirection (300-399)
- **Meaning and example given directly**: used when a specific page/resource has moved to a different address — worked example: `icicibank.com/aboutus` being redirected to a differently-named page, with the 3xx code signaling that redirection to the caller.
- **Instructor's own honest disclosure**: *"till now, I have not used it [in real API work] — I have used 200, 400, and 500 series [only]."* Explicitly deprioritized for practical focus, same as the 1xx series.

### 4xx — Client-Side Errors (the caller's fault)
**Precise framing of the client/server distinction given directly**: *"there are two kinds of errors — one when the client sends the error [wrong request], [the other] if our [server] side has a problem. If their side is wrong, we send 400-series error. If our side has a problem, we send 500-series error."*

| Code | Meaning, precisely | Worked example |
|---|---|---|
| **400 Bad Request** | A required header/field is missing, or the wrong data type was sent (e.g. a number field sent as a string) | *"My API mandatorily needs a header, and the client doesn't send it — that's 400."* Or: salary should be a number (`80000`) but is sent as `"80000"` (a string) |
| **401 Unauthorized** | Security credentials (e.g. username/password) are wrong or missing entirely | *"If the username or password is wrong, or both are wrong, or not sent at all — you are not an authorized user for this API"* |
| **403 Forbidden** | Credentials are valid, but the caller lacks permission for *this specific* resource | *"The consumer has permission for Resource 1 only — if they try Resource 2 or 3, [which they don't have permission for], that's 403 — the server understood the request, but the user isn't allowed to access it"* |
| **404 Not Found** | The requested resource genuinely doesn't exist at that path | Sending `/employeedetails1` instead of the correct `/employeedetails` — the resource simply isn't there |
| **405 Method Not Allowed** | The wrong HTTP method was used for a resource that only accepts a specific one | The API only accepts GET for this resource, but the caller sends POST instead |
| **415 Unsupported Media Type** | The wrong content format was sent (e.g. XML when only JSON is accepted, or vice versa) | *"I accept only JSON for my API, but they send XML — 415."* |

### 5xx — Server-Side Errors (the server's/API's own fault)
| Code | Meaning, precisely | Worked example |
|---|---|---|
| **500 Internal Server Error** | Generic server-side failure | *"If we get an API request and there's a problem downloading from the database [on our side], we send 500."* |
| **501 Not Implemented** | The requested function/capability genuinely doesn't exist on the server at all | A request comes in for an activity the backend doesn't support/implement — instructor's own note: *"used rarely, but still a real situation"* |
| **502 Bad Gateway** | An **API Gateway** in front of the API didn't get a timely response *from* the API behind it | Full worked example below |
| **503 Service Unavailable** | The API itself is currently down | Straightforward — the target service simply isn't up |
| **504 Gateway Timeout** | Similar to 502 — *"the server acting as a gateway/proxy did not receive a timely response from the upstream server"* | Same underlying mechanism as 502, applied at a slightly different point in the chain |

### The API Gateway / 502 Mechanism, Fully Worked
- **The security-guard analogy used directly**: *"our house is protected by a security guard — that guard stops [visitors], verifies them, and then sends them inside. The same way, if you want to request an API, there will be a gateway [in front of it]"* — checking things like whether the correct username/password were sent, before ever forwarding the request onward to the actual API.
- **The precise timing mechanism given, with real numbers**: *"the request came to this gateway, [then to] the API, which sends the response to the gateway in [say] 100ms... [if the gateway itself is configured to wait only] 150ms, and the API takes an extra 50ms beyond that, [the gateway gives up and] sends a 502 bad gateway"* rather than waiting indefinitely — i.e., 502 specifically fires when the **gateway's own patience/timeout threshold** is exceeded by the actual API's response time.
- **Instructor's own honest disclosure again, reinforcing the "learn less, learn the right things" theme**: *"I have not used 100 or 300 [series]. I have used 200, 400, and 500 series"* — directly stated as the realistic, sufficient scope for actual day-to-day and interview purposes.

## JSON — Full Format Rules, Revisited in Complete Depth

- **JSON = JavaScript Object Notation.** Chosen as the dominant format specifically because it's *"simple to understand... very easy... multiple language applications can be easily converted and easily utilized"* — restating and reinforcing the size/simplicity argument already made on Day 03.

### The Two Structural Containers
- **Object**: opens and closes with **curly braces `{ }`.**
- **Array**: opens and closes with **square brackets `[ ]`.** *"Remember it blindly like this,"* the instructor says directly — these two symbols are the entire distinguishing rule.

### JSON's Data Types, Each With the Exact Formatting Rule
| Type | Formatting rule, stated precisely | Example given |
|---|---|---|
| **String** | Enclosed in **double quotes** — used for names, designations, any combination of characters/text | `"designation": "Software Engineer"` |
| **Number** | **No quotes at all** — plain numeric value | `"salary": 100000` |
| **Object** | Nested `{ }` | (used when a field's value is itself a structured group of sub-fields) |
| **Array** | Nested `[ ]` — specifically for **multiple values of a similar kind**, avoiding the need to invent separate numbered keys | `"hobbies": ["reading books", "watching movies", "learning new things"]` — explicitly contrasted against the clumsier alternative of `hobby1`, `hobby2`, `hobby3` as separate keys |
| **Boolean** | Bare **`true`** or **`false`** — **never** in quotes; quoting it turns it into a string instead of an actual boolean | `"resigned": true` — worked example given: a `resigned` flag being `true` (has resigned) or `false` (has not) |
| **Null** | Bare **`null`**, never quoted — quoting it (`"null"`) makes it a 4-character string, not an actual null/absence-of-value | `"address": null` |

### Object Structure Rules, Stated Precisely
- *"JSON objects consist of keys and values, and key and values are separated by a colon [`:`]."*
- *"All keys should be enclosed in double quotes — that is the rule."*
- *"If there are multiple key-values [i.e. multiple properties], they are separated by a comma [`,`]."* Each individual key-value pair is itself called a **property**.

### The Date Gotcha — Restated and Directly Demonstrated
- **Directly stated**: *"if we [try to] accept date format [as a native type] — for example, 25th October 2024 — this data format does NOT accept [it as a native type]... in JSON, date format is not accepted; we have to handle it through string only."*
- **Where date handling actually happens**: once a date arrives as a plain string inside Mule, **DataWeave** is what's used to parse/format/manipulate it as an actual date value internally — JSON itself never carries a native date type; it's string-in, string-out at the JSON boundary, with any real date *logic* happening entirely inside DataWeave.

### A Fully Worked, Annotated Example Object (built live, field by field)
```json
{
  "name": "Mahesh",
  "designation": "Software Engineer",
  "salary": 100000,
  "hobbies": ["reading books", "watching movies", "learning new things"],
  "resigned": false,
  "joinDate": "25th October 2024",
  "address": null
}
```
- `name` and `designation`: strings (double-quoted) — *"names are always in the string [type], right? A combination of characters... uses string data type."*
- `salary`: number (no quotes) — *"if it's not in double quotes, it's a number."*
- `hobbies`: an array, since multiple similar values need to be grouped — demonstrated as the clean alternative to inventing `hobby1`/`hobby2`/`hobby3` keys.
- `resigned`: boolean — explicitly warned **not** to write it as `"true"` (a quoted string) — only bare `true`/`false` counts as an actual boolean.
- `joinDate`: **string**, despite being conceptually a date — directly demonstrating the date gotcha above.
- `address`: **null** (bare, unquoted) when there's genuinely no data — explicitly distinguished from sending an **empty string** (`""`), which the instructor notes is a real, valid *alternative* way some systems indicate "no data," distinct from `null` but serving a similar communicative purpose.
- **Combining containers, mentioned directly**: *"there can be arrays in the object, there can be objects in the array... combination is possible — we will show all these situations when we practice further"* — i.e., arrays-of-objects and objects-containing-arrays are both completely normal and will show up in real, more complex payloads later in the course.

## Quick Recap
- **HTTPS encrypts only in transit** — it protects data while traveling across the network, and stops mattering the instant the receiving API decrypts it; the sniffing-scenario contrast (employee ID vs. credit card number) is the exact mental model for deciding when HTTPS genuinely matters.
- **The 5 core HTTP methods, with concrete, memorable distinctions**: **GET** fetches; **POST** creates (errors if it already exists); **PUT** fully replaces-or-creates; **PATCH** partially updates; **DELETE** removes. These are conventions, not enforced rules — Day 05's demo already proved a Listener will happily accept any method unless explicitly restricted.
- **A full HTTP request = URL (protocol+host+port+path) + Method + Body + Headers + Authorization + Query/URI Params** — everything beyond the URL and method is **optional by default**, becoming mandatory or restricted only through deliberate design-time decisions (RAML/API specification), reinforcing Day 04's Design-first discipline.
- **Response codes**: **4xx = caller's fault, 5xx = server's fault** is the single most useful organizing principle; **200/201/204, 400/401/403/404/405/415, and 500/502/503/504** are the specific codes the instructor states are actually used in real practice — the 1xx and 3xx series are explicitly deprioritized as rarely relevant.
- **JSON's actual type system**: string (quoted), number (unquoted), boolean (bare `true`/`false`), null (bare `null`), plus the two structural containers object `{}` and array `[]` — **there is no native date type**; dates are always strings at the JSON boundary, with any real date manipulation happening inside DataWeave once the value is inside Mule.
