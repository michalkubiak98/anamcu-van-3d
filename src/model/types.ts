// The data contract. Everything in millimetres. Pure types, no React/three.

export type Mm = number
export type Vec3 = { x: Mm; y: Mm; z: Mm }
// l runs along the part's `axis` (default z); w and h are the other two.
export type Size = { l: Mm; w: Mm; h: Mm }
export type Axis = 'x' | 'y' | 'z'

export type LayerId =
  | 'shell'
  | 'wheelArches'
  | 'floorFrame'
  | 'floorPIR'
  | 'floorPly'
  | 'tankFrame'
  | 'freshTank'
  | 'fixtures'
  | 'greyTanks'
  // registered now, generated in later sessions:
  | 'walls'
  | 'ceiling'
  | 'ceilingRidges'
  | 'backDoors'

export interface Layer {
  id: LayerId
  name: string
  defaultVisible: boolean
  color: string
  order: number
}

export type PartKind = 'timber' | 'panel' | 'fixture' | 'shell' | 'tank'

export interface CutInfo {
  cutLength: Mm
  profile: string // links to STOCK, e.g. '70x40'
  fromStock: boolean // true = consumes a stick in the packer
  qty?: number // default 1
}

export interface Part {
  id: string // stable + deterministic, survives a re-gen
  layerId: LayerId
  label: string
  kind: PartKind
  size: Size
  position: Vec3 // MIN-CORNER of the box
  axis?: Axis // default 'z'
  color?: string
  opacity?: number
  cut?: CutInfo
  notes?: string
  approximate?: boolean // unmeasured -> render amber/dashed
}

export interface LabelAnchor {
  id: string
  text: string
  sub?: string
  position: Vec3 // world point the fixed 3D label sticks to
}

// ---- Editable spec (the single source of truth). Grouped so the Dimensions
// panel maps one section per top-level key.
export interface VanSpec {
  schemaVersion: number
  shell: {
    length: Mm
    widthAboveArches: Mm
    clearBetweenArches: Mm
    heightRibToFloor: Mm
    floorRidge: Mm
    ceilingRib: Mm
  }
  zones: {
    archStart: Mm
    archEnd: Mm
    frontZoneFloorWidth: Mm // NOT MEASURED
    rearZoneFloorWidth: Mm // NOT MEASURED
  }
  wheelArches: { height: Mm; clearBetween: Mm }
  floorFrame: {
    bearerW: Mm
    bearerH: Mm
    raftLength: Mm
    raftWidth: Mm
    crossLines: Mm[]
    pir: Mm
    ply: Mm
  }
  freshTank: { l: Mm; w: Mm; h: Mm }
  tankFrame: { clearance: Mm; profileW: Mm; profileH: Mm; topPly: Mm; offsetFront: Mm; width: Mm }
  fixtures: {
    bath: { l: Mm; w: Mm; h: Mm }
    table: { l: Mm; w: Mm; h: Mm }
    cabinet: { l: Mm; w: Mm; h: Mm }
    anker: { l: Mm; w: Mm; h: Mm }
    maxxfan: { l: Mm; w: Mm }
  }
  greyTank: { l: Mm; w: Mm; h: Mm; count: number }
}

// ---- Cut list
export interface CutPiece { partId: string; label: string; length: Mm }
export interface PackedStick {
  index: number
  profile: string
  stockLength: Mm
  pieces: CutPiece[]
  used: Mm
  offcut: Mm
}
export interface LengthTally { length: Mm; qty: number }
export interface CutListGroup {
  profile: string
  label: string
  sticks: PackedStick[]
  byLength: LengthTally[]
  totalSticks: number
  totalPieces: number
  totalLinear: Mm
  totalOffcut: Mm
  stockAvailable: number
  shortBy: number // >0 if we need more sticks than owned
}
export interface SheetSummary { material: string; sheet: string; areaNeeded: Mm; sheetsNeeded: number; sheetsAvailable: number }
export interface CutList { groups: CutListGroup[]; sheets: SheetSummary[] }
