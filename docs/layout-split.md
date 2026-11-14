# Új elrendezés – kétoszlopos nézet

@Zsolt · Nov 13, 2026

## Cél és hatókör

A már működő adventi alkalmazás új elrendezést kap egy külön git ágon (`feature/split-layout`). Széles kijelzőn a kalendárium és a díszíthető fa egymás mellé kerül, így egyetlen képernyőn, görgetés nélkül látszik minden; keskeny kijelzőn egymás alá. A forgatható/lapozható nézet **nem** készül el.

Kizárólag a **felület elrendezése** változik: a fejléc tömörebb lesz, a nyitási banner a kalendárium tetejére költözik, az ajtórács hézag nélkül kitölti a táblát, a fa mellé kerül, és díszítéskor arany kerettel jelez. Minden más, ami ma működik, változatlan marad.

A vizuális mintát az elrendezés-prototípus adja (`advent-elrendezes-prototipus.html`). Ezt érdemes a repo `docs/` mappájába tenni, de a kódját **nem** kell átmásolni: csak a méreteket, térközöket, töréspontokat és az ajtóelhelyezést kell átvenni belőle.

## Ami nem változhat

Az ágon minden változás CSS-ben és a komponensek elrendezésében történik. Ha egy lépés az alábbiak bármelyikét módosítaná, meg kell állni és rákérdezni.

- **Animációk:** az ajtónyitás 3D forgatása és időzítése, a betöltéskori „lepottyanás”, a hóesés, a visszaszámláló ugrása, a dialógus és a kvíz animációi, a konfetti, a dísz leesése és lengetése a fán. Ezek csak új helyre kerülnek, nem íródnak át.
- **Ajtók kinézete:** színek, csomagolópapír-minták, szalagok, kilincs, számtábla, a nyitott ajtó mostani megjelenése (sötét belső, arany ikon). Csak a méretük és a helyük változik.
- **Fa és díszek:** a fa rajza, a 24 dísz grafikája és a díszek helye a fán.
- **Napi játék:** a dialógus, a kvíz, az emoji-rejtvény, az idézet, az átugrás és a folytatás logikája.
- **Állapot:** a `SaveData` és `Settings` séma, a localStorage kulcsok és a reducer. Egy meglévő mentésnek az ág telepítése után is működnie kell.
- **Döntések:** dátumzár, Szentestére számláló visszaszámlálás (másodperccel együtt), kétnyelvűség, hangeffektek és zene külön kapcsolóval, megosztható kártya, december 24. bővített tartalma.
- **Szövegek:** meglévő i18n kulcs nem törlődik és nem íródik át. Ha új szöveg kell, új kulcs kerül mindkét szótárba.
- **Akadálymentesség:** billentyűzetes nyitás, fókuszkeret, `prefers-reduced-motion` viselkedés, sötét és világos mód.

## Fejléc

A fejléc a mostani kb. 500–600 px helyett egyetlen, kb. 60–70 px magas sor lesz, hogy a kalendárium az első képernyőn teljes egészében látszódjon.

**Széles nézet (≥ 1100 px), balról jobbra:**

1. **Cím:** „Advent 2026”, a meglévő rétegzett, arany–zöld árnyékos stílussal, de kisebben: `font-size: clamp(2rem, 4.2vw, 3.2rem)`, balra igazítva. A cím meglévő animációja marad.
2. **Bevezető mondat:** közvetlenül a cím mellett, alapvonalra igazítva (`align-items: baseline`), kb. 1 rem méretben. Ha a meglévő szöveg túl hosszú, új rövid kulcs kerül a szótárakba (`header.taglineShort`), pl. „Minden nap egy új ablak – nyisd ki a mait!” / „A new window every day – open today’s!”.
3. **Rugalmas térköz** (`flex: 1`).
4. **Visszaszámláló:** a „Szentestéig” felirat a dobozok előtt, egy sorban. A négy egység (nap, óra, perc, másodperc) megmarad, de kompakt dobozokban: kb. 3 rem széles, 1,35 rem-es szám, 0,68 rem-es címke, 3 px-es piros alsó perem.
5. **Kapcsolók:** hangeffekt, zene, majd HU / EN, 34 px magas gombokkal, változatlan működéssel.

**Keskeny nézet (< 640 px):** minden elem középre igazítva, sortöréssel: cím, alatta a bevezető mondat, alatta a kapcsolók, legalul a visszaszámláló. 640 és 1100 px között a fejléc `flex-wrap: wrap` mellett magától rendeződik.

**Nyitási banner:** a „December 1-jén nyílik” felirat kikerül a fejlécből, és a kalendárium táblájának tetejére kerül, a tábla belső szélességében: fehér pill, sötétzöld félkövér szöveg, 3 px-es arany alsó perem, kb. 0,92 rem. Szövege és megjelenési feltétele nem változik.

## Törzs: egymás mellett, keskenyen egymás alatt

A kalendárium és a fa egy közös `.layout` rácsba kerül (max. szélesség 1320 px, oldalsó padding `clamp(12px, 3vw, 32px)`). Az egyetlen töréspont 1100 px: felette két oszlop, alatta egy.

```css
.layout {
  display: grid;
  gap: 18px;
}

@media (min-width: 1100px) {
  .layout {
    grid-template-columns: minmax(0, 1fr) minmax(320px, 400px);
    gap: 22px;
    align-items: start;
  }
  /* a tábla a képernyő magasságához igazodik, a 7:5-ös rács miatt ×1,4 */
  .board {
    width: 100%;
    max-width: calc((100dvh - 150px) * 1.4 + 32px);
    margin-left: auto;
  }
  /* a fa kártya ragad, és pontosan olyan magas, mint a tábla */
  .tree-panel {
    position: sticky;
    top: calc(16px + env(safe-area-inset-top, 0px));
    height: var(--board-h);
  }
}
```

- **Magasság-szinkron:** egy `ResizeObserver` figyeli a táblát, és az `offsetHeight`-ját a `--board-h` CSS változóba írja. Így a fa kártya teteje és alja egy vonalban van a kalendáriuméval. Ez egy kis `useElementHeight` hookban éljen.
- **Egy képernyő:** 1366 × 768-on és 1920 × 1080-on a fejléc, a teljes tábla és a fa görgetés nélkül látszódjon. A `150px` a fejléc, a banner és a margók összege; ha a kész fejléc más magas, ezt kell hozzáigazítani.
- **Keskeny nézet (< 1100 px):** a kalendárium teljes szélességű, alatta a fa kártya. A kártya magassága automatikus, a fa SVG-je `width: 100%; max-width: 420px; aspect-ratio` a viewBox arányával, középre igazítva. Nincs nézetváltó, nincs forgatás.
- **Vízszintes görgetés:** egyik szélességnél sem lehet; a rács oszlopai `minmax(0, …)`-t használnak, hogy hosszú tartalom ne nyomja szét őket.

## Hézagmentes ajtórács

Az ajtók ezentúl nem `grid-auto-flow: dense`-szel, hanem fix, kézzel megadott helyre kerülnek, így a tábla minden cellája ki van töltve, üres rész nem marad. Két elrendezés van: széles nézetben 7 oszlop × 5 sor (`aspect-ratio: 7 / 5`), keskenyben 5 oszlop × 7 sor (`aspect-ratio: 5 / 7`). Mindkettő 35 cella: egy 2 × 2-es ajtó (a 24.), nyolc kétcellás és tizenöt egycellás.

A `layout.ts` minden ajtója két új mezőt kap (`areaWide`, `areaNarrow`), a szín, minta és szalag változatlan marad. A komponens CSS változókként adja át őket, a médialekérdezés pedig választ:

```css
.calendar {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(7, 1fr);
  aspect-ratio: 5 / 7;
}
.door {
  grid-area: var(--area-narrow);
}

@media (min-width: 1100px) {
  .calendar {
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(5, 1fr);
    aspect-ratio: 7 / 5;
  }
  .door {
    grid-area: var(--area-wide);
  }
}
```

Az értékek `sor / oszlop / span sorok / span oszlopok` formában:

| Nap | Széles (7 × 5)            | Keskeny (5 × 7)           |
| --- | ------------------------- | ------------------------- |
| 1   | `1 / 5 / span 1 / span 1` | `2 / 4 / span 1 / span 1` |
| 2   | `2 / 6 / span 1 / span 1` | `4 / 3 / span 1 / span 1` |
| 3   | `3 / 3 / span 1 / span 1` | `5 / 5 / span 1 / span 1` |
| 4   | `1 / 2 / span 1 / span 1` | `1 / 4 / span 1 / span 1` |
| 5   | `4 / 7 / span 2 / span 1` | `5 / 4 / span 2 / span 1` |
| 6   | `2 / 1 / span 1 / span 2` | `3 / 4 / span 1 / span 2` |
| 7   | `4 / 5 / span 1 / span 1` | `6 / 1 / span 1 / span 1` |
| 8   | `1 / 4 / span 1 / span 1` | `2 / 3 / span 1 / span 1` |
| 9   | `3 / 1 / span 1 / span 1` | `4 / 5 / span 1 / span 1` |
| 10  | `5 / 4 / span 1 / span 1` | `6 / 3 / span 1 / span 1` |
| 11  | `1 / 7 / span 1 / span 1` | `3 / 3 / span 1 / span 1` |
| 12  | `4 / 1 / span 2 / span 1` | `4 / 1 / span 2 / span 1` |
| 13  | `1 / 1 / span 1 / span 1` | `1 / 3 / span 1 / span 1` |
| 14  | `5 / 2 / span 1 / span 2` | `7 / 1 / span 1 / span 2` |
| 15  | `3 / 2 / span 2 / span 1` | `3 / 2 / span 2 / span 1` |
| 16  | `5 / 5 / span 1 / span 1` | `7 / 3 / span 1 / span 1` |
| 17  | `1 / 6 / span 1 / span 1` | `3 / 1 / span 1 / span 1` |
| 18  | `4 / 6 / span 1 / span 1` | `6 / 2 / span 1 / span 1` |
| 19  | `2 / 7 / span 1 / span 1` | `4 / 4 / span 1 / span 1` |
| 20  | `5 / 6 / span 1 / span 1` | `7 / 4 / span 1 / span 1` |
| 21  | `1 / 3 / span 2 / span 1` | `1 / 5 / span 2 / span 1` |
| 22  | `3 / 6 / span 1 / span 2` | `6 / 5 / span 2 / span 1` |
| 23  | `4 / 3 / span 1 / span 2` | `5 / 2 / span 1 / span 2` |
| 24  | `2 / 4 / span 2 / span 2` | `1 / 1 / span 2 / span 2` |

**Teszt (`layout.test.ts`):** mindkét elrendezésre felépít egy üres mátrixot (7 × 5, illetve 5 × 7), bejegyzi minden ajtó celláit, és ellenőrzi, hogy minden cella pontosan egyszer foglalt, egyik ajtó sem lóg ki a rácsból, és mind a 24 nap pontosan egyszer szerepel. Így egy későbbi átrendezésnél sem maradhat lyuk.

**Méretek:** az ajtók közti rés `clamp(5px, .8vw, 10px)`, a tábla belső margója `clamp(8px, 1.4vw, 16px)`. A számtábla és a nyitott ajtó ikonja `clamp()`-pel skálódik, hogy kisebb cellában is kiférjen. Ha a nyitási animáció közben az ajtószárny kilóg a táblából vagy egy szomszédos ajtóra, ez ugyanúgy viselkedjen, mint ma; ha az új méreteknél zavaróvá válik, kérdezz rá, mielőtt az animációhoz nyúlsz.

## Fa kártya és a díszítés pillanata

A fa egy saját kártyába kerül (`TreePanel`), ami kerettel és címmel egységként jelenik meg a kalendárium mellett. A fa rajza, a díszek és a meglévő díszanimációk változatlanul kerülnek bele.

**A kártya:**

- 26 px-es lekerekítés, enyhén átlátszó háttér (sötét módban `rgba(255,255,255,.04)`, világosban `rgba(255,255,255,.55)`), 2 px-es keret a fenyőzöld 55%-ával, ugyanolyan árnyék, mint a kalendáriumtáblán.
- Felül a meglévő „A mi fánk” cím, középen a fa (széles nézetben `flex: 1`, hogy kitöltse a kártya magasságát), alul a statisztikasáv.
- A kalendáriummal azonos magas, széles nézetben ragad (lásd a Törzs fejezetet).

**Arany keret díszítéskor:** amikor egy nap a fára teszi a díszét, a kártya köré arany keret kerül: `box-shadow: 0 0 0 4px var(--gold), <a kártya saját árnyéka>`, 0,4 s-os átmenettel be és ki. A keret a dísz leesésének indulásával jelenik meg, és kb. 1,4 s múlva tűnik el, így egyértelmű, hol történik a jutalom. Egy `isDecorating` állapot vezérli, ami a meglévő „dísz megszerezve” eseményre indul. A keret mozgás nélküli, ezért `prefers-reduced-motion` mellett is megjelenik, csak az átmenet marad el.

**A sorrend a dialógus bezárása után:**

1. **Széles nézetben** a fa már látszik: azonnal indul az arany keret és a meglévő díszleesés-animáció (és a meglévő csillogó hang).
2. **Keskeny nézetben** előbb az oldal a fához görget (`scrollIntoView({ behavior: 'smooth', block: 'center' })`), majd kb. 550 ms múlva indul a keret és a díszleesés, hogy a játékos lássa a dísz érkezését. Visszagörgetés nincs.
3. **Csökkentett mozgásnál** a görgetés azonnali (`behavior: 'auto'`), késleltetés nélkül.

Ez minden olyan úton ugyanígy fut, ahol ma dísz jár: a nap végigjátszása után és a dialógus idő előtti bezárásakor is.

**Statisztikasáv a fa alatt:** a mostani külön álló pillek és gombok egy sorba kerülnek: egy fehér pill „9 / 24 dísz a fán · 5 pont” szöveggel, mellette a meglévő Megosztom gomb. A külön „X / 24 ablak nyitva” pill elmarad, mert mindig ugyanazt a számot mutatja, mint a díszek száma. Az „Előrehaladás törlése” a láblécbe kerül, kisebb, aláhúzott szöveges linkként; a meglévő megerősítő kérdés változatlan.

## Munkamenet lépésről lépésre

A munka egy friss ágon, kis, külön-külön ellenőrizhető commitokban halad. Minden lépés után fusson le a `yarn test` és a `yarn build`, és a változást böngészőben (`yarn dev`) széles és keskeny ablakméretben is nézd meg.

```bash
git checkout main
git pull
git checkout -b feature/split-layout
```

1. **Felmérés, commit nélkül:** nézd át az `App`, a `Header`, a `Calendar`, a `Door`, a `TreeScene` és a `ProgressSummary` komponenst és a stílusokat, és írd le röviden, mit hol fogsz módosítani. Ha valami ütközik a „Mi nem változhat” listával, itt jelezd.
2. **`feat(layout): álló ajtóelhelyezés`** – `areaWide` / `areaNarrow` a `layout.ts`-ben, a két rács CSS-e és a `layout.test.ts`.
3. **`feat(layout): tömör fejléc`** – egysoros fejléc, kompakt visszaszámláló, a banner átköltöztetése a tábla tetejére, szükség esetén az új rövid szövegkulcs mindkét nyelven.
4. **`feat(layout): kétoszlopos törzs`** – `.layout` rács, a tábla magasságának képernyőhöz igazítása, `TreePanel` sticky pozícióval és a `--board-h` szinkronnal.
5. **`feat(tree): arany keret és görgetés díszítéskor`** – `isDecorating` állapot, keskeny nézetben görgetés a fához a díszleesés előtt.
6. **`feat(tree): összevont statisztikasáv`** – egysoros pill + Megosztom, a törlés a láblécbe.
7. **`chore: takarítás`** – a már nem használt stílusok és pillek eltávolítása. Az ilyen törléseket listázd, mielőtt ténylegesen törlöd őket.

```bash
git push -u origin feature/split-layout
```

A push után nyiss egy pull requestet a `main`-be. A Netlify erre automatikusan **Deploy Preview**-t készít, így telefonon is kipróbálható, mielőtt a `main`-be kerül.

**Meglévő mentés ellenőrzése:** a Deploy Preview külön címen fut, ott nincs régi mentés. Ezért helyben érdemes tesztelni: a `main` ágon `yarn dev` mellett nyiss ki néhány napot, ugorj át egy kvízt, majd válts a `feature/split-layout` ágra, és töltsd újra az oldalt ugyanazon a címen. A nyitott ajtóknak, a díszeknek és a folytatható résznek változatlanul meg kell maradnia.

## Elfogadási feltételek

Az ág akkor mehet a `main`-be, ha az alábbiak mindegyike teljesül, világos és sötét módban, magyarul és angolul is.

- [ ] 1920 × 1080-on és 1366 × 768-on a fejléc, a teljes kalendárium és a teljes fa görgetés nélkül látszik, egymás mellett.
- [ ] A kalendáriumban egyik méretnél sincs üres cella vagy látható lyuk, és a `layout.test.ts` zöld.
- [ ] A fa kártya teteje és alja egy vonalban van a kalendáriumtáblával, és görgetéskor a helyén marad.
- [ ] 1100 px alatt a fa a kalendárium alatt van; 390 px széles telefonon sincs vízszintes görgetés, és a számtáblák olvashatók.
- [ ] Dísz megszerzésekor arany keret jelenik meg a fa kártya körül, kb. 1,4 s-ig; keskeny nézetben az oldal előbb a fához görget.
- [ ] Az ajtónyitás, a betöltési animáció, a hóesés, a dialógus, a kvíz, a rejtvény, a konfetti és a díszleesés ugyanúgy néz ki és ugyanakkor fut, mint a `main` ágon.
- [ ] A visszaszámláló másodperccel együtt fut, a dátumzár és a nyitási banner ugyanúgy működik.
- [ ] A hangkapcsolók, a nyelvváltó és a megosztás változatlanul működik; az angol szövegek sem törik szét a fejlécet.
- [ ] Egy `main` ágon készült mentés az ágra váltás után hiánytalanul betöltődik.
- [ ] Billentyűzettel minden ajtó elérhető és nyitható, a fókuszkeret látszik; `prefers-reduced-motion` mellett a görgetés azonnali.
- [ ] A `yarn test` és a `yarn build` hiba nélkül lefut, a Netlify Deploy Preview elkészül.
