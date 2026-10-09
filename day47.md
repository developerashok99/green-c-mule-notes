# Day 47 — Salesforce Connector Part 2: Create, Upsert, On New / On Modified Object and the Scheduler

## Session Agenda
- Course status — what's pending
- **Create** — mapping, Java output, the 200-record limit
- Reading per-record results and errors
- **Upsert**, Update, Delete
- **On New Object** and **On Modified Object** sources
- **Scheduler** — fixed frequency, start delay, cron, time zones

## Create
- Mapping sheet from the Salesforce team: send every mandatory field.
- Transform with `output application/java`: `Name`, `AnnualRevenue: item.annualRevenue as Number`.
- Java avoids date-type conflicts; JSON works only without dates.
- Max **200 records** per call — limit the source, batch with For Each, or use bulk Create Job.

## Results and Errors
- `payload.successful` = all records OK; `payload.items[n].successful` = each record.
- ABC / DEF / XYZ Company created from Postman `POST /create`.
- "invalid number: abcde" → INVALID_TYPE_ON_FIELD_IN_RECORD for that record only.
- A CONNECTIVITY error while Test Connection passes means a data issue — ask the Salesforce team.

## Upsert
- Update if the record exists, insert if not; Update and Delete are separate operations.

## Polling Sources
- On New Object fires for new records; On Modified Object for updated ones.
- Default fixed frequency 1000 ms; records arrive one object at a time.
- Use reconnection **forever** on sources.
- Alternative: Scheduler + Query + last-processed number in an Object Store.

## Scheduler
- Fixed frequency (every N units, optional start delay) or **cron** (e.g. `0 0 20 * * ?` = 8 PM daily).
- Set a time zone ID such as `Asia/Kolkata`.
- A scheduled DB-to-DB flow is an **integration**, not an API.

## Quick Recap
- Create: Java, field names, ≤ 200 records.
- Check `successful` and `items`.
- On New / On Modified Object for Salesforce changes.
- Cron for fixed times.
