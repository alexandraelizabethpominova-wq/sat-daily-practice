# SAT Daily Practice

A React + TypeScript study app for daily SAT practice using your own SAT practice-test PDFs locally in the browser.

## Features

- Choose **English**, **Math**, or **Both** for each session.
- Configure the number of questions per session.
- Daily question selection prioritizes unseen questions and questions you previously missed.
- Tracks accuracy, time per question, average time, sessions completed, and unique questions seen.
- End-of-session analysis highlights accuracy, average time, missed questions, and the slowest questions.
- Optional official explanations using the uploaded SAT answer-explanation PDF.
- Multiple-choice questions are auto-graded.
- Student-produced-response math questions show the official answer and let you self-mark.
- Local-first storage with optional authenticated Supabase persistence.

## Copyright / PDF handling

The SAT PDFs are **not committed to this repository**. Upload the question PDF and answer-explanation PDF inside the app. They are stored locally in IndexedDB and rendered in the browser with `pdfjs-dist`.

`.gitignore` excludes `*.pdf` so copyrighted test PDFs are not accidentally committed.

## Tech stack

- React 18
- TypeScript
- Vite
- `pdfjs-dist`
- `lucide-react`
- Optional Supabase

## Run locally

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in your terminal.

## Supabase persistence

Database schema changes are tracked in `supabase/migrations/`. Do not paste `schema.sql` into the Supabase SQL editor or make production schema changes outside migrations unless you intentionally plan to capture that drift afterward.

The current persistence tables use Row Level Security and only allow authenticated users to access their own sessions and attempts.

To enable browser cloud sync:

1. Copy `.env.example` to `.env.local`.
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` from the Supabase project.
3. Configure Supabase Auth for the application and its allowed redirect URLs.
4. Sign in before expecting practice history to sync. The app continues to work locally when Supabase is not configured or the user is signed out.

The Supabase client supports the legacy `VITE_SUPABASE_ANON_KEY` as a fallback, but new setups should use a publishable key.

## Database migration workflow

Use the Supabase CLI for future schema changes:

```bash
supabase migration new <descriptive-name>
# edit the generated migration
supabase db reset
```

Commit the migration with the application change. Production should apply only new migrations from `supabase/migrations/`.

## GitHub integration

The recommended deployment path is Supabase's GitHub integration:

1. In the Supabase project, open **Project Settings → Integrations → GitHub Integration**.
2. Connect this repository.
3. Use `.` as the working directory because `supabase/` is at the repository root.
4. Enable production deployment from `main` when you are ready for merged migrations to deploy automatically.
5. Make the Supabase integration status a required GitHub check before merging database changes.

This keeps migration history in Git and removes the need to manually run production SQL.
