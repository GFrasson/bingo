"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface AdminControlsProps {
  onDraw: () => Promise<void>
  onStartGame: () => Promise<void>
  gameStatus: string
}

interface AdminControlsProps {
  onDraw: () => Promise<void>
  onStartGame: () => Promise<void>
  onEndGame: () => Promise<void>
  gameStatus: string
}

export function AdminControls({ onDraw, onStartGame, onEndGame, gameStatus }: AdminControlsProps) {
  const [loading, setLoading] = useState(false)

  const handleAction = async (action: () => Promise<void>) => {
    setLoading(true)
    await action()
    setLoading(false)
  }

  if (gameStatus === 'WAITING') {
    return (
      <div className="flex flex-col gap-4 items-center">
        <Button
          onClick={() => handleAction(onStartGame)}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white text-lg py-4 px-6 md:text-xl md:py-6 md:px-10 shadow-xl transition-all active:scale-95"
        >
          {loading ? "Iniciando..." : "Iniciar Jogo"}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      <Button
        onClick={() => handleAction(onDraw)}
        disabled={loading || gameStatus === 'ENDED'}
        className="bg-rose-600 hover:bg-rose-700 text-white text-lg w-full md:text-xl md:py-6 md:px-10 shadow-xl transition-all active:scale-95"
      >
        {loading ? "Sorteando..." : "Sortear Próxima Pedra"}
      </Button>

      <Button
        variant="destructive"
        onClick={() => handleAction(onEndGame)}
        className="bg-rose-800 hover:bg-rose-900 text-white text-lg w-full md:text-xl md:py-6 md:px-10 shadow-xl transition-all active:scale-95"
      >
        Encerrar Jogo
      </Button>
    </div>
  )
}
