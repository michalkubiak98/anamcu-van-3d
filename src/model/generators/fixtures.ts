import type { VanSpec, Part } from '../types'
import { box } from '../geometry'
import { floorTop } from './floorFrame'

// Appliance / furniture envelopes. Display-only (no cut list). Positions are
// INDICATIVE - the value is seeing clashes; exact placement is resolved on the
// real L-track once leg footprints are known.
export function genFixtures(spec: VanSpec): Part[] {
  const fx = spec.fixtures
  const raftW = spec.floorFrame.raftWidth
  const yTop = floorTop(spec)
  const ind = 'indicative position - resolve on L-track'
  const parts: Part[] = []

  // bath: crosswise in the rear zone (1270 across, 640 front-back)
  parts.push(
    box('fix-bath', 'fixtures', 'Grooming bath', 'fixture',
      { x: (raftW - fx.bath.l) / 2, y: yTop, z: spec.zones.archEnd + 50 },
      { l: fx.bath.l, w: fx.bath.w, h: fx.bath.h },
      { axis: 'x', color: '#4a90d9', opacity: 0.3, notes: ind }),
  )

  // table: longitudinal on the passenger side
  parts.push(
    box('fix-table', 'fixtures', 'Hydraulic table', 'fixture',
      { x: 40, y: yTop, z: 800 },
      { l: fx.table.l, w: fx.table.w, h: fx.table.h },
      { axis: 'z', color: '#d98a4a', opacity: 0.3, notes: ind }),
  )

  // bunker cabinet: front wall (cabin separator)
  parts.push(
    box('fix-cabinet', 'fixtures', 'Bunker cabinet', 'fixture',
      { x: 20, y: yTop, z: 20 },
      { l: fx.cabinet.l, w: fx.cabinet.w, h: fx.cabinet.h },
      { axis: 'x', color: '#2c8a5a', opacity: 0.3, notes: ind }),
  )

  // Anker F3800: driver-front corner
  parts.push(
    box('fix-anker', 'fixtures', 'Anker F3800', 'fixture',
      { x: raftW - fx.anker.w - 10, y: yTop, z: 20 },
      { l: fx.anker.l, w: fx.anker.w, h: fx.anker.h },
      { axis: 'z', color: '#cf5b4a', opacity: 0.35, notes: ind }),
  )

  // MaxxFan roof aperture (marker at the roof)
  const cx = raftW / 2
  parts.push(
    box('fix-maxxfan', 'fixtures', 'MaxxFan aperture', 'fixture',
      { x: cx - fx.maxxfan.w / 2, y: spec.shell.heightRibToFloor - 30, z: spec.shell.length / 2 - fx.maxxfan.l / 2 },
      { l: fx.maxxfan.l, w: fx.maxxfan.w, h: 30 },
      { axis: 'z', color: '#9fb6c2', opacity: 0.5, notes: '400 x 400 roof cut' }),
  )

  // underslung grey tanks (below the floor)
  const g = spec.greyTank
  for (let i = 0; i < g.count; i++) {
    const x = i === 0 ? 120 : raftW - g.w - 120
    parts.push(
      box(`fix-grey-${i}`, 'greyTanks', `Grey tank ${i + 1} (89 L underslung)`, 'tank',
        { x, y: -g.h, z: 1000 },
        { l: g.l, w: g.w, h: g.h },
        { axis: 'z', color: '#8a8f98', opacity: 0.3, notes: 'underslung, below the floor pan' }),
    )
  }

  return parts
}
