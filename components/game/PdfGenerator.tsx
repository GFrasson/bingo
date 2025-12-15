"use client"

import { useState, useRef } from "react"
import html2canvas from "html2canvas-pro"
import jsPDF from "jspdf"
import { getRandomBoard } from "@/lib/themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, FileDown } from "lucide-react"
import { GameProvider } from "@/components/game/GameContext"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Board } from "../Board"

export function PdfGenerator() {
  const [generating, setGenerating] = useState(false)
  const [loadingText, setLoadingText] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [open, setOpen] = useState(false)

  // Ref for the container where we render boards
  const containerRef = useRef<HTMLDivElement>(null)

  // Dummy game context for Board component
  const mockGameContext = {
    roomId: "pdf-gen",
    gameStatus: "PLAYING", // Allows board to be "active" visually if needed, though we disable interaction
    lastDraw: "",
    winners: []
  }

  const generateCards = async () => {
    if (quantity < 1) return
    setGenerating(true)
    setLoadingText("Preparando...")

    try {
      // 1. Prepare data
      const cardsData = Array.from({ length: quantity }).map((_, i) => ({
        id: i,
        items: getRandomBoard('cha_de_panela').map((word, idx) => ({
          id: `${i}-${idx}`,
          word,
          position: idx,
          marked: false
        }))
      }))

      // 2. Wait for DOM to update
      // We need the boards to be rendered. They are rendered based on 'cardsData' state? 
      // No, we can render them imperatively or just conditional rendering in JSX.
      // We will introduce a state 'cardsToRender'
      setCardsToRender(cardsData)

      // Allow React to render
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (!containerRef.current) throw new Error("Container not found")

      const doc = new jsPDF('p', 'mm', 'a4')
      const pageWidth = doc.internal.pageSize.getWidth() // 210mm
      const pageHeight = doc.internal.pageSize.getHeight() // 297mm

      // We want to capture each board div
      const boardElements = containerRef.current.querySelectorAll('.pdf-board-item')

      // Verify images loaded
      const images = Array.from(document.images)
      await Promise.all(images.filter(img => !img.complete).map(img => new Promise(resolve => { img.onload = resolve; img.onerror = resolve })))

      setLoadingText("Gerando PDF...")

      for (let i = 0; i < boardElements.length; i++) {
        const boardEl = boardElements[i] as HTMLElement

        // Capture with high scale for quality
        const canvas = await html2canvas(boardEl, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        })

        const imgData = canvas.toDataURL('image/jpeg', 0.95)

        if (i > 0) {
          doc.addPage()
        }

        // 1 card per page logic
        // Center on A4 (210mm x 297mm)
        const imgWidth = 160 // mm
        const imgHeight = (canvas.height / canvas.width) * imgWidth

        const x = (pageWidth - imgWidth) / 2
        const y = (pageHeight - imgHeight) / 2

        doc.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight)

        // Update progress
        setLoadingText(`Processando ${i + 1}/${quantity}...`)
      }

      doc.save(`bingo-cartelas-${quantity}.pdf`)
      toast.success("PDF gerado com sucesso!")
      setOpen(false)

    } catch (error) {
      console.error(error)
      toast.error("Erro ao gerar PDF")
    } finally {
      setGenerating(false)
      setCardsToRender([])
      setLoadingText("")
    }
  }

  const [cardsToRender, setCardsToRender] = useState<any[]>([])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileDown className="w-4 h-4" />
          Gerar Cartelas
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gerar Cartelas em PDF</DialogTitle>
          <DialogDescription>
            Escolha quantas cartelas deseja gerar. Elas serão salvas em um arquivo PDF.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Quantidade
            </Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="col-span-3"
              min={1}
              max={100}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={generateCards} disabled={generating}>
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {loadingText}
              </>
            ) : (
              "Gerar PDF"
            )}
          </Button>
        </DialogFooter>

        {/* Hidden Rendering Area */}
        <div className="fixed left-[-9999px] top-0" ref={containerRef}>
          <GameProvider roomId="pdf-gen" initialStatus="PLAYING" initialDraws={[]} initialWinners={[]}>
            {cardsToRender.map((card) => (
              <div key={card.id} className="pdf-board-item w-[600px] mb-8">
                <Board
                  items={card.items}
                />
              </div>
            ))}
          </GameProvider>
        </div>

      </DialogContent>
    </Dialog>
  )
}
