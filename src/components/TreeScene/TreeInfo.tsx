import { useEffect, useId, useRef, useState } from 'react'
import { useI18n } from '../../i18n/useI18n'
import styles from './TreeInfo.module.css'

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <circle cx="12" cy="6.6" r="1.9" fill="currentColor" />
      <path d="M12 10.6v8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

/**
 * Kis „i” gomb a fa címe mellett. Kattintásra (vagy Enterrel) kinyílik alatta a tudnivaló,
 * hogy a cica a tálkájára kattintva átnevezhető. Újabb kattintásra, Escape-re vagy a
 * buborékon kívüli kattintásra bezárul.
 */
export function TreeInfo() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLSpanElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const panelId = useId()

  useEffect(() => {
    if (!open) return
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      button.current?.focus()
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <span ref={root} className={styles.info}>
      <button
        ref={button}
        type="button"
        className={styles.button}
        aria-label={t('tree.info')}
        title={t('tree.info')}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <InfoIcon />
      </button>
      <span id={panelId} className={styles.panel} role="note" hidden={!open}>
        {t('tree.info.catName')}
      </span>
    </span>
  )
}
