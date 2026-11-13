import { createElement } from 'react'
import { TREE_VIEWBOX } from '../components/TreeScene/geometry'
import { paletteValues, treePalette } from '../components/TreeScene/palette'
import { Tree } from '../components/TreeScene/Tree'
import type { Ornament } from '../content/types'

/**
 * A megosztható eredménykártya: 1080 × 1350 px-es PNG, amit a böngésző Canvas API-ja rajzol,
 * szerver nélkül. A kártya mindig világos színvilágú, a sötét módtól függetlenül.
 */
export const CARD_WIDTH = 1080
export const CARD_HEIGHT = 1350
export const CARD_FILE_NAME = 'advent-2026.png'

/** A kártyára kerülő, már lefordított szövegek. */
export interface CardText {
  title: string
  /** pl. „18 / 24” */
  ornaments: string
  ornamentsLabel: string
  /** pl. „61” */
  points: string
  pointsLabel: string
  /** pl. „Kvíz: 52 / 74” */
  quiz: string
  puzzles: string
  /** Az oldal címe, hogy mások is kipróbálhassák. */
  url: string
}

export interface CardInput {
  text: CardText
  ornaments: readonly Ornament[]
  /** A megnyitott napok díszeinek azonosítói. */
  earned: ReadonlySet<string>
}

const c = paletteValues
const FONT = '"Baloo 2", "Nunito", "Trebuchet MS", system-ui, sans-serif'

/** Az oldal címe lekérdezési paraméterek nélkül (a megosztott linkbe nem kerül `?date=` vagy `?lang=`). */
export function pageUrl(location: Pick<Location, 'origin' | 'pathname'> = window.location): string {
  return `${location.origin}${location.pathname}`
}

/** Az oldal címe a kártyára: protokoll és záró perjel nélkül. */
export function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

/**
 * A fa SVG-ként, szövegként. Ugyanaz a `Tree` komponens rajzolja, mint az oldalon; a színei
 * attribútumok, ezért képként betöltve (ahol a CSS nem érvényesül) is színes marad.
 */
export async function treeSvgMarkup(
  ornaments: readonly Ornament[],
  earned: ReadonlySet<string>,
  width: number,
): Promise<string> {
  // Csak a kártya készítésekor töltődik be, nem az oldal indulásakor.
  const { renderToStaticMarkup } = await import('react-dom/server')
  const height = Math.round((width * TREE_VIEWBOX.height) / TREE_VIEWBOX.width)
  const markup = renderToStaticMarkup(
    createElement(Tree, {
      ornaments,
      earned,
      lit: earned.size === ornaments.length,
      palette: treePalette,
      label: '',
    }),
  )
  // A képként betöltött SVG-nek saját méret kell, különben egyes böngészők 0 × 0-ra rajzolják.
  return markup.replace('<svg ', `<svg width="${width}" height="${height}" `)
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('A fa képe nem töltődött be.'))
    image.src = src
  })
}

/** Megvárja a Baloo 2 betűket: nélkülük tartalékbetű kerülne a képre. */
async function fontsReady(): Promise<void> {
  if (!('fonts' in document)) return
  await Promise.all(
    [500, 700, 800].map((weight) => document.fonts.load(`${weight} 40px "Baloo 2"`, 'Áő 0')),
  ).catch(() => {})
  await document.fonts.ready
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + width, y, x + width, y + height, radius)
  ctx.arcTo(x + width, y + height, x, y + height, radius)
  ctx.arcTo(x, y + height, x, y, radius)
  ctx.arcTo(x, y, x + width, y, radius)
  ctx.closePath()
}

/** A háttér: az oldaléval azonos, két halvány folttal és néhány hópehellyel. */
function drawBackground(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = c.bg
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

  for (const [x, y, radius] of [
    [160, 0, 560],
    [980, 420, 520],
  ] as const) {
    const blob = ctx.createRadialGradient(x, y, 0, x, y, radius)
    blob.addColorStop(0, c.bg2)
    blob.addColorStop(1, `${c.bg2}00`)
    ctx.fillStyle = blob
    ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)
  }

  ctx.fillStyle = c.snow
  for (const [x, y, radius] of [
    [90, 300, 7],
    [200, 620, 5],
    [130, 900, 8],
    [960, 250, 6],
    [1000, 760, 8],
    [880, 560, 5],
    [70, 1150, 6],
    [1010, 1080, 7],
  ] as const) {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }
}

/** A cím az oldal címstílusával: piros betűk rétegzett arany–zöld árnyékkal. */
function drawTitle(ctx: CanvasRenderingContext2D, title: string) {
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.font = `800 150px ${FONT}`
  const x = CARD_WIDTH / 2
  const y = 205
  ctx.fillStyle = c.pine
  ctx.fillText(title, x + 12, y + 12)
  ctx.fillStyle = c.gold
  ctx.fillText(title, x + 6, y + 6)
  ctx.fillStyle = c.red
  ctx.fillText(title, x, y)
}

/** Egy fehér doboz piros alsó „peremmel”, benne nagy szám és alatta felirat. */
function drawStat(ctx: CanvasRenderingContext2D, x: number, value: string, label: string) {
  const y = 1000
  const width = 440
  const height = 190

  ctx.fillStyle = c.red
  roundedRect(ctx, x, y + 12, width, height, 40)
  ctx.fill()
  ctx.fillStyle = c.snow
  roundedRect(ctx, x, y, width, height, 40)
  ctx.fill()

  ctx.textAlign = 'center'
  ctx.fillStyle = c.redDark
  ctx.font = `800 104px ${FONT}`
  ctx.fillText(value, x + width / 2, y + 112)
  ctx.fillStyle = c.inkSoft
  ctx.font = `700 40px ${FONT}`
  ctx.fillText(label, x + width / 2, y + 162)
}

/** Megrajzolja a kártyát a vászonra. A fa képe és a betűk már be vannak töltve. */
export function drawCard(ctx: CanvasRenderingContext2D, text: CardText, tree: CanvasImageSource) {
  drawBackground(ctx)
  drawTitle(ctx, text.title)

  const treeWidth = 590
  const treeHeight = (treeWidth * TREE_VIEWBOX.height) / TREE_VIEWBOX.width
  ctx.drawImage(tree, (CARD_WIDTH - treeWidth) / 2, 262, treeWidth, treeHeight)

  drawStat(ctx, 80, text.ornaments, text.ornamentsLabel)
  drawStat(ctx, 560, text.points, text.pointsLabel)

  ctx.textAlign = 'center'
  ctx.fillStyle = c.ink
  ctx.font = `700 38px ${FONT}`
  ctx.fillText(`${text.quiz}  ·  ${text.puzzles}`, CARD_WIDTH / 2, 1262)

  ctx.fillStyle = c.pine
  ctx.font = `700 36px ${FONT}`
  ctx.fillText(text.url, CARD_WIDTH / 2, 1316)
}

/** Elkészíti a kártyát PNG fájlként. Hibát dob, ha a böngésző nem tud vászonra rajzolni. */
export async function renderShareCard({ text, ornaments, earned }: CardInput): Promise<File> {
  const canvas = document.createElement('canvas')
  canvas.width = CARD_WIDTH
  canvas.height = CARD_HEIGHT
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('A vászon nem érhető el.')

  const svg = await treeSvgMarkup(ornaments, earned, 1180)
  const [tree] = await Promise.all([
    loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`),
    fontsReady(),
  ])
  drawCard(ctx, text, tree)

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
  if (!blob) throw new Error('A kép nem készült el.')
  return new File([blob], CARD_FILE_NAME, { type: 'image/png' })
}

/** Meg tudja-e osztani a böngésző a képfájlt a rendszer megosztási menüjével (jellemzően mobilon). */
export function canShareFile(file: File): boolean {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.share === 'function' &&
    typeof navigator.canShare === 'function' &&
    navigator.canShare({ files: [file] })
  )
}

/**
 * A rendszer megosztási menüje a képpel és a szöveggel. Közvetlenül kattintásból kell hívni,
 * a már kész fájllal. Igazat ad, ha megosztották; hamisat, ha a játékos visszalépett.
 */
export async function shareFile(file: File, text: string, title: string): Promise<boolean> {
  try {
    await navigator.share({ files: [file], text, title })
    return true
  } catch {
    return false
  }
}

/** A kép letöltése a böngészővel. */
export function downloadFile(file: File): void {
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = file.name
  document.body.append(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** Szöveg a vágólapra. Hamisat ad, ha a böngésző nem engedi. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
