import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { useSound } from '../../audio/useSound'
import { I18nProvider } from '../../i18n/I18nContext'
import { SettingsProvider } from '../../state/SettingsContext'
import { SETTINGS_KEY } from '../../state/storage'
import { SoundControls } from './SoundControls'

const playSfx = vi.hoisted(() => vi.fn())
vi.mock('../../audio/sfx', () => ({ playSfx }))

function Player() {
  const play = useSound()
  return (
    <button type="button" onClick={() => play('door')}>
      próba
    </button>
  )
}

function setup(saved?: Record<string, unknown>) {
  window.localStorage.clear()
  window.localStorage.setItem(
    SETTINGS_KEY,
    JSON.stringify({ lang: 'hu', sfx: true, music: false, musicVolume: 0.3, ...saved }),
  )
  render(
    <SettingsProvider>
      <I18nProvider>
        <SoundControls />
        <Player />
      </I18nProvider>
    </SettingsProvider>,
  )
  const settings = () => JSON.parse(window.localStorage.getItem(SETTINGS_KEY)!)
  return { settings }
}

beforeEach(() => {
  playSfx.mockClear()
})

describe('SoundControls', () => {
  test('alapból az effektek be, a zene ki van kapcsolva, csúszka nincs', () => {
    setup()
    expect(screen.getByRole('button', { name: 'Hangeffektek' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Háttérzene' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.queryByRole('slider')).not.toBeInTheDocument()
  })

  test('a két kapcsoló egymástól függetlenül vált, és az állapotuk mentődik', () => {
    const { settings } = setup()
    fireEvent.click(screen.getByRole('button', { name: 'Háttérzene' }))
    expect(settings()).toMatchObject({ sfx: true, music: true })

    fireEvent.click(screen.getByRole('button', { name: 'Hangeffektek' }))
    expect(settings()).toMatchObject({ sfx: false, music: true })
    expect(screen.getByRole('button', { name: 'Hangeffektek' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'Háttérzene' })).toHaveAttribute('aria-pressed', 'true')
  })

  test('a hangerőcsúszka a zene mellett jelenik meg, és az értéke mentődik', () => {
    const { settings } = setup({ music: true })
    const slider = screen.getByRole('slider', { name: 'A zene hangereje' })
    expect(slider).toHaveValue('0.3')
    fireEvent.change(slider, { target: { value: '0.75' } })
    expect(settings().musicVolume).toBe(0.75)
  })

  test('kikapcsolt effekteknél a useSound nem játszik le semmit', () => {
    setup()
    fireEvent.click(screen.getByRole('button', { name: 'próba' }))
    expect(playSfx).toHaveBeenCalledWith('door')

    playSfx.mockClear()
    fireEvent.click(screen.getByRole('button', { name: 'Hangeffektek' }))
    fireEvent.click(screen.getByRole('button', { name: 'próba' }))
    expect(playSfx).not.toHaveBeenCalled()
  })
})
