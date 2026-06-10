# HTML Report Format

The architecture review is rendered as one self-contained HTML report in the target repo:

```text
.ai/reviews/YYYY-MM-DD-NNN-improve-codebase-architecture-review.html
```

Use Tailwind and Mermaid from CDNs. Mermaid handles graph-shaped diagrams. Hand-built HTML/CSS or inline SVG handles editorial visuals such as mass diagrams, cross-sections, and collapsed call graphs.

## Scaffold

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Architecture review - {{repo name}}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script type="module">
      import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";
      mermaid.initialize({ startOnLoad: true, theme: "neutral", securityLevel: "loose" });
    </script>
    <style>
      .seam { stroke-dasharray: 4 4; }
      .leak { stroke: #dc2626; }
      .deep { background: linear-gradient(135deg, #0f172a, #1e293b); }
    </style>
  </head>
  <body class="bg-stone-50 text-slate-900 font-sans">
    <main class="max-w-5xl mx-auto px-6 py-12 space-y-12">
      <header>...</header>
      <section id="candidates" class="space-y-10">...</section>
      <section id="top-recommendation">...</section>
      <section id="sources">...</section>
    </main>
  </body>
</html>
```

## Header

Show repo name, branch or PR when known, date, and a compact legend:

- solid box = module
- dashed line = seam
- red arrow = leakage
- thick dark box = deep module

Keep the header short. The report should open directly into candidates.

## Candidate Card

Each candidate is one `<article>`:

- **Title** - short, names the deepening.
- **Badge row** - recommendation strength plus dependency category.
- **Files** - monospaced list of repo-relative paths.
- **Before / After diagram** - the centerpiece.
- **Problem** - one sentence.
- **Solution** - one sentence, without final interface design.
- **Wins** - bullets, six words or fewer when possible.
- **Sources** - compact references to `.ai` artifacts, docs, or source paths.
- **Decision conflict** - one amber callout when a candidate contradicts an existing ADR, plan decision, or explicit instruction.

If the diagram needs a long paragraph to be understood, redraw the diagram.

## Diagram Patterns

### Mermaid Graph

Use Mermaid for dependency flow, call flow, or sequence shape.

```html
<div class="rounded-lg border border-slate-200 bg-white p-4">
  <pre class="mermaid">
    flowchart LR
      A[Chart surface] --> B[Render resolver]
      B --> C[Catalog lookup]
      C -.leaks.-> D[Source picker rules]
      classDef leak stroke:#dc2626,stroke-width:2px;
      class C,D leak
  </pre>
</div>
```

### Hand-Built Boxes And Arrows

Use absolutely positioned boxes and inline SVG arrows when Mermaid fights the layout. This is best when the after diagram should look like one deep module with faded internal calls.

### Cross-Section

Stack horizontal bands to show too many thin pass-through modules. Before: many thin bands. After: one thick band with the behavior named.

### Mass Diagram

Show interface size against implementation size. Before: interface nearly as large as implementation. After: small interface, larger hidden implementation.

### Call-Graph Collapse

Before: nested or branching calls that callers must understand. After: one module, with former calls shown as faded internal implementation.

## Style

- Editorial, not dashboard-heavy.
- Use generous whitespace and a restrained palette.
- Use one accent color plus red for leakage and amber for conflicts.
- Keep diagrams around 320px tall.
- Use `text-xs uppercase tracking-wider` for schematic labels.
- Do not use app-style interactivity. The report is static except Mermaid rendering.

## Top Recommendation

Use one larger card with:

- candidate name
- one sentence on why it should go first
- link to the candidate card
- suggested next artifact: usually a follow-up `.ai/plans/` entry after the user chooses the candidate

## Tone

Plain, concise, and concrete. Use the vocabulary from [LANGUAGE.md](LANGUAGE.md): module, interface, implementation, depth, deep, shallow, seam, adapter, leverage, locality.

Phrasings that fit:

- "The render resolver is shallow: callers still know catalog timing."
- "Selector readiness leaks across the seam."
- "Deepen: one interface, one place to test."
- "Two adapters justify the seam: production query and local test adapter."

Avoid vague wins such as "cleaner code" or "easier maintenance." Name locality, leverage, or test surface.
