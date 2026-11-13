import { day, puzzle, question, quote } from '../build'
import type { DayContent } from '../types'

/** 13–18. nap. Szabályok: docs/03-tartalom-utmutato.md. Az első válasz mindig a helyes. */
export const days13to18: DayContent[] = [
  day(
    13,
    [
      question(
        'hagyomany',
        [
          'Mit kezdtek el faragni Luca napján, december 13-án a magyar néphagyomány szerint?',
          'In Hungarian folk tradition, what did people start carving on Saint Lucy’s Day, 13 December?',
        ],
        [
          ['Luca székét', 'Lucy’s chair'],
          ['Bölcsőt', 'A cradle'],
          ['Pásztorbotot', 'A shepherd’s crook'],
        ],
        [
          'Karácsonyig kellett elkészülnie, naponta csak egy keveset dolgoztak rajta.',
          'It had to be finished by Christmas, with only a little work done on it each day.',
        ],
      ),
      question(
        'film',
        [
          'Melyik vígjátékban próbál tökéletes családi karácsonyt rendezni Clark Griswold?',
          'In which comedy does Clark Griswold try to host the perfect family Christmas?',
        ],
        [
          ['Karácsonyi vakáció', 'National Lampoon’s Christmas Vacation'],
          ['Apád-anyád idejöjjön!', 'The Parent Trap'],
          ['Beethoven', 'Beethoven'],
        ],
      ),
      question(
        'etel',
        [
          'Mi a népszerű karácsonyi vacsora Japánban egy 1970-es évekbeli reklámkampány óta?',
          'What has been a popular Christmas dinner in Japan ever since a 1970s advertising campaign?',
        ],
        [
          ['Rántott csirke', 'Fried chicken'],
          ['Szusi', 'Sushi'],
          ['Pizza', 'Pizza'],
          ['Hamburger', 'Hamburger'],
        ],
        ['A KFC 1974-es kampánya tette szokássá.', 'A 1974 KFC campaign turned it into a custom.'],
      ),
    ],
    [
      puzzle(
        '🎃💀🎄🎅',
        'film',
        {
          hu: ['Karácsonyi lidércnyomás'],
          en: ['The Nightmare Before Christmas', 'Nightmare Before Christmas'],
        },
        [
          '1993-as bábfilm Tim Burton történetéből',
          'A 1993 stop-motion film from a Tim Burton story',
        ],
        [
          'Halloween-város királya el akarja rabolni a Mikulást',
          'The king of Halloween Town plans to kidnap Santa',
        ],
      ),
    ],
    quote(
      ['Lassan készül, mint a Luca széke.', 'As slow in the making as Lucy’s chair.'],
      ['magyar szólás', 'Hungarian saying'],
    ),
  ),

  day(
    14,
    [
      question(
        'zene',
        [
          'A „The Twelve Days of Christmas” című angol dalban mit kap az énekes az első napon?',
          'In the English song “The Twelve Days of Christmas”, what does the singer receive on the first day?',
        ],
        [
          ['Egy foglyot a körtefán', 'A partridge in a pear tree'],
          ['Öt aranygyűrűt', 'Five gold rings'],
          ['Két gerlét', 'Two turtle doves'],
          ['Hat ludat', 'Six geese'],
        ],
      ),
      question(
        'erdekesseg',
        [
          'Melyik szervezet „követi” 1955 óta minden szenteste a Mikulás szánjának útját?',
          'Which organisation has “tracked” Santa’s sleigh every Christmas Eve since 1955?',
        ],
        [
          ['NORAD', 'NORAD'],
          ['NASA', 'NASA'],
          ['FBI', 'FBI'],
          ['Az ENSZ', 'The UN'],
        ],
        [
          'A hagyomány az észak-amerikai légvédelemnél indult, egy elírt telefonszám miatt.',
          'The tradition began at North American air defence, thanks to a misprinted phone number.',
        ],
      ),
      question(
        'hagyomany',
        [
          'Melyik országban hoz ajándékot a gyerekeknek a Befana nevű jóságos boszorkány?',
          'In which country does a kindly witch called Befana bring presents to children?',
        ],
        [
          ['Olaszország', 'Italy'],
          ['Spanyolország', 'Spain'],
          ['Görögország', 'Greece'],
          ['Portugália', 'Portugal'],
        ],
      ),
    ],
    [
      puzzle(
        '🦌🔴👃✨',
        'dal',
        {
          hu: ['Rudolf, a piros orrú rénszarvas', 'Rudolf', 'Rudolf, a rénszarvas'],
          en: ['Rudolph the Red-Nosed Reindeer', 'Rudolph', 'Rudolf the Red-Nosed Reindeer'],
        },
        [
          'Egy 1949-es dal a szán kilencedik húzójáról',
          'A 1949 song about the ninth puller of the sleigh',
        ],
        ['A többiek kinevették a világító orra miatt', 'The others laughed at his glowing nose'],
      ),
    ],
    quote(
      [
        'Karácsony napján harangszót hallottam: régi, ismerős dalaikat játszották.',
        'I heard the bells on Christmas Day their old, familiar carols play.',
      ],
      ['Henry Wadsworth Longfellow', 'Henry Wadsworth Longfellow'],
      ['Karácsonyi harangok', 'Christmas Bells'],
    ),
  ),

  day(
    15,
    [
      question(
        'film',
        [
          'Melyik animációs filmben fog össze a Mikulás, a Húsvéti Nyúl, a Fogtündér és a Homokember?',
          'In which animated film do Santa, the Easter Bunny, the Tooth Fairy and the Sandman join forces?',
        ],
        [
          ['Az öt legenda', 'Rise of the Guardians'],
          ['A hihetetlen család', 'The Incredibles'],
          ['Szörny Rt.', 'Monsters, Inc.'],
        ],
      ),
      question(
        'etel',
        [
          'Mi az eggnog nevű karácsonyi ital fő alapanyaga a tej és a cukor mellett?',
          'Besides milk and sugar, what is the main ingredient of the Christmas drink eggnog?',
        ],
        [
          ['Tojás', 'Egg'],
          ['Méz', 'Honey'],
          ['Kakaó', 'Cocoa'],
          ['Kókusz', 'Coconut'],
        ],
      ),
      question(
        'zene',
        [
          'Ki vette fel 13 évesen a „Rockin’ Around the Christmas Tree” című dalt?',
          'Who recorded “Rockin’ Around the Christmas Tree” at the age of 13?',
        ],
        [
          ['Brenda Lee', 'Brenda Lee'],
          ['Connie Francis', 'Connie Francis'],
          ['Doris Day', 'Doris Day'],
          ['Ella Fitzgerald', 'Ella Fitzgerald'],
        ],
        [
          '1958-ban rögzítették, és azóta is minden decemberben visszatér a slágerlistákra.',
          'It was recorded in 1958 and still returns to the charts every December.',
        ],
      ),
    ],
    [
      puzzle(
        '👼✨🎺☁️',
        'szo',
        { hu: ['angyal', 'angyalka', 'karácsonyi angyal'], en: ['angel', 'Christmas angel'] },
        ['Szárnya van, és glória a feje fölött', 'It has wings and a halo'],
        ['A karácsonyfa csúcsára is szokták tenni', 'People also place one on top of the tree'],
      ),
    ],
    quote([
      'Félúton járunk: ami eddig csak terv volt, mostantól készülődés.',
      'We are past halfway: what was only a plan now becomes getting ready.',
    ]),
  ),

  day(
    16,
    [
      question(
        'hagyomany',
        [
          'Hány napig tart a hagyomány szerint a karácsonyi ünnepkör karácsonytól vízkeresztig?',
          'By tradition, how many days does the Christmas season last from Christmas to Epiphany?',
        ],
        [
          ['12', '12'],
          ['7', '7'],
          ['24', '24'],
          ['40', '40'],
        ],
      ),
      question(
        'erdekesseg',
        [
          'Mikor van az északi féltekén a téli napforduló, az év leghosszabb éjszakája?',
          'When is the winter solstice, the longest night of the year, in the northern hemisphere?',
        ],
        [
          ['December 21-én vagy 22-én', 'On 21 or 22 December'],
          ['December 13-án', 'On 13 December'],
          ['December 24-én', 'On 24 December'],
          ['December 31-én', 'On 31 December'],
        ],
        [
          'A régi naptár szerint Luca napjára esett, ezért tartották azt a leghosszabb éjszakának.',
          'Under the old calendar it fell on Saint Lucy’s Day, which is why that was called the longest night.',
        ],
      ),
      question(
        'film',
        [
          'Az élet csodaszép című klasszikus szerint mi történik, valahányszor megszólal egy csengő?',
          'According to the classic It’s a Wonderful Life, what happens every time a bell rings?',
        ],
        [
          ['Egy angyal szárnyakat kap', 'An angel gets its wings'],
          ['Leesik az első hó', 'The first snow falls'],
          ['Teljesül egy kívánság', 'A wish comes true'],
        ],
      ),
    ],
    [
      puzzle(
        '🧝🎅🗽🍝',
        'film',
        { hu: ['Mi a manó', 'Elf'], en: ['Elf'] },
        ['2003-as vígjáték Will Ferrell-lel', 'A 2003 comedy starring Will Ferrell'],
        [
          'Az Északi-sarkon nevelkedett ember New Yorkban keresi az apját',
          'A man raised at the North Pole looks for his father in New York',
        ],
      ),
    ],
    quote(
      [
        'Bár a betegség és a bánat ragályos, nincs a világon semmi, ami olyan ellenállhatatlanul ragadós volna, mint a nevetés és a jókedv.',
        'While there is infection in disease and sorrow, there is nothing in the world so irresistibly contagious as laughter and good-humour.',
      ],
      ['Charles Dickens', 'Charles Dickens'],
      ['Karácsonyi ének', 'A Christmas Carol'],
    ),
  ),

  day(
    17,
    [
      question(
        'etel',
        [
          'Melyik veronai karácsonyi kalács csillag alakú, és porcukorral hintik meg, mint egy havas hegycsúcsot?',
          'Which Christmas cake from Verona is star-shaped and dusted with icing sugar like a snowy peak?',
        ],
        [
          ['Pandoro', 'Pandoro'],
          ['Tiramisu', 'Tiramisu'],
          ['Cannoli', 'Cannoli'],
          ['Biscotti', 'Biscotti'],
        ],
      ),
      question(
        'zene',
        [
          'Mi a címe José Feliciano spanyol–angol nyelvű karácsonyi slágerének?',
          'What is the title of José Feliciano’s Spanish-and-English Christmas hit?',
        ],
        [
          ['Feliz Navidad', 'Feliz Navidad'],
          ['Buon Natale', 'Buon Natale'],
          ['Joyeux Noël', 'Joyeux Noël'],
          ['Frohe Weihnachten', 'Frohe Weihnachten'],
        ],
      ),
      question(
        'erdekesseg',
        [
          'Melyik fenyőféle hullatja le ősszel a tűleveleit?',
          'Which conifer sheds its needles in autumn?',
        ],
        [
          ['Vörösfenyő', 'Larch'],
          ['Lucfenyő', 'Spruce'],
          ['Jegenyefenyő', 'Fir'],
          ['Erdeifenyő', 'Scots pine'],
        ],
      ),
    ],
    [
      puzzle(
        '🎅➡️🏙️📝',
        'dal',
        {
          hu: ['Santa Claus Is Coming to Town', 'Santa Claus Is Comin to Town'],
          en: ['Santa Claus Is Comin’ to Town', 'Santa Claus Is Coming to Town'],
        },
        ['1934-es amerikai dal', 'An American song from 1934'],
        [
          'Arra int, hogy viselkedj jól, mert valaki úton van a városba',
          'It warns you to behave, because someone is on his way to your city',
        ],
      ),
    ],
    quote([
      'Egy bögre forró tea és egy jó szó: ennyi is elég egy meleg estéhez.',
      'A mug of hot tea and a kind word are enough for a warm evening.',
    ]),
  ),

  day(
    18,
    [
      question(
        'hagyomany',
        [
          'Melyik országban állítanak fel adventkor óriási szalmakecskét Gävle városában?',
          'In which country is a giant straw goat put up in the town of Gävle every Advent?',
        ],
        [
          ['Svédország', 'Sweden'],
          ['Hollandia', 'Netherlands'],
          ['Skócia', 'Scotland'],
          ['Lengyelország', 'Poland'],
        ],
      ),
      question(
        'film',
        [
          'Az Ollókezű Edward végén mi hull a városra, amikor Edward jeget farag?',
          'At the end of Edward Scissorhands, what falls on the town when Edward carves ice?',
        ],
        [
          ['Hó', 'Snow'],
          ['Csillámpor', 'Glitter'],
          ['Virágszirom', 'Petals'],
        ],
      ),
      question(
        'etel',
        [
          'Mit sütnek hagyományosan parázson a karácsonyi vásárokban?',
          'What is traditionally roasted over hot coals at Christmas markets?',
        ],
        [
          ['Gesztenyét', 'Chestnuts'],
          ['Diót', 'Walnuts'],
          ['Pisztáciát', 'Pistachios'],
          ['Kesudiót', 'Cashews'],
        ],
      ),
    ],
    [
      puzzle(
        '🦌🛷❄️🔔',
        'szo',
        { hu: ['rénszarvas', 'rénszarvasok'], en: ['reindeer'] },
        ['Agancsos állat a messzi északról', 'An antlered animal from the far north'],
        ['Kilencen húzzák a Mikulás szánját', 'Nine of them pull Santa’s sleigh'],
      ),
    ],
    quote(
      [
        'Harang csendül, ének zendül, messze zsong a hálaének.',
        'A bell rings out, a song resounds, the hymn of thanks hums far away.',
      ],
      ['Ady Endre', 'Endre Ady'],
      ['Karácsony', 'Christmas'],
    ),
  ),
]
