import type { Ornament, Quote } from '../../content/types'
import { useI18n } from '../../i18n/useI18n'
import controls from '../../styles/controls.module.css'
import styles from './QuoteStep.module.css'

/** Az idézet szövege a nyelvnek megfelelő idézőjelekkel, alatta a szerző és a forrás. */
export function QuoteBlock({ quote }: { quote: Quote }) {
  const { t, pick } = useI18n()
  const credit = [quote.author, quote.source].filter((part) => part !== undefined).map(pick)

  return (
    <figure className={styles.quote}>
      <blockquote className={styles.text}>{t('quote.wrap', { text: pick(quote.text) })}</blockquote>
      {credit.length > 0 && <figcaption className={styles.credit}>{credit.join(' · ')}</figcaption>}
    </figure>
  )
}

export interface QuoteStepProps {
  quote: Quote
  ornament: Ornament
  /** A „Díszítsük fel a fát!” gombra. */
  onFinish: () => void
}

/** Idézet és a megkapott dísz bemutatása. A dísz rajza a 4. fázisban készül el. */
export function QuoteStep({ quote, ornament, onFinish }: QuoteStepProps) {
  const { t, pick } = useI18n()

  return (
    <div className={styles.step}>
      <QuoteBlock quote={quote} />

      <p className={styles.ornament}>
        <span className={styles.preview} aria-hidden="true" />
        {t('quote.ornament', { name: pick(ornament.name) })}
      </p>

      <div className={styles.actions}>
        <button type="button" className={controls.primary} onClick={onFinish}>
          {t('quote.finish')}
        </button>
      </div>
    </div>
  )
}
