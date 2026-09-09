# Day 24 — RAML Best Practices: Externalizing Examples and Data Types for Readability and Reuse

## Session Agenda
- Why a single, growing 300+-line RAML file becomes a real maintenance problem
- Externalizing **examples** into separate JSON files, referenced via `!include`
- Externalizing **data types** (request/response/error schemas) into separate `.raml` files, referenced via `types` + `type`
- The precise mechanics of RAML folder organization: `examples/`, `data-types/` (with request/response/error subfolders)
- A direct, important distinction: reuse *within* one API spec vs. reuse *across* multiple API specs (setting up Day 25's Fragment discussion)
- Templates as a real, practical time-saver for starting new API specs

## Why Bother — the Direct, Concrete Motivation
*"There are almost 300 lines. Instead of putting everything in one file, let's externalize some of them and refer them from there. Even if there is a change, we can easily do it from here... the main important line of code is easily visible to us."* Two concrete, named benefits: **readability** (the main file becomes short and scannable) and **maintainability** (a change only needs to happen in one place, the externalized file, rather than being hunted down across a sprawling single file).

## Externalizing Examples — Full Mechanics

```
apiSpec/
└── examples/
    ├── requests/
    │   └── post-request-example.json
    ├── responses/
    │   └── post-response-example.json
    └── error-responses/
        ├── 400-error-example.json
        └── 500-error-example.json
```

- **Step-by-step process, demonstrated directly**: create an `examples` folder → create subfolders for `requests`, `responses`, `error-responses` (a deliberate organizational choice, explicitly noted as one valid approach among others: *"everyone can write in the examples folder [flatly] — the naming convention will be a little different [if you don't subfolder] — we will maintain it a little differently [for] easy identif[ication]"*).
- **Cut the inline JSON example out of the main RAML file**, paste it into its own `.json` file inside the appropriate subfolder.
- **Reference it back using `!include` plus the file's copied relative path** — obtained directly via Design Center's own **right-click → "Copy Path"** feature on the file, avoiding manual path-typing errors.
- **A concrete, live-verified proof that the reference actually enforces the same validation as before**: after externalizing, a deliberately-wrong value (a string where a number was expected for `employeeSalary`) still correctly triggers a validation error — confirming the externalized file is genuinely being read and validated, not just cosmetically referenced.
- **Real, practical reuse of error-response examples across multiple resources, demonstrated directly**: since the 400/500 error structures are largely identical across POST/PATCH/GET, the same example files are duplicated (or directly reused) rather than rewritten for each resource — *"we have a template already, we utilize that template... we can duplicate it... we don't have to fill up everything again."*

## Externalizing Data Types — a Distinctly Different Mechanism From Examples

- **The key conceptual distinction, stated directly and precisely**: *"we have used the include keyword [for examples]... but for this [data types], it will be a little different."* Examples use `!include`; **data types use a different two-step mechanism**: `types:` (to **import** a data type file into the root RAML, giving it an alias) and `type:` (to **apply** that imported alias to a specific field/body).
- **What a "data type" precisely represents, defined directly**: *"a request is a schema, or data type... this is the object, it has these properties, in these properties this string should be there, this number should be there."* It's the **structural definition** — not a plain example — the actual type/shape enforcement mechanism.
- **The concrete, real proof that a data type genuinely validates data, not just documents it**: *"in the example, instead of 80,000 salary, can I get 1 lakh? It will allow, right? But instead of 80,000 or 1 lakh, if a string comes, will it allow? [No] — because the schema defined for that particular data type is not accepting it."* Examples are illustrative; data types are the actual enforcement layer.
- **The folder structure and reference syntax, demonstrated directly**:
  ```
  apiSpec/
  └── data-types/
      ├── requests/
      │   └── post-request-datatype.raml
      ├── responses/
      │   └── post-response-datatype.raml
      └── error-responses/
          ├── 400-error-datatype.raml
          └── 500-error-datatype.raml
  ```
  Each `.raml` data-type file starts with its own `#%RAML 1.0 DataType` header line, then the actual `object`/`properties` structure — imported into the root file via:
  ```raml
  types:
    PostRequestDataType: !include data-types/requests/post-request-datatype.raml
  ```
  then applied to a specific body via `type: PostRequestDataType`.

## A Real, Genuinely Valuable Reusability Judgment Call — Worked Through Directly

- **The specific opportunity spotted live**: the **success response** structure for Create (`{statusCode, message}`) is **identical** to what a generic success-response data type would look like. **The direct, deliberate reasoning walked through, rather than automatically reusing everything**: *"can we reuse it? ... if there is any possibility for reusability, we should use it. But... the error response schema will be a bit different — there will be 4-5 fields extra here, event ID, etc."* — the success responses across POST/PATCH are genuinely identical and **are** reused via a shared reference; the error responses are **not** blindly reused, specifically because a closer look reveals they're structurally different enough (extra fields) to warrant their own separate definitions.
- **The generalized professional principle, stated directly, worth remembering exactly**: *"we should not develop blindly — when we develop, is there any possibility of reusability? Not only for API specification, for anything... a piece of code has to be used in multiple places — is it better to bring it and define it and reuse it, or is it better to do it in my place? It is better to reuse it. That's the way a developer should think."* This isn't a RAML-specific rule — it's presented directly as a **general professional habit**: actively look for genuine reuse opportunities, but verify the things being reused are *actually* the same, not superficially similar.

## The Critical Scope Limitation — Set Up Directly for Day 25
- **A precise, important boundary stated directly**: *"if we create another API, will we be able to reuse all these data types and examples? ... you cannot reuse it now [across a different API spec] — if you want to reuse it for this, you have to use Fragment."* Everything built in this session (data types, examples, folder structure) is **scoped to this one API specification only** — reusing these *across multiple, separate API specs* requires a genuinely different mechanism (**Fragment**), explicitly deferred to the very next session.

## Templates — A Real, Practical Time-Saver
- **The direct, concrete motivation**: *"is it better to create [this folder structure] like this every time, or is it better to have a template? ... it will take me at least 10-15 minutes [to set up from scratch] — the same structure will be followed by the whole organization."*
- **The practical mechanism, given directly**: keep a fully-scaffolded template project (with the folder structure already built, ready to fill in) in Exchange or as a duplicable project in Design Center — **duplicate it, rename it for the new project, and start filling in the specifics**, rather than manually recreating the same `examples`/`data-types` folder skeleton every single time a new API spec is started.

## A Genuine Practice Note, Given Directly and Honestly
While repeating the same cut/paste/re-indent steps across POST, PATCH, and GET's request/response/error structures: *"you might think I am doing it fast, but there is nothing — we are doing one step multiple times... till I practice it 3-4 times, you will also get it."* The mechanics genuinely do become fast and automatic with repetition — the instructor is direct that the *speed* seen in the demo is a product of practiced repetition, not any hidden shortcut.

## Quick Recap
- **Examples are externalized via `!include` + a file path**; **data types are externalized via a two-step `types:` (import + alias) then `type:` (apply)** mechanism — genuinely different syntax for genuinely different purposes (illustrative examples vs. actual structural/type enforcement).
- **A data type is the real validation layer** — proven directly by showing a type-mismatched example value get correctly rejected, unlike a plain example which is purely illustrative.
- **Reuse should be deliberate and verified, not automatic** — success responses were reused because they were genuinely identical; error responses were kept separate because closer inspection revealed real structural differences.
- **Everything built this session is scoped to ONE API specification** — cross-API-spec reuse requires **Fragment**, the very next session's topic.
- **Templates are a real, practical time-saver** for scaffolding new API specs consistently across an organization, rather than manually rebuilding the same folder structure from scratch each time.
