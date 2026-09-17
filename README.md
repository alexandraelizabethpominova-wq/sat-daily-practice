# SAT Daily Practice

A React + TypeScript SAT practice app with adaptive sessions, performance tracking, source-PDF review, and a structured Question Bank.

## Main areas

- **Study Plan** — overview of practice progress and suggested next steps.
- **Practice Tests** — start mixed, Reading & Writing, or Math practice.
- **Practice Setup** — configure subject and questions per session without mixing setup controls into the Question Bank.
- **Question Bank** — review reconstructed question text beside the original PDF source.
- **Performance** — review practice accuracy and history.
- **Resources** — manage the question and answer PDFs and build the local text database.

## Question rendering

Math questions use verified semantic text and KaTeX for formulas and symbols. Graphs, diagrams, and other source visuals are rendered from the PDF with responsive crops so the complete visual remains visible. Reading & Writing questions use structured text extraction with PDF fallbacks where needed.

## Design system

The UI follows an atomic design structure under `src/design-system`:

- `atoms` wrap MUI primitives (for example `AlexButtonBase`, `AlexDropdown`, and `AlexTextField`).
- `molecules` compose atoms into reusable UI patterns.
- `organisms` compose atoms and molecules into page-level features such as the sidebar layout and Question Bank review.

Molecules, organisms, and technical UI components do not import MUI directly. An architecture regression test enforces that MUI is consumed through the wrapper atoms.

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
