import { createContext, useContext, useState, useMemo, useEffect, useCallback, useRef } from 'react'
import type { ReactNode } from 'react'
import type { VanSpec, LayerId, Part, LabelAnchor, CutList } from '../model/types'
import { makeDefaultSpec, cloneSpec, withDefaults, DEFAULT_SPEC } from '../data/defaultSpec'
import { LAYERS } from '../data/layers'

const DEFAULT_SCHEMA = DEFAULT_SPEC.schemaVersion
import { genAllParts, genAllAnchors } from '../model/generators'
import { deriveCutList } from '../model/cutlist/deriveCutList'
import { load, save, remove } from '../lib/storage'

const SPEC_KEY = 'vanSpec.v1'
const VIS_KEY = 'layerVis.v1'

type Vis = Record<string, boolean>
const defaultVis = (): Vis => Object.fromEntries(LAYERS.map((l) => [l.id, l.defaultVisible]))

interface VanCtx {
  spec: VanSpec
  setField: (path: string, value: number) => void
  replaceSpec: (s: VanSpec) => void
  resetSpec: () => void
  parts: Part[]
  anchors: LabelAnchor[]
  cutList: CutList
  vis: Vis
  toggleLayer: (id: LayerId) => void
  setAllLayers: (on: boolean) => void
  flashSolo: (id: LayerId) => void
}

const Ctx = createContext<VanCtx | null>(null)

// eslint-disable-next-line react-refresh/only-export-components
export function useVan(): VanCtx {
  const c = useContext(Ctx)
  if (!c) throw new Error('useVan must be used inside <VanProvider>')
  return c
}

export function VanProvider({ children }: { children: ReactNode }) {
  const [spec, setSpec] = useState<VanSpec>(() => {
    const stored = load<VanSpec>(SPEC_KEY)
    // discard saved specs from an older schema (the shape changed materially)
    if (stored && stored.schemaVersion === DEFAULT_SCHEMA) return withDefaults(stored)
    return makeDefaultSpec()
  })
  const [vis, setVis] = useState<Vis>(() => ({ ...defaultVis(), ...(load<Vis>(VIS_KEY) ?? {}) }))

  useEffect(() => {
    const id = setTimeout(() => save(SPEC_KEY, spec), 300)
    return () => clearTimeout(id)
  }, [spec])
  useEffect(() => save(VIS_KEY, vis), [vis])

  const setField = useCallback((path: string, value: number) => {
    setSpec((prev) => {
      const next = cloneSpec(prev)
      const keys = path.split('.')
      let o = next as unknown as Record<string, unknown>
      for (let i = 0; i < keys.length - 1; i++) o = o[keys[i]] as Record<string, unknown>
      o[keys[keys.length - 1]] = value
      return next
    })
  }, [])

  const replaceSpec = useCallback((s: VanSpec) => setSpec(withDefaults(s)), [])
  const resetSpec = useCallback(() => {
    remove(SPEC_KEY)
    setSpec(makeDefaultSpec())
  }, [])

  const parts = useMemo(() => genAllParts(spec), [spec])
  const anchors = useMemo(() => genAllAnchors(spec), [spec])
  const cutList = useMemo(() => deriveCutList(parts), [parts])

  const toggleLayer = useCallback((id: LayerId) => setVis((v) => ({ ...v, [id]: !v[id] })), [])
  const setAllLayers = useCallback(
    (on: boolean) => setVis(Object.fromEntries(LAYERS.map((l) => [l.id, on]))),
    [],
  )

  // briefly isolate one layer (hide the rest) so you can spot what it controls
  const soloPrev = useRef<Vis | null>(null)
  const soloTimer = useRef<number | null>(null)
  const flashSolo = useCallback((id: LayerId) => {
    setVis((prev) => {
      if (!soloPrev.current) soloPrev.current = prev
      return Object.fromEntries(LAYERS.map((l) => [l.id, l.id === id]))
    })
    if (soloTimer.current) clearTimeout(soloTimer.current)
    soloTimer.current = window.setTimeout(() => {
      if (soloPrev.current) setVis(soloPrev.current)
      soloPrev.current = null
      soloTimer.current = null
    }, 10000)
  }, [])

  const value = useMemo<VanCtx>(
    () => ({ spec, setField, replaceSpec, resetSpec, parts, anchors, cutList, vis, toggleLayer, setAllLayers, flashSolo }),
    [spec, setField, replaceSpec, resetSpec, parts, anchors, cutList, vis, toggleLayer, setAllLayers, flashSolo],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
