"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Music, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Gamepad2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import VictoryModal from "@/components/victory-modal"

const TETROMINOS = {
  I: { shape: [[1, 1, 1, 1]], color: "cyan-500" },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: "blue-500",
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    color: "sky-500",
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "teal-500",
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: "blue-400",
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: "cyan-400",
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: "sky-400",
  },
}

const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const INITIAL_DROP_TIME = 800
const SPEED_INCREASE_FACTOR = 0.95
const HIGH_SCORE_THRESHOLD = 1000

const createEmptyBoard = () => Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0))

const randomTetromino = () => {
  const keys = Object.keys(TETROMINOS)
  const randKey = keys[Math.floor(Math.random() * keys.length)]
  return TETROMINOS[randKey]
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
  const audioRef = useRef(null)
  const dropInterval = useRef(null)

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

    // Continue falling after rotation
    if (isValidMove(newX, newY + 1, rotated) && newY + 1 < BOARD_HEIGHT) {
      setCurrentPiece((prev) => ({ ...prev, y: prev.y + 1 }))
    }
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
      tetromino: randomTetromino(),
    }
    if (checkCollision(newPiece.x, newPiece.y, newPiece.tetromino.shape)) {
      setGameOver(true)
    } else {
      setCurrentPiece(newPiece)
    }
  }, [board])

  useEffect(() => {
    if (!currentPiece && !gameOver) {
      spawnNewPiece()
    }
  }, [currentPiece, gameOver, spawnNewPiece])

  useEffect(() => {
    if (!gameOver) {
      dropInterval.current = setInterval(moveDown, dropTime)
    }
    return () => clearInterval(dropInterval.current)
  }, [moveDown, gameOver, dropTime])

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return
      switch (e.key) {
        case "ArrowLeft":
          moveLeft()
          break
        case "ArrowRight":
          moveRight()
          break
        case "ArrowDown":
          moveDown()
          break
        case "ArrowUp":
          rotate()
          break
        default:
          break
      }
    }
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [moveLeft, moveRight, moveDown, rotate, gameOver])

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
    clearInterval(dropInterval.current)
  }

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

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-300 via-cyan-300 to-sky-300 text-transparent bg-clip-text tracking-wider">
        TETRIS
      </h1>

      <div className="flex flex-col md:flex-row gap-6 items-center mb-6">
        <Card className="bg-slate-900/40 border-blue-500/30 p-4 rounded-lg shadow-lg backdrop-blur-sm">
          <CardContent className="p-0">
            <div
              className="grid bg-slate-800/50 rounded-md overflow-hidden"
              style={{
                gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
                width: `${BOARD_WIDTH * 20}px`,
                height: `${BOARD_HEIGHT * 20}px`,
                border: "1px solid rgba(56, 189, 248, 0.2)",
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
                      className={`w-5 h-5 ${renderCell(x, y) ? `bg-${renderCell(x, y)}` : "bg-slate-900/80"}`}
                      style={{ border: "1px solid rgba(56, 189, 248, 0.1)" }}
                    />
                  </AnimatePresence>
                )),
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <div className="bg-slate-900/40 border border-blue-500/30 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-xl font-bold text-blue-200 tracking-wide">SCORE: {score}</div>
            <div className="text-lg text-blue-300 tracking-wide">LEVEL: {level}</div>

            {gameOver && <div className="mt-4 text-2xl font-bold text-red-400 tracking-wider">GAME OVER</div>}

            <div className="flex flex-col gap-3 mt-4">
              <Button
                onClick={resetGame}
                className="bg-blue-800/80 hover:bg-blue-700 text-blue-100 border-none tracking-wider"
              >
                {gameOver ? "PLAY AGAIN" : "RESET GAME"}
              </Button>
              <Button
                onClick={toggleMusic}
                variant="outline"
                className="border-blue-500/50 text-blue-200 tracking-wider"
              >
                <Music className="w-4 h-4 mr-2" />
                {isMusicPlaying ? "STOP MUSIC" : "PLAY MUSIC"}
              </Button>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-blue-500/30 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="text-lg font-medium text-blue-200 mb-3 tracking-wider">CONTROLS</h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div></div>
              <Button variant="ghost" size="icon" className="bg-slate-800/50 text-blue-300">
                <ArrowUp className="h-5 w-5" />
              </Button>
              <div></div>
              <Button variant="ghost" size="icon" className="bg-slate-800/50 text-blue-300">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="bg-slate-800/50 text-blue-300">
                <ArrowDown className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="bg-slate-800/50 text-blue-300">
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
            <div className="mt-3 text-sm text-blue-300/70">
              <p>ROTATE: UP ARROW</p>
              <p>MOVE: LEFT/RIGHT ARROWS</p>
              <p>SPEED UP: DOWN ARROW</p>
            </div>
          </div>
        </div>
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
        icon={<Gamepad2 className="h-24 w-24 text-sky-400 drop-shadow-glow-blue" />}
      />
    </div>
  )
}

