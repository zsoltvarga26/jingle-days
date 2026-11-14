import { describe, expect, test } from 'vitest'
import { doorLayout, GRID_NARROW, GRID_WIDE, gridArea, type DoorArea } from './layout'

/** A specifikáció táblázata (docs/layout-split.md): nap → [széles, keskeny] grid-area. */
const SPEC: Record<number, [wide: string, narrow: string]> = {
  1: ['1 / 5 / span 1 / span 1', '2 / 4 / span 1 / span 1'],
  2: ['2 / 6 / span 1 / span 1', '4 / 3 / span 1 / span 1'],
  3: ['3 / 3 / span 1 / span 1', '5 / 5 / span 1 / span 1'],
  4: ['1 / 2 / span 1 / span 1', '1 / 4 / span 1 / span 1'],
  5: ['4 / 7 / span 2 / span 1', '5 / 4 / span 2 / span 1'],
  6: ['2 / 1 / span 1 / span 2', '3 / 4 / span 1 / span 2'],
  7: ['4 / 5 / span 1 / span 1', '6 / 1 / span 1 / span 1'],
  8: ['1 / 4 / span 1 / span 1', '2 / 3 / span 1 / span 1'],
  9: ['3 / 1 / span 1 / span 1', '4 / 5 / span 1 / span 1'],
  10: ['5 / 4 / span 1 / span 1', '6 / 3 / span 1 / span 1'],
  11: ['1 / 7 / span 1 / span 1', '3 / 3 / span 1 / span 1'],
  12: ['4 / 1 / span 2 / span 1', '4 / 1 / span 2 / span 1'],
  13: ['1 / 1 / span 1 / span 1', '1 / 3 / span 1 / span 1'],
  14: ['5 / 2 / span 1 / span 2', '7 / 1 / span 1 / span 2'],
  15: ['3 / 2 / span 2 / span 1', '3 / 2 / span 2 / span 1'],
  16: ['5 / 5 / span 1 / span 1', '7 / 3 / span 1 / span 1'],
  17: ['1 / 6 / span 1 / span 1', '3 / 1 / span 1 / span 1'],
  18: ['4 / 6 / span 1 / span 1', '6 / 2 / span 1 / span 1'],
  19: ['2 / 7 / span 1 / span 1', '4 / 4 / span 1 / span 1'],
  20: ['5 / 6 / span 1 / span 1', '7 / 4 / span 1 / span 1'],
  21: ['1 / 3 / span 2 / span 1', '1 / 5 / span 2 / span 1'],
  22: ['3 / 6 / span 1 / span 2', '6 / 5 / span 2 / span 1'],
  23: ['4 / 3 / span 1 / span 2', '5 / 2 / span 1 / span 2'],
  24: ['2 / 4 / span 2 / span 2', '1 / 1 / span 2 / span 2'],
}

const layouts = [
  { name: 'széles (7 × 5)', grid: GRID_WIDE, areaOf: (i: number) => doorLayout[i].areaWide },
  { name: 'keskeny (5 × 7)', grid: GRID_NARROW, areaOf: (i: number) => doorLayout[i].areaNarrow },
]

describe('doorLayout', () => {
  test('mind a 24 nap pontosan egyszer szerepel', () => {
    const days = doorLayout.map((door) => door.day).sort((a, b) => a - b)
    expect(days).toEqual(Array.from({ length: 24 }, (_, i) => i + 1))
  })

  test('az elhelyezés megegyezik a specifikáció táblázatával', () => {
    for (const door of doorLayout) {
      expect([gridArea(door.areaWide), gridArea(door.areaNarrow)], `${door.day}. nap`).toEqual(
        SPEC[door.day],
      )
    }
  })

  describe.each(layouts)('$name rács', ({ grid, areaOf }) => {
    const areas = doorLayout.map((door, i) => ({ day: door.day, area: areaOf(i) }))

    test('egyik ajtó sem lóg ki a rácsból', () => {
      for (const { day, area } of areas) {
        const label = `${day}. nap`
        expect(area.row, label).toBeGreaterThanOrEqual(1)
        expect(area.col, label).toBeGreaterThanOrEqual(1)
        expect(area.rows, label).toBeGreaterThanOrEqual(1)
        expect(area.cols, label).toBeGreaterThanOrEqual(1)
        expect(area.row + area.rows - 1, label).toBeLessThanOrEqual(grid.rows)
        expect(area.col + area.cols - 1, label).toBeLessThanOrEqual(grid.cols)
      }
    })

    test('minden cella pontosan egyszer foglalt', () => {
      // A mátrix minden cellájába azok a napok kerülnek, amelyek lefedik.
      const cells: number[][][] = Array.from({ length: grid.rows }, () =>
        Array.from({ length: grid.cols }, () => []),
      )
      for (const { day, area } of areas) {
        for (let r = area.row; r < area.row + area.rows; r++) {
          for (let c = area.col; c < area.col + area.cols; c++) {
            cells[r - 1]?.[c - 1]?.push(day)
          }
        }
      }
      cells.forEach((row, r) =>
        row.forEach((days, c) => {
          expect(days, `${r + 1}. sor, ${c + 1}. oszlop`).toHaveLength(1)
        }),
      )
    })

    test('egy 2 × 2-es, nyolc kétcellás és tizenöt egycellás ajtó van', () => {
      const cellCount = (area: DoorArea) => area.rows * area.cols
      const counts = areas.map(({ area }) => cellCount(area)).sort((a, b) => a - b)
      expect(counts).toEqual([...Array(15).fill(1), ...Array(8).fill(2), 4])
      expect(cellCount(areas.find(({ day }) => day === 24)!.area)).toBe(4)
    })
  })

  test.each(layouts)('$name rácsban nincs két azonos színű szomszédos ajtó', ({ grid, areaOf }) => {
    // Minden cellába az ott lévő ajtó kerül, majd a jobb és az alsó szomszéddal vetjük össze.
    const cells: (typeof doorLayout)[number][][] = Array.from({ length: grid.rows }, () => [])
    doorLayout.forEach((door, i) => {
      const area = areaOf(i)
      for (let r = area.row; r < area.row + area.rows; r++) {
        for (let c = area.col; c < area.col + area.cols; c++) cells[r - 1][c - 1] = door
      }
    })
    for (let r = 0; r < grid.rows; r++) {
      for (let c = 0; c < grid.cols; c++) {
        const door = cells[r][c]
        for (const other of [cells[r][c + 1], cells[r + 1]?.[c]]) {
          if (!other || other.day === door.day) continue
          expect(other.color, `${door.day}. és ${other.day}. nap`).not.toBe(door.color)
        }
      }
    }
  })

  test('a tömb a széles rács olvasási sorrendjében áll (Tab-sorrend)', () => {
    const position = doorLayout.map(({ areaWide }) => areaWide.row * 100 + areaWide.col)
    expect(position).toEqual([...position].sort((a, b) => a - b))
  })
})
