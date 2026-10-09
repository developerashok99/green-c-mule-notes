# Day 55 — CI/CD with Jenkins: Concepts, Software Setup and the GitHub Repository

## Session Agenda
- Why real projects deploy through a **CI/CD pipeline**
- **What is Jenkins**; CI and CD
- Code repositories — GitHub, Bitbucket, GitLab
- Software required — Java, Maven, Git, GitHub, Jenkins, Postman
- Creating the GitHub repository **cicd-app-7303** and a **develop** branch

## CI/CD and Jenkins
- So far we uploaded jars directly; in real time the **DevOps team** builds a pipeline.
- **Jenkins** is an open-source CI/CD tool (alternatives: Bamboo, AWS and Azure pipelines).
- Steps: **commit → build → test → stage → deploy**; a failed step stops the pipeline.
- Staging = dev, SIT, UAT; production is live for the public.
- **CI** — frequent merges with automated tests; **CD** — passing changes go live automatically.
- Pipelines may include static code analysis (SonarQube) with a threshold.

## Code Repositories
- A Studio project is ultimately **XML code**.
- Repositories give central save/share, collaboration and **version management** (roll back to version 1).
- **Git** moves code between local and remote; **Git Bash** runs git commands.

## Software Setup
- **Java 11** (TechSpot download; `java -version`).
- **Maven 3.8.6** — `MAVEN_HOME` + Path in **system** variables, restart, `mvn -v`.
- **Jenkins** Generic Java package `jenkins.war` — `java -jar jenkins.war` (8080) or `--httpPort=8899`.
- **Git** 2.48.1 for Windows.
- Versions must be compatible with Jenkins.

## GitHub
- Created a GitHub account.
- Repository **cicd-app-7303** — private, with a README, no .gitignore.
- Created a **develop** branch from **main**; branches can map to environments (develop/qa/main).
- In projects, DevOps creates repositories.

## Quick Recap
- Pipeline deployment replaces manual jar uploads.
- Jenkins needs Java + Maven.
- Code lives in GitHub; Git moves it.
- Next: clone the repository, push the Mule project, build the pipeline.
