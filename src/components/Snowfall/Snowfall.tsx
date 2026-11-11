import type { CSSProperties } from 'react'
import styles from './Snowfall.module.css'

/** Hópelyhek a protótípusból: vízszintes hely, méret, esési idő, késleltetés. */
const FLAKES: readonly [x: number, size: number, duration: number, delay: number][] = [
  [3, 6, 11, -2],
  [9, 4, 14, -7],
  [14, 8, 9, -4],
  [20, 5, 13, -10],
  [26, 7, 10, -1],
  [31, 4, 15, -8],
  [37, 6, 12, -5],
  [43, 9, 9, -3],
  [48, 5, 14, -11],
  [54, 7, 11, -6],
  [59, 4, 13, -2],
  [65, 8, 10, -9],
  [70, 5, 15, -4],
  [76, 6, 12, -7],
  [81, 9, 9, -1],
  [87, 4, 14, -12],
  [92, 7, 11, -5],
  [97, 5, 13, -3],
  [6, 3, 16, -13],
  [34, 3, 17, -6],
  [62, 3, 16, -14],
  [84, 3, 18, -9],
]

/** Dekoratív hóesés; a képernyőolvasók elől rejtve. */
export function Snowfall({ count = FLAKES.length }: { count?: number }) {
  return (
    <div className={styles.snow} aria-hidden="true">
      {FLAKES.slice(0, count).map(([x, size, duration, delay], index) => (
        <i
          key={index}
          style={
            {
              '--x': `${x}%`,
              '--s': `${size}px`,
              '--d': `${duration}s`,
              '--w': `${delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
