import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// One-finger orbit, two-finger pinch-zoom + pan. Tuned for a tablet in the van.
export function Controls({ target }: { target: [number, number, number] }) {
  return (
    <OrbitControls
      makeDefault
      enableDamping
      dampingFactor={0.12}
      rotateSpeed={0.85}
      target={target}
      minDistance={0.4}
      maxDistance={25}
      touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }}
      mouseButtons={{ LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN }}
    />
  )
}
