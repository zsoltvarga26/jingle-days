import { getEngine, type Engine } from './engine'

/** A hangeffektek nevei: melyik esemény melyik hangot kapja. */
export type SfxName =
  /** Ajtónyitás: suhanás, a végén puha, fás koppanás (szándékosan nem csengő, hogy elüssön a zenétől). */
  | 'door'
  /** Zárolt ajtó: két tompa kopogás – „még nem nyitható”. */
  | 'locked'
  /** Helyes válasz: két felfelé lépő csengőhang. */
  | 'success'
  /** Hibás válasz: két lefelé lépő, puha hang; jól hallható, de nem büntető hangzású. */
  | 'wrong'
  /** Tipp felfedése: rövid, halk koppanás. */
  | 'hint'
  /** Rejtvény megfejtve: háromhangos, felfelé futó arpeggio. */
  | 'solved'
  /** Dísz a fán: csillogó, magas csengőfüzér. */
  | 'sparkle'

/**
 * Csengőhang additív szintézissel: néhány szinuszoszcillátor a harangokra jellemző,
 * nem harmonikus felhangarányokkal, gyors felfutással és exponenciális lecsengéssel.
 * A magasabb felhangok halkabbak és hamarabb elhalnak.
 */
const BELL_PARTIALS: readonly [ratio: number, level: number, decay: number][] = [
  [1, 1, 1],
  [2, 0.55, 0.7],
  [2.76, 0.32, 0.45],
  [5.4, 0.14, 0.25],
]

function bell(engine: Engine, frequency: number, start: number, seconds: number, level: number) {
  const { ctx, sfx } = engine
  for (const [ratio, partialLevel, decay] of BELL_PARTIALS) {
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = frequency * ratio

    const gain = ctx.createGain()
    const end = start + seconds * decay
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(level * partialLevel, start + 0.006)
    gain.gain.exponentialRampToValueAtTime(0.0001, end)

    osc.connect(gain)
    gain.connect(sfx)
    osc.start(start)
    osc.stop(end + 0.05)
  }
}

interface ToneOptions {
  type: OscillatorType
  /** Kezdő és záró frekvencia (Hz); ha eltérnek, a hang csúszik. */
  from: number
  to?: number
  seconds: number
  level: number
  /** Aluláteresztő szűrő határfrekvenciája: ettől puhább a hang. */
  lowpass?: number
}

/** Egyszerű, rövid hang gyors megütéssel és lecsengéssel. */
function tone(engine: Engine, start: number, options: ToneOptions) {
  const { ctx, sfx } = engine
  const { type, from, to = from, seconds, level, lowpass } = options

  const osc = ctx.createOscillator()
  osc.type = type
  osc.frequency.setValueAtTime(from, start)
  if (to !== from) osc.frequency.exponentialRampToValueAtTime(to, start + seconds)

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(level, start + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + seconds)

  if (lowpass) {
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = lowpass
    osc.connect(filter)
    filter.connect(gain)
  } else {
    osc.connect(gain)
  }
  gain.connect(sfx)
  osc.start(start)
  osc.stop(start + seconds + 0.05)
}

const noiseBuffers = new WeakMap<AudioContext, AudioBuffer>()

/** Fél másodperc fehér zaj, hangmotoronként egyszer legenerálva. */
function noiseBuffer(ctx: AudioContext): AudioBuffer {
  let buffer = noiseBuffers.get(ctx)
  if (!buffer) {
    buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.5), ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    noiseBuffers.set(ctx, buffer)
  }
  return buffer
}

/** Szűrt zaj: a sávszűrő frekvenciája `from`-tól `to`-ig csúszik (suhanás, koppanás zöreje). */
function noise(
  engine: Engine,
  start: number,
  options: { from: number; to: number; seconds: number; level: number; q: number },
) {
  const { ctx, sfx } = engine
  const source = ctx.createBufferSource()
  source.buffer = noiseBuffer(ctx)

  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.Q.value = options.q
  filter.frequency.setValueAtTime(options.from, start)
  filter.frequency.exponentialRampToValueAtTime(options.to, start + options.seconds)

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(options.level, start + options.seconds * 0.45)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + options.seconds)

  source.connect(filter)
  filter.connect(gain)
  gain.connect(sfx)
  source.start(start)
  source.stop(start + options.seconds + 0.05)
}

/** Ajtónyitás: felfelé suhanó zaj, a végén puha, fás „pukkanás”. */
function doorOpen(engine: Engine, start: number) {
  noise(engine, start, { from: 420, to: 2400, seconds: 0.34, level: 0.2, q: 1.1 })
  tone(engine, start + 0.27, { type: 'sine', from: 520, to: 780, seconds: 0.16, level: 0.22 })
  tone(engine, start + 0.27, { type: 'triangle', from: 260, to: 390, seconds: 0.12, level: 0.1 })
}

/** Zárolt ajtó: két gyors, tompa kopogás. */
function knock(engine: Engine, start: number) {
  for (const offset of [0, 0.13]) {
    tone(engine, start + offset, {
      type: 'triangle',
      from: 300,
      to: 210,
      seconds: 0.11,
      level: 0.3,
      lowpass: 1400,
    })
    noise(engine, start + offset, { from: 900, to: 500, seconds: 0.05, level: 0.09, q: 2 })
  }
}

/** Hibás válasz: két lefelé lépő, puha hang. Elég magasan szól ahhoz, hogy kis hangszórón is hallatsszon. */
function wrongAnswer(engine: Engine, start: number) {
  tone(engine, start, { type: 'triangle', from: 330, to: 311, seconds: 0.18, level: 0.3, lowpass: 2200 })
  tone(engine, start + 0.15, {
    type: 'triangle',
    from: 247,
    to: 220,
    seconds: 0.34,
    level: 0.32,
    lowpass: 2200,
  })
  tone(engine, start + 0.15, { type: 'sine', from: 494, to: 440, seconds: 0.3, level: 0.08 })
}

/** Rövid, halk koppanás. */
function tick(engine: Engine, start: number) {
  const { ctx, sfx } = engine
  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(1320, start)
  osc.frequency.exponentialRampToValueAtTime(880, start + 0.05)

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(0.12, start + 0.004)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.07)

  osc.connect(gain)
  gain.connect(sfx)
  osc.start(start)
  osc.stop(start + 0.1)
}

// Hangmagasságok (Hz).
const G5 = 783.99
const C6 = 1046.5
const E6 = 1318.51
const G6 = 1567.98
const C7 = 2093
const E7 = 2637.02
const G7 = 3135.96

const recipes: Record<SfxName, (engine: Engine, now: number) => void> = {
  door: (engine, now) => doorOpen(engine, now),
  locked: (engine, now) => knock(engine, now),
  success: (engine, now) => {
    bell(engine, G5, now, 0.9, 0.2)
    bell(engine, C6, now + 0.12, 1.3, 0.22)
  },
  wrong: (engine, now) => wrongAnswer(engine, now),
  hint: (engine, now) => tick(engine, now),
  solved: (engine, now) => {
    bell(engine, C6, now, 0.9, 0.18)
    bell(engine, E6, now + 0.1, 0.9, 0.18)
    bell(engine, G6, now + 0.2, 1.5, 0.2)
  },
  sparkle: (engine, now) => {
    ;[G6, C7, E7, G7, C7 * 2].forEach((frequency, index) =>
      bell(engine, frequency, now + index * 0.07, 0.9, 0.09),
    )
  },
}

/**
 * Lejátszik egy hangeffektet. Felhasználói műveletből hívva ez hozza létre a hangmotort is.
 * Ahol nincs Web Audio, ott csendben nem csinál semmit.
 */
export function playSfx(name: SfxName): void {
  const engine = getEngine()
  if (!engine) return
  try {
    recipes[name](engine, engine.ctx.currentTime + 0.01)
  } catch {
    // A hang dísz: ha nem megy, a játék megy tovább.
  }
}
