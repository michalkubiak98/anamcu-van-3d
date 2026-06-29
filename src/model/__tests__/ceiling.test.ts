import { describe, it, expect } from 'vitest'
import { makeDefaultSpec } from '../../data/defaultSpec'
import { genCeiling } from '../generators/ceiling'

describe('ceiling framing', () => {
  const spec = makeDefaultSpec()
  const parts = genCeiling(spec)

  it('hangs battens below the measured 1940mm rib face', () => {
    const batten = parts.find((p) => p.id === 'ceil-batten-0')!
    const expectedY = spec.shell.heightRibToFloor - spec.framing.battenH
    expect(batten.position.y).toBe(expectedY)
  })

  it('places the ply below the battens, not 50mm too low', () => {
    const ply = parts.find((p) => p.id === 'ceil-ply')!
    const expectedY = spec.shell.heightRibToFloor - spec.framing.battenH - spec.framing.ceilingPly
    expect(ply.position.y).toBe(expectedY)
  })
})
