# PR-only Supabase SQL

This folder is for **temporary database SQL used only while testing a draft pull request**.

Files here are deliberately **not** part of Supabase's production migration history. The production deploy only reads `supabase/migrations/`.

## Rules

- Put temporary PR test SQL here, not in `supabase/migrations/`.
- Name temporary files clearly, for example: `PR20__feedback_test_setup.sql`.
- Never apply these files to the production project with `supabase migration`, `db push`, or the Supabase MCP `apply_migration` action.
- If remote database testing is needed, use an isolated Supabase branch/project. Do not advance the production migration-history table from a PR.
- Draft PRs may contain `.sql` files here.
- Before a PR is marked ready for review or merged, remove the temporary SQL or promote the intended schema change to a normal migration in `supabase/migrations/`.
- Production-ready migrations belong in `supabase/migrations/<timestamp>_<name>.sql` and are applied only after merge to `main`.

CI enforces these rules:
- PR-only markers are rejected inside `supabase/migrations/`.
- non-draft PRs fail if temporary `.sql` files remain here.
- `main` fails before deployment if temporary `.sql` files somehow remain here.

This keeps draft-PR database testing from blocking unrelated PR merges or production deploys.
