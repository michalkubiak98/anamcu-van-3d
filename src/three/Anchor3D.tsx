import { Html } from '@react-three/drei'
import type { LabelAnchor } from '../model/types'

const MM = 0.001

// Fixed label pinned to a 3D point - tracks the camera as you orbit.
export function Anchor3D({ a }: { a: LabelAnchor }) {
  return (
    <Html
      position={[a.position.x * MM, a.position.y * MM, a.position.z * MM]}
      center
      style={{ pointerEvents: 'none' }}
      zIndexRange={[10, 0]}
    >
      <div
        style={{
          background: 'rgba(20,26,18,0.82)',
          border: '1px solid #2c4034',
          borderRadius: 6,
          padding: '3px 8px',
          color: '#c8a56c',
          font: '600 12px system-ui',
          whiteSpace: 'nowrap',
          textAlign: 'center',
        }}
      >
        {a.text}
        {a.sub && <div style={{ color: '#8a9684', fontWeight: 400, fontSize: 10 }}>{a.sub}</div>}
      </div>
    </Html>
  )
}
