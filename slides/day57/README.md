# Day 57 — Slides and On-Screen Drawings

Screens from the Day 57 class (8 Feb 2025): creating an AWS account, S3 basics (buckets and objects), creating a bucket and uploading in the console, IAM access keys, then the Amazon S3 connector in Mule — Create Bucket, Put Object, Get Object and On New Object (access keys as shown on screen, 2025 trial account). Repeated and blank frames have been removed. Times are positions in the video.

Notes for this day: [detailed-notes/day57.md](../../detailed-notes/day57.md) · [super-detailed-notes/day57.md](../../super-detailed-notes/day57.md) · [summary](../../day57.md)

| # | Time | Content |
|---|---|---|
| 01 | 0:01 | Agenda: create an AWS account, introduction to Amazon S3, demo of S3 Connector operations — Create Bucket, Put Object, Get Object; Q&A |
| 02 | 3:49 | What is Amazon S3? — Amazon Simple Storage Service, cloud-based object storage from AWS, for unstructured data (photos, videos, log files, sensor data) |
| 03 | 6:58 | S3 stores data as objects within containers called **buckets**; each object has the data, metadata and a unique identifier |
| 04 | 10:53 | AWS docs — Create an AWS account (standalone account steps) |
| 05 | 11:01 | AWS IAM user sign-in page (account ID, IAM username, password) |
| 06 | 13:44 | AWS Sign in — Root user / IAM user, root user email address |
| 07 | 15:06 | AWS Account page — Billing & Cost Management, Payment Method, IAM, Personal Information, Security Credentials |
| 08 | 16:54 | AWS Console → All services by category (Compute, Storage → S3 …) |
| 09 | 17:07 | Amazon S3 console — Account snapshot, General purpose buckets (empty) |
| 10 | 18:26 | Create bucket — region Europe (Stockholm) eu-north-1, bucket type General purpose, bucket name |
| 11 | 18:34 | Create bucket — Object Ownership (ACLs disabled), Block Public Access settings, Bucket Versioning, default encryption |
| 12 | 19:16 | "Successfully created bucket mulesamplebucket" — buckets list |
| 13 | 23:56 | Upload → Add files (employee.json, 505 B) → Upload |
| 14 | 24:01 | Upload succeeded — 1 file, 505.0 B |
| 15 | 24:21 | mulesamplebucket → Objects: employee.json (json, 505 B, Standard storage class) |
| 16 | 24:31 | Opened object — the employee.json content (empid, empSalary, empDesignation, empName …) |
| 17 | 40:17 | IAM → Security credentials → **Create access key** — access key and secret access key (shown once; download .csv) |
| 18 | 40:37 | Access keys (2) — key IDs, created on, last used, status Active |
| 19 | 41:30 | Studio: Amazon S3 Configuration — connection with Access Key, Secret Key and Region Endpoint |
| 20 | 41:45 | Amazon S3 Configuration filled in — Test Connection |
| 21 | 46:42 | aws-s3-demo flow: Listener → Start Logger → **Create Bucket** (Bucket name `#[attributes.queryParams.bucketName]`) → End Logger |
| 22 | 47:14 | Postman GET http://localhost:8081/createbucket?bucketName=… |
| 23 | 53:21 | S3 console: new buckets mulesamplebucket1 … created from Mule |
| 24 | 56:27 | **Put Object**: connector config Amazon_S3_Configuration, Bucket name, Object key, Content `#[payload]` |
| 25 | 61:46 | Postman POST http://localhost:8081/uploadobject?fileName=employee.json with the JSON body |
| 26 | 62:56 | Debugger: Put Object response — eTag, versionId, serverSideEncryption AES256 … |
| 27 | 64:58 | S3 console: mulesamplebucket1 now contains the uploaded object |
| 28 | 69:25 | Flow: Listener → Start Logger → **Get Object** (bucket name, object key) → Transform Message (`output application/json` / `payload`) → End Logger |
| 29 | 72:08 | Postman GET …/getobject?fileName=employee.json&bucketName=… → the file content |
| 30 | 80:51 | S3 **On New Object** source — bucket name, folder, scheduling strategy fixed frequency (1000 ms) |
| 31 | 82:07 | DataWeave Playground — the downloaded employee.json shown as JSON |

---

### 01 — Agenda: create an AWS account, introduction to Amazon S3, demo of S3 Connector operations — Create Bucket, Put Object, Get Object; Q&A
![agenda](01-agenda.jpg)

### 02 — What is Amazon S3? — Amazon Simple Storage Service, cloud-based object storage from AWS, for unstructured data (photos, videos, log files, sensor data)
![what-is-s3](02-what-is-s3.jpg)

### 03 — S3 stores data as objects within containers called **buckets**; each object has the data, metadata and a unique identifier
![s3-buckets-objects](03-s3-buckets-objects.jpg)

### 04 — AWS docs — Create an AWS account (standalone account steps)
![create-aws-account](04-create-aws-account.jpg)

### 05 — AWS IAM user sign-in page (account ID, IAM username, password)
![aws-sign-in](05-aws-sign-in.jpg)

### 06 — AWS Sign in — Root user / IAM user, root user email address
![root-user-signin](06-root-user-signin.jpg)

### 07 — AWS Account page — Billing & Cost Management, Payment Method, IAM, Personal Information, Security Credentials
![aws-account-page](07-aws-account-page.jpg)

### 08 — AWS Console → All services by category (Compute, Storage → S3 …)
![console-services](08-console-services.jpg)

### 09 — Amazon S3 console — Account snapshot, General purpose buckets (empty)
![s3-console](09-s3-console.jpg)

### 10 — Create bucket — region Europe (Stockholm) eu-north-1, bucket type General purpose, bucket name
![create-bucket](10-create-bucket.jpg)

### 11 — Create bucket — Object Ownership (ACLs disabled), Block Public Access settings, Bucket Versioning, default encryption
![block-public-access](11-block-public-access.jpg)

### 12 — "Successfully created bucket mulesamplebucket" — buckets list
![bucket-created](12-bucket-created.jpg)

### 13 — Upload → Add files (employee.json, 505 B) → Upload
![upload-object](13-upload-object.jpg)

### 14 — Upload succeeded — 1 file, 505.0 B
![upload-succeeded](14-upload-succeeded.jpg)

### 15 — mulesamplebucket → Objects: employee.json (json, 505 B, Standard storage class)
![object-in-bucket](15-object-in-bucket.jpg)

### 16 — Opened object — the employee.json content (empid, empSalary, empDesignation, empName …)
![object-content](16-object-content.jpg)

### 17 — IAM → Security credentials → **Create access key** — access key and secret access key (shown once; download .csv)
![create-access-key](17-create-access-key.jpg)

### 18 — Access keys (2) — key IDs, created on, last used, status Active
![access-keys-list](18-access-keys-list.jpg)

### 19 — Studio: Amazon S3 Configuration — connection with Access Key, Secret Key and Region Endpoint
![s3-connector-config](19-s3-connector-config.jpg)

### 20 — Amazon S3 Configuration filled in — Test Connection
![s3-config-test](20-s3-config-test.jpg)

### 21 — aws-s3-demo flow: Listener → Start Logger → **Create Bucket** (Bucket name `#[attributes.queryParams.bucketName]`) → End Logger
![create-bucket-flow](21-create-bucket-flow.jpg)

### 22 — Postman GET http://localhost:8081/createbucket?bucketName=…
![postman-create-bucket](22-postman-create-bucket.jpg)

### 23 — S3 console: new buckets mulesamplebucket1 … created from Mule
![bucket-created-from-mule](23-bucket-created-from-mule.jpg)

### 24 — **Put Object**: connector config Amazon_S3_Configuration, Bucket name, Object key, Content `#[payload]`
![put-object-config](24-put-object-config.jpg)

### 25 — Postman POST http://localhost:8081/uploadobject?fileName=employee.json with the JSON body
![postman-put-object](25-postman-put-object.jpg)

### 26 — Debugger: Put Object response — eTag, versionId, serverSideEncryption AES256 …
![put-object-response](26-put-object-response.jpg)

### 27 — S3 console: mulesamplebucket1 now contains the uploaded object
![uploaded-object](27-uploaded-object.jpg)

### 28 — Flow: Listener → Start Logger → **Get Object** (bucket name, object key) → Transform Message (`output application/json` / `payload`) → End Logger
![get-object-flow](28-get-object-flow.jpg)

### 29 — Postman GET …/getobject?fileName=employee.json&bucketName=… → the file content
![postman-get-object](29-postman-get-object.jpg)

### 30 — S3 **On New Object** source — bucket name, folder, scheduling strategy fixed frequency (1000 ms)
![on-new-object](30-on-new-object.jpg)

### 31 — DataWeave Playground — the downloaded employee.json shown as JSON
![dw-playground-output](31-dw-playground-output.jpg)

