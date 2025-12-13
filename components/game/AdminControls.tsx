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
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white text-xl py-6 px-10 rounded-full shadow-xl"
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
        size="lg"
        className="bg-rose-600 hover:bg-rose-700 text-white text-xl py-8 px-12 rounded-full shadow-xl transition-all active:scale-95"
      >
        {loading ? "Sorteando..." : "Sortear Próxima Pedra"}
      </Button>

      <Button
        variant="destructive"
        onClick={() => handleAction(onEndGame)}
        className="mt-4 opacity-80 hover:opacity-100"
      >
        Encerrar Jogo
      </Button>
    </div>
  )
}
