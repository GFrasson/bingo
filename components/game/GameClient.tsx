"use client"

import { AdminGame } from "./AdminGame"
import { PlayerGame } from "./PlayerGame"
import { GameProvider } from "./GameContext"

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
  return (
    <GameProvider
      roomId={roomId}
      initialStatus={gameStatus}
      initialDraws={initialDraws}
      initialWinners={initialWinners}
    >
      {isAdmin ? (
        <AdminGame
          roomId={roomId}
        />
      ) : (
        <PlayerGame
          roomId={roomId}
          playerId={playerId}
          initialBoard={initialBoard}
        />
      )}
    </GameProvider>
  )
}
