# ce-* Suite Cleanup — Applying the Claude 5 Context-Engineering Guidelines

> **Status (2026-07-25): executed, Phases 0–5.** Suite: 19,110 → 13,392 lines
> (−30% net, including ~700 new lines of evals, ce-conventions, and shared
> references). Verified: bun lint/type-check/test green, all three targets
> render, no stale references or broken file pointers, `bun run sync claude`
> deployed. Not yet run: the new eval suites (ce-brainstorm/ce-plan/ce-ideate
> evals/) under the skill-creator framework — run them before the next
> synthesis- or intake-related skill change. Uncommitted on branch
> SiTaggart/bowhead at time of writing.

Source: [The new rules of context engineering for Claude 5 generation models](https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models) (Anthropic, Thariq Shihipar).

Audit basis: full read of all 21 ce-* SKILL.md files (6,355 lines), their reference
trees (~7,433 lines), and all 30 agent personas (2,786 lines) — six parallel audit
agents, one per cluster, with quote-and-line-anchored findings.

## The lens

The article's shifts, applied as audit criteria:

1. **Rules → Judgment.** Prescriptive guardrails, thresholds, and step scripts
   were old-model insurance. State intent; trust the model.
2. **Examples → Interface design.** Worked examples constrain exploration.
   Schemas, enums, templates-as-structure, and return contracts hint at correct
   use without narrowing it.
3. **Upfront → Progressive disclosure.** Load the right context at the right
   time. A SKILL.md is a lightweight guide, not a central repository.
4. **Repetition → Say it once, where it belongs.** No duplicated instructions
   across system prompt / CLAUDE.md / skills / agent descriptions.
5. **Manual memory → Auto-memory.**
6. **Simple specs → Rich references.** Code, test suites, schemas, and rubrics
   handed to verifier agents beat prose restatements.
7. Constraint is still allowed in **highly important areas** — safety, data
   loss, context blowouts, untrusted input.

## Headline result

The suite is ~16,600 maintained lines. Roughly half is fat by the article's
definition — none of it taste. Realistic post-cleanup target: **~8,000 lines
(−50%)** with every genuinely opinionated rubric preserved.

The taste worth keeping is real and dense: ce-brainstorm's rigor-gap rubric,
ce-debug's prediction/causal-chain method, ce-decompose's git seam craft,
ce-compound's schema-as-interface, ce-optimize's crash-safe persistence design,
ce-council's anonymized panel, the reviewer personas' "what you don't flag"
territory partitioning. The fat is almost entirely: duplication, choreography,
worked examples, and old-model distrust scaffolding.

## Where the suite runs against the guidelines

### 1. Repetition (the biggest violation, by far)

- **The AskUserQuestion / Codex / Gemini / Pi blocking-question boilerplate
  appears 20+ times suite-wide** (7× work cluster, 8+× planning cluster,
  6× optimize cluster, 3–4× each compound skill, 2× research cluster).
  ~10 lines each. One shared convention (or one sentence) replaces all of it.
- **Byte-identical duplicated files:** ce-plan ↔ ce-brainstorm rendering refs
  (`html-rendering.md` 539 + `markdown-rendering.md` 208 = 745 lines duplicated);
  ce-compound ↔ ce-compound-refresh contract tree (`schema.yaml`,
  `yaml-schema.md`, `concepts-vocabulary.md`, `resolution-template.md`,
  `validate-frontmatter.py` = 658 lines duplicated). `synthesis-summary.md`
  already forked between plan/brainstorm (397 vs 272) — the drift bomb went off.
- **Skills restate the always-loaded AGENTS.md:** taste-skill routing stated 3×
  (AGENTS.md + ce-work + ce-quality-gate); candidate-not-constraint stated 3×
  (AGENTS.md + ce-plan Principle 9 + ce-grill "Stress the Frame");
  no-any/no-`!`/no-skipped-tests, read-back-after-edit, browser proof, and
  RepoPromptCE tool preferences all restated in skills.
- **Skills restate agent descriptions:** ce-review's 16-bullet dispatch table,
  ce-work's dispatch map inner detail, ce-decompose's "Relationship To Other
  Skills," ce-slack-research restating slack-researcher's output contract.
  The harness already surfaces agent descriptions at selection time.
- **Internal restatement:** ce-optimize's disk-is-source-of-truth stated ~8×;
  ce-compound-refresh's headless rules stated ~8×; ce-thermo-nuclear's one
  rubric rendered as 5 stacked lists; ce-review says "review-only" twice;
  learnings-researcher restates its whole methodology as a DO/DON'T section.
- **Layer above:** AGENTS.md's "Phase Skills" section duplicates routing the
  skill descriptions already carry (flagged by two independent auditors).

### 2. Rules where judgment now works

- **Routing state machines:** ce-ideate's ~200-line Phase 0 (subject
  identifiability rubric, mode taxonomy, cost-transparency scripts); ce-plan's
  Phase 0.0 token parser with YAML-comment edge-case law and deepen-trigger
  vocabulary rules; ce-compound-refresh's route-by-scope numeric tiers;
  ce-sessions' scan-window lookup table.
- **Menu choreography:** gated option menus with renumbering rules and branch
  conditions in ce-work, ce-quality-gate, ce-decompose, ce-ideate, ce-council,
  ce-plan (plan-handoff), ce-brainstorm (handoff). Replace each with 2–3 intent
  lines; keep the one real guardrail (never route to ship while behavior is
  unproven).
- **Count arithmetic:** "10–30 hypotheses," "~36–48 raw ideas → 25–30
  survivors," "4 vs 6 sub-agents," "at most 1–3 agents per section," "extract at
  most five skeletons." Judgment territory.
- **Distrust scaffolding:** "STOP. This load is non-optional," "Do not
  pre-judge from memory," "improvising from memory produces the wrong
  facilitation," "Never classify a direct invocation as not-a-planning-task."
  One calm sentence each, or delete.
- **Defect patches written as rules:** ce-brainstorm's tier-guard ("that was a
  real defect that produced one-sentence syntheses"), ce-plan's YAML-comment
  trap, ce-ideate's V5/V15/V17 patch markers. These are regression tests living
  in prompts — move them to evals (ce-sessions/evals is the in-repo precedent).

### 3. Examples that constrain

- Worked transcripts: ce-compound's 29-line fake success output, refresh's
  broad-triage transcript, ce-sessions' 22-line dispatch example (placed right
  after the field list that already defines the contract).
- Literal chat templates in ce-plan/ce-brainstorm ("emit one of the two literal
  templates below") — state required content, let the model phrase it.
- 30–45-line output-format skeletons in ~10 personas — section names + one line
  each suffice.
- XML `<example>` blocks inside `description` frontmatter
  (documentation-specialist ~330 words, react-test-architect) — loaded into
  every session, pure waste.
- **Keep** (these are interfaces, not examples): schema.yaml enums, the
  resolution/handoff templates, headless report formats, token-budget return
  contracts, repo-research-analyst's `Scope:` parameter,
  frontend-implementation-expert's Operating Boundary / Return Contract.

### 4. Progressive disclosure inverted or double-loaded

- ce-plan and ce-brainstorm restate ~100 lines of synthesis machinery inline
  **and** mandate reading the reference (plan-handoff.md even confesses:
  "also stated inline in the SKILL.md so it cannot be missed"). Trust the load.
- ce-ideate front-loads routing machinery and defers the actual craft.
- ce-debug and ce-polish are the models to copy: small bodies, references load
  on explicit triggers, scripts carry detection logic.

### 5. A live bug, not just fat: the phantom reviewer contract

All 12 template reviewer personas instruct "use the anchored confidence rubric
in the subagent template" and "return JSON matching the findings schema" —
**no such template or schema exists anywhere in the repo.** Meanwhile ce-review
demands a different contract (flat list, ≤5 findings, must-fix/should-fix/nit).
Personas emit P0–P3 JSON against a phantom; the parent reconciles taxonomy
nobody defined. ~250 lines across 12 files, plus drift risk
("multiple must-fix" vs "two or more" already diverged).

### 6. Redundant skills and agents

- ce-technical-review ≈ ce-review's `deep` mode re-implemented (183 lines).
- ce-thermo-nuclear's rubric already absorbed wholesale into
  maintainability-reviewer.
- best-practices-researcher ≈ framework-docs-researcher (~70% same agent, same
  Google-Photos anecdote verbatim; one names skills that don't exist).
- pattern-recognition-specialist + architecture-strategist: generic content
  overlapping the reviewer set.
- react-test-architect: nothing in the suite dispatches it.

## What survives untouched (earned constraints)

Per the article's "highly important areas" exemption, keep as hard rules:

- ce-sessions' context-blowout guardrails (1–7MB session files) and script
  pipeline; session-historian's never-reproduce-tool-I/O rules.
- ce-optimize's crash-safe persistence contract (checkpoint table + core rules,
  stated once).
- Untrusted-input handling in slack/web/pr-resolver personas.
- ce-council's anonymization + letter randomization.
- ce-plan's stable-ID contract (R/U/F/AE-IDs) and metadata field stability.
- ce-work's shared-checkout discipline (no stash/checkout/reset in shared
  worktrees).
- ce-technical-review's secrets-exclusion globs (move into ce-review).
- ce-quality-gate's "never offer shipping from a mechanically clean but
  behaviorally unproven gate."
- ce-decompose's git semantics craft (three-dot vs no-dot, --mixed vs --soft,
  snapshot-before-discard).

## The plan

### Phase 0 — Safety net first

Write regression evals for the behaviors currently protected by defect-patch
prose, before deleting that prose: brainstorm tier-guard (one-sentence-synthesis
regression), plan output-mode resolution, ideate surprise-me flow.
`skills/ce-sessions/evals/` is the pattern. Small investment, unblocks
aggressive trimming.

### Phase 1 — Fix the live inconsistencies (bugs, not style)

1. **Resolve the phantom reviewer contract.** Decide one contract — recommend:
   personas return what ce-review actually consumes (flat findings, file+line,
   consequence, fix direction, must-fix/should-fix/nit). Strip the 12
   Confidence-Calibration + JSON-schema sections (~250 lines). If anchored
   confidence is worth keeping, it's one shared sentence.
2. Fix previous-comments-reviewer's dependency on a `<pr-context>` block
   ce-review never constructs (works only via fallback today).
3. Delete drift bugs: best-practices-researcher's references to nonexistent
   skills; julik's stray post-JSON paragraph; ce-review's `mode:*` legacy flag;
   "current year is 2026" lines (6+ files — harness provides the date).

### Phase 2 — Build the shared spine (kills ~1,700 duplicated lines)

1. **One shared conventions reference** (e.g. `skills/shared/conventions.md`),
   loaded on demand, containing the only justified copy of: per-platform
   blocking-question tool mapping, output-mode resolution, pipeline/sub-step
   guard, next-step-menu intent ("recommend the natural next skill; always
   offer done-for-now; skip when invoked as a sub-step"), repo-relative paths.
   Every inline copy across ~20 sites becomes one pointer or one sentence.
   Cross-harness portability (Codex/Gemini/Pi) justifies one file — not twenty
   inline paragraphs.
2. **Deduplicate shared files at source** using the repo's existing render step
   (`bun run sync` can materialize per-skill copies if install layout needs
   them): rendering refs (−745), compound contract tree (−658), agent-browser
   tutorial (design-iterator + design-implementation-reviewer → one reference
   or trust `--help`).
3. Merge `yaml-schema.md` into `schema.yaml` comments (~−80; the schema is the
   interface).

### Phase 3 — Consolidate skills and agents

1. **ce-technical-review → ce-review** `deep` mode. Port the secrets globs and
   the thermo hand-off sentence. Keep a thin alias only if the invocation name
   must survive. (−~180 lines, deletes taxonomy drift permanently.)
2. **ce-thermo-nuclear → one rendering.** Compress to Core Prompt + standards +
   tone examples (~70 lines), or retire into maintainability-reviewer with a
   stub for the invocation name.
3. **best-practices-researcher + framework-docs-researcher → `docs-researcher`**
   (~70 lines replaces 212).
4. Fold pattern-recognition-specialist + architecture-strategist into the
   reviewer set (or one ~25-line consistency card). Fold react-test-architect
   into testing-reviewer.
5. Don't merge ce-compound and ce-compound-refresh — distinct triggers and
   workflows; sharing the contract tree is the right unit.

### Phase 4 — Per-skill trims (ordered by leverage)

Apply the same three moves everywhere: rules→judgment sentences, delete worked
examples/templates-as-output, single-home every repeated instruction.

| Surface | Now | Target | Main lever |
|---|---|---|---|
| ce-work | 275 | ~130 | AGENTS.md dedup, menu/ritual cuts, dispatch-map compression |
| ce-plan | 820 | ~260 | delete inline synthesis/handoff copies, collapse Phase 0 parser, de-hardcode dispatch |
| ce-ideate (all files) | 748 | ~300 | Phase 0 gates → judgment, dedupe contract across 3 files, delete V15 cache |
| ce-compound | 615 | ~230 | share contract tree, delete worked outputs + restatements |
| ce-compound-refresh | 679 | ~290 | Phase 3 choreography → when-to-ask list, dedupe headless rules |
| ce-optimize | 661 | ~380 | persistence prose dedupe, schema-duplicating validation out |
| ce-review | 415 | ~210 | delete dispatch table, compress pass checklists to lens intents |
| ce-brainstorm | 313 | ~180 | share plumbing, Path A/B → substance-earns-checkpoint judgment |
| ce-sessions | 268 | ~155 | filtering algorithm → 3 constraints, delete dispatch example |
| ce-debug | 258 | ~180 | Phase 4 git choreography, boilerplate |
| ce-technical-review | 183 | 0 | merged (Phase 3) |
| ce-thermo-nuclear | 192 | ~70 | one rendering of the rubric |
| ce-simplify-code | 174 | ~120 | shared menu, one-line lenses |
| ce-decompose | 159 | ~110 | relationship map out, menu out |
| ce-quality-gate | 157 | ~75 | menu, cross-skill audit out, dedupe check lists |
| ce-handoff | 152 | ~95 | quality-bar restatement out; sharpen niche vs harness auto-summary |
| ce-improve-skills | 151 | ~135 | minor |
| ce-council | 291 | ~220 | Important Notes out, menu machinery out |
| ce-grill | 67 | ~50 | boilerplate only |
| ce-polish | 87 | ~65 | trailing index out |
| ce-slack-research | 41 | ~25 | agent-contract restatement out |

Personas: 30 files 2,786 → ~1,400. Worst first: repo-research-analyst 259→~75
(delete the 110-line manifest-table textbook; keep `Scope:`),
learnings-researcher 256→~85 (delete Efficiency-Guidelines restatement +
keyword taxonomy; keep grep-frontmatter strategy and "never let a past learning
silently override present evidence"), design-iterator 192→~60 (keep the
ONE-change-per-cycle iteration contract; frontend-design skill owns aesthetics),
docs researchers merged, design-implementation-reviewer 94→~50, then the
reviewer set's phantom-contract strip (Phase 1). Reviewer persona descriptions
are already the best interface text in the repo — leave them.

### Phase 5 — Polish the always-loaded surface

1. Rewrite the 3 example-stuffed agent descriptions (documentation-specialist,
   react-test-architect, design-iterator) to 1–2 sentences.
2. Trim keyword-stuffed skill descriptions (ce-technical-review's dies with the
   merge; thermo's is stuffed despite `disable-model-invocation: true`).
3. Follow-up decision (layer above this repo's skills): slim AGENTS.md's
   "Phase Skills" section to phase names + "skill descriptions carry the
   routing." Same repetition pattern, one layer up.

## Freeing the agents

**Free the orchestrator** (the skill-running session):

- Delete pre-dispatch classification machinery (ideate Phase 0, plan deepen
  vocabulary, refresh scope tiers) — dispatch on judgment.
- End skills-auditing-skills: ce-quality-gate verifying ce-work's taste-routing
  phase, "context_builder: used or skipped with reason" report lines. The code
  is the proof, not the route taken.
- One-question defaults instead of interview gauntlets (compound's two blocking
  questions per run; refresh's 4-stage confirmation gauntlet that contradicts
  its own Core Rule 4).

**Free the subagents:**

- State information needs + hand over rubrics; stop scripting exact prompts,
  output sections, and search protocols (ce-plan's hardcoded parallel dispatch,
  compound's per-agent specs, ideate's scripted grounding-scan prompt).
  deepening-workflow's checklists are already rubric-shaped — hand them to
  verifier agents of the model's choosing (the article's rubric-verifier
  pattern).
- Let agents own their contracts, stated once: session-historian owns its input
  contract, slack-researcher its digest format — dispatching skills point, not
  restate.
- Drop fixed counts and forced serialization: refresh's
  replacements-run-sequentially, deepening's section-to-agent table and caps,
  ideate's 4-vs-6 rules, ce-optimize's Codex 3-strike rule.
- One contract per persona: reviewers currently receive the skill's flat-list
  bar AND their own phantom JSON contract.
- Frames stay frames: ce-ideate's "starting bias, not a constraint" and
  ce-council's "lean fully into your angle" are the exemplary freeing language —
  make that the house style for every persona.

## Constraints and risks

- **One body serves three harnesses.** `bun run sync` renders identical skill
  content to Claude, Codex, and OpenCode (rendering only rewrites paths and
  frontmatter; verified in src/render). Recommendation: write judgment-first
  for all three — current Codex/OpenCode models are also strong. If a specific
  regression appears on another harness, reintroduce that one guardrail via a
  per-target render fork, not by re-fattening the canonical file.
- **Trim in order.** Phases 0–2 are prerequisites: evals catch regressions the
  defect-prose was guarding; the shared spine must exist before the 20 inline
  copies are deleted.
- **Verification per phase:** `bun run lint && bun run type-check && bun test`,
  `bun run sync claude`, then exercise one skill per cluster in a real session
  (a ce-work run, a ce-review run against a real diff, a ce-brainstorm
  Path-A/B check against the new evals).

## Expected end state

~8,000 maintained lines. Every SKILL.md a lightweight guide: purpose, the
opinions that are actually yours, contracts/schemas as interfaces, references
loading on trigger. Personas that are rubrics with return contracts. One home
per instruction. Orchestrators that classify less and dispatch sooner;
subagents that receive goals and rubrics, not scripts.
