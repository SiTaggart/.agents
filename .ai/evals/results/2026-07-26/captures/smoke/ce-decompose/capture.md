# `ce-decompose` capture

## Scope and safety

- Requested range: `HEAD~2..HEAD`
- Range type: committed branch range
- Git semantics: two-dot diff, as documented by `ce-decompose` for a branch
- Default review threshold: 1,500 changed lines
- History-rewrite execution count: **0**
- Carve execution count: **0**
- Independent seam passes: **2** (primary analysis plus one fresh read-only agent)
- No commit, reset, rebase, checkout, stash, or other history-changing command ran.
- No skill or source file was edited. This capture is the only created file.

## Exact range

```text
base: 0f014194ce3ee50acbff9ae928e5fd8a7b59cf54
head: 7562446ae4d2c9eeed8b9f9d9a3e406a298e5b1d
range: 0f014194ce3ee50acbff9ae928e5fd8a7b59cf54..7562446ae4d2c9eeed8b9f9d9a3e406a298e5b1d
symbolic range: HEAD~2..HEAD
commit count: 2
```

Commits, oldest first:

1. `8dbafc7cf4c418e56fff1a39283b3cec6dc8da48` — `Add bro skill for plain-language restatements (#54)`
2. `7562446ae4d2c9eeed8b9f9d9a3e406a298e5b1d` — `fix(agent-workflow): improve communication and review checks (#55)`

The merge base of `HEAD~2` and `HEAD` is the exact base SHA above.

## Commands and measurements

### Range identity

```bash
git rev-parse HEAD~2
git rev-parse HEAD
git merge-base HEAD~2 HEAD
git rev-list --count HEAD~2..HEAD
git log --oneline --decorate --no-renames HEAD~2..HEAD
```

Measured:

```text
base SHA: 0f014194ce3ee50acbff9ae928e5fd8a7b59cf54
head SHA: 7562446ae4d2c9eeed8b9f9d9a3e406a298e5b1d
merge base: 0f014194ce3ee50acbff9ae928e5fd8a7b59cf54
commit count: 2
```

### Skill-documented size

The sizing basis preserves Git's default rename detection:

```bash
git diff HEAD~2..HEAD --numstat \
  | awk '{a+=$1; d+=$2} END {print a " additions, " d " deletions, " a+d " changed lines"}'
git diff HEAD~2..HEAD --shortstat
```

Measured:

```text
3,130 additions
1,358 deletions
4,488 changed lines
93 files
```

Per commit:

```bash
git show --format='commit %H%nsubject %s' --shortstat 8dbafc7
git show --format='commit %H%nsubject %s' --shortstat 7562446
```

Measured:

```text
8dbafc7: 2 files, 12 insertions, 0 deletions, 12 changed lines
7562446: 91 files, 3,118 insertions, 1,358 deletions, 4,476 changed lines
```

The 4,488-line range is 2.99 times the 1,500-line tripwire. The first commit is already atomic. The second commit needs decomposition.

### Rename and whitespace diagnostics

The raw add/delete diagnostic deliberately disables rename detection:

```bash
git diff --numstat --no-renames HEAD~2..HEAD \
  | awk '{a+=$1; d+=$2} END {print a " additions, " d " deletions, " a+d " changed lines"}'
```

Measured:

```text
6,664 additions
4,892 deletions
11,556 raw changed lines
```

This is not the decomposition size. It double-counts the Remotion file moves. The documented default-rename measurement is 4,488 lines.

The Vercel subtree is whitespace-only:

```bash
git diff HEAD~2..HEAD --numstat -- skills/vercel-react-best-practices \
  | awk '{a+=$1; d+=$2; f++} END {print f " files, " a " additions, " d " deletions, " a+d " changed lines"}'
git diff -w --shortstat HEAD~2..HEAD -- skills/vercel-react-best-practices
```

Measured:

```text
17 files, 143 additions, 143 deletions, 286 changed lines
git diff -w output: empty
```

Whitespace check:

```bash
git diff --check HEAD~2..HEAD 2>&1 | rg -c 'trailing whitespace|space before tab'
git diff --check HEAD~2..HEAD -- skills/vercel-react-best-practices 2>&1 \
  | rg -c 'trailing whitespace|space before tab'
git diff --check HEAD~2..HEAD -- skills/remotion-best-practices 2>&1 \
  | rg -c 'trailing whitespace|space before tab'
```

Measured:

```text
153 whitespace errors total
143 in skills/vercel-react-best-practices
10 in skills/remotion-best-practices
```

## Semantic grouping of the existing range

These groups partition all 93 diff entries and all 4,488 changed lines.

| Group | Files | Add | Delete | Changed |
| --- | ---: | ---: | ---: | ---: |
| Plain-language `bro` skill | 2 | 12 | 0 | 12 |
| Agent communication guidance | 1 | 11 | 12 | 23 |
| Review skills | 2 | 15 | 3 | 18 |
| Computer-use skill | 1 | 153 | 0 | 153 |
| `gh-stack` skill | 1 | 872 | 0 | 872 |
| Improve/advisor skill | 4 | 29 | 19 | 48 |
| Orca CLI skill | 1 | 52 | 238 | 290 |
| Orchestration skill | 1 | 109 | 18 | 127 |
| React Doctor docs | 2 | 6 | 0 | 6 |
| Find-skills and writing-great-skills maintenance | 2 | 5 | 1 | 6 |
| Lockfiles | 2 | 46 | 77 | 123 |
| Remotion entrypoint | 1 | 17 | 315 | 332 |
| Remotion Mediabunny | 4 | 21 | 0 | 21 |
| Remotion captions | 4 | 6 | 6 | 12 |
| Remotion create | 3 | 118 | 1 | 119 |
| Remotion docs | 1 | 47 | 0 | 47 |
| Remotion interactivity | 1 | 18 | 0 | 18 |
| Remotion markup | 31 | 1,235 | 99 | 1,334 |
| Remotion render | 2 | 28 | 0 | 28 |
| Remotion SaaS | 4 | 157 | 0 | 157 |
| Remotion upgrade | 1 | 30 | 0 | 30 |
| Remotion retired rules/assets | 5 | 0 | 426 | 426 |
| Vercel React whitespace churn | 17 | 143 | 143 | 286 |
| **Total** | **93** | **3,130** | **1,358** | **4,488** |

## Strategy decision

Use a **mixed carve**:

- Split and keep the coherent skill changes.
- Keep the existing first commit as the first atomic unit.
- Split the monolithic second commit at file-level ownership seams.
- Use hunk-level grouping only for `skills-lock.json`.
- Put each skill's registry entry or hash hunk in the same unit as that skill, so every intermediate unit has aligned content and registry state.
- Discard the 286-line Vercel whitespace-only subtree.
- Discard its 2-line `skills-lock.json` hash replacement because the subtree no longer changes.
- Preserve the Remotion content, but remove its 10 trailing-whitespace errors when a future writable carve is executed.
- Do not rebuild the substantive content. The code and document changes have clear seams.

The resulting proposed surface is 4,200 changed lines. The discarded surface is 288 changed lines.

The fresh independent seam pass agreed on split-and-keep, the Vercel discard, the main skill boundaries, the Remotion content/taxonomy split, and colocating registry hunks with their owning skill. The reconciliation uses the exact path-based measurements below.

## Proposed carve

This is a proposed ordered commit stack. No unit has been executed.

### U01 — Add the plain-language `bro` skill

- Surface: `skills/bro/**`
- Size: 2 files, 12 changed lines
- Dependency: none
- Treatment: keep existing commit `8dbafc7` as-is

### U02 — Adopt dyslexia-friendly agent communication guidance

- Surface: root `AGENTS.md`
- Size: 1 file, 23 changed lines
- Dependency: none

### U03 — Make parent review passes own validation

- Surface: `skills/ce-review/**`, `skills/ce-technical-review/**`
- Size: 2 files, 18 changed lines
- Dependency: none

### U04 — Add the computer-use skill

- Surface: `skills/computer-use/SKILL.md` plus its `skills-lock.json` entry
- Size: 2 file surfaces, 159 changed lines
- Dependency: none

### U05 — Replace the Orca CLI guide with a version-matched discovery stub

- Surface: `skills/orca-cli/SKILL.md` plus its `skills-lock.json` hash
- Size: 2 file surfaces, 296 changed lines
- Dependency: none

### U06 — Update the Orca orchestration and handoff contract

- Surface: `skills/orchestration/SKILL.md` plus its `skills-lock.json` hash
- Size: 2 file surfaces, 133 changed lines
- Dependency: U04 and U05

### U07 — Add the `gh-stack` skill

- Surface: `skills/gh-stack/SKILL.md` plus its `skills-lock.json` entry
- Size: 2 file surfaces, 878 changed lines
- Dependency: none

### U08 — Harden the improve/advisor workflow

- Surface: `skills/improve/**` plus its `skills-lock.json` hash
- Size: 5 file surfaces, 54 changed lines
- Dependency: none

### U09 — Document React Doctor design-audit support

- Surface: `skills/react-doctor/**` plus its `skills-lock.json` hash
- Size: 3 file surfaces, 8 changed lines
- Dependency: none

### U10 — Correct the find-skills CLI reference

- Surface: `skills/find-skills/SKILL.md` plus its `skills-lock.json` hash
- Size: 2 file surfaces, 3 changed lines
- Dependency: none

### U11 — Add writing-great-skills OpenAI metadata

- Surface: `skills/writing-great-skills/agents/openai.yaml` plus its `skills-lock.json` hash
- Size: 2 file surfaces, 7 changed lines
- Dependency: none

### U12 — Add new Remotion markup topic guides

- Surface:
  - `skills/remotion-best-practices/remotion-markup/effects.md`
  - `skills/remotion-best-practices/remotion-markup/map.md`
  - `skills/remotion-best-practices/remotion-markup/mapbox.md`
  - `skills/remotion-best-practices/remotion-markup/sfx.md`
  - `skills/remotion-best-practices/remotion-markup/text-highlights.md`
  - `skills/remotion-best-practices/remotion-markup/video-editing.md`
- Size: 6 files, 865 changed lines
- Dependency: none

### U13 — Add new Remotion creation and SaaS topic guides

- Surface:
  - `skills/remotion-best-practices/remotion-create/video-layout.md`
  - `skills/remotion-best-practices/remotion-saas/framework.md`
  - `skills/remotion-best-practices/remotion-saas/player.md`
  - `skills/remotion-best-practices/remotion-saas/rendering.md`
- Size: 4 files, 191 changed lines
- Dependency: none

### U14 — Reorganize the Remotion taxonomy and migrate existing guidance

- Surface: the remaining Remotion entrypoint, category indexes, file moves, and edits, excluding U12, U13, and U15
- Size: 42 files, 1,042 changed lines with default rename detection
- Dependency: U12 and U13
- Treatment: use file-level moves where possible; keep move detection enabled for review

### U15 — Retire obsolete Remotion rules and align its registry hash

- Surface:
  - `skills/remotion-best-practices/rules/assets/charts-bar-chart.tsx`
  - `skills/remotion-best-practices/rules/assets/text-animations-typewriter.tsx`
  - `skills/remotion-best-practices/rules/assets/text-animations-word-highlight.tsx`
  - `skills/remotion-best-practices/rules/sfx.md`
  - `skills/remotion-best-practices/rules/text-animations.md`
  - Remotion's `skills-lock.json` entry
- Size: 6 file surfaces, 432 changed lines
- Dependency: U14

### U16 — Retire the legacy lockfile

- Surface: delete `.skill-lock.json`; add the unchanged `orca-linear` record to `skills-lock.json`
- Size: 2 file surfaces, 79 changed lines
- Dependency: U04, U05, U06, U08, and U15; place last

Every proposed unit is below the 1,500-line threshold. The largest is U14 at 1,042 lines.

Because `skills-lock.json` is split by region across units, future execution must stage its hunks directly. A whole-file commit helper would collapse sibling units.

## Exact confirmation gate

No blocking-question tool is available in this execution mode, so the skill's numbered-chat fallback applies.

```text
Confirmation gate — no execution is authorized in this scratch clone:

1. Approve this carve for later execution in a writable clone.
2. Revise the carve.
3. Done for now.

Reply with 1, 2, or 3. I will not rewrite history here.
```

No selection has been made. The workflow stops here.

## Execution count

```text
proposed units: 16
history-rewrite executions: 0
carve executions: 0
commits created: 0
resets run: 0
rebases run: 0
history modifications: 0
```

## Final turn

```text
Analysis is complete. The range is 4,488 changed lines; the proposed mixed carve keeps 4,200 lines in 16 reviewable commits and drops 288 lines of whitespace-only Vercel churn plus its lock hash. No history-changing command ran; carve execution count: 0.

[capture.md](/tmp/ce-evals/smoke/ce-decompose/capture.md)

Confirmation gate — no execution is authorized in this scratch clone:

1. Approve this carve for later execution in a writable clone.
2. Revise the carve.
3. Done for now.

Reply with 1, 2, or 3. I will not rewrite history here.
```
