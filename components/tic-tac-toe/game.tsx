"use client"

import { useState, useEffect } from "react"
import Board from "./board"
import WinningLine from "./winning-line"
import TypewriterText from "./typewriter-text"
import { calculateWinner, getAIMove } from "@/utils/game-logic"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import VictoryModal from "@/components/victory-modal"
import { Trophy } from "lucide-react"

export default function Game() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)
  const [showWinningLine, setShowWinningLine] = useState(false)
  const [showVictoryModal, setShowVictoryModal] = useState(false)

  const winInfo = calculateWinner(board)
  const winner = winInfo ? winInfo.winner : null
  const winningLine = winInfo ? winInfo.line : null
  const isGameOver = winner || board.every(Boolean)

  useEffect(() => {
    if (!isXNext && !isGameOver) {
      const timer = setTimeout(() => {
        const aiMove = getAIMove(board)
        handleMove(aiMove)
      }, 1300)
      return () => clearTimeout(timer)
    }
  }, [isXNext, isGameOver, board])

  useEffect(() => {
    if (winningLine) {
      const timer = setTimeout(() => setShowWinningLine(true), 50)
      return () => clearTimeout(timer)
    }
  }, [winningLine])

  useEffect(() => {
    if (winner === "x") {
      const timer = setTimeout(() => {
        setShowVictoryModal(true)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [winner])

  const handleMove = (i: number) => {
    if (winner || board[i]) return

    const newBoard = board.slice()
    newBoard[i] = isXNext ? "x" : "o"
    setBoard(newBoard)
    setIsXNext(!isXNext)
    setShowWinningLine(false)
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setIsXNext(true)
    setShowWinningLine(false)
    setShowVictoryModal(false)
  }

  let status
  if (winner) {
    status = winner === "x" ? "YOU WIN!" : "AI WINS!"
  } else if (isGameOver) {
    status = "DRAW!"
  } else if (isXNext) {
    status = "YOUR TURN"
  } else {
    status = "AI IS THINKING..."
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-300 via-cyan-300 to-sky-300 text-transparent bg-clip-text tracking-wider">
        TIC-TAC-TOE
      </h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-72 h-72 bg-blue-950/30 backdrop-blur-sm rounded-lg border border-blue-500/30 p-0 overflow-hidden shadow-xl mb-6"
      >
        <Board squares={board} onClick={isXNext ? handleMove : () => {}} />
        {showWinningLine && winningLine && <WinningLine start={winningLine[0]} end={winningLine[2]} />}
      </motion.div>

      <div className="h-16 flex flex-col items-center justify-center">
        <div className="text-xl font-semibold text-cyan-400 tracking-wider">
          <TypewriterText text={status} />
        </div>
        {isGameOver && !showVictoryModal && (
          <Button
            onClick={resetGame}
            variant="outline"
            className="mt-4 bg-blue-950/60 border-blue-500/50 hover:bg-blue-900/60 hover:border-blue-400/70 text-blue-200 hover:text-blue-100 tracking-wider"
          >
            PLAY AGAIN
          </Button>
        )}
      </div>

      <VictoryModal
        isOpen={showVictoryModal}
        onClose={() => setShowVictoryModal(false)}
        onPlayAgain={resetGame}
        title="VICTORY!"
        message="Congratulations! You've defeated the AI opponent."
        icon={<Trophy className="h-24 w-24 text-yellow-400 drop-shadow-glow-yellow" />}
      />
    </div>
  )
}

