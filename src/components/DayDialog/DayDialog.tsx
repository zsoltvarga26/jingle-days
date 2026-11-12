import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { getDay } from '../../content/days'
import { useI18n } from '../../i18n/useI18n'
import { burstConfetti } from '../../lib/confetti'
import { useProgress } from '../../state/useProgress'
import { EmojiStep } from '../EmojiStep/EmojiStep'
import { QuizStep } from '../QuizStep/QuizStep'
import { QuoteStep } from '../QuoteStep/QuoteStep'
import styles from './DayDialog.module.css'
import { DaySummary } from './DaySummary'

/** A játék lépései a lépésjelző sorrendjében. */
const STEPS = ['quiz', 'emoji', 'quote'] as const
type Step = (typeof STEPS)[number]

type View =
  | { step: 'quiz' }
  /** `start`: melyik rejtvénnyel induljon (visszatéréskor). */
  | { step: 'emoji'; start?: number }
  | { step: 'quote' }
  | { step: 'summary' }

export interface DayDialogProps {
  day: number
  /**
   * 'fresh': az ajtót most nyitották ki, a három lépés sorban következik.
   * 'revisit': nyitott ajtó; összefoglaló nyílik, ahonnan a kihagyott részek folytathatók.
   */
  entry: 'fresh' | 'revisit'
  onClose: () => void
}

/** A napi játék kerete: lépésjelző, bezárás, a megfelelő lépés megjelenítése. */
export function DayDialog({ day, entry, onClose }: DayDialogProps) {
  const { t } = useI18n()
  const { state, dispatch } = useProgress()
  const dialog = useRef<HTMLDialogElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [view, setView] = useState<View>({ step: entry === 'fresh' ? 'quiz' : 'summary' })

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

  const close = () => dialog.current?.close()
  const celebrate = () => burstConfetti(canvas.current)

  // Első nyitáskor a lépések sorban jönnek; visszatéréskor egy rész befejezése
  // után az összefoglaló következik.
  const after = (step: 'quiz' | 'emoji') => {
    if (entry === 'revisit') {
      setView({ step: 'summary' })
    } else if (step === 'quiz') {
      setView({ step: 'emoji' })
    } else {
      dispatch({ type: 'FINISH_DAY', day })
      setView({ step: 'quote' })
    }
  }

  const current: Step | null = view.step === 'summary' ? null : view.step

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
          <button type="button" className={styles.close} aria-label={t('dialog.close')} onClick={close}>
            <span aria-hidden="true">×</span>
          </button>
        </header>

        {current && (
          <ol className={styles.steps} aria-label={t('steps.label')}>
            {STEPS.map((step) => (
              <li
                key={step}
                className={styles.step}
                data-state={
                  step === current
                    ? 'current'
                    : STEPS.indexOf(step) < STEPS.indexOf(current)
                      ? 'done'
                      : 'todo'
                }
                aria-current={step === current ? 'step' : undefined}
              >
                {t(`step.${step}`)}
              </li>
            ))}
          </ol>
        )}

        {view.step === 'quiz' && (
          <QuizStep
            questions={content.quiz}
            progress={progress.quiz}
            onAnswer={(question, choice) =>
              dispatch({ type: 'ANSWER_QUESTION', day, question, choice })
            }
            onCorrect={celebrate}
            onSkip={() => {
              dispatch({ type: 'SKIP_QUIZ', day })
              after('quiz')
            }}
            onDone={() => after('quiz')}
          />
        )}

        {view.step === 'emoji' && (
          <EmojiStep
            puzzles={content.emoji}
            progress={progress.emoji}
            start={view.start}
            onGuess={(puzzle, correct) => dispatch({ type: 'SUBMIT_GUESS', day, puzzle, correct })}
            onRevealHint={(puzzle) => dispatch({ type: 'REVEAL_HINT', day, puzzle })}
            onSkip={(puzzle) => dispatch({ type: 'SKIP_EMOJI', day, puzzle })}
            onSolved={celebrate}
            onDone={() => after('emoji')}
          />
        )}

        {view.step === 'quote' && (
          <QuoteStep quote={content.quote} ornament={content.ornament} onFinish={close} />
        )}

        {view.step === 'summary' && (
          <DaySummary
            content={content}
            progress={progress}
            onResumeQuiz={() => {
              dispatch({ type: 'RESUME_STEP', day, step: 'quiz' })
              setView({ step: 'quiz' })
            }}
            onResumePuzzle={(puzzle) => {
              dispatch({ type: 'RESUME_STEP', day, step: 'emoji', puzzle })
              setView({ step: 'emoji', start: puzzle })
            }}
            onClose={close}
          />
        )}
      </div>
    </dialog>
  )
}
