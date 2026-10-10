# Interview Preparation Part 1 — Résumé, Cover Letter, Self-Introduction, and Web Services / HTTP Q&A

## Session Agenda
- Components of an effective MuleSoft **résumé** — header, objective, profile summary, skills table, achievements, projects
- Writing a **cover letter** for recruiter emails
- Recruiter calls, package questions, Naukri and LinkedIn habits
- The three opening questions: **tell me about yourself**, **explain your project**, **roles and responsibilities**
- Web services Q&A: API, web service, **REST vs SOAP**
- **Query vs URI parameters**, **HTTP methods**, **status codes**
- RAML question list for the next session

## Résumé
- Put relevant **certifications at the top** — recruiters won't search for them.
- Objective says "enterprise integration application design and development" — open to other integration tools, not only MuleSoft.
- Profile summary starts with **total vs relevant experience**, using both keywords **Mule ESB developer** and **MuleSoft developer**.
- Name every Anypoint component: Studio, Design Center, Exchange, API Manager, Runtime Manager, Monitoring.
- One point each for REST/SOAP, the API life cycle, deployment (CloudHub first), API-led, RAML, data formats, connectors, components, DataWeave, error handling, MUnit, policies, TLS, CI/CD, debugging, Confluence, stakeholders, Agile.
- Vary keyword forms (web services / REST APIs / RESTful API).
- Every listed item steers the interview — list only what you can answer; keep 70–80% of the ideal points.
- **Technical skills table** for quick reading; RAML goes under ESB skills because it's a modeling language.
- **Achievements**: quantified (40% faster processing, 20% less MUnit effort) and explainable.
- **Projects**: client, dates matching your experience, domain, role, environments (DR for banking), team size, short description, 5–6 reworded responsibilities.
- Include at least two MuleSoft projects; don't claim mentoring juniors in your first project.

## Cover Letter and Job Search
- Email the résumé with a four-part cover letter: interest + experience, technical skills, collaboration, résumé attached.
- Personalise the recruiter's name every time; use a clear subject line.
- On recruiter calls answer in full sentences ("I am receiving 5 LPA").
- Package guide given in class: years × 2–4 LPA; hikes of about 25–35%.
- Update Naukri daily; use LinkedIn's free premium month only once fully prepared.
- Ghost postings and cancelled requirements happen — stay persistent.

## The Three Opening Questions
- Greet by the interviewer's time of day; a minute of small talk is fine.
- **Tell me about yourself**: total → relevant experience → MCD → end-to-end implementations → runtime/Studio versions → connectors/components → API-led, RAML, MUnit → CI/CD and deployment → tools.
- **Explain your project**: Transaction and Loyalty Management — scheduler, loyalty API, Salesforce/DB, API-led, two-way SSL + OAuth 2.0, HTTPS + Client ID, 80% MUnit.
- **Roles and responsibilities**: Jira story → docs and queries → RAML + business feedback → Studio implementation → MUnit 80% → peer and architect review → Dev → SIT → UAT → performance test → Prod → hypercare → KT → Confluence.

## Web Services
- **API**: code that lets two or more systems communicate and exchange data.
- **Web service**: the same, over the internet; two types, REST and SOAP.
- **REST**: Representational State Transfer, HTTP, JSON/XML/HTML/text, RAML.
- **SOAP**: Simple Object Access Protocol, XML only, WSDL, platform- and language-independent.
- Differences: protocol vs architectural pattern, WSDL vs RAML, XML vs many formats, more vs less bandwidth, interfaces vs URIs, own security vs transport security, no caching vs caching.
- Choose **REST** for simplicity and caching, **SOAP** for strong security and standardized communication.

## Parameters, Methods and Status Codes
- **Query parameters** filter, sort and paginate — after `?` (`/accounts?status=active`).
- **URI parameters** identify one unique resource — in the path (`/{customerId}`).
- **GET** fetch (200), **POST** create (201), **PUT** full update or create, **PATCH** partial update, **DELETE** delete.
- Status families: 1xx informational, 2xx success, 3xx redirection, 4xx client error, 5xx server error.
- Key codes: 200, 201, 204, 400, 401, 403, 404, 405, 409 (duplicate), 415 (wrong media type), 429 (rate limit), 500, 501, 502/504 (gateway), 503 (app down, or local Autodiscovery without the gatekeeper disabled).

## Quick Recap
- The résumé gets the call; confidence on the call gets the interview.
- Résumé points are keywords for recruiters and signposts for interviewers — only list what you can defend.
- Prepare the three opening questions thoroughly; they set the direction of the interview.
- Know REST vs SOAP, query vs URI parameters, PUT/PATCH/POST and the common status codes cold.
- Next session: RAML and API Manager interview questions.
