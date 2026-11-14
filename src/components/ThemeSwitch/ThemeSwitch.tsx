import type { ReactElement } from 'react'
import { useI18n } from '../../i18n/useI18n'
import type { Theme } from '../../state/settings'
import { useSettings } from '../../state/useSettings'
import styles from './ThemeSwitch.module.css'

/** A gomb ebben a sorrendben lépked a módok között. */
const NEXT: Record<Theme, Theme> = { auto: 'light', light: 'dark', dark: 'auto' }

function AutoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="8.4" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <path d="M12 3.6a8.4 8.4 0 0 1 0 16.8Z" fill="currentColor" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="4.3" fill="currentColor" />
      <path
        d="M12 2.6v2.6M12 18.8v2.6M2.6 12h2.6M18.8 12h2.6M5.4 5.4l1.8 1.8M16.8 16.8l1.8 1.8M5.4 18.6l1.8-1.8M16.8 7.2l1.8-1.8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path d="M20.2 14.6A8.6 8.6 0 0 1 9.4 3.8a8.6 8.6 0 1 0 10.8 10.8Z" fill="currentColor" />
    </svg>
  )
}

const ICONS: Record<Theme, () => ReactElement> = { auto: AutoIcon, light: SunIcon, dark: MoonIcon }

/**
 * Témaváltó: egy gomb, amely a rendszer szerinti, a világos és a sötét mód között lépked.
 * Az ikon és a gomb neve az éppen érvényes beállítást mutatja; a választás mentődik.
 */
export function ThemeSwitch() {
  const { t } = useI18n()
  const { settings, updateSettings } = useSettings()
  const { theme } = settings
  const Icon = ICONS[theme]
  const label = t(`theme.${theme}`)

  return (
    <button
      type="button"
      className={styles.toggle}
      // Kitöltve, ha a játékos maga választott módot; körvonalas, ha a rendszer dönt.
      data-chosen={theme === 'auto' ? undefined : ''}
      aria-label={label}
      title={label}
      onClick={() => updateSettings({ theme: NEXT[theme] })}
    >
      <Icon />
    </button>
  )
}
