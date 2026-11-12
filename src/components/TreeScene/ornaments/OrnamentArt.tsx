import type { Ornament } from '../../../content/types'
import type { TreePalette } from '../palette'
import { shapes } from './shapeMap'

export interface OrnamentArtProps {
  ornament: Ornament
  palette: TreePalette
  /** Még meg nem szerzett dísz: azonos alak, csak szaggatott körvonal. */
  ghost?: boolean
}

/** Egy dísz rajza a (0, 0) köré; SVG-n belülre való (`<g>` elemet ad vissza). */
export function OrnamentArt({ ornament, palette, ghost = false }: OrnamentArtProps) {
  const Shape = shapes[ornament.shape]
  const { fill, shade } = palette.colors[ornament.color ?? 'gold']

  if (!ghost) {
    return (
      <g>
        <Shape fill={fill} shade={shade} palette={palette} />
      </g>
    )
  }

  // Két réteg: sötét alávonal és világos szaggatott vonal, így a körvonal a zöld fán,
  // világos és sötét oldalháttéren is látszik.
  return (
    <g opacity={0.6}>
      <Shape fill={fill} shade={shade} palette={palette} ghost={{ stroke: palette.ghostDark, width: 0.9 }} />
      <Shape
        fill={fill}
        shade={shade}
        palette={palette}
        ghost={{ stroke: palette.snow, width: 0.45, dash: '1.1 0.9' }}
      />
    </g>
  )
}

/** Önálló kis kép egy díszről (pl. az idézet lépésénél). */
export function OrnamentIcon({
  ornament,
  palette,
  size = 44,
  className,
}: {
  ornament: Ornament
  palette: TreePalette
  /** Képpontban, vagy CSS-hosszként (pl. '1.3em'). */
  size?: number | string
  className?: string
}) {
  return (
    <svg
      className={className}
      viewBox="-6 -6 12 12"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      <OrnamentArt ornament={ornament} palette={palette} />
    </svg>
  )
}
