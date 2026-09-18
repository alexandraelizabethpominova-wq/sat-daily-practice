export type VerifiedPracticeTest6Math2Content={lines:string[];needsVisual?:boolean}
const q=(lines:string[],needsVisual=false):VerifiedPracticeTest6Math2Content=>({lines,needsVisual})

export const VERIFIED_PRACTICE_TEST_6_MATH2:Record<number,VerifiedPracticeTest6Math2Content>={
  1:q(["The function $f$ is defined by $f(x)=8x$. For what value of $x$ does $f(x)=72$?","A) $8$","B) $9$","C) $64$","D) $80$"]),
}

export function verifiedPracticeTest6Math2Content(questionNumber:number){return VERIFIED_PRACTICE_TEST_6_MATH2[questionNumber]}
