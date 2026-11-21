import { describe, expect, test, vi } from 'vitest'
import { days } from '../content/days'
import {
  CARD_HEIGHT,
  CARD_WIDTH,
  canShareFile,
  displayUrl,
  drawCard,
  pageUrl,
  sceneSvgMarkup,
  type CardText,
} from './shareCard'

const ornaments = days.map((day) => day.ornament)

describe('az oldal címe', () => {
  test('a megosztott linkbe nem kerül lekérdezési paraméter', () => {
    expect(pageUrl({ origin: 'https://advent.example', pathname: '/' })).toBe('https://advent.example/')
    expect(pageUrl({ origin: 'http://localhost:5173', pathname: '/naptar/' })).toBe(
      'http://localhost:5173/naptar/',
    )
  })

  test('a kártyán protokoll és záró perjel nélkül jelenik meg', () => {
    expect(displayUrl('https://advent.example/')).toBe('advent.example')
    expect(displayUrl('http://localhost:5173/naptar/')).toBe('localhost:5173/naptar')
  })
})

describe('a jelenet képe a kártyához', () => {
  test('önálló SVG saját mérettel, a megnyitott napok díszeivel', async () => {
    const earned = new Set([ornaments[0].id, ornaments[4].id])
    const svg = await sceneSvgMarkup(ornaments, earned, 1300)

    expect(svg.startsWith('<svg width="1300" height="1200" ')).toBe(true)
    // A fa a szobában, a jobb oldalon áll.
    expect(svg).toContain('<svg x="30" y="0" width="100" height="120" ')
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"')
    expect(svg.match(/data-state="earned"/g)).toHaveLength(2)
    expect(svg.match(/data-state="ghost"/g)).toHaveLength(22)
    expect(svg).not.toContain('data-light')
  })

  test('CSS nélkül is színes: nincs benne változó, szöveg vagy foreignObject', async () => {
    const all = new Set(ornaments.map((o) => o.id))
    const svg = await sceneSvgMarkup(ornaments, all, 650)

    expect(svg).not.toContain('var(--')
    expect(svg).not.toContain('currentColor')
    expect(svg).not.toMatch(/<text|<foreignObject/)
    // A kész fán égnek a fények.
    expect(svg).toContain('data-light')
    // Érvényes XML, hogy képként betölthető legyen.
    const doc = new DOMParser().parseFromString(svg, 'image/svg+xml')
    expect(doc.querySelector('parsererror')).toBeNull()
  })
})

describe('a kártya rajza', () => {
  const text: CardText = {
    title: 'Advent 2026',
    ornaments: '18 / 24',
    ornamentsLabel: 'dísz a fán',
    points: '61',
    pointsLabel: 'pont',
    quiz: 'Kvíz: 52 / 74',
    puzzles: 'Rejtvény: 9 / 25',
    url: 'advent.example',
  }

  test('minden szöveg rákerül a vászonra, a jelenet pedig a kártyán belül marad', () => {
    const written: string[] = []
    const images: number[][] = []
    const gradient = { addColorStop: vi.fn() }
    const ctx = new Proxy(
      {
        fillText: (value: string) => written.push(value),
        drawImage: (_image: unknown, ...box: number[]) => images.push(box),
        createRadialGradient: () => gradient,
      } as Record<string, unknown>,
      {
        get: (target, key: string) => (key in target ? target[key] : () => {}),
        set: () => true,
      },
    ) as unknown as CanvasRenderingContext2D

    drawCard(ctx, text, {} as CanvasImageSource)

    for (const value of ['Advent 2026', '18 / 24', 'dísz a fán', '61', 'pont', 'advent.example']) {
      expect(written, value).toContain(value)
    }
    expect(written.some((line) => line.includes('Kvíz: 52 / 74') && line.includes('Rejtvény: 9 / 25'))).toBe(true)

    expect(images).toHaveLength(1)
    const [x, y, width, height] = images[0]
    expect(x).toBeGreaterThanOrEqual(0)
    expect(x + width).toBeLessThanOrEqual(CARD_WIDTH)
    expect(y + height).toBeLessThanOrEqual(CARD_HEIGHT)
    // A jelenet aránya megmarad (130 : 120), és nem lóg rá a számokra.
    expect(height / width).toBeCloseTo(120 / 130)
    expect(y + height).toBeLessThan(1000)
  })

  test('a kártya 1080 × 1350 px', () => {
    expect([CARD_WIDTH, CARD_HEIGHT]).toEqual([1080, 1350])
  })
})

describe('megosztás', () => {
  test('ahol nincs Web Share, ott a fájl nem osztható meg', () => {
    const file = new File(['x'], 'advent-2026.png', { type: 'image/png' })
    expect(canShareFile(file)).toBe(false)
  })
})
