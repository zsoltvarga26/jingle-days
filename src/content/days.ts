import { ornaments } from './ornaments'
import type { DayContent } from './types'

/**
 * A 24 nap kétnyelvű tartalma. Szabályok: docs/03-tartalom-utmutato.md.
 *
 * A megírt napok az `authored` listában vannak; a többi nap ideiglenes helykitöltőt kap
 * (`draft: true`), hogy fejlesztés közben minden ajtó kipróbálható legyen.
 * A fájlban a helyes válasz nyugodtan lehet mindig az első: a megjelenítés keveri.
 */
const authored: DayContent[] = [
  {
    day: 1,
    quiz: [
      {
        id: 'd01-q1',
        category: 'hagyomany',
        question: {
          hu: 'Melyik országból terjedt el a feldíszített karácsonyfa szokása?',
          en: 'Which country did the decorated Christmas tree tradition spread from?',
        },
        options: [
          { hu: 'Németország', en: 'Germany' },
          { hu: 'Olaszország', en: 'Italy' },
          { hu: 'Finnország', en: 'Finland' },
          { hu: 'Spanyolország', en: 'Spain' },
        ],
        correctIndex: 0,
      },
      {
        id: 'd01-q2',
        category: 'film',
        question: {
          hu: 'Melyik filmben hagyják otthon véletlenül Kevin McCallistert?',
          en: 'In which film is Kevin McCallister accidentally left at home?',
        },
        options: [
          { hu: 'Reszkessetek, betörők!', en: 'Home Alone' },
          { hu: 'Igazából szerelem', en: 'Love Actually' },
          { hu: 'A Grincs', en: 'The Grinch' },
        ],
        correctIndex: 0,
      },
      {
        id: 'd01-q3',
        category: 'zene',
        question: {
          hu: 'Ki énekli az „All I Want for Christmas Is You” című dalt?',
          en: 'Who sings “All I Want for Christmas Is You”?',
        },
        options: [
          { hu: 'Mariah Carey', en: 'Mariah Carey' },
          { hu: 'Whitney Houston', en: 'Whitney Houston' },
          { hu: 'Céline Dion', en: 'Céline Dion' },
          { hu: 'Kylie Minogue', en: 'Kylie Minogue' },
        ],
        correctIndex: 0,
      },
    ],
    emoji: [
      {
        id: 'd01-e1',
        emojis: '❄️👸⛄',
        kind: 'film',
        answers: { hu: ['Jégvarázs'], en: ['Frozen'] },
        hints: [
          { hu: '2013-as Disney-animációs film', en: 'A 2013 Disney animated film' },
          { hu: 'Az egyik nővér jéggel varázsol', en: 'One of the sisters has ice powers' },
        ],
      },
    ],
    quote: {
      text: {
        hu: 'Szívemben tisztelni fogom a karácsonyt, és igyekszem egész évben megtartani.',
        en: 'I will honour Christmas in my heart, and try to keep it all the year.',
      },
      author: { hu: 'Charles Dickens', en: 'Charles Dickens' },
      source: { hu: 'Karácsonyi ének', en: 'A Christmas Carol' },
    },
    ornament: ornaments[1],
  },
  {
    day: 2,
    quiz: [
      {
        id: 'd02-q1',
        category: 'etel',
        question: {
          hu: 'Melyik országból származik a panettone nevű karácsonyi kalács?',
          en: 'Which country does the Christmas cake panettone come from?',
        },
        options: [
          { hu: 'Olaszország', en: 'Italy' },
          { hu: 'Franciaország', en: 'France' },
          { hu: 'Spanyolország', en: 'Spain' },
          { hu: 'Ausztria', en: 'Austria' },
        ],
        correctIndex: 0,
        explanation: {
          hu: 'A panettone Milánóból indult világhódító útjára.',
          en: 'Panettone set out to conquer the world from Milan.',
        },
      },
      {
        id: 'd02-q2',
        category: 'zene',
        question: {
          hu: 'Melyik évben csendült fel először a Csendes éj?',
          en: 'In which year was Silent Night first performed?',
        },
        options: [
          { hu: '1818', en: '1818' },
          { hu: '1718', en: '1718' },
          { hu: '1918', en: '1918' },
        ],
        correctIndex: 0,
        explanation: {
          hu: 'Az ausztriai Oberndorf templomában adták elő, gitárkísérettel.',
          en: 'It was first sung in the church of Oberndorf, Austria, accompanied by a guitar.',
        },
      },
      {
        id: 'd02-q3',
        category: 'erdekesseg',
        question: {
          hu: 'Hány rénszarvas húzza a Mikulás szánját Clement C. Moore 1823-as versében?',
          en: 'How many reindeer pull Santa’s sleigh in Clement C. Moore’s 1823 poem?',
        },
        options: [
          { hu: '8', en: '8' },
          { hu: '6', en: '6' },
          { hu: '9', en: '9' },
          { hu: '12', en: '12' },
        ],
        correctIndex: 0,
        explanation: {
          hu: 'Rudolf, a kilencedik, csak 1939-ben csatlakozott a csapathoz.',
          en: 'Rudolph, the ninth, only joined the team in 1939.',
        },
      },
    ],
    emoji: [
      {
        id: 'd02-e1',
        emojis: '❄️⚪⚪🥕',
        kind: 'szo',
        answers: { hu: ['hóember'], en: ['snowman'] },
        hints: [
          { hu: 'Télen áll az udvaron, tavasszal eltűnik', en: 'Stands in the garden in winter, gone by spring' },
          { hu: 'Hóból gyúrják, répa az orra', en: 'Rolled from white flakes, with a carrot for a nose' },
        ],
      },
    ],
    quote: {
      text: {
        hu: 'A karácsony nem a fa alatt kezdődik, hanem ott, ahol valaki gondol a másikra.',
        en: 'Christmas does not begin under the tree, but wherever someone thinks of another.',
      },
    },
    ornament: ornaments[2],
  },
  {
    day: 24,
    quiz: [
      {
        id: 'd24-q1',
        category: 'hagyomany',
        question: {
          hu: 'A magyar hagyomány szerint ki hozza az ajándékokat szenteste?',
          en: 'In Hungarian tradition, who brings the presents on Christmas Eve?',
        },
        options: [
          { hu: 'A Jézuska', en: 'The Baby Jesus' },
          { hu: 'A Mikulás', en: 'Santa Claus' },
          { hu: 'A háromkirályok', en: 'The Three Kings' },
        ],
        correctIndex: 0,
        explanation: {
          hu: 'A Mikulás nálunk már december 6-án megérkezik.',
          en: 'In Hungary, Santa already visits on 6 December.',
        },
      },
      {
        id: 'd24-q2',
        category: 'film',
        question: {
          hu: 'Melyik városban játszódik a Reszkessetek, betörők! második része?',
          en: 'In which city is the second Home Alone film set?',
        },
        options: [
          { hu: 'New York', en: 'New York' },
          { hu: 'Chicago', en: 'Chicago' },
          { hu: 'Párizs', en: 'Paris' },
          { hu: 'Los Angeles', en: 'Los Angeles' },
        ],
        correctIndex: 0,
      },
      {
        id: 'd24-q3',
        category: 'zene',
        question: {
          hu: 'Ki írta A diótörő című balett zenéjét?',
          en: 'Who composed the music for the ballet The Nutcracker?',
        },
        options: [
          { hu: 'Csajkovszkij', en: 'Tchaikovsky' },
          { hu: 'Mozart', en: 'Mozart' },
          { hu: 'Sztravinszkij', en: 'Stravinsky' },
          { hu: 'Prokofjev', en: 'Prokofiev' },
        ],
        correctIndex: 0,
      },
      {
        id: 'd24-q4',
        category: 'etel',
        question: {
          hu: 'Melyik halból készül hagyományosan a magyar karácsonyi halászlé?',
          en: 'Which fish is the traditional Hungarian Christmas fish soup made from?',
        },
        options: [
          { hu: 'Ponty', en: 'Carp' },
          { hu: 'Lazac', en: 'Salmon' },
          { hu: 'Tonhal', en: 'Tuna' },
          { hu: 'Pisztráng', en: 'Trout' },
        ],
        correctIndex: 0,
      },
      {
        id: 'd24-q5',
        category: 'erdekesseg',
        question: {
          hu: 'Melyik országban található Rovaniemi, a Mikulás „hivatalos” szülővárosa?',
          en: 'In which country is Rovaniemi, the “official” hometown of Santa Claus?',
        },
        options: [
          { hu: 'Finnország', en: 'Finland' },
          { hu: 'Norvégia', en: 'Norway' },
          { hu: 'Svédország', en: 'Sweden' },
          { hu: 'Izland', en: 'Iceland' },
        ],
        correctIndex: 0,
      },
    ],
    emoji: [
      {
        id: 'd24-e1',
        emojis: '💚😠🎄🎁',
        kind: 'film',
        answers: {
          hu: ['A Grincs', 'Hogyan lopta el a Grincs a karácsonyt'],
          en: ['The Grinch', 'How the Grinch Stole Christmas'],
        },
        hints: [
          { hu: 'Dr. Seuss meséjéből készült', en: 'Based on a Dr. Seuss story' },
          { hu: 'A zöld főhős el akarja lopni az ünnepet', en: 'The green hero wants to steal the holiday' },
        ],
      },
      {
        id: 'd24-e2',
        emojis: '🔔🔔🛷❄️',
        kind: 'dal',
        answers: { hu: ['Jingle Bells', 'Csengőszó'], en: ['Jingle Bells'] },
        hints: [
          { hu: '1857-ben írt amerikai dal', en: 'An American song written in 1857' },
          { hu: 'Egy lovas szánról szól a havas tájban', en: 'It is about a one-horse sleigh in the snow' },
        ],
      },
    ],
    quote: {
      text: {
        hu: 'A fa elkészült, a gyertyák égnek. A legszebb ajándék mégis az, hogy együtt vagyunk.',
        en: 'The tree is finished and the candles are lit. Still, the best gift is being together.',
      },
    },
    ornament: ornaments[24],
  },
]

/** Helykitöltő egy még meg nem írt naphoz; a szerkezete megegyezik a végleges tartaloméval. */
function placeholderDay(day: number): DayContent {
  const dd = String(day).padStart(2, '0')
  return {
    day,
    draft: true,
    quiz: [1, 2, 3].map((n) => ({
      id: `d${dd}-q${n}`,
      category: 'erdekesseg' as const,
      question: {
        hu: `Minta kérdés (${day}. nap, ${n} / 3) – a tartalom később készül el.`,
        en: `Sample question (day ${day}, ${n} of 3) – the content is still to come.`,
      },
      options: [
        { hu: 'Helyes mintaválasz', en: 'Correct sample answer' },
        { hu: 'Hibás mintaválasz', en: 'Wrong sample answer' },
        { hu: 'Másik hibás mintaválasz', en: 'Another wrong sample answer' },
      ],
      correctIndex: 0,
    })),
    emoji: [
      {
        id: `d${dd}-e1`,
        emojis: '🎄⭐🎁',
        kind: 'szo',
        answers: { hu: [`minta${day}`], en: [`sample${day}`] },
        hints: [
          { hu: 'Minta tipp: ez még helykitöltő', en: 'Sample hint: this is still a placeholder' },
          { hu: `Minta tipp: a megfejtés „minta${day}”`, en: `Sample hint: the answer is “sample${day}”` },
        ],
      },
    ],
    quote: {
      text: {
        hu: `Minta idézet a ${day}. naphoz – a tartalom később készül el.`,
        en: `Sample quote for day ${day} – the content is still to come.`,
      },
    },
    ornament: ornaments[day],
  }
}

const authoredByDay = new Map(authored.map((content) => [content.day, content]))

export const days: readonly DayContent[] = Array.from({ length: 24 }, (_, i) => {
  const day = i + 1
  return authoredByDay.get(day) ?? placeholderDay(day)
})

export function getDay(day: number): DayContent {
  const content = days[day - 1]
  if (!content) throw new Error(`Nincs ilyen nap: ${day}`)
  return content
}

export interface StepCounts {
  quiz: number
  emoji: number
}

/** A kérdések és rejtvények számát a tartalom tömbjeinek hossza adja, nem a nap száma. */
export function stepCounts(day: number): StepCounts {
  const content = getDay(day)
  return { quiz: content.quiz.length, emoji: content.emoji.length }
}
