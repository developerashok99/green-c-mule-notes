# Day 41 — Consuming a SOAP Service with the Web Service Consumer

## Session Agenda
- Why we consume SOAP but don't build it
- The **WSDL** of the dneonline calculator service
- **Web Service Consumer** config and the **Consume** operation
- Transforming JSON to SOAP XML
- Mapping the SOAP response back to JSON

## Why SOAP
- New services are built in REST (99% of the time).
- Older applications still expose SOAP, so we sometimes consume it.

## WSDL and Config
- WSDL = SOAP's RAML; location `http://www.dneonline.com/calculator.asmx?WSDL`.
- Operations: Add, Subtract, Multiply, Divide.
- Config: WSDL location, service **Calculator**, port **CalculatorSoap**, address = URL without `?WSDL`, SOAP11.
- Consume operation: **Add**.

## Building the Request
- Drop Consume first; a Transform before it shows the XML `Add` structure as output.
- Define input metadata from an example JSON (num1, num2); if it won't load, use a temporary example Transform and delete it after mapping.
- `ns ns0 http://tempuri.org/` → `ns0#Add: { ns0#intA: payload.num1, ns0#intB: payload.num2 }`.

## The Response
- Payload is a SoapOutputEnvelope (body, headers, attachments); body holds `<AddResponse><AddResult>395</AddResult></AddResponse>`.
- Final Transform: `{ Response: payload.body.AddResponse.AddResult, "serviceused": "addition" }` → `{"Response": "395", "serviceused": "addition"}`.

## Quick Recap
- SOAP connector = Web Service Consumer, one operation: Consume.
- JSON → XML before the call, XML → JSON after.
- DataWeave quotes JSON keys automatically.
- Only Add works reliably on the free service.
