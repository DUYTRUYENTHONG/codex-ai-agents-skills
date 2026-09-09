# QA Check Protocol

Use this reference when a repo does not already provide a complete QA checklist, or when an agent needs a compact operating model for release-grade QA.

## QA Input Gate

Before development or QA begins, require:

- Clear product objective and affected user personas.
- Acceptance criteria with must-pass behavior.
- In-scope and out-of-scope boundaries.
- Known risky layers: UI, API, auth, data, analytics, devops, billing, AI/ML, third-party services.
- Test accounts and safe test data.
- Rollback or recovery expectation.
- Evidence expected for sign-off.

If these are missing, infer conservatively from repo context and mark gaps as risk.

## QA Output Gate

Before deploy, require:

- Typecheck/build/test/smoke evidence.
- Feature logic validated against acceptance criteria.
- Regression scope mapped to changed layers.
- UI/UX verified on desktop and mobile.
- API contracts and data shape validated.
- Auth/permission/privacy checks passed.
- Observability and error handling verified for changed flows.
- No fake success: every pass must have evidence.
- P0/P1 defects fixed or explicitly blocking deploy.

## Agent Preflight

Run a preflight scan before deeper testing:

- `git status --short`
- conflict markers: `<<<<<<<`, `=======`, `>>>>>>>`
- duplicate/conflicting implementations for the same feature path
- suspicious bypasses: `@ts-ignore`, `@ts-nocheck`, broad `any`, disabled lint rules, hardcoded admin/demo credentials in production UI
- missing or stale QA scripts
- generated artifacts accidentally committed
- env assumptions and missing secrets

## Product Logic QA

Validate logic before visual polish:

- Golden path and top user tasks.
- Edge cases: empty, null, partial, duplicate, expired, deleted, disabled, unauthorized, rate-limited.
- Impossible states: UI cannot represent mutually exclusive states at the same time.
- Idempotency: retrying create/update actions does not duplicate or corrupt data.
- Concurrency: two sessions or tabs cannot silently overwrite each other.
- State transitions: every status change has a valid previous and next state.
- Persistence: refresh/reopen keeps intended state.
- Error recovery: failed action can be retried or undone.

## UI/UX And Responsive QA

Check real screens, not only DOM routes:

- First viewport clarity, scan path, CTA priority, hierarchy, spacing, alignment.
- Text clipping, overlap, horizontal scroll, excessive wrapping, unreadable contrast.
- Desktop, tablet, iPhone compact/standard/Pro Max, Android compact/mainstream/large/foldable.
- iOS Safari, Android Chrome, and in-app browser risks for Zalo/Facebook/TikTok/Messenger/Instagram traffic.
- Mobile keyboard behavior, sticky bars, modals, menus, toasts, safe-area/notch, viewport height changes.
- Loading, error, empty, success, disabled, hover, focus, active, selected, and offline states.
- Animation/effects: purposeful, smooth, no layout shift, no motion sickness, reduced-motion respected.
- Visual regression screenshots for changed surfaces.

## API, Data, Auth, Security

Block deploy when:

- Public endpoints expose private fields, credentials, tokens, internal IDs, or secrets.
- Auth-only actions work without a valid session.
- Role checks are inconsistent between UI and API.
- Client-side checks are not enforced server-side.
- Schema changes are not migrated, versioned, or backward-compatible.
- Analytics events are missing required business fields or pollute reports.
- Logs expose sensitive customer or credential data.

## DevOps, Observability, Incidents

Check:

- Build and runtime env parity.
- Safe deploy/rollback path.
- Health checks and post-deploy smoke.
- SLO/error-budget impact for critical flows.
- Logs, metrics, traces, and alerts for changed paths.
- Rate limits and retry behavior.
- Third-party degradation handling.
- Migration safety and data backup expectations.

## AI/MLOps And Vibe Coding Controls

For AI-generated or AI-assisted systems:

- Trace requirement -> prompt/change -> code -> test evidence.
- Detect duplicated components, dead branches, inconsistent patterns, and one-off hacks.
- Review prompt/config drift for agent behavior changes.
- Validate AI output with deterministic tests where possible.
- Ensure human override exists for high-impact automated actions.
- Keep one source of truth for QA standards.

## Final Report Template

```markdown
## QA Result
- Product:
- Environment:
- Decision: PASS | BLOCKED | PASS_WITH_RISK

## Checks Run
- Command/browser/API checks:
- Evidence:

## Findings
- P0:
- P1:
- P2:
- P3:

## Fixes Applied
- Root cause:
- Files changed:
- Retest:

## Remaining Risk
- Risk:
- Owner/next action:
```
