import { Dices } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export function LastDrawCard({ lastDraw }: { lastDraw: string }) {
  return (
    <Card className="md:col-span-1 bg-white/90 backdrop-blur border-primary/20 shadow-xl overflow-hidden group">
      <CardHeader className="bg-secondary/30 pb-4">
        <CardTitle className="text-xl text-center font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-2">
          <Dices className="w-5 h-5" /> Última Pedra
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center min-h-[200px] p-6 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-full scale-0 group-hover:scale-120 transition-transform duration-700" />
        <div className="text-4xl md:text-5xl font-black text-primary text-center break-words z-10 transition-all duration-300 transform group-hover:scale-110">
          {lastDraw || "---"}
        </div>
      </CardContent>
    </Card>
  )
}