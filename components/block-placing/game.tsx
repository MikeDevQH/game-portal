"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import GameBoard from "@/components/block-placing/game-board"
import BlockSelector from "@/components/block-placing/block-selector"
import ScoreDisplay from "@/components/block-placing/score-display"
import LevelDisplay from "@/components/block-placing/level-display"
import { checkForCompleteLines, canPlaceBlock } from "@/lib/block-placer/game-utils"
import { type BlockShape, BLOCK_SHAPES } from "@/lib/block-placer/block-shapes"

// Game settings
const BOARD_SIZE = 8
const POINTS_PER_LINE = 100
const BLOCKS_PER_LEVEL = 10

export default function GameContainer() {
  // Game board - 8x8 grid, empty (null) cells
  const [gameBoard, setGameBoard] = useState<(string | null)[][]>(
    Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(null)),
  )
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [placedBlocks, setPlacedBlocks] = useState(0)
  const [availableBlocks, setAvailableBlocks] = useState<BlockShape[]>([])
  const [selectedBlock, setSelectedBlock] = useState<BlockShape | null>(null)
  const [isGameOver, setIsGameOver] = useState(false)

  // Initialize available blocks
  useEffect(() => {
    generateNewBlocks()
  }, [])

  // Check for level up
  useEffect(() => {
    if (placedBlocks >= level * BLOCKS_PER_LEVEL) {
      setLevel((prev) => prev + 1)
      generateNewBlocks(true) // Generate new blocks with bonus
    }
  }, [placedBlocks, level])

  // Check for game over
  useEffect(() => {
    if (availableBlocks.length > 0 && !canPlaceAnyBlock()) {
      setIsGameOver(true)
    }
  }, [gameBoard, availableBlocks])

  // Add keyboard listener for rotation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Rotate when 'R' or 'r' is pressed
      if ((e.key === "r" || e.key === "R") && selectedBlock) {
        rotateSelectedBlock()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [selectedBlock]) // Re-add listener when selected block changes

  const startNewGame = () => {
    setGameBoard(
      Array(BOARD_SIZE)
        .fill(null)
        .map(() => Array(BOARD_SIZE).fill(null)),
    )
    setScore(0)
    setLevel(1)
    setPlacedBlocks(0)
    setSelectedBlock(null)
    setIsGameOver(false)
    generateNewBlocks()
  }

  const generateNewBlocks = (isLevelUp = false) => {
    // Always generate exactly 3 new blocks
    const count = 3
    const newBlocks: BlockShape[] = []

    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * BLOCK_SHAPES.length)
      const block = JSON.parse(JSON.stringify(BLOCK_SHAPES[randomIndex])) as Omit<BlockShape, "id" | "color">

      // Assign random color
      const colors = ["red", "blue", "green", "yellow", "purple"]
      const randomColor = colors[Math.floor(Math.random() * colors.length)]

      // Add unique ID and color
      const newBlock: BlockShape = {
        ...block,
        color: randomColor,
        id: `block-${Date.now()}-${i}`,
      }

      newBlocks.push(newBlock)
    }

    // Replace existing blocks instead of adding to them
    setAvailableBlocks(newBlocks)
  }

  const handleBlockSelect = (block: BlockShape) => {
    setSelectedBlock(block)
  }

  const handleCellClick = (row: number, col: number) => {
    if (!selectedBlock) return

    // Check if block can be placed at this position
    if (canPlaceBlock(gameBoard, selectedBlock, row, col)) {
      // Create a copy of the board
      const newBoard = [...gameBoard.map((row) => [...row])]

      // Place the block on the board
      selectedBlock.shape.forEach((blockRow, rowOffset) => {
        blockRow.forEach((cell, colOffset) => {
          if (cell) {
            newBoard[row + rowOffset][col + colOffset] = selectedBlock.color
          }
        })
      })

      // Update the board
      setGameBoard(newBoard)

      // Remove the placed block from available blocks
      setAvailableBlocks((prev) => prev.filter((block) => block.id !== selectedBlock.id))

      // Increment placed blocks counter
      setPlacedBlocks((prev) => prev + 1)

      // Clear the selected block
      setSelectedBlock(null)

      // Check for complete lines
      const { clearedBoard, linesCleared } = checkForCompleteLines(newBoard)

      if (linesCleared > 0) {
        // Award points for cleared lines
        const pointsEarned = linesCleared * POINTS_PER_LINE * level
        setScore((prev) => prev + pointsEarned)

        // Update the board with cleared lines, but don't apply gravity
        setGameBoard(clearedBoard)
      }

      // Generate new blocks only if all blocks have been used
      if (availableBlocks.length <= 1) {
        // If this was the last block, generate 3 new ones
        generateNewBlocks()
      }
    }
  }

  const canPlaceAnyBlock = () => {
    // Check if any available block can be placed anywhere on the board
    for (const block of availableBlocks) {
      for (let row = 0; row <= BOARD_SIZE - block.shape.length; row++) {
        for (let col = 0; col <= BOARD_SIZE - block.shape[0].length; col++) {
          if (canPlaceBlock(gameBoard, block, row, col)) {
            return true
          }
        }
      }
    }
    return false
  }

  const rotateSelectedBlock = () => {
    if (!selectedBlock) return

    // Create a deep copy of the selected block
    const rotatedBlock = JSON.parse(JSON.stringify(selectedBlock)) as BlockShape

    // Get the dimensions of the current shape
    const rows = rotatedBlock.shape.length
    const cols = rotatedBlock.shape[0].length

    // Create a new rotated shape matrix
    const newShape: boolean[][] = Array(cols)
      .fill(null)
      .map(() => Array(rows).fill(false))

    // Perform the rotation (90 degrees clockwise)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        newShape[c][rows - 1 - r] = rotatedBlock.shape[r][c]
      }
    }

    rotatedBlock.shape = newShape
    setSelectedBlock(rotatedBlock)
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 text-transparent bg-clip-text tracking-wider">
        BLOCK PLACER
      </h1>

      <div className="flex gap-10 items-start max-w-6xl mx-auto">
        {/* Left side - Scores and buttons */}
        <div className="flex flex-col gap-6 w-48">
          {/* Score and Level displays */}
          <div className="flex flex-col gap-3">
            <ScoreDisplay score={score} />
            <LevelDisplay level={level} />
          </div>

          {/* Control buttons */}
          <div className="flex flex-col gap-3 w-full">
            <Button
              onClick={rotateSelectedBlock}
              disabled={!selectedBlock}
              variant="outline"
              className="bg-blue-800/80 hover:bg-blue-700 text-blue-100 border border-blue-500/30 w-full"
            >
              Rotate Block (R)
            </Button>

            <Button
              onClick={() => startNewGame()}
              className="bg-blue-800/80 hover:bg-blue-700 text-blue-100 border border-blue-500/30 w-full"
            >
              New Game
            </Button>
          </div>
        </div>

        {/* Center - Game board and block selector */}
        <div className="flex flex-col gap-2 items-center">
          {/* Game board */}
          <div className="bg-slate-900/40 border border-blue-500/30 p-2 rounded-lg ">
            <GameBoard board={gameBoard} selectedBlock={selectedBlock} onCellClick={handleCellClick} />
          </div>

            {/* Block selector */}
          <BlockSelector blocks={availableBlocks} selectedBlock={selectedBlock} onSelectBlock={handleBlockSelect}/>
          </div>

        {/* Right side - Instructions panel */}
        <div className="bg-slate-800/80 border border-blue-500/30 p-5 rounded-lg shadow-lg w-96">
          <h3 className="text-lg font-semibold text-blue-200 mb-4 tracking-wider">HOW TO PLAY</h3>
          <ul className="list-disc pl-5 space-y-3 text-blue-300/90">
            <li>Select a block from the available blocks below the game board</li>
            <li>Click on the board to place the selected block</li>
            <li>You'll get 3 new blocks after using all available blocks</li>
            <li>
              Rotate blocks by clicking the Rotate button or pressing the{" "}
              <kbd className="px-2 py-1 bg-slate-700 rounded text-sm text-blue-300 border border-blue-500/30">R</kbd>{" "}
              key
            </li>
            <li>Form complete horizontal lines to clear them and earn points</li>
            <li>The game ends when you can't place any more blocks</li>
            <li>Try to reach higher levels for more points!</li>
          </ul>
        </div>
      </div>

      {/* Game Over Dialog */}
      <Dialog open={isGameOver} onOpenChange={setIsGameOver}>
        <DialogContent className="bg-slate-900 border-blue-500/30 text-blue-200">
          <DialogHeader>
            <DialogTitle className="text-blue-100 text-xl">Game Over!</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-blue-300">Your final results:</DialogDescription>
          <div className="py-4 text-blue-200">
            <p className="text-lg">Final score: {score}</p>
            <p className="text-lg">Level reached: {level}</p>
            <p className="text-lg">Blocks placed: {placedBlocks}</p>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                startNewGame()
                setIsGameOver(false)
              }}
              className="bg-blue-800/80 hover:bg-blue-700 text-blue-100 border border-blue-500/30"
            >
              Play Again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

