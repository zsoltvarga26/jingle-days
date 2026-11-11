export type Lang = 'hu' | 'en'

/** Minden megjelenő tartalmi szöveg mindkét nyelven. */
export type L = Record<Lang, string>

export const LANGS: readonly Lang[] = ['hu', 'en']

export function isLang(value: unknown): value is Lang {
  return value === 'hu' || value === 'en'
}
