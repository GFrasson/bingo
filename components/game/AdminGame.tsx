"use client"

import { useState } from "react"
import { useRealtime } from "@/lib/realtime/client"
import { AdminControls } from "./AdminControls"
import { drawWord, endGame, startGame } from "@/app/actions"

interface Winner {
  id: string
  name: string
  isBingo: boolean
}

interface AdminGameProps {
  roomId: string
  initialDraws?: any[]
  initialWinners?: Winner[]
  gameStatus?: string
}

export function AdminGame({
  roomId,
  initialDraws = [],
  initialWinners = [],
  gameStatus: initialStatus = 'WAITING'
}: AdminGameProps) {
  const [lastDraw, setLastDraw] = useState<string>(initialDraws[0]?.word || "")
  const [winners, setWinners] = useState<Winner[]>(initialWinners)
  const [gameStatus, setGameStatus] = useState(initialStatus)

  useRealtime(`room-${roomId}`, 'draw', (data: { word: string }) => {
    setLastDraw(data.word)
  })

  useRealtime(`room-${roomId}`, 'bingo', (data: { playerName: string, playerId: string }) => {
    setWinners(prev => {
      if (prev.some(w => w.id === data.playerId)) return prev
      return [...prev, { id: data.playerId, name: data.playerName, isBingo: true }]
    })
  })

  useRealtime(`room-${roomId}`, 'game_started', () => {
    setGameStatus('PLAYING')
  })

  useRealtime(`room-${roomId}`, 'game_ended', () => {
    setGameStatus('ENDED')
  })

  const handleStartGame = async () => {
    await startGame(roomId)
  }

  const handleDraw = async () => {
    await drawWord(roomId)
  }

  const handleEndGame = async () => {
    await endGame(roomId)
  }

  return (
    <div className="w-full flex flex-col items-center gap-8">
      {/* Game Over Banner */}
      {gameStatus === 'ENDED' && (
        <div className="w-full bg-slate-800 text-white p-6 text-center text-3xl font-bold animate-in slide-in-from-top">
          JOGO ENCERRADO
        </div>
      )}

      {/* Winners List - Always visible if there are winners */}
      {winners.length > 0 && (
        <div className="w-full max-w-4xl bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-2xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
            🏆 Vencedores do Bingo ({winners.length})
          </h3>
          <div className="flex flex-wrap gap-3">
            {winners.map(w => (
              <span key={w.id} className="bg-yellow-100 text-yellow-900 border border-yellow-300 px-4 py-2 rounded-full font-bold shadow-sm animate-in zoom-in">
                {w.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {/* Left: Last Draw */}
        <div className="bg-white rounded-lg shadow-md p-6 min-h-[300px] flex flex-col items-center justify-center border-t-4 border-rose-500">
          <h2 className="text-xl font-medium text-gray-500 mb-4 uppercase tracking-widest">Última Pedra</h2>
          <div className="text-5xl md:text-6xl font-black text-rose-600 text-center">
            {lastDraw || "---"}
          </div>
        </div>

        {/* Center: Admin Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2 min-h-[500px] flex flex-col items-center justify-center border-t-4 border-rose-500">
          <div className="w-full flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-8 text-rose-900">Painel do Administrador</h2>
            <AdminControls
              onDraw={handleDraw}
              onStartGame={handleStartGame}
              onEndGame={handleEndGame}
              gameStatus={gameStatus}
            />
            <p className="mt-8 text-sm text-gray-400">Clique para sortear a próxima palavra para todos os jogadores.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
