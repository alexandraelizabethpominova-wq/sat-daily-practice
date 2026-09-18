export type VerifiedPracticeTest6MathContent={lines:string[];needsVisual?:boolean}
const q=(lines:string[],needsVisual=false):VerifiedPracticeTest6MathContent=>({lines,needsVisual})

export const VERIFIED_PRACTICE_TEST_6_MATH1:Record<number,VerifiedPracticeTest6MathContent>={  1:q([
    '$(p+3)+8=10$',
    'What value of $p$ is the solution to the given equation?',
    'A) $-1(questionNumber:number){return VERIFIED_PRACTICE_TEST_6_MATH1[questionNumber]}
,
    'B) $5(questionNumber:number){return VERIFIED_PRACTICE_TEST_6_MATH1[questionNumber]}
,
    'C) $15(questionNumber:number){return VERIFIED_PRACTICE_TEST_6_MATH1[questionNumber]}
,
    'D) $21(questionNumber:number){return VERIFIED_PRACTICE_TEST_6_MATH1[questionNumber]}
,
  ]),  2:q([
    'The scatterplot shows the relationship between two variables, $x$ and $y$.',
    'Which of the following graphs shows the most appropriate model for the data?',
    'A)',
    'B)',
    'C)',
    'D)',
  ],true),  3:q([
    '$k^2-53=91$',
    'What is the positive solution to the given equation?',
    'A) $144(questionNumber:number){return VERIFIED_PRACTICE_TEST_6_MATH1[questionNumber]}
,
    'B) $72(questionNumber:number){return VERIFIED_PRACTICE_TEST_6_MATH1[questionNumber]}
,
    'C) $38(questionNumber:number){return VERIFIED_PRACTICE_TEST_6_MATH1[questionNumber]}
,
    'D) $12(questionNumber:number){return VERIFIED_PRACTICE_TEST_6_MATH1[questionNumber]}
,
  ]),
}

export function verifiedPracticeTest6Math1Content(questionNumber:number){return VERIFIED_PRACTICE_TEST_6_MATH1[questionNumber]}
