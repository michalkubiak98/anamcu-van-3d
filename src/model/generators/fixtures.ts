import type { VanSpec, Part } from '../types'
import { box } from '../geometry'
import { floorTop } from './floorFrame'

// Appliance / furniture envelopes (display-only, no cut list). Placed per the
// 2026-06-28 layout decisions. Positions stay indicative until leg footprints land.
export function genFixtures(spec: VanSpec): Part[] {
  const fx = spec.fixtures
  const raftW = spec.floorFrame.raftWidth
  const yTop = floorTop(spec)
  const cx = raftW / 2
  const ind = 'indicative position - resolve on site'
  const parts: Part[] = []

  // Anker F3800: FREESTANDING on wheels in the front driver corner (never framed,
  // never lifted - rolls out). l along z so it sits shallow against the driver wall.
  parts.push(
    box('fix-anker', 'fixtures', 'Anker F3800 (freestanding, on wheels)', 'fixture',
      { x: raftW - fx.anker.w - 10, y: yTop, z: 30 },
      { l: fx.anker.l, w: fx.anker.w, h: fx.anker.h },
      { axis: 'z', color: '#cf5b4a', opacity: 0.35, notes: '~70kg, rolls out - not fixed, restrain so it cannot roll in transit' }),
  )

  // Bunker cabinet: front passenger side, along the separator wall
  parts.push(
    box('fix-cabinet', 'fixtures', 'Bunker cabinet (tools)', 'fixture',
      { x: 10, y: yTop, z: 20 },
      { l: fx.cabinet.l, w: fx.cabinet.w, h: fx.cabinet.h },
      { axis: 'z', color: '#2c8a5a', opacity: 0.3, notes: ind }),
  )

  // Hydraulic table: passenger side, removable for camper mode
  parts.push(
    box('fix-table', 'fixtures', 'Hydraulic table (removable)', 'fixture',
      { x: 40, y: yTop, z: 1250 },
      { l: fx.table.l, w: fx.table.w, h: fx.table.h },
      { axis: 'z', color: '#d98a4a', opacity: 0.3, notes: 'on 4 flush sockets + strap; lifts out for the bed' }),
  )

  // Cabinet / shelf over the PASSENGER wheel arch
  parts.push(
    box('fix-archcab', 'fixtures', 'Cabinet / shelf over passenger arch', 'fixture',
      { x: 0, y: spec.wheelArches.height, z: spec.zones.archStart },
      { l: spec.zones.archEnd - spec.zones.archStart, w: 420, h: 480 },
      { axis: 'z', color: '#7a9a6a', opacity: 0.3, notes: 'storage above the arch' }),
  )

  // Grooming bath: crosswise in the rear (1270 across, 640 front-back)
  const bathZ = spec.zones.archEnd + 50
  parts.push(
    box('fix-bath', 'fixtures', 'Grooming bath', 'fixture',
      { x: (raftW - fx.bath.l) / 2, y: yTop, z: bathZ },
      { l: fx.bath.l, w: fx.bath.w, h: fx.bath.h },
      { axis: 'x', color: '#4a90d9', opacity: 0.3, notes: '4 flush sockets + strap; lifts out for the bed' }),
  )

  // MaxxFan: over the bath (rear wet-area extraction), not roof centre
  const bathCz = bathZ + fx.bath.w / 2
  parts.push(
    box('fix-maxxfan', 'fixtures', 'MaxxFan (over bath)', 'fixture',
      { x: cx - fx.maxxfan.w / 2, y: spec.shell.heightRibToFloor - 30, z: bathCz - fx.maxxfan.l / 2 },
      { l: fx.maxxfan.l, w: fx.maxxfan.w, h: 30 },
      { axis: 'z', color: '#9fb6c2', opacity: 0.55, notes: '400 x 400 roof cut, sited over the bath' }),
  )

  // underslung grey tanks (below the floor pan)
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
