import { nextMelody } from '../../audio/music'
import { useMelody } from '../../audio/useMelody'
import { useI18n } from '../../i18n/useI18n'
import { useSettings } from '../../state/useSettings'
import styles from './SoundControls.module.css'

function BellIcon({ off }: { off: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path
        d="M12 3a1.4 1.4 0 0 1 1.4 1.4v.5A6 6 0 0 1 18 10.7V14l1.7 2.6a.9.9 0 0 1-.8 1.4H5.1a.9.9 0 0 1-.8-1.4L6 14v-3.3a6 6 0 0 1 4.6-5.8v-.5A1.4 1.4 0 0 1 12 3Z"
        fill="currentColor"
      />
      <path d="M9.8 19.5a2.3 2.3 0 0 0 4.4 0Z" fill="currentColor" />
      {off && <path d="M4 4 20 20" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />}
    </svg>
  )
}

function NoteIcon({ off }: { off: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path
        d="M9 5.2 19 3v11.6a3 3 0 1 1-2-2.8V7.1l-6 1.3v8.2a3 3 0 1 1-2-2.8Z"
        fill="currentColor"
      />
      {off && <path d="M4 4 20 20" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />}
    </svg>
  )
}

function NextIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path
        d="M5 5.5v13a.8.8 0 0 0 1.25.66L15 13.2v5.3a1.25 1.25 0 0 0 2.5 0v-13a1.25 1.25 0 0 0-2.5 0v5.3L6.25 4.84A.8.8 0 0 0 5 5.5Z"
        fill="currentColor"
      />
    </svg>
  )
}

/** Két külön kapcsoló: hangeffektek és háttérzene; a zene mellett dallamváltó és hangerőcsúszka. */
export function SoundControls() {
  const { t } = useI18n()
  const { settings, updateSettings } = useSettings()
  const melody = useMelody()
  const nextLabel = t('sound.next', { title: t(`melody.${melody}`) })

  return (
    <div className={styles.group} role="group" aria-label={t('sound.group')}>
      <button
        type="button"
        className={styles.toggle}
        aria-pressed={settings.sfx}
        aria-label={t('sound.sfx')}
        title={t('sound.sfx')}
        onClick={() => updateSettings({ sfx: !settings.sfx })}
      >
        <BellIcon off={!settings.sfx} />
      </button>
      <button
        type="button"
        className={styles.toggle}
        aria-pressed={settings.music}
        aria-label={t('sound.music')}
        title={t('sound.music')}
        onClick={() => updateSettings({ music: !settings.music })}
      >
        <NoteIcon off={!settings.music} />
      </button>
      {settings.music && (
        <button
          type="button"
          className={styles.toggle}
          aria-label={nextLabel}
          title={nextLabel}
          onClick={nextMelody}
        >
          <NextIcon />
        </button>
      )}
      {settings.music && (
        <input
          className={styles.volume}
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={settings.musicVolume}
          aria-label={t('sound.volume')}
          title={t('sound.volume')}
          onChange={(event) => updateSettings({ musicVolume: Number(event.target.value) })}
        />
      )}
    </div>
  )
}
