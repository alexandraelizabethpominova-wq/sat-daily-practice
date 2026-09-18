export type VerifiedPracticeTest6ReadingContent={lines:string[];needsVisual?:boolean}
const q=(lines:string[],needsVisual=false):VerifiedPracticeTest6ReadingContent=>({lines,needsVisual})

export const VERIFIED_PRACTICE_TEST_6_READING2:Record<number,VerifiedPracticeTest6ReadingContent>={
  1:q([
    'The works of Chicana artist Ester Hernandez are now _______ in museums both in the United States and abroad, but the murals she contributed to as a member of Las Mujeres Muralistas early in her artistic career were displayed in outdoor public spaces across San Francisco.',
    'Which choice completes the text with the most logical and precise word or phrase?',
    'A) invented',
    'B) adjusted',
    'C) featured',
    'D) recommended',
  ]),
}

export function verifiedPracticeTest6Reading2Content(questionNumber:number){return VERIFIED_PRACTICE_TEST_6_READING2[questionNumber]}
