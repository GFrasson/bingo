"use client"

import { useGame } from "./GameContext"

const gameStatusMap: Record<string, string> = {
  WAITING: 'Aguardando início...',
  PLAYING: 'Jogo em andamento!',
  ENDED: 'Jogo finalizado!'
}

export function GameStatus() {
  const { gameStatus } = useGame()
  const displayStatus = gameStatusMap[gameStatus] ?? ""

  return (
    <h1 className="text-lg text-center text-rose-800">
      {displayStatus}
    </h1>
  )
}
