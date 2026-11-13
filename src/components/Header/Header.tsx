import type { ReactNode } from 'react'
import { useI18n } from '../../i18n/useI18n'
import { LanguageSwitch } from '../LanguageSwitch/LanguageSwitch'
import { SoundControls } from '../SoundControls/SoundControls'
import styles from './Header.module.css'

/**
 * Egysoros fejléc: balra a cím és a bevezető mondat, jobbra a gyerekek (visszaszámláló),
 * majd a hangkapcsolók és a nyelvváltó. Keskeny kijelzőn középre igazítva törik több sorba.
 */
export function Header({ children }: { children?: ReactNode }) {
  const { t } = useI18n()
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <h1 className={styles.title}>{t('header.title')}</h1>
        <p className={styles.lead}>{t('header.taglineShort')}</p>
      </div>
      <div className={styles.spacer} />
      {children && <div className={styles.extra}>{children}</div>}
      <div className={styles.tools}>
        <SoundControls />
        <LanguageSwitch />
      </div>
    </header>
  )
}
