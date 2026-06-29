import { useVan } from '../state/VanContext'
import { useSelection } from '../state/SelectionContext'
import { LAYERS } from '../data/layers'

const fmt = (n: number) => Math.round(n).toString()

// Docked readout (top-right). Shows the hovered/selected part's full dimensions
// in a fixed spot so you never have to hunt for a floating label.
export function InfoPanel() {
  const { parts } = useVan()
  const { selectedId, hoveredId } = useSelection()
  const id = hoveredId ?? selectedId
  const part = id ? parts.find((p) => p.id === id) : null

  if (!part) {
    return (
      <div className="fixed top-3 right-3 z-20 w-40 rounded-md bg-[#10140f]/85 p-2 text-xs text-stone-500 shadow-lg">
        No piece selected
      </div>
    )
  }

  const layer = LAYERS.find((l) => l.id === part.layerId)
  return (
    <div className="fixed top-3 right-3 z-20 w-56 rounded-md bg-[#10140f]/95 p-3 text-sm shadow-xl ring-1 ring-[#c8a56c]/40">
      <div className="flex items-center gap-2 font-semibold text-[#ffd27a]">
        <span style={{ background: layer?.color }} className="inline-block h-3 w-3 shrink-0 rounded-full" />
        <span className="leading-tight">{part.label}</span>
      </div>
      <div className="mt-1.5 text-stone-100 tabular-nums">
        {fmt(part.size.l)} x {fmt(part.size.w)} x {fmt(part.size.h)} mm
      </div>
      {part.cut && (
        <div className="text-green-300 tabular-nums">
          cut {fmt(part.cut.cutLength)} mm ({part.cut.profile})
        </div>
      )}
      {part.approximate && <div className="text-amber-300">approximate - verify</div>}
      {part.notes && <div className="text-stone-400 text-xs mt-1">{part.notes}</div>}
      <div className="mt-1.5 text-[11px] text-stone-500">{layer?.name}</div>
    </div>
  )
}
