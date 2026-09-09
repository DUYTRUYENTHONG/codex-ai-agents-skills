# RAG, Routing, And Adaptation

Use `agent-system/rag/duytruyenthong-sources.json` as the retrieval contract. Current source and git state outrank active V4 artifacts; active artifacts outrank release evidence; release evidence outranks dated reports.

Never retrieve secrets or private user data. Load only the references required for the current decision and stay within the context budget.

Use the current Codex model only:

- `FAST`: status, dedup, or a bounded contract lookup.
- `STANDARD`: prompt generation, sprint refinement, or bounded feature analysis.
- `DEEP`: architecture, canonical data, Supabase migration, auth/RBAC, release incident, or reconciliation.

Do not use direct fine-tuning. Adapt with ranked local RAG, prompt/skill versioning, deterministic evals, append-only prompt decisions, and evidence-backed policy updates. Require a repeated failure pattern and a passing regression eval before changing retrieval or hook policy.
