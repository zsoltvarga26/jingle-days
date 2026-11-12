import { useState } from 'react'
import { days } from '../../content/days'
import { useI18n } from '../../i18n/useI18n'
import { totalScore } from '../../state/score'
import { useProgress } from '../../state/useProgress'
import styles from './ProgressSummary.module.css'

/**
 * „X / 24 ablak nyitva”, pontszám és a visszaállítás megerősítéssel.
 * A megosztás gomb a 6. fázisban kerül ide.
 */
export function ProgressSummary() {
  const { t, tn } = useI18n()
  const { state, dispatch } = useProgress()
  const [confirming, setConfirming] = useState(false)
  // A pontszám számolt érték: helyes kvízválaszok + megfejtett rejtvények.
  const score = totalScore(days, state)
  const opened = score.ornaments

  return (
    <div className={styles.summary}>
      <p className={styles.progress} aria-live="polite">
        <span className={styles.pill}>{t('progress.opened', { n: opened })}</span>
        <span className={styles.pill}>{tn('progress.points', score.points)}</span>
      </p>

      {confirming ? (
        <div className={styles.confirm} role="group" aria-label={t('progress.reset.confirm')}>
          <span className={styles.question}>{t('progress.reset.confirm')}</span>
          <button
            type="button"
            className={`${styles.button} ${styles.danger}`}
            onClick={() => {
              dispatch({ type: 'RESET' })
              setConfirming(false)
            }}
          >
            {t('progress.reset.yes')}
          </button>
          <button
            type="button"
            className={styles.button}
            // A megerősítés megjelenésekor a biztonságos válasz kapja a fókuszt.
            autoFocus
            onClick={() => setConfirming(false)}
          >
            {t('progress.reset.no')}
          </button>
        </div>
      ) : (
        <button
          type="button"
          className={styles.button}
          disabled={opened === 0}
          onClick={() => setConfirming(true)}
        >
          {t('progress.reset')}
        </button>
      )}
    </div>
  )
}
