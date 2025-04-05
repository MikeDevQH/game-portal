"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Apple } from "lucide-react"
import SnakeSegment from "./snake-segment"

interface BoardProps {
  snake: { x: number; y: number }[]
  apple: { x: number; y: number }
  boardSize: number
  gameOver: boolean
  isPaused: boolean
}

export default function Board({ snake, apple, boardSize, gameOver, isPaused }: BoardProps) {
  const cellSize = 20
  const boardPixelSize = boardSize * cellSize

  return (
    <div
      className="relative bg-emerald-950/50 rounded-md overflow-hidden border-2 border-emerald-500/30"
      style={{
        width: `${boardPixelSize}px`,
        height: `${boardPixelSize}px`,
      }}
    >
      {/* Grid lines */}
      <div
        className="absolute inset-0 grid"
        style={{
          gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
          gridTemplateRows: `repeat(${boardSize}, 1fr)`,
        }}
      >
        {Array.from({ length: boardSize * boardSize }).map((_, i) => (
          <div key={i} className="border border-emerald-500/10" />
        ))}
      </div>

      {/* Snake */}
      <AnimatePresence>
        {snake.map((segment, i) => (
          <SnakeSegment
            key={`${segment.x}-${segment.y}`}
            segment={segment}
            index={i}
            isHead={i === 0}
            cellSize={cellSize}
            direction={i === 0 ? getHeadDirection(snake) : null}
          />
        ))}
      </AnimatePresence>

      {/* Apple */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ type: "spring", damping: 10 }}
        className="absolute flex items-center justify-center"
        style={{
          width: `${cellSize}px`,
          height: `${cellSize}px`,
          left: `${apple.x * cellSize}px`,
          top: `${apple.y * cellSize}px`,
        }}
      >
        <Apple className="w-5 h-5 text-red-500 drop-shadow-glow-red" />
      </motion.div>

      {/* Game over overlay */}
      {gameOver && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
          <div className="text-2xl font-bold text-red-400 tracking-wider">GAME OVER</div>
        </div>
      )}

      {/* Pause overlay */}
      {isPaused && !gameOver && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-sm">
          <div className="text-2xl font-bold text-emerald-300 tracking-wider">PAUSED</div>
        </div>
      )}
    </div>
  )
}

// Helper function to determine the direction the head is facing
function getHeadDirection(snake: { x: number; y: number }[]): string {
  if (snake.length < 2) return "right"

  const head = snake[0]
  const neck = snake[1]

  if (head.x > neck.x) return "right"
  if (head.x < neck.x) return "left"
  if (head.y > neck.y) return "down"
  return "up"
}

