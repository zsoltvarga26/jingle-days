/** Az ajtók sorrendje, mérete, színe és mintája – a protótípusból átvéve. */
export type DoorSize = 'normal' | 'wide' | 'tall' | 'big'
export type DoorColor = 'red' | 'gold' | 'snow' | 'pink' | 'green'
export type DoorPattern = 'dots' | 'stripes' | 'candy' | 'check' | 'plain'

export interface DoorLayout {
  day: number
  size: DoorSize
  color: DoorColor
  pattern: DoorPattern
  ribbon: boolean
}

const door = (
  day: number,
  color: DoorColor,
  pattern: DoorPattern,
  size: DoorSize = 'normal',
  ribbon = false,
): DoorLayout => ({ day, size, color, pattern, ribbon })

export const doorLayout: readonly DoorLayout[] = [
  door(13, 'red', 'dots'),
  door(4, 'snow', 'candy'),
  door(21, 'gold', 'stripes', 'tall', true),
  door(8, 'green', 'check'),
  door(1, 'pink', 'dots'),
  door(17, 'red', 'stripes'),
  door(6, 'red', 'plain', 'wide', true),
  door(11, 'snow', 'check'),
  door(24, 'gold', 'dots', 'big', true),
  door(2, 'green', 'stripes'),
  door(19, 'pink', 'check'),
  door(9, 'red', 'check'),
  door(15, 'snow', 'candy', 'wide', true),
  door(3, 'gold', 'check'),
  door(22, 'green', 'dots'),
  door(12, 'pink', 'stripes', 'tall', true),
  door(7, 'red', 'plain'),
  door(18, 'snow', 'dots'),
  door(5, 'gold', 'stripes'),
  door(14, 'green', 'candy'),
  door(10, 'pink', 'plain'),
  door(23, 'green', 'stripes', 'wide', true),
  door(16, 'red', 'candy'),
  door(20, 'snow', 'stripes'),
]
