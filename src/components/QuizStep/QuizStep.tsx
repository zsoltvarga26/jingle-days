import { useEffect, useMemo, useRef, useState } from 'react'
import type { QuizQuestion } from '../../content/types'
import { useI18n } from '../../i18n/useI18n'
import { shuffledIndices } from '../../lib/shuffle'
import { firstUnanswered, type QuizProgress } from '../../state/progress'
import styles from './QuizStep.module.css'

export interface QuizStepProps {
  /** 3 vagy 5 kérdés; a komponens a tömb hosszából dolgozik, nem a nap számából. */
  questions: readonly QuizQuestion[]
  progress: QuizProgress
  /** A választott válasz eredeti (nem kevert) indexével. */
  onAnswer: (question: number, choice: number) => void
  /** A hátralévő kérdések átugrása. */
  onSkip: () => void
  /** Az utolsó kérdés után, a „Tovább” gombra. */
  onDone: () => void
  /** Helyes válasz pillanatában (konfetti). */
  onCorrect?: () => void
}

/** Egy kérdés egyszerre: válaszgombok, visszajelzés, tovább / átugrás. */
export function QuizStep({ questions, progress, onAnswer, onSkip, onDone, onCorrect }: QuizStepProps) {
  const { t, pick } = useI18n()

  // Melyik kérdés látszik: megnyitáskor az első megválaszolatlan. Ez csak nézetállapot,
  // az előrehaladás (a válaszok) a ProgressContextből jön.
  const [current, setCurrent] = useState(() => {
    const first = firstUnanswered(progress)
    return first === -1 ? questions.length - 1 : first
  })

  const question = questions[current]
  const chosen = progress.answers[current] ?? null
  const answered = chosen !== null
  const isLast = current === questions.length - 1

  const order = useMemo(
    () => shuffledIndices(question.options.length, question.id),
    [question.id, question.options.length],
  )

  // Kérdésváltáskor a fókusz az új kérdésre kerül (a „Következő” gomb eltűnik alóla).
  const heading = useRef<HTMLHeadingElement>(null)
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    heading.current?.focus()
  }, [current])

  const choose = (choice: number) => {
    if (answered) return
    onAnswer(current, choice)
    if (choice === question.correctIndex) onCorrect?.()
  }

  const correct = answered && chosen === question.correctIndex

  return (
    <div className={styles.quiz}>
      <div className={styles.meta}>
        <span className={styles.counter}>
          {t('quiz.counter', { current: current + 1, total: questions.length })}
        </span>
        <span className={styles.dots} aria-hidden="true">
          {questions.map((q, index) => {
            const answer = progress.answers[index]
            const state =
              answer === null || answer === undefined
                ? index === current
                  ? 'current'
                  : 'todo'
                : answer === q.correctIndex
                  ? 'right'
                  : 'wrong'
            return <i key={q.id} data-state={state} />
          })}
        </span>
      </div>

      <h3 className={styles.question} ref={heading} tabIndex={-1}>
        {pick(question.question)}
      </h3>

      <div className={styles.options} role="group" aria-label={pick(question.question)}>
        {order.map((optionIndex) => {
          const isCorrect = optionIndex === question.correctIndex
          const isChosen = optionIndex === chosen
          const state = !answered ? 'idle' : isCorrect ? 'right' : isChosen ? 'wrong' : 'rest'
          return (
            <button
              key={optionIndex}
              type="button"
              className={styles.option}
              data-state={state}
              // Nem `disabled`: így a fókusz a választott gombon marad a válasz után is.
              aria-disabled={answered ? true : undefined}
              aria-pressed={answered ? isChosen : undefined}
              onClick={() => choose(optionIndex)}
            >
              <span>{pick(question.options[optionIndex])}</span>
              {state === 'right' && (
                <span className={styles.mark} aria-hidden="true">
                  ✓
                </span>
              )}
              {state === 'wrong' && (
                <span className={styles.mark} aria-hidden="true">
                  ✗
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* A visszajelzés szövegben is megjelenik, nem csak színnel, és a képernyőolvasó is bemondja. */}
      <div className={styles.feedback} aria-live="polite">
        {answered && (
          <>
            <p className={correct ? styles.right : styles.wrong}>
              {correct
                ? t('quiz.correct')
                : t('quiz.wrong', { answer: pick(question.options[question.correctIndex]) })}
            </p>
            {question.explanation && (
              <p className={styles.explanation}>{pick(question.explanation)}</p>
            )}
          </>
        )}
      </div>

      <div className={styles.actions}>
        {answered &&
          (isLast ? (
            <button type="button" className={styles.primary} onClick={onDone}>
              {t('quiz.finish')}
            </button>
          ) : (
            <button type="button" className={styles.primary} onClick={() => setCurrent(current + 1)}>
              {t('quiz.next')}
            </button>
          ))}
        {progress.status !== 'done' && (
          <button type="button" className={styles.secondary} onClick={onSkip}>
            {t('quiz.skip')}
          </button>
        )}
      </div>
    </div>
  )
}
