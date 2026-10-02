# Day 20 — Hybrid Deployment, Registering a Server, MuleSoft Community and How to Troubleshoot

## 1. Overview

1. Recap: on-premises in practice
2. **Hybrid model** — what runs where
3. Connecting an on-premises runtime to the control plane: **register server → runtime agent → two-way SSL**
4. Live attempt to register a local runtime (certificate error — not resolved in this session)
5. Deploying and controlling applications on a hybrid server from Runtime Manager
6. Who gets access to start/stop apps
7. **MuleSoft community**: meetups, Help Center
8. How much of MuleSoft we actually learn
9. **How to troubleshoot**: read the error → search → community → colleague

---

## 2. Recap — On-Premises in Practice

On Day 19, apps were deployed directly to a standalone runtime and logs were read from its folders; no Runtime Manager was involved.

**Instructor's observation:** in on-premises setups seen in practice, people log in to the server, check logs in the runtime folders, and start/stop/restart there. (A fully self-hosted Anypoint Platform control plane is also possible, set up by the platform team, but usually it's direct server access.)

---

## 3. The Hybrid Model

> **Hybrid = on-premises runtime + MuleSoft-provided control plane.**

| Part | Where it lives | Provided by |
|---|---|---|
| Mule runtime (runtime plane): apps, code, connectors, logs | The client's own servers (e.g., ICICI data centre) | Client |
| Anypoint Platform (control plane): Runtime Manager, API Manager … | MuleSoft cloud | MuleSoft |

```text
MuleSoft cloud (control plane)                 ICICI data centre (runtime plane)
┌────────────────────────────┐                ┌───────────────────────────────┐
│ Runtime Manager            │  two-way SSL   │ Server                        │
│ API Manager                │◄──────────────►│   Mule runtime + Runtime Agent│
│ (start/stop/deploy/logs)   │                │   apps, connectors, logs      │
└────────────────────────────┘                └───────────────────────────────┘
```

**Difference from pure on-premises:** in on-premises you log in to the server for everything. In hybrid you can **start, stop and restart applications (and the server)** and **deploy** from **Runtime Manager**, while the apps still run on your servers.

---

## 4. Connecting the Runtime to the Control Plane

The runtime is on-premises and the control plane is in the cloud. How do they communicate?

### Step 1 — Register the server

Runtime Manager → **Servers** → **Add server** → give a name (e.g., `mule4`). Runtime Manager shows a **command** (with a registration token) to run from the server's `bin` directory.

### Step 2 — Install the Runtime Agent

Open a command prompt on the server in the runtime's `bin` folder and run the command. It installs the **Runtime Agent** in the Mule runtime.

The Runtime Agent **establishes the connection** between the runtime (runtime plane) and the control plane.

### Step 3 — Secure communication: two-way SSL

> Communication between Anypoint Management Center and the Mule agent is authorised using **two-way SSL**.

**Analogy (WhatsApp):** messages are encrypted when sent and decrypted on arrival so nobody in between can read them. Here, both sides authenticate each other and the communication is encrypted — the most secure way.

### Step 4 — Start the runtime

Once the runtime is started (`mule.bat`), the server shows **Running** in Runtime Manager, and start/stop/restart options appear there.

---

## 5. Live Attempt — Certificate Error (Unresolved)

The instructor registered the local runtime used on Day 19.

- Running the registration command printed:

```text
… going to create a keystore and request …
The certificate provided by the Anypoint Management Center is not valid.
Probably you are a victim of a man-in-the-middle attack. Contact support.
```

- The server appeared in Runtime Manager as **Created**, with only a **Delete** option — no start/stop — because the connection wasn't established.

**What was tried:**

1. Deleted the server, re-added it, ran the command again (a leading `./` had to be removed on Windows; a file "in use by another process" had to be dealt with).
2. Used a fresh runtime folder; then downloaded the latest runtime **4.8.1**, suspecting an incompatibility between 4.4.0 and the current Anypoint Management Center. The server was created, but the problem continued.
3. Checked **Java compatibility** in MuleSoft's official documentation: Mule 4.8 (Edge) supports **Java 8, 11 and 17**. The machine had Java 11 → not the cause.

**Instructor:** "I haven't faced this error before — this is the first time." Possibly related to version changes; to be checked and shown in extra sessions (Friday–Sunday). Studio 7.12 will also be upgraded.

**Instructor's habit:** keeps 2–3 lower versions of tools, because industry often uses older versions (e.g., Studio 7.12, runtime 4.5/4.6).

> Who does server registration in real projects? Usually **admins / DevOps / architects** set up environments; developers use them. If you get a chance to do it, take it.

---

## 6. Deploying to a Hybrid Server (Once Registered)

1. Runtime Manager → **Deploy application**.
2. **Deployment target:** choose **Hybrid** and select the registered server (instead of CloudHub 2.0).
3. Upload the JAR, give properties, etc. (same as CloudHub).
4. **Deploy:** Runtime Manager sends the JAR through the established channel to the registered server's Mule runtime; the runtime deploys it; status (e.g. Running) is reported back.

Afterwards, the application list shows the target as the **hybrid server name** and the status. **Logs** are checked from Runtime Manager too. **Stop / Start / Restart / Delete** work from Runtime Manager — that's why it's called hybrid.

### Who can start/stop apps?

Depends on company policy:

- **Lower environments** (Dev, Test, sometimes UAT): developers often get these options.
- **Higher environments** (Prod, DR): only the responsible teams (e.g., **production support**).

---

## 7. MuleSoft Community

### 7.1 Meetup groups

- **MuleSoft Meetup groups** exist by region and city (e.g., Asia → India → Ahmedabad, Bangalore, Goa, …).
- Joining, registering and attending are **free**.
- Online and offline events on many topics; experienced people (10–12 years overall, 4–5 years in MuleSoft) attend and ask quality questions.
- **Meetup leaders**: MuleSoft-enthusiast volunteers assigned by the MuleSoft community to run groups (organise events, bring speakers). You can apply.
- **Instructor's experience:** has spoken at 5–6 communities (e.g. a two-part session at the Goa meetup). Speaking increases credibility and knowledge.

**Advice:** join groups and attend events; once you know the subject, the discussions make more sense. After getting a job, consider speaking.

### 7.2 Help Center / forums

- Search an error (e.g., "port binding error") in MuleSoft's **Help Center** — experts and other developers answer.
- **Instructor's experience:** 60–70% of problems are solved this way. Sometimes the answer says a particular version has a known issue and gives a workaround.
- You can post your own question; multiple people answer.

**Instructor's view:** the strong community is one reason to learn MuleSoft — you are not alone. Official documentation, the Help site and meetups provide lots of information.

---

## 8. How Much of MuleSoft Do We Learn?

**Instructor's estimate:** their own command of the whole MuleSoft portfolio is maybe **20–30%**. MuleSoft has many more tools (e.g., **RPA** — Robotic Process Automation, **IDP** — Intelligent Document Processing).

But the concepts in this course are what's used **80–85% of the time** in real projects. The aim is to share the most useful 80–90% of what's needed day to day, not everything. Keep learning beyond the course.

---

## 9. How to Troubleshoot

> The more you practise, the more challenges you meet — and solving them builds experience.

```text
1. Read the error properly; check what it's connected to.
2. If not solved: copy the error and search Google / MuleSoft documentation / Help Center.
3. Apply the steps suggested in the answers.
4. If still not solved: post your question in the community.
5. Then ask colleagues who may have faced it.
```

- **Don't** go to a colleague before trying yourself — dependency keeps increasing.
- Following this approach, people new to IT can reduce dependence on others within 1–2 years and grow faster.
- **Official documentation** is powerful but takes time to understand at first; keep reading — it becomes easier.

---

## 10. Important Terminology

| Term | Meaning |
|---|---|
| Hybrid deployment | Own runtime servers + MuleSoft cloud control plane |
| Server registration | Adding an on-premises runtime to Runtime Manager |
| Runtime Agent | Software installed in the Mule runtime that connects it to the control plane |
| Two-way SSL | Mutual authentication with encrypted communication |
| Anypoint Management Center | Control-plane services (Runtime Manager, API Manager, …) |
| Production support | Team that manages production applications |
| MuleSoft Meetup | Free community user-group events |
| Meetup leader | Volunteer running a meetup group |
| Help Center | MuleSoft Q&A / knowledge site |
| RPA / IDP | Robotic Process Automation / Intelligent Document Processing |

---

## 11. Interview Questions

### Q1. What is the hybrid deployment model?
Applications run on Mule runtimes on the organisation's own servers, while they're managed from MuleSoft's cloud control plane (Runtime Manager, API Manager).

### Q2. How is an on-premises runtime connected to Runtime Manager?
Register the server in Runtime Manager (Servers → Add server), run the generated command in the runtime's `bin` directory to install the Runtime Agent, and start the runtime. Communication uses two-way SSL.

### Q3. What does the Runtime Agent do?
It connects the Mule runtime to the control plane so apps can be deployed, started, stopped and monitored from Runtime Manager.

### Q4. What's the advantage of hybrid over pure on-premises?
Central management through MuleSoft's control plane while keeping runtime, data and logs on your own infrastructure.

### Q5. How do you deploy to a hybrid server?
Runtime Manager → Deploy application → target = the registered server → upload the JAR → deploy.

### Q6. How do you approach an unfamiliar error?
Read it carefully, search documentation/Help Center/Google, apply suggested fixes, ask the community, then colleagues.

---

## 12. Must Remember

1. **Hybrid** = runtime on own servers + control plane in MuleSoft cloud.
2. Steps: **register server → install Runtime Agent (command in `bin`) → two-way SSL → start runtime**.
3. Then deploy/start/stop/restart/logs from **Runtime Manager**.
4. The live registration failed with a **certificate error**; Java 11 was confirmed compatible; **unresolved** here.
5. Mule 4.8 supports Java 8, 11, 17 (from documentation).
6. In Prod/DR, only responsible teams can start/stop apps.
7. **Meetups** are free; Help Center solves most issues.
8. The course covers the most-used ~80% of real work.
9. Troubleshoot: **read → search → community → colleague**.
10. Practising exposes you to the errors you'll see on the job.
