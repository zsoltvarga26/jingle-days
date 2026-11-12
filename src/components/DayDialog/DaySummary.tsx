import type { DayContent } from '../../content/types'
import { useI18n } from '../../i18n/useI18n'
import type { DayProgress } from '../../state/progress'
import { correctAnswers } from '../../state/score'
import styles from './DayDialog.module.css'

export interface DaySummaryProps {
  content: DayContent
  progress: DayProgress
  onResumeQuiz: () => void
  onClose: () => void
}

/**
 * Nyitott ajtóra kattintva ez látszik: mi lett kész, és mi folytatható.
 * A rejtvény és az idézet sora a 3. fázisban kerül ide.
 */
export function DaySummary({ content, progress, onResumeQuiz, onClose }: DaySummaryProps) {
  const { t } = useI18n()
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
            <button type="button" className={styles.resume} onClick={onResumeQuiz}>
              {t('summary.quiz.resume')}
            </button>
          )}
        </li>
      </ul>
      <div className={styles.summaryActions}>
        <button type="button" className={styles.primary} onClick={onClose}>
          {t('summary.close')}
        </button>
      </div>
    </div>
  )
}
