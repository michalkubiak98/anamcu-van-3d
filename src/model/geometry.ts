import type { Part, Size, Axis, Vec3, LayerId, PartKind } from './types'

// World bounding-box dimensions [x, y, z] for a part, given its size + axis.
// l runs along `axis`; the other two map to the remaining world axes.
export function worldDims(size: Size, axis: Axis = 'z'): [number, number, number] {
  switch (axis) {
    case 'x':
      return [size.l, size.h, size.w]
    case 'y':
      return [size.w, size.l, size.h]
    default: // 'z'
      return [size.w, size.h, size.l]
  }
}

// Centre of the box in world space (three.js wants centre, data stores min-corner).
export function worldCenter(p: Part): [number, number, number] {
  const [dx, dy, dz] = worldDims(p.size, p.axis)
  return [p.position.x + dx / 2, p.position.y + dy / 2, p.position.z + dz / 2]
}

// Concise part builder.
export function box(
  id: string,
  layerId: LayerId,
  label: string,
  kind: PartKind,
  position: Vec3,
  size: Size,
  opts: Partial<Part> = {},
): Part {
  return { id, layerId, label, kind, position, size, ...opts }
}
