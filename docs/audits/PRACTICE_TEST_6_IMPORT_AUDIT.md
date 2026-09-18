# Practice Test 6 import audit

## Scope

Practice Test 6 was added as an independent source package using the repository's
`PRACTICE_TEST_PARSING_STANDARDS.md` requirements.

Source package reviewed:

- Practice Test 6 question PDF
- Practice Test 6 scoring / answer-key PDF
- Practice Test 6 answer-explanation PDF
- practice-test ID: `practice-test-6`

The set contains 120 questions:

- Reading & Writing Module 1: 33
- Reading & Writing Module 2: 33
- Math Module 1: 27
- Math Module 2: 27

## Verification completed

For every question, the import records and checks:

- practice-test-scoped ID
- section and module
- official source page
- official explanation page
- response type
- official correct answer
- all explicitly listed student-produced accepted responses
- a source crop that contains the complete question and excludes adjacent questions
- a source crop that excludes module banners, page footers, CONTINUE/STOP, and unrelated content

All 106 multiple-choice answers were cross-checked against the corresponding
answer explanation. The 14 student-produced responses were checked against the
official scoring answer key.

All 120 source crops were visually reviewed as module contact sheets. Final-page
crops were capped above STOP/footer material.

## Rendering mode

Reading & Writing Module 1 has now completed the structured-content QA pass.
All 33 questions are stored as verified semantic text. Question 11's data table
is reconstructed semantically, and only questions 14 and 15 retain source-image
graph crops. The graph crops were individually checked against the source PDF.

Reading & Writing Module 2 and both Math modules remain in the verified
`image-fallback` state until their separate wording, symbol, table, and visual
QA passes are complete. Their verified source crops remain authoritative in the
meantime.

## Source isolation

Practice Test 6 never falls back to Practice Test 4 or Practice Test 5 content.
PDF cache keys, question IDs, source crops, answers, and explanation mappings are
all scoped to `practice-test-6`.

## Regression coverage

The Practice Test 6 regression test verifies:

- 120 total questions and expected per-module counts
- practice-test-scoped unique IDs
- page and answer-page mappings
- official answer metadata
- student-produced response positions and accepted forms
- verified source crop presence and page bounds
- verified reconstruction state by module
