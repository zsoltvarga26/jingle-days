import { useEffect, useMemo, useRef, useState } from 'react'
import { useSound } from '../../audio/useSound'
import { days } from '../../content/days'
import { useI18n } from '../../i18n/useI18n'
import { useProgress } from '../../state/useProgress'
import { TREE_ID } from './geometry'
import { treePalette } from './palette'
import { Tree } from './Tree'
import styles from './TreeScene.module.css'

/** Egy dísz leesése és a csillogás ennyi ideig tart; több dísznél ennyivel követik egymást. */
const DROP_MS = 1300
const DROP_STAGGER_MS = 180
/** A dísz ennyi idő után ér a helyére: ekkor szól a csillogó hang. */
const LANDING_MS = 560

const ornaments = days.map((day) => day.ornament)

function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

/** Látszik-e az elem a képernyőn. Ahol nincs IntersectionObserver, ott láthatónak vesszük. */
function useInView(threshold: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const element = ref.current
    if (!element || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold,
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, inView] as const
}

export interface TreeSceneProps {
  /**
   * Annak a napnak a száma, amelynek a dialógusa éppen nyitva van: a dísze megvárja
   * a dialógus bezárását, nem esik le a háttérben.
   */
  hold?: number
  /** Amikor egy (vagy több) dísz elindul a fára: ekkor jelenik meg az arany keret. */
  onDecorate?: () => void
}

/**
 * A díszítendő fa: a megszerzett díszek teli színnel, a többi halvány körvonallal.
 *
 * Egy dísz az ajtó nyitásakor jár, de a fára csak akkor kerül fel, amikor a játékos látja:
 * a dialógus bezárása után, vagy – ha a nap félbeszakadt – a következő betöltéskor.
 */
export function TreeScene({ hold, onDecorate }: TreeSceneProps) {
  const { t } = useI18n()
  const { state, dispatch } = useProgress()
  const play = useSound()
  const [ref, inView] = useInView(0.35)

  const { earned, pending } = useMemo(() => {
    const earnedIds = new Set<string>()
    const pendingDays: number[] = []
    for (const content of days) {
      const progress = state.days[content.day]
      if (!progress) continue
      if (progress.ornamentShown) earnedIds.add(content.ornament.id)
      else if (content.day !== hold) pendingDays.push(content.day)
    }
    return { earned: earnedIds, pending: pendingDays }
  }, [state, hold])

  // Ami felkerülésre vár, az akkor indul el, amikor a fa látszik. Ami egyszer elindult,
  // az a végéig lefut és elmentődik akkor is, ha a fa közben kikerül a képből – különben
  // a „felkerült” jelzés elmaradna, és a dísz a következő alkalommal újra leesne.
  const [started, setStarted] = useState<readonly number[]>([])
  const fresh = inView ? pending.filter((day) => !started.includes(day)) : []
  if (fresh.length > 0) setStarted([...started, ...fresh])

  const timers = useRef(new Map<number, number>())
  useEffect(() => {
    const running = timers.current
    return () => {
      running.forEach((timer) => window.clearTimeout(timer))
      running.clear()
    }
  }, [])

  useEffect(() => {
    const running = timers.current
    const begin = started.filter((day) => !running.has(day))
    if (begin.length === 0) return

    onDecorate?.()
    const reduced = prefersReducedMotion()
    begin.forEach((day, index) => {
      const duration = reduced ? 0 : DROP_MS + DROP_STAGGER_MS * index
      const timer = window.setTimeout(() => {
        running.delete(day)
        dispatch({ type: 'ORNAMENT_SHOWN', day })
        setStarted((current) => current.filter((d) => d !== day))
      }, duration)
      running.set(day, timer)
    })
    // A csillogó hang a leérkezés pillanatában szól, kötegenként egyszer.
    const chime = window.setTimeout(() => play('sparkle'), reduced ? 0 : LANDING_MS)
    running.set(-begin[0], chime)
  }, [started, dispatch, play, onDecorate])

  const droppingKey = started.filter((day) => pending.includes(day)).join(',')
  const dropping = useMemo(
    () =>
      new Set(
        droppingKey === ''
          ? []
          : droppingKey.split(',').map((day) => days[Number(day) - 1].ornament.id),
      ),
    [droppingKey],
  )

  const count = Object.keys(state.days).length
  const complete = earned.size === ornaments.length

  return (
    <section className={styles.scene} id={TREE_ID} aria-labelledby="tree-title">
      <h2 id="tree-title" className={styles.title}>
        {t('tree.title')}
      </h2>
      <div ref={ref} className={styles.frame}>
        <Tree
          className={styles.tree}
          ornaments={ornaments}
          earned={earned}
          dropping={dropping}
          lit={complete}
          palette={treePalette}
          label={t('tree.label', { n: count })}
        />
      </div>
      {complete && <p className={styles.complete}>{t('tree.complete')}</p>}
    </section>
  )
}
