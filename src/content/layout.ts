/** Az ajtók helye, mérete, színe és mintája. A színek és minták a protótípusból valók. */
export type DoorSize = 'normal' | 'wide' | 'tall' | 'big'
export type DoorColor = 'red' | 'gold' | 'snow' | 'pink' | 'green' | 'blue' | 'purple' | 'brown'
export type DoorPattern = 'dots' | 'stripes' | 'candy' | 'check' | 'plain'

/** Egy ajtó helye a rácsban: 1-től számolt kezdő sor és oszlop, majd hány sort és oszlopot foglal. */
export interface DoorArea {
  row: number
  col: number
  rows: number
  cols: number
}

/** A két rács mérete: széles nézetben 7 × 5, keskenyben 5 × 7 cella. */
export const GRID_WIDE = { cols: 7, rows: 5 } as const
export const GRID_NARROW = { cols: 5, rows: 7 } as const

export interface DoorLayout {
  day: number
  /** A széles nézetbeli alakból adódik; a megjelenésben csak a „big” számít (nagyobb felirat). */
  size: DoorSize
  color: DoorColor
  pattern: DoorPattern
  ribbon: boolean
  /** Hely a 7 × 5-ös (széles) rácsban. */
  areaWide: DoorArea
  /** Hely az 5 × 7-es (keskeny) rácsban. */
  areaNarrow: DoorArea
}

type AreaTuple = readonly [row: number, col: number, rows?: number, cols?: number]

const area = ([row, col, rows = 1, cols = 1]: AreaTuple): DoorArea => ({ row, col, rows, cols })

const sizeOf = ({ rows, cols }: DoorArea): DoorSize =>
  rows > 1 && cols > 1 ? 'big' : cols > 1 ? 'wide' : rows > 1 ? 'tall' : 'normal'

/** A CSS `grid-area` értéke: sor / oszlop / span sorok / span oszlopok. */
export const gridArea = ({ row, col, rows, cols }: DoorArea): string =>
  `${row} / ${col} / span ${rows} / span ${cols}`

const door = (
  day: number,
  color: DoorColor,
  pattern: DoorPattern,
  wide: AreaTuple,
  narrow: AreaTuple,
  ribbon = false,
): DoorLayout => {
  const areaWide = area(wide)
  return { day, size: sizeOf(areaWide), color, pattern, ribbon, areaWide, areaNarrow: area(narrow) }
}

/**
 * A 24 ajtó a széles rács olvasási sorrendjében (ez adja a Tab-sorrendet és a belépő
 * animáció ütemét). Mindkét rács hézag nélkül ki van töltve, és egyik rácsban sem kerül
 * egymás mellé két azonos színű ajtó; mindkettőt a layout.test.ts őrzi.
 */
export const doorLayout: readonly DoorLayout[] = [
  door(13, 'red', 'dots', [1, 1], [1, 3]),
  door(4, 'snow', 'candy', [1, 2], [1, 4]),
  door(21, 'purple', 'stripes', [1, 3, 2, 1], [1, 5, 2, 1], true),
  door(8, 'green', 'check', [1, 4], [2, 3]),
  door(1, 'pink', 'dots', [1, 5], [2, 4]),
  door(17, 'red', 'stripes', [1, 6], [3, 1]),
  door(11, 'gold', 'check', [1, 7], [3, 3]),
  door(6, 'blue', 'plain', [2, 1, 1, 2], [3, 4, 1, 2], true),
  door(24, 'gold', 'dots', [2, 4, 2, 2], [1, 1, 2, 2], true),
  door(2, 'brown', 'stripes', [2, 6], [4, 3]),
  door(19, 'pink', 'check', [2, 7], [4, 4]),
  door(9, 'red', 'check', [3, 1], [4, 5]),
  door(15, 'snow', 'candy', [3, 2, 2, 1], [3, 2, 2, 1], true),
  door(3, 'brown', 'check', [3, 3], [5, 5]),
  door(22, 'blue', 'dots', [3, 6, 1, 2], [6, 5, 2, 1]),
  door(12, 'pink', 'stripes', [4, 1, 2, 1], [4, 1, 2, 1], true),
  door(23, 'green', 'stripes', [4, 3, 1, 2], [5, 2, 1, 2], true),
  door(7, 'red', 'plain', [4, 5], [6, 1]),
  door(18, 'snow', 'dots', [4, 6], [6, 2]),
  door(5, 'gold', 'stripes', [4, 7, 2, 1], [5, 4, 2, 1]),
  door(14, 'purple', 'dots', [5, 2, 1, 2], [7, 1, 1, 2]),
  door(10, 'pink', 'plain', [5, 4], [6, 3]),
  door(16, 'blue', 'stripes', [5, 5], [7, 3]),
  door(20, 'purple', 'stripes', [5, 6], [7, 4]),
]
