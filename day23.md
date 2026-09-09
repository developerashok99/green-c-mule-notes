# Day 23 — Hands-On RAML: Building the HR Employee API Specification in Design Center

## Session Agenda
- The four project types in Design Center, and when each is actually used
- Full, live, hands-on RAML authoring for the Employee use case: naming conventions, headers, body schema, response codes
- Real RAML syntax mechanics: indentation/alignment, `enum`, `required`, `additionalProperties` placement, `default`
- Auto-generated documentation and the built-in "Try It" testing feature — including a real, honestly-unresolved bug encountered live
- A closing teaser: modularizing RAML for reusability (next session's topic)

## The Four "Create New" Options in Design Center — Precisely Distinguished
| Option | When it's actually used |
|---|---|
| **New API Specification** | The standard, default choice — building a fresh RAML/OAS spec from scratch (what this session does) |
| **New Fragment** | Reusable RAML *pieces* — explicitly deferred: *"we will discuss what this fragment is in further classes"* (directly connects to the April-batch course's own RAML Fragments concept, for anyone cross-referencing) |
| **New Async API** | For **asynchronous** API specifications — noted directly as *"recently introduced"* and used in rare, specific instances |
| **Import from File / Sync from Existing GitHub Repo** | When a RAML file already exists elsewhere (exported previously, or stored in a GitHub repo) and needs to be brought into Design Center rather than authored fresh |

## Two Authoring Modes: "Guide Me Through It" vs. Designing Freely
- **"Guide me through it"**: offers step-by-step tips — suited to genuine RAML beginners.
- **"I am comfortable designing it my own way"**: chosen directly in this session — *"we are already pro in developing things, we will be able to do it from scratch itself."*

## Naming the Project — Applying the Naming Conventions Directly
- **The actual name used**: `hr-employees-sapi` (with a batch number appended in this training context, explicitly noted as *"just for importing into the studio easily"* — not something you'd do in a real project).
- **Format selection**: RAML **1.0** chosen directly, consistent with Day 21/22's established real-world dominance of 1.0 over 0.8.

## The Design Center Layout, Precisely Described
```
Left panel: file/resource tree for this API spec
Middle panel: where you actually write the RAML
Right panel: auto-generated documentation (updates live as you type)
```
- **A genuinely convenient feature demonstrated directly**: typing a `description` for the API produces **auto-suggested keywords** in the documentation panel, without any extra manual step.

## The Critical Naming Convention: Resources Must Be Nouns, Plural, No Action Verbs

- **The precise rule, given directly and firmly**: *"employee is not noun, basically — noun represents something, a thing or a person... and it should be plural. The action point should not be there."*
- **The wrong instinct, called out and corrected directly, live**: naming sub-resources `employees/add`, `employees/update`, `employees/fetch` — explicitly flagged as violating convention, since `add`/`update`/`fetch` are **verbs** (actions), and the HTTP **method** (POST/PATCH/GET) is what should already communicate the action — a resource name should describe *what thing* the API operates on (`employees`), not *what you're doing to it*.
- **A direct, honest, real-world caveat, immediately following the "correct" rule**: *"as per the rules and regulations, we should [follow this] — but in real time, they say they will use it in a different way. Unless there is a very strict architect... they say they will keep it as they like."* Even a well-established convention like this one isn't universally enforced in practice — some real teams do name resources with action verbs anyway, and the instructor is direct that this happens regardless of "official" best practice.
- **The corrected, final resource structure, built live**: a single `employees` resource, with **POST** (create), **PATCH** (update), and **GET** (fetch) as its three methods — exactly matching the earlier Day 21 design decision, now actually implemented in real RAML.

## RAML Mechanics: Indentation, Minimize/Maximize, and Reuse via Copy-Paste

- **Indentation is structurally meaningful, not cosmetic — demonstrated directly and repeatedly**: *"since it has a tab space for it, automatically they will fall under the employees category"* — RAML (being YAML-based) uses indentation to express nesting, exactly like the property-file YAML syntax from Day 14. A misaligned tab silently changes what's nested under what.
- **The Minimize/Maximize (collapse/expand) feature**, used directly and repeatedly to keep a growing 300+-line RAML file navigable — collapsing a fully-specified header/resource block once it's done, to avoid visual clutter while working on the next one.
- **Copy-paste as a real, practical authoring technique, demonstrated directly**: since the `origin` and `language` headers share nearly identical structure, the instructor **copies the first header's block, pastes it, and edits only the differing values** — exactly the same "reuse, then adjust" discipline recommended generally on Day 22, now applied concretely to RAML authoring itself.

## Headers, Built in Full Detail

### `transactionId` header
| Property | Value | Notes |
|---|---|---|
| `type` | `string` | |
| `required` | `true` | **Stated directly: `required: true` is RAML's default** even if omitted — matching Day 22's established fact |
| `minLength` / `maxLength` | e.g. 32 | Field-level length constraints, exactly as introduced on Day 22 |

- **A precise, important clarification on exact field-name matching, stated directly**: *"our consumer should send it as you defined here — even if they send it in capital T, or even if they send it in capital I, that won't work — you have to throw a bad request. The field name and the field [in the spec] should be the same."* Header/field names are **case-sensitive** for matching purposes — a subtly different casing is treated as a genuinely different, unrecognized field.

### `origin` header — introducing `enum`
- **`enum`, precisely explained via a live, deliberate example**: restricting the header's accepted values to an explicit list — demonstrated with two values first (e.g. `mobile`, `web`), then a third (`iot`) added live to show the mechanic. **The direct, concrete consequence of an enum violation**: *"what will happen if you don't add IOT? Error will come"* — any value not explicitly listed in the `enum` is automatically rejected.
- **A live, real validation-error debugging moment, worth noting**: sending a value not present in the currently-configured enum list produces a live "bad request" via Design Center's own built-in mock — directly demonstrating that Design Center enforces the spec's own constraints, not just documents them.

### `language` header — introducing optional fields and `default`
- **Marked optional**: `required: false`.
- **A genuinely subtle, real RAML gotcha, worked through directly and honestly**: an optional **string**-typed header technically **cannot** simply be omitted in a way that "sends nothing" — *"this can be a string, or we can send null — will this work then? It will not work... it is expecting a string."* **The actual fix, given directly**: use RAML's `default` property — e.g. `default: null` (or a sensible default string) — so that when the header genuinely isn't sent, the specification still has a well-defined, spec-compliant fallback value to fall back on, rather than leaving an ambiguous gap.

## Body Schema, Built in Full Detail — Including a Live Ordering Bug

- **Object structure**: `employeeId` (string), `employeeName` (string), `employeeSalary` (number), `employeeDesignation` (string), `employeeStatus` (boolean) — each with its own `type`, `required`, and `example`.
- **A direct, practical note on abbreviation acceptability in comments/descriptions**: *"even if you don't write the full name of the employee, you only write EMP"* — informal abbreviation is fine in descriptive text, distinct from the actual field *names themselves*, which must match exactly as specified.
- **A real, live `additionalProperties` placement bug, fully worked through — genuinely instructive**: setting `additionalProperties: false` in the wrong position within the object definition produces a real error (*"expecting boolean, null provided"*). **The fix, found live and stated precisely**: `additionalProperties` must be placed **after the `object` type declaration but BEFORE the `properties` block** — *"this is [an] order issue... give it before the properties, after the object."* A small but genuinely easy structural-ordering mistake, resolved through careful, direct experimentation rather than guessing.
- **A direct, honest, reassuring note on document imperfection**: *"there is no rule to be 100% right in the document [handed to you by the business/architect] — if there is a small thing [wrong, like a typo in a field name], you have to make the [correction] — it is technical related"* — i.e., part of a developer's real job is **noticing and correcting small inconsistencies** in the source requirements document itself, not treating it as infallible.

## Response Codes, Built Directly

- **Success**: `201` (Created) for the POST create-employee endpoint, with body structure `{ statusCode, message }` and a matching `example`.
- **Error responses, reused via copy-paste**: `400` (Bad Request) and `500` (Internal Server Error), sharing the **same underlying structure** as the success response (`statusCode` + `message`) but with different example values — *"the structure is also the same, right? Only values matter... it's better to [copy-paste] rather than [rewrite]."*

## Auto-Generated Documentation and "Try It" — A Real, Live, Unresolved Bug

- **The documentation panel, confirmed directly to auto-populate**: API title, version, resources, methods, headers (including which are optional vs. mandatory), and body schema — all generated live from the RAML being authored, with **zero separate documentation-writing effort**.
- **The built-in "Try It" feature, precisely described**: *"this design center works like a Postman"* — you can send a real test request directly against a Design Center-generated mock, without needing an external tool.
- **A genuine, honestly-unresolved live bug, worth preserving as-is**: repeated "Try It" test attempts return a **bad request** tied to the `enum` validation, **even when a value from the allowed enum list is actually being sent** — *"I am unable to trace it out... this is a bit [confusing]... even if you fix it, it will always appear as an issue."* The instructor tries multiple values, inspects the request payload carefully, and **does not fully resolve it within this session** — explicitly reframing the goal directly: *"here it is not working. Why it is not working? ... I'll show you how to test it [a different way] — it's a different matter... there's another way called a mocking service — we'll create it and test it accordingly."* **The direct, honest lesson drawn from this, worth remembering**: built-in tooling (even from the vendor itself) doesn't always behave perfectly, and a real developer's response is to find an **alternative verification path** (here: a separately-configured mocking service, covered in an upcoming session) rather than getting stuck waiting for the original tool to cooperate.

## Closing Teaser: Modularization for Reusability (Next Session)
- **The direct, honest motivating statement**: *"how many lines of code is there now? 300 and plus... even in any programming language, if you write [that many] lines of code, it is very difficult [to manage]... if there is something called reusability — [the] headers [block] is repeated three times — if I write it here once and refer to it [elsewhere], it will be easy. The number of lines of code will also decrease."*
- **Explicitly flagged as the very next session's topic**: breaking this single, growing RAML file into a organized, modular folder structure, extracting repeated pieces (like the shared headers) into reusable references — directly foreshadowing RAML's **Traits** and **Resource Types** concepts (already covered in depth in the April-batch course's `apr25.md`, for anyone cross-referencing that material) as the actual mechanism for this reuse.

## Quick Recap
- **Design Center's 4 project types** each serve a distinct purpose — New API Specification is the default; Fragment, Async API, and Import/Sync are for more specific, less common scenarios.
- **Resource names must be nouns, plural, with no action verbs** — the HTTP method should carry the action — though real-world enforcement of this convention varies by organization and architect.
- **RAML is indentation-sensitive** (YAML-based) — misalignment silently changes nesting, and copy-paste-then-edit is a genuinely efficient, realistic authoring technique for near-identical blocks.
- **Field/header names must match exactly, case-sensitively** — and optional string fields need an explicit `default` to avoid an ambiguous "send nothing" gap.
- **`additionalProperties` has a specific required position** — after `object`, before `properties` — a real, easy-to-hit ordering mistake, resolved live through careful experimentation.
- **Documentation and a "Try It" tester are auto-generated for free** from the RAML itself — though built-in tooling can have its own real bugs (demonstrated live, honestly unresolved), and a good developer finds an alternative verification path rather than getting stuck.
- **Next up: modularizing this 300+-line RAML file for reusability** — directly motivated by the real pain of repeated blocks (like headers) as a spec grows.
