import type { VanSpec, Part, LabelAnchor } from '../types'
import { genShell, genAnchors } from './shell'
import { genFloorFrame } from './floorFrame'
import { genTankFrame } from './tankFrame'
import { genFixtures } from './fixtures'

// Compose every sub-generator into the full parametric part list.
export function genAllParts(spec: VanSpec): Part[] {
  return [
    ...genShell(spec),
    ...genFloorFrame(spec),
    ...genTankFrame(spec),
    ...genFixtures(spec),
  ]
}

export function genAllAnchors(spec: VanSpec): LabelAnchor[] {
  return genAnchors(spec)
}

export { genShell, genFloorFrame, genTankFrame, genFixtures, genAnchors }
