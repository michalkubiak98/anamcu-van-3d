import type { VanSpec, Part, Axis, Vec3, Size, LayerId } from '../types'
import { box } from '../geometry'

// Floor frame, FULL WIDTH (wall to wall). The van's wheel arches are BOXED OVER
// (storage platforms on top of each arch) instead of the frame stopping at them
// and wasting the side space. The walkway is the central channel between the
// arches; the front and rear zones (no arches) are full-width flat floor.
export function genFloorFrame(spec: VanSpec): Part[] {
  const ff = spec.floorFrame
  const { bearerW: bw, bearerH: bh, raftLength: length, raftWidth: W } = ff
  const clear = spec.wheelArches.clearBetween
  const archH = spec.wheelArches.height
  const z0 = spec.zones.archStart
  const z1 = spec.zones.archEnd
  const profile = '70x40'
  const inset = Math.max((W - clear) / 2, bw) // arch footprint width each side

  const parts: Part[] = []
  const timber = (id: string, label: string, pos: Vec3, size: Size, axis: Axis, layer: LayerId = 'floorFrame') =>
    parts.push(box(id, layer, label, 'timber', pos, size, { axis, cut: { cutLength: size.l, profile, fromStock: true } }))

  // central-channel rails (clear of the arches) - run the FULL length
  const innerP = inset
  const innerD = W - inset - bw
  const centre = (W - bw) / 2
  const labels = ['Channel rail (passenger)', 'Centre rail', 'Channel rail (driver)']
  ;[innerP, centre, innerD].forEach((x, i) =>
    timber(`rail-ch-${i}`, labels[i], { x, y: 0, z: 0 }, { l: length, w: bw, h: bh }, 'z'),
  )

  // outer wall rails - interrupted by the arch zone (front + rear segments)
  ;[{ x: 0, tag: 'P' }, { x: W - bw, tag: 'D' }].forEach(({ x, tag }) => {
    if (z0 > 0) timber(`rail-wall${tag}-front`, `Wall rail (${tag}) front`, { x, y: 0, z: 0 }, { l: z0, w: bw, h: bh }, 'z')
    if (length > z1) timber(`rail-wall${tag}-rear`, `Wall rail (${tag}) rear`, { x, y: 0, z: z1 }, { l: length - z1, w: bw, h: bh }, 'z')
  })

  // cross noggins: full width in the front/rear zones, channel-only over the arches
  const seen = new Set<number>()
  ff.crossLines.forEach((line, idx) => {
    const z = Math.min(line, length - bw)
    if (seen.has(z)) return
    seen.add(z)
    const inArch = z >= z0 && z <= z1
    const edges = inArch ? [innerP, centre, innerD] : [0, innerP, centre, innerD, W - bw]
    for (let i = 0; i < edges.length - 1; i++) {
      const x = edges[i] + bw
      const len = edges[i + 1] - x
      if (len <= 0) continue
      timber(`nog-${idx}-${i}`, `Cross noggin (line ${idx + 1})`, { x, y: 0, z }, { l: len, w: bw, h: bh }, 'x')
    }
  })

  // 18mm ply subfloor - three flat panels (front, rear, central channel over arches)
  const ply = (id: string, x: number, w: number, z: number, l: number, note?: string) =>
    parts.push(box(id, 'floorPly', '18mm ply subfloor', 'panel', { x, y: bh, z }, { l, w, h: ff.ply }, { axis: 'z', opacity: 0.55, notes: note }))
  ply('floor-ply-front', 0, W, 0, z0)
  ply('floor-ply-rear', 0, W, z1, length - z1)
  ply('floor-ply-channel', innerP, innerD + bw - innerP, z0, z1 - z0, 'walkway channel between the arches')

  // floor PIR between the channel rails (simplified)
  ;[innerP, centre].forEach((x, i) =>
    parts.push(box(`floorpir-${i}`, 'floorPIR', `Floor PIR (channel ${i + 1})`, 'panel',
      { x: x + bw, y: 0, z: 0 }, { l: length, w: centre - innerP - bw, h: ff.pir }, { axis: 'z', opacity: 0.4, notes: 'cut to fit between bearers' })),
  )

  // BOX OVER each wheel arch: a frame at arch height carrying a storage platform
  const archLen = z1 - z0
  ;[{ x0: 0, tag: 'P', side: 'passenger' }, { x0: W - inset, tag: 'D', side: 'driver' }].forEach((a) => {
    const y = archH
    timber(`archbox-${a.tag}-railOut`, `Arch box rail (${a.side} outer)`, { x: a.x0, y, z: z0 }, { l: archLen, w: bw, h: bh }, 'z', 'archBoxes')
    timber(`archbox-${a.tag}-railIn`, `Arch box rail (${a.side} inner)`, { x: a.x0 + inset - bw, y, z: z0 }, { l: archLen, w: bw, h: bh }, 'z', 'archBoxes')
    // corner posts down to the floor
    ;[[a.x0, z0], [a.x0 + inset - bw, z0], [a.x0, z1 - bw], [a.x0 + inset - bw, z1 - bw]].forEach((c, ci) =>
      timber(`archbox-${a.tag}-post-${ci}`, `Arch box post (${a.side})`, { x: c[0], y: 0, z: c[1] }, { l: archH, w: bw, h: bh }, 'y', 'archBoxes'),
    )
    parts.push(box(`archbox-${a.tag}-top`, 'archBoxes', `Arch box platform (${a.side})`, 'panel',
      { x: a.x0, y: y + bh, z: z0 }, { l: archLen, w: inset, h: ff.ply },
      { axis: 'z', color: '#5fae6a', opacity: 0.6, notes: 'storage platform over the wheel arch' }))
  })

  return parts
}

// finished floor surface height (bearer + ply) - where low-level fixtures sit.
export const floorTop = (spec: VanSpec) => spec.floorFrame.bearerH + spec.floorFrame.ply
