import { useVan } from '../state/VanContext'
import { LAYERS } from '../data/layers'

export function LayersPanel() {
  const { vis, toggleLayer, setAllLayers } = useVan()
  return (
    <div>
      <div className="flex gap-2 mb-2">
        <button onClick={() => setAllLayers(true)} className="flex-1 h-9 rounded bg-stone-700 active:bg-stone-600 text-sm">
          Show all
        </button>
        <button onClick={() => setAllLayers(false)} className="flex-1 h-9 rounded bg-stone-700 active:bg-stone-600 text-sm">
          Hide all
        </button>
      </div>
      <div className="divide-y divide-stone-800">
        {LAYERS.map((l) => (
          <button
            key={l.id}
            onClick={() => toggleLayer(l.id)}
            className="flex items-center justify-between w-full h-11 px-1 text-left"
          >
            <span className="flex items-center gap-2 text-sm text-stone-200">
              <span style={{ background: l.color }} className="w-3 h-3 rounded-full inline-block" />
              {l.name}
            </span>
            <span className={`text-xs font-medium ${vis[l.id] ? 'text-green-400' : 'text-stone-600'}`}>
              {vis[l.id] ? 'ON' : 'off'}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
