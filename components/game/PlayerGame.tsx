"use client"

import { useState } from "react"
import { BoardGame } from "./BoardGame"
import { useGame } from "./GameContext"
import { declareBingo } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RefreshCw } from "lucide-react"
import confetti from "canvas-confetti"
import { Winners } from "./Winners"
import { LastDrawCard } from "./LastDrawCard"
import { EndGameBanner } from "./EndGameBanner"

interface PlayerGameProps {
  roomId: string
  playerId?: string
  initialBoard?: any[]
}

export function PlayerGame({
  roomId,
  playerId,
  initialBoard = [],
}: PlayerGameProps) {
  const { gameStatus, lastDraw, winners } = useGame()
  const [canBingo, setCanBingo] = useState(false)

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

      <h1 className="text-2xl md:text-4xl lg:text-5xl text-primary font-display drop-shadow-sm mb-4 text-center px-4">
        Bingo Chá de Panela
      </h1>

      <EndGameBanner />

      <Winners winners={winners} />

      {gameStatus === 'PLAYING' && !isPlayerWinner && (
        <div className="fixed bottom-8 right-8 z-50">
          <Button
            onClick={handleDeclareBingo}
            disabled={!canBingo}
            className={canBingo
              ? "bg-green-400 hover:bg-green-500 cursor-pointer text-white text-xl md:text-2xl py-4 px-8 md:py-6 md:px-10 h-auto border-2 border-green-500"
              : "hidden"
            }
          >
            BINGO! 🎉
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 w-full max-w-6xl px-4 pb-24">
        <LastDrawCard lastDraw={lastDraw} />

        <Card className="md:col-span-2 bg-white/90 backdrop-blur border-primary/20 shadow-xl">
          {initialBoard && initialBoard.length > 0 ? (
            <div className="relative w-full">
              <BoardGame
                items={initialBoard}
                onBingo={setCanBingo}
                disabled={gameStatus === 'ENDED' || !!isPlayerWinner}
                playerId={playerId}
              />

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
        </Card>
      </div>
    </div>
  )
}

