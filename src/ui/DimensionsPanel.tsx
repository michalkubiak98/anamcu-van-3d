import { useRef } from 'react'
import type { ReactNode } from 'react'
import { useVan } from '../state/VanContext'
import { NumberField } from './NumberField'
import { downloadJson, readJsonFile } from '../lib/download'
import type { VanSpec } from '../model/types'

export function DimensionsPanel() {
  const { spec, setField, replaceSpec, resetSpec } = useVan()
  const fileRef = useRef<HTMLInputElement>(null)

  const F = (path: string, label: string, value: number, approx?: boolean, step = 10) => (
    <NumberField key={path} label={label} value={value} approximate={approx} step={step} onChange={(v) => setField(path, v)} />
  )

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button onClick={() => downloadJson('van-spec.json', spec)} className="flex-1 h-9 rounded bg-stone-700 active:bg-stone-600 text-sm">
          Export
        </button>
        <button onClick={() => fileRef.current?.click()} className="flex-1 h-9 rounded bg-stone-700 active:bg-stone-600 text-sm">
          Import
        </button>
        <button onClick={resetSpec} className="flex-1 h-9 rounded bg-amber-900/70 active:bg-amber-800 text-sm text-amber-100">
          Reset
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          hidden
          onChange={async (e) => {
            const f = e.target.files?.[0]
            if (f) replaceSpec(await readJsonFile<VanSpec>(f))
            e.target.value = ''
          }}
        />
      </div>

      <Section title="Shell">
        {F('shell.length', 'Box length', spec.shell.length)}
        {F('shell.widthAboveArches', 'Width above arches', spec.shell.widthAboveArches)}
        {F('shell.clearBetweenArches', 'Clear between arches', spec.shell.clearBetweenArches)}
        {F('shell.heightRibToFloor', 'Height rib to floor', spec.shell.heightRibToFloor)}
      </Section>

      <Section title="Zones (from front)">
        {F('zones.archStart', 'Arch start', spec.zones.archStart)}
        {F('zones.archEnd', 'Arch end', spec.zones.archEnd)}
        {F('zones.frontZoneFloorWidth', 'Front floor width', spec.zones.frontZoneFloorWidth, true)}
        {F('zones.rearZoneFloorWidth', 'Rear floor width', spec.zones.rearZoneFloorWidth, true)}
      </Section>

      <Section title="Wheel arches">
        {F('wheelArches.height', 'Arch height', spec.wheelArches.height, false, 5)}
        {F('wheelArches.clearBetween', 'Clear between', spec.wheelArches.clearBetween)}
      </Section>

      <Section title="Floor frame">
        {F('floorFrame.raftLength', 'Raft length', spec.floorFrame.raftLength)}
        {F('floorFrame.raftWidth', 'Raft width', spec.floorFrame.raftWidth)}
        {F('floorFrame.bearerW', 'Bearer width', spec.floorFrame.bearerW, false, 5)}
        {F('floorFrame.bearerH', 'Bearer height', spec.floorFrame.bearerH, false, 5)}
        {F('floorFrame.pir', 'Floor PIR', spec.floorFrame.pir, false, 5)}
        {F('floorFrame.ply', 'Floor ply', spec.floorFrame.ply, false, 1)}
      </Section>

      <Section title="Fresh tank + frame">
        {F('freshTank.l', 'Tank length', spec.freshTank.l)}
        {F('freshTank.w', 'Tank width', spec.freshTank.w, false, 5)}
        {F('freshTank.h', 'Tank height', spec.freshTank.h, false, 5)}
        {F('tankFrame.clearance', 'Frame clearance', spec.tankFrame.clearance, false, 5)}
        {F('tankFrame.offsetFront', 'Tank offset from front', spec.tankFrame.offsetFront)}
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-wide text-stone-400 mb-0.5 mt-2">{title}</h3>
      {children}
    </div>
  )
}
