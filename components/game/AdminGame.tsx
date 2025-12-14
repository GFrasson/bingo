"use client"

import { useGame } from "./GameContext"
import { AdminControls } from "./AdminControls"
import { drawWord, endGame, startGame } from "@/app/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Dices } from "lucide-react"
import { Winners } from "./Winners"

interface AdminGameProps {
  roomId: string
}

const helperTextMap: Record<string, string> = {
  WAITING: "Clique em 'Iniciar Jogo' para começar.",
  PLAYING: "Clique em 'Sortear' para tirar uma nova palavra/pedra.",
  ENDED: "O jogo acabou. Inicie uma nova sala se quiser jogar novamente.",
}

export function AdminGame({
  roomId,
}: AdminGameProps) {
  const { gameStatus, lastDraw, winners } = useGame()

  const handleStartGame = async () => {
    await startGame(roomId)
  }

  const handleDraw = async () => {
    await drawWord(roomId)
  }

  const handleEndGame = async () => {
    await endGame(roomId)
  }

  const helperText = gameStatus ? helperTextMap[gameStatus] : "";

  return (
    <div className="w-full flex flex-col items-center gap-8 py-8 animate-in fade-in duration-700">
      <h1 className="text-2xl md:text-4xl lg:text-5xl text-primary font-display drop-shadow-sm mb-4 text-center px-4">
        Painel da Noiva
      </h1>

      {gameStatus === 'ENDED' && (
        <div className="w-full max-w-4xl bg-primary text-primary-foreground p-4 text-center text-2xl font-bold rounded-xl shadow-lg animate-in slide-in-from-top">
          🎉 JOGO ENCERRADO 🎉
        </div>
      )}

      <Winners winners={winners} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 w-full max-w-6xl px-4">
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

            <p className="text-muted-foreground text-center max-w-md">
              {helperText}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

