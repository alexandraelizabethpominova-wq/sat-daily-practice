# SAT Daily Practice

A React + TypeScript SAT practice app with adaptive sessions, performance tracking, source-PDF review, a structured Question Bank, and optional authenticated Supabase persistence.

## Main areas

- **Study Plan** — overview of practice progress and suggested next steps.
- **Practice Tests** — start mixed, Reading & Writing, or Math practice.
- **Practice Setup** — configure subject and questions per session without mixing setup controls into the Question Bank.
- **Question Bank** — review reconstructed question text beside the original PDF source.
- **Performance** — review practice accuracy and history.
- **Resources** — manage the question and answer PDFs and build the local text database.

## Question rendering

Math questions use verified semantic text and KaTeX for formulas and symbols. Graphs, diagrams, and other source visuals are rendered from the PDF with responsive crops so the complete visual remains visible. Reading & Writing questions use structured text extraction with PDF fallbacks where needed.

Source visual crops include a small clamped safety margin before rasterization, and the resulting images scale to the available question width without a fixed-height crop. The visual cache is versioned so rendering changes do not leave stale clipped images in the browser.

## Design system

The UI follows an atomic design structure under `src/design-system`:

- `atoms` wrap MUI primitives (for example `AlexButtonBase`, `AlexDropdown`, and `AlexTextField`).
- `molecules` compose atoms into reusable UI patterns.
- `organisms` compose atoms and molecules into page-level features such as the sidebar layout and Question Bank review.

Molecules, organisms, and technical UI components do not import MUI directly. An architecture regression test enforces that MUI is consumed through the wrapper atoms. Wrapper atoms that need to participate in MUI composition forward refs to their underlying MUI element.

## Development

```bash
npm install
npm run dev
```

Run the full regression suite and production build with:

```bash
npm test
npm run build
```

GitHub Actions runs unit tests before the TypeScript/Vite production build on pushes to `main`, `ui/**`, and pull requests.

## Supabase persistence

Database schema changes are versioned under `supabase/migrations/`. The migration files are the schema source of truth; avoid making production schema changes manually without capturing them in a migration.

For local development, create `.env.local` with the project URL and publishable key:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

The app remains local-first. When a Supabase Auth session exists, completed practice sessions and attempts are backed up to Supabase, cloud history is merged into local browser history on startup, and clearing history also clears the authenticated user's cloud rows. Cross-device persistence requires signing in as the same Supabase Auth user on each device.

## Automated Supabase migrations

`.github/workflows/supabase-migrations.yml` applies pending migrations whenever migration files are merged to `main`.

The repository needs these encrypted GitHub Actions secrets:

- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_DB_PASSWORD`

The workflow links to the `sat practice` Supabase project, runs `supabase db push --dry-run`, and then applies pending migrations with `supabase db push`.

Supabase's native GitHub integration can deploy the same `supabase/migrations/` directory as an alternative. Avoid enabling both deployment paths unintentionally.
