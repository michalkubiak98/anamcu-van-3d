import type { VanSpec, Part, Axis, Vec3, Size } from '../types'
import { box } from '../geometry'

// Ceiling: the van's existing roof RIDGES (ribs) as context, plus the 45x35
// battens that bond front-to-back across the ribs and the 12mm ply skin.
// PIR sits in the rib valleys (not drawn yet).
export function genCeiling(spec: VanSpec): Part[] {
  const fr = spec.framing
  const bw = fr.battenW
  const bh = fr.battenH
  const len = spec.shell.length
  const H = spec.shell.heightRibToFloor
  const raftW = spec.floorFrame.raftWidth
  const parts: Part[] = []

  // existing roof ribs (the "ridges") - transverse, ~50mm proud, context only.
  // 1940 is measured TO the rib (the proud low point), so the rib face sits at H
  // and its body extends UP into the roof; battens + ply hang BELOW H. (Earlier
  // this subtracted the rib height first, understating headroom by ~50mm.)
  const ribY = H
  const ribZs: number[] = []
  for (let z = fr.ceilingRibSpacing / 2; z < len; z += fr.ceilingRibSpacing) ribZs.push(z)
  ribZs.forEach((z, i) =>
    parts.push(
      box(`rib-${i}`, 'ceilingRidges', `Roof rib ${i + 1}`, 'shell',
        { x: 0, y: ribY, z }, { l: raftW, w: 30, h: fr.ceilingRibHeight },
        { axis: 'x', color: '#7a8a72', opacity: 0.5, approximate: true, notes: 'existing van roof rib spacing is approximate; PIR goes in the valley' }),
    ),
  )

  // battens bonded across the ribs, running front-to-back (cut from 45x35)
  const battenY = ribY - bh
  const xs: number[] = []
  for (let x = 0; x < raftW - bw; x += fr.ceilingBattenSpacing) xs.push(x)
  xs.push(raftW - bw)
  const timber = (id: string, label: string, position: Vec3, size: Size, axis: Axis) =>
    parts.push(box(id, 'ceiling', label, 'timber', position, size, {
      axis,
      cut: { cutLength: size.l, profile: '45x35', fromStock: true },
      approximate: true,
      notes: 'indicative only - glue front-to-back battens onto the real roof ribs',
    }))
  xs.forEach((x, i) =>
    timber(`ceil-batten-${i}`, `Ceiling batten ${i + 1}`, { x, y: battenY, z: 0 }, { l: len, w: bw, h: bh }, 'z'),
  )

  // 12mm ply ceiling skin under the battens
  parts.push(
    box('ceil-ply', 'ceiling', 'Ceiling ply (12mm)', 'panel',
      { x: 0, y: battenY - fr.ceilingPly, z: 0 },
      { l: len, w: raftW, h: fr.ceilingPly },
      { axis: 'z', color: '#a07a4a', opacity: 0.4, approximate: true, notes: 'follows the roof curve - do not force flat' }),
  )

  return parts
}
