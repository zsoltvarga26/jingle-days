import type { ReactNode } from 'react'
import styles from './TreePanel.module.css'

/**
 * A fa kártyája a kalendárium mellett (keskeny kijelzőn alatta). Széles nézetben ragad,
 * és pontosan olyan magas, mint a tábla: a magasságot a szülő adja a --board-h változóban.
 */
export function TreePanel({ children }: { children: ReactNode }) {
  return <div className={styles.panel}>{children}</div>
}
