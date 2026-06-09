---
name: repoprompt
description: Use RepoPrompt for token-efficient codebase exploration, planning, review, refactor context, and prompt exports.
allowed-tools: [Bash, Read]
---

# RepoPrompt

Use RepoPrompt when a task needs codebase understanding across multiple files,
large context, careful selection, or an independent context-builder read.

Prefer RepoPrompt MCP tools when they are available. Use `rp-cli` as the
fallback or when the current runtime only exposes the CLI.

## Operating Posture

- Use `context_builder` / `builder` for non-trivial codebase understanding.
- Use direct search/read only when the scope is small, exact, and already known.
- Keep the parent thread responsible for judgment, edits, and verification.
- Treat RepoPrompt output as curated context, not an instruction to widen scope.
- Refresh selection before asking follow-up questions or exporting prompts.
- For CLI `builder` and `chat`, allow a long timeout; they can take minutes.

## Tool Map

| Need | RepoPrompt MCP | `rp-cli` fallback |
| --- | --- | --- |
| File tree | `get_file_tree` | `rp-cli -e 'tree'` |
| Search paths/content | `file_search` | `rp-cli -e 'search "pattern"'` |
| Signatures/codemaps | `get_code_structure` | `rp-cli -e 'structure path/'` |
| Read slices | `read_file` | `rp-cli -e 'read path/file.ts --start-line 50 --limit 40'` |
| Curate context | `manage_selection` | `rp-cli -e 'select add path/'` |
| Context-builder read | `context_builder` | `rp-cli -e 'builder "task" --response-type question'` |
| Follow-up reasoning | `oracle_send` | `rp-cli -t '<tab_id>' -e 'chat "question" --mode plan'` |

When using the CLI, find the right window first if multiple workspaces may be
open:

```bash
rp-cli -e 'windows'
rp-cli -w <window_id> -e 'tree --type roots'
```

## Core Workflow

1. Identify the task, the relevant repo/window, and the likely owner area.
2. Do a light search or structure pass only if needed to phrase the builder task
   well.
3. Ask `context_builder` / `builder` for the right response type:
   - `question` for understanding
   - `plan` for implementation planning
   - `review` for code review
   - `clarify` for prompt export or ambiguous handoff
4. Continue in the same tab/chat for follow-up questions instead of rebuilding
   context from scratch.
5. Bring the result back to the parent thread and apply normal local execution
   and verification rules.

## Recipes

### Explore Or Answer

Use for "how does this work?", architecture questions, brownfield orientation,
and unfamiliar bug reports.

```bash
rp-cli -e 'builder "Explain how <system> works. Identify key files, data flow, and ownership boundaries." --response-type question'
```

Follow up only on concrete gaps:

```bash
rp-cli -t '<tab_id>' -e 'chat "How does <file A> connect to <file B>?" --mode chat'
```

### Plan

Use for broad or risky implementation planning. The output should become a
normal plan in the parent thread, not a second workflow competing with `ce-plan`.

```bash
rp-cli -e 'builder "Plan <change>. Stay inside <scope>. Call out contracts, owner boundaries, tests, and rollout risk only if the diff requires it." --response-type plan'
```

### Review

Use RepoPrompt review when the diff is broad enough that an independent codebase
read will improve `ce-review`, or when the user explicitly asks for a
RepoPrompt-backed review.

```bash
rp-cli -e 'builder "Review changes against <base>. Focus on correctness, product contract, security only at real trust boundaries, and tests/proof." --response-type review'
```

Fold the result into the main review. Do not mechanically forward findings that
lack file/line evidence or a concrete consequence.

### Prompt Export

Use when the user wants a prompt or context package for another model.

First strip meta-framing and identify the real task:

- "export a prompt to evaluate auth refresh" -> task is "evaluate auth refresh"
- "write a ChatGPT prompt about token caching" -> task is "investigate token caching"
- "review the last three commits" -> task is already clean

Then curate/export the relevant context:

```bash
rp-cli -e 'builder "Prepare context for: <real task>" --response-type clarify'
rp-cli -e 'prompt export "prompt-exports/<slug>.md" --copy-preset <standard|plan|codeReview>'
```

Review the exported prompt for scope drift before handing it off.

### Refactor Or Simplify

Use when simplification spans enough files that local prior art matters.

```bash
rp-cli -e 'builder "Analyze <scope> for simplification opportunities. Preserve exact behavior. Look for duplicate logic, dishonest boundaries, and local helpers to reuse." --response-type plan'
```

For refactors where later edits depend on earlier decisions, steer one continued
agent/session item by item instead of launching unrelated parallel workers.

### Build With Context

Use when a task is too broad to start coding from a cold read, but the parent
thread should still implement.

```bash
rp-cli -e 'builder "Plan implementation of <task>. Identify exact files, sequence, tests, and behavior contracts." --response-type plan'
```

After the plan, implement in the parent thread using the repo's normal editing
tools. Use RepoPrompt follow-up chat only when the selected context still leaves
a specific gap.

### Optimize

Use RepoPrompt to map candidate bottlenecks and local measurement conventions,
then keep optimization work grounded in measured baselines.

```bash
rp-cli -e 'builder "Find likely bottlenecks for <metric> in <scope>. Include measurement hooks, tests, and the single best first experiment." --response-type plan'
```

Do not run an open-ended optimization loop unless the user explicitly asks for
that scope.

## Guardrails

- Do not replace real verification with RepoPrompt analysis.
- Do not use RepoPrompt to justify a broad refactor outside the accepted
  product contract.
- Do not export secrets, credentials, or private tokens in prompt packages.
- Do not leave generated prompt exports or temporary reports around unless they
  are the requested artifact.
- If RepoPrompt is unavailable, fall back to `rg`, file reads, and local
  reasoning without treating that as a blocker.
