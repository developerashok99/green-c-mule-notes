# Day 35 — Applying Policies in Practice: Create an API Instance, Autodiscovery, and Deploying to CloudHub 2.0

> **Sources:**
> - Cleaned audio transcript ([transcripts-cleaned/day35.txt](../transcripts-cleaned/day35.txt)) and the class video (recorded 24 Dec 2024).
> - Text marked *screen* or *drawing* is read from the recording.
> - Slide images: [slides/day35](../slides/day35/).

## 1. Overview

1. Recap — the four steps to apply any policy
2. Why a separate **policies-demo-app** instead of the HR project
3. **Create new API** in API Manager (no Exchange spec) and the client provider
4. **API Autodiscovery** with the instance ID
5. Other ways to deploy (Deploy to CloudHub from Studio)
6. Deploying to **CloudHub 2.0** — target space, properties
7. **`anypoint.platform.client_id` / `client_secret`** — where they come from, protecting values
8. **Shared space vs. private space**
9. The deployment that never finished (fixed on Day 36)
10. Release channel and runtime version

---

## 2. Recap — One Procedure for Every Policy

*Drawing:* the same four steps apply to every policy, with small changes:

1. **Publish** the API spec from Design Center to **Exchange**.
2. **Create the API asset** in **API Manager** → a unique **API instance ID** is generated.
3. Create the **API Autodiscovery** global element with that instance ID, pointing to the main (APIkit Router) flow.
4. **Deploy** the application to Runtime Manager.

After deployment, API Manager and Runtime Manager connect, and through the auto-discovery ID the app finds its API and downloads the policies.

---

## 3. Why a Dummy Application

- The Anypoint account had to change (the old trial expired). *Screen:* a student's trial account (org Prolifics, Sandbox) is used.
- The HR project (`hr-employees-sapi-7303`) still refers to assets in the **old** account (e.g. the fragment from its Exchange), so deploying it to the new account won't work.
- Importing, exporting and fixing everything takes time, so a small **policies-demo-app** is built only to test policies — no RAML, no APIkit Router.

*Screen:* policies-demo-app — Listener → Logger → Transform `{"message": "policy executed successfully"}`.

> **Tip:** to copy an application's exact name, right-click the project → **Refactor → Rename** and copy it from the dialog (without changing it).

---

## 4. Create New API (Without Exchange)

**API Manager → Add API → Add new API:**

| Step | Choice |
|---|---|
| Runtime | **Mule Gateway**, connect to the existing application (no proxy), Mule 4 |
| API | **Create new API** (the spec isn't in Exchange) |
| Name | Same as the application: `policies-demo-app` |
| Asset type | **HTTP API** — a simple API with no RAML; a full implementation would be a REST API |
| Client provider | **Anypoint** (default) |
| Upstream URL | Optional — left empty |

*Screen:* API Summary — policies-demo-app (v1), asset 1.0.0, **API Instance ID 20128624**, **Unregistered**.

### 4.1 Client provider

- Decides **who generates client IDs and secrets** when the Client ID Enforcement policy is used.
- Default **Anypoint**; organizations using **Okta** or **Auth0** select those from the dropdown.
- Set up by admins (mostly the DevOps team) in **Access Management**; changing it there reflects here. Usually a single provider is configured.

### 4.2 Interview question

> **What is the role of auto-discovery / the API instance ID?** The instance ID is a unique ID for the API in API Manager. Auto-discovery takes this ID and uses it to find the application's API in API Manager, so the policies can be applied.

The status stays **Unregistered** until an app with this ID is deployed.

---

## 5. API Autodiscovery

- **Global Elements → API Autodiscovery.**
- API ID: the instance ID — hard-coded here (normally from a property file).
- Flow name: the **main flow**. With an APIkit configuration, choose the main flow that has the Listener and APIkit Router.
- *Screen:* Global Elements — HTTP Listener config + API Autodiscovery.

---

## 6. Ways to Deploy

| Way | Notes |
|---|---|
| Export a jar → upload in Runtime Manager | Used in class |
| Studio: right-click → **Anypoint Platform → Deploy to CloudHub** | Needs the Studio–Anypoint login; organizations may use a **custom domain** (e.g. a bank's corporate account) |
| **CI/CD pipeline** | How real projects deploy — built by a separate team |

> **Instructor's view:** real projects deploy through the pipeline; doing it by hand here is so you know where the properties go and who passes them.

---

## 7. Deploying to CloudHub 2.0

*Screen:* **Runtime Manager → Deploy Application** — Shared Space US East (Ohio), CloudHub 2.0; Java 8, 1 replica × 0.1 vCores, rolling update.

1. Upload the jar (Downloads); fix the name.
2. Target space: shared space.
3. `mule.env` and `secure.key` aren't needed — this app has no environments or encrypted properties.
4. Add the **platform client ID and secret** (section 8).
5. Deploy.

---

## 8. Platform Client ID and Secret

**Why:** two things are needed for the app to get its policies:

1. **Client ID + secret** → Runtime Manager can establish communication with API Manager.
2. **API instance ID** (in the jar via Autodiscovery) → it can find the right API.

### 8.1 Where the values come from

**Access Management → Business Groups → the org → Settings** (*screen:* Business Group ID, **Client ID**, **Client Secret** (Show)).

- Developers often don't have access to Access Management; colleagues or the **pipeline** hold these values.
- These are the **organization's** credentials — not the client ID/secret created by the Client ID Enforcement policy.

### 8.2 The keys

The instructor couldn't remember the exact key names and searched for them (*screen:* search result — `anypoint.platform.clientId` / `anypoint.platform.clientSecret`, mandatory):

```properties
anypoint.platform.client_id=<client id>
anypoint.platform.client_secret=<client secret>
```

> **Correction (Day 36):** the keys typed in class (`clientid`) were wrong; they must be **`client_id`** and **`client_secret`**.

- No need to memorize them — they come from the pipeline.
- After a pipeline deploy, Runtime Manager → application → **Properties** shows them, so they can be copied for a new app.
- *Screen:* the same properties in **Text view**.

### 8.3 Protecting a value

- **Protect value?** hides it like a password.
- A protected value **can't be unprotected** — you can only delete it and enter it again, so keep the original somewhere safe.

---

## 9. Shared Space vs. Private Space

| | Shared space | Private space |
|---|---|---|
| Who's on it | Shared with other Anypoint customers | Dedicated to your organization |
| Load balancer, logs | Shared | Your own |
| Access | Public | Only those you allow; can reach private networks |
| Used for | Practice | Real organizations |

- *Screen:* "Public spaces are shared with other Anypoint Platform customers. Use a private space if your applications need to access external private networks."
- *Screen:* **Private Spaces → Create private space**; a notice that private spaces' ingress will stop supporting **TLS 1.1** from 15 January.

---

## 10. The Deployment That Didn't Finish

- The deployment kept waiting, with no logs. *Screen:* Ingress (public endpoint) and Monitoring → forward application logs to Anypoint Platform, INFO.
- Tried: another student's account (*screen:* MuleSoft "Verify Your Identity" MFA code), switching environment (*screen:* Sandbox / Design), recreating the API, re-entering the properties (*screen:* Business Groups / TCS values).
- An older app (consume-rest-service) on the same account was **Running** (*screen:* public endpoint …cloudhub.io, CloudHub US East 2), so the account wasn't the problem.
- Removing Autodiscovery and the Listener config to isolate it didn't finish in class.

The cause was found on **Day 36**: wrong property key names, stray digits in the instance ID, and a name clash with a background Exchange asset.

> **Instructor's view:** "Today's session was largely wasted — nothing productive could be done." The fix is in Day 36.

### 10.1 HTTPS by default

On CloudHub 2.0 the app's endpoint is **HTTPS** by default, which is why the earlier test over HTTP didn't respond.

---

## 11. Release Channel and Runtime Version

*Screen:* release channel **Edge / Long Term Support / None**:

| Channel | Runtime offered |
|---|---|
| Edge | The latest (4.8.x on screen) |
| Long Term Support | 4.6.x |
| None | Lets you pick e.g. 4.4.0 |

The defaults are fine; in real projects the pipeline sets it.

---

## 12. Important Terminology

| Term | Meaning |
|---|---|
| Create new API | Register an API in API Manager without a spec in Exchange |
| HTTP API (asset type) | A simple API registered without RAML |
| Client provider | System that issues client IDs/secrets for Client ID Enforcement (Anypoint, Okta, Auth0) |
| API instance ID | Unique ID of the API in API Manager, used by Autodiscovery |
| `anypoint.platform.client_id` / `client_secret` | Org credentials that let the deployed app connect to API Manager |
| Protected property | A deploy property hidden like a password; can't be revealed again |
| Shared / private space | CloudHub 2.0 deployment targets — shared with others / dedicated to your org |
| Release channel | Edge, Long Term Support or None — which runtime versions are offered |

---

## 13. Interview Questions

### Q1. What steps are needed to apply a policy to a Mule API?
Publish the spec to Exchange (or create a new API), create the API in API Manager to get the instance ID, add API Autodiscovery with that ID to the app, and deploy it with the platform client ID/secret.

### Q2. What is the role of API Autodiscovery and the instance ID?
The instance ID identifies the API in API Manager; Autodiscovery uses it so the running app is linked to that API and enforces its policies.

### Q3. Why does the deployed app need the platform client ID and secret?
They let the runtime authenticate to the Anypoint control plane (API Manager) so it can download policies.

### Q4. Shared space or private space?
Shared spaces are shared with other customers — fine for practice. Organizations use private spaces: dedicated network, own load balancer, access to private networks.

---

## 14. Must Remember

1. Same four steps for every policy: Exchange → API Manager → Autodiscovery → deploy.
2. **Create new API** (HTTP API) when there's no spec in Exchange.
3. Status is **Unregistered** until the app connects.
4. Deploy properties: `anypoint.platform.client_id` and `anypoint.platform.client_secret` (underscores).
5. These are the **org's** credentials from Access Management → Business Groups.
6. A protected property can't be unprotected.
7. Organizations deploy to **private spaces**, through **pipelines**.
8. CloudHub 2.0 endpoints are **HTTPS** by default.
