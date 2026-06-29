interface Props {
  label: string
  value: number
  onChange: (v: number) => void
  path: string
  step?: number
  approximate?: boolean
  note?: string
}

export function NumberField({ label, value, onChange, path, step = 10, approximate, note }: Props) {
  const set = (v: number) => onChange(Math.max(0, Math.round(v)))
  return (
    <div className="rounded-md bg-[#10140f] px-2.5 py-2">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-sm text-stone-100">
            <span className="truncate">{label}</span>
            {approximate && (
              <span className="rounded bg-amber-900/60 px-1 py-0.5 text-[10px] text-amber-300">approx</span>
            )}
          </div>
          <div className="mt-0.5 text-[10px] text-stone-500">{path}</div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={() => set(value - step)}
            className="h-9 w-9 rounded-md bg-[#24291f] text-lg leading-none text-stone-200 active:bg-[#31382a]"
          >
            -
          </button>
          <input
            inputMode="numeric"
            value={value}
            onChange={(e) => set(Number(e.target.value) || 0)}
            className="h-9 w-20 rounded-md bg-[#0b0f0a] text-center text-stone-100 outline-none ring-1 ring-stone-800 focus:ring-[#c8a56c]"
          />
          <button
            onClick={() => set(value + step)}
            className="h-9 w-9 rounded-md bg-[#24291f] text-lg leading-none text-stone-200 active:bg-[#31382a]"
          >
            +
          </button>
        </div>
      </div>
      {note && <div className="mt-1 text-[11px] leading-snug text-stone-400">{note}</div>}
    </div>
  )
}
