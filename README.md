# Codex AI Agents Skills
Package generated on 2026-09-09 15:56:35

## Included skills
- .system
- angular-architect
- api-and-interface-design
- api-designer
- architecture-designer
- atlassian-mcp
- browser-testing-with-devtools
- chaos-engineer
- ci-cd-and-automation
- cli-developer
- cloud-architect
- code-documenter
- code-review-and-quality
- code-reviewer
- code-simplification
- constraint-driven-development
- context-engineering
- cpp-pro
- csharp-developer
- database-optimizer
- debugging-and-error-recovery
- debugging-wizard
- deprecation-and-migration
- devops-engineer
- django-expert
- django-storages-s3
- documentation-and-adrs
- dotnet-core-expert
- doubt-driven-development
- embedded-systems
- fastapi-expert
- feature-forge
- fine-tuning-expert
- flutter-expert
- frontend-ui-engineering
- fullstack-guardian
- game-developer
- git-workflow-and-versioning
- golang-pro
- graphql-architect
- idea-refine
- incremental-implementation
- interview-me
- java-architect
- javascript-pro
- kotlin-specialist
- kubernetes-specialist
- laravel-specialist
- legacy-modernizer
- mcp-developer
- microservices-architect
- ml-pipeline
- monitoring-expert
- navigators
- nestjs-expert
- next-best-practices
- nextjs-developer
- observability-and-instrumentation
- pandas-pro
- performance-optimization
- php-pro
- planning-and-task-breakdown
- playwright-expert
- postgres-pro
- prompt-engineer
- python-pro
- qa-check-agent
- rag-architect
- rails-expert
- react-expert
- react-native-expert
- rust-engineer
- salesforce-developer
- secure-code-guardian
- security-and-hardening
- security-reviewer
- shipping-and-launch
- shopify-expert
- source-driven-development
- spark-engineer
- spec-driven-development
- spec-miner
- spring-boot-engineer
- sql-pro
- sre-engineer
- storefront-ui-expert
- stos-product-ux
- swift-expert
- tailwind-design-system
- terraform-engineer
- test-driven-development
- test-master
- the-fool
- typescript-pro
- ui-ux-expert
- ui-ux-pro-max
- using-agent-skills
- vue-best-practices
- vue-expert
- vue-expert-js
- websocket-engineer
- wordpress-pro

Total: 102
Source: `C:\Users\CROSSIAN\.codex\skills`

.system and standard skills are included as source of truth for distribution.

## Updates

The local Codex skills directory is the source for the skills already listed in
`manifest.json`. A weekly Codex automation checks upstream changes for the
provenance-pinned UI/UX Pro Max skill, then checks **every packaged skill** for
local changes. It validates and publishes accepted changes to this repository.
Only `ui-ux-pro-max` currently has a documented external upstream; other skills
are synced from their local installed copies, not guessed from similarly named
GitHub repositories.

Run the same package check manually (Node.js 18+):

```sh
node scripts/sync-skills.mjs --check
node --test scripts/sync-skills.test.mjs
```

`--check` reports differences without writes (exit 2 if updates are available).
After reviewing the diff and provenance, run `node scripts/sync-skills.mjs
--apply`, validate changed skills, and commit/push. Set `CODEX_SKILLS_ROOT` or
pass `--source /path/to/skills` to use a non-default installation.

For `ui-ux-pro-max`, run `scripts/validate_data.py` and search/design-system
smoke checks in the packaged skill. Its complete upstream unit suite requires
the pinned full checkout named in `skills/ui-ux-pro-max/UPSTREAM.md`; some tests
refer to repository-level maintenance scripts that are not part of this package.

The sync refuses missing skills, unexpected deletions, symlinks, sensitive
filenames, and high-confidence secret patterns. It never adds newly installed
skills or updates Codex-managed `.system` content automatically. New skills need
an explicit public-license and privacy review before adding them to the manifest.
Scheduled updates are best-effort when the local Codex automation can run; this
repo cannot read changes on a private machine from GitHub Actions alone.
