# Practice Test 5 — Math Module 1 Parsing Audit

Source reviewed: uploaded Practice Test 5 question PDF.

Scope: Math Module 1, questions 1–27.

## Summary

- Source-page metadata for Math Module 1 is correct: Q1–3 p34, Q4–7 p35, Q8–11 p36, Q12–15 p37, Q16 p38, Q17–20 p39, Q21–24 p40, Q25–27 p41.
- Practice Test 5 does not currently have verified structured question rows in the shared question bank.
- The current Test 5 path therefore uses image fallback rather than Practice-Test-4-style structured reconstruction.
- The dynamic crop algorithm is unsafe because it treats arbitrary standalone one- or two-digit text as a possible next-question marker.
- This breaks questions containing graph-axis numbers, table values, fractions, exponents, side lengths, and other ordinary numeric content.
- Q16 also spans essentially the full page and cannot be represented correctly by the current fixed half-column crop strategy.

## Question-by-question audit

| Q | Source page | Source structure | Expected implementation | Current automatic source crop | Audit result |
|---|---:|---|---|---|---|
| 1 | 34 | graph + stem + MC choices | structured stem/choices + graph crop before text | stops at graph tick label 9 | FAIL |
| 2 | 34 | text-only MC | structured text | question marker is confused with graph tick label 2 from Q1 | FAIL |
| 3 | 34 | graph + stem + MC choices | structured stem/choices + graph crop before text | stops at graph tick label | FAIL |
| 4 | 35 | displayed system + MC choices | LaTeX system + structured choices | source crop boundary appears usable | NOT PARSED |
| 5 | 35 | data table + stem + MC choices | semantic table + structured text | stops at table value 16 | FAIL |
| 6 | 35 | graph + student-produced stem | structured stem + graph crop before text | stops at graph tick label | FAIL |
| 7 | 35 | numeric list + student-produced stem | structured text | source crop boundary appears usable | NOT PARSED |
| 8 | 36 | geometry diagram + note + MC choices | diagram crop + structured note/stem/choices | source crop boundary appears usable | NOT PARSED |
| 9 | 36 | word problem + equation + MC choices | structured text/LaTeX | source crop boundary appears usable | NOT PARSED |
| 10 | 36 | text-only statistics MC | structured text | source crop boundary appears usable | NOT PARSED |
| 11 | 36 | equation + MC choices | structured LaTeX/text | stops at numeric term in equation | FAIL |
| 12 | 37 | inequality word problem + MC choices | structured text + verified inequality LaTeX | source crop boundary appears usable; PDF extraction order for inequalities is unsafe | NOT PARSED |
| 13 | 37 | displayed system with exponent + student-produced stem | aligned LaTeX system + structured stem | stops at exponent 2 | FAIL |
| 14 | 37 | contextual equation + student-produced stem | structured text/LaTeX | source crop boundary appears usable | NOT PARSED |
| 15 | 37 | cylinder word problem + π MC choices | structured text/LaTeX | source crop boundary appears usable | NOT PARSED |
| 16 | 38 | source graph + stem + four graphical choices | multi-visual question support; structured stem; source/choice graph regions | stops at graph tick label and fixed half-column crop cannot cover full-page layout | FAIL — HIGH COMPLEXITY |
| 17 | 39 | ratio text + fractional MC choices | structured text + LaTeX fractions | stops at fraction value 26 | FAIL |
| 18 | 39 | contextual linear equation + MC choices | structured text/LaTeX | source crop boundary appears usable | NOT PARSED |
| 19 | 39 | trigonometric expression + radical/fraction MC choices | verified LaTeX throughout | stops at numeric term 92 in expression | FAIL |
| 20 | 39 | triangle diagram + student-produced stem | triangle crop + structured note/stem | stops at side length 11 | FAIL |
| 21 | 40 | factored function + student-produced stem | structured text/LaTeX | source crop boundary appears usable | NOT PARSED |
| 22 | 40 | circle equation + MC choices | display LaTeX + structured choices | stops at exponent 2 | FAIL |
| 23 | 40 | prism word problem + function MC choices | structured text/LaTeX | source crop boundary appears usable | NOT PARSED |
| 24 | 40 | two exponential functions + Roman numerals + MC choices | verified LaTeX + structured Roman-numeral layout | stops at numeric/exponent content | FAIL |
| 25 | 41 | percent word problem + MC choices | structured text | source crop boundary appears usable | NOT PARSED |
| 26 | 41 | quadratic function + roots + MC choices | structured text/LaTeX | stops at exponent 2 | FAIL |
| 27 | 41 | polynomial with repeated factor + student-produced stem | structured text/LaTeX | stops at exponent 2 | FAIL |

## Visual requirements

Questions requiring source visuals:

- Q1 — graph
- Q3 — graph
- Q6 — graph
- Q8 — geometry diagram
- Q16 — multiple graphs / graphical answer choices
- Q20 — triangle diagram

Q5 contains a data table and should use a semantic table, not an image.

Q16 requires either multiple visual regions or a documented special visual layout. The existing single visual-crop model is insufficient if we want the text stem to remain structured while preserving both the prompt graph and graphical answer choices in source order.

## Math expressions requiring manual verification

The following are especially unsafe to accept from raw PDF text extraction without manual verification:

- Q3 — fractional y-intercept choice
- Q4 — system of equations
- Q11 — signed equation
- Q12 — chained inequalities
- Q13 — system containing x²
- Q15 — π expressions
- Q17 — fractional answer choices
- Q19 — trigonometric argument, radicals, and fractions
- Q20 — trigonometric notation and degree mark
- Q21 — factored function
- Q22 — circle equation with exponents
- Q23 — function products
- Q24 — exponential functions and Roman-numeral structure
- Q26 — quadratic expression
- Q27 — polynomial with repeated factor

## Recommended repair sequence

1. Stop using dynamic numeric-token crop detection for this module.
2. Create verified question regions for Q1–Q27.
3. Add verified structured Math content for every question.
4. Add explicit visual specifications for Q1, Q3, Q6, Q8, Q20.
5. Add multi-visual support for Q16 before marking it verified.
6. Render Q5 as a semantic data table.
7. Verify answer/response metadata against the official scoring guide.
8. Review every repaired question side-by-side with the original PDF before setting `content_status='verified'`.
