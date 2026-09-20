# Practice Test 7 — Reading & Writing Module 2 Parsing Audit

Source package reviewed:

- Practice Test 7 question PDF
- Practice Test 7 scoring / answer-key PDF
- Practice Test 7 answer-explanation PDF
- practice-test ID: `practice-test-7`

Scope: Reading & Writing Module 2, questions 1–33.

## Completion status

Reading & Writing Module 2 is complete.

All 33 questions were checked individually against the supplied official source package before being marked `verified`.

## Source-page mapping

- Q1–Q2: source page 20
- Q3–Q6: source page 21
- Q7–Q8: source page 22
- Q9–Q10: source page 23
- Q11–Q12: source page 24
- Q13–Q15: source page 25
- Q16–Q17: source page 26
- Q18–Q21: source page 27
- Q22–Q25: source page 28
- Q26–Q28: source page 29
- Q29–Q31: source page 30
- Q32–Q33: source page 31

## Explanation-page mapping

- Q1–Q2: explanation page 17
- Q3–Q4: explanation page 18
- Q5–Q7: explanation page 19
- Q8–Q9: explanation page 20
- Q10–Q11: explanation page 21
- Q12–Q14: explanation page 22
- Q15–Q16: explanation page 23
- Q17: explanation page 24
- Q18–Q19: explanation page 25
- Q20–Q22: explanation page 26
- Q23–Q25: explanation page 27
- Q26–Q28: explanation page 28
- Q29–Q30: explanation page 29
- Q31–Q33: explanation page 30

## Structured reconstruction

Reading text is reconstructed from the verified official source PDF at runtime rather than duplicating the passages in repository source.

Every question has an individually scoped crop. The crops were checked against the source pages to ensure that:

- the full stimulus and stem are present
- all four answer choices are present
- adjacent questions are excluded
- page headers, footers, and column dividers are excluded
- Q32 and Q33 stop above the module-level STOP instructions

All questions remain in structured `text` mode.

## Semantic tables

Two questions contain source tables:

- Q12 — bus shelters with shade by highest average summer surface temperature
- Q13 — total areas and populations of the three smallest Arabian Peninsula countries

Both tables are encoded semantically in `readingTables.ts`. Their source table regions are removed from the text-extraction stream before prose reconstruction so the table is not duplicated or rasterized.

No question in Module 2 requires a raster figure fallback.

## Answer validation

The scoring guide was used as the authority for all 33 answers.

The official Module 2 answer sequence is stored under the Practice Test 7 ID, and each question remains a four-choice multiple-choice item.

The answer-explanation PDF was independently checked for question identity and explanation-page mapping.

## Source delivery

Practice Test 7 is supported by the `sat-question-source` Supabase Edge Function, so both the original-source pane and structured text reconstruction can load the official source PDF without a manual local upload.

## Regression coverage

Automated coverage protects:

- exactly 33 Reading & Writing Module 2 questions
- practice-test-scoped IDs
- source-page mapping
- explanation-page mapping
- official scoring answers
- verified source-crop bounds
- Practice Test 7 crop routing
- semantic Q12 and Q13 tables
- absence of raster visual fallbacks
- final-page crop boundaries above the STOP area
- structured `text` mode for the full module
