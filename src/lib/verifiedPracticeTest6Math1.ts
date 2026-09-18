export type VerifiedPracticeTest6MathContent={lines:string[];needsVisual?:boolean}
const q=(lines:string[],needsVisual=false):VerifiedPracticeTest6MathContent=>({lines,needsVisual})

export const VERIFIED_PRACTICE_TEST_6_MATH1:Record<number,VerifiedPracticeTest6MathContent>={
  1:q([
    '$$(p+3)+8=10$$',
    'What value of $p$ is the solution to the given equation?',
    'A) $-1$',
    'B) $5$',
    'C) $15$',
    'D) $21$',
  ]),
  2:q([
    'The scatterplot shows the relationship between two variables, $x$ and $y$.',
    'Which of the following graphs shows the most appropriate model for the data?',
  ],true),
  3:q([
    '$$k^2-53=91$$',
    'What is the positive solution to the given equation?',
    'A) $144$',
    'B) $72$',
    'C) $38$',
    'D) $12$',
  ]),
  4:q([
    'During a portion of a flight, a small airplane’s cruising speed varied between 150 miles per hour and 170 miles per hour. Which inequality best represents this situation, where $s$ is the cruising speed, in miles per hour, during this portion of the flight?',
    'A) $s\\le20$',
    'B) $s\\le150$',
    'C) $s\\le170$',
    'D) $150\\le s\\le170$',
  ]),
  5:q([
    'An object was launched upward from a platform. The graph shown models the height above ground, $y$, in meters, of the object $x$ seconds after it was launched. For which of the following intervals of time was the height of the object increasing for the entire interval?',
    'A) From $x=0$ to $x=2$',
    'B) From $x=0$ to $x=4$',
    'C) From $x=2$ to $x=3$',
    'D) From $x=3$ to $x=4$',
  ],true),
  6:q([
    'How many yards are equivalent to 1,116 inches? $(1\\text{ yard}=36\\text{ inches})$',
  ]),
  7:q([
    '$$f(x)=14+4x$$',
    'The function $f$ represents the total cost, in dollars, of attending an arcade when $x$ games are played. How many games can be played for a total cost of $58$?',
  ]),
  8:q([
    '$$f(x)=x+b$$',
    'For the linear function $f$, $b$ is a constant. When $x=0$, $f(x)=30$. What is the value of $b$?',
    'A) $-30$',
    'B) $-\\frac{1}{30}$',
    'C) $\\frac{1}{30}$',
    'D) $30$',
  ]),
  9:q([
    '$$P(t)=1{,}800(1.02)^t$$',
    'The function $P$ gives the estimated number of marine mammals in a certain area, where $t$ is the number of years since a study began. What is the best interpretation of $P(0)=1{,}800$ in this context?',
    'A) The estimated number of marine mammals in the area was 102 when the study began.',
    'B) The estimated number of marine mammals in the area was 1,800 when the study began.',
    'C) The estimated number of marine mammals in the area increased by 102 each year during the study.',
    'D) The estimated number of marine mammals in the area increased by 1,800 each year during the study.',
  ]),
  10:q([
    'A manager is responsible for ordering supplies for a shaved ice shop. The shop’s inventory starts with 4,500 paper cups, and the manager estimates that 70 of these paper cups are used each day. Based on this estimate, in how many days will the supply of paper cups reach 1,700?',
    'A) $20$',
    'B) $40$',
    'C) $60$',
    'D) $80$',
  ]),
}

export function verifiedPracticeTest6Math1Content(questionNumber:number){return VERIFIED_PRACTICE_TEST_6_MATH1[questionNumber]}
