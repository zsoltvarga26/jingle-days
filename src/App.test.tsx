import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import App from './App'
import { getDay } from './content/days'
import { SAVE_KEY, SETTINGS_KEY } from './state/storage'

function renderAt(date: Date, lang: 'hu' | 'en' = 'hu') {
  vi.setSystemTime(date)
  window.localStorage.setItem(
    SETTINGS_KEY,
    JSON.stringify({ lang, sfx: true, music: false, musicVolume: 0.3 }),
  )
  return render(<App />)
}

const doors = () => [...document.querySelectorAll<HTMLElement>('button[data-day]')]
const door = (day: number) => doors().find((b) => b.getAttribute('data-day') === String(day))!
const statuses = () =>
  Object.fromEntries(doors().map((b) => [Number(b.getAttribute('data-day')), b.getAttribute('data-status')]))

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'] })
  window.localStorage.clear()
  window.history.replaceState(null, '', '/')
})

afterEach(() => {
  vi.useRealTimers()
})

describe('App', () => {
  test('december 1. előtt minden ajtó zárolt, és látszik a kezdő felirat', () => {
    renderAt(new Date(2026, 10, 20, 12))
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Advent 2026')
    expect(screen.getByRole('status')).toHaveTextContent(
      'Az első ablak december 1-jén nyílik – még 11 nap!',
    )
    expect(doors()).toHaveLength(24)
    expect(new Set(Object.values(statuses()))).toEqual(new Set(['locked']))
  })

  test('zárolt ajtóra kattintva nem nyílik meg, és kiírja, hány nap múlva nyílik', () => {
    renderAt(new Date(2026, 10, 29, 12))
    fireEvent.click(door(1))
    expect(door(1)).toHaveAttribute('data-status', 'locked')
    expect(within(door(1)).getByText('2 nap múlva nyílik')).toBeInTheDocument()
    expect(window.localStorage.getItem(SAVE_KEY)).not.toContain('openedAt')
  })

  test('december 10-én az 1–10. ajtó nyitható, a többi zárolt, felirat nincs', () => {
    renderAt(new Date(2026, 11, 10, 9))
    const all = statuses()
    for (let day = 1; day <= 24; day++) {
      expect(all[day], `${day}. nap`).toBe(day <= 10 ? 'closed' : 'locked')
    }
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(door(11)).toHaveAccessibleName('11. ablak, zárolt – Holnap nyílik')
  })

  test('megnyitott ajtó mentődik, és újratöltés után is nyitva van', () => {
    const first = renderAt(new Date(2026, 11, 10, 9))
    fireEvent.click(door(3))
    expect(door(3)).toHaveAttribute('data-status', 'open')
    expect(screen.getByText('1 / 24 dísz a fán')).toBeInTheDocument()
    expect(JSON.parse(window.localStorage.getItem(SAVE_KEY)!).days[3].quiz.answers).toHaveLength(3)

    first.unmount()
    render(<App />)
    expect(door(3)).toHaveAttribute('data-status', 'open')
  })

  test('elrontott mentéssel is betölt, üres előrehaladással', () => {
    window.localStorage.setItem(SAVE_KEY, '{ez nem json')
    renderAt(new Date(2026, 11, 10, 9))
    expect(screen.getByText('0 / 24 dísz a fán')).toBeInTheDocument()
    expect(screen.getByText('0 pont')).toBeInTheDocument()
  })

  test('december 26-án minden nyitható, a visszaszámláló helyén üdvözlet áll', () => {
    renderAt(new Date(2026, 11, 26, 9))
    expect(new Set(Object.values(statuses()))).toEqual(new Set(['closed']))
    expect(screen.getByText('Boldog karácsonyt! 🎄')).toBeInTheDocument()
  })

  test('nyelvváltásra a szövegek, a html lang és a cím is vált, és a választás mentődik', () => {
    renderAt(new Date(2026, 10, 20, 12))
    expect(document.documentElement.lang).toBe('hu')

    fireEvent.click(screen.getByRole('button', { name: 'Angol' }))
    expect(screen.getByRole('status')).toHaveTextContent(
      'The first door opens on December 1 – 11 days to go!',
    )
    expect(document.documentElement.lang).toBe('en')
    expect(document.title).toBe('Advent 2026 – Advent calendar')
    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true')
    expect(JSON.parse(window.localStorage.getItem(SETTINGS_KEY)!).lang).toBe('en')
  })

  test('a témaváltó a gyökérelemre teszi a választott módot, és elmenti', () => {
    renderAt(new Date(2026, 10, 20, 12))
    const root = document.documentElement
    const savedTheme = () => JSON.parse(window.localStorage.getItem(SETTINGS_KEY)!).theme
    // Amíg nincs választás, a rendszer dönt: nincs attribútum.
    const toggle = screen.getByRole('button', { name: 'Téma: rendszer szerint' })
    expect(root).not.toHaveAttribute('data-theme')

    fireEvent.click(toggle)
    expect(toggle).toHaveAccessibleName('Téma: világos')
    expect(root).toHaveAttribute('data-theme', 'light')
    expect(savedTheme()).toBe('light')

    fireEvent.click(toggle)
    expect(toggle).toHaveAccessibleName('Téma: sötét')
    expect(root).toHaveAttribute('data-theme', 'dark')
    expect(savedTheme()).toBe('dark')

    // A harmadik kattintás visszaadja a döntést a rendszernek.
    fireEvent.click(toggle)
    expect(toggle).toHaveAccessibleName('Téma: rendszer szerint')
    expect(root).not.toHaveAttribute('data-theme')
    expect(savedTheme()).toBe('auto')
  })

  test('a ?lang= paraméter felülírja a nyelvet, de nem menti el', () => {
    window.history.replaceState(null, '', '/?lang=en')
    renderAt(new Date(2026, 10, 20, 12), 'hu')
    expect(document.documentElement.lang).toBe('en')
    expect(JSON.parse(window.localStorage.getItem(SETTINGS_KEY)!).lang).toBe('hu')
  })

  describe('napi dialógus', () => {
    const content = getDay(2)
    const q = content.quiz
    const puzzle = content.emoji[0]
    const right = (i: number) => q[i].options[q[i].correctIndex].hu
    const quoteHu = `„${content.quote.text.hu}”`
    const saved = (day: number) => JSON.parse(window.localStorage.getItem(SAVE_KEY)!).days[day]
    const puzzleStatuses = (day: number) =>
      (saved(day).emoji as { status: string }[]).map((p) => p.status)
    const click = (root: HTMLElement, name: string) =>
      fireEvent.click(within(root).getByRole('button', { name }))
    const currentStep = (root: HTMLElement) =>
      within(root).getByRole('list', { name: 'A nap lépései' }).querySelector('[aria-current="step"]')

    const openDialog = (day: number) => {
      fireEvent.click(door(day))
      act(() => {
        vi.advanceTimersByTime(1000)
      })
      return screen.getByRole('dialog')
    }

    const answerQuiz = (dialog: HTMLElement) =>
      q.forEach((_, i) => {
        click(dialog, right(i))
        click(dialog, i < q.length - 1 ? 'Következő kérdés' : 'Tovább')
      })

    const guess = (dialog: HTMLElement, text: string) => {
      fireEvent.change(within(dialog).getByLabelText('A megfejtésed'), { target: { value: text } })
      click(dialog, 'Ellenőrzöm')
    }

    test('az ajtó kinyitása után megnyílik a kvízzel és a lépésjelzővel', () => {
      renderAt(new Date(2026, 11, 10, 9))
      fireEvent.click(door(2))
      // A dialógus megvárja, amíg az ajtó kitárul.
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

      act(() => {
        vi.advanceTimersByTime(1000)
      })
      const dialog = screen.getByRole('dialog')
      expect(within(dialog).getByRole('heading', { level: 2 })).toHaveTextContent('December 2.')
      expect(currentStep(dialog)).toHaveTextContent('Kvíz')
      expect(within(dialog).getByRole('heading', { level: 3 })).toHaveTextContent(q[0].question.hu)
    })

    test('egy teljes nap: kvíz, rejtvény tippekkel, idézet, és a pontszám nő', () => {
      renderAt(new Date(2026, 11, 10, 9))
      const dialog = openDialog(2)
      answerQuiz(dialog)

      // Rejtvény: hibás válasz, két tipp, helyes válasz.
      expect(currentStep(dialog)).toHaveTextContent('Rejtvény')
      expect(within(dialog).getByText(puzzle.emojis)).toBeInTheDocument()
      guess(dialog, 'hógolyó')
      expect(within(dialog).getByText('Nem ez az, próbáld újra!')).toBeInTheDocument()
      expect(within(dialog).getByLabelText('A megfejtésed')).toHaveValue('hógolyó')

      click(dialog, '1. tipp felfedése')
      expect(within(dialog).getByText(puzzle.hints[0].hu)).toBeInTheDocument()
      click(dialog, '2. tipp felfedése')
      expect(within(dialog).getByText(puzzle.hints[1].hu)).toBeInTheDocument()

      guess(dialog, ' HÓEMBER! ')
      expect(within(dialog).getByText('A megfejtés: hóember')).toBeInTheDocument()
      expect(saved(2).emoji[0]).toEqual({ hintsRevealed: 2, attempts: 2, status: 'done' })
      click(dialog, 'Tovább')

      // Idézet és a dísz, majd bezárás.
      expect(currentStep(dialog)).toHaveTextContent('Idézet')
      expect(within(dialog).getByText(quoteHu)).toBeInTheDocument()
      expect(within(dialog).getByText('Új dísz a fára: Arany gömb')).toBeInTheDocument()
      expect(saved(2).quoteSeen).toBe(true)
      click(dialog, 'Díszítsük fel a fát!')

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(door(2)).toHaveAccessibleName('2. ablak, nyitva')
      expect(door(2)).toHaveFocus()
      // 3 helyes kvízválasz + 1 megfejtett rejtvény.
      expect(screen.getByText('4 pont')).toBeInTheDocument()
    })

    test('kihagyás és visszatérés: pötty az ajtón, a részek ott folytathatók, ahol abbamaradtak', () => {
      renderAt(new Date(2026, 11, 10, 9))
      const dialog = openDialog(2)
      click(dialog, right(0))
      click(dialog, 'Következő kérdés')
      click(dialog, 'Kvíz kihagyása')
      click(dialog, '1. tipp felfedése')
      click(dialog, 'Rejtvény kihagyása')

      // A kihagyások után is az idézet jön, a megfejtés nem látszik sehol.
      expect(currentStep(dialog)).toHaveTextContent('Idézet')
      expect(within(dialog).queryByText(/hóember/i)).not.toBeInTheDocument()
      click(dialog, 'Díszítsük fel a fát!')
      expect(door(2)).toHaveAccessibleName('2. ablak, nyitva – van még kihagyott rész')

      // Nyitott ajtóra kattintva azonnal az összefoglaló nyílik.
      fireEvent.click(door(2))
      const again = screen.getByRole('dialog')
      expect(within(again).getByText('1 / 3 helyes')).toBeInTheDocument()
      expect(within(again).getByText('Kihagyva')).toBeInTheDocument()
      expect(within(again).getByText(quoteHu)).toBeInTheDocument()

      // A kvíz a 2. kérdésnél folytatódik, a végén visszavisz az összefoglalóhoz.
      click(again, 'Folytatom a kvízt')
      expect(within(again).getByRole('heading', { level: 3 })).toHaveTextContent(q[1].question.hu)
      click(again, right(1))
      click(again, 'Következő kérdés')
      click(again, right(2))
      click(again, 'Tovább')
      expect(within(again).getByText('3 / 3 helyes')).toBeInTheDocument()
      expect(within(again).queryByRole('button', { name: 'Folytatom a kvízt' })).not.toBeInTheDocument()

      // A rejtvény tisztán újrapróbálható, a korábban felfedett tipp megmaradt.
      click(again, 'Megpróbálom')
      expect(within(again).getByText(puzzle.hints[0].hu)).toBeInTheDocument()
      guess(again, 'snowman')
      click(again, 'Tovább')
      expect(within(again).getByText('Megfejtve: hóember')).toBeInTheDocument()
      expect(within(again).queryByRole('button', { name: 'Megpróbálom' })).not.toBeInTheDocument()

      click(again, 'Bezárom')
      expect(door(2)).toHaveAccessibleName('2. ablak, nyitva')
    })

    test('a dialógus bezárása a vége előtt nem veszít el semmit, és a dísz megvan', () => {
      renderAt(new Date(2026, 11, 10, 9))
      const dialog = openDialog(2)
      click(dialog, right(0))
      click(dialog, 'Bezárás')

      expect(screen.getByText('1 / 24 dísz a fán')).toBeInTheDocument()
      fireEvent.click(door(2))
      const again = screen.getByRole('dialog')
      expect(within(again).getByText('1 / 3 helyes')).toBeInTheDocument()
      expect(within(again).getByText('Még hátravan')).toBeInTheDocument()
    })

    test('a 24. napon 5 kérdés és 2 rejtvény van; a kihagyás csak az aktuális rejtvényt ugorja', () => {
      renderAt(new Date(2026, 11, 24, 9))
      const dialog = openDialog(24)
      expect(within(dialog).getByText('1 / 5. kérdés')).toBeInTheDocument()
      click(dialog, 'Kvíz kihagyása')

      expect(within(dialog).getByText('1 / 2. rejtvény')).toBeInTheDocument()
      click(dialog, 'Rejtvény kihagyása')
      expect(within(dialog).getByText('2 / 2. rejtvény')).toBeInTheDocument()
      expect(puzzleStatuses(24)).toEqual(['skipped', 'pending'])

      guess(dialog, 'Jingle Bells')
      click(dialog, 'Tovább')
      expect(currentStep(dialog)).toHaveTextContent('Idézet')
      expect(puzzleStatuses(24)).toEqual(['skipped', 'done'])
    })

    test('a dísz a dialógus bezárása után kerül a fára, nem előbb', () => {
      renderAt(new Date(2026, 11, 10, 9))
      const ornament = () => document.querySelector('[data-ornament="d02-bauble-gold"]')!
      expect(ornament()).toHaveAttribute('data-state', 'ghost')
      expect(screen.getByText('0 / 24 dísz a fán')).toBeInTheDocument()

      const dialog = openDialog(2)
      // Az ajtó nyitva, a dísz jár, de amíg a dialógus nyitva van, nem esik le a háttérben.
      expect(screen.getByText('1 / 24 dísz a fán')).toBeInTheDocument()
      act(() => {
        vi.advanceTimersByTime(5000)
      })
      expect(ornament()).toHaveAttribute('data-state', 'ghost')
      expect(saved(2).ornamentShown).toBe(false)

      click(dialog, 'Bezárás')
      expect(ornament()).toHaveAttribute('data-state', 'dropping')
      act(() => {
        vi.advanceTimersByTime(2000)
      })
      expect(ornament()).toHaveAttribute('data-state', 'earned')
      expect(saved(2).ornamentShown).toBe(true)
    })

    test('félbeszakadt nap dísze a következő betöltéskor kerül a fára', () => {
      const first = renderAt(new Date(2026, 11, 10, 9))
      openDialog(2)
      // A fül bezárása a dialógus közben: a dísz megvan, de még nem került fel.
      first.unmount()
      expect(saved(2).ornamentShown).toBe(false)

      render(<App />)
      expect(document.querySelector('[data-ornament="d02-bauble-gold"]')).toHaveAttribute(
        'data-state',
        'dropping',
      )
      act(() => {
        vi.advanceTimersByTime(2000)
      })
      expect(saved(2).ornamentShown).toBe(true)
    })

    test('a már felkerült dísz nem esik le újra, ha a napot újra megnyitják és bezárják', () => {
      renderAt(new Date(2026, 11, 10, 9))
      const ornament = () => document.querySelector('[data-ornament="d02-bauble-gold"]')!
      const scrolls = vi.fn()
      Element.prototype.scrollIntoView = scrolls

      click(openDialog(2), 'Bezárás')
      expect(scrolls).toHaveBeenCalledTimes(1)
      act(() => {
        vi.advanceTimersByTime(2000)
      })
      expect(ornament()).toHaveAttribute('data-state', 'earned')

      // Újra megnyitva (összefoglaló) és bezárva: nincs görgetés, nincs animáció.
      fireEvent.click(door(2))
      click(screen.getByRole('dialog'), 'Bezárom')
      expect(ornament()).toHaveAttribute('data-state', 'earned')
      expect(scrolls).toHaveBeenCalledTimes(1)
      act(() => {
        vi.advanceTimersByTime(3000)
      })
      expect(ornament()).toHaveAttribute('data-state', 'earned')
    })

    test('díszítéskor arany keret kerül a fa kártyájára, és kb. 1,4 s múlva eltűnik', () => {
      renderAt(new Date(2026, 11, 10, 9))
      const framed = () => document.querySelector('[data-decorating]')
      const dialog = openDialog(2)
      expect(framed()).not.toBeInTheDocument()

      click(dialog, 'Bezárás')
      expect(framed()).toContainElement(document.querySelector('[data-ornament="d02-bauble-gold"]'))
      act(() => {
        vi.advanceTimersByTime(1300)
      })
      expect(framed()).toBeInTheDocument()
      act(() => {
        vi.advanceTimersByTime(200)
      })
      expect(framed()).not.toBeInTheDocument()

      // Újra megnyitva és bezárva nincs új dísz, így keret sincs.
      fireEvent.click(door(2))
      click(screen.getByRole('dialog'), 'Bezárom')
      expect(framed()).not.toBeInTheDocument()
    })

    test('széles nézetben a dialógus bezárása nem görget, a dísz és a keret azonnal indul', () => {
      vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('min-width') }))
      const scrolls = vi.fn()
      Element.prototype.scrollIntoView = scrolls
      try {
        renderAt(new Date(2026, 11, 10, 9))
        click(openDialog(2), 'Bezárás')

        expect(scrolls).not.toHaveBeenCalled()
        expect(document.querySelector('[data-ornament="d02-bauble-gold"]')).toHaveAttribute(
          'data-state',
          'dropping',
        )
        expect(document.querySelector('[data-decorating]')).toBeInTheDocument()
        expect(door(2)).toHaveFocus()
      } finally {
        vi.unstubAllGlobals()
      }
    })

    test('az elindult díszanimáció akkor is lezárul, ha a fa közben kikerül a képből', () => {
      // Ál-IntersectionObserver: a teszt maga mondja meg, látszik-e a fa.
      let report: (visible: boolean) => void = () => {}
      vi.stubGlobal(
        'IntersectionObserver',
        class {
          constructor(callback: (entries: { isIntersecting: boolean }[]) => void) {
            report = (visible) => callback([{ isIntersecting: visible }])
          }
          observe() {}
          disconnect() {}
        },
      )
      try {
        renderAt(new Date(2026, 11, 10, 9))
        const ornament = () => document.querySelector('[data-ornament="d02-bauble-gold"]')!

        click(openDialog(2), 'Bezárás')
        // Amíg a fa nem látszik, a dísz vár.
        act(() => {
          vi.advanceTimersByTime(3000)
        })
        expect(ornament()).toHaveAttribute('data-state', 'ghost')

        act(() => report(true))
        expect(ornament()).toHaveAttribute('data-state', 'dropping')

        // A játékos az animáció közben elgörget: a dísz ettől még felkerül és elmentődik.
        act(() => {
          vi.advanceTimersByTime(300)
          report(false)
        })
        act(() => {
          vi.advanceTimersByTime(2000)
        })
        expect(saved(2).ornamentShown).toBe(true)

        act(() => report(true))
        expect(ornament()).toHaveAttribute('data-state', 'earned')
        act(() => {
          vi.advanceTimersByTime(3000)
        })
        expect(ornament()).toHaveAttribute('data-state', 'earned')
      } finally {
        vi.unstubAllGlobals()
      }
    })

    test('nyelvváltás nyitott dialógus közben nem veszít el állapotot', () => {
      renderAt(new Date(2026, 11, 10, 9))
      const dialog = openDialog(2)
      click(dialog, right(0))
      fireEvent.click(screen.getByRole('button', { name: 'Angol' }))

      expect(within(dialog).getByRole('heading', { level: 3 })).toHaveTextContent(q[0].question.en)
      expect(within(dialog).getByText('Correct!')).toBeInTheDocument()
      expect(within(dialog).getByRole('button', { name: 'Next question' })).toBeInTheDocument()
    })
  })

  test('a visszaállítás megerősítést kér, és a nyelvet nem állítja vissza', () => {
    renderAt(new Date(2026, 11, 10, 9), 'en')
    fireEvent.click(door(1))
    fireEvent.click(door(2))
    expect(screen.getByText('2 / 24 ornaments on the tree')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Reset progress' }))
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.getByText('2 / 24 ornaments on the tree')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Reset progress' }))
    fireEvent.click(screen.getByRole('button', { name: 'Yes, reset' }))
    expect(screen.getByText('0 / 24 ornaments on the tree')).toBeInTheDocument()
    expect(door(1)).toHaveAttribute('data-status', 'closed')
    expect(JSON.parse(window.localStorage.getItem(SETTINGS_KEY)!).lang).toBe('en')
  })
})
