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
  const railColor = '#24824b'
  const nogginColor = '#4daf63'
  const socketColor = '#d69535'
  const archColor = '#62b66d'

  const parts: Part[] = []
  const timber = (
    id: string,
    label: string,
    pos: Vec3,
    size: Size,
    axis: Axis,
    layer: LayerId = 'floorFrame',
    opts: Partial<Part> = {},
  ) =>
    parts.push(box(id, layer, label, 'timber', pos, size, {
      axis,
      cut: { cutLength: size.l, profile, fromStock: true },
      ...opts,
    }))

  // central-channel rails (clear of the arches) - run the FULL length
  const innerP = inset
  const innerD = W - inset - bw
  const centre = (W - bw) / 2
  const labels = ['Main floor rail - passenger clear line', 'Main floor rail - centre spine', 'Main floor rail - driver clear line']
  ;[innerP, centre, innerD].forEach((x, i) =>
    timber(`rail-ch-${i}`, labels[i], { x, y: 0, z: 0 }, { l: length, w: bw, h: bh }, 'z', 'floorFrame', {
      color: railColor,
      notes: 'continuous front-to-back rail; splice the 2.4m stock with a proper staggered joint',
    }),
  )

  // outer wall rails - interrupted by the arch zone (front + rear segments)
  // these sit at the unmeasured full-width edge -> flagged approximate
  ;[{ x: 0, tag: 'P' }, { x: W - bw, tag: 'D' }].forEach(({ x, tag }) => {
    if (z0 > 0) timber(`rail-wall${tag}-front`, `Outer floor rail (${tag}) front`, { x, y: 0, z: 0 }, { l: z0, w: bw, h: bh }, 'z', 'floorFrame', {
      color: railColor,
      approximate: true,
      notes: 'outer edge depends on the real measured floor width',
    })
    if (length > z1) timber(`rail-wall${tag}-rear`, `Outer floor rail (${tag}) rear`, { x, y: 0, z: z1 }, { l: length - z1, w: bw, h: bh }, 'z', 'floorFrame', {
      color: railColor,
      approximate: true,
      notes: 'outer edge depends on the real measured floor width',
    })
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
      timber(`nog-${idx}-${i}`, `Cross noggin - line ${idx + 1}`, { x, y: 0, z }, { l: len, w: bw, h: bh }, 'x', 'floorFrame', {
        color: nogginColor,
        notes: 'short cross piece between long rails; add more where ply joins or sockets land',
      })
    }
  })

  // Extra bearers where the removable bath/table sockets are expected to land.
  // These are intentionally amber and approximate until the real leg footprints
  // arrive. In the build, move each one so the socket screws bite into solid timber.
  const socketBearer = (id: string, label: string, x: number, z: number, l: number, note: string) =>
    timber(id, label, { x, y: 0, z }, { l, w: bw, h: bh }, 'x', 'socketBearers', {
      color: socketColor,
      approximate: true,
      notes: `${note} - move to the real foot line before drilling sockets`,
    })

  const tableX0 = 0
  const tableW = Math.min(760, W)
  socketBearer('socket-table-front', 'Table socket bearer - front pair', tableX0, 1320, tableW, 'support under front table sockets')
  socketBearer('socket-table-rear', 'Table socket bearer - rear pair', tableX0, 2380, tableW, 'support under rear table sockets')

  const bathW = Math.min(spec.fixtures.bath.l + 2 * bw, W)
  const bathX0 = Math.max(0, (W - bathW) / 2)
  socketBearer('socket-bath-front', 'Bath socket bearer - front pair', bathX0, 3580, bathW, 'support under front bath sockets')
  socketBearer('socket-bath-rear', 'Bath socket bearer - rear pair', bathX0, 4130, bathW, 'support under rear bath sockets')

  // 18mm ply subfloor - three flat panels (front, rear, central channel over arches)
  const ply = (id: string, x: number, w: number, z: number, l: number, note?: string, approx = false) =>
    parts.push(box(id, 'floorPly', '18mm ply subfloor', 'panel', { x, y: bh, z }, { l, w, h: ff.ply }, { axis: 'z', opacity: 0.55, notes: note, approximate: approx || undefined }))
  ply('floor-ply-front', 0, W, 0, z0, 'full width is a guess - measure wall-to-wall at the floor', true)
  ply('floor-ply-rear', 0, W, z1, length - z1, 'full width is a guess - measure wall-to-wall at the floor', true)
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
    timber(`archbox-${a.tag}-railOut`, `Arch box rail (${a.side} outer)`, { x: a.x0, y, z: z0 }, { l: archLen, w: bw, h: bh }, 'z', 'archBoxes', {
      color: archColor,
      approximate: true,
    })
    timber(`archbox-${a.tag}-railIn`, `Arch box rail (${a.side} inner)`, { x: a.x0 + inset - bw, y, z: z0 }, { l: archLen, w: bw, h: bh }, 'z', 'archBoxes', {
      color: archColor,
      approximate: true,
    })
    // corner posts down to the floor
    ;[[a.x0, z0], [a.x0 + inset - bw, z0], [a.x0, z1 - bw], [a.x0 + inset - bw, z1 - bw]].forEach((c, ci) =>
      timber(`archbox-${a.tag}-post-${ci}`, `Arch box post (${a.side})`, { x: c[0], y: 0, z: c[1] }, { l: archH, w: bw, h: bh }, 'y', 'archBoxes', {
        color: archColor,
        approximate: true,
      }),
    )
    parts.push(box(`archbox-${a.tag}-top`, 'archBoxes', `Arch box platform (${a.side})`, 'panel',
      { x: a.x0, y: y + bh, z: z0 }, { l: archLen, w: inset, h: ff.ply },
      { axis: 'z', color: '#5fae6a', opacity: 0.6, approximate: true, notes: 'storage platform over the wheel arch (width depends on the unmeasured floor width)' }))
  })

  return parts
}

// finished floor surface height (bearer + ply) - where low-level fixtures sit.
export const floorTop = (spec: VanSpec) => spec.floorFrame.bearerH + spec.floorFrame.ply
