import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { joinRoom } from "../actions"

export default function JoinPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-rose-50 p-24 text-center">
      <div className="z-10 max-w-md w-full items-center justify-center bg-white p-8 rounded-xl shadow-xl flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-rose-600 font-serif">
          Entrar na Sala
        </h1>

        <form action={joinRoom} className="flex flex-col gap-4 w-full">
          <div className="space-y-2 text-left">
            <label htmlFor="code" className="text-sm font-medium text-gray-700">Código da Sala</label>
            <Input name="code" placeholder="ABCDEF" required className="uppercase border-rose-200 focus-visible:ring-rose-500" />
          </div>

          <div className="space-y-2 text-left">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">Seu Nome</label>
            <Input name="name" placeholder="Maria" required className="border-rose-200 focus-visible:ring-rose-500" />
          </div>

          <Button size="lg" className="w-full bg-rose-500 hover:bg-rose-600 text-white mt-2">
            Entrar
          </Button>
        </form>
      </div>
    </main>
  )
}
