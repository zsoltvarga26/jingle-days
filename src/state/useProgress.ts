import { createContext, useContext, type Dispatch } from 'react'
import type { ProgressAction, SaveData } from './progress'

export interface ProgressContextValue {
  state: SaveData
  dispatch: Dispatch<ProgressAction>
}

export const ProgressCtx = createContext<ProgressContextValue | null>(null)

export function useProgress(): ProgressContextValue {
  const value = useContext(ProgressCtx)
  if (!value) throw new Error('A useProgress csak a ProgressProvider alatt használható.')
  return value
}
