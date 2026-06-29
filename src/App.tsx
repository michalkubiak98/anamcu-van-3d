import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { VanProvider } from './state/VanContext'
import { SelectionProvider, useSelection } from './state/SelectionContext'
import { Scene } from './three/Scene'
import { BottomSheet } from './ui/BottomSheet'
import { InfoPanel } from './ui/InfoPanel'
import { DEFAULT_SPEC } from './data/defaultSpec'

const MM = 0.001
const TARGET_X = (DEFAULT_SPEC.floorFrame.raftWidth / 2) * MM
const TARGET_Z = (DEFAULT_SPEC.shell.length / 2) * MM

type Mode = 'orbit' | 'pan'

function CanvasArea({ mode }: { mode: Mode }) {
  const { select } = useSelection()
  return (
    <Canvas
      camera={{ position: [TARGET_X - 2.6, 3.0, TARGET_Z + 4.0], fov: 50, near: 0.01, far: 100 }}
      onPointerMissed={() => select(null)}
    >
      <color attach="background" args={['#11150f']} />
      <Scene mode={mode} />
    </Canvas>
  )
}

export default function App() {
  const [mode, setMode] = useState<Mode>('orbit')
  return (
    <VanProvider>
      <SelectionProvider>
        <div className="fixed inset-0">
          <CanvasArea mode={mode} />

          <div className="absolute top-0 left-0 p-3 pointer-events-none">
            <div className="text-[#c8a56c] font-semibold text-sm">Anam Cu Van - 3D build</div>
          </div>

          <div className="absolute top-10 left-3 z-20 flex overflow-hidden rounded-md bg-[#10140f]/90 p-1 text-sm shadow-lg">
            {(['orbit', 'pan'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`h-8 rounded px-4 capitalize ${
                  mode === m ? 'bg-[#2c4034] text-stone-100' : 'text-stone-400 active:bg-[#1b2118]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <InfoPanel />
          <BottomSheet />
        </div>
      </SelectionProvider>
    </VanProvider>
  )
}
