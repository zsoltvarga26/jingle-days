# Fejlesztési terv – fázisok, elfogadási feltételek, vágási lista

Ez a dokumentum a specifikáció ütemtervét bontja le ellenőrizhető lépésekre. Minden fázis egy Claude Code-kérésnek felel meg, a „Kész, ha” lista pedig az, amit utána böngészőben végig kell nézni. Az `A1`, `B3` stb. hivatkozások az [átnézés](01-spec-atnezes.md) pontjaira mutatnak; ezek mind elfogadott döntések, és a [specifikációban](SPEC.md) is szerepelnek.

## Sorrend és mérföldkövek

A spec sorrendje (alap → kvíz → rejtvény → fa → hang → kártya) jó, két módosítással:

1. **Deploy az első napon.** Az üres Vite-oldal is menjen ki Netlifyra, a végleges címmel. Így a Yarn/Node beállítás hibái azonnal kiderülnek, és a localStorage-domain kérdése (a mentés domainhez kötött) el van intézve.
2. **A fa két lépésben.** Előbb egy egyszerű, működő változat (fa + gömbök), a többi díszalakzat és az animáció csiszolása csak a kötelező részek után.

| Mérföldkő | Céldátum | Tartalom |
| --- | --- | --- |
| M0 | nov. 12. | Repo, Vite váz, első Netlify deploy |
| M1 | nov. 15. | 1. fázis: kalendárium, dátumzár, mentés, i18n váz |
| M2 | nov. 19. | 2–3. fázis: teljes napi dialógus 2–3 mintanappal |
| M3 | nov. 22. | 4a fázis: egyszerű fa; innentől a játék végigjátszható |
| M4 | nov. 25. | Tartalom kész mind a 24 napra; 5–6. fázis, amennyi belefér |
| M5 | nov. 28. | Tesztelés kész, éles |

## Vágási lista

Ha csúszik a munka, alulról felfelé hagyható el. A határvonal fölötti részek nélkül nincs kalendárium.

| Prioritás | Rész | Ha kimarad |
| --- | --- | --- |
| Kötelező | 1–3. fázis, 24 nap tartalma, egyszerű fa (4a), élesítés | – |
| Fontos | Angol nyelvű **tartalom** | A váz kétnyelvű marad; az angol tartalom december elején naponta pótolható, mert a napok úgyis zárolva vannak. |
| Jó, ha van | A további díszalakzatok és az animáció (4b) | Minden dísz színes gömb vagy csillag. |
| Jó, ha van | Hangeffektek | Néma oldal; a kapcsolók ne jelenjenek meg. |
| Elhagyható | Megosztható kártya | A „Megosztom” gomb csak szöveget és linket másol. |
| Elhagyható | Háttérzene | Indulás után is betehető. |
| Elhagyható | Konfetti | Nem hiányzik senkinek. |

Indulás után is lehet deployolni, de a mentés formátumát és a tartalom azonosítóit nem szabad megtörni (lásd a [tartalom-útmutató](03-tartalom-utmutato.md) „Indulás után” szakaszát).

---

## 0. fázis – Előkészítés

- `git init`, `.gitignore`, GitHub repó.
- A protótípus már a helyén van: `docs/prototype.html`.
- Vite váz a meglévő mappába (**E4**), Yarn beállítása a spec szerint, `@fontsource/baloo-2` (**C10**), `"test": "vitest"` szkript.
- `netlify.toml` a spec szerint, kiegészítve az **A2** szerinti `deploy-preview` környezettel.
- Netlify bekötése, végleges cím beállítása.

**Kész, ha:** a `yarn dev`, `yarn test`, `yarn build` hiba nélkül fut; a Netlify-cím betölt; a deploy naplóban a várt Yarn- és Node-verzió látszik.

## 1. fázis – Alap

Hatókör: `tokens.css`, `global.css`, `Header`, `LanguageSwitch`, `Countdown`, `StartBanner`, `Snowfall`, `Calendar`, `Door`; `lib/dates.ts`; `state/` (típusok, reducer, `storage.ts`); `i18n/`.

Külön figyelni:

- `dates.ts`: helyi idejű dátumok, `YEAR` konstans (**B6**); `useNow()` hook, ami éjfélkor és `visibilitychange`-re frissít (**B5**); `VITE_UNLOCK_ALL` és `?date=` (**A2**).
- Reducer: a spec akciói + `HYDRATE` (**B2**); a dísz az `OPEN_DAY`-nél jár (**A1**).
- `storage.ts`: `try/catch`, verzióellenőrzés, `migrate()` váz, írás csak változáskor.
- Zárolt ajtó: `aria-disabled`, relatív üzenet (**A3**, **C3**).
- Ebben a fázisban az ajtó kattintásra csak megnyílik és mentődik, dialógus még nincs.

**Kész, ha:**

- [ ] A kalendárium a protótípussal egymás mellé téve nem különböztethető meg (világos és sötét módban, 360 px és 1280 px szélességen). *Géppel összevetve: a rács, a tábla, a cím és az ajtók színei, mintái egyeznek; a szemrevételezés még hátravan. Szándékos eltérés: nyelvváltó a fejlécben, halványabb zárolt ajtók.*
- [x] `?date=2026-11-20`: minden ajtó zárolt, a banner „még 11 nap”-ot ír; kattintásra rázkódás és üzenet.
- [x] `?date=2026-12-10`: az 1–10. ajtó nyitható, a 11–24. zárolt; `?date=2026-12-26`: mind nyitható, a visszaszámláló helyén üdvözlet.
- [x] Megnyitott ajtó frissítés után is nyitva van; a localStorage kézi elrontása után az oldal üres mentéssel betölt, nem omlik össze.
- [x] Nyelvváltásra minden látható szöveg vált, a `<html lang>` és a fülcím is; a választás frissítés után megmarad.
- [x] Tabbal minden ajtó elérhető, Enterrel/szóközzel nyitható, a fókuszkeret látszik.
- [ ] `prefers-reduced-motion` mellett nincs hóesés és belépő animáció. *A CSS megvan, de böngészőben még nincs kipróbálva.*
- [x] Tesztek: `dates` (határesetek: nov. 30. 23:59, dec. 1. 00:00, dec. 24., dec. 25.), reducer, `storage` (hibás JSON, ismeretlen verzió), szótárkulcsok egyezése.

## 2. fázis – Napi dialógus és kvíz

Hatókör: `DayDialog` (natív `<dialog>`, lépésjelző, mobilon alsó lap), `QuizStep`, `lib/shuffle.ts`, az összefoglaló nézet nyitott ajtóhoz; 2–3 mintanap a `days.ts`-ben, köztük egy 24. napi (5 kérdés).

Külön figyelni:

- Keverés kérdés-`id` szerinti seeddel; a mentés eredeti indexet tárol (**B1**).
- A `QuizStep` nem tudja, hányadik nap van: a pöttyök száma a tömb hosszából jön.
- Visszajelzés szövegben és `aria-live`-val is (**C4**).
- `<dialog>` mock a teszt-setupban, ha kell (**B7**).

**Kész, ha:**

- [x] Egy kérdés látszik egyszerre; választás után a helyes zöld, a hibás választott piros, megjelenik az `explanation` (ha van) és a „Következő kérdés”.
- [x] Megválaszolt kérdésre nem lehet újra kattintani; frissítés után a kvíz ugyanott folytatódik.
- [x] „Kvíz kihagyása” a 2. kérdésnél: az 1. válasz megmarad; az összefoglalóban „Folytatom”, ami a 2. kérdésre visz.
- [x] Ugyanaz a kérdés minden betöltéskor ugyanabban a sorrendben mutatja a válaszokat; egy napon belül a helyes válasz nem mindig ugyanott van.
- [x] Esc és a háttérre kattintás bezár (**C2**); bezárás után a fókusz visszakerül az ajtóra.
- [x] Nyelvváltás nyitott dialógus közben nem veszít el állapotot.
- [x] 360 px szélességen a dialógus alsó lap, a válaszgombok kényelmesen megnyomhatók (legalább 44 px magasak).
- [x] Tesztek: `shuffle` (determinisztikus, permutáció), reducer (`ANSWER_QUESTION`, `SKIP_QUIZ`, `RESUME_STEP`), tartalomteszt (lásd a [tartalom-útmutatót](03-tartalom-utmutato.md)).

## 3. fázis – Emoji-rejtvény és zárás

Hatókör: `EmojiStep`, `lib/normalize.ts`, `QuoteStep`, a dialógus teljes folyamata a végéig.

**Kész, ha:**

- [x] `normalize()` tesztek: „JÉGVARÁZS!”, „ jegvarazs ”, „A Grincs” = „grincs”, „The Grinch” = „grinch”, üres bemenet nem egyezik semmivel.
- [x] Magyar felületen az angol megfejtés is elfogadott, és fordítva.
- [x] Hibás válasz: rázkódás + szöveges üzenet, a mező tartalma megmarad és ki van jelölve; Enter is beküld.
- [x] A 2. tipp csak az 1. után nyitható; a felfedett tippek frissítés után is nyitva vannak.
- [x] „Rejtvény kihagyása” nem mutatja a megfejtést; a 24. napon csak az aktuális rejtvényt ugorja.
- [x] Megfejtett rejtvényre visszatérve csak az eredmény látszik.
- [x] Az idézet lépésén látszik a dísz neve és képe (ekkor még helykitöltő is lehet); a gomb bezárja a dialógust.
- [x] A fejlécben vagy a `ProgressSummary`-ben a pontszám helyesen számolódik (számolt érték, nincs a mentésben).

## 4. fázis – Fenyőfa

**4a – egyszerű fa (kötelező):** `TreeScene` SVG (`viewBox="0 0 100 120"`), 24 hely a tartalomfájlból (**A5**), `Bauble` és `Star` alakzat, megszerzett/nem megszerzett megjelenés, számláló, `ProgressSummary` visszaállítással.

**4b – díszek és animáció (ha belefér):** a további tíz alakzat a spec díszlistája szerint (**A6**, **A7**, **C9**), leeső dísz animációja, görgetés a fához, a 24. nap fényei és záróüzenete.

Külön figyelni: a színek SVG-attribútumként, `palette` propon át érkezzenek, ne CSS-osztályból – különben a megosztókártya nem tudja kirajzolni a fát (**B3**).

**Kész, ha (4a):**

- [x] Megnyitott napok díszei teli színnel, a többi szaggatott körvonallal látszik; a számláló stimmel.
- [x] Egyik díszhely sem lóg ki a fáról, és nem fedik egymást 360 px szélességen sem.
- [x] A visszaállítás megerősítést kér, utána a fa üres, de a nyelv és a hangbeállítás megmarad.

**Kész, ha (4b):**

- [x] A dialógus bezárása után az oldal a fához görget, az új dísz a helyére esik; félbeszakított napnál ez a következő betöltéskor történik meg (**A1**).
- [ ] `prefers-reduced-motion` mellett a dísz animáció nélkül jelenik meg. *A kód és a CSS megvan, de böngészőben még nincs kipróbálva.*
- [x] `?date=2026-12-24` és mind a 24 nap megnyitva: fények és záróüzenet.

## 5. fázis – Hang és zene

Hatókör: `src/audio/` a spec szerint, `SoundControls`.

**Kész, ha:**

- [ ] Az oldal betöltésekor nincs hang és nincs konzolfigyelmeztetés az `AudioContext`-ről; az első kattintás után szólnak az effektek.
- [ ] A hat esemény hangja megkülönböztethető, egyik sem bántó fülhallgatóval sem.
- [ ] A két kapcsoló egymástól függetlenül működik, az állapotuk és a hangerő frissítés után megmarad.
- [ ] Mentett „zene: be” mellett a zene az első kattintásra indul, nem magától.
- [ ] Másik fülre váltva a zene elhalkul és megáll, visszatérve folytatódik; a ritmus nem akad görgetés és animáció közben.
- [ ] Kipróbálva asztali Chrome-ban, Firefoxban és egy valódi iPhone-on (Safari).

## 6. fázis – Megosztható kártya

Hatókör: `lib/shareCard.ts`, `ShareCard`.

**Kész, ha:**

- [ ] A PNG 1080 × 1350 px, Baloo 2 betűvel, sötét módban is világos színekkel; a fa a tényleges díszekkel látszik (**B3**).
- [ ] A kép a dialógus megnyitásakor készül el, a megosztás gomb kész fájlt ad át (**B4**).
- [ ] Mobilon (Android Chrome, iOS Safari) a rendszer megosztási menüje nyílik; asztalon „Kép letöltése” és „Szöveg másolása” jelenik meg.
- [ ] A kártya szövege az aktív nyelvű; 0 megnyitott nappal is értelmes.
- [ ] `public/og-image.png` és az `og:` metaadatok a helyükön vannak; a link előnézete egy csevegőalkalmazásban ellenőrizve.

## 7. fázis – Tartalom (párhuzamosan)

Lásd: [tartalom-útmutató](03-tartalom-utmutato.md).

## 8. fázis – Tesztelés és élesítés

Lásd: [tesztelés és élesítés](04-teszteles-es-elesites.md).
