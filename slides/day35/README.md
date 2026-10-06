# Day 35 — Slides and On-Screen Drawings

Screens from the Day 35 class (24 Dec 2024): creating a policies-demo-app API instance, API Autodiscovery, and deploying to CloudHub 2.0 with the platform client ID/secret properties (values as shown on screen, 2024 trial accounts). Repeated and blank frames have been removed. Times are positions in the video.

Notes for this day: [detailed-notes/day35.md](../../detailed-notes/day35.md) · [super-detailed-notes/day35.md](../../super-detailed-notes/day35.md) · [summary](../../day35.md)

| # | Time | Content |
|---|---|---|
| 01 | 0:02 | *Drawing (recap):* Basic Authentication; steps — publish API spec to Exchange, create an asset in API Manager (instance ID), configure Autodiscovery in the API implementation, deploy to RTM |
| 02 | 3:13 | Anypoint Platform sign-in — a student's trial account is used (the instructor's trial has expired) |
| 03 | 2:52 | Runtime Manager (org Prolifics, Sandbox): consumer-rest-service app, CloudHub 2.0 shared space |
| 04 | 11:45 | Studio: policies-demo-app — Listener → Logger → Transform Message `{"message": "policy executed successfully"}` |
| 05 | 13:40 | API Manager → Add API → **Create new API** (not from Exchange): name policies-demo-app, asset type HTTP |
| 06 | 16:09 | API Summary — policies-demo-app (v1), asset 1.0.0, **API Instance ID 20128624**, Unregistered |
| 07 | 16:57 | Studio Global Elements: HTTP Listener config + **API Autodiscovery** (API ID = instance ID, flow = main flow) |
| 08 | 18:15 | Studio → Anypoint Platform login (to link the account for Exchange / deployment); custom domain option |
| 09 | 19:29 | Export the project as a deployable jar (policies-demo-app.jar) |
| 10 | 20:56 | Runtime Manager → Deploy Application: Shared Space US East (Ohio), CloudHub 2.0; Java 8, 1 replica × 0.1 vCores, rolling update |
| 11 | 25:02 | Search: client ID/secret properties needed — `anypoint.platform.clientId` and `anypoint.platform.clientSecret` (mandatory) |
| 12 | 25:22 | Access Management → Business Groups / Prolifics: Business Group ID, **Client ID** fa94e08ffda24e31b682aa21e18d4086, Client Secret (Show) |
| 13 | 26:20 | Deploy → Properties: anypoint.platform.clientId / clientSecret; "Protect value?" — protected values can't be viewed later |
| 14 | 33:07 | Properties in Text view: `anypoint.platform.clientId=fa94e08f…4086`, `anypoint.platform.clientSecret=289598E5…1187` |
| 15 | 35:22 | Ingress (public endpoint after deployment) and Monitoring → Forward application logs to Anypoint Platform, INFO |
| 16 | 38:24 | Another student's account: MuleSoft "Verify Your Identity" (MFA code) during sign-in |
| 17 | 40:45 | Runtime Manager → Switch Environment: Sandbox (Active, Default) / Design |
| 18 | 42:44 | Business Groups / TCS: client ID/secret copied into the deploy properties (another account) |
| 19 | 45:41 | HTTP Listener config: HTTP, All Interfaces 0.0.0.0, port 8081 — CloudHub 2.0 deployment |
| 20 | 49:11 | consume-rest-serivice-1729 Running — public endpoint https://consume-rest-serivice-1729-rdn5gq.5sc6y6-3.usa-e2.cloudhub.io, Cloudhub-US-East-2 shared space |
| 21 | 52:59 | Runtime Manager → Private Spaces (Create private space) — dedicated network; TLS 1.1 deprecation notice |
| 22 | 54:22 | Runtime version: release channel Edge / Long Term Support / None, runtime 4.4.0 / 4.8.1 |

---

### 01 — *Drawing (recap):* Basic Authentication; steps — publish API spec to Exchange, create an asset in API Manager (instance ID), configure Autodiscovery in the API implementation, deploy to RTM
![drawing-recap-steps](01-drawing-recap-steps.jpg)

### 02 — Anypoint Platform sign-in — a student's trial account is used (the instructor's trial has expired)
![anypoint-login](02-anypoint-login.jpg)

### 03 — Runtime Manager (org Prolifics, Sandbox): consumer-rest-service app, CloudHub 2.0 shared space
![runtime-manager-apps](03-runtime-manager-apps.jpg)

### 04 — Studio: policies-demo-app — Listener → Logger → Transform Message `{"message": "policy executed successfully"}`
![policies-demo-app](04-policies-demo-app.jpg)

### 05 — API Manager → Add API → **Create new API** (not from Exchange): name policies-demo-app, asset type HTTP
![api-manager-create-new-api](05-api-manager-create-new-api.jpg)

### 06 — API Summary — policies-demo-app (v1), asset 1.0.0, **API Instance ID 20128624**, Unregistered
![api-summary-20128624](06-api-summary-20128624.jpg)

### 07 — Studio Global Elements: HTTP Listener config + **API Autodiscovery** (API ID = instance ID, flow = main flow)
![global-elements-autodiscovery](07-global-elements-autodiscovery.jpg)

### 08 — Studio → Anypoint Platform login (to link the account for Exchange / deployment); custom domain option
![studio-anypoint-login](08-studio-anypoint-login.jpg)

### 09 — Export the project as a deployable jar (policies-demo-app.jar)
![export-jar](09-export-jar.jpg)

### 10 — Runtime Manager → Deploy Application: Shared Space US East (Ohio), CloudHub 2.0; Java 8, 1 replica × 0.1 vCores, rolling update
![deploy-settings](10-deploy-settings.jpg)

### 11 — Search: client ID/secret properties needed — `anypoint.platform.clientId` and `anypoint.platform.clientSecret` (mandatory)
![google-client-id-props](11-google-client-id-props.jpg)

### 12 — Access Management → Business Groups / Prolifics: Business Group ID, **Client ID** fa94e08ffda24e31b682aa21e18d4086, Client Secret (Show)
![business-group-client-id](12-business-group-client-id.jpg)

### 13 — Deploy → Properties: anypoint.platform.clientId / clientSecret; "Protect value?" — protected values can't be viewed later
![protect-value](13-protect-value.jpg)

### 14 — Properties in Text view: `anypoint.platform.clientId=fa94e08f…4086`, `anypoint.platform.clientSecret=289598E5…1187`
![properties-text-view](14-properties-text-view.jpg)

### 15 — Ingress (public endpoint after deployment) and Monitoring → Forward application logs to Anypoint Platform, INFO
![ingress-logs](15-ingress-logs.jpg)

### 16 — Another student's account: MuleSoft "Verify Your Identity" (MFA code) during sign-in
![verify-identity](16-verify-identity.jpg)

### 17 — Runtime Manager → Switch Environment: Sandbox (Active, Default) / Design
![switch-environment](17-switch-environment.jpg)

### 18 — Business Groups / TCS: client ID/secret copied into the deploy properties (another account)
![tcs-client-id](18-tcs-client-id.jpg)

### 19 — HTTP Listener config: HTTP, All Interfaces 0.0.0.0, port 8081 — CloudHub 2.0 deployment
![listener-port-8081](19-listener-port-8081.jpg)

### 20 — consume-rest-serivice-1729 Running — public endpoint https://consume-rest-serivice-1729-rdn5gq.5sc6y6-3.usa-e2.cloudhub.io, Cloudhub-US-East-2 shared space
![running-public-endpoint](20-running-public-endpoint.jpg)

### 21 — Runtime Manager → Private Spaces (Create private space) — dedicated network; TLS 1.1 deprecation notice
![private-spaces](21-private-spaces.jpg)

### 22 — Runtime version: release channel Edge / Long Term Support / None, runtime 4.4.0 / 4.8.1
![runtime-version-lts](22-runtime-version-lts.jpg)

