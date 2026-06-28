import type { VanSpec, Part, LabelAnchor } from '../types'
import { genShell, genAnchors } from './shell'
import { genFloorFrame } from './floorFrame'
import { genTankFrame } from './tankFrame'
import { genFixtures } from './fixtures'
import { genSeparatorWall } from './separatorWall'
import { genWalls } from './walls'
import { genCeiling } from './ceiling'

// Compose every sub-generator into the full parametric part list.
export function genAllParts(spec: VanSpec): Part[] {
  return [
    ...genShell(spec),
    ...genFloorFrame(spec),
    ...genTankFrame(spec),
    ...genFixtures(spec),
    ...genSeparatorWall(spec),
    ...genWalls(spec),
    ...genCeiling(spec),
  ]
}

export function genAllAnchors(spec: VanSpec): LabelAnchor[] {
  return genAnchors(spec)
}

export { genShell, genFloorFrame, genTankFrame, genFixtures, genSeparatorWall, genWalls, genCeiling, genAnchors }
