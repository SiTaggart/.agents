# Deepening

Use this reference to judge whether a cluster of shallow modules can be deepened safely. It assumes the vocabulary in [LANGUAGE.md](LANGUAGE.md): **module**, **interface**, **seam**, **adapter**, **leverage**, and **locality**.

## Dependency Categories

### 1. In-Process

Pure computation, in-memory state, or deterministic transforms with no I/O.

Usually deepenable. Merge or hide the shallow modules and test through the new interface directly.

### 2. Local-Substitutable

Dependencies that have realistic local stand-ins, such as an in-memory filesystem, PGLite, local queues, fixtures, or fake clocks.

Deepenable when the stand-in exercises the real behavior. Keep the external interface focused on product behavior, not test-only plumbing.

### 3. Remote But Owned

Owned services across a network seam, such as internal APIs, queues, or worker systems.

Define a port at the seam only when there will be at least two meaningful adapters, usually production transport plus an in-memory or local test adapter. The deep module owns product logic; the adapter owns transport.

### 4. True External

Third-party services or systems the team does not control.

Inject an interface at the external seam when tests or alternative environments need an adapter. Keep vendor details behind the seam so callers do not learn third-party behavior directly.

## Seam Discipline

- Do not introduce a port for a single concrete implementation unless a second adapter is real and useful.
- Internal seams can exist inside a deep module for implementation clarity or its own tests. Do not expose them through the external interface just because tests use them.
- A deep module should hide ordering, normalization, validation, cache rules, and error handling that callers currently repeat.

## Testing Strategy

- Write tests at the deepened module's interface.
- Assert observable behavior, not internal helper calls.
- Keep old tests until stronger interface tests exist.
- Delete or rewrite old shallow-module tests only when they duplicate behavior now protected at the interface.
- Prefer tests that survive internal refactors.
