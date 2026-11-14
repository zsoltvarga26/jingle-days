import type { OrnamentColor } from '../../content/types'

/**
 * A fa és a díszek színei. SVG-attribútumként kerülnek ki (`fill="#146b4e"`), nem CSS-ből,
 * mert a megosztókártya a fát képként tölti be, ahol a CSS-változók nem érvényesülnek.
 *
 * Minden érték a src/styles/tokens.css egy tokenjének tükre: a `tokens` mező mondja meg,
 * melyiké, és a palette.test.ts ellenőrzi, hogy a kettő nem tér el.
 */
export interface TreePalette {
  /** A fa három szintje felülről lefelé. */
  tree: readonly [string, string, string]
  trunk: string
  snow: string
  gold: string
  goldDark: string
  gingerbread: string
  /** A még meg nem szerzett dísz körvonalának sötét alárétege. */
  ghostDark: string
  colors: Record<OrnamentColor, { fill: string; shade: string }>
}

/** Melyik paletta-érték melyik tokennek felel meg. */
export const paletteTokens = {
  bg: '--bg',
  bg2: '--bg-2',
  ink: '--ink',
  inkSoft: '--ink-soft',
  pine: '--pine',
  green: '--green',
  treeMid: '--tree-mid',
  greenDark: '--green-dark',
  trunk: '--trunk',
  snow: '--snow',
  snowDark: '--snow-dark',
  gold: '--gold',
  goldDark: '--gold-dark',
  gingerbread: '--gingerbread',
  pineDark: '--pine-dark',
  red: '--red',
  redDark: '--red-dark',
  pink: '--pink',
  pinkDark: '--pink-dark',
  purple: '--purple',
  purpleDark: '--purple-dark',
  blue: '--orn-blue',
  blueDark: '--orn-blue-dark',
  silver: '--orn-silver',
  silverDark: '--orn-silver-dark',
} as const

/** A tokenek világos módú értékei. */
export const paletteValues: Record<keyof typeof paletteTokens, string> = {
  bg: '#e4f3ec',
  bg2: '#cfe9de',
  ink: '#123c30',
  inkSoft: '#3f6b5d',
  pine: '#146b4e',
  green: '#2fa374',
  treeMid: '#258a62',
  greenDark: '#1b6e4d',
  trunk: '#8a5a3c',
  snow: '#ffffff',
  snowDark: '#c9dcd4',
  gold: '#f5be3a',
  goldDark: '#c98e12',
  gingerbread: '#b9783f',
  pineDark: '#0d4a36',
  red: '#e2384b',
  redDark: '#a8202f',
  pink: '#ff9fb2',
  pinkDark: '#d9667f',
  purple: '#9b7bd0',
  purpleDark: '#6c4fa3',
  blue: '#4a90d9',
  blueDark: '#2f6aa8',
  silver: '#c9d3dc',
  silverDark: '#8f9ba6',
}

const v = paletteValues

/** A fa palettája. Egyetlen változat van: a fa világos és sötét háttéren is ugyanilyen. */
export const treePalette: TreePalette = {
  tree: [v.green, v.treeMid, v.greenDark],
  trunk: v.trunk,
  snow: v.snow,
  gold: v.gold,
  goldDark: v.goldDark,
  gingerbread: v.gingerbread,
  ghostDark: v.pineDark,
  colors: {
    red: { fill: v.red, shade: v.redDark },
    gold: { fill: v.gold, shade: v.goldDark },
    purple: { fill: v.purple, shade: v.purpleDark },
    blue: { fill: v.blue, shade: v.blueDark },
    pink: { fill: v.pink, shade: v.pinkDark },
    silver: { fill: v.silver, shade: v.silverDark },
    white: { fill: v.snow, shade: v.snowDark },
  },
}

/**
 * Egyszínű paletta: a dísz sziluettként, egyetlen színnel jelenik meg (pl. a kinyitott ajtó
 * mögött, a szöveg színével: `currentColor`). Csak az oldalon használható, a megosztókártyán nem.
 */
export function monoPalette(color: string): TreePalette {
  const pair = { fill: color, shade: color }
  return {
    tree: [color, color, color],
    trunk: color,
    snow: color,
    gold: color,
    goldDark: color,
    gingerbread: color,
    ghostDark: color,
    colors: { red: pair, gold: pair, purple: pair, blue: pair, pink: pair, silver: pair, white: pair },
  }
}
