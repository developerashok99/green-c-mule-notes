# Day 33 — Slides and On-Screen Drawings

Slides and drawings from the Day 33 class (20 Dec 2024): what OAuth 2.0 is, authentication vs authorization, the GeeksforGeeks/Facebook sign-in demo, the Authorization Code Grant flow and the OAuth terminology. The last three slides were flicked through at the end and are taught on Day 34. Repeated and blank frames have been removed. Times are positions in the video.

Notes for this day: [detailed-notes/day33.md](../../detailed-notes/day33.md) · [super-detailed-notes/day33.md](../../super-detailed-notes/day33.md) · [summary](../../day33.md)

| # | Time | Content |
|---|---|---|
| 01 | 0:01 | Agenda: understanding OAuth 2.0, understanding JWT |
| 02 | 13:18 | What is OAuth 2.0? — Open Authorization; an authorization framework, not an authentication protocol; lets an app access a user's resources hosted on another application on their behalf without sharing credentials (annotated: OAuth 2.0 vs 1.0, less secure) |
| 03 | 12:54 | *Drawing:* Authentication = verify the user's identity; Authorization = provide restricted access; OpenID Connect for authentication, OAuth for authorization |
| 04 | 17:12 | GeeksforGeeks "Please Login To Continue" — sign up with e-mail/password or with Google, Facebook, LinkedIn, GitHub |
| 05 | 21:18 | Facebook consent: "GeeksforGeeks is requesting access to: your name and profile picture and email address" — Continue / Cancel |
| 06 | 18:31 | Zomato sign-up — the example client app used in the flow diagram |
| 07 | 13:25 | OAuth 2.0 Flow — Authorization Code Grant: User, Client (Zomato), Authorization Server, Resource Server (profile details, friends list, photos, location tags); authCode → token + client credentials → accessToken → getProfiles |
| 08 | 38:08 | The same flow annotated — Ramesh (resource owner) via browser, redirect URL, consent, authCode exchanged at the back end for the access token |
| 09 | 40:04 | Terminology: resource owner, resource server, client, authorization server |
| 10 | 40:06 | Terminology: authorization code (temporary), access token, refresh token (long-lived, gets a new access token) |
| 11 | 40:07 | Terminology: OAuth dance / OAuth flow |
| 12 | 67:05 | Terminology: authentication — verifying identity at the authorization server |
| 13 | 68:18 | Terminology: authorization — granting permission; scope decides access level |
| 14 | 68:39 | Terminology: grant (authorization code, client credentials, resource owner password) and redirect URI |
| 15 | 63:55 | Terminology: scope and OAuth actors |
| 16 | 40:10 | *Drawing:* mobile app (MA) → MA server (holds client ID/secret) → resource server (GAPI protected by OAuth); the MA server registers with the OAuth server and gets a token first |
| 17 | 71:44 | Grant type — Authorization Code: token from the authorization code; sign-up via third-party apps; data owned by the user on the third-party app |
| 18 | 71:30 | (Deck scrolled at the end — taught on Day 34) OAuth 2.0 Flow — Client Credentials Grant |
| 19 | 71:35 | (Day 34 preview) OAuth 2.0 Flow — Resource Owner Password Grant |
| 20 | 71:55 | (Day 34 preview) JWT — JSON Web Token; compact, self-contained JSON object; header, payload and signature separated by dots |
| 21 | 23:32 | Sign in with Google "to continue to GeeksforGeeks" (incognito, accounts.google.com) |
| 22 | 23:42 | Google password step — the password is typed on Google, never on GeeksforGeeks |
| 23 | 23:55 | Google consent: "Google will share your name, email address, language preference, and profile picture with GeeksforGeeks" — Cancel / Continue |
| 24 | 26:28 | Back on GeeksforGeeks: account created (profile maheshrew9nd) from the Google details |

---

### 01 — Agenda: understanding OAuth 2.0, understanding JWT
![agenda](01-agenda.jpg)

### 02 — What is OAuth 2.0? — Open Authorization; an authorization framework, not an authentication protocol; lets an app access a user's resources hosted on another application on their behalf without sharing credentials (annotated: OAuth 2.0 vs 1.0, less secure)
![what-is-oauth](02-what-is-oauth.jpg)

### 03 — *Drawing:* Authentication = verify the user's identity; Authorization = provide restricted access; OpenID Connect for authentication, OAuth for authorization
![drawing-authn-authz](03-drawing-authn-authz.jpg)

### 04 — GeeksforGeeks "Please Login To Continue" — sign up with e-mail/password or with Google, Facebook, LinkedIn, GitHub
![gfg-signup](04-gfg-signup.jpg)

### 05 — Facebook consent: "GeeksforGeeks is requesting access to: your name and profile picture and email address" — Continue / Cancel
![facebook-consent](05-facebook-consent.jpg)

### 06 — Zomato sign-up — the example client app used in the flow diagram
![zomato-signup](06-zomato-signup.jpg)

### 07 — OAuth 2.0 Flow — Authorization Code Grant: User, Client (Zomato), Authorization Server, Resource Server (profile details, friends list, photos, location tags); authCode → token + client credentials → accessToken → getProfiles
![auth-code-flow](07-auth-code-flow.jpg)

### 08 — The same flow annotated — Ramesh (resource owner) via browser, redirect URL, consent, authCode exchanged at the back end for the access token
![auth-code-flow-annotated](08-auth-code-flow-annotated.jpg)

### 09 — Terminology: resource owner, resource server, client, authorization server
![terms-actors](09-terms-actors.jpg)

### 10 — Terminology: authorization code (temporary), access token, refresh token (long-lived, gets a new access token)
![terms-tokens](10-terms-tokens.jpg)

### 11 — Terminology: OAuth dance / OAuth flow
![terms-oauth-dance](11-terms-oauth-dance.jpg)

### 12 — Terminology: authentication — verifying identity at the authorization server
![terms-authentication](12-terms-authentication.jpg)

### 13 — Terminology: authorization — granting permission; scope decides access level
![terms-authorization](13-terms-authorization.jpg)

### 14 — Terminology: grant (authorization code, client credentials, resource owner password) and redirect URI
![terms-grant-redirect](14-terms-grant-redirect.jpg)

### 15 — Terminology: scope and OAuth actors
![terms-scope-actors](15-terms-scope-actors.jpg)

### 16 — *Drawing:* mobile app (MA) → MA server (holds client ID/secret) → resource server (GAPI protected by OAuth); the MA server registers with the OAuth server and gets a token first
![drawing-scope](16-drawing-scope.jpg)

### 17 — Grant type — Authorization Code: token from the authorization code; sign-up via third-party apps; data owned by the user on the third-party app
![grant-auth-code-summary](17-grant-auth-code-summary.jpg)

### 18 — (Deck scrolled at the end — taught on Day 34) OAuth 2.0 Flow — Client Credentials Grant
![client-credentials-flow](18-client-credentials-flow.jpg)

### 19 — (Day 34 preview) OAuth 2.0 Flow — Resource Owner Password Grant
![password-grant-flow](19-password-grant-flow.jpg)

### 20 — (Day 34 preview) JWT — JSON Web Token; compact, self-contained JSON object; header, payload and signature separated by dots
![jwt-intro](20-jwt-intro.jpg)

### 21 — Sign in with Google "to continue to GeeksforGeeks" (incognito, accounts.google.com)
![google-signin](21-google-signin.jpg)

### 22 — Google password step — the password is typed on Google, never on GeeksforGeeks
![google-password](22-google-password.jpg)

### 23 — Google consent: "Google will share your name, email address, language preference, and profile picture with GeeksforGeeks" — Cancel / Continue
![google-consent](23-google-consent.jpg)

### 24 — Back on GeeksforGeeks: account created (profile maheshrew9nd) from the Google details
![gfg-profile](24-gfg-profile.jpg)
