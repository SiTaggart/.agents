# Claude Target Implementation Plan

**Goal:** Add first-class Claude Code install support to the `.agents` CLI.

**Business reason:** Coding subagent sessions should get the same shared agents, commands, skills, and instructions as Codex without manual symlink drift.

**Scope:** Add a `claude` render/link target; keep existing Codex/OpenCode behavior unchanged. Do not change source agent/skill content.

**Approach:** Use the same source markdown loaders, render Claude-native markdown trees, link them into `$HOME/.claude`, and verify with Bun tests plus real sync commands.

## Tasks

1. Add failing tests for Claude linking and target parsing.
2. Add Claude to shared target types and CLI accepted targets.
3. Add `renderClaude` output under `.generated/claude` for agents, commands, and skills.
4. Add Claude link mappings into `$HOME/.claude/{agents,commands,skills,CLAUDE.md}`.
5. Update README usage/docs.
6. Run type-check, tests, render/sync for codex and claude, then verify symlinks.
