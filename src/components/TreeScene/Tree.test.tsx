import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { days } from '../../content/days'
import type { OrnamentShape } from '../../content/types'
import { shapes } from './ornaments/shapeMap'
import { treePalette } from './palette'
import { Tree } from './Tree'

const ornaments = days.map((day) => day.ornament)
const ids = (...dayNumbers: number[]) => new Set(dayNumbers.map((day) => ornaments[day - 1].id))

function setup(props: Partial<Parameters<typeof Tree>[0]> = {}) {
  const view = render(
    <Tree ornaments={ornaments} earned={new Set()} palette={treePalette} label="Karácsonyfa" {...props} />,
  )
  const svg = screen.getByRole('img', { name: 'Karácsonyfa' })
  const states = () =>
    [...svg.querySelectorAll('[data-ornament]')].map((g) => g.getAttribute('data-state'))
  const ornament = (day: number) => svg.querySelector(`[data-ornament="${ornaments[day - 1].id}"]`)!
  return { ...view, svg, states, ornament }
}

describe('Tree', () => {
  test('mind a 24 dísz helye megjelenik; ami nincs meg, az körvonal', () => {
    const { states } = setup()
    expect(states()).toHaveLength(24)
    expect(new Set(states())).toEqual(new Set(['ghost']))
  })

  test('a megszerzett díszek teli színnel látszanak, a többi körvonal marad', () => {
    const { states, ornament } = setup({ earned: ids(1, 2, 24) })
    expect(states().filter((s) => s === 'earned')).toHaveLength(3)
    expect(states().filter((s) => s === 'ghost')).toHaveLength(21)

    // Piros gömb: a paletta piros színe attribútumként szerepel.
    expect(ornament(1).innerHTML).toContain(`fill="${treePalette.colors.red.fill}"`)
    // A körvonalas dísznek nincs kitöltése.
    const ghostFills = [...ornament(3).querySelectorAll('[fill]')].map((el) => el.getAttribute('fill'))
    expect(new Set(ghostFills)).toEqual(new Set(['none']))
  })

  test('az éppen leeső dísz külön állapotot kap, csillogással', () => {
    const { ornament } = setup({ earned: ids(1), dropping: ids(2) })
    expect(ornament(2)).toHaveAttribute('data-state', 'dropping')
    expect(ornament(2).querySelectorAll('circle').length).toBeGreaterThan(3)
    expect(ornament(1)).toHaveAttribute('data-state', 'earned')
  })

  test('a díszek a tartalom szerinti helyükre kerülnek, a nagyítással együtt', () => {
    const { ornament } = setup()
    expect(ornament(1)).toHaveAttribute('transform', 'translate(44 78)')
    expect(ornament(24)).toHaveAttribute('transform', 'translate(50 10) scale(1.7)')
  })

  test('a fények csak akkor égnek, ha a fa kész', () => {
    const unlit = setup({ earned: ids(1) })
    expect(unlit.svg.querySelectorAll('[data-light]')).toHaveLength(0)
    unlit.unmount()

    const all = new Set(ornaments.map((o) => o.id))
    const lit = setup({ earned: all, lit: true })
    expect(lit.svg.querySelectorAll('[data-light]').length).toBeGreaterThan(10)
  })

  test('a színek attribútumok: a rajz CSS nélkül, képpé alakítva is színes marad', () => {
    const all = new Set(ornaments.map((o) => o.id))
    const { svg } = setup({ earned: all, lit: true })
    const markup = svg.outerHTML
    expect(markup).not.toContain('var(--')
    expect(markup).not.toContain('currentColor')
    for (const el of svg.querySelectorAll('[fill], [stroke]')) {
      for (const attr of ['fill', 'stroke']) {
        const value = el.getAttribute(attr)
        if (value !== null) expect(value, attr).toMatch(/^(none|#[0-9a-f]{6})$/)
      }
    }
    // Szöveg és foreignObject nincs a rajzban (a kártya szövegét a Canvas rajzolja).
    expect(svg.querySelector('text, foreignObject')).toBeNull()
  })

  test('mind a 12 alakzathoz van rajz, és a tartalom csak létező alakzatot használ', () => {
    const used = new Set<OrnamentShape>(ornaments.map((o) => o.shape))
    expect(Object.keys(shapes).sort()).toEqual([...used].sort())
    expect(used.size).toBe(12)
  })
})
