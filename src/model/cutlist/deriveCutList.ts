import type { Part, CutList, CutListGroup, CutPiece, LengthTally, SheetSummary } from '../types'
import { STOCK, SHEETS, KERF } from '../../data/stock'
import { packFFD } from './packFFD'

// Turn the part list into a grouped cut list (timber) + sheet summary (ply/PIR).
export function deriveCutList(parts: Part[]): CutList {
  // ---- timber, grouped by stock profile
  const byProfile = new Map<string, CutPiece[]>()
  for (const p of parts) {
    if (!p.cut?.fromStock) continue
    const arr = byProfile.get(p.cut.profile) ?? []
    const qty = p.cut.qty ?? 1
    for (let i = 0; i < qty; i++) arr.push({ partId: p.id, label: p.label, length: p.cut.cutLength })
    byProfile.set(p.cut.profile, arr)
  }

  const groups: CutListGroup[] = []
  for (const [profile, pieces] of byProfile) {
    const stock = STOCK[profile]
    const stockLength = stock?.stockLength ?? 2400
    const sticks = packFFD(pieces, stockLength, profile, KERF)

    const tally = new Map<number, number>()
    let totalPieces = 0
    let totalOffcut = 0
    for (const s of sticks) {
      totalOffcut += s.offcut
      for (const pc of s.pieces) {
        const len = Math.round(pc.length)
        tally.set(len, (tally.get(len) ?? 0) + 1)
        totalPieces++
      }
    }
    const byLength: LengthTally[] = [...tally.entries()]
      .map(([length, qty]) => ({ length, qty }))
      .sort((a, b) => b.length - a.length)

    const totalLinear = pieces.reduce((s, p) => s + p.length, 0)
    const available = stock?.count ?? 0
    groups.push({
      profile,
      label: stock?.label ?? profile,
      sticks,
      byLength,
      totalSticks: sticks.length,
      totalPieces,
      totalLinear,
      totalOffcut,
      stockAvailable: available,
      shortBy: Math.max(0, sticks.length - available),
    })
  }
  groups.sort((a, b) => a.profile.localeCompare(b.profile))

  // ---- sheet goods (ply / PIR) - rough area / sheet-area (no nesting; approximate)
  const sheetArea = new Map<string, number>()
  for (const p of parts) {
    if (p.kind !== 'panel') continue
    const mat = sheetMaterial(p.label)
    if (!mat) continue
    sheetArea.set(mat, (sheetArea.get(mat) ?? 0) + p.size.l * p.size.w)
  }
  const sheets: SheetSummary[] = [...sheetArea.entries()].map(([key, area]) => {
    const s = SHEETS[key]
    const oneSheet = s.sheet[0] * s.sheet[1]
    return {
      material: s.material,
      sheet: `${s.sheet[0]} x ${s.sheet[1]}`,
      areaNeeded: area,
      sheetsNeeded: Math.ceil(area / oneSheet),
      sheetsAvailable: s.count,
    }
  })

  return { groups, sheets }
}

function sheetMaterial(label: string): keyof typeof SHEETS | null {
  if (/PIR/i.test(label)) return 'pir25'
  if (/12\s?mm/i.test(label)) return 'ply12'
  if (/ply|oak|worktop|lid/i.test(label)) return 'ply18'
  return null
}
