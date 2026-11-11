import { useI18n } from '../../i18n/useI18n'
import { daysUntil, useToday } from '../../lib/dates'
import styles from './StartBanner.module.css'

/** December 1. előtt: mikor nyílik az első ablak, és hány nap van még addig. */
export function StartBanner({ opensAt }: { opensAt: Date }) {
  const { tn } = useI18n()
  const today = useToday()
  const days = daysUntil(opensAt, today)

  return (
    <p className={styles.banner} role="status">
      {tn('banner.opens', days)}
    </p>
  )
}
