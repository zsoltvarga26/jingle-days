import { BOWL_LABEL } from '../components/TreeScene/geometry'

/** A cica neve, amíg a játékos át nem nevezi. */
export const DEFAULT_CAT_NAME = 'Lajos'

/** Ennyi karakter fér el olvashatóan a tálka elején. */
export const CAT_NAME_MAX = 10

/** A tálkára írt név legnagyobb betűmérete, a jelenet egységeiben (130 × 120-as viewBox). */
const BOWL_FONT_MAX = 3.3
/** A Baloo 2 800-as súlyának átlagos betűszélessége, a betűméret arányában. */
const GLYPH_WIDTH = 0.56
/** A nagybetűk közepe a betűméret ennyiszeresével van az alapvonal fölött. */
const CAP_CENTER = 0.35

/**
 * Szabadon beírt névből tárolható név: vezérlőkarakterek nélkül, a szóközöket összevonva,
 * legfeljebb CAT_NAME_MAX karakterre vágva. Üres vagy nem szöveges bemenetre null.
 */
export function normalizeCatName(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  // Előbb a szóközszerű karakterek (tabulátor, sortörés) lesznek szóközzé, utána tűnik el
  // minden más vezérlő- és láthatatlan karakter.
  const cleaned = raw
    .replace(/\s+/g, ' ')
    .replace(/\p{C}/gu, '')
    .trim()
  if (cleaned === '') return null
  return Array.from(cleaned).slice(0, CAT_NAME_MAX).join('').trim()
}

/**
 * A név helye és betűmérete a tálka elején, a jelenet egységeiben. Rövid névnél a betűméret
 * állandó, hosszabbnál annyival kisebb, hogy a tálka szélességében elférjen. A `y` az alapvonal,
 * úgy számolva, hogy a betűk bármilyen méretnél a tálka közepén maradjanak.
 */
export function bowlLabel(name: string): { x: number; y: number; fontSize: number } {
  const length = Math.max(1, Array.from(name).length)
  const fontSize = Math.min(BOWL_FONT_MAX, BOWL_LABEL.width / (length * GLYPH_WIDTH))
  return { x: BOWL_LABEL.x, y: BOWL_LABEL.cy + fontSize * CAP_CENTER, fontSize }
}
