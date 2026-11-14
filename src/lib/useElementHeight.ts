import { useLayoutEffect, useRef, useState, type RefObject } from 'react'

/**
 * Egy elem aktuális magassága (offsetHeight) képpontban, átméretezéskor frissítve.
 * Amíg az elem nincs kirajzolva, 0. Ahol nincs ResizeObserver, az ablak átméretezését figyeli.
 */
export function useElementHeight<T extends HTMLElement>(): [RefObject<T | null>, number] {
  const ref = useRef<T>(null)
  const [height, setHeight] = useState(0)

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    const measure = () => setHeight(element.offsetHeight)
    measure()

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(measure)
      observer.observe(element)
      return () => observer.disconnect()
    }
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  return [ref, height]
}
