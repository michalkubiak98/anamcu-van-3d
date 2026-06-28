import type { VanSpec, Part, LabelAnchor } from '../types'
import { box } from '../geometry'

// The van shell: a translucent reference envelope + the two wheel-arch blocks.
// Centred on the floor raft so the raft sits inside it.
export function genShell(spec: VanSpec): Part[] {
  const { length, widthAboveArches, heightRibToFloor, clearBetweenArches } = spec.shell
  const raftW = spec.floorFrame.raftWidth
  const cx = raftW / 2 // raft centre = van centreline
  const shellX0 = cx - widthAboveArches / 2

  const parts: Part[] = [
    box('shell-envelope', 'shell', 'Van shell (interior)', 'shell',
      { x: shellX0, y: 0, z: 0 },
      { l: length, w: widthAboveArches, h: heightRibToFloor },
      { opacity: 0.05, color: '#6b7b66' }),
  ]

  // wheel arches: from each side wall inboard to the clear line, in the arch zone.
  const archInboard = (widthAboveArches - clearBetweenArches) / 2 // ~220 each side
  const clearX0 = cx - clearBetweenArches / 2
  const clearX1 = cx + clearBetweenArches / 2
  const archZ0 = spec.zones.archStart
  const archLen = spec.zones.archEnd - spec.zones.archStart
  const archH = spec.wheelArches.height

  parts.push(
    box('arch-passenger', 'wheelArches', 'Wheel arch (passenger)', 'shell',
      { x: shellX0, y: 0, z: archZ0 },
      { l: archLen, w: archInboard, h: archH },
      { opacity: 0.55, color: '#5a6b58' }),
    box('arch-driver', 'wheelArches', 'Wheel arch (driver)', 'shell',
      { x: clearX1, y: 0, z: archZ0 },
      { l: archLen, w: archInboard, h: archH },
      { opacity: 0.55, color: '#5a6b58' }),
  )
  void clearX0
  return parts
}

// Fixed 3D labels (req: anchored in 3D space, move when dims edited).
export function genAnchors(spec: VanSpec): LabelAnchor[] {
  const { length, heightRibToFloor } = spec.shell
  const raftW = spec.floorFrame.raftWidth
  const cx = raftW / 2
  return [
    { id: 'front', text: 'FRONT', sub: 'cabin / separator', position: { x: cx, y: 120, z: 0 } },
    { id: 'rear', text: 'REAR', sub: 'back doors', position: { x: cx, y: 120, z: length } },
    { id: 'driver', text: 'DRIVER', sub: 'offside / right', position: { x: raftW, y: heightRibToFloor * 0.6, z: length / 2 } },
    { id: 'passenger', text: 'PASSENGER', sub: 'nearside / sliding door', position: { x: 0, y: heightRibToFloor * 0.6, z: length / 2 } },
  ]
}
