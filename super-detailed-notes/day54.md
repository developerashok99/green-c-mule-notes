# Day 54 — FTP with FileZilla Server: Read a CSV into the Database, Write DB Rows to a File, and the File / SFTP Connectors

> **Sources:**
> - Cleaned audio transcript ([transcripts-cleaned/day54.txt](../transcripts-cleaned/day54.txt)) and the class video (recorded 24 Jan 2025).
> - Text marked *screen* or *drawing* is read from the recording.
> - Slide images: [slides/day54](../slides/day54/).

## 1. Overview

1. What **FTP** is and why integrations read/write files on FTP servers
2. The requirement — scheduler → read employee CSV from FTP → transform → insert into DB
3. FTP server products; installing and configuring **FileZilla Server** (user, shared folder, permissions)
4. What a **CSV** file looks like
5. Flow 1 — **FTP Read** → CSV to Java → **For Each** insert
6. FTP connector configuration — working directory, port 21, user **mahesh**; the path error
7. Flow 2 — **Bulk insert**
8. FTP operations — Copy, Create directory, Delete, List, Move, Read, Rename, Write, On New or Updated File; **List in 1.x vs 2.x**
9. Flow 3 — DB **Select** → transform → **Write** a file to FTP; write modes (Overwrite / Append / Create new); delta data
10. Questions to ask before building a file integration
11. **File** vs **FTP** vs **SFTP** connectors
12. Remaining modules

---

## 2. What Is FTP?

- **FTP = File Transfer Protocol**.
- **File, FTP and SFTP** connectors fall under the same category — learn one and the others are the same.
- Files are placed on FTP servers; integrations connect **periodically** (daily, weekly, monthly, yearly), take the file's data and send it to another system — a regular industry requirement.
- Or the other way: take some data and **write** a file to the server.

**DB server vs. FTP server:**

| Server | Used for |
|---|---|
| DB server | Storing **data** permanently |
| FTP server | Storing **files**, and accessing them again |

- In companies, a **separate team** maintains the FTP server. Many teams access their own folders; the FTP team tells you "your files are in your folder".

---

## 3. The Requirement

*Drawing:* scheduler → read file from the FTP server → transform → For Each insert into the DB; to-dos: download/install an FTP server, configure it, develop the Mule app; formats JSON, XML, CSV.

1. A **scheduler-based** integration.
2. An **employee CSV** on the FTP server — e.g. 10 rows, one employee per row.
3. Read it with the **FTP connector** (any component that connects to another system is a connector).
4. Split it and **insert** each into the database — a single insert can't take 10 rows, so use **For Each**.
5. If the file is known to be small (around a hundred max), **bulk insert** without splitting.

*Drawing:* the source endpoint triggers the flow — **fixed frequency** or **cron**; For Each 5 records **≈ 500 ms** vs Bulk insert **≈ 120 ms**.

**Student Q&A — file formats:**

- Not only JSON/XML/CSV; on FTP locations it's mostly **CSV and Excel** files.
- Other formats → do some research and a small POC; you already know the connector.
- Different files in different folders (employees as CSV, customers as Excel) → configure each **Read** with its own format and location.

---

## 4. FTP Servers and FileZilla Installation

*Screen:* Google "ftp servers" — a program for transferring files over a network (FileZilla).

*Screen:* FTP server options — **FileZilla Server**, Cerberus FTP, CompleteFTP, Titan, Core FTP, Files.com, Globalscape.

- Tools like **SolarWinds** and **WinSCP** connect to a remote place and push files.
- **Instructor's experience:** "I got the opportunity twice in my whole journey; I just took the username and password and did it."
- Installing/configuring FTP servers is **not our job** — the FTP server team does it. We do it here only for practice.

### 4.1 Install (old version on purpose)

*Screen:* Control Panel → Programs — removing the old FileZilla Server first.

*Screen:* FileZilla Server **0.9.x** installer — licence agreement.

- The **old** version is used because the new version's settings are different; the instructor shares it in the chat.
- Steps: double-click → Yes → Agree → default settings (install location can change).
- Note the admin port **14147** — the UI uses it to connect to the server's admin interface.
- Install → the UI opens automatically.

### 4.2 Connect to the admin interface

*Screen:* host **localhost**, port **14147**, admin password **admin** → Connect.

### 4.3 Create a user and shared folder

*Screen:* FileZilla Server → **Edit → Users**: add a user, password, shared folder (home directory) with read/write permissions.

| Setting | Value in class |
|---|---|
| User | **mahesh** |
| Password | **mahesh** |
| Shared folder (home directory) | A desktop **FTP** folder |
| Working folder | A desktop **employee** (`emp`) folder |
| Alias | **`/emp`** — use the alias instead of the full path |
| Permissions | All — Read, Write, Delete, Create … |

- Only **Read** permission → a user can only read files.
- The FTP team might create a user with read-only access to one folder.
- The FTP server uses folders on the laptop; the UI changes access.

---

## 5. What a CSV File Looks Like

*Screen:* `employees.csv` — empid, empname, empstatus, empsalary (100 Praveen A 75000, 1001 Ram Active 80000 …).

- **CSV = comma-separated values**.
- Open with **Notepad/Notepad++** (values separated) or **Excel** (rows and columns).
- First row = **header** (field names); each next row = one employee.
- The comma separates one value from the next.
- Separators can also be **pipe** (`|`) or **tab**; comma is most common.
- Headers are optional, but **99% of the time** they're there — otherwise there's no way to tell what each field is.

---

## 6. Flow 1 — FTP Read → For Each Insert

*Screen:* `ftp-db-insert` flow:

```text
Scheduler (fixed frequency, every 2 minutes)
  Start Logger
  FTP Read  (employees.csv)
  Transform  CSV → Java
  For Each
    Before DB Logger
    Database Insert
    After DB Logger
  End Logger
```

- **FTP isn't in the project by default** — Add Modules → drag in FTP.
- Convert CSV to **Java** because **For Each won't accept CSV** for processing.
- No aggregation logic — the focus is FTP.

*Screen (CSV to Java):*

```dataweave
%dw 2.0
output application/java
---
payload map ((item, index) -> { … })
```

*Screen (Database Insert):*

```sql
insert into EMPLOYEES_INFO values (:emp_id,:emp_name,:emp_status,:emp_salary,:emp_designation)
```

- Map the input parameters correctly: left side = database column names, right side = the CSV field names from the FTP file.

*Screen:* MySQL Workbench — `EMPLOYEES_INFO` before the run (Mule DB, records up to 211).

---

## 7. FTP Connector Configuration

*Screen:* **FTP Config**:

| Field | Value |
|---|---|
| Name | `FTP_Config` |
| Working Directory | `EMP` (the full folder path was also tried) |
| Transfer mode | **BINARY (Default)** |
| Passive | True (Default) |
| Enable Remote Verification | True (Default) |
| Host | **localhost** |
| Port | **21** (FTP default) |
| Username / Password | **mahesh / mahesh** |

- **Test Connection** → established successfully.
- Ports: **14147** = the FileZilla admin UI; **21** = the FTP server itself (like 3306 for MySQL vs. Workbench).
- In real time host/port are different — e.g. `10.21.25.5` or `abc.com`.

*Screen:* FTP **Read** — connector config `FTP_Config`, file path `employees.csv`, MIME type.

- With a working directory set, the **file path** can be just the file name: **working directory + file name**.
- Or give the **entire path** directly.

### 7.1 The path error

*Screen (debugger):* **"Path '/EMP/employees.csv' doesn't exist"**.

- The file was in the **emp** folder, while the user's home (shared) folder was the **FTP** folder.
- FileZilla's alias help: an alias like `/data/files` makes the shared directory appear on the server under that name.
- Fixed by getting the path relative to the user's directory right (working directory + `/employees.csv`, or the full path).
- *Screen:* FileZilla Server log — the Mule app connecting: `USER`, `PASS`, **`230 Logged on`**, `RETR employees.csv`.
- After the fix, the payload arrived in **CSV** format.

> **Instructor's view:** "Servers behave differently — some take slashes, some don't. It depends on which server you're connecting to." Collect username, password and working directory from the FTP team, test the connection from local, then confirm.

---

## 8. Flow 2 — Bulk Insert

*Screen:* Read CSV from FTP → CSV to Java → **Bulk insert** (one call).

- Same as flow 1, but the whole list goes to the DB at once.
- Target variable, reconnection strategy etc. on Read apply here too.

---

## 9. FTP Operations

*Screen:* FTP / SFTP / File operations in the palette.

| Operation | Use |
|---|---|
| Copy | Copy a file |
| **Create directory** | Create a folder (only if the user has **Create** permission) |
| Delete | Delete a file |
| **List** | List files in a folder |
| **Move** | Move a file — e.g. after processing, move it to another path |
| **Read** | Read a file |
| Rename | Rename a file |
| **Write** | Write content and create a file on the server |
| **On New or Updated File** (source) | Triggers when a new file arrives or a file is updated |

**After inserting, remove the file from the FTP location?** Use **Move** (or Delete / Copy) once processing is done.

**On New or Updated File settings:**

- Connector configuration, directory, and a **scheduler** (how often to poll).
- **Auto delete** — delete the file after processing; default **false**.

### 9.1 List in 1.x vs 2.x

| Version | List returns |
|---|---|
| FTP/SFTP **1.x** (project uses FTP **1.5.5**) | File **names and contents** |
| FTP/SFTP **2.x** | Only file **names** |

- In 2.x, combine **List + Read** — read each listed file one by one.

---

## 10. Flow 3 — Database to a File on FTP

*Screen:* `ftp-db-demo` flow:

```text
Scheduler
  Logger
  Database Select   (select * from employees)
  Logger
  Transform  (DB rows → file format)
  Logger
  FTP Write  (to the FTP server)
  Logger
```

- DB rows come as **Java** — an array of objects.
- The transform uses `map`, with the item named `payload01`, mapping `emp_id as String`, name, salary, status.
- The instructor set the output to **Excel (xlsx)**; *screen:* a CSV version — `output application/csv` with `payload map ((item, index) -> { empId: item.emp_id as String, … })`.
- **Write** content = `payload`; file names like `27`, `28`, `29`, `30` per run.

*Screen:* the written file on the FTP folder, and opened in Excel — the exported records.

### 10.1 Write modes

| Mode | Behaviour |
|---|---|
| **Overwrite** | Replaces the file content |
| **Append** | Adds to the existing content |
| **Create new** | Creates a new file |

**Overwrite example:** day 1 — 100 customers written; day 2 — 150 in DB, the 100 replaced by 150; day 3 — 250 replace 150.

**Append example:** day 1 — write 100; day 2 — fetch **only the 50 new** and append (150 in the file); day 3 — append the next 100.

- With Append, fetch only the **delta** (the difference since the last run) — e.g. with an **object store**, by date, or **incremental watermarking**.
- In class, `select * from employees` + Append wrote the old and new data again each time (100 … 217 repeated).
- A large full select every day takes a long time — another reason for delta.

### 10.2 Problems in the demo

- The scheduler was triggering every **2 seconds** — changed to 1 minute.
- Excel showed *"Excel completed file level validation and repair"* — the xlsx file was broken.
- **Instructor's suggestion:** if Excel doesn't work, use **CSV** — it works. Possibly an Excel version/trial issue; to be revisited.

---

## 11. Before Building a File Integration — Questions to Ask

1. What's the **volume** of data?
2. How **frequently** should it run? Scheduler-based? What's the **cron**?
3. Is there an FTP **user** for MuleSoft? If not, find the responsible team's **SPOC** to create one.
4. Is the **port** on their server opened from our Mule application server?

> **Instructor's view:** these interactions take most of the time. With good knowledge, the main business logic takes half a day or an hour or two; loggers and error handling take some more.

*Screen:* Scheduler — strategy Fixed Frequency / Cron, time unit options.

---

## 12. File vs. FTP vs. SFTP

*Drawing (recap):* FTP server ↔ Mule app (read, write) with a scheduler, then insert/bulk insert to the DB.

### 12.1 File connector

*Screen:* File connector config — working directory for local files.

- Use when the file is on the **same server** as the Mule runtime (e.g. runtime on C:, file in a D: folder on that server).
- Needs only the **path** — no user ID or password, because it's local to the server.
- Same operations: Read, Write, Move, Copy, Rename, Delete ….

### 12.2 SFTP connector

*Screen:* SFTP Config — host, port, username, password, preferred authentication methods, known hosts file.

- **SFTP = Secure File Transfer** — FTP plus security configuration.
- Same operations and logic.
- Not demoed — no SFTP server to configure.

| Where the file is | Connector |
|---|---|
| Local to the Mule application server | **File** |
| An FTP server | **FTP** |
| An SFTP server | **SFTP** |

- "Learn one connector and you get three — like with JMS you also got VM."
- *Screen:* project modules — Database v1.12.1, File v1.3.4, FTP v1.5.5, SFTP v1.4.1.

---

## 13. Remaining Modules

*Screen:* course modules — **Module 5: File, FTP and SFTP endpoints** done; remaining **CI/CD**, **AWS S3**, **HTTPS**, **CloudHub 1.0 vs 2.0**.

- **S3:** AWS has S3, Azure has Blob storage, GCP has Google Cloud Storage — learn one and it's the same for all.
- **One-way and two-way SSL** (HTTPS) — so far all APIs were HTTP.

---

## 14. Important Terminology

| Term | Meaning |
|---|---|
| FTP | File Transfer Protocol |
| SFTP | Secure (SSH) File Transfer — FTP with extra security |
| FileZilla Server | Free FTP server used for practice |
| Home directory / shared folder | The folder an FTP user can access |
| Alias | A short server path (e.g. `/emp`) for a shared folder |
| Working directory | Base folder in the connector config; file paths are relative to it |
| Transfer mode BINARY | Default FTP transfer mode |
| Passive mode | FTP connection mode (default true) |
| CSV | Comma-separated values; header row + data rows |
| On New or Updated File | Polling source that triggers on new/changed files |
| Auto delete | Delete the file after On New or Updated File processes it |
| Write mode | Overwrite / Append / Create new |
| Delta data | Only the records changed since the last run |
| Watermarking | Remembering the last record processed to fetch only new ones |
| SPOC | Single point of contact in another team |

---

## 15. Interview Questions

### Q1. When do you use File, FTP or SFTP connectors?
File — the file is on the same server as the Mule runtime (just a path, no credentials). FTP — the file is on an FTP server. SFTP — on an SFTP server, with extra security configuration. The operations are the same.

### Q2. How would you load a CSV from FTP into a database?
Scheduler → FTP Read → transform CSV to Java → For Each with Insert (or Bulk insert for a small file).

### Q3. Why convert CSV to Java before For Each?
For Each can't process the CSV format; Java (an array of objects) can be iterated.

### Q4. What changed in List between FTP 1.x and 2.x?
In 1.x List returns file names and contents; in 2.x only names — combine List with Read.

### Q5. Overwrite vs. Append?
Overwrite replaces the file each run; Append adds to it. With Append, fetch only delta data (watermarking/object store), or records repeat.

### Q6. How do you process files as soon as they arrive?
On New or Updated File source, with a polling frequency, optionally Auto delete.

### Q7. What do you ask before building a file integration?
Data volume, frequency/cron, whether an FTP user exists for MuleSoft (and the SPOC), and whether the port is open from the Mule server.

### Q8. What's the default FTP port?
21 (FileZilla's admin UI used 14147).

---

## 16. Must Remember

1. File, FTP, SFTP share the same operations — choose by **where the file is**.
2. FileZilla practice setup: admin **localhost:14147**, password **admin**; user **mahesh / mahesh**; FTP port **21**.
3. FTP isn't in the palette by default — **Add Modules**.
4. CSV → **Java** before **For Each**; bulk insert for small files.
5. File path = **working directory + file name**, or the full path; servers differ on slashes.
6. Move/Delete the file after processing.
7. FTP **1.x List** = names + content; **2.x** = names only → List + Read.
8. Write modes: **Overwrite / Append / Create new**; Append needs **delta** data.
9. On New or Updated File: polling, **Auto delete** default false.
10. Ask about volume, frequency, user/SPOC and open ports before coding.
