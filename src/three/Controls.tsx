import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// Orbit mode: left/one-finger rotates, right-drag pans. Pan mode: left/one-finger
// pans (move through the space), right-drag rotates. Pinch/scroll always zooms.
export function Controls({ target, mode }: { target: [number, number, number]; mode: 'orbit' | 'pan' }) {
  const pan = mode === 'pan'
  return (
    <OrbitControls
      makeDefault
      enableDamping
      dampingFactor={0.12}
      rotateSpeed={0.85}
      panSpeed={1.0}
      zoomSpeed={1.1}
      screenSpacePanning
      target={target}
      minDistance={0.25}
      maxDistance={32}
      touches={{ ONE: pan ? THREE.TOUCH.PAN : THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }}
      mouseButtons={{
        LEFT: pan ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: pan ? THREE.MOUSE.ROTATE : THREE.MOUSE.PAN,
      }}
    />
  )
}
