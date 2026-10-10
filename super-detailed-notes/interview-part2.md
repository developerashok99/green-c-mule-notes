# Interview Preparation Part 2 — RAML, API Manager and Policies, OAuth 2.0 / JWT, Error Handling, and DataWeave Q&A

> **Sources:**
> - Cleaned audio transcript ([transcripts-cleaned/interview-part2.txt](../transcripts-cleaned/interview-part2.txt)) and the class video (recorded 31 Mar 2024, ~152 min).
> - Text marked *slide* is read from the instructor's prep text files and decks shown on screen (RAML, API Manager, Error Handling, DataWeave question files; the OAuth 2.0 deck).
> - Slide images: [slides/interview-part2](../slides/interview-part2/).

## 1. Overview

1. RAML / API specification Q&A — the 19 questions deferred from Part 1
2. Sharing an API spec with stakeholders — Design Center share, mocking, Exchange public portal (demo)
3. API Manager — API Manager, API Autodiscovery, API gateway, API proxy, gateway vs proxy
4. Security policies — Basic Auth, Client ID Enforcement, HTTP Caching, Rate Limiting, Rate Limiting – SLA, Spike Control, throttling
5. OAuth 2.0 — the OAuth process, grant types, OpenID Token Enforcement, authentication vs authorization, the OAuth dance
6. JWT Validation policy and the JWT structure
7. Error handling — explaining it, global error handler, business errors, On Error Continue vs Propagate (drawings), Try scope in sub-flows / For Each / Parallel For Each / Scatter-Gather, reconnection vs Until Successful
8. DataWeave — rating yourself, complex transformations, flatten, distinctBy, removing a key, splitBy, lookup, read / write, filter / filterObject, reduce
9. DataWeave questions shown on screen but not discussed
10. Must Remember
11. Interview-question checklist

---

## 2. RAML / API Specification Q&A

*Slide:* `RAML Interview Questions` — the 19 questions listed at the end of Part 1, now with answers.

- The instructor calls this "API specification and RAML", but the industry calls it RAML.
- Interviews and the certification usually have **3–5 RAML questions** — you need the whole segment to answer whichever ones come.
- These 19 questions cover about **70–80%** of what gets asked.
- Remember these above all: **traits, resource types, libraries, fragments, data types, security schemes**. For anything else it's fine to say you haven't used that feature.

### 2.1 What is RAML?

*Slide:* "RAML stands for RESTful API Modeling Language. RAML is a YAML-based modeling language to describe RESTful APIs and design API Specification. We define requests, responses, schemas, examples, resources, methods, and security schemes in API Spec. The Design Center of Anypoint Platform supports RAML 1.0 and 0.8."

- Technique: **start by expanding the abbreviation** — it buys time to recall the rest.
- Other names for an API specification: **API contract**, **API spec**.
- In class the list of what you define also included protocols and media types.
- **RAML 0.8:**
  - 1.0 is the latest version (since about 2015–16); 0.8 is the old one.
  - Design Center offers both, but many 1.0 features don't exist in 0.8.
  - If asked about 0.8 experience, say clearly: "I don't have exposure to 0.8; I have always used 1.0."

### 2.2 What is a trait, and how do we import a trait into root RAML?

*Slide:* "Traits are reusable components in RAML similar to functions, it allows you to declare common properties for HTTP methods. Traits are used to define method-level nodes such as descriptions, headers, query parameters, security schemes & responses. Traits can be called by resources using the "is" keyword. It is useful to enhance readability, reduce redundancy, and improve consistency."

- Like a function in programming: write it once, reuse it everywhere.
- Use it for patterns that repeat across methods — headers, authorization information, responses.
- Declared in the root RAML header with the **`traits`** keyword; applied with **`is`** (as an array).
- Why: without best practices a RAML gets very long. Traits:
  - increase **readability**;
  - **reduce redundancy** (the same snippet isn't repeated across methods);
  - improve **consistency** and **modularity**.
- How to remember the answer: what it is → the keyword → readability, redundancy, consistency.

### 2.3 What is a resource type, and how do we call it in resources of root RAML?

*Slide:* "Resource Type is a template that is used to define the common properties of resources. Resource Type is used to define descriptions, methods, and parameters that can be used by multiple resources. Resource Type can be called by resources using the "type" keyword. It is useful to enhance readability, reduce redundancy, and improve consistency."

- A resource can have responses, body, headers, query params, URI params — everything.
- **Trait = method level only.** **Resource type = up to the resource level.**
- Applied with the **`type`** keyword.

### 2.4 What is a library, and how do we import a library component into root RAML?

*Slide:* "A library is a collection of data types, security schemes, and resource types. It also allows you to define multiple types within the same library, unlike data types. It enhances modularity and readability. The library can be called by using the "uses:" keyword in root RAML and a dot notation to refer to a type inside that library."

- Traits, resource types, libraries and so on are all best practices — a RAML works without them, but they give modularity, readability and consistency.
- A data-type file allows only data types; a **library can hold data types, security schemes, traits, resource types — everything**.
- Moving code into a library makes the main RAML shorter — that's the modularity.
- Import with **`uses:`** in the root RAML header; refer to an item with **dot notation** — `<libraryName>.<traitName>`.

### 2.5 Difference between trait, resource type and library

*Slide:*

| | Definition |
|---|---|
| **Trait** | A reusable component in RAML; declares common properties for **HTTP methods** |
| **Resource type** | A template that defines the common properties of **resources** |
| **Library** | A **collection** of data types, security schemes and resource types |

- The usual question is just "trait vs resource type"; knowing all three definitions is enough.

### 2.6 What is a fragment?

*Slide:* "A fragment is a reusable component in RAML. It is used to externalize your security schemes, library, resource types, traits, data types, etc. It can be reused across any API Specification. It can be published to Exchange, and it is possible to version your fragments. It cannot be an independent API specification."

- Libraries, data types and resource types can be reused **only within one API specification**.
- Defined as a fragment and **published to Exchange**, they can be reused in **other API specifications**.
- A fragment **cannot be an independent API specification**: an API spec can be tested on its own; a fragment is only a part that other specs reuse.

### 2.7 How do you maintain reusability, modularity and consistency in RAML?

*Slide:* "Traits, Data Types, Resource Types, Libraries, and Fragments are used based on the requirement to achieve reusability, modularity, and consistency in RAML."

- The four words to say: **readability, reusability, modularity, consistency**.

### 2.8 What are data types?

*Slide:* "Data Type is used to describe and validate the data inside the API Specification. RAML includes several built-in data types as mentioned below."

| Built-in type | Represents |
|---|---|
| String | Textual data |
| Number | Numeric values |
| Integer | Whole numbers |
| Boolean | True or false values |
| Date-Only | A date without a time component |
| Time-Only | A time without a date component |
| DateTime | A date and time |

*Slide:* "RAML also supports custom or user-defined data types. Data Type is also used to define the structure of the request body, response body, or error body in RAML. The "types" keyword is used to import the data types into root RAML. The "type" keyword is used to call the data type in a method."

- The data can be a header, a request body or a response.
- In class, **array** and **object** were also listed as built-in types.
- Date-only / time-only / datetime are rarely used, because JSON has no date type. In practice: string, number, integer, boolean (and enum).
- Custom types (an object containing arrays, an array of objects) are built from the built-in ones.
- Add one or two extra points (built-in vs custom) to show clear understanding.

### 2.9 How do you restrict or manage extra properties in a JSON object?

*Slide:* "The "additionalProperties" keyword is used to restrict any extra properties in the JSON object of RAML. By default it allows extra properties, the value is true. Mention the value as false to restrict any extra properties. Similarly, the "additionalItems" keyword is used to restrict any extra items in the JSON array of RAML."

- Default: **`additionalProperties: true`** — extra properties are accepted.
- Class example: an object defined with salary, designation and one more field; the request also sends `status: active`.
  - Without the keyword → accepted.
  - With **`additionalProperties: false`** → rejected.
- For arrays: **`additionalItems: false`** rejects items beyond those defined.

### 2.10 How do you define security policies in RAML?

- Policies (Basic Auth, Client ID Enforcement, OAuth 2.0) are defined in the **security schemes** section.
- Applied with **`securedBy`**:
  - in the root header → applies to **all resources**;
  - inside a resource → applies to **that resource only**.
- If `securedBy` is set at both levels, the **resource level** wins.

### 2.11 Is there a way to restrict the number of properties in a JSON object?

- **`minProperties` / `maxProperties`** — e.g. min 3, max 5; fewer than 3 is rejected.
- With only minProperties 5, it accepts 5 or more.
- For arrays: **`minItems` / `maxItems`** — use both for a range.

### 2.12 How do you handle multiple request data types?

- Mention nothing in the body → any data is accepted.
- To accept specific types, list them under `body` — e.g. `application/json` and `application/xml` (snippet in 2.18).
- Scenario: 10 consumers, 5 send JSON and 5 send XML → the spec accepts both, and the implementation uses a **Choice router** to transform each format differently.
- The instructor hasn't needed this in a real project, but it's a tricky interview question.
- **Two JSON structures for one request:** define two data types and join them with the **pipe** `|` (`type: jsonOne | jsonTwo`). The APIkit router then accepts either without an error.
- **Accepting null:** a required `string` field sent with no value gets a **bad request** from the APIkit router. Write `type: string | nil` to accept a string or null — `nil`, lowercase, not `null`.
- The pipe accepts multiple types; `nil` is the keyword for null.
- **Title** is the mandatory field in the root RAML. It's filled in from the name you give, and removing it causes an error.

### 2.13 What is baseUri in RAML?

*Slide:* "In RAML, baseUri (optional property) defines the base URL for your API resources. It helps identify the service endpoint during design and specify the actual API URL after implementation."

- Example: baseUri `http://localhost:8085/api` with resources `/add`, `/update`, `/delete`.
  - URL = baseUri + resource path → `http://localhost:8085/api/add`.
- During design a **dummy URL** is fine; after implementation, use the real endpoint (e.g. from Runtime Manager).
- It's **optional**. When set, it shows up in mocking, the documentation and "Try it".
- Some teams put the **version** (e.g. `v1`) in the baseUri — recommended as part of the URI, and a good practice.
- baseUri parameters exist, but the instructor has never used them.
- The instructor's approach: focus on limited knowledge, get maximum results. Full RAML would take 10–15 days. What's here is enough to survive in a project and to learn more from there.

### 2.14 Which RAML version are you using? What is the latest?

*Slide:* "I have used RAML 1.0 and it is the latest version."

- If asked about 0.8: "I don't have experience on 0.8" — there are many differences, and 1.0 has been out since 2016.

### 2.15 Have you worked on Swagger or OAS?

*Slide:* "No. If I am given a chance to learn, will do that and contribute to the project as I am already well-versed with RAML."

- **Swagger** is the old name of **OAS** (Open API Specification) — another modeling language for defining RESTful APIs, like RAML.
- Say no straightaway, but **don't stop there** — add that you're ready to learn it and apply it.
- Knowing RAML, picking up OAS takes 1–2 days. The same ideas apply (readability, modularity, best practices); only the terminology differs.
- The instructor once had a project like this and had his team learn OAS.

### 2.16 Can the same HTTP method be used multiple times for a single request path?

*Slide:* "No, a single request path can have one HTTP method."

- As explained in class: a resource can have **several different methods, but no duplicates**.
- A parent resource and a child resource can each have their own GET, because the path differs — e.g. `/employees` with GET, and `/employees/department` with GET.

### 2.17 What HTTP methods does RAML support?

*Slide:* "GET, POST, PUT, PATCH, DELETE, HEADS, OPTIONS" (HEAD written as "HEADS" on the slide).

### 2.18 How do you handle multiple data formats for the same request?

*Slide:* "In the body section of an HTTP method, mention the data types to be allowed as mentioned."

```yaml
/users:
 post:
   body:
     application/json:
       type: jsonOne | jsonTwo
     application/xml:
       type: xmlType
```

- Q12 (multiple request data types) and Q18 (multiple data formats) were answered together.
- `jsonOne | jsonTwo` → two JSON structures accepted; `application/xml` → XML accepted too.
- **Student question:** POST sends a body — how does the data get in?
  - POST sends a body (GET doesn't).
  - With only `application/json` listed, only JSON is accepted. With both listed, both are accepted, and the code handles each format.

### 2.19 How do you share the API specification with internal and external stakeholders for testing?

*Slide:* "For internal stakeholders, use the share option in the Design Center. For external stakeholders, two options are available. a. Enable the mocking services option and share the Postman collection to test the API Specification. b. Publish the API specification to Exchange, make the [asset public, and share the public portal] URL."

| Stakeholder | How |
|---|---|
| Internal | **Share** option in Design Center (or Share in Exchange) |
| External (a) | Enable the **mocking service**, share the **Postman collection** |
| External (b) | **Publish to Exchange → make it public → share the API (public) portal link** |

- The documentation's **"Try it"** option can also be used for testing.
- The **API portal** is a collection of public APIs. Anyone with the link can open and test them.
  - Example: of 10 APIs, make 5 public → publish to Exchange, make them public, and they appear in the portal.

---

## 3. Demo — Making an Exchange Asset Public

*Screens:* Runtime Manager (a hello-world app on CloudHub) → Exchange, Cloud Technologies assets (`hr-employees-sapi-730am`, `hr-employees-sapi-9pm`, `hello-world`) → asset **Share** dialog → **Public portal** → "Welcome to your developer portal!".

1. Open the asset in Exchange and click **Share**. Internal users can be added here as well as in Design Center.
2. Choose **Public** and save.
3. Open the **public portal** — the asset is listed there.
- The demo asset had no resources, so it couldn't be tested. An external stakeholder with the URL could test an asset that has them.

---

## 4. API Manager Q&A

*Slide:* `API Manager Interview Questions`.

### 4.1 What is API Manager?

- "API Manager is a component of Anypoint Platform; it helps to manage the **policies, alerts, clients and SLAs** of APIs."
- Short version: "It allows us to manage policies and clients" — you **enforce policies** with it.
- If you don't recall the full answer, start with what you know ("it's part of Anypoint Platform").

### 4.2 What is API Autodiscovery, and what are the steps?

- **API Autodiscovery** is an ID that **connects the application deployed on the runtime to its asset in API Manager**. Only then are the API Manager policies applied to the app through the gateway.

Steps:

1. Design the API spec in RAML and **publish it to Exchange** from Design Center.
2. In API Manager, choose **Manage API from Exchange** (add from Exchange).
3. Select the gateway — the **embedded gateway** is the default (or Flex / another gateway if used), fill in the configuration and create the asset. The asset is in **Unregistered** status, and an **Autodiscovery ID** is generated.
4. In Anypoint Studio → **Global Elements** → **API Autodiscovery**:
   - give the Autodiscovery ID;
   - give the **flow that contains the APIkit router** (the main flow) — not any random flow.
5. After a successful deployment the asset becomes **Active**, and its policies take effect.
- The project classes showed how policies take effect once this is set up.

### 4.3 What is an API gateway? What gateways have you used?

*Slide (partial):* "(Apigee), MuleSoft Embedded Gateway, MuleSoft Flex Gateway, Kong Gateway, Tyk Gateway, etc are some of the possible options. MuleSoft Embedded Gateway acts as a default gateway."

- Say "gateway" in an interview and expect this question.
- An API gateway is a **software layer that acts as a single entry point for API calls**, sitting **between client applications and backend services**. For example, it sits between a mobile app and the API in front of the database.
- **Analogy — the security guard:**
  - The gateway is the guard at the main gate: it checks every visitor (request) and lets them in only if everything is in order.
  - The **APIkit router** is the door inside: it decides whether the visitor can enter a particular room (resource).
- **Key functions:**
  - **Traffic management** — every request reaches the gateway first.
  - **Security enforcement** — policies run on the gateway. In the project classes a Client ID Enforcement violation never reached the application logs; the gateway rejected it.
  - **Request processing** — partly processes and validates the request.
  - **Response handling** — gets the response from the app and returns it to the consumer.
  - **Monitoring and analytics** — like Anypoint Monitoring. The instructor hasn't used the gateway analytics in MuleSoft.
- The MuleSoft gateway does all of this in the background.
- Separate gateways (Apigee, Kong, Tyk, AWS) are common in organizations, but they're a separate subject. It's fine to say you've only used MuleSoft's.
- **Flex Gateway** — a separate gateway option for MuleSoft applications.

### 4.4 What is an API proxy?

*Slide:* "Proxy API is an intermediary program that acts as a middleman between client applications and backend services in an API (Application Programming Interface) environment. The key functions of an API proxy are a. Translate the request as per backend requirements b. Enforce policies c. Route traffic"

- Like a person standing in as a proxy: looks the same, but isn't the original.
  - The actual API does the implementation.
  - The proxy only adds policies and small request changes.
- "Backend service" here means another API, not a database or Salesforce directly.
- **Why use one (security):**
  - The experience API faces the external world — the "main gate".
  - Move the experience layer behind it, into the **DMZ (demilitarized zone)**, and put the **proxy** at the main gate.
  - Anything suspicious is then rejected at the outer gate.

### 4.5 Difference between API gateway and API proxy

*Slide:* "API Gateway manages multiple APIs, acting as a central hub for your API ecosystem whereas API Proxy focuses on individual APIs, often used to add security or translation functionalities to existing APIs. API Gateway offers a wider range of features like traffic management, monitoring, analytics, and versioning."

- **Gateway:** one software layer for **many APIs**.
- **Proxy:** **one API**.
- Example: 100 APIs → one gateway routes them all; without a gateway you'd need 100 proxies.
- Proxies are added only when really needed — MuleSoft's embedded gateway is usually enough. Still, know the difference: it's asked of 5-year candidates.
- **Student question:** does the gateway route to nodes (node 1, 2, 3) behind it?
  - No — it routes to the **API**. A load balancer handles nodes.
  - Example: a request for Transaction API resource 1 goes to the Transaction API, whose APIkit router checks the resource. A request for Loyalty API 3 / R4 goes to Loyalty API 3.

---

## 5. Security Policies Q&A

### 5.1 What security policies have you worked on?

*Slide:* "I have worked on different policies such as Basic Authentication, Client ID Enforcement, HTTP Caching, rate-limiting, and, JWT Validation policies."

- These are the policies from the project training; **JWT Validation is related to OAuth 2.0**. The JWT discussion alone took 3–4 hours.
- **OAuth is special:** if you don't mention OAuth 2.0, the interviewer will ask "did you work on OAuth 2.0?".

### 5.2 What is Basic Authentication?

*Slide:* "It is the easiest way to secure an API. A username and password will be defined and the consumer shares the request with username and password, then the request is sent for further processing if the credentials match. The credentials are the same for all consumers."

- The same username/password is shared with every partner, so it's **less secure**.

### 5.3 What is Client ID Enforcement?

*Slide:* "Different client IDs and client secrets are created for different clients and shared with them. The respective client should send the client ID and secret with the request. The API Manager will validate the ID and secret and then send the request for further processing. If the valid ID or secret is not passed then the application will send 401 unauthorised response to the client."

- 10 consumers → 10 client ID/secret pairs, one per consumer. API Manager validates them through the gateway.

### 5.4 Basic Authentication vs Client ID Enforcement

| | Basic Auth | Client ID Enforcement |
|---|---|---|
| Purpose | Secures the API | Secures the API |
| Sends | Username + password | Client ID + client secret |
| Credentials | **Same for all consumers** | **Different for every consumer** |
| Security / control | Less secure | More control |

### 5.5 What is the HTTP Caching policy?

- Saves the responses of requests. When the **same request** comes again, it returns the response **from cache** instead of calling the end system.
- Use it for APIs **whose response doesn't change for a long time** — frequently repeated data.
- Result: **better performance** and **less load on the source system**.
- **Student question:** how is caching a *security* policy?
  - It's simply one of the policies. The categories differ (security, controlling, limiting…), and the class didn't need that classification.

### 5.6 What is the Rate Limiting policy? What happens when the limit is exceeded?

- Limits the number of calls in a time window; an error is returned once the threshold is reached.
- Error: **429 Too Many Requests** (seen in the project practicals).
- Example: 100 requests/hour → the 101st request gets 429; requests are accepted again after the hour.
- The slides list every likely question; interviewers phrase them differently.

### 5.7 Different rate limits for different consumers?

*Slide:* "Yes, the provision is available."

- Example: 500 requests/day for consumer 1, 1000 for consumer 2.
- A student pointed out this is the **Rate Limiting – SLA based** policy. The instructor's reply: rate limiting is the parent policy.

### 5.8 What is Spike Control?

*Slide:* "It is similar to rate limiting policy but it will keep requests in queue for further processing once the threshold is reached."

- Example: 100 requests/hour reached and 10 more arrive → they're **queued** for the next window, not rejected straightaway.

### 5.9 Rate Limiting vs throttling

*Slide:* "Both policies are designed to limit API access but with different intentions. The rate-limiting policy will reject the request once it reaches the threshold. Throttling will keep the requests in the queue for processing in subsequent windows. If the request is not processed within specified retries then it will reject."

- The instructor thinks "throttling" is an older industry term for spike control.
- **Rate limiting:** errors straightaway.
- **Throttling / spike control:** queues the request, and errors only if it isn't processed within the retries.

---

## 6. OAuth 2.0 Q&A

*Slides:* the OAuth 2.0 deck from the project classes — What is OAuth 2.0?, the Authorization Code / Client Credentials / Resource Owner Password flows (Zomato, Facebook and Domino's examples), OAuth 2.0 terminologies.

### 6.1 Have you worked on the OAuth policy? Explain the OAuth process.

*Slide:* "OAuth 2.0 stands for Open Authorization. OAuth 2.0 is an Authorization framework, not an Authentication protocol. It is a standard for authorization where a user allows an application to access their resources hosted on another application, on their behalf, without the sharing of their credentials."

- If asked about OAuth 1.0: "I have not worked on OAuth 1.0; I have worked on OAuth 2.0."
- Memorize the definition, then name the grant types.
- The full topic (≈25 slides, 2–2.5 hours in the project classes) can't be summarized in 5–10 minutes.

**Short explanation given when a student asked:**

1. The client gets a **token from the authorization server**.
2. It passes the token with the request — as a **request header** — to the resource server.
3. The **resource server validates the token with the authorization server**.
4. Valid → the request proceeds.
5. Invalid (expired, wrong token) → **401 Unauthorized**.

- **Scope** restricts access — e.g. the Zomato app can only GET (read) the Facebook profile details, not update or delete them.
- The instructor said he might expand this answer to 5–10 sentences later.

### 6.2 OAuth 2.0 terminologies

*Slides:*

| Term | Definition |
|---|---|
| Resource owner | The user who owns the account that is being accessed |
| Resource server | The server that hosts the protected resources that the client wants to access |
| Client | The application that is requesting access to the protected resources |
| Authorization server | The server that handles the authorization process and issues access tokens |
| Grant | A method by which the client obtains an access token; each grant type has a different authorization flow |
| Redirect URI | A URI the authorization server redirects the user to after they have authorized the request; specified by the client when it initiates the flow |

### 6.3 Grant types, and the significance of client credentials

*Slide:* "A method by which the client obtains an access token is known as a grant. OAuth 2.0 defines several grant types, such as authorization code grant, client credentials grant, and resource owner password grant. Each grant type has a different authorization flow."

| Grant type | When to use | Token generated from | Class example |
|---|---|---|---|
| **Client credentials** | **Server-to-server** communication; no user involved; **no ownership of resources** — the data is common to everyone | Client credentials | Zomato server ↔ Domino's resource server: pizza types, offers, restaurants |
| **Authorization code** | Ownership of the resource data lies with the user (resource owner) **on a third-party app** | The authorization code | **Sign up using third-party apps** — e.g. a GeeksforGeeks account created from Google (name, email, photo); Zomato reading Facebook profile details |
| **Resource owner password** | Ownership lies with the user, and the client app gets that user's data from its **own server** | Client credentials **plus** the resource owner's credentials | A logged-in Zomato user viewing their order history — **less secure** |

- The question asks about client credentials, but know all three in case they ask about another.

### 6.4 What is the OpenID Token Enforcement policy?

*Slide:* "An OpenID Token Enforcement policy in MuleSoft acts like a security guard for your API. It ensures that only requests with valid access tokens can access the API resources. Both authentication and authorization are part of this policy."

- **OAuth policy:** authorization only.
- **OpenID Token Enforcement:** **authentication + authorization**.

**Where OAuth policies are applied (instructor's experience):**

- Mostly on APIs **exposed to the outside world** — experience APIs or proxy APIs.
- Usually not on internal calls (experience → process → system), though some organizations apply OAuth everywhere.
- Every call goes to a separate server, so more requests mean more cost, resource use and maintenance.

### 6.5 Authentication vs authorization

*Slides:* "Authentication is the process of verifying a user's identity. In the context of OAuth 2.0, authentication typically occurs at the authorization server, where the user logs in to their account and confirms their identity. This ensures that only authorized users can access their protected resources." · "Authorization is the process of granting permission to perform specific actions. In OAuth 2.0, authorization occurs after authentication, when the user grants the client application permission to access their protected resources. The scope of authorization determines the level of access the client application has to the user's data."

- Expect this as a scenario-style follow-up once you name OAuth 2.0 / JWT Validation.
- **Hotel analogy:**
  - At check-in you give the booking ID and an ID proof; the name on both must match (Mahesh Reddy) → **authentication** (verifying the user).
  - You get the key to **one room** (401, not 402 or 403), plus the common facilities (gym, pool, restaurant) → **authorization**, and the room is the **scope**.
- Authentication comes **first**: a wrong user is rejected before authorization starts.
- Scope example: profile details limited to GET — no update or delete.

### 6.6 What is the OAuth 2.0 dance?

*Slide:* "The OAuth dance, also known as the OAuth flow, refers to the series of steps involved in the OAuth 2.0 authorization process. The dance typically involves redirecting the user to the authorization server to grant permission, exchanging an authorization code for an access token, and utilizing the access token to access protected resources."

- Simpler wording, also fine: "The series of steps between the actors for getting the token and validating the token is the OAuth dance."

---

## 7. JWT Validation Policy

### 7.1 What is the JWT Validation policy?

*Slide:* "A JWT stands for JSON Web Token. This policy is used mostly to secure experience APIs as they are exposed to the clients. It skips the step of verifying the access token with the Authorization server every time. It looks for a JSON Web Token (JWT) typically included in a request header or parameter. The policy verifies the JWT's signature using a secret key (known only to the API and issuer). If the signature is valid, the policy might also check the claims (information) within the JWT to ensure they meet certain requirements. If the JWT is valid and claims meet [the criteria, the request proceeds; if not, access is denied]."

- The policy applied to the course project's **experience API**.
- **Why JWT and not plain OAuth validation:**
  - With plain OAuth, every token goes back to the authorization server, which looks it up in its database and confirms it.
  - At 1 lakh requests a day, that's 1 lakh calls to the authorization server — very costly.
  - JWT Validation uses a **key** to verify the token locally instead.
- **How it works:**
  1. The key is fetched once from the authorization server's **JWKS** (key set) and **cached** (an hour, two hours, a day).
  2. The token's **signature** is verified with that key.
  3. If the signature is valid, the **claims** (the information in the payload) may be checked against requirements.
  4. Valid → the request proceeds; otherwise **access is denied**.

### 7.2 JWT structure

*Slide:* "JWT stands for JSON Web Token · Format: Compact, self-contained JSON object · Structure: Three parts header, payload, and signature separated by dots(.)"

*Screen:* jwt.io debugger — a token decoded into header, payload and signature, "Signature Verified".

---

## 8. Error Handling Q&A

*Slide:* `Error Handling` — 9 questions (answers for 5–8 on the slide).

- Certification error-handling questions are harder than interview ones. If you pass the certification on real knowledge (no dumps), the interview questions are easy.
- Scenario-based questions were left out for time; the instructor planned to add 3–4 with answers.

### 8.1 Explain error handling in MuleSoft

**Model answer (as framed in class):**

> "I have implemented error handling in my MuleSoft projects. I have followed global error handling. For implementing it I have used the components On Error Propagate, On Error Continue, Raise Error and Error Handler. Whenever component-level error handling was required, I used the Try scope; whenever flow-level was required, I used the flow-level error handler; otherwise I followed global error handling."

| Level | How |
|---|---|
| Component level | **Try scope** (one or more components) |
| Flow level | The error-handling section at the bottom of the flow |
| Project level | **Global error handler** |

- A student opened with: Mule 4 has On Error Propagate, On Error Continue and Raise Error, and the error handler stops the flow execution. The instructor built the fuller answer on this.

### 8.2 How did you implement global error handling? (Q9 — explain the global error handler)

1. Create a **separate configuration XML** file, e.g. `error-handler.xml`.
2. Drag in an **Error Handler** and add On Error Propagate / On Error Continue for each error type, with **ANY last** to catch the rest.
3. Create the global element **Configuration** and set its **default error handler** to this handler.
4. Every error in every configuration XML of the project now goes to it.

*Screen:* Studio `apikit-error-handler` — On Error Propagate `APIKIT:BAD_REQUEST` → Transform Message, On Error Propagate `APIKIT:NOT_FOUND` → Transform Message, …

*Screen:* `hr-employees-sapi` Global Elements — HTTP Listener config, Router, Database Config, Configuration properties (`config/${mule.env}.yaml`), Secure Properties Config, API Autodiscovery.

- **Organization-wide option:** some organizations build one common error handler for all their MuleSoft applications and publish it to **Exchange**. Each project adds it as a dependency and uses it.

### 8.3 How to manage business errors?

- Three kinds of errors:
  - **system** — a system is down;
  - **technical** — DataWeave or expression errors;
  - **business** — raised on purpose because of a business rule.
- Example: a loan application accepts ages **21–60**. Below 21 or above 60 must be rejected.
- Raise it with the **Raise Error** component, or the **Validation module**.

### 8.4 How to raise errors without using error components?

- Use the **Validation module** — e.g. an "is number" check with min 21 and max 60 raises an error outside the range.
- You can set the **error type** and **error message** in the validator.
- **Raising vs catching:** Raise Error / Validation *raise*; On Error Propagate / Continue *catch*, matched by error type.
- **Order matters:** the error handler checks its handlers **in sequence**, like a Choice router. Put **ANY** first and it catches everything, so the specific handlers are never reached. **ANY goes last.**

### 8.5 On Error Continue vs On Error Propagate

**Wording given in class:**

- **On Error Propagate:**
  - catches errors **based on the error type**;
  - **stops the process** and **propagates the error response to the next level**.
- **On Error Continue:**
  - also **stops the process** in that flow;
  - sends a **success response** to the next level.
- **"Next level"** means the parent flow if there is one, otherwise the consumer — whoever sent the request.

**Students' attempts at the answer:**

- They said On Error Continue "continues the flow" and returns 200, while On Error Propagate stops it and returns 400.
- The instructor corrected this: **both stop the process**. The only difference is a success vs an error response to the next level.

**Case 1 — single flow** (source → components 1–4 → HTTP Requester fails with HTTP:CONNECTIVITY):

| | On Error Propagate | On Error Continue |
|---|---|---|
| Process | Stops at the failing component; the handler's components run | Stops at the failing component; the handler's components run |
| Listener | **Error response** section | **Success response** section |

**Case 2 — parent flow + child flow** (the parent calls the child via Flow Reference; the child's HTTP Requester fails):

| Child flow's handler | What the Flow Reference gets | Parent flow |
|---|---|---|
| On Error Continue | A **success** response | **Continues** to the next component after the Flow Reference |
| On Error Propagate | An **error** response | An error is raised in the parent. With no handler of its own, it goes to the Listener's **error response** |

*Drawing:* consumer/client ← error response ← parent flow (source, components, Flow Reference, error handler) ⇄ child flow (source, HTTP requester, error handler with OEC / OEP).

**Student questions:**

- **Success status code validator vs On Error Continue:** the validator only applies to HTTP. To continue past, say, a database error, you need On Error Continue.
- **Why no Try scope on the list?** The next 4–5 questions cover it — "without Try, error handling is incomplete."
  - Try is not only for one component; **multiple components** can go inside it (that's why it's a scope).

### 8.6 How to handle errors in a sub-flow?

*Slide:* "Use the Try scope inside the sub-flow and configure the error handling part of the Try scope."

- A sub-flow has **no error handler of its own**. It's always called through a Flow Reference and **inherits the parent flow's error handling**.
- This is rarely done in practice — you'd use a **private flow** instead — but it's asked to check clarity.

### 8.7 How to continue processing after an error inside For Each?

*Slide:* "Use Try scope inside the for-each and use On Error Continue in the error handling part of Try."

- By default For Each **stops at the failing item** and propagates the error (10 items, item 5 fails → stops at 5).
- With **Try + On Error Continue inside the For Each**, item 5 fails but items 6–10 still run.
  - Aggregate the results and pass them to the next component.
- On Error Continue with no type = **ANY**; set a specific error type if you need one.

### 8.8 How to continue processing after an error inside Parallel For Each?

*Slide:* "Use Try scope inside the for-each and use On Error Continue in the error handling part of Try." — the slide says "for-each" by copy-paste mistake.

- Same answer: **Try scope inside the Parallel For Each**, On Error Continue in the Try's error handling.

### 8.9 How to continue processing after an error in one route of Scatter-Gather?

*Slide:* "Use Try scope and configure On Error Continue in all the routes of Scatter Gather."

**Default behaviour:**

- The same Mule event goes to every route, and the routes run **in parallel**.
- If route 1 fails, routes 2 and 3 **still complete**. The results are aggregated, then a **MULE:COMPOSITE_ROUTING** error is raised, the process **stops and the error propagates**.

**To continue:**

- Wrap **all the components of each route** in a **Try** with **On Error Continue**.
- Any failing route then returns normally, and processing carries on after the Scatter-Gather.

*Drawing:* Scatter-Gather — the Mule event (ME) to R1 (100 ms), R2 (50 ms) and R3 (250 ms), each wrapped in Try + OEC; the failing component in R1 circled; Gather → next component; arrival order R2, R1, R3; "Mule composite: Routing → stop the process & propagate the error".

**Student questions:**

- **Parallel or sequential?**
  - Parallel — Scatter-Gather waits at the gather point for every route.
  - In the drawing R2 finishes first, then R1, then R3.
- **How do you know which route failed?**
  - Processing stops at the failing component; the rest of that route doesn't run.
  - Set the error response in that route's On Error Continue.
  - Scatter-Gather's output is an **object of all Mule events**, so read route 1 as `payload."0".payload` and you'll see the error response.

### 8.10 Reconnection strategy vs Until Successful (student questions)

| | Reconnection strategy | Until Successful scope |
|---|---|---|
| Where | On connectors — e.g. Database, HTTP Requester | A scope you wrap around the component |
| Retries on | **Connectivity errors only** | **Any error** |
| Example | DB attempts 1–2 fail on a network fluctuation, attempt 3 connects (5 attempts configured) | Retries the specified number of times whatever the error |

- Other errors (bad gateway, resource not found…) are **not** retried by the reconnection strategy.

---

## 9. DataWeave Q&A

*Slide:* `Dataweave` question file.

- Interviews rarely ask DataWeave **theory**. Usually you **share your screen**, get an input and an expected output, and write the script.
- If they don't ask for screen sharing, expect **3–5 theory questions** — "without DataWeave nobody completes the interview".
- The instructor planned to share **15–20 commonly asked practice problems with scripts** for the Playground or Studio.
- **Practice every function here** in Anypoint Studio or the DataWeave Playground.

### 9.1 How do you rate yourself in DataWeave out of 10?

- **7** — the ideal answer.
  - 9–10 makes them expect too much.
  - 4–5 looks unconfident.
- "I'd say 7 — I have the knowledge and I can do it."

### 9.2 What complex DataWeave transformations have you written?

- Often asked near the end of the DataWeave section.
- Have **2–3 medium-to-complex transformations you've actually faced** ready (not easy ones).
- **Related question:** "What challenges did you face in this project?"
  - In a recent client interview the instructor was asked for 3–4 challenges.
  - After he explained one in detail, the interviewer moved on, satisfied.

### 9.3 Explain the flatten function

*Slide:* "Flatten takes the input array and flattens the first level of sub arrays, omits empty sub arrays and outputs an array."

- Input array → output array.
- Empty sub-arrays at the first level are removed.
- Say "**first level**": an array nested deeper is **not** flattened.

### 9.4 Explain the distinctBy function

*Slide:* "DistinctBy is used to remove duplicates from an array or an object. It iterates over an array and outputs the unique values. It iterates over an object and outputs unique key-value pairs."

```dataweave
[0,1,2,3,3,2,1,4] distinctBy $                          // [0,1,2,3,4]
[0,1,2,3,3,2,1,4] distinctBy (value) -> {"unique": value}  // [0,1,2,3,4]

// Input: {"a": 5, "a": 5, "b": 6}
payload distinctBy ((value, key) -> "key": value)          // {"a": 5, "b": 6}
```

- `$` is the value — the same as writing a named `value` parameter.

### 9.5 How to skip a specific key-value pair from a JSON object?

*Slide:* `payload - 'keyname'`

- Example: `payload - "name"` removes the `name` key. A frequently asked question.

### 9.6 Explain splitBy, or how do you convert a string to an array?

*Slide:* "SplitBy splits a string into a string array based on the regex pattern mentioned." — `payload splitBy(/regex/)`

- An empty pattern splits every character.
- A space splits "hello world" into `["hello", "world"]`.
- The pattern can be given directly or between forward slashes as a regex.

### 9.7 Explain the lookup function, or how do you call a flow from DataWeave?

*Slide:* "Lookup is used as an alternative to flow reference. Lookup is used to call a flow or a private flow from dataweave. It cannot call a subflow." — `Mule::lookup(flowname, input, timeout in ms)`, default 2000 ms.

| Parameter | Meaning |
|---|---|
| flow name | The flow (or private flow) to call |
| input | What to send — a variable, the payload, whatever is needed. A Flow Reference passes the whole Mule event (payload, attributes, variables); lookup passes only this |
| timeout | Times out if the flow doesn't respond in time. **Default 2000 ms (2 s)** |

- Use it to **map one specific field** from another flow's payload.
- Likely follow-ups:
  - "Can lookup call a sub-flow?" → **No**.
  - "Default timeout?" → **2000 ms**.
  - "Parameters?" → **flow name, input, timeout**.

### 9.8 What are the read and write functions? Give an example.

- **read:** "reads a string or binary and returns parsed content". Useful when the reader **can't find the content type by default**.
  - Example: a JSON object arrives as a **string** — `"{ "message": "Hello world!" }"`.
  - Fix: `read(payload, "application/json")`.

*Screen:* DataWeave Playground — payload as text `"{ "message": "Hello world!" }"`:

```dataweave
%dw 2.0
output application/json
---
read(payload, 'application/json')
```

- The Playground showed an "Exception while reading … Unexpected character" error. Some functions don't behave in the Playground.
- **Instructor's real use — database column:**
  1. A whole JSON object has to go into one column of a relational database, which won't accept a JSON object.
  2. Stringify it with `write(payload, "application/json")` (it gets quotes at the start and end) and insert it.
  3. Reading it back, the column comes as a string. `read(…, "application/json")` turns it back into JSON.
- Rarely asked, but very important.
- XML works the same way. 80–90% of projects handle JSON, hence the JSON example.

**Student question — multipart form data:**

- If you haven't used it, say so; tutorials and blogs cover it.
- It's used to send different kinds of content in one request, e.g. a file to another system.
- A rare requirement — in 150+ interviews the instructor has never asked about it. He used it once, 2.5–3 years ago.

### 9.9 Explain filter and filterObject

*Slide:* "…Input is array, output is array · filterObject iterates a list of key-value pairs in an object and applies an expression that returns only matching objects, filtering out the rest from the output. Input is object, output is object."

| | Input | Output | Use |
|---|---|---|---|
| `filter` | Array | Array | Iterates over an array, keeps the values that match the expression |
| `filterObject` | Object | Object | Keeps only the matching key-value pairs |

- The same answer covers "difference between filter and filterObject".

### 9.10 Explain the reduce function

*Slide:* "It is used to do any computation while iterating on an array. Array to object is possible via reduce operator. It will iterate for the number of elements in array - 1. Item - $, acc - $$. If acc is not initialized it will take the first element of the array, item will take the second element. If acc is initialized, the item will take the first element of the array."

```dataweave
[2,3] reduce ((item, acc = 4) -> acc + item)   // 9
```

- Input must be an **array**.
- Two uses:
  - **computing** a value while iterating;
  - **converting an array to an object**.
- `$` = item, `$$` = accumulator.
- **acc not initialized:** acc = first element and item starts at the second (iterations = length − 1).
- **acc initialized:** item starts at the first element.
- Example: acc starts at 4 → 4 + 2 + 3 = 9.
- Takes 30–60 minutes of practice to understand — try multiple scenarios.

The class ended at 1 p.m. here; the remaining DataWeave questions weren't reached.

---

## 10. DataWeave Questions Shown on Screen but Not Discussed

The rest of the DataWeave file was scrolled past on screen. Answers below are the slide text only.

| # | Question | Slide answer |
|---|---|---|
| 11 | How do you encrypt and decrypt in DataWeave? | — |
| 12 | What is the default function? | "Default is used to set some values when the payload is absent or null." `"Fullname": payload.name default "XYZ Bank"` — if payload.name has no value, the default is assigned |
| 13 | Explain the process for creating a custom function | "We can define our own custom functions in dataweave at the header level using fun keyword." (snippet below) |
| 21 | How to skip null values? | `skipNullOn = "everywhere"` in the header. Values: attributes, elements or everywhere. It can't skip specific fields |
| 22 | Data formats you worked on? | JSON, XML and CSV |
| 23 / 30 | DataWeave version used / latest? | "Latest - 2.6.0, I am using 2.0" |
| 24 | How do you call config properties in DataWeave? | `p('propertyname')` (normal), `p('secure::propertyname')` (secure) |
| 25 | How to log a message in DataWeave? | — |
| 26 | Can we call a sub-flow using lookup? | No |
| 27 | Convert an array to a string / explain joinBy | — |
| 28 | How do you perform a null check? | `isEmpty()` — works on an Array, Object or String |
| 29 | How to mask in DataWeave? | — |
| 31 | — | "Dataweave practice questions need to be added" |

```dataweave
%dw 2.0
output application/json
fun myfunction(p1) = upper(p1)
---
myfunction("Hello")
```

---

## 11. Must Remember

**RAML**

- Start with the abbreviation: **RAML = RESTful API Modeling Language** (YAML-based; Design Center supports 1.0 and 0.8). You use 1.0, the latest; you don't have 0.8 exposure.
- **Trait** = method-level reusable component, applied with `is`. **Resource type** = resource-level template, applied with `type`. **Library** = a collection of types, schemes, traits and resource types, imported with `uses:` and referenced with dot notation.
- **Fragment** = reusable across *any* API spec via Exchange, versionable, never an independent spec.
- Reuse gives readability, reusability, modularity, consistency.
- `additionalProperties: false` / `additionalItems: false` reject extras (the default is true). `minProperties`/`maxProperties`, `minItems`/`maxItems` limit counts.
- `securedBy` at root = all resources; at a resource = that resource. **Resource level wins.**
- Multiple formats: list `application/json` and `application/xml` under `body`. Multiple structures: `typeA | typeB`. Accept null: `string | nil`.
- Title is mandatory. baseUri is optional — base URL + resource path; a dummy URL during design.
- Swagger = old name of OAS. Say "no, but ready to learn". One path, no duplicate methods.
- Share: internal → Design Center share; external → mocking + Postman collection, or Exchange public portal.

**API Manager and policies**

- **Autodiscovery** pairs the deployed app with the API Manager asset: Exchange → Manage API from Exchange → embedded gateway → ID → Studio global element on the **APIkit router flow** → Active.
- **Gateway** = one entry point for many APIs (traffic, security, request processing, response handling, monitoring). **Proxy** = one API (translate, enforce policies, route).
- Basic Auth = same credentials for all, less secure. Client ID = per-consumer ID/secret, more control; invalid → 401.
- HTTP Caching: for responses that rarely change. Rate Limiting: 429 at the threshold. SLA-based rate limiting: per-consumer limits. Spike Control / throttling: queue instead of reject.

**OAuth 2.0 / JWT**

- OAuth 2.0 = Open Authorization, an authorization framework, not an authentication protocol.
- Client credentials → server-to-server. Authorization code → sign up with a third-party app. Resource owner password → the user's own data on the client's server (less secure).
- OpenID Token Enforcement = authentication + authorization. The OAuth policy = authorization only.
- Authentication (who you are) comes before authorization (what you may do — the scope).
- JWT = header.payload.signature. JWT Validation checks the signature with a cached JWKS key, then the claims — no call to the authorization server per request.

**Error handling**

- Levels: Try (component), flow handler (flow), global handler (project, via Configuration → default error handler).
- Business errors: Raise Error or the Validation module. ANY goes last.
- **Both On Error Continue and Propagate stop the process.** Continue sends success to the next level; Propagate sends an error.
- Sub-flow / For Each / Parallel For Each / every Scatter-Gather route → **Try + On Error Continue** to keep going.
- Scatter-Gather failure → MULE:COMPOSITE_ROUTING after all routes finish.
- Reconnection = connectivity errors only. Until Successful = any error.

**DataWeave**

- Rate yourself 7.
- flatten = first level only. distinctBy = unique values / pairs. `payload - "key"` removes a key.
- splitBy = string → array by regex. lookup = flow / private flow, not a sub-flow, default 2000 ms.
- read = string → parsed. write = value → string (e.g. a JSON column).
- filter: array → array; filterObject: object → object.
- reduce: `$` item, `$$` acc; computation or array → object.

---

## 12. Interview-Question Checklist

**RAML**

- [ ] What is RAML?
- [ ] What is a trait, and how do you import it into root RAML?
- [ ] What is a resource type, and how do you call it?
- [ ] What is a library, and how do you import it?
- [ ] Difference between trait, resource type and library.
- [ ] What is a fragment? Can it be an independent API spec?
- [ ] How do you maintain reusability, modularity and consistency in RAML?
- [ ] What are data types? Built-in vs custom; `types` vs `type`.
- [ ] How do you restrict extra properties in a JSON object (and extra items in an array)?
- [ ] How do you define security policies in RAML? Root vs resource-level `securedBy`.
- [ ] How do you restrict the number of properties / items?
- [ ] How do you handle multiple request data types and data formats? Two JSON structures? A null value?
- [ ] What is the mandatory field in the root RAML?
- [ ] What is baseUri?
- [ ] Which RAML version do you use? Latest? Experience with 0.8?
- [ ] Have you worked on Swagger / OAS?
- [ ] Can one request path have the same HTTP method twice?
- [ ] What HTTP methods does RAML support?
- [ ] How do you share an API spec with internal and external stakeholders?

**API Manager**

- [ ] What is API Manager?
- [ ] What is API Autodiscovery? Steps?
- [ ] What is an API gateway? Its functions? Which gateways have you used?
- [ ] What is an API proxy? Why use one (DMZ)?
- [ ] Difference between API gateway and API proxy.

**Policies**

- [ ] Which security policies have you worked on?
- [ ] Basic Auth? Client ID Enforcement? The difference?
- [ ] HTTP Caching — when to use it?
- [ ] Rate Limiting — what happens at the limit, and which status code?
- [ ] Different rate limits per consumer?
- [ ] Spike Control? Rate Limiting vs throttling?

**OAuth 2.0 / JWT**

- [ ] Have you worked on OAuth? Explain the OAuth process. OAuth 1.0?
- [ ] Grant types — when to use client credentials, authorization code, resource owner password?
- [ ] What is the OpenID Token Enforcement policy? How is it different from the OAuth policy?
- [ ] Authentication vs authorization.
- [ ] What is the OAuth 2.0 dance?
- [ ] What is the JWT Validation policy? Why use it instead of validating with the authorization server?
- [ ] What is a JWT made of?
- [ ] Which APIs do you apply OAuth to?

**Error handling**

- [ ] Explain error handling in MuleSoft.
- [ ] How did you implement the global error handler?
- [ ] How do you manage business errors?
- [ ] On Error Continue vs On Error Propagate — single flow and parent/child flow.
- [ ] What happens if ANY is the first error handler?
- [ ] How do you raise errors without error components?
- [ ] How do you handle errors in a sub-flow?
- [ ] Continue after an error in For Each / Parallel For Each / a Scatter-Gather route.
- [ ] What error does Scatter-Gather raise? How do you know which route failed?
- [ ] Success status code validator vs On Error Continue.
- [ ] Reconnection strategy vs Until Successful.

**DataWeave**

- [ ] Rate yourself out of 10.
- [ ] What complex transformations have you written? What challenges have you faced?
- [ ] Explain flatten.
- [ ] Explain distinctBy (array and object).
- [ ] Remove a key-value pair from a JSON object.
- [ ] Explain splitBy / convert a string to an array.
- [ ] Explain lookup — sub-flow? Default timeout? Parameters?
- [ ] read and write functions — an example.
- [ ] Multipart form data?
- [ ] filter vs filterObject.
- [ ] Explain reduce — `$`, `$$`, initialized vs not.
- [ ] (Shown on screen) default, custom functions, skipNullOn, `p()`, isEmpty, DataWeave version.
