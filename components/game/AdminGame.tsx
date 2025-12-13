"use client"

import { useState } from "react"
import { useRealtime } from "@/lib/realtime/client"
import { AdminControls } from "./AdminControls"
import { drawWord, endGame, startGame } from "@/app/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Dices } from "lucide-react"

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
    <div className="w-full flex flex-col items-center gap-8 py-8 animate-in fade-in duration-700">

      {/* Header / Title */}
      <h1 className="text-5xl md:text-6xl text-primary font-display drop-shadow-sm mb-4">
        Painel da Noiva
      </h1>

      {/* Game Status Banner */}
      {gameStatus === 'ENDED' && (
        <div className="w-full max-w-4xl bg-primary text-primary-foreground p-4 text-center text-2xl font-bold rounded-xl shadow-lg animate-in slide-in-from-top">
          🎉 JOGO ENCERRADO 🎉
        </div>
      )}

      {/* Winners Section */}
      {winners.length > 0 && (
        <Card className="w-full max-w-4xl border-2 border-accent bg-background/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-display text-primary flex items-center justify-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-500" />
              Vencedoras do Bingo ({winners.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-center gap-4">
              {winners.map(w => (
                <Badge
                  key={w.id}
                  variant="secondary"
                  className="px-6 py-2 text-lg rounded-full shadow-md animate-in zoom-in bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-secondary-foreground/20"
                >
                  {w.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-4">
        {/* Last Draw Card */}
        <Card className="md:col-span-1 bg-white/90 backdrop-blur border-primary/20 shadow-xl overflow-hidden group">
          <CardHeader className="bg-secondary/30 pb-4">
            <CardTitle className="text-xl text-center font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-2">
              <Dices className="w-5 h-5" /> Última Pedra
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center min-h-[200px] p-6 relative">
            {/* Decorative background circle */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-full scale-0 group-hover:scale-150 transition-transform duration-700" />

            <div className="text-4xl md:text-5xl font-black text-primary text-center break-words z-10 transition-all duration-300 transform group-hover:scale-110">
              {lastDraw || "---"}
            </div>
          </CardContent>
        </Card>

        {/* Controls Card */}
        <Card className="md:col-span-2 bg-white/90 backdrop-blur border-primary/20 shadow-xl">
          <CardHeader className="bg-secondary/30 pb-4">
            <CardTitle className="text-2xl text-center font-bold text-primary flex items-center justify-center gap-2">
              Controles
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center min-h-[200px] p-8 space-y-8">
            <AdminControls
              onDraw={handleDraw}
              onStartGame={handleStartGame}
              onEndGame={handleEndGame}
              gameStatus={gameStatus}
            />

            {/* Helper Text */}
            <p className="text-muted-foreground text-center max-w-md">
              {gameStatus === 'WAITING' && "Clique em 'Iniciar Jogo' para começar."}
              {gameStatus === 'PLAYING' && "Clique em 'Sortear' para tirar uma nova palavra/pedra."}
              {gameStatus === 'ENDED' && "O jogo acabou. Reinicie a sala se quiser jogar novamente."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

