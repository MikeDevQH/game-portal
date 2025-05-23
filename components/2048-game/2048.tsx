"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

const GRID_SIZE = 4
const CELL_SIZE = 6 // in rem
const CELL_GAP = 0.5 // in rem

type Tile = {
  value: number
  id: string
  mergedFrom?: Tile[]
  justMerged?: boolean
  isNew?: boolean
  row: number
  col: number
}

export default function Game2048() {
  const [board, setBoard] = useState<Tile[]>([])
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false)
  const gameContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    initializeGame()
    const storedBestScore = localStorage.getItem("bestScore")
    if (storedBestScore) setBestScore(Number.parseInt(storedBestScore))

    if (gameContainerRef.current) {
      gameContainerRef.current.focus()
    }
  }, [])

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score)
      localStorage.setItem("bestScore", score.toString())
    }
  }, [score, bestScore])

  const initializeGame = () => {
    const newBoard: Tile[] = []
    addNewTile(newBoard)
    addNewTile(newBoard)
    setBoard(newBoard)
    setScore(0)
    setIsGameOver(false)
  }

  const addNewTile = (board: Tile[]) => {
    const emptyTiles = []
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (!board.some((tile) => tile.row === row && tile.col === col)) {
          emptyTiles.push({ row, col })
        }
      }
    }
    if (emptyTiles.length > 0) {
      const { row, col } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)]
      board.push({
        value: Math.random() < 0.9 ? 2 : 4,
        id: `${row}-${col}-${Date.now()}`,
        row,
        col,
        isNew: true,
      })
    }
  }

  const move = (direction: "up" | "down" | "left" | "right") => {
    if (isGameOver) return

    let newBoard = board.map((tile) => ({ ...tile, justMerged: false, isNew: false }))
    let changed = false
    let newScore = score

    const sortedTiles = [...newBoard].sort((a, b) => {
      if (direction === "up" || direction === "down") {
        return direction === "up" ? a.row - b.row : b.row - a.row
      } else {
        return direction === "left" ? a.col - b.col : b.col - a.col
      }
    })

    for (const tile of sortedTiles) {
      const { row, col } = tile
      let newRow = row
      let newCol = col

      while (true) {
        newRow += direction === "up" ? -1 : direction === "down" ? 1 : 0
        newCol += direction === "left" ? -1 : direction === "right" ? 1 : 0

        if (newRow < 0 || newRow >= GRID_SIZE || newCol < 0 || newCol >= GRID_SIZE) {
          newRow -= direction === "up" ? -1 : direction === "down" ? 1 : 0
          newCol -= direction === "left" ? -1 : direction === "right" ? 1 : 0
          break
        }

        const targetTile = newBoard.find((t) => t.row === newRow && t.col === newCol)
        if (targetTile) {
          if (targetTile.value === tile.value && !targetTile.justMerged) {
            newBoard = newBoard.filter((t) => t !== targetTile && t !== tile)
            newBoard.push({
              value: tile.value * 2,
              id: tile.id,
              row: newRow,
              col: newCol,
              justMerged: true,
              isNew: false,
            })
            newScore += tile.value * 2
            changed = true
          } else {
            newRow -= direction === "up" ? -1 : direction === "down" ? 1 : 0
            newCol -= direction === "left" ? -1 : direction === "right" ? 1 : 0
          }
          break
        }
      }

      if (newRow !== row || newCol !== col) {
        changed = true
        tile.row = newRow
        tile.col = newCol
      }
    }

    if (changed) {
      addNewTile(newBoard)
      setBoard(newBoard)
      setScore(newScore)
      if (isGameOverState(newBoard)) {
        setIsGameOver(true)
      }
    } else if (isGameOverState(newBoard)) {
      setIsGameOver(true)
    }
  }

  const isGameOverState = (board: Tile[]) => {
    if (board.length < GRID_SIZE * GRID_SIZE) return false

    for (const tile of board) {
      const { row, col, value } = tile
      if (
        (row > 0 && board.some((t) => t.row === row - 1 && t.col === col && t.value === value)) ||
        (row < GRID_SIZE - 1 && board.some((t) => t.row === row + 1 && t.col === col && t.value === value)) ||
        (col > 0 && board.some((t) => t.row === row && t.col === col - 1 && t.value === value)) ||
        (col < GRID_SIZE - 1 && board.some((t) => t.row === row && t.col === col + 1 && t.value === value))
      ) {
        return false
      }
    }

    return true
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "ArrowUp":
        move("up")
        break
      case "ArrowDown":
        move("down")
        break
      case "ArrowLeft":
        move("left")
        break
      case "ArrowRight":
        move("right")
        break
    }
  }

  const cellColor = (value: number) => {
    switch (value) {
      case 2:
        return "bg-amber-900/80 text-amber-200"
      case 4:
        return "bg-amber-800/80 text-amber-200"
      case 8:
        return "bg-amber-700/80 text-amber-100"
      case 16:
        return "bg-amber-600/80 text-white"
      case 32:
        return "bg-amber-500/80 text-white"
      case 64:
        return "bg-amber-400/80 text-amber-950"
      case 128:
        return "bg-amber-300/80 text-amber-950"
      case 256:
        return "bg-amber-200/80 text-amber-950"
      case 512:
        return "bg-amber-100/80 text-amber-950"
      case 1024:
        return "bg-amber-50/80 text-amber-950"
      case 2048:
        return "bg-white/80 text-amber-950"
      default:
        return "bg-amber-950/60"
    }
  }

  const tileVariants = {
    initial: { scale: 0 },
    enter: { scale: 1 },
    merged: {
      scale: [1, 1.1, 1],
      transition: { duration: 0.3 },
    },
  }

  return (
    <div
      className="flex flex-col items-center justify-center h-full text-amber-200"
      ref={gameContainerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="2048 Game Board"
    >
      <motion.h1
        className="text-4xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-amber-300 text-transparent bg-clip-text tracking-wider"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        GAME 2048
      </motion.h1>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <motion.div
          className="w-full max-w-md order-2 md:order-1"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-amber-950/40 border-2 border-amber-500/30 p-2 rounded-lg w-fit backdrop-blur-sm">
            <div
              className="relative"
              style={{
                width: `${CELL_SIZE * GRID_SIZE + CELL_GAP * (GRID_SIZE - 1)}rem`,
                height: `${CELL_SIZE * GRID_SIZE + CELL_GAP * (GRID_SIZE - 1)}rem`,
              }}
            >
              {/* Background grid */}
              {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => (
                <div
                  key={`cell-${index}`}
                  className="absolute bg-amber-900/60 rounded-md"
                  style={{
                    width: `${CELL_SIZE}rem`,
                    height: `${CELL_SIZE}rem`,
                    left: `${(index % GRID_SIZE) * (CELL_SIZE + CELL_GAP)}rem`,
                    top: `${Math.floor(index / GRID_SIZE) * (CELL_SIZE + CELL_GAP)}rem`,
                  }}
                />
              ))}
              {/* Tiles */}
              <AnimatePresence>
                {board.map((tile) => (
                  <motion.div
                    key={tile.id}
                    initial={
                      tile.isNew
                        ? {
                            scale: 0,
                            x: tile.col * (CELL_SIZE + CELL_GAP) + "rem",
                            y: tile.row * (CELL_SIZE + CELL_GAP) + "rem",
                          }
                        : { scale: 0 }
                    }
                    animate={{
                      scale: 1,
                      x: tile.col * (CELL_SIZE + CELL_GAP) + "rem",
                      y: tile.row * (CELL_SIZE + CELL_GAP) + "rem",
                    }}
                    exit={{ scale: 0 }}
                    transition={tile.isNew ? { duration: 0.15 } : { x: { duration: 0.15 }, y: { duration: 0.15 } }}
                    className={`absolute rounded-md flex items-center justify-center text-2xl font-bold ${cellColor(tile.value)} shadow-lg`}
                    style={{
                      width: `${CELL_SIZE}rem`,
                      height: `${CELL_SIZE}rem`,
                    }}
                  >
                    <motion.div
                      variants={tileVariants}
                      animate={tile.justMerged ? "merged" : "enter"}
                      className="w-full h-full flex items-center justify-center"
                    >
                      {tile.value}
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="w-full max-w-xs flex flex-col gap-4 order-1 md:order-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex gap-7 mb-4">
            <div className="bg-amber-900/80 border-2 border-amber-500/30 p-2 h-16 w-36 rounded-md text-amber-200 flex flex-col items-center">
              <div className="text-sm text-amber-300/70">SCORE</div>
              <div className="font-bold">{score}</div>
            </div>
            <div className="bg-amber-900/80 border-2 border-amber-500/30 h-16 w-36 rounded-md p-2 text-amber-200 flex flex-col items-center">
              <div className="text-sm text-amber-300/70">BEST</div>
              <div className="font-bold">{bestScore}</div>
            </div>
          </div>

          <div className="bg-amber-900/80 border-2 border-amber-500/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-amber-200 mb-3">HOW TO PLAY</h3>
            <p className="text-sm text-amber-300/70">
              Use your <strong>arrow keys</strong> to move the tiles. When two tiles with the same number touch, they{" "}
              <strong>merge into one!</strong>
            </p>
          </div>

          <Button
            onClick={initializeGame}
            className="bg-amber-800/60 hover:bg-amber-700/80 text-amber-100 border-2 border-amber-500/30 w-full"
          >
            NEW GAME
          </Button>
        </motion.div>
      </div>

      <Dialog open={isGameOver} onOpenChange={setIsGameOver}>
        <DialogContent className="bg-amber-950 border-amber-500/30 text-amber-200">
          <DialogHeader>
            <DialogTitle className="text-xl text-amber-100">Game Over!</DialogTitle>
            <DialogDescription className="text-amber-300">
              Your score: {score}
              {score === bestScore && score > 0 && " (New Best!)"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={initializeGame}
              className="bg-amber-800/60 hover:bg-amber-700/80 text-amber-100 border-2 border-amber-500/30"
            >
              PLAY AGAIN
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

