import { describe, expect, test } from 'vitest'
import css from '../../styles/tokens.css?raw'
import { paletteTokens, paletteValues, treePalette } from './palette'

/** A tokens.css első (világos módú) :root blokkjának változói. */
function lightTokens(): Map<string, string> {
  const start = css.indexOf(':root {')
  const block = css.slice(start, css.indexOf('}', start))
  const tokens = new Map<string, string>()
  for (const match of block.matchAll(/(--[\w-]+):\s*([^;]+);/g)) {
    tokens.set(match[1], match[2].trim().toLowerCase())
  }
  return tokens
}

describe('díszpaletta', () => {
  test('minden érték megegyezik a tokens.css megfelelő tokenjével', () => {
    const tokens = lightTokens()
    for (const [name, token] of Object.entries(paletteTokens)) {
      expect(tokens.get(token), `${name} ↔ ${token}`).toBe(
        paletteValues[name as keyof typeof paletteValues],
      )
    }
  })

  test('csak hexa színek vannak benne, hogy SVG-attribútumként is működjenek', () => {
    const all = [
      ...treePalette.tree,
      treePalette.trunk,
      treePalette.snow,
      treePalette.gold,
      treePalette.goldDark,
      treePalette.gingerbread,
      treePalette.ghostDark,
      ...Object.values(treePalette.colors).flatMap((c) => [c.fill, c.shade]),
    ]
    for (const color of all) expect(color).toMatch(/^#[0-9a-f]{6}$/)
  })
})
