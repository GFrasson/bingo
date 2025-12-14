"use client"

import { useState, useEffect } from "react"
import { markBoard } from "@/app/actions"
import { useGame } from "./GameContext"
import { toast } from "sonner"
import { Board } from "../Board"

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

export function BoardGame({ items, playerId, disabled, onBingo }: BoardProps) {
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
    <Board
      items={localItems}
      onItemClick={handleClick}
      disabled={disabled}
    />
  )
}

