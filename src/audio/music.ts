import { currentEngine, getEngine, midiToFrequency, type Engine } from './engine'
import { melodies, type Melody, type MelodyId } from './melodies'

/**
 * Háttérzene: a dallamok egymás után, rövid szünettel ismétlődnek.
 *
 * Az ütemező a bevált „lookahead” mintát követi: 25 ms-onként előre beütemezi a következő
 * 100 ms hangjait az AudioContext saját óráján, így a ritmus akkor is pontos, ha a főszál
 * éppen animációval van elfoglalva.
 */
const TICK_MS = 25
const LOOKAHEAD_S = 0.1
/** Szünet két dallam között. */
const GAP_S = 1.8
/** A dallamok egy oktávval feljebb szólnak, „zenedoboz” hangzással. */
const TRANSPOSE = 12
const FADE_S = 0.35
/** A 0–1 közötti hangerő-beállítás ekkora tényleges szintet jelent a legnagyobb értéknél. */
const MAX_LEVEL = 0.55

/** A következő lejátszandó hang: honnan folytatódik a zene. */
export interface Cursor {
  melody: number
  note: number
}

export interface ScheduledNote {
  /** MIDI hangmagasság, vagy null szünetnél. */
  pitch: number | null
  /** A hang hossza másodpercben. */
  seconds: number
  /** Szünet a hang után (dallamváltáskor). */
  gapAfter: number
}

/** A kurzornál lévő hang, és a következő kurzor. A dallamok a végtelenségig ismétlődnek. */
export function advance(
  cursor: Cursor,
  list: readonly Melody[] = melodies,
): { note: ScheduledNote; next: Cursor } {
  const melody = list[cursor.melody]
  const [pitch, beats] = melody.notes[cursor.note]
  const last = cursor.note === melody.notes.length - 1
  return {
    note: { pitch, seconds: (beats * 60) / melody.tempo, gapAfter: last ? GAP_S : 0 },
    next: last
      ? { melody: (cursor.melody + 1) % list.length, note: 0 }
      : { melody: cursor.melody, note: cursor.note + 1 },
  }
}

let cursor: Cursor = { melody: 0, note: 0 }
let nextTime = 0
let timer: number | undefined
let volume = 0.3

/** Az éppen szóló (vagy indításkor elsőként megszólaló) dallam, és akik figyelik a változását. */
let currentMelody = 0
const listeners = new Set<() => void>()

function setCurrentMelody(index: number) {
  if (index === currentMelody) return
  currentMelody = index
  listeners.forEach((listener) => listener())
}

/** Feliratkozás a dallamváltásra (a useSyncExternalStore-hoz). */
export function subscribeMelody(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getMelodyId(): MelodyId {
  return melodies[currentMelody].id
}

/** Egy hang: puha háromszög-hullám egy halk felső oktávval, gyors megütéssel és hosszú lecsengéssel. */
function voice(engine: Engine, pitch: number, start: number, seconds: number) {
  const { ctx, music } = engine
  const frequency = midiToFrequency(pitch + TRANSPOSE)
  const ring = Math.max(seconds * 1.5, 0.7)

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(0.5, start + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + ring)
  gain.connect(music)

  const body = ctx.createOscillator()
  body.type = 'triangle'
  body.frequency.value = frequency
  body.connect(gain)

  const shimmer = ctx.createOscillator()
  shimmer.type = 'sine'
  shimmer.frequency.value = frequency * 2
  const shimmerGain = ctx.createGain()
  shimmerGain.gain.value = 0.22
  shimmer.connect(shimmerGain)
  shimmerGain.connect(gain)

  for (const osc of [body, shimmer]) {
    osc.start(start)
    osc.stop(start + ring + 0.05)
  }
}

function schedule(engine: Engine) {
  while (nextTime < engine.ctx.currentTime + LOOKAHEAD_S) {
    if (cursor.note === 0) setCurrentMelody(cursor.melody)
    const { note, next } = advance(cursor)
    if (note.pitch !== null) voice(engine, note.pitch, nextTime, note.seconds)
    nextTime += note.seconds + note.gapAfter
    cursor = next
  }
}

function fadeTo(engine: Engine, level: number) {
  const { ctx, musicGain } = engine
  musicGain.gain.cancelScheduledValues(ctx.currentTime)
  musicGain.gain.setTargetAtTime(level, ctx.currentTime, FADE_S / 3)
}

export function isMusicPlaying(): boolean {
  return timer !== undefined
}

/**
 * Elindítja (vagy folytatja) a zenét onnan, ahol abbamaradt.
 * Felhasználói műveletből kell hívni, különben a böngésző nem enged hangot.
 */
export function startMusic(): void {
  const engine = getEngine()
  if (!engine || timer !== undefined) return
  // Az első hang az előretekintési ablakon belülre esik, így azonnal beütemeződik.
  nextTime = engine.ctx.currentTime + LOOKAHEAD_S / 2
  fadeTo(engine, volume * MAX_LEVEL)
  schedule(engine)
  timer = window.setInterval(() => schedule(engine), TICK_MS)
}

/** Elhalkítja és megállítja a zenét; a következő indítás ugyanonnan folytatja. */
export function stopMusic(): void {
  if (timer === undefined) return
  window.clearInterval(timer)
  timer = undefined
  const engine = currentEngine()
  if (engine) fadeTo(engine, 0)
}

/**
 * A következő dallamra vált, az elejéről. Ha a zene szól, az éppen kicsengő hangok
 * egy pillanatra elhalkulnak, hogy a két dallam ne mosódjon össze.
 */
export function nextMelody(): void {
  const index = (currentMelody + 1) % melodies.length
  cursor = { melody: index, note: 0 }
  setCurrentMelody(index)

  const engine = currentEngine()
  if (!engine || timer === undefined) return
  const { ctx, musicGain } = engine
  nextTime = ctx.currentTime + 0.3
  musicGain.gain.cancelScheduledValues(ctx.currentTime)
  musicGain.gain.setTargetAtTime(0, ctx.currentTime, 0.04)
  musicGain.gain.setTargetAtTime(volume * MAX_LEVEL, ctx.currentTime + 0.25, 0.05)
}

/** A zene hangereje, 0–1. */
export function setMusicVolume(value: number): void {
  volume = Math.min(1, Math.max(0, value))
  const engine = currentEngine()
  if (engine && timer !== undefined) fadeTo(engine, volume * MAX_LEVEL)
}
