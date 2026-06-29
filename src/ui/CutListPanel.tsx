import { useMemo } from 'react'
import { useVan } from '../state/VanContext'
import { useSelection } from '../state/SelectionContext'
import { LAYER_COLOR } from '../data/layers'
import type { CutListGroup, CutPiece, Part } from '../model/types'

interface CutFamily {
  key: string
  label: string
  length: number
  qty: number
  partId: string
  part?: Part
}

export function CutListPanel() {
  const { cutList, parts } = useVan()
  const { selectedId, select } = useSelection()
  const partMap = useMemo(() => new Map(parts.map((p) => [p.id, p])), [parts])

  return (
    <div className="space-y-4 text-sm">
      {cutList.groups.map((g) => {
        const families = cutFamilies(g, partMap)
        return (
          <section key={g.profile} className="space-y-2">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-semibold text-stone-100">{g.label}</h3>
              <span className={g.shortBy > 0 ? 'font-medium text-red-400' : 'font-medium text-green-400'}>
                {g.totalSticks} / {g.stockAvailable} sticks
              </span>
            </div>
            {g.shortBy > 0 && <div className="text-xs text-red-400">short by {g.shortBy} sticks</div>}
            <div className="text-xs text-stone-500">
              {(g.totalLinear / 1000).toFixed(1)} m, {g.totalPieces} cuts, offcut {(g.totalOffcut / 1000).toFixed(2)} m
            </div>

            <div className="space-y-1.5">
              {families.map((f) => (
                <button
                  key={f.key}
                  onClick={() => select(f.partId)}
                  className={`flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left transition-colors ${
                    selectedId === f.partId ? 'bg-[#2c4034]' : 'bg-[#10140f] active:bg-[#192016]'
                  }`}
                >
                  <IsoPiece part={f.part} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-stone-100">{cleanLabel(f.label)}</div>
                    <div className="text-xs text-stone-500">
                      {f.length} mm x {f.qty}
                    </div>
                  </div>
                  {f.part && (
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: f.part.color ?? LAYER_COLOR[f.part.layerId] }}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="space-y-1.5 pt-1">
              {g.sticks.map((s) => (
                <div key={s.index} className="rounded-md bg-[#10140f] px-2.5 py-2">
                  <div className="mb-1 flex justify-between text-xs text-stone-500">
                    <span>stick {s.index}</span>
                    <span>offcut {Math.round(s.offcut)} mm</span>
                  </div>
                  <div className="flex h-5 overflow-hidden rounded-sm bg-[#0b0f0a]">
                    {s.pieces.map((p, i) => {
                      const part = partMap.get(p.partId)
                      return (
                        <button
                          key={`${p.partId}-${i}`}
                          onClick={() => select(p.partId)}
                          title={`${cleanLabel(p.label)} ${Math.round(p.length)} mm`}
                          className="h-full min-w-1"
                          style={{
                            width: `${Math.max(2, (p.length / s.stockLength) * 100)}%`,
                            background: part?.color ?? (part ? LAYER_COLOR[part.layerId] : '#4b5563'),
                          }}
                        />
                      )
                    })}
                    {s.offcut > 0 && (
                      <div
                        className="h-full bg-stone-800/70"
                        style={{ width: `${Math.max(2, (s.offcut / s.stockLength) * 100)}%` }}
                      />
                    )}
                  </div>
                  <div className="mt-1 truncate text-[11px] text-stone-500">
                    {s.pieces.map((p) => Math.round(p.length)).join(' + ')}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      })}

      {cutList.sheets.length > 0 && (
        <section>
          <h3 className="font-semibold text-stone-100">Sheet goods</h3>
          <div className="mt-1 space-y-1">
            {cutList.sheets.map((s) => (
              <div key={s.material} className="flex justify-between rounded-md bg-[#10140f] px-2.5 py-2 text-xs">
                <span className="text-stone-200">{s.material}</span>
                <span className="text-stone-500">
                  {s.sheetsNeeded} / {s.sheetsAvailable} sheets, {s.sheet}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function cutFamilies(g: CutListGroup, partMap: Map<string, Part>): CutFamily[] {
  const m = new Map<string, CutFamily>()
  const pieces: CutPiece[] = g.sticks.flatMap((s) => s.pieces)
  for (const p of pieces) {
    const length = Math.round(p.length)
    const label = cleanLabel(p.label)
    const key = `${label}-${length}`
    const cur = m.get(key)
    if (cur) {
      cur.qty += 1
    } else {
      m.set(key, { key, label, length, qty: 1, partId: p.partId, part: partMap.get(p.partId) })
    }
  }
  return [...m.values()].sort((a, b) => b.length - a.length || a.label.localeCompare(b.label))
}

function cleanLabel(label: string) {
  return label
    .replace(/\s+\((full stick|offcut piece)\)$/i, '')
    .replace(/\s+-\s+line\s+\d+$/i, '')
    .replace(/\s+\d+$/i, '')
}

function IsoPiece({ part }: { part?: Part }) {
  const color = part ? part.color ?? LAYER_COLOR[part.layerId] : '#64748b'
  const l = part ? Math.max(part.size.l, part.size.w, part.size.h) : 1
  const t = part ? Math.min(part.size.l, part.size.w, part.size.h) : 1
  const long = Math.min(54, Math.max(22, l / 55))
  const thick = Math.min(16, Math.max(6, t / 9))

  return (
    <div className="relative h-10 w-16 shrink-0">
      <div
        className="absolute left-2 top-3 h-3 rounded-sm opacity-90"
        style={{
          width: long,
          height: thick,
          background: color,
          transform: 'skewY(-18deg)',
          transformOrigin: 'left center',
        }}
      />
      <div
        className="absolute left-3 top-2 h-2 rounded-sm opacity-60"
        style={{
          width: long,
          background: color,
          transform: 'skewX(-28deg)',
          transformOrigin: 'left center',
        }}
      />
      <div
        className="absolute top-3 rounded-sm opacity-50"
        style={{
          left: long + 8,
          width: 9,
          height: thick,
          background: color,
          transform: 'skewY(-18deg)',
        }}
      />
    </div>
  )
}
