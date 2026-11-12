/** Szövegből 32 bites szám (FNV-1a). */
function hash(text: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** Kicsi, determinisztikus álvéletlen-generátor (mulberry32). */
function mulberry32(seed: number): () => number {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * A 0..length-1 indexek keverve; ugyanarra a seedre mindig ugyanaz a sorrend.
 * A kvíz ezzel keveri a válaszokat megjelenítéskor, a kérdés `id`-ját adva seednek.
 * A keverés csak megjelenítés: a mentés és a `correctIndex` az eredeti indexet használja.
 */
export function shuffledIndices(length: number, seed: string): number[] {
  const order = Array.from({ length }, (_, i) => i)
  const random = mulberry32(hash(seed))
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return order
}
