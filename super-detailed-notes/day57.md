# Day 57 — Amazon S3: Buckets and Objects, Access Keys, and the Amazon S3 Connector (Create Bucket, Put Object, Get Object)

> **Sources:**
> - Cleaned audio transcript ([transcripts-cleaned/day57.txt](../transcripts-cleaned/day57.txt)) and the class video (recorded 8 Feb 2025).
> - Text marked *screen* is read from the recording.
> - Slide images: [slides/day57](../slides/day57/).

## 1. Overview

*Slide (agenda):* create an AWS account, introduction to Amazon S3, demo of S3 Connector operations — Create Bucket, Put Object, Get Object; Q&A.

1. Cloud providers — AWS, Azure, GCP
2. **What is Amazon S3** — cloud-based object storage for unstructured data
3. **Buckets and objects** — data, metadata, unique identifier
4. Creating an **AWS account** and signing in
5. Creating a **bucket** and **uploading** a file in the S3 console
6. A real-time use case — FTP → S3 with a scheduler
7. The **Amazon S3 connector** and its operations
8. **Access key and secret key** (IAM → Security credentials)
9. Demo 1 — **Create Bucket** from Mule
10. Demo 2 — **Put Object** (upload a file)
11. Demo 3 — **Get Object** and the binary-payload challenge — `read(payload, 'application/json')`
12. **On New Object** / On Deleted Object sources

---

## 2. Cloud Providers

- **AWS** = Amazon Web Services, a cloud solution provider.
- Without cloud: take a server, install the database software, use it.
- With cloud: use their infrastructure as a service, or use **ready-made services** — S3 is one.
- The three most famous providers:

| Provider | From |
|---|---|
| **AWS** | Amazon |
| **Azure** | Microsoft |
| **GCP** (Google Cloud Platform) | Google — growing fast in data analytics |

---

## 3. What Is Amazon S3?

*Slide:* Amazon Simple Storage Service — cloud-based object storage from AWS, for unstructured data (photos, videos, log files, sensor data).

- **S3 = Amazon Simple Storage Service**.
- A ready-made AWS service providing **cloud-based object storage**.
- **Structured data** (rows and columns, e.g. employee data) → databases.
- **Unstructured data** (JSON file, CSV file, video, audio, photos, log files, sensor data) → object storage.
- *Slide quote:* "designed for unstructured data like photos, videos, log files, sensor data, which don't fit neatly into rows and columns."

**Equivalent services:**

| Cloud | Object storage |
|---|---|
| AWS | **S3** |
| Azure | **Blob Storage** |
| GCP | **Google Cloud Storage (GCS)** |

**Q (student): what if we want structured data in the cloud?**

- Amazon provides database services too — **RDS** (Relational Database Service) — or you can install MySQL in the cloud.
- Companies are moving databases from on-premises to the cloud; it depends on the use case.

---

## 4. Buckets and Objects

*Slide:* S3 stores data as **objects** within containers called **buckets**; each object has the data, metadata and a unique identifier.

### 4.1 Object

- Any file you save — `.csv`, `.json`, `.txt`, `.mp4` … — is an **object**.
- Each object consists of:

| Part | Example |
|---|---|
| **Data** | The content of `employee.csv` |
| **Metadata** | Data about the data — file size, extension, extra details |
| **Unique identifier** | The name — `employee.csv` |

- Saving another file with the same name doesn't work — use a different name, or **overwrite**.

### 4.2 Bucket

- A **container** for objects — like a folder in your C drive holding files.
- Used to **organize** data, e.g. a JSON bucket, a CSV bucket, a marketing bucket.
- First create a bucket, then store objects inside it.

---

## 5. Creating an AWS Account

*Screen:* AWS docs — Create an AWS account (standalone account steps).

1. **Create an AWS account** → create a new account.
2. Enter an **email address** and an account name → **Verify email address**.
3. Enter the code sent by email.
4. Set a strong **password**.
5. Enter **credit or debit card** details — it charges **Rs. 2** first and reverts it.
6. Free trial — "one year, I think".

**Signing in** (*screen:* Root user / IAM user): email address → Next → password → Sign in.

*Screen:* AWS Account page — Billing & Cost Management, Payment Method, IAM, Personal Information, Security Credentials.

### 5.1 AWS services

*Screen:* Console → All services by category.

- Hundreds of services: machine learning, compute (**EC2** — e.g. a server to deploy a Mule app), containers, storage, database, analytics, migration, networking, security, developer tools, IoT, media, game development.
- S3 is under **Storage** — or just type **S3** in the search bar.
- On a private cloud server you'd need Java and Maven set up — usually given by the admin or DevOps team.

---

## 6. Bucket and Upload in the S3 Console

*Screen:* Amazon S3 console — Account snapshot, General purpose buckets (empty).

### 6.1 Create bucket

*Screen:* Create bucket — region **Europe (Stockholm) eu-north-1**, bucket type **General purpose**, bucket name.

*Screen:* Object Ownership (ACLs disabled), Block Public Access settings, Bucket Versioning, default encryption.

1. **Create bucket**.
2. Bucket name **`mulesamplebucket`**.
3. Leave the other settings as they are → **Create bucket**.
4. *Screen:* "Successfully created bucket mulesamplebucket" — empty.

### 6.2 Upload a file

1. Create `employee.json` — an array of employee objects, formatted (Notepad++ JSON language, Postman, or the DataWeave Playground).
2. In the bucket: **Upload → Add files → Upload**.
3. *Screen:* Upload succeeded — 1 file, **505.0 B**.
4. *Screen:* Objects: `employee.json` (json, 505 B, **Standard** storage class).
5. Select it to **Download**, or open it — last modified, storage class, content (empid, empSalary, empDesignation, empName …).

> **Instructor's view:** AWS S3 is a big subject handled by a separate team. Our job is to use the S3 connector to do programmatically what we just did manually.

---

## 7. Real-Time Use Case — FTP to S3

**Requirement:** an employee JSON file is placed on an FTP server every day; store it in Amazon S3.

| Approach | How |
|---|---|
| Manual | Download from FTP, upload to S3 by hand |
| Programmatic | A Mule app: **Scheduler** (every day at 8) → **FTP Read** → **S3 Put Object** |

- It's **Put Object**, not "create object", because you're putting an object into a bucket.

**Who creates the bucket?**

- Like a database table — usually already created by the database team.
- Buckets are usually created by the AWS/S3 team, who give you the bucket name.
- But MuleSoft has an option to create one if needed.

---

## 8. The Amazon S3 Connector

- Not expected in the palette by default — normally added from **Exchange**.
- *In class:* **Add Modules** already showed **Amazon S3** (added earlier) — just drag and drop; take the latest version.
- *Screen:* project `amazons3-demo`, module **Amazon S3 [v6.3.2]**.

### 8.1 Operations

| Operation | What it does |
|---|---|
| **Create Bucket** | Creates a bucket |
| Delete Bucket | Deletes a bucket |
| **Put Object** | Uploads a file (object) into a bucket |
| **Get Object** | Gets the content of an object by file name |
| Copy Object | Copies an object |
| Delete Object / Delete Objects | Deletes one / multiple objects |
| List Buckets | Lists all buckets (e.g. how many you have) |
| List Objects | Lists objects |
| **On New Object** (source) | Triggers when a new object is uploaded to a bucket |
| **On Deleted Object** (source) | Triggers when an object is deleted |

- The connector also supports rename, copy content, move between places.
- The class demoed three operations; the rest are similar to JMS/Salesforce — practise on your own.

---

## 9. Access Key and Secret Key

- The S3 connection uses an **access key** and **secret key**, not a username/password.

**Creating them:**

1. Click your name (**mahesh**) top-right → **Security credentials**.
2. Scroll to **Access keys** → **Create access key**.
3. Only **two** keys are allowed — the instructor first **Deactivated** then **Deleted** an old one.
4. Accept the root-user acknowledgement.
5. *Screen:* "Access key created — This is the only time that the secret access key can be viewed or downloaded. You cannot recover it later."
6. *Screen:* access key **`AKIASW4BFNOSGBYYWY4U`**, secret shown as `***************` with **Show**.
7. Copy both, or **Download .csv**, then **Done**.

*Screen:* Access keys (2) — key IDs, created on, last used, status **Active**.

- After **Done**, only the access key is visible — **Actions** offers Deactivate and Delete, but **no way to retrieve the secret**.
- If you didn't save it: delete the key and create a new one.

**In real projects:** ask the AWS/S3 team — "I'm using the Amazon S3 connector from MuleSoft; give me permissions for this bucket, the access key, secret key and bucket name."

### 9.1 Connector configuration

*Screen:* Global Element Properties → **Amazon S3 Configuration**:

| Field | Value |
|---|---|
| Name | `Amazon_S3_Configuration` |
| Try Default AWSCredentials Provider Chain | False (Default) |
| Role | None |
| Access Key | `AKIASW4BFNOS…` |
| Secret Key | `HtPgZqMzEspZ…` |
| Region Endpoint | The bucket's region |

- **Test Connection** → connected successfully.
- **Region:** must match the bucket — ask which region.
  - Defaults are often US East 1.
  - A European client uses European regions; in the US maybe West rather than East.

---

## 10. Demo 1 — Create Bucket

*Screen:* flow — Listener → Start Logger → **Create Bucket** → End Logger.

| Setting | Value |
|---|---|
| Listener path | `/createbucket` |
| Start logger | `#[attributes.queryParams.bucketName]` |
| Create Bucket → Bucket name | `#[attributes.queryParams.bucketName]` (dynamic, not hardcoded) |

*Screen:* Postman `GET http://localhost:8081/createbucket?bucketName=…`

- Run in **debug** with a breakpoint.
- Sent `mulesamplebucket1` (and `mulesamplebucket2`).
- The logger printed `mulesamplebucket1`; refreshing the S3 console showed the new bucket.
- If it couldn't be created, you'd get an error.

---

## 11. Demo 2 — Put Object

*Screen:* Put Object — connector config `Amazon_S3_Configuration`, Bucket name, Object key, Content `#[payload]`.

| Setting | Value |
|---|---|
| Listener path | `/uploadobject` |
| Bucket name | `mulesamplebucket1` (hardcoded here; could be dynamic) |
| **Object key** | `#[attributes.queryParams.fileName]` — the **file name** |
| **Content** | `#[payload]` — the file content from the body |

- Copy-pasted the start/end loggers in the XML view to build the new flow quickly.

*Screen:* Postman `POST http://localhost:8081/uploadobject?fileName=employee.json`, body **raw → JSON** with the employee data.

*Screen (debugger):* Put Object response — **eTag**, **versionId**, **serverSideEncryption AES256** ….

- The payload came back as a **Java** object — add a Transform Message to send a proper JSON response.
- *Screen:* `mulesamplebucket1` now contains `employee.json`.

---

## 12. Demo 3 — Get Object

*Screen:* flow — Listener → Start Logger → **Get Object** → Transform Message (`output application/json` / `payload`) → End Logger.

| Setting | Value |
|---|---|
| Listener path | `/getobject` |
| Bucket name | `#[attributes.queryParams.bucketName]` |
| Object key | `#[attributes.queryParams.fileName]` |

- Both dynamic → generic for any bucket and any file.

*Screen:* Postman `GET http://localhost:8081/getobject?fileName=employee.json&bucketName=mulesamplebucket1` → the file content.

- A student pointed out the URL still said `uploadobject` — changed to `getobject`.

### 12.1 The challenge — binary payload

- Get Object returns the payload as **`application/octet-stream`** (binary).
- `output application/json` / `payload` produced one big **string** — a double quote at each end, the JSON inside.
- Sent to a database, it would go in as a string.

**Fix — `read` with the underlying format:**

```dataweave
%dw 2.0
output application/json
---
read(payload, 'application/json')
```

- Now it's proper JSON, ready for the database.

### 12.2 Extending to a database insert

- After Get Object: transform, write the query, insert.
- **Bulk insert** if the content isn't large; **For Each** if there's a lot.
- Do both for practice — same as the earlier FTP → DB use case.

---

## 13. On New Object / On Deleted Object

*Screen:* S3 **On New Object** source — bucket name `mulesamplebucket1`, folder, scheduling strategy **fixed frequency (1000 ms)**.

- Dragging **On New Object** puts it in the **source** section.
- It polls every second; when a new object arrives in the bucket, the flow triggers with it.
- **On Deleted Object** triggers with information about a deleted object.

*Screen:* DataWeave Playground — the downloaded `employee.json` shown as JSON.

---

## 14. Important Terminology

| Term | Meaning |
|---|---|
| AWS | Amazon Web Services — cloud solution provider |
| S3 | Amazon Simple Storage Service — cloud object storage |
| Object storage | Storage for unstructured data (files) |
| Bucket | Container that holds and organizes objects |
| Object | A stored file: data + metadata + unique identifier (name) |
| Object key | The object's name in the bucket |
| Blob Storage / GCS | Azure's / Google's equivalent of S3 |
| RDS | AWS Relational Database Service |
| EC2 | AWS compute (virtual server) service |
| Access key / Secret key | Credentials for programmatic AWS access; the secret is shown only once |
| Region | AWS location of a bucket, e.g. eu-north-1, us-east-1 |
| `application/octet-stream` | Binary MIME type — what Get Object returns |
| `read()` | DataWeave function that parses content with a given format |

---

## 15. Interview Questions

### Q1. What is Amazon S3?
Amazon Simple Storage Service — AWS's cloud-based object storage for unstructured data such as files, images, videos and logs. Data is stored as objects in buckets.

### Q2. Bucket vs. object?
A bucket is a container; an object is a file stored in it, made of data, metadata and a unique name (key).

### Q3. How does the Mule S3 connector authenticate?
With an AWS access key and secret key (plus the region). The secret is shown only once when created — save or download it.

### Q4. Which operations did you use, and how do you upload a file?
Create Bucket, Put Object, Get Object. Put Object takes the bucket name, the object key (file name) and the content (`#[payload]`).

### Q5. Get Object returned a string instead of JSON — why, and how do you fix it?
The connector returns binary (`application/octet-stream`). Parse it with the underlying format: `read(payload, 'application/json')`.

### Q6. How would you move a daily FTP file into S3?
Scheduler → FTP Read → S3 Put Object.

### Q7. What are S3's equivalents in Azure and GCP?
Azure Blob Storage and Google Cloud Storage.

### Q8. How do you trigger a flow when a file lands in a bucket?
Use the **On New Object** source with the bucket name and a polling frequency.

---

## 16. Must Remember

1. S3 = Simple Storage Service = **object storage** for unstructured data.
2. **Buckets** hold **objects**; object = data + metadata + unique name.
3. Azure = Blob Storage; GCP = Google Cloud Storage.
4. Connector auth = **access key + secret key + region**.
5. The secret key is shown **only once** — download the .csv.
6. Only two access keys per user — deactivate and delete an old one to create another.
7. Put Object: **Object key = file name**, **Content = `#[payload]`**.
8. Get Object returns **octet-stream** → `read(payload, 'application/json')`.
9. Make bucket name and file name dynamic with `attributes.queryParams`.
10. **On New Object** / **On Deleted Object** are sources that poll the bucket.
