---
name: improve-codebase-architecture
description: Find deepening opportunities in a codebase using the project's existing AI artifacts, plans, decisions, and source code. Use when the user wants to improve architecture, find refactoring opportunities, consolidate tightly coupled modules, make code more testable, or make a repo easier for AI agents to navigate. Ground the review in `.ai/plans/`, `.ai/solutions/`, `.ai/reviews/`, `.ai/brainstorms/`, QMD or Obsidian context when available, and optional `CONCEPTS.md` or ADRs only when the target repo already uses them.
---

# Improve Codebase Architecture

Surface architectural friction and propose **deepening opportunities**: refactors that turn shallow modules into deep ones. The aim is testability, locality, leverage, and AI-navigability.

Use this skill to produce candidates. Do not implement the refactor during the discovery pass, and do not propose final interfaces until the user chooses a candidate.

## Vocabulary

Read [LANGUAGE.md](LANGUAGE.md) before writing recommendations. Use its terms consistently:

- **Module** - anything with an interface and an implementation.
- **Interface** - everything a caller must know to use the module correctly.
- **Implementation** - the code inside.
- **Depth** - leverage at the interface. **Deep** means high leverage. **Shallow** means the interface is nearly as complex as the implementation.
- **Seam** - where an interface lives. Use this term instead of "boundary."
- **Adapter** - a concrete thing satisfying an interface at a seam.
- **Leverage** - what callers get from depth.
- **Locality** - what maintainers get from depth.

Keep the philosophy intact:

- Use the **deletion test**: if deleting a module makes complexity vanish, it was a pass-through. If complexity reappears across callers, it was earning its keep.
- Treat the **interface as the test surface**.
- Respect the seam rule: **one adapter is hypothetical, two adapters are real**.
- Classify dependencies with [DEEPENING.md](DEEPENING.md) before judging how testable a deepened module would be.

## Process

### 1. Resolve Target And Contract

Identify the target repository before exploration. If the user names a repo, branch, PR, plan, or path, use that as the target even if it is not the current working directory. Announce:

- the target repo or path
- the product or maintenance contract being reviewed
- where the report will be written

Default report path:

```text
<target-repo>/.ai/reviews/YYYY-MM-DD-NNN-improve-codebase-architecture-review.html
```

Create `.ai/reviews/` if needed. Use the next daily sequence number from existing files in that directory. Use OS temp only for scratch artifacts from subagents or intermediate analysis.

### 2. Ground In Existing Project Memory

Search prior art before inspecting code deeply. Prefer the target repo's durable agent artifacts over inventing context:

1. Project instructions: `AGENTS.md`, and `CLAUDE.md` only when present as compatibility context.
2. Existing plans: `.ai/plans/`, especially active plans or plans matching the user's topic.
3. Prior learnings: `.ai/solutions/`, especially architecture patterns, conventions, workflow issues, and previous bug fixes.
4. Prior reviews and brainstorms: `.ai/reviews/` and `.ai/brainstorms/`.
5. Handoffs: `.ai/handoffs/` when recent or topic-matched.
6. QMD or Obsidian docs when available, using exact terms first and semantic queries when terms are uncertain.
7. Optional vocabulary and decision records: read `CONCEPTS.md`, `docs/adr/`, `adr/`, `decisions/`, or `ARCHITECTURE.md` only if they exist. Do not create glossary or ADR files during the candidate pass.

If QMD MCP is available, prefer it. Otherwise use the CLI:

```bash
qmd search "<exact terms>" -c ai
qmd search "<exact terms>" -c docs
qmd query "<architecture question>"
```

Do not depend on fixed collection names. If collections are unclear, inspect or list what exists and choose the closest knowledge, docs, wiki, notes, or artifact collections.

When no glossary exists, infer domain language from instructions, plans, source names, and user wording. State in the report that vocabulary was inferred.

### 3. Explore The Codebase

Use RepoPrompt or parallel exploration agents when available for broad unfamiliar areas. Otherwise use `rg`, targeted file reads, tests, and git history.

Explore organically and note where you experience friction:

- understanding one concept requires bouncing between many small modules
- a module is shallow because its interface is nearly as complex as its implementation
- pure helpers were extracted for testability, but bugs live in call ordering or orchestration
- coupled modules leak knowledge across seams
- callers repeat invariants, ordering rules, parsing, normalization, validation, or cache behavior
- tests must mock internal wiring instead of exercising behavior at an interface
- AI agents would have to read too many files to understand one product concept

Apply the deletion test to suspected shallow modules. Prefer candidates where deepening would concentrate product behavior and tests, not merely rename files.

Scope discipline matters. Do not expand into adjacent UX, validation, persistence, data modeling, or infra unless the accepted architecture contract cannot work without it.

### 4. Present Candidates As An HTML Report

Read [HTML-REPORT.md](HTML-REPORT.md) before writing the report.

Write one self-contained HTML report to the target repo's `.ai/reviews/` directory and open it for the user:

```bash
open <absolute-path>
```

Use `xdg-open` on Linux or `start` on Windows.

Each candidate must include:

- **Files** - involved modules or paths
- **Problem** - why the current architecture creates friction
- **Solution** - what would change, without proposing final interfaces
- **Benefits** - in terms of locality, leverage, and tests
- **Before / After diagram** - visual explanation of shallowness and deepening
- **Recommendation strength** - `Strong`, `Worth exploring`, or `Speculative`
- **Sources** - the `.ai`, QMD, docs, and source files that shaped the candidate

End with a **Top recommendation** section naming the candidate to tackle first and why.

Do not write implementation steps yet. Do not create or update `.ai/plans/` during the candidate pass. After the file is written, ask: "Which of these would you like to explore?"

### 5. Grilling Loop After The User Chooses

Once the user picks a candidate, switch from candidate discovery to design exploration.

Walk the design tree with them:

- the product contract the deepened module should own
- what currently leaks across the seam
- what should sit behind the interface
- dependency category from [DEEPENING.md](DEEPENING.md)
- which tests should move to the interface
- which old tests become redundant only after stronger interface tests exist
- what migration path keeps behavior stable

Side effects are opt-in and use the repo's actual artifact system:

- If the user wants an implementation plan, use `ce-plan` or write/update the relevant `.ai/plans/` artifact.
- If the user rejects a candidate for a load-bearing reason, offer to record the rationale through `ce-compound` as an `.ai/solutions/architecture-patterns/` or `.ai/solutions/conventions/` entry.
- If the repo already uses ADRs and the decision belongs there, offer an ADR. Do not introduce ADRs to repos that have not adopted them.
- If `CONCEPTS.md` exists and a durable domain term surfaces, defer vocabulary capture to `ce-compound` or `ce-compound-refresh` unless the current workflow explicitly owns that doc.
- Never create `CONTEXT.md` or a new glossary as a side effect of this skill.

For alternative interface designs, read [INTERFACE-DESIGN.md](INTERFACE-DESIGN.md).
