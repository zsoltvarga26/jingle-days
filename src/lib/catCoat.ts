import { paletteValues as v } from '../components/TreeScene/palette'

/** A választható bundák, a szerkesztőben ebben a sorrendben. Az első az alapértelmezés. */
export const CAT_COATS = ['tuxedo', 'white', 'ginger', 'gray', 'brown', 'beige'] as const
export type CatCoat = (typeof CAT_COATS)[number]

/** A cica eredeti, fekete-fehér („szmokingos”) bundája. */
export const DEFAULT_CAT_COAT: CatCoat = 'tuxedo'

export function isCatCoat(value: unknown): value is CatCoat {
  return typeof value === 'string' && (CAT_COATS as readonly string[]).includes(value)
}

/** Egy bunda színei. A fül és az orr minden bundánál ugyanaz (a szoba palettájáról). */
export interface CoatColors {
  /** A bunda alapszíne: test, fej, fülek, farok. */
  fur: string
  /**
   * A pofa, a mellény, a mancsok és a farokvég. Csak a fekete-fehér cicán fehér; a többin
   * a bunda színe, így ott nincs külön folt.
   */
  bib: string
  /** A csukott szem vonala: a bundán kell látszania. */
  eye: string
  /** A bajusz: a pofán és a szőnyegen is látszania kell. */
  whisker: string
  /** Cirmos bundán a csíkok színe; csík nélküli bundánál null. */
  stripes: string | null
}

/**
 * A bundák színei. Mind a tokens.css egy tokenjéből jön (a palette.ts tükrén át), és SVG-attribútumként
 * kerül ki, ezért a megosztókártya képén is ugyanilyen a cica.
 */
const COATS: Record<CatCoat, CoatColors> = {
  tuxedo: { fur: v.soot, bib: v.snow, eye: v.silver, whisker: v.silverDark, stripes: null },
  // Fehér bundán a csukott szem sötét vonal, különben eltűnne.
  white: { fur: v.snow, bib: v.snow, eye: v.soot, whisker: v.silverDark, stripes: null },
  // Sárgásabb narancs, mint a piros szőnyeg, hogy elváljon tőle.
  ginger: {
    fur: v.catGinger,
    bib: v.catGinger,
    eye: v.soot,
    whisker: v.silverDark,
    stripes: v.catGingerDark,
  },
  // Szürke bundán a szürke bajusz eltűnne, ezért fehér.
  gray: {
    fur: v.silverDark,
    bib: v.silverDark,
    eye: v.soot,
    whisker: v.snow,
    stripes: v.catGrayDark,
  },
  brown: { fur: v.catBrown, bib: v.catBrown, eye: v.soot, whisker: v.silverDark, stripes: v.catBrownDark },
  beige: { fur: v.catBeige, bib: v.catBeige, eye: v.soot, whisker: v.silverDark, stripes: null },
}

export function coatColors(coat: CatCoat): CoatColors {
  return COATS[coat]
}
