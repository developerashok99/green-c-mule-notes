# Day 57 — Amazon S3: Buckets, Objects and the Amazon S3 Connector

## Session Agenda
- Cloud providers and **what Amazon S3 is**
- **Buckets and objects**
- Creating an **AWS account**, a bucket, and uploading a file in the console
- **Access key / secret key** and the S3 connector configuration
- Connector demos — **Create Bucket**, **Put Object**, **Get Object**; On New Object

## Amazon S3
- **S3 = Amazon Simple Storage Service** — cloud-based **object storage** for unstructured data (files, photos, videos, logs).
- Structured data goes to databases (or AWS **RDS**).
- Equivalents: Azure **Blob Storage**, GCP **Google Cloud Storage**.

## Buckets and Objects
- A **bucket** is a container (like a folder) for organizing files.
- An **object** is any stored file: data + metadata + unique name.
- Console demo: bucket `mulesamplebucket` (eu-north-1), uploaded `employee.json` (505 B).

## Access Keys
- IAM → **Security credentials** → **Create access key** (max two per user).
- The secret key is shown **only once** — copy it or download the .csv.
- Connector config: Access Key, Secret Key, Region (must match the bucket) → Test Connection.

## Connector Demos
- **Create Bucket** — name from `attributes.queryParams.bucketName` → created `mulesamplebucket1`.
- **Put Object** — object key = `queryParams.fileName`, content = `#[payload]` → uploaded `employee.json`.
- **Get Object** — bucket and key from query params → returns the file content.
- Get Object returns **application/octet-stream**; use `read(payload, 'application/json')` to get real JSON.
- **On New Object** polls a bucket (every 1000 ms) and triggers on new files; **On Deleted Object** on deletions.

## Quick Recap
- S3 stores objects in buckets.
- Authenticate with access key + secret key + region.
- Create Bucket, Put Object, Get Object; parse Get Object's binary with `read()`.
- Use case: Scheduler → FTP Read → S3 Put Object.
