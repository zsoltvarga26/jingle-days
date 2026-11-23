import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { PURR_SECONDS } from '../../audio/sfx'
import { useSound } from '../../audio/useSound'
import { useI18n } from '../../i18n/useI18n'
import { CAT_NAME_MAX, DEFAULT_CAT_NAME, normalizeCatName } from '../../lib/catName'
import { useSettings } from '../../state/useSettings'
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
 *
 * A tálkájára kattintva a cica átnevezhető. A név a beállításokba mentődik, így az előrehaladás
 * törlése nem állítja vissza; üresen hagyva visszakapja az alapnevét.
 */
export function PettableCat() {
  const { t } = useI18n()
  const play = useSound()
  const { settings, updateSettings } = useSettings()
  const name = settings.catName
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

  // Átnevezés: a tálka gombja nyitja a kis szerkesztőt, bezárás után oda tér vissza a fókusz.
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const bowl = useRef<HTMLButtonElement>(null)
  const inputId = useId()
  const hintId = useId()

  const startEditing = () => {
    setDraft(name)
    setEditing(true)
  }

  const stopEditing = () => {
    setEditing(false)
    bowl.current?.focus()
  }

  const save = (event: FormEvent) => {
    event.preventDefault()
    updateSettings({ catName: normalizeCatName(draft) ?? DEFAULT_CAT_NAME })
    stopEditing()
  }

  const onEditorKey = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return
    event.preventDefault()
    event.stopPropagation()
    stopEditing()
  }

  return (
    <>
      <svg
        className={styles.layer}
        viewBox={`0 0 ${ROOM_VIEWBOX.width} ${ROOM_VIEWBOX.height}`}
        aria-hidden="true"
        focusable="false"
      >
        <SleepingCat palette={roomPalette} awake={awake} name={name} />
      </svg>
      <button
        type="button"
        className={styles.hit}
        onClick={pet}
        aria-label={t('cat.pet', { name })}
      />
      <button
        ref={bowl}
        type="button"
        className={styles.bowl}
        onClick={startEditing}
        aria-label={t('cat.rename', { name })}
        title={t('cat.rename', { name })}
        aria-expanded={editing}
      />
      <p className={styles.bubble} aria-live="polite">
        {awake && <span>{t('cat.purring', { name })}</span>}
      </p>
      {editing && (
        <form className={styles.editor} onSubmit={save} onKeyDown={onEditorKey}>
          <label className={styles.label} htmlFor={inputId}>
            {t('cat.nameLabel')}
          </label>
          <input
            id={inputId}
            className={styles.input}
            type="text"
            value={draft}
            maxLength={CAT_NAME_MAX}
            autoComplete="off"
            spellCheck={false}
            aria-describedby={hintId}
            // A szerkesztő a játékos kattintására nyílik, ezért azonnal a mezőbe kerül a fókusz.
            autoFocus
            onFocus={(event) => event.currentTarget.select()}
            onChange={(event) => setDraft(event.target.value)}
          />
          <span id={hintId} className={styles.hint}>
            {t('cat.nameHint', { n: CAT_NAME_MAX, name: DEFAULT_CAT_NAME })}
          </span>
          <span className={styles.actions}>
            <button type="submit" className={styles.save}>
              {t('cat.save')}
            </button>
            <button type="button" className={styles.cancel} onClick={stopEditing}>
              {t('cat.cancel')}
            </button>
          </span>
        </form>
      )}
    </>
  )
}
