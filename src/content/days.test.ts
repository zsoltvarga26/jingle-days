import { describe, expect, test } from 'vitest'
import { acceptedAnswers, normalize } from '../lib/normalize'
import { days } from './days'
import { LANGS, type L } from './types'

/**
 * Tartalomteszt (docs/03-tartalom-utmutato.md, „Amit a tartalomteszt ellenőriz”).
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
  const puzzles = days.flatMap((d) => d.emoji.map((p) => ({ puzzle: p })))

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

  test('a tippek nem árulják el a megfejtést', () => {
    for (const { puzzle } of puzzles) {
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

describe('hosszkorlátok', () => {
  test('a kérdések, a válaszok és az idézetek kiférnek mobilon', () => {
    for (const day of days) {
      for (const lang of LANGS) {
        for (const q of day.quiz) {
          expect(q.question[lang].length, `${q.id} kérdés (${lang})`).toBeLessThanOrEqual(140)
          for (const o of q.options) {
            expect(o[lang].length, `${q.id} válasz (${lang}): ${o[lang]}`).toBeLessThanOrEqual(40)
          }
        }
        expect(day.quote.text[lang].length, `${day.day}. nap idézet (${lang})`).toBeLessThanOrEqual(220)
      }
    }
  })
})

describe('elosztás (docs/03-tartalom-utmutato.md)', () => {
  const questions = days.flatMap((d) => d.quiz)
  const puzzles = days.flatMap((d) => d.emoji)
  const count = <T,>(items: readonly T[]) => {
    const totals = new Map<T, number>()
    for (const item of items) totals.set(item, (totals.get(item) ?? 0) + 1)
    return totals
  }

  test('az öt kvízkategória nagyjából egyenletesen oszlik el a 74 kérdés között', () => {
    const totals = count(questions.map((q) => q.category))
    expect([...totals.keys()].sort()).toEqual(['erdekesseg', 'etel', 'film', 'hagyomany', 'zene'])
    for (const [category, total] of totals) {
      expect(total, category).toBeGreaterThanOrEqual(13)
      expect(total, category).toBeLessThanOrEqual(16)
    }
  })

  test('egy napon belül minden kérdés más kategóriából jön', () => {
    for (const day of days) {
      const categories = day.quiz.map((q) => q.category)
      expect(new Set(categories).size, `${day.day}. nap`).toBe(categories.length)
    }
  })

  test('a három rejtvényfajta nagyjából egyenletesen oszlik el a 25 rejtvény között', () => {
    const totals = count(puzzles.map((p) => p.kind))
    for (const kind of ['szo', 'film', 'dal'] as const) {
      expect(totals.get(kind) ?? 0, kind).toBeGreaterThanOrEqual(7)
      expect(totals.get(kind) ?? 0, kind).toBeLessThanOrEqual(10)
    }
  })

  test('a 24. nap két rejtvénye két különböző fajta', () => {
    const [first, second] = days[23].emoji
    expect(first.kind).not.toBe(second.kind)
  })

  test('a helyes válasz egyik kérdésnél sem a leghosszabb mindkét nyelven', () => {
    // A „ne a leghosszabb legyen a helyes” szabály: ha mindkét nyelven az, az feltűnő.
    const tells = questions.filter((q) =>
      LANGS.every((lang) => {
        const lengths = q.options.map((o) => o[lang].length)
        const correct = lengths[q.correctIndex]
        return lengths.every((length, index) => index === q.correctIndex || length < correct - 8)
      }),
    )
    expect(tells.map((q) => q.id)).toEqual([])
  })

  test('egy rejtvény megfejtése nem szerepel ugyanannak a napnak a kvízében', () => {
    for (const day of days) {
      for (const lang of LANGS) {
        const quizText = normalize(
          day.quiz
            .flatMap((q) => [q.question[lang], ...q.options.map((o) => o[lang]), q.explanation?.[lang] ?? ''])
            .join(' '),
        )
        for (const p of day.emoji) {
          for (const answer of p.answers[lang].map(normalize)) {
            // A nagyon rövid alakok (pl. „elf”, „szán”) véletlenül is előfordulhatnak szavak belsejében.
            if (answer.length < 6) continue
            expect(quizText.includes(answer), `${p.id} (${lang}): „${answer}”`).toBe(false)
          }
        }
      }
    }
  })
})
