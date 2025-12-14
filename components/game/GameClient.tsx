"use client"

import { AdminGame } from "./AdminGame"
import { PlayerGame } from "./PlayerGame"

interface GameClientProps {
  roomId: string
  isAdmin: boolean
  playerId?: string
  initialBoard?: any[]
}

export function GameClient({
  roomId,
  isAdmin,
  playerId,
  initialBoard = []
}: GameClientProps) {
  if (isAdmin) {
    return <AdminGame roomId={roomId} />
  }

  return (
    <PlayerGame
      roomId={roomId}
      playerId={playerId}
      initialBoard={initialBoard}
    />
  )
}
