import { useEffect, useRef, useState } from 'react'
import { SoundManager } from './audio/SoundManager'
import { Calendar } from './components/Calendar/Calendar'
import { Countdown } from './components/Countdown/Countdown'
import { DayDialog } from './components/DayDialog/DayDialog'
import { Header } from './components/Header/Header'
import { ProgressSummary } from './components/ProgressSummary/ProgressSummary'
import { ShareCard } from './components/ShareCard/ShareCard'
import { Snowfall } from './components/Snowfall/Snowfall'
import { StartBanner } from './components/StartBanner/StartBanner'
import { TREE_ID } from './components/TreeScene/geometry'
import { TreeScene } from './components/TreeScene/TreeScene'
import { doorLayout } from './content/layout'
import { I18nProvider } from './i18n/I18nContext'
import { countdownTarget, firstDoorDate, isBeforeStart, isUnlockAll, useToday } from './lib/dates'
import { ProgressProvider } from './state/ProgressContext'
import { useProgress } from './state/useProgress'
import { SettingsProvider } from './state/SettingsContext'

/** Ennyi idő múlva nyílik a dialógus az ajtó kinyitása után. */
const DOOR_OPEN_MS = 900

function reducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

/** Az éppen nyitott napi dialógus: melyik nap, és most nyílt-e ki az ajtó. */
interface ActiveDay {
  day: number
  entry: 'fresh' | 'revisit'
}

function Page() {
  const today = useToday()
  const beforeStart = isBeforeStart(today, isUnlockAll())
  const { state } = useProgress()
  const [active, setActive] = useState<ActiveDay | null>(null)
  // A most kinyitott ajtó napja, amíg a dialógusa meg nem nyílik: a dísze addig is vár.
  const [starting, setStarting] = useState<number | null>(null)
  const [sharing, setSharing] = useState(false)

  // Az első nyitásnál a dialógus megvárja, amíg az ajtó kitárul (0,8 s az animáció).
  const openTimer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(openTimer.current), [])

  const startDay = (day: number) => {
    setStarting(day)
    window.clearTimeout(openTimer.current)
    openTimer.current = window.setTimeout(
      () => setActive({ day, entry: 'fresh' }),
      reducedMotion() ? 0 : DOOR_OPEN_MS,
    )
  }

  const closeDialog = () => {
    const day = active?.day
    setActive(null)
    setStarting(null)
    if (day === undefined) return

    // Ha a nap dísze még nincs a fán, az oldal a fához görget, ahol a dísz a helyére esik.
    const toTree = state.days[day]?.ornamentShown === false

    // A fókusz visszakerül a megnyitó ajtóra (Safari kattintásra nem fókuszál gombot,
    // ezért nem bízzuk csak a <dialog> beépített viselkedésére).
    document
      .querySelector<HTMLElement>(`[data-day="${day}"]`)
      ?.focus({ preventScroll: toTree })

    if (toTree) {
      document
        .getElementById(TREE_ID)
        ?.scrollIntoView?.({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'center' })
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
        <TreeScene hold={active?.day ?? starting ?? undefined} onShare={() => setSharing(true)} />
        <ProgressSummary onShare={() => setSharing(true)} />
      </main>
      {active && (
        <DayDialog key={active.day} day={active.day} entry={active.entry} onClose={closeDialog} />
      )}
      {sharing && <ShareCard onClose={() => setSharing(false)} />}
    </>
  )
}

export default function App() {
  return (
    <SettingsProvider>
      <SoundManager />
      <I18nProvider>
        <ProgressProvider>
          <Page />
        </ProgressProvider>
      </I18nProvider>
    </SettingsProvider>
  )
}
