"use client"

import { useState } from "react"
import { useRealtime } from "@/lib/realtime/client"
import { Board } from "./Board"
import { declareBingo, markBoard } from "@/app/actions"
import { Button } from "@/components/ui/button"
import confetti from "canvas-confetti"

interface Winner {
  id: string
  name: string
  isBingo: boolean
}

interface PlayerGameProps {
  roomId: string
  playerId?: string
  initialBoard?: any[]
  initialDraws?: any[]
  initialWinners?: Winner[]
  gameStatus?: string
}

export function PlayerGame({
  roomId,
  playerId,
  initialBoard = [],
  initialDraws = [],
  initialWinners = [],
  gameStatus: initialStatus = 'WAITING'
}: PlayerGameProps) {
  const [lastDraw, setLastDraw] = useState<string>(initialDraws[0]?.word || "")
  const [winners, setWinners] = useState<Winner[]>(initialWinners)
  const [gameStatus, setGameStatus] = useState(initialStatus)
  const [canBingo, setCanBingo] = useState(false)

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

  const handleMark = async (word: string) => {
    if (!playerId || gameStatus === 'ENDED') return
    const result = await markBoard(playerId, word)
    if (result && 'error' in result) {
      alert(result.error)
      window.location.reload()
    }
  }

  const handleDeclareBingo = async () => {
    if (!playerId) return
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
    await declareBingo(playerId, roomId)
  }

  const isPlayerWinner = playerId && winners.some(w => w.id === playerId)

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

      {/* Player Bingo Button */}
      {gameStatus === 'PLAYING' && !isPlayerWinner && (
        <div className="fixed bottom-8 right-8 z-50">
          <Button
            onClick={handleDeclareBingo}
            disabled={!canBingo}
            className={canBingo
              ? "bg-green-600 hover:bg-green-700 text-white text-4xl py-12 px-16 rounded-full shadow-2xl animate-bounce"
              : "hidden"
            }
          >
            BINGO!
          </Button>
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

        {/* Center: Game Area */}
        <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2 min-h-[500px] flex flex-col items-center justify-center border-t-4 border-rose-500">
          <div className="w-full flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-8 text-rose-900">Sua Cartela</h2>
            {initialBoard && initialBoard.length > 0 ? (
              <div className="relative">
                <Board
                  items={initialBoard}
                  onMark={handleMark}
                  onBingo={() => setCanBingo(true)}
                  disabled={gameStatus === 'ENDED' || !!isPlayerWinner}
                />
                {/* Overlay for ended game */}
                {gameStatus === 'ENDED' && (
                  <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 backdrop-blur-sm rounded-xl">
                    <span className="bg-slate-800 text-white px-4 py-2 rounded-full font-bold">Jogo Finalizado</span>
                  </div>
                )}
              </div>
            ) : (
              <p>Carregando cartela...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
