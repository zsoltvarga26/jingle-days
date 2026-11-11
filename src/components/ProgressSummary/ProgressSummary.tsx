import { useState } from 'react'
import { useI18n } from '../../i18n/useI18n'
import { openedDays } from '../../state/progress'
import { useProgress } from '../../state/useProgress'
import styles from './ProgressSummary.module.css'

/**
 * „X / 24 ablak nyitva” és a visszaállítás megerősítéssel.
 * A pontszám és a megosztás gomb a későbbi fázisokban kerül ide.
 */
export function ProgressSummary() {
  const { t } = useI18n()
  const { state, dispatch } = useProgress()
  const [confirming, setConfirming] = useState(false)
  const opened = openedDays(state).length

  return (
    <div className={styles.summary}>
      <p className={styles.progress} aria-live="polite">
        <span className={styles.pill}>{t('progress.opened', { n: opened })}</span>
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
