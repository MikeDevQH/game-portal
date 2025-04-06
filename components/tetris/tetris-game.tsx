"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Music, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Gamepad2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import VictoryModal from "@/components/victory-modal"

// Completely revised TETROMINOS with bright, high-contrast colors
// Using custom CSS classes instead of Tailwind colors to ensure visibility
const TETROMINOS = {
  I: {
    shape: [[1, 1, 1, 1]],
    color: "tetris-block-cyan",
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: "tetris-block-blue",
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    color: "tetris-block-orange",
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "tetris-block-yellow",
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: "tetris-block-green",
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: "tetris-block-red",
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: "tetris-block-magenta",
  },
}

// Modificar el tamaño del tablero de Tetris para hacerlo más ancho y proporcionado
// Cambiar estas constantes:
const BOARD_WIDTH = 12
const BOARD_HEIGHT = 20
const INITIAL_DROP_TIME = 800
const SOFT_DROP_FACTOR = 0.2 // Soft drop is 5x faster than normal
const SPEED_INCREASE_FACTOR = 0.95
const HIGH_SCORE_THRESHOLD = 1000

const createEmptyBoard = () => Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0))

// Fisher-Yates shuffle algorithm
const shuffleArray = (array) => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

// Create a new bag with all 7 tetrominos
const createNewBag = () => {
  return shuffleArray(Object.keys(TETROMINOS))
}

export default function TetrisGame() {
  const [board, setBoard] = useState(createEmptyBoard())
  const [currentPiece, setCurrentPiece] = useState(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [dropTime, setDropTime] = useState(INITIAL_DROP_TIME)
  const [level, setLevel] = useState(1)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [completedRows, setCompletedRows] = useState([])
  const [showVictoryModal, setShowVictoryModal] = useState(false)
  // 7-Bag Randomizer state
  const [tetrominoBag, setTetrominoBag] = useState(createNewBag())
  // Soft drop state
  const [isSoftDropping, setIsSoftDropping] = useState(false)
  const audioRef = useRef(null)
  const dropInterval = useRef(null)
  const lastDropTime = useRef(Date.now())

  // Add custom CSS for tetris blocks
  useEffect(() => {
    // Add custom CSS for tetris blocks
    const style = document.createElement("style")
    style.textContent = `
      .tetris-block-cyan {
        background-color: #00FFFF !important;
        box-shadow: 0 0 8px #00FFFF !important;
      }
      .tetris-block-blue {
        background-color: #0066FF !important;
        box-shadow: 0 0 8px #0066FF !important;
      }
      .tetris-block-orange {
        background-color: #FF9900 !important;
        box-shadow: 0 0 8px #FF9900 !important;
      }
      .tetris-block-yellow {
        background-color: #FFFF00 !important;
        box-shadow: 0 0 8px #FFFF00 !important;
      }
      .tetris-block-green {
        background-color: #00FF00 !important;
        box-shadow: 0 0 8px #00FF00 !important;
      }
      .tetris-block-red {
        background-color: #FF0000 !important;
        box-shadow: 0 0 8px #FF0000 !important;
      }
      .tetris-block-magenta {
        background-color: #FF00FF !important;
        box-shadow: 0 0 8px #FF00FF !important;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Get next tetromino from the bag using 7-Bag Randomizer system
  const getNextTetromino = useCallback(() => {
    // If the bag is empty, create a new one
    if (tetrominoBag.length === 0) {
      const newBag = createNewBag()
      setTetrominoBag(newBag.slice(1))
      return TETROMINOS[newBag[0]]
    }

    // Take the first piece from the bag
    const nextPiece = tetrominoBag[0]
    setTetrominoBag(tetrominoBag.slice(1))
    return TETROMINOS[nextPiece]
  }, [tetrominoBag])

  const checkCollision = (x, y, shape) => {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] !== 0) {
          const newX = x + col
          const newY = y + row
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT || (newY >= 0 && board[newY][newX] !== 0)) {
            return true
          }
        }
      }
    }
    return false
  }

  const isValidMove = (x, y, shape) => !checkCollision(x, y, shape)

  const moveLeft = useCallback(() => {
    if (currentPiece && isValidMove(currentPiece.x - 1, currentPiece.y, currentPiece.tetromino.shape)) {
      setCurrentPiece((prev) => ({ ...prev, x: prev.x - 1 }))
    }
  }, [currentPiece, board])

  const moveRight = useCallback(() => {
    if (currentPiece && isValidMove(currentPiece.x + 1, currentPiece.y, currentPiece.tetromino.shape)) {
      setCurrentPiece((prev) => ({ ...prev, x: prev.x + 1 }))
    }
  }, [currentPiece, board])

  const moveDown = useCallback(() => {
    if (!currentPiece) return
    if (isValidMove(currentPiece.x, currentPiece.y + 1, currentPiece.tetromino.shape)) {
      setCurrentPiece((prev) => ({ ...prev, y: prev.y + 1 }))
    } else {
      placePiece()
    }
  }, [currentPiece, board])

  const rotate = useCallback(() => {
    if (!currentPiece) return
    const rotated = currentPiece.tetromino.shape[0].map((_, i) =>
      currentPiece.tetromino.shape.map((row) => row[i]).reverse(),
    )
    let newX = currentPiece.x
    let newY = currentPiece.y

    // Try to rotate, if not possible, try to adjust position
    if (!isValidMove(newX, newY, rotated)) {
      // Try to move left
      if (isValidMove(newX - 1, newY, rotated)) {
        newX -= 1
      }
      // Try to move right
      else if (isValidMove(newX + 1, newY, rotated)) {
        newX += 1
      }
      // Try to move up
      else if (isValidMove(newX, newY - 1, rotated)) {
        newY -= 1
      }
      // If still not possible, don't rotate
      else {
        return
      }
    }

    setCurrentPiece((prev) => ({
      ...prev,
      x: newX,
      y: newY,
      tetromino: { ...prev.tetromino, shape: rotated },
    }))
  }, [currentPiece, board])

  const placePiece = useCallback(() => {
    if (!currentPiece) return
    const newBoard = board.map((row) => [...row])
    currentPiece.tetromino.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          const boardY = y + currentPiece.y
          const boardX = x + currentPiece.x
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            newBoard[boardY][boardX] = currentPiece.tetromino.color
          }
        }
      })
    })
    setBoard(newBoard)
    clearLines(newBoard)
    spawnNewPiece()
  }, [currentPiece, board])

  const clearLines = useCallback(
    (newBoard) => {
      const linesCleared = []
      const updatedBoard = newBoard.filter((row, index) => {
        if (row.every((cell) => cell !== 0)) {
          linesCleared.push(index)
          return false
        }
        return true
      })

      if (linesCleared.length > 0) {
        setCompletedRows(linesCleared)
        setTimeout(() => {
          while (updatedBoard.length < BOARD_HEIGHT) {
            updatedBoard.unshift(Array(BOARD_WIDTH).fill(0))
          }
          setBoard(updatedBoard)
          setCompletedRows([])

          const newScore = score + linesCleared.length * 100
          setScore(newScore)

          if (Math.floor(newScore / 500) > level - 1) {
            setLevel((prev) => prev + 1)
            setDropTime((prev) => prev * SPEED_INCREASE_FACTOR)
          }

          // Check if player reached high score
          if (score < HIGH_SCORE_THRESHOLD && newScore >= HIGH_SCORE_THRESHOLD) {
            setShowVictoryModal(true)
          }
        }, 500)
      }
    },
    [score, level],
  )

  const spawnNewPiece = useCallback(() => {
    const newPiece = {
      x: Math.floor(BOARD_WIDTH / 2) - 1,
      y: 0,
      tetromino: getNextTetromino(),
    }
    if (checkCollision(newPiece.x, newPiece.y, newPiece.tetromino.shape)) {
      setGameOver(true)
    } else {
      setCurrentPiece(newPiece)
    }
  }, [getNextTetromino])

  // Game loop using requestAnimationFrame instead of setInterval
  useEffect(() => {
    if (gameOver) return

    let animationId: number
    let lastTime = 0

    const gameLoop = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp
      const deltaTime = timestamp - lastTime

      // Calculate current drop interval based on level and soft drop state
      const currentDropTime = isSoftDropping ? dropTime * SOFT_DROP_FACTOR : dropTime

      // Only move down if enough time has passed
      if (deltaTime > currentDropTime) {
        moveDown()
        lastTime = timestamp
      }

      animationId = requestAnimationFrame(gameLoop)
    }

    animationId = requestAnimationFrame(gameLoop)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [moveDown, gameOver, dropTime, isSoftDropping])

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return

      switch (e.key) {
        case "ArrowLeft":
          moveLeft()
          break
        case "ArrowRight":
          moveRight()
          break
        case "ArrowDown":
          // Instead of calling moveDown directly, just set the soft drop flag
          if (!isSoftDropping) {
            setIsSoftDropping(true)
          }
          break
        case "ArrowUp":
          rotate()
          break
        default:
          break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        setIsSoftDropping(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [moveLeft, moveRight, rotate, gameOver, isSoftDropping])

  useEffect(() => {
    if (!currentPiece && !gameOver) {
      spawnNewPiece()
    }
  }, [currentPiece, gameOver, spawnNewPiece])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5
      audioRef.current.loop = true
      if (!gameOver && isMusicPlaying) {
        audioRef.current.play().catch((error) => console.error("Audio playback failed:", error))
      } else {
        audioRef.current.pause()
      }
    }
  }, [gameOver, isMusicPlaying])

  const resetGame = () => {
    setBoard(createEmptyBoard())
    setCurrentPiece(null)
    setScore(0)
    setGameOver(false)
    setDropTime(INITIAL_DROP_TIME)
    setLevel(1)
    setCompletedRows([])
    setShowVictoryModal(false)
    setTetrominoBag(createNewBag()) // Reset the bag when starting a new game
    setIsSoftDropping(false)
  }

  // Modificar la función renderCell para asegurar que los bloques sean visibles
  const renderCell = (x, y) => {
    if (
      currentPiece &&
      currentPiece.tetromino.shape[y - currentPiece.y] &&
      currentPiece.tetromino.shape[y - currentPiece.y][x - currentPiece.x]
    ) {
      return currentPiece.tetromino.color
    }
    return board[y][x]
  }

  const toggleMusic = () => {
    setIsMusicPlaying(!isMusicPlaying)
  }

  // Handle touch controls for soft drop
  const handleTouchStartDown = () => {
    setIsSoftDropping(true)
  }

  const handleTouchEndDown = () => {
    setIsSoftDropping(false)
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.h1
        className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-purple-300 text-transparent bg-clip-text tracking-wider"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        TETRIS
      </motion.h1>

      <div className="flex flex-col md:flex-row gap-6 items-start mb-6">
        {/* Left side - Score and Level */}
        <motion.div
          className="flex flex-col gap-4 order-2 md:order-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="bg-purple-950/40 border border-purple-500/30 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-xl font-bold text-purple-200 tracking-wide">SCORE: {score}</div>
            <div className="text-lg text-purple-300/80 tracking-wide">LEVEL: {level}</div>
            <div className="text-sm text-purple-300/60 tracking-wide mt-1">NEXT PIECES: {tetrominoBag.length}</div>

            {gameOver && <div className="mt-4 text-2xl font-bold text-red-400 tracking-wider">GAME OVER</div>}

            <div className="flex flex-col gap-3 mt-4">
              <Button
                onClick={resetGame}
                className="bg-purple-800/60 hover:bg-purple-700/80 text-purple-100 border-none tracking-wider"
              >
                {gameOver ? "PLAY AGAIN" : "RESET GAME"}
              </Button>
              <Button
                onClick={toggleMusic}
                variant="outline"
                className="border-purple-500/50 text-purple-200 tracking-wider"
              >
                <Music className="w-4 h-4 mr-2" />
                {isMusicPlaying ? "STOP MUSIC" : "PLAY MUSIC"}
              </Button>
            </div>
          </div>

          <div className="bg-purple-950/40 border border-purple-500/30 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="text-lg font-medium text-purple-200 mb-2 tracking-wider">GAME INFO</h3>
            <div className="text-sm text-purple-300/70">
              <p>• Using official 7-Bag Randomizer</p>
              <p>• Each set of 7 pieces contains all shapes</p>
              <p>• Soft drop: Hold down to speed up</p>
              <p>• Hard drop: Press space to instantly place</p>
              <p>• Clear lines to score points</p>
            </div>
          </div>
        </motion.div>

        {/* Center - Game Board */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="order-1 md:order-2"
        >
          <Card className="bg-purple-950/40 border-purple-500/30 p-4 rounded-lg shadow-lg backdrop-blur-sm">
            <CardContent className="p-0">
              <div
                className="grid bg-purple-900/50 rounded-md overflow-hidden"
                style={{
                  gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
                  width: `${BOARD_WIDTH * 24}px`,
                  height: `${BOARD_HEIGHT * 24}px`,
                  border: "1px solid rgba(168, 85, 247, 0.2)",
                }}
              >
                {board.map((row, y) =>
                  row.map((_, x) => (
                    <AnimatePresence key={`${y}-${x}`}>
                      <motion.div
                        initial={false}
                        animate={{
                          opacity: completedRows.includes(y) ? 0 : 1,
                          scale: completedRows.includes(y) ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                        className={`w-6 h-6 ${renderCell(x, y) || "bg-purple-950/80"}`}
                        style={{ border: "1px solid rgba(168, 85, 247, 0.1)" }}
                      />
                    </AnimatePresence>
                  )),
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right side - Controls */}
        <motion.div
          className="flex flex-col gap-4 order-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="bg-purple-950/40 border border-purple-500/30 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="text-lg font-medium text-purple-200 mb-3 tracking-wider">CONTROLS</h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div></div>
              <Button
                variant="ghost"
                size="icon"
                className="bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                onClick={rotate}
              >
                <ArrowUp className="h-5 w-5" />
              </Button>
              <div></div>
              <Button
                variant="ghost"
                size="icon"
                className="bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                onClick={moveLeft}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                onTouchStart={handleTouchStartDown}
                onTouchEnd={handleTouchEndDown}
                onMouseDown={handleTouchStartDown}
                onMouseUp={handleTouchEndDown}
                onMouseLeave={handleTouchEndDown}
              >
                <ArrowDown className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                onClick={moveRight}
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
            <div className="mt-3 text-sm text-purple-300/70">
              <p>ROTATE: UP ARROW</p>
              <p>MOVE: LEFT/RIGHT ARROWS</p>
              <p>SOFT DROP: HOLD DOWN ARROW</p>
              <p>HARD DROP: SPACE BAR</p>
            </div>
          </div>
        </motion.div>
      </div>

      <audio
        ref={audioRef}
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tetris-kxnh5j7hpNEcFspAndlU2huV5n6dvk.mp3"
      />

      <VictoryModal
        isOpen={showVictoryModal}
        onClose={() => setShowVictoryModal(false)}
        onPlayAgain={resetGame}
        title="HIGH SCORE!"
        message="Congratulations! You've reached 1000 points. You're a Tetris master!"
        icon={<Gamepad2 className="h-24 w-24 text-purple-400 drop-shadow-glow-purple" />}
      />
    </div>
  )
}

