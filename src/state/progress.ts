export type StepStatus = 'pending' | 'done' | 'skipped'

export interface QuizProgress {
  /** Kérdésenként a választott (eredeti, nem kevert) index. */
  answers: (number | null)[]
  /** 'done' = minden kérdés megválaszolva. */
  status: StepStatus
}

export interface PuzzleProgress {
  hintsRevealed: 0 | 1 | 2
  attempts: number
  /** 'done' = megfejtve. */
  status: StepStatus
}

export interface DayProgress {
  /** ISO időpont az első nyitáskor. */
  openedAt: string
  quiz: QuizProgress
  emoji: PuzzleProgress[]
  quoteSeen: boolean
  /** Lefutott-e már a dísz fa-animációja. */
  ornamentShown: boolean
}

export interface SaveData {
  version: 1
  /** Csak a megnyitott napok szerepelnek; megszerzett dísz = a nap szerepel itt. */
  days: Record<number, DayProgress>
}

export type ProgressAction =
  | { type: 'OPEN_DAY'; day: number; quizCount: number; puzzleCount: number; at: string }
  | { type: 'ANSWER_QUESTION'; day: number; question: number; choice: number }
  | { type: 'SKIP_QUIZ'; day: number }
  | { type: 'REVEAL_HINT'; day: number; puzzle: number }
  | { type: 'SUBMIT_GUESS'; day: number; puzzle: number; correct: boolean }
  | { type: 'SKIP_EMOJI'; day: number; puzzle: number }
  | { type: 'RESUME_STEP'; day: number; step: 'quiz' }
  | { type: 'RESUME_STEP'; day: number; step: 'emoji'; puzzle: number }
  | { type: 'FINISH_DAY'; day: number }
  | { type: 'ORNAMENT_SHOWN'; day: number }
  | { type: 'HYDRATE'; data: SaveData }
  | { type: 'RESET' }

export function emptySave(): SaveData {
  return { version: 1, days: {} }
}

export function openedDays(state: SaveData): number[] {
  return Object.keys(state.days)
    .map(Number)
    .sort((a, b) => a - b)
}

function updateDay(
  state: SaveData,
  day: number,
  update: (current: DayProgress) => DayProgress,
): SaveData {
  const current = state.days[day]
  if (!current) return state
  const next = update(current)
  if (next === current) return state
  return { ...state, days: { ...state.days, [day]: next } }
}

function updatePuzzle(
  current: DayProgress,
  index: number,
  update: (puzzle: PuzzleProgress) => PuzzleProgress,
): DayProgress {
  const puzzle = current.emoji[index]
  if (!puzzle) return current
  const next = update(puzzle)
  if (next === puzzle) return current
  return { ...current, emoji: current.emoji.map((p, i) => (i === index ? next : p)) }
}

export function progressReducer(state: SaveData, action: ProgressAction): SaveData {
  switch (action.type) {
    case 'OPEN_DAY': {
      if (state.days[action.day]) return state
      const day: DayProgress = {
        openedAt: action.at,
        quiz: { answers: Array<number | null>(action.quizCount).fill(null), status: 'pending' },
        emoji: Array.from({ length: action.puzzleCount }, () => ({
          hintsRevealed: 0 as const,
          attempts: 0,
          status: 'pending' as const,
        })),
        quoteSeen: false,
        ornamentShown: false,
      }
      return { ...state, days: { ...state.days, [action.day]: day } }
    }

    case 'ANSWER_QUESTION':
      return updateDay(state, action.day, (current) => {
        const { answers } = current.quiz
        // Megválaszolt kérdés nem válaszolható újra.
        if (action.question < 0 || action.question >= answers.length) return current
        if (answers[action.question] !== null) return current
        const next = answers.map((a, i) => (i === action.question ? action.choice : a))
        const allAnswered = next.every((a) => a !== null)
        return {
          ...current,
          quiz: { answers: next, status: allAnswered ? 'done' : 'pending' },
        }
      })

    case 'SKIP_QUIZ':
      return updateDay(state, action.day, (current) =>
        current.quiz.status === 'pending'
          ? { ...current, quiz: { ...current.quiz, status: 'skipped' } }
          : current,
      )

    case 'REVEAL_HINT':
      return updateDay(state, action.day, (current) =>
        updatePuzzle(current, action.puzzle, (puzzle) =>
          puzzle.hintsRevealed >= 2
            ? puzzle
            : { ...puzzle, hintsRevealed: (puzzle.hintsRevealed + 1) as 1 | 2 },
        ),
      )

    case 'SUBMIT_GUESS':
      return updateDay(state, action.day, (current) =>
        updatePuzzle(current, action.puzzle, (puzzle) =>
          // Megfejtett rejtvény nem kérdezhető újra.
          puzzle.status === 'done'
            ? puzzle
            : {
                ...puzzle,
                attempts: puzzle.attempts + 1,
                status: action.correct ? 'done' : puzzle.status,
              },
        ),
      )

    case 'SKIP_EMOJI':
      return updateDay(state, action.day, (current) =>
        updatePuzzle(current, action.puzzle, (puzzle) =>
          puzzle.status === 'pending' ? { ...puzzle, status: 'skipped' } : puzzle,
        ),
      )

    case 'RESUME_STEP':
      return updateDay(state, action.day, (current) => {
        if (action.step === 'quiz') {
          return current.quiz.status === 'skipped'
            ? { ...current, quiz: { ...current.quiz, status: 'pending' } }
            : current
        }
        return updatePuzzle(current, action.puzzle, (puzzle) =>
          puzzle.status === 'skipped' ? { ...puzzle, status: 'pending' } : puzzle,
        )
      })

    case 'FINISH_DAY':
      return updateDay(state, action.day, (current) =>
        current.quoteSeen ? current : { ...current, quoteSeen: true },
      )

    case 'ORNAMENT_SHOWN':
      return updateDay(state, action.day, (current) =>
        current.ornamentShown ? current : { ...current, ornamentShown: true },
      )

    case 'HYDRATE':
      return action.data

    case 'RESET':
      return emptySave()
  }
}

/** A kvíz az első megválaszolatlan kérdésnél folytatódik; -1, ha mind megvan. */
export function firstUnanswered(quiz: QuizProgress): number {
  return quiz.answers.findIndex((a) => a === null)
}

/** Maradt-e átugrott rész a napban (arany pötty a nyitott ajtón). */
export function hasSkippedStep(day: DayProgress): boolean {
  return day.quiz.status === 'skipped' || day.emoji.some((p) => p.status === 'skipped')
}
