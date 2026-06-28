import type { VanSpec } from '../model/types'

// The MEASURED van (Obsidian Builds/Measurements.md + Cladding,Floor&Doors.md + BoM).
// Everything in mm. Approximate values are flagged in the spec where relevant.
export const DEFAULT_SPEC: VanSpec = {
  schemaVersion: 1,
  shell: {
    length: 4350,
    widthAboveArches: 1790,
    clearBetweenArches: 1350,
    heightRibToFloor: 1940,
    floorRidge: 10,
    ceilingRib: 50,
  },
  zones: {
    archStart: 2400,
    archEnd: 3500,
    frontZoneFloorWidth: 1500, // NOT MEASURED - approximate
    rearZoneFloorWidth: 1500, // NOT MEASURED - approximate
  },
  wheelArches: { height: 325, clearBetween: 1350 },
  floorFrame: {
    bearerW: 70,
    bearerH: 40,
    raftLength: 4350,
    raftWidth: 1330,
    crossLines: [0, 400, 800, 1200, 1600, 2000, 2400, 2800, 3200, 3500, 3700, 3950, 4150, 4280],
    pir: 25,
    ply: 18,
  },
  freshTank: { l: 1650, w: 260, h: 560 },
  tankFrame: { clearance: 15, profileW: 70, profileH: 40, topPly: 18, offsetFront: 500 },
  fixtures: {
    bath: { l: 1270, w: 640, h: 450 },
    table: { l: 1260, w: 650, h: 850 },
    cabinet: { l: 1122, w: 461, h: 851 },
    anker: { l: 450, w: 330, h: 360 },
    maxxfan: { l: 400, w: 400 },
  },
  greyTank: { l: 1320, w: 310, h: 282, count: 2 },
}

// deep clone so reset/import never mutates the constant
export const cloneSpec = (s: VanSpec): VanSpec => JSON.parse(JSON.stringify(s))
export const makeDefaultSpec = (): VanSpec => cloneSpec(DEFAULT_SPEC)
