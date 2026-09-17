# Practice feature parity

This UI revision preserves the engagement and practice-loop behavior from `main` while moving presentation into the atomic design system.

## Preserved from `main`

| Behavior | New UI location | Regression protection |
| --- | --- | --- |
| Adaptive selection prioritizes unseen questions | `lib/practiceGamification.ts` | `practiceGamification.test.ts` |
| Weaker questions receive higher priority | `lib/practiceGamification.ts` | `practiceGamification.test.ts` |
| Less-recent questions receive a recency bonus | `lib/practiceGamification.ts` | `practiceGamification.test.ts` |
| Subject mode and questions-per-session settings | Question Bank / practice setup | `practiceGamification.test.ts`, storage tests |
| One question at a time with progress | `PracticeSessionHeader` + `PracticeProgress` | `PracticeProgress.test.tsx` |
| Answers are submitted and checked | `PracticeAnswerPanel` | `answerCompare.test.ts` |
| Equivalent numeric/fraction responses are accepted | `lib/answerCompare.ts` | `answerCompare.test.ts` |
| Correctness and elapsed time feedback | `AnswerFeedback` | `AnswerFeedback.test.tsx` |
| Attempts and sessions persist locally | `lib/storage.ts` | `storage.test.ts` |
| Performance shows accuracy, average time, session count, and unique questions seen | `PerformanceDashboard` | `practiceGamification.test.ts` |
| End-of-session question/explanation review | Results view | Build + answer comparison tests |
| Clear-history removes practice stats without removing settings | Performance / Question Bank | `storage.test.ts` |
| Attempts and sessions continue to sync to Supabase when configured | App practice flow | TypeScript build |
| Uploaded source PDFs and the local structured question database remain separate from practice history | Resources | Storage/source separation in app flow |

`main` does not contain a separate XP, streak, badge, level, or reward-currency system, so this change does not invent one. The engagement behavior being transferred is the adaptive practice, progress, immediate feedback, history, performance, and review loop above.

## Atomic design rules

- **Atoms** are the only design-system layer allowed to import MUI primitives directly. Examples: `AlexButton`, `AlexBox`, `AlexText`, `AlexSurface`, `AlexProgress`.
- **Molecules** compose atoms into reusable controls/content blocks. Examples: `PracticeProgress`, `AnswerFeedback`, `MetricCard`, `SideNavigation`.
- **Organisms** compose atoms/molecules into page sections. Examples: `PracticeSessionHeader`, `PracticeAnswerPanel`, `PerformanceDashboard`, `PracticeTestsDashboard`, `AppSidebarLayout`.
- `atomicArchitecture.test.ts` fails if a molecule or organism imports `@mui/material` directly.

## Math rendering safety

Math questions retain their verified source-PDF layout as the accuracy-first presentation while semantic Math rendering is improved. This avoids regressions where PDF text extraction corrupts graphs, tables, superscripts, fractions, or equations. Answer entry, scoring, timing, progress, and review remain interactive UI components.
