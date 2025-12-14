"use client"

import { useGame } from "./GameContext"

const gameStatusMap: Record<string, string> = {
  WAITING: 'Aguardando início...',
  PLAYING: 'Jogo em andamento!',
  ENDED: 'Jogo finalizado!'
}

export function GameStatus() {
  const { gameStatus } = useGame()
  const displayStatus = gameStatusMap[gameStatus] || ""

  return (
    <h1 className="text-2xl mb-8 text-center bg-white/50 px-6 py-2 rounded-full border border-rose-100 text-rose-800">
      {displayStatus}
    </h1>
  )
}
