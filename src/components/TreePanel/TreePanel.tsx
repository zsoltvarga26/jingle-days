import type { ReactNode } from 'react'
import styles from './TreePanel.module.css'

export interface TreePanelProps {
  /** Éppen dísz kerül a fára: a kártya köré arany keret kerül. */
  decorating?: boolean
  children: ReactNode
}

/**
 * A fa kártyája a kalendárium mellett (keskeny kijelzőn alatta). Széles nézetben ragad,
 * és pontosan olyan magas, mint a tábla: a magasságot a szülő adja a --board-h változóban.
 */
export function TreePanel({ decorating = false, children }: TreePanelProps) {
  return (
    <div
      className={`${styles.panel} ${decorating ? styles.decorating : ''}`}
      data-decorating={decorating ? '' : undefined}
    >
      {children}
    </div>
  )
}
