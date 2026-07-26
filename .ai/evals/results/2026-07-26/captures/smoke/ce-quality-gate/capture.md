# Changed-Code Quality Gate Capture

## Touched-file scope

The repository has no commits, so the current touched surface is the complete
untracked implementation:

- `package.json` — package metadata and the repository-provided check commands
- `lint.js` — lint check implementation
- `src/touched.js` — touched source
- `touched.test.js` — focused test

`capture.md` is this post-gate evidence artifact; it was created only after the
checks finished and was not part of the gate scope.

No `AGENTS.md` or `CLAUDE.md` applies. The repository provides lint and test
scripts, but no formatter or type-check script.

## Commands and exact outputs

### `npm run lint`

Exit code: `1`

```text

> lint-fixture@1.0.0 lint
> node lint.js

src/touched.js:1:1 no-var: use const or let
```

### `npm test`

Exit code: `0`

```text

> lint-fixture@1.0.0 test
> node --test

✔ answer (0.22325ms)
ℹ tests 1
ℹ suites 0
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 34.337708
```

## Exact failure attribution

The touched-file lint check failed because `src/touched.js:1` declares
`answer` with `var`:

```js
var answer = 42;
```

`lint.js` detects the literal `var ` and reports:

```text
src/touched.js:1:1 no-var: use const or let
```

This is a touched-surface failure, not unrelated baseline noise. Per the task
constraint, it was not fixed.

## Health proven

- The repository-provided test command completed successfully.
- The one focused test passed: importing `answer` from `src/touched.js` yields
  `42`.
- Node successfully loaded and executed the touched source and test during that
  test run.
- No unrelated baseline failure was observed.

## Health not proven

- Lint cleanliness was not proven; it is explicitly disproven by the touched
  `no-var` failure.
- Formatting was not proven because the repository has no formatter command.
- Static type health was not proven because the repository has no type-check
  command.
- Product, browser, integration, performance, accessibility, and security
  behavior were not exercised by this mechanical gate.
- Whole-repository health was not proven; this empty-history scratch repository
  has only the touched surface.

## Verdict

**FAIL.** The touched surface is not mechanically clean and is not ready for
review, commit, or shipping. The focused behavior passes, but the touched-file
lint failure persists.

## Final report

- Touched files checked: `package.json`, `lint.js`, `src/touched.js`,
  `touched.test.js`
- `npm run lint`: **failed** with
  `src/touched.js:1:1 no-var: use const or let`
- `npm test`: **passed** (`1` test, `0` failures)
- Code-shape issue still present: `var` declaration in `src/touched.js`
- Baseline failures: none observed
- Unproven: formatting, static types, and real product/browser behavior
- Final status: **gate failed**

## Exact next-step menu

1. **Run `ce-debug` (Recommended)** — diagnose and fix the touched-file lint
   failure, then rerun the quality gate.
2. **Done for now** — leave the deliberate failure unchanged and stop.

Do not route to review, commit, or shipping while this touched-file failure
persists.
