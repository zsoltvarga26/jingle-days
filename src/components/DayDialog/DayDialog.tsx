import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { getDay } from '../../content/days'
import { useI18n } from '../../i18n/useI18n'
import { burstConfetti } from '../../lib/confetti'
import { useProgress } from '../../state/useProgress'
import { QuizStep } from '../QuizStep/QuizStep'
import styles from './DayDialog.module.css'
import { DaySummary } from './DaySummary'

/** A játék lépései a lépésjelző sorrendjében. */
const STEPS = ['quiz', 'emoji', 'quote'] as const
type Step = (typeof STEPS)[number]
type View = Step | 'summary'

export interface DayDialogProps {
  day: number
  /** 'fresh': az ajtót most nyitották ki, a játék indul. 'revisit': nyitott ajtó, összefoglaló. */
  entry: 'fresh' | 'revisit'
  onClose: () => void
}

/** A napi játék kerete: lépésjelző, bezárás, a megfelelő lépés megjelenítése. */
export function DayDialog({ day, entry, onClose }: DayDialogProps) {
  const { t } = useI18n()
  const { state, dispatch } = useProgress()
  const dialog = useRef<HTMLDialogElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [view, setView] = useState<View>(entry === 'fresh' ? 'quiz' : 'summary')

  const content = getDay(day)
  const progress = state.days[day]

  // Natív modális dialógus: fókuszcsapda és Esc-re bezárás a böngészőtől jön.
  useEffect(() => {
    const element = dialog.current
    if (element && !element.open) element.showModal()
  }, [])

  // A háttérre (a dialógus saját felületén kívülre) kattintva is bezárul.
  const closeOnBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialog.current) dialog.current?.close()
  }

  if (!progress) return null

  // A rejtvény és az idézet lépése a 3. fázisban készül el; addig a kvíz után az összefoglaló jön.
  const afterQuiz = () => setView('summary')

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-labelledby="day-dialog-title"
      onClose={onClose}
      onClick={closeOnBackdrop}
    >
      <canvas ref={canvas} className={styles.confetti} aria-hidden="true" />

      <div className={styles.sheet}>
        <header className={styles.header}>
          <h2 id="day-dialog-title" className={styles.title}>
            {t('dialog.title', { n: day })}
          </h2>
          <button
            type="button"
            className={styles.close}
            aria-label={t('dialog.close')}
            onClick={() => dialog.current?.close()}
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        {view !== 'summary' && (
          <ol className={styles.steps} aria-label={t('steps.label')}>
            {STEPS.map((step) => (
              <li
                key={step}
                className={styles.step}
                data-state={
                  step === view ? 'current' : STEPS.indexOf(step) < STEPS.indexOf(view) ? 'done' : 'todo'
                }
                aria-current={step === view ? 'step' : undefined}
              >
                {t(`step.${step}`)}
              </li>
            ))}
          </ol>
        )}

        {view === 'quiz' && (
          <QuizStep
            questions={content.quiz}
            progress={progress.quiz}
            onAnswer={(question, choice) =>
              dispatch({ type: 'ANSWER_QUESTION', day, question, choice })
            }
            onCorrect={() => burstConfetti(canvas.current)}
            onSkip={() => {
              dispatch({ type: 'SKIP_QUIZ', day })
              afterQuiz()
            }}
            onDone={afterQuiz}
          />
        )}

        {view === 'summary' && (
          <DaySummary
            content={content}
            progress={progress}
            onResumeQuiz={() => {
              dispatch({ type: 'RESUME_STEP', day, step: 'quiz' })
              setView('quiz')
            }}
            onClose={() => dialog.current?.close()}
          />
        )}
      </div>
    </dialog>
  )
}
