# Day 35 — Applying Policies in Practice: API Instance, Autodiscovery, CloudHub 2.0 Deployment

## Session Agenda
- Recap of the four steps used to apply any policy
- A dummy **policies-demo-app** for testing policies on a new Anypoint account
- **Create new API** in API Manager without an Exchange spec
- **API Autodiscovery** with the API instance ID
- Deploying to **CloudHub 2.0** with the platform client ID and secret
- Shared space vs. private space; release channels

## One Procedure for Every Policy
- Publish the API spec to **Exchange** (or create a new API directly in API Manager).
- Create the API in **API Manager** → a unique **API instance ID** is generated.
- Add an **API Autodiscovery** global element with that ID, pointing to the main flow.
- **Deploy**; the app connects to API Manager and downloads its policies.

## Creating the API Instance
- The old trial account had expired, so a new account and a small **policies-demo-app** (Listener → Logger → Transform) were used.
- **Add new API → Mule Gateway → Create new API**, asset type **HTTP API** (no RAML).
- **Client provider:** Anypoint by default; Okta or Auth0 if admins configure them in Access Management.
- The API shows **Unregistered** until an app with its instance ID is deployed (instance ID 20128624 on screen).

## Deploying to CloudHub 2.0
- Upload the exported jar in **Runtime Manager**, target a shared space.
- Add the org credentials as properties: **`anypoint.platform.client_id`** and **`anypoint.platform.client_secret`** (the class typed `clientid`; corrected on Day 36).
- The values come from **Access Management → Business Groups → Settings**; in real projects the pipeline passes them.
- **Protect value** hides a property and can't be undone.
- Endpoints on CloudHub 2.0 are **HTTPS** by default.

## Shared vs. Private Space
- **Shared space:** shared with other Anypoint customers, shared load balancer and logs — fine for practice.
- **Private space:** dedicated to your organization and able to reach private networks — what real organizations use.
- **Release channel:** Edge (latest), Long Term Support, or None (pick a specific runtime).

## Quick Recap
- Every policy uses the same four steps: Exchange → API Manager → Autodiscovery → deploy.
- The deployed app needs the org's `client_id` and `client_secret` to talk to API Manager.
- The deployment hung in class; the cause and fix are on Day 36.
