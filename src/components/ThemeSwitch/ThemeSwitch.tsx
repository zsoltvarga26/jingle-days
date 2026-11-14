import { useSyncExternalStore } from 'react'
import { useI18n } from '../../i18n/useI18n'
import { useSettings } from '../../state/useSettings'
import styles from './ThemeSwitch.module.css'

const DARK_QUERY = '(prefers-color-scheme: dark)'

function subscribeSystemDark(onChange: () => void) {
  const query = window.matchMedia?.(DARK_QUERY)
  query?.addEventListener?.('change', onChange)
  return () => query?.removeEventListener?.('change', onChange)
}

function systemDark(): boolean {
  return window.matchMedia?.(DARK_QUERY).matches ?? false
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

/**
 * Világos / sötét mód kapcsoló. Amíg a játékos nem választ, a rendszer beállítása érvényes;
 * az első kattintás az éppen látszó mód ellentétére vált, és a választás mentődik.
 */
export function ThemeSwitch() {
  const { t } = useI18n()
  const { settings, updateSettings } = useSettings()
  const prefersDark = useSyncExternalStore(subscribeSystemDark, systemDark)
  const dark = settings.theme === 'dark' || (settings.theme === 'auto' && prefersDark)

  return (
    <button
      type="button"
      className={styles.toggle}
      aria-pressed={dark}
      aria-label={t('theme.dark')}
      title={t('theme.dark')}
      onClick={() => updateSettings({ theme: dark ? 'light' : 'dark' })}
    >
      {dark ? <MoonIcon /> : <SunIcon />}
    </button>
  )
}
