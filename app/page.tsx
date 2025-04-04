import {
  Gamepad2,
  Brain,
  Sparkles,
  Hash,
  Apple,
  Square,
  Bird,
  Cuboid,
} from "lucide-react";
import GameCard from "@/components/game-card";

export default function HomePage() {
  return (
    <div className="h-screen">
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
          <GameCard
            title="MEMORY MATCH"
            titleColor="text-blue-200"
            hoverTitle="group-hover:text-blue-100"
            description="Test your memory by finding matching pairs"
            descriptionColor="text-blue-300/70"
            icon={Brain}
            iconColor="text-blue-400"
            link="/memory-game"
            borderColor="border-blue-500/30"
            hoverBorderColor="hover:border-blue-400/60"
            textColor="text-blue-200"
            bgGradient="from-blue-950/50 to-sky-950/50"
            hoverShadow="hover:shadow-blue-900/30"
            hoverBgGradient="group-hover:from-blue-900/50 group-hover:to-sky-900/50"
            bgButton="bg-blue-800/80 hover:bg-blue-700 text-blue-100 border border-blue-500/30"
            hoverBgButton="hover:bg-blue-700"
            textButton="text-blue-100"
            borderButton="border-blue-500/30"
          />

          <GameCard
            title="TETRIS"
            titleColor="text-sky-200"
            hoverTitle="group-hover:text-sky-100"
            description="The classic block-stacking puzzle game"
            descriptionColor="text-sky-300/70"
            icon={Gamepad2}
            iconColor="text-sky-400"
            link="/tetris"
            borderColor="border-sky-500/30"
            hoverBorderColor="hover:border-sky-400/60"
            textColor="text-sky-200"
            bgGradient="from-sky-950/50 to-slate-950/50"
            hoverShadow="hover:shadow-sky-900/30"
            hoverBgGradient="group-hover:from-sky-900/50 group-hover:to-slate-900/50"
            bgButton="bg-sky-800/80 hover:bg-sky-700 text-sky-100 border border-sky-500/30"
            hoverBgButton="hover:bg-sky-700"
            textButton="text-sky-100"
            borderButton="border-sky-500/30"
          />

          <GameCard
            title="TIC-TAC-TOE"
            titleColor="text-cyan-200"
            hoverTitle="group-hover:text-cyan-100"
            description="Classic strategy game against AI opponent"
            descriptionColor="text-cyan-300/70"
            icon={Hash}
            iconColor="text-cyan-400"
            link="/tic-tac-toe"
            borderColor="border-cyan-500/30"
            hoverBorderColor="hover:border-cyan-400/60"
            textColor="text-cyan-200"
            bgGradient="from-cyan-950/50 to-slate-950/50"
            hoverShadow="hover:shadow-cyan-900/30"
            hoverBgGradient="group-hover:from-cyan-900/50 group-hover:to-slate-900/50"
            bgButton="bg-cyan-800/80 hover:bg-cyan-700 text-cyan-100 border border-cyan-500/30"
            hoverBgButton="hover:bg-cyan-700"
            textButton="text-cyan-100"
            borderButton="border-cyan-500/30"
          />

          <GameCard
            title="SNAKE"
            titleColor="text-blue-200"
            hoverTitle="group-hover:text-blue-100"
            description="Guide the snake to eat apples and grow longer"
            descriptionColor="text-blue-300/70"
            icon={Apple}
            iconColor="text-blue-400"
            link="/snake"
            borderColor="border-blue-500/30"
            hoverBorderColor="hover:border-blue-400/60"
            textColor="text-blue-200"
            bgGradient="from-blue-950/50 to-slate-950/50"
            hoverShadow="hover:shadow-blue-900/30"
            hoverBgGradient="group-hover:from-blue-900/50 group-hover:to-slate-900/50"
            bgButton="bg-blue-800/80 hover:bg-blue-700 text-blue-100 border border-blue-500/30"
            hoverBgButton="hover:bg-blue-700"
            textButton="text-blue-100"
            borderButton="border-blue-500/30"
          />

          <GameCard
            title="GAME 2048"
            titleColor="text-blue-200"
            hoverTitle="group-hover:text-blue-100"
            description="Merging numbers on a grid until you reach 2048."
            descriptionColor="text-blue-300/70"
            icon={Square}
            iconColor="text-blue-400"
            link="/2048-game"
            borderColor="border-blue-500/30"
            hoverBorderColor="hover:border-blue-400/60"
            textColor="text-blue-200"
            bgGradient="from-blue-950/50 to-slate-950/50"
            hoverShadow="hover:shadow-blue-900/30"
            hoverBgGradient="group-hover:from-blue-900/50 group-hover:to-slate-900/50"
            bgButton="bg-blue-800/80 hover:bg-blue-700 text-blue-100 border border-blue-500/30"
            hoverBgButton="hover:bg-blue-700"
            textButton="text-blue-100"
            borderButton="border-blue-500/30"
          />

          <GameCard
            title="BLOCK PLACING"
            titleColor="text-blue-200"
            hoverTitle="group-hover:text-blue-100"
            description="Match blocks of different shapes to score points"
            descriptionColor="text-blue-300/70"
            icon={Cuboid}
            iconColor="text-blue-400"
            link="/block-placing"
            borderColor="border-blue-500/30"
            hoverBorderColor="hover:border-blue-400/60"
            textColor="text-blue-200"
            bgGradient="from-blue-950/50 to-slate-950/50"
            hoverShadow="hover:shadow-blue-900/30"
            hoverBgGradient="group-hover:from-blue-900/50 group-hover:to-slate-900/50"
            bgButton="bg-blue-800/80 hover:bg-blue-700 text-blue-100 border border-blue-500/30"
            hoverBgButton="hover:bg-blue-700"
            textButton="text-blue-100"
            borderButton="border-blue-500/30"
          />

          <GameCard
            title="FLAPPY BIRD"
            titleColor="text-blue-200"
            hoverTitle="group-hover:text-blue-100"
            description="A classic flappy bird game. Tap to make the bird avoid obstacles."
            descriptionColor="text-blue-300/70"
            icon={Bird}
            iconColor="text-blue-400"
            link="/flappy-bird"
            borderColor="border-blue-500/30"
            hoverBorderColor="hover:border-blue-400/60"
            textColor="text-blue-200"
            bgGradient="from-blue-950/50 to-slate-950/50"
            hoverShadow="hover:shadow-blue-900/30"
            hoverBgGradient="group-hover:from-blue-900/50 group-hover:to-slate-900/50"
            bgButton="bg-blue-800/80 hover:bg-blue-700 text-blue-100 border border-blue-500/30"
            hoverBgButton="hover:bg-blue-700"
            textButton="text-blue-100"
            borderButton="border-blue-500/30"
          />
        </div>
      </div>
    </div>
  );
}
