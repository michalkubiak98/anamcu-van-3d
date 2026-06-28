import type { VanSpec, Part, Axis, Vec3, Size } from '../types'
import { box } from '../geometry'

// The cabin separator wall must be BUILT (decided 2026-06-28) - it does not exist
// yet. A 45x35 stud frame at the front (z=0) + a 12mm ply skin. It is the datum
// all longitudinal measurements start from.
export function genSeparatorWall(spec: VanSpec): Part[] {
  const fr = spec.framing
  const bw = fr.battenW
  const bh = fr.battenH
  const W = spec.floorFrame.raftWidth
  const H = spec.shell.heightRibToFloor
  const profile = '45x35'
  const parts: Part[] = []

  const timber = (id: string, label: string, position: Vec3, size: Size, axis: Axis) =>
    parts.push(box(id, 'separatorWall', label, 'timber', position, size, {
      axis,
      cut: { cutLength: size.l, profile, fromStock: true },
    }))

  // top + bottom plates (run across, along x)
  timber('sep-plate-bottom', 'Separator bottom plate', { x: 0, y: 0, z: 0 }, { l: W, w: bh, h: bw }, 'x')
  timber('sep-plate-top', 'Separator top plate', { x: 0, y: H - bw, z: 0 }, { l: W, w: bh, h: bw }, 'x')

  // vertical studs between the plates
  const studLen = H - 2 * bw
  const xs: number[] = []
  for (let x = 0; x < W - bw; x += fr.separatorStudSpacing) xs.push(x)
  xs.push(W - bw)
  xs.forEach((x, i) =>
    timber(`sep-stud-${i}`, `Separator stud ${i + 1}`, { x, y: bw, z: 0 }, { l: studLen, w: bw, h: bh }, 'y'),
  )

  // 12mm ply skin (cabin side)
  parts.push(
    box('sep-ply', 'separatorWall', 'Separator ply (12mm)', 'panel',
      { x: 0, y: 0, z: bh },
      { l: W, w: fr.wallPly, h: H },
      { axis: 'x', color: '#b88a52', opacity: 0.4, notes: 'insulate + vapour-seal behind it' }),
  )

  return parts
}
