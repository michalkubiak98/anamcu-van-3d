import { useVan } from '../state/VanContext'

export function CutListPanel() {
  const { cutList } = useVan()
  return (
    <div className="space-y-4 text-sm">
      {cutList.groups.map((g) => (
        <div key={g.profile}>
          <div className="flex justify-between items-baseline">
            <h3 className="font-semibold text-stone-100">{g.label}</h3>
            <span className={g.shortBy > 0 ? 'text-red-400 font-medium' : 'text-green-400 font-medium'}>
              {g.totalSticks} / {g.stockAvailable} sticks
            </span>
          </div>
          {g.shortBy > 0 && <div className="text-red-400 text-xs">short by {g.shortBy} sticks - buy more</div>}
          <div className="text-stone-400 text-xs mb-1">
            {(g.totalLinear / 1000).toFixed(1)} m, {g.totalPieces} pieces, offcut {(g.totalOffcut / 1000).toFixed(2)} m
          </div>
          <ul className="text-stone-300">
            {g.byLength.map((t) => (
              <li key={t.length} className="flex justify-between border-b border-stone-800/60 py-0.5">
                <span>{t.length} mm</span>
                <span className="text-stone-400">x {t.qty}</span>
              </li>
            ))}
          </ul>
          <details className="mt-1">
            <summary className="text-stone-400 text-xs cursor-pointer">stick-by-stick packing</summary>
            <ol className="text-xs text-stone-400 mt-1 space-y-0.5">
              {g.sticks.map((s) => (
                <li key={s.index}>
                  #{s.index}: {s.pieces.map((p) => Math.round(p.length)).join(' + ')}{' '}
                  <span className="text-stone-600">(offcut {Math.round(s.offcut)})</span>
                </li>
              ))}
            </ol>
          </details>
        </div>
      ))}

      {cutList.sheets.length > 0 && (
        <div>
          <h3 className="font-semibold text-stone-100">Sheet goods (approx, no nesting)</h3>
          <ul className="text-stone-300 text-xs mt-1">
            {cutList.sheets.map((s) => (
              <li key={s.material} className="flex justify-between border-b border-stone-800/60 py-0.5">
                <span>{s.material}</span>
                <span className="text-stone-400">
                  {s.sheetsNeeded} / {s.sheetsAvailable} sheets
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
