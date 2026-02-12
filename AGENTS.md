# AGENTS.md

You are working with a senior Design Engineer specializing in TypeScript and React. Apply these instructions across all projects unless a project-level AGENTS.md overrides them.

## Core Principles

- **Simplicity First:** Make every change as simple as possible. Impact minimal code. Never propose complex solutions when a simpler approach exists.
- **Business Context Before Code:** Always consider the "why" — user-facing goals and business constraints — before optimizing for code quality. If the business reason is unclear, ask for it before making edits.
- **No Laziness:** Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact:** Changes should only touch what's necessary. Avoid introducing bugs.
- **No Slop:** Do not add comments that restate what the code does. No `// Handle error`, no `// Return result`. Comments explain _why_, never _what_. Remove auto-generated filler.
- **Preserve Intent:** When modifying existing code, maintain the original patterns and conventions already in that file. Don't refactor what you weren't asked to change.
- **Type Safety Over Convenience:** Prefer compile-time guarantees over runtime checks. If the type system can prevent a bug, use it.

## Boundaries

### Always Do

- Run the linter and type-checker before marking any task complete
- Write or update tests when changing logic
- Use existing project patterns — match the style of surrounding code

### Never Do

- Never commit `.env`, secrets, API keys, or credentials
- Never use `any` to silence TypeScript errors — fix the types
- Never use `!` non-null assertion — handle the null case properly
- Never delete or modify tests to make them pass
- Never push to main/master directly
- Never propose complex solutions when a simpler approach exists
- Never assume an edit succeeded without verification

## Workflow Orchestration

### 1. Plan Mode Default

- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately — don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity
- For every non-trivial task, begin with a context block that states:
  - the goal
  - **the business reason for the change (what user-facing outcome does this serve?)**
  - constraints and scope boundaries
  - the intended approach in one sentence
- If any of those are missing — especially the business reason — ask only for the missing items before making edits

### 2. Approach Confirmation Gate

**MANDATORY: Before writing ANY implementation code, confirm the approach.**

- State your intended approach in 1-2 sentences and wait for confirmation on non-trivial changes
- If you're adding a new abstraction, lookup, or indirection: STOP and ask "is this simpler than just [direct approach]?"
- Do not add complexity (stream lookups, useEffect chains, indirect patterns) when a direct, minimal solution exists
- When reviewing code, flag over-engineering: "This could be simpler"
- Anti-patterns to avoid unless explicitly requested:
  - Stream/URL inference when a direct value is available
  - useEffect + useDebounce chains for one-shot operations
  - Moving logic between layers (hook <-> store) without being asked
  - Adding wrapper components or abstractions for single-use cases

### 3. Post-Edit Verification (MANDATORY)

**Every edit must be verified. Phantom edits are common — never assume success.**

- After EVERY edit to a store, hook, or component: immediately read back the modified lines
- Treat the Read result as ground truth — if the old code is still there, the edit failed; retry it
- Never proceed to the next file until the current edit is verified
- For multi-file changes: run `pnpm tsc --noEmit` after every 2-3 edits, not just at the end
- Run tests immediately after changes to catch gaps (missing imports, broken renderers)

### 4. Type Safety Checkpoints

- After editing any `.ts`/`.tsx` file that exports types, hooks, or store logic: run `pnpm tsc --noEmit` immediately
- Do NOT defer type checking to the end of a multi-file change — catch errors incrementally
- If typecheck fails, fix the error before touching any other file

### 5. Subagent Strategy

- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution
- For refactors or multi-file behavior changes, run one impact-mapping subagent before edits to identify call sites, exports, tests, and dependent stores/hooks so wrong-approach risk is reduced up front

### 6. Verification Before Done

- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness
- For UI changes: take a screenshot or describe the visual result
- Split execution into two explicit phases unless the task is purely mechanical:
  1) review and confirm an approach, 2) implement and validate

### 7. Demand Elegance (Balanced)

- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes — don't over-engineer
- Challenge your own work before presenting it

### 8. Autonomous Bug Fixing

- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests — then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

### 9. Self-Improvement Loop

- After ANY correction from the user: update `.ai/tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 10. PR Workflow (mandatory for all PR-bound changes)

1. **Review phase:** Review diff vs main. Categorize findings as P1 (bugs/correctness), P2 (important improvements), P3 (nits). Consider business context FIRST — does this achieve the stated goal? NO edits during this phase.
2. **User confirms** which findings to fix
3. **Fix phase:** Apply fixes with typecheck after each edit. Verify every edit applied by reading back changed lines.
4. **Commit + PR:** Commit all changes before creating the PR. Do not wait for the user to push without committing first.

## Code Style

### TypeScript & React

- Strict TypeScript: no `any`, no `as` casts unless unavoidable (add `// SAFETY:` comment explaining why)
- Prefer `interface` for object shapes, `type` for unions/intersections/utility types
- Use named exports over default exports
- Prefer `const` declarations; never use `var`
- Use template literals over string concatenation
- Prefer optional chaining (`?.`) and nullish coalescing (`??`) over manual null checks
- React components: function declarations with explicit return types (`function Component(): React.ReactElement`)
- Prefer composition over inheritance — compose small, focused components
- Co-locate related code: component, hook, types, and tests in the same directory
- Keep components under 150 lines; extract logic into custom hooks when a component does too much

### Functional & Declarative Style

**IMPORTANT: Write functional, declarative code. Avoid imperative patterns.**

- Use `map`, `filter`, `reduce`, `forEach`, `flatMap` — never `for`, `while`, or `for...of` loops
- Use lodash utilities (`_.groupBy`, `_.keyBy`, `_.uniqBy`, `_.partition`, `_.flow`, `_.pick`, `_.omit`, etc.) when they improve clarity over vanilla JS
- Prefer `lodash/fp` or point-free style when chaining multiple transformations
- Declare data transformations as pipelines, not step-by-step mutations
- Prefer `Object.entries()`, `Object.keys()`, `Object.values()` with `.map()` / `.reduce()` over `for...in`
- Use `Array.from()` with map callback over spread + map for iterables
- Avoid mutable state: prefer spreading (`{ ...obj, key: value }`) over `Object.assign` or direct mutation
- Use `Readonly<T>` and `ReadonlyArray<T>` for data that should not be mutated

```typescript
// YES - declarative pipeline
const activeUserNames = users
  .filter((user) => user.isActive)
  .map((user) => user.name);

// YES - lodash for complex transforms
const groupedByRole = _.groupBy(users, 'role');
const lookup = _.keyBy(items, 'id');

// NO - imperative loops
const names = [];
for (const user of users) {
  if (user.isActive) names.push(user.name);
}
```

### Design Engineering

- Prioritize visual polish and interaction quality — animations, transitions, micro-interactions matter
- Use CSS variables for design tokens; prefer Tailwind utility classes when available
- Semantic HTML first, then style with CSS/Tailwind
- Responsive by default: mobile-first approach
- Accessible by default: proper ARIA attributes, keyboard navigation, focus management
- When implementing UI, match the design precisely — pixel-level fidelity is the goal

## Tool Preferences: RepoPrompt First

**When the RepoPrompt MCP server is available, prefer its tools over built-in equivalents. They use ~80% fewer tokens and support richer operations.**

### Exploration & Search

| Instead of | Use | Why |
|------------|-----|-----|
| Grep / Glob | `file_search` (MCP) | Combines path + content + regex in one call |
| `ls` / `find` / Bash | `get_file_tree` (MCP) | Structured tree with depth control |
| Read (full file) | `read_file` (MCP) | Line slicing built-in, avoids dumping |
| Reading files for API shape | `get_code_structure` (MCP) | Function/type signatures only — 10x fewer tokens |
| Spawning explore subagents | `context_builder` (MCP) | Two-stage AI: research model + analysis model in one call |

### Editing & File Operations

| Instead of | Use | Why |
|------------|-----|-----|
| Edit tool | `apply_edits` (MCP) | Multi-edit transactions, whole-file rewrites, better whitespace handling |
| Write tool / Bash file creation | `file_actions` (MCP) | Create/delete/move with auto-selection |
| Multiple sequential Edit calls | `apply_edits` with `edits` array | Atomic batch, fewer round-trips |

### Git & Review

| Instead of | Use | Why |
|------------|-----|-----|
| Bash `git status/diff/log` | `git` (MCP) | Safe read-only, structured output, artifact publishing |
| Manual diff reading for review | `context_builder` with `response_type="review"` | Full code review with git diff context |
| Ad-hoc file exploration for planning | `context_builder` with `response_type="plan"` | Architectural plan grounded in real code |

### Key Workflows

1. **Brownfield exploration:** Start with `get_file_tree` → `get_code_structure` on key dirs → `file_search` for specifics. Never dump full files when codemaps suffice.
2. **Before complex changes:** `context_builder` with `response_type="plan"` — builds optimal file context autonomously, then generates an implementation plan.
3. **After making changes:** `context_builder` with `response_type="review"` — thorough code review with git diff context.
4. **Deep Q&A:** `context_builder` with `response_type="question"` — understands unfamiliar code with curated context.
5. **Iterative refinement:** Use `chat_send` with the returned `chat_id` to continue analysis without rebuilding context.
6. **Subagent exploration:** Use the `rp-explorer` agent type — it uses `rp-cli` for token-efficient context gathering within subagents.

### Context Curation

- Use `manage_selection` to build focused file sets (full, slices, or codemap_only modes)
- Use `workspace_context` to snapshot current state before major operations
- Prefer slices and codemaps over full file content — only promote to full when you need every line

### Fallback

When RepoPrompt MCP is unavailable (e.g., in subagents without MCP access), fall back to:
- `rp-cli -e '<command>'` via Bash for the same operations
- Built-in Read/Edit/Grep/Glob as last resort

### MCP Session Protocol

- **At session start:** if the task requires Linear, Notion, or other MCP services, verify connectivity with a lightweight read operation before starting work
- If a tool call fails mid-session: immediately re-discover tools via ToolSearch — do NOT retry the failed tool name
- Do not retry stale/hashed tool names
- For tasks spanning multiple MCP services: complete one service interaction before depending on another — isolate failures
- Break multi-service tasks into separate sessions when possible
- Add explicit fallback for tool failures: log the failure mode and switch to `RepoPrompt_*` equivalents only when compatible, otherwise use `rp-cli` or direct commands only as last resort

## Task Management

1. **Plan First:** Write plan to `.ai/tasks/todo.md` with checkable items
2. **Verify Plan:** Check in before starting implementation
3. **Track Progress:** Mark items complete as you go
4. **Explain Changes:** High-level summary at each step
5. **Document Results:** Add review section to `.ai/tasks/todo.md`
6. **Capture Lessons:** Update `.ai/tasks/lessons.md` after corrections
- In `.ai/tasks/todo.md`, mark tasks as: review-planned, implementation, validation, and blocked
- For PR-bound work, enforce a review-then-fix sequence: review findings first, then implement only the approved fixes

## Document Paths

All generated documents live under the `.ai/` directory. This keeps agent artifacts hidden in one folder per project. When upstream content (compound-engineering-plugin) uses bare `docs/` paths, always prefix them with `.ai/`.

| Purpose | Path |
|---------|------|
| Plans | `.ai/docs/plans/` |
| Brainstorms | `.ai/docs/brainstorms/` |
| Solutions | `.ai/docs/solutions/` |
| Todos | `.ai/todos/` |
| Tasks | `.ai/tasks/` |
| Handoffs | `.ai/handoffs/` |
| PR descriptions | `.ai/thoughts/shared/prs/` |
