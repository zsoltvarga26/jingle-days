import { describe, expect, test } from 'vitest'
import { days, getDay } from '../content/days'
import { emptySave, progressReducer, type ProgressAction, type SaveData } from './progress'
import { correctAnswers, totalScore } from './score'

const run = (actions: ProgressAction[]): SaveData => actions.reduce(progressReducer, emptySave())

const open = (day: number): ProgressAction => ({
  type: 'OPEN_DAY',
  day,
  quizCount: getDay(day).quiz.length,
  puzzleCount: getDay(day).emoji.length,
  at: '2026-12-01T08:00:00.000Z',
})

describe('pontszám', () => {
  test('üres mentés: 0 pont, a maximum 74 kérdés és 25 rejtvény', () => {
    expect(totalScore(days, emptySave())).toEqual({
      ornaments: 0,
      quizCorrect: 0,
      quizTotal: 74,
      puzzlesSolved: 0,
      puzzlesTotal: 25,
      points: 0,
    })
  })

  test('csak a helyes válasz és a megfejtett rejtvény ér pontot', () => {
    const [q1, q2] = getDay(1).quiz
    const wrong = (q2.correctIndex + 1) % q2.options.length
    const state = run([
      open(1),
      { type: 'ANSWER_QUESTION', day: 1, question: 0, choice: q1.correctIndex },
      { type: 'ANSWER_QUESTION', day: 1, question: 1, choice: wrong },
      { type: 'SUBMIT_GUESS', day: 1, puzzle: 0, correct: false },
      { type: 'SUBMIT_GUESS', day: 1, puzzle: 0, correct: true },
      open(2),
      { type: 'SKIP_EMOJI', day: 2, puzzle: 0 },
    ])
    expect(correctAnswers(getDay(1).quiz, state.days[1].quiz)).toBe(1)
    expect(totalScore(days, state)).toMatchObject({
      ornaments: 2,
      quizCorrect: 1,
      puzzlesSolved: 1,
      points: 2,
    })
  })

  test('minden nap hibátlanul: 74 + 25 pont', () => {
    const actions: ProgressAction[] = days.flatMap((content) => [
      open(content.day),
      ...content.quiz.map(
        (q, question): ProgressAction => ({
          type: 'ANSWER_QUESTION',
          day: content.day,
          question,
          choice: q.correctIndex,
        }),
      ),
      ...content.emoji.map(
        (_, puzzle): ProgressAction => ({ type: 'SUBMIT_GUESS', day: content.day, puzzle, correct: true }),
      ),
    ])
    expect(totalScore(days, run(actions))).toMatchObject({
      ornaments: 24,
      quizCorrect: 74,
      puzzlesSolved: 25,
      points: 99,
    })
  })
})
