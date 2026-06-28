import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import type { ReactNode } from 'react'

// Kept separate from VanContext so hovering a part never re-renders the panels.
interface SelCtx {
  selectedId: string | null
  hoveredId: string | null
  select: (id: string | null) => void
  hover: (id: string | null) => void
}

const Ctx = createContext<SelCtx | null>(null)

// eslint-disable-next-line react-refresh/only-export-components
export function useSelection(): SelCtx {
  const c = useContext(Ctx)
  if (!c) throw new Error('useSelection must be used inside <SelectionProvider>')
  return c
}

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selectedId, setSelected] = useState<string | null>(null)
  const [hoveredId, setHovered] = useState<string | null>(null)
  const select = useCallback((id: string | null) => setSelected(id), [])
  const hover = useCallback((id: string | null) => setHovered(id), [])
  const value = useMemo(() => ({ selectedId, hoveredId, select, hover }), [selectedId, hoveredId, select, hover])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
