import { describe, expect, test } from 'vitest'
import { acceptedAnswers, normalize } from '../lib/normalize'
import { days } from './days'
import { LANGS, type L } from './types'

/**
 * Tartalomteszt (docs/03-tartalom-utmutato.md, „Amit a tartalomteszt ellenőriz”).
 * A válaszok normalizálására épülő ellenőrzések a 3. fázisban, a normalize()-zal együtt jönnek.
 */
const filled = (text: L) => LANGS.every((lang) => typeof text[lang] === 'string' && text[lang].trim() !== '')
const dd = (day: number) => String(day).padStart(2, '0')

describe('a 24 nap szerkezete', () => {
  test('pontosan 24 nap van, 1-től 24-ig, ismétlés nélkül', () => {
    expect(days.map((d) => d.day)).toEqual(Array.from({ length: 24 }, (_, i) => i + 1))
  })

  test('1–23. nap: 3 kérdés és 1 rejtvény; 24. nap: 5 kérdés és 2 rejtvény', () => {
    for (const day of days) {
      const last = day.day === 24
      expect(day.quiz, `${day.day}. nap kvíz`).toHaveLength(last ? 5 : 3)
      expect(day.emoji, `${day.day}. nap rejtvény`).toHaveLength(last ? 2 : 1)
    }
  })

  test('minden azonosító egyedi, és megfelel a saját napja mintájának', () => {
    const ids = new Set<string>()
    for (const day of days) {
      day.quiz.forEach((q, i) => {
        expect(q.id).toBe(`d${dd(day.day)}-q${i + 1}`)
        ids.add(q.id)
      })
      day.emoji.forEach((e, i) => {
        expect(e.id).toBe(`d${dd(day.day)}-e${i + 1}`)
        ids.add(e.id)
      })
      expect(day.ornament.id.startsWith(`d${dd(day.day)}-`), day.ornament.id).toBe(true)
      ids.add(day.ornament.id)
    }
    expect(ids.size).toBe(74 + 25 + 24)
  })
})

describe('kvízkérdések', () => {
  const questions = days.flatMap((d) => d.quiz)

  test('mindkét nyelven megvan a kérdés, a válaszok és a magyarázat', () => {
    for (const q of questions) {
      expect(filled(q.question), q.id).toBe(true)
      for (const option of q.options) expect(filled(option), q.id).toBe(true)
      if (q.explanation) expect(filled(q.explanation), q.id).toBe(true)
    }
  })

  test('3 vagy 4 válasz van, érvényes correctIndexszel', () => {
    for (const q of questions) {
      expect([3, 4], q.id).toContain(q.options.length)
      expect(Number.isInteger(q.correctIndex), q.id).toBe(true)
      expect(q.correctIndex, q.id).toBeGreaterThanOrEqual(0)
      expect(q.correctIndex, q.id).toBeLessThan(q.options.length)
    }
  })

  test('egy kérdésen belül nincs két azonos válasz egyik nyelven sem', () => {
    for (const q of questions) {
      for (const lang of LANGS) {
        const texts = q.options.map((o) => o[lang].trim().toLowerCase())
        expect(new Set(texts).size, `${q.id} (${lang})`).toBe(texts.length)
      }
    }
  })
})

describe('emoji-rejtvények', () => {
  const puzzles = days.flatMap((d) => d.emoji)

  test('van emojisor, mindkét nyelven legalább egy válasz és pontosan két kitöltött tipp', () => {
    for (const p of puzzles) {
      expect(p.emojis.trim(), p.id).not.toBe('')
      for (const lang of LANGS) {
        expect(p.answers[lang].length, `${p.id} (${lang})`).toBeGreaterThan(0)
        for (const answer of p.answers[lang]) expect(answer.trim(), p.id).not.toBe('')
      }
      expect(p.hints, p.id).toHaveLength(2)
      for (const hint of p.hints) expect(filled(hint), p.id).toBe(true)
    }
  })
})

describe('emoji-rejtvények válaszai (normalizálva)', () => {
  const puzzles = days.flatMap((d) => d.emoji.map((p) => ({ puzzle: p, draft: d.draft === true })))

  test('normalizálás után egyik elfogadott válasz sem üres', () => {
    for (const { puzzle } of puzzles) {
      for (const answer of [...puzzle.answers.hu, ...puzzle.answers.en]) {
        expect(normalize(answer), `${puzzle.id}: „${answer}”`).not.toBe('')
      }
    }
  })

  test('két különböző rejtvénynek nincs közös elfogadott válasza', () => {
    const owner = new Map<string, string>()
    for (const { puzzle } of puzzles) {
      for (const answer of acceptedAnswers(puzzle)) {
        expect(owner.get(answer) ?? puzzle.id, `„${answer}”`).toBe(puzzle.id)
        owner.set(answer, puzzle.id)
      }
    }
  })

  test('a megírt napok tippjei nem árulják el a megfejtést', () => {
    for (const { puzzle, draft } of puzzles) {
      if (draft) continue
      const answers = [...acceptedAnswers(puzzle)]
      for (const hint of puzzle.hints) {
        for (const lang of LANGS) {
          const text = normalize(hint[lang])
          for (const answer of answers) {
            expect(text.includes(answer), `${puzzle.id} (${lang}): „${hint[lang]}”`).toBe(false)
          }
        }
      }
    }
  })
})

describe('idézetek és díszek', () => {
  test('az idézet szövege, szerzője és forrása mindkét nyelven megvan', () => {
    for (const day of days) {
      expect(filled(day.quote.text), `${day.day}. nap`).toBe(true)
      if (day.quote.author) expect(filled(day.quote.author), `${day.day}. nap`).toBe(true)
      if (day.quote.source) expect(filled(day.quote.source), `${day.day}. nap`).toBe(true)
    }
  })

  test('a díszek neve megvan, a helyük a fa rajzán belül van, és nem fedik egymást', () => {
    const slots = new Set<string>()
    for (const { ornament } of days) {
      expect(filled(ornament.name), ornament.id).toBe(true)
      expect(ornament.slot.x, ornament.id).toBeGreaterThanOrEqual(0)
      expect(ornament.slot.x, ornament.id).toBeLessThanOrEqual(100)
      expect(ornament.slot.y, ornament.id).toBeGreaterThanOrEqual(0)
      expect(ornament.slot.y, ornament.id).toBeLessThanOrEqual(120)
      slots.add(`${ornament.slot.x},${ornament.slot.y}`)
    }
    expect(slots.size).toBe(24)
  })
})

describe('megírt és helykitöltő napok', () => {
  const drafts = days.filter((d) => d.draft).map((d) => d.day)

  test('a megírt napok szövegei nem lépik túl a hosszkorlátot', () => {
    for (const day of days.filter((d) => !d.draft)) {
      for (const lang of LANGS) {
        for (const q of day.quiz) {
          expect(q.question[lang].length, `${q.id} kérdés (${lang})`).toBeLessThanOrEqual(140)
          for (const o of q.options) expect(o[lang].length, `${q.id} válasz (${lang})`).toBeLessThanOrEqual(40)
        }
        expect(day.quote.text[lang].length, `${day.day}. nap idézet (${lang})`).toBeLessThanOrEqual(220)
      }
    }
  })

  // Élesítés előtt egyetlen helykitöltő nap sem maradhat: ekkor ez a teszt élesíthető.
  test.todo(`még ${drafts.length} nap helykitöltő tartalommal fut: ${drafts.join(', ')}`)
})
