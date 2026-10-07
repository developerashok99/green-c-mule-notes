# Day 54 — Slides and On-Screen Drawings

Screens and drawings from the Day 54 class (24 Jan 2025): installing FileZilla Server, reading an employee CSV from FTP and inserting it into the database (For Each and Bulk insert), writing DB rows back to FTP as CSV, and the File / SFTP connectors and their operations. Repeated and blank frames have been removed. Times are positions in the video.

Notes for this day: [detailed-notes/day54.md](../../detailed-notes/day54.md) · [super-detailed-notes/day54.md](../../super-detailed-notes/day54.md) · [summary](../../day54.md)

| # | Time | Content |
|---|---|---|
| 01 | 2:24 | *Drawing:* scheduler → read file from the FTP server → transform → For Each insert into the DB; FTP to-dos: download/install an FTP server, configure it, develop the Mule app; formats JSON, XML, CSV |
| 02 | 4:55 | *Drawing:* source endpoint triggers the flow — fixed frequency or cron job; For Each 5 records ≈ 500 ms vs Bulk insert ≈ 120 ms |
| 03 | 11:12 | Google: "ftp servers" — an FTP server is a program for transferring files over a network (FileZilla) |
| 04 | 11:55 | Different FTP servers — FileZilla Server, Cerberus FTP, CompleteFTP, Titan, Core FTP, Files.com, Globalscape |
| 05 | 16:07 | Control Panel → Programs: removing an old FileZilla Server before a fresh install |
| 06 | 16:30 | FileZilla Server 0.9.x installer — licence agreement |
| 07 | 17:46 | FileZilla Server interface — connect to the admin interface (localhost, port, admin password) |
| 08 | 18:22 | FileZilla Server → Users: add a user, password, shared folder (home directory) with read/write permissions |
| 09 | 25:00 | employees.csv sample — empid, empname, empstatus, empsalary (100 Praveen A 75000, 1001 Ram Active 80000 …) |
| 10 | 36:42 | ftp-db-insert flow: Scheduler → Start Logger → **Read** employee CSV from the FTP server → CSV to Java transform → For Each [Before DB Logger → Insert → After DB Logger] → End Logger |
| 11 | 37:15 | Database Insert: `insert into EMPLOYEES_INFO values (:emp_id,:emp_name,:emp_status,:emp_salary,:emp_designation)` |
| 12 | 37:55 | MySQL Workbench — EMPLOYEES_INFO before the run |
| 13 | 42:54 | Debugger error: "Path '/EMP/employees.csv' doesn't exist" — the FTP read path must be relative to the user's home directory |
| 14 | 44:20 | FTP Config: working directory, transfer mode BINARY, passive mode, host localhost, port 21, username / password |
| 15 | 44:57 | FileZilla Server log — the Mule app connecting (USER, PASS, 230 Logged on, RETR employees.csv) |
| 16 | 54:05 | CSV to Java Transform: `output application/java` / `payload map ((item, index) -> {…})` |
| 17 | 55:45 | FTP **Read** operation: connector config FTP_Config, file path employees.csv, MIME type |
| 18 | 57:02 | Second flow: Read CSV from FTP → CSV to Java → **Bulk insert** into the database (one call) |
| 19 | 64:13 | ftp-db-demo flow: Scheduler → Logger → Select → Logger → Transform (DB rows to CSV) → Logger → **Write** to the FTP server → Logger |
| 20 | 75:18 | The written CSV opened on the FTP folder — rows exported from the database |
| 21 | 75:44 | Transform: `output application/csv` with `payload map ((item, index) -> { empId: item.emp_id as String, … })` |
| 22 | 76:04 | employees CSV opened in Excel — the exported records |
| 23 | 90:16 | Scheduler — scheduling strategy Fixed Frequency / Cron, time unit options |
| 24 | 95:43 | *Drawing (recap):* FTP server ↔ Mule app (read, write) with a scheduler, then insert/bulk insert to the DB |
| 25 | 98:03 | File connector config — working directory for local files |
| 26 | 98:38 | SFTP Config — host, port, username, password, preferred authentication methods, known hosts file |
| 27 | 99:34 | FTP / SFTP / File operations in the palette — Copy, Create directory, Delete, List, Move, Read, Rename, Write, On New or Updated File |
| 28 | 102:17 | Course modules (Notepad++) — Module 5 File, FTP and SFTP endpoints highlighted; remaining CI/CD, AWS S3, HTTPS, CloudHub 1.0 vs 2.0 |

---

### 01 — *Drawing:* scheduler → read file from the FTP server → transform → For Each insert into the DB; FTP to-dos: download/install an FTP server, configure it, develop the Mule app; formats JSON, XML, CSV
![drawing-ftp-sync](01-drawing-ftp-sync.jpg)

### 02 — *Drawing:* source endpoint triggers the flow — fixed frequency or cron job; For Each 5 records ≈ 500 ms vs Bulk insert ≈ 120 ms
![drawing-source-trigger](02-drawing-source-trigger.jpg)

### 03 — Google: "ftp servers" — an FTP server is a program for transferring files over a network (FileZilla)
![ftp-server-search](03-ftp-server-search.jpg)

### 04 — Different FTP servers — FileZilla Server, Cerberus FTP, CompleteFTP, Titan, Core FTP, Files.com, Globalscape
![ftp-server-options](04-ftp-server-options.jpg)

### 05 — Control Panel → Programs: removing an old FileZilla Server before a fresh install
![filezilla-uninstall](05-filezilla-uninstall.jpg)

### 06 — FileZilla Server 0.9.x installer — licence agreement
![filezilla-install](06-filezilla-install.jpg)

### 07 — FileZilla Server interface — connect to the admin interface (localhost, port, admin password)
![filezilla-connect](07-filezilla-connect.jpg)

### 08 — FileZilla Server → Users: add a user, password, shared folder (home directory) with read/write permissions
![filezilla-users](08-filezilla-users.jpg)

### 09 — employees.csv sample — empid, empname, empstatus, empsalary (100 Praveen A 75000, 1001 Ram Active 80000 …)
![employees-csv](09-employees-csv.jpg)

### 10 — ftp-db-insert flow: Scheduler → Start Logger → **Read** employee CSV from the FTP server → CSV to Java transform → For Each [Before DB Logger → Insert → After DB Logger] → End Logger
![ftp-flow](10-ftp-flow.jpg)

### 11 — Database Insert: `insert into EMPLOYEES_INFO values (:emp_id,:emp_name,:emp_status,:emp_salary,:emp_designation)`
![db-insert](11-db-insert.jpg)

### 12 — MySQL Workbench — EMPLOYEES_INFO before the run
![workbench-employees](12-workbench-employees.jpg)

### 13 — Debugger error: "Path '/EMP/employees.csv' doesn't exist" — the FTP read path must be relative to the user's home directory
![path-not-exist](13-path-not-exist.jpg)

### 14 — FTP Config: working directory, transfer mode BINARY, passive mode, host localhost, port 21, username / password
![ftp-config](14-ftp-config.jpg)

### 15 — FileZilla Server log — the Mule app connecting (USER, PASS, 230 Logged on, RETR employees.csv)
![filezilla-log](15-filezilla-log.jpg)

### 16 — CSV to Java Transform: `output application/java` / `payload map ((item, index) -> {…})`
![csv-to-java](16-csv-to-java.jpg)

### 17 — FTP **Read** operation: connector config FTP_Config, file path employees.csv, MIME type
![read-config](17-read-config.jpg)

### 18 — Second flow: Read CSV from FTP → CSV to Java → **Bulk insert** into the database (one call)
![bulk-insert-flow](18-bulk-insert-flow.jpg)

### 19 — ftp-db-demo flow: Scheduler → Logger → Select → Logger → Transform (DB rows to CSV) → Logger → **Write** to the FTP server → Logger
![write-flow](19-write-flow.jpg)

### 20 — The written CSV opened on the FTP folder — rows exported from the database
![written-csv](20-written-csv.jpg)

### 21 — Transform: `output application/csv` with `payload map ((item, index) -> { empId: item.emp_id as String, … })`
![transform-to-csv](21-transform-to-csv.jpg)

### 22 — employees CSV opened in Excel — the exported records
![excel-csv](22-excel-csv.jpg)

### 23 — Scheduler — scheduling strategy Fixed Frequency / Cron, time unit options
![scheduler-cron](23-scheduler-cron.jpg)

### 24 — *Drawing (recap):* FTP server ↔ Mule app (read, write) with a scheduler, then insert/bulk insert to the DB
![drawing-recap](24-drawing-recap.jpg)

### 25 — File connector config — working directory for local files
![file-config](25-file-config.jpg)

### 26 — SFTP Config — host, port, username, password, preferred authentication methods, known hosts file
![sftp-config](26-sftp-config.jpg)

### 27 — FTP / SFTP / File operations in the palette — Copy, Create directory, Delete, List, Move, Read, Rename, Write, On New or Updated File
![file-operations](27-file-operations.jpg)

### 28 — Course modules (Notepad++) — Module 5 File, FTP and SFTP endpoints highlighted; remaining CI/CD, AWS S3, HTTPS, CloudHub 1.0 vs 2.0
![course-modules](28-course-modules.jpg)

