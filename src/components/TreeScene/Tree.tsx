import type { CSSProperties } from 'react'
import type { Ornament } from '../../content/types'
import { TREE_VIEWBOX } from './geometry'
import { OrnamentArt } from './ornaments/OrnamentArt'
import type { TreePalette } from './palette'
import styles from './Tree.module.css'

export interface TreeProps {
  /** Mind a 24 dísz, a helyével együtt. */
  ornaments: readonly Ornament[]
  /** A fán lévő (megszerzett és már felkerült) díszek azonosítói. */
  earned: ReadonlySet<string>
  /** Az éppen a helyükre eső díszek azonosítói. */
  dropping?: ReadonlySet<string>
  /** Égnek-e a fa fényei (mind a 24 dísz fent van). */
  lit?: boolean
  palette: TreePalette
  /** A kép neve képernyőolvasónak. */
  label: string
  className?: string
}

/** A fények helye a díszek között. */
const LIGHTS: readonly [x: number, y: number][] = [
  [50, 22],
  [43, 36],
  [57, 36],
  [44, 47],
  [56, 47],
  [33, 59],
  [50, 60],
  [67, 59],
  [37, 72],
  [50, 71],
  [63, 72],
  [26, 85],
  [38, 85],
  [50, 85],
  [62, 85],
  [74, 85],
]

/**
 * A fenyőfa a díszekkel – tiszta rajz, állapot nélkül. A színek SVG-attribútumként kerülnek ki,
 * így a megosztókártya ugyanezt a komponenst tudja képpé alakítani.
 */
export function Tree({
  ornaments,
  earned,
  dropping,
  lit = false,
  palette,
  label,
  className,
}: TreeProps) {
  const [top, mid, bottom] = palette.tree
  // Több leeső dísz egymás után érkezik: a sorszámuk adja a késleltetést.
  const dropOrder = new Map([...(dropping ?? [])].map((id, index) => [id, index]))

  return (
    <svg
      className={className}
      viewBox={`0 0 ${TREE_VIEWBOX.width} ${TREE_VIEWBOX.height}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={label}
    >
      {/* Hó a fa alatt, törzs, majd a három szint alulról felfelé. */}
      <ellipse cx={50} cy={110} rx={44} ry={6} fill={palette.snow} opacity={0.75} />
      <rect x={45} y={97} width={10} height={12} rx={1} fill={palette.trunk} />
      <polygon points="50,52 8,100 92,100" fill={bottom} strokeLinejoin="round" stroke={bottom} strokeWidth={2} />
      <polygon points="50,30 18,72 82,72" fill={mid} strokeLinejoin="round" stroke={mid} strokeWidth={2} />
      <polygon points="50,12 28,44 72,44" fill={top} strokeLinejoin="round" stroke={top} strokeWidth={2} />

      {lit && (
        <g>
          {LIGHTS.map(([x, y], index) => (
            <circle
              key={index}
              className={styles.light}
              style={{ '--n': index } as CSSProperties}
              cx={x}
              cy={y}
              r={1.15}
              fill={index % 2 === 0 ? palette.gold : palette.snow}
              data-light=""
            />
          ))}
        </g>
      )}

      {ornaments.map((ornament) => {
        const isDropping = dropping?.has(ornament.id) ?? false
        const state = isDropping ? 'dropping' : earned.has(ornament.id) ? 'earned' : 'ghost'
        const { x, y } = ornament.slot
        const scale = ornament.scale ?? 1
        const order = dropOrder.get(ornament.id) ?? 0

        return (
          // A külső csoport a helyére teszi a díszt; az animáció a belső csoporton fut,
          // mert a CSS-transzformáció felülírná a transform attribútumot.
          <g
            key={ornament.id}
            transform={`translate(${x} ${y})${scale === 1 ? '' : ` scale(${scale})`}`}
            data-ornament={ornament.id}
            data-state={state}
          >
            {lit && state === 'earned' && ornament.shape === 'star' && scale > 1 && (
              <circle className={styles.halo} r={5.6} fill={palette.gold} opacity={0.3} />
            )}
            <g
              className={
                state === 'dropping' ? styles.drop : state === 'earned' ? styles.sway : undefined
              }
              style={{ '--n': state === 'dropping' ? order : (x + y) % 7 } as CSSProperties}
            >
              <OrnamentArt ornament={ornament} palette={palette} ghost={state === 'ghost'} />
              {state === 'dropping' && (
                <g className={styles.sparkles} fill={palette.gold}>
                  <circle cx={-5} cy={-3} r={0.7} />
                  <circle cx={5.2} cy={-1.5} r={0.55} />
                  <circle cx={-3.5} cy={4.5} r={0.5} />
                  <circle cx={4} cy={4.8} r={0.65} />
                </g>
              )}
            </g>
          </g>
        )
      })}
    </svg>
  )
}
