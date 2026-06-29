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
  const [open, setOpen] = useState(false)

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-10 rounded-t-xl bg-[#12170f]/95 shadow-2xl backdrop-blur"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center gap-1 px-2 pt-2">
        <button
          onClick={() => setOpen((o) => !o)}
          className="h-9 w-10 rounded-md text-stone-400 active:bg-[#24291f]"
          aria-label={open ? 'collapse' : 'expand'}
        >
          {open ? 'v' : '^'}
        </button>
        <div className="flex flex-1 gap-1 rounded-md bg-[#0b0f0a] p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTab(t.id)
                setOpen(true)
              }}
              className={`h-8 flex-1 rounded text-sm font-medium ${
                tab === t.id ? 'bg-[#2c4034] text-stone-100' : 'text-stone-500 active:bg-[#1b2118]'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {open && (
        <div className="overflow-y-auto px-3 pb-3 pt-2" style={{ maxHeight: '60vh' }}>
          {tab === 'layers' && <LayersPanel />}
          {tab === 'dims' && <DimensionsPanel />}
          {tab === 'cut' && <CutListPanel />}
        </div>
      )}
    </div>
  )
}
