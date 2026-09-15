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
- Local-first storage with optional Supabase persistence.

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

## Optional Supabase setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Copy `.env.example` to `.env`.
4. Add your project URL and anon key.

This app works without Supabase using browser storage only. For production cloud sync, add Supabase Auth so each user only accesses their own records.
