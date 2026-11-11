import { describe, expect, test } from 'vitest'
import {
  emptySave,
  firstUnanswered,
  hasSkippedStep,
  openedDays,
  progressReducer,
  type ProgressAction,
  type SaveData,
} from './progress'

const AT = '2026-12-01T08:00:00.000Z'

function run(actions: ProgressAction[], start: SaveData = emptySave()): SaveData {
  return actions.reduce(progressReducer, start)
}

const open = (day: number, quizCount = 3, puzzleCount = 1): ProgressAction => ({
  type: 'OPEN_DAY',
  day,
  quizCount,
  puzzleCount,
  at: AT,
})

describe('OPEN_DAY', () => {
  test('létrehozza a napot üres előrehaladással', () => {
    const state = run([open(1)])
    expect(state.days[1]).toEqual({
      openedAt: AT,
      quiz: { answers: [null, null, null], status: 'pending' },
      emoji: [{ hintsRevealed: 0, attempts: 0, status: 'pending' }],
      quoteSeen: false,
      ornamentShown: false,
    })
  })

  test('a 24. nap 5 kérdést és 2 rejtvényt kap', () => {
    const state = run([open(24, 5, 2)])
    expect(state.days[24].quiz.answers).toHaveLength(5)
    expect(state.days[24].emoji).toHaveLength(2)
  })

  test('már megnyitott napot nem ír felül', () => {
    const first = run([open(1), { type: 'ANSWER_QUESTION', day: 1, question: 0, choice: 2 }])
    expect(progressReducer(first, { ...open(1), at: 'később' } as ProgressAction)).toBe(first)
  })

  test('a megnyitott napok sorrendben kérdezhetők le', () => {
    expect(openedDays(run([open(7), open(2), open(13)]))).toEqual([2, 7, 13])
  })
})

describe('kvíz', () => {
  test('a válasz eltárolódik, és az utolsó után a kvíz kész', () => {
    const state = run([
      open(1),
      { type: 'ANSWER_QUESTION', day: 1, question: 0, choice: 1 },
      { type: 'ANSWER_QUESTION', day: 1, question: 1, choice: 0 },
    ])
    expect(state.days[1].quiz).toEqual({ answers: [1, 0, null], status: 'pending' })
    expect(firstUnanswered(state.days[1].quiz)).toBe(2)

    const done = progressReducer(state, { type: 'ANSWER_QUESTION', day: 1, question: 2, choice: 3 })
    expect(done.days[1].quiz).toEqual({ answers: [1, 0, 3], status: 'done' })
    expect(firstUnanswered(done.days[1].quiz)).toBe(-1)
  })

  test('megválaszolt kérdés nem írható felül', () => {
    const state = run([open(1), { type: 'ANSWER_QUESTION', day: 1, question: 0, choice: 1 }])
    const again = progressReducer(state, { type: 'ANSWER_QUESTION', day: 1, question: 0, choice: 2 })
    expect(again).toBe(state)
  })

  test('nem létező kérdésre és meg nem nyitott napra nem történik semmi', () => {
    const state = run([open(1)])
    expect(progressReducer(state, { type: 'ANSWER_QUESTION', day: 1, question: 9, choice: 0 })).toBe(state)
    expect(progressReducer(state, { type: 'ANSWER_QUESTION', day: 5, question: 0, choice: 0 })).toBe(state)
  })

  test('a kihagyás megőrzi a meglévő válaszokat, a folytatás az első megválaszolatlanhoz visz', () => {
    const skipped = run([
      open(1),
      { type: 'ANSWER_QUESTION', day: 1, question: 0, choice: 1 },
      { type: 'SKIP_QUIZ', day: 1 },
    ])
    expect(skipped.days[1].quiz).toEqual({ answers: [1, null, null], status: 'skipped' })
    expect(hasSkippedStep(skipped.days[1])).toBe(true)

    const resumed = progressReducer(skipped, { type: 'RESUME_STEP', day: 1, step: 'quiz' })
    expect(resumed.days[1].quiz.status).toBe('pending')
    expect(firstUnanswered(resumed.days[1].quiz)).toBe(1)
    expect(hasSkippedStep(resumed.days[1])).toBe(false)
  })

  test('kész kvíz nem hagyható ki utólag', () => {
    const done = run([
      open(1),
      { type: 'ANSWER_QUESTION', day: 1, question: 0, choice: 0 },
      { type: 'ANSWER_QUESTION', day: 1, question: 1, choice: 0 },
      { type: 'ANSWER_QUESTION', day: 1, question: 2, choice: 0 },
    ])
    expect(progressReducer(done, { type: 'SKIP_QUIZ', day: 1 })).toBe(done)
  })
})

describe('emoji-rejtvény', () => {
  test('a tippek egyesével nyílnak, legfeljebb kettő', () => {
    const hint: ProgressAction = { type: 'REVEAL_HINT', day: 1, puzzle: 0 }
    const one = run([open(1), hint])
    expect(one.days[1].emoji[0].hintsRevealed).toBe(1)
    const two = progressReducer(one, hint)
    expect(two.days[1].emoji[0].hintsRevealed).toBe(2)
    expect(progressReducer(two, hint)).toBe(two)
  })

  test('hibás tipp növeli a próbálkozások számát, helyes megfejti', () => {
    const state = run([
      open(1),
      { type: 'SUBMIT_GUESS', day: 1, puzzle: 0, correct: false },
      { type: 'SUBMIT_GUESS', day: 1, puzzle: 0, correct: false },
      { type: 'SUBMIT_GUESS', day: 1, puzzle: 0, correct: true },
    ])
    expect(state.days[1].emoji[0]).toEqual({ hintsRevealed: 0, attempts: 3, status: 'done' })
  })

  test('megfejtett rejtvény nem kérdezhető újra', () => {
    const solved = run([open(1), { type: 'SUBMIT_GUESS', day: 1, puzzle: 0, correct: true }])
    expect(progressReducer(solved, { type: 'SUBMIT_GUESS', day: 1, puzzle: 0, correct: false })).toBe(solved)
    expect(progressReducer(solved, { type: 'SKIP_EMOJI', day: 1, puzzle: 0 })).toBe(solved)
  })

  test('a 24. napon a kihagyás csak az aktuális rejtvényt érinti', () => {
    const state = run([open(24, 5, 2), { type: 'SKIP_EMOJI', day: 24, puzzle: 0 }])
    expect(state.days[24].emoji.map((p) => p.status)).toEqual(['skipped', 'pending'])

    const resumed = progressReducer(state, { type: 'RESUME_STEP', day: 24, step: 'emoji', puzzle: 0 })
    expect(resumed.days[24].emoji.map((p) => p.status)).toEqual(['pending', 'pending'])
  })

  test('kihagyott rejtvény megfejthető a folytatás után, a tippek megmaradnak', () => {
    const state = run([
      open(1),
      { type: 'REVEAL_HINT', day: 1, puzzle: 0 },
      { type: 'SKIP_EMOJI', day: 1, puzzle: 0 },
      { type: 'RESUME_STEP', day: 1, step: 'emoji', puzzle: 0 },
      { type: 'SUBMIT_GUESS', day: 1, puzzle: 0, correct: true },
    ])
    expect(state.days[1].emoji[0]).toEqual({ hintsRevealed: 1, attempts: 1, status: 'done' })
  })
})

describe('zárás és egyéb', () => {
  test('FINISH_DAY és ORNAMENT_SHOWN egyszer állít, utána nem változtat', () => {
    const state = run([open(1), { type: 'FINISH_DAY', day: 1 }, { type: 'ORNAMENT_SHOWN', day: 1 }])
    expect(state.days[1].quoteSeen).toBe(true)
    expect(state.days[1].ornamentShown).toBe(true)
    expect(progressReducer(state, { type: 'FINISH_DAY', day: 1 })).toBe(state)
    expect(progressReducer(state, { type: 'ORNAMENT_SHOWN', day: 1 })).toBe(state)
  })

  test('HYDRATE lecseréli az állapotot', () => {
    const other = run([open(3), open(4)])
    expect(progressReducer(run([open(1)]), { type: 'HYDRATE', data: other })).toBe(other)
  })

  test('RESET üres mentést ad', () => {
    expect(progressReducer(run([open(1), open(2)]), { type: 'RESET' })).toEqual(emptySave())
  })

  test('a reducer nem módosítja a bemenő állapotot', () => {
    const state = run([open(1)])
    const frozen = JSON.stringify(state)
    progressReducer(state, { type: 'ANSWER_QUESTION', day: 1, question: 0, choice: 1 })
    progressReducer(state, { type: 'REVEAL_HINT', day: 1, puzzle: 0 })
    expect(JSON.stringify(state)).toBe(frozen)
  })
})
