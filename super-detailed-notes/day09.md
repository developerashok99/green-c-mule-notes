# Day 09 — Anypoint Studio Tour: Layout, Menus, Project Operations and Workspaces

> **Sources:** audio transcript, existing notes, and the class video (recorded 13 Nov 2024). Dialog text, paths and versions marked *screen* are read from the recording. This session is a live Studio demo — the only slide is the agenda carried over from Day 08. Slide images: [slides/day09](../slides/day09/).

## 1. Overview

A practical tour of Anypoint Studio — the options a developer uses every day.

1. Studio layout: Package Explorer, canvas, Mule Palette, properties tab, bottom tabs
2. Opening, closing and deleting projects (and the "delete from disk" trap)
3. Export and import (JAR files)
4. Menu bar: File, Edit, Source, Navigate, Search, Project, Run, Window, Help
5. Save vs. Save All, Build Automatically, Clean
6. Run/Debug Configurations (preview)
7. Design mode vs. Debug mode
8. Workspaces and switching workspaces

These are simple things, but you should know them well before working on real projects.

---

## 2. Studio Layout

```text
┌───────────────┬──────────────────────────────────────┬───────────────┐
│ Package       │  Canvas (working area)               │ Mule Palette  │
│ Explorer      │  Message Flow | Global Elements |    │ (connectors,  │
│ (projects)    │  Configuration XML                   │  components,  │
│               │                                      │  Add Modules) │
├───────────────┴──────────────────────────────────────┴───────────────┤
│ Bottom: component properties tab │ Console │ Problems │ Search │     │
│         Mule Debugger │ MUnit Coverage │ MUnit Errors                 │
└──────────────────────────────────────────────────────────────────────┘
```

### 2.1 Package Explorer (left)

- Shows **all projects created or imported** in the current workspace.
- Sorted **alphabetically** — a project starting with "S" is near the bottom.
- From here you can open/close projects, create new Mule configuration files (right-click → New → Mule Configuration File), and create a new Mule project (right-click on white space → New → Mule Project — same as File → New).

### 2.2 Canvas (centre) — the working area

Where you drag and drop components, build flows, and write logic and transformations. It shows the three tabs of the open XML file: **Message Flow**, **Global Elements**, **Configuration XML** (Day 08).

### 2.3 Mule Palette (right)

All connectors and components available to the project. Drag them into the canvas.

**If a connector isn't there:**

```text
1. Mule Palette              ─ already in the project?
2. Add Modules               ─ add a module available in Studio
3. Search in Exchange        ─ download from Anypoint Exchange (shown next session)
4. Custom connector          ─ only if none of the above exists
```

**Instructor's view:** "Name some system, you'll have a connector" — custom connectors are rarely needed.

### 2.4 Component properties (bottom)

Clicking a component in the canvas opens its configuration in a tab at the bottom:

- **Logger:** message to print, level, category
- **Listener:** connector configuration, path, etc.
- **Transform Message:** the DataWeave editor

### 2.5 Bottom tabs

| Tab | Purpose |
|---|---|
| **Console** | Logs printed when the app is deployed and when requests are processed (Run or Debug). Local log checking happens here |
| **Problems** | Problems Studio detects in open projects |
| **Search** | Results of a search |
| **Mule Debugger** | Step through the flow in Debug mode: **Next processor**, **Resume** (continue to the next breakpoint or end), **x+y** evaluate expression; shows payload, attributes, variables |
| **MUnit Coverage** | After writing MUnit tests: how many components and what percentage of each file are covered |
| **MUnit Errors** | Errors from MUnit tests |

Tabs can be **dragged** to other positions for convenience.

---

## 3. Opening, Closing and Deleting Projects

### 3.1 Open

- **Double-click** the project, or expand it with the arrow, then open files.

### 3.2 Closing a tab is not closing the project

Closing the file tab in the canvas **does not** close the project. It is still open in Package Explorer.

### 3.3 Close Project

Right-click → **Close Project**. The project closes, and its tabs in the canvas close too.

### 3.4 Close Unrelated Projects

If many projects are open with many tabs, it gets confusing which file belongs to which project.

Right-click the project you want → **Close Unrelated Projects** → all **other** projects are closed (not deleted). Faster than closing nine projects one by one.

### 3.5 Close vs. delete

- **Close** — just closes; the project stays in Studio and in the workspace.
- **Delete** — removes the project.

### 3.6 Delete — the "contents on disk" trap

Right-click → **Delete** opens *Delete Resources* (*screen*): "Remove project 'dummy' from the workspace?", a checkbox **Delete project contents on disk (cannot be undone)**, and "Project location: D:\WS APS\dummy".

```text
Delete WITHOUT the checkbox   → removed from Studio only
                                 folder still exists in the workspace on disk
Delete WITH the checkbox      → removed from Studio AND from the workspace
```

**Demonstration:**

1. Created a project `dummy`. Right-click → **Show In → System Explorer** showed its folder in the workspace (`D:\WS APS\dummy`).
2. Deleted it **without** the checkbox → gone from Studio, but the folder was still in the workspace after refreshing.
3. Tried to create a new project named `dummy` → error: **a folder named dummy already exists under the specified project location**.
4. Fix: delete the leftover folder manually from the workspace, then the new project could be created.
5. Created `dummy` again and deleted it **with** the checkbox → removed from both Studio and the workspace.

> To really delete a project, delete it from the workspace as well.

---

## 4. Export and Import

### 4.1 Why

To share a project with a colleague, or to receive one. (Projects are also shared through code repositories such as Bitbucket — covered later.)

### 4.2 What is a JAR file?

Project code is in XML files — human-readable. To deploy, the project is packaged into a **JAR file** — a machine-readable, deployable archive. Exporting creates this JAR.

### 4.3 Export — steps

1. Right-click the project → **Export** (or File → Export).
2. Choose **Mule → Anypoint Studio Project to Mule Deployable Archive (includes Studio metadata)**.
3. Next → keep defaults → choose the output location.
4. **Finish** → "Project exported successfully at <location>".

*Screen* — the **Export Mule Project** dialog ("Export a Mule project as a deployable archive"):

| Field | Value |
|---|---|
| JAR file | `C:\Users\<user>\activemq-demo` |
| Attach project sources | ✔ |
| Only export project sources | ☐ |
| Include project modules and dependencies | ✔ |
| Note | "A lightweight package generated without modules and dependencies won't be deployable to CloudHub but can be imported into Studio." |

The instructor exported the **activemq-demo** project; `activemq-demo.jar` appeared under `C:\Users\<user>\`.

Share it through a common location (Teams, SharePoint, a shared drive) so the colleague can download it.

### 4.4 Import — steps

1. **File → Import**.
2. Expand **Anypoint Studio** → choose **Packaged mule application (.jar)** (the JAR option).
3. Browse to the JAR → set the project name. *Screen* — **Mule Import from Deployable Archive**: with File `C:\Users\<user>\activemq-demo.jar` and Project Name `activemq-demo`, the dialog showed **"A project with name "activemq-demo" already exists in D:\WS APS. Cannot write into destination file D:\WS APS\activemq-demo"** and Finish stayed disabled — so the name was changed.
4. Finish → the import progresses (e.g., 41% → 100%) → the project appears in Package Explorer (here as `activemq-demo-1`).

---

## 5. Menu Bar

### 5.1 File (most used)

| Option | Use |
|---|---|
| New → Mule Project | Create a project (also Java project, etc. — rarely used) |
| New → Mule Configuration File | Create an XML file in a project |
| New → API specification / RAML | Possible here, but RAML is designed in **Design Center** in this course |
| Open Recent | Reopen recent files |
| Import / Export | §4 |
| Save / Save As / Save All | §6 |
| Restart | Closes and reopens Studio |
| Switch Workspace | §9 |
| Exit | Close Studio |

### 5.2 Edit

Cut (Ctrl+X), Copy (Ctrl+C), Paste (Ctrl+V), Select All (Ctrl+A). Shortcuts work everywhere — e.g., copy from Studio and paste into Notepad. **You rarely need to open this menu.**

### 5.3 Source

Mainly **Format** — right-click in the XML → Source → Format tidies the code. Used rarely.

### 5.4 Navigate

Not used.

### 5.5 Search

Search across projects; results appear in the **Search** tab with file and line.

**Example:** searching `Q.test` in the ActiveMQ demo found it in `src/main/mule/activemq-demo.xml`, line 39 (`destination="Q.test"`). Very useful in large projects.

### 5.6 Project

**Build Automatically** (enabled by default) — when you save, the project is rebuilt and redeployed automatically. If disabled, you must stop and redeploy the application yourself after changes.

**Clean** — deletes the generated build output (JAR files in `target/`). When you run a project many times with changes, cached/stale values can cause odd behaviour. Clean, then deploy again.

### 5.7 Run

- **Run / Debug** — run with defaults.
- **Run Configurations / Debug Configurations** — run with **specific settings**.

**Example:** three environments (Dev, UAT, Prod), each with its own database and property file. To test locally against the UAT database, tell Studio which property file to use — in the Run/Debug Configuration. Covered in the property-files session (Day 14).

- **Run History / Debug History** — re-run a previous configuration.
- Toolbar buttons exist for Run and Debug configurations.

### 5.8 Window

**Show View** — reopen a tab you closed:

- Closed the Console → Window → Show View → **Console**.
- Closed the Mule Palette → Window → Show View → **Mule Palette**.
- Closed the **Mule Debugger** → it may not be in the short list → Window → Show View → **Other…** → Mule Debugger.

> Don't close the Mule Debugger by accident — but if you do, this is how to get it back.

**Perspective** — the arrangement of panels. If the layout gets messed up, **Window → Perspective → Reset Perspective** restores the default. This is the perspective option you'll use most.

**Preferences** — explained when needed.

### 5.9 Help

- **About Anypoint Studio** — shows the Studio version (*screen*: "Anypoint Studio - Tooling for Mule Runtime, Version: **7.12.0**, Build Id: 202203291742"). The version also shows on the splash screen when Studio starts.
- **Install New Software** — install plugins into Studio (shown later when needed).

**Version reminder:** "Mule 4.x developer" refers to the **Mule runtime** version (the embedded server — 4.4 for the instructor), **not** the Studio version (7.12).

---

## 6. Save vs. Save All

- A **star (*)** on a tab means unsaved changes.
- **Save (Ctrl+S)** saves **only the active** file.
- **Save All (Ctrl+Shift+S)** saves **all** modified files.

Demonstration: two files changed; Ctrl+S on one left the other with a star; Save All saved both.

---

## 7. Design Mode vs. Debug Mode

Toggle at the top-right of Studio:

| Mode | Use |
|---|---|
| **Mule Design** | Regular development |
| **Mule Debug** | When debugging step by step; panels rearrange for the debugger |

The instructor prefers dragging the **Mule Debugger** to the bottom for a bigger view instead of the default three-way split. Arrange it however you are comfortable; Reset Perspective restores the default.

Double-clicking a tab maximises it.

---

## 8. Practising

**Instructor's advice:** re-watch the session and try every option yourself — open, close, delete, export, import, show view, reset perspective. When starting as a MuleSoft developer, knowing these options saves a lot of struggle.

---

## 9. Workspaces

### 9.1 What is a workspace?

A **workspace** is the **folder where Studio creates and stores projects**. It is not a project itself. The instructor's workspace is `D:\WS APS`. Right-click a project → **Show In → System Explorer** opens its location.

### 9.2 Why multiple workspaces?

- To keep separate sets of projects (Studio shows only the projects of the current workspace).
- **Recovery:** if a project or the workspace gets **corrupted**, keep the same Studio and switch to a new workspace.

### 9.3 Switching — steps

1. Create a new folder — the instructor used `D:\WS Dummy`.
2. **File → Switch Workspace → Other…** → the *Anypoint Studio Launcher* opens ("Select a directory as workspace — Anypoint Studio uses the workspace directory to store its preferences and development artifacts") → Workspace `D:\WS Dummy` → **Launch**.
3. Studio restarts with the new workspace. A welcome pop-up appears → **Continue to Studio**.
4. Package Explorer is **empty**.

A fresh workspace folder contains only Studio **metadata** (e.g., `.metadata` with plugin information), no projects.

**Switching back:** File → Switch Workspace → select `D:\WS APS` → Studio restarts showing all original projects.

---

## 10. Important Terminology

| Term | Meaning |
|---|---|
| Package Explorer | Left panel listing projects |
| Canvas | Central working area |
| Mule Palette | Right panel with connectors/components |
| Console | Shows logs |
| Problems | Lists detected problems |
| Mule Debugger | Debugging tab: Next processor, Resume, evaluate expression |
| MUnit Coverage / Errors | Test coverage / test failures |
| Close Unrelated Projects | Close all projects except the selected one |
| Delete project contents on disk | Option to delete the project folder from the workspace |
| Export / Import | Create a deployable JAR / bring a JAR into Studio |
| Build Automatically | Rebuild/redeploy on save |
| Clean | Delete build output to remove stale artifacts |
| Run/Debug Configuration | Run with custom settings (e.g. environment property file) |
| Show View | Reopen a closed tab |
| Perspective / Reset Perspective | Panel layout / restore default layout |
| Workspace | Folder storing Studio projects |

---

## 11. Interview Questions

### Q1. What is the difference between closing and deleting a project in Studio?
Closing only closes it (files remain). Deleting removes it from Studio; it is removed from disk only if "Delete project contents on disk" is checked.

### Q2. You deleted a project and now can't create a new one with the same name. Why?
The project folder still exists in the workspace because it was deleted without the "contents on disk" option. Delete the folder from the workspace.

### Q3. How do you share a Mule project with a colleague without a repository?
Export it as a deployable archive (JAR) and share the file; they import it via File → Import → Anypoint Studio → packaged Mule application (JAR).

### Q4. What is a workspace and why switch workspaces?
The folder where Studio stores projects. Switching gives a separate project list; useful for separation or when a workspace/project is corrupted.

### Q5. What do Build Automatically and Clean do?
Build Automatically rebuilds and redeploys on save. Clean removes generated build files (JARs in `target/`) to clear stale output.

### Q6. Why use Run Configurations instead of plain Run?
To pass specific settings — e.g., which environment's property file to load.

### Q7. How do you restore a closed Console or Mule Debugger tab?
Window → Show View → Console (or Other… → Mule Debugger). Or Window → Perspective → Reset Perspective.

### Q8. If a connector is not in the Mule Palette, what do you do?
Use Add Modules; if not there, search Exchange; build a custom connector only if none exists.

---

## 12. Must Remember

1. Layout: **Package Explorer – Canvas – Mule Palette – bottom tabs** (Console, Problems, Search, Mule Debugger, MUnit).
2. **Closing a tab ≠ closing a project ≠ deleting a project.**
3. Delete with **"Delete project contents on disk"**, or the folder stays and blocks same-name projects.
4. **Close Unrelated Projects** keeps only the current project open.
5. **Export** → Mule Deployable Archive (JAR); **Import** → Anypoint Studio → JAR.
6. **Save** = active file; **Save All** = all; `*` = unsaved.
7. **Build Automatically** redeploys on save; **Clean** removes stale build output.
8. **Run/Debug Configurations** select environment-specific settings.
9. **Show View** brings back closed tabs; **Reset Perspective** restores layout.
10. **Workspace** = folder holding projects; switch via File → Switch Workspace.
