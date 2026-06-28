interface Props {
  label: string
  value: number
  onChange: (v: number) => void
  step?: number
  approximate?: boolean
}

export function NumberField({ label, value, onChange, step = 10, approximate }: Props) {
  const set = (v: number) => onChange(Math.max(0, Math.round(v)))
  return (
    <div className="flex items-center justify-between gap-2 py-1">
      <span className="text-sm text-stone-200 flex items-center gap-1.5">
        {label}
        {approximate && (
          <span className="text-[10px] px-1 py-0.5 rounded bg-amber-900/60 text-amber-300">approx</span>
        )}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => set(value - step)}
          className="w-10 h-10 rounded bg-stone-700 active:bg-stone-600 text-xl leading-none"
        >
          -
        </button>
        <input
          inputMode="numeric"
          value={value}
          onChange={(e) => set(Number(e.target.value) || 0)}
          className="w-16 h-10 text-center rounded bg-stone-900 border border-stone-700 text-stone-100"
        />
        <button
          onClick={() => set(value + step)}
          className="w-10 h-10 rounded bg-stone-700 active:bg-stone-600 text-xl leading-none"
        >
          +
        </button>
      </div>
    </div>
  )
}
