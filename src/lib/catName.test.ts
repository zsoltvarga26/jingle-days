import { describe, expect, test } from 'vitest'
import { BOWL_LABEL } from '../components/TreeScene/geometry'
import { bowlLabel, CAT_NAME_MAX, DEFAULT_CAT_NAME, normalizeCatName } from './catName'

describe('normalizeCatName', () => {
  test('a rendes nevet változatlanul hagyja, ékezetekkel együtt', () => {
    expect(normalizeCatName('Lajos')).toBe('Lajos')
    expect(normalizeCatName('Bütyök')).toBe('Bütyök')
    expect(normalizeCatName('Ő')).toBe('Ő')
  })

  test('levágja a széleken lévő szóközt, és összevonja a belsőket', () => {
    expect(normalizeCatName('  Cirmi  ')).toBe('Cirmi')
    expect(normalizeCatName('Kis   Pamacs')).toBe('Kis Pamacs')
    expect(normalizeCatName('Kis\tPamacs')).toBe('Kis Pamacs')
  })

  test('kiszedi a vezérlőkaraktereket', () => {
    expect(normalizeCatName('Lu\u0000mi​')).toBe('Lumi')
    expect(normalizeCatName('Mi\nci')).toBe('Mi ci')
  })

  test(`legfeljebb ${CAT_NAME_MAX} karaktert tart meg, a vágás után sem marad szóköz a végén`, () => {
    expect(normalizeCatName('Bolyhoskacsa')).toBe('Bolyhoskac')
    expect(normalizeCatName('Kis Bolyhos')).toBe('Kis Bolyho')
    expect(normalizeCatName('Kicsi Pamacs')).toBe('Kicsi Pama')
    expect(normalizeCatName('Pamacska X')).toBe('Pamacska X')
    expect(normalizeCatName('Pamacskaa X')).toBe('Pamacskaa')
  })

  test('üres vagy nem szöveges bemenetre null', () => {
    expect(normalizeCatName('')).toBeNull()
    expect(normalizeCatName('   ')).toBeNull()
    expect(normalizeCatName(undefined)).toBeNull()
    expect(normalizeCatName(42)).toBeNull()
  })

  test('az alapnév érvényes név', () => {
    expect(normalizeCatName(DEFAULT_CAT_NAME)).toBe(DEFAULT_CAT_NAME)
  })
})

describe('bowlLabel', () => {
  test('rövid névnél a betűméret állandó', () => {
    expect(bowlLabel('Mo').fontSize).toBe(bowlLabel('Lajos').fontSize)
  })

  test('hosszabb névnél kisebb betűvel, de mindig elfér a tálka szélességében', () => {
    expect(bowlLabel('Bolyhoskac').fontSize).toBeLessThan(bowlLabel('Lajos').fontSize)
    for (const name of ['M', 'Lajos', 'Bolyhos', 'Bolyhoskac']) {
      const { fontSize } = bowlLabel(name)
      expect(name.length * fontSize * 0.56, name).toBeLessThanOrEqual(BOWL_LABEL.width + 1e-9)
    }
  })

  test('a felirat a tálka közepén marad, a mérettől függetlenül', () => {
    for (const name of ['Lajos', 'Bolyhoskac']) {
      const { x, y, fontSize } = bowlLabel(name)
      expect(x).toBe(BOWL_LABEL.x)
      // A nagybetűk közepe (alapvonal − 0,35 × betűméret) mindig ugyanott van.
      expect(y - fontSize * 0.35).toBeCloseTo(BOWL_LABEL.cy)
    }
  })
})
