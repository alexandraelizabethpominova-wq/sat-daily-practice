# SAT Practice Test Parsing Standards

This document defines the required import, reconstruction, visual, explanation, and QA standards for every SAT practice set added to the application.

Practice Test 4 is the current reference implementation. A new practice set is not considered ready merely because its question metadata and answer key are present. Every question must pass the verification checklist below before the set is marked ready for normal practice.

## 1. Source identity and isolation

Each practice set must be treated as a fully independent source package.

A source package consists of:

- question PDF
- answer/explanation PDF
- scoring/answer-key PDF
- practice-test ID
- source file version/hash when available

Question identity is scoped by practice test, module, and question number. Cached PDFs, rendered crops, parsed text, attempts, parsing reports, and source-image caches must include the practice-test ID in their key.

Never fall back from one practice test to another practice test's question text, source PDF, visual crop, answer, or explanation.

An unverified or unavailable question must show an explicit unavailable/unverified state rather than content from another practice test.

## 2. Official source is the authority

The supplied practice-test PDF is the authority for:

- wording
- punctuation
- paragraph boundaries
- equations and symbols
- answer-choice ordering
- tables
- graphs and diagrams
- visual placement
- question number and module placement

The scoring PDF is the authority for:

- correct answer
- accepted student-produced responses
- response type

The answer/explanation PDF is the authority for the explanation view.

Do not silently repair or rewrite official wording during import.

## 3. Question reconstruction

Questions should be reconstructed as structured content whenever practical.

### Text

Use semantic text rather than an image of the full question.

Preserve:

- paragraph order
- paragraph breaks that affect meaning
- answer-choice order
- quotation structure
- Reading & Writing passage/stem separation
- Math stem/equation/choice order

Remove page-only decorations such as:

- module banners
- page numbers
- CONTINUE / STOP
- copyright/footer text
- column dividers
- question-number header bars

### Math

Math expressions should use LaTeX/KaTeX-compatible text when possible.

Preserve exactly:

- exponents
- fractions
- radicals
- inequalities
- absolute value
- degree symbols
- π
- coordinate pairs
- function notation
- systems of equations
- subscripts/superscripts
- grouping/parentheses

Do not accept PDF text extraction when mathematical reading order is visibly wrong. Manually verify and normalize those expressions.

### Tables

Tables must be represented with semantic table markup whenever the data can be represented faithfully.

Do not use a raster image for a normal data table simply because the source PDF contains one.

Verify:

- header labels
- row labels
- values
- column order
- alignment relevant to interpretation

## 4. Visual questions

Images are reserved for content that is genuinely visual, including:

- graphs
- geometry diagrams
- scatterplots
- dot plots
- figures
- graphical answer choices

The source visual crop must contain the complete visual and its necessary labels while excluding unrelated question text, adjacent questions, page headers, page footers, and column dividers.

Visual placement must match the source question's reading order. A figure that appears before the stem in the official question must render before the stem.

If a question has multiple independent visual regions, support multiple visual regions rather than forcing a single crop to contain unrelated text.

A full-question image is a last-resort exception and must be explicitly documented during QA.

## 5. Crop detection requirements

Do not infer question boundaries from arbitrary standalone numbers.

Standalone numbers can be:

- graph tick labels
- table values
- equation constants
- fraction numerators/denominators
- side lengths
- answer values
- exponents

Question-boundary detection must be based on verified question-header geometry and page/column structure, not merely text matching a one- or two-digit number.

Every automatic crop must be visually verified before the question is marked ready.

## 6. Explanations

Explanations are not parsed into editable text.

Display the explanation as a crop of the original answer/explanation PDF.

The parsing-repair editor may edit:

- reconstructed question text
- question visual crop(s)
- question visual placement

It must not edit explanation text.

## 7. Answer and response validation

For every question verify against the official scoring guide:

- correct answer
- multiple-choice vs. student-produced response
- all accepted student-produced forms where supplied

Answer metadata must be scoped to the practice-test ID.

## 8. Required per-question QA

Every imported question must be reviewed individually.

For each question confirm:

1. correct practice-test ID
2. correct section and module
3. correct source page
4. correct question number
5. complete reconstructed wording
6. correct paragraph/layout semantics
7. exact math symbols and equation structure
8. complete answer choices in the correct order
9. correct response type
10. correct official answer
11. correct table reconstruction, when present
12. complete visual crop, when present
13. visual appears in the correct position
14. no adjacent question content appears
15. no page decorations appear
16. original-source comparison shows the same question
17. explanation crop corresponds to the same question
18. desktop and narrow layouts remain readable

A practice set should not be presented as fully parsed until every question has passed this checklist.

## 9. Import status

Recommended content states:

- `metadata`: identity/page/answer metadata exists, but question reconstruction is not verified
- `imported`: structured content was imported but has not completed manual QA
- `verified`: question passed the per-question QA checklist

Normal practice should prefer verified content. Metadata-only content should never masquerade as a verified text reconstruction.

## 10. Regression protection

Automated tests should protect at least:

- practice-test source isolation
- unique question IDs across sets
- page mapping
- response type
- correct answer metadata
- no cross-test PDF fallback
- crop cache keys include practice-test ID
- question-bank grouping/filtering
- verified-content precedence over automatic extraction

For questions with known complex visual/layout requirements, keep explicit regression fixtures.
