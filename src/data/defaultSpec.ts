import type { VanSpec } from '../model/types'

// The MEASURED van (Obsidian Builds/Measurements.md + Cladding,Floor&Doors.md + BoM).
// Everything in mm. Approximate values are flagged in the spec where relevant.
export const DEFAULT_SPEC: VanSpec = {
  schemaVersion: 2,
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
    raftWidth: 1700, // FULL floor width (wall to wall at floor level, approx - editable)
    crossLines: [0, 400, 800, 1200, 1600, 2000, 2400, 2800, 3200, 3500, 3700, 3950, 4150, 4280],
    pir: 25,
    ply: 18,
  },
  freshTank: { l: 1650, w: 260, h: 560 },
  // service cabinet on the driver side: runs from behind the Anker (offsetFront)
  // to the driver wheel arch. width = how far it comes off the driver wall.
  tankFrame: { clearance: 20, profileW: 70, profileH: 40, topPly: 18, offsetFront: 760, width: 430 },
  fixtures: {
    bath: { l: 1270, w: 640, h: 450 },
    table: { l: 1260, w: 650, h: 850 },
    cabinet: { l: 1122, w: 461, h: 851 },
    anker: { l: 700, w: 350, h: 420 }, // F3800, freestanding on wheels
    maxxfan: { l: 400, w: 400 },
  },
  greyTank: { l: 1320, w: 310, h: 282, count: 2 },
  framing: {
    battenW: 45,
    battenH: 35,
    wallStudSpacing: 450,
    separatorStudSpacing: 400,
    ceilingRibSpacing: 500, // van roof ribs (approx - confirm)
    ceilingRibHeight: 50,
    ceilingBattenSpacing: 450,
    wallPly: 12,
    ceilingPly: 12,
  },
}

// deep clone so reset/import never mutates the constant
export const cloneSpec = (s: VanSpec): VanSpec => JSON.parse(JSON.stringify(s))
export const makeDefaultSpec = (): VanSpec => cloneSpec(DEFAULT_SPEC)

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

// Deep-merge a stored/imported spec onto the current defaults so a spec saved
// before a new field existed still gets that field (schema migration). Defaults
// define the shape; stored values win where present; arrays are replaced whole.
function mergeInto(base: Record<string, unknown>, over: Record<string, unknown>): Record<string, unknown> {
  for (const k of Object.keys(base)) {
    if (!(k in over)) continue
    const b = base[k]
    const o = over[k]
    base[k] = isObj(b) && isObj(o) ? mergeInto(b, o) : o
  }
  return base
}

export const withDefaults = (stored: unknown): VanSpec =>
  isObj(stored) ? (mergeInto(makeDefaultSpec() as unknown as Record<string, unknown>, stored) as unknown as VanSpec) : makeDefaultSpec()
