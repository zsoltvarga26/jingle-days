import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { I18nProvider } from '../../i18n/I18nContext'
import { SettingsProvider } from '../../state/SettingsContext'
import { SETTINGS_KEY } from '../../state/storage'
import { PettableCat } from './PettableCat'

const playSfx = vi.hoisted(() => vi.fn())
vi.mock('../../audio/sfx', () => ({ playSfx, PURR_SECONDS: 2.6 }))

function setup(sfx = true, extra: Record<string, unknown> = {}) {
  window.localStorage.setItem(
    SETTINGS_KEY,
    JSON.stringify({ lang: 'hu', sfx, music: false, musicVolume: 0.3, ...extra }),
  )
  const { container } = render(
    <SettingsProvider>
      <I18nProvider>
        <PettableCat />
      </I18nProvider>
    </SettingsProvider>,
  )
  const cat = () => container.querySelector('[data-cat]')!.getAttribute('data-cat')
  const bowlName = () => container.querySelector('[data-bowl-name]')?.textContent ?? null
  const pet = () => fireEvent.click(screen.getByRole('button', { name: /^Megsimogatom az alvó cicát/ }))
  const bowl = () => screen.getByRole('button', { name: /^A cica nevének és bundájának módosítása/ })
  const coat = () => container.querySelector('[data-cat]')!.getAttribute('data-coat')
  const stripes = () => container.querySelectorAll('[data-cat-stripes]').length
  return { cat, pet, bowl, bowlName, coat, stripes }
}

const savedName = () => JSON.parse(window.localStorage.getItem(SETTINGS_KEY)!).catName

beforeEach(() => {
  vi.useFakeTimers()
  window.localStorage.clear()
  playSfx.mockClear()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('a megsimogatott cica', () => {
  test('kinyitja a szemét, dorombol, és ezt szövegben is jelzi', () => {
    const { cat, pet } = setup()
    expect(cat()).toBe('asleep')

    pet()
    expect(cat()).toBe('awake')
    expect(playSfx).toHaveBeenCalledExactlyOnceWith('purr')
    expect(screen.getByText('Prrr… Lajos dorombol')).toBeInTheDocument()

    // A dorombolás után visszaalszik.
    act(() => vi.advanceTimersByTime(3300))
    expect(cat()).toBe('asleep')
    expect(screen.queryByText('Prrr… Lajos dorombol')).not.toBeInTheDocument()
  })

  test('nem lehet spammelni: a pihenőidő alatt a simogatás hatástalan', () => {
    const { cat, pet } = setup()
    pet()
    pet()
    pet()
    expect(playSfx).toHaveBeenCalledTimes(1)

    // Már alszik, de még pihen.
    act(() => vi.advanceTimersByTime(4000))
    expect(cat()).toBe('asleep')
    pet()
    expect(cat()).toBe('asleep')
    expect(playSfx).toHaveBeenCalledTimes(1)

    // A pihenő után újra megsimogatható.
    act(() => vi.advanceTimersByTime(2000))
    pet()
    expect(cat()).toBe('awake')
    expect(playSfx).toHaveBeenCalledTimes(2)
  })

  test('a gomb neve és a dorombolás a mentett nevet használja, ragozás nélkül', () => {
    const { pet, bowlName } = setup(true, { catName: 'Pamacs' })
    expect(bowlName()).toBe('Pamacs')
    expect(screen.getByRole('button', { name: 'Megsimogatom az alvó cicát (Pamacs)' })).toBeInTheDocument()
    pet()
    expect(screen.getByText('Prrr… Pamacs dorombol')).toBeInTheDocument()
  })

  test('kikapcsolt hangeffekteknél csendben ébred', () => {
    const { cat, pet } = setup(false)
    pet()
    expect(cat()).toBe('awake')
    expect(playSfx).not.toHaveBeenCalled()
  })
})

describe('a cica átnevezése a tálkán', () => {
  test('alapból Lajos a neve, és ez áll a tálkán', () => {
    const { bowl, bowlName } = setup()
    expect(bowlName()).toBe('Lajos')
    expect(bowl()).toHaveAccessibleName('A cica nevének és bundájának módosítása (most: Lajos)')
    expect(bowl()).toHaveAttribute('aria-expanded', 'false')
  })

  test('a tálkára kattintva átnevezhető; a név rendbe téve mentődik, a fókusz visszakerül', () => {
    const { bowl, bowlName } = setup()
    fireEvent.click(bowl())
    expect(bowl()).toHaveAttribute('aria-expanded', 'true')

    const input = screen.getByRole('textbox', { name: 'A cica neve' })
    expect(input).toHaveFocus()
    expect(input).toHaveValue('Lajos')
    expect(input).toHaveAttribute('maxLength', '10')
    expect(input).toHaveAccessibleDescription('Legfeljebb 10 karakter. Üresen hagyva újra Lajos lesz.')

    fireEvent.change(input, { target: { value: '  Cirmi  ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Mentés' }))

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(bowlName()).toBe('Cirmi')
    expect(savedName()).toBe('Cirmi')
    expect(bowl()).toHaveAccessibleName('A cica nevének és bundájának módosítása (most: Cirmi)')
    expect(bowl()).toHaveFocus()
    expect(screen.getByRole('button', { name: 'Megsimogatom az alvó cicát (Cirmi)' })).toBeInTheDocument()
  })

  test('Enterrel is ment', () => {
    const { bowl, bowlName } = setup()
    fireEvent.click(bowl())
    const input = screen.getByRole('textbox', { name: 'A cica neve' })
    fireEvent.change(input, { target: { value: 'Mázli' } })
    fireEvent.submit(input)
    expect(bowlName()).toBe('Mázli')
  })

  test('Escape-re és Mégsére nem változik semmi', () => {
    const { bowl, bowlName } = setup()
    fireEvent.click(bowl())
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Bors' } })
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Escape' })
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(bowlName()).toBe('Lajos')
    expect(bowl()).toHaveFocus()

    fireEvent.click(bowl())
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Bors' } })
    fireEvent.click(screen.getByRole('button', { name: 'Mégse' }))
    expect(bowlName()).toBe('Lajos')
    expect(window.localStorage.getItem(SETTINGS_KEY)).not.toContain('Bors')
  })

  test('üresen mentve visszakapja az alapnevét', () => {
    const { bowl, bowlName } = setup(true, { catName: 'Cirmi' })
    fireEvent.click(bowl())
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '   ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Mentés' }))
    expect(bowlName()).toBe('Lajos')
    expect(savedName()).toBe('Lajos')
  })
})

describe('a cica bundája', () => {
  test('alapból fekete-fehér, csíkok nélkül', () => {
    const { coat, stripes } = setup()
    expect(coat()).toBe('tuxedo')
    expect(stripes()).toBe(0)
  })

  test('a mentett bundával töltődik be; a cirmos csíkos', () => {
    const { coat, stripes } = setup(true, { catCoat: 'brown' })
    expect(coat()).toBe('brown')
    expect(stripes()).toBeGreaterThan(0)
  })

  test('a szerkesztőben mind a hat bunda választható, a jelenlegi kijelölve', () => {
    const { bowl } = setup(true, { catCoat: 'white' })
    fireEvent.click(bowl())
    const group = screen.getByRole('group', { name: 'Bunda' })
    const names = ['Fekete-fehér', 'Hófehér', 'Vörös cirmos', 'Szürke cirmos', 'Barna cirmos', 'Bézs']
    for (const name of names) expect(within(group).getByRole('radio', { name })).toBeInTheDocument()
    expect(within(group).getByRole('radio', { name: 'Hófehér' })).toBeChecked()
  })

  test('választáskor azonnal átszíneződik, Mentésre elmentődik', () => {
    const { bowl, coat } = setup()
    fireEvent.click(bowl())
    fireEvent.click(screen.getByRole('radio', { name: 'Vörös cirmos' }))
    expect(coat()).toBe('ginger')
    expect(window.localStorage.getItem(SETTINGS_KEY)).not.toContain('ginger')

    fireEvent.click(screen.getByRole('button', { name: 'Mentés' }))
    expect(coat()).toBe('ginger')
    expect(JSON.parse(window.localStorage.getItem(SETTINGS_KEY)!).catCoat).toBe('ginger')
  })

  test('Mégsére és Escape-re visszaáll a korábbi bunda', () => {
    const { bowl, coat } = setup(true, { catCoat: 'gray' })
    fireEvent.click(bowl())
    fireEvent.click(screen.getByRole('radio', { name: 'Hófehér' }))
    expect(coat()).toBe('white')
    fireEvent.click(screen.getByRole('button', { name: 'Mégse' }))
    expect(coat()).toBe('gray')

    fireEvent.click(bowl())
    fireEvent.click(screen.getByRole('radio', { name: 'Barna cirmos' }))
    fireEvent.keyDown(screen.getByRole('radio', { name: 'Barna cirmos' }), { key: 'Escape' })
    expect(coat()).toBe('gray')
    expect(JSON.parse(window.localStorage.getItem(SETTINGS_KEY)!).catCoat).toBe('gray')
  })
})
