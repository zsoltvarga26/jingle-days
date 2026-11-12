import type { Ornament, OrnamentColor, OrnamentShape } from './types'

/**
 * A 24 dísz a specifikáció táblázata szerint (docs/SPEC.md, „A díszíthető fenyőfa”).
 *
 * A helyek (slot) a fa rajzának egységeiben vannak (x 0–100, y 0–120), a fa három szintjén
 * sorokba rendezve. A korai napok alulra és szétszórva kerülnek, hogy a fa egyenletesen teljen;
 * a 23. nap ajándékai a fa alá, a 24. nap csillaga a csúcsra.
 */
const ornament = (
  day: number,
  shape: OrnamentShape,
  color: OrnamentColor | undefined,
  hu: string,
  en: string,
  x: number,
  y: number,
  scale?: number,
): Ornament => ({
  id: `d${String(day).padStart(2, '0')}-${shape}${color ? `-${color}` : ''}`,
  shape,
  ...(color ? { color } : {}),
  ...(scale ? { scale } : {}),
  name: { hu, en },
  slot: { x, y },
})

export const ornaments: Record<number, Ornament> = {
  1: ornament(1, 'bauble', 'red', 'Piros gömb', 'Red bauble', 44, 78),
  2: ornament(2, 'bauble', 'gold', 'Arany gömb', 'Gold bauble', 68, 91),
  3: ornament(3, 'candyCane', 'red', 'Piros cukorpálca', 'Red candy cane', 20, 91),
  4: ornament(4, 'gingerbread', undefined, 'Mézeskalács-figura', 'Gingerbread man', 57, 65),
  5: ornament(5, 'bell', 'gold', 'Arany csengő', 'Gold bell', 68, 78),
  6: ornament(6, 'boot', 'red', 'Mikuláscsizma', 'Santa’s boot', 32, 91),
  7: ornament(7, 'bauble', 'green', 'Zöld gömb', 'Green bauble', 62, 53),
  8: ornament(8, 'snowflake', 'white', 'Fehér hópehely', 'White snowflake', 32, 78),
  9: ornament(9, 'pinecone', undefined, 'Fenyőtoboz', 'Pine cone', 80, 91),
  10: ornament(10, 'bauble', 'blue', 'Kék gömb', 'Blue bauble', 43, 65),
  11: ornament(11, 'bow', 'red', 'Piros masni', 'Red bow', 56, 91),
  12: ornament(12, 'gift', 'red', 'Piros ajándékdoboz', 'Red gift box', 30, 65),
  13: ornament(13, 'szaloncukor', 'pink', 'Rózsaszín szaloncukor', 'Pink szaloncukor', 56, 78),
  14: ornament(14, 'snowflake', 'silver', 'Ezüst hópehely', 'Silver snowflake', 37, 41),
  15: ornament(15, 'bell', 'silver', 'Ezüst csengő', 'Silver bell', 70, 65),
  16: ornament(16, 'szaloncukor', 'gold', 'Arany szaloncukor', 'Gold szaloncukor', 44, 91),
  17: ornament(17, 'bauble', 'pink', 'Rózsaszín gömb', 'Pink bauble', 50, 53),
  18: ornament(18, 'candyCane', 'green', 'Zöld cukorpálca', 'Green candy cane', 38, 53),
  19: ornament(19, 'bow', 'gold', 'Arany masni', 'Gold bow', 63, 41),
  20: ornament(20, 'star', 'gold', 'Arany kiscsillag', 'Little gold star', 56, 30, 0.8),
  21: ornament(21, 'bauble', 'silver', 'Ezüst gömb', 'Silver bauble', 50, 41),
  22: ornament(22, 'candle', undefined, 'Gyertya', 'Candle', 44, 30),
  23: ornament(23, 'gift', 'green', 'Ajándékok a fa alatt', 'Presents under the tree', 67, 107, 1.2),
  24: ornament(24, 'star', 'gold', 'Csillag a csúcson', 'Star on the top', 50, 10, 1.7),
}
