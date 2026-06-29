import type { VanSpec, Part, Axis, Vec3, Size } from '../types'
import { box } from '../geometry'
import { floorTop } from './floorFrame'

// Driver-side INTEGRATED SERVICE CABINET (decided 2026-06-28): one 70x40-framed
// cabinet runs from behind the freestanding Anker to the driver wheel arch,
// housing the 200L fresh tank + pump/valves + 12V gear, with an oak worktop on
// top (camper galley) and two lift-out lids (tank fill cap + pump/service bay).
export function genTankFrame(spec: VanSpec): Part[] {
  const t = spec.freshTank
  const tf = spec.tankFrame
  const profile = '70x40'
  const pw = tf.profileW
  const ph = tf.profileH

  const outerW = tf.width // across (x), off the driver wall
  const x0 = spec.floorFrame.raftWidth - outerW // flush to driver edge
  const z0 = tf.offsetFront // behind the Anker
  const zEnd = spec.zones.archStart // run to the driver wheel arch
  const outerL = Math.max(zEnd - z0, t.l) // along (z)
  const y0 = floorTop(spec)
  const h = t.h // cabinet height = tank height

  const parts: Part[] = []
  const timber = (id: string, label: string, position: Vec3, size: Size, axis: Axis) =>
    parts.push(box(id, 'tankFrame', label, 'timber', position, size, {
      axis,
      cut: { cutLength: size.l, profile, fromStock: true },
    }))

  // bottom + top perimeter frames
  for (const [lvl, y] of [['bottom', y0], ['top', y0 + h]] as const) {
    timber(`cab-${lvl}-sideP`, `Cabinet ${lvl} rail (inner)`, { x: x0, y, z: z0 }, { l: outerL, w: pw, h: ph }, 'z')
    timber(`cab-${lvl}-sideD`, `Cabinet ${lvl} rail (driver)`, { x: x0 + outerW - pw, y, z: z0 }, { l: outerL, w: pw, h: ph }, 'z')
    timber(`cab-${lvl}-endF`, `Cabinet ${lvl} rail (front)`, { x: x0 + pw, y, z: z0 }, { l: outerW - 2 * pw, w: pw, h: ph }, 'x')
    timber(`cab-${lvl}-endR`, `Cabinet ${lvl} rail (rear)`, { x: x0 + pw, y, z: z0 + outerL - pw }, { l: outerW - 2 * pw, w: pw, h: ph }, 'x')
  }

  // 4 corner posts (height = cabinet height)
  const corners: [number, number, string][] = [
    [x0, z0, 'FP'],
    [x0 + outerW - pw, z0, 'FD'],
    [x0, z0 + outerL - pw, 'RP'],
    [x0 + outerW - pw, z0 + outerL - pw, 'RD'],
  ]
  corners.forEach(([cxp, czp, tag]) =>
    timber(`cab-post-${tag}`, `Cabinet post (${tag})`, { x: cxp, y: y0, z: czp }, { l: h, w: pw, h: ph }, 'y'),
  )

  // oak worktop
  parts.push(
    box('cab-worktop', 'tankFrame', 'Oak worktop', 'panel',
      { x: x0, y: y0 + h + ph, z: z0 },
      { l: outerL, w: outerW, h: tf.topPly },
      { axis: 'z', color: '#c8a56c', opacity: 1, notes: 'camper galley counter' }),
  )

  // two lift-out lids in the worktop
  const lidY = y0 + h + ph
  const lidL = 320
  const lidX = x0 + (outerW - 300) / 2
  parts.push(
    box('cab-lid-fill', 'tankFrame', 'Lift-out lid - tank fill cap', 'panel',
      { x: lidX, y: lidY + 1, z: z0 + 120 },
      { l: lidL, w: 300, h: tf.topPly },
      { axis: 'z', color: '#9c7b48', opacity: 1, notes: 'access to the 6 inch fill cap' }),
    box('cab-lid-service', 'tankFrame', 'Lift-out lid - pump / 12V service', 'panel',
      { x: lidX, y: lidY + 1, z: z0 + outerL - lidL - 120 },
      { l: lidL, w: 300, h: tf.topPly },
      { axis: 'z', color: '#9c7b48', opacity: 1, notes: 'access to pump, valves, accumulator, 12V' }),
  )

  // the tank itself, inside the cabinet on the floor
  const innerL = outerL - 2 * (pw + tf.clearance)
  const innerW = outerW - 2 * (pw + tf.clearance)
  const tankLengthOver = t.l > innerL
  const tankWidthOver = t.w > innerW
  const tankFitWarning = tankLengthOver || tankWidthOver
  parts.push(
    box('fresh-tank', 'freshTank', 'Fresh water tank (200 L)', 'tank',
      { x: x0 + pw + tf.clearance, y: y0, z: z0 + pw + tf.clearance },
      { l: t.l, w: t.w, h: t.h },
      {
        axis: 'z',
        color: tankFitWarning ? '#d98a4a' : '#4a90d9',
        opacity: 0.35,
        approximate: tankFitWarning || undefined,
        notes: tankFitWarning
          ? `${t.l} x ${t.w} tank needs ${t.l + 2 * (pw + tf.clearance)} x ${t.w + 2 * (pw + tf.clearance)} outer frame. Current inner space is ${Math.round(innerL)} x ${Math.round(innerW)}. Adjust cabinet width or Anker offset before cutting.`
          : `${t.l} x ${t.w} x ${t.h}, double ArmaFlex + heater mat`,
      }),
  )

  return parts
}
