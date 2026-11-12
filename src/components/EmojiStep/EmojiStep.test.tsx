import { fireEvent, render, screen } from '@testing-library/react'
import { useReducer } from 'react'
import { describe, expect, test, vi } from 'vitest'
import { getDay } from '../../content/days'
import type { Lang } from '../../content/types'
import { I18nProvider } from '../../i18n/I18nContext'
import { emptySave, progressReducer, type ProgressAction, type SaveData } from '../../state/progress'
import { SettingsProvider } from '../../state/SettingsContext'
import { EmojiStep } from './EmojiStep'

function opened(day: number, extra: ProgressAction[] = []): SaveData {
  const content = getDay(day)
  return [
    {
      type: 'OPEN_DAY' as const,
      day,
      quizCount: content.quiz.length,
      puzzleCount: content.emoji.length,
      at: '2026-12-01T08:00:00.000Z',
    },
    ...extra,
  ].reduce(progressReducer, emptySave())
}

/** A rejtvény egy valódi reducerre kötve, ahogy a DayDialogban fut. */
function Harness({
  day,
  start,
  startPuzzle,
  onDone,
  onSolved,
}: {
  day: number
  start: SaveData
  startPuzzle?: number
  onDone: () => void
  onSolved: () => void
}) {
  const [state, dispatch] = useReducer(progressReducer, start)
  return (
    <>
      <EmojiStep
        puzzles={getDay(day).emoji}
        progress={state.days[day].emoji}
        start={startPuzzle}
        onGuess={(puzzle, correct) => dispatch({ type: 'SUBMIT_GUESS', day, puzzle, correct })}
        onRevealHint={(puzzle) => dispatch({ type: 'REVEAL_HINT', day, puzzle })}
        onSkip={(puzzle) => dispatch({ type: 'SKIP_EMOJI', day, puzzle })}
        onDone={onDone}
        onSolved={onSolved}
      />
      <output data-testid="state">{JSON.stringify(state.days[day].emoji)}</output>
    </>
  )
}

function setup(
  day: number,
  options: { start?: SaveData; startPuzzle?: number; lang?: Lang } = {},
) {
  window.localStorage.setItem(
    'advent-2026:settings',
    JSON.stringify({ lang: options.lang ?? 'hu', sfx: true, music: false, musicVolume: 0.3 }),
  )
  const onDone = vi.fn()
  const onSolved = vi.fn()
  render(
    <SettingsProvider>
      <I18nProvider>
        <Harness
          day={day}
          start={options.start ?? opened(day)}
          startPuzzle={options.startPuzzle}
          onDone={onDone}
          onSolved={onSolved}
        />
      </I18nProvider>
    </SettingsProvider>,
  )
  const saved = () => JSON.parse(screen.getByTestId('state').textContent ?? '[]')
  const field = () => screen.getByRole('textbox')
  const guess = (text: string) => {
    fireEvent.change(field(), { target: { value: text } })
    fireEvent.submit(field().closest('form')!)
  }
  return { onDone, onSolved, saved, field, guess }
}

describe('EmojiStep', () => {
  test('megmutatja az emojisort és a típusát, a megfejtést nem', () => {
    setup(1)
    expect(screen.getByText('❄️👸⛄')).toBeInTheDocument()
    expect(screen.getByText('Filmcím')).toBeInTheDocument()
    expect(screen.queryByText(/jégvarázs/i)).not.toBeInTheDocument()
    // Egyetlen rejtvénynél nincs „1 / 1” számláló.
    expect(screen.queryByText(/rejtvény$/)).not.toBeInTheDocument()
  })

  test('hibás válasz: szöveges üzenet, a mező tartalma megmarad, a próbálkozás számolódik', () => {
    const { guess, field, saved, onSolved } = setup(1)
    guess('Hókirálynő')
    expect(screen.getByText('Nem ez az, próbáld újra!')).toBeInTheDocument()
    expect(field()).toHaveValue('Hókirálynő')
    expect(field()).toHaveAttribute('aria-invalid', 'true')
    expect(saved()[0]).toEqual({ hintsRevealed: 0, attempts: 1, status: 'pending' })
    expect(onSolved).not.toHaveBeenCalled()

    // Gépelésre az üzenet eltűnik.
    fireEvent.change(field(), { target: { value: 'J' } })
    expect(screen.queryByText('Nem ez az, próbáld újra!')).not.toBeInTheDocument()
  })

  test('üres beküldés nem számít próbálkozásnak', () => {
    const { guess, saved } = setup(1)
    guess('   ')
    expect(saved()[0].attempts).toBe(0)
    expect(screen.queryByText('Nem ez az, próbáld újra!')).not.toBeInTheDocument()
  })

  test('helyes válasz lazán beírva is: megfejtve, konfetti, a mező eltűnik', () => {
    const { guess, saved, onSolved, onDone } = setup(1)
    guess('  JEGVARAZS!! ')
    expect(saved()[0].status).toBe('done')
    expect(onSolved).toHaveBeenCalledTimes(1)
    expect(screen.getByText('A megfejtés: Jégvarázs')).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Rejtvény kihagyása' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Tovább' }))
    expect(onDone).toHaveBeenCalledTimes(1)
  })

  test('magyar felületen az angol megfejtés is elfogadott, és fordítva', () => {
    const hu = setup(1, { lang: 'hu' })
    hu.guess('Frozen')
    expect(hu.saved()[0].status).toBe('done')
    expect(screen.getByText('A megfejtés: Jégvarázs')).toBeInTheDocument()
  })

  test('angol felületen a magyar megfejtés is elfogadott, a kanonikus alak angolul jelenik meg', () => {
    const en = setup(1, { lang: 'en' })
    en.guess('jégvarázs')
    expect(en.saved()[0].status).toBe('done')
    expect(screen.getByText('The answer: Frozen')).toBeInTheDocument()
  })

  test('a 2. tipp csak az 1. után fedhető fel', () => {
    const { saved } = setup(1)
    const hints = getDay(1).emoji[0].hints
    const second = screen.getByRole('button', { name: '2. tipp – előbb az elsőt fedd fel' })
    expect(second).toHaveAttribute('aria-disabled', 'true')
    fireEvent.click(second)
    expect(saved()[0].hintsRevealed).toBe(0)

    fireEvent.click(screen.getByRole('button', { name: '1. tipp felfedése' }))
    expect(screen.getByText(hints[0].hu)).toBeInTheDocument()
    expect(screen.queryByText(hints[1].hu)).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '2. tipp felfedése' }))
    expect(screen.getByText(hints[1].hu)).toBeInTheDocument()
    expect(saved()[0].hintsRevealed).toBe(2)
  })

  test('a korábban felfedett tippek visszatéréskor is nyitva vannak', () => {
    setup(1, { start: opened(1, [{ type: 'REVEAL_HINT', day: 1, puzzle: 0 }]) })
    expect(screen.getByText(getDay(1).emoji[0].hints[0].hu)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '2. tipp felfedése' })).toBeInTheDocument()
  })

  test('a kihagyás nem mutatja a megfejtést, és egy rejtvénynél továbblép', () => {
    const { saved, onDone } = setup(1)
    fireEvent.click(screen.getByRole('button', { name: 'Rejtvény kihagyása' }))
    expect(saved()[0].status).toBe('skipped')
    expect(onDone).toHaveBeenCalledTimes(1)
    expect(screen.queryByText(/jégvarázs/i)).not.toBeInTheDocument()
  })

  test('a 24. napon két rejtvény jön egymás után, saját tippekkel', () => {
    const { guess, saved, onDone } = setup(24)
    const [first, second] = getDay(24).emoji
    expect(screen.getByText('1 / 2. rejtvény')).toBeInTheDocument()
    expect(screen.getByText(first.emojis)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '1. tipp felfedése' }))
    guess('grincs')
    fireEvent.click(screen.getByRole('button', { name: 'Következő rejtvény' }))

    expect(screen.getByText('2 / 2. rejtvény')).toBeInTheDocument()
    expect(screen.getByText(second.emojis)).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveValue('')
    // A második rejtvény tippjei még zárva vannak.
    expect(screen.getByRole('button', { name: '1. tipp felfedése' })).toBeInTheDocument()
    expect(saved().map((p: { hintsRevealed: number }) => p.hintsRevealed)).toEqual([1, 0])
    expect(onDone).not.toHaveBeenCalled()
  })

  test('megfejtett rejtvényre visszatérve csak az eredmény látszik', () => {
    setup(1, { start: opened(1, [{ type: 'SUBMIT_GUESS', day: 1, puzzle: 0, correct: true }]) })
    expect(screen.getByText('A megfejtés: Jégvarázs')).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /tipp/ })).not.toBeInTheDocument()
  })

  test('kihagyott első rejtvény folytatása után nem kérdezi újra a már megfejtett másodikat', () => {
    const start = opened(24, [
      { type: 'SKIP_EMOJI', day: 24, puzzle: 0 },
      { type: 'SUBMIT_GUESS', day: 24, puzzle: 1, correct: true },
      { type: 'RESUME_STEP', day: 24, step: 'emoji', puzzle: 0 },
    ])
    const { guess, onDone } = setup(24, { start, startPuzzle: 0 })
    expect(screen.getByText('1 / 2. rejtvény')).toBeInTheDocument()
    guess('The Grinch')
    fireEvent.click(screen.getByRole('button', { name: 'Tovább' }))
    expect(onDone).toHaveBeenCalledTimes(1)
  })
})
