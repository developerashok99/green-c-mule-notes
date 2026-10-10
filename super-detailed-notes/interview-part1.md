# Interview Preparation Part 1 — An Effective MuleSoft Résumé, Cover Letter, Self-Introduction, and Web Services / HTTP Q&A

> **Sources:**
> - Cleaned audio transcript ([transcripts-cleaned/interview-part1.txt](../transcripts-cleaned/interview-part1.txt)) and the class video (recorded 30 Mar 2024, ~140 min).
> - Text marked *screen* is read from the recording (the sample résumé in Word and the instructor's prep text files).
> - Slide images: [slides/interview-part1](../slides/interview-part1/).

## 1. Overview

1. Why the résumé comes first in a tough job market
2. Résumé header — name, contact, certification badge
3. Objective
4. Profile summary — every point and why it is there
5. Technical skills table
6. Achievements section
7. Professional experience and education
8. Projects — client, duration, domain, role, environments, team size, description, responsibilities
9. Recruiter calls, salary questions and package expectations
10. Cover letter
11. Naukri, LinkedIn and job-search habits
12. The three key questions — tell me about yourself, explain your project, roles and responsibilities
13. Web services Q&A — API, web service, REST, SOAP, REST vs SOAP, when to choose which
14. Query parameters vs URI parameters
15. HTTP methods; PUT vs PATCH vs POST
16. HTTP status codes
17. RAML question list (answered next class)
18. Must Remember
19. Interview-question checklist

---

## 2. Why Start With the Résumé

*Slide:* **Agenda for today** — components of an effective MuleSoft résumé and cover letter; MuleSoft interview Q&As discussion.

- Before scheduling an interview, the recruiter looks at your **résumé** and your **Naukri profile** first — the résumé is "the first weapon".
- After that they call you, ask some details and judge your **confidence**; only if both look good do they schedule the interview.
- When jobs are plentiful, almost any résumé with "MuleSoft" and 4–5 points gets calls.
- In a tough market (as at the time of the class) people struggle even to get calls, so the résumé must be very effective.
- Common mistakes: copy-pasting a résumé without knowing what should and should not be in it, and repeating the same points several times.
- The plan for the interview Q&A: go **topic by topic** (web services first, then RAML, …) rather than randomly, then prepare everything together for mock interviews.
- A panel interviewer checks all areas of MuleSoft — DataWeave, Studio, connectors, and so on.

*Screen:* the **MuleSoft Interview Preparation** folder — API Manager Interview Questions, Cover_Letter, Interview Prep Day1 deck, RAML deck, sample résumé (`Ramesh_Mulesoft_Resume.docx`), RAML Interview Questions, Tell Me About Yourself, Web Services Interview Questions.

---

## 3. Résumé Header

*Screen:* **Ramesh Kumar L**, mobile number, email ID, and a **MuleSoft Certified Developer** badge at the top.

| Item | What to do | Why |
|---|---|---|
| Full name, mobile, email | Put at the top | Standard — everyone knows this |
| Certifications | Put them **at the top** | If 40 of 100 candidates aren't certified, you're already ahead of them — but only if the recruiter sees it; nobody has time to search for it |
| Which certifications | Only **relevant** ones | Other integration tools (e.g. Boomi, Logic Apps) are fine; unrelated certifications are not |

---

## 4. Objective

*Screen:* "I am keenly interested in challenging assignments, which will enable me to sharpen my skills and make me competent enough to excel in Enterprise Integration Application design and development."

- Keep it a little interesting, not generic.
- It deliberately says **enterprise integration application** rather than "MuleSoft".
- Why: it shows you're open to Boomi or other integration projects — switching *within* the integration space, not out of it.
- MuleSoft is an **EAI** (Enterprise Application Integration) tool, which is why the wording fits.

---

## 5. Profile Summary — Point by Point

The profile summary should cover your **total and relevant experience**, your **technical expertise**, and your **soft skills** (communication, teamwork).

*Slide:* the Profile Summary with **"Mule ESB"** circled in the first point.

### 5.1 Experience

> "Have 5+ years of total experience in the Software industry, with 3+ years as a **Mule ESB developer** and two years as a **Mainframes developer**."

- Total experience and relevant experience are the most important things.
- Job sites (Naukri, LinkedIn) use **both** keywords — "Mule ESB developer" and "MuleSoft developer" — so use both across the résumé.
- State clearly how much is MuleSoft and how much is another technology.

### 5.2 Anypoint Platform components

> "I worked extensively on the MuleSoft platform including Anypoint Studio, Design Center, Exchange, API Manager, Runtime Manager, and Anypoint Monitoring."

- Uses "MuleSoft platform" (not Mule ESB) — a second keyword.
- Names every Anypoint component so that if the job description mentions any of them, the profile is shortlisted easily.
- Most résumés never mention Design Center, Exchange, API Manager or Runtime Manager — this puts you ahead.
- It also gives a "real", complete look to the profile.

### 5.3 REST and SOAP

> "I have a solid understanding of REST and SOAP web services architecture."

- With MuleSoft we mostly build **APIs and integrations**.
- The point claims **understanding**, not implementation.
- Expect the follow-up: when to choose REST and when SOAP (Section 13).
- 90–95% of the time you will develop REST APIs/integrations.

### 5.4 API life cycle

> "Actively involved in each phase of the API life cycle i.e., Gather Requirements, Design, Implementation, Test, Secure, Deploy, and Monitor."

- Go point by point — first the top level, then each MuleSoft module.

### 5.5 Designing, developing and managing REST APIs

> "Proficient in designing, developing, and managing REST APIs and integrations following best practices using the MuleSoft Anypoint Platform."

- Repeats the API life cycle from another angle, but specifically names **REST APIs**.
- Contains both keywords **MuleSoft** and **Anypoint Platform**.

### 5.6 Deployment strategies

> "Worked on various projects that involved deploying Mule applications using CloudHub, On-premises, and Hybrid deployment strategies."

- If you have RTF (Runtime Fabric) experience, you can add it.
- Only write what you're confident about — at least **50–60% knowledge** of anything you list; never list things "for namesake".
- The three strategies were covered in the course project, so you can answer questions on them.
- **CloudHub is listed first** because it's the most widely used — get the most exposure there.

### 5.7 API-led architecture

> "Hands-on experience in designing and implementing System, Process, and Experience layer APIs using API-led architecture."

- Tells the interviewer you know API-led architecture and can be asked about it.

### 5.8 RAML

> "Strong understanding of RESTful API design principles, and ability to create clear and concise API specifications using RAML."

- Slightly repeats the REST point, but adds the **RAML** keyword (job descriptions often ask for "strong understanding of RAML concepts").
- **Keyword variation:** whenever the same idea appears more than once, use different forms — "web services", "REST APIs", "RESTful API".

### 5.9 Data formats

> "Experience working with different data formats such as JSON, XML, and CSV."

- The three important formats; 80–90% of the time it's JSON.

### 5.10 Connectors

> "Hands-on experience in using Mule Connectors such as HTTP, Database, JMS, VM, FTP, File, SFTP, Salesforce, Web Service Consumer, etc."

- Similar connectors come in groups — learn one and you can handle the other:
  - **JMS ≈ VM**
  - **FTP ≈ File ≈ SFTP**
- **Web Service Consumer** shows you can consume SOAP services.
- These are exactly the connectors used in the course project — nothing extra.
- You must have a strong understanding of every connector you list.
- Asked about a connector you haven't used?
  - If you know it: say you did a POC but haven't used it in real time.
  - If you don't: say so plainly. Nobody knows 100%.

### 5.11 Components

> "Hands-on experience in using Mule components such as API Kit Router, Choice Router, Batch Processing, Scatter-Gather, For Each, Parallel For Each, Cache, Validation Modules, Error handlers, Object Store, and Scheduler."

- "Components" is used as a general word for components and scopes.
- Listing them tells the interviewer which areas to ask about.
- If asked about something else: say you lack experience but are **willing to explore, learn and apply it**.
- Why these: they're widely used and very important — the same ones the **MCD Level 1** exam asks about (Scatter-Gather, For Each, batch, error handling, Parallel For Each, APIkit Router).
- What was covered in the project classes is enough for the 3–5 year range.

### 5.12 DataWeave

> "Proficient in DataWeave programming language for data manipulation and transformation within Mule applications."

- An interview without DataWeave is incomplete.
- After 2–3 opening questions, interviewers usually ask you to **share your screen and solve 2–3 problems in the DataWeave Playground**.
- A simple point, presented powerfully.

### 5.13 Error handling

> "Proficient in robust error handling mechanisms in MuleSoft applications using Try-Scope, On-Error Continue/Propagate, and custom error handlers."

- Be ready to discuss error-handling strategies: **global, flow level, component level**, and the components involved.
- There will almost always be at least one or two error-handling questions.
- If you're not confident in a topic, skip the point.

*Slide:* the second page of the profile summary, each point ticked.

### 5.14 MUnit

> "Strong hands-on experience in recording and writing unit tests using MUnit to ensure the reliability and functionality of Mule applications and APIs."

- It simply says "I used MUnit", in powerful words.
- If you find it hard to word points, ask **ChatGPT or Gemini** for a point, then edit it — but spend time on it.

### 5.15 Policies

> "Proficient in creating and applying security policies to APIs, which include OAuth 2.0, Basic Auth, Client ID Enforcement, etc."

- You can also add **Rate Limiting** and **HTTP Caching** (both covered in class).
- Naming the policies keeps policy questions within those policies.
- For 3–5 years' experience it's acceptable to say you haven't worked on the others.
- Know Basic Auth, Client ID Enforcement, Rate Limiting and HTTP Caching thoroughly.

### 5.16 One-way / two-way TLS

> "Proficient in implementing one-way and two-way SSL (Mutual TLS) for secure communication channels within MuleSoft applications."

- Two-way SSL = **mutual TLS**.
- Most people don't mention it; it prepares you for keystore/truststore, "make your API HTTPS" and "enable two-way SSL" questions.

**How many points to keep:**

- This is an *ideal* résumé — you don't need every point.
- Include at least **70–80%** of them.
- Drop the ones you're weak in (e.g. TLS) and add them back once you're stronger.

### 5.17 CI/CD

> "Hands-on experience in using various CI/CD pipeline tools such as Jenkins, Bitbucket, GitHub, etc."

- Likely follow-up: "Have you created a pipeline?"
- Suggested honest answer: *"I don't have experience creating the pipeline; I have experience using it and debugging when my application fails in the pipeline. A separate DevOps team handled it. If I get the opportunity I'm ready to explore and learn."*
- Creating pipelines yourself is an added advantage, not the main one — but don't claim it if you can't answer questions on it.

### 5.18 Problem solving and debugging

> "Possess excellent problem-solving and debugging skills, which enable me to quickly identify and resolve issues in MuleSoft applications and APIs."

- **Problem solving:** analyze an issue or requirement and find a solution.
- **Debugging:** find which layer failed (experience / process / system), why it failed there, go through the logs, find the problem and fix it.

### 5.19 Documentation

> "Hands-on experience in creating and maintaining documentation for MuleSoft applications in Confluence."

- Confluence is like a Word document with extra features.
- Almost never asked (~99% of the time), but covers job descriptions that mention documentation skills.
- Answer if asked: "I used Confluence as the document management tool for the technical documentation of our APIs."

### 5.20 Stakeholder interaction

> "Extensively interacted with Team Managers, Leads, Business Analysts, QA Teams, and Clients to understand technical and functional requirements and provide system solutions to satisfy business needs."

- A student added **architects** too.
- "Extensively interacted" signals good communication and the ability to get things done across stakeholders.
- Integration work depends on other teams. Instructor's example: two configuration details (AWS S3 and another REST API) were pending for three weeks while everything else was ready.
- You need polite email follow-ups that become firmer if there's no response.

### 5.21 Communication and Agile

> "Strong communication and interpersonal skills, with the ability to communicate effectively with technical and non-technical stakeholders and to work collaboratively in an Agile team environment."

- Non-technical stakeholders = business teams and users (within the project, not HR).
- "Agile team environment" shows Agile project experience.

With these points the summary covers MuleSoft end to end — from requirements gathering to policies.

---

## 6. Technical Skills Table

*Slide:* the table on the résumé.

| Category | Skills |
|---|---|
| ESB Skills | Mule ESB, Design Center, Exchange, Runtime Manager, Anypoint Studio, API Manager, Anypoint Monitoring, RAML |
| Programming Skills | DataWeave Language |
| Web Services | REST, SOAP |
| RDBMS | Oracle, MySQL |
| Data Formats | JSON, XML, CSV |
| CI/CD Tools | Jenkins, Bitbucket, GitHub, Jira |
| Documentation | Confluence |

- Recruiters don't have time to read every point — a table gives the summary at a glance.
- **Why "ESB skills":** MuleSoft is an Enterprise Service Bus because it facilitates **orchestration, transformation and enrichment**.
- **RAML is under ESB skills, not programming**, because RAML is a **modeling language**, not a programming language.
- Every API life-cycle component appears in the table — don't miss any.

---

## 7. Achievements Section

*Slide:* Achievements.

1. "Implemented caching and parallel processing techniques to optimize data processing times, resulting in a **40% reduction** in processing times and improved application performance."
2. "Introduced MUnit recording for unit tests which were developed manually, resulting in a **20% reduction** in the development effort."
3. "Completed MuleSoft Certified Developer Level 1 certification."

- Most résumés don't have this section — it helps you stand out among the many who are MCD-certified.
- **Quantify** results: "40%", not just "improved processing time" — numbers always give a better impression.
  - 40% on a 1000 ms process means it now takes 600 ms.
- Example 1: a sequential process where parallel processing and caching could be applied.
- Example 2: a team writing MUnit tests by hand; you knew the **MUnit recorder** and ran 2–3 sessions for the team.
- **Have the explanation ready** — never keep a point you can't explain in detail.
- 2–3 achievements are enough.
- Team awards (e.g. star of the quarter) also belong here.
- Awards from another technology (a student asked about ABAP awards) are fine — but have MuleSoft ones too.

---

## 8. Professional Experience and Education

*Slide:* Software Engineer at XYZ company (January 2021 – date); Associate Software Engineer at ABC company (November 2018 – January 2021); Bachelor of Engineering, JNTU Hyderabad, 2015.

- Standard sections — nothing special to discuss.

---

## 9. Projects

### 9.1 Project header fields

*Slide:* **Project #1** — Client: ABC Bank · Duration: January 2022 – Date · Domain: Banking and Financial Services · Role: MuleSoft Developer · Environments: Dev, SIT, UAT, Prod, DR · Team Size: 10.

| Field | Why |
|---|---|
| **Client** | Comes first |
| **Duration** (from–to) | Project dates must match the professional-experience dates; mismatched dates show a lack of care. Writing them also prepares you for the question |
| **Domain** | The sector the project falls into (banking, retail, …) |
| **Role** | MuleSoft developer / senior / junior — specific to the project |
| **Environments** | Shows something others don't. **DR** (Disaster Recovery) is included because it's a banking project — DR is critical for banking and finance. If the interviewer asks about DR and you explain it well, it can tip the decision |
| **Team size** | Completes the picture |
| **Connectors** (optional) | Only the ones used in *this* project, with source and target systems — gives you clarity too |

### 9.2 Description

*Slide:* "ABC Bank collaborates with different partners such as Google Pay, Flipkart, Amazon, CRED, Ola, etc. to offer loans to the partners' customers. Loan products are of different types i.e. BNPL (Buy Now Pay Later), Personal Loans, Vehicle Loans. The Digital Lending project facilitates the integration capabilities to the partners for providing loans in a digital manner i.e. completely paperless."

- Not mandatory, but 3–4 lines help you stand out and give you clarity.
- Keep it short and high level (5–6 lines max); you can mention the policies used.

### 9.3 Responsibilities (Project #1)

*Slide:*

- Develop and maintain MuleSoft integrations connecting banking systems (external and internal partners, core banking, CRM).
- Write clean, well-documented code with error handling, logging and security.
- Work with testing teams on functional and non-functional requirements (performance, scalability).
- Implement security — OAuth2, Basic Authentication, Client ID Enforcement, encryption.
- Troubleshoot and resolve issues with other developers and stakeholders.
- Participate in code reviews and QA activities.
- Keep up with the latest MuleSoft releases and share knowledge with the team.
- Adhere to banking regulations and security standards.
- Communicate with project managers on progress and risks.
- Provide technical guidance and mentorship to junior developers.

**Notes from class:**

- Sharing what you learn from a new release makes a good impression on the team and the client.
- **Don't claim mentoring in your first project** — at the start of your MuleSoft journey you can't credibly guide juniors, and an interviewer will notice when your confidence doesn't match the claim.

### 9.4 Project #2

*Slide:* Client: XYZ · January 2021 – January 2022 · Domain: Retail · Role: MuleSoft Developer · Environments: Dev, SIT, UAT, Prod · Team Size: 3. Description: "a MuleSoft solution to connect a retail chain's loyalty program with point-of-sale systems. This enabled an automatic reward application for customers during checkout, improving the in-store promotional experience."

- Include **at least two MuleSoft projects** — don't stretch one project over 4–5 years.
- POS = point-of-sale systems, like card-swiping machines.
- New responsibility: **developed proofs of concept (POCs)** — done when there's no project work, for new clients, or to learn something new.
- Write the same kinds of responsibilities **in different words** — don't copy-paste between projects.
- **5–6 responsibilities** per project are enough.

### 9.5 Project #3 (non-MuleSoft) and declaration

*Slide:* Client: BCD Bank · November 2018 – December 2020 · Financial Services · Mainframes Developer · Dev, UAT, Prod · Team Size: 30. Declaration: "I hereby affirm that the information furnished above is true to the best of my knowledge and conscience." Place: Hyderabad.

- List the non-MuleSoft project too, with full details — don't leave it half-baked.

---

## 10. Recruiter Calls and Salary

- A better résumé might add 2–3 calls a month — that alone raises your chances.
- Recruiter calls follow the same pattern: total experience, relevant experience, a short "tell me about yourself", current package, expected package.
- **Don't give one-word answers.** Not "5 lakhs" but "I am receiving 5 LPA (lakhs per annum)."
- If English isn't comfortable: write answers to the common questions and practice them.
- Confidence on the call decides whether the recruiter schedules the interview — from 50 shortlisted résumés they pick by confidence.

**Package guidance (instructor's view at the time):**

- Rule of thumb: **years of experience × 2 to 4 lakhs per annum** (e.g. 3 years × 3 = 9 LPA if above average; ×4 = 12 LPA if very good).
- Early on, accept a lower salary if needed, learn the work for 1–2 years, then focus on packages.
- It depends on calibre: a top student with ~2.5 years got ~12–13 LPA; a colleague with 5 years got 25 LPA.
- Hikes in the then-current market: about **25–35%** on the current salary; 50–60% wasn't realistic.

---

## 11. Cover Letter

*Slide:* `Cover_Letter.txt`.

> Hi Shobha,
>
> I am writing to express my interest in the MuleSoft Developer position currently available with XYZABC company. With over 5+ years of overall experience, including 3+ years in MuleSoft development, I believe I would be an ideal candidate for this role.
>
> I have developed and implemented a variety of MuleSoft integrations and APIs for different clients across the Banking and Retail industries. My API design, development, testing, and deployment skills have helped me create efficient and reliable solutions. I am proficient in MuleSoft Anypoint Studio, API Manager, and Anypoint Monitoring, and have experience with MuleSoft versions 4.x.
>
> I have collaborated with cross-functional teams, including business analysts, architects, and project managers, to ensure successful project delivery. I have also provided technical guidance and training to junior developers, helping them to develop their MuleSoft skills.
>
> Please find my resume attached for your review. I look forward to discussing my qualifications further and learning more about this exciting opportunity.
>
> Sincerely,
> Ramesh Kumar L

- When you have a recruiter's email, don't just click Apply — **email your résumé with a cover letter**.
- Same structure for almost every opportunity, with small changes.
- Structure:
  1. Interest in the role, with total and MuleSoft experience — "I've seen your job description and I fit it".
  2. Technical skills.
  3. Non-technical skills.
  4. Résumé attached; closing.
- You can add Runtime Manager and other components to the tools line.
- Leave out the mentoring line if you aren't confident about it.
- **Subject line:** e.g. "Application for MuleSoft Developer – <your name>".
- **Change the recruiter's name every time** — don't send "Hi Shobha" to Ramesh.

---

## 12. Job-Search Habits

- **Find recruiter emails:**
  - LinkedIn — search "MuleSoft", check posts and the people posting MuleSoft jobs.
  - Naukri — also shows recruiter emails.
- In a tough market you must do more than others; in a good market a copy-pasted profile is enough.
- Instructor's interview example: of two 10-year profiles, one had no "appeal" — no variety of connectors, security mechanisms or projects — and was rejected in round 1.
- Recruiters look at a résumé for **1–2 minutes** — grab attention in that time.
- **Naukri:**
  - Fill every segment (certifications, language skills, …) and upload the résumé.
  - Update the profile daily — 2–3 times a day if possible; the algorithm favours recent updates.
  - A group can share one Naukri premium subscription and rotate it.
- **LinkedIn:** the first month of premium is free — use it only once you're fully prepared, and use it to message recruiters (it costs about ₹2,500–3,000/month after that).
- **No calls in MuleSoft?** Also post your profile for other technologies; but switching takes 3–6 months, so the instructor advises working harder on MuleSoft, applying widely and being active on LinkedIn, Naukri and your network.
- **Rejections without reason:** possible causes are a weak profile, **ghost recruitment** (jobs posted only to show presence in the market), or a client cancelling the requirement after round 1. Persistence and consistency are key — focus on effort, not results.
- **Entry-level jobs:**
  - Job portals — LinkedIn, Naukri, Monster, Indeed, Glassdoor.
  - Referrals.
  - MuleSoft-focused firms — Apisero (now NTT Data), Wishworks (now Coforge) — plus startups and small companies.
  - Fewer openings than Java/.NET, but don't compare unequal technologies.
- **Why fewer MuleSoft jobs than Java?** MuleSoft replaces only one part of Java's work (the API/integration part) — faster, but it's a costly tool that some clients can't afford.

---

## 13. The Three Key Opening Questions

*Slide:* `Tell Me About Yourself.txt`.

- The most underrated but most important questions — they **steer the interviewer along your path**.
- The three questions:
  1. **Tell me about yourself** (brief me about your experience).
  2. **Explain your project** (first and second project, at a high level).
  3. **Explain your current roles and responsibilities.**
- Recruiters also ask them sometimes, to avoid sending irrelevant candidates to the panel.
- A full answer lists your experience, components, connectors and projects — so the interviewer asks within those areas instead of combing your résumé.
- A thin answer ("I'm Mahesh, 5 years, 3 relevant, 2 projects, that's it") leaves the interviewer to go through every résumé point.
- Interviewers fill in a review sheet (15–30 min) with reasons for their decision, using details like total experience.
- **Spend up to a full day** preparing these answers.
- If these go well, the first 5–10 minutes are done, your confidence rises, and even for an unknown question you can say calmly "I don't know that; it would be good to learn about it".

### 13.1 Greeting and opening

- Greet by the **interviewer's** time of day — good morning / afternoon / evening (never "good night", even at 9 p.m.).
- An interviewer in the USA in their morning gets "good morning", even if it's evening for you.
- Spend 1–2 minutes on small talk (how was the day, a trending topic) if permitted; many interviewers start that way to make you comfortable.

### 13.2 What "tell me about yourself" must cover

1. Total experience
2. Relevant experience
3. Achievements — at least certifications
4. Kinds of projects and domains
5. Then "Coming to the recent project…" — describe it

This takes about 2–5 minutes.

### 13.3 Sample answer — Tell me about yourself

*Slide:*

> "Hi Rajesh, I am Ramesh Kumar. I have a total of 5 years of experience in the IT industry and 3+ years on Mule ESB. I am a certified MCD level 1 developer. I worked on 2 end to end implementations on MuleSoft, one is ABC Bank and the other one is XYZ Services. I am currently working on the 4.4 version of Mule runtime and the 7.12 version of Anypoint Studio. I have worked on various connectors such as http, file, FTP, SFTP, DB, VM, and JMS. I have good experience in components such as Foreach, Batch Process, Scatter-Gather, Object store, Async scope, Cache scope, Validation Modules, etc. Currently, I am following API-led architecture and involved in designing RAML on Design Center, implementing code in Anypoint studio, and writing Munits. Coming to the deployment models, we are following the CI/CD approach and I worked on CloudHub, On-premises, and Hybrid deployment strategies. I am using Postman for API testing, Bitbucket for code repository, and Jenkins for CI/CD deployment."

- "3+ years as a MuleSoft developer" works as well as "on Mule ESB".
- **MCD Level 2:** worth it if you're serious, but do it **honestly**, not from dumps. Level 1 is enough at this level.
- "**End-to-end implementations**" rather than "projects", because in MuleSoft a single API or application is also called a "project".
- You can add Salesforce to the connectors, and policies and error handling too.
- If you're **not confident about explaining your project**, stop at this general overview — it already covers connectors, components, deployment and tools.

### 13.4 Sample answer — Explain your project

*Slide:*

> "Coming to the recent project I have developed Transaction and Loyalty management. The purpose of this project is to update the backend Salesforce system whenever there is a transaction initiated by the customer. A scheduler-based integration will be invoked every day in the midnight to fetch all previous day transactions, calculate the points by using third-party loyalty points calculation API, and insert points in the database. Based on the points the customer can claim the coupons available in the system. Once the coupons are claimed successfully, the respective tables are updated in the database. API-led architecture is followed and implemented by Experience APIs, Process APIs, and System APIs. Seven different APIs and two integrations are designed and implemented to cater to this requirement. Two-way SSL and OAuth 2.0 are followed to secure the Experience API. HTTPS and Client ID enforcement are followed for internal communication between APIs. 80 percent Munit coverage is followed."

- Mentioning **API-led** invites API-led questions.
- Give the **actual** number of APIs and integrations — it gives the interviewer confidence.
- Security is described as **two-way SSL + OAuth 2.0** on the experience API, and **HTTPS + Client ID Enforcement** between internal APIs.
- Be ready for "source and target systems?" — source: the front end; targets: Salesforce and the database.
- Every component you mention ("batch processing") becomes a likely follow-up ("explain the scenario where you used batch").
- Well-prepared, this answer meets 60–80% of the interviewer's expectations for the introduction.

### 13.5 Sample answer — Current roles and responsibilities

*Slide:* the 11-step list.

1. A **Jira story** is assigned. Functional and technical design documents are attached; I go through them and discuss queries with the lead, architects, BAs and business team. The Jira status is updated as work progresses.
2. Once the requirement is clear, I **design the API specification in RAML** (Design Center) and take feedback from the business team; changes are made at the RAML level if needed.
   - New API: start from scratch.
   - Enhancement: add a new resource to the existing API in Design Center.
3. After business confirmation, I **import the spec into Anypoint Studio** (from Design Center or Exchange), which generates the APIkit Router flows, and implement the code.
4. After coding and local testing, I write **MUnits with 80% coverage**. Then **peer code review** (developers review each other's code) and **architect code review**; changes if required. The app is deployed and tested in **Dev**.
5. Deploy to **SIT** — the QA team tests and raises bugs; I fix them and they re-test, then give **sign-off**.
6. Deploy to **UAT** — business users test and give sign-off.
7. After **performance testing** (response time, can it handle more requests) and business approval, deploy to **production**.
8. Issues reported to production support are troubleshot. The initial support period after go-live is **hypercare** (15–30 days depending on the organization).
9. Enhancements to existing APIs follow the same process.
10. **Knowledge transfer** to the QA team, new team members and production support.
11. **Documentation** in Confluence.

- Remembering 5–6 of these and saying them confidently is enough.
- If this answer fails, interviewers often end there ("HR will get back to you").

---

## 14. Web Services Q&A

*Slide:* `Web Services Interview Questions.txt`.

These are rarely asked, but if you can't answer them the interviewer concludes your fundamentals are weak. The chain of understanding is: **API → web service → REST / SOAP → REST vs SOAP**. Two or three proper lines per answer are enough.

### 14.1 What is a web service? What is an API?

- **API** = Application Programming Interface — a piece of code that helps two (or more) different systems communicate and exchange data with each other.
- **Web service** = a piece of code that helps different systems communicate and exchange data **over the internet**.
- Two types of web services: **REST** and **SOAP**.
- The instructor's short distinction: API — without the internet; web service — with the internet.

### 14.2 What is a REST web service?

- REST stands for **Representational State Transfer**. (The slide wrote "Restful State transfer"; the class used "Representational".)
- Follows the **HTTP** protocol.
- Accepts **JSON, XML, HTML and text/plain** as inputs.
- Uses **RAML** for documentation — designed in **Design Center** of Anypoint Platform.
- The spec contains resources, request and response details, security schemes and documentation.

### 14.3 What is a SOAP web service?

- SOAP stands for **Simple Object Access Protocol**.
- An **XML-based protocol** that accepts **XML** data as input.
- Uses **WSDL** (Web Service Description Language) for documentation — contains resources, requests and response details.
- **Platform- and language-independent.**

### 14.4 Differences between REST and SOAP

| # | SOAP | REST |
|---|---|---|
| a | Simple Object Access Protocol | Representational State Transfer |
| b | A **protocol** | An **architectural pattern** |
| c | Uses **WSDL** to define the API | Uses **RAML** |
| d | Only **XML** | JSON, XML, HTML, plain text |
| e | Needs **more bandwidth** (XML is heavier — opening and closing tags) | Lighter; JSON is lightweight and human-readable |
| f | Cannot make use of REST | Can make use of SOAP or HTTP |
| g | Exposes business logic through **service interfaces** (the operations drop-down in Web Service Consumer) | Uses **URIs** |
| h | **Defines its own security** | **Inherits security from the underlying transport** layer |
| i | Less preferred because of its complexity | More popular |
| — | No caching | **Caching is possible** |

- Saying 3–4 of these points is enough. Start with the abbreviations — that buys time to recall the rest.
- Bandwidth analogy: a car with more luggage needs more power.

### 14.5 When to choose REST and when SOAP?

- **REST** — the more popular choice for modern web services due to its **simplicity and flexibility**; choose it for simple services and **whenever caching is required** (SOAP doesn't support caching).
- **SOAP** — remains relevant for specific use cases requiring **strong security and standardized communication**; choose it for complex implementations and highly secure applications.

---

## 15. Query Parameters vs URI Parameters

*Slide:* questions 6–8.

| | Query parameters | URI parameters |
|---|---|---|
| Purpose | **Filter, sort and paginate** the collection of a result | Identify a **unique instance** of a resource type |
| Where | At the **end of the URL after `?`** | **Inside the URL path** |
| Syntax | `/accounts?status=active` | `/{customerId}` (curly braces) |
| Example | All active accounts of a bank — filtering | Loan and account details of one customer by customer ID; employee with ID 100 |

- URI was expanded in class as **Unique Resource Identifier**.
- Rule: filter/sort/paginate → **query parameter**; one specific, uniquely identified resource → **URI parameter**.
- Keep one example ready for each.
- Even developers with 4–5 years of experience sometimes mix them up.

---

## 16. HTTP Methods

*Slide:* question 9.

| Method | Use | Status |
|---|---|---|
| **GET** | Fetch the available resources | 200 |
| **POST** | Create a new resource | 201 |
| **PUT** | **Completely** update a resource, or create it if it doesn't exist | |
| **PATCH** | **Partially** update a resource | |
| **DELETE** | Delete a resource | |

- These five are the most used; the instructor hasn't used other methods.
- "It is not mandatory to follow the same as specified but it is the best practice and widely followed. It will avoid confusion for the consumer of APIs."

### 16.1 PUT vs PATCH vs POST

- **POST** — create a completely new resource (none exists).
- **PUT** — if the resource exists, update it **completely**; if it doesn't, create it.
- **PATCH** — update a resource **partially**.

### 16.2 Student question: setting the status code without the HTTP Listener

- **Question (from a student's interview):** the client wants only a 500 status code and an error message, without configuring the HTTP Listener's error response — is there another way?
- **Answer given:** the response always carries an **HTTP status code** and a **reason phrase** (Postman shows e.g. "200 OK").
- If you define nothing, the **MuleSoft default error handler** sets both automatically.
- Whether another component can set the status code besides the HTTP Listener was left open — the instructor wasn't sure and no one in the class knew.

---

## 17. HTTP Status Codes

*Slide:* question 12 — "HTTP response codes are used to indicate the status of a request made to a server."

| Family | Meaning | Notes from class |
|---|---|---|
| **1xx** | Informational response | Never used by the instructor |
| **2xx** | Successful | |
| **3xx** | Redirection | When an old resource is discarded and you redirect to the new one; not used in practice |
| **4xx** | Client error | |
| **5xx** | Server error | |

| Code | Meaning | When (as explained in class) |
|---|---|---|
| **200 OK** | Request successful; server returned the data | Request fully processed with a response |
| **201 Created** | Request successful; new resource created | Response to POST (many projects still return 200, but know 201) |
| **204 No Content** | Successful, but no data to return | Fetch succeeded but there's nothing to send |
| **400 Bad Request** | Couldn't be understood, or required parameters missing | Request in an undesired format |
| **401 Unauthorized** | Needs authentication; user lacks valid credentials | Wrong credentials |
| **403 Forbidden** | Server understood the request, but the user isn't allowed to access the resource | Consumer has access to one resource but not another |
| **404 Not Found** | Resource not found on the server | |
| **405 Method Not Allowed** | | GET sent to a POST-only resource, or vice versa |
| **409 Conflict** | Request conflicts with the current state of the target resource | Creating a customer with a customer ID that already exists (duplicate) |
| **415 Unsupported Media Type** | | XML sent instead of JSON, CSV instead of JSON, etc. |
| **429 Too Many Requests** | Client exceeded the number of requests allowed in a period | **Rate Limiting** policy limit exceeded |
| **500 Internal Server Error** | Server hit an error while processing | Underlying system or database down |
| **501 Not Implemented** | Server doesn't support the functionality needed | |
| **502 Bad Gateway** | Gateway didn't get a response from the upstream server | The gateway is a separate server in front of the app server: it approves the request, forwards it, receives the response and returns it |
| **503 Service Unavailable** | Service currently unavailable | Application down / not running. Also seen locally when **Autodiscovery** is enabled — fix by disabling the Anypoint Platform gatekeeper property or commenting out the Autodiscovery ID |
| **504 Gateway Timeout** | Gateway/proxy didn't get a timely response from upstream | E.g. gateway expects a response in 300 ms and upstream is slower — like the HTTP Request's response timeout, configurable in the gateway |

- If asked "explain some status codes", 3–4 confident ones are enough — but know them all, because the interviewer may pick 409 or 429 directly.

---

## 18. RAML Question List (Answered in the Next Session)

*Slide:* `RAML Interview Questions.txt` — the list for the next session (Design Center / RAML, then API Manager).

Answers shown on the slide for the first two:

- **What is RAML?** "RAML stands for RESTful API Modeling Language. RAML is a YAML-based modeling language to describe RESTful APIs and design API Specification. We define requests, responses, schemas, examples, resources, methods, and security schemes in API Spec. The Design Center of Anypoint Platform supports RAML 1.0 and 0.8."
- **What is a trait?** "Traits are reusable components in RAML similar to functions, it allows you to declare common properties for HTTP methods."

Questions to prepare:

1. What is RAML?
2. What is a trait and how do we import a trait into root RAML?
3. What is a resource type and how do we call it in resources of root RAML?
4. What is a library and how do we import a library component into root RAML?
5. Difference between trait, resource type and library?
6. What is a fragment?
7. How do you maintain reusability, modularity and consistency in RAML?
8. What are data types?
9. How do you restrict or manage extra properties in the JSON object of RAML?
10. How do you define security policies in RAML?
11. Is there a way to restrict the number of properties in a JSON object of RAML?
12. How do you handle multiple request data types in RAML?
13. What is baseUri in RAML?
14. Which RAML version are you using? What is the latest version?
15. Have you worked on Swagger or OAS?
16. Is it possible to use the same HTTP method multiple times for a single request path?
17. What HTTP methods does RAML support?
18. How do you handle multiple data formats in RAML for the same request?
19. How do you share the API specification with internal and external stakeholders for testing?

- Next session: same time (10 to 1).
- Questions from students' past interviews on other topics were deferred so the large group stays on topic.

---

## 19. Must Remember

- The résumé and Naukri profile decide whether you get a call; confidence on the call decides whether you get an interview.
- Put **relevant certifications at the top**.
- Use **both keywords** — "Mule ESB developer" and "MuleSoft developer" — and name every **Anypoint component**.
- Vary keyword forms (web services / REST APIs / RESTful API) rather than repeating one phrase.
- Every listed connector, component, policy and tool **steers the interview** — only list what you can answer (≥50–60% knowledge); keep 70–80% of the ideal points.
- Similar connectors: JMS ≈ VM; File ≈ FTP ≈ SFTP.
- RAML goes under ESB skills — it's a **modeling** language, not programming.
- Achievements: quantified (40%, 20%) and explainable.
- Projects: client, matching dates, domain, role, environments (DR for banking), team size, short description, 5–6 reworded responsibilities; at least two MuleSoft projects.
- Don't claim mentoring in your first project.
- CI/CD: if you haven't built pipelines, say you use them and debug failures, and a DevOps team builds them.
- Cover letter: personalise the recruiter's name every time; clear subject line.
- **Tell me about yourself** = total → relevant → certification → projects/domains → connectors/components/architecture/deployment/tools → recent project.
- **Roles and responsibilities** = Jira → docs/queries → RAML + feedback → Studio implementation → MUnit 80% → peer & architect review → Dev → SIT → UAT → performance test → Prod → hypercare → KT → Confluence docs.
- REST = Representational State Transfer, HTTP, JSON/XML/HTML/text, RAML, caching possible.
- SOAP = Simple Object Access Protocol, XML only, WSDL, own security, more bandwidth.
- Query params filter/sort/paginate after `?`; URI params identify one unique resource with `{}`.
- POST creates; PUT fully updates or creates; PATCH partially updates.
- 401 = bad credentials; 403 = understood but not allowed; 409 = duplicate/conflict; 415 = wrong media type; 429 = rate limit exceeded; 502/504 = gateway problems; 503 = app down (or local Autodiscovery without gatekeeper disabled).

---

## 20. Interview-Question Checklist

**Opening (recruiter and panel)**

- [ ] What is your total experience? Relevant experience?
- [ ] Tell me about yourself / brief me about your experience.
- [ ] Explain your project (first and second).
- [ ] Explain your current roles and responsibilities.
- [ ] What are the source and target systems in your project?
- [ ] What is your current package? Expected package?
- [ ] Have you created a CI/CD pipeline?
- [ ] What is DR (disaster recovery)?

**Web services**

- [ ] What is an API? What is a web service?
- [ ] What is a REST web service?
- [ ] What is a SOAP web service?
- [ ] Differences between REST and SOAP.
- [ ] When to choose REST and when SOAP? (caching requirement → REST)

**Parameters and methods**

- [ ] What are query parameters? Example?
- [ ] What are URI parameters? Example?
- [ ] Difference between query and URI parameters — when to choose which?
- [ ] What HTTP methods have you used?
- [ ] PUT vs PATCH?
- [ ] POST vs PUT?

**Status codes**

- [ ] Explain some HTTP response codes (1xx–5xx families).
- [ ] 200 vs 201 vs 204.
- [ ] 400 vs 401 vs 403.
- [ ] What does 409 mean? 415? 405?
- [ ] Which code when the rate limit is exceeded? (429)
- [ ] 500 vs 501 vs 502 vs 503 vs 504.
- [ ] Why do you get 503 locally with Autodiscovery enabled?

**RAML (next session)**

- [ ] What is RAML? What is a trait?
- [ ] Resource types, libraries, fragments, data types — and the differences.
- [ ] Restricting extra properties; security in RAML; baseUri; RAML versions; Swagger/OAS.

**Also expect (from the résumé)**

- [ ] DataWeave problems in the Playground (screen share).
- [ ] Error-handling strategies — global, flow, component; Try scope; On Error Continue vs Propagate.
- [ ] Batch processing, Scatter-Gather, For Each / Parallel For Each, APIkit Router.
- [ ] Policies — Basic Auth, Client ID Enforcement, Rate Limiting, HTTP Caching, OAuth 2.0.
- [ ] One-way / two-way TLS — keystore, truststore, making an API HTTPS.
