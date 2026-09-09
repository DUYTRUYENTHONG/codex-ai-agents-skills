---
name: qa-check-agent
description: Root-cause QA operating skill for Codex agents before deploy, after code changes, during incident triage, or when asked to QA check a product. Use for vibe-coded products, growth-commerce-os, UI/UX responsive checks, feature logic validation, data/auth/API/devops QA, live daily QA, automation QA, and bug fixing where the agent must identify the true root cause, fix safely, rerun verification, and produce a release decision.
---

# QA Check Agent

## Core Rule

Use this skill to turn an agent into a release-blocking QA engineer. Never treat QA as report-only when the user asks to fix. Find the root cause, fix the correct source module, rerun the smallest failing check, then rerun the relevant gate.

For `growth-commerce-os`, use `QA_CHECK_BEFORE_DEPLOY.md` in the repo as the canonical checklist. Do not create competing QA process files. If the checklist needs improvement, update that single file only with concrete, testable criteria.

## Workflow

1. Identify the target product, changed files, environment, and release level.
2. Read the repo checklist:
   - For `growth-commerce-os`: `QA_CHECK_BEFORE_DEPLOY.md`
   - For other repos: find an equivalent release/QA checklist; if absent, use `references/qa-check-protocol.md`.
3. Run the preflight scan:
   - `node <skill_dir>/scripts/qa_preflight_scan.mjs <repo_root>`
   - Treat conflict markers, unresolved merge state, missing QA scripts, and suspicious bypass patterns as release risks.
4. Run repo-native gates first: typecheck, build, tests, smoke routes, and existing QA scripts.
5. Exercise user workflows, not just routes. Cover golden paths, edge cases, empty states, error states, auth states, permissions, persistence, rollback, and retries.
6. For UI work, run browser QA across desktop, tablet, iPhone compact/standard/Pro Max, Android compact/mainstream/large/foldable, reduced motion, keyboard, modal, sticky layer, safe-area, and overflow scenarios.
7. For incidents or bugs, reproduce first, isolate root cause, patch the correct layer, then retest.
8. Produce a deploy decision: `PASS`, `BLOCKED`, or `PASS_WITH_RISK`.

## Root-Cause Repair Contract

When a reproducible issue is inside the local codebase:

- Fix the root cause, not the symptom.
- Preserve the existing architecture and source of truth.
- Prefer the smallest durable change that removes the broken behavior.
- Do not hardcode passing data, bypass auth/validation, silence errors, broaden catches, or layer alternate code paths on top of broken ones.
- Do not overwrite unrelated user edits.
- Do not auto-deploy unless the user explicitly asks.
- Do not mutate production data or submit customer-facing forms during QA.
- If the issue depends on credentials, destructive data, or a third-party outage, report the blocker with exact evidence instead of faking a fix.

After every fix, rerun:

1. The smallest check that failed.
2. The related feature/browser/API gate.
3. The repo-level predeploy gate when deploy is requested.

## Severity

- `P0`: security leak, data loss, auth bypass, production down, payment/critical flow broken, destructive migration risk.
- `P1`: deploy blocker for core user flow, major UI/responsive break, incorrect business logic, broken admin path, severe performance regression.
- `P2`: important but non-blocking UX/API/data issue with workaround.
- `P3`: polish, copy, minor layout, low-risk cleanup.

Default release rule: no deploy with open `P0` or `P1`.

## Required Output

Keep the final report concise but evidence-based:

- Product and environment checked
- Commands/checks run
- Findings by severity
- Root cause for each fixed issue
- Files changed
- Verification rerun
- Remaining risk or blockers
- Deploy decision

If the user asks for a developer handoff, create or update one markdown report in the repo. Otherwise, report in the final answer.

## Reference

Read `references/qa-check-protocol.md` when the task is broad, cross-system, or not covered by a repo checklist.
