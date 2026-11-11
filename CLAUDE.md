# Adventi kalendárium 2026

Böngészőben futó, kétnyelvű (magyar/angol) adventi kalendárium React + Vite + TypeScript alapon. Backend nincs, az előrehaladás localStorage-ban él, a kiadás Netlifyon történik.

## Dokumentáció

| Fájl | Mire való |
| --- | --- |
| `docs/SPEC.md` | **A specifikáció.** Viselkedés, adatmodell, komponensek, döntések. |
| `docs/01-spec-atnezes.md` | A spec átnézése: a meghozott döntések indoklása (A1, B3… azonosítók). Lezárva. |
| `docs/02-fejlesztesi-terv.md` | Fázisok, „Kész, ha” feltételek, vágási lista. |
| `docs/03-tartalom-utmutato.md` | A 24 nap tartalmának szabályai és ellenőrzőlistája. |
| `docs/04-teszteles-es-elesites.md` | Tesztterv és élesítési lista. |
| `docs/prototype.html` | A dizájn forrása (HTML/CSS protótípus). |

Ha két dokumentum eltér, a `SPEC.md` az érvényes. Ha a spec és a protótípus mond ellent egymásnak, kérdezz rá.

## Parancsok

```bash
yarn dev      # fejlesztői szerver
yarn test     # Vitest figyelő módban; egyszeri futás: yarn vitest run
yarn build    # típusellenőrzés + éles build a dist/ mappába
yarn lint     # oxlint
```

Csomagkezelő: Yarn (Corepack, `nodeLinker: node-modules`). `npm install` és `package-lock.json` ne kerüljön a repóba.

## Szabályok

- **Dizájn:** a protótípus megjelenése változatlanul kerül át. Színek csak a `src/styles/tokens.css` változóiból (a díszek a díszpalettáról), új szín vagy betűtípus nem vezethető be. A fa és a díszek színei SVG-attribútumként kerülnek ki, nem CSS-osztályból.
- **Szövegek:** minden felületi szöveg a `src/i18n/hu.ts` és `en.ts` szótárból jön, mindig mindkettőbe felvéve. Komponensben nincs beégetett felirat.
- **Tartalom:** a napi tartalom a `src/content/days.ts`-ben él. A komponensek nem tudják, hányadik nap van: a kérdések és rejtvények száma a tömbök hosszából jön.
- **Állapot:** a komponensek nem tárolnak előrehaladást, minden a `ProgressContext`-ből jön. A localStorage-hoz csak a `src/state/storage.ts` nyúl.
- **Dátumok:** mindig helyi idő, `new Date(év, hónap, nap)` formában; a „most” a `lib/dates.ts`-en keresztül érkezik, hogy tesztelhető és szimulálható legyen.
- **Függőségek:** a spec listáján túl új csomag csak egyeztetés után.
- **Akadálymentesség:** billentyűzettel minden elérhető, a visszajelzés szövegben is megjelenik, a `prefers-reduced-motion` tiszteletben van tartva.
- **Tesztek:** a `lib/` és a `state/` minden függvényéhez tartozik teszt; új tartalom után fusson a tartalomteszt.

## Munkamenet

A munka fázisonként halad a `docs/02-fejlesztesi-terv.md` szerint. Egy fázis akkor kész, ha a „Kész, ha” lista minden pontja teljesül, és a `yarn test` meg a `yarn build` hiba nélkül fut.

## Fejlesztői kapcsolók

- `VITE_UNLOCK_ALL=true` – minden ajtó nyitható; a Netlify-előnézeten a `netlify.toml` állítja be, az éles oldalon nincs beállítva.
- `?date=2026-12-10` – tetszőleges nap szimulálása, csak fejlesztői módban.
- `?lang=en` – nyelv felülírása arra a betöltésre, mentés nélkül.
