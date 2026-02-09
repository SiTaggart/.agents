---
name: sync-upstream
description: Categorization rules and analysis logic for upstream sync reports
---

# Upstream Sync Analysis

Domain expertise for categorizing changes from the [compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin) upstream into the local `.agents` setup.

## Path Mapping

The upstream repo organizes agents into subdirectories by category. The local repo flattens these into a single `agents/` directory.

| Upstream Path | Local Path | Notes |
|--------------|------------|-------|
| `agents/review/*.md` | `agents/*.md` | Code review agents |
| `agents/research/*.md` | `agents/*.md` | Research/analysis agents |
| `agents/design/*.md` | `agents/*.md` | Design review agents |
| `agents/workflow/*.md` | `agents/*.md` | Workflow automation agents |
| `agents/docs/*.md` | `agents/*.md` | Documentation agents |
| `commands/workflows/*.md` | `commands/*.md` | Workflow commands flatten to commands/ |
| `commands/*.md` | `commands/*.md` | Direct 1:1 mapping |
| `skills/*/` | `skills/*/` | Direct 1:1 mapping (directory per skill) |

When mapping paths, strip the content root prefix (`plugins/compound-engineering/`) first, then apply the mapping table. Use the **longest matching prefix** from the table.

## Skip Patterns

### Filename Patterns

These basenames (without extension) are auto-skipped. Use glob matching.

| Pattern | Reason |
|---------|--------|
| `dhh-rails-*` | DHH Rails style — Ruby/Rails specific |
| `kieran-rails-*` | Kieran Rails reviewer — Ruby/Rails specific |
| `every-style-*` | Every company style guides |
| `ankane-readme-*` | Ankane README writer — Ruby gem specific |
| `schema-drift-*` | Schema drift detector — Rails specific |
| `andrew-kane-*` | Andrew Kane patterns — Ruby specific |
| `dhh-rails-style` | DHH Rails style (exact match) |
| `dspy-ruby` | DSPy Ruby integration |
| `rclone` | rclone deployment — Every infrastructure |
| `deploy-docs` | Deployment docs — Every infrastructure |
| `release-docs` | Release docs — Every infrastructure |
| `xcode-test` | Xcode testing — iOS specific |
| `feature-video` | Feature video — Every workflow |

### Content Markers

When these strings appear in file content, it suggests the file is Ruby/Rails/Every-specific. A single occurrence in a large general-purpose file should not trigger a skip — use judgment:

| Marker | Indicates |
|--------|-----------|
| `every.to` | Every company domain |
| `Every's` | Every company reference |
| `bundle exec` | Ruby bundler command |
| `standardrb` | Ruby linter |
| `erblint` | ERB linter (Rails views) |
| `brakeman` | Rails security scanner |
| `ActiveRecord` | Rails ORM |
| `schema.rb` | Rails database schema |
| `Rails.` | Rails framework reference |

**Heuristic:** If a file contains 3+ distinct content markers, it is likely Rails/Every-specific and should be skipped. If it contains 1-2 markers in an otherwise general-purpose file, flag it for review but don't auto-skip.

## Relevance Scoring

| Score | Criteria |
|-------|----------|
| **HIGH** | File exists locally AND changed upstream (update to existing content) |
| **HIGH** | New file that is clearly general-purpose (TypeScript, React, design, testing) |
| **MEDIUM** | New file that appears general-purpose but may need adaptation |
| **LOW** | Matches skip patterns OR is language/framework-specific |

## Adaptation Notes

When porting content from upstream, common adaptations include:

- **Strip Every references** — Replace "Every's" with generic language, remove `every.to` URLs
- **Remove Rails sections** — Delete Rails-specific tool lists, commands, patterns
- **Adjust agent tool lists** — Upstream agents may reference Rails-specific tools (standardrb, erblint, etc.)
- **Flatten paths** — Upstream uses subdirectories for agent categories; local uses flat structure
- **Update cross-references** — Links between agents/skills may use upstream paths

## Report Template

The sync report written to `.claude/sync-report.md` follows this structure:

```markdown
# Upstream Sync Report
Generated: <ISO date>
Range: <old_short>..<new_short> (<N> commits)

## Summary
- **Commits:** <N>
- **Updates:** <N> files changed that exist locally
- **New:** <N> files to consider adding
- **Skipped:** <N> files filtered by patterns

## Commits
- `<short_hash>` <commit message>

## Updates to Existing Content
Items that exist locally and changed upstream.

### <local_path>
- **Upstream path:** <relative_path>
- **Status:** <M/A/D> | +<added> / -<removed> lines
- **What changed:** <one-line summary>
- **Action needed:** Review diff, merge improvements

## New Content to Review
Items that don't exist locally and may be worth adding.

### <mapped_local_path>
- **Upstream path:** <relative_path>
- **Category:** <agent | command | skill>
- **Relevance:** <HIGH | MEDIUM | LOW> — <reason>
- **Summary:** <what this file does>

## Auto-Skipped
Filtered by skip patterns — listed for transparency.

- `<relative_path>` — <skip reason>
```
