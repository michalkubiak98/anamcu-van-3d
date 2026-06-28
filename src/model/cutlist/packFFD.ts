import type { CutPiece, PackedStick } from '../types'

// First-fit-decreasing packing into fixed-length sticks.
// A piece longer than a stick is split into full sticks + a remainder (this is
// how a 4350 rail consumes one full 2.4m stick + a 1950 piece).
export function packFFD(
  pieces: CutPiece[],
  stockLength: number,
  profile: string,
  kerf = 0,
): PackedStick[] {
  const units: CutPiece[] = []
  for (const p of pieces) {
    let len = p.length
    let n = 1
    while (len > stockLength) {
      units.push({ partId: p.partId, label: `${p.label} (full stick)`, length: stockLength })
      len -= stockLength
      n++
    }
    if (len > 0) units.push(n > 1 ? { partId: p.partId, label: `${p.label} (offcut piece)`, length: len } : p)
  }

  const sticks: PackedStick[] = []
  for (const u of [...units].sort((a, b) => b.length - a.length)) {
    let placed = false
    for (const s of sticks) {
      const need = u.length + (s.pieces.length ? kerf : 0)
      if (s.offcut >= need) {
        s.pieces.push(u)
        s.used += need
        s.offcut = stockLength - s.used
        placed = true
        break
      }
    }
    if (!placed) {
      sticks.push({ index: 0, profile, stockLength, pieces: [u], used: u.length, offcut: stockLength - u.length })
    }
  }
  sticks.forEach((s, i) => (s.index = i + 1))
  return sticks
}
