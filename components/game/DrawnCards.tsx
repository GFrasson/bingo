import { Dices } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export function DrawnCards({ lastDraw, drawnWords = [] }: { lastDraw: string, drawnWords?: string[] }) {
  const previousDraws = drawnWords.filter(w => w !== lastDraw)

  return (
    <Card className="md:col-span-1 bg-white/90 backdrop-blur border-primary/20 shadow-xl overflow-hidden group flex flex-col h-[400px]">
      <CardHeader className="bg-secondary/30 pb-4 shrink-0">
        <CardTitle className="text-lg text-center font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-2">
          <Dices className="w-5 h-5" /> Última Palavra
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* Main Draw */}
        <div className="flex items-center justify-center min-h-[100px] relative p-6 border-b border-primary/10 shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-full scale-0 group-hover:scale-120 transition-transform duration-700" />
          <div className="text-xl md:text-2xl font-black text-primary text-center break-words z-10 transition-all duration-300 transform group-hover:scale-110">
            {lastDraw || "---"}
          </div>
        </div>

        {/* History */}
        <div className="flex-1 overflow-hidden flex flex-col bg-secondary/10">
          <div className="p-3 bg-secondary/20 border-y border-primary/5">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-center">
              Histórico ({previousDraws.length})
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-wrap gap-2 justify-center content-start">
              {previousDraws.length > 0 ? (
                previousDraws.map((word, i) => (
                  <span
                    key={`${word}-${i}`}
                    className="px-3 py-1.5 bg-white border border-primary/10 rounded-full text-sm font-bold text-primary/70 shadow-sm animate-in zoom-in duration-300 hover:border-primary/30 transition-all cursor-default"
                  >
                    {word}
                  </span>
                ))
              ) : (
                <span className="text-sm text-muted-foreground/50 italic">
                  Nenhuma palavra anterior
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
