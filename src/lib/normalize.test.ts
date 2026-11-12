import { describe, expect, test } from 'vitest'
import type { EmojiPuzzle } from '../content/types'
import { acceptedAnswers, isCorrectGuess, normalize } from './normalize'

const frozen: EmojiPuzzle = {
  id: 'd01-e1',
  emojis: '❄️👸⛄',
  kind: 'film',
  answers: { hu: ['Jégvarázs'], en: ['Frozen'] },
  hints: [
    { hu: 'a', en: 'a' },
    { hu: 'b', en: 'b' },
  ],
}

const grinch: EmojiPuzzle = {
  ...frozen,
  id: 'd24-e1',
  answers: { hu: ['A Grincs'], en: ['The Grinch', 'How the Grinch Stole Christmas'] },
}

describe('normalize', () => {
  test('kis- és nagybetű, ékezet, írásjel, szóköz', () => {
    expect(normalize('JÉGVARÁZS!')).toBe('jegvarazs')
    expect(normalize('  jegvarazs  ')).toBe('jegvarazs')
    expect(normalize('Jégvarázs')).toBe('jegvarazs')
    expect(normalize('Reszkessetek, betörők!')).toBe('reszkessetekbetorok')
    expect(normalize('árvíztűrő tükörfúrógép')).toBe('arvizturotukorfurogep')
  })

  test('a kezdő névelő elmarad (a, az, the)', () => {
    expect(normalize('A Grincs')).toBe('grincs')
    expect(normalize('The Grinch')).toBe('grinch')
    expect(normalize('Az ajándék')).toBe('ajandek')
    expect(normalize('a  grincs')).toBe('grincs')
  })

  test('csak a kezdő, önálló névelő marad el', () => {
    expect(normalize('Azúr')).toBe('azur')
    expect(normalize('Theatre')).toBe('theatre')
    expect(normalize('Alma a fa alatt')).toBe('almaafaalatt')
    expect(normalize('A')).toBe('a')
  })

  test('az egybe- és különírt alak ugyanazt adja', () => {
    expect(normalize('Jingle Bells')).toBe(normalize('jinglebells'))
    expect(normalize('hó-ember')).toBe(normalize('hóember'))
  })

  test('üres, csak írásjelből vagy emojiból álló bemenetre üres szöveg', () => {
    expect(normalize('')).toBe('')
    expect(normalize('   ')).toBe('')
    expect(normalize('?!…')).toBe('')
    expect(normalize('❄️👸')).toBe('')
  })

  test('a számok megmaradnak', () => {
    expect(normalize('Reszkessetek, betörők! 2.')).toBe('reszkessetekbetorok2')
  })
})

describe('isCorrectGuess', () => {
  test('a kanonikus alak és a lazán beírt változatok is helyesek', () => {
    for (const guess of ['Jégvarázs', 'jegvarazs', 'JÉGVARÁZS!', ' jég varázs ']) {
      expect(isCorrectGuess(guess, frozen), guess).toBe(true)
    }
  })

  test('a másik nyelv megfejtése is elfogadott', () => {
    expect(isCorrectGuess('frozen', frozen)).toBe(true)
    expect(isCorrectGuess('the grinch', grinch)).toBe(true)
    expect(isCorrectGuess('grincs', grinch)).toBe(true)
    expect(isCorrectGuess('How the Grinch stole Christmas?', grinch)).toBe(true)
  })

  test('a hibás és a részleges tipp nem helyes', () => {
    expect(isCorrectGuess('Jég', frozen)).toBe(false)
    expect(isCorrectGuess('Jégvarázs 2', frozen)).toBe(false)
    expect(isCorrectGuess('Hókirálynő', frozen)).toBe(false)
  })

  test('az üres tipp semmivel sem egyezik', () => {
    expect(isCorrectGuess('', frozen)).toBe(false)
    expect(isCorrectGuess('   ', frozen)).toBe(false)
    expect(isCorrectGuess('!!!', frozen)).toBe(false)
  })

  test('az acceptedAnswers mindkét nyelv alakjait tartalmazza', () => {
    expect([...acceptedAnswers(grinch)].sort()).toEqual(
      ['grinch', 'grincs', 'howthegrinchstolechristmas'].sort(),
    )
  })
})
