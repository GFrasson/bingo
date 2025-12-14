import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function Winners({ winners }: { winners: { id: string; name: string }[] }) {
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
        <div className="flex flex-wrap justify-center gap-2">
          {winners.map(w => (
            <Badge
              key={w.id}
              variant="secondary"
              className="px-3 py-1 text-sm md:text-base rounded-full shadow-md animate-in zoom-in bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-secondary-foreground/20"
            >
              {w.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}