import type { BlockShape } from "./block-shapes"

// Check if a block can be placed at the specified position
export function canPlaceBlock(
  board: (string | null)[][],
  block: BlockShape,
  startRow: number,
  startCol: number,
): boolean {
  const rows = board.length
  const cols = board[0].length

  // Check if the block would go out of bounds
  if (startRow + block.shape.length > rows || startCol + block.shape[0].length > cols) {
    return false
  }

  // Check if any cell is already occupied
  for (let r = 0; r < block.shape.length; r++) {
    for (let c = 0; c < block.shape[0].length; c++) {
      if (block.shape[r][c] && board[startRow + r][startCol + c] !== null) {
        return false
      }
    }
  }

  return true
}

// Check for complete horizontal lines
export function checkForCompleteLines(board: (string | null)[][]) {
  const rows = board.length
  const cols = board[0].length
  const newBoard = [...board.map((row) => [...row])]
  let linesCleared = 0

  // Check for complete horizontal lines
  for (let i = 0; i < rows; i++) {
    let isComplete = true

    for (let j = 0; j < cols; j++) {
      if (newBoard[i][j] === null) {
        isComplete = false
        break
      }
    }

    if (isComplete) {
      // Clear the line
      for (let j = 0; j < cols; j++) {
        newBoard[i][j] = null
      }
      linesCleared++
    }
  }

  return { clearedBoard: newBoard, linesCleared }
}

// Apply gravity to make blocks fall after lines are cleared
export function applyGravity(board: (string | null)[][]) {
  const rows = board.length
  const cols = board[0].length
  const newBoard = [...board.map((row) => [...row])]

  // For each column
  for (let j = 0; j < cols; j++) {
    // Start from the bottom and move up
    let emptyRow = rows - 1

    for (let i = rows - 1; i >= 0; i--) {
      if (newBoard[i][j] !== null) {
        // If this cell has a block, move it down to the lowest empty position
        if (i !== emptyRow) {
          newBoard[emptyRow][j] = newBoard[i][j]
          newBoard[i][j] = null
        }
        // Move the empty position up
        emptyRow--
      }
    }
  }

  return newBoard
}

