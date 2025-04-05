"use client"

import { Gamepad2, Brain, Sparkles, Hash, Apple, Square, Bird, Cuboid, Spline } from "lucide-react"
import GameCard from "@/components/game-card"
import { motion } from "framer-motion"

export default function HomePage() {
  return (
    <div className="h-screen">
      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-12 space-y-6">
          <div className="relative inline-block">
            <motion.h1
              className="text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 tracking-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              GAME PORTAL
            </motion.h1>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
              animate={{
                opacity: [0, 0.5, 0],
                x: [-200, 200],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 5,
              }}
            />
          </div>
          <motion.p
            className="text-lg text-blue-200/80 max-w-2xl mx-auto font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Explore our collection of classic browser games reimagined with modern design
          </motion.p>
          <motion.div
            className="flex justify-center pt-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            <Sparkles className="text-blue-300 h-8 w-8 animate-pulse" />
          </motion.div>
        </div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <GameCard
            title="MEMORY MATCH"
            description="Test your memory by finding matching pairs"
            icon={Brain}
            link="/memory-game"
            color="blue"
          />

          <GameCard
            title="TETRIS"
            description="The classic block-stacking puzzle game"
            icon={Gamepad2}
            link="/tetris"
            color="purple"
          />

          <GameCard
            title="TIC-TAC-TOE"
            description="Classic strategy game against AI opponent"
            icon={Hash}
            link="/tic-tac-toe"
            color="cyan"
          />

          <GameCard
            title="SNAKE"
            description="Guide the snake to eat apples and grow longer"
            icon={Apple}
            link="/snake"
            color="green"
          />

          <GameCard
            title="GAME 2048"
            description="Merging numbers on a grid until you reach 2048"
            icon={Square}
            link="/2048-game"
            color="amber"
          />

          <GameCard
            title="BLOCK PLACING"
            description="Match blocks of different shapes to score points"
            icon={Cuboid}
            link="/block-placing"
            color="pink"
          />

          <GameCard
            title="FLAPPY BIRD"
            description="A classic flappy bird game. Tap to avoid obstacles"
            icon={Bird}
            link="/flappy-bird"
            color="sky"
          />
        </motion.div>
      </div>
    </div>
  )
}

