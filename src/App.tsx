import { Canvas } from '@react-three/fiber'
import { VanProvider } from './state/VanContext'
import { SelectionProvider, useSelection } from './state/SelectionContext'
import { Scene } from './three/Scene'
import { BottomSheet } from './ui/BottomSheet'
import { DEFAULT_SPEC } from './data/defaultSpec'

const MM = 0.001
const TARGET_X = (DEFAULT_SPEC.floorFrame.raftWidth / 2) * MM
const TARGET_Z = (DEFAULT_SPEC.shell.length / 2) * MM

function CanvasArea() {
  const { select } = useSelection()
  return (
    <Canvas
      camera={{ position: [TARGET_X - 2.4, 2.9, TARGET_Z + 3.7], fov: 50, near: 0.01, far: 100 }}
      onPointerMissed={() => select(null)}
    >
      <color attach="background" args={['#11150f']} />
      <Scene />
    </Canvas>
  )
}

export default function App() {
  return (
    <VanProvider>
      <SelectionProvider>
        <div className="fixed inset-0">
          <CanvasArea />
          <div className="absolute top-0 left-0 p-3 pointer-events-none">
            <div className="text-[#c8a56c] font-semibold text-sm">Anam Cu Van - 3D build</div>
            <div className="text-stone-500 text-xs">drag rotate &middot; pinch zoom &middot; tap a piece for dims</div>
          </div>
          <BottomSheet />
        </div>
      </SelectionProvider>
    </VanProvider>
  )
}
