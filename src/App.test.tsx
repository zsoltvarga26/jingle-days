import { fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import App from './App'
import { SAVE_KEY, SETTINGS_KEY } from './state/storage'

function renderAt(date: Date, lang: 'hu' | 'en' = 'hu') {
  vi.setSystemTime(date)
  window.localStorage.setItem(
    SETTINGS_KEY,
    JSON.stringify({ lang, sfx: true, music: false, musicVolume: 0.3 }),
  )
  return render(<App />)
}

const doors = () => within(screen.getByRole('region')).getAllByRole('button')
const door = (day: number) => doors().find((b) => b.getAttribute('data-day') === String(day))!
const statuses = () =>
  Object.fromEntries(doors().map((b) => [Number(b.getAttribute('data-day')), b.getAttribute('data-status')]))

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'] })
  window.localStorage.clear()
  window.history.replaceState(null, '', '/')
})

afterEach(() => {
  vi.useRealTimers()
})

describe('App', () => {
  test('december 1. előtt minden ajtó zárolt, és látszik a kezdő felirat', () => {
    renderAt(new Date(2026, 10, 20, 12))
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Advent 2026')
    expect(screen.getByRole('status')).toHaveTextContent(
      'Az első ablak december 1-jén nyílik – még 11 nap!',
    )
    expect(doors()).toHaveLength(24)
    expect(new Set(Object.values(statuses()))).toEqual(new Set(['locked']))
  })

  test('zárolt ajtóra kattintva nem nyílik meg, és kiírja, hány nap múlva nyílik', () => {
    renderAt(new Date(2026, 10, 29, 12))
    fireEvent.click(door(1))
    expect(door(1)).toHaveAttribute('data-status', 'locked')
    expect(within(door(1)).getByText('2 nap múlva nyílik')).toBeInTheDocument()
    expect(window.localStorage.getItem(SAVE_KEY)).not.toContain('openedAt')
  })

  test('december 10-én az 1–10. ajtó nyitható, a többi zárolt, felirat nincs', () => {
    renderAt(new Date(2026, 11, 10, 9))
    const all = statuses()
    for (let day = 1; day <= 24; day++) {
      expect(all[day], `${day}. nap`).toBe(day <= 10 ? 'closed' : 'locked')
    }
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(door(11)).toHaveAccessibleName('11. ablak, zárolt – Holnap nyílik')
  })

  test('megnyitott ajtó mentődik, és újratöltés után is nyitva van', () => {
    const first = renderAt(new Date(2026, 11, 10, 9))
    fireEvent.click(door(3))
    expect(door(3)).toHaveAttribute('data-status', 'open')
    expect(screen.getByText('1 / 24 ablak nyitva')).toBeInTheDocument()
    expect(JSON.parse(window.localStorage.getItem(SAVE_KEY)!).days[3].quiz.answers).toHaveLength(3)

    first.unmount()
    render(<App />)
    expect(door(3)).toHaveAttribute('data-status', 'open')
  })

  test('elrontott mentéssel is betölt, üres előrehaladással', () => {
    window.localStorage.setItem(SAVE_KEY, '{ez nem json')
    renderAt(new Date(2026, 11, 10, 9))
    expect(screen.getByText('0 / 24 ablak nyitva')).toBeInTheDocument()
  })

  test('december 26-án minden nyitható, a visszaszámláló helyén üdvözlet áll', () => {
    renderAt(new Date(2026, 11, 26, 9))
    expect(new Set(Object.values(statuses()))).toEqual(new Set(['closed']))
    expect(screen.getByText('Boldog karácsonyt! 🎄')).toBeInTheDocument()
  })

  test('nyelvváltásra a szövegek, a html lang és a cím is vált, és a választás mentődik', () => {
    renderAt(new Date(2026, 10, 20, 12))
    expect(document.documentElement.lang).toBe('hu')

    fireEvent.click(screen.getByRole('button', { name: 'Angol' }))
    expect(screen.getByRole('status')).toHaveTextContent(
      'The first door opens on December 1 – 11 days to go!',
    )
    expect(document.documentElement.lang).toBe('en')
    expect(document.title).toBe('Advent 2026 – Advent calendar')
    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true')
    expect(JSON.parse(window.localStorage.getItem(SETTINGS_KEY)!).lang).toBe('en')
  })

  test('a ?lang= paraméter felülírja a nyelvet, de nem menti el', () => {
    window.history.replaceState(null, '', '/?lang=en')
    renderAt(new Date(2026, 10, 20, 12), 'hu')
    expect(document.documentElement.lang).toBe('en')
    expect(JSON.parse(window.localStorage.getItem(SETTINGS_KEY)!).lang).toBe('hu')
  })

  test('a visszaállítás megerősítést kér, és a nyelvet nem állítja vissza', () => {
    renderAt(new Date(2026, 11, 10, 9), 'en')
    fireEvent.click(door(1))
    fireEvent.click(door(2))
    expect(screen.getByText('2 / 24 doors open')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Reset progress' }))
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.getByText('2 / 24 doors open')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Reset progress' }))
    fireEvent.click(screen.getByRole('button', { name: 'Yes, reset' }))
    expect(screen.getByText('0 / 24 doors open')).toBeInTheDocument()
    expect(door(1)).toHaveAttribute('data-status', 'closed')
    expect(JSON.parse(window.localStorage.getItem(SETTINGS_KEY)!).lang).toBe('en')
  })
})
