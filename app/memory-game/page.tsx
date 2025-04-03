import MemoryGame from "@/components/memory-game/memory-game"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function MemoryGamePage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-blue-200 hover:text-blue-100 hover:bg-blue-900/20">
            <ArrowLeft className="mr-2 h-4 w-4" />
            BACK TO GAMES
          </Button>
        </Link>
        <MemoryGame />
      </div>
    </div>
  )
}

