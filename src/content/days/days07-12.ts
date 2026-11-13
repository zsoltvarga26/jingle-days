import { day, puzzle, question, quote } from '../build'
import type { DayContent } from '../types'

/** 7–12. nap. Szabályok: docs/03-tartalom-utmutato.md. Az első válasz mindig a helyes. */
export const days07to12: DayContent[] = [
  day(
    7,
    [
      question(
        'etel',
        [
          'Melyik gyümölcsöt szokták szegfűszeggel megtűzdelni, hogy karácsonyi illat lengje be a lakást?',
          'Which fruit is studded with cloves to fill the home with a Christmas scent?',
        ],
        [
          ['Narancs', 'Orange'],
          ['Alma', 'Apple'],
          ['Körte', 'Pear'],
          ['Szilva', 'Plum'],
        ],
      ),
      question(
        'zene',
        ['Ki írta a Karácsonyi oratóriumot 1734-ben?', 'Who wrote the Christmas Oratorio in 1734?'],
        [
          ['Johann Sebastian Bach', 'Johann Sebastian Bach'],
          ['Ludwig van Beethoven', 'Ludwig van Beethoven'],
          ['Liszt Ferenc', 'Franz Liszt'],
          ['Frédéric Chopin', 'Frédéric Chopin'],
        ],
      ),
      question(
        'erdekesseg',
        ['Hány ága van egy hókristálynak?', 'How many arms does a snow crystal have?'],
        [
          ['6', '6'],
          ['5', '5'],
          ['8', '8'],
          ['4', '4'],
        ],
        [
          'A vízmolekulák hatszöges rácsba rendeződnek, ezért minden hókristály hatágú.',
          'Water molecules arrange themselves in a hexagonal lattice, so every snow crystal has six arms.',
        ],
      ),
    ],
    [
      puzzle(
        '⚪🎄❄️🎶',
        'dal',
        { hu: ['Fehér karácsony', 'White Christmas'], en: ['White Christmas'] },
        ['Bing Crosby 1942-es slágere', 'A 1942 hit by Bing Crosby'],
        ['Az énekes havas ünnepről álmodik', 'The singer is dreaming of a snowy holiday'],
      ),
    ],
    quote(
      [
        'Harangozd ki a régit, harangozd be az újat, zengj, boldog harang, a hó felett.',
        'Ring out the old, ring in the new, ring, happy bells, across the snow.',
      ],
      ['Alfred Tennyson', 'Alfred Tennyson'],
      ['In memoriam', 'In Memoriam'],
    ),
  ),

  day(
    8,
    [
      question(
        'hagyomany',
        [
          'Hogy hívják a Mikulás ijesztő, szarvas kísérőjét a közép-európai hagyományban?',
          'What is the name of Santa’s scary, horned companion in Central European tradition?',
        ],
        [
          ['Krampusz', 'Krampus'],
          ['Kobold', 'Goblin'],
          ['Troll', 'Troll'],
          ['Jeti', 'Yeti'],
        ],
      ),
      question(
        'film',
        [
          'Melyik városban játszódik az Igazából szerelem című film?',
          'In which city is the film Love Actually set?',
        ],
        [
          ['London', 'London'],
          ['New York', 'New York'],
          ['Párizs', 'Paris'],
          ['Dublin', 'Dublin'],
        ],
      ),
      question(
        'etel',
        [
          'Melyik fűszer adja a forralt bor jellegzetes illatát a szegfűszeg mellett?',
          'Besides cloves, which spice gives mulled wine its characteristic aroma?',
        ],
        [
          ['Fahéj', 'Cinnamon'],
          ['Kömény', 'Caraway'],
          ['Kapor', 'Dill'],
          ['Babérlevél', 'Bay leaf'],
        ],
      ),
    ],
    [
      puzzle(
        '🛷⛰️❄️😄',
        'szo',
        {
          hu: ['szánkó', 'szán', 'szánkózás'],
          en: ['sled', 'sledge', 'sleigh', 'sledding', 'sledging'],
        },
        ['Téli játék a domboldalon', 'Winter fun on a hillside'],
        ['Felhúzod a dombra, aztán lecsúszol rajta', 'You pull it up the hill, then ride it down'],
      ),
    ],
    quote([
      'A hópehely sem siet: szép lassan érkezik, és mégis odaér.',
      'A snowflake never hurries: it drifts down slowly and still arrives.',
    ]),
  ),

  day(
    9,
    [
      question(
        'zene',
        [
          'Ki szerezte a Messiás című oratóriumot a híres Halleluja kórussal?',
          'Who composed the oratorio Messiah, with its famous Hallelujah chorus?',
        ],
        [
          ['Georg Friedrich Händel', 'George Frideric Handel'],
          ['Wolfgang Amadeus Mozart', 'Wolfgang Amadeus Mozart'],
          ['Antonio Vivaldi', 'Antonio Vivaldi'],
          ['Joseph Haydn', 'Joseph Haydn'],
        ],
      ),
      question(
        'erdekesseg',
        [
          'Melyik ország ajándékoz 1947 óta minden évben karácsonyfát Londonnak, a Trafalgar térre?',
          'Which country has given London a Christmas tree for Trafalgar Square every year since 1947?',
        ],
        [
          ['Norvégia', 'Norway'],
          ['Svédország', 'Sweden'],
          ['Kanada', 'Canada'],
          ['Dánia', 'Denmark'],
        ],
        [
          'Köszönetül a második világháborúban kapott brit segítségért.',
          'It is a thank-you for British help during the Second World War.',
        ],
      ),
      question(
        'hagyomany',
        [
          'Melyik növény alatt szokás csókot váltani karácsonykor az angolszász hagyomány szerint?',
          'Under which plant do people kiss at Christmas in the English-speaking tradition?',
        ],
        [
          ['Fagyöngy', 'Mistletoe'],
          ['Magyal', 'Holly'],
          ['Borostyán', 'Ivy'],
          ['Fenyőág', 'A pine branch'],
        ],
      ),
    ],
    [
      puzzle(
        '🎁🐻💧🌙😈',
        'film',
        { hu: ['Szörnyecskék', 'Gremlins'], en: ['Gremlins'] },
        ['1984-es horrorvígjáték, karácsonykor játszódik', 'A 1984 horror comedy set at Christmas'],
        [
          'Három szabály: ne érje fény, ne érje víz, és éjfél után ne egyen',
          'Three rules: no bright light, no water, no food after midnight',
        ],
      ),
    ],
    quote(
      [
        'Ez az az évszak, amikor nemcsak a vendégszeretet tüzét gyújtjuk meg a házban, hanem a jóság barátságos lángját is a szívben.',
        'It is the season for kindling, not merely the fire of hospitality in the hall, but the genial flame of charity in the heart.',
      ],
      ['Washington Irving', 'Washington Irving'],
      ['Vázlatkönyv', 'The Sketch Book'],
    ),
  ),

  day(
    10,
    [
      question(
        'film',
        [
          'Hogy hívják a fösvény főhőst Charles Dickens Karácsonyi énekében?',
          'What is the name of the miser at the heart of Charles Dickens’s A Christmas Carol?',
        ],
        [
          ['Ebenezer Scrooge', 'Ebenezer Scrooge'],
          ['Oliver Twist', 'Oliver Twist'],
          ['David Copperfield', 'David Copperfield'],
          ['Jacob Marley', 'Jacob Marley'],
        ],
      ),
      question(
        'etel',
        [
          'Mi a neve a fatörzs alakú francia karácsonyi tortának?',
          'What is the French Christmas cake shaped like a log called?',
        ],
        [
          ['Bûche de Noël', 'Bûche de Noël'],
          ['Crème brûlée', 'Crème brûlée'],
          ['Tarte Tatin', 'Tarte Tatin'],
          ['Éclair', 'Éclair'],
        ],
      ),
      question(
        'zene',
        [
          'Mi után érdeklődik az énekes a „Kiskarácsony, nagykarácsony” kezdetű dalban?',
          'In the Hungarian carol “Kiskarácsony, nagykarácsony”, what does the singer ask about?',
        ],
        [
          ['Kisült-e már a kalácsa', 'Whether the sweet bread is baked yet'],
          ['Leesett-e már a hó', 'Whether the snow has fallen yet'],
          ['Megjött-e már a Jézuska', 'Whether the Baby Jesus has arrived'],
        ],
      ),
    ],
    [
      puzzle(
        '🎅🛷🎁',
        'szo',
        { hu: ['Mikulás', 'Télapó'], en: ['Santa Claus', 'Santa', 'Father Christmas'] },
        [
          'Piros ruhás, fehér szakállú ajándékhozó',
          'A gift-bringer in a red suit with a white beard',
        ],
        ['Magyarországon december 6-án érkezik', 'In Hungary he arrives on 6 December'],
      ),
    ],
    quote([
      'A sütemény illata hamarabb ér a szívhez, mint az íze a nyelvhez.',
      'The smell of baking reaches the heart before the taste reaches the tongue.',
    ]),
  ),

  day(
    11,
    [
      question(
        'hagyomany',
        [
          'Milyen színű az adventi koszorú harmadik, „örömvasárnapi” gyertyája a katolikus hagyományban?',
          'What colour is the third, “Gaudete Sunday” candle of the Advent wreath in Catholic tradition?',
        ],
        [
          ['Rózsaszín', 'Pink'],
          ['Fehér', 'White'],
          ['Piros', 'Red'],
          ['Zöld', 'Green'],
        ],
        ['A másik három gyertya lila.', 'The other three candles are purple.'],
      ),
      question(
        'erdekesseg',
        [
          'Melyik piros levelű cserepes növény a karácsony egyik jelképe?',
          'Which red-leaved pot plant is one of the symbols of Christmas?',
        ],
        [
          ['Mikulásvirág', 'Poinsettia'],
          ['Ciklámen', 'Cyclamen'],
          ['Amarillisz', 'Amaryllis'],
          ['Hóvirág', 'Snowdrop'],
        ],
        [
          'Mexikóból származik; a piros részei nem szirmok, hanem fellevelek.',
          'It comes from Mexico; its red parts are not petals but bracts.',
        ],
      ),
      question(
        'film',
        [
          'Melyik klasszikus filmben bizonyítja be a bíróságon Kris Kringle, hogy ő az igazi Mikulás?',
          'In which classic film does Kris Kringle prove in court that he is the real Santa Claus?',
        ],
        [
          ['Csoda a 34. utcában', 'Miracle on 34th Street'],
          ['Télapu', 'The Santa Clause'],
          ['Mary Poppins', 'Mary Poppins'],
        ],
      ),
    ],
    [
      puzzle(
        '🌨️🔥🍿❤️',
        'dal',
        { hu: ['Let It Snow', 'Hull a hó'], en: ['Let It Snow'] },
        [
          '1945-ös amerikai dal, a címe háromszor ismétlődik a refrénben',
          'A 1945 American song; the title repeats three times in the chorus',
        ],
        ['Odakint cudar az idő, de a tűz mellett jó', 'It is nasty outside, but cosy by the fire'],
      ),
    ],
    quote(
      [
        'Szép Tündérország támad föl szívemben ilyenkor decemberben.',
        'A lovely Fairyland rises in my heart at this time, in December.',
      ],
      ['Juhász Gyula', 'Gyula Juhász'],
      ['Karácsony felé', 'Towards Christmas'],
    ),
  ),

  day(
    12,
    [
      question(
        'etel',
        [
          'Melyik szárnyas a legelterjedtebb karácsonyi sült az Egyesült Királyságban?',
          'Which bird is the most popular Christmas roast in the United Kingdom?',
        ],
        [
          ['Pulyka', 'Turkey'],
          ['Kacsa', 'Duck'],
          ['Fürj', 'Quail'],
          ['Fácán', 'Pheasant'],
        ],
      ),
      question(
        'zene',
        [
          'Melyik évtizedben jelent meg a Band Aid „Do They Know It’s Christmas?” című jótékonysági dala?',
          'In which decade was Band Aid’s charity single “Do They Know It’s Christmas?” released?',
        ],
        [
          ['Az 1980-as években', 'In the 1980s'],
          ['Az 1970-es években', 'In the 1970s'],
          ['Az 1990-es években', 'In the 1990s'],
        ],
        [
          '1984-ben vették fel az etiópiai éhínség károsultjainak megsegítésére.',
          'It was recorded in 1984 to help the victims of the famine in Ethiopia.',
        ],
      ),
      question(
        'erdekesseg',
        [
          'Melyik évben készült az első nyomtatott karácsonyi képeslap?',
          'In which year was the first printed Christmas card made?',
        ],
        [
          ['1843', '1843'],
          ['1743', '1743'],
          ['1903', '1903'],
        ],
        [
          'Sir Henry Cole megbízásából készült Londonban.',
          'It was commissioned by Sir Henry Cole in London.',
        ],
      ),
    ],
    [
      puzzle(
        '🎁🎀🎄😍',
        'szo',
        {
          hu: ['ajándék', 'ajándékdoboz', 'karácsonyi ajándék'],
          en: ['present', 'gift', 'Christmas present', 'Christmas gift'],
        },
        ['A fa alatt vár szenteste', 'It waits under the tree on Christmas Eve'],
        ['Papírba csomagolják, szalaggal kötik át', 'It is wrapped in paper and tied with a ribbon'],
      ),
    ],
    quote([
      'Az ajándék értékét nem az ára adja, hanem a gondolat, amibe csomagolták.',
      'A gift is worth not its price, but the thought it was wrapped in.',
    ]),
  ),
]
