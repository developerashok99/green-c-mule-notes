# Interview Preparation Part 2 — RAML, API Manager and Policies, OAuth 2.0 / JWT, Error Handling, and DataWeave Q&A

## Session Agenda
- The 19 **RAML** questions deferred from Part 1 — traits, resource types, libraries, fragments, data types, restrictions, baseUri, versions
- Sharing an API spec — Design Center share, mocking, **Exchange public portal** (demo)
- **API Manager** — Autodiscovery, API gateway, API proxy
- **Policies** — Basic Auth, Client ID Enforcement, HTTP Caching, Rate Limiting, Spike Control / throttling
- **OAuth 2.0** — the process, grant types, OpenID Token Enforcement, authentication vs authorization; **JWT Validation**
- **Error handling** — global handler, business errors, On Error Continue vs Propagate, Try scope patterns
- **DataWeave** — rating yourself, flatten, distinctBy, splitBy, lookup, read/write, filter, reduce

## RAML
- Start by expanding it: **RESTful API Modeling Language**, YAML-based, for designing the API spec.
- You use **RAML 1.0** (the latest); you have no exposure to 0.8.
- **Trait** = reusable method-level properties, applied with `is`.
- **Resource type** = template for resource-level properties, applied with `type`.
- **Library** = collection of data types, security schemes, traits and resource types — `uses:` plus dot notation.
- **Fragment** = reusable across any spec via Exchange, versionable, never an independent spec.
- Together they give readability, reusability, modularity and consistency.
- **Data types** describe and validate data. Built-in: string, number, integer, boolean, date/time. Custom types are built from them.
- Restrictions: `additionalProperties: false` (default true), `additionalItems: false`, `minProperties`/`maxProperties`, `minItems`/`maxItems`.
- Security schemes with `securedBy` — at root = all resources, at a resource = that one; the **resource level wins**.
- Multiple formats: list JSON and XML under `body`. Two structures: `jsonOne | jsonTwo`. Allow null: `string | nil`.
- `title` is mandatory. `baseUri` is optional (base URL + resource path).
- Swagger/OAS: "no, but ready to learn". No duplicate methods on one path.
- Share specs: internal → Design Center share; external → mocking + Postman collection, or publish to Exchange → Public → portal link.

## API Manager and Policies
- **API Manager** manages policies, alerts, clients and SLAs.
- **Autodiscovery** links the deployed app to its API Manager asset: Exchange → Manage API → ID → Studio global element on the **APIkit router flow** → Active.
- **API gateway** = one entry point for many APIs: traffic, security, request processing, response handling, monitoring.
- **API proxy** = for one API: translate, enforce policies, route.
- **Basic Auth** = same credentials for every consumer (less secure); **Client ID Enforcement** = a separate ID/secret per consumer (invalid → 401).
- **HTTP Caching** for responses that rarely change.
- **Rate Limiting** → **429** at the threshold; the SLA-based version sets per-consumer limits.
- **Spike Control / throttling** queues extra requests instead of rejecting them.

## OAuth 2.0 and JWT
- **OAuth 2.0** = Open Authorization — an authorization framework, not an authentication protocol.
- **Client credentials** = server-to-server; **authorization code** = sign-up through a third-party app; **resource owner password** = the user's own data on the client's server (less secure).
- **Scope** limits what the client may do (e.g. GET only).
- **OpenID Token Enforcement** = authentication + authorization; the OAuth policy = authorization only.
- Authentication (who you are) comes before authorization (what you may do).
- **JWT** = header.payload.signature.
- **JWT Validation** checks the signature with a cached JWKS key, then the claims — no call to the authorization server per request. Used on experience APIs.

## Error Handling
- **Levels:** Try scope (component), flow error handler (flow), global handler (project — Configuration → default error handler).
- **ANY** goes last — the handlers are checked in order.
- Raise business errors with **Raise Error** or the **Validation module**.
- **On Error Continue and On Error Propagate both stop the process.** Continue sends success to the next level; Propagate sends an error.
- **Try + On Error Continue** keeps going after errors in sub-flows, For Each, Parallel For Each and every Scatter-Gather route.
- Scatter-Gather otherwise raises **MULE:COMPOSITE_ROUTING**.
- **Reconnection strategy** = connectivity errors only; **Until Successful** = any error.

## DataWeave
- Rate yourself **7/10**; have 2–3 real medium-to-complex transformations ready.
- **flatten** = first level of sub-arrays only. **distinctBy** = unique values or key-value pairs. `payload - "key"` removes a key.
- **splitBy** turns a string into an array by regex.
- **lookup** calls a flow or private flow — not a sub-flow — default timeout 2000 ms.
- **read** parses a string (e.g. JSON stored as a string); **write** serializes a value (e.g. JSON into a DB column).
- **filter** (array → array) vs **filterObject** (object → object).
- **reduce**: `$` item, `$$` accumulator; for computing a value or turning an array into an object.

## Quick Recap
- RAML: expand the abbreviation, then trait/resource type/library/fragment, the restriction keywords, `securedBy`, `|` and `nil`.
- API Manager: Autodiscovery on the APIkit router flow; gateway (many APIs) vs proxy (one).
- Policies: Basic Auth vs Client ID, caching, 429 rate limiting, spike control queues.
- OAuth 2.0: three grant types and when to use each; authentication before authorization; JWT validated locally.
- Error handling: both handlers stop the process; Try + On Error Continue to keep going; ANY last.
- DataWeave: practice every function in the Playground; expect screen-share scripting.
