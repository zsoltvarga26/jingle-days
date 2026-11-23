import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, test } from 'vitest'
import { I18nProvider } from '../../i18n/I18nContext'
import { SettingsProvider } from '../../state/SettingsContext'
import { SETTINGS_KEY } from '../../state/storage'
import { TreeInfo } from './TreeInfo'

const TEXT = 'Kattints a cica tálkájára, és átnevezheted a cicát.'

function setup(lang: 'hu' | 'en' = 'hu') {
  window.localStorage.setItem(
    SETTINGS_KEY,
    JSON.stringify({ lang, sfx: false, music: false, musicVolume: 0.3 }),
  )
  render(
    <SettingsProvider>
      <I18nProvider>
        <p>kívül</p>
        <TreeInfo />
      </I18nProvider>
    </SettingsProvider>,
  )
  return screen.getByRole('button', { name: lang === 'hu' ? 'Tudnivalók' : 'Good to know' })
}

beforeEach(() => {
  window.localStorage.clear()
})

describe('a fa melletti „i” gomb', () => {
  test('alapból zárva van, a leírás nem látszik', () => {
    const button = setup()
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText(TEXT)).not.toBeVisible()
  })

  test('kattintásra kinyílik és leírja, hogy a tálkán átnevezhető a cica; újabb kattintásra bezárul', () => {
    const button = setup()
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('note')).toHaveTextContent(TEXT)
    expect(screen.getByRole('note')).toBeVisible()
    expect(button.getAttribute('aria-controls')).toBe(screen.getByRole('note').id)

    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText(TEXT)).not.toBeVisible()
  })

  test('Escape-re bezárul, és a fókusz a gombra kerül', () => {
    const button = setup()
    fireEvent.click(button)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveFocus()
  })

  test('a buborékon kívüli kattintásra bezárul, a buborékon belülire nem', () => {
    const button = setup()
    fireEvent.click(button)
    fireEvent.pointerDown(screen.getByRole('note'))
    expect(button).toHaveAttribute('aria-expanded', 'true')

    fireEvent.pointerDown(screen.getByText('kívül'))
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  test('angolul is', () => {
    const button = setup('en')
    fireEvent.click(button)
    expect(screen.getByRole('note')).toHaveTextContent('Click the cat’s bowl to give the cat a new name.')
  })
})
