"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Zap } from "lucide-react"
import { Card } from "@/components/ui/card"
import VictoryModal from "@/components/victory-modal"
import Board from "./board"
import Controls from "./controls"
import {
  SNAKE_START,
  APPLE_START,
  DIRECTIONS,
  SPEED,
  BOARD_SIZE,
  checkCollision,
  appleAte,
  generateApple,
} from "@/utils/snake-game-utils"

export default function SnakeGame() {
  const [snake, setSnake] = useState(SNAKE_START)
  const [apple, setApple] = useState(APPLE_START)
  const [direction, setDirection] = useState(DIRECTIONS.RIGHT)
  const [speed, setSpeed] = useState<number | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [showVictoryModal, setShowVictoryModal] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)

  // Move snake
  const moveSnake = useCallback(() => {
    if (isPaused) return

    const newSnake = [...snake]
    const newSnakeHead = {
      x: newSnake[0].x + direction.x,
      y: newSnake[0].y + direction.y,
    }

    // Check for collisions
    if (
      newSnakeHead.x < 0 ||
      newSnakeHead.x >= BOARD_SIZE ||
      newSnakeHead.y < 0 ||
      newSnakeHead.y >= BOARD_SIZE ||
      checkCollision(newSnakeHead, newSnake)
    ) {
      handleGameOver()
      return
    }

    // Add new head
    newSnake.unshift(newSnakeHead)

    // Check if apple eaten
    if (appleAte(newSnakeHead, apple)) {
      setApple(generateApple(newSnake))
      setScore((prevScore) => {
        const newScore = prevScore + 1
        // Check for victory at certain score
        if (newScore >= 15 && newScore % 5 === 0) {
          setShowVictoryModal(true)
          setIsPaused(true)
        }
        return newScore
      })
      // Increase speed slightly with each apple
      setSpeed((prevSpeed) => (prevSpeed ? Math.max(prevSpeed * 0.95, 50) : SPEED))
    } else {
      // Remove tail if no apple eaten
      newSnake.pop()
    }

    setSnake(newSnake)
  }, [snake, direction, apple, isPaused])

  // Start game
  const startGame = useCallback(() => {
    setSnake(SNAKE_START)
    setApple(APPLE_START)
    setDirection(DIRECTIONS.RIGHT)
    setSpeed(SPEED)
    setGameOver(false)
    setScore(0)
    setIsPaused(false)
    setGameStarted(true)
    setShowVictoryModal(false)
  }, [])

  // Handle game over
  const handleGameOver = () => {
    setGameOver(true)
    setSpeed(null)
    setHighScore((prev) => Math.max(prev, score))
    setGameStarted(false)
  }

  // Continue game after modal
  const continueGame = () => {
    setIsPaused(false)
    setShowVictoryModal(false)
  }

  // Toggle pause
  const togglePause = () => {
    setIsPaused((prev) => !prev)
  }

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted || gameOver) return

      switch (e.key) {
        case "ArrowUp":
          // Prevent moving down when going up
          if (direction !== DIRECTIONS.DOWN) {
            setDirection(DIRECTIONS.UP)
          }
          break
        case "ArrowDown":
          // Prevent moving up when going down
          if (direction !== DIRECTIONS.UP) {
            setDirection(DIRECTIONS.DOWN)
          }
          break
        case "ArrowLeft":
          // Prevent moving right when going left
          if (direction !== DIRECTIONS.RIGHT) {
            setDirection(DIRECTIONS.LEFT)
          }
          break
        case "ArrowRight":
          // Prevent moving left when going right
          if (direction !== DIRECTIONS.LEFT) {
            setDirection(DIRECTIONS.RIGHT)
          }
          break
        case " ":
          // Space to pause/resume
          togglePause()
          break
        default:
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [direction, gameStarted, gameOver])

  // Game loop
  useEffect(() => {
    if (gameStarted && !gameOver && speed && !isPaused) {
      gameLoopRef.current = setInterval(moveSnake, speed)
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [moveSnake, gameStarted, gameOver, speed, isPaused])

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-300 via-cyan-300 to-sky-300 text-transparent bg-clip-text tracking-wider">
        SNAKE GAME
      </h1>

      <div className="flex flex-col md:flex-row gap-6 items-center mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-slate-900/40 border-blue-500/30 p-4 rounded-lg shadow-lg backdrop-blur-sm">
            <Board snake={snake} apple={apple} boardSize={BOARD_SIZE} gameOver={gameOver} isPaused={isPaused} />
          </Card>
        </motion.div>

        <div className="flex flex-col gap-4">
          <div className="bg-slate-900/40 border border-blue-500/30 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-xl font-bold text-blue-200 tracking-wide">SCORE: {score}</div>
            <div className="text-lg text-blue-300 tracking-wide">HIGH SCORE: {highScore}</div>

            {gameOver && <div className="mt-4 text-2xl font-bold text-red-400 tracking-wider">GAME OVER</div>}

            {!gameStarted && !gameOver && (
              <div className="mt-4 text-xl font-medium text-blue-300 tracking-wider">PRESS START TO PLAY</div>
            )}

            {isPaused && !gameOver && !showVictoryModal && (
              <div className="mt-4 text-xl font-medium text-yellow-300 tracking-wider">PAUSED</div>
            )}

            <div className="flex flex-col gap-3 mt-4">
              <Button
                onClick={gameStarted ? togglePause : startGame}
                className="bg-blue-800/80 hover:bg-blue-700 text-blue-100 border-none tracking-wider"
              >
                {gameOver ? "PLAY AGAIN" : gameStarted ? (isPaused ? "RESUME" : "PAUSE") : "START GAME"}
              </Button>
            </div>
          </div>

          <Controls onDirectionChange={setDirection} />

          <div className="bg-slate-900/40 border border-blue-500/30 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="text-lg font-medium text-blue-200 mb-3 tracking-wider">HOW TO PLAY</h3>
            <div className="text-sm text-blue-300/70">
              <p>Use ARROW KEYS to control the snake</p>
              <p>Collect apples to grow longer</p>
              <p>Avoid hitting walls and yourself</p>
              <p>Press SPACE to pause the game</p>
            </div>
          </div>
        </div>
      </div>

      <VictoryModal
        isOpen={showVictoryModal}
        onClose={continueGame}
        onPlayAgain={startGame}
        title={`LEVEL UP: ${score} POINTS!`}
        message="Congratulations! You're a snake master. Keep going for a higher score!"
        icon={<Zap className="h-24 w-24 text-yellow-400 drop-shadow-glow-yellow" />}
      />
    </div>
  )
}

