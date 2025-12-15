export type BingoPattern =
  | 'FULL_HOUSE'
  | 'ROW_1' | 'ROW_2' | 'ROW_3' | 'ROW_4' | 'ROW_5'
  | 'COL_1' | 'COL_2' | 'COL_3' | 'COL_4' | 'COL_5'
  | 'DIAGONAL_MAIN' | 'DIAGONAL_ANTI'

export const PATTERN_LABELS: Record<BingoPattern, string> = {
  'FULL_HOUSE': 'Cartela Cheia',
  'ROW_1': 'Linha 1',
  'ROW_2': 'Linha 2',
  'ROW_3': 'Linha 3',
  'ROW_4': 'Linha 4',
  'ROW_5': 'Linha 5',
  'COL_1': 'Coluna 1',
  'COL_2': 'Coluna 2',
  'COL_3': 'Coluna 3',
  'COL_4': 'Coluna 4',
  'COL_5': 'Coluna 5',
  'DIAGONAL_MAIN': 'Diagonal Principal',
  'DIAGONAL_ANTI': 'Diagonal Secundária'
}

interface BoardItemLike {
  position: number
  marked: boolean
}

export function checkBingoPatterns(items: BoardItemLike[]): BingoPattern[] {
  const grid = Array(5).fill(null).map(() => Array(5).fill(false))

  items.forEach(item => {
    const row = Math.floor(item.position / 5)
    const col = item.position % 5
    // Ensure bounds (0-4) just in case
    if (row >= 0 && row < 5 && col >= 0 && col < 5) {
      if (item.marked) grid[row][col] = true
    }
  })

  const patterns: BingoPattern[] = []

  // Check rows
  for (let i = 0; i < 5; i++) {
    if (grid[i].every(Boolean)) {
      patterns.push(`ROW_${i + 1}` as BingoPattern)
    }
  }

  // Check cols
  for (let i = 0; i < 5; i++) {
    if (grid.map(row => row[i]).every(Boolean)) {
      patterns.push(`COL_${i + 1}` as BingoPattern)
    }
  }

  // Check diagonals
  if (grid.map((row, i) => row[i]).every(Boolean)) {
    patterns.push('DIAGONAL_MAIN')
  }
  if (grid.map((row, i) => row[4 - i]).every(Boolean)) {
    patterns.push('DIAGONAL_ANTI')
  }

  // Check Full House
  if (patterns.length > 0) { // Optimization: only check full house if we have at least some lines
    const allMarked = grid.every(row => row.every(Boolean))
    if (allMarked) {
      patterns.push('FULL_HOUSE')
    }
  }

  return patterns
}
