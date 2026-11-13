import { useEffect, useId, useImperativeHandle, useRef, type MouseEvent, type ReactNode, type Ref } from 'react'
import { useI18n } from '../../i18n/useI18n'
import styles from './Modal.module.css'

export interface ModalHandle {
  /** Bezárja a dialógust; ezután lefut az onClose. */
  close: () => void
}

export interface ModalProps {
  title: string
  /** Bármilyen bezárás után: gomb, Esc, háttérre kattintás. */
  onClose: () => void
  children: ReactNode
  /** A lap fölé kerülő réteg (pl. a konfetti vászna). */
  overlay?: ReactNode
  ref?: Ref<ModalHandle>
}

/**
 * Felugró ablak natív `<dialog>` elemmel: a fókuszcsapda és az Esc-re bezárás a böngészőtől jön.
 * Fehér, lekerekített lap piros alsó „peremmel”; mobilon alsó lapként nyílik.
 */
export function Modal({ title, onClose, children, overlay, ref }: ModalProps) {
  const { t } = useI18n()
  const dialog = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const element = dialog.current
    if (element && !element.open) element.showModal()
  }, [])

  useImperativeHandle(ref, () => ({ close: () => dialog.current?.close() }), [])

  // A háttérre (a dialógus saját felületén kívülre) kattintva is bezárul.
  const closeOnBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialog.current) dialog.current?.close()
  }

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={closeOnBackdrop}
    >
      {overlay}
      <div className={styles.sheet}>
        <header className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <button
            type="button"
            className={styles.close}
            aria-label={t('dialog.close')}
            onClick={() => dialog.current?.close()}
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>
        {children}
      </div>
    </dialog>
  )
}
