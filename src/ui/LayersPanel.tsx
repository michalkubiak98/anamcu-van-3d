import { useVan } from '../state/VanContext'
import { LAYERS } from '../data/layers'

export function LayersPanel() {
  const { vis, toggleLayer, setAllLayers, flashSolo } = useVan()
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
        {LAYERS.map((l) => {
          const on = vis[l.id]
          return (
            <div key={l.id} className="flex items-center gap-3 h-12">
              {/* switch */}
              <button
                onClick={() => toggleLayer(l.id)}
                role="switch"
                aria-checked={on}
                className="relative w-11 h-6 rounded-full shrink-0 transition-colors"
                style={{ background: on ? l.color : '#3a3a3a' }}
              >
                <span
                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                  style={{ left: on ? '22px' : '2px' }}
                />
              </button>

              {/* name (tap also toggles) */}
              <button onClick={() => toggleLayer(l.id)} className="flex items-center gap-2 flex-1 text-left">
                <span style={{ background: l.color }} className="w-2.5 h-2.5 rounded-full inline-block shrink-0" />
                <span className={`text-sm ${on ? 'text-stone-100' : 'text-stone-500'}`}>{l.name}</span>
              </button>

              {/* solo: isolate this layer for ~1.5s so you can spot it */}
              <button
                onClick={() => flashSolo(l.id)}
                className="px-2 h-8 rounded text-xs text-stone-400 bg-stone-800 active:bg-stone-700 shrink-0"
              >
                solo
              </button>
            </div>
          )
        })}
      </div>
      <p className="text-[11px] text-stone-500 mt-2">Switch = show/hide. Solo = flash just that layer for a moment.</p>
    </div>
  )
}
