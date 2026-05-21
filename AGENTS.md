# AGENTS.md

Global instructions for coding agents. Project-level `AGENTS.md` or `CLAUDE.md`
files add local context and override only overlapping instructions.

## Working Style

- Work with a senior Design Engineer specializing in TypeScript and React.
- Prefer the smallest correct change that solves the real user-facing problem.
- Understand the business reason before optimizing the code shape.
- Find root causes. Do not ship temporary fixes unless explicitly asked.
- Preserve local intent, naming, ownership boundaries, and file conventions.
- Do not refactor unrelated code while solving a narrow task.
- Prefer compile-time guarantees over runtime checks when the type system can
  prevent the bug.
- Remove filler. Comments explain why, not what.

## Production Outcome Contract

- Before editing, identify the contract being changed: user action, UI state,
  backend payload, URL state, persisted state, rendered output, or published
  artifact.
- Done means that contract is proven at the closest real surface:
  - UI state and rendered output agree.
  - UI changes are checked in a real browser or local browser automation when a
    route, story, or preview surface exists.
  - Backend/request contracts are exercised with real or representative data.
  - Docs are updated in the canonical destination and read back.
  - Touched files are clean for relevant lint, format, type, and test gates.
- State what was proven and what was not. Do not let passing commands stand in
  for user-facing verification.

## Boil the Ocean

- The marginal cost of completeness is near zero with AI. Do the whole thing.
  Do it right. Do it with tests. Do it with documentation. Do it so well that
  Garry is genuinely impressed - not politely satisfied, actually impressed.
- Never offer to table a permanent solve when it is within reach. Never leave a
  dangling thread when tying it off takes five more minutes. Never present a
  workaround when the real fix exists.
- The standard is not "good enough"; it is "holy shit, that's done." Search
  before building. Test before shipping. Ship the complete thing.
- When Garry asks for something, the answer is the finished product, not a plan
  to build it. Time is not an excuse. Fatigue is not an excuse. Complexity is
  not an excuse. Boil the ocean.

## Non-Negotiables

- Never commit `.env`, secrets, API keys, credentials, or private tokens.
- Never push directly to `main` or `master`.
- Never use `any` to silence TypeScript errors. Fix the type boundary.
- Never use `!` non-null assertions. Handle the null case.
- Never delete, weaken, or skip tests to make a change pass.
- Never assume an edit succeeded. Read back changed lines after editing.
- Run the relevant linter, type-checker, and tests before marking work done, or
  report the exact blocker and the narrower verification that passed.

## Prior Art

- For non-trivial work, search prior art before planning or writing code.
- For broad explanatory questions, query the knowledge base before
  reconstructing the answer from code. Use existing wiki, docs, notes, and
  agent-artifact collections as the precomputed context layer, then inspect
  source code only to verify drift-prone or implementation-level details.
- Do not depend on fixed collection names. If the relevant QMD collections are
  not obvious on the current machine, list or inspect the available collections
  first, then choose the closest knowledge, docs, wiki, notes, and artifact
  collections for the task.
- Search `ai` for agent artifacts: plans, designs, reviews, investigations.
- Search `docs` for project documentation: specs, meetings, research.
- Use exact terms first, then semantic searches when vocabulary is uncertain.
- If QMD MCP is available, prefer it. If not, use:

```bash
qmd search "keywords" -c ai
qmd search "keywords" -c docs
qmd query "question"
```

| Situation | Search For | Collection |
| --- | --- | --- |
| Feature work | prior designs, specs, related plans | both |
| Debugging | prior investigations, module names, error text | ai |
| Architecture | decisions, rationale, meeting notes | both |
| Docs | existing docs to extend or reference | docs |

## Planning

- Plan only when it reduces risk. For broad, risky, or ambiguous work, begin
  with a short context block:
  - goal
  - business reason
  - constraints and scope boundaries
  - intended approach
- For narrow fixes and direct requests, act after enough local discovery.
- If the business reason is missing and the work changes product behavior, ask
  for it before editing.
- Confirm the approach before implementation when the work is broad, risky, or
  introduces a new abstraction.
- If adding an abstraction, lookup, wrapper, or indirection, ask whether the
  direct approach is simpler.
- If the task is a bug report, reproduce or identify evidence, then fix it.
  Do not ask for hand-holding.

## Execution

- Keep edits tightly scoped.
- Match surrounding file style before applying global preferences.
- If the current area is prototype-like, use nearby code to understand the
  contract, but use mature local features as the quality bar.
- Do not expand frontend tasks into backend, infra, or data-model work unless
  the user asked for that scope.
- After every edit to a store, hook, component, schema, or route, read back the
  changed lines.
- For multi-file TypeScript changes, type-check after every few meaningful
  edits instead of deferring all errors to the end.
- If type-checking fails, fix that error before moving to unrelated files.
- For UI changes, verify the running surface when available. Exercise the
  changed state in a browser and inspect the result visually, not just by tests
  or DOM assertions.
- If full-repo checks are noisy, verify the touched surface and report the
  unrelated baseline separately.

## PR Workflow

- Review phase: inspect diff vs main, categorize findings as P1, P2, or P3.
- Consider business outcome before code aesthetics.
- Do not edit during review unless the user asks for fixes.
- Fix phase: apply only confirmed fixes, verify each edit, run checks.
- Commit before creating a PR unless the user explicitly says otherwise.

## TypeScript And React

- Match local TypeScript and React conventions before applying global
  preferences.
- Prefer `interface` for object shapes and `type` for unions, intersections, and
  utility types.
- React components should be function declarations with explicit return types:

```tsx
function TracePicker(): React.ReactElement {
  return <div />;
}
```

- Co-locate related component, hook, type, and test files when the project
  already uses that pattern.
- Keep components focused. Extract domain logic into helpers, reducers,
  selectors, or hooks when JSX starts carrying business rules.
- Use `unknown` plus parsing at external boundaries instead of trusting raw data.
- Avoid casts. If a cast is unavoidable, add a short `// SAFETY:` comment that
  explains the invariant.

## Production Feature Architecture

Prefer **contract-oriented functional core with thin effect adapters**.

- Start by identifying the product contract: backend payloads, URL state,
  persisted state, user actions, mutations, subscriptions, and render output.
- Encode contracts with TypeScript types, Zod schemas, endpoint metadata,
  discriminated unions, or explicit state-machine actions.
- Use explicit state-machine actions when behavior has meaningful transitions.
  Otherwise prefer named pure helpers, selectors, parsers, hydrators, compilers,
  validators, row builders, and model helpers.
- Put deterministic behavior in named, testable modules.
- Keep React hooks and components focused on effects and rendering: fetches,
  mutations, polling, URL sync, persistence, subscriptions, analytics, toasts,
  dialogs, and imperative library interop.
- Centralize IO behind query, mutation, or command hooks. Do not scatter fetches,
  invalidation, or save behavior through UI components.
- Treat URL state, persisted state, backend contracts, and cache invalidation as
  product contracts, not incidental plumbing.
- Use lodash for clear data transformations: `groupBy`, `keyBy`, `uniqBy`,
  `orderBy`, `partition`, `pick`, `omit`, and projection pipelines.
- Prefer declarative transforms, but allow explicit loops or local mutation
  inside isolated reducers, selectors, parsers, or adapters when they make a
  state machine, hot path, or imperative-library boundary clearer.
- When integrating imperative libraries, isolate the imperative engine behind a
  controller or adapter and keep the rest of the feature typed and composable.

### Honest Function Boundaries

- Prefer pure helpers, but keep their signatures honest. A helper should accept
  the smallest meaningful values it directly reasons about.
- Compose broad domain objects at the boundary that owns the workflow: public
  actions, render resolvers, validators, hooks, components, and IO adapters.
  Below that boundary, pass explicit values into lower helpers.
- Avoid courier arguments. Do not pass broad objects like `chart`, `series`,
  `trace`, `source`, `config`, `context`, or `state` through helper layers just
  so a lower function can read one field or forward the object again.
- Flag helpers when they read only one or two fields from a broad object, pass a
  broad object onward without meaningful local use, accept both a broad object
  and a value derived from it, recompute a derived value already known at the
  caller, or use a wrapper object that obscures duplicated semantic inputs.
- Prefer explicit dependencies such as `dateMode`, `seriesId`, `dateBinding`,
  `windowKind`, `seriesDateSetup`, `chartDateSetup`, `seriesCount`, `colorHue`,
  or `traceWindow` over passing the whole parent object.
- Broad objects are fine when the function truly owns a broad transition or
  invariant. The goal is explicit dependencies, not primitive obsession.

### Good: Compose At Boundary, Pass Honest Values

```ts
const chartDateSetup = chartDefaultDateSetup(chart);

return resolveTraceDateWindow({
  chartDateSetup,
  seriesDateSetup: series.dateSetup,
  traceWindow: trace.window,
});
```

### Bad: Courier Arguments Hide Dependencies

```ts
return resolveTraceDateWindow(chart, series, trace);

function resolveTraceDateWindow(
  chart: ChartSpec,
  series: ChartSpecSeries,
  trace: ChartSpecTrace
): DateWindow | null {
  return trace.window.kind === "chart-window"
    ? chartDefaultDateSetup(chart).windows.find(...)
    : series.dateSetup.windows.find(...);
}
```

### Good: Boundary Parse, Typed Core

```ts
const response = metadataSchema.parse(rawResponse);
const catalog = buildSourceCatalog(response.sources);

return hydrateChartSpec(savedSpec, catalog);
```

### Bad: Inline Backend Shaping In JSX

```tsx
const rows = data?.items.map((item) => ({
  label: item.name ?? item.id,
  value: item.value || 0,
}));

return <Grid rows={rows ?? []} />;
```

### Good: Domain Result, Caller Owns UI

```ts
type ValidationResult =
  | { ok: true }
  | { ok: false; reason: "duration-mismatch"; traceIds: string[] };

function validateEqualDuration(spec: ChartSpec): ValidationResult {
  return hasEqualDuration(spec)
    ? { ok: true }
    : { ok: false, reason: "duration-mismatch", traceIds: traceIds(spec) };
}
```

### Bad: Domain Rule With Toast Side Effect

```ts
function validateTrace(trace: Trace): boolean {
  if (!hasValidDuration(trace)) {
    toast.error("Trace duration does not match");
    return false;
  }

  return true;
}
```

### Good: Explicit State Machine

```ts
type Action =
  | { type: "cellEdited"; rowId: string; field: Field; value: Value }
  | { type: "remoteChanged"; submission: Submission }
  | { type: "saveSucceeded"; serverState: Submission[] };

function reducer(state: DraftState, action: Action): DraftState {
  switch (action.type) {
    case "cellEdited":
      return applyLocalEdit(state, action);
    case "remoteChanged":
      return applyRemoteChange(state, action.submission);
    case "saveSucceeded":
      return commitServerState(state, action.serverState);
  }
}
```

### Bad: State Transitions Spread Across Effects

```ts
useEffect(() => {
  if (remoteData) {
    setDrafts(mergeDrafts(drafts, remoteData));
  }
}, [remoteData, drafts]);

function onSave(): void {
  setIsSaving(true);
  patchRows(drafts);
  setDirty(false);
}
```

### Good: Isolate Imperative Engines

```tsx
function MapRenderer({ layers }: Props): React.ReactElement {
  const controller = useMapController();

  useEffect(() => {
    controller.setLayers(layers);
  }, [controller, layers]);

  return <MapCanvas ref={controller.containerRef} />;
}
```

### Bad: Imperative Library Leaks Through UI

```tsx
function LayerToggle(): React.ReactElement {
  deck.setProps({ layers: buildLayers() });
  map.flyTo({ center });

  return <Button>Toggle</Button>;
}
```

## Testing Bar

- Test the lowest meaningful seam that proves the behavior: schema parsing,
  hydrators, state transitions, selectors, validators, URL sync, mutation
  commands, cache invalidation, hooks, and adapter behavior.
- Do not create React component, page, or render tests just because changed code
  lives near React. First identify the lowest meaningful behavioral contract.
- Avoid mock-heavy UI tests that only prove React wiring, browser behavior, or
  implementation details.
- Use UI or component tests when the regression is genuinely interaction-level,
  visual-state-level, or a user journey would otherwise be unprotected.
- Before adding a `.test.tsx` render test, state the user-visible behavior that
  requires rendering and why a lower-level test would be insufficient. Existing
  component tests nearby are not permission to add another one.
- Avoid "wiring proof" tests that mount components only to observe props, mocked
  hooks, or effect calls. Test the hook, state, command, parser, reducer,
  selector, adapter, or schema contract directly instead.
- For PR cleanup, derive the exact touched-file manifest from the diff and make
  that surface clean. Warnings count as failures when they will become errors.
- Prefer the project's existing test shape over a new harness.

## Design Engineering

- Build the actual usable experience first, not a marketing page, unless a
  landing page is explicitly requested.
- Match the existing design system before introducing new visual language.
- Prioritize information density, scanning, and repeated workflows for
  operational tools.
- Use semantic HTML, keyboard access, focus management, and ARIA where needed.
- Use CSS variables or existing design tokens.
- Use icons for familiar actions when an icon exists.
- Avoid nested cards, decorative blobs, one-note palettes, and oversized hero
  typography inside tools.
- Make text fit at mobile and desktop sizes. Do not allow labels, controls, or
  overlays to collide.

## Tooling

### RepoPrompt First

- When RepoPrompt MCP is available, prefer it for codebase exploration and
  review.
- Prefer `file_search` over `grep` or globbing.
- Prefer `get_file_tree` over `ls` or `find`.
- Prefer `read_file` with line ranges over dumping full files.
- Prefer `get_code_structure` for API shape and signatures.
- Prefer `context_builder` for deep planning, reviews, and unfamiliar code.
- Prefer `manage_selection` and slices/codemaps before full-file context.
- If RepoPrompt is unavailable, use `rp-cli`; then fall back to shell tools.

### Shell

- Prefer `rg` and `rg --files` for search.
- Use direct, non-interactive commands.
- Avoid destructive git commands unless the user explicitly asks.
- Do not revert user changes.

### Browser

- Prefer Browser Use or the in-app browser for local web automation when
  available. Use `agent-browser` as a fallback.
- For frontend changes, open the relevant route, story, or preview surface.
- Exercise the changed interaction and inspect the final rendered state.
- Capture a screenshot or describe the visual result before marking UI work
  done.
- Re-check the page after interactions.
- If browser tooling or the server is unavailable, do not change product scope
  to make verification pass. Use the closest available surface and report the
  blocker.

## Task Artifacts

- Keep generated agent artifacts under `.ai/`.
- Create durable todos or lesson notes only when the task genuinely needs them
  or a user correction reveals a repeatable pattern.
- For upstream instructions that mention bare `docs/` paths for agent artifacts,
  prefix them with `.ai/`.
- For docs, specs, research, and PR descriptions, identify the canonical
  publishing surface before editing. If Linear or GitHub is canonical, treat
  local markdown as the working copy and read back the published version.
