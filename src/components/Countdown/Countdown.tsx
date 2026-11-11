import { useI18n } from '../../i18n/useI18n'
import { countdownParts, useNow } from '../../lib/dates'
import styles from './Countdown.module.css'

const pad = (n: number) => String(n).padStart(2, '0')

/** Visszaszámlálás a célpontig, utána üdvözlet. */
export function Countdown({ target }: { target: Date }) {
  const { t, tn } = useI18n()
  const now = useNow()
  const parts = countdownParts(now, target)

  if (!parts) {
    return (
      <div className={styles.countdown}>
        <div className={styles.merry}>{t('countdown.merry')}</div>
      </div>
    )
  }

  const units = [
    { id: 'days', value: String(parts.days), label: tn('countdown.days', parts.days) },
    { id: 'hours', value: pad(parts.hours), label: tn('countdown.hours', parts.hours) },
    { id: 'minutes', value: pad(parts.minutes), label: tn('countdown.minutes', parts.minutes) },
    { id: 'seconds', value: pad(parts.seconds), label: tn('countdown.seconds', parts.seconds) },
  ]

  return (
    // Másodpercenként változik, ezért a képernyőolvasó nem mondja be magától.
    <div className={styles.countdown} aria-live="off">
      <div className={styles.title}>{t('countdown.until')}</div>
      <div className={styles.clock}>
        {units.map((unit) => (
          <div className={styles.unit} key={unit.id}>
            {/* A kulcs a szám: változáskor újra lefut a kis ugrás. */}
            <b key={unit.value}>{unit.value}</b>
            <small>{unit.label}</small>
          </div>
        ))}
      </div>
    </div>
  )
}
