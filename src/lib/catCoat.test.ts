import { describe, expect, test } from 'vitest'
import { paletteValues } from '../components/TreeScene/palette'
import { CAT_COATS, coatColors, DEFAULT_CAT_COAT, isCatCoat } from './catCoat'

describe('isCatCoat', () => {
  test('csak a felsorolt bundákat fogadja el', () => {
    for (const coat of CAT_COATS) expect(isCatCoat(coat), coat).toBe(true)
    for (const value of ['calico', 'Ginger', '', null, undefined, 3]) {
      expect(isCatCoat(value), String(value)).toBe(false)
    }
  })

  test('az alapértelmezés a felsorolás első eleme', () => {
    expect(CAT_COATS[0]).toBe(DEFAULT_CAT_COAT)
  })
})

describe('coatColors', () => {
  test('a fekete-fehér bunda pontosan a régi cica színeit adja', () => {
    expect(coatColors('tuxedo')).toEqual({
      fur: paletteValues.soot,
      bib: paletteValues.snow,
      eye: paletteValues.silver,
      whisker: paletteValues.silverDark,
      stripes: null,
    })
  })

  test('minden bundának más az alapszíne', () => {
    const furs = CAT_COATS.map((coat) => coatColors(coat).fur)
    expect(new Set(furs).size).toBe(CAT_COATS.length)
  })

  test('csak a cirmosok csíkosak, és a csík eltér az alapszíntől', () => {
    for (const coat of CAT_COATS) {
      const { fur, stripes } = coatColors(coat)
      const tabby = coat === 'ginger' || coat === 'gray' || coat === 'brown'
      expect(stripes !== null, coat).toBe(tabby)
      if (stripes) expect(stripes, coat).not.toBe(fur)
    }
  })

  test('a csukott szem és a bajusz minden bundán más színű, mint a bunda (látszik)', () => {
    for (const coat of CAT_COATS) {
      const { fur, eye, whisker } = coatColors(coat)
      expect(eye, coat).not.toBe(fur)
      expect(whisker, coat).not.toBe(fur)
    }
  })

  test('külön fehér folt (mellény, pofa, mancsok) csak a fekete-fehér cicán van', () => {
    for (const coat of CAT_COATS) {
      const { fur, bib } = coatColors(coat)
      expect(bib === fur, coat).toBe(coat !== 'tuxedo')
    }
  })

  test('a bézs egyszínű, csíkok nélküli világosbarna', () => {
    expect(coatColors('beige')).toMatchObject({ fur: paletteValues.catBeige, stripes: null })
  })

  test('minden szín hexa, hogy SVG-attribútumként is működjön', () => {
    for (const coat of CAT_COATS) {
      const { fur, bib, eye, whisker, stripes } = coatColors(coat)
      for (const color of [fur, bib, eye, whisker, stripes ?? '#000000']) {
        expect(color, coat).toMatch(/^#[0-9a-f]{6}$/)
      }
    }
  })
})
