# Day 03 — APIs, Web Services, REST vs SOAP, Real-World Environments

## Session Agenda
- What are APIs? What are web services? (Two categories of web service: REST and SOAP)
- REST vs. SOAP — full comparison
- Real-time environments: Dev, QA/SIT, UAT, Pre-Prod, Prod, Disaster Recovery — what each one is for and why they exist

## API — Precise Definition, Restated and Expanded
- **API = Application Programming Interface.** Concretely: **a piece of code** — and since MuleSoft is drag-and-drop, that code is mostly **auto-generated XML** in the background, which is precisely why MuleSoft is called a **"low-code" tool** (you write comparatively little code by hand).
- Full working definition given: *"API is a piece of code that helps two or more different systems to communicate and exchange data with each other."*
- **API is a *type* of integration**, not something separate from it — integration is the broader umbrella (any program/software/tool connecting two or more applications, even something as simple as pulling Salesforce data and dumping it into a database with light transformation counts as integration). API is specifically the request/response-exposed subset of that broader category.
- **Why can't two systems (e.g. a mobile front-end and a database) just talk directly?** They "don't understand the language" — different technology stacks, different data shapes/protocols. The API sits as a **layer in between**, facilitating communication and exchanging data on both systems' behalf.

## Generic Analogy — The Restaurant, Fully Mapped
- Customer sits down → **Waiter** brings the menu → Customer places an **order** → Waiter relays the order to the **Kitchen/Chef** → Chef prepares it → Waiter collects it → Waiter **serves** it back to the customer.
- **Mapping**: Customer = front-end; Kitchen/Chef = back-end; **Waiter = API**, acting purely as a **mediator** between the two, neither of whom talk to each other directly.
- This maps directly onto the earlier mobile-app/database example: front-end (mobile app) → API → back-end (database), with the API doing exactly what the waiter does — relay the request, relay the response, translate as needed on both sides.

## Technical Walkthrough — Bank Balance Check, With the Actual Query Shown
```
Mobile App → "check balance" request → API
API → SELECT balance FROM accounts WHERE account_number = 1234 → Database
Database → returns raw value (e.g. Java object) → API
API → converts to JSON → Mobile App displays "₹50,000"
```
- The exact illustrative SQL given: `select account balance from balance check table where account number is equal to account number 1234`.
- **Format conversion happens on both legs**: the raw database response (often Java-format) is converted to JSON before being returned to the mobile app.
- **The key insight of this whole example — API is language-independent and reusable across client types**: the *same* API can serve an Android app, an iOS app, or a desktop/web net-banking application, each written in a completely different client-side language/framework. Without an API, you'd need to build a *separate, custom, direct-to-database integration* for each client type — the same request would need to be manually converted into whatever language each client individually needs, effectively **tripling the work**. The API absorbs all of that variability once, centrally.

## API vs. Web Service — the Exact Rule
> **All web services are APIs, but not all APIs are web services.**
- The distinguishing factor is purely the **network** the request travels over:
  - Travels over the **internet** → it's a **web service** (which is *also* an API).
  - Travels over a **private/internal (enterprise) network** → it's "just" an **API**, not a web service.
- **Analogy used**: an API "needs a vehicle" to actually deliver a request — just like a person needs *some* mode of transport (bike, car, bus, train, flight) to physically travel somewhere. That "vehicle," for an API, is the network. If the vehicle is the internet, you've built a web service; if it's a private network, you haven't.
- Directly addressed misconception: this distinction is purely about the **transport network**, not about the internal design of the API itself — the same API design principles and RAML process apply either way.

## Data Formats — JSON, XML, CSV (and where each actually shows up)
- REST APIs can technically accept **JSON, XML, HTML, and plain text**.
- **CSV and Excel formats are explicitly stated as rare in the instructor's real experience** — CSV/Excel usage tends to show up more around **file/FTP servers** and **scheduled batch jobs**, not typical live API request/response bodies. This is *why* CSV isn't a major course focus even though it's technically a "data format."
- **JSON is overwhelmingly the dominant choice** in real API work. **Why JSON over XML, shown with a concrete size comparison**: sending an account number in JSON is just `"accountNumber": "12345"` (effectively plain text) — sending the *same* data in XML requires an opening tag and a closing tag around it, making the payload physically heavier for identical information. Scaled up (a document with 10,000 words vs. 1,00,000 words), this difference compounds — **lighter payload = REST requiring fewer resources overall**, which is one of REST's core practical advantages.

## HTTP — First Formal Mention (full depth later, Day 06)
- REST APIs run over the **HTTP protocol** — Hypertext Transfer Protocol — explicitly named and spelled out. The example given: typing `www.google.com` resolves to `https://www.google.com` — visible proof that "the request is transferred by way of the HTTP protocol running over the internet."
- Explicitly flagged for deep coverage in **dedicated future sessions (3-4 of them)**: HTTP vs. HTTPS, HTTP methods, and HTTP response codes — described as foundational enough that skipping this understanding would leave you "building without a base," i.e. going through the motions without real confidence.

## Caching — Introduced Here for the First Time, With the Exact Worked Example
This is the same core idea that resurfaces later as the motivation for **Object Store** (Day 02's course-content preview) — introduced concretely here with a specific, fully worked scenario:

- **Scenario:** an HR-style request asks for all employees whose **resignation date was October 15th, [year]**. The underlying query: `SELECT * FROM employees WHERE designation_date = '15th October'` — returns, say, 5 specific employee IDs (example IDs given: 105, 106, 108, 109, 112).
- **The key question posed:** if this *exact same* request is sent again — say, 20 times in a day — should the API hit the database fresh all 20 times, or should it serve the answer from a **temporary cache** after the first lookup?
- **Why caching is safe here, explained precisely:** the cutoff date (Oct 15th, a specific past date) can **never produce a different answer** — no one can retroactively resign *before* a fixed past date that has already passed, so the set of employees matching that exact query is **permanently fixed**. This is explicitly contrasted with data that legitimately *can* change (which would make caching unsafe/wrong).
- **Where caching physically lives**: in a **cache memory location on whatever server the application is deployed to** — cloud server or on-premises server, the organization's choice (e.g. ICICI might choose on-premises; another company might choose cloud). Any running application/API process takes memory, uses it, completes its work, and returns — caching is simply *retaining* some of that processed result intentionally for reuse rather than discarding it and recomputing from scratch every time.
- **A second, more relatable caching example given**: web **browser caching** — visiting `www.google.com` repeatedly, images and infrequently-changing page elements are stored in the browser's cache rather than being re-fetched over the network every single time, since re-fetching an image takes measurably longer than reading it from a local cache.
- Explicitly deferred for deeper mechanism-level coverage to when **Object Store** is formally covered later in the course.

## REST — Full Definition and Characteristics
- **REST = REpresentational State Transfer.** REST is not itself a protocol — it's an architectural style that **uses HTTP as its underlying protocol** for transferring requests.
- **~99-100% of what's actually built in the MuleSoft ecosystem, in the instructor's stated real-world experience, is REST.**
- Accepts multiple data formats (JSON, XML, HTML, plain text) — though, as covered above, JSON dominates in practice.

## SOAP — Full Definition and Characteristics
- **SOAP = Simple Object Access Protocol.** Also a type of web service.
- **Design/specification language: WSDL** (Web Service Description Language) — the SOAP equivalent of RAML. A SOAP web service's WSDL defines resource details, request/response shapes, examples, and security schemes — conceptually parallel to what RAML does for REST, just a different specification language.
- **Only accepts XML** as both input and output format — no JSON, no plain text, no flexibility here, unlike REST's multi-format support.
- **Requires more bandwidth** than REST — a direct consequence of XML being inherently heavier than JSON for equivalent data (as shown in the size-comparison example above).
- **Caching is not practically possible with SOAP**, due to underlying technical/architectural constraints of the protocol — this is stated as one of the clear, concrete reasons SOAP has fallen out of favor for new development.
- **Why SOAP still exists / still matters for interviews**: SOAP predates REST as the dominant web-service style — **legacy systems** built before REST became the norm often still expose only SOAP endpoints. The course's stated approach: **you will learn to create *and* consume REST services, but for SOAP you will only learn to *consume* an already-existing SOAP service** — because in real projects, you're essentially never asked to build a brand-new SOAP service from scratch anymore; you're occasionally asked to integrate with someone else's old SOAP system.
- **Instructor's own candid disclosure**: personally has never designed a SOAP web service from scratch; has only *consumed* SOAP services "once or twice, and that was a long time ago" — not something encountered in the last 2-3 projects. This is offered as an honest, direct data point on just how rare new SOAP work has become in practice, and used to justify the course's deliberate consume-only focus for SOAP.

## REST vs. SOAP — Direct Comparison, and When to Choose Which

| | REST | SOAP |
|---|---|---|
| Flexibility | Flexible, easy to use, easy to learn | Rigid — XML-only |
| Data formats | JSON, XML, plain text, etc. | XML only |
| Resource usage | Lightweight, fewer resources needed | Heavier, more bandwidth |
| Scalability | Easily scalable (explicit example: an API handling **10,000 requests/day**) | Comparatively harder to scale |
| Caching | Supported | Not practically supported |
| Modern usage | ~99% of new/modern application development chooses REST | Reserved for very high-security scenarios |

- **Direct guidance on when to actually choose SOAP:** specifically when you need to design a **highly secure application** — SOAP's stricter structure suits scenarios demanding very tight security guarantees; otherwise, default to REST.
- A student directly asks whether "you have to know everything" (all protocols, e.g. SMTP, UDP). **The instructor's honest, explicitly stated position**: *"I don't have a rule to know everything... if someone teaches you, they are a little better than you in that subject, not in every aspect."* The instructor cannot explain, for instance, why SMTP or UDP are used — because it's genuinely outside what their own MuleSoft work requires — and frames this as a completely normal, honest limitation rather than something to be embarrassed about. The three protocols that *are* relevant and will be used (HTTP being the main one for REST) are the ones actually covered.

## Real-World Environments — Full Detailed Walkthrough With a Worked Example

The instructor walks a single hypothetical API (interacting with both a Database and Salesforce) through every environment stage, in order:

### 1. Development (Dev)
- Developer builds and does first-pass local testing in **Anypoint Studio**, on their own machine, before anything is deployed anywhere shared. If it looks like it's working, it's deployed to a shared **Dev environment** proper, where it can interact with a Dev-tier database and Dev-tier Salesforce org.

### 2. SIT / QA / Testing
- Full names given as interchangeable in practice: **System Integration Testing (SIT)**, **QA**, or simply **Testing** environment.
- **Why a separate, dedicated tester is genuinely necessary — explained precisely**: *"they do the testing as a critic"* — a developer's own testing tends to be surface-level ("did I get a response or an error, in general"), while a dedicated tester deliberately probes: does the error response look *exactly* right in every specific failure mode? What happens if a string is sent where a number is expected? Does *that specific* wrong-input scenario produce the *correct* specific error, not just *some* error? This adversarial, exhaustive mindset is explicitly what separates QA testing from a developer's own basic sanity check.
- **Why this environment needs its own isolated database/Salesforce/app server**: if, say, "Feature 1" and "Feature 2" share a live environment with other teams' work, testing Feature 1 could interfere with or be confused by unrelated data/activity from Feature 2's testing. Full isolation (own DB, own Salesforce sandbox, own app server) eliminates that cross-contamination risk entirely.

### 3. UAT (User Acceptance Testing)
- Yet another fully separate set of infrastructure (own app server, own database, own Salesforce sandbox).
- **Who tests here**: the **business team** and/or actual **clients** — not developers, not QA. They validate different real business use cases against the actual requirement, not just technical correctness.
- **The concrete deliverable of this stage**: once satisfied, they provide **formal sign-off**, which is the gate that allows the project to proceed to the next stage.

### 4. Performance Testing (in Pre-Prod)
- Determines, based on expected concurrent users over a given time window (per hour, half-hour, or across 24 hours), **how much memory/CPU the application actually needs** to meet functional and technical requirements under real load.
- **Dedicated performance testers** run this using specialized tools — **named explicitly: JMeter and LoadRunner** — and this responsibility sits entirely outside the developer's own role (the instructor is direct: *"we are not at all related to that; we would need to learn that tool separately"* if we ever wanted to do it ourselves).
- **Not universal**: whether performance testing happens at all "depends on the organization" and its expected traffic — if an application genuinely doesn't expect much load, some organizations skip this stage.
- **A concrete crash scenario given as the stakes of skipping this**: an API receiving, say, 500 requests/minute without adequate provisioned capacity will **crash automatically** — this stage exists specifically to catch that failure mode *before* it happens in production, by proactively sizing infrastructure correctly.

### 5. Production (Prod)
- Requires **sign-off communication** (typically via email in the instructor's stated experience) to the testing team and business/BA stakeholders confirming readiness, following successful performance testing.
- **A dedicated, separate deployment team** handles the actual production deployment, with all necessary **permissions and approvals** obtained beforehand.
- **Deployment timing — explicitly deliberate**: happens in **non-business hours**. Worked example: for a bank, business hours might be roughly 9 AM to 9 PM; back-end deployment activity is instead scheduled for something like **10 PM to 12 AM** (or similar off-peak windows), specifically to avoid disrupting live customer-facing operations.
- **How access is typically handled at this stage**: the deploying team may only be able to **guide** a designated non-business-hours operator through the actual deployment steps (rather than doing it themselves directly, depending on the organization's access model), then **observe and verify** the application afterward rather than being the one physically pushing the deploy button.

### 6. Disaster Recovery (DR)
- **Concrete scenario used to motivate this**: a bank like ICICI, with a global customer base, running its primary systems **on-premises** (its own servers) out of, say, a **Mumbai data center**. If that single data center goes down and takes **4 days** to recover, and customers can't be served for those 4 days, the resulting **business loss is severe**.
- **The DR solution**: maintain a **second, geographically separate data center** (example given: Hyderabad) holding a synchronized replica of the primary systems, so operations can fail over to it if the primary center goes down.
- **Explicitly framed as a cost decision**: running a full replica environment is **"a huge cost"** — servers are expensive, and a fully separate environment doubly so — which is precisely *why* DR is disproportionately common in **banks and large financial institutions** specifically, where the cost of extended downtime clearly outweighs the cost of maintaining a DR site, versus smaller organizations where that math may not hold.

### The Full List and Real-World Variation
- **Ideal/complete list of environments named explicitly, in order**: **Dev → SIT/QA/Testing → UAT → Pre-Prod (Performance) → Prod → DR** — six named stages.
- **Explicit reality check**: **not every company runs all six.** *"Ideally"* a company with strong requirements and sufficient financial backing runs the full set; in real practice, many companies operate with just **3-4 environments** — the most commonly cited minimal/practical set given being **Dev, Testing (SIT/QA), UAT, and Prod**. The exact number an organization maintains is purely a function of its specific requirements and budget, not a fixed rule everyone follows.
- **Why isolating environments' backend systems matters, restated directly**: each environment ideally uses its own dedicated app server, database, and Salesforce (or other system) instance specifically so that testing/activity in one environment can never corrupt or interfere with another team's work in a different environment.
- A concrete technique for improving performance is briefly mentioned in passing during this discussion: **caching** (reiterating the earlier concept) plus **removing unnecessary [processing/data]** — described as "3-4 different techniques" being generally sufficient, without listing all of them explicitly at this point in the transcript.

## Quick Recap
- **API vs. Web Service**: purely a network distinction (internet → web service; private network → plain API). All web services are APIs; not all APIs are web services.
- **Caching is safe exactly when the underlying data genuinely cannot change** — a fixed-past-date query is the textbook example; this exact instinct becomes the formal **Object Store** mechanism later in the course.
- **REST** (flexible, JSON-friendly, lightweight, scalable, cacheable, RAML-designed) is the default for ~99% of real, modern MuleSoft development. **SOAP** (XML-only, WSDL-designed, heavier, not cacheable) survives mainly in **legacy systems you'll consume, not build**.
- **Six named environments — Dev, SIT/QA, UAT, Pre-Prod (Performance), Prod, DR** — each with a distinct purpose and, ideally, its own fully isolated backend systems; real organizations typically run a pragmatic subset (often 3-4) based on their own budget and requirements, with **banks/financial institutions** being the clearest real-world case for investing in the full set, including DR.
