# Day 19 — CloudHub 2.0 Follow-Up and On-Premises Deployment with Mule Standalone Runtime; Domain Projects

## 1. Overview

1. Continuing the CloudHub 2.0 problem from Day 18 (binary payload) — redeploy, zero downtime, still unresolved
2. CloudHub 2.0: shared vs. private space, replica sizes
3. On-premises: what a **Mule runtime** is
4. Downloading the **Mule standalone runtime**; prerequisites
5. Runtime folder structure: `apps`, `bin`, `conf`, `domains`, `lib`, `logs`, `policies`, …
6. Passing properties via **`conf/wrapper.conf`**
7. **Domain projects** — shared configuration; only for on-premises
8. How developers access on-premises servers (remote desktop, tickets)
9. Live deployment: anchor file, logs, errors (missing property, duplicate wrapper index, port in use)

---

## 2. Follow-Up: The CloudHub 2.0 Binary Payload Problem

### 2.1 Recap

The weather app was built in Studio 7.12 (runtime 4.4) and deployed to CloudHub 2.0 on runtime 4.8. In CloudHub, the first logger (`payload.city`) didn't even print — the error happened right after the Listener. The payload arrived in **binary** format, so `payload.city` couldn't be read ("you called the function … expects one of these combinations").

**Instructor's reasoning:** lower versions normally work on higher runtimes (forward compatibility), but minor mismatches can cause issues like this.

### 2.2 What was tried

1. Upgraded the **HTTP connector** dependency in `pom.xml` to the latest (1.10.x).
2. Exported the JAR again.
3. **Redeploy:** Runtime Manager → application → **Settings** → choose the new JAR → **Apply changes**. Status shows "Applying configuration".

**Zero downtime:** during redeployment the existing version keeps serving requests; the new version replaces it without the app going down.

### 2.3 Result

**No change** — the payload still arrived in binary. The instructor suspected the Listener/runtime versions vs. the old Studio version (7.12) and planned to upgrade Studio (to 7.18). **Not resolved in this session.**

> **Instructor's observation:** in theory migrations are clear; practically there are many challenges. Colleagues who recently migrated to CloudHub 2.0 faced such issues too.

### 2.4 Another way to update connector versions

Right-click the project → **Properties → Mule Project → Modules**: modules with a **blue** symbol have newer versions; click **Update**. pom.xml is updated automatically (e.g. HTTP 1.10.3). Equivalent to editing pom.xml.

**Studio hung** while doing this. Instead of restarting the computer: **Task Manager** → end the **OpenJDK** process (Studio's Java process), then reopen Studio.

---

## 3. CloudHub 2.0 Details

### 3.1 Knowing the deployment target

In real projects you deploy through a **CI/CD pipeline**, so you may not know the target. Runtime Manager → Applications shows **Target type** (e.g. CloudHub 2.0) and **space**.

### 3.2 Shared space vs. private space

**Hotel analogy:** sharing a room with other guests (**shared space**) vs. booking a dedicated room (**private space**).

### 3.3 Replica sizes (instructor's observation)

| | CloudHub 1.0 | CloudHub 2.0 |
|---|---|---|
| Unit | Worker | Replica |
| Smallest size seen | 0.1 vCore = 500 MB | 0.1 vCore showed ~1.2 GB; a 0.05 option was also mentioned (maybe enterprise) |

Smaller fractions with more memory per fraction mean more applications per vCore in CloudHub 2.0. The trial account showed 0.1 as the minimum.

---

## 4. On-Premises — Mule Runtime

### 4.1 What you need

```text
Your server (in your data centre)
   ├── Java (and Maven, per the instructor)
   └── Mule runtime (standalone)
         ├── App 1 (JAR)
         ├── App 2 (JAR)
         └── …
```

> **Mule runtime** is the runtime engine that hosts and runs Mule applications — a **Mule application server**. You deploy apps on it and see their logs.

### 4.2 Many apps per runtime

- Unlike a CloudHub worker (one app), **one Mule runtime can host multiple applications**.
- A server can run more than one Mule runtime (e.g., 100 apps split across runtimes, 25 each).
- On your own servers, vCore fractions don't apply the same way — capacity is your server's.

---

## 5. Downloading the Standalone Runtime

1. On the MuleSoft download page choose **Mule runtime** (standalone), version (current or previous, e.g. 4.4.0, 3.9.x), OS (Windows/Linux/Mac), enter details (email), download — a ZIP of a few hundred MB.
2. **Extract** it. Rename the folder to something short (e.g. `mule-4.4.0`) and remove any double nesting — long paths cause problems.
3. The trial runtime runs for a limited period (about one month).

### Prerequisites

Check in Command Prompt:

```text
java -version      (instructor: Java 11)
mvn -version       (instructor: Maven 3.8.6)
```

If missing, download and install — the installers are straightforward.

> **Technical clarification:** the runtime itself needs a supported **JDK**. Maven is needed to *build* projects, not to *run* the runtime.

---

## 6. Runtime Folder Structure

```text
mule-4.4.0/
├── apps/          ← deploy applications (drop JAR here)
├── bin/           ← start/stop the runtime (mule.bat / mule)
├── conf/          ← wrapper.conf: runtime properties, memory
├── domains/       ← domain projects (shared configuration)
├── lib/           ← libraries (ignore)
├── logs/          ← system log + one log per application
├── policies/      ← downloaded API policies
├── services/, tools/ … (ignore)
```

### 6.1 `apps/`

Copy the application JAR into `apps` → the running runtime deploys it automatically. Empty initially.

### 6.2 `bin/`

The runtime must be **started** before apps can be deployed.

- Windows: double-click **`mule.bat`** (runs in a console; **Ctrl+C** stops it), or in Command Prompt from `bin`:

```text
mule start
mule stop
mule restart
```

(Commands are in MuleSoft documentation.)

### 6.3 `conf/wrapper.conf` — runtime properties

On CloudHub, `mule.env` and `secure.key` were entered in the deployment's Properties. On a standalone runtime they go in **`conf/wrapper.conf`**. Without them the deployment fails.

The file already has system entries like `wrapper.java.additional.12=…` — **don't change those**. Add yours:

```properties
wrapper.java.additional.20=-Dmule.env=prod
wrapper.java.additional.21=-Dsecure.key=<your key>
```

Rules:

- `-D` before the property name is **mandatory** syntax.
- The **number** must be **unique** in the file. Reusing an existing number confuses the runtime. If unsure, pick an obviously unused number (e.g. 50, 51).
- After editing, **restart the runtime** — changes aren't picked up while it's running.
- Memory settings can also be increased/decreased here.
- Edit with Notepad++.

### 6.4 `domains/`

Holds **domain projects** (§7). When the runtime starts, the `default` domain is deployed first, then applications.

### 6.5 `logs/`

| Log | Contents |
|---|---|
| `mule_ee.log` | **System-level** log for the whole runtime |
| `<application-name>.log` | One log **per application** |
| Domain log | For the domain project |

If 10 apps are deployed, there are 10 application logs plus the system log. When a deployment fails, the error appears in both the system log and the app's log.

Log file size/rotation is controlled in the app's `log4j2.xml` (e.g., roll over at 50 or 100 MB).

### 6.6 `policies/`

API policies applied to apps are downloaded here (covered with API Manager).

### 6.7 What you use most

**apps** (deploy) and **logs** (monitor). **bin** occasionally (start/restart). The runtime normally runs continuously.

---

## 7. Domain Projects

### 7.1 Problem

Five applications are deployed on the same runtime. Across them there are 10 connector configurations, of which 6 are identical (e.g. the same database). If the DB password changes, you'd update it in all five apps.

### 7.2 Solution

Create a **domain project** holding the shared configurations (connector configs, common port configuration). Each application **references** them.

```text
domains/
   my-domain   (DB config, Salesforce config, HTTP listener config …)
        ▲          ▲          ▲
apps/   app1       app2       app3   (reference the shared configs)
```

Change the password once in the domain project; all apps use the new value.

**Analogy — inheritance:** we inherit characteristics from our parents without doing anything. Apps inherit configurations from the domain.

### 7.3 Facts

- **Create:** File → New → **Mule Domain Project**.
- A domain project is **not** a normal project — it only provides shared configurations.
- **Deploy** it to the runtime's **`domains/`** folder (not `apps/`).
- Link an app to the domain in the app's project properties (**Properties → Mule Project → Domain**). The instructor opened this screen to show the setting but got side-tracked into updating module versions (§2.4), so the linking step itself wasn't demonstrated. Day 27 only recaps the concept.

### 7.4 Only for on-premises

> Domain projects work only where apps share a runtime — **on-premises**. Not CloudHub, not Runtime Fabric.

**Why:** CloudHub/RTF deploy each app in an isolated container/worker; there's no shared domain to get configurations from.

> **Technical clarification:** "on-premises" here means a customer-hosted standalone runtime — including runtimes registered in a hybrid setup.

---

## 8. How Developers Access On-Premises Servers

**Illustrative scenario:** you work in a Hyderabad office; the data centre with the Mule runtime servers is in Mumbai.

- Out of 100 servers in the data centre, MuleSoft developers get access only to the Mule servers (e.g. server 1 and 2). DB, Salesforce and other teams get their own.
- Access requires **raising a ticket** and getting **permissions and approvals**.
- Your laptop is in the **enterprise network**. Usually you connect to a **remote desktop / virtual machine** inside the enterprise network and work from there; from there you access the servers (e.g., to view logs or copy files).

If you hear an unfamiliar tool name on the job, think of it as just another software for the same purpose; the team will show you the process.

---

## 9. Live Deployment and Errors

### 9.1 Deploy

1. Start the runtime: `bin/mule.bat`.
2. Copy the JAR into `apps/`.
3. On success, an **anchor file** appears: `<app-name>-anchor.txt`.

> **No anchor file = not successfully deployed.**

The anchor file says: *"Delete this file while Mule is running to remove the artifact in a clean way."* Deleting it **undeploys** the app.

The JAR is expanded into a folder; a folder without an anchor file means deployment failed.

### 9.2 Error 1 — missing property

App log and `mule_ee.log`:

```text
Could not find configuration property value for key mule.env
```

**Cause:** wrapper.conf was edited, but the runtime wasn't restarted. **Fix:** restart.

### 9.3 Error 2 — still missing after restart

**Cause:** the new entry reused number **18**, which already existed. **Fix:** use unused numbers (20, 21), restart.

(A line that looked commented wasn't actually commented — check comments carefully.)

### 9.4 Error 3 — port already in use

```text
HTTP Listener config on port 8081 … Address already in use
```

**Cause:** the same app was also running in Studio on the laptop (port 8081). The laptop is acting as the standalone server, so both can't use 8081.

**House-number analogy:** a house number must be unique on a street. On a real server with 10 apps, each needs its own port. **Fix:** stop the Studio app (or use another port).

After stopping it: the anchor file was created → deployed.

### 9.5 Testing

Call `http://<server host>:<port>/<path>`. Here the laptop is the server → `localhost:8081/weather`. On a real server use its IP, e.g. `10.1.25.50:8081`.

### 9.6 Why these errors are useful

In real projects you'll hit exactly these: port conflicts, missing properties in wrapper.conf, duplicate entries. Having seen them, you can fix them.

---

## 10. Important Terminology

| Term | Meaning |
|---|---|
| Zero-downtime redeployment | Updating an app without stopping service |
| Shared space / private space | CloudHub 2.0 shared vs. dedicated infrastructure |
| Mule runtime (standalone) | Server software that hosts and runs Mule apps |
| `apps/` | Deployment folder |
| `bin/mule.bat`, `mule start/stop/restart` | Start/stop the runtime |
| `conf/wrapper.conf` | Runtime JVM properties (`wrapper.java.additional.N=-Dkey=value`) |
| Anchor file | `<app>-anchor.txt`; present = deployed; delete = undeploy |
| `mule_ee.log` | Runtime system log |
| Domain project | Shared configurations for apps on the same runtime |
| Remote desktop / VM | How developers reach enterprise servers |

---

## 11. Interview Questions

### Q1. How do you deploy to an on-premises (standalone) Mule runtime?
Start the runtime (`bin/mule`), copy the application JAR into `apps/`. An `<app>-anchor.txt` file confirms success.

### Q2. How do you pass properties like `mule.env` to a standalone runtime?
Add `wrapper.java.additional.<unique number>=-Dmule.env=<value>` to `conf/wrapper.conf` and restart.

### Q3. How do you undeploy an app on a standalone runtime?
Delete its anchor file while the runtime is running.

### Q4. Which logs does a standalone runtime produce?
A system log (`mule_ee.log`) and a log per application (and per domain).

### Q5. What is a domain project?
A special project holding configurations shared by multiple applications on the same runtime. Deployed in `domains/`; apps reference it, so a change is made once.

### Q6. Can domain projects be used on CloudHub or Runtime Fabric?
No — only where apps share a customer-hosted runtime (on-premises).

### Q7. Difference between a CloudHub worker and a standalone runtime regarding apps?
A worker runs one application; a standalone runtime can host many.

### Q8. What causes "Address already in use"?
Another application is already using that port on the same machine. Ports must be unique.

---

## 12. Must Remember

1. CloudHub 2.0 binary-payload issue: upgrading HTTP connector **didn't fix it**; suspected Studio/runtime version mismatch — **unresolved**.
2. Redeploy in Runtime Manager → Settings → new JAR → Apply (zero downtime).
3. Update connectors via **Project Properties → Mule Project → Modules** or pom.xml.
4. **Mule runtime** = Mule application server; one runtime hosts **many** apps.
5. Folders: **apps** (deploy), **bin** (start/stop), **conf** (wrapper.conf), **domains**, **logs**, **policies**.
6. `wrapper.java.additional.<N>=-Dkey=value` — `-D` required, **N unique**, **restart** after change.
7. **Anchor file** = deployed; delete it to undeploy.
8. Logs: `mule_ee.log` + one log per app.
9. **Domain project**: shared configs, deployed to `domains/`, **on-premises only**.
10. Errors seen: missing property (no restart), duplicate index, **port 8081 already in use**.
