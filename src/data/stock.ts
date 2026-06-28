// Timber + sheet stock actually owned (Obsidian BoM, measured on delivery 2026-06-25).

export interface StockProfile { profile: string; stockLength: number; count: number; label: string }

export const STOCK: Record<string, StockProfile> = {
  '70x40': { profile: '70x40', stockLength: 2400, count: 34, label: '70x40 treated batten' },
  '45x35': { profile: '45x35', stockLength: 2400, count: 52, label: '45x35 treated batten' },
}

export interface SheetStock { material: string; sheet: [number, number]; count: number }

export const SHEETS: Record<string, SheetStock> = {
  ply18: { material: '18mm ply', sheet: [2440, 1220], count: 4 },
  ply12: { material: '12mm ply', sheet: [2440, 1220], count: 5 },
  pir25: { material: '25mm PIR', sheet: [2400, 1200], count: 6 },
}

// kerf (saw blade width) lost per cut. ~3mm for a table saw.
export const KERF = 3
