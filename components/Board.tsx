import { cn } from "@/lib/utils"

interface BoardItem {
  id: string
  word: string
  position: number
  marked: boolean
}

interface BoardProps {
  items: BoardItem[]
  onItemClick?: (item: BoardItem) => Promise<void>
  disabled?: boolean
}

export function Board({ items, onItemClick, disabled }: BoardProps) {
  return (
    <div className="relative flex flex-col items-center justify-center mx-auto aspect-[3/4] p-2 sm:p-8 shadow-2xl rounded-xl overflow-hidden bg-background">
      {/* Full Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/board_background_full_2.png"
          alt=""
          className="w-full h-full object-fill opacity-90"
        />
      </div>

      {/* Title */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-display text-primary z-10 mt-8 sm:mt-16 mb-2 sm:mb-4 drop-shadow-sm rotate-[-2deg]">
        Bingo
      </h1>

      {/* Grid */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-3 w-full z-10 px-3 sm:px-12 md:px-8 mb-8 sm:mb-20 flex-1 content-center">
        {items.sort((a, b) => a.position - b.position).map((item) => (
          <button
            key={item.id}
            onClick={onItemClick ? () => onItemClick(item) : undefined}
            disabled={disabled || item.marked}
            className={cn(
              "relative flex items-center justify-center aspect-square p-1 text-[9px] sm:text-xs md:text-sm font-bold border-2 rounded-xl transition-all duration-300 break-words leading-tight text-center select-none shadow-sm mix-blend-multiply",
              item.marked
                ? "bg-secondary text-secondary-foreground border-secondary-foreground/20 scale-95 shadow-inner"
                : "bg-white text-foreground border-secondary hover:border-primary/50 hover:bg-white hover:scale-105 hover:shadow-md active:scale-95",
              disabled && !item.marked && "opacity-50 cursor-not-allowed bg-slate-50"
            )}
          >
            <span className="z-10 line-clamp-3">{item.word}</span>
          </button>
        ))}
      </div>
    </div>
  )
}