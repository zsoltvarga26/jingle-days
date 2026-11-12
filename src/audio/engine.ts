/**
 * Egyetlen AudioContext az egész alkalmazásnak, három hangerőszabályzóval:
 *
 *   effektek ─► sfx ──┐
 *                     ├─► master ─► hangszóró
 *   zene ─► szűrő ─► music ┘
 *
 * Mindkét ág kap egy kevés zengést is (generált impulzusválaszú ConvolverNode).
 * Hangfájl nincs: minden hangot a kód szintetizál.
 */
export interface Engine {
  ctx: AudioContext
  /** Ide csatlakoznak a hangeffektek. */
  sfx: GainNode
  /** Ide csatlakozik a háttérzene (aluláteresztő szűrőn át). */
  music: AudioNode
  /** A zene hangerejét szabályozó csomópont. */
  musicGain: GainNode
}

const MASTER_LEVEL = 0.8
const REVERB_SECONDS = 1.8
const REVERB_LEVEL = 0.22

let engine: Engine | null = null

type AudioContextClass = typeof AudioContext

function contextClass(): AudioContextClass | undefined {
  if (typeof window === 'undefined') return undefined
  const w = window as unknown as {
    AudioContext?: AudioContextClass
    webkitAudioContext?: AudioContextClass
  }
  return w.AudioContext ?? w.webkitAudioContext
}

/** Zengés: lecsengő zaj mint impulzusválasz, hangfájl nélkül. */
function impulseResponse(ctx: AudioContext): AudioBuffer {
  const length = Math.floor(ctx.sampleRate * REVERB_SECONDS)
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate)
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel)
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3)
    }
  }
  return buffer
}

function build(Ctx: AudioContextClass): Engine {
  const ctx = new Ctx()

  const master = ctx.createGain()
  master.gain.value = MASTER_LEVEL
  master.connect(ctx.destination)

  const reverb = ctx.createConvolver()
  reverb.buffer = impulseResponse(ctx)
  const wet = ctx.createGain()
  wet.gain.value = REVERB_LEVEL
  reverb.connect(wet)
  wet.connect(master)

  const sfx = ctx.createGain()
  sfx.connect(master)
  sfx.connect(reverb)

  // A zene „zenedoboz” hangzásához: a magas felhangokat szűrő tompítja.
  const musicGain = ctx.createGain()
  musicGain.gain.value = 0
  musicGain.connect(master)
  musicGain.connect(reverb)
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 2600
  filter.connect(musicGain)

  return { ctx, sfx, music: filter, musicGain }
}

/**
 * A hangmotor. Az első hívás hozza létre, ezért felhasználói műveletből (kattintás,
 * billentyű) kell először hívni: a böngészők csak akkor engednek hangot.
 * Ahol nincs Web Audio (régi böngésző, teszt), ott null.
 */
export function getEngine(): Engine | null {
  if (engine) {
    if (engine.ctx.state === 'suspended') void engine.ctx.resume().catch(() => {})
    return engine
  }
  const Ctx = contextClass()
  if (!Ctx) return null
  try {
    engine = build(Ctx)
    if (engine.ctx.state === 'suspended') void engine.ctx.resume().catch(() => {})
    return engine
  } catch {
    return null
  }
}

/** A már létrehozott motor, létrehozás nélkül (pl. láthatóságváltáskor). */
export function currentEngine(): Engine | null {
  return engine
}

/** A MIDI hangmagasság frekvenciája (A4 = 69 = 440 Hz). */
export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12)
}
