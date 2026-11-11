import type { L, Lang } from '../content/types'
import { en } from './en'
import { hu, type MessageKey } from './hu'

export type { MessageKey }
export type Params = Record<string, string | number>

/** A többes számú kulcspárok közös töve, pl. 'door.opensIn'. */
export type PluralKey = MessageKey extends infer K
  ? K extends `${infer Base}.one`
    ? Base
    : never
  : never

export const messages: Record<Lang, Record<MessageKey, string>> = { hu, en }

const pluralRules: Record<Lang, Intl.PluralRules> = {
  hu: new Intl.PluralRules('hu'),
  en: new Intl.PluralRules('en'),
}

function fill(template: string, params?: Params): string {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (whole, name: string) =>
    name in params ? String(params[name]) : whole,
  )
}

export function translate(lang: Lang, key: MessageKey, params?: Params): string {
  return fill(messages[lang][key], params)
}

/** Számtól függő alak; az `{n}` paraméter magától kitöltődik. */
export function translatePlural(lang: Lang, key: PluralKey, n: number, params?: Params): string {
  const form = pluralRules[lang].select(n) === 'one' ? 'one' : 'other'
  return fill(messages[lang][`${key}.${form}`], { n, ...params })
}

/** A napi tartalom kétnyelvű mezőiből az aktuális nyelvű szöveg. */
export function pickLang(lang: Lang, text: L): string {
  return text[lang]
}

/** A `?lang=en` paraméter értéke, ha érvényes. */
export function langFromUrl(search: string): Lang | null {
  const value = new URLSearchParams(search).get('lang')
  return value === 'hu' || value === 'en' ? value : null
}
