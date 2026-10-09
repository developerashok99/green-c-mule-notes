# Day 42 — Scatter-Gather: Parallel Routes, Output, Variables and Error Handling

## Session Agenda
- Why Scatter-Gather — sequential vs. parallel calls
- Building a three-route demo
- Properties: Timeout, Target, Max Concurrency
- The gathered output and variables across routes
- Handling a failed route

## Why Scatter-Gather
- Price-comparison example: Amazon 250 ms, Flipkart 350 ms, Tata Cliq 400 ms + 200 ms other work.
- Sequential = **1200 ms**; parallel = slowest route + 200 = **600 ms**.
- Only for **independent** calls; at least two routes.

## Demo and Properties
- Project scatter-gather-demo, path `/scattergather`; Core → Routers → Scatter-Gather; three routes with Logger + Transform.
- **Timeout** per route, **Target** variable for the result, **Max Concurrency** for parallelism.
- Max concurrency **1** = routes run sequentially.

## Output
- Every route gets the same payload, attributes and variables.
- Result is a LinkedHashMap keyed "0", "1", "2" — an **object of objects**, one Mule message per route.
- It's Java; transform to JSON before responding.

## Variables
- Modified in one route → that value; in two routes → a collection.
- New variables created in routes are available after the Scatter-Gather.

## Errors
- A failing route doesn't stop the others; afterwards a **COMPOSITE_ROUTING** error (500) stops the flow.
- Wrapping the whole Scatter-Gather in Try loses the route results.
- Use **Try + On Error Continue in each route**, with a Set Payload like `{"errorMessage": error.description, "route1": "failed"}` → 200 with the failure reported.

## Quick Recap
- Parallel independent calls → faster API.
- Object of objects, keys from "0".
- Max concurrency 1 = sequential.
- Try + On Error Continue per route for resilient gathering.
