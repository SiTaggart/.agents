# Upstream Sync Report
Generated: 2026-05-05T16:40:50Z
Range: 7924f5c..6217031 (115 commits)

## Summary
- **Commits:** 115
- **Updates:** 140 files changed that exist locally
- **New:** 19 files auto-applied, 30 left for review
- **Skipped:** 11 files filtered by patterns or local scope

## Commits
- `62170315` chore: release main (#767)
- `dde92563` feat(riffrec-feedback-analysis): add Riffrec feedback skill with three-path routing (#747)
- `06a7cee0` chore: release main (#753)
- `e8567566` fix(ce-code-review): keep finding numbers stable (#754)
- `a84cb759` fix(ce-commit-push-pr): use body-file for PR descriptions (#757)
- `caf5e125` fix(ce-polish-beta): support Bash 3.2 project detection (#755)
- `9539bf04` fix(ce-compound, ce-sessions): remove bash parameter expansion from ! backtick (#752)
- `74624f8e` refactor(ce-simplify-code): scope tests by ripple risk, not full suite (#749)
- `607c52ab` refactor(code-review): move resolve-base.sh to scripts/ directory (#744)
- `d685f079` chore: release main (#740)
- `520a9ebe` fix(code-review): grant Write to JSON-pipeline reviewer agents (#741)
- `887db6b2` fix(ce-setup): detect codex global skills (#739)
- `e12afb1e` chore: release main (#728)
- `ae408721` chore(code-review): remove cli-readiness reviewer agents (#734)
- `2d207574` feat(ce-simplify-code): add skill for simplifying recent code changes (#735)
- `3873b9e9` fix(ce-commit-push-pr): URL-encode parens in badge model-slug examples (#725)
- `5e045341` fix(ce-compound,ce-sessions): handle non-git CWD in pre-resolved git branch (#731)
- `265cb428` feat(ce-strategy): move strategy doc to root and add frontmatter (#732)
- `cb8f9b34` feat(ce-strategy,ce-product-pulse): add PM skills for upstream anchor and outcome pulse (#614)
- `8f804669` fix(ce-sessions): 722 ce-compound and ce-sessions permission error (#723)
- `15c1cde7` fix(ce-plan): close synthesis drift in rich-context invocations (#729)
- `d217660b` fix(review): default to harness-native code review, escalate on risk (#721)
- `e5b397c9` chore: release main (#719)
- `09fa18bc` fix(ce-code-review): comment-gate previous-comments persona to skip empty PRs (#720)
- `5ac1a063` fix(ce-code-review): mandate walkthrough.md load on walk-through entry (#718)
- `3803e8ab` chore: release main (#717)
- `d69a772b` fix(review): queue reviewers when subagent slots fill (#716)
- `48e83d93` chore: release main (#703)
- `0c515c06` fix(ce-plan): inline post-generation menu routing so option 1 actually starts /ce-work (#715)
- `9751d1a3` fix(ce-code-review): restate model override at dispatch point (#681)
- `e806522c` fix(ce-compound-refresh): check inbound links before deletion (#713)
- `1f0a77bc` fix(skills): replace shell antipatterns blocked by permission check (#711)
- `41e7f72a` feat(ce-brainstorm,ce-plan): surface agent's scope synthesis before doc-write (#705)
- `cd2fc67c` fix(commit-push-pr): branch from fresh remote base to prevent stale-base contamination (#708)
- `4b5f28da` fix(ce-work-beta): defer model and reasoning effort to Codex config (#704)
- `dd080943` fix(ce-doc-review): tighten suggested_fix and why_it_matters rules (#702)
- `17961203` chore: release main (#684)
- `5952b20d` fix(skills): replace case statements blocked by permission check (#701)
- `e8c118e2` refactor(ce-commit-push-pr): merge ce-pr-description into ce-commit-push-pr (#700)
- `a91270cc` fix(session-historian): cap deep-dives, add keyword filter primitive, tighten dispatch (#699)
- `053c1db2` fix(ce-work): codify worktree isolation for parallel subagent dispatch (#698)
- `7eea2d1c` feat(ce-compound): add frontmatter parser-safety validator (#697)
- `ad9577e7` fix(ce-code-review): tighten autofix_class rubric for safe_auto/gated_auto boundary (#695)
- `bd728186` fix(ce-resolve-pr-feedback): add declined verdict for harmful suggestions (#694)
- `e21156ee` fix(ce-debug): default to commit-and-PR and tighten learning offer (#693)
- `50bf65e8` fix(ce-doc-review): rename LFG path to best-judgment to avoid /lfg collision (#691)
- `f30404e5` fix(ce-demo-reel): wait for network idle and reject blank frames (#692)
- `85e9a207` fix(ce-code-review): move run artifacts from .context/ to /tmp per AGENTS.md (#690)
- `9ba41a14` fix(ce-code-review): replace LFG with best-judgment auto-resolve (#685)
- `1284290a` fix(ce-debug): delegate commit/PR and add branch check (#683)
- `ea8721eb` chore: release main (#680)
- `304a975d` feat(ce-brainstorm): probe rigor gaps with prose before Phase 2 (#677)
- `bc8ae1a6` fix(main): recover version drift, fix stale test, document learnings (#678)
- `47350c3e` fix(ce-test-browser): skip headed/headless question in pipeline mode
- `22d493b1` feat(ce-test-browser): gate port scan and auto-start on pipeline mode
- `f8720da3` feat(ce-test-browser): free-port scan and auto-server start
- `1f20c384` feat(lfg): add ce-commit-push-pr step and remove ralph-loop
- `bc3709fc` chore: release main (#675)
- `f0433d91` fix(ce-ideate): sharpen bug intent, surprise-me dispatch, and drop authoring refs (#672)
- `6b5da46c` chore: release main (#661)
- `6514b1fc` feat(ce-ideate): subject gate, surprise-me, and warrant contract (#671)
- `494313e8` fix(ce-brainstorm): enforce Interaction Rules in universal flow (#669)
- `c33bf70f` fix(skills): plan is a decision artifact; progress comes from git (#666)
- `9ddcd22a` fix(ce-demo-reel): prevent secrets in recorded demos (#664)
- `75cf4d60` feat(ce-commit-push-pr): skip evidence prompt when judgment allows (#663)
- `351d12ec` fix(ce-update): compare against main plugin.json, not release tags (#660)
- `5e6ec41b` chore: release main (#657)
- `a9fd8421` fix(ce-proof): correct op shapes and add retry/batch discipline (#658)
- `b9ae6b75` fix(ce-update): replace cache sweep with claude plugin update (#656)
- `7e83755a` chore: release main (#596)
- `5eb62a7d` refactor(agents): restrict tools allowlist on research agents (#650)
- `23dc11b9` feat(ce-setup): check for ast-grep CLI and agent skill (#653)
- `fdf5fe4a` feat(ce-demo-reel): add local save as alternative to catbox upload (#647)
- `7ddfbed3` feat(pi): first-class support via pi-subagents + pi-ask-user (#651)
- `cce95fb8` feat(ce-debug): environment sanity, assumption audit, more techniques (#649)
- `6155b9de` fix(ce-update): derive cache dir from CLAUDE_PLUGIN_ROOT parent (#645)
- `86d9a2c5` fix(ce-debug): stop hanging handoffs and read full issue thread (#646)
- `01d5e8fb` docs(readme): focus readmes on compound engineering (#644)
- `13f95ba6` fix(skills): cap skill descriptions at harness limit (#643)
- `5a26a8fb` refactor(ce-code-review): anchored confidence, staged validation, and model tiering (#641)
- `b104ce46` fix(lfg): use platform-neutral skill references (#642)
- `accbd2ad` refactor(todos): remove internal file-based todo system (#635)
- `19bbb60e` refactor(skills): remove ce-onboarding skill (#639)
- `701ae10c` feat(ce-code-review): add Swift/iOS stack-specific reviewer persona (#638)
- `271b1a44` refactor(skills): remove 5 unused skills and clean references (#634)
- `ff0eee39` refactor(ce-brainstorm): make doc review opt-in in Phase 4 handoff (#633)
- `44ce9dd1` feat(ce-plan): add U-IDs and origin trace to plan template (#632)
- `21666f0b` refactor(ce-worktree): trim to creation-only and fix latent bugs (#631)
- `6caf3303` refactor(ce-doc-review): anchor-based confidence scoring (#622)
- `bd77d555` feat(ce-brainstorm): product-tier with end-to-end ID traceability (#629)
- `05ea109b` fix(ce-learnings-researcher): drop unreadable schema path reference (#630)
- `4c57508c` refactor(agents): flatten agents directory (#621)
- `d359cc7e` fix(question-tool): stop silent skips when tool looks unavailable (#620)
- `cd4af86e` refactor(session-history): move extraction scripts behind skills (#619)
- `e0f2a4f9` feat(ce-proof): broaden triggers and surface markdown viewing (#618)
- `153bea86` fix(ce-resolve-pr-feedback): stop dropping unresolved and actionable feedback (#617)
- `3ed4a4fa` feat(codex): native plugin install manifests + agents-only converter (#616)
- `c2d60b47` refactor(install): prefer native plugin install across targets (#609)
- `9497a00d` fix(ce-plan): inline handoff menu so post-plan options are never skipped (#615)
- `d8436b9a` fix(ce-compound): quote YAML array items starting with reserved indicators (#613)
- `e1524287` fix(ce-gemini-imagegen): bump Pillow floor to 10.3.0 to clear 4 CVEs (#608)
- `2dd0a6e6` feat(ce-resolve-pr-feedback): tighten clustering to cross-round only (#611)
- `b35de997` feat(ce-resolve-pr-feedback): drop bot noise, centralize test runs (#610)
- `c1f68d4d` feat(doc-review, learnings-researcher): tiers, chain grouping, rewrite (#601)
- `409b07fb` fix(ce-pr-description): cap description size and add pre-apply preview (#605)
- `2aee4d42` fix(ce-release-notes): backtick-wrap `<skill-name>` token in description (#603)
- `b575e49c` fix(ce-work): reject plan re-scoping into human-time phases (#600)
- `5c0ec913` refactor(cli)!: rename all skills and agents to consistent ce- prefix (#503)
- `49249d73` fix(ce-plan): run ambiguity gate before the non-software catch-all (#598)
- `d8e87c17` fix(ce-plan): close exit gates and honor user-named resources (#597)
- `27cbaf81` feat(ce-review): add per-finding judgment loop to Interactive mode (#590)
- `dfcaddf3` chore: release main (#592)
- `1afd63cc` fix(git-commit-push-pr): apply PR description after delegate hand-off (#594)
- `cc78551e` fix(ce-pr-description): mark return block as hand-off (#593)
- `821c69c5` fix(ce-compound-refresh): restore ce:compound hand-off (#591)

## Updates to Existing Content
Items that exist locally and changed upstream.

### agents/adversarial-document-reviewer.md
- **Upstream path:** agents/ce-adversarial-document-reviewer.agent.md
- **Status:** R077 | 1 file changed, 12 insertions(+), 9 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/adversarial-reviewer.md
- **Upstream path:** agents/ce-adversarial-reviewer.agent.md
- **Status:** R080 | 1 file changed, 14 insertions(+), 10 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/agent-native-reviewer.md
- **Upstream path:** agents/ce-agent-native-reviewer.agent.md
- **Status:** R091 | 1 file changed, 8 insertions(+), 4 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/api-contract-reviewer.md
- **Upstream path:** agents/ce-api-contract-reviewer.agent.md
- **Status:** R075 | 1 file changed, 8 insertions(+), 4 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/architecture-strategist.md
- **Upstream path:** agents/ce-architecture-strategist.agent.md
- **Status:** R099 | content copied/metadata-only change
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/best-practices-researcher.md
- **Upstream path:** agents/ce-best-practices-researcher.agent.md
- **Status:** R081 | 1 file changed, 13 insertions(+), 12 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/code-simplicity-reviewer.md
- **Upstream path:** agents/ce-code-simplicity-reviewer.agent.md
- **Status:** R097 | 1 file changed, 1 insertion(+), 1 deletion(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/coherence-reviewer.md
- **Upstream path:** agents/ce-coherence-reviewer.agent.md
- **Status:** A | 1 file changed, 23 insertions(+), 4 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/correctness-reviewer.md
- **Upstream path:** agents/ce-correctness-reviewer.agent.md
- **Status:** R072 | 1 file changed, 8 insertions(+), 4 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/data-integrity-guardian.md
- **Upstream path:** agents/ce-data-integrity-guardian.agent.md
- **Status:** R098 | content copied/metadata-only change
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/data-migration-expert.md
- **Upstream path:** agents/ce-data-migration-expert.agent.md
- **Status:** R099 | content copied/metadata-only change
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/data-migrations-reviewer.md
- **Upstream path:** agents/ce-data-migrations-reviewer.agent.md
- **Status:** R082 | 1 file changed, 8 insertions(+), 4 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/deployment-verification-agent.md
- **Upstream path:** agents/ce-deployment-verification-agent.agent.md
- **Status:** R099 | content copied/metadata-only change
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/design-implementation-reviewer.md
- **Upstream path:** agents/ce-design-implementation-reviewer.agent.md
- **Status:** R099 | content copied/metadata-only change
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/design-iterator.md
- **Upstream path:** agents/ce-design-iterator.agent.md
- **Status:** R099 | content copied/metadata-only change
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/design-lens-reviewer.md
- **Upstream path:** agents/ce-design-lens-reviewer.agent.md
- **Status:** R069 | 1 file changed, 6 insertions(+), 3 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/feasibility-reviewer.md
- **Upstream path:** agents/ce-feasibility-reviewer.agent.md
- **Status:** R060 | 1 file changed, 6 insertions(+), 3 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/figma-design-sync.md
- **Upstream path:** agents/ce-figma-design-sync.agent.md
- **Status:** R099 | content copied/metadata-only change
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/framework-docs-researcher.md
- **Upstream path:** agents/ce-framework-docs-researcher.agent.md
- **Status:** R082 | 1 file changed, 12 insertions(+), 9 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/git-history-analyzer.md
- **Upstream path:** agents/ce-git-history-analyzer.agent.md
- **Status:** R096 | 1 file changed, 2 insertions(+), 1 deletion(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/issue-intelligence-analyst.md
- **Upstream path:** agents/ce-issue-intelligence-analyst.agent.md
- **Status:** R094 | 1 file changed, 5 insertions(+), 2 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/julik-frontend-races-reviewer.md
- **Upstream path:** agents/ce-julik-frontend-races-reviewer.agent.md
- **Status:** R074 | 1 file changed, 8 insertions(+), 4 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/kieran-python-reviewer.md
- **Upstream path:** agents/ce-kieran-python-reviewer.agent.md
- **Status:** R070 | 1 file changed, 8 insertions(+), 4 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/kieran-typescript-reviewer.md
- **Upstream path:** agents/ce-kieran-typescript-reviewer.agent.md
- **Status:** R068 | 1 file changed, 8 insertions(+), 4 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/learnings-researcher.md
- **Upstream path:** agents/ce-learnings-researcher.agent.md
- **Status:** A | 1 file changed, 149 insertions(+), 144 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/maintainability-reviewer.md
- **Upstream path:** agents/ce-maintainability-reviewer.agent.md
- **Status:** R075 | 1 file changed, 8 insertions(+), 4 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/pattern-recognition-specialist.md
- **Upstream path:** agents/ce-pattern-recognition-specialist.agent.md
- **Status:** R098 | content copied/metadata-only change
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/performance-oracle.md
- **Upstream path:** agents/ce-performance-oracle.agent.md
- **Status:** R099 | content copied/metadata-only change
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/performance-reviewer.md
- **Upstream path:** agents/ce-performance-reviewer.agent.md
- **Status:** R067 | 1 file changed, 9 insertions(+), 5 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/pr-comment-resolver.md
- **Upstream path:** agents/ce-pr-comment-resolver.agent.md
- **Status:** R069 | 1 file changed, 27 insertions(+), 16 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/previous-comments-reviewer.md
- **Upstream path:** agents/ce-previous-comments-reviewer.agent.md
- **Status:** R077 | 1 file changed, 8 insertions(+), 4 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/product-lens-reviewer.md
- **Upstream path:** agents/ce-product-lens-reviewer.agent.md
- **Status:** R076 | 1 file changed, 7 insertions(+), 4 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/project-standards-reviewer.md
- **Upstream path:** agents/ce-project-standards-reviewer.agent.md
- **Status:** R080 | 1 file changed, 9 insertions(+), 5 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/reliability-reviewer.md
- **Upstream path:** agents/ce-reliability-reviewer.agent.md
- **Status:** R075 | 1 file changed, 8 insertions(+), 4 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/repo-research-analyst.md
- **Upstream path:** agents/ce-repo-research-analyst.agent.md
- **Status:** R099 | 1 file changed, 1 insertion(+)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/scope-guardian-reviewer.md
- **Upstream path:** agents/ce-scope-guardian-reviewer.agent.md
- **Status:** R067 | 1 file changed, 9 insertions(+), 6 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/security-lens-reviewer.md
- **Upstream path:** agents/ce-security-lens-reviewer.agent.md
- **Status:** R057 | 1 file changed, 7 insertions(+), 4 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/security-reviewer.md
- **Upstream path:** agents/ce-security-reviewer.agent.md
- **Status:** R066 | 1 file changed, 9 insertions(+), 5 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/security-sentinel.md
- **Upstream path:** agents/ce-security-sentinel.agent.md
- **Status:** R099 | content copied/metadata-only change
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/session-historian.md
- **Upstream path:** agents/ce-session-historian.agent.md
- **Status:** R053 | 1 file changed, 45 insertions(+), 38 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/slack-researcher.md
- **Upstream path:** agents/ce-slack-researcher.agent.md
- **Status:** R084 | 1 file changed, 22 insertions(+)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/spec-flow-analyzer.md
- **Upstream path:** agents/ce-spec-flow-analyzer.agent.md
- **Status:** R094 | 1 file changed, 3 insertions(+)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/testing-reviewer.md
- **Upstream path:** agents/ce-testing-reviewer.agent.md
- **Status:** R075 | 1 file changed, 8 insertions(+), 4 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### agents/web-researcher.md
- **Upstream path:** agents/ce-web-researcher.agent.md
- **Status:** R097 | 1 file changed, 2 insertions(+), 2 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/agent-native-architecture/SKILL.md
- **Upstream path:** skills/ce-agent-native-architecture/SKILL.md
- **Status:** R099 | content copied/metadata-only change
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/agent-native-architecture/references/action-parity-discipline.md
- **Upstream path:** skills/ce-agent-native-architecture/references/action-parity-discipline.md
- **Status:** R100 | content copied/metadata-only change
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/agent-native-architecture/references/agent-execution-patterns.md
- **Upstream path:** skills/ce-agent-native-architecture/references/agent-execution-patterns.md
- **Status:** R100 | content copied/metadata-only change
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/agent-native-architecture/references/agent-native-testing.md
- **Upstream path:** skills/ce-agent-native-architecture/references/agent-native-testing.md
- **Status:** R100 | content copied/metadata-only change
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/agent-native-architecture/references/architecture-patterns.md
- **Upstream path:** skills/ce-agent-native-architecture/references/architecture-patterns.md
- **Status:** R100 | content copied/metadata-only change
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/agent-native-architecture/references/dynamic-context-injection.md
- **Upstream path:** skills/ce-agent-native-architecture/references/dynamic-context-injection.md
- **Status:** R100 | content copied/metadata-only change
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/agent-native-architecture/references/files-universal-interface.md
- **Upstream path:** skills/ce-agent-native-architecture/references/files-universal-interface.md
- **Status:** R100 | content copied/metadata-only change
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/agent-native-architecture/references/from-primitives-to-domain-tools.md
- **Upstream path:** skills/ce-agent-native-architecture/references/from-primitives-to-domain-tools.md
- **Status:** R100 | content copied/metadata-only change
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/agent-native-architecture/references/mcp-tool-design.md
- **Upstream path:** skills/ce-agent-native-architecture/references/mcp-tool-design.md
- **Status:** R100 | content copied/metadata-only change
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/agent-native-architecture/references/mobile-patterns.md
- **Upstream path:** skills/ce-agent-native-architecture/references/mobile-patterns.md
- **Status:** R100 | content copied/metadata-only change
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/agent-native-architecture/references/product-implications.md
- **Upstream path:** skills/ce-agent-native-architecture/references/product-implications.md
- **Status:** R100 | content copied/metadata-only change
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/agent-native-architecture/references/refactoring-to-prompt-native.md
- **Upstream path:** skills/ce-agent-native-architecture/references/refactoring-to-prompt-native.md
- **Status:** R100 | content copied/metadata-only change
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/agent-native-architecture/references/self-modification.md
- **Upstream path:** skills/ce-agent-native-architecture/references/self-modification.md
- **Status:** R100 | content copied/metadata-only change
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/agent-native-architecture/references/shared-workspace-architecture.md
- **Upstream path:** skills/ce-agent-native-architecture/references/shared-workspace-architecture.md
- **Status:** R100 | content copied/metadata-only change
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/agent-native-architecture/references/system-prompt-design.md
- **Upstream path:** skills/ce-agent-native-architecture/references/system-prompt-design.md
- **Status:** R100 | 1 file changed, 1 insertion(+), 1 deletion(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/agent-native-audit/SKILL.md
- **Upstream path:** skills/ce-agent-native-audit/SKILL.md
- **Status:** R095 | 1 file changed, 2 insertions(+), 2 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-brainstorm/SKILL.md
- **Upstream path:** skills/ce-brainstorm/SKILL.md
- **Status:** M | 1 file changed, 60 insertions(+), 24 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-brainstorm/references/handoff.md
- **Upstream path:** skills/ce-brainstorm/references/handoff.md
- **Status:** M | 1 file changed, 56 insertions(+), 28 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-brainstorm/references/requirements-capture.md
- **Upstream path:** skills/ce-brainstorm/references/requirements-capture.md
- **Status:** M | 1 file changed, 179 insertions(+), 40 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-brainstorm/references/universal-brainstorming.md
- **Upstream path:** skills/ce-brainstorm/references/universal-brainstorming.md
- **Status:** M | 1 file changed, 11 insertions(+), 3 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-brainstorm/references/visual-communication.md
- **Upstream path:** skills/ce-brainstorm/references/visual-communication.md
- **Status:** M | 1 file changed, 1 insertion(+), 1 deletion(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-compound-refresh/SKILL.md
- **Upstream path:** skills/ce-compound-refresh/SKILL.md
- **Status:** M | 1 file changed, 49 insertions(+), 25 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-compound-refresh/assets/resolution-template.md
- **Upstream path:** skills/ce-compound-refresh/assets/resolution-template.md
- **Status:** M | 1 file changed, 6 insertions(+), 2 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-compound-refresh/references/schema.yaml
- **Upstream path:** skills/ce-compound-refresh/references/schema.yaml
- **Status:** M | 1 file changed, 12 insertions(+), 3 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-compound-refresh/references/yaml-schema.md
- **Upstream path:** skills/ce-compound-refresh/references/yaml-schema.md
- **Status:** M | 1 file changed, 33 insertions(+), 2 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-compound/SKILL.md
- **Upstream path:** skills/ce-compound/SKILL.md
- **Status:** M | 1 file changed, 76 insertions(+), 62 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-compound/assets/resolution-template.md
- **Upstream path:** skills/ce-compound/assets/resolution-template.md
- **Status:** M | 1 file changed, 6 insertions(+), 2 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-compound/references/schema.yaml
- **Upstream path:** skills/ce-compound/references/schema.yaml
- **Status:** M | 1 file changed, 12 insertions(+), 3 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-compound/references/yaml-schema.md
- **Upstream path:** skills/ce-compound/references/yaml-schema.md
- **Status:** M | 1 file changed, 33 insertions(+), 2 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-debug/SKILL.md
- **Upstream path:** skills/ce-debug/SKILL.md
- **Status:** M | 1 file changed, 65 insertions(+), 21 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-debug/references/investigation-techniques.md
- **Upstream path:** skills/ce-debug/references/investigation-techniques.md
- **Status:** M | 1 file changed, 213 insertions(+)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-demo-reel/SKILL.md
- **Upstream path:** skills/ce-demo-reel/SKILL.md
- **Status:** M | 1 file changed, 19 insertions(+), 3 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-demo-reel/references/tier-browser-reel.md
- **Upstream path:** skills/ce-demo-reel/references/tier-browser-reel.md
- **Status:** M | 1 file changed, 17 insertions(+), 4 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-demo-reel/references/tier-screenshot-reel.md
- **Upstream path:** skills/ce-demo-reel/references/tier-screenshot-reel.md
- **Status:** M | 1 file changed, 5 insertions(+)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-demo-reel/references/tier-static-screenshots.md
- **Upstream path:** skills/ce-demo-reel/references/tier-static-screenshots.md
- **Status:** M | 1 file changed, 2 insertions(+)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-demo-reel/references/tier-terminal-recording.md
- **Upstream path:** skills/ce-demo-reel/references/tier-terminal-recording.md
- **Status:** M | 1 file changed, 18 insertions(+), 5 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-demo-reel/references/upload-and-approval.md
- **Upstream path:** skills/ce-demo-reel/references/upload-and-approval.md
- **Status:** M | 1 file changed, 37 insertions(+), 12 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-demo-reel/scripts/capture-demo.py
- **Upstream path:** skills/ce-demo-reel/scripts/capture-demo.py
- **Status:** M | 1 file changed, 67 insertions(+), 4 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-ideate/SKILL.md
- **Upstream path:** skills/ce-ideate/SKILL.md
- **Status:** M | 1 file changed, 138 insertions(+), 60 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-ideate/references/post-ideation-workflow.md
- **Upstream path:** skills/ce-ideate/references/post-ideation-workflow.md
- **Status:** M | 1 file changed, 23 insertions(+), 15 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-ideate/references/universal-ideation.md
- **Upstream path:** skills/ce-ideate/references/universal-ideation.md
- **Status:** M | 1 file changed, 18 insertions(+), 7 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-ideate/references/web-research-cache.md
- **Upstream path:** skills/ce-ideate/references/web-research-cache.md
- **Status:** M | 1 file changed, 2 insertions(+), 2 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-optimize/SKILL.md
- **Upstream path:** skills/ce-optimize/SKILL.md
- **Status:** M | 1 file changed, 5 insertions(+), 5 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-plan/SKILL.md
- **Upstream path:** skills/ce-plan/SKILL.md
- **Status:** M | 1 file changed, 224 insertions(+), 49 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-plan/references/deepening-workflow.md
- **Upstream path:** skills/ce-plan/references/deepening-workflow.md
- **Status:** M | 1 file changed, 32 insertions(+), 28 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-plan/references/plan-handoff.md
- **Upstream path:** skills/ce-plan/references/plan-handoff.md
- **Status:** M | 1 file changed, 15 insertions(+), 13 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-plan/references/universal-planning.md
- **Upstream path:** skills/ce-plan/references/universal-planning.md
- **Status:** M | 1 file changed, 9 insertions(+), 7 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-plan/references/visual-communication.md
- **Upstream path:** skills/ce-plan/references/visual-communication.md
- **Status:** M | 1 file changed, 1 insertion(+), 1 deletion(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-polish-beta/SKILL.md
- **Upstream path:** skills/ce-polish-beta/SKILL.md
- **Status:** M | content copied/metadata-only change
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-polish-beta/scripts/detect-project-type.sh
- **Upstream path:** skills/ce-polish-beta/scripts/detect-project-type.sh
- **Status:** M | 1 file changed, 19 insertions(+), 19 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-release-notes/SKILL.md
- **Upstream path:** skills/ce-release-notes/SKILL.md
- **Status:** M | 1 file changed, 3 insertions(+), 3 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-review/SKILL.md
- **Upstream path:** skills/ce-code-review/SKILL.md
- **Status:** A | 1 file changed, 278 insertions(+), 110 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-review/references/diff-scope.md
- **Upstream path:** skills/ce-code-review/references/diff-scope.md
- **Status:** R100 | content copied/metadata-only change
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-review/references/findings-schema.json
- **Upstream path:** skills/ce-code-review/references/findings-schema.json
- **Status:** R057 | 1 file changed, 16 insertions(+), 11 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-review/references/persona-catalog.md
- **Upstream path:** skills/ce-code-review/references/persona-catalog.md
- **Status:** A | 1 file changed, 24 insertions(+), 24 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-review/references/review-output-template.md
- **Upstream path:** skills/ce-code-review/references/review-output-template.md
- **Status:** R078 | 1 file changed, 15 insertions(+), 14 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-review/references/subagent-template.md
- **Upstream path:** skills/ce-code-review/references/subagent-template.md
- **Status:** A | 1 file changed, 117 insertions(+), 23 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-sessions/SKILL.md
- **Upstream path:** skills/ce-sessions/SKILL.md
- **Status:** M | 1 file changed, 4 insertions(+), 6 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-setup/SKILL.md
- **Upstream path:** skills/ce-setup/SKILL.md
- **Status:** M | 1 file changed, 27 insertions(+), 19 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-setup/references/config-template.yaml
- **Upstream path:** skills/ce-setup/references/config-template.yaml
- **Status:** M | 1 file changed, 22 insertions(+), 3 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-setup/scripts/check-health
- **Upstream path:** skills/ce-setup/scripts/check-health
- **Status:** M | 1 file changed, 90 insertions(+), 4 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-slack-research/SKILL.md
- **Upstream path:** skills/ce-slack-research/SKILL.md
- **Status:** M | 1 file changed, 2 insertions(+), 2 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-update/SKILL.md
- **Upstream path:** skills/ce-update/SKILL.md
- **Status:** M | 1 file changed, 71 insertions(+), 45 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-work-beta/SKILL.md
- **Upstream path:** skills/ce-work-beta/SKILL.md
- **Status:** M | 1 file changed, 50 insertions(+), 25 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-work-beta/references/codex-delegation-workflow.md
- **Upstream path:** skills/ce-work-beta/references/codex-delegation-workflow.md
- **Status:** M | 1 file changed, 14 insertions(+), 10 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-work-beta/references/shipping-workflow.md
- **Upstream path:** skills/ce-work-beta/references/shipping-workflow.md
- **Status:** M | 1 file changed, 50 insertions(+), 20 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-work/SKILL.md
- **Upstream path:** skills/ce-work/SKILL.md
- **Status:** M | 1 file changed, 43 insertions(+), 18 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/ce-work/references/shipping-workflow.md
- **Upstream path:** skills/ce-work/references/shipping-workflow.md
- **Status:** M | 1 file changed, 51 insertions(+), 21 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/document-review/SKILL.md
- **Upstream path:** skills/ce-doc-review/SKILL.md
- **Status:** A | 1 file changed, 73 insertions(+), 25 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/document-review/references/findings-schema.json
- **Upstream path:** skills/ce-doc-review/references/findings-schema.json
- **Status:** R059 | 1 file changed, 5 insertions(+), 6 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/document-review/references/review-output-template.md
- **Upstream path:** skills/ce-doc-review/references/review-output-template.md
- **Status:** A | 1 file changed, 63 insertions(+), 31 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/document-review/references/subagent-template.md
- **Upstream path:** skills/ce-doc-review/references/subagent-template.md
- **Status:** A | 1 file changed, 136 insertions(+), 16 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/document-review/references/synthesis-and-presentation.md
- **Upstream path:** skills/ce-doc-review/references/synthesis-and-presentation.md
- **Status:** A | 1 file changed, 303 insertions(+), 70 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/frontend-design/SKILL.md
- **Upstream path:** skills/ce-frontend-design/SKILL.md
- **Status:** R095 | 1 file changed, 2 insertions(+), 2 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/gemini-imagegen/SKILL.md
- **Upstream path:** skills/ce-gemini-imagegen/SKILL.md
- **Status:** R099 | 1 file changed, 4 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/gemini-imagegen/requirements.txt
- **Upstream path:** skills/ce-gemini-imagegen/requirements.txt
- **Status:** A | 1 file changed, 4 insertions(+), 1 deletion(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/gemini-imagegen/scripts/compose_images.py
- **Upstream path:** skills/ce-gemini-imagegen/scripts/compose_images.py
- **Status:** R100 | content copied/metadata-only change
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/gemini-imagegen/scripts/edit_image.py
- **Upstream path:** skills/ce-gemini-imagegen/scripts/edit_image.py
- **Status:** R100 | content copied/metadata-only change
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/gemini-imagegen/scripts/gemini_images.py
- **Upstream path:** skills/ce-gemini-imagegen/scripts/gemini_images.py
- **Status:** R100 | content copied/metadata-only change
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/gemini-imagegen/scripts/generate_image.py
- **Upstream path:** skills/ce-gemini-imagegen/scripts/generate_image.py
- **Status:** R100 | content copied/metadata-only change
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/gemini-imagegen/scripts/multi_turn_chat.py
- **Upstream path:** skills/ce-gemini-imagegen/scripts/multi_turn_chat.py
- **Status:** R100 | content copied/metadata-only change
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/git-clean-gone-branches/SKILL.md
- **Upstream path:** skills/ce-clean-gone-branches/SKILL.md
- **Status:** R078 | 1 file changed, 1 insertion(+), 1 deletion(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/git-clean-gone-branches/scripts/clean-gone
- **Upstream path:** skills/ce-clean-gone-branches/scripts/clean-gone
- **Status:** R100 | content copied/metadata-only change
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/git-commit-push-pr/SKILL.md
- **Upstream path:** skills/ce-commit-push-pr/SKILL.md
- **Status:** A | 1 file changed, 57 insertions(+), 68 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/git-commit/SKILL.md
- **Upstream path:** skills/ce-commit/SKILL.md
- **Status:** R071 | 1 file changed, 7 insertions(+), 5 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/git-worktree/SKILL.md
- **Upstream path:** skills/ce-worktree/SKILL.md
- **Status:** A | 1 file changed, 40 insertions(+), 273 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/git-worktree/scripts/worktree-manager.sh
- **Upstream path:** skills/ce-worktree/scripts/worktree-manager.sh
- **Status:** A | 1 file changed, 144 insertions(+), 405 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/lfg/SKILL.md
- **Upstream path:** skills/lfg/SKILL.md
- **Status:** M | 1 file changed, 44 insertions(+), 12 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/proof/SKILL.md
- **Upstream path:** skills/ce-proof/SKILL.md
- **Status:** R068 | 1 file changed, 40 insertions(+), 16 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/proof/references/hitl-review.md
- **Upstream path:** skills/ce-proof/references/hitl-review.md
- **Status:** R066 | 1 file changed, 80 insertions(+), 25 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/resolve-pr-feedback/SKILL.md
- **Upstream path:** skills/ce-resolve-pr-feedback/SKILL.md
- **Status:** R062 | 1 file changed, 65 insertions(+), 39 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/resolve-pr-feedback/scripts/get-pr-comments
- **Upstream path:** skills/ce-resolve-pr-feedback/scripts/get-pr-comments
- **Status:** R061 | 1 file changed, 37 insertions(+), 42 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/resolve-pr-feedback/scripts/get-thread-for-comment
- **Upstream path:** skills/ce-resolve-pr-feedback/scripts/get-thread-for-comment
- **Status:** R094 | 1 file changed, 4 insertions(+)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/resolve-pr-feedback/scripts/reply-to-pr-thread
- **Upstream path:** skills/ce-resolve-pr-feedback/scripts/reply-to-pr-thread
- **Status:** R100 | content copied/metadata-only change
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/resolve-pr-feedback/scripts/resolve-pr-thread
- **Upstream path:** skills/ce-resolve-pr-feedback/scripts/resolve-pr-thread
- **Status:** R100 | content copied/metadata-only change
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

### skills/test-browser/SKILL.md
- **Upstream path:** skills/ce-test-browser/SKILL.md
- **Status:** R068 | 1 file changed, 71 insertions(+), 29 deletions(-)
- **What changed:** Synced upstream release-window updates with local path/name and `.ai/` adaptations.
- **Action needed:** Review diff, merge improvements

## New Content to Review
Items that don't exist locally and may be worth adding.

### skills/ce-brainstorm/references/synthesis-summary.md
- **Upstream path:** skills/ce-brainstorm/references/synthesis-summary.md
- **Category:** skill
- **Relevance:** MEDIUM — new mapped content not auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/ce-compound-refresh/scripts/validate-frontmatter.py
- **Upstream path:** skills/ce-compound-refresh/scripts/validate-frontmatter.py
- **Category:** skill
- **Relevance:** MEDIUM — new mapped content not auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/ce-compound/scripts/validate-frontmatter.py
- **Upstream path:** skills/ce-compound/scripts/validate-frontmatter.py
- **Category:** skill
- **Relevance:** MEDIUM — new mapped content not auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/ce-debug/references/defense-in-depth.md
- **Upstream path:** skills/ce-debug/references/defense-in-depth.md
- **Category:** skill
- **Relevance:** MEDIUM — new mapped content not auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/ce-plan/references/synthesis-summary.md
- **Upstream path:** skills/ce-plan/references/synthesis-summary.md
- **Category:** skill
- **Relevance:** MEDIUM — new mapped content not auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/ce-product-pulse/SKILL.md
- **Upstream path:** skills/ce-product-pulse/SKILL.md
- **Category:** skill
- **Relevance:** HIGH — new general-purpose skill auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/ce-product-pulse/references/interview.md
- **Upstream path:** skills/ce-product-pulse/references/interview.md
- **Category:** skill
- **Relevance:** HIGH — new general-purpose skill auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/ce-product-pulse/references/report-template.md
- **Upstream path:** skills/ce-product-pulse/references/report-template.md
- **Category:** skill
- **Relevance:** HIGH — new general-purpose skill auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/ce-review/references/bulk-preview.md
- **Upstream path:** skills/ce-code-review/references/bulk-preview.md
- **Category:** skill
- **Relevance:** MEDIUM — new mapped content not auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/ce-review/references/tracker-defer.md
- **Upstream path:** skills/ce-code-review/references/tracker-defer.md
- **Category:** skill
- **Relevance:** MEDIUM — new mapped content not auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/ce-review/references/validator-template.md
- **Upstream path:** skills/ce-code-review/references/validator-template.md
- **Category:** skill
- **Relevance:** MEDIUM — new mapped content not auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/ce-review/references/walkthrough.md
- **Upstream path:** skills/ce-code-review/references/walkthrough.md
- **Category:** skill
- **Relevance:** MEDIUM — new mapped content not auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/ce-review/scripts/resolve-base.sh
- **Upstream path:** skills/ce-code-review/scripts/resolve-base.sh
- **Category:** skill
- **Relevance:** MEDIUM — new mapped content not auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/ce-riffrec-feedback-analysis/SKILL.md
- **Upstream path:** skills/ce-riffrec-feedback-analysis/SKILL.md
- **Category:** skill
- **Relevance:** HIGH — new general-purpose skill auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/ce-riffrec-feedback-analysis/references/feedback-format.md
- **Upstream path:** skills/ce-riffrec-feedback-analysis/references/feedback-format.md
- **Category:** skill
- **Relevance:** HIGH — new general-purpose skill auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/ce-riffrec-feedback-analysis/references/extensive-analysis.md
- **Upstream path:** skills/ce-riffrec-feedback-analysis/references/extensive-analysis.md
- **Category:** skill
- **Relevance:** HIGH — new general-purpose skill auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/ce-riffrec-feedback-analysis/references/install-riffrec.md
- **Upstream path:** skills/ce-riffrec-feedback-analysis/references/install-riffrec.md
- **Category:** skill
- **Relevance:** HIGH — new general-purpose skill auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/ce-riffrec-feedback-analysis/references/quick-bug-report.md
- **Upstream path:** skills/ce-riffrec-feedback-analysis/references/quick-bug-report.md
- **Category:** skill
- **Relevance:** HIGH — new general-purpose skill auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/ce-riffrec-feedback-analysis/scripts/analyze_riffrec_zip.py
- **Upstream path:** skills/ce-riffrec-feedback-analysis/scripts/analyze_riffrec_zip.py
- **Category:** skill
- **Relevance:** HIGH — new general-purpose skill auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/ce-session-extract/SKILL.md
- **Upstream path:** skills/ce-session-extract/SKILL.md
- **Category:** skill
- **Relevance:** HIGH — new general-purpose skill auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/ce-session-extract/scripts/extract-errors.py
- **Upstream path:** skills/ce-session-extract/scripts/extract-errors.py
- **Category:** skill
- **Relevance:** HIGH — new general-purpose skill auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/ce-session-extract/scripts/extract-skeleton.py
- **Upstream path:** skills/ce-session-extract/scripts/extract-skeleton.py
- **Category:** skill
- **Relevance:** HIGH — new general-purpose skill auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/ce-session-inventory/SKILL.md
- **Upstream path:** skills/ce-session-inventory/SKILL.md
- **Category:** skill
- **Relevance:** HIGH — new general-purpose skill auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/ce-session-inventory/scripts/discover-sessions.sh
- **Upstream path:** skills/ce-session-inventory/scripts/discover-sessions.sh
- **Category:** skill
- **Relevance:** HIGH — new general-purpose skill auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/ce-session-inventory/scripts/extract-metadata.py
- **Upstream path:** skills/ce-session-inventory/scripts/extract-metadata.py
- **Category:** skill
- **Relevance:** HIGH — new general-purpose skill auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/ce-simplify-code/SKILL.md
- **Upstream path:** skills/ce-simplify-code/SKILL.md
- **Category:** skill
- **Relevance:** HIGH — new general-purpose skill auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/ce-strategy/SKILL.md
- **Upstream path:** skills/ce-strategy/SKILL.md
- **Category:** skill
- **Relevance:** HIGH — new general-purpose skill auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/ce-strategy/references/interview.md
- **Upstream path:** skills/ce-strategy/references/interview.md
- **Category:** skill
- **Relevance:** HIGH — new general-purpose skill auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/ce-strategy/references/strategy-template.md
- **Upstream path:** skills/ce-strategy/references/strategy-template.md
- **Category:** skill
- **Relevance:** HIGH — new general-purpose skill auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/ce-update/scripts/currently-loaded-version.sh
- **Upstream path:** skills/ce-update/scripts/currently-loaded-version.sh
- **Category:** skill
- **Relevance:** MEDIUM — new mapped content not auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/ce-update/scripts/marketplace-name.sh
- **Upstream path:** skills/ce-update/scripts/marketplace-name.sh
- **Category:** skill
- **Relevance:** MEDIUM — new mapped content not auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/ce-update/scripts/upstream-version.sh
- **Upstream path:** skills/ce-update/scripts/upstream-version.sh
- **Category:** skill
- **Relevance:** MEDIUM — new mapped content not auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/ce-work-beta/references/tracker-defer.md
- **Upstream path:** skills/ce-work-beta/references/tracker-defer.md
- **Category:** skill
- **Relevance:** MEDIUM — new mapped content not auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/ce-work/references/tracker-defer.md
- **Upstream path:** skills/ce-work/references/tracker-defer.md
- **Category:** skill
- **Relevance:** MEDIUM — new mapped content not auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/dhh-rails-style/SKILL.md
- **Upstream path:** skills/ce-dhh-rails-style/SKILL.md
- **Category:** skill
- **Relevance:** MEDIUM — new mapped content not auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/dhh-rails-style/references/architecture.md
- **Upstream path:** skills/ce-dhh-rails-style/references/architecture.md
- **Category:** skill
- **Relevance:** MEDIUM — new mapped content not auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/dhh-rails-style/references/controllers.md
- **Upstream path:** skills/ce-dhh-rails-style/references/controllers.md
- **Category:** skill
- **Relevance:** MEDIUM — new mapped content not auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/dhh-rails-style/references/frontend.md
- **Upstream path:** skills/ce-dhh-rails-style/references/frontend.md
- **Category:** skill
- **Relevance:** MEDIUM — new mapped content not auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/dhh-rails-style/references/gems.md
- **Upstream path:** skills/ce-dhh-rails-style/references/gems.md
- **Category:** skill
- **Relevance:** MEDIUM — new mapped content not auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/dhh-rails-style/references/models.md
- **Upstream path:** skills/ce-dhh-rails-style/references/models.md
- **Category:** skill
- **Relevance:** MEDIUM — new mapped content not auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/dhh-rails-style/references/testing.md
- **Upstream path:** skills/ce-dhh-rails-style/references/testing.md
- **Category:** skill
- **Relevance:** MEDIUM — new mapped content not auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/document-review/references/bulk-preview.md
- **Upstream path:** skills/ce-doc-review/references/bulk-preview.md
- **Category:** skill
- **Relevance:** MEDIUM — new mapped content not auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/document-review/references/open-questions-defer.md
- **Upstream path:** skills/ce-doc-review/references/open-questions-defer.md
- **Category:** skill
- **Relevance:** MEDIUM — new mapped content not auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/document-review/references/walkthrough.md
- **Upstream path:** skills/ce-doc-review/references/walkthrough.md
- **Category:** skill
- **Relevance:** MEDIUM — new mapped content not auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/git-commit-push-pr/references/branch-creation.md
- **Upstream path:** skills/ce-commit-push-pr/references/branch-creation.md
- **Category:** skill
- **Relevance:** MEDIUM — new mapped content not auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/git-commit-push-pr/references/pr-description-writing.md
- **Upstream path:** skills/ce-commit-push-pr/references/pr-description-writing.md
- **Category:** skill
- **Relevance:** MEDIUM — new mapped content not auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/lfg/references/tracker-defer.md
- **Upstream path:** skills/lfg/references/tracker-defer.md
- **Category:** skill
- **Relevance:** MEDIUM — new mapped content not auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/report-bug-ce/SKILL.md
- **Upstream path:** skills/ce-report-bug/SKILL.md
- **Category:** skill
- **Relevance:** MEDIUM — new mapped content not auto-applied
- **Summary:** New mapped upstream content from the release window.

### skills/test-xcode/SKILL.md
- **Upstream path:** skills/ce-test-xcode/SKILL.md
- **Category:** skill
- **Relevance:** MEDIUM — new mapped content not auto-applied
- **Summary:** New mapped upstream content from the release window.

## Upstream Deletions Preserved or Applied
- `agents/cli-agent-readiness-reviewer.md` from `agents/review/cli-agent-readiness-reviewer.md` — deleted upstream; preserved locally for review
- `agents/cli-readiness-reviewer.md` from `agents/review/cli-readiness-reviewer.md` — deleted upstream; preserved locally for review
- `agents/coherence-reviewer.md` from `agents/document-review/coherence-reviewer.md` — deleted upstream; preserved locally for review
- `agents/learnings-researcher.md` from `agents/research/learnings-researcher.md` — deleted upstream; preserved locally for review
- `skills/andrew-kane-gem-writer/SKILL.md` from `skills/andrew-kane-gem-writer/SKILL.md` — deleted upstream; preserved locally for review
- `skills/andrew-kane-gem-writer/references/database-adapters.md` from `skills/andrew-kane-gem-writer/references/database-adapters.md` — deleted upstream; preserved locally for review
- `skills/andrew-kane-gem-writer/references/module-organization.md` from `skills/andrew-kane-gem-writer/references/module-organization.md` — deleted upstream; preserved locally for review
- `skills/andrew-kane-gem-writer/references/rails-integration.md` from `skills/andrew-kane-gem-writer/references/rails-integration.md` — deleted upstream; preserved locally for review
- `skills/andrew-kane-gem-writer/references/resources.md` from `skills/andrew-kane-gem-writer/references/resources.md` — deleted upstream; preserved locally for review
- `skills/andrew-kane-gem-writer/references/testing-patterns.md` from `skills/andrew-kane-gem-writer/references/testing-patterns.md` — deleted upstream; preserved locally for review
- `skills/ce-pr-description/SKILL.md` from `skills/ce-pr-description/SKILL.md` — deleted upstream and removed locally
- `skills/ce-review/SKILL.md` from `skills/ce-review/SKILL.md` — deleted upstream; preserved locally for review
- `skills/ce-review/references/persona-catalog.md` from `skills/ce-review/references/persona-catalog.md` — deleted upstream; preserved locally for review
- `skills/ce-review/references/subagent-template.md` from `skills/ce-review/references/subagent-template.md` — deleted upstream; preserved locally for review
- `skills/changelog/SKILL.md` from `skills/changelog/SKILL.md` — deleted upstream; preserved locally for review
- `skills/deploy-docs/SKILL.md` from `skills/deploy-docs/SKILL.md` — deleted upstream; preserved locally for review
- `skills/document-review/SKILL.md` from `skills/document-review/SKILL.md` — deleted upstream; preserved locally for review
- `skills/document-review/references/review-output-template.md` from `skills/document-review/references/review-output-template.md` — deleted upstream; preserved locally for review
- `skills/document-review/references/subagent-template.md` from `skills/document-review/references/subagent-template.md` — deleted upstream; preserved locally for review
- `skills/document-review/references/synthesis-and-presentation.md` from `skills/document-review/references/synthesis-and-presentation.md` — deleted upstream; preserved locally for review
- `skills/dspy-ruby/SKILL.md` from `skills/dspy-ruby/SKILL.md` — deleted upstream; preserved locally for review
- `skills/dspy-ruby/assets/config-template.rb` from `skills/dspy-ruby/assets/config-template.rb` — deleted upstream; preserved locally for review
- `skills/dspy-ruby/assets/module-template.rb` from `skills/dspy-ruby/assets/module-template.rb` — deleted upstream; preserved locally for review
- `skills/dspy-ruby/assets/signature-template.rb` from `skills/dspy-ruby/assets/signature-template.rb` — deleted upstream; preserved locally for review
- `skills/dspy-ruby/references/core-concepts.md` from `skills/dspy-ruby/references/core-concepts.md` — deleted upstream; preserved locally for review
- `skills/dspy-ruby/references/observability.md` from `skills/dspy-ruby/references/observability.md` — deleted upstream; preserved locally for review
- `skills/dspy-ruby/references/optimization.md` from `skills/dspy-ruby/references/optimization.md` — deleted upstream; preserved locally for review
- `skills/dspy-ruby/references/providers.md` from `skills/dspy-ruby/references/providers.md` — deleted upstream; preserved locally for review
- `skills/dspy-ruby/references/toolsets.md` from `skills/dspy-ruby/references/toolsets.md` — deleted upstream; preserved locally for review
- `skills/every-style-editor/SKILL.md` from `skills/every-style-editor/SKILL.md` — deleted upstream; preserved locally for review
- `skills/every-style-editor/references/EVERY_WRITE_STYLE.md` from `skills/every-style-editor/references/EVERY_WRITE_STYLE.md` — deleted upstream; preserved locally for review
- `skills/gemini-imagegen/requirements.txt` from `skills/gemini-imagegen/requirements.txt` — deleted upstream; preserved locally for review
- `skills/git-commit-push-pr/SKILL.md` from `skills/git-commit-push-pr/SKILL.md` — deleted upstream; preserved locally for review
- `skills/git-worktree/SKILL.md` from `skills/git-worktree/SKILL.md` — deleted upstream; preserved locally for review
- `skills/git-worktree/scripts/worktree-manager.sh` from `skills/git-worktree/scripts/worktree-manager.sh` — deleted upstream; preserved locally for review
- `skills/onboarding/SKILL.md` from `skills/onboarding/SKILL.md` — deleted upstream; preserved locally for review
- `skills/onboarding/scripts/inventory.mjs` from `skills/onboarding/scripts/inventory.mjs` — deleted upstream; preserved locally for review
- `skills/todo-create/SKILL.md` from `skills/todo-create/SKILL.md` — deleted upstream; preserved locally for review
- `skills/todo-create/assets/todo-template.md` from `skills/todo-create/assets/todo-template.md` — deleted upstream; preserved locally for review
- `skills/todo-resolve/SKILL.md` from `skills/todo-resolve/SKILL.md` — deleted upstream; preserved locally for review
- `skills/todo-triage/SKILL.md` from `skills/todo-triage/SKILL.md` — deleted upstream; preserved locally for review

## Auto-Skipped
Filtered by skip patterns — listed for transparency.
- `.claude-plugin/plugin.json` — no local path mapping
- `.codex-plugin/plugin.json` — no local path mapping
- `.cursor-plugin/plugin.json` — no local path mapping
- `AGENTS.md` — no local path mapping
- `CHANGELOG.md` — no local path mapping
- `README.md` — no local path mapping
- `agents/ce-ankane-readme-writer.agent.md` — filename match `ankane-readme-*`
- `agents/ce-dhh-rails-reviewer.agent.md` — filename match `dhh-rails-*`
- `agents/ce-kieran-rails-reviewer.agent.md` — filename match `kieran-rails-*`
- `agents/ce-schema-drift-detector.agent.md` — filename match `schema-drift-*`
- `agents/ce-swift-ios-reviewer.agent.md` — new stack-specific iOS reviewer requires explicit review
