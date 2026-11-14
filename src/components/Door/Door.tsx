import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { gridArea, type DoorLayout } from '../../content/layout'
import type { Ornament } from '../../content/types'
import { OrnamentIcon } from '../TreeScene/ornaments/OrnamentArt'
import { monoPalette } from '../TreeScene/palette'
import styles from './Door.module.css'

/** zárolt: jövőbeli nap · zárt: nyitható · nyitott: már megnyitva */
export type DoorStatus = 'locked' | 'closed' | 'open'

export interface DoorProps {
  layout: DoorLayout
  /** A nap dísze: a kinyitott ajtó mögött ez látszik a szám helyett. */
  ornament: Ornament
  /** Hányadik a rácsban; a belépő animáció késleltetését adja. */
  index: number
  status: DoorStatus
  /** A teljes, képernyőolvasónak szóló név az állapottal együtt. */
  ariaLabel: string
  /** Zárolt ajtón kattintáskor megjelenő üzenet. */
  lockedMessage?: string
  /** Nyitott ajtón: maradt-e átugrott rész (kis arany pötty jelzi). */
  hasSkipped?: boolean
  /** Zárt (nyitható) ajtóra kattintáskor. */
  onOpen: (day: number) => void
  /** Már nyitott ajtóra kattintáskor. */
  onRevisit?: (day: number) => void
  /** Zárolt ajtóra kattintáskor (a buborékon túli bejelentéshez). */
  onLockedClick?: (day: number) => void
}

const BUBBLE_MS = 2600

/** A dísz az ajtó mögött egyszínű sziluett, a belső felület szövegszínével. */
const INSIDE_PALETTE = monoPalette('currentColor')

export function Door({
  layout,
  ornament,
  index,
  status,
  ariaLabel,
  lockedMessage,
  hasSkipped = false,
  onOpen,
  onRevisit,
  onLockedClick,
}: DoorProps) {
  const { day, size, color, pattern, ribbon, areaWide, areaNarrow } = layout

  // A betöltéskor már nyitott ajtó animáció nélkül áll nyitva; ha később bezárul
  // (visszaállítás), a következő nyitás már animálva történik.
  const [instant, setInstant] = useState(status === 'open')
  if (instant && status !== 'open') setInstant(false)

  // Minden zárolt kattintás újraindítja a rázkódást és a buborékot.
  const [nudge, setNudge] = useState(0)
  const [bubble, setBubble] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const showBubble = bubble && status === 'locked'

  const handleClick = () => {
    if (status === 'closed') {
      onOpen(day)
    } else if (status === 'open') {
      onRevisit?.(day)
    } else {
      setNudge((n) => n + 1)
      setBubble(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setBubble(false), BUBBLE_MS)
      onLockedClick?.(day)
    }
  }

  const className = [
    styles.day,
    size === 'big' ? styles.big : '',
    styles[status],
    instant ? styles.instant : '',
    showBubble ? styles.raised : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={className}
      style={
        {
          '--i': index,
          // A rácsbeli hely; a médialekérdezés választ a kettő közül (Door.module.css).
          '--area-wide': gridArea(areaWide),
          '--area-narrow': gridArea(areaNarrow),
        } as CSSProperties
      }
      aria-label={ariaLabel}
      // Nem `disabled`: a zárolt ajtó fókuszálható marad, és Enterre is kiírja, mikor nyílik.
      aria-disabled={status === 'locked' ? true : undefined}
      data-day={day}
      data-status={status}
      onClick={handleClick}
    >
      <span className={styles.inside} aria-hidden="true">
        <span className={styles.prize}>
          <OrnamentIcon ornament={ornament} palette={INSIDE_PALETTE} size="1.35em" />
        </span>
        {status === 'open' && hasSkipped && <i className={styles.dot} />}
      </span>
      <span
        // A kulcs váltása újraindítja a rázkódás animációját.
        key={nudge}
        className={`${styles.door} ${nudge > 0 && status === 'locked' ? styles.shake : ''}`}
        aria-hidden="true"
      >
        <span
          className={styles.front}
          data-color={color}
          data-pattern={pattern}
          data-ribbon={ribbon ? '' : undefined}
        >
          <span className={styles.num}>{day}</span>
        </span>
        <span className={styles.back} data-color={color} />
      </span>
      {showBubble && lockedMessage && (
        <span className={styles.bubble} aria-hidden="true">
          {lockedMessage}
        </span>
      )}
    </button>
  )
}
