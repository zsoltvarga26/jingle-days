import type { EmojiPuzzle } from '../content/types'

const LEADING_ARTICLE = /^(?:a|az|the)\s+(?=\S)/

/**
 * Válasz egységesítése összehasonlítás előtt: kisbetűsítés, ékezetek és írásjelek törlése,
 * a kezdő névelő (a, az, the) elhagyása, végül a szóközök törlése.
 *
 * Így a „JÉGVARÁZS!”, a „ jegvarazs ” és a „Jég varázs” ugyanazt adja, mint a „Jégvarázs”.
 * A szóközök törlése az egybe- és különírt alakokat is egyformán kezeli.
 */
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{M}/gu, '') // ékezetek (diakritikus jelek)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ') // írásjelek, emojik
    .replace(/\s+/g, ' ')
    .trim()
    .replace(LEADING_ARTICLE, '')
    .replace(/\s/g, '')
}

/** Egy rejtvény összes elfogadott válasza normalizálva, mindkét nyelvről. */
export function acceptedAnswers(puzzle: EmojiPuzzle): Set<string> {
  const all = [...puzzle.answers.hu, ...puzzle.answers.en].map(normalize)
  return new Set(all.filter((answer) => answer !== ''))
}

/**
 * Helyes-e a tipp. Mindkét nyelv válaszai érvényesek, így egy magyar játékos
 * az angol címmel („Frozen”) is nyer. Az üres tipp semmivel sem egyezik.
 */
export function isCorrectGuess(guess: string, puzzle: EmojiPuzzle): boolean {
  const normalized = normalize(guess)
  return normalized !== '' && acceptedAnswers(puzzle).has(normalized)
}
