import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { useReducer } from 'react'
import { describe, expect, test, vi } from 'vitest'
import { getDay } from '../../content/days'
import { I18nProvider } from '../../i18n/I18nContext'
import { emptySave, progressReducer, type SaveData } from '../../state/progress'
import { SettingsProvider } from '../../state/SettingsContext'
import { QuizStep } from './QuizStep'

const DAY = 2
const questions = getDay(DAY).quiz

const opened = (): SaveData =>
  progressReducer(emptySave(), {
    type: 'OPEN_DAY',
    day: DAY,
    quizCount: questions.length,
    puzzleCount: 1,
    at: '2026-12-02T08:00:00.000Z',
  })

/** A kvíz egy valódi reducerre kötve, ahogy a DayDialogban fut. */
function Harness({
  start,
  onDone,
  onCorrect,
}: {
  start: SaveData
  onDone: () => void
  onCorrect: () => void
}) {
  const [state, dispatch] = useReducer(progressReducer, start)
  return (
    <>
      <QuizStep
        questions={questions}
        progress={state.days[DAY].quiz}
        onAnswer={(question, choice) => dispatch({ type: 'ANSWER_QUESTION', day: DAY, question, choice })}
        onSkip={() => dispatch({ type: 'SKIP_QUIZ', day: DAY })}
        onDone={onDone}
        onCorrect={onCorrect}
      />
      <output data-testid="state">{JSON.stringify(state.days[DAY].quiz)}</output>
    </>
  )
}

function setup(start: SaveData = opened()) {
  window.localStorage.setItem(
    'advent-2026:settings',
    JSON.stringify({ lang: 'hu', sfx: true, music: false, musicVolume: 0.3 }),
  )
  const onDone = vi.fn()
  const onCorrect = vi.fn()
  render(
    <SettingsProvider>
      <I18nProvider>
        <Harness start={start} onDone={onDone} onCorrect={onCorrect} />
      </I18nProvider>
    </SettingsProvider>,
  )
  const saved = () => JSON.parse(screen.getByTestId('state').textContent ?? '{}')
  const options = () => within(screen.getByRole('group')).getAllByRole('button')
  return { onDone, onCorrect, saved, options }
}

const hu = (index: number, option: number) => questions[index].options[option].hu
const correctHu = (index: number) => hu(index, questions[index].correctIndex)
const wrongHu = (index: number) => hu(index, (questions[index].correctIndex + 1) % questions[index].options.length)

describe('QuizStep', () => {
  test('egyszerre egy kérdés látszik, a tartalom szerinti számú válasszal', () => {
    const { options } = setup()
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(questions[0].question.hu)
    expect(screen.getByText('1 / 3. kérdés')).toBeInTheDocument()
    expect(options()).toHaveLength(questions[0].options.length)
    expect(screen.queryByRole('button', { name: 'Következő kérdés' })).not.toBeInTheDocument()
  })

  test('helyes válasz: szöveges visszajelzés, magyarázat, konfetti, majd a következő kérdés', () => {
    const { onCorrect, saved } = setup()
    fireEvent.click(screen.getByRole('button', { name: correctHu(0) }))

    expect(screen.getByText('Helyes!')).toBeInTheDocument()
    expect(screen.getByText(questions[0].explanation!.hu)).toBeInTheDocument()
    expect(onCorrect).toHaveBeenCalledTimes(1)
    // A mentés az eredeti (nem kevert) indexet tárolja.
    expect(saved().answers).toEqual([questions[0].correctIndex, null, null])

    fireEvent.click(screen.getByRole('button', { name: 'Következő kérdés' }))
    const heading = screen.getByRole('heading', { level: 3 })
    expect(heading).toHaveTextContent(questions[1].question.hu)
    expect(heading).toHaveFocus()
  })

  test('hibás válasz: a helyes válasz szövegben is megjelenik, konfetti nincs', () => {
    const { onCorrect, options } = setup()
    fireEvent.click(screen.getByRole('button', { name: wrongHu(0) }))

    expect(screen.getByText(`Nem talált. A helyes válasz: ${correctHu(0)}`)).toBeInTheDocument()
    expect(onCorrect).not.toHaveBeenCalled()
    const states = options().map((b) => b.getAttribute('data-state'))
    expect(states.filter((s) => s === 'right')).toHaveLength(1)
    expect(states.filter((s) => s === 'wrong')).toHaveLength(1)
  })

  test('megválaszolt kérdésre nem lehet újra válaszolni', () => {
    const { saved } = setup()
    fireEvent.click(screen.getByRole('button', { name: new RegExp(wrongHu(0)) }))
    const first = saved().answers[0]
    fireEvent.click(screen.getByRole('button', { name: new RegExp(correctHu(0)) }))
    expect(saved().answers[0]).toBe(first)
  })

  test('az utolsó kérdés után „Tovább” jön, és a kihagyás gomb eltűnik', () => {
    const { onDone, saved } = setup()
    for (let i = 0; i < questions.length; i++) {
      fireEvent.click(screen.getByRole('button', { name: correctHu(i) }))
      if (i < questions.length - 1) {
        fireEvent.click(screen.getByRole('button', { name: 'Következő kérdés' }))
      }
    }
    expect(saved().status).toBe('done')
    expect(screen.queryByRole('button', { name: 'Kvíz kihagyása' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Tovább' }))
    expect(onDone).toHaveBeenCalledTimes(1)
  })

  test('a kihagyás megőrzi a már megadott választ', () => {
    const { saved } = setup()
    fireEvent.click(screen.getByRole('button', { name: correctHu(0) }))
    fireEvent.click(screen.getByRole('button', { name: 'Következő kérdés' }))
    fireEvent.click(screen.getByRole('button', { name: 'Kvíz kihagyása' }))
    expect(saved()).toEqual({ answers: [questions[0].correctIndex, null, null], status: 'skipped' })
  })

  test('folytatáskor az első megválaszolatlan kérdésnél nyílik', () => {
    const start = progressReducer(opened(), {
      type: 'ANSWER_QUESTION',
      day: DAY,
      question: 0,
      choice: questions[0].correctIndex,
    })
    setup(start)
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(questions[1].question.hu)
    expect(screen.getByText('2 / 3. kérdés')).toBeInTheDocument()
  })

  test('a válaszok sorrendje minden megjelenítéskor ugyanaz', () => {
    const first = setup()
    const order = first.options().map((b) => b.textContent)
    cleanup()
    const second = setup()
    expect(second.options().map((b) => b.textContent)).toEqual(order)
  })
})
