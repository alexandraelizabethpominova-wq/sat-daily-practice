# Practice Test 7 — Math Module 1 Parsing Audit

Source package reviewed:

- Practice Test 7 question PDF
- Practice Test 7 scoring / answer-key PDF
- Practice Test 7 answer-explanation PDF
- practice-test ID: `practice-test-7`

Scope: Math Module 1, questions 1–27.

## Completion status

Math Module 1 is complete.

Every question was reviewed individually against the official source and marked
`verified` only after checking wording, mathematical notation, answer metadata,
source crop, and visual requirements.

## Source-page mapping

- Q1–Q4: source page 34
- Q5–Q8: source page 35
- Q9–Q11: source page 36
- Q12–Q17: source page 37
- Q18–Q21: source page 38
- Q22–Q25: source page 39
- Q26–Q27: source page 40

Explanation pages are mapped independently from pages 31–38 of the official
answer-explanation PDF.

## Structured reconstruction

All 27 questions use verified structured text.

Math expressions were manually checked rather than accepted blindly from PDF
text extraction, including:

- absolute value and fractional answer choices
- factored polynomial expressions
- function notation and fractions
- systems of equations
- circle equations with exponents
- exponential functions with shifted exponents
- rational equations
- radicals
- inequalities
- trigonometric expressions
- the quadratic minimum question

Q24 is represented as a semantic table rather than a source image.

## Source visuals

Only genuinely visual content remains source-backed:

- Q1 — scatterplot and line of best fit
- Q5 — bar graph
- Q8 — value-over-time graph
- Q11 — absolute-value/linear-system graph
- Q20 — temperature scatterplot

The graph crops were reviewed to keep axes, labels, and plotted data while
excluding duplicated question text and adjacent questions. Their placement
matches the source reading order.

## Answer validation

The official scoring guide was used as the authority for answer metadata.

Student-produced response questions are:

- Q6
- Q7
- Q13
- Q14
- Q20
- Q21
- Q27

All explicitly listed accepted forms are stored. In particular:

- Q7 preserves all three accepted x-intercepts.
- Q27 preserves both the fractional and decimal forms.

Multiple-choice answers were cross-checked against the corresponding official
answer explanations.

## Source isolation

All IDs, source crops, answer metadata, PDF cache identity, and Supabase rows are
scoped to `practice-test-7`. No Practice Test 4, 5, or 6 content is used as a
fallback.

## Regression coverage

The module tests verify:

- exactly 27 Math Module 1 questions
- practice-test-scoped IDs
- source-page and explanation-page mapping
- official answer and response metadata
- accepted student-produced forms
- verified source-crop bounds
- structured `text` mode for every question
- only Q1, Q5, Q8, Q11, and Q20 use source visuals
- Q24 remains a semantic table
- representative complex math notation remains structured
