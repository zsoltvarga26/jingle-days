import type { TreePalette } from '../palette'

/**
 * A 12 díszalakzat. Mindegyik a (0, 0) köré rajzol, nagyjából 9 × 9 egységnyi helyre;
 * a fa a dísz helyére tolja és igény szerint nagyítja.
 *
 * A színek attribútumként kerülnek ki (nem CSS-ből), hogy a megosztókártya is ki tudja rajzolni.
 * `ghost` módban ugyanaz az alak csak körvonalként jelenik meg (még meg nem szerzett dísz).
 */
export interface GhostStyle {
  stroke: string
  width: number
  dash?: string
}

export interface ShapeProps {
  /** A dísz fő színe és annak sötétebb árnyalata. */
  fill: string
  shade: string
  palette: TreePalette
  ghost?: GhostStyle
}

function tools(ghost: GhostStyle | undefined) {
  /** Kitöltött felület; ghost módban csak a körvonala. */
  const area = (color: string) =>
    ghost
      ? {
          fill: 'none',
          stroke: ghost.stroke,
          strokeWidth: ghost.width,
          strokeDasharray: ghost.dash,
          strokeLinejoin: 'round' as const,
        }
      : { fill: color }

  /** Vonalból álló rész (pl. a hópehely ágai). */
  const line = (color: string, width: number) => ({
    fill: 'none',
    stroke: ghost ? ghost.stroke : color,
    strokeWidth: ghost ? ghost.width : width,
    strokeDasharray: ghost?.dash,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  })

  return { area, line, solid: !ghost }
}

const round = (n: number) => Math.round(n * 100) / 100

/** Ötágú csillag csúcsai. */
const STAR_POINTS = Array.from({ length: 10 }, (_, i) => {
  const radius = i % 2 === 0 ? 4.5 : 1.95
  const angle = (Math.PI / 5) * i - Math.PI / 2
  return `${round(Math.cos(angle) * radius)},${round(Math.sin(angle) * radius)}`
}).join(' ')

/** Hópehely: hat ág, mindegyiken két kis oldalág. */
const SNOWFLAKE_PATH = Array.from({ length: 6 }, (_, i) => {
  const angle = (Math.PI / 3) * i - Math.PI / 2
  const at = (radius: number, offset = 0) =>
    `${round(Math.cos(angle + offset) * radius)} ${round(Math.sin(angle + offset) * radius)}`
  return `M 0 0 L ${at(4.3)} M ${at(2.5)} L ${at(3.7, 0.42)} M ${at(2.5)} L ${at(3.7, -0.42)}`
}).join(' ')

export function Bauble({ fill, shade, palette, ghost }: ShapeProps) {
  const { area, solid } = tools(ghost)
  return (
    <>
      <rect x={-0.9} y={-4.6} width={1.8} height={1.4} rx={0.3} {...area(palette.goldDark)} />
      <circle cy={0.4} r={3.7} {...area(fill)} />
      {solid && (
        <>
          <path d="M -3.3 1.6 Q 0 3.4 3.3 1.6" fill="none" stroke={shade} strokeWidth={0.7} opacity={0.75} />
          <circle cx={-1.3} cy={-1} r={0.95} fill={palette.snow} opacity={0.55} />
        </>
      )}
    </>
  )
}

export function Star({ fill, palette, ghost }: ShapeProps) {
  const { area, solid } = tools(ghost)
  return (
    <>
      <polygon points={STAR_POINTS} {...area(fill)} />
      {solid && (
        <polygon points={STAR_POINTS} transform="scale(0.45)" fill={palette.snow} opacity={0.45} />
      )}
    </>
  )
}

export function CandyCane({ fill, palette, ghost }: ShapeProps) {
  const { line, solid } = tools(ghost)
  const d = 'M -1.7 4.2 V -1.6 A 2.2 2.2 0 0 1 2.7 -1.6 V -0.3'
  return (
    <>
      <path d={d} {...line(palette.snow, 1.8)} />
      {solid && (
        <path d={d} fill="none" stroke={fill} strokeWidth={1.8} strokeDasharray="1.2 1.5" />
      )}
    </>
  )
}

export function Bell({ fill, shade, palette, ghost }: ShapeProps) {
  const { area, solid } = tools(ghost)
  return (
    <>
      <circle cy={-4} r={0.8} {...area(shade)} />
      <circle cy={3.7} r={0.9} {...area(shade)} />
      <path d="M -3 2 Q -3.1 -3.4 0 -3.6 Q 3.1 -3.4 3 2 L 3.9 3.1 H -3.9 Z" {...area(fill)} />
      {solid && (
        <path d="M -1.7 -2.2 Q -2.2 -0.4 -2.1 1.4" fill="none" stroke={palette.snow} strokeWidth={0.7} strokeLinecap="round" opacity={0.6} />
      )}
    </>
  )
}

export function Bow({ fill, shade, ghost }: ShapeProps) {
  const { area } = tools(ghost)
  return (
    <>
      <path d="M -0.4 0.6 L -2.5 4.3 L -1 3.6 L 0 1.4 Z" {...area(shade)} />
      <path d="M 0.4 0.6 L 2.5 4.3 L 1 3.6 L 0 1.4 Z" {...area(shade)} />
      <path d="M 0 0 L -4.2 -2.8 Q -4.9 0 -4.2 2.8 Z" {...area(fill)} />
      <path d="M 0 0 L 4.2 -2.8 Q 4.9 0 4.2 2.8 Z" {...area(fill)} />
      <circle r={1.15} {...area(shade)} />
    </>
  )
}

export function Snowflake({ fill, ghost }: ShapeProps) {
  const { line } = tools(ghost)
  return <path d={SNOWFLAKE_PATH} {...line(fill, 0.75)} />
}

export function Gingerbread({ palette, ghost }: ShapeProps) {
  const { area, line, solid } = tools(ghost)
  const dough = palette.gingerbread
  return (
    <>
      <path d="M -3.2 -0.5 H 3.2" {...line(dough, 1.7)} />
      <path d="M -0.8 1.6 L -1.7 4" {...line(dough, 1.7)} />
      <path d="M 0.8 1.6 L 1.7 4" {...line(dough, 1.7)} />
      <rect x={-1.4} y={-1.3} width={2.8} height={3.3} rx={0.7} {...area(dough)} />
      <circle cy={-2.7} r={1.7} {...area(dough)} />
      {solid && (
        <g fill={palette.snow}>
          <circle cx={-0.6} cy={-2.9} r={0.26} />
          <circle cx={0.6} cy={-2.9} r={0.26} />
          <circle cy={-0.3} r={0.32} />
          <circle cy={0.9} r={0.32} />
        </g>
      )}
    </>
  )
}

export function Boot({ fill, palette, ghost }: ShapeProps) {
  const { area } = tools(ghost)
  return (
    <>
      <path d="M -1.8 -3.4 H 1.6 V 0.8 Q 4.2 1 4.2 3 V 4.2 H -1.8 Z" {...area(fill)} />
      <rect x={-2.3} y={-4.5} width={4.4} height={1.7} rx={0.5} {...area(palette.snow)} />
    </>
  )
}

export function Gift({ fill, shade, palette, ghost }: ShapeProps) {
  const { area, solid } = tools(ghost)
  return (
    <>
      <rect x={-3.3} y={-1.8} width={6.6} height={5.8} rx={0.4} {...area(fill)} />
      <rect x={-3.8} y={-3} width={7.6} height={1.7} rx={0.4} {...area(shade)} />
      {solid && <rect x={-0.6} y={-3} width={1.2} height={7} fill={palette.gold} />}
      <path
        d="M 0 -3 Q -2.6 -5.6 -2.7 -3.7 Q -1.6 -3 0 -3 Q 2.6 -5.6 2.7 -3.7 Q 1.6 -3 0 -3 Z"
        {...area(palette.gold)}
      />
    </>
  )
}

export function Candle({ palette, ghost }: ShapeProps) {
  const { area } = tools(ghost)
  return (
    <>
      <rect x={-2.2} y={3.6} width={4.4} height={0.9} rx={0.3} {...area(palette.goldDark)} />
      <rect x={-1.2} y={-1.4} width={2.4} height={5.1} rx={0.3} {...area(palette.snow)} />
      <path d="M 0 -4.8 Q 1.7 -2.8 0 -1.7 Q -1.7 -2.8 0 -4.8 Z" {...area(palette.gold)} />
    </>
  )
}

export function Szaloncukor({ fill, shade, palette, ghost }: ShapeProps) {
  const { area, solid } = tools(ghost)
  return (
    <g transform="rotate(-18)">
      <path d="M -1.9 -1.2 L -4.6 -2.3 L -4 0 L -4.6 2.3 L -1.9 1.2 Z" {...area(shade)} />
      <path d="M 1.9 -1.2 L 4.6 -2.3 L 4 0 L 4.6 2.3 L 1.9 1.2 Z" {...area(shade)} />
      <rect x={-2.1} y={-1.6} width={4.2} height={3.2} rx={0.5} {...area(fill)} />
      {solid && (
        <g fill={palette.snow} opacity={0.55}>
          <rect x={-1.1} y={-1.6} width={0.6} height={3.2} />
          <rect x={0.5} y={-1.6} width={0.6} height={3.2} />
        </g>
      )}
    </g>
  )
}

export function Pinecone({ palette, ghost }: ShapeProps) {
  const { area, solid } = tools(ghost)
  return (
    <>
      <rect x={-0.45} y={-4.7} width={0.9} height={1.4} rx={0.2} {...area(palette.trunk)} />
      <ellipse cy={0.4} rx={2.6} ry={3.8} {...area(palette.trunk)} />
      {solid && (
        <g fill="none" stroke={palette.snow} strokeWidth={0.45} strokeLinecap="round" opacity={0.5}>
          <path d="M -1.9 -1.6 Q 0 -0.3 1.9 -1.6" />
          <path d="M -2.4 0.2 Q 0 1.6 2.4 0.2" />
          <path d="M -2.1 2 Q 0 3.3 2.1 2" />
        </g>
      )}
    </>
  )
}
