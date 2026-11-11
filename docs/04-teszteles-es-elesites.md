# Tesztelés és élesítés

A specifikáció 8. fázisának („mobil, sötét mód, billentyűzet, mindkét nyelv, Netlify, végleges domain”) kibontása: mit tesztel a gép, mit kell kézzel végignézni, és mi a teendő az indulás napján és utána.

## Automatikus tesztek (Vitest)

A tesztek a logikára koncentrálnak; a megjelenést és az animációkat kézzel nézzük.

| Terület | Fájl | Mit ellenőriz |
| --- | --- | --- |
| Dátumzár | `lib/dates.test.ts` | nov. 30. 23:59 → minden zárolt; dec. 1. 00:00 → az 1. nyitható; dec. 10. → 1–10.; dec. 25. és 2027. jan. → mind; hátralévő napok száma; a visszaszámlálás célpontja |
| Válaszellenőrzés | `lib/normalize.test.ts` | kis/nagybetű, ékezet, írásjel, szóköz, névelő (a, az, the), üres bemenet, keresztnyelvű egyezés |
| Keverés | `lib/shuffle.test.ts` | azonos seed → azonos sorrend; az eredmény permutáció; különböző kérdés-`id` → jellemzően más sorrend |
| Reducer | `state/progress.test.ts` | minden akció; megválaszolt kérdés nem írható felül; kihagyás megőrzi a meglévő válaszokat; `RESUME_STEP` az első megválaszolatlanhoz visz; a 2. tipp nem nyitható az 1. előtt; `RESET` |
| Pontszám | `state/progress.test.ts` | üres mentés → 0; teljes mentés → 74 + 25 |
| Mentés | `state/storage.test.ts` | oda-vissza alakítás; hibás JSON, ismeretlen verzió, hiányzó mező → üres mentés; dobó `localStorage` nem omlaszt; nincs írás, ha nem változott semmi |
| Szótárak | `i18n/i18n.test.ts` | a `hu` és az `en` kulcsai megegyeznek, nincs üres érték, a `{paraméterek}` mindkét nyelven ugyanazok |
| Tartalom | `content/days.test.ts` | lásd a [tartalom-útmutató](03-tartalom-utmutato.md) listáját |
| Komponensek | néhány `*.test.tsx` | `QuizStep`: választás → visszajelzés → tovább; `EmojiStep`: hibás, majd helyes válasz, tippek sorrendje; `Door`: három állapot |

A dátumfüggő tesztek a „mostani időt” paraméterként kapják (vagy `vi.setSystemTime`), soha nem a valódi órát olvassák.

## Kézi tesztmátrix

Eszközök, amiken az indulás előtt legalább egyszer végig kell menni:

| Eszköz | Böngésző | Miért |
| --- | --- | --- |
| Asztali | Chrome vagy Edge | Alapeset |
| Asztali | Firefox | `<dialog>`, Web Audio és betűrenderelés eltérései |
| iPhone | Safari | Web Audio feloldása, alsó lap, Web Share, 3D ajtóanimáció |
| Android telefon | Chrome | Web Share fájllal, teljesítmény gyengébb gépen |

Mindegyiken világos és sötét módban, magyarul és angolul. A Deploy Preview-n (ahol minden ajtó nyitható) érdemes tesztelni, nem a fejlesztői szerveren.

## Kézi forgatókönyvek

**1. Első látogató december 1. előtt.** Friss böngésző (privát ablak) → banner a hátralévő napokkal → kattintás egy ajtóra: rázkódás és üzenet → nyelvváltás → frissítés után a nyelv megmarad.

**2. Egy teljes nap.** Ajtó nyitása → három kérdés (legalább egy hibás válasszal) → rejtvény: hibás válasz, 1. tipp, 2. tipp, helyes válasz → idézet → dísz a fán → a számláló és a pontszám nőtt.

**3. Kihagyás és visszatérés.** Kvíz kihagyása a 2. kérdésnél → rejtvény kihagyása → a dísz megvan → az ajtón arany pötty → összefoglaló: „Folytatom” a kvíznél a 2. kérdésre visz, a rejtvény tisztán újrapróbálható → mindkettő befejezve a pötty eltűnik.

**4. Megszakítás.** Dialógus közben: Esc; a háttérre kattintás; a fül bezárása; oldalfrissítés. Mindegyik után: az állapot megmaradt, a dísz megvan, a nap folytatható.

**5. December 24.** Öt kérdés öt pöttyel → két rejtvény „1 / 2”, „2 / 2” jelzéssel → az első kihagyása nem ugorja a másodikat → a 24. dísz után fények és záróüzenet → a megosztás felajánlása.

**6. Hang.** Betöltés után csend → első kattintásra effekt → effektek ki, zene be → hangerő → másik fülre váltás és vissza → frissítés: a beállítások megmaradtak, a zene az első kattintásig vár.

**7. Megosztás.** Kártya 0, néhány és 24 dísszel; mindkét nyelven; sötét módban is világos; mobilon megosztási menü, asztalon letöltés és másolás.

**8. Visszaállítás.** Megerősítés kér → nemleges válaszra semmi nem változik → igenre a fa és az ajtók alaphelyzetben, a nyelv és a hang beállításai megmaradnak.

**9. Két fül.** Ugyanaz az oldal két fülön: az egyikben megnyitott nap a másikban is megjelenik, villogás és végtelen frissülés nélkül.

**10. Éjfél.** A gép óráját 23:59-re állítva (vagy fejlesztői módban szimulálva) az oldal nyitva marad: éjfél után a következő ajtó frissítés nélkül nyithatóvá válik.

## Akadálymentesség

- [ ] Egér nélkül végigjátszható egy teljes nap; a fókusz mindig látható, és a dialógusból nem szökik ki.
- [ ] A dialógus bezárása után a fókusz a megnyitó ajtóra kerül vissza.
- [ ] Képernyőolvasóval (NVDA vagy VoiceOver) az ajtók neve és állapota értelmes („5. nap, zárolt, 3 nap múlva nyílik”); a helyes/hibás visszajelzés elhangzik.
- [ ] A dekoratív elemek (hó, konfetti, csillogás) `aria-hidden`-ek.
- [ ] `prefers-reduced-motion`: nincs hóesés, belépő animáció, konfetti, dísz-leesés.
- [ ] Kontraszt: a szöveg és a gombfeliratok mindkét színmódban olvashatók (különösen arany és rózsaszín háttéren).
- [ ] 200%-os nagyításnál és 320 px szélességen sincs vízszintes görgetés, levágott szöveg.
- [ ] A hosszabb angol vagy magyar szövegek sehol nem törik szét a gombokat.

## Teljesítmény

- [ ] Lighthouse (mobil) a Netlify-címen: teljesítmény és akadálymentesség 90 fölött.
- [ ] A JavaScript-csomag tömörítve 150 kB alatt marad (React + tartalom + konfetti).
- [ ] A hóesés és az ajtóanimáció gyengébb telefonon sem akad; a hópelyhek száma mobilon csökkenthető.
- [ ] A betűtípus betöltése közben nincs látványos ugrás (`font-display: swap`, előtöltés).

## Élesítés előtti lista (november 28-ig)

- [ ] A végleges cím be van állítva és HTTPS-en betölt. (A mentés domainhez kötött: december 1. után a cím már nem változhat.)
- [ ] Az éles (production) környezetben a `VITE_UNLOCK_ALL` **nincs** beállítva; az éles oldalon minden ajtó zárolt, és a `?date=` paraméternek nincs hatása.
- [ ] A Deploy Preview-n minden ajtó nyitható, és mind a 24 nap végig lett játszva mindkét nyelven.
- [ ] `yarn test` és `yarn build` hiba és figyelmeztetés nélkül fut.
- [ ] A böngészőkonzolban nincs hiba vagy figyelmeztetés az éles oldalon.
- [ ] `<title>`, leírás, `og:title`, `og:description`, `og:image`, favicon a helyén; a link előnézete ellenőrizve.
- [ ] A tartalom tényellenőrzése megtörtént (lásd a [tartalom-útmutatót](03-tartalom-utmutato.md)).
- [ ] A localStorage kulcsai véglegesek (`advent-2026:v1`, `advent-2026:settings`).
- [ ] A saját tesztmentésed törölve van az éles címen.

## Az indulás napja (december 1.)

- [ ] 00:00 után az 1. ajtó nyitható, a banner eltűnt, a többi ajtó zárolt.
- [ ] Egy teljes nap végigjátszva telefonon, az éles címen.
- [ ] A megosztott link előnézete rendben.

## Indulás után

- **Javítás deployolható**, de a mentés formátuma és a tartalom azonosítói nem törhetnek meg (a szabad/tilos táblázat a [tartalom-útmutató](03-tartalom-utmutato.md) végén van).
- Ha a `SaveData` szerkezete mégis változik: `version: 2` és `migrate()` teszttel, ami egy valódi v1 mentést alakít át.
- Új funkció (pl. utólag betett zene vagy kártya) előbb a Deploy Preview-n legyen kipróbálva egy **meglévő mentéssel**, nem csak üres böngészőben.
- Hiba esetén a Netlify „Deploys” listájában egy korábbi deploy egy kattintással visszaállítható.
- December 6-án és 24-én (Mikulás, Szenteste) érdemes ránézni az oldalra: ezek a legforgalmasabb napok, és a 24. az egyetlen eltérő szerkezetű nap.
