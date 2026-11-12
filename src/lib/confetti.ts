import confetti from 'canvas-confetti'

type Fire = ReturnType<typeof confetti.create>

const instances = new WeakMap<HTMLCanvasElement, Fire>()

/** A konfetti színei a tokenekből jönnek, nem beégetett értékek. */
const COLOR_TOKENS = ['--red', '--gold', '--green', '--pink', '--pine']

/**
 * Rövid konfetti a megadott vásznon (a dialóguson belül, mert a modális dialógus
 * a böngésző legfelső rétegében van, egy oldalszintű vászon mögé kerülne).
 * Csökkentett mozgás mellett és tesztben nem csinál semmit.
 */
export function burstConfetti(canvas: HTMLCanvasElement | null): void {
  if (!canvas || import.meta.env.MODE === 'test') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  try {
    let fire = instances.get(canvas)
    if (!fire) {
      fire = confetti.create(canvas, { resize: true })
      instances.set(canvas, fire)
    }
    const style = getComputedStyle(document.documentElement)
    const colors = COLOR_TOKENS.map((token) => style.getPropertyValue(token).trim()).filter(Boolean)
    void fire({
      particleCount: 70,
      spread: 75,
      startVelocity: 32,
      origin: { y: 0.65 },
      colors,
      disableForReducedMotion: true,
    })
  } catch {
    // A konfetti dísz: ha nem megy, a játék megy tovább.
  }
}
