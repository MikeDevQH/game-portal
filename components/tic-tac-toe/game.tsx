"use client"

import { useState, useEffect } from "react"
import Board from "./board"
import WinningLine from "./winning-line"
import TypewriterText from "./typewriter-text"
import { calculateWinner, getAIMove } from "@/utils/game-logic"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import VictoryModal from "@/components/victory-modal"
import { Hash } from "lucide-react"

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
    <div className="flex flex-col items-center justify-center mt-16">
      <motion.h1
        className="text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-cyan-300 text-transparent bg-clip-text tracking-wider"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        TIC-TAC-TOE
      </motion.h1>

      <div className="flex flex-col md:flex-row gap-8 items-start mb-6 mt-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-72 h-72 bg-cyan-950/30 backdrop-blur-sm rounded-lg border-2 border-cyan-500/30 p-0 overflow-hidden shadow-xl"
        >
          <Board squares={board} onClick={isXNext ? handleMove : () => {}} />
          {showWinningLine && winningLine && <WinningLine start={winningLine[0]} end={winningLine[2]} />}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-cyan-950/40 border-2 border-cyan-500/30 rounded-lg p-4 backdrop-blur-sm w-72"
        >
          <h3 className="text-lg font-medium text-cyan-200 mb-3 tracking-wider">HOW TO PLAY</h3>
          <div className="text-sm text-cyan-300/70 space-y-2 mb-4">
            <p>• You play as <strong>X</strong>, the AI plays as <strong>O</strong></p>
            <p>• Take turns placing your symbol in empty squares</p>
            <p>• The first player to get 3 of their symbols in a row (horizontally, vertically, or diagonally) wins</p>
            <p>• If all squares are filled and no player has won, the game is a draw</p>
          </div>

          <div className="text-xl font-semibold text-cyan-400 tracking-wider text-center">
            <TypewriterText text={status} />
          </div>
          {isGameOver && !showVictoryModal && (
            <Button
              onClick={resetGame}
              variant="outline"
              className="mt-4 w-full bg-cyan-950/60 border-cyan-500/50 hover:bg-cyan-900/60 hover:border-cyan-400/70 text-cyan-200 hover:text-cyan-100 tracking-wider"
            >
              PLAY AGAIN
            </Button>
          )}
        </motion.div>
      </div>

      <VictoryModal
        isOpen={showVictoryModal}
        onClose={() => setShowVictoryModal(false)}
        onPlayAgain={resetGame}
        title="VICTORY!"
        message="Congratulations! You've defeated the AI opponent."
        icon={<Hash className="h-24 w-24 text-cyan-500 drop-shadow-glow-cyan" />}
      />
    </div>
  )
}

