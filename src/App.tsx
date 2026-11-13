import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { SoundManager } from './audio/SoundManager'
import { Calendar } from './components/Calendar/Calendar'
import { Countdown } from './components/Countdown/Countdown'
import { DayDialog } from './components/DayDialog/DayDialog'
import { Header } from './components/Header/Header'
import { ProgressSummary } from './components/ProgressSummary/ProgressSummary'
import { ShareCard } from './components/ShareCard/ShareCard'
import { Snowfall } from './components/Snowfall/Snowfall'
import { StartBanner } from './components/StartBanner/StartBanner'
import { TreePanel } from './components/TreePanel/TreePanel'
import { TREE_ID } from './components/TreeScene/geometry'
import { TreeScene } from './components/TreeScene/TreeScene'
import { doorLayout } from './content/layout'
import { I18nProvider } from './i18n/I18nContext'
import { countdownTarget, firstDoorDate, isBeforeStart, isUnlockAll, useToday } from './lib/dates'
import { useElementHeight } from './lib/useElementHeight'
import { ProgressProvider } from './state/ProgressContext'
import { useProgress } from './state/useProgress'
import { SettingsProvider } from './state/SettingsContext'
import styles from './App.module.css'

/** Ennyi idő múlva nyílik a dialógus az ajtó kinyitása után. */
const DOOR_OPEN_MS = 900
/** Díszítéskor ennyi ideig látszik az arany keret a fa kártyája körül. */
const DECORATE_MS = 1400
/** Efölött a kalendárium és a fa egymás mellett áll (lásd App.module.css). */
const WIDE_QUERY = '(min-width: 1100px)'

function reducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

function isWideLayout(): boolean {
  return window.matchMedia?.(WIDE_QUERY).matches ?? false
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
  // Széles nézetben a fa kártyája pontosan olyan magas, mint a kalendáriumtábla.
  const [boardRef, boardHeight] = useElementHeight<HTMLElement>()

  // Az első nyitásnál a dialógus megvárja, amíg az ajtó kitárul (0,8 s az animáció).
  const openTimer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(openTimer.current), [])

  // Amíg egy dísz a helyére esik, arany keret jelzi a fa kártyáján, hol történik a jutalom.
  const [decorating, setDecorating] = useState(false)
  const decorateTimer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(decorateTimer.current), [])
  const decorate = useCallback(() => {
    setDecorating(true)
    window.clearTimeout(decorateTimer.current)
    decorateTimer.current = window.setTimeout(() => setDecorating(false), DECORATE_MS)
  }, [])

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

    // Ha a nap dísze még nincs a fán, keskeny nézetben az oldal a fához görget, ahol a dísz
    // a helyére esik. Széles nézetben a fa a kalendárium mellett eleve látszik.
    const toTree = state.days[day]?.ornamentShown === false && !isWideLayout()

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
        <div
          className={`${styles.layout} ${beforeStart ? styles.withBanner : ''}`}
          style={
            boardHeight > 0 ? ({ '--board-h': `${boardHeight}px` } as CSSProperties) : undefined
          }
        >
          <Calendar
            layout={doorLayout}
            banner={beforeStart && <StartBanner opensAt={firstDoorDate()} />}
            boardRef={boardRef}
            onOpened={startDay}
            onRevisit={(day) => setActive({ day, entry: 'revisit' })}
          />
          <TreePanel decorating={decorating}>
            <TreeScene
              hold={active?.day ?? starting ?? undefined}
              onShare={() => setSharing(true)}
              onDecorate={decorate}
            />
          </TreePanel>
        </div>
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
