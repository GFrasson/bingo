"use client"

import { useState } from "react"
import { useRealtime } from "@/lib/realtime/client"
import { Board } from "./Board"
import { declareBingo, markBoard } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Dices, Gift, RefreshCw } from "lucide-react"
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
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#FFC0CB', '#FFD700', '#FFFFFF', '#E6E6FA'] // Pink, Gold, White, Lavender
    })
    await declareBingo(playerId, roomId)
  }

  const isPlayerWinner = playerId && winners.some(w => w.id === playerId)

  return (
    <div className="w-full flex flex-col items-center gap-8 py-8 animate-in fade-in duration-700">

      {/* Header / Title */}
      <h1 className="text-2xl md:text-4xl lg:text-5xl text-primary font-display drop-shadow-sm mb-4 text-center px-4">
        Bingo Chá de Panela
      </h1>

      {/* Game Over Banner */}
      {gameStatus === 'ENDED' && (
        <div className="w-full max-w-4xl bg-primary text-primary-foreground p-4 text-center text-2xl font-bold rounded-xl shadow-lg animate-in slide-in-from-top">
          JOGO ENCERRADO
        </div>
      )}

      {/* Winners List - Always visible if there are winners */}
      {winners.length > 0 && (
        <Card className="w-full max-w-4xl border-2 border-accent bg-background/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-display text-primary flex items-center justify-center gap-3">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Vencedoras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-center gap-2">
              {winners.map(w => (
                <Badge
                  key={w.id}
                  variant="secondary"
                  className="px-3 py-1 text-sm md:text-base rounded-full shadow-md animate-in zoom-in bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-secondary-foreground/20"
                >
                  {w.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Player Bingo Button */}
      {gameStatus === 'PLAYING' && !isPlayerWinner && (
        <div className="fixed bottom-8 right-8 z-50">
          <Button
            onClick={handleDeclareBingo}
            disabled={!canBingo}
            className={canBingo
              ? "bg-green-500 hover:bg-green-600 text-white text-xl md:text-2xl font-display py-4 px-8 md:py-6 md:px-10 h-auto rounded-full shadow-[0_0_50px_rgba(34,197,94,0.5)] animate-bounce hover:scale-110 transition-all border-4 border-white ring-4 ring-green-300"
              : "hidden"
            }
          >
            🎉 BINGO! 🎉
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 w-full max-w-6xl px-4 pb-24">
        {/* Left: Last Draw */}
        <Card className="md:col-span-1 bg-white/90 backdrop-blur border-primary/20 shadow-xl overflow-hidden group h-fit">
          <CardHeader className="bg-secondary/30 pb-4">
            <CardTitle className="text-xl text-center font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-2">
              <Dices className="w-5 h-5" /> Última Pedra
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center min-h-[150px] p-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-full scale-0 group-hover:scale-150 transition-transform duration-700" />
            <div className="text-3xl md:text-4xl font-black text-primary text-center break-words z-10 animate-in zoom-in spin-in-3 duration-300 px-2 leading-tight">
              {lastDraw || "---"}
            </div>
          </CardContent>
        </Card>

        {/* Center: Game Area */}
        <Card className="md:col-span-2 bg-white/90 backdrop-blur border-primary/20 shadow-xl">
          <CardHeader className="bg-secondary/30 pb-4">
            <CardTitle className="text-2xl text-center font-bold text-primary flex items-center justify-center gap-2">
              <Gift className="w-6 h-6" /> Sua Cartela
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6 sm:p-8">
            {initialBoard && initialBoard.length > 0 ? (
              <div className="relative w-full max-w-xl">
                <Board
                  items={initialBoard}
                  onMark={handleMark}
                  onBingo={() => setCanBingo(true)}
                  disabled={gameStatus === 'ENDED' || !!isPlayerWinner}
                />

                {/* Overlay for ended game or winner */}
                {(gameStatus === 'ENDED' || !!isPlayerWinner) && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-20 backdrop-blur-sm rounded-xl animate-in fade-in">
                    <span className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold text-xl shadow-xl">
                      {!!isPlayerWinner ? "Você ganhou! 🥳" : "Jogo Finalizado"}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                <RefreshCw className="w-8 h-8 animate-spin mb-4" />
                <p>Carregando cartela...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

