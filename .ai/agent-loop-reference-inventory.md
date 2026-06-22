# Agent Loop Reference Inventory

Date: 2026-06-22

## Scope

This inventory asks a narrow question: which custom agents in `agents/*.md` are
not explicitly steered by a loop skill?

Loop skill sources scanned:

- `skills/ce-*/**/*.md`
- `skills/resolve-pr-feedback/**/*.md`
- `skills/pr-review-canvas/**/*.md`

Excluded from the reference count:

- README inventory tables
- generated target trees under `.generated/`
- agent self-descriptions
- non-loop standalone skills, unless they are part of a `ce-*` loop

## Summary

- Custom agents currently present: 30
- Agents explicitly referenced by loop skills: 29
- Agents with no loop-skill reference: 1

## True Orphans

These agents have no explicit loop-skill reference. They are unlikely to be
invoked by Claude, Codex, or other harnesses unless a user names them directly.

| Agent | Current Role | Keep? | Recommended Routing |
| --- | --- | --- | --- |
| `design-iterator` | Screenshot-analyze-implement loop for iterative UI refinement. Uses `frontend-design` as its design doctrine. | Keep, but only if wired. | Add to `ce-polish` for "design still not coming together", "iterate visually", and multi-pass polish requests. Add to `ce-work` only for explicit iterative UI refinement, not ordinary frontend implementation. |

### Proposed `design-iterator` Dispatch Contract

Best owner: `ce-polish`.

Trigger when:

- The user asks for iterative visual refinement.
- A UI change has already been implemented but the rendered result needs
  multiple screenshot-driven passes.
- The user says the design "isn't coming together", "make it feel better", or
  asks for N polish iterations.

Do not trigger when:

- The work is ordinary React implementation. Use
  `frontend-implementation-expert` from `ce-work` instead.
- The task is design-to-Figma fidelity review. Use
  `design-implementation-reviewer` from `ce-review` instead.

Handoff should include:

- route/story/preview URL or command to reach the UI
- target element or page section
- iteration budget
- explicit non-goals
- visual constraints from the product contract
- expected return: screenshots taken, edits made, checks run, remaining visual
  concerns

## Single-Loop Agents

These agents have exactly one loop-skill dispatch point. That can be healthy
when the loop owns a clear dispatch map, but these are worth watching because a
single vague mention can still mean "never invoked".

| Agent | Current Loop Reference | Assessment |
| --- | --- | --- |
| `adversarial-reviewer` | `ce-review` | Healthy. The dispatch map now names large/high-risk diffs. |
| `api-contract-reviewer` | `ce-review` | Healthy. API contract conditions are explicit. |
| `correctness-reviewer` | `ce-review` | Healthy. Always-on review lens for medium/large reviews. |
| `design-implementation-reviewer` | `ce-review` | Mostly healthy. Consider also routing from `ce-work` when the accepted task is Figma parity implementation and the parent needs a visual-fidelity check before final proof. |
| `documentation-specialist` | `ce-work` | Healthy if `ce-work` delegates substantial docs artifacts. Watch whether `document-review` should call it for heavy rewrites, or whether that would duplicate the skill. |
| `git-history-analyzer` | `ce-plan` deepening | Conditional but useful. Consider adding to `ce-work` prior-art search only when historical rationale would materially affect a change. |
| `julik-frontend-races-reviewer` | `ce-review` | Healthy if `ce-review` dispatches it for DOM lifecycle and timing-sensitive frontend diffs. |
| `kieran-python-reviewer` | `ce-review` | Healthy. Language-specific reviewer. |
| `kieran-typescript-reviewer` | `ce-review` | Healthy. It now owns TS review and conditionally uses `typescript-advanced-types`. |
| `maintainability-reviewer` | `ce-review` | Healthy. Core review dispatch. |
| `previous-comments-reviewer` | `ce-review` | Healthy for PR reviews with existing comments. |
| `project-standards-reviewer` | `ce-review` | Healthy. Standards checking belongs in review. |
| `reliability-reviewer` | `ce-review` | Healthy. Conditional operational-risk reviewer. |
| `testing-reviewer` | `ce-review` | Healthy. Changed-code test gap reviewer. |

## Multi-Loop Agents

These agents are explicitly steered in multiple loop contexts and are likely
worth keeping.

| Agent | Main Routing |
| --- | --- |
| `architecture-strategist` | `ce-plan` deepening and `ce-review` architectural diffs |
| `best-practices-researcher` | `ce-plan`, `ce-work`, `ce-compound` |
| `code-simplicity-reviewer` | `ce-review`, `ce-compound` |
| `framework-docs-researcher` | `ce-plan`, `ce-work`, `ce-compound` |
| `frontend-implementation-expert` | `ce-work` frontend implementation delegation |
| `learnings-researcher` | `ce-ideate`, `ce-plan`, `ce-optimize` |
| `pattern-recognition-specialist` | `ce-plan` deepening, `ce-compound` |
| `performance-reviewer` | `ce-review`, `ce-plan` deepening, `ce-compound` |
| `pr-comment-resolver` | `resolve-pr-feedback` |
| `react-test-architect` | `ce-work`, `ce-review` |
| `repo-research-analyst` | `ce-plan`, `ce-work`, `ce-optimize` |
| `session-historian` | `ce-sessions`, `ce-compound` |
| `slack-researcher` | `ce-brainstorm`, `ce-ideate`, `ce-plan`, `ce-slack-research` |
| `spec-flow-analyzer` | `ce-plan` |
| `web-researcher` | `ce-ideate`, `ce-plan` |

## Recommendations

1. Wire `design-iterator` into `ce-polish`. This is the only true orphan and
   has a clear loop owner.
2. Consider adding a narrow `ce-work` trigger for `design-implementation-reviewer`
   when the implementation task is explicitly Figma parity and the parent needs
   an independent visual fidelity pass.
3. Consider adding a narrow `ce-work` trigger for `git-history-analyzer` when
   local prior art is not enough and historical rationale would change the
   owner boundary or implementation approach.
4. Keep the reviewer agents even when they have only one dispatch point, because
   `ce-review` is now an explicit router. Their survival criterion should be
   whether `ce-review` actually dispatches them in practice, not whether they
   are mentioned by many files.

## Follow-Up Patch Candidates

- Add `design-iterator` dispatch rules to `skills/ce-polish/SKILL.md`.
- Add optional `design-implementation-reviewer` and `git-history-analyzer`
  routing notes to `skills/ce-work/SKILL.md` if those use cases prove common.
- Re-run this inventory after any agent deletion or restoration and keep README
  counts aligned with `find agents -maxdepth 1 -name '*.md'`.
