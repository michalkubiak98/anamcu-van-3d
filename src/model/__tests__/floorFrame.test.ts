import { describe, it, expect } from 'vitest'
import { makeDefaultSpec } from '../../data/defaultSpec'
import { genFloorFrame } from '../generators/floorFrame'
import { deriveCutList } from '../cutlist/deriveCutList'

// Parity with the known-good Python output (gen_floor_frame.py):
// 70x40 -> rail A 2400 x3, rail B 1950 x3, noggin 560 x28; 28.73 m; 13 sticks of 34.
describe('floor frame cut list parity', () => {
  const parts = genFloorFrame(makeDefaultSpec())
  const cut = deriveCutList(parts)
  const g = cut.groups.find((x) => x.profile === '70x40')!

  it('has a 70x40 group', () => {
    expect(g).toBeTruthy()
  })

  it('cuts 3x2400 (full sticks) + 3x1950 (rail extensions) + 28x560 (noggins)', () => {
    const m = Object.fromEntries(g.byLength.map((t) => [t.length, t.qty]))
    expect(m[2400]).toBe(3)
    expect(m[1950]).toBe(3)
    expect(m[560]).toBe(28)
  })

  it('packs into 13 sticks, not short of the 34 owned', () => {
    expect(g.totalSticks).toBe(13)
    expect(g.stockAvailable).toBe(34)
    expect(g.shortBy).toBe(0)
  })

  it('totals 28.73 linear metres', () => {
    expect(g.totalLinear).toBe(28730)
  })

  it('emits 3 rails + 28 noggins as timber', () => {
    const timber = parts.filter((p) => p.kind === 'timber')
    expect(timber.filter((p) => p.id.startsWith('rail-'))).toHaveLength(3)
    expect(timber.filter((p) => p.id.startsWith('nog-'))).toHaveLength(28)
  })
})
