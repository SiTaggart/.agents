# Language

Shared vocabulary for every suggestion this skill makes. Use these terms exactly. Consistent language is part of the review discipline.

## Terms

**Module**
Anything with an interface and an implementation. Deliberately scale-agnostic. It can be a function, hook, reducer, class, package, or product slice.
Avoid: unit, component, service when you mean module.

**Interface**
Everything a caller must know to use the module correctly. Includes type signatures, invariants, ordering constraints, error modes, required configuration, performance expectations, and observable behavior.
Avoid: API or signature when the full caller contract is wider than the type-level surface.

**Implementation**
What is inside a module. Distinct from **adapter**: an adapter is about the role a concrete thing plays at a seam.

**Depth**
Leverage at the interface. A module is **deep** when a lot of behavior sits behind a small interface. A module is **shallow** when the interface is nearly as complex as the implementation.

**Seam**
A place where behavior can be altered without editing in that place. The seam is where a module's interface lives.
Avoid: boundary, which is overloaded with other architecture vocabulary.

**Adapter**
A concrete thing that satisfies an interface at a seam. Describes role, not substance.

**Leverage**
What callers get from depth. More capability per unit of interface they must learn.

**Locality**
What maintainers get from depth. Change, bugs, knowledge, and verification concentrate in one place instead of spreading across callers.

## Principles

- **Depth is a property of the interface, not the implementation.** A deep module can contain small internal helpers. They just are not part of the external interface.
- **Use the deletion test.** Imagine deleting the module. If complexity vanishes, the module was not hiding anything. If complexity reappears across callers, the module was earning its keep.
- **The interface is the test surface.** Callers and tests cross the same seam. If tests must reach past the interface, the module may be the wrong shape.
- **One adapter means a hypothetical seam. Two adapters means a real one.** Do not introduce a seam unless something actually varies across it.

## Relationships

- A **module** has one **interface**.
- **Depth** is measured against a module's **interface**.
- A **seam** is where a module's **interface** lives.
- An **adapter** sits at a **seam** and satisfies the **interface**.
- **Depth** produces **leverage** for callers and **locality** for maintainers.

## Rejected Framings

- Depth as implementation-lines divided by interface-lines. That rewards padding the implementation. Use depth-as-leverage instead.
- Interface as only the TypeScript `interface` keyword or public methods. The caller contract is wider than syntax.
- Boundary as a synonym for seam. Use **seam** or **interface**.
