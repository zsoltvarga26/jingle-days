import { useEffect, useMemo, useState } from 'react'
import { days } from '../../content/days'
import { useI18n } from '../../i18n/useI18n'
import {
  canShareFile,
  copyText,
  displayUrl,
  downloadFile,
  pageUrl,
  renderShareCard,
  shareFile,
  type CardText,
} from '../../lib/shareCard'
import { totalScore } from '../../state/score'
import { useProgress } from '../../state/useProgress'
import controls from '../../styles/controls.module.css'
import { Modal } from '../Modal/Modal'
import styles from './ShareCard.module.css'

const ornaments = days.map((day) => day.ornament)

type Card =
  | { status: 'loading' }
  | { status: 'ready'; file: File; url: string }
  | { status: 'error' }

/** A megosztható eredménykártya előnézete és megosztása. */
export function ShareCard({ onClose }: { onClose: () => void }) {
  const { t, tn, lang } = useI18n()
  const { state } = useProgress()
  const score = totalScore(days, state)

  const url = pageUrl()
  const text: CardText = useMemo(
    () => ({
      title: t('header.title'),
      ornaments: `${score.ornaments} / ${ornaments.length}`,
      ornamentsLabel: t('share.card.ornaments'),
      points: String(score.points),
      pointsLabel: tn('share.card.points', score.points),
      quiz: t('share.card.quiz', { correct: score.quizCorrect, total: score.quizTotal }),
      puzzles: t('share.card.puzzles', { solved: score.puzzlesSolved, total: score.puzzlesTotal }),
      url: displayUrl(url),
    }),
    // A szövegek a nyelvtől és az eredménytől függenek.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
    [lang, url, score.ornaments, score.points, score.quizCorrect, score.puzzlesSolved],
  )
  const message = t('share.text', { ornaments: score.ornaments, points: score.points, url })

  // A megnyitott napok díszei mind a kártyára kerülnek, akkor is, ha a fán még nem estek a helyükre.
  const earnedKey = days
    .filter((day) => state.days[day.day])
    .map((day) => day.ornament.id)
    .join(',')

  // A kép az ablak megnyitásakor készül el, nem a gomb megnyomásakor: a rendszer megosztási
  // menüje csak közvetlenül kattintásból hívható, ezért a gombnak már kész fájl kell.
  const [card, setCard] = useState<Card>({ status: 'loading' })
  useEffect(() => {
    let cancelled = false
    let objectUrl: string | undefined
    const earned = new Set(earnedKey === '' ? [] : earnedKey.split(','))

    renderShareCard({ text, ornaments, earned })
      .then((file) => {
        if (cancelled) return
        objectUrl = URL.createObjectURL(file)
        setCard({ status: 'ready', file, url: objectUrl })
      })
      .catch(() => {
        if (!cancelled) setCard({ status: 'error' })
      })

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [text, earnedKey])

  const [notice, setNotice] = useState('')
  const copy = async () => {
    setNotice(t((await copyText(message)) ? 'share.copied' : 'share.copyFailed'))
  }

  const file = card.status === 'ready' ? card.file : null

  return (
    <Modal title={t('share.title')} onClose={onClose}>
      <div className={styles.share}>
        <div className={styles.preview} aria-busy={card.status === 'loading'}>
          {card.status === 'ready' ? (
            <img
              className={styles.image}
              src={card.url}
              alt={t('share.alt', { ornaments: score.ornaments, points: score.points })}
            />
          ) : (
            <p className={styles.placeholder} role="status">
              {t(card.status === 'loading' ? 'share.loading' : 'share.error')}
            </p>
          )}
        </div>

        <div className={styles.actions}>
          {file && canShareFile(file) && (
            <button
              type="button"
              className={controls.primary}
              onClick={() => void shareFile(file, message, t('header.title'))}
            >
              {t('share.native')}
            </button>
          )}
          {file && (
            <button type="button" className={controls.outline} onClick={() => downloadFile(file)}>
              {t('share.download')}
            </button>
          )}
          <button type="button" className={controls.outline} onClick={() => void copy()}>
            {t('share.copy')}
          </button>
        </div>

        <p className={styles.notice} aria-live="polite">
          {notice}
        </p>
      </div>
    </Modal>
  )
}
