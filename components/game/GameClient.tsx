"use client"

import { AdminGame } from "./AdminGame"
import { PlayerGame } from "./PlayerGame"

interface Winner {
  id: string
  name: string
  isBingo: boolean
}

interface GameClientProps {
  roomId: string
  isAdmin: boolean
  playerId?: string
  initialBoard?: any[]
  initialDraws?: any[]
  initialWinners?: Winner[]
  gameStatus?: string
}

export function GameClient({
  roomId,
  isAdmin,
  playerId,
  initialBoard = [],
  initialDraws = [],
  initialWinners = [],
  gameStatus = 'WAITING'
}: GameClientProps) {
  if (isAdmin) {
    return (
      <AdminGame
        roomId={roomId}
        initialDraws={initialDraws}
        initialWinners={initialWinners}
        gameStatus={gameStatus}
      />
    )
  }

  return (
    <PlayerGame
      roomId={roomId}
      playerId={playerId}
      initialBoard={initialBoard}
      initialDraws={initialDraws}
      initialWinners={initialWinners}
      gameStatus={gameStatus}
    />
  )
}
