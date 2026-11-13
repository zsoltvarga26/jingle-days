import { day, puzzle, question, quote } from '../build'
import type { DayContent } from '../types'

/**
 * 19–24. nap. Szabályok: docs/03-tartalom-utmutato.md. Az első válasz mindig a helyes.
 * A 24. nap különleges: 5 kérdés és 2 rejtvény.
 */
export const days19to24: DayContent[] = [
  day(
    19,
    [
      question(
        'zene',
        [
          'A „Mennyből az angyal” kezdetű ének szerint hová siessenek a pásztorok?',
          'In the Hungarian carol “Mennyből az angyal”, where are the shepherds told to hurry?',
        ],
        [
          ['Betlehembe', 'To Bethlehem'],
          ['Jeruzsálembe', 'To Jerusalem'],
          ['Názáretbe', 'To Nazareth'],
        ],
      ),
      question(
        'erdekesseg',
        [
          'Hogy hívják az Egyesült Királyságban december 26-át?',
          'What is 26 December called in the United Kingdom?',
        ],
        [
          ['Boxing Day', 'Boxing Day'],
          ['Bank Day', 'Bank Day'],
          ['Carol Day', 'Carol Day'],
          ['Pudding Day', 'Pudding Day'],
        ],
      ),
      question(
        'hagyomany',
        [
          'Mit rejtenek hagyományosan az angol karácsonyi pudingba, hogy szerencsét hozzon a megtalálójának?',
          'What is traditionally hidden in an English Christmas pudding to bring luck to whoever finds it?',
        ],
        [
          ['Pénzérmét', 'A coin'],
          ['Kavicsot', 'A pebble'],
          ['Kulcsot', 'A key'],
        ],
      ),
    ],
    [
      puzzle(
        '🏢💥🔫🎄',
        'film',
        { hu: ['Drágán add az életed', 'Die Hard'], en: ['Die Hard'] },
        ['1988-as akciófilm Bruce Willisszel', 'A 1988 action film with Bruce Willis'],
        [
          'Egy rendőr mezítláb harcol egy toronyházban szenteste',
          'A cop fights barefoot in a skyscraper on Christmas Eve',
        ],
      ),
    ],
    quote([
      'A fa akkor a legszebb, amikor mindenki tett rá valamit.',
      'A tree is at its loveliest when everyone has hung something on it.',
    ]),
  ),

  day(
    20,
    [
      question(
        'film',
        [
          'Hogy hívják a Mikulás kisebbik fiát, aki a 2011-es animációs filmben kézbesít egy kimaradt ajándékot?',
          'What is the name of Santa’s younger son, who delivers one forgotten present in the 2011 animated film?',
        ],
        [
          ['Artúr', 'Arthur'],
          ['Olivér', 'Oliver'],
          ['Péter', 'Peter'],
          ['Miklós', 'Nicholas'],
        ],
        ['A film címe magyarul Karácsony Artúr.', 'The film is called Arthur Christmas.'],
      ),
      question(
        'etel',
        ['Miből készül a marcipán a cukor mellett?', 'Besides sugar, what is marzipan made from?'],
        [
          ['Mandulából', 'Almonds'],
          ['Dióból', 'Walnuts'],
          ['Mogyoróból', 'Hazelnuts'],
          ['Gesztenyéből', 'Chestnuts'],
        ],
      ),
      question(
        'zene',
        [
          'Ki énekli a 2014-es „Santa Tell Me” című karácsonyi dalt?',
          'Who sings the 2014 Christmas song “Santa Tell Me”?',
        ],
        [
          ['Ariana Grande', 'Ariana Grande'],
          ['Taylor Swift', 'Taylor Swift'],
          ['Katy Perry', 'Katy Perry'],
          ['Dua Lipa', 'Dua Lipa'],
        ],
      ),
    ],
    [
      puzzle(
        '👦🥁🎁⭐',
        'dal',
        {
          hu: ['A kis dobos', 'A kis dobos fiú', 'Little Drummer Boy'],
          en: ['The Little Drummer Boy', 'Little Drummer Boy'],
        },
        ['1941-ben írt amerikai karácsonyi ének', 'An American carol written in 1941'],
        [
          'Egy szegény fiú a hangszerén játszik ajándék helyett',
          'A poor child plays his instrument instead of bringing a gift',
        ],
      ),
    ],
    quote(
      ['Fekete karácsony, fehér húsvét.', 'A black Christmas, a white Easter.'],
      ['magyar közmondás', 'Hungarian proverb'],
    ),
  ),

  day(
    21,
    [
      question(
        'hagyomany',
        [
          'A holland hagyomány szerint mivel érkezik Spanyolországból a Sinterklaas, a Mikulás?',
          'In Dutch tradition, how does Sinterklaas, their Santa, arrive from Spain?',
        ],
        [
          ['Gőzhajóval', 'By steamboat'],
          ['Rénszarvasszánnal', 'By reindeer sleigh'],
          ['Vonattal', 'By train'],
          ['Léghajóval', 'By airship'],
        ],
      ),
      question(
        'erdekesseg',
        [
          'Melyik napra esik a karácsony a julián naptárt követő ortodox egyházakban, például Szerbiában?',
          'On which day does Christmas fall in Orthodox churches that follow the Julian calendar, as in Serbia?',
        ],
        [
          ['Január 7-re', 'On 7 January'],
          ['Január 1-jére', 'On 1 January'],
          ['December 31-re', 'On 31 December'],
          ['Január 14-re', 'On 14 January'],
        ],
      ),
      question(
        'film',
        [
          'Melyik filmben hajszol Arnold Schwarzenegger szenteste egy Turbo Man játékfigurát a fiának?',
          'In which film does Arnold Schwarzenegger chase a Turbo Man toy for his son on Christmas Eve?',
        ],
        [
          ['Hull a pelyhes', 'Jingle All the Way'],
          ['Ovizsaru', 'Kindergarten Cop'],
          ['Junior', 'Junior'],
        ],
      ),
    ],
    [
      puzzle(
        '🏠🔄🏠✈️❤️',
        'film',
        { hu: ['Holiday'], en: ['The Holiday'] },
        [
          '2006-os romantikus vígjáték Kate Winslettel és Cameron Diazzal',
          'A 2006 romantic comedy with Kate Winslet and Cameron Diaz',
        ],
        [
          'Két nő karácsonyra házat cserél: Los Angeles és egy angol falu',
          'Two women swap homes for Christmas: Los Angeles and an English village',
        ],
      ),
    ],
    quote([
      'A leghosszabb éjszaka után minden nap egy kicsit világosabb.',
      'After the longest night, every day is a little brighter.',
    ]),
  ),

  day(
    22,
    [
      question(
        'etel',
        [
          'Melyik magyar ünnepi étel készül savanyú káposztából és darált húsos töltelékből?',
          'Which Hungarian festive dish is made from sauerkraut and a minced-meat filling?',
        ],
        [
          ['Töltött káposzta', 'Stuffed cabbage'],
          ['Rakott krumpli', 'Layered potatoes'],
          ['Lecsó', 'Lecsó'],
          ['Gulyásleves', 'Goulash soup'],
        ],
      ),
      question(
        'zene',
        [
          'Mi az alcíme John Lennon és Yoko Ono „Happy Xmas” című dalának?',
          'What is the subtitle of John Lennon and Yoko Ono’s song “Happy Xmas”?',
        ],
        [
          ['War Is Over', 'War Is Over'],
          ['Give Peace a Chance', 'Give Peace a Chance'],
          ['Imagine', 'Imagine'],
          ['All You Need Is Love', 'All You Need Is Love'],
        ],
      ),
      question(
        'erdekesseg',
        [
          'Melyik szarvasfélénél visel agancsot a nőstény is?',
          'In which species of deer do the females grow antlers too?',
        ],
        [
          ['Rénszarvas', 'Reindeer'],
          ['Gímszarvas', 'Red deer'],
          ['Őz', 'Roe deer'],
          ['Jávorszarvas', 'Moose'],
        ],
        [
          'A hímek tél elejére elhullatják az agancsukat, a nőstények tavaszig megtartják.',
          'The males shed their antlers by early winter, while the females keep theirs until spring.',
        ],
      ),
    ],
    [
      puzzle(
        '🕯️🔥🌟😌',
        'szo',
        { hu: ['gyertya', 'gyertyaláng', 'gyertyafény'], en: ['candle', 'candlelight'] },
        ['Viaszból készül, kanóc van benne', 'Made of wax, with a wick inside'],
        [
          'Az adventi koszorún négy van belőle',
          'There are four of them on an Advent wreath',
        ],
      ),
    ],
    quote(
      [
        'Boldog, boldog karácsony, amely vissza tud vinni bennünket gyermekkorunk ábrándjaihoz!',
        'Happy, happy Christmas, that can win us back to the delusions of our childish days!',
      ],
      ['Charles Dickens', 'Charles Dickens'],
      ['A Pickwick Klub', 'The Pickwick Papers'],
    ),
  ),

  day(
    23,
    [
      question(
        'hagyomany',
        ['Mit jelent a latin eredetű „advent” szó?', 'What does the word “Advent”, from Latin, mean?'],
        [
          ['Eljövetel', 'Coming'],
          ['Várakozás', 'Waiting'],
          ['Ajándék', 'Gift'],
          ['Fény', 'Light'],
        ],
        [
          'A várakozás időszaka, de maga a szó (adventus) eljövetelt jelent.',
          'It is a season of waiting, but the word itself (adventus) means coming.',
        ],
      ),
      question(
        'film',
        [
          'Melyik 1988-as filmben látogatja meg három szellem a Bill Murray játszotta tévéelnököt?',
          'In which 1988 film is a TV executive played by Bill Murray visited by three ghosts?',
        ],
        [
          ['Szellemes karácsony', 'Scrooged'],
          ['Szellemirtók', 'Ghostbusters'],
          ['Idétlen időkig', 'Groundhog Day'],
        ],
      ),
      question(
        'etel',
        [
          'Melyik karácsonyi édesség alakját mintázták a legenda szerint a pásztorbotról?',
          'According to legend, which Christmas sweet is shaped after a shepherd’s crook?',
        ],
        [
          ['Cukorpálca', 'Candy cane'],
          ['Mézeskalács', 'Gingerbread'],
          ['Szaloncukor', 'Szaloncukor'],
          ['Habcsók', 'Meringue'],
        ],
      ),
    ],
    [
      puzzle(
        '🚗🏠🎄🎶',
        'dal',
        { hu: ['Driving Home for Christmas'], en: ['Driving Home for Christmas'] },
        ['Chris Rea 1986-os dala', 'A 1986 song by Chris Rea'],
        [
          'Az énekes dugóban ül, de alig várja, hogy hazaérjen',
          'The singer sits in traffic, longing to get back to his family',
        ],
      ),
    ],
    quote(
      [
        'Boldog karácsonyt mindenkinek, és mindenkinek jó éjszakát!',
        'Happy Christmas to all, and to all a good night!',
      ],
      ['Clement Clarke Moore', 'Clement Clarke Moore'],
      ['Szent Miklós látogatása', 'A Visit from St. Nicholas'],
    ),
  ),

  day(
    24,
    [
      question(
        'hagyomany',
        [
          'A magyar hagyomány szerint ki hozza az ajándékokat szenteste?',
          'In Hungarian tradition, who brings the presents on Christmas Eve?',
        ],
        [
          ['A Jézuska', 'The Baby Jesus'],
          ['A Mikulás', 'Santa Claus'],
          ['A háromkirályok', 'The Three Kings'],
        ],
        ['A Mikulás nálunk már december 6-án megérkezik.', 'In Hungary, Santa already visits on 6 December.'],
      ),
      question(
        'film',
        [
          'Melyik városban játszódik a Reszkessetek, betörők! második része?',
          'In which city is the second Home Alone film set?',
        ],
        [
          ['New York', 'New York'],
          ['Chicago', 'Chicago'],
          ['Párizs', 'Paris'],
          ['Los Angeles', 'Los Angeles'],
        ],
      ),
      question(
        'zene',
        [
          'Ki írta A diótörő című balett zenéjét?',
          'Who composed the music for the ballet The Nutcracker?',
        ],
        [
          ['Csajkovszkij', 'Tchaikovsky'],
          ['Mozart', 'Mozart'],
          ['Sztravinszkij', 'Stravinsky'],
          ['Prokofjev', 'Prokofiev'],
        ],
      ),
      question(
        'etel',
        [
          'Melyik halból készül hagyományosan a magyar karácsonyi halászlé?',
          'Which fish is the traditional Hungarian Christmas fish soup made from?',
        ],
        [
          ['Ponty', 'Carp'],
          ['Lazac', 'Salmon'],
          ['Tonhal', 'Tuna'],
          ['Pisztráng', 'Trout'],
        ],
      ),
      question(
        'erdekesseg',
        [
          'Melyik országban található Rovaniemi, a Mikulás „hivatalos” szülővárosa?',
          'In which country is Rovaniemi, the “official” hometown of Santa Claus?',
        ],
        [
          ['Finnország', 'Finland'],
          ['Norvégia', 'Norway'],
          ['Svédország', 'Sweden'],
          ['Izland', 'Iceland'],
        ],
      ),
    ],
    [
      puzzle(
        '💚😠🎄🎁',
        'film',
        {
          hu: ['A Grincs', 'Hogyan lopta el a Grincs a karácsonyt'],
          en: ['The Grinch', 'How the Grinch Stole Christmas'],
        },
        ['Dr. Seuss meséjéből készült', 'Based on a Dr. Seuss story'],
        ['A zöld főhős el akarja lopni az ünnepet', 'The green hero wants to steal the holiday'],
      ),
      puzzle(
        '🔔🔔🛷❄️',
        'dal',
        { hu: ['Jingle Bells', 'Csengőszó'], en: ['Jingle Bells'] },
        ['1857-ben írt amerikai dal', 'An American song written in 1857'],
        ['Egy lovas szánról szól a havas tájban', 'It is about a one-horse sleigh in the snow'],
      ),
    ],
    quote([
      'A fa elkészült, a gyertyák égnek. A legszebb ajándék mégis az, hogy együtt vagyunk.',
      'The tree is finished and the candles are lit. Still, the best gift is being together.',
    ]),
  ),
]
