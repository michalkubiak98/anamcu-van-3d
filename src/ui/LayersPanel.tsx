import { useVan } from '../state/VanContext'
import { LAYERS } from '../data/layers'

export function LayersPanel() {
  const { vis, toggleLayer, setAllLayers, flashSolo } = useVan()
  const allOn = LAYERS.every((l) => vis[l.id])
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 rounded-md bg-[#10140f] px-3 py-2">
        <button
          onClick={() => setAllLayers(!allOn)}
          role="switch"
          aria-checked={allOn}
          className="relative h-7 w-12 rounded-full bg-stone-800 transition-colors"
          style={{ background: allOn ? '#3f8f4f' : '#34382e' }}
        >
          <span
            className="absolute top-1 h-5 w-5 rounded-full bg-stone-100 transition-all"
            style={{ left: allOn ? '24px' : '4px' }}
          />
        </button>
        <button onClick={() => setAllLayers(!allOn)} className="flex-1 text-left text-sm font-medium text-stone-100">
          All layers
        </button>
      </div>

      <div className="space-y-1">
        {LAYERS.map((l) => {
          const on = vis[l.id]
          return (
            <div
              key={l.id}
              className={`flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors ${
                on ? 'bg-[#192016]' : 'bg-transparent'
              }`}
            >
              <button
                onClick={() => toggleLayer(l.id)}
                role="switch"
                aria-checked={on}
                className="relative h-6 w-11 shrink-0 rounded-full transition-colors"
                style={{ background: on ? l.color : '#34382e' }}
              >
                <span
                  className="absolute top-0.5 h-5 w-5 rounded-full bg-stone-100 transition-all"
                  style={{ left: on ? '22px' : '2px' }}
                />
              </button>

              <button onClick={() => toggleLayer(l.id)} className="flex flex-1 items-center gap-2 text-left">
                <span style={{ background: l.color }} className="inline-block h-2.5 w-2.5 shrink-0 rounded-full" />
                <span className={`text-sm ${on ? 'text-stone-100' : 'text-stone-500'}`}>{l.name}</span>
              </button>

              <button
                onClick={() => flashSolo(l.id)}
                className="h-8 shrink-0 rounded-md bg-[#24291f] px-2 text-xs text-stone-300 active:bg-[#31382a]"
              >
                solo 10s
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
