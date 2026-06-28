import type { Layer, LayerId } from '../model/types'

// Render + toggle registry. Order = list order in the UI.
export const LAYERS: Layer[] = [
  { id: 'shell', name: 'Shell envelope', defaultVisible: true, color: '#6b7b66', order: 0 },
  { id: 'wheelArches', name: 'Wheel arches', defaultVisible: true, color: '#5a6b58', order: 1 },
  { id: 'floorFrame', name: 'Floor frame', defaultVisible: true, color: '#3f8f4f', order: 2 },
  { id: 'floorPIR', name: 'Floor PIR', defaultVisible: false, color: '#d9c27a', order: 3 },
  { id: 'floorPly', name: 'Floor ply', defaultVisible: false, color: '#caa06a', order: 4 },
  { id: 'tankFrame', name: 'Tank frame', defaultVisible: true, color: '#c8a56c', order: 5 },
  { id: 'freshTank', name: 'Fresh tank', defaultVisible: true, color: '#4a90d9', order: 6 },
  { id: 'fixtures', name: 'Fixtures', defaultVisible: true, color: '#d98a4a', order: 7 },
  { id: 'greyTanks', name: 'Grey tanks', defaultVisible: false, color: '#8a8f98', order: 8 },
  // built in later sessions
  { id: 'walls', name: 'Walls (soon)', defaultVisible: false, color: '#b07a4a', order: 9 },
  { id: 'ceiling', name: 'Ceiling (soon)', defaultVisible: false, color: '#b07a4a', order: 10 },
  { id: 'ceilingRidges', name: 'Ceiling ridges (soon)', defaultVisible: false, color: '#7a8a72', order: 11 },
  { id: 'backDoors', name: 'Back doors (soon)', defaultVisible: false, color: '#9a8a6a', order: 12 },
]

export const LAYER_COLOR: Record<LayerId, string> = Object.fromEntries(
  LAYERS.map((l) => [l.id, l.color]),
) as Record<LayerId, string>
