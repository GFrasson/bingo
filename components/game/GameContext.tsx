"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import Pusher from "pusher-js"

interface Winner {
  id: string
  name: string
  isBingo: boolean
}

interface GameState {
  roomId: string
  gameStatus: string
  lastDraw: string
  winners: Winner[]
}

interface GameContextType extends GameState {
}

const GameContext = createContext<GameContextType | undefined>(undefined)

interface GameProviderProps {
  children: ReactNode
  roomId: string
  initialStatus?: string
  initialDraws?: any[]
  initialWinners?: Winner[]
}

export function GameProvider({
  children,
  roomId,
  initialStatus = 'WAITING',
  initialDraws = [],
  initialWinners = []
}: GameProviderProps) {
  const [gameStatus, setGameStatus] = useState(initialStatus)
  const [lastDraw, setLastDraw] = useState<string>(initialDraws[0]?.word || "")
  const [winners, setWinners] = useState<Winner[]>(initialWinners)

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PUSHER_KEY) {
      console.warn('Pusher key not found')
      return
    }

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'us2',
    })

    const channel = pusher.subscribe(`room-${roomId}`)

    // Event Handlers
    const handleDraw = (data: { word: string }) => {
      setLastDraw(data.word)
    }

    const handleBingo = (data: { playerName: string, playerId: string }) => {
      setWinners(prev => {
        if (prev.some(w => w.id === data.playerId)) return prev
        return [...prev, { id: data.playerId, name: data.playerName, isBingo: true }]
      })
    }

    const handleGameStarted = () => {
      setGameStatus('PLAYING')
    }

    const handleGameEnded = () => {
      setGameStatus('ENDED')
    }

    // Bind events
    channel.bind('draw', handleDraw)
    channel.bind('bingo', handleBingo)
    channel.bind('game_started', handleGameStarted)
    channel.bind('game_ended', handleGameEnded)

    return () => {
      channel.unbind('draw', handleDraw)
      channel.unbind('bingo', handleBingo)
      channel.unbind('game_started', handleGameStarted)
      channel.unbind('game_ended', handleGameEnded)
      pusher.unsubscribe(`room-${roomId}`)
    }
  }, [roomId])

  return (
    <GameContext.Provider value={{
      roomId,
      gameStatus,
      lastDraw,
      winners,
    }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}
