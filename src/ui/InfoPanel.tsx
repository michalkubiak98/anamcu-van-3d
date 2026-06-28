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
      <div className="fixed top-3 right-3 z-20 w-44 rounded-lg bg-[#161a12]/85 border border-[#2c4034] p-2 text-xs text-stone-400">
        Tap or hover a piece to see its dimensions.
      </div>
    )
  }

  const layer = LAYERS.find((l) => l.id === part.layerId)
  return (
    <div className="fixed top-3 right-3 z-20 w-56 rounded-lg bg-[#161a12]/95 border border-[#c8a56c] p-3 text-sm shadow-lg">
      <div className="flex items-center gap-2 font-semibold text-[#ffd27a]">
        <span style={{ background: layer?.color }} className="w-3 h-3 rounded-full inline-block shrink-0" />
        <span className="leading-tight">{part.label}</span>
      </div>
      <div className="text-stone-100 mt-1.5 tabular-nums">
        {fmt(part.size.l)} x {fmt(part.size.w)} x {fmt(part.size.h)} mm
      </div>
      {part.cut && (
        <div className="text-green-300 tabular-nums">
          cut {fmt(part.cut.cutLength)} mm ({part.cut.profile})
        </div>
      )}
      {part.approximate && <div className="text-amber-300">approximate - verify</div>}
      {part.notes && <div className="text-stone-400 text-xs mt-1">{part.notes}</div>}
      <div className="text-stone-500 text-[11px] mt-1.5">{layer?.name}</div>
    </div>
  )
}
