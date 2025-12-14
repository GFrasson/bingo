"use client"

import { useGame } from "./GameContext"

export function EndGameBanner() {
  const { gameStatus } = useGame()

  if (gameStatus !== 'ENDED') {
    return null
  }

  return (
    <div className="w-full max-w-4xl bg-primary text-primary-foreground p-4 text-center text-2xl font-bold rounded-xl shadow-lg animate-in slide-in-from-top">
      Jogo Encerrado
    </div>
  )
}