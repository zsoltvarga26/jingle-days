import { useEffect, useRef, useState } from 'react'
import { Calendar } from './components/Calendar/Calendar'
import { Countdown } from './components/Countdown/Countdown'
import { DayDialog } from './components/DayDialog/DayDialog'
import { Header } from './components/Header/Header'
import { ProgressSummary } from './components/ProgressSummary/ProgressSummary'
import { Snowfall } from './components/Snowfall/Snowfall'
import { StartBanner } from './components/StartBanner/StartBanner'
import { doorLayout } from './content/layout'
import { I18nProvider } from './i18n/I18nContext'
import { countdownTarget, firstDoorDate, isBeforeStart, isUnlockAll, useToday } from './lib/dates'
import { ProgressProvider } from './state/ProgressContext'
import { SettingsProvider } from './state/SettingsContext'

/** Ennyi idő múlva nyílik a dialógus az ajtó kinyitása után. */
const DOOR_OPEN_MS = 900

/** Az éppen nyitott napi dialógus: melyik nap, és most nyílt-e ki az ajtó. */
interface ActiveDay {
  day: number
  entry: 'fresh' | 'revisit'
}

function Page() {
  const today = useToday()
  const beforeStart = isBeforeStart(today, isUnlockAll())
  const [active, setActive] = useState<ActiveDay | null>(null)

  // Az első nyitásnál a dialógus megvárja, amíg az ajtó kitárul (0,8 s az animáció).
  const openTimer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(openTimer.current), [])

  const startDay = (day: number) => {
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    window.clearTimeout(openTimer.current)
    openTimer.current = window.setTimeout(
      () => setActive({ day, entry: 'fresh' }),
      reducedMotion ? 0 : DOOR_OPEN_MS,
    )
  }

  const closeDialog = () => {
    const day = active?.day
    setActive(null)
    // A fókusz visszakerül a megnyitó ajtóra (Safari kattintásra nem fókuszál gombot,
    // ezért nem bízzuk csak a <dialog> beépített viselkedésére).
    if (day !== undefined) {
      document.querySelector<HTMLElement>(`[data-day="${day}"]`)?.focus()
    }
  }

  return (
    <>
      <Snowfall />
      <main>
        <Header>
          <Countdown target={countdownTarget()} />
        </Header>
        {beforeStart && <StartBanner opensAt={firstDoorDate()} />}
        <Calendar
          layout={doorLayout}
          onOpened={startDay}
          onRevisit={(day) => setActive({ day, entry: 'revisit' })}
        />
        <ProgressSummary />
      </main>
      {active && (
        <DayDialog key={active.day} day={active.day} entry={active.entry} onClose={closeDialog} />
      )}
    </>
  )
}

export default function App() {
  return (
    <SettingsProvider>
      <I18nProvider>
        <ProgressProvider>
          <Page />
        </ProgressProvider>
      </I18nProvider>
    </SettingsProvider>
  )
}
