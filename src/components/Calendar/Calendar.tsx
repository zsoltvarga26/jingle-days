import { useState } from 'react'
import { stepCounts } from '../../content/days'
import type { DoorLayout } from '../../content/layout'
import { useI18n } from '../../i18n/useI18n'
import { daysUntil, isDayUnlocked, isUnlockAll, unlockDate, useToday } from '../../lib/dates'
import { hasSkippedStep } from '../../state/progress'
import { useProgress } from '../../state/useProgress'
import { Door, type DoorStatus } from '../Door/Door'
import styles from './Calendar.module.css'

export interface CalendarProps {
  layout: readonly DoorLayout[]
  /** Egy ajtó első kinyitása után (a napi játék indul). */
  onOpened?: (day: number) => void
  /** Már nyitott ajtóra kattintáskor (összefoglaló). */
  onRevisit?: (day: number) => void
}

/** A 24 ajtó rácsa a megadott sorrendben és méretekkel. */
export function Calendar({ layout, onOpened, onRevisit }: CalendarProps) {
  const { t, tn } = useI18n()
  const { state, dispatch } = useProgress()
  const today = useToday()
  const unlockAll = isUnlockAll()

  // A zárolt ajtó üzenete képernyőolvasónak is: a buborék mellett itt is megjelenik.
  const [announcement, setAnnouncement] = useState('')

  const lockedMessage = (day: number) => {
    const days = daysUntil(unlockDate(day), today)
    return days <= 1 ? t('door.opensTomorrow') : tn('door.opensIn', days)
  }

  const statusOf = (day: number): DoorStatus => {
    if (state.days[day]) return 'open'
    return isDayUnlocked(day, today, unlockAll) ? 'closed' : 'locked'
  }

  const open = (day: number) => {
    const counts = stepCounts(day)
    dispatch({
      type: 'OPEN_DAY',
      day,
      quizCount: counts.quiz,
      puzzleCount: counts.emoji,
      at: new Date().toISOString(),
    })
    onOpened?.(day)
  }

  return (
    <section className={styles.calendar} aria-label={t('calendar.label')}>
      {layout.map((door, index) => {
        const status = statusOf(door.day)
        const message = status === 'locked' ? lockedMessage(door.day) : undefined
        const progress = state.days[door.day]
        const skipped = progress ? hasSkippedStep(progress) : false
        const ariaLabel =
          status === 'locked'
            ? t('door.aria.locked', { n: door.day, when: message ?? '' })
            : status === 'closed'
              ? t('door.aria.closed', { n: door.day })
              : t(skipped ? 'door.aria.openSkipped' : 'door.aria.open', { n: door.day })

        return (
          <Door
            key={door.day}
            layout={door}
            index={index}
            status={status}
            ariaLabel={ariaLabel}
            lockedMessage={message}
            hasSkipped={skipped}
            onOpen={open}
            onRevisit={onRevisit}
            onLockedClick={() => setAnnouncement(`${t('door.label', { n: door.day })}: ${message}`)}
          />
        )
      })}
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </section>
  )
}
