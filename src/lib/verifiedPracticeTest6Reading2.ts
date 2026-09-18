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
  ]),  2:q([
    'Whether Carmen Lomas Garza is creating small paintings and illustrations or large public artworks—such as Baile, a copper cutout of traditional Mexican dance in the San Francisco International Airport—she is _______ direct experience, drawing from memories of her childhood in Texas or details of her current surroundings in California.',
    'Which choice completes the text with the most logical and precise word or phrase?',
    'A) complimented by',
    'B) uncertain about',
    'C) unbothered by',
    'D) inspired by',
  ]),  3:q([
    'Animal researcher Amalia P.M. Bastos led a 2021 study about a wild kea parrot that used small stones as tools to preen its feathers. Skeptical colleagues had initially suggested to Bastos that the kea’s interactions with the stones might simply be _______ , but Bastos and her team showed that the kea was using the stones deliberately.',
    'Which choice completes the text with the most logical and precise word or phrase?',
    'A) intriguing',
    'B) obvious',
    'C) accidental',
    'D) observable',
  ]),  4:q([
    'In 1891, design artist William Morris cofounded the Kelmscott Press, which printed editions of books using preindustrial methods. Historians argue that Morris’s repudiation of industrialization is _______ the Kelmscott editions’ use of handmade materials and intricate ornamentation reminiscent of medieval manuscripts: these meticulously handcrafted elements exemplify the artistry involved.',
    'Which choice completes the text with the most logical and precise word or phrase?',
    'A) insensible to',
    'B) manifest in',
    'C) scrutinized by',
    'D) complicated by',
  ]),  5:q([
    'Mary Engle Pennington, a chemist who helped advance home refrigeration, undoubtedly made a substantial impact on society, but her place in our historical memory is perhaps more _______ than that of Stephanie Kwolek, who invented the incredibly strong material known as Kevlar, an accomplishment for which she will long be remembered.',
    'Which choice completes the text with the most logical and precise word or phrase?',
    'A) permanent',
    'B) tentative',
    'C) warranted',
    'D) prominent',
  ]),
}

export function verifiedPracticeTest6Reading2Content(questionNumber:number){return VERIFIED_PRACTICE_TEST_6_READING2[questionNumber]}
