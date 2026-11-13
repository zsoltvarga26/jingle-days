import { day, puzzle, question, quote } from '../build'
import type { DayContent } from '../types'

/** 1–6. nap. Szabályok: docs/03-tartalom-utmutato.md. Az első válasz mindig a helyes. */
export const days01to06: DayContent[] = [
  day(
    1,
    [
      question(
        'hagyomany',
        [
          'Melyik országból terjedt el a feldíszített karácsonyfa szokása?',
          'Which country did the decorated Christmas tree tradition spread from?',
        ],
        [
          ['Németország', 'Germany'],
          ['Olaszország', 'Italy'],
          ['Finnország', 'Finland'],
          ['Spanyolország', 'Spain'],
        ],
      ),
      question(
        'film',
        [
          'Melyik filmben hagyják otthon véletlenül Kevin McCallistert?',
          'In which film is Kevin McCallister accidentally left at home?',
        ],
        [
          ['Reszkessetek, betörők!', 'Home Alone'],
          ['Igazából szerelem', 'Love Actually'],
          ['A Grincs', 'The Grinch'],
        ],
      ),
      question(
        'zene',
        [
          'Ki énekli az „All I Want for Christmas Is You” című dalt?',
          'Who sings “All I Want for Christmas Is You”?',
        ],
        [
          ['Mariah Carey', 'Mariah Carey'],
          ['Whitney Houston', 'Whitney Houston'],
          ['Céline Dion', 'Céline Dion'],
          ['Kylie Minogue', 'Kylie Minogue'],
        ],
      ),
    ],
    [
      puzzle(
        '❄️👸⛄',
        'film',
        { hu: ['Jégvarázs'], en: ['Frozen'] },
        ['2013-as Disney-animációs film', 'A 2013 Disney animated film'],
        ['Az egyik nővér jéggel varázsol', 'One of the sisters has ice powers'],
      ),
    ],
    quote(
      [
        'Szívemben tisztelni fogom a karácsonyt, és igyekszem egész évben megtartani.',
        'I will honour Christmas in my heart, and try to keep it all the year.',
      ],
      ['Charles Dickens', 'Charles Dickens'],
      ['Karácsonyi ének', 'A Christmas Carol'],
    ),
  ),

  day(
    2,
    [
      question(
        'etel',
        [
          'Melyik országból származik a panettone nevű karácsonyi kalács?',
          'Which country does the Christmas cake panettone come from?',
        ],
        [
          ['Olaszország', 'Italy'],
          ['Franciaország', 'France'],
          ['Spanyolország', 'Spain'],
          ['Ausztria', 'Austria'],
        ],
        ['A panettone Milánóból indult világhódító útjára.', 'Panettone set out to conquer the world from Milan.'],
      ),
      question(
        'zene',
        ['Melyik évben csendült fel először a Csendes éj?', 'In which year was Silent Night first performed?'],
        [
          ['1818', '1818'],
          ['1718', '1718'],
          ['1918', '1918'],
        ],
        [
          'Az ausztriai Oberndorf templomában adták elő, gitárkísérettel.',
          'It was first sung in the church of Oberndorf, Austria, accompanied by a guitar.',
        ],
      ),
      question(
        'erdekesseg',
        [
          'Hány rénszarvas húzza a Mikulás szánját Clement C. Moore 1823-as versében?',
          'How many reindeer pull Santa’s sleigh in Clement C. Moore’s 1823 poem?',
        ],
        [
          ['8', '8'],
          ['6', '6'],
          ['9', '9'],
          ['12', '12'],
        ],
        [
          'Rudolf, a kilencedik, csak 1939-ben csatlakozott a csapathoz.',
          'Rudolph, the ninth, only joined the team in 1939.',
        ],
      ),
    ],
    [
      puzzle(
        '❄️⚪⚪🥕',
        'szo',
        { hu: ['hóember'], en: ['snowman'] },
        ['Télen áll az udvaron, tavasszal eltűnik', 'Stands in the garden in winter, gone by spring'],
        ['Hóból gyúrják, répa az orra', 'Rolled from white flakes, with a carrot for a nose'],
      ),
    ],
    quote([
      'A karácsony nem a fa alatt kezdődik, hanem ott, ahol valaki gondol a másikra.',
      'Christmas does not begin under the tree, but wherever someone thinks of another.',
    ]),
  ),

  day(
    3,
    [
      question(
        'hagyomany',
        [
          'Hány gyertya van a hagyományos adventi koszorún?',
          'How many candles are there on a traditional Advent wreath?',
        ],
        [
          ['4', '4'],
          ['3', '3'],
          ['5', '5'],
          ['6', '6'],
        ],
        [
          'Advent négy vasárnapján egyre több ég belőlük.',
          'One more is lit on each of the four Sundays of Advent.',
        ],
      ),
      question(
        'film',
        [
          'Melyik filmsorozat hősei töltik a karácsonyt a Roxfort varázslóiskolában?',
          'In which film series do the heroes spend Christmas at Hogwarts?',
        ],
        [
          ['Harry Potter', 'Harry Potter'],
          ['A Gyűrűk Ura', 'The Lord of the Rings'],
          ['Csillagok háborúja', 'Star Wars'],
        ],
      ),
      question(
        'etel',
        [
          'Mivel töltik hagyományosan a bejglit?',
          'What is bejgli, the Hungarian Christmas roll, traditionally filled with?',
        ],
        [
          ['Dióval vagy mákkal', 'Walnuts or poppy seeds'],
          ['Almával és fahéjjal', 'Apple and cinnamon'],
          ['Túróval és mazsolával', 'Curd cheese and raisins'],
        ],
      ),
    ],
    [
      puzzle(
        '📅⬅️🎄💔',
        'dal',
        { hu: ['Last Christmas', 'Múlt karácsony'], en: ['Last Christmas'] },
        ['1984-es brit popsláger', 'A British pop hit from 1984'],
        [
          'A Wham! adta elő: tavaly valaki a szívét adta oda',
          'Sung by Wham!: a year ago someone gave their heart away',
        ],
      ),
    ],
    quote([
      'Az első gyertya lángja kicsi, de már tudja, hogy nem marad egyedül.',
      'The first candle’s flame is small, yet it already knows it will not stay alone.',
    ]),
  ),

  day(
    4,
    [
      question(
        'zene',
        [
          'Melyik svéd együttes énekli a „Happy New Year” című dalt?',
          'Which Swedish band sings “Happy New Year”?',
        ],
        [
          ['ABBA', 'ABBA'],
          ['Roxette', 'Roxette'],
          ['Europe', 'Europe'],
          ['Ace of Base', 'Ace of Base'],
        ],
      ),
      question(
        'erdekesseg',
        [
          'Melyik országban esik a karácsony a nyár közepére?',
          'In which country does Christmas fall in the middle of summer?',
        ],
        [
          ['Ausztrália', 'Australia'],
          ['Kanada', 'Canada'],
          ['Norvégia', 'Norway'],
          ['Japán', 'Japan'],
        ],
        [
          'A déli féltekén decemberben van nyár, sokan a strandon ünnepelnek.',
          'December is summer in the southern hemisphere, and many people celebrate on the beach.',
        ],
      ),
      question(
        'hagyomany',
        [
          'Melyik napon bontják le hagyományosan a karácsonyfát?',
          'On which day is the Christmas tree traditionally taken down?',
        ],
        [
          ['Január 6-án, vízkeresztkor', '6 January, Epiphany'],
          ['December 26-án', '26 December'],
          ['Január 1-jén', '1 January'],
        ],
      ),
    ],
    [
      puzzle(
        '🍯🍪🏠',
        'szo',
        {
          hu: ['mézeskalács', 'mézeskalács házikó', 'mézeskalácsház'],
          en: ['gingerbread', 'gingerbread house', 'gingerbread man'],
        },
        ['Fűszeres, barna karácsonyi sütemény', 'A spiced brown Christmas biscuit'],
        ['Házikót és emberkét is formáznak belőle', 'Bakers shape it into houses and little men'],
      ),
    ],
    quote(
      ['Karácsony nem karácsony ajándékok nélkül.', 'Christmas won’t be Christmas without any presents.'],
      ['Louisa May Alcott', 'Louisa May Alcott'],
      ['Kisasszonyok', 'Little Women'],
    ),
  ),

  day(
    5,
    [
      question(
        'film',
        [
          'Melyik 2019-es animációs film meséli el egy postás és egy játékkészítő barátságán át a Mikulás történetét?',
          'Which 2019 animated film tells the story of Santa through the friendship of a postman and a toymaker?',
        ],
        [
          ['Klaus', 'Klaus'],
          ['Coco', 'Coco'],
          ['Lelki ismeretek', 'Soul'],
          ['Luca', 'Luca'],
        ],
      ),
      question(
        'etel',
        [
          'Melyik országban hagyományos karácsonyi desszert az aszalt gyümölcsös Christmas pudding?',
          'In which country is Christmas pudding, rich with dried fruit, a traditional festive dessert?',
        ],
        [
          ['Egyesült Királyság', 'United Kingdom'],
          ['Olaszország', 'Italy'],
          ['Görögország', 'Greece'],
          ['Svédország', 'Sweden'],
        ],
      ),
      question(
        'zene',
        [
          'Melyik ország népdalából született a „Carol of the Bells” dallama?',
          'Which country’s folk song gave us the melody of “Carol of the Bells”?',
        ],
        [
          ['Ukrajna', 'Ukraine'],
          ['Írország', 'Ireland'],
          ['Ausztria', 'Austria'],
          ['Lengyelország', 'Poland'],
        ],
        [
          'Mikola Leontovics „Scsedrik” című kórusműve 1916-ban hangzott el először.',
          'Mykola Leontovych’s choral piece “Shchedryk” was first performed in 1916.',
        ],
      ),
    ],
    [
      puzzle(
        '🚂❄️🎅🔔',
        'film',
        { hu: ['Polar Expressz'], en: ['The Polar Express'] },
        [
          '2004-es animációs film, Tom Hanks több szerepben',
          'A 2004 animated film with Tom Hanks in several roles',
        ],
        [
          'Egy kisfiú szenteste vonatra száll az Északi-sark felé',
          'A boy boards a train to the North Pole on Christmas Eve',
        ],
      ),
    ],
    quote([
      'A legjobb mese az, amelyiket valaki a kedvedért olvas fel.',
      'The best story is the one somebody reads aloud just for you.',
    ]),
  ),

  day(
    6,
    [
      question(
        'hagyomany',
        [
          'Mit tesznek ki a magyar gyerekek az ablakba december 5-én este?',
          'What do Hungarian children put in the window on the evening of 5 December?',
        ],
        [
          ['Kitisztított csizmát', 'Polished boots'],
          ['Gyapjúzoknit', 'A woollen stocking'],
          ['Szalmakalapot', 'A straw hat'],
          ['Fonott kosarat', 'A wicker basket'],
        ],
      ),
      question(
        'erdekesseg',
        [
          'Melyik mai ország területén élt Szent Miklós püspök, a Mikulás alakjának ihletője?',
          'In which present-day country did Saint Nicholas, the bishop who inspired Santa Claus, live?',
        ],
        [
          ['Törökország', 'Turkey'],
          ['Finnország', 'Finland'],
          ['Olaszország', 'Italy'],
          ['Görögország', 'Greece'],
        ],
        ['Müra városának püspöke volt a 4. században.', 'He was bishop of the city of Myra in the 4th century.'],
      ),
      question(
        'film',
        [
          'Ki játssza a Télapu (1994) főhősét, aki véletlenül maga lesz a Mikulás?',
          'Who plays the man who accidentally becomes Santa in The Santa Clause (1994)?',
        ],
        [
          ['Tim Allen', 'Tim Allen'],
          ['Tom Hanks', 'Tom Hanks'],
          ['Robin Williams', 'Robin Williams'],
          ['Steve Martin', 'Steve Martin'],
        ],
      ),
    ],
    [
      puzzle(
        '🌲⭐🎁',
        'szo',
        { hu: ['karácsonyfa', 'fenyőfa'], en: ['Christmas tree'] },
        ['A nappali dísze decemberben', 'It decorates the living room in December'],
        ['Csillag kerül a csúcsára, ajándék alá', 'A star goes on top, presents go underneath'],
      ),
    ],
    quote([
      'Aki este kitisztítja a csizmáját, annak reggelre a szíve is fényesebb.',
      'Polish your boots in the evening, and your heart shines a little brighter by morning.',
    ]),
  ),
]
