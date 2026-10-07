# Day 55 — Slides and On-Screen Drawings

Slides and screens from the Day 55 class (3 Feb 2025): what Jenkins and CI/CD are, the software needed (Java, Maven, Git, GitHub, Jenkins), downloading and setting them up, the mule-maven-plugin CloudHub snippet, and creating the GitHub repository and branch. Repeated and blank frames have been removed. Times are positions in the video.

Notes for this day: [detailed-notes/day55.md](../../detailed-notes/day55.md) · [super-detailed-notes/day55.md](../../super-detailed-notes/day55.md) · [summary](../../day55.md)

| # | Time | Content |
|---|---|---|
| 01 | 0:01 | Agenda: CI/CD pipeline deployment using Jenkins |
| 02 | 2:19 | What is Jenkins? — a popular open-source CI/CD (Continuous Integration / Continuous Deployment) tool known for its versatility and automation |
| 03 | 4:39 | CI/CD pipeline diagram — code commit → Git → Jenkins → build → test → stage → deploy → production |
| 04 | 10:57 | *Drawing:* Anypoint Studio (create project, develop logic, configure, transform, XML code) → GitHub → Jenkins → deploy to CloudHub |
| 05 | 20:55 | What is Continuous Integration? — developers frequently merge code changes into a shared repository; automated testing and early bug detection keep the codebase stable |
| 06 | 21:54 | What is Continuous Deployment? — any code change that passes all checks is automatically pushed live, minimising manual steps and speeding up updates |
| 07 | 22:27 | Software / platforms required — Anypoint Platform, Anypoint Studio, Java, Maven, GitHub, Git, Postman, Jenkins |
| 08 | 25:30 | Instructor's notes: download links (Java JDK, Maven 3.8.6, Jenkins, Git), `java -jar jenkins.war`, `--httpPort=8099`, and the mule-maven-plugin `cloudHubDeployment` snippet for pom.xml |
| 09 | 26:24 | TechSpot — Java SE JDK 11.0.25 download |
| 10 | 28:47 | Command prompt: `java -version` → java 11.0.21 LTS |
| 11 | 30:25 | Apache archive — Maven 3.8.6 binaries (apache-maven-3.8.6-bin.zip) |
| 12 | 32:40 | Windows Environment Variables — JAVA_HOME, MAVEN_HOME and the Path entries |
| 13 | 35:00 | Command prompt verifying the Java / Maven setup |
| 14 | 36:40 | jenkins.io — Download Jenkins 2.479.3 LTS / 2.495 weekly: Generic Java package (.war), Docker, Windows … |
| 15 | 39:15 | git-scm.com — Downloads (Windows 2.48.1) |
| 16 | 40:54 | GitHub — Create your free account (email, password, username) |
| 17 | 43:27 | GitHub — Verify your account (puzzle), then confirm the email code |
| 18 | 44:40 | GitHub dashboard after sign-up |
| 19 | 50:16 | Create a new repository — cicd-app-7303, description "this is a demo application or project used to demonstrate cicd deployment", Public/Private, add a README |
| 20 | 52:03 | Repository cicd-app-7303 created (main branch, README.md) |
| 21 | 53:42 | Branches → Create a branch (new branch from main) |

---

### 01 — Agenda: CI/CD pipeline deployment using Jenkins
![agenda](01-agenda.jpg)

### 02 — What is Jenkins? — a popular open-source CI/CD (Continuous Integration / Continuous Deployment) tool known for its versatility and automation
![what-is-jenkins](02-what-is-jenkins.jpg)

### 03 — CI/CD pipeline diagram — code commit → Git → Jenkins → build → test → stage → deploy → production
![cicd-pipeline](03-cicd-pipeline.jpg)

### 04 — *Drawing:* Anypoint Studio (create project, develop logic, configure, transform, XML code) → GitHub → Jenkins → deploy to CloudHub
![drawing-cicd-steps](04-drawing-cicd-steps.jpg)

### 05 — What is Continuous Integration? — developers frequently merge code changes into a shared repository; automated testing and early bug detection keep the codebase stable
![what-is-ci](05-what-is-ci.jpg)

### 06 — What is Continuous Deployment? — any code change that passes all checks is automatically pushed live, minimising manual steps and speeding up updates
![what-is-cd](06-what-is-cd.jpg)

### 07 — Software / platforms required — Anypoint Platform, Anypoint Studio, Java, Maven, GitHub, Git, Postman, Jenkins
![software-required](07-software-required.jpg)

### 08 — Instructor's notes: download links (Java JDK, Maven 3.8.6, Jenkins, Git), `java -jar jenkins.war`, `--httpPort=8099`, and the mule-maven-plugin `cloudHubDeployment` snippet for pom.xml
![download-links](08-download-links.jpg)

### 09 — TechSpot — Java SE JDK 11.0.25 download
![java-jdk-download](09-java-jdk-download.jpg)

### 10 — Command prompt: `java -version` → java 11.0.21 LTS
![java-version](10-java-version.jpg)

### 11 — Apache archive — Maven 3.8.6 binaries (apache-maven-3.8.6-bin.zip)
![maven-archive](11-maven-archive.jpg)

### 12 — Windows Environment Variables — JAVA_HOME, MAVEN_HOME and the Path entries
![env-variables](12-env-variables.jpg)

### 13 — Command prompt verifying the Java / Maven setup
![mvn-version](13-mvn-version.jpg)

### 14 — jenkins.io — Download Jenkins 2.479.3 LTS / 2.495 weekly: Generic Java package (.war), Docker, Windows …
![jenkins-download](14-jenkins-download.jpg)

### 15 — git-scm.com — Downloads (Windows 2.48.1)
![git-download](15-git-download.jpg)

### 16 — GitHub — Create your free account (email, password, username)
![github-signup](16-github-signup.jpg)

### 17 — GitHub — Verify your account (puzzle), then confirm the email code
![github-verify](17-github-verify.jpg)

### 18 — GitHub dashboard after sign-up
![github-dashboard](18-github-dashboard.jpg)

### 19 — Create a new repository — cicd-app-7303, description "this is a demo application or project used to demonstrate cicd deployment", Public/Private, add a README
![new-repository](19-new-repository.jpg)

### 20 — Repository cicd-app-7303 created (main branch, README.md)
![repo-created](20-repo-created.jpg)

### 21 — Branches → Create a branch (new branch from main)
![create-branch](21-create-branch.jpg)

