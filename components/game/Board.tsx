"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface BoardItem {
  id: string
  word: string
  position: number
  marked: boolean
}

interface BoardProps {
  items: BoardItem[]
  onMark: (word: string) => void
  onBingo?: () => void
  disabled?: boolean
}

export function Board({ items, onMark, disabled, onBingo }: BoardProps) {
  const [localItems, setLocalItems] = useState(items)

  // Check for Bingo (5x5 grid)
  const checkBingo = (currentItems: BoardItem[]) => {
    const grid = Array(5).fill(null).map(() => Array(5).fill(false))
    currentItems.forEach(item => {
      const row = Math.floor(item.position / 5)
      const col = item.position % 5
      if (item.marked) grid[row][col] = true
    })

    // Check rows
    for (let i = 0; i < 5; i++) {
      if (grid[i].every(Boolean)) return true
    }
    // Check cols
    for (let i = 0; i < 5; i++) {
      if (grid.map(row => row[i]).every(Boolean)) return true
    }
    // Check diagonals
    if (grid.map((row, i) => row[i]).every(Boolean)) return true
    if (grid.map((row, i) => row[4 - i]).every(Boolean)) return true

    return false
  }

  const handleClick = (item: BoardItem) => {
    if (disabled || item.marked) return

    const newItems = localItems.map(i => i.id === item.id ? { ...i, marked: true } : i)
    setLocalItems(newItems)
    onMark(item.word)

    // Check if this move wins
    if (checkBingo(newItems)) {
      onBingo?.()
    }
  }

  return (
    <div className="grid grid-cols-5 gap-2 max-w-md mx-auto aspect-square p-4 bg-white shadow-lg rounded-xl">
      {localItems.sort((a, b) => a.position - b.position).map((item) => (
        <button
          key={item.id}
          onClick={() => handleClick(item)}
          disabled={disabled || item.marked}
          className={cn(
            "flex items-center justify-center p-1 text-xs sm:text-sm font-bold border rounded-md transition-all shadow-sm break-words leading-tight text-center select-none",
            item.marked
              ? "bg-rose-500 text-white border-rose-600 scale-95 opacity-90"
              : "bg-rose-50 text-rose-900 border-rose-200 hover:bg-rose-100 hover:scale-105 active:scale-95",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {item.word}
        </button>
      ))}
    </div>
  )
}
