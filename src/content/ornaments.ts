import type { Ornament, OrnamentColor, OrnamentShape } from './types'

/**
 * A 24 dísz a specifikáció táblázata szerint (docs/SPEC.md, „A díszíthető fenyőfa”).
 * A helyek (slot) előzetesek: a 4. fázisban, a fa megrajzolásakor véglegesednek.
 */
const ornament = (
  day: number,
  shape: OrnamentShape,
  color: OrnamentColor | undefined,
  hu: string,
  en: string,
  x: number,
  y: number,
): Ornament => ({
  id: `d${String(day).padStart(2, '0')}-${shape}${color ? `-${color}` : ''}`,
  shape,
  ...(color ? { color } : {}),
  name: { hu, en },
  slot: { x, y },
})

export const ornaments: Record<number, Ornament> = {
  1: ornament(1, 'bauble', 'red', 'Piros gömb', 'Red bauble', 38, 70),
  2: ornament(2, 'bauble', 'gold', 'Arany gömb', 'Gold bauble', 68, 84),
  3: ornament(3, 'candyCane', 'red', 'Piros cukorpálca', 'Red candy cane', 20, 84),
  4: ornament(4, 'gingerbread', undefined, 'Mézeskalács-figura', 'Gingerbread man', 56, 56),
  5: ornament(5, 'bell', 'gold', 'Arany csengő', 'Gold bell', 74, 70),
  6: ornament(6, 'boot', 'red', 'Mikuláscsizma', 'Santa’s boot', 32, 84),
  7: ornament(7, 'bauble', 'green', 'Zöld gömb', 'Green bauble', 62, 42),
  8: ornament(8, 'snowflake', 'white', 'Fehér hópehely', 'White snowflake', 26, 70),
  9: ornament(9, 'pinecone', undefined, 'Fenyőtoboz', 'Pine cone', 80, 84),
  10: ornament(10, 'bauble', 'blue', 'Kék gömb', 'Blue bauble', 44, 56),
  11: ornament(11, 'bow', 'red', 'Piros masni', 'Red bow', 56, 84),
  12: ornament(12, 'gift', 'red', 'Piros ajándékdoboz', 'Red gift box', 30, 96),
  13: ornament(13, 'szaloncukor', 'pink', 'Rózsaszín szaloncukor', 'Pink szaloncukor', 50, 70),
  14: ornament(14, 'snowflake', 'silver', 'Ezüst hópehely', 'Silver snowflake', 38, 42),
  15: ornament(15, 'bell', 'silver', 'Ezüst csengő', 'Silver bell', 68, 56),
  16: ornament(16, 'szaloncukor', 'gold', 'Arany szaloncukor', 'Gold szaloncukor', 44, 84),
  17: ornament(17, 'bauble', 'pink', 'Rózsaszín gömb', 'Pink bauble', 62, 70),
  18: ornament(18, 'candyCane', 'green', 'Zöld cukorpálca', 'Green candy cane', 32, 56),
  19: ornament(19, 'bow', 'gold', 'Arany masni', 'Gold bow', 70, 96),
  20: ornament(20, 'star', 'gold', 'Arany kiscsillag', 'Little gold star', 56, 28),
  21: ornament(21, 'bauble', 'silver', 'Ezüst gömb', 'Silver bauble', 50, 42),
  22: ornament(22, 'candle', undefined, 'Gyertya', 'Candle', 44, 28),
  23: ornament(23, 'gift', 'green', 'Ajándékok a fa alatt', 'Presents under the tree', 50, 110),
  24: ornament(24, 'star', 'gold', 'Csillag a csúcson', 'Star on the top', 50, 8),
}
