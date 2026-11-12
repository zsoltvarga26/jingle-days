import { useSyncExternalStore } from 'react'
import type { MelodyId } from './melodies'
import { getMelodyId, subscribeMelody } from './music'

/** Az éppen szóló háttérdallam azonosítója; dallamváltáskor frissül. */
export function useMelody(): MelodyId {
  return useSyncExternalStore(subscribeMelody, getMelodyId, getMelodyId)
}
