import TicTacToeGame from "@/components/tic-tac-toe/game"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TicTacToePage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-cyan-200 hover:text-cyan-100 hover:bg-cyan-900/20">
            <ArrowLeft className="mr-2 h-4 w-4" />
            BACK TO GAMES
          </Button>
        </Link>
        <TicTacToeGame />
      </div>
    </div>
  )
}

