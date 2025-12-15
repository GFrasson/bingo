"use client"

import { useState, useEffect } from "react"
import { markBoard } from "@/app/actions"
import { useGame } from "./GameContext"
import { toast } from "sonner"
import { Board } from "../Board"
import { checkBingoPatterns } from "@/lib/bingo"

interface BoardItem {
  id: string
  word: string
  position: number
  marked: boolean
}

interface BoardProps {
  items: BoardItem[]
  playerId?: string
  onBingo?: (patterns: string[]) => void
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



  // Monitor state for Bingo
  useEffect(() => {
    const patterns = checkBingoPatterns(localItems)
    onBingo?.(patterns)
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

