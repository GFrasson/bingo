import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { PATTERN_LABELS, BingoPattern } from "@/lib/bingo";

export function Winners({ winners }: { winners: { id: string; name: string, patterns?: string[] }[] }) {
  if (!winners.length) {
    return null;
  }

  return (
    <Card className="w-full max-w-4xl border-2 border-accent bg-background/80 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-display text-primary flex items-center justify-center gap-3">
          <Trophy className="h-6 w-6 text-yellow-500" />
          Vencedores
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {winners.map(w => (
            <div key={w.id} className="flex flex-col md:flex-row items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-secondary">
              <span className="font-bold text-lg text-secondary-foreground">{w.name}</span>
              {w.patterns && w.patterns.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-center">
                  {w.patterns.map(p => (
                    <Badge key={p} variant="outline" className="bg-white/50 text-xs">
                      {PATTERN_LABELS[p as BingoPattern] || p}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}