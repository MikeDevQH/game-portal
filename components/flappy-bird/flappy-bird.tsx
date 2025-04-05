// Actualizar los colores y estilos para Flappy Bird (sky/celeste)
"use client"

import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RotateCcw, Play } from "lucide-react"
import { motion } from "framer-motion"

const GRAVITY = 0.5
const JUMP_STRENGTH = 8
const PIPE_WIDTH = 52
const PIPE_GAP = 150
const PIPE_SPEED = 2
const BIRD_WIDTH = 34
const BIRD_HEIGHT = 24

interface BirdType {
  y: number
  velocity: number
  frame: number
}

interface Pipe {
  x: number
  topHeight: number
}

interface Star {
  x: number
  y: number
  size: number
  speed: number
  opacity: number
}

export default function FlappyBird() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [bird, setBird] = useState<BirdType>({ y: 200, velocity: 0, frame: 0 })
  const [pipes, setPipes] = useState<Pipe[]>([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [highScore, setHighScore] = useState(0)
  const [stars, setStars] = useState<Star[]>([])

  const birdSprites = useRef<HTMLImageElement[]>([])
  const backgroundImage = useRef<HTMLImageElement | null>(null)
  const numberSprites = useRef<HTMLImageElement[]>([])
  const gameOverImage = useRef<HTMLImageElement | null>(null)
  const messageImage = useRef<HTMLImageElement | null>(null)
  const pipeImage = useRef<HTMLImageElement | null>(null)
  const [assetsLoaded, setAssetsLoaded] = useState(false)

  // Audio refs
  const pointSound = useRef<HTMLAudioElement | null>(null)
  const hitSound = useRef<HTMLAudioElement | null>(null)
  const wingSound = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const initialStars: Star[] = []
    for (let i = 0; i < 100; i++) {
      initialStars.push({
        x: Math.random() * 288,
        y: Math.random() * 512,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.8 + 0.2,
      })
    }
    setStars(initialStars)
  }, [])

  useEffect(() => {
    const birdUrls = [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/yellowbird-downflap-ZExrg9YxRxwFfLXDu6JijpJUQgByX6.png",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/yellowbird-midflap-8mBrx070GYsw2As4Ue9BfQJ5XNMUg3.png",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/yellowbird-upflap-hMo7jE66Ar0TzdbAMTzTMWaEGpTNx2.png",
    ]
    const numberUrls = [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0-n6uJmiEzXXFf0NDHejRxdna8JdqZ9P.png",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-2s71zdNWUSfnqIUbOABB2QJzzbG7fR.png",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-QNpaMYRZvP9MgObyqVbxo7wu0MyjYE.png",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-6yXb5a7IxZyl8kdXXBatpxq48enb2d.png",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-9beOrHBy4QSBLifUwqaLXqbNWfK4Hr.png",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5-pgAY4wiTYa2Ppho9w3YXtLx3UHryJI.png",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6-5v6snji9HWY7UpBuqDkKDtck2zED4B.png",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7-zTxqP8uIOG4OYFtl8x6Dby0mqKfNYo.png",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8-gkhiN6iBVr2DY7SqrTZIEP7Q3doyo9.png",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9-PxwOSLzHQAiMeneqctp2q5mzWAv0Kv.png",
    ]
    const backgroundUrl =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/background-day-rvpnF7CJRMdBNqqBc8Zfzz3QpIfkBG.png"
    const gameOverUrl =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gameover-NwA13AFRtIFat9QoA12T3lpjK76Qza.png"
    const messageUrl =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/message-g1ru4NKF3KrKoFmiVpzR8fwdeLhwNa.png"
    const pipeUrl =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pipe-green-zrz2zTtoVXaLn6xDqgrNVF9luzjW1B.png"

    const loadImage = (url: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = url
      })

    const loadAudio = (url: string) =>
      new Promise<HTMLAudioElement>((resolve, reject) => {
        const audio = new Audio()
        audio.oncanplaythrough = () => resolve(audio)
        audio.onerror = reject
        audio.src = url
      })

    Promise.all([
      ...birdUrls.map(loadImage),
      ...numberUrls.map(loadImage),
      loadImage(backgroundUrl),
      loadImage(gameOverUrl),
      loadImage(messageUrl),
      loadImage(pipeUrl),
      loadAudio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/point-SdTORahWMlxujnLCoDbujDLHI6KFeC.wav"),
      loadAudio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hit-YVMFYQJEgZASG6O3xPWiyiqPtOLygb.wav"),
      loadAudio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wing-oOSsspXpVMDc0enrWj4WWLaHVqs6Hk.wav"),
    ]).then((loadedAssets) => {
      birdSprites.current = loadedAssets.slice(0, 3) as HTMLImageElement[]
      numberSprites.current = loadedAssets.slice(3, 13) as HTMLImageElement[]
      backgroundImage.current = loadedAssets[13] as HTMLImageElement
      gameOverImage.current = loadedAssets[14] as HTMLImageElement
      messageImage.current = loadedAssets[15] as HTMLImageElement
      pipeImage.current = loadedAssets[16] as HTMLImageElement
      pointSound.current = loadedAssets[17] as HTMLAudioElement
      hitSound.current = loadedAssets[18] as HTMLAudioElement
      wingSound.current = loadedAssets[19] as HTMLAudioElement
      setAssetsLoaded(true)
    })

    // Load high score from localStorage
    const storedHighScore = localStorage.getItem("flappyBirdHighScore")
    if (storedHighScore) setHighScore(Number.parseInt(storedHighScore))
  }, [])

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem("flappyBirdHighScore", score.toString())
    }
  }, [score, highScore])

  const playSound = useCallback(
    (sound: HTMLAudioElement | null) => {
      if (sound && !gameOver) {
        sound.currentTime = 0
        sound.play().catch((error) => console.error("Error playing sound:", error))
      }
    },
    [gameOver],
  )

  const jump = useCallback(() => {
    if (!gameOver && gameStarted) {
      setBird((prevBird) => ({ ...prevBird, velocity: -JUMP_STRENGTH }))
      playSound(wingSound.current)
    } else if (!gameStarted) {
      setGameStarted(true)
    }
  }, [gameOver, gameStarted, playSound])

  const restartGame = useCallback(() => {
    setBird({ y: 200, velocity: 0, frame: 0 })
    setPipes([])
    setScore(0)
    setGameOver(false)
    setGameStarted(true)
  }, [])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        if (gameOver) {
          restartGame()
        } else if (!gameStarted) {
          setGameStarted(true)
        } else {
          jump()
        }
      }
    }
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [jump, gameStarted, gameOver, restartGame])

  // Update star position
  useEffect(() => {
    if (!gameStarted || gameOver) return

    const interval = setInterval(() => {
      setStars((prevStars) =>
        prevStars
          .map((star) => ({
            ...star,
            y: star.y + star.speed,
            opacity: star.y > 512 ? Math.random() * 0.8 + 0.2 : star.opacity,
          }))
          .map((star) => (star.y > 512 ? { ...star, y: 0, x: Math.random() * 288 } : star)),
      )
    }, 16)

    return () => clearInterval(interval)
  }, [gameStarted, gameOver])

  useEffect(() => {
    if (!assetsLoaded) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const gameLoop = setInterval(() => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background
      if (backgroundImage.current) {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, "#0c4a6e") // Sky blue dark arriba
        gradient.addColorStop(1, "#0ea5e9") // Sky blue light abajo
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        stars.forEach((star) => {
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
          ctx.fill()
        })
        // Draw background grid
        ctx.strokeStyle = "rgba(56, 189, 248, 0.1)"
        ctx.lineWidth = 1
        const gridSize = 30
        for (let x = 0; x < canvas.width; x += gridSize) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, canvas.height)
          ctx.stroke()
        }
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(canvas.width, y)
          ctx.stroke()
        }
      }

      if (!gameStarted) {
        // Draw home screen
        // Gradient Background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, "#0c4a6e")
        gradient.addColorStop(1, "#0ea5e9")
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw star
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
        for (let i = 0; i < 50; i++) {
          const x = Math.random() * canvas.width
          const y = Math.random() * canvas.height
          const radius = Math.random() * 1.5
          ctx.beginPath()
          ctx.arc(x, y, radius, 0, Math.PI * 2)
          ctx.fill()
        }

        // Draw background grid
        ctx.strokeStyle = "rgba(56, 189, 248, 0.2)"
        ctx.lineWidth = 1
        const gridSize = 30
        for (let x = 0; x < canvas.width; x += gridSize) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, canvas.height)
          ctx.stroke()
        }
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(canvas.width, y)
          ctx.stroke()
        }

        // Draw bird in the center
        if (birdSprites.current.length > 0) {
          const birdX = canvas.width / 2 - BIRD_WIDTH / 2
          const birdY = canvas.height / 2 - 50
          const birdFrame = Math.floor(Date.now() / 200) % 3
          ctx.drawImage(birdSprites.current[birdFrame], birdX, birdY, BIRD_WIDTH, BIRD_HEIGHT)

          // Floating animation
          const floatOffset = Math.sin(Date.now() / 500) * 10
          ctx.drawImage(birdSprites.current[birdFrame], birdX, birdY + floatOffset, BIRD_WIDTH, BIRD_HEIGHT)
        }

        // Text "PRESS SPACE TO START"
        ctx.font = "bold 16px Arial"
        ctx.fillStyle = "#38bdf8"
        ctx.textAlign = "center"
        ctx.fillText("PRESS SPACE TO START", canvas.width / 2, canvas.height / 2 + 50)

        // Pulsating circle around the bird
        const pulseSize = 40 + Math.sin(Date.now() / 300) * 10
        ctx.beginPath()
        ctx.arc(canvas.width / 2, canvas.height / 2 - 40, pulseSize, 0, Math.PI * 2)
        ctx.strokeStyle = "rgba(56, 189, 248, 0.5)"
        ctx.lineWidth = 2
        ctx.stroke()

        return
      }

      // Update bird position and animation frame
      setBird((prevBird) => ({
        y: prevBird.y + prevBird.velocity,
        velocity: prevBird.velocity + GRAVITY,
        frame: (prevBird.frame + 1) % 3,
      }))

      // Move pipes
      setPipes((prevPipes) => prevPipes.map((pipe) => ({ ...pipe, x: pipe.x - PIPE_SPEED })))

      // Generate new pipes
      if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        const topHeight = Math.random() * (canvas.height - PIPE_GAP - 100) + 50
        setPipes((prevPipes) => [...prevPipes, { x: canvas.width, topHeight }])
      }

      // Remove off-screen pipes
      setPipes((prevPipes) => prevPipes.filter((pipe) => pipe.x + PIPE_WIDTH > 0))

      // Check collisions
      const birdRect = {
        x: 50,
        y: bird.y,
        width: BIRD_WIDTH,
        height: BIRD_HEIGHT,
      }
      for (const pipe of pipes) {
        const topPipeRect = {
          x: pipe.x,
          y: 0,
          width: PIPE_WIDTH,
          height: pipe.topHeight,
        }
        const bottomPipeRect = {
          x: pipe.x,
          y: pipe.topHeight + PIPE_GAP,
          width: PIPE_WIDTH,
          height: canvas.height - pipe.topHeight - PIPE_GAP,
        }

        if (
          birdRect.x < topPipeRect.x + topPipeRect.width &&
          birdRect.x + birdRect.width > topPipeRect.x &&
          birdRect.y < topPipeRect.y + topPipeRect.height &&
          birdRect.y + birdRect.height > topPipeRect.y
        ) {
          setGameOver(true)
          playSound(hitSound.current)
        }

        if (
          birdRect.x < bottomPipeRect.x + bottomPipeRect.width &&
          birdRect.x + birdRect.width > bottomPipeRect.x &&
          birdRect.y < bottomPipeRect.y + bottomPipeRect.height &&
          birdRect.y + birdRect.height > bottomPipeRect.y
        ) {
          setGameOver(true)
          playSound(hitSound.current)
        }
      }

      // Update score
      if (!gameOver && pipes.some((pipe) => pipe.x + PIPE_WIDTH < 50 && pipe.x + PIPE_WIDTH >= 48)) {
        setScore((prevScore) => prevScore + 1)
        playSound(pointSound.current)
      }

      // Draw pipes
      pipes.forEach((pipe) => {
        // Pipe top
        ctx.fillStyle = "rgba(14, 165, 233, 0.7)" // Color sky blue semitransparente
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight)

        // Shiny border
        ctx.strokeStyle = "#38bdf8"
        ctx.lineWidth = 2
        ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight)

        // Power lines
        ctx.strokeStyle = "rgba(56, 189, 248, 0.8)"
        ctx.lineWidth = 1
        for (let i = 5; i < pipe.topHeight; i += 10) {
          ctx.beginPath()
          ctx.moveTo(pipe.x, i)
          ctx.lineTo(pipe.x + PIPE_WIDTH, i)
          ctx.stroke()
        }

        // Edge glitter effect
        ctx.shadowColor = "#38bdf8"
        ctx.shadowBlur = 10
        ctx.strokeStyle = "#38bdf8"
        ctx.lineWidth = 2
        ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight)
        ctx.shadowBlur = 0

        // Pipe lower
        ctx.fillStyle = "rgba(14, 165, 233, 0.7)"
        ctx.fillRect(pipe.x, pipe.topHeight + PIPE_GAP, PIPE_WIDTH, canvas.height - pipe.topHeight - PIPE_GAP)

        // Shiny border
        ctx.strokeStyle = "#38bdf8"
        ctx.lineWidth = 2
        ctx.strokeRect(pipe.x, pipe.topHeight + PIPE_GAP, PIPE_WIDTH, canvas.height - pipe.topHeight - PIPE_GAP)

        // Power lines
        ctx.strokeStyle = "rgba(56, 189, 248, 0.8)"
        ctx.lineWidth = 1
        for (let i = pipe.topHeight + PIPE_GAP + 5; i < canvas.height; i += 10) {
          ctx.beginPath()
          ctx.moveTo(pipe.x, i)
          ctx.lineTo(pipe.x + PIPE_WIDTH, i)
          ctx.stroke()
        }

        // Edge glitter effect
        ctx.shadowColor = "#38bdf8"
        ctx.shadowBlur = 10
        ctx.strokeStyle = "#38bdf8"
        ctx.lineWidth = 2
        ctx.strokeRect(pipe.x, pipe.topHeight + PIPE_GAP, PIPE_WIDTH, canvas.height - pipe.topHeight - PIPE_GAP)
        ctx.shadowBlur = 0
      })

      // Draw bird
      ctx.save()
      ctx.translate(50 + BIRD_WIDTH / 2, bird.y + BIRD_HEIGHT / 2)
      ctx.rotate(Math.min(Math.PI / 4, Math.max(-Math.PI / 4, bird.velocity * 0.1)))

      // Add glow to the bird
      ctx.shadowColor = "#38bdf8"
      ctx.shadowBlur = 15
      ctx.drawImage(birdSprites.current[bird.frame], -BIRD_WIDTH / 2, -BIRD_HEIGHT / 2, BIRD_WIDTH, BIRD_HEIGHT)
      ctx.restore()

      if (bird.y > canvas.height || bird.y < 0) {
        setGameOver(true)
        playSound(hitSound.current)
      }

      if (gameOver) {
        clearInterval(gameLoop)

        // Fading effect
        ctx.fillStyle = "rgba(15, 23, 42, 0.7)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Text "GAME OVER" con futuristic styles
        ctx.font = "bold 28px Arial"
        ctx.textAlign = "center"
        ctx.fillStyle = "#ef4444"
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20)

        // Final score
        ctx.font = "bold 20px Arial"
        ctx.fillStyle = "#38bdf8"
        ctx.fillText(`SCORE: ${score}`, canvas.width / 2, canvas.height / 2 + 20)

        // Restart instruction
        ctx.font = "16px Arial"
        ctx.fillStyle = "#60a5fa"
        ctx.fillText("PRESS SPACE TO RESTART", canvas.width / 2, canvas.height / 2 + 60)
      }
    }, 1000 / 60) // 60 FPS

    return () => clearInterval(gameLoop)
  }, [bird, pipes, gameOver, score, jump, gameStarted, assetsLoaded, restartGame, playSound])

  const handleCanvasClick = useCallback(
    (_event: React.MouseEvent<HTMLCanvasElement>) => {
      if (gameOver) {
        restartGame()
      } else {
        jump()
      }
    },
    [gameOver, jump, restartGame],
  )

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.h1
        className="text-4xl font-bold mb-6 mt-10 bg-gradient-to-r from-sky-400 to-sky-300 text-transparent bg-clip-text tracking-wider"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        FLAPPY BIRD
      </motion.h1>

      <div className="flex flex-col md:flex-row gap-8 items-center mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card className="bg-sky-950/40 border-2 border-sky-500/30 p-4 rounded-lg shadow-lg backdrop-blur-sm">
            <canvas
              ref={canvasRef}
              width={600}
              height={512}
              className="border border-sky-500/30 rounded-md cursor-pointer"
              onClick={handleCanvasClick}
            />
          </Card>
        </motion.div>

        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="bg-sky-950/40 border-2 border-sky-500/30 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-xl font-bold text-sky-200 tracking-wide">SCORE: {score}</div>
            <div className="text-lg text-sky-300/80 tracking-wide">HIGH SCORE: {highScore}</div>

            {!gameStarted && !gameOver && (
              <div className="mt-4 text-xl font-medium text-sky-300 tracking-wider">PRESS START TO PLAY</div>
            )}

            <div className="flex flex-col gap-3 mt-4">
              <Button
                onClick={(e) => {
                  e.currentTarget.blur()
                  gameStarted ? restartGame() : setGameStarted(true)
                }}
                className="bg-sky-800/60 hover:bg-sky-700/80 text-sky-100 border-none tracking-wider"
              >
                {gameOver ? (
                  <>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    PLAY AGAIN
                  </>
                ) : gameStarted ? (
                  <>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    RESTART
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    START GAME
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="bg-sky-950/40 border-2 border-sky-500/30 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="text-lg font-medium text-sky-200 mb-3 tracking-wider">HOW TO PLAY</h3>
            <div className="text-sm text-sky-300/70">
              <p>Click or press SPACE to make the bird flap</p>
              <p>Navigate through the pipes without hitting them</p>
              <p>Each pipe passed gives you 1 point</p>
              <p>Try to beat your high score!</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

