# Practice Test 7 — Reading & Writing Module 1 Parsing Audit

Source package reviewed:

- Practice Test 7 question PDF
- Practice Test 7 scoring / answer-key PDF
- Practice Test 7 answer-explanation PDF
- practice-test ID: `practice-test-7`

Scope: Reading & Writing Module 1, questions 1–33.

## Completion status

Reading & Writing Module 1 is complete.

All 33 questions were checked individually against the supplied official source package before being marked `verified`.

## Source-page mapping

- Q1–Q2: source page 4
- Q3–Q6: source page 5
- Q7–Q8: source page 6
- Q9–Q10: source page 7
- Q11–Q12: source page 8
- Q13: source page 9
- Q14: source page 10
- Q15: source page 11
- Q16: source page 12
- Q17–Q18: source page 13
- Q19–Q23: source page 14
- Q24–Q27: source page 15
- Q28–Q29: source page 16
- Q30–Q31: source page 17
- Q32–Q33: source page 18

Explanation pages are mapped independently from pages 2–16 of the official answer-explanation PDF.

## Structured reconstruction

Reading text is reconstructed from the verified official source PDF at runtime rather than duplicating the passages in repository source.

Each question has an individually verified source crop. The reconstruction pipeline:

- reads only the verified crop for the selected Practice Test 7 question
- removes question numbers and page-only decorations
- removes known visual regions before reconstructing prose
- preserves paragraph breaks
- preserves the A–D choice sequence
- preserves left-to-right reading order for Q13–Q16, which span both source columns
- caches the structured result locally in the browser

The 33 verified crops were checked against the supplied source. QA confirmed all four answer choices are recovered for every question and adjacent question content is excluded.

## Source visuals

Only genuinely visual content remains source-backed:

- Q12 — participant-factor bar graph
- Q15 — ULE attribution graph
- Q16 — China imports graph

The graphs are displayed in source reading order before the reconstructed text. Their graph crops were checked to exclude unrelated passage/choice text while retaining axes, labels, legends, and plotted data.

## Full-width source questions

Q13–Q16 span both source columns. The extraction pipeline explicitly reads the left column before the right column for these questions instead of sorting both columns together by vertical position.

## Final-page handling

Q32 and Q33 use tightened source crops so the module-level STOP instruction and footer are not included in either question.

## Answer validation

The official scoring guide was used as the authority for all 33 answers.

All Module 1 questions are multiple-choice. The complete answer mapping is stored under the Practice Test 7 ID and is isolated from the other practice tests.

The answer-explanation PDF was cross-checked for question identity and explanation-page mapping.

## Source delivery

Practice Test 7 is supported by the `sat-question-source` Supabase Edge Function, so the original-source pane and runtime structured reconstruction can load the official question PDF without requiring a manual local upload.

## Regression coverage

Automated coverage now protects:

- exactly 33 Reading & Writing Module 1 questions
- practice-test-scoped IDs
- source-page mapping
- explanation-page mapping
- official answers
- multiple-choice response type
- verified source-crop bounds
- Practice Test 7 crop routing in the extraction pipeline
- Q12, Q15, and Q16 as the only visual questions
- Q13–Q16 full-width source geometry
- Q32/Q33 crops excluding the STOP area
- structured `text` mode for the module
