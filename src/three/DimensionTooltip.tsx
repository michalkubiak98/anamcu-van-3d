import { Html } from '@react-three/drei'
import type { Part } from '../model/types'
import { worldCenter } from '../model/geometry'

const MM = 0.001

// Dimension card pinned to the selected/hovered part. pointerEvents:none so it
// never eats an orbit drag.
export function DimensionTooltip({ part }: { part: Part }) {
  const c = worldCenter(part)
  const { l, w, h } = part.size
  return (
    <Html
      position={[c[0] * MM, c[1] * MM, c[2] * MM]}
      center
      style={{ pointerEvents: 'none' }}
      zIndexRange={[100, 0]}
    >
      <div
        style={{
          background: 'rgba(17,21,15,0.94)',
          border: '1px solid #c8a56c',
          borderRadius: 8,
          padding: '7px 10px',
          color: '#e8e4d8',
          font: '13px/1.45 system-ui',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ fontWeight: 700, color: '#ffd27a' }}>{part.label}</div>
        <div>
          {fmt(l)} x {fmt(w)} x {fmt(h)} mm
        </div>
        {part.cut && <div style={{ color: '#9fd6a8' }}>cut length {fmt(part.cut.cutLength)} mm ({part.cut.profile})</div>}
        {part.approximate && <div style={{ color: '#e0a23c' }}>approximate - verify</div>}
        {part.notes && <div style={{ color: '#8a9684', fontSize: 11, whiteSpace: 'normal', maxWidth: 220 }}>{part.notes}</div>}
      </div>
    </Html>
  )
}

const fmt = (n: number) => Math.round(n).toString()
