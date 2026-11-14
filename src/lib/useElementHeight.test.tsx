import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { useElementHeight } from './useElementHeight'

function Probe() {
  const [ref, height] = useElementHeight<HTMLDivElement>()
  return <div ref={ref} data-testid="box" data-height={height} />
}

const shownHeight = () => screen.getByTestId('box').getAttribute('data-height')

/** A jsdom nem számol elrendezést: a teszt maga mondja meg, milyen magas az elem. */
function mockHeight(value: number) {
  return vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(value)
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('useElementHeight', () => {
  test('ResizeObserverrel: az első mérés után az átméretezést is követi, és leiratkozik', () => {
    let notify: () => void = () => {}
    const observe = vi.fn()
    const disconnect = vi.fn()
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: () => void) {
          notify = callback
        }
        observe = observe
        disconnect = disconnect
      },
    )
    const height = mockHeight(640)

    const view = render(<Probe />)
    expect(shownHeight()).toBe('640')
    expect(observe).toHaveBeenCalledWith(screen.getByTestId('box'))

    height.mockReturnValue(480)
    act(() => notify())
    expect(shownHeight()).toBe('480')

    view.unmount()
    expect(disconnect).toHaveBeenCalledTimes(1)
  })

  test('ResizeObserver nélkül az ablak átméretezésére mér újra', () => {
    vi.stubGlobal('ResizeObserver', undefined)
    const height = mockHeight(300)

    const view = render(<Probe />)
    expect(shownHeight()).toBe('300')

    height.mockReturnValue(350)
    act(() => {
      window.dispatchEvent(new Event('resize'))
    })
    expect(shownHeight()).toBe('350')

    const removed = vi.spyOn(window, 'removeEventListener')
    view.unmount()
    expect(removed).toHaveBeenCalledWith('resize', expect.any(Function))
  })
})
