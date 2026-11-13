import { useRef, useState } from 'react'
import { useSound } from '../../audio/useSound'
import { getDay } from '../../content/days'
import { useI18n } from '../../i18n/useI18n'
import { burstConfetti } from '../../lib/confetti'
import { useProgress } from '../../state/useProgress'
import { EmojiStep } from '../EmojiStep/EmojiStep'
import { Modal, type ModalHandle } from '../Modal/Modal'
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
  const play = useSound()
  const modal = useRef<ModalHandle>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [view, setView] = useState<View>({ step: entry === 'fresh' ? 'quiz' : 'summary' })

  const content = getDay(day)
  const progress = state.days[day]
  if (!progress) return null

  const close = () => modal.current?.close()
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
    <Modal
      ref={modal}
      title={t('dialog.title', { n: day })}
      onClose={onClose}
      // A konfetti a dialóguson belül van: a modális dialógus a böngésző legfelső rétege.
      overlay={<canvas ref={canvas} className={styles.confetti} aria-hidden="true" />}
    >
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
          onAnswer={(question, choice) => {
            dispatch({ type: 'ANSWER_QUESTION', day, question, choice })
            play(choice === content.quiz[question].correctIndex ? 'success' : 'wrong')
          }}
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
          onGuess={(puzzle, correct) => {
            dispatch({ type: 'SUBMIT_GUESS', day, puzzle, correct })
            play(correct ? 'solved' : 'wrong')
          }}
          onRevealHint={(puzzle) => {
            dispatch({ type: 'REVEAL_HINT', day, puzzle })
            play('hint')
          }}
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
    </Modal>
  )
}
