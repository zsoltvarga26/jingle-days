import type { DayContent } from '../../content/types'
import { useI18n } from '../../i18n/useI18n'
import type { DayProgress } from '../../state/progress'
import { correctAnswers } from '../../state/score'
import controls from '../../styles/controls.module.css'
import { QuoteBlock } from '../QuoteStep/QuoteStep'
import styles from './DayDialog.module.css'

export interface DaySummaryProps {
  content: DayContent
  progress: DayProgress
  onResumeQuiz: () => void
  onResumePuzzle: (puzzle: number) => void
  onClose: () => void
}

/** Nyitott ajtóra kattintva ez látszik: mi lett kész, mi folytatható, és a nap idézete. */
export function DaySummary({
  content,
  progress,
  onResumeQuiz,
  onResumePuzzle,
  onClose,
}: DaySummaryProps) {
  const { t, lang } = useI18n()
  const correct = correctAnswers(content.quiz, progress.quiz)

  return (
    <div className={styles.summary}>
      <h3 className={styles.summaryTitle}>{t('summary.title')}</h3>
      <ul className={styles.summaryList}>
        <li>
          <span className={styles.summaryLabel}>{t('step.quiz')}</span>
          <span className={styles.summaryValue}>
            {t('summary.quiz.score', { correct, total: content.quiz.length })}
          </span>
          {progress.quiz.status !== 'done' && (
            <button
              type="button"
              className={`${controls.outline} ${styles.resume}`}
              onClick={onResumeQuiz}
            >
              {t('summary.quiz.resume')}
            </button>
          )}
        </li>

        {content.emoji.map((puzzle, index) => {
          const state = progress.emoji[index]
          const label =
            content.emoji.length > 1 ? t('summary.puzzle.n', { n: index + 1 }) : t('step.emoji')
          return (
            <li key={puzzle.id}>
              <span className={styles.summaryLabel}>{label}</span>
              <span className={styles.summaryValue}>
                {state.status === 'done'
                  ? t('summary.puzzle.solved', { answer: puzzle.answers[lang][0] })
                  : t(state.status === 'skipped' ? 'summary.puzzle.skipped' : 'summary.puzzle.pending')}
              </span>
              {state.status !== 'done' && (
                <button
                  type="button"
                  className={`${controls.outline} ${styles.resume}`}
                  // Két rejtvénynél a gomb neve azt is megmondja, melyikre vonatkozik.
                  aria-label={
                    content.emoji.length > 1 ? `${t('summary.puzzle.resume')}: ${label}` : undefined
                  }
                  onClick={() => onResumePuzzle(index)}
                >
                  {t('summary.puzzle.resume')}
                </button>
              )}
            </li>
          )
        })}
      </ul>

      <QuoteBlock quote={content.quote} />

      <div className={styles.summaryActions}>
        <button type="button" className={controls.primary} onClick={onClose}>
          {t('summary.close')}
        </button>
      </div>
    </div>
  )
}
