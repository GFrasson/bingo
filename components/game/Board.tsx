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
    <div className="grid grid-cols-5 gap-1 sm:gap-3 max-w-xl mx-auto aspect-square p-2 sm:p-6 bg-white shadow-2xl rounded-xl border-4 border-double border-primary/30 relative overflow-hidden">
      {/* Decorative corner */}
      <div className="absolute top-0 left-0 w-16 h-16 bg-secondary/20 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-primary/20 translate-x-1/2 translate-y-1/2 rounded-full blur-xl pointer-events-none" />

      {localItems.sort((a, b) => a.position - b.position).map((item) => (
        <button
          key={item.id}
          onClick={() => handleClick(item)}
          disabled={disabled || item.marked}
          className={cn(
            "relative flex items-center justify-center p-0.5 sm:p-1 text-[9px] sm:text-xs md:text-sm font-bold border-2 rounded-lg transition-all duration-300 break-words leading-none text-center select-none shadow-sm aspect-square overflow-hidden",
            item.marked
              ? "bg-primary text-primary-foreground border-primary scale-95 shadow-inner"
              : "bg-white text-rose-900 border-rose-100 hover:border-primary/50 hover:bg-rose-50 hover:scale-105 active:scale-95",
            disabled && !item.marked && "opacity-50 cursor-not-allowed bg-slate-50"
          )}
        >
          <span className="z-10">{item.word}</span>
        </button>
      ))}
    </div>
  )
}

