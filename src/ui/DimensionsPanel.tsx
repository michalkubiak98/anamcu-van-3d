import { useRef } from 'react'
import type { ReactNode } from 'react'
import { useVan } from '../state/VanContext'
import { NumberField } from './NumberField'
import { downloadJson, readJsonFile } from '../lib/download'
import type { VanSpec } from '../model/types'

export function DimensionsPanel() {
  const { spec, setField, replaceSpec, resetSpec } = useVan()
  const fileRef = useRef<HTMLInputElement>(null)

  const F = (path: string, label: string, value: number, approx?: boolean, step = 10, note?: string) => (
    <NumberField
      key={path}
      label={label}
      value={value}
      path={path}
      approximate={approx}
      step={step}
      note={note}
      onChange={(v) => setField(path, v)}
    />
  )

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button onClick={() => downloadJson('van-spec.json', spec)} className="h-9 flex-1 rounded-md bg-[#24291f] text-sm active:bg-[#31382a]">
          Export
        </button>
        <button onClick={() => fileRef.current?.click()} className="h-9 flex-1 rounded-md bg-[#24291f] text-sm active:bg-[#31382a]">
          Import
        </button>
        <button onClick={resetSpec} className="h-9 flex-1 rounded-md bg-amber-900/70 text-sm text-amber-100 active:bg-amber-800">
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

      <DerivedChecks spec={spec} />

      <Section title="Shell" note="Bare metal measurements from the Obsidian Measurements page.">
        {F('shell.length', 'Box length', spec.shell.length)}
        {F('shell.widthAboveArches', 'Width above arches', spec.shell.widthAboveArches)}
        {F('shell.clearBetweenArches', 'Clear between arches', spec.shell.clearBetweenArches)}
        {F('shell.heightRibToFloor', 'Height rib to floor', spec.shell.heightRibToFloor)}
        {F('shell.floorRidge', 'Floor ridge height', spec.shell.floorRidge, true, 1)}
        {F('shell.ceilingRib', 'Ceiling rib height', spec.shell.ceilingRib, true, 5)}
      </Section>

      <Section title="Zones" note="Longitudinal positions measured from the separator wall face.">
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
        {F('floorFrame.raftLength', 'Floor length', spec.floorFrame.raftLength, false, 10, 'Drives every front-to-back floor rail.')}
        {F('floorFrame.raftWidth', 'Floor width (wall-wall)', spec.floorFrame.raftWidth, true, 10, 'Drives separator width, outer rails, arch boxes and ply width. Measure before cutting.')}
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
        {F('tankFrame.profileW', 'Frame timber width', spec.tankFrame.profileW, false, 5)}
        {F('tankFrame.profileH', 'Frame timber height', spec.tankFrame.profileH, false, 5)}
        {F('tankFrame.topPly', 'Worktop thickness', spec.tankFrame.topPly, false, 1)}
        {F('tankFrame.offsetFront', 'Tank offset from front', spec.tankFrame.offsetFront)}
        {F('tankFrame.width', 'Cabinet width off wall', spec.tankFrame.width, false, 10, 'Drives the driver-side service cabinet outside width.')}
      </Section>

      <Section title="Fixtures" note="Envelopes only until the real feet and service clearances are measured.">
        {F('fixtures.anker.l', 'Anker length', spec.fixtures.anker.l)}
        {F('fixtures.anker.w', 'Anker width', spec.fixtures.anker.w)}
        {F('fixtures.anker.h', 'Anker height', spec.fixtures.anker.h)}
        {F('fixtures.bath.l', 'Bath length', spec.fixtures.bath.l)}
        {F('fixtures.bath.w', 'Bath width', spec.fixtures.bath.w)}
        {F('fixtures.bath.h', 'Bath height', spec.fixtures.bath.h)}
        {F('fixtures.table.l', 'Table length', spec.fixtures.table.l)}
        {F('fixtures.table.w', 'Table width', spec.fixtures.table.w)}
        {F('fixtures.table.h', 'Table height', spec.fixtures.table.h)}
        {F('fixtures.cabinet.l', 'Bunker width', spec.fixtures.cabinet.l)}
        {F('fixtures.cabinet.w', 'Bunker depth', spec.fixtures.cabinet.w)}
        {F('fixtures.cabinet.h', 'Bunker height', spec.fixtures.cabinet.h)}
        {F('fixtures.maxxfan.l', 'MaxxFan opening length', spec.fixtures.maxxfan.l)}
        {F('fixtures.maxxfan.w', 'MaxxFan opening width', spec.fixtures.maxxfan.w)}
      </Section>

      <Section title="Grey tanks">
        {F('greyTank.l', 'Grey tank length', spec.greyTank.l)}
        {F('greyTank.w', 'Grey tank width', spec.greyTank.w)}
        {F('greyTank.h', 'Grey tank height', spec.greyTank.h)}
        {F('greyTank.count', 'Grey tank count', spec.greyTank.count, true, 1, 'Model still draws simple underslung envelopes. Vault now says grey layout has changed.')}
      </Section>

      <Section title="Wall, separator, ceiling framing" note="Indicative spacing. Move battens to real ribs/fixing points in the van.">
        {F('framing.battenW', 'Batten face width', spec.framing.battenW, false, 5)}
        {F('framing.battenH', 'Batten depth', spec.framing.battenH, false, 5)}
        {F('framing.wallStudSpacing', 'Wall stud spacing', spec.framing.wallStudSpacing, true, 10)}
        {F('framing.separatorStudSpacing', 'Separator stud spacing', spec.framing.separatorStudSpacing, false, 10)}
        {F('framing.ceilingRibSpacing', 'Ceiling rib spacing', spec.framing.ceilingRibSpacing, true, 10)}
        {F('framing.ceilingRibHeight', 'Ceiling rib height', spec.framing.ceilingRibHeight, true, 5)}
        {F('framing.ceilingBattenSpacing', 'Ceiling batten spacing', spec.framing.ceilingBattenSpacing, true, 10)}
        {F('framing.wallPly', 'Wall ply', spec.framing.wallPly, false, 1)}
        {F('framing.ceilingPly', 'Ceiling ply', spec.framing.ceilingPly, false, 1)}
      </Section>
    </div>
  )
}

function DerivedChecks({ spec }: { spec: VanSpec }) {
  const floorTop = spec.floorFrame.bearerH + spec.floorFrame.ply
  const cabinetRun = Math.max(spec.zones.archStart - spec.tankFrame.offsetFront, spec.freshTank.l)
  const tankOuterLengthNeeded = spec.freshTank.l + 2 * (spec.tankFrame.profileW + spec.tankFrame.clearance)
  const tankOuterWidthNeeded = spec.freshTank.w + 2 * (spec.tankFrame.profileW + spec.tankFrame.clearance)
  const innerTankLength = cabinetRun - 2 * (spec.tankFrame.profileW + spec.tankFrame.clearance)
  const innerTankWidth = spec.tankFrame.width - 2 * (spec.tankFrame.profileW + spec.tankFrame.clearance)
  const tankLengthOk = spec.freshTank.l <= innerTankLength
  const tankWidthOk = spec.freshTank.w <= innerTankWidth

  return (
    <div className="rounded-md bg-[#10140f] p-3 text-xs text-stone-300">
      <div className="mb-1 text-sm font-semibold text-stone-100">Live fit checks</div>
      <Check label="Finished floor top" value={`${floorTop} mm`} ok />
      <Check label="Separator wall width source" value={`floorFrame.raftWidth = ${spec.floorFrame.raftWidth} mm`} ok />
      <Check label="Required tank frame" value={`${tankOuterLengthNeeded} x ${tankOuterWidthNeeded} mm`} ok />
      <Check label="Tank inner length" value={`${Math.round(innerTankLength)} mm`} ok={tankLengthOk} />
      <Check label="Tank inner width" value={`${Math.round(innerTankWidth)} mm`} ok={tankWidthOk} />
    </div>
  )
}

function Check({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="flex justify-between gap-3 py-0.5">
      <span className="text-stone-500">{label}</span>
      <span className={ok ? 'text-green-300' : 'text-amber-300'}>{value}</span>
    </div>
  )
}

function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5 pt-2">
      <div>
        <h3 className="text-xs uppercase tracking-wide text-stone-400">{title}</h3>
        {note && <p className="text-[11px] leading-snug text-stone-500">{note}</p>}
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  )
}
