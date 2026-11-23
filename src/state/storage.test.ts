import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { emptySave, progressReducer, type SaveData } from './progress'
import {
  loadSave,
  loadSettings,
  parseSave,
  SAVE_KEY,
  saveSave,
  saveSettings,
  SETTINGS_KEY,
} from './storage'

function sampleSave(): SaveData {
  return [
    { type: 'OPEN_DAY' as const, day: 1, quizCount: 3, puzzleCount: 1, at: '2026-12-01T08:00:00.000Z' },
    { type: 'ANSWER_QUESTION' as const, day: 1, question: 0, choice: 2 },
    { type: 'REVEAL_HINT' as const, day: 1, puzzle: 0 },
    { type: 'OPEN_DAY' as const, day: 24, quizCount: 5, puzzleCount: 2, at: '2026-12-24T08:00:00.000Z' },
  ].reduce(progressReducer, emptySave())
}

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('mentés', () => {
  test('oda-vissza alakítva ugyanazt adja', () => {
    const data = sampleSave()
    saveSave(data)
    expect(loadSave()).toEqual(data)
  })

  test('üres tárolóból üres mentés jön', () => {
    expect(loadSave()).toEqual(emptySave())
  })

  test('hibás JSON-ra üres mentés', () => {
    window.localStorage.setItem(SAVE_KEY, '{"version":1,"days":')
    expect(loadSave()).toEqual(emptySave())
  })

  test('ismeretlen verzióra üres mentés', () => {
    expect(parseSave(JSON.stringify({ version: 2, days: {} }))).toEqual(emptySave())
    expect(parseSave(JSON.stringify({ days: {} }))).toEqual(emptySave())
  })

  test('hiányzó vagy rossz típusú mezőre üres mentés', () => {
    const broken = JSON.parse(JSON.stringify(sampleSave()))
    delete broken.days[1].quiz
    expect(parseSave(JSON.stringify(broken))).toEqual(emptySave())

    const wrongStatus = JSON.parse(JSON.stringify(sampleSave()))
    wrongStatus.days[1].emoji[0].status = 'solved'
    expect(parseSave(JSON.stringify(wrongStatus))).toEqual(emptySave())

    expect(parseSave(JSON.stringify({ version: 1, days: { 25: sampleSave().days[1] } }))).toEqual(emptySave())
    expect(parseSave('[]')).toEqual(emptySave())
    expect(parseSave('null')).toEqual(emptySave())
    expect(parseSave('"szöveg"')).toEqual(emptySave())
  })

  test('nem ír, ha a tartalom nem változott', () => {
    const data = sampleSave()
    expect(saveSave(data)).toBe(true)
    const spy = vi.spyOn(Storage.prototype, 'setItem')
    expect(saveSave(data)).toBe(false)
    expect(saveSave(JSON.parse(JSON.stringify(data)))).toBe(false)
    expect(spy).not.toHaveBeenCalled()
  })

  test('dobó localStorage mellett sem omlik össze', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    expect(loadSave()).toEqual(emptySave())
    expect(saveSave(sampleSave())).toBe(false)
    expect(loadSettings().sfx).toBe(true)
    expect(saveSettings(loadSettings())).toBe(false)
  })
})

describe('beállítások', () => {
  test('alapértékek: effektek be, zene ki, 0,3 hangerő', () => {
    expect(loadSettings()).toMatchObject({
      theme: 'auto',
      sfx: true,
      music: false,
      musicVolume: 0.3,
      catName: 'Lajos',
    })
  })

  test('a kezdő nyelv a böngésző nyelvéből jön', () => {
    vi.spyOn(window.navigator, 'language', 'get').mockReturnValue('hu-HU')
    expect(loadSettings().lang).toBe('hu')
    vi.spyOn(window.navigator, 'language', 'get').mockReturnValue('de-DE')
    expect(loadSettings().lang).toBe('en')
  })

  test('a mentett beállítás visszatöltődik', () => {
    const saved = {
      lang: 'en',
      theme: 'dark',
      sfx: false,
      music: true,
      musicVolume: 0.8,
      catName: 'Cirmi',
    } as const
    saveSettings(saved)
    expect(loadSettings()).toEqual(saved)
  })

  test('a hibás mezők alapértéket kapnak, a jók megmaradnak', () => {
    vi.spyOn(window.navigator, 'language', 'get').mockReturnValue('hu')
    window.localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({
        lang: 'fr',
        theme: 'lila',
        sfx: 'igen',
        music: true,
        musicVolume: 7,
        catName: '   ',
      }),
    )
    expect(loadSettings()).toEqual({
      lang: 'hu',
      theme: 'auto',
      sfx: true,
      music: true,
      musicVolume: 1,
      catName: 'Lajos',
    })

    // A túl hosszú nevet levágja, a szóközöket rendbe teszi.
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify({ catName: '  Bolyhos   Pamacs ' }))
    expect(loadSettings().catName).toBe('Bolyhos Pa')

    window.localStorage.setItem(SETTINGS_KEY, 'nem json')
    expect(loadSettings().lang).toBe('hu')
  })

  test('a téma és név nélküli régi beállítás betölt: a téma a rendszert követi, a cica Lajos', () => {
    window.localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({ lang: 'en', sfx: false, music: true, musicVolume: 0.5 }),
    )
    expect(loadSettings()).toEqual({
      lang: 'en',
      theme: 'auto',
      sfx: false,
      music: true,
      musicVolume: 0.5,
      catName: 'Lajos',
    })
  })

  test('az előrehaladás és a beállítások külön kulcson élnek', () => {
    saveSettings({
      lang: 'en',
      theme: 'auto',
      sfx: false,
      music: false,
      musicVolume: 0.3,
      catName: 'Cirmi',
    })
    saveSave(sampleSave())
    window.localStorage.removeItem(SAVE_KEY)
    expect(loadSettings()).toMatchObject({ lang: 'en', catName: 'Cirmi' })
    expect(loadSave()).toEqual(emptySave())
  })
})
