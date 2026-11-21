import { useEffect, useRef, useState } from 'react'
import { PURR_SECONDS } from '../../audio/sfx'
import { useSound } from '../../audio/useSound'
import { useI18n } from '../../i18n/useI18n'
import { ROOM_VIEWBOX } from './geometry'
import { roomPalette } from './palette'
import { SleepingCat } from './RoomBackdrop'
import styles from './PettableCat.module.css'

/** Ennyi ideig van nyitva a szeme: a dorombolás hossza és egy kis ráhagyás. */
const AWAKE_MS = PURR_SECONDS * 1000 + 600
/**
 * Két simogatás között legalább ennyi időnek el kell telnie: a cica nem ébreszthető
 * újra, amíg dorombol, és utána is pihen egy kicsit. Így a gombot nem lehet „spammelni”.
 */
const PET_COOLDOWN_MS = 6000

/**
 * Az alvó cica a fa előtt. Rákattintva (vagy fókuszálva Enterrel / szóközzel) kinyitja a szemét
 * és dorombol; a visszajelzés szövegben is megjelenik. Túl gyakori simogatásra nem reagál.
 */
export function PettableCat() {
  const { t } = useI18n()
  const play = useSound()
  const [awake, setAwake] = useState(false)
  const lockedUntil = useRef(0)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const pet = () => {
    const now = Date.now()
    if (now < lockedUntil.current) return
    lockedUntil.current = now + PET_COOLDOWN_MS
    setAwake(true)
    play('purr')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setAwake(false), AWAKE_MS)
  }

  return (
    <>
      <svg
        className={styles.layer}
        viewBox={`0 0 ${ROOM_VIEWBOX.width} ${ROOM_VIEWBOX.height}`}
        aria-hidden="true"
        focusable="false"
      >
        <SleepingCat palette={roomPalette} awake={awake} />
      </svg>
      <button type="button" className={styles.hit} onClick={pet} aria-label={t('cat.pet')} />
      <p className={styles.bubble} aria-live="polite">
        {awake && <span>{t('cat.purring')}</span>}
      </p>
    </>
  )
}
