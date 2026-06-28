import type { VanSpec, Part, Axis, Vec3, Size } from '../types'
import { box } from '../geometry'
import { floorTop } from './floorFrame'

// Fresh-water tank (1650x260x560) on the driver side between cabin and driver
// wheel arch, inside a derived 70x40 frame with an oak/ply hardtop.
// Frame size is parametric off freshTank + clearance + profile - no hardcoded numbers.
export function genTankFrame(spec: VanSpec): Part[] {
  const t = spec.freshTank
  const tf = spec.tankFrame
  const profile = '70x40'
  const pw = tf.profileW
  const ph = tf.profileH

  const outerW = t.w + 2 * tf.clearance + 2 * pw // across (x)
  const outerL = t.l + 2 * tf.clearance + 2 * pw // along (z)
  const x0 = spec.floorFrame.raftWidth - outerW // flush to driver edge
  const z0 = tf.offsetFront
  const y0 = floorTop(spec)

  const parts: Part[] = []
  const timber = (id: string, label: string, position: Vec3, size: Size, axis: Axis) =>
    parts.push(box(id, 'tankFrame', label, 'timber', position, size, {
      axis,
      cut: { cutLength: size.l, profile, fromStock: true },
    }))

  // bottom + top perimeter frames
  for (const [lvl, y] of [['bot', y0], ['top', y0 + t.h]] as const) {
    // 2 side rails along z
    timber(`tank-${lvl}-sideP`, `Tank frame ${lvl} rail (passenger)`, { x: x0, y, z: z0 }, { l: outerL, w: pw, h: ph }, 'z')
    timber(`tank-${lvl}-sideD`, `Tank frame ${lvl} rail (driver)`, { x: x0 + outerW - pw, y, z: z0 }, { l: outerL, w: pw, h: ph }, 'z')
    // 2 end rails along x, fitted between the side rails
    timber(`tank-${lvl}-endF`, `Tank frame ${lvl} rail (front)`, { x: x0 + pw, y, z: z0 }, { l: outerW - 2 * pw, w: pw, h: ph }, 'x')
    timber(`tank-${lvl}-endR`, `Tank frame ${lvl} rail (rear)`, { x: x0 + pw, y, z: z0 + outerL - pw }, { l: outerW - 2 * pw, w: pw, h: ph }, 'x')
  }

  // 4 corner posts (height = tank height)
  const corners: [number, number, string][] = [
    [x0, z0, 'FP'],
    [x0 + outerW - pw, z0, 'FD'],
    [x0, z0 + outerL - pw, 'RP'],
    [x0 + outerW - pw, z0 + outerL - pw, 'RD'],
  ]
  corners.forEach(([cxp, czp, tag]) =>
    timber(`tank-post-${tag}`, `Tank frame post (${tag})`, { x: cxp, y: y0, z: czp }, { l: t.h, w: pw, h: ph }, 'y'),
  )

  // oak / ply hardtop
  parts.push(
    box('tank-oaktop', 'tankFrame', 'Oak hardtop', 'panel',
      { x: x0, y: y0 + t.h + ph, z: z0 },
      { l: outerL, w: outerW, h: tf.topPly },
      { axis: 'z', color: '#c8a56c', opacity: 0.9 }),
  )

  // the tank itself (envelope), sitting inside the frame on the floor
  parts.push(
    box('fresh-tank', 'freshTank', 'Fresh water tank (200 L)', 'tank',
      { x: x0 + pw + tf.clearance, y: y0, z: z0 + pw + tf.clearance },
      { l: t.l, w: t.w, h: t.h },
      { axis: 'z', color: '#4a90d9', opacity: 0.35, notes: '1650 x 260 x 560, double ArmaFlex + heater mat' }),
  )

  return parts
}
