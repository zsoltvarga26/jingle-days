import { describe, expect, test } from 'vitest'
import { en } from './en'
import { hu } from './hu'
import { langFromUrl, pickLang, translate, translatePlural } from './messages'

const placeholders = (text: string) => (text.match(/\{\w+\}/g) ?? []).sort()

describe('szótárak', () => {
  test('a két szótár kulcsai megegyeznek', () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(hu).sort())
  })

  test('nincs üres szöveg', () => {
    for (const [key, value] of [...Object.entries(hu), ...Object.entries(en)]) {
      expect(value.trim(), key).not.toBe('')
    }
  })

  test('a paraméterek mindkét nyelven ugyanazok', () => {
    for (const key of Object.keys(hu) as (keyof typeof hu)[]) {
      expect(placeholders(en[key]), key).toEqual(placeholders(hu[key]))
    }
  })

  test('minden .one kulcsnak van .other párja', () => {
    for (const key of Object.keys(hu)) {
      if (key.endsWith('.one')) expect(hu).toHaveProperty([key.replace(/\.one$/, '.other')])
    }
  })
})

describe('fordítás', () => {
  test('kitölti a paramétereket', () => {
    expect(translate('hu', 'door.label', { n: 7 })).toBe('7. ablak')
    expect(translate('en', 'door.label', { n: 7 })).toBe('Door 7')
  })

  test('az angol többes szám a számtól függ', () => {
    expect(translatePlural('en', 'door.opensIn', 1)).toBe('Opens in 1 day')
    expect(translatePlural('en', 'door.opensIn', 5)).toBe('Opens in 5 days')
    expect(translatePlural('hu', 'door.opensIn', 5)).toBe('5 nap múlva nyílik')
  })

  test('a kezdő felirat fix dátumot és a hátralévő napokat írja', () => {
    expect(translatePlural('hu', 'banner.opens', 20)).toBe(
      'Az első ablak december 1-jén nyílik – még 20 nap!',
    )
    expect(translatePlural('en', 'banner.opens', 20)).toBe(
      'The first door opens on December 1 – 20 days to go!',
    )
  })

  test('pickLang a kétnyelvű mezőből választ', () => {
    expect(pickLang('en', { hu: 'Jégvarázs', en: 'Frozen' })).toBe('Frozen')
  })

  test('langFromUrl csak érvényes nyelvet fogad el', () => {
    expect(langFromUrl('?lang=en')).toBe('en')
    expect(langFromUrl('?date=2026-12-10&lang=hu')).toBe('hu')
    expect(langFromUrl('?lang=de')).toBeNull()
    expect(langFromUrl('')).toBeNull()
  })
})
