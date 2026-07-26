---
name: ce-slack-research
description: "Search Slack for interpreted org context and synthesize decisions, constraints, and discussion arcs."
---

# /ce-slack-research

Search Slack for organizational context and receive an interpreted research digest.

## Usage

```
/ce-slack-research [topic or question]
/ce-slack-research
```

The input can be a keyword, a natural language question, or include Slack search modifiers like channel hints (`in:#channel`) and date filters (`after:YYYY-MM-DD`). The agent extracts the topic and formulates searches from whatever form the input takes.

## Execution

If no argument is provided, ask what topic to research. Use the platform's blocking question tool (see `../ce-conventions/SKILL.md`). Never silently skip the question.

Dispatch `slack-researcher` with the user's topic as the task prompt. Omit the `mode` parameter so the user's configured permission settings apply. The agent handles everything from here — Slack MCP discovery, search execution, thread reads, and synthesis — and returns an interpreted digest.

If the agent reports that Slack is unavailable (MCP not connected or auth expired), relay the message to the user. Do not attempt alternative research methods.
