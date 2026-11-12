import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { melodies } from './melodies'

/**
 * A jsdomban nincs Web Audio, ezért a hangzást nem lehet itt ellenőrizni – azt fülre kell.
 * Ami tesztelhető: a dallamok adatai, a sorrend, az ütemezés és az, hogy hang nélkül sincs hiba.
 */
describe('dallamok', () => {
  test('négy dallam van, mindegyik hangjai érvényesek', () => {
    expect(melodies.map((m) => m.id)).toEqual([
      'silent-night',
      'jingle-bells',
      'deck-the-halls',
      'o-tannenbaum',
    ])
    for (const melody of melodies) {
      expect(melody.tempo, melody.id).toBeGreaterThan(40)
      expect(melody.notes.length, melody.id).toBeGreaterThan(20)
      for (const [pitch, beats] of melody.notes) {
        expect(beats, melody.id).toBeGreaterThan(0)
        if (pitch !== null) {
          expect(Number.isInteger(pitch), melody.id).toBe(true)
          // B3 és F5 között: egy oktávval feljebb játszva is kellemes tartomány.
          expect(pitch, melody.id).toBeGreaterThanOrEqual(59)
          expect(pitch, melody.id).toBeLessThanOrEqual(77)
        }
      }
    }
  })

  test('a hangok hossza pontosan kiadja az ütemeket (a felütés után)', () => {
    for (const melody of melodies) {
      const total = melody.notes.reduce((sum, [, beats]) => sum + beats, 0)
      const bars = (total - melody.pickup) / melody.beatsPerBar
      expect(Number.isInteger(bars), `${melody.id}: ${total} negyed`).toBe(true)
    }
  })

  test('ütemhatáron nem lóg át hang (kivéve az egész ütemnél hosszabbakat)', () => {
    for (const melody of melodies) {
      let position = -melody.pickup
      for (const [, beats] of melody.notes) {
        const start = ((position % melody.beatsPerBar) + melody.beatsPerBar) % melody.beatsPerBar
        expect(start + beats, `${melody.id} @ ${position}`).toBeLessThanOrEqual(
          Math.max(melody.beatsPerBar, Math.ceil(beats / melody.beatsPerBar) * melody.beatsPerBar),
        )
        position += beats
      }
    }
  })
})

describe('lejátszási sorrend', () => {
  test('a dallamok egymás után jönnek, szünettel, és a végén elölről kezdődnek', async () => {
    const { advance } = await import('./music')
    let cursor = { melody: 0, note: 0 }
    const order: number[] = []
    let gaps = 0
    const totalNotes = melodies.reduce((sum, m) => sum + m.notes.length, 0)

    for (let i = 0; i < totalNotes; i++) {
      const { note, next } = advance(cursor)
      if (cursor.note === 0) order.push(cursor.melody)
      if (note.gapAfter > 0) gaps++
      expect(note.seconds).toBeGreaterThan(0)
      cursor = next
    }
    expect(order).toEqual([0, 1, 2, 3])
    expect(gaps).toBe(4)
    expect(cursor).toEqual({ melody: 0, note: 0 })
  })

  test('a hang hossza a tempóból jön', async () => {
    const { advance } = await import('./music')
    const first = melodies[0]
    const { note } = advance({ melody: 0, note: 0 })
    expect(note.seconds).toBeCloseTo((first.notes[0][1] * 60) / first.tempo)
    expect(note.pitch).toBe(first.notes[0][0])
  })
})

describe('Web Audio nélkül', () => {
  test('az effektek és a zene csendben nem csinálnak semmit', async () => {
    vi.resetModules()
    const { playSfx } = await import('./sfx')
    const { startMusic, stopMusic, setMusicVolume, isMusicPlaying } = await import('./music')
    expect(() => {
      playSfx('door')
      playSfx('locked')
      playSfx('wrong')
      playSfx('sparkle')
      setMusicVolume(0.5)
      startMusic()
      stopMusic()
    }).not.toThrow()
    expect(isMusicPlaying()).toBe(false)
  })
})

describe('ütemezés (ál-AudioContexttel)', () => {
  /** Csak annyit tud, amennyit a kód hív; a hangokat megszámolja. */
  class FakeParam {
    value = 0
    setValueAtTime() {}
    exponentialRampToValueAtTime() {}
    linearRampToValueAtTime() {}
    setTargetAtTime(level: number) {
      this.value = level
    }
    cancelScheduledValues() {}
  }
  class FakeNode {
    gain = new FakeParam()
    frequency = new FakeParam()
    Q = new FakeParam()
    type = ''
    buffer: unknown = null
    connect() {}
  }
  let started: number[] = []
  let noiseStarted = 0
  class FakeOscillator extends FakeNode {
    start(time: number) {
      started.push(time)
    }
    stop() {}
  }
  class FakeContext {
    static now = 0
    state = 'running'
    sampleRate = 8000
    destination = new FakeNode()
    get currentTime() {
      return FakeContext.now
    }
    createGain = () => new FakeNode()
    createConvolver = () => new FakeNode()
    createBiquadFilter = () => new FakeNode()
    createOscillator = () => new FakeOscillator()
    createBufferSource = () => {
      const source = new FakeNode() as FakeNode & { start: () => void; stop: () => void }
      source.start = () => {
        noiseStarted++
      }
      source.stop = () => {}
      return source
    }
    createBuffer = (_channels: number, length: number) => ({
      getChannelData: () => new Float32Array(length),
    })
    resume = () => Promise.resolve()
  }

  beforeEach(() => {
    vi.resetModules()
    vi.useFakeTimers()
    started = []
    noiseStarted = 0
    FakeContext.now = 0
    vi.stubGlobal('AudioContext', FakeContext)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  test('egy effekt hangokat indít a hangmotoron', async () => {
    const { playSfx } = await import('./sfx')
    playSfx('success')
    // Két csengőhang, egyenként négy felhanggal.
    expect(started).toHaveLength(8)
  })

  test('az ajtónyitás és a zárolt ajtó zajt is használ, a hibás válasz két lefelé lépő hang', async () => {
    const { playSfx } = await import('./sfx')
    playSfx('door')
    expect(noiseStarted).toBe(1)
    expect(started).toHaveLength(2)

    playSfx('locked')
    expect(noiseStarted).toBe(3)
    expect(started).toHaveLength(4)

    started = []
    playSfx('wrong')
    expect(started).toHaveLength(3)
    // A második hang később indul, mint az első.
    expect(Math.max(...started)).toBeGreaterThan(Math.min(...started))
  })

  test('a dallamváltó a következő dallam elejére ugrik, körbe, és értesíti a figyelőket', async () => {
    const { startMusic, stopMusic, nextMelody, getMelodyId, subscribeMelody } = await import('./music')
    const seen: string[] = []
    const unsubscribe = subscribeMelody(() => seen.push(getMelodyId()))

    expect(getMelodyId()).toBe('silent-night')
    startMusic()
    nextMelody()
    expect(getMelodyId()).toBe('jingle-bells')

    // A váltás után az új dallam hangjai szólnak tovább.
    started = []
    for (let i = 0; i < 20; i++) {
      FakeContext.now += 0.025
      vi.advanceTimersByTime(25)
    }
    expect(started.length).toBeGreaterThanOrEqual(2)

    nextMelody()
    nextMelody()
    nextMelody()
    expect(getMelodyId()).toBe('silent-night')
    expect(seen).toEqual(['jingle-bells', 'deck-the-halls', 'o-tannenbaum', 'silent-night'])

    unsubscribe()
    stopMusic()
  })

  test('a zene csak a következő 100 ms hangjait ütemezi előre, és megállítható', async () => {
    const { startMusic, stopMusic, isMusicPlaying } = await import('./music')
    startMusic()
    expect(isMusicPlaying()).toBe(true)
    // Az első hang (két oszcillátor) már be van ütemezve, a többi még nem.
    expect(started).toHaveLength(2)
    expect(started[0]).toBeGreaterThan(0)

    // 10 másodperc múlva több hang szólt, de mind a „most” közelében lett ütemezve.
    for (let i = 0; i < 400; i++) {
      FakeContext.now += 0.025
      vi.advanceTimersByTime(25)
    }
    const afterTen = started.length
    expect(afterTen).toBeGreaterThan(10)
    expect(Math.max(...started)).toBeLessThan(FakeContext.now + 3)

    stopMusic()
    expect(isMusicPlaying()).toBe(false)
    FakeContext.now += 5
    vi.advanceTimersByTime(5000)
    expect(started).toHaveLength(afterTen)
  })

  test('megállítás után a zene onnan folytatódik, ahol abbamaradt', async () => {
    const { startMusic, stopMusic } = await import('./music')
    startMusic()
    for (let i = 0; i < 80; i++) {
      FakeContext.now += 0.025
      vi.advanceTimersByTime(25)
    }
    stopMusic()
    const before = started.length
    FakeContext.now += 60
    startMusic()
    // Az újraindítás egyetlen új hangot ütemez (a következőt), nem kezdi elölről a sort.
    expect(started.length - before).toBe(2)
    expect(started[started.length - 1]).toBeGreaterThan(60)
    stopMusic()
  })
})
