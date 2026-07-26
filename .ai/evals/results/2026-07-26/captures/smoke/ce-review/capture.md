# Code Review

## Findings

### must-fix

| File | Issue | Concrete consequence | Fix |
| --- | --- | --- | --- |
| `src/page.js:2` | `Array.prototype.slice` excludes its end index, but the function subtracts one from that endpoint. | Every positive page size returns one item fewer than requested; the included case returns `["b"]` instead of `["b", "c"]`, and `size = 1` returns an empty array. | Use `items.slice(start, start + size)`. |

### should-fix

No findings.

### nit

No findings.

## Verdict

Needs changes.

## Checks

- `npm test`: failed (1 test, 0 passed, 1 failed). `page.test.js:7` expected `["b", "c"]` but received `["b"]`.
- Lint/typecheck: not run; the package defines no lint or typecheck scripts.
- Browser proof: not applicable; the diff contains no rendered UI.
- RepoPromptCE context pass: unavailable because no RepoPrompt workspace matched this fresh checkout; review continued from the complete three-file diff and full file contents as permitted by the skill fallback.

## Source integrity proof

- Before review:
  - `package.json`: SHA-256 `6ae966448a7a5c05e6140619208ded54fc05bd4a092f0cbdb2b5a127c851b8ac`
  - `page.test.js`: SHA-256 `dcaf25f2903a9c19691cc654f1fc7d1dd11861c156fb3a5b5aec8d0fd553ff01`
  - `src/page.js`: SHA-256 `a24ac50cf72b5c1e8465a24f46efba7ba7b480534f66fc7ab4ab080cd456cd7c`
- After review, all three SHA-256 values were identical.
- The pre-report working tree still listed only the original intent-to-add files: `package.json`, `page.test.js`, and `src/page.js`.
- No source or test file was edited, staged, or committed by the review. The only review artifact created is `capture.md`.

## Final report

The implementation is off by one at `src/page.js:2`, and the focused test proves the user-visible contract is broken. Fix the exclusive slice endpoint, then rerun `npm test`.
