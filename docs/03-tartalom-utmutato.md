# Tartalom-útmutató – a 24 nap megírása

A specifikáció szerint a legnagyobb munka a tartalom: **74 kvízkérdés, 25 emoji-rejtvény 50 tippel, 24 idézet, mindez két nyelven.** Ez az útmutató azt rögzíti, milyen legyen egy jó kérdés és rejtvény, mit ellenőriz a gép, és mit kell kézzel átnézni. A típusok a specifikáció „Adatmodell” szakaszában vannak.

## Munkamenet

1. Előbb a magyar változat készüljön el mind a 24 napra, utána az angol. (Ha szorít az idő, az angol tartalom naponta is pótolható, lásd a [vágási listát](02-fejlesztesi-terv.md).)
2. Egy nap megírása után fusson a `yarn test`: a tartalomteszt azonnal jelzi a formai hibákat.
3. Minden napot játssz végig egyszer a böngészőben (`?date=2026-12-24` fejlesztői módban mindent megnyit).
4. A tényeket a végén valaki más is nézze át, aki nem látta a válaszokat: így kiderül a nehézség is.

## Azonosítók

| Elem | Minta | Példa |
| --- | --- | --- |
| Kvízkérdés | `d{NN}-q{n}` | `d01-q1`, `d24-q5` |
| Emoji-rejtvény | `d{NN}-e{n}` | `d07-e1`, `d24-e2` |

A nap száma mindig kétjegyű. Az azonosítóból jön a válaszok keverésének seedje is, ezért egyedinek kell lennie.

## Kvízkérdések

**Elosztás.** Öt kategória van (`erdekesseg`, `film`, `zene`, `hagyomany`, `etel`), 74 kérdésre ez kategóriánként kb. 15. Egy napon belül a három kérdés három különböző kategóriából jöjjön.

**Nehézség.** Egy napon belül: egy könnyű, egy közepes, egy „ezt nem tudtam” típusú. A játék célja a jókedv, nem a vizsga; a hibás válasz után megjelenő `explanation` legyen az, amiért megérte tippelni.

**Jó kérdés:**

- Egyetlen, egyértelműen helyes válasza van, amit megbízható forrás igazol.
- Rövid: mobilon legfeljebb három sor. A válaszlehetőségek egy sorban elférnek (kb. 30 karakter).
- A rossz válaszok hihetők és azonos típusúak (négy ország, négy előadó), hasonló hosszúsággal. Ne a leghosszabb legyen a helyes.
- Nincs „mindegyik” / „egyik sem” válasz: a sorrend keveredik, a „fentiek” értelmét vesztené.
- Nem függ a megírás évétől („idén”, „tavaly”, „a legújabb”).
- Kerüli a vitatott „tényeket” (pl. hogy mióta piros a Mikulás ruhája, vagy melyik a „legnézettebb” karácsonyi film) – vagy a kérdés maga mondja meg a forrást.

**A helyes válasz helye.** A fájlban nyugodtan lehet mindig az első (`correctIndex: 0`), a megjelenítés keveri. A teszt ettől függetlenül ellenőrzi, hogy az index érvényes.

**Kétnyelvűség.** A kérdés mindkét nyelven ugyanarra a tényre kérdezzen. Film- és dalcímeknél a **hivatalos** magyar cím kell (Home Alone → Reszkessetek, betörők!), nem tükörfordítás. Ha egy kérdés csak az egyik kultúrában érthető (szaloncukor, bejgli, luca széke), az angol szöveg adjon fél mondat magyarázatot, vagy az `explanation` pótolja.

## Emoji-rejtvények

**Elosztás.** 25 rejtvény, három fajta (`szo`, `film`, `dal`): nagyjából 8–9 mindegyikből. A 24. nap két rejtvénye két különböző fajta legyen.

**Jó rejtvény:**

- 2–5 emoji. Kevesebből nem lehet kitalálni, többől regény lesz.
- Csak régi, mindenhol meglévő emojik (kb. 2020 előttiek). Új vagy összetett emoji régebbi telefonon üres négyzetként jelenik meg. Zászlót ne használj: Windowson betűpárként látszik.
- A megfejtés ne csak az egyik nyelven működjön. A szójátékra épülő rejtvény (hangalak, összetett szó tagjai) szinte mindig csak az egyik nyelven jön ki; a jelentésre épülő (szereplők, cselekmény, tárgyak) mindkettőn.
- A megoldás közismert legyen mindkét közönségnek. Ha egy film Magyarországon alig ismert, válassz másikat.

**Elfogadott válaszok (`answers`).** A tömb első eleme a kanonikus alak, ez jelenik meg megfejtés után. A többi a ténylegesen előforduló változat:

- A `normalize()` kezeli a kis- és nagybetűt, az ékezeteket, az írásjeleket és a kezdő névelőt (a, az, the) – ezekre **nem** kell külön alak.
- Külön alak kell: számmal és betűvel írt változat („2” / „kettő”), alcím nélküli cím, elterjedt rövid forma, egybe- és különírt változat, az eredeti cím, ha a magyar közönség is úgy ismeri.
- Mindkét nyelv listája érvényes mindkét felületen, ezért figyelj arra, hogy az egyik rejtvény elfogadott alakja ne legyen túl általános (pl. csak „karácsony”).

**Tippek.** Pontosan kettő, fokozatosan:

1. tipp: szűkíti a kört (műfaj, évtized, miről szól), de önmagában nem elég.
2. tipp: szinte megadja (első betű és hosszúság, egy főszereplő, a refrén első szava dalszöveg idézése nélkül).

A tipp ne tartalmazza a megfejtést vagy annak egy szavát.

## Idézetek

A döntés rögzítve van: **csak közkincs vagy saját szöveg, saját fordítással.**

- Közkincs az a szöveg, amelynek szerzője több mint 70 éve halt meg (2026-ban: 1955-ben vagy korábban).
- **A fordítás külön mű.** Egy közkincs angol szöveg kiadott magyar fordítása jellemzően jogvédett, ezért a magyar változat saját fordítás legyen, ne kötetből másolt. Ugyanez igaz visszafelé is (magyar szerző angolul).
- Dalszöveg, filmidézet, kortárs szerző: nem. Népi mondás, közmondás, Biblia régi (pl. Károli) fordítása: igen.
- Az interneten keringő „idézetek” nagy része téves szerzőhöz van kötve. Csak olyat használj, aminek megvan a műve és a helye (`source`); ha nincs, legyen inkább saját szöveg szerző nélkül.
- Hossz: legfeljebb kb. 200 karakter, hogy mobilon görgetés nélkül kiférjen a dísz előnézetével együtt.
- A 24. nap idézete legyen a legünnepibb, a 6. napé kapcsolódhat a Mikuláshoz.

## Díszek

A díszek sorrendjét, alakzatát és színét a [specifikáció](SPEC.md) táblázata adja: 12 alakzat (`shape`) és hét szín (`color`) áll rendelkezésre, új alakzat vagy szín felvétele kódmódosítás. A `slot` koordinátáinál:

- `x` 0–100, `y` 0–120 (a `viewBox` szerint).
- A díszek a fa körvonalán belül legyenek, egymástól legalább kb. 9 egység távolságra, különben mobilon összeérnek.
- A korai napok kerüljenek alulra és szétszórva, hogy a fa egyenletesen teljen; a 24. nap a csúcs.

## Hangnem és helyesírás

- Tegeződő, vidám, rövid mondatok. Felkiáltójel mondatonként legfeljebb egy.
- Idézőjelek: magyarul „ ”, belső idézet » «; angolul “ ”. Gondolatjel: magyarul nagykötőjel szóközökkel ( – ).
- Címek: magyarul csak az első szó nagybetűs (Igazából szerelem), angolul címszerűen (Love Actually).
- Az angol változat brit vagy amerikai helyesírása legyen egységes. A spec mintája brit (honour), tehát: colour, favourite, film.
- A karácsony legyen befogadó: a kérdések a szokásokról, filmekről, zenékről szóljanak, ne feltételezzenek vallási hátteret.

## Amit a tartalomteszt ellenőriz

A specifikációban szereplő ellenőrzések, kiegészítve azokkal, amik a fenti szabályokból gépesíthetők:

- [ ] Pontosan 24 nap van, `day` 1–24, ismétlés nélkül.
- [ ] 1–23. nap: 3 kérdés és 1 rejtvény; 24. nap: 5 kérdés és 2 rejtvény.
- [ ] Minden `L` mezőben mindkét nyelv megvan és nem üres.
- [ ] Minden azonosító egyedi, és megfelel a mintának a saját napjával.
- [ ] `options` hossza 3 vagy 4; `correctIndex` érvényes; egy kérdésen belül nincs két azonos válasz (egyik nyelven sem).
- [ ] Minden rejtvénynek mindkét nyelven van legalább egy elfogadott válasza, és a `normalize()` után egyik sem üres.
- [ ] Két különböző rejtvénynek nincs közös normalizált válasza.
- [ ] Egyik tipp normalizált szövege sem tartalmazza a saját rejtvénye valamelyik elfogadott válaszát.
- [ ] `slot` a megengedett tartományban (`x` 0–100, `y` 0–120); nincs két dísz ugyanazon a helyen; a díszek `id`-ja egyedi.
- [ ] Hosszkorlátok: kérdés ≤ 140, válasz ≤ 40, idézet ≤ 220 karakter (figyelmeztetésként, nem hibaként).

## Amit csak ember tud ellenőrizni

- [ ] A helyes válasz tényleg helyes, és a rossz válaszok tényleg rosszak (nincs második jó válasz).
- [ ] A magyar és az angol szöveg ugyanazt kérdezi.
- [ ] Az emojisor mindkét nyelven kitalálható, és telefonon is jól néz ki.
- [ ] Az idézet szerzője és forrása ellenőrzött, a fordítás saját.
- [ ] Nincs ismétlődés a 24 nap között (ugyanaz a film kvízkérdésben és rejtvényben, két hasonló kérdés).

## Indulás után

A mentés azonosítókra és indexekre hivatkozik, ezért december 1. után:

| Szabad | Tilos |
| --- | --- |
| Elírás, fogalmazás, fordítás javítása | Kérdés vagy rejtvény `id`-jának megváltoztatása |
| Új elfogadott válasz hozzáadása egy rejtvényhez | Válaszlehetőségek sorrendjének cseréje, válasz törlése vagy beszúrása |
| `explanation` hozzáadása | Kérdések vagy rejtvények sorrendjének cseréje egy napon belül |
| Még meg nem nyílt (jövőbeli) nap teljes átírása | Már megnyílt nap kérdésének lecserélése másikra |

Ha egy már megnyílt napon tényhiba van, a `correctIndex` javítható: a pontszám számolt érték, így mindenkinél magától helyreáll.
