# Day 09 — Anypoint Studio UI Tour & Project Management

## Topics Covered
- Full tour of the Anypoint Studio interface
- Opening/closing/deleting/exporting/importing projects
- Workspaces — what they are and how to switch between them
- Menu-by-menu walkthrough (File, Edit, Source, Navigate, Search, Project, Run, Window, Help)

## Main UI Areas

| Area | Purpose |
|---|---|
| **Package Explorer** (left) | Lists every project currently open/imported in Studio, alphabetically. Right-click a project for open/close/delete/import/export/create-new-file actions. |
| **Canvas** (center) | The working area — where you drag-and-drop components, view the visual flow, and see connector configs. |
| **Mule Palette** (right) | All available connectors/components for the currently open project. Use "Add Modules" to bring in more (e.g. Database); search box helps find a specific one quickly. If a connector isn't available locally, it can potentially be pulled from **Anypoint Exchange**; if not there either, a **custom connector** would need to be built (rare). |
| **Bottom tabs** | Context-sensitive: clicking a component (Logger, Listener, Transform Message) opens its configuration in a dedicated tab here. |
| **Console** | Shows deployment logs and step-by-step execution logs when running/debugging — this is where you check whether a Logger statement actually printed, or where an error surfaced. |
| **Problems** | Lists detected issues across open projects. |
| **Search** | Project-wide search results (e.g. finding every reference to a specific queue name or variable). |
| **Mule Debugger** | Step-by-step execution control during debug mode — Next/Resume buttons, plus an "x+y" **evaluate expression** feature to inspect `payload`/`attributes`/`vars` live at any breakpoint. |
| **MUnit Coverage / MUnit Errors** | Shows % of components covered by your MUnit tests, and any test errors. |

> Tabs can be dragged and repositioned anywhere in the UI for personal convenience (e.g. moving the Mule Debugger to a bigger panel while debugging) — if the layout ever gets messed up, **Window → Perspective → Reset Perspective** restores Studio's default layout.

## Project Lifecycle Operations

| Action | How |
|---|---|
| **Open** | Double-click the project in Package Explorer |
| **Close** | Right-click → Close Project (closes its tabs too, but the project files remain on disk) |
| **Close Unrelated Projects** | Right-click a project → closes every *other* open project at once — useful when many projects are open and you want to focus |
| **Delete** | Right-click → Delete — ⚠️ **check "Delete project contents on disk"** if you actually want it gone from the **workspace folder**, not just removed from Studio's project list. Leaving it unchecked means the project is hidden from Studio but its folder still physically exists — which can silently block creating a *new* project with the same name later. |
| **Export** | Right-click → Export → Mule → "Anypoint Studio Project to Mule Deployable Archive" → produces a **JAR file** you can share with a colleague or deploy elsewhere. |
| **Import** | File → Import → Anypoint Studio → select the JAR (or other source, e.g. from Bitbucket) → project appears in Package Explorer. |

## Workspace
- A **workspace** = the folder on disk where all your Studio projects physically live (default shown as something like `D:\WSAPS`) — not to be confused with an individual project folder.
- **File → Switch Workspace** lets you point Studio at a different folder entirely — Studio restarts with a completely separate, independent set of projects (useful for isolating unrelated work, or recovering if a workspace/project ever becomes corrupted).
- A workspace folder is otherwise "just metadata + your projects" — nothing magic about it beyond being the container.

## Menu Bar — What's Actually Used Day-to-Day

| Menu | Practical use |
|---|---|
| **File** | New project/file, Import/Export, Switch Workspace, Restart, Exit — the most-used menu |
| **Edit** | Cut/Copy/Paste/Select All — rarely used directly (usually done via right-click or keyboard shortcuts instead) |
| **Source** | Mostly just "Format" (auto-tidy an XML file's structure) — rarely needed |
| **Navigate** | Essentially unused day-to-day |
| **Search** | Project-wide search (e.g. finding a queue name across a large multi-file project) — genuinely useful on bigger projects |
| **Project** | **Build Automatically** (auto-redeploy on save — on by default) and **Clean** (deletes generated build artifacts/cache; use when odd stale-state behavior shows up after many changes) |
| **Run** | **Run/Debug Configurations** — needed when you want to control specifics like *which property file* (dev/UAT/prod) a run should use, rather than a plain default run |
| **Window** | **Show View** (bring back an accidentally-closed tab, e.g. the Mule Debugger), **Reset Perspective** (restore default layout) |
| **Help** | **About Anypoint Studio** (check your Studio version, e.g. 7.12) and **Install New Software** (add plugins/updates) |

## Design Mode vs. Debug Mode
- **Design mode**: the normal development view (drag-and-drop, configure).
- **Debug mode**: activated automatically when debugging — rearranges panels to foreground the Mule Debugger for step-through inspection. Switchable manually via a toggle in the top-right of the canvas.

## Key Takeaway
> None of this is complex individually, but knowing *where* things live (Package Explorer vs. Canvas vs. Palette), how project deletion actually interacts with the workspace folder on disk, and how to reset a messed-up layout, removes a lot of early friction. The instructor's advice: deliberately practice these UI mechanics (open/close/delete/export/import/switch workspace) once, rather than discovering them awkwardly mid-project later.
