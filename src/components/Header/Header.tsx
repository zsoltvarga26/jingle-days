import type { ReactNode } from 'react'
import { useI18n } from '../../i18n/useI18n'
import { LanguageSwitch } from '../LanguageSwitch/LanguageSwitch'
import { SoundControls } from '../SoundControls/SoundControls'
import styles from './Header.module.css'

/** Cím, bevezető, jobb felül a hangkapcsolók és a nyelvváltó; a gyerekek (visszaszámláló) a bevezető alá kerülnek. */
export function Header({ children }: { children?: ReactNode }) {
  const { t } = useI18n()
  return (
    <header className={styles.header}>
      <div className={styles.tools}>
        <SoundControls />
        <LanguageSwitch />
      </div>
      <h1 className={styles.title}>{t('header.title')}</h1>
      <p className={styles.lead}>{t('header.lead')}</p>
      {children}
    </header>
  )
}
