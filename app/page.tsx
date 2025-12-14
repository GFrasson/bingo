import { Button } from "@/components/ui/button"
import { createRoom } from "./actions"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-rose-50 p-24 text-center">
      <div className="z-10 max-w-5xl w-full items-center justify-center text-sm flex flex-col gap-8">
        <h1 className="text-6xl font-bold text-rose-600 drop-shadow-sm">
          Bingo!
        </h1>
        <p className="text-xl text-rose-800 max-w-md">
          Crie uma sala para começar a brincadeira ou entre em uma sala existente.
        </p>

        <div className="flex gap-4 items-center">
          <form action={createRoom}>
            <Button size="lg" className="bg-rose-500 hover:bg-rose-600 text-white shadow-lg transition-transform hover:scale-105">
              Criar Nova Sala
            </Button>
          </form>

          <Link href="/join">
            <Button variant="outline" size="lg" className="border-rose-400 text-rose-500 hover:bg-rose-100 shadow-sm transition-transform hover:scale-105">
              Entrar na Sala
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
