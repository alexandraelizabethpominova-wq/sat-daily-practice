export type VerifiedPracticeTest6Math2Content={lines:string[];needsVisual?:boolean}
const q=(lines:string[],needsVisual=false):VerifiedPracticeTest6Math2Content=>({lines,needsVisual})

export const VERIFIED_PRACTICE_TEST_6_MATH2:Record<number,VerifiedPracticeTest6Math2Content>={
  1:q(["The function $f$ is defined by $f(x)=8x$. For what value of $x$ does $f(x)=72$?","A) $8$","B) $9$","C) $64$","D) $80$"]),  2:q(["In the figure, two lines intersect at a point. Angle 1 and angle 2 are vertical angles. The measure of angle 1 is $72^\\circ$. What is the measure of angle 2?","A) $72^\\circ$","B) $108^\\circ$","C) $144^\\circ$","D) $288^\\circ$"],true),  3:q(["On a street with 7 houses, 2 houses are blue. If a house from this street is selected at random, what is the probability of selecting a house that is blue?","A) $\\frac{1}{7}$","B) $\\frac{2}{7}$","C) $\\frac{5}{7}$","D) $\\frac{7}{7}$"]),  4:q(["The graph of function $f$ is shown, where $y=f(x)$.","Which of the following describes function $f$?","A) Increasing linear","B) Decreasing linear","C) Increasing exponential","D) Decreasing exponential"],true),  5:q(["The graph of the function $f$ is shown, where $y=f(x)$. What is the $y$-intercept of the graph?","A) $(0,-1)$","B) $(0,-4)$","C) $(0,1)$","D) $(0,4)$"],true),
}

export function verifiedPracticeTest6Math2Content(questionNumber:number){return VERIFIED_PRACTICE_TEST_6_MATH2[questionNumber]}
