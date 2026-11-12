import type { ReactElement } from 'react'
import type { OrnamentShape } from '../../../content/types'
import {
  Bauble,
  Bell,
  Boot,
  Bow,
  Candle,
  CandyCane,
  Gift,
  Gingerbread,
  Pinecone,
  Snowflake,
  Star,
  Szaloncukor,
  type ShapeProps,
} from './shapes'

/** Alakzatnévhez a rajza. A típus kikényszeríti, hogy mind a 12 alakzatnak legyen rajza. */
export const shapes: Record<OrnamentShape, (props: ShapeProps) => ReactElement> = {
  bauble: Bauble,
  star: Star,
  candyCane: CandyCane,
  bell: Bell,
  bow: Bow,
  snowflake: Snowflake,
  gingerbread: Gingerbread,
  boot: Boot,
  gift: Gift,
  candle: Candle,
  szaloncukor: Szaloncukor,
  pinecone: Pinecone,
}
