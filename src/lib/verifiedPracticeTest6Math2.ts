export type VerifiedPracticeTest6Math2Content={lines:string[];needsVisual?:boolean}
const q=(lines:string[],needsVisual=false):VerifiedPracticeTest6Math2Content=>({lines,needsVisual})

export const VERIFIED_PRACTICE_TEST_6_MATH2:Record<number,VerifiedPracticeTest6Math2Content>={
  1:q(["The function $f$ is defined by $f(x)=8x$. For what value of $x$ does $f(x)=72$?","A) $8$","B) $9$","C) $64$","D) $80$"]),  2:q(["In the figure, two lines intersect at a point. Angle 1 and angle 2 are vertical angles. The measure of angle 1 is $72^\\circ$. What is the measure of angle 2?","A) $72^\\circ$","B) $108^\\circ$","C) $144^\\circ$","D) $288^\\circ$"],true),
}

export function verifiedPracticeTest6Math2Content(questionNumber:number){return VERIFIED_PRACTICE_TEST_6_MATH2[questionNumber]}
