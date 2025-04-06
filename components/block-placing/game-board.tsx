"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { BlockShape } from "@/lib/block-placer/block-shapes"
import { canPlaceBlock } from "@/lib/block-placer/game-utils"

interface GameBoardProps {
  board: (string | null)[][]
  selectedBlock: BlockShape | null
  onCellClick: (row: number, col: number) => void
}

export default function GameBoard({ board, selectedBlock, onCellClick }: GameBoardProps) {
  // Preview the block placement on hover
  const [hoverPosition, setHoverPosition] = useState<{ row: number; col: number } | null>(null)

  const handleCellHover = (row: number, col: number) => {
    setHoverPosition({ row, col })
  }

  const handleCellLeave = () => {
    setHoverPosition(null)
  }

  // Get cells that would be affected by block placement
  const getAffectedCells = (row: number, col: number) => {
    if (!selectedBlock) return []

    const affectedCells: { row: number; col: number; valid: boolean }[] = []

    // Check if the block would go out of bounds
    const isValidPlacement = canPlaceBlock(board, selectedBlock, row, col)

    // Add all cells that would be affected by this block
    for (let r = 0; r < selectedBlock.shape.length; r++) {
      for (let c = 0; c < selectedBlock.shape[0].length; c++) {
        if (selectedBlock.shape[r][c]) {
          const cellRow = row + r
          const cellCol = col + c

          // Check if this cell is within bounds
          const isInBounds = cellRow >= 0 && cellRow < board.length && cellCol >= 0 && cellCol < board[0].length

          if (isInBounds) {
            // Check if this specific cell can be placed (not already occupied)
            const isCellValid = board[cellRow][cellCol] === null

            affectedCells.push({
              row: cellRow,
              col: cellCol,
              valid: isCellValid && isValidPlacement,
            })
          }
        }
      }
    }

    return affectedCells
  }

  return (
    // Ensure the board background has a distinct color that contrasts well with the blocks
    <div className="bg-pink-900/80 p-4 rounded-lg shadow-lg border-2 border-pink-500/30">
      <div className="grid grid-cols-8 gap-1.5">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            // Check if this cell is part of the hover preview
            let previewInfo = { isPreview: false, isValid: false, color: "" }

            if (selectedBlock && hoverPosition) {
              const affectedCells = getAffectedCells(hoverPosition.row, hoverPosition.col)

              const matchingCell = affectedCells.find((c) => c.row === rowIndex && c.col === colIndex)

              if (matchingCell) {
                previewInfo = {
                  isPreview: true,
                  isValid: matchingCell.valid,
                  color: selectedBlock.color,
                }
              }
            }

            return (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  w-10 h-10 md:w-11 md:h-11 rounded-sm relative
                  ${cell ? `bg-${cell}-500` : "bg-pink-950/80"}
                  transition-colors duration-200
                `}
                onClick={() => onCellClick(rowIndex, colIndex)}
                onMouseEnter={() => handleCellHover(rowIndex, colIndex)}
                onMouseLeave={handleCellLeave}
                whileHover={{ scale: 1.05 }}
              >
                {/* Preview overlay */}
                {previewInfo.isPreview && (
                  <div
                    className={`
                      absolute inset-0 rounded-sm
                      ${previewInfo.isValid ? `bg-${previewInfo.color}-500 opacity-60` : "bg-red-500 opacity-60"}
                    `}
                  />
                )}
              </motion.div>
            )
          }),
        )}
      </div>
    </div>
  )
}

