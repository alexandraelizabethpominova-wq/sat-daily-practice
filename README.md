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

Database schema changes are versioned under `supabase/migrations/`. Do not paste `schema.sql` into the Supabase SQL editor or make production schema changes manually unless you are intentionally creating a migration to capture them afterward.

Copy `.env.example` to `.env` and add your project URL and publishable key:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

The app remains local-first. When a Supabase Auth session exists, completed practice sessions and attempts are backed up to Supabase, cloud history is merged into the local browser history on startup, and clearing history also clears the authenticated user's cloud rows. Cross-device persistence therefore requires Supabase Auth sign-in for the same user on each device.

## Automated migrations from GitHub

`.github/workflows/supabase-migrations.yml` applies pending migrations whenever migration files are merged to `main`.

Add these encrypted GitHub Actions repository secrets before relying on the workflow:

- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_DB_PASSWORD`

The workflow links to the `sat practice` Supabase project, runs `supabase db push --dry-run`, and then applies pending migrations with `supabase db push`.

Alternatively, Supabase's native GitHub integration can deploy the same `supabase/migrations/` directory. If using the native integration, set the repository working directory to `.` and enable **Deploy to production** for `main`; do not run both deployment mechanisms unless you intentionally want redundant deployment checks.
