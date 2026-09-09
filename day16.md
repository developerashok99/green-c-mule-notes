# Day 16 — Error Handling Continued: XML Copy-Paste Technique, Error Mapping, Flow/Project/Component Levels, On Error Continue, Try Scope, Raise Error, Choice Router

## Session Agenda
- A practical technique: copying error-handling logic via the raw Configuration XML
- Reinforcing the "ANY must be last" rule with a second, deliberate live demonstration
- **On Error Propagate**, fully traced through parent/child flow relationships (Flow Reference)
- **Error Mapping** — converting one error type into another, custom one
- Three levels of error handling: **Flow level, Project/Global level, Component level (Try scope)**
- **On Error Continue** vs. **On Error Propagate** — the real distinction
- **Raise Error** — for business-rule errors, not technical ones
- **Choice router** — conditional routing, tied into the Raise Error example

## A Practical Studio Technique: Copying Components via Raw XML
- **The problem posed directly**: building a second `On Error Propagate` block (for the `ANY` catch-all) from scratch, when it needs nearly identical internal logic (Logger + Transform Message) to the first one.
- **The technique demonstrated live, step by step**: switch to the **Configuration XML** tab → identify the exact line range of the block you want to copy (Studio shows a collapsible region, e.g. lines 83-97) → select and copy that XML text directly → to paste it *into* a new, empty component (like a freshly-dropped `On Error Propagate`), first drag a **dummy component** (e.g. a spare Logger) into it just to generate the opening/closing tags in the XML, then paste your copied code **between those tags**, then delete the dummy component.
- **Why this matters practically**: *"in real time, we can utilize it well"* — this is presented as a genuinely useful, real technique for reusing logic across error handlers (or any XML blocks) without laboriously rebuilding identical configurations by hand each time.
- **A caution given directly**: pasted XML can trigger a **"duplicate Doc:Id" warning** — Studio offers to regenerate a fresh ID automatically, which is the safe, correct choice to accept (directly connects to Day 08's MUnit `Doc:Name` vs `Doc:Id` distinction — regenerated IDs are exactly why matching by `Doc:Name` is safer for tests).

## The "ANY Must Be Last" Rule — Demonstrated a Second Time, Deliberately, to Remove All Doubt
- **The exact XML-level operation used to physically move the `ANY` block**: select its full line range in Configuration XML, **Ctrl+X** (cut), navigate to the desired new position, **Ctrl+V** (paste) — precise, surgical reordering rather than drag-and-drop rebuilding.
- **With `ANY` moved to the TOP, tested live**: a genuine `MULE:EXPRESSION` error (which has its own specific, correctly-configured handler further down) is triggered — **confirmed directly that it gets caught by `ANY` instead**, never even reaching its own dedicated handler: *"why? Because any expression error can be covered in ANY... that's why always keep ANY at the bottom."*
- **With `ANY` correctly restored to the BOTTOM**: the same error now correctly reaches its own specific handler, and a genuinely *different*, unconfigured error type (`HTTP:CONNECTIVITY`, from a deliberately broken host) correctly falls through every specific check and lands in `ANY` instead.
- **The instructor's own summary of the underlying mechanism, stated directly**: *"it will check, this error type will not match. The next one will check, this error type will not match. After coming here, ANY... will match and this will go. If there is no ANY, it will go to the default error handler."* — sequential, first-match-wins evaluation, exactly as established on Day 15, now proven with a second, independent live test specifically because getting this backwards is such an easy, consequential mistake.
- **A realistic, direct practical note on scope**: *"we generally mention all these errors in Error Handler, but still there are 5-6 types of errors... only if it is important, it will come very rarely — basically everything will go to ANY."* You don't need a dedicated handler for every conceivable error type — just the handful that matter for your specific application, with `ANY` absorbing the long tail.

## On Error Propagate, Traced Fully Through Parent/Child Flows (Flow Reference)

```
Parent Flow → Flow Reference → Child Flow
```

- **The core question posed and answered directly**: if an error occurs *inside* a child flow (called via Flow Reference), and the child flow has **no error handling of its own**, what happens? **Answer**: the error **propagates up to the parent flow** — *"since there is no error handling here, this child flow will propagate the error to the parent flow."* If the *parent* flow's error handling then matches the error type, it executes there instead.
- **If the child flow DOES have its own matching error handling**: it's handled right there, in the child flow, and the (now-shaped) response propagates back up through the Flow Reference to the parent, and onward to the ultimate source (the Listener).
- **A direct clarification on terminology, given precisely**: *"calling flow and called flow are the same [concept as] parent flow and child flow"* — regardless of how many flows are chained together, whichever flow does the calling (via Flow Reference) is the "parent" relative to the one it calls.
- **A clean, precise summary of what On Error Propagate fundamentally does, restated directly**: *"it is trying to catch the error, do the necessary processing... it has set all the variables and payloads required here — it is propagating back to the source. Who is the source? The listener."* Regardless of how many flow-to-flow hops occur, error propagation ultimately always travels back toward the original triggering source.

## Error Mapping — Converting One Error Type Into a Custom One

- **The motivating scenario, stated directly**: a raw `HTTP:CONNECTIVITY` error (generic, from the underlying HTTP module) could instead be labeled something more specific and meaningful to your own application — e.g. `WEATHER:CONNECTIVITY_ERROR`, since it specifically represents a failure connecting to the weather API, not just "some HTTP problem."
- **Where this is configured, stated directly**: a dedicated **Error Mapping** section on the connector (the HTTP Request operation) — you specify the connector's own raw error type (`HTTP:CONNECTIVITY`) and map it to your **custom-defined** type (`WEATHER:CONNECTIVITY_ERROR`).
- **The direct, important consequence for your error handlers**: once mapped, your `On Error Propagate` blocks must now match against the **new, custom** error type (`WEATHER:CONNECTIVITY_ERROR`), **not** the original raw one (`HTTP:CONNECTIVITY`) — demonstrated live: a handler still configured to match `HTTP:CONNECTIVITY` no longer catches the error after mapping is applied, since the error genuinely *is* the new type by the time it's raised; it falls through to whatever *does* match (in this demo, `ANY`).
- **Direct, honest framing on how often this is actually used**: *"we can also map this error sometimes, [but only in] very rare instances"* — a real but uncommon technique, mentioned specifically because it does show up in some interview/architecture discussions, not something to reach for by default.

## Three Levels of Error Handling — Flow, Project/Global, and Component

```
Level 1: Flow-level    → Error Handler dragged directly into ONE specific flow's error section
Level 2: Project-level → A separate, shared Error Handler (its own XML file / Global Element), referenced by MANY flows
Level 3: Component-level → Try scope, wrapping just ONE component or a small group of components
```

### Flow-Level (what's been built so far)
- **Precisely confirmed, live, via the raw XML**: dragging any error-handling component into a flow's Error Handling section is what actually creates the `<error-handler>` opening/closing tags in that flow's XML — *"by default, it will not have any open tag and end tag in the flow"* unless you've explicitly added something there. An empty flow's error section genuinely has no error-handling XML at all until populated.

### Project-Level (Global) Error Handling — Full, Live Build
1. **Create a separate, dedicated XML file** (e.g. named `commonErrorHandler`) specifically to hold shared error-handling logic.
2. **Drag an `Error Handler` scope** (distinct from `On Error Propagate` itself — this is literally the container/box that other components go *inside*) into that new file, then populate it with your `On Error Propagate` / `On Error Continue` blocks — reusing the exact same XML copy-paste technique from earlier in this session to transfer already-built logic in rather than rebuilding it.
3. **Reference this shared handler from any flow, two ways, both demonstrated directly**: (a) directly reference the named Error Handler from within a specific flow's own error-handling reference field, or (b) configure it at the **application/project level** via a **Configuration** element's *"Default Error Handler"* setting — this second option applies it **automatically to every flow in the project** that doesn't have its own more-specific flow-level handler overriding it.
4. **The direct, practical payoff, stated clearly**: *"this is known as global level — in this project, a global-level error handler has been created and that same error handler has been utilized by all the flows"* — one shared, reusable definition instead of duplicating identical logic into every single flow's own error section.

### Component-Level (Try Scope) — Preview, Fully Explained on Day 17's continuation
- **The precise motivating gap this fills**: *On Error Propagate*/*Continue* at the flow level apply to the **entire flow's error handling** — but what if you specifically need error handling for just **one component, or a small group of components**, distinct from the rest of the flow (e.g. a Success Status Code Validator that only affects one particular HTTP Request, not others in the same flow)?
- **The fix: wrap the specific component(s) in a `Try` scope**, then attach error handling (typically `On Error Continue`, explained next) *inside* that Try scope specifically — demonstrated directly via two equivalent UI mechanics: dragging `Try` around existing components manually, **or** selecting the target components first and using **right-click → "Wrap In"** to automatically enclose them in a new Try scope.

## On Error Continue — the Real Distinction From On Error Propagate

```
On Error Propagate: catches error → processes it → sends it out via the LISTENER'S ERROR RESPONSE section (still ultimately an error)
On Error Continue:   catches error → processes it → sends it out via the LISTENER'S SUCCESS RESPONSE section (masks it as success!)
```

- **The precise, critical difference, stated directly and proven live**: *"On Error Propagate propagates the error to the next level. On Error Continue will propagate the [same processed result, but through the] success response [path] to the next level — it will not propagate the error response."* **Demonstrated concretely**: with `On Error Continue` in place, even a genuine `HTTP:CONNECTIVITY` failure results in an HTTP **200 OK** response being sent to the consumer — *"where did it go? Did it go to this part [error] or this part [success]? It went to [success], because the status score is 200."*
- **A direct, honest, important caveat on real-world usage frequency**: *"do we use this use case at any time [i.e., masking an entire flow's errors as blanket success]? We don't use this particular use case like this... we use it [10-20% of the time], and [only] with a Try scope"* wrapping specific components — never as a blanket flow-level strategy.
- **The correct, realistic use case, previewed directly (fully demonstrated with real examples on later days, per the transcript's own forward-reference)**: inside a **For Each** loop or a **Scatter-Gather** operation, if *one* item/branch fails, you often want processing to **continue with the remaining items/branches** rather than aborting the entire operation — `Try` + `On Error Continue`, scoped tightly around just the risky component(s), is the pattern for that, not a way to silently hide real failures from your consumer at the whole-flow level.

## Raise Error — For Business-Rule Errors, Not Technical Ones

- **The precise distinction that motivates this component, stated directly**: *"technical errors like HTTP connectivity... are automatically raised. In such scenarios, we don't need to raise any errors. But there are some business scenarios where you need to raise the errors"* — situations where the request is technically well-formed and every system involved is working fine, but a **business rule** still says this specific case should be rejected.
- **The fully worked example, given directly**: a loan application. Business rule: applicant age must be **greater than 17 and less than 66** (i.e., roughly 18-65). A request with, say, age 68 is **technically valid data** — it's just a case the business doesn't want to approve.
- **How it's configured, precisely**: a **Raise Error** component requires a custom **error type**, in `namespace:identifier` format (e.g. `BUSINESS:AGE`, built from a chosen namespace like `BUSINESS` and an identifier like `AGE`), plus a **description** (e.g. `"Age is not in the specified limits"`).
- **Confirmed live, directly**: triggering the Raise Error creates a genuine Error Object — inspectable via `error.errorType` (showing the custom `BUSINESS:AGE` type) and `error.description` (showing the exact custom message) — **exactly the same Error Object mechanism from Day 15**, just populated with your own deliberately-chosen values instead of an automatically-generated technical one.
- **The clean, one-line summary given directly**: *"whenever you wanted to raise some kind of business error, in that context, Raise Error will be utilized... you can define your own error type as well"* — versus technical errors (connectivity, timeouts, malformed data), which the platform generates automatically without you needing to raise anything yourself.

## Choice Router — Conditional Routing, Tied Directly Into the Raise Error Example

- **Precise definition given directly**: *"a component which is utilized for conditional-based routing"* — evaluates conditions **in sequence**, executing the first branch whose condition matches, falling through to a final **default** branch if none match.
- **Built live, directly extending the loan-age example**: Condition 1 checks `payload.age > 17 and payload.age < 66` → routes to a success message. The **default route** (reached when no condition matches) is wired to the **Raise Error** component described above — so an out-of-range age falls through to the default branch and triggers the custom business error.
- **Adding more conditions/routes, demonstrated directly, mechanically**: dragging a new component onto the existing Choice router (watching for a visual "black line" indicator showing where a new route will be inserted) automatically creates an additional condition branch — demonstrated by splitting the single age range into three real sub-ranges (18-29, 30-40, 41-65), each with its own distinct processing, still falling through to the same default/error route for anything outside all three.
- **The evaluation order, confirmed live and stated directly, precisely mirroring the ANY-ordering discipline from error handling**: *"in the choice, it will check the first condition... if the first condition matches, the second condition will not come"* — sequential, first-match-wins, exactly like error-type matching — reinforcing that this "check in order, stop at first match" pattern is a recurring, general Mule 4 idiom, not unique to error handling alone.

## Quick Recap
- **Copying XML directly (via the Configuration XML tab) is a real, practical technique** for reusing already-built logic (like error-handling blocks) without rebuilding from scratch — accept Studio's offer to regenerate a duplicate Doc:Id when prompted.
- **The "ANY must be last" rule was re-proven, deliberately, a second time** — moving ANY to the top causes it to swallow every error before any specific handler is ever reached; this is presented as important enough to demonstrate twice.
- **Error Mapping** lets you convert a generic connector error (e.g. `HTTP:CONNECTIVITY`) into your own custom, business-meaningful error type — rare in practice, but real.
- **Error handling exists at three levels**: **Flow** (specific to one flow), **Project/Global** (one shared handler, referenced by many flows or set as the application's default), and **Component** (Try scope, wrapping just the specific component(s) that need isolated handling).
- **On Error Propagate keeps the failure visible as an error to the consumer; On Error Continue masks it as a success** — the latter is a narrow, deliberate tool for specific scenarios (like continuing a loop after one item fails), never a blanket way to hide real failures from your caller.
- **Raise Error** is for **business-rule** rejections (valid data, but the business says no) — distinct from technical errors, which the platform raises automatically without your intervention.
- **Choice router** evaluates conditions in sequence, first-match-wins, with a mandatory default branch — the same "sequential, stop at first match" idiom that governs error-type matching too.
