import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, test, vi } from 'vitest'
import type { DoorLayout } from '../../content/layout'
import { Door, type DoorProps } from './Door'

const layout: DoorLayout = { day: 5, size: 'normal', color: 'gold', pattern: 'stripes', ribbon: false }

function setup(props: Partial<DoorProps> = {}) {
  const handlers = { onOpen: vi.fn(), onRevisit: vi.fn(), onLockedClick: vi.fn() }
  const view = render(
    <Door
      layout={layout}
      index={0}
      status="closed"
      ariaLabel="5. ablak"
      lockedMessage="3 nap múlva nyílik"
      {...handlers}
      {...props}
    />,
  )
  return { ...handlers, ...view, button: screen.getByRole('button') }
}

afterEach(() => {
  vi.useRealTimers()
})

describe('Door', () => {
  test('zárt ajtó kattintásra megnyílik', () => {
    const { button, onOpen, onLockedClick } = setup({ status: 'closed' })
    expect(button).toHaveAttribute('data-status', 'closed')
    expect(button).not.toHaveAttribute('aria-disabled')
    fireEvent.click(button)
    expect(onOpen).toHaveBeenCalledWith(5)
    expect(onLockedClick).not.toHaveBeenCalled()
  })

  test('zárolt ajtó nem nyílik, de fókuszálható, és kiírja, mikor nyílik', () => {
    vi.useFakeTimers()
    const { button, onOpen, onLockedClick } = setup({ status: 'locked' })
    expect(button).toHaveAttribute('aria-disabled', 'true')
    expect(button).not.toBeDisabled()
    expect(screen.queryByText('3 nap múlva nyílik')).not.toBeInTheDocument()

    fireEvent.click(button)
    expect(onOpen).not.toHaveBeenCalled()
    expect(onLockedClick).toHaveBeenCalledWith(5)
    expect(screen.getByText('3 nap múlva nyílik')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(screen.queryByText('3 nap múlva nyílik')).not.toBeInTheDocument()
  })

  test('nyitott ajtó kattintásra az újralátogatást jelzi, nem nyit újra', () => {
    const { button, onOpen, onRevisit } = setup({ status: 'open' })
    expect(button).toHaveAttribute('data-status', 'open')
    fireEvent.click(button)
    expect(onOpen).not.toHaveBeenCalled()
    expect(onRevisit).toHaveBeenCalledWith(5)
  })

  test('a képernyőolvasónak szóló név a kapott címke', () => {
    setup({ status: 'locked', ariaLabel: '5. ablak, zárolt – 3 nap múlva nyílik' })
    expect(
      screen.getByRole('button', { name: '5. ablak, zárolt – 3 nap múlva nyílik' }),
    ).toBeInTheDocument()
  })
})
