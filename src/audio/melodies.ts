/**
 * Közkincs dallamok saját lejegyzésben, hangjegytömbként.
 * Felvétel nem kerül az oldalba: a hangokat a kód szintetizálja, így jogdíjkérdés nincs.
 *
 * Egy hang: [MIDI hangmagasság vagy null (szünet), hossz negyedekben].
 */
export type Note = readonly [pitch: number | null, beats: number]

/** A dallamok azonosítói; a címük a szótárakban van (`melody.<id>`). */
export type MelodyId = 'silent-night' | 'jingle-bells' | 'deck-the-halls' | 'o-tannenbaum'

export interface Melody {
  id: MelodyId
  /** Szerző és évszám, a közkincs státusz igazolására. */
  credit: string
  /** Negyed / perc. */
  tempo: number
  beatsPerBar: number
  /** Felütés hossza negyedekben (a dallam ennyivel az első ütem előtt indul). */
  pickup: number
  notes: readonly Note[]
}

// Hangmagasságok (MIDI).
const B3 = 59
const C4 = 60
const D4 = 62
const E4 = 64
const F4 = 65
const Fs4 = 66
const G4 = 67
const A4 = 69
const Bb4 = 70
const B4 = 71
const C5 = 72
const D5 = 74
const E5 = 76
const F5 = 77
const REST = null

/** Csendes éj – Franz Xaver Gruber, 1818. */
const silentNight: Melody = {
  id: 'silent-night',
  credit: 'Franz Xaver Gruber, 1818',
  tempo: 84,
  beatsPerBar: 3,
  pickup: 0,
  notes: [
    [G4, 1.5], [A4, 0.5], [G4, 1], [E4, 3],
    [G4, 1.5], [A4, 0.5], [G4, 1], [E4, 3],
    [D5, 2], [D5, 1], [B4, 3],
    [C5, 2], [C5, 1], [G4, 3],
    [A4, 2], [A4, 1], [C5, 1.5], [B4, 0.5], [A4, 1],
    [G4, 1.5], [A4, 0.5], [G4, 1], [E4, 3],
    [A4, 2], [A4, 1], [C5, 1.5], [B4, 0.5], [A4, 1],
    [G4, 1.5], [A4, 0.5], [G4, 1], [E4, 3],
    [D5, 2], [D5, 1], [F5, 1.5], [D5, 0.5], [B4, 1],
    [C5, 3], [E5, 3],
    [C5, 1], [G4, 1], [E4, 1], [G4, 1.5], [F4, 0.5], [D4, 1],
    [C4, 3], [REST, 3],
  ],
}

/** Jingle Bells (refrén) – James Lord Pierpont, 1857. */
const jingleBells: Melody = {
  id: 'jingle-bells',
  credit: 'James Lord Pierpont, 1857',
  tempo: 132,
  beatsPerBar: 4,
  pickup: 0,
  notes: [
    [E4, 1], [E4, 1], [E4, 2],
    [E4, 1], [E4, 1], [E4, 2],
    [E4, 1], [G4, 1], [C4, 1.5], [D4, 0.5],
    [E4, 4],
    [F4, 1], [F4, 1], [F4, 1.5], [F4, 0.5],
    [F4, 1], [E4, 1], [E4, 1], [E4, 0.5], [E4, 0.5],
    [E4, 1], [D4, 1], [D4, 1], [E4, 1],
    [D4, 2], [G4, 2],
    [E4, 1], [E4, 1], [E4, 2],
    [E4, 1], [E4, 1], [E4, 2],
    [E4, 1], [G4, 1], [C4, 1.5], [D4, 0.5],
    [E4, 4],
    [F4, 1], [F4, 1], [F4, 1.5], [F4, 0.5],
    [F4, 1], [E4, 1], [E4, 1], [E4, 0.5], [E4, 0.5],
    [G4, 1], [G4, 1], [F4, 1], [D4, 1],
    [C4, 4],
  ],
}

/** Deck the Halls – walesi népdal (Nos Galan), 16. század. */
const deckLine: readonly Note[] = [
  [G4, 1.5], [F4, 0.5], [E4, 1], [D4, 1],
  [C4, 1], [D4, 1], [E4, 1], [C4, 1],
  [D4, 0.5], [E4, 0.5], [F4, 0.5], [D4, 0.5], [E4, 1.5], [D4, 0.5],
  [C4, 1], [B3, 1], [C4, 2],
]

const deckTheHalls: Melody = {
  id: 'deck-the-halls',
  credit: 'walesi népdal, 16. század',
  tempo: 120,
  beatsPerBar: 4,
  pickup: 0,
  notes: [
    ...deckLine,
    ...deckLine,
    [D4, 1.5], [E4, 0.5], [F4, 1], [D4, 1],
    [E4, 1.5], [F4, 0.5], [G4, 1], [D4, 1],
    [E4, 0.5], [Fs4, 0.5], [G4, 1], [A4, 0.5], [B4, 0.5], [C5, 1],
    [B4, 1], [A4, 1], [G4, 2],
    [G4, 1.5], [F4, 0.5], [E4, 1], [D4, 1],
    [C4, 1], [D4, 1], [E4, 1], [C4, 1],
    [A4, 0.5], [A4, 0.5], [A4, 0.5], [A4, 0.5], [G4, 1.5], [F4, 0.5],
    [E4, 1], [D4, 1], [C4, 2],
  ],
}

/** O Tannenbaum – német népdal, a mai dallam a 18. századból. */
const tannenbaumBars: readonly Note[] = [
  [F4, 0.75], [F4, 0.25], [F4, 1], [G4, 1],
  [A4, 0.75], [A4, 0.25], [A4, 1.5], [A4, 0.5],
  [G4, 0.5], [A4, 0.5], [Bb4, 1], [E4, 1],
]

const oTannenbaum: Melody = {
  id: 'o-tannenbaum',
  credit: 'német népdal, 18. század',
  tempo: 100,
  beatsPerBar: 3,
  pickup: 1,
  notes: [
    [C4, 1],
    ...tannenbaumBars,
    [G4, 1], [F4, 1], [C4, 1],
    ...tannenbaumBars,
    [G4, 1], [F4, 1], [REST, 0.5], [C5, 0.5],
    [C5, 0.5], [A4, 0.5], [D5, 1.5], [C5, 0.5],
    [C5, 0.5], [Bb4, 0.5], [Bb4, 1.5], [Bb4, 0.5],
    [Bb4, 0.5], [G4, 0.5], [C5, 1.5], [Bb4, 0.5],
    [Bb4, 0.5], [A4, 0.5], [A4, 1], [C4, 1],
    ...tannenbaumBars,
    [G4, 1], [F4, 1], [REST, 1],
  ],
}

/** A háttérzene dallamai lejátszási sorrendben. */
export const melodies: readonly Melody[] = [silentNight, jingleBells, deckTheHalls, oTannenbaum]
