# New Practice Test Import Checklist

Use this checklist with `PRACTICE_TEST_PARSING_STANDARDS.md` for every new SAT practice test.

## Source setup

- [ ] Unique practice-test ID registered
- [ ] Question PDF mapped to this test only
- [ ] Answer/explanation PDF mapped to this test only
- [ ] Scoring source mapped to this test only
- [ ] No cross-test fallback paths

## Per module

- [ ] Question/page boundaries verified
- [ ] Answer and response type imported
- [ ] Every question classified: text / table / figure / multi-visual / graphical choices
- [ ] Text reconstructed semantically
- [ ] Math lint clean
- [ ] Tables reconstructed semantically
- [ ] All visual regions registered independently
- [ ] Graphical choices use `choice-grid`
- [ ] Visual regions excluded from text extraction
- [ ] Production-renderer preview compared with source

## Per question

- [ ] Wording and punctuation match
- [ ] Paragraphs/lines preserve meaning
- [ ] Choices are complete and ordered
- [ ] Math meaning matches rendered source
- [ ] Bullets/underline/table structure matches
- [ ] Visual crops include all meaningful labels
- [ ] No adjacent content in crops
- [ ] Visual placement matches reading order
- [ ] Official answer matches scoring guide
- [ ] Explanation corresponds to the same question
- [ ] Desktop/narrow rendering is readable
- [ ] Shared repair, if any, survives Supabase save + reload

## Release gate

- [ ] No metadata-only question presented as verified
- [ ] No unresolved high-severity parsing reports
- [ ] Import summary reviewed by module
- [ ] Complex cases have regression fixtures
- [ ] Unit tests pass
- [ ] Production build passes
- [ ] Only then mark the test ready for normal practice
