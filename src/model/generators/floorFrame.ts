import type { VanSpec, Part } from '../types'
import { box } from '../geometry'

// Port of gen_floor_frame.py: a 3-rail + cross-noggin raft in 70x40 laid flat,
// PIR between bearers, 18mm ply on top. Everything derived from the spec so
// editing raftWidth/raftLength/bearerW updates rails, noggins and the cut list.
export function genFloorFrame(spec: VanSpec): Part[] {
  const f = spec.floorFrame
  const { bearerW, bearerH, raftLength, raftWidth } = f
  const profile = '70x40'

  // 3 longitudinal rails: passenger edge, centre, driver edge.
  const railXs = [0, (raftWidth - bearerW) / 2, raftWidth - bearerW]
  const nogginLen = railXs[1] - bearerW // gap between adjacent rails
  const joined = raftLength > 2400

  const parts: Part[] = []
  const railNames = ['passenger', 'centre', 'driver']
  railXs.forEach((x, i) => {
    parts.push(
      box(`rail-${railNames[i]}`, 'floorFrame', `${cap(railNames[i])} rail`, 'timber',
        { x, y: 0, z: 0 },
        { l: raftLength, w: bearerW, h: bearerH },
        {
          axis: 'z',
          cut: { cutLength: raftLength, profile, fromStock: true },
          notes: joined ? `joined from 2.4m sticks over a noggin` : undefined,
        }),
    )
  })

  // cross-noggins: 2 per line (between rail0-rail1 and rail1-rail2), clamped to the tail.
  const seen = new Set<number>()
  f.crossLines.forEach((line, idx) => {
    const z = Math.min(line, raftLength - bearerW)
    if (seen.has(z)) return
    seen.add(z)
    const bays = [
      { x: bearerW, side: 'L' },
      { x: railXs[1] + bearerW, side: 'R' },
    ]
    bays.forEach((b) => {
      parts.push(
        box(`nog-${idx}-${b.side}`, 'floorFrame', `Cross noggin (line ${idx + 1})`, 'timber',
          { x: b.x, y: 0, z },
          { l: nogginLen, w: bearerW, h: bearerH },
          { axis: 'x', cut: { cutLength: nogginLen, profile, fromStock: true } }),
      )
    })
  })

  // floor PIR: 2 long slabs filling the channels between the rails (visual approximation,
  // not split by noggins). kind=panel.
  ;[0, 1].forEach((ch) => {
    const x = railXs[ch] + bearerW
    parts.push(
      box(`floorpir-${ch}`, 'floorPIR', `Floor PIR (channel ${ch + 1})`, 'panel',
        { x, y: 0, z: 0 },
        { l: raftLength, w: nogginLen, h: f.pir },
        { axis: 'z', opacity: 0.4, notes: 'cut to fit between bearers' }),
    )
  })

  // 18mm ply subfloor on top of the bearers.
  parts.push(
    box('floor-ply', 'floorPly', '18mm ply subfloor', 'panel',
      { x: 0, y: bearerH, z: 0 },
      { l: raftLength, w: raftWidth, h: f.ply },
      { axis: 'z', opacity: 0.55 }),
  )

  return parts
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

// finished floor surface height (bearer + ply) - where fixtures sit.
export const floorTop = (spec: VanSpec) => spec.floorFrame.bearerH + spec.floorFrame.ply
