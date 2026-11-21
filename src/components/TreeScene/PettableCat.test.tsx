import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { I18nProvider } from '../../i18n/I18nContext'
import { SettingsProvider } from '../../state/SettingsContext'
import { SETTINGS_KEY } from '../../state/storage'
import { PettableCat } from './PettableCat'

const playSfx = vi.hoisted(() => vi.fn())
vi.mock('../../audio/sfx', () => ({ playSfx, PURR_SECONDS: 2.6 }))

function setup(sfx = true) {
  window.localStorage.setItem(
    SETTINGS_KEY,
    JSON.stringify({ lang: 'hu', sfx, music: false, musicVolume: 0.3 }),
  )
  const { container } = render(
    <SettingsProvider>
      <I18nProvider>
        <PettableCat />
      </I18nProvider>
    </SettingsProvider>,
  )
  const cat = () => container.querySelector('[data-cat]')!.getAttribute('data-cat')
  const button = screen.getByRole('button', { name: 'Megsimogatom Lajost, az alvó cicát' })
  return { cat, pet: () => fireEvent.click(button) }
}

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

  test('kikapcsolt hangeffekteknél csendben ébred', () => {
    const { cat, pet } = setup(false)
    pet()
    expect(cat()).toBe('awake')
    expect(playSfx).not.toHaveBeenCalled()
  })
})
