import type { ThreeEvent } from '@react-three/fiber'
import type { Part } from '../model/types'
import { worldDims, worldCenter } from '../model/geometry'
import { LAYER_COLOR } from '../data/layers'
import { useSelection } from '../state/SelectionContext'
import { useIsTouch } from '../hooks/useIsTouch'

const MM = 0.001
const noRaycast = () => null

export function PartMesh({ part }: { part: Part }) {
  const { selectedId, hoveredId, select, hover } = useSelection()
  const touch = useIsTouch()

  const [dx, dy, dz] = worldDims(part.size, part.axis)
  const c = worldCenter(part)
  const op = part.opacity ?? 1
  const active = selectedId === part.id || hoveredId === part.id
  const color = active ? '#ffd27a' : part.color ?? LAYER_COLOR[part.layerId]

  // the big translucent shell envelope must not block clicks on inner parts
  const nonInteractive = part.kind === 'shell' && op < 0.1

  return (
    <mesh
      position={[c[0] * MM, c[1] * MM, c[2] * MM]}
      raycast={nonInteractive ? noRaycast : undefined}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        if (touch || nonInteractive) return
        e.stopPropagation()
        hover(part.id)
      }}
      onPointerOut={() => {
        if (!touch) hover(null)
      }}
      onPointerDown={(e: ThreeEvent<PointerEvent>) => {
        if (nonInteractive) return
        e.stopPropagation()
        select(part.id)
      }}
    >
      <boxGeometry args={[Math.max(dx, 1) * MM, Math.max(dy, 1) * MM, Math.max(dz, 1) * MM]} />
      <meshStandardMaterial
        color={color}
        transparent={op < 1}
        opacity={op}
        roughness={0.85}
        metalness={0}
        emissive={active ? '#5a3a00' : '#000000'}
      />
    </mesh>
  )
}
