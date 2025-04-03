import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Gamepad2, Brain, Sparkles, Hash, Apple } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-8 space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 tracking-tight">
            GAME PORTAL
          </h1>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto">
            Choose a game to play from our collection of classic browser games
            reimagined with modern design
          </p>
          <div className="flex justify-center pt-4">
            <Sparkles className="text-blue-300 h-10 w-10 animate-pulse" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <Card className="bg-slate-900/40 border-blue-500/30 hover:border-blue-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/30 group overflow-hidden backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-blue-200 group-hover:text-blue-100">
                MEMORY MATCH
              </CardTitle>
              <CardDescription className="text-blue-300/70">
                Test your memory by finding matching pairs
              </CardDescription>
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

          <Card className="bg-slate-900/40 border-sky-500/30 hover:border-sky-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-sky-900/30 group overflow-hidden backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-sky-200 group-hover:text-sky-100">
                TETRIS
              </CardTitle>
              <CardDescription className="text-sky-300/70">
                The classic block-stacking puzzle game
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 pb-6">
              <div className="h-48 bg-gradient-to-br from-sky-950/50 to-slate-950/50 rounded-md flex items-center justify-center overflow-hidden relative group-hover:from-sky-900/50 group-hover:to-slate-900/50 transition-all duration-500">
                <div className="absolute inset-0 opacity-20 bg-grid-pattern"></div>
                <Gamepad2 className="h-20 w-20 text-sky-400 group-hover:scale-110 transition-transform duration-300 relative z-10" />
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/tetris" className="w-full">
                <Button className="w-full bg-sky-800/80 hover:bg-sky-700 text-sky-100 border border-sky-500/30">
                  PLAY NOW
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="bg-slate-900/40 border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-900/30 group overflow-hidden backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-cyan-200 group-hover:text-cyan-100">
                TIC-TAC-TOE
              </CardTitle>
              <CardDescription className="text-cyan-300/70">
                Classic strategy game against AI opponent
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 pb-6">
              <div className="h-48 bg-gradient-to-br from-cyan-950/50 to-slate-950/50 rounded-md flex items-center justify-center overflow-hidden relative group-hover:from-cyan-900/50 group-hover:to-slate-900/50 transition-all duration-500">
                <div className="absolute inset-0 opacity-20 bg-grid-pattern"></div>
                <Hash className="h-20 w-20 text-cyan-400 group-hover:scale-110 transition-transform duration-300 relative z-10" />
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/tic-tac-toe" className="w-full">
                <Button className="w-full bg-cyan-800/80 hover:bg-cyan-700 text-cyan-100 border border-cyan-500/30">
                  PLAY NOW
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="bg-slate-900/40 border-blue-500/30 hover:border-blue-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/30 group overflow-hidden backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-blue-200 group-hover:text-blue-100">
                SNAKE
              </CardTitle>
              <CardDescription className="text-blue-300/70">
                Guide the snake to eat apples and grow longer
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 pb-6">
              <div className="h-48 bg-gradient-to-br from-blue-950/50 to-green-950/50 rounded-md flex items-center justify-center overflow-hidden relative group-hover:from-blue-900/50 group-hover:to-green-900/50 transition-all duration-500">
                <div className="absolute inset-0 opacity-20 bg-grid-pattern"></div>
                <Apple className="h-20 w-20 text-blue-400 group-hover:scale-110 transition-transform duration-300 relative z-10" />
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/snake" className="w-full">
                <Button className="w-full bg-blue-800/80 hover:bg-blue-700 text-blue-100 border border-blue-500/30">
                  PLAY NOW
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
