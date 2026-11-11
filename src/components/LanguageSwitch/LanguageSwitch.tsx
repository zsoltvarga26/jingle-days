import { LANGS } from '../../content/types'
import { useI18n } from '../../i18n/useI18n'
import styles from './LanguageSwitch.module.css'

/** HU / EN váltógomb-pár, az aktív nyelv kiemelve. */
export function LanguageSwitch() {
  const { lang, setLang, t } = useI18n()
  return (
    <div className={styles.group} role="group" aria-label={t('lang.switch')}>
      {LANGS.map((code) => (
        <button
          key={code}
          type="button"
          className={styles.pill}
          aria-pressed={lang === code}
          aria-label={t(`lang.${code}`)}
          lang={code}
          onClick={() => setLang(code)}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
