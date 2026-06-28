import { useState } from 'react'
import { LayersPanel } from './LayersPanel'
import { DimensionsPanel } from './DimensionsPanel'
import { CutListPanel } from './CutListPanel'

type Tab = 'layers' | 'dims' | 'cut'
const TABS: { id: Tab; name: string }[] = [
  { id: 'layers', name: 'Layers' },
  { id: 'dims', name: 'Dimensions' },
  { id: 'cut', name: 'Cut list' },
]

export function BottomSheet() {
  const [tab, setTab] = useState<Tab>('layers')
  const [open, setOpen] = useState(true)

  return (
    <div
      className="fixed left-0 right-0 bottom-0 z-10 bg-[#161a12]/95 backdrop-blur border-t border-[#2c4034] rounded-t-2xl"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center gap-1 px-2 pt-2">
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-10 h-9 rounded text-stone-400 active:bg-stone-800"
          aria-label={open ? 'collapse' : 'expand'}
        >
          {open ? 'v' : '^'}
        </button>
        <div className="flex gap-1 flex-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTab(t.id)
                setOpen(true)
              }}
              className={`flex-1 h-9 rounded text-sm font-medium ${
                tab === t.id ? 'bg-[#2c4034] text-stone-100' : 'text-stone-400 active:bg-stone-800'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {open && (
        <div className="px-3 pb-3 pt-2 overflow-y-auto" style={{ maxHeight: '54vh' }}>
          {tab === 'layers' && <LayersPanel />}
          {tab === 'dims' && <DimensionsPanel />}
          {tab === 'cut' && <CutListPanel />}
        </div>
      )}
    </div>
  )
}
