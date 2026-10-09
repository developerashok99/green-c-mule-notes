# Day 55 — CI/CD with Jenkins: Concepts, Required Software, and Creating the GitHub Repository

> **Sources:**
> - Cleaned audio transcript ([transcripts-cleaned/day55.txt](../transcripts-cleaned/day55.txt)) and the class video (recorded 3 Feb 2025).
> - Text marked *screen* or *drawing* is read from the recording.
> - Slide images: [slides/day55](../slides/day55/).

## 1. Overview

*Slide (agenda):* CI/CD pipeline deployment using Jenkins.

1. Why real projects deploy through a **CI/CD pipeline**, not by uploading a jar
2. **What is Jenkins**
3. The pipeline steps — commit → build → test → stage → deploy
4. A Studio project is **XML code**; why it goes into a **code repository** (GitHub, Bitbucket, GitLab)
5. **Staging environments** and static code analysis (SonarQube)
6. **Continuous Integration** and **Continuous Deployment**
7. Software required — Java, Maven, Git, GitHub, Jenkins, Postman
8. Installing **Java 11**, **Maven 3.8.6** + environment variables, downloading **Jenkins** and **Git**
9. Creating a **GitHub account**, the repository **cicd-app-7303**, and a **develop** branch
10. Next: Git, cloning and pushing the code

---

## 2. Why a CI/CD Pipeline

- So far we saw three deployment models — **CloudHub, on-premises, hybrid** — and in all of them we deployed the **jar directly**.
- In real time, deployment mostly happens through a **CI/CD pipeline**.
- The pipeline is developed by the **DevOps team**.
- A pipeline can have multiple steps.

---

## 3. What Is Jenkins?

*Slide:* a popular **open-source CI/CD** (Continuous Integration / Continuous Deployment) tool known for its versatility and automation.

- Automates the deployment process.
- A developer deploys to **Development** first; when it works, it goes to the next environment, and then the next — manually or automated.
- Each deployment has steps — **build**, run the **MUnits**, other checks, then **deploy**.
- You write these steps into a pipeline one by one; the pipeline runs them in order.

**CI/CD tools in use:**

| Tool | Note |
|---|---|
| **Jenkins** | Widely popular; open source — anyone can download and use it |
| **Bamboo** | Widely popular |
| AWS pipeline | AWS's own |
| Azure pipeline | Azure's own |

- What happens in the background differs by organization and tool.

---

## 4. The Pipeline Steps

*Slide:* code commit → Git → Jenkins → build → test → stage → deploy → production.

### 4.1 A Studio project is XML code

- In Studio you drag, drop, configure and write transformations — a visual view.
- The machine can't understand the visual view; **XML code** is generated.
- The configuration file has three tabs: **Message Flow**, **Global Elements**, **Configuration XML**.
- Ultimately, a project created in Studio **is XML code**.

*Drawing:* Anypoint Studio (create project, develop logic, configure, transform, XML code) → **GitHub** → **Jenkins** → deploy to **CloudHub**.

### 4.2 Why a code repository

- Code saved only locally is lost if the laptop crashes.
- **Remote / code repository tools:** **GitHub** (most popular), **Bitbucket**, **GitLab**; Azure has its own.

| Advantage | Example |
|---|---|
| **Save and share** in a central location | Developer 1 pushes project X1; developer 2 can access it |
| **Collaborate** | You build feature 1, a colleague builds feature 2 at the same time; merge conflicts are handled |
| **Version management** | Version 2 fails after deployment → retrieve version 1 from the repository and redeploy it until version 2 is fixed |

- In Studio, version 1 is **overwritten** by version 2; the repository keeps both.
- **Instructor:** "I don't remember whether AWS or GCP has version management, but Azure does."

### 4.3 What's in a project folder

Right-click the project → **Show In → System Explorer** (*shown on the flow-reference project*):

| Item | Note |
|---|---|
| `pom.xml` | Main file |
| `mule-artifact.json` | Main file |
| `.classpath`, `.settings`, `target` | Can be ignored |
| `src/main/java` | Empty — Java is very rarely used |
| `src/main/mule` | The flow XML files (the visual view) |
| `src/main/resources` | Application types, `log4j2.xml`, auto-generated DataWeave |
| `src/main/api` | Empty here |

### 4.4 Commit, build, test, stage, deploy

1. **Commit/push** the code to the repository.
2. **Build** the project.
3. **Test** it.
4. **Staging** environments.
5. **Deploy** to production (live).

**Staging environments:**

- The four environments: **dev, SIT, UAT, production**.
- Dev, SIT and UAT are **staging** — a bridge between initial development and final live.
- **Live** = production, used by the public (e.g. a feature in the Flipkart app). In UAT the public can't use it — it's still testing.

- The pipeline **automates or semi-automates** these steps — triggering them one by one like an orchestration, written like a script.

### 4.5 CloudHub deployment — before and with a pipeline

| Without pipeline | With Jenkins |
|---|---|
| Export the jar from Studio → Runtime Manager → Deploy application → upload | Push to GitHub → Jenkins **builds** → saves to a repository → **deploys to CloudHub** |

- Jenkins needs connections to **GitHub/Bitbucket**, a **repository**, and **CloudHub**.
- If a step fails (e.g. the build), the pipeline **stops** — the deployment fails.

### 4.6 Static code analysis

- Some pipelines first run tools like **SonarQube** (static code analyzers) on the code from the repository.
- They check best practices against a **threshold** (e.g. 60% or 70%).
- Below threshold → fails: "your code is not according to standard practices."
- The class builds a **simple** pipeline; organizations' pipelines may be more complex.

> **Instructor's suggestion:** know the minimum about DevOps and cloud. Be very strong in **MuleSoft** first; once you're a pro, dig deeper into these technologies.

---

## 5. Continuous Integration and Continuous Deployment

*Slide — CI:* developers frequently merge code changes into a shared repository; "this allows for automated testing and early detection of bugs to keep the codebase stable."

- Push a small change; if it fails to deploy, you know immediately there's a problem and can find the bug easily.

*Slide — CD:* any code change that passes all checks is automatically pushed live, minimising manual steps and speeding up updates.

- An automated release process — the change goes through all pipeline steps and goes live with minimal manual steps.

---

## 6. Software Required

*Slide:* Anypoint Platform, Anypoint Studio, Java, Maven, GitHub, Git, Postman, Jenkins.

| Software | Why |
|---|---|
| Anypoint Platform, Studio | Build the project and deploy |
| **Java** and **Maven** | **Jenkins** needs them installed on the system (Studio has them embedded) |
| **GitHub** | Remote code repository (create an account) |
| **Git** | Mediator between your local system and GitHub — **push** local → remote, or bring remote → local |
| **Postman** | Testing |
| **Jenkins** | The CI/CD tool |

- Use **compatible versions** of Java and Maven for your Jenkins version — otherwise it's very difficult.

*Screen (instructor's notes, `jenkins-pipeline.txt`):*

```text
LINKS FOR SOFTWARES DOWNLOAD:

JAVA: https://www.techspot.com/downloads/5553-java-jdk.html
MAVEN: https://archive.apache.org/dist/maven/maven-3/3.8.6/binaries/
JENKINS: https://www.jenkins.io/download/
GIT: https://git-scm.com/downloads

Command for running Jenkins on default port 8080: java -jar jenkins.war
Command for changing the port of Jenkins: java -jar jenkins.war --httpPort=8899

PLUGIN TO CHANGE IN POM.XML
```

```xml
<plugin>
<groupId>org.mule.tools.maven</groupId>
<artifactId>mule-maven-plugin</artifactId>
<version>${mule.maven.plugin.version}</version>
<extensions>true</extensions>
<configuration>
<cloudHubDeployment>
<uri>https://anypoint.mulesoft.com</uri>
<muleVersion>${mule.version}</muleVersion>
<username>${anypoint.username}</username>
<password>${anypoint.password}</password>
…
```

- The pom.xml plugin was only shown in the notes today; it's used in the following sessions.

---

## 7. Installing Java 11

*Screen:* TechSpot — Java SE JDK 11.0.25 download.

- TechSpot is used because Oracle (Java's owner) requires creating an account; TechSpot has a direct download.
- Download the JDK **11** exe → double-click → next, next, finish.
- Not an admin? Right-click → **Run as administrator** (asks for admin credentials).

*Screen:* `java -version` → **java 11.0.21 LTS**.

**Java versions and MuleSoft:**

- Latest Java is "almost in the 20s"; stable versions are used more.
- MuleSoft: was **1.8**, then **11**, now **17** — especially on **CloudHub 2.0**; apps must become 17-compatible.
- Java 11 is used here for **Jenkins compatibility**.

**Uninstalling a Java version:** Control Panel → Programs and Features → find Java → right-click → **Uninstall**.

---

## 8. Installing Maven 3.8.6

*Screen:* Apache archive — Maven 3.8.6 binaries (`apache-maven-3.8.6-bin.zip`).

1. Download the **bin** zip for 3.8.6.
2. Extract it — the `apache-maven-3.8.6` folder has a `bin` folder.
3. Place it in a software folder — *in class:* `D:\Softwares\apache-maven-3.8.6`.

### 8.1 Environment variables

*Screen:* Windows Environment Variables — JAVA_HOME, MAVEN_HOME and the Path entries.

Windows search → **Edit the system environment variables** → **Environment Variables**.

| Variable type | Scope |
|---|---|
| User variables | Only your user (configured for Mahesh1 → doesn't work for Mahesh2) |
| **System variables** | The whole system — use these |

1. New system variable **`MAVEN_HOME`** = `D:\Softwares\apache-maven-3.8.6`.
2. Edit **`Path`** → **New** → the Maven **bin** folder.
3. **Restart** the system (Java works without a restart; Maven needs one).
4. Verify: **`mvn -v`**.

*Screen:* command prompt verifying the Java / Maven setup.

---

## 9. Jenkins and Git Downloads

### 9.1 Jenkins

*Screen:* jenkins.io — Download Jenkins **2.479.3 LTS** / **2.495 weekly**: Generic Java package (.war), Docker, Windows ….

- Options for Windows, Linux and other servers.
- Class choice: the **Generic Java package (.war)** → `jenkins.war`.

### 9.2 Git

*Screen:* git-scm.com — Downloads (Windows **2.48.1**).

- Download for Windows → run the exe → next … finish.
- After installing, right-click → **Show more options → Git Bash**. Without Git, that option doesn't appear.
- Git Bash is a command prompt for **git commands** — communication between local and the code repository.

---

## 10. GitHub Account, Repository and Branch

### 10.1 Account

*Screen:* GitHub — Create your free account (email, password, username).

1. Email (*in class:* `mcp2925119@gmail.com`), password, username.
2. GitHub warned "Password may be compromised — it is in a list of passwords commonly used" → made it longer.
3. *Screen:* Verify your account (puzzle), then confirm the email code.
4. *Screen:* the dashboard.

- GitHub stores **any** code — Java, Salesforce, anything — not just Mule projects.

### 10.2 What a repository is

- A **repository** = a place to store something.
- **Remote** because it's on remote servers, not your local machine.
- Create one repository **per project**, named like the API — e.g. `hr-employees-sys-api`.
- In projects, the **DevOps team** creates repositories — so names don't conflict and follow the naming standard.

### 10.3 Create repository

*Screen:* Create a new repository — **cicd-app-7303**, description *"this is a demo application or project used to demonstrate cicd deployment"*, Public/Private, add a README.

| Option | Class choice / explanation |
|---|---|
| Public / **Private** | Organizations use **private** — visible only to the organization |
| **Add a README** | Ticked — a file for documentation, rules, restrictions |
| **Add .gitignore** | Left out — lists files Git should **not** push (e.g. 3 of 10 files) |
| License | Left as is |

→ **Create repository**.

*Screen:* repository cicd-app-7303 created — **main** branch, README.md.

### 10.4 Branches

- Some organizations use a branch per environment:

| Branch | Environment |
|---|---|
| `develop` | Dev |
| `qa` | SIT |
| `master` / `main` | Production code |

*Screen:* Branches → **Create a branch** (new branch from main).

1. Branch dropdown → **View all branches** → **New branch**.
2. Name **`develop`**, source **main** → **Create new branch**.
3. Two branches now; `develop` contains just the README.

> **Instructor's view:** project details are usually not documented in the README; a file is just included.

---

## 11. Next Session

- Bring the remote repository to local with **Git**, and **push** the locally developed code into it.
- Then build the Jenkins pipeline.

---

## 12. Important Terminology

| Term | Meaning |
|---|---|
| CI/CD | Continuous Integration / Continuous Delivery or Deployment |
| Pipeline | Ordered, automated steps (build, test, deploy …) |
| Jenkins | Open-source CI/CD tool |
| Bamboo | Another popular CI/CD tool |
| Code / remote repository | Central store for code (GitHub, Bitbucket, GitLab) |
| Git | Tool that moves code between local and the remote repository |
| Git Bash | Command prompt for git commands |
| Push | Send local changes to the remote repository |
| Branch | A separate line of code in a repository (main, develop …) |
| README | Documentation file in a repository |
| `.gitignore` | List of files Git should not push |
| Staging environment | Dev, SIT, UAT — between development and production |
| SonarQube | Static code analysis tool with a quality threshold |
| `MAVEN_HOME` / Path | Environment variables so `mvn` works from the command prompt |
| `jenkins.war` | Generic Java package of Jenkins, run with `java -jar` |

---

## 13. Interview Questions

### Q1. What is CI/CD?
Continuous Integration — developers frequently merge code into a shared repository, with automated builds/tests catching bugs early. Continuous Deployment — any change passing all checks is automatically released, with minimal manual steps.

### Q2. How are Mule apps deployed in real projects?
Through a CI/CD pipeline (e.g. Jenkins) built by DevOps: code pushed to GitHub/Bitbucket → build → test → deploy to CloudHub — not by uploading a jar by hand.

### Q3. Why use a code repository like GitHub?
To save and share code centrally, collaborate with other developers (merging features), and manage versions — e.g. roll back to version 1 if version 2 fails.

### Q4. What does Jenkins need installed?
Java and Maven in versions compatible with the Jenkins version (Studio's embedded ones aren't used).

### Q5. What is a staging environment?
Dev, SIT and UAT — environments between development and production where the public can't use the feature yet.

### Q6. What is `.gitignore`?
A file listing files Git should not push to the remote repository.

### Q7. What is static code analysis in a pipeline?
A step (e.g. SonarQube) that checks code against best practices and a threshold; if the code falls short, the pipeline fails.

---

## 14. Must Remember

1. Real deployments go through a **CI/CD pipeline** built by **DevOps**.
2. **Jenkins** = open-source CI/CD tool; Bamboo, AWS and Azure pipelines are alternatives.
3. Pipeline: **commit → build → test → stage → deploy**; a failed step stops it.
4. A Studio project is **XML code** — store it in **GitHub / Bitbucket / GitLab**.
5. Repositories give sharing, collaboration and **version management**.
6. **Git** moves code between local and remote; **Git Bash** runs git commands.
7. Jenkins needs **Java and Maven** in compatible versions — Java 11, Maven 3.8.6 in class.
8. **`MAVEN_HOME`** + Maven `bin` on **Path** (system variables), restart, `mvn -v`.
9. `java -jar jenkins.war` runs on 8080; `--httpPort=8899` changes the port.
10. Repositories are usually **private** and created by DevOps; branches like `develop`, `qa`, `main`.
