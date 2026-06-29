import * as THREE from 'three'
import { Edges } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import type { Part } from '../model/types'
import { worldDims, worldCenter } from '../model/geometry'
import { LAYER_COLOR } from '../data/layers'
import { useSelection } from '../state/SelectionContext'
import { useIsTouch } from '../hooks/useIsTouch'

const MM = 0.001
const noRaycast = () => null

// Timber + panels render solid; envelopes (shell, arches, fixtures, tanks) render
// as a wireframe box + a very faint fill with depthWrite OFF. Wireframe edges are
// opaque lines that never vanish, so rotating no longer makes parts disappear, and
// overlaps stay readable because you can see through the boxes.
export function PartMesh({ part }: { part: Part }) {
  const { selectedId, hoveredId, select, hover } = useSelection()
  const touch = useIsTouch()

  const [dx, dy, dz] = worldDims(part.size, part.axis)
  const c = worldCenter(part)
  const active = selectedId === part.id || hoveredId === part.id
  const base = part.color ?? LAYER_COLOR[part.layerId]

  const isEnvelope = part.kind === 'fixture' || part.kind === 'tank' || part.kind === 'shell'
  const nonInteractive = part.kind === 'shell' && (part.opacity ?? 1) <= 0.06
  const fillOpacity = isEnvelope ? (active ? 0.22 : 0.08) : part.opacity ?? 1
  const edgeColor = active ? '#ffd27a' : part.approximate ? '#e0a23c' : isEnvelope ? base : '#0c0f0a'

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
        color={active ? '#ffe9b0' : base}
        transparent={fillOpacity < 1}
        opacity={fillOpacity}
        depthWrite={!isEnvelope}
        side={isEnvelope ? THREE.DoubleSide : THREE.FrontSide}
        roughness={0.85}
        metalness={0}
        emissive={active ? '#5a3a00' : '#000000'}
      />
      <Edges color={edgeColor} />
    </mesh>
  )
}
