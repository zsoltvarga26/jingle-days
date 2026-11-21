import type { RoomPalette } from './palette'
import styles from './RoomBackdrop.module.css'

/** A tégla sorai a kandalló keretén (y, eltolás). */
const BRICK_ROWS: readonly [y: number, shift: number][] = [
  [66, 0],
  [70, 3],
  [74, 0],
  [78, 3],
  [82, 0],
  [86, 3],
  [90, 0],
  [94, 3],
]

const FLAKES: readonly [x: number, y: number][] = [
  [10, 15],
  [17, 13],
  [25, 16],
  [30, 13.5],
  [13, 21],
  [21, 20],
  [28, 23],
  [9.5, 28],
  [18, 27],
  [24, 30],
  [31, 29],
]

/**
 * Meddig nyúlik túl a fal és a padló a 130 × 120-as viewBoxon. Az oldalon a kártya a széles
 * nézetben magasabb vagy szélesebb lehet a jelenetnél: ilyenkor a túlnyúló rész tölti ki,
 * a keret levágja. A megosztókártyán a viewBox vág, ott nem látszik.
 */
const BLEED = 400

/**
 * A szoba a fa mögött: tapétás fal, ablak a havas éjszakára, kandalló, szőnyeg. `<g>`-t ad,
 * hogy az oldalon saját SVG-be, a megosztókártyán a fával közös képbe kerülhessen.
 *
 * A színek SVG-attribútumként jönnek a palettáról (mint a fánál), így CSS nélkül, képként is
 * színes. Az oldalon a CSS csak a sötét módban változó falat írja felül, és mozgatja a lángot.
 */
export function RoomBackground({ palette: p }: { palette: RoomPalette }) {
  return (
    <g>
      <defs>
        <pattern id="room-wallpaper" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect x={0} y={0} width={3} height={8} fill={p.wallStripe} fillOpacity={0.12} />
          <circle cx={5.5} cy={4} r={0.6} fill={p.wallDot} fillOpacity={0.22} />
        </pattern>
        <radialGradient id="room-glow">
          <stop offset="0" stopColor={p.glow} stopOpacity={0.4} />
          <stop offset="1" stopColor={p.glow} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Fal tapétával, padló, lábléc. */}
      <rect className={styles.wall} fill={p.wall} x={-BLEED} y={-BLEED} width={130 + 2 * BLEED} height={100 + BLEED} />
      <rect fill="url(#room-wallpaper)" x={-BLEED} y={-BLEED} width={130 + 2 * BLEED} height={100 + BLEED} />
      <rect fill={p.floor} x={-BLEED} y={100} width={130 + 2 * BLEED} height={20 + BLEED} />
      <g stroke={p.plank} strokeOpacity={0.3} strokeWidth={0.35}>
        {[106, 113].map((y) => (
          <line key={y} x1={-BLEED} y1={y} x2={130 + BLEED} y2={y} />
        ))}
        {[-20, 22, 64, 97, 140].map((x) => (
          <line key={x} x1={x} y1={100} x2={x} y2={106} />
        ))}
        {[0, 41, 83, 118, 160].map((x) => (
          <line key={x} x1={x} y1={106} x2={x} y2={113} />
        ))}
      </g>
      <rect fill={p.baseboard} x={-BLEED} y={97.5} width={130 + 2 * BLEED} height={2.5} />

      {/* Ablak a havas éjszakára. */}
      <g fill={p.windowFrame}>
        <rect x={5} y={9} width={30} height={30} rx={2} />
        <rect fill={p.sky} x={7} y={11} width={26} height={26} rx={1} />
        <g fill={p.snow}>
          {FLAKES.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 0.75 : 0.5} />
          ))}
          <path d="M7 34.5 Q12 32.5 17 34 T27 33.5 T33 34 V37 H7 Z" />
        </g>
        <rect x={19} y={11} width={2} height={26} />
        <rect x={7} y={23} width={26} height={2} />
        <rect x={3.5} y={38} width={33} height={2.2} rx={1} />
      </g>

      {/* A kandalló fénye a falon és a padlón. */}
      <ellipse className={styles.glow} cx={19} cy={92} rx={30} ry={22} fill="url(#room-glow)" />

      {/* Kandalló: téglakeret, tűztér, párkány. */}
      <rect fill={p.brick} x={2} y={62} width={34} height={36} />
      <g stroke={p.mortar} strokeOpacity={0.7} strokeWidth={0.45}>
        {BRICK_ROWS.map(([y, shift]) => (
          <g key={y}>
            <line x1={2} y1={y} x2={36} y2={y} />
            {[0, 6, 12, 18, 24, 30].map((x) => (
              <line key={x} x1={2 + x + shift} y1={y - 4} x2={2 + x + shift} y2={y} />
            ))}
          </g>
        ))}
      </g>
      <path fill={p.soot} d="M9 98 V81 Q9 73 19 73 Q29 73 29 81 V98 Z" />
      <rect fill={p.hearth} x={0} y={96} width={38} height={4} rx={1} />

      {/* Hasábok és lángok. */}
      <g fill={p.log} stroke={p.soot} strokeWidth={0.3}>
        <rect x={12} y={92.5} width={14} height={3} rx={1.5} transform="rotate(-6 19 94)" />
        <rect x={11.5} y={93.5} width={15} height={3} rx={1.5} transform="rotate(7 19 95)" />
      </g>
      <g className={styles.fire}>
        <path
          fill={p.flame}
          d="M13 93 C12 88 15 86 15.5 82 C17 85 18 83 18.5 79 C21 83 22.5 85 22 87 C23.5 86 24 84.5 24 83.5 C26 87 26 91 25 93 Z"
        />
        <path
          className={styles.flameInner}
          fill={p.flameCore}
          d="M15.5 93 C15 90 17 88.5 17.5 86 C18.5 88 19.5 87 20 85 C21.5 88 22.5 90.5 22 93 Z"
        />
      </g>

      {/* Párkány harisnyákkal, fenyőfüzérrel és két gyertyával. */}
      <rect fill={p.mantel} x={0} y={58.5} width={38} height={4} rx={1} />
      <rect fill={p.mantelEdge} x={0} y={61.5} width={38} height={1.2} />
      <path
        d="M1 59 Q10 63 19 59 Q28 63 37 59"
        fill="none"
        stroke={p.garland}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      {[6, 19, 32].map((x, i) => (
        <circle key={x} fill={i === 1 ? p.gold : p.berry} cx={x} cy={i === 1 ? 59.4 : 60.6} r={0.9} />
      ))}
      {[9, 27].map((x) => (
        <g key={x} transform={`translate(${x} 63)`}>
          <path
            fill={p.stocking}
            d="M-2 0 H2 V6 Q2 8.6 -0.5 8.6 H-3.6 Q-5 8.6 -5 7.4 Q-5 6.2 -3.5 6 L-2 5.6 Z"
          />
          <rect fill={p.snow} x={-2.6} y={-0.4} width={5.2} height={2} rx={0.8} />
        </g>
      ))}
      {[4, 34].map((x) => (
        <g key={x}>
          <rect fill={p.snow} x={x - 1} y={53.5} width={2} height={5} rx={0.4} />
          <ellipse className={styles.candleFlame} fill={p.gold} cx={x} cy={52.6} rx={0.6} ry={1} />
        </g>
      ))}

      {/* Szőnyeg a kandalló előtt. */}
      <ellipse fill={p.rugEdge} cx={19} cy={110} rx={19} ry={5.4} />
      <ellipse fill={p.rug} cx={19} cy={110} rx={16.6} ry={4.2} />
    </g>
  )
}

/**
 * Alvó fekete-fehér cica a szőnyegen, a feje a mancsain. A fa előtti rétegben van, hogy a
 * farka a fa alatti fehér takarón feküdjön, ne alatta. Szuszog, és néha megrebbenti a farkát.
 */
export function SleepingCat({ palette: p }: { palette: RoomPalette }) {
  return (
    <g>
      <g className={styles.tail}>
        <path
          d="M28.5 107.8 C34 107.5 37.5 109.6 35.6 112.2 C34.5 113.6 31.8 113.4 31.2 112.2"
          fill="none"
          stroke={p.soot}
          strokeWidth={2.4}
          strokeLinecap="round"
        />
        <circle fill={p.snow} cx={31.3} cy={112.2} r={1.15} />
      </g>
      <g className={styles.breathe}>
        <ellipse fill={p.soot} cx={21} cy={108} rx={9.5} ry={5.4} />
        <ellipse fill={p.snow} cx={16.6} cy={111.2} rx={3.6} ry={1.9} />
        <path fill={p.soot} d="M25 104.5 Q28.5 105.5 29.5 109.5 Q27 112.5 22 113 Z" />
      </g>
      {/* Fej: fülek, fehér pofa, csukott szem, rózsaszín orr. */}
      <path fill={p.soot} d="M7.7 106.5 L8.3 101.4 L11.6 103.6 Z" />
      <path fill={p.soot} d="M12.6 103.3 L15.6 101.3 L16.3 106 Z" />
      <ellipse fill={p.soot} cx={12} cy={107.6} rx={4.6} ry={4.1} />
      <path fill={p.ear} d="M8.6 104.6 L8.9 102.6 L10.5 103.7 Z" />
      <path fill={p.ear} d="M13.6 103.7 L15.2 102.6 L15.5 104.6 Z" />
      <path
        fill={p.snow}
        d="M12 106.6 C10.4 106.6 9 108.4 8.7 109.6 C8.6 111 10.2 111.7 12 111.7 C13.8 111.7 15.4 111 15.3 109.6 C15 108.4 13.6 106.6 12 106.6 Z"
      />
      <path
        d="M9.3 106.9 Q10.2 107.7 11.1 106.9 M12.9 106.9 Q13.8 107.7 14.7 106.9"
        fill="none"
        stroke={p.eye}
        strokeWidth={0.4}
        strokeLinecap="round"
      />
      <path fill={p.nose} d="M11.4 108.4 H12.6 L12 109.1 Z" />
      {/* Apró, „w” alakú száj az orr alatt. */}
      <path
        d="M12 109.1 V109.55 M11.1 109.45 Q11.55 110.05 12 109.55 Q12.45 110.05 12.9 109.45"
        fill="none"
        stroke={p.soot}
        strokeWidth={0.22}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.6 109.3 L6.6 108.7 M10.6 109.8 L6.8 110.3 M13.4 109.3 L17.4 108.7 M13.4 109.8 L17.2 110.3"
        fill="none"
        stroke={p.whisker}
        strokeWidth={0.18}
        strokeLinecap="round"
      />
      {/* Elöl a két fehér mancs. */}
      <ellipse fill={p.snow} cx={10} cy={112.3} rx={1.9} ry={1} />
      <ellipse fill={p.snow} cx={13.8} cy={112.4} rx={1.9} ry={1} />
      {/* Halkan szálló „z” – csak az oldalon, mozgással látszik. */}
      <path
        className={styles.zzz}
        d="M5 99 H7.4 L5 101.4 H7.4"
        fill="none"
        stroke={p.zzz}
        strokeWidth={0.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0}
      />
    </g>
  )
}
