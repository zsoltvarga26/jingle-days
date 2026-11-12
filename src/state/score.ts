import type { DayContent, QuizQuestion } from '../content/types'
import type { QuizProgress, SaveData } from './progress'

/** Helyes kvízválaszok száma egy napon. A pontszám számolt érték, nincs a mentésben. */
export function correctAnswers(questions: readonly QuizQuestion[], quiz: QuizProgress): number {
  return questions.reduce(
    (sum, question, index) => sum + (quiz.answers[index] === question.correctIndex ? 1 : 0),
    0,
  )
}

export interface Score {
  /** Megnyitott napok = megszerzett díszek. */
  ornaments: number
  quizCorrect: number
  quizTotal: number
  puzzlesSolved: number
  puzzlesTotal: number
  /** Helyes kvízválaszok + megfejtett rejtvények. */
  points: number
}

export function totalScore(content: readonly DayContent[], state: SaveData): Score {
  let quizCorrect = 0
  let puzzlesSolved = 0
  let quizTotal = 0
  let puzzlesTotal = 0

  for (const day of content) {
    quizTotal += day.quiz.length
    puzzlesTotal += day.emoji.length
    const progress = state.days[day.day]
    if (!progress) continue
    quizCorrect += correctAnswers(day.quiz, progress.quiz)
    puzzlesSolved += progress.emoji.filter((p) => p.status === 'done').length
  }

  return {
    ornaments: Object.keys(state.days).length,
    quizCorrect,
    quizTotal,
    puzzlesSolved,
    puzzlesTotal,
    points: quizCorrect + puzzlesSolved,
  }
}
