import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Gamepad2, Brain, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 tracking-tight">
            GAME PORTAL
          </h1>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto">
            Choose a game to play from our collection of classic browser games reimagined with modern design
          </p>
          <div className="flex justify-center pt-4">
            <Sparkles className="text-blue-300 h-8 w-8 animate-pulse" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="bg-slate-900/40 border-blue-500/30 hover:border-blue-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/30 group overflow-hidden backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-blue-200 group-hover:text-blue-100">MEMORY MATCH</CardTitle>
              <CardDescription className="text-blue-300/70">Test your memory by finding matching pairs</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 pb-6">
              <div className="h-48 bg-gradient-to-br from-blue-950/50 to-sky-950/50 rounded-md flex items-center justify-center overflow-hidden relative group-hover:from-blue-900/50 group-hover:to-sky-900/50 transition-all duration-500">
                <div className="absolute inset-0 opacity-20 bg-grid-pattern"></div>
                <Brain className="h-20 w-20 text-blue-400 group-hover:scale-110 transition-transform duration-300 relative z-10" />
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/memory-game" className="w-full">
                <Button className="w-full bg-blue-800/80 hover:bg-blue-700 text-blue-100 border border-blue-500/30">
                  PLAY NOW
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

