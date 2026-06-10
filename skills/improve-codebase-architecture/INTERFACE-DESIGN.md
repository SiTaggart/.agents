# Interface Design

Use this after the user chooses a deepening candidate and wants to explore possible interfaces. The candidate pass finds opportunities; this pass designs the seam.

Use the vocabulary in [LANGUAGE.md](LANGUAGE.md) and dependency categories in [DEEPENING.md](DEEPENING.md).

## 1. Frame The Problem Space

Before proposing interfaces, summarize:

- the product contract the deepened module should own
- what leaks across the current seam
- dependencies and their deepening category
- callers that should become simpler
- behavior tests that should survive implementation changes
- constraints from `.ai/plans/`, `.ai/solutions/`, instructions, source code, or user decisions

Include a small illustrative code sketch only when it clarifies constraints. Mark it as a sketch, not the proposal.

## 2. Design It More Than Once

When subagents are available and the task is worth the overhead, run at least three independent interface-design passes. If subagents are unavailable, produce the same set of designs yourself and keep them genuinely different.

Use different design constraints:

- **Minimal interface** - 1 to 3 entry points, maximum leverage per entry point.
- **Flexible interface** - supports extension and less common callers.
- **Common caller interface** - makes the primary workflow trivial.
- **Ports and adapters interface** - use only when the dependency category justifies a real seam.

Each design should include:

1. Interface: functions, types, parameters, invariants, ordering, and error modes.
2. Usage example: how callers use it.
3. Hidden implementation: what moves behind the seam.
4. Dependency strategy: adapter shape when justified.
5. Trade-offs: where depth is strong and where it stays thin.

## 3. Compare And Recommend

Present designs sequentially, then compare them by:

- depth at the interface
- locality of behavior and bugs
- seam placement
- test surface
- migration risk
- fit with existing plans and conventions

End with your recommendation. Be opinionated. If a hybrid is strongest, name the pieces to combine and the pieces to reject.
