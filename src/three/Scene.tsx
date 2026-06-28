import { useVan } from '../state/VanContext'
import { PartMesh } from './PartMesh'
import { Anchor3D } from './Anchor3D'
import { Controls } from './Controls'

const MM = 0.001

export function Scene() {
  const { parts, anchors, vis, spec } = useVan()

  const visParts = parts.filter((p) => vis[p.layerId])

  const target: [number, number, number] = [
    (spec.floorFrame.raftWidth / 2) * MM,
    0.1,
    (spec.shell.length / 2) * MM,
  ]

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[2.5, 6, 3]} intensity={0.75} />
      <directionalLight position={[-3, 4, -2]} intensity={0.25} />
      <Controls target={target} />

      {visParts.map((p) => (
        <PartMesh key={p.id} part={p} />
      ))}
      {anchors.map((a) => (
        <Anchor3D key={a.id} a={a} />
      ))}

      <gridHelper args={[10, 20, '#44513f', '#26301f']} position={[target[0], 0, target[2]]} />
    </>
  )
}
