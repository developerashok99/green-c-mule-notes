# Day 41 — Consuming a SOAP Service with the Web Service Consumer (Hands-On)

> **Sources:**
> - Cleaned audio transcript ([transcripts-cleaned/day41.txt](../transcripts-cleaned/day41.txt)) and the class video (recorded 6 Jan 2025).
> - Text marked *screen* or *drawing* is read from the recording.
> - Slide images: [slides/day41](../slides/day41/).

## 1. Overview

1. Why consume SOAP if we only build REST
2. The use case — a free calculator SOAP service
3. **WSDL** — the SOAP equivalent of RAML
4. New project and the **Web Service Consumer** module (Consume operation)
5. Consumer config — WSDL location, service, port, address, SOAP version
6. Choosing the operation (**Add**)
7. Building the XML input with Transform Message (metadata hack)
8. Testing — the SOAP response envelope
9. Mapping the response back to JSON
10. Interview angle and Q&A

---

## 2. Why Consume SOAP?

- We've consumed a third-party REST service and created a REST service.
- We **won't create a SOAP service** — 99% of new applications are built on REST.
- **Older applications** already expose SOAP services and don't change them.
- So occasionally we must **consume** a SOAP service — rare, but we should know it.

*Screen — reference project* `consume-soap-service-730`: Listener → Start Logger → Set XML input for SOAP calculator service → Before SOAP Logger → Consume Calculator SOAP service → After SOAP Logger → Final Response → End Logger.

*Drawing:* input arrives at our API's listener → the SOAP connector (**Web Service Consumer**) calls the third-party SOAP service → XML in, XML out → convert the XML to whatever we want.

---

## 3. The Web Service Consumer Module

| Item | Value |
|---|---|
| Module | **Web Service Consumer** |
| Operations | Only one — **Consume** |
| Purpose | Call a SOAP web service |

- For HTTP we use the HTTP module; for SOAP, the Web Service Consumer.
- Add it to the modules and drag-drop **Consume**.

---

## 4. WSDL

- REST has **RAML**; SOAP has **WSDL** — Web Services Description Language.
- The SOAP provider gives a **WSDL location** (URL where the WSDL file is).
- It contains everything: operations, inputs, outputs — like RAML.

*Screen:* `http://www.dneonline.com/calculator.asmx?WSDL`

- Types: **Add, AddResponse, Subtract, Multiply, Divide**.
- Add takes **intA** and **intB** and returns the sum.
- *Screen:* operations and binding — soapAction `http://tempuri.org/Add`, bindings **CalculatorSoap** / **CalculatorSoap12**.

---

## 5. Building the Project

1. *Screen:* new Mule project **consume-soap-service-7303** (Mule Server 4.4.0 EE).
2. HTTP Listener — default config, path **`/soap`**; loggers as usual.
3. *Screen:* **Add Modules → Web Service Consumer** (under W) → drag **Consume** after the Listener.

- The Consume is dropped **first**, before the Transform — the reason comes in section 7.

**Our API's input** (*drawing*): a JSON object with two numbers, e.g.

```json
{"integer1": 100, "integer2": 105}
```

- The SOAP service won't understand that JSON — it must be converted to the SOAP XML.
- *Drawing:* JSON request → transform to XML → SOAP connector → XML response.

---

## 6. Web Service Consumer Config

*Screen:*

```text
WSDL Location : http://www.dneonline.com/calculator.asmx?WSDL
Service       : Calculator
Port          : CalculatorSoap        (CalculatorSoap12 also offered)
Address       : http://www.dneonline.com/calculator.asmx
```

*Screen — General tab:* SOAP version **SOAP11** (default), **MTOM enabled false**.

- Give the WSDL location → the **service** names are populated; with several services, pick one.
- **Port:** two offered — use either (with one port, use that).
- **Address** = the WSDL location **without `?WSDL`** — fills automatically; if not, remove `?WSDL` yourself.
- If nothing fills, open the WSDL and copy the service name and port from it (*screen*).

### 6.1 Operation

*Screen — Consume:* connector config `Web_Service_Consumer_Config`, Operation **Add**, Body `payload`.

- The calculator has four operations; choose **Add**.
- In real time it can be any input and output per the requirement.

---

## 7. Building the XML Input

**Hack:** after configuring Consume, drag a **Transform Message before it** — its **output metadata is already the XML `Add` structure** the Consume expects.

- The Transform's output goes into the payload, which is the Consume's body.

### 7.1 Input metadata

1. Click **Define metadata** on the input payload.
2. Create a user-defined type → **JSON** → **Example** (a schema works too).
3. Write the example in Notepad and save as `input10.json` (Save As → All files):

```json
{"num1": 100, "num2": 105}
```

4. The type shows num1, num2.

### 7.2 When the metadata doesn't load

- Metadata loading in Studio sometimes fails for no known reason.
- **Hack:** put **another Transform Message before** it whose output is the example JSON → its output becomes this Transform's input, so `payload` appears on the left.
- Map **num1 → intA**, **num2 → intB** by dragging — the code is generated.
- **Delete the helper Transform** afterwards — otherwise every request's numbers are overwritten by the example.

*Screen — generated DataWeave:*

```dataweave
%dw 2.0
output application/xml
ns ns0 http://tempuri.org/
---
{
  ns0#Add: {
    ns0#intA: payload.num1,
    ns0#intB: payload.num2
  }
}
```

- **Namespace:** `ns0` is a short name for `http://tempuri.org/`, so it isn't written in full each time.
- `ns0#Add` = Add belongs to ns0.

---

## 8. Testing the Call

- Studio showed errors ("Error exists in required project") but no red in the XML — a warning; deploy anyway.
- Postman: `localhost:8081/soap`, JSON body with num1 and num2.

**In the debugger:**

1. Incoming payload — **JSON**.
2. After the Transform — **XML**.
3. Consume calls the service (no **target variable** set in Advanced, so the response is in the **payload**).
4. *Screen:* payload is a **SoapOutputEnvelope** — overall **Java** with **body, headers, attachments**; the body holds XML:

```xml
<AddResponse xmlns="http://tempuri.org/">
  <AddResult>395</AddResult>
</AddResponse>
```

- *Screen:* Postman `GET http://localhost:8081/soap` with `{"num1": 195, "num2": 200}` → **200**, `body:<AddResponse …><AddResult>395</AddResult></AddResponse>`.

---

## 9. Mapping the Response to JSON

Built with the expression preview: `payload` → `payload.body.AddResponse` → `.AddResult`.

*Screen — final Transform:*

```dataweave
%dw 2.0
output json
---
{
  Response: payload.body.AddResponse.AddResult,
  "serviceused": "addition"
}
```

- *Screen:* Postman → **200** `{"Response": "395", "serviceused": "addition"}`.
- There's no rule to keep their keys — arrange the response as you want.
- **Set Payload** would be enough for something this simple; the instructor uses Transform out of habit.
- `serviceused` is hard-coded.

**Q: `Response` has no quotes — is that OK?**
Yes. With `output json`, DataWeave adds the double quotes to all keys in the output; nothing happens if you forget them.

---

## 10. Interview Angle and Q&A

- You don't need to build or know how to build a SOAP service in MuleSoft.
- **Instructor's experience:** consuming third-party SOAP is rare — he did it in one old project.
- The common question: **which connector?** → **Web Service Consumer**, with its **Consume** operation.
- *Screen:* WSDL service section — port **CalculatorSoap12** (binding `tns:CalculatorSoap12`) — used when discussing SOAP 1.2.
- *Screen:* a student's flow — Listener → Transform → Consume → Transform → Logger.
- The dneonline calculator is a free internet service; **only Add works reliably** — the others may not.

---

## 11. Important Terminology

| Term | Meaning |
|---|---|
| SOAP | XML-based web service protocol used by older applications |
| WSDL | Web Services Description Language — SOAP's contract (like RAML) |
| WSDL location | URL of the WSDL file |
| Web Service Consumer | Mule module for calling SOAP services |
| Consume | Its only operation |
| Service / Port / Address | Service name, binding port and endpoint from the WSDL |
| SOAP11 / SOAP12 | SOAP versions (default SOAP11) |
| Namespace (`ns0`) | Short prefix for an XML namespace URI |
| SoapOutputEnvelope | Consume's response — body, headers, attachments |

---

## 12. Interview Questions

### Q1. Which connector consumes a SOAP service in Mule 4?
The Web Service Consumer, using its Consume operation.

### Q2. What's WSDL?
Web Services Description Language — the SOAP equivalent of RAML, describing operations, inputs and outputs. The provider shares its location.

### Q3. What do you configure in the Web Service Consumer?
WSDL location, service, port and address (the WSDL URL without `?WSDL`), plus the SOAP version; then the operation on Consume.

### Q4. How do you build the SOAP request body?
Place a Transform Message before Consume — its output metadata is the operation's XML structure — and map the incoming JSON fields to it (with the namespace prefix, e.g. `ns0#Add`).

### Q5. How do you read the SOAP response?
The payload is an envelope with body, headers and attachments; navigate `payload.body.<OperationResponse>.<Result>` and transform to JSON.

### Q6. Do Mule developers build SOAP services?
Rarely — new services are REST; SOAP is mostly consumed from older systems.

---

## 13. Must Remember

1. SOAP = consume only (older systems); REST is what we build.
2. Web Service Consumer → **Consume** (one operation).
3. WSDL = SOAP's RAML; address = WSDL URL minus `?WSDL`.
4. Drop Consume first; a Transform before it gets the XML output metadata.
5. If input metadata won't load, use a temporary example Transform — then delete it.
6. `ns ns0 http://tempuri.org/` and `ns0#Add: { ns0#intA, ns0#intB }`.
7. Response = `payload.body.AddResponse.AddResult`.
8. DataWeave quotes JSON keys automatically.
