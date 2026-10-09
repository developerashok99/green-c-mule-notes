# Day 54 — FTP with FileZilla: CSV into the Database, DB Rows to a File, File and SFTP Connectors

## Session Agenda
- What **FTP** is and the scheduler-based file requirement
- Installing and configuring **FileZilla Server**
- Flow 1 — FTP Read → **For Each** insert; Flow 2 — **Bulk insert**
- FTP operations, **List** in 1.x vs 2.x
- Flow 3 — DB Select → **Write** a file to FTP; write modes
- **File** vs **FTP** vs **SFTP**

## FTP and FileZilla
- FTP = File Transfer Protocol; files are read/written periodically by integrations.
- FTP servers are run by a separate team; FileZilla Server 0.9.x is installed here only for practice.
- Admin UI: localhost **14147**, password **admin**; user **mahesh / mahesh**, shared folder with alias `/emp`, all permissions.

## Reading a CSV into the Database
- CSV = header row + data rows; separators comma, pipe or tab.
- Scheduler → **FTP Read** (`employees.csv`) → CSV to **Java** → **For Each** → Insert into `EMPLOYEES_INFO`.
- FTP Config: working directory `EMP`, BINARY, passive, localhost, port **21**, mahesh/mahesh.
- File path = working directory + file name, or the full path; a wrong path gave "Path '/EMP/employees.csv' doesn't exist".
- **Bulk insert** version: one DB call (≈120 ms vs ≈500 ms for 5 records with For Each).

## FTP Operations
- Copy, Create directory, Delete, List, Move, Read, Rename, Write, and the **On New or Updated File** source (polling, Auto delete).
- List: 1.x returns names + content; 2.x names only — use List + Read.
- Move or delete files after processing.

## Writing a File from the Database
- DB Select → transform → FTP **Write**.
- Write modes **Overwrite / Append / Create new**; Append needs **delta** data (watermarking).
- Excel output had to be repaired — use CSV if Excel fails.
- Ask about volume, frequency, FTP user/SPOC and open ports before building.

## File vs FTP vs SFTP
- **File** — file on the same server as the Mule runtime; path only.
- **FTP** — FTP server; **SFTP** — secure FTP with extra authentication settings.

## Quick Recap
- One connector family, three connectors, same operations.
- Read CSV → Java → For Each/Bulk insert; DB → Write file.
- Remaining modules: CI/CD, AWS S3, HTTPS, CloudHub 1.0 vs 2.0.
