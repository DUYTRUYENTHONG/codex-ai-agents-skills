# Operating Contract

## Scope

Include only DuyTruyenThong public site, company CMS/content, company data/auth boundaries, company QA evidence, and the `company-site` release lane. Exclude STOS and Cho Kenh unless the user explicitly requests cross-product architecture work.

## Dedup Decision

- `NEW`: no active work owns the same outcome or canonical boundary.
- `CONTINUE`: an active task already owns it; do not create another prompt.
- `AMEND`: preserve the existing task and add only the proven missing delta.
- `RECONCILE`: conflicting source, candidate, ownership, or persistence evidence must be resolved before implementation.

Compare product/outcome, acceptance criteria, canonical entity, API/workflow/persistence, exact write paths, runtime/candidate, and release target.

## Prompt Contract

One permitted prompt must declare goal, current verified state, dedup decision, owner, exact in/out scope, canonical contracts, implementation sequence, measurable acceptance, impacted QA, real stop conditions, rollback, and output evidence.

Do not produce multiple alternate prompts. Do not rewrite an old prompt without new evidence.
