# Practice Test 7 — Math Module 2 Parsing Audit

Source package reviewed:

- Practice Test 7 question PDF
- Practice Test 7 scoring / answer-key PDF
- Practice Test 7 answer-explanation PDF
- practice-test ID: `practice-test-7`

Scope: Math Module 2, questions 1–27.

## Completion status

Math Module 2 is complete.

Every question was reviewed individually against the supplied official source package before being marked `verified`.

## Source-page mapping

- Q1–Q4: source PDF page 44
- Q5–Q10: source PDF page 45
- Q11–Q13: source PDF page 46
- Q14–Q16: source PDF page 47
- Q17–Q21: source PDF page 48
- Q22–Q25: source PDF page 49
- Q26–Q27: source PDF page 50

Explanation pages are mapped independently:

- Q1–Q3: explanation page 39
- Q4–Q8: explanation page 40
- Q9–Q12: explanation page 41
- Q13–Q16: explanation page 42
- Q17–Q19: explanation page 43
- Q20–Q22: explanation page 44
- Q23–Q25: explanation page 45
- Q26–Q27: explanation page 46

## Structured reconstruction

All 27 questions use verified structured text.

Math notation was checked manually against the source, including:

- percentages and probability fractions
- polynomial expressions and factoring
- systems of equations
- exponential functions
- inequalities
- exponent rules
- square roots
- tangent notation
- circle equations
- unit conversion

Q16 and Q22 are semantic tables rather than raster images.

## Source visuals

Only genuinely visual content remains source-backed:

- Q3 — quadratic graph
- Q12 — scatterplot and line of best fit

Both visual crops were checked to include the complete axes, labels, plotted content, and relevant source artwork while excluding adjacent questions and page decorations. Their placement matches the source reading order.

## Source crops

Every question has an individually verified source crop. Crops were checked visually to ensure:

- the complete question is present
- all answer choices are present
- no adjacent question content is included
- no page footer or column divider is included
- formulas and table cells are not clipped

## Answer validation

The scoring guide was used as the authority for answer metadata.

Student-produced response questions are:

- Q6
- Q7
- Q13
- Q14
- Q20
- Q21
- Q27

All explicitly supplied accepted forms are retained. In particular:

- Q7 keeps both `11/4` and `2.75`.
- Q13 keeps both `4.41` and `441/100`.

Multiple-choice answers were cross-checked against the corresponding answer explanations.

## Source delivery

The `sat-question-source` Supabase Edge Function now includes Practice Test 7 question and answer PDF sources. The function is also tracked under `supabase/functions/` and the Supabase deployment workflow deploys it along with schema changes, preventing the frontend/source-proxy drift that initially caused the PS7 source pane to appear empty.

## Regression coverage

The module tests verify:

- exactly 27 Math Module 2 questions
- practice-test-scoped IDs
- source-page and explanation-page mappings
- official answers and response types
- accepted student-produced forms
- source-crop bounds
- structured `text` mode for every question
- only Q3 and Q12 use source visuals
- Q16 and Q22 remain semantic tables
- representative complex math notation remains structured
