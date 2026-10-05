# Day 14 — Property Files, Externalisation per Environment, Run Configurations and Secure Properties

> **Sources:** audio transcript, existing notes, and the class video (recorded 25 Nov 2024; the class used two decks, "13th Day" and "14th Day"). Slide text, drawings and screens marked *slide*, *drawing* or *screen* are read from the recording. Slide images: [slides/day14](../slides/day14/).

## 1. Overview

> **Instructor's note:** few interview questions come from this topic, but it is used **compulsorily in real project work every day**.

1. Why hard-coded values break across environments
2. Externalising properties: one property file per environment
3. YAML vs. `.properties` syntax
4. The four steps: files → Configuration Properties global element → reference properties → pass environment at runtime
5. `${...}` vs. `p('...')`
6. Running with **Run/Debug Configurations**
7. Encryption basics and **Secure Properties**

---

## 2. The Problem — Hard-Coded Values

### 2.1 Scenario

The weather application calls a third-party REST API and (in this example) a database. Each environment has its own values:

*Drawing* — **Importance of externalizing properties** (environments Dev, SIT, UAT, preprod, prod, DR):

| Environment | ① REST service — HTTP Req | ② Database |
|---|---|---|
| Dev | `dev.api…` | `10.1.25.50` port **330** |
| UAT | `uat.api.openweathermap.org` | `10.1.25.51` port 330 |
| Prod | `api.openweathermap.org` | `10.1.25.52` port 330 |

(The Dev/UAT hosts are illustrative; only the Prod host is real. Port 330 matches the instructor's MySQL from Day 05 — MySQL's default is 3306.)

The API key (secret) also differs per environment.

### 2.2 What goes wrong

If Dev values are typed directly (hard-coded) into the connector configurations, the same app deployed to UAT or Prod still uses **Dev** values. Prod would connect to test systems/data — wrong mapping.

### 2.3 Solution — externalise properties

> Move environment-specific values (host, port, path, keys, credentials) out of the code into **property files**, **one per environment**, and pick the right file dynamically when deploying.

### 2.4 Environments in this example

Ideally: Dev, SIT, UAT, Pre-prod, Prod, DR. This application uses three: **Dev, UAT, Prod**.

Students mentioned other names (Stage, LT for load testing, Post-prod). **Different terminologies, same idea.** Create one file per environment you actually have — 6 environments → 6 files; 2 → 2.

### 2.5 Third-party environments

Ask the third party, preferably by email, what their Dev/UAT/Prod endpoints and keys are. Sometimes they don't have separate environments, and your UAT may have to use their Dev (or another) environment. Confirm in writing and configure accordingly.

---

## 3. YAML vs. `.properties`

Property files can be:

- **`.yaml`**
- **`.properties`**

They differ only in **syntax**. No performance difference; the architect/organisation chooses.

### 3.1 YAML example (*slide* — "difference between .yaml and .properties")

```yaml
#### HTTP Listener Config Details ####

http:
  listener:
    host: "0.0.0.0"
    port: "8081"
    path: "/weather"

#### Weather REST Service Config Details ####

weather:
  request:
    host: "api.openweathermap.org"
    port: "80"
    path: "/data/2.5/weather"
  reconnection:
    frequency: "2000"
    attempts: "3"
```

(The API key was added to the same file during the demo as another `weather` key; its value is not reproduced.)

- `#` = **comment**. Use comment **headings** per configuration (listener, weather request, …). In real projects there are 10–15 configurations; headings make files readable. **Best practice.**
- Nesting by **indentation**: `http:` → newline → indented `listener:` → indented `host`, `port`, `path`. The full key is `http.listener.host`.
- Nesting avoids repeating `http.listener.` for every key.
- Use clear prefixes per system (e.g. `weather.`) — an API may call several services.

### 3.2 `.properties` example

```properties
#### HTTP Listener Config Details ####

http.listener.host= 0.0.0.0
http.listener.port= 8081
http.listener.path= /weather

#### Weather REST Service Config Details ####

weather.request.host= api.openweathermap.org
weather.request.port= 80
weather.request.path= /data/2.5/weather
weather.reconnection.frequency= 2000
weather.reconnection.attempts= 3
```

Note the reconnection strategy's frequency and attempts (Day 13) are externalised too.

**Key names are the same in every environment's file; only the values change.**

### 3.3 Shortcut

**Ctrl + /** comments or uncomments selected lines.

---

## 4. Step 1 — Create Property Files per Environment

**Location:** `src/main/resources` — resources needed to run the project (Day 08).

**Best practice:** create a folder, commonly named **`config`**, and put all environment files in it.

```text
src/main/resources/
└── config/
    ├── dev.yaml
    ├── uat.yaml
    └── prod.yaml
```

How: right-click `src/main/resources` → New → Folder → `config`; right-click `config` → New → File → `dev.yaml`. Create the others the same way, or copy/paste (Ctrl+C, Ctrl+V) and rename.

### What to externalise

Everything environment-related: the **Listener** configuration (host, port, path) and every **connector** configuration (HTTP Request, Database, …).

**Why externalise the Listener port?** On CloudHub, HTTP and HTTPS services use specific ports (8081/8082), and with a dedicated load balancer they must be 8091/8092 — so the port differs by deployment. Explained in the deployment sessions.

> **Technical clarification:** on CloudHub 1.0 the convention is `http.port` 8081 / `https.port` 8082 for the shared load balancer and 8091 / 8092 when a dedicated load balancer is used.

---

## 5. Step 2 — Configuration Properties Global Element

*Slide* — **Properties implementation steps:** Prepare property file for each environment · Configure configuration property global element · Configure the properties in components ( ${key} ) and Dataweave ( Mule::p('key') ) · Pass the runtime arguments and deploy.

1. Open the XML → **Global Elements** tab → **Create**.
2. **Global Configurations → Configuration properties** (or search "configuration properties").
3. **File:** choose the file, e.g. `config/dev.yaml`.

The path is **relative to `src/main/resources`** — Studio looks there first. Backslash or forward slash both work; if you see a problem, use forward slash.

A hard-coded file (`config/dev.yaml`) always loads Dev — not what we want. Make it **dynamic**:

```text
File: config/${mule.env}.yaml
```

`mule.env` is a variable whose value (dev/uat/prod) is supplied at deployment (Step 4). Its name is decided by the **organisation/architect** (e.g. `mule.env`, `env`).

```xml
<configuration-properties doc:name="Configuration properties"
                          file="config/${mule.env}.yaml" />
```

---

## 6. Step 3 — Reference Properties in Components

### 6.1 In configuration fields: `${key}`

Listener configuration → Edit:

| Field | Value |
|---|---|
| Host | `${http.listener.host}` |
| Port | `${http.listener.port}` |

Listener path: `${http.listener.path}`.

HTTP Request configuration: Host `${weather.request.host}`, Port `${weather.request.port}`; operation path `${weather.request.path}`; reconnection Frequency `${weather.reconnection.frequency}`, Attempts `${weather.reconnection.attempts}`.

At runtime Mule looks up the key in the loaded property file and substitutes its value.

### 6.2 Inside DataWeave: `p('key')`

In fx/DataWeave (e.g. the `appid` query parameter, which is an expression):

```dataweave
{
  q: payload.city,
  appid: p('weather.appid')      // key name representative
}
```

- `${...}` does **not** work inside DataWeave.
- Use the **`p`** function (small p) with the key in **single quotes** — written on the slide as `Mule::p('key')`; `p('key')` works too.
- **Instructor:** "There's no particular reason — it's the syntax."

### 6.3 Question: is the same host used in test and prod?

The **key** (e.g. `weather.request.host`) is the same in every file. The **value** differs. Code always references the key; the environment's file supplies the value.

---

## 7. Step 4 — Pass the Environment: Run / Debug Configurations

Until now: right-click → Run/Debug. To pass `mule.env`, use a configuration.

1. **Run → Run Configurations…** (or **Debug Configurations…**).
2. Create a **new configuration**, e.g. `prod-configuration`.
3. **Project:** select the application (all open projects are listed; the app selected here is deployed).
4. **Environment** tab → add variable **`mule.env`** = **`prod`** (or dev/uat). The name must match the one used in the global element.
5. **Apply** → **Run** (or **Debug**).

Mule resolves `config/${mule.env}.yaml` → `config/prod.yaml` and uses Prod values.

**Toolbar shortcuts:** the Run (play) and Debug (bug) buttons have drop-downs listing configurations. Clicking the button directly uses the **configuration listed first/most recent** — check which one you're using.

### 7.1 Errors seen in the demo

- After externalising, the Listener path became `/weather` instead of the previous `/weather/city` — the old URL no longer matched. Use the new path.
- `You called the function '-' with these arguments: null and Number` → in debug, the target variable showed **"city not found" (404)**. A wrong city name had been sent; because the **success status code validator** included 404 (Day 13), it didn't raise an error at the request and failed later in the mapping.
- With UAT values, **"could not resolve the address"** — the illustrative UAT host doesn't really exist. In a real project you'd get the correct UAT host from the provider.

### 7.2 Switching to `.properties`

The instructor copied a folder `config1` containing `dev.properties`, `uat.properties`, `prod.properties`, and changed the global element's file to `config1/${mule.env}.properties`. It worked the same way — only syntax differs.

---

## 8. Encryption Basics

### 8.1 Problem

DB username, password, host and port were placed in the property file. Putting a **password** (or secret key) in plain text is **not correct** — anyone reading the file sees it. Sensitive values must be **encrypted**.

### 8.2 Encryption and decryption — WhatsApp analogy

```text
"Hi Ramesh, how are you?"  ──encrypt (key + algorithm)──►  "xYz8#k2…"
                                                              │ travels
"Hi Ramesh, how are you?"  ◄──decrypt (key + algorithm)───────┘
```

WhatsApp messages are encrypted end to end. If someone intercepts them, they see unreadable text.

- **Encryption:** readable → unreadable format.
- **Decryption:** unreadable → readable format.

### 8.3 Symmetric vs. asymmetric

| Type | Keys |
|---|---|
| Symmetric | The **same** key encrypts and decrypts |
| Asymmetric | **Different** keys for encryption and decryption — more secure |

"We don't need to be experts on this."

---

## 9. Secure Properties — Steps

### Step 1 — Add the Secure Properties module

- Newer Studio versions: Mule Palette → **Add Modules** → **Secure Properties**.
- Older versions (instructor's 7.12.0 — check Help → About Anypoint Studio): import it from **Exchange** first.

**Proof it's needed:** without the module, Global Elements → Create shows no Secure Properties option. After adding it, it appears.

### Step 2 — Encrypt the value

*Slide* — **Secure properties implementation steps:** Add secure properties module from Exchange to Studio · Encrypt the sensitive data in property files · Configure secure configuration property global element · Configure the properties in components ( ${secure::key} ) and Dataweave ( Mule::p('secure::key') ) · Pass the runtime arguments and deploy.

*Slide* — the **JAR** way (the class's own example values):

```text
Encrypt a string:
java -cp secure-properties-tool.jar com.mulesoft.tools.SecurePropertiesTool string encrypt Blowfish CBC MyMuleSoftKey mahesh
  → dTiMggBF7rw=

Decrypt a string:
java -cp secure-properties-tool.jar com.mulesoft.tools.SecurePropertiesTool string decrypt Blowfish CBC MyMuleSoftKey dTiMggBF7rw=
  → mahesh
```

Arguments: `string` · `encrypt`/`decrypt` · algorithm · mode · **key** · value.

MuleSoft provides a **Secure Properties Tool** web page (and a JAR) to encrypt/decrypt values.

| Field | Value |
|---|---|
| Operation | Encrypt |
| Algorithm | **AES** (also common: **Blowfish**) |
| Mode | e.g. CBC (default) |
| Key | Your secret key |
| Value | e.g. the API key |

**Key length:** with a short key (e.g. `xyz1234`), AES gives "**key length not sufficient**". AES needs **16 bytes** (16 characters), e.g. `xyz1234567890abc`. Blowfish accepted shorter keys.

> **Technical clarification:** AES accepts 16-, 24- or 32-byte keys (AES-128/192/256).

**Never share this key.** The same key, algorithm and mode are needed to decrypt.

### Step 3 — Put the encrypted value in the property file

Wrap it in `![...]` so Mule knows it's encrypted:

```yaml
weather:
  appid: "![nHk3sJ9...encrypted...==]"
```

### Step 4 — Secure Properties Config global element

Global Elements → Create → **Secure Properties Config**:

| Field | Value |
|---|---|
| File | `config/${mule.env}.yaml` (dynamic, like configuration properties) |
| Key | `${secure.key}` — **not hard-coded**; passed at runtime like `mule.env` |
| Algorithm | AES |
| Mode | CBC |

```xml
<secure-properties:config name="Secure_Properties_Config"
                          file="config/${mule.env}.yaml"
                          key="${secure.key}">
  <secure-properties:encrypt algorithm="AES" mode="CBC" />
</secure-properties:config>
```

(Representative.) Add `secure.key` = `<your key>` in the Run Configuration's environment alongside `mule.env`. Each environment can have its own key.

### Step 5 — Reference secure properties with `secure::`

```text
In configuration fields:   ${secure::weather.appid}
In DataWeave:              p('secure::weather.appid')
```

### Mistake in the demo

After encrypting, the request still failed: the reference was still `${weather.appid}` without **`secure::`**. Mule used the **encrypted text as is** and the API rejected it. Adding `secure::` fixed it.

### Notes

- One secure properties file can hold many encrypted values; mark each with `![...]`.
- Typical projects have only 3–4 secure values (passwords, secrets). Bulk encryption of whole files exists but wasn't covered.

---

## 10. End-to-End Summary

```text
src/main/resources/config/
   dev.yaml   uat.yaml   prod.yaml        ← same keys, different values; secrets as ![...]

Global elements
   Configuration properties   file = config/${mule.env}.yaml
   Secure properties config   file = config/${mule.env}.yaml, key = ${secure.key}

Components
   ${http.listener.port}   ${weather.request.host}   p('weather.appid')   ${secure::db.password}

Run Configuration (Environment)
   mule.env = prod
   secure.key = <secret>
```

---

## 11. Important Terminology

| Term | Meaning |
|---|---|
| Externalising properties | Moving environment values out of code into property files |
| Property file | `.yaml` or `.properties` file with key–value pairs |
| Configuration Properties | Global element that loads a property file |
| `mule.env` | Variable (name chosen by the org) holding the environment name |
| `${key}` | Property reference in configuration fields |
| `p('key')` | Property reference inside DataWeave |
| Run / Debug Configuration | Studio run settings, incl. environment variables |
| Encryption / decryption | Readable ↔ unreadable using a key and algorithm |
| Symmetric / asymmetric | Same key / different keys |
| Secure Properties module | Adds the Secure Properties Config element |
| Secure Properties Tool | MuleSoft tool to encrypt/decrypt values |
| `![...]` | Marks an encrypted value in a property file |
| `secure::` | Prefix to read a decrypted secure property |
| AES / Blowfish | Encryption algorithms |

---

## 12. Interview Questions

### Q1. Why do we externalise properties?
Each environment has different hosts, ports and credentials. Externalising them into one property file per environment lets the same application be deployed anywhere, picking the right values at runtime.

### Q2. How do you configure environment-specific property files?
Create `dev/uat/prod` files in `src/main/resources/config`; add a Configuration Properties global element with file `config/${mule.env}.yaml`; reference values with `${key}`; pass `mule.env` at deployment (Run Configuration locally; deployment properties on servers).

### Q3. YAML vs. `.properties`?
Same purpose; only the syntax differs (nested indentation vs. dot-separated keys). No performance difference.

### Q4. How do you read a property inside DataWeave?
`p('key')`.

### Q5. How do you secure sensitive properties?
Add the Secure Properties module, encrypt values with the Secure Properties Tool (e.g. AES/CBC with a key), place them as `![encrypted]`, configure a Secure Properties Config element with the same algorithm/mode and a runtime-supplied key, and reference them as `${secure::key}` or `p('secure::key')`.

### Q6. What happens if you forget `secure::`?
The encrypted text is used as-is and the call fails.

### Q7. Why shouldn't the encryption key be hard-coded?
Anyone with the code could decrypt the secrets. It is passed at runtime and kept secret.

### Q8. Symmetric vs. asymmetric encryption?
Symmetric uses one key for both directions; asymmetric uses different keys and is more secure.

---

## 13. Must Remember

1. Hard-coded values → wrong systems in other environments. **Externalise.**
2. **One property file per environment**, in `src/main/resources/config/`, same keys, different values.
3. YAML or `.properties` — syntax only; use `#` comment headings.
4. Global element: **Configuration properties**, file `config/${mule.env}.yaml`.
5. `${key}` in fields; **`p('key')` in DataWeave**.
6. Pass `mule.env` via **Run/Debug Configurations → Environment**.
7. Never keep passwords/secrets in plain text — **encrypt**.
8. Secure Properties: module → tool (AES 16-byte key) → `![...]` → Secure Properties Config (key from runtime) → `${secure::key}`.
9. Forgetting `secure::` sends the encrypted text.
10. Toolbar Run/Debug use the first/most recent configuration — check before clicking.
