# ce-work capture

## Accepted product contract

When a user runs `node src/cli.js --version`, the CLI prints the canonical
package version (`2.3.4`) to stdout and exits with status 0.

- Business reason: users can identify the installed CLI version.
- Owner boundary: argument handling in `src/cli.js`, with the version sourced
  from `package.json`.
- Proof surface: a subprocess test and a direct CLI invocation.
- Out of scope: aliases such as `-v`, a new argument parser, and unrelated
  command behavior.

## Files changed

- `src/cli.js` — handles `--version` and reads the existing package version.
- `cli.test.js` — proves the flag through the CLI subprocess boundary.
- `capture.md` — records this workflow.

`package.json` supplied the existing version and check scripts; it was not
changed.

## Commands and results

- `node --version` — passed; `v24.14.1`.
- Baseline `npm test` — passed; 1 test.
- Baseline `npm run check` — passed.
- `node --test --test-name-pattern='--version' cli.test.js` — passed; 1 test.
- `node src/cli.js --version` — exited 0 and printed `2.3.4`.
- Quality gate `npm run check` — passed.
- Quality gate `npm test` — passed; 2 tests.
- Quality gate `node src/cli.js --version` — exited 0 and printed `2.3.4`.

## User-facing proof

```text
$ node src/cli.js --version
2.3.4
```

## Quality-gate result

Passed for `src/cli.js` and `cli.test.js`.

- Syntax: clean via the repository's `npm run check`.
- Tests: 2 passed, 0 failed via `npm test`.
- Code shape: reviewed; the behavior remains at the existing command boundary,
  uses the package manifest as the single version source, and adds no dependency
  or speculative abstraction.
- Formatter, linter, and static type-check: no such scripts or configuration
  exist in this repository.
- Product proof: passed through the real CLI surface.
- Unrelated baseline failures: none.

## Final report

Added `--version` support to the CLI. The command now reports the current
package version, and both the focused proof and the full repository checks pass.
No commit was created.

## Exact next-step menu

1. Done for now (recommended) — the narrow change is implemented, proven, and
   quality-gated.
