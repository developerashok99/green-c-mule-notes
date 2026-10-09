# Day 36 — Fixing the CloudHub 2.0 Deployment, Basic Authentication and Client ID Enforcement

## Session Agenda
- Why the Day 35 deployment hung, and the fixes
- Project name vs. **artifactId**
- Deploying a fresh **policies-demo-api**; rolling update vs. recreate
- Applying and testing **Basic Authentication – Simple**
- Applying and testing **Client ID Enforcement** — request access, contracts, custom headers

## Why the Deployment Hung
- Property keys must be **`anypoint.platform.client_id`** and **`anypoint.platform.client_secret`**.
- The API instance ID in Autodiscovery had stray digits.
- The app name clashed with an asset created in the background by API Manager; renaming the project **and** its artifactId fixed it.

## Name vs. artifactId
- Refactor → Rename changes the project name but **not** the `<artifactId>` in `pom.xml`.
- Repositories identify a project by its artifactId; two projects with the same one give **"Conflicting Maven coordinates"**.
- Keep the artifactId and the application name the same; don't rename an application once its repository exists.

## Deploying and Going Active
- **Rolling update** keeps the old version running until the new one is up (no downtime); **Recreate** kills it first. Rolling update is the usual choice.
- On CloudHub 2.0, 0.1 vCore comes with 1.2 GB.
- After deployment the API changes from **Unregistered** to **Active** — the app and API Manager are connected.

## Basic Authentication – Simple
- One username/password for all consumers (akash / akash@123 in class).
- Correct credentials → 200; wrong or missing → **401 "Authentication Attempt Failed"**, rejected at the gateway so nothing reaches the app's logs.
- Postman's Basic Auth sends `Authorization: Basic <Base64(username:password)>`; `Basic` must be written exactly.

## Client ID Enforcement
- Each consumer gets its own **client ID and secret**.
- Get them through **Exchange → Request access** → create an application (consumer-1, consumer-2).
- Each request creates a **contract** in API Manager; the secret is shown under **Exchange → My applications**.
- Consumers send them either as HTTP Basic (ID as username, secret as password) or in custom headers (`client_id` / `client_secret`, renamed to `c_id` / `c_secret` in the demo).
- Wrong or missing → **401 "Invalid Client"**.
- Internal departments may share one pair if the architect decides.

## Quick Recap
- The hang came from wrong key names, a bad instance ID and a name clash.
- artifactId, not the name, is a project's identity.
- Basic auth = one shared credential; Client ID Enforcement = one credential pair per consumer.
- Next: rate limiting, SLA, IP allow/block lists.
