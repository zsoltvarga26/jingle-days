import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import type { Lang } from '../../content/types'
import { I18nProvider } from '../../i18n/I18nContext'
import type { CardInput } from '../../lib/shareCard'
import { emptySave, progressReducer } from '../../state/progress'
import { ProgressProvider } from '../../state/ProgressContext'
import { SettingsProvider } from '../../state/SettingsContext'
import { SAVE_KEY, SETTINGS_KEY } from '../../state/storage'
import { ShareCard } from './ShareCard'

// A vászonra rajzolást a jsdom nem tudja: a kép készítését és a böngészőfüggő műveleteket
// itt ál-függvények helyettesítik, a kártya szövegeit és a gombokat viszont a valódi kód adja.
const mocks = vi.hoisted(() => ({
  renderShareCard: vi.fn(),
  canShareFile: vi.fn(),
  shareFile: vi.fn(),
  downloadFile: vi.fn(),
  copyText: vi.fn(),
}))

vi.mock('../../lib/shareCard', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../lib/shareCard')>()),
  ...mocks,
}))

const file = new File(['png'], 'advent-2026.png', { type: 'image/png' })

function setup(lang: Lang = 'hu', opened: number[] = [1, 2]) {
  window.localStorage.clear()
  window.localStorage.setItem(
    SETTINGS_KEY,
    JSON.stringify({ lang, sfx: true, music: false, musicVolume: 0.3 }),
  )
  const save = opened.reduce(
    (state, day) =>
      progressReducer(
        progressReducer(state, { type: 'OPEN_DAY', day, quizCount: 3, puzzleCount: 1, at: 'x' }),
        { type: 'ANSWER_QUESTION', day, question: 0, choice: 0 },
      ),
    emptySave(),
  )
  window.localStorage.setItem(SAVE_KEY, JSON.stringify(save))

  const onClose = vi.fn()
  render(
    <SettingsProvider>
      <I18nProvider>
        <ProgressProvider>
          <ShareCard onClose={onClose} />
        </ProgressProvider>
      </I18nProvider>
    </SettingsProvider>,
  )
  return { onClose }
}

beforeEach(() => {
  Object.values(mocks).forEach((mock) => mock.mockReset())
  mocks.renderShareCard.mockResolvedValue(file)
  mocks.canShareFile.mockReturnValue(false)
  mocks.copyText.mockResolvedValue(true)
  URL.createObjectURL = vi.fn(() => 'blob:kartya')
  URL.revokeObjectURL = vi.fn()
})

describe('ShareCard', () => {
  test('a kép az ablak megnyitásakor készül el, az aktív nyelvű szövegekkel', async () => {
    setup('hu')
    expect(screen.getByRole('status')).toHaveTextContent('Készül a kártya…')
    expect(mocks.renderShareCard).toHaveBeenCalledTimes(1)

    const input = mocks.renderShareCard.mock.calls[0][0] as CardInput
    expect(input.text).toMatchObject({
      title: 'Advent 2026',
      ornaments: '2 / 24',
      ornamentsLabel: 'dísz a fán',
      points: '2',
      pointsLabel: 'pont',
      quiz: 'Kvíz: 2 / 74',
      puzzles: 'Rejtvény: 0 / 25',
    })
    expect([...input.earned].sort()).toEqual(['d01-bauble-red', 'd02-bauble-gold'])

    const image = await screen.findByRole('img', { name: 'Eredménykártya: 2 / 24 dísz a fán, 2 pont' })
    expect(image).toHaveAttribute('src', 'blob:kartya')
  })

  test('angolul a kártya szövege is angol', async () => {
    setup('en')
    const input = mocks.renderShareCard.mock.calls[0][0] as CardInput
    expect(input.text).toMatchObject({
      ornamentsLabel: 'ornaments on the tree',
      pointsLabel: 'points',
      quiz: 'Quiz: 2 / 74',
      puzzles: 'Puzzles: 0 / 25',
    })
    await screen.findByRole('img')
  })

  test('megnyitott nap nélkül is értelmes kártya készül', async () => {
    setup('hu', [])
    const input = mocks.renderShareCard.mock.calls[0][0] as CardInput
    expect(input.text).toMatchObject({ ornaments: '0 / 24', points: '0' })
    expect(input.earned.size).toBe(0)
    await screen.findByRole('img', { name: 'Eredménykártya: 0 / 24 dísz a fán, 0 pont' })
  })

  test('ahol nincs rendszerszintű megosztás: letöltés és szövegmásolás', async () => {
    setup()
    await screen.findByRole('img')
    expect(screen.queryByRole('button', { name: 'Megosztás' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Kép letöltése' }))
    expect(mocks.downloadFile).toHaveBeenCalledWith(file)

    fireEvent.click(screen.getByRole('button', { name: 'Szöveg másolása' }))
    await waitFor(() => expect(screen.getByText('Kimásolva!')).toBeInTheDocument())
    const copied = mocks.copyText.mock.calls[0][0] as string
    expect(copied).toContain('2 / 24 dísz, 2 pont')
    expect(copied).toContain(window.location.origin)
  })

  test('ahol van rendszerszintű megosztás, a gomb a kész fájlt adja át', async () => {
    mocks.canShareFile.mockReturnValue(true)
    mocks.shareFile.mockResolvedValue(true)
    setup()
    await screen.findByRole('img')

    fireEvent.click(screen.getByRole('button', { name: 'Megosztás' }))
    expect(mocks.shareFile).toHaveBeenCalledTimes(1)
    expect(mocks.shareFile.mock.calls[0][0]).toBe(file)
    // A kép nem ekkor készül: a megnyitás óta nem volt újabb rajzolás.
    expect(mocks.renderShareCard).toHaveBeenCalledTimes(1)
  })

  test('ha a kép nem készül el, a szöveg akkor is másolható', async () => {
    mocks.renderShareCard.mockRejectedValue(new Error('nincs vászon'))
    setup()
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('A képet most nem sikerült elkészíteni'),
    )
    expect(screen.queryByRole('button', { name: 'Kép letöltése' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Szöveg másolása' })).toBeInTheDocument()
  })

  test('sikertelen másolásnál ezt jelzi', async () => {
    mocks.copyText.mockResolvedValue(false)
    setup()
    await screen.findByRole('img')
    fireEvent.click(screen.getByRole('button', { name: 'Szöveg másolása' }))
    await waitFor(() => expect(screen.getByText('Nem sikerült a másolás.')).toBeInTheDocument())
  })
})
