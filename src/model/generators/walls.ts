import type { VanSpec, Part, Axis, Vec3, Size } from '../types'
import { box } from '../geometry'

// Side-wall framing: 45x35 battens on each side wall (vertical studs + 3
// horizontal rails). Indicative layout - the real battens land on the van's
// inner ribs (confirm spacing on site).
export function genWalls(spec: VanSpec): Part[] {
  const fr = spec.framing
  const bw = fr.battenW
  const bh = fr.battenH
  const len = spec.shell.length
  const H = spec.shell.heightRibToFloor
  const raftW = spec.floorFrame.raftWidth
  const profile = '45x35'
  const parts: Part[] = []

  const timber = (id: string, label: string, position: Vec3, size: Size, axis: Axis) =>
    parts.push(box(id, 'walls', label, 'timber', position, size, {
      axis,
      cut: { cutLength: size.l, profile, fromStock: true },
      approximate: true,
      notes: 'indicative only - land wall battens on the real inner ribs and fixing points',
    }))

  // sideX = x of the batten's outer face; battens protrude bw into the room
  const sides: [string, number][] = [
    ['passenger', 0],
    ['driver', raftW - bw],
  ]

  for (const [side, sx] of sides) {
    // vertical studs along the wall
    const zs: number[] = []
    for (let z = 0; z < len - bh; z += fr.wallStudSpacing) zs.push(z)
    zs.push(len - bh)
    zs.forEach((z, i) =>
      timber(`wall-${side}-stud-${i}`, `Wall stud (${side})`, { x: sx, y: 0, z }, { l: H, w: bw, h: bh }, 'y'),
    )
    // 3 horizontal rails (bottom / mid / top)
    const ys = [0, Math.round(H / 2), H - bh]
    ys.forEach((y, i) =>
      timber(`wall-${side}-rail-${i}`, `Wall rail (${side})`, { x: sx, y, z: 0 }, { l: len, w: bw, h: bh }, 'z'),
    )
  }

  return parts
}
