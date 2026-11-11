import { createContext, useContext } from 'react'
import type { L, Lang } from '../content/types'
import type { MessageKey, Params, PluralKey } from './messages'

export interface I18nContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  /** Felületi szöveg a szótárból. */
  t: (key: MessageKey, params?: Params) => string
  /** Számtól függő alak (`.one` / `.other`). */
  tn: (key: PluralKey, n: number, params?: Params) => string
  /** A napi tartalom kétnyelvű mezőjéből az aktuális nyelv. */
  pick: (text: L) => string
}

export const I18nCtx = createContext<I18nContextValue | null>(null)

export function useI18n(): I18nContextValue {
  const value = useContext(I18nCtx)
  if (!value) throw new Error('A useI18n csak az I18nProvider alatt használható.')
  return value
}
