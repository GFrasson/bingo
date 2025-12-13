import { Button } from "@/components/ui/button"
import { createRoom } from "./actions"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-rose-50 p-24 text-center">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col gap-8">
        <h1 className="text-6xl font-bold text-rose-600 drop-shadow-sm font-serif">
          Bingo: Chá de Panela
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

          <div className="h-full border-l border-rose-200 mx-2"></div>

          {/* For joining, we might want a Dialog or a separate page. For MVP, just a button/link to a join page or simple input */}
          <Link href="/join">
            <Button variant="outline" size="lg" className="border-rose-400 text-rose-500 hover:bg-rose-100 shadow-sm transition-transform hover:scale-105">
              Entrar na Sala
            </Button>
          </Link>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-rose-200 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-200 rounded-full blur-3xl opacity-30 translate-x-1/3 translate-y-1/3"></div>
    </main>
  )
}
