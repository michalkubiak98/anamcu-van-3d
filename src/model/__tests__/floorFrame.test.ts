import { describe, it, expect } from 'vitest'
import { makeDefaultSpec } from '../../data/defaultSpec'
import { genFloorFrame } from '../generators/floorFrame'
import { deriveCutList } from '../cutlist/deriveCutList'
import { worldDims } from '../geometry'

// The floor is full-width with the wheel arches boxed over (redesign 2026-06-28).
describe('floor frame (full width + arch boxes)', () => {
  const spec = makeDefaultSpec()
  const parts = genFloorFrame(spec)
  const cut = deriveCutList(parts)
  const g = cut.groups.find((x) => x.profile === '70x40')!

  it('has 3 full-length channel rails plus interrupted wall rails', () => {
    expect(parts.filter((p) => p.id.startsWith('rail-ch-'))).toHaveLength(3)
    expect(parts.some((p) => p.id.startsWith('rail-wallP'))).toBe(true)
    expect(parts.some((p) => p.id.startsWith('rail-wallD'))).toBe(true)
  })

  it('boxes over both wheel arches with a platform each', () => {
    expect(parts.some((p) => p.id === 'archbox-P-top')).toBe(true)
    expect(parts.some((p) => p.id === 'archbox-D-top')).toBe(true)
    expect(parts.filter((p) => p.id.includes('-post-'))).toHaveLength(8)
  })

  it('adds approximate socket bearers for bath and table feet', () => {
    const sockets = parts.filter((p) => p.layerId === 'socketBearers')
    expect(sockets.map((p) => p.id).sort()).toEqual([
      'socket-bath-front',
      'socket-bath-rear',
      'socket-table-front',
      'socket-table-rear',
    ])
    expect(sockets.every((p) => p.approximate)).toBe(true)
  })

  it('the floor spans the full width', () => {
    const W = spec.floorFrame.raftWidth
    const driverWall = parts.find((p) => p.id === 'rail-wallD-front')!
    expect(driverWall.position.x).toBe(W - spec.floorFrame.bearerW)
  })

  it('packs the 70x40 into the owned sticks without running short', () => {
    expect(g.totalSticks).toBeGreaterThan(0)
    expect(g.totalSticks).toBeLessThanOrEqual(g.stockAvailable)
    expect(g.shortBy).toBe(0)
  })

  it('produces no NaN geometry', () => {
    for (const p of parts) {
      const [dx, dy, dz] = worldDims(p.size, p.axis)
      expect(Number.isFinite(dx + dy + dz + p.position.x + p.position.y + p.position.z)).toBe(true)
    }
  })
})
