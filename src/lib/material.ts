// captured pieces + material lead, read straight from the FEN board

const START: Record<string, number> = { p: 8, n: 2, b: 2, r: 2, q: 1 }
const VALUE: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9 }
const ORDER = ['p', 'n', 'b', 'r', 'q']

export type Material = {
  taken: string[] // sprite names of enemy pieces this side captured, e.g. ["bP", "bN"]
  lead: number // points ahead of the other side, 0 if not ahead
}

export function material(fen: string): { white: Material; black: Material } {
  const count: Record<string, number> = {}
  for (const c of fen.split(' ')[0]) if (/[a-z]/i.test(c)) count[c] = (count[c] ?? 0) + 1

  const has = (p: string, white: boolean) => count[white ? p.toUpperCase() : p] ?? 0

  // pieces a side has lost; promotions can push a count over the start, so clamp at 0
  const lost = (white: boolean) =>
    ORDER.flatMap((p) => Array<string>(Math.max(0, START[p] - has(p, white))).fill(p))

  const points = (white: boolean) => ORDER.reduce((sum, p) => sum + VALUE[p] * has(p, white), 0)

  const diff = points(true) - points(false)
  return {
    white: { taken: lost(false).map((p) => `b${p.toUpperCase()}`), lead: Math.max(0, diff) },
    black: { taken: lost(true).map((p) => `w${p.toUpperCase()}`), lead: Math.max(0, -diff) },
  }
}
