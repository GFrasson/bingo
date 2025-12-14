"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { markBoard } from "@/app/actions"
import { useGame } from "./GameContext"
import { toast } from "sonner"

interface BoardItem {
  id: string
  word: string
  position: number
  marked: boolean
}

interface BoardProps {
  items: BoardItem[]
  playerId?: string
  onBingo?: (isBingo: boolean) => void
  disabled?: boolean
}

export function Board({ items, playerId, disabled, onBingo }: BoardProps) {
  const { gameStatus } = useGame()
  const [localItems, setLocalItems] = useState(items)

  const handleMark = async (word: string): Promise<boolean> => {
    if (!playerId || gameStatus === 'ENDED') {
      return false
    }

    const result = await markBoard(playerId, word)

    if (result && 'error' in result) {
      toast.error(result.error)
      return false
    }

    return true
  }

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

  // Monitor state for Bingo
  useEffect(() => {
    const isBingo = checkBingo(localItems)
    onBingo?.(isBingo)
  }, [localItems])

  const handleClick = async (item: BoardItem) => {
    if (disabled || item.marked) return

    // Optimistic Update: Mark the item
    setLocalItems(prev => prev.map(i => i.id === item.id ? { ...i, marked: true } : i))

    try {
      const success = await handleMark(item.word)

      if (!success) {
        // Revert: Unmark only this item
        setLocalItems(prev => prev.map(i => i.id === item.id ? { ...i, marked: false } : i))
      }
    } catch (error) {
      // Revert on error
      setLocalItems(prev => prev.map(i => i.id === item.id ? { ...i, marked: false } : i))
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center mx-auto aspect-[3/4] p-2 sm:p-8 shadow-2xl rounded-xl overflow-hidden bg-background">
      {/* Full Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/board_background_full_2.png"
          alt=""
          className="w-full h-full object-fill opacity-90"
        />
      </div>

      {/* Title */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-display text-primary z-10 mt-8 sm:mt-16 mb-2 sm:mb-4 drop-shadow-sm rotate-[-2deg]">
        Bingo
      </h1>

      {/* Grid */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-3 w-full z-10 px-3 sm:px-12 mb-8 sm:mb-20 flex-1 content-center">
        {localItems.sort((a, b) => a.position - b.position).map((item) => (
          <button
            key={item.id}
            onClick={() => handleClick(item)}
            disabled={disabled || item.marked}
            className={cn(
              "relative flex items-center justify-center aspect-square p-1 text-[9px] sm:text-xs md:text-sm font-bold border-2 rounded-xl transition-all duration-300 break-words leading-tight text-center select-none shadow-sm mix-blend-multiply",
              item.marked
                ? "bg-secondary text-secondary-foreground border-secondary-foreground/20 scale-95 shadow-inner"
                : "bg-white text-foreground border-secondary hover:border-primary/50 hover:bg-white hover:scale-105 hover:shadow-md active:scale-95",
              disabled && !item.marked && "opacity-50 cursor-not-allowed bg-slate-50"
            )}
          >
            <span className="z-10 line-clamp-3">{item.word}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

