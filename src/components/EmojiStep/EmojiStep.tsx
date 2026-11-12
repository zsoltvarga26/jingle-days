import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { EmojiPuzzle } from '../../content/types'
import { useI18n } from '../../i18n/useI18n'
import { isCorrectGuess } from '../../lib/normalize'
import type { PuzzleProgress } from '../../state/progress'
import controls from '../../styles/controls.module.css'
import styles from './EmojiStep.module.css'

export interface EmojiStepProps {
  /** 1 vagy 2 rejtvény; a komponens a tömb hosszából dolgozik, nem a nap számából. */
  puzzles: readonly EmojiPuzzle[]
  progress: readonly PuzzleProgress[]
  /** Melyik rejtvénnyel induljon (visszatéréskor); alapból az első hátralévővel. */
  start?: number
  onGuess: (puzzle: number, correct: boolean) => void
  onRevealHint: (puzzle: number) => void
  /** Csak az aktuális rejtvényt ugorja át. */
  onSkip: (puzzle: number) => void
  /** Ha nincs több hátralévő rejtvény. */
  onDone: () => void
  /** Megfejtés pillanatában (konfetti). */
  onSolved?: () => void
}

const SHAKE = [
  { transform: 'translateX(0)' },
  { transform: 'translateX(-7px)' },
  { transform: 'translateX(7px)' },
  { transform: 'translateX(-4px)' },
  { transform: 'translateX(0)' },
]

/** Rejtvények egymás után: emojisor, szövegmező, 2 tipp rejtvényenként, átugrás. */
export function EmojiStep({
  puzzles,
  progress,
  start,
  onGuess,
  onRevealHint,
  onSkip,
  onDone,
  onSolved,
}: EmojiStepProps) {
  const { t, lang } = useI18n()

  // Melyik rejtvény látszik: nézetállapot, az előrehaladás a ProgressContextből jön.
  const [current, setCurrent] = useState(() => {
    if (start !== undefined) return start
    const first = progress.findIndex((p) => p.status === 'pending')
    return first === -1 ? puzzles.length - 1 : first
  })
  const [guess, setGuess] = useState('')
  const [wrong, setWrong] = useState(false)

  const puzzle = puzzles[current]
  const state = progress[current]
  const solved = state.status === 'done'
  const input = useRef<HTMLInputElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)

  // Rejtvényváltáskor és megfejtéskor a fókusz a címre kerül (a mező, ill. a gomb eltűnik alóla).
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    heading.current?.focus()
  }, [current, solved])

  const nextPending = progress.findIndex((p, index) => index > current && p.status === 'pending')

  const advance = () => {
    if (nextPending === -1) {
      onDone()
      return
    }
    setCurrent(nextPending)
    setGuess('')
    setWrong(false)
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (guess.trim() === '') return
    const correct = isCorrectGuess(guess, puzzle)
    onGuess(current, correct)
    if (correct) {
      setWrong(false)
      onSolved?.()
      return
    }
    setWrong(true)
    const field = input.current
    if (!field) return
    // A beírt szöveg megmarad és kijelölődik, így rögtön felülírható.
    field.select()
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    if (!reducedMotion) field.animate?.(SHAKE, { duration: 380, easing: 'ease-in-out' })
  }

  const inputId = `guess-${puzzle.id}`

  return (
    <div className={styles.emoji}>
      <div className={styles.meta}>
        <span className={styles.kind}>{t(`emoji.kind.${puzzle.kind}`)}</span>
        {puzzles.length > 1 && (
          <span className={styles.counter}>
            {t('emoji.counter', { current: current + 1, total: puzzles.length })}
          </span>
        )}
      </div>

      <h3 className={styles.prompt} ref={heading} tabIndex={-1}>
        {t('emoji.prompt')}
      </h3>
      <p className={styles.emojis}>{puzzle.emojis}</p>

      {solved ? (
        <div className={styles.solved}>
          <p className={styles.solvedTitle}>{t('emoji.solved')}</p>
          <p className={styles.answer}>{t('emoji.answer', { answer: puzzle.answers[lang][0] })}</p>
        </div>
      ) : (
        <form className={styles.form} onSubmit={submit} noValidate>
          <label className={styles.label} htmlFor={inputId}>
            {t('emoji.input')}
          </label>
          <div className={styles.row}>
            <input
              id={inputId}
              ref={input}
              className={styles.input}
              type="text"
              value={guess}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              enterKeyHint="send"
              aria-invalid={wrong || undefined}
              aria-describedby={`${inputId}-feedback`}
              onChange={(event) => {
                setGuess(event.target.value)
                setWrong(false)
              }}
            />
            <button type="submit" className={controls.primary}>
              {t('emoji.check')}
            </button>
          </div>
        </form>
      )}

      {/* Szövegben is megjelenik, nem csak a rázkódással; a képernyőolvasó is bemondja. */}
      <p id={`${inputId}-feedback`} className={styles.feedback} aria-live="polite">
        {solved ? <span className="sr-only">{t('emoji.solved')}</span> : wrong ? t('emoji.wrong') : ''}
      </p>

      <ul className={styles.hints}>
        {puzzle.hints.map((hint, index) => {
          const n = index + 1
          if (state.hintsRevealed > index) {
            return (
              <li key={index} className={styles.hint}>
                <span className={styles.hintLabel}>{t('emoji.hint.label', { n })}</span>
                {hint[lang]}
              </li>
            )
          }
          if (solved) return null
          // A második tipp csak az első után fedhető fel.
          const locked = index > state.hintsRevealed
          return (
            <li key={index}>
              <button
                type="button"
                className={`${controls.outline} ${styles.hintButton}`}
                aria-disabled={locked || undefined}
                aria-label={locked ? t('emoji.hint.locked', { n }) : undefined}
                onClick={() => {
                  if (!locked) onRevealHint(current)
                }}
              >
                {t('emoji.hint.reveal', { n })}
              </button>
            </li>
          )
        })}
      </ul>

      <div className={controls.actions}>
        {solved ? (
          <button type="button" className={controls.primary} onClick={advance}>
            {nextPending === -1 ? t('emoji.finish') : t('emoji.next')}
          </button>
        ) : (
          <button
            type="button"
            className={controls.quiet}
            onClick={() => {
              // A kihagyás nem mutatja meg a megfejtést, így később tisztán újrapróbálható.
              onSkip(current)
              advance()
            }}
          >
            {t('emoji.skip')}
          </button>
        )}
      </div>
    </div>
  )
}
