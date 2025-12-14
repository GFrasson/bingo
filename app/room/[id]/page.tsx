import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { GameClient } from "@/components/game/GameClient"
import { cookies } from "next/headers"

interface RoomPageProps {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    admin?: string
    name?: string
  }>
}

export default async function RoomPage(props: RoomPageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const room = await prisma.room.findUnique({
    where: { id: params.id },
    include: {
      draws: {
        orderBy: { timestamp: 'desc' },
        take: 1
      },
      players: {
        where: { isBingo: true },
        select: { id: true, name: true, isBingo: true }
      }
    }
  })

  if (!room) {
    return notFound()
  }

  const isAdmin = searchParams.admin === 'true'
  let player = null;

  // Attempt to find player if not admin
  if (!isAdmin) {
    const cookieStore = await cookies()
    const playerId = cookieStore.get('playerId')?.value

    if (playerId) {
      player = await prisma.player.findUnique({
        where: { id: playerId },
        include: { board: true }
      })
    }
  }

  return (
    <div className="min-h-screen bg-rose-50 flex flex-col">
      <header className="bg-white p-3 md:p-4 shadow-sm flex justify-between items-center px-4 md:px-8">
        <div className="text-lg md:text-xl font-bold text-rose-600 font-serif">
          Sala: {room.code}
        </div>
        <div>
          {isAdmin ? <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">ADMIN</div> : <div className="text-rose-800 text-sm md:text-base">Olá, {player?.name || searchParams.name || 'Visitante'}</div>}
        </div>
      </header>

      <main className="flex-1 p-2 md:p-8 flex flex-col items-center">
        <GameClient
          roomId={room.id}
          isAdmin={isAdmin}
          playerId={player?.id}
          initialBoard={player?.board || []}
          initialDraws={room.draws}
          initialWinners={room.players}
          gameStatus={room.status}
        />
      </main>
    </div>
  )
}
