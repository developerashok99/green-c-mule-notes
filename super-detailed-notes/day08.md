# Day 08 — Mule 4 Project Structure, Maven, pom.xml and Flow Anatomy

## 1. Overview

Two projects have been built so far (Hello World and the employee-details DB app), but the generated files and folders were ignored. This session explains them.

1. Why a project structure is created automatically (Maven)
2. Each folder: `src/main/mule`, `src/main/java`, `src/main/resources`, `src/test/java`, `src/test/munit`, `src/test/resources`
3. Multiple XML files, multiple flows, Flow Reference
4. Libraries shown in Studio: modules, JRE, Mule server; `target/`; `mule-artifact.json`
5. **pom.xml** in detail: identity, properties, build plugins, dependencies, repositories
6. The three tabs of a configuration XML: Message Flow, Global Elements, Configuration XML
7. Flow anatomy: **Source, Process, Error handling**

Studio basics (export/import/open/close/delete, workspaces) are covered next session.

---

## 2. Who Creates the Structure? Maven

- **File → New → Mule Project → name → Finish** creates folders and files automatically.
- Anypoint Studio is built on Java. **Maven** — a project management and build tool — is embedded in Studio and creates this structure in the background.
- A **minimum project structure** is always created. After that, you add what you need or remove what you don't.

> **A Mule 4 project is a Maven project.** Maven expects files in fixed places, so it can find them and build the deployable file.

### Seeing it on disk

Right-click the project → **Show In → System Explorer**. This opens the **workspace** folder — the folder where Studio stores all your projects. Inside each project you see `src/main/mule/…` and so on.

---

## 3. The Project Structure

```text
hello-world-demo-app/                 ← project root
├── src/
│   ├── main/
│   │   ├── mule/                     ← configuration XML files (flows)    ★
│   │   ├── java/                     ← custom Java code (rare)
│   │   └── resources/                ← properties, API spec, log4j2.xml   ★
│   │       ├── api/
│   │       ├── application-types.xml
│   │       └── log4j2.xml
│   └── test/
│       ├── java/                     ← JUnit tests (not used)
│       ├── munit/                    ← MUnit tests                          ★
│       └── resources/                ← resources for MUnit tests
├── target/                           ← build output (JAR)
├── mule-artifact.json                ← Mule runtime version
└── pom.xml                           ← Maven Project Object Model           ★
```

(The project may also be called application or API, depending on context.)

### 3.1 `src/main/mule` — the main Mule code

- `src` = source, `main` = main (the word itself), `mule` = Mule files.
- Holds **all main project information**: the configuration XML files containing flows, connector configurations and error handling.
- When a project is created, **one empty XML file** is generated. Dragging components into it generates a **flow**.
- In the Hello World app, the flow (Listener → Set Payload "Hello World" → Logger) is in this folder.

**Creating another XML file:** right-click → **New → Mule Configuration File** → select the project → name (e.g. `test`) → Finish → `test.xml` appears in `src/main/mule`.

**Rules:**

- A project can have **multiple XML files** — in real projects this is guaranteed; files are added with specific purposes (seen when a full use case is built).
- An XML file can have **multiple flows**.
- If you open any project, `src/main/mule` immediately shows the main logic.

### 3.2 `src/main/java` — custom Java (rare)

Empty by default. Used when:

1. you must connect to a system for which **no connector** exists — write the connection in Java, or
2. something **cannot be done** with Mule components/DataWeave — write small Java logic and call it from the flow.

**Instructor's experience:** very rare. They have never used it themselves and don't know Java. In one project a Java developer was brought into the team, given the requirement, and their code was used.

**Instructor's view on Java:** if 10 jobs exist, maybe 2–3 require Mule + Java; the other 7–8 don't. People without Java apply to those. Even when a Java need comes up, usually a team member or a senior handles it. If someone asks whether you know Java, it's fine to say no.

### 3.3 `src/main/resources` — resources for the main project

Automatically contains:

| File/Folder | Purpose |
|---|---|
| `log4j2.xml` | Logging configuration |
| `application-types.xml` | Used by the system; we don't touch it |
| `api/` | Where an imported API specification (RAML) is placed |

**Why log4j2?** MuleSoft is built on **Spring**, which is built on **Java**. The standard Java logging framework **Log4j2** is used in the background. `log4j2.xml` defines how logs are printed, log file names, and which log levels are printed. Studied later.

**`api/` folder:** the API specification designed in Design Center is imported here (or referenced as a JAR dependency — the second way is shown later).

**Most important use — property files:**

- Different environments use different databases (Dev DB, UAT DB, Prod DB).
- If Dev DB details were hard-coded, deploying to production would still connect to the Dev DB.
- Solution: **one property file per environment** (dev, UAT, prod) in `src/main/resources`. When deploying to an environment, the app reads that environment's file and connects to the right host/port.

Other resources go here too, e.g. **certificates**, DataWeave files you want to reference.

> Whatever the main project needs to run, `src/main/resources` supplies it.

### 3.4 `src/test/java` and `src/test/munit`

- **MUnit** — MuleSoft's unit-testing framework. Writing unit tests is the **developer's responsibility**.
- **JUnit** — Java unit tests.

| Folder | Holds | Used? |
|---|---|---|
| `src/test/java` | JUnit (Java) tests | Almost never ("99% not useful") |
| `src/test/munit` | MUnit tests | Yes — created when you write MUnits |

### 3.5 `src/test/resources`

Resources needed by MUnit tests — the test equivalent of `src/main/resources`.

---

## 4. Libraries Shown in the Package Explorer

Below the folders, Studio shows libraries added automatically:

| Entry | Meaning |
|---|---|
| **HTTP** (connector) | Added by default; contains the HTTP connector JARs |
| **Sockets** | Added by default; rarely used |
| **JRE System Library** | Embedded Java runtime — the project needs Java in the background |
| **Mule Server** (e.g. 4.4.0 EE) | Libraries of the embedded Mule runtime used to deploy and test locally |

### Demonstration — removing and re-adding a module

- Right-click **HTTP** in the Mule Palette → **Remove module**. The Listener in the flow stops working.
- **Add Modules** → drag HTTP back → it works again.
- The same was done with **Sockets** (Add module → choose version → OK).
- Added modules appear in this library list with all their JAR files.

New projects get **HTTP and Sockets** by default, so you never need to add HTTP manually. You can remove what you don't need.

### `target/`

When the project is built into a **JAR file** for deployment, the output goes here.

### `mule-artifact.json`

Declares the **Mule runtime version** the project targets — e.g. **4.4.0**.

**Version confusion cleared:** job postings say "Mule 4.x developer" or "Mule 3.x developer". That refers to the **Mule runtime (server) version**, not the Studio version. The instructor's Studio is **7.12**, whose embedded runtime is **4.4.0**. A newer Studio comes with a newer runtime (e.g. 4.7).

---

## 5. pom.xml — Project Object Model

### 5.1 What and where

- **POM = Project Object Model.** The project is described as an object in an XML file named `pom.xml`.
- **Always in the root folder** of the project. It must not be moved.
- Contains **configuration details, dependencies, repositories and plugins**.
- It is the **core element of a Maven project** and keeps the project organised. Because files are in standard places, Maven can find and build them easily; randomly placed files would be confusing.

### 5.2 Representative pom.xml

The structure below follows what was shown in class (values such as plugin 3.5.4, HTTP 1.6.0, Sockets 1.2.2 were read out); some details are abbreviated.

```xml
<project ...>
  <modelVersion>4.0.0</modelVersion>

  <!-- Identity -->
  <groupId>com.mycompany</groupId>
  <artifactId>hello-world-demo-app</artifactId>
  <version>1.0.0-SNAPSHOT</version>
  <packaging>mule-application</packaging>
  <name>hello-world-demo-app</name>

  <!-- Properties: reusable values -->
  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
    <app.runtime>4.4.0</app.runtime>
    <mule.maven.plugin.version>3.5.4</mule.maven.plugin.version>
  </properties>

  <!-- Build: plugins that clean and package the project -->
  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-clean-plugin</artifactId>
      </plugin>
      <plugin>
        <groupId>org.mule.tools.maven</groupId>
        <artifactId>mule-maven-plugin</artifactId>
        <version>${mule.maven.plugin.version}</version>
        <extensions>true</extensions>
      </plugin>
    </plugins>
  </build>

  <!-- Dependencies: one per module/connector -->
  <dependencies>
    <dependency>
      <groupId>org.mule.connectors</groupId>
      <artifactId>mule-http-connector</artifactId>
      <version>1.6.0</version>
      <classifier>mule-plugin</classifier>
    </dependency>
    <dependency>
      <groupId>org.mule.connectors</groupId>
      <artifactId>mule-sockets-connector</artifactId>
      <version>1.2.2</version>
      <classifier>mule-plugin</classifier>
    </dependency>
    <!-- mule-db-connector appears here when Database is added -->
  </dependencies>

  <!-- Repositories: where dependencies/plugins are downloaded from -->
  <repositories>
    <repository>
      <id>anypoint-exchange-v3</id>
      <url>https://maven.anypoint.mulesoft.com/api/v3/maven</url>
    </repository>
    <repository>
      <id>mulesoft-releases</id>
      <url>https://repository.mulesoft.org/releases/</url>
    </repository>
  </repositories>
  <pluginRepositories> ... </pluginRepositories>
</project>
```

### 5.3 Identity fields

**groupId — unique name of the organisation.**

- **Example:** Flipkart's domain is `flipkart.com`. Reversed → `com.flipkart`.
- MuleSoft **suggests** reversing the domain name. You could use just `flipkart`; it's a recommendation, not a rule.

**artifactId — unique name of the project.**

- Usually the **same as the project name**. Some organisations add something extra, but most projects keep them the same.
- Why unique? Built JARs are stored in a folder structure by groupId → artifactId → version. **Analogy:** saving `test.doc` twice in the same folder → Windows asks you to replace it. Two projects with the same groupId + artifactId would collide.

**version** — e.g. `1.0.0`, `1.0.1`.

**packaging** — tells Maven what kind of application this is: a Mule application.

**name** — the project name.

### 5.4 Properties

Define a value once at the top and reuse it elsewhere with `${...}`.

**Example:** `mule.maven.plugin.version = 3.5.4` is defined in properties and used in the plugin's `<version>${mule.maven.plugin.version}</version>`.

Other properties: the **runtime version** and the **encoding** (**UTF-8** by default; rarely changed).

### 5.5 Build

**Why build?** XML files are human-readable. To deploy, the project is converted into a **JAR file** — a machine-readable, deployable package. Maven uses plugins to do this:

- **Mule Maven plugin** — builds/packages the Mule application.
- **Clean plugin** — cleans previous build output (the instructor calls it the "mule clean plugin"; in the file it is the standard `maven-clean-plugin`).

The instructor explains this so you don't have "self-doubt" when you see these files in real projects.

### 5.6 Dependencies — demonstrated live

Each module/connector is a `<dependency>` with:

| Element | Example |
|---|---|
| groupId | `org.mule.connectors` |
| artifactId | `mule-http-connector`, `mule-sockets-connector`, `mule-db-connector` |
| version | `1.6.0`, `1.2.2`, … |
| classifier | `mule-plugin` |

**Demonstration:**

1. Removed **Sockets** (right-click in palette → Remove module) → its dependency disappeared from pom.xml.
2. Added **Sockets** again via Add Modules → the dependency reappeared, and Studio **downloaded** the JARs.
3. Removed **Database** → its dependency removed; the Database connector can no longer be used.
4. Dragged **Database** back → dependency added to pom.xml first → JARs downloaded and shown in the library list.

> Adding/removing a module in the palette **automatically edits pom.xml**.

**Instructor's advice:** if this isn't clear now, rewatch and practise — add a module, remove it, check pom.xml each time. Everyone finds it hard at first.

### 5.7 Repositories

**Repository:** a place where files are kept (a folder with many files is a repository).

Two repositories are listed: **Anypoint Exchange** repository and **MuleSoft releases** repository.

**How Maven downloads a dependency:**

```text
Repository URL
   └── org/mule/connectors/            (groupId)
         └── mule-db-connector/          (artifactId)
               └── <version>/            (version — several may exist)
                     └── JAR files → downloaded into the project
```

Plugins are downloaded the same way from **plugin repositories**.

**Instructor's honesty:** they don't know the exact significance of the MuleSoft releases repository; in practice it is left unchanged.

### 5.8 Most-used parts

**Most frequently used:** `src/main/mule`, `src/main/resources`, `src/test/munit`, `src/test/resources` and **pom.xml**.

**Instructor's observation:** many people in real projects don't know what groupId and artifactId are, or why dependencies exist. Minimum knowledge of the basics gives more confidence. The instructor faced the same difficulty when moving from mainframes to MuleSoft — they practised repeatedly and adapted in 10–15 days.

**Summary of the build idea:** Studio is an enhanced Eclipse-based IDE; MuleSoft reused existing tools (Maven, Log4j2, Spring, Java) and organised everything on top. Human-readable XML → Maven build → machine-readable JAR → deployed on a server.

---

## 6. Flows

### 6.1 What happens inside a flow

In Mule projects we do **orchestration, transformation and enrichment** — inside flows.

DB example: request arrives → call the database and get the response (orchestration) → convert Java to JSON (transformation) → log → respond.

> A **flow** is a scope in which orchestration, transformation and enrichment are performed.

### 6.2 Creating a flow — two ways

1. **Drag any component** onto an empty canvas — a flow is created automatically around it.
2. **Drag a Flow scope** from the palette: search "flow", or **Core → Scopes → Flow**.

There are two kinds: **Flow** and **Sub Flow**. The difference is covered later.

Flows get unique generated names: `testFlow`, `testFlow1`, `testFlow2`, …

### 6.3 Flow Reference

To go from one flow to another and come back, use the **Flow Reference** component.

```text
helloWorldFlow:   Listener → Logger → Flow Reference (testFlow1) → Logger
                                            │
testFlow1:                                  └─► Logger → …  (returns)
```

- Works between flows in the **same XML file** and in **different XML files** of the same project.
- The Listener (source) belongs to the main flow; smaller flows called by reference don't need one.

```text
Project
├── hello-world-demo-app.xml
│     └── helloWorldFlow ──Flow Reference──┐
└── test.xml                               │
      ├── testFlow1  ◄─────────────────────┘
      ├── testFlow2
      └── testFlow3
```

Configuration XML (simplified):

```xml
<flow name="hello-world-demo-appFlow">
  <http:listener config-ref="HTTP_Listener_config" path="/hello"/>
  <logger message="flow started"/>
  <flow-ref name="testFlow1"/>
</flow>

<flow name="testFlow1">
  <logger message="inside testFlow1"/>
</flow>
```

---

## 7. The Three Tabs of a Configuration XML File

Opening an XML file shows three tabs at the bottom:

| Tab | What it shows |
|---|---|
| **Message Flow** | Visual (drag-and-drop) representation of the code |
| **Global Elements** | Configurations usable anywhere in the project |
| **Configuration XML** | The XML code generated from the visual flow |

### 7.1 Message Flow and Configuration XML are the same thing

Demonstration: `test.xml` had four flows (`testFlow`, `testFlow1`, `testFlow2`, `testFlow3`), each with a Logger and Flow Reference. After deleting `testFlow2` in Message Flow and saving, it disappeared from Configuration XML too.

> Configuration XML **is** your project code; Message Flow is its visual representation.

### 7.2 Global Elements

- When you click **+** to create a **Listener connector configuration** or **Database configuration**, it is stored as a **global element**.
- "Global" because it can be used **anywhere in the project** — another flow or another XML file. Example: a Listener in `test.xml` can reuse the HTTP Listener config created in the main XML.

---

## 8. Flow Anatomy — Source, Process, Error Handling

An empty flow has three sections:

```text
┌──────────────────────── Flow ─────────────────────────┐
│ Source        │ Process                                │
│ (HTTP Listener│ (Logger, DB, Transform Message, …)     │
│  Scheduler …) │                                        │
├───────────────┴────────────────────────────────────────┤
│ Error handling                                         │
└────────────────────────────────────────────────────────┘
```

| Section | Purpose |
|---|---|
| **Source** | Starts the flow — e.g., listens to the request, converts it into a Mule event, passes it to Process |
| **Process** | Orchestration, transformations, connecting to systems, enrichment |
| **Error handling** | Handles errors raised in the flow |

### Studio enforces placement

- Dragging the **HTTP Listener** into **Process** → **not allowed**. It is a source component and works only in Source.
- Dragging the **HTTP Request** operation into **Source** → **not allowed**. It is a processor and works only in Process.

---

## 9. Important Terminology

| Term | Meaning |
|---|---|
| Maven | Project management and build tool embedded in Studio |
| Workspace | Folder on disk where Studio stores projects |
| Mule configuration file | XML file in `src/main/mule` containing flows |
| Flow | Scope where processing happens; has Source, Process, Error handling |
| Flow Reference | Component that calls another flow (same or different XML) |
| Global element | Reusable configuration (connector configs) |
| Log4j2 | Java logging framework used by Mule; configured in `log4j2.xml` |
| MUnit / JUnit | Mule unit tests / Java unit tests |
| Property file | Per-environment configuration values |
| POM | Project Object Model (`pom.xml`) |
| groupId / artifactId / version / packaging | Project identity in Maven |
| Dependency | Library/connector the project needs |
| Classifier `mule-plugin` | Marks a dependency as a Mule plugin (connector) |
| Repository | Location from which dependencies/plugins are downloaded |
| Plugin | Maven tool used in the build (mule-maven-plugin, clean plugin) |
| JAR | Deployable, machine-readable package of the project |
| `mule-artifact.json` | Declares the Mule runtime version |

---

## 10. Interview Questions

### Q1. Explain the Mule 4 project structure.
`src/main/mule` (configuration XML files with flows), `src/main/java` (custom Java, rare), `src/main/resources` (property files, API spec, log4j2.xml), `src/test/munit` (MUnit tests), `src/test/resources` (test resources), `pom.xml` (Maven configuration), `mule-artifact.json` (runtime version), `target/` (build output).

### Q2. Why is a Mule 4 project called a Maven project?
Its structure and build are managed by Maven: Maven creates the standard folders, resolves dependencies listed in pom.xml, and builds the deployable JAR using plugins.

### Q3. What is pom.xml and what does it contain?
The Project Object Model file in the project root. It contains project identity (groupId, artifactId, version, packaging), properties, build plugins, dependencies and repositories.

### Q4. What are groupId and artifactId?
groupId uniquely identifies the organisation (often the reversed domain, e.g. `com.flipkart`). artifactId uniquely identifies the project, usually the same as the project name.

### Q5. What happens in pom.xml when you add a connector from the palette?
A `<dependency>` for that connector is added and Maven downloads its JARs from the configured repositories. Removing the module removes the dependency.

### Q6. Where do you keep property files and why?
In `src/main/resources`, one per environment, so environment-specific values (DB host, credentials) aren't hard-coded and the same app can be deployed to each environment.

### Q7. What are the three parts of a flow?
Source (triggers the flow, e.g., HTTP Listener), Process (processing logic), Error handling.

### Q8. Can a project have multiple XML files and an XML file multiple flows? How do flows call each other?
Yes to both. Flows call each other with Flow Reference, including across XML files.

### Q9. What are global elements?
Reusable configurations such as HTTP Listener and Database connector configurations that can be used anywhere in the project.

### Q10. "Mule 4.x developer" — is 4.x the Studio version?
No. It is the Mule runtime version (e.g. 4.4.0). Studio has its own version (e.g. 7.12).

---

## 11. Must Remember

1. **Mule 4 project = Maven project**; Maven creates the structure.
2. `src/main/mule` = XML flows (main code); multiple XML files and multiple flows are normal.
3. `src/main/resources` = **property files per environment**, API spec, log4j2.xml, certificates.
4. `src/main/java` and `src/test/java` = rarely used; `src/test/munit` = MUnit tests (developer's job).
5. **pom.xml** in root: groupId (org), artifactId (project), version, packaging, properties, build plugins, dependencies, repositories.
6. Adding/removing a module **adds/removes its dependency** in pom.xml; JARs are downloaded from repositories.
7. `mule-artifact.json` = **runtime version** (4.4.0); Studio 7.12 ≠ runtime 4.4.0.
8. XML file tabs: **Message Flow** (visual), **Global Elements** (reusable configs), **Configuration XML** (code).
9. Flow = **Source → Process → Error handling**; Listener only in Source, HTTP Request only in Process.
10. **Flow Reference** calls another flow, even in another XML file.
