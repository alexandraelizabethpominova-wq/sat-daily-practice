export type VerifiedPracticeTest6MathContent={lines:string[];needsVisual?:boolean}
const q=(lines:string[],needsVisual=false):VerifiedPracticeTest6MathContent=>({lines,needsVisual})

export const VERIFIED_PRACTICE_TEST_6_MATH1:Record<number,VerifiedPracticeTest6MathContent>={
}

export function verifiedPracticeTest6Math1Content(questionNumber:number){return VERIFIED_PRACTICE_TEST_6_MATH1[questionNumber]}
