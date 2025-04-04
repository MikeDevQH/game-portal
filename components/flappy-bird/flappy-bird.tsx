"use client"

import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RotateCcw, Play } from "lucide-react"

const GRAVITY = 0.5
const JUMP_STRENGTH = 10
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

export default function FlappyBird() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [bird, setBird] = useState<BirdType>({ y: 200, velocity: 0, frame: 0 })
  const [pipes, setPipes] = useState<Pipe[]>([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [highScore, setHighScore] = useState(0)

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
        const audio = new Audio(url)
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
        ctx.drawImage(backgroundImage.current, 0, 0, canvas.width, canvas.height)
      }

      if (!gameStarted) {
        // Dibujamos nuestra propia pantalla de inicio personalizada
        // Fondo con gradiente
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, "#0f172a")
        gradient.addColorStop(1, "#1e3a8a")
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Dibujamos estrellas
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
        for (let i = 0; i < 50; i++) {
          const x = Math.random() * canvas.width
          const y = Math.random() * canvas.height
          const radius = Math.random() * 1.5
          ctx.beginPath()
          ctx.arc(x, y, radius, 0, Math.PI * 2)
          ctx.fill()
        }

        // Dibujamos una cuadrícula de fondo
        ctx.strokeStyle = "rgba(59, 130, 246, 0.2)"
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

        // Dibujamos el pájaro en el centro
        if (birdSprites.current.length > 0) {
          const birdX = canvas.width / 2 - BIRD_WIDTH / 2
          const birdY = canvas.height / 2 - 50
          const birdFrame = Math.floor(Date.now() / 200) % 3
          ctx.drawImage(birdSprites.current[birdFrame], birdX, birdY, BIRD_WIDTH, BIRD_HEIGHT)

          // Animación de flotación
          const floatOffset = Math.sin(Date.now() / 500) * 10
          ctx.drawImage(birdSprites.current[birdFrame], birdX, birdY + floatOffset, BIRD_WIDTH, BIRD_HEIGHT)
        }

        // Texto "PRESS SPACE TO START"
        ctx.font = "bold 16px Arial"
        ctx.fillStyle = "#60a5fa"
        ctx.textAlign = "center"
        ctx.fillText("PRESS SPACE TO START", canvas.width / 2, canvas.height / 2 + 50)

        // Círculo pulsante alrededor del pájaro
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
      const birdRect = { x: 50, y: bird.y, width: BIRD_WIDTH, height: BIRD_HEIGHT }
      for (const pipe of pipes) {
        const topPipeRect = { x: pipe.x, y: 0, width: PIPE_WIDTH, height: pipe.topHeight }
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
        if (pipeImage.current) {
          // Draw top pipe (flipped vertically)
          ctx.save()
          ctx.scale(1, -1)
          ctx.drawImage(pipeImage.current, pipe.x, -pipe.topHeight, PIPE_WIDTH, 320)
          ctx.restore()

          // Draw bottom pipe
          ctx.drawImage(pipeImage.current, pipe.x, pipe.topHeight + PIPE_GAP, PIPE_WIDTH, 320)
        }
      })

      // Draw bird
      ctx.save()
      ctx.translate(50 + BIRD_WIDTH / 2, bird.y + BIRD_HEIGHT / 2)
      ctx.rotate(Math.min(Math.PI / 4, Math.max(-Math.PI / 4, bird.velocity * 0.1)))
      ctx.drawImage(birdSprites.current[bird.frame], -BIRD_WIDTH / 2, -BIRD_HEIGHT / 2, BIRD_WIDTH, BIRD_HEIGHT)
      ctx.restore()

      if (bird.y > canvas.height || bird.y < 0) {
        setGameOver(true)
        playSound(hitSound.current)
      }

      if (gameOver) {
        clearInterval(gameLoop)
      }
    }, 1000 / 60) // 60 FPS

    return () => clearInterval(gameLoop)
  }, [bird, pipes, gameOver, score, jump, gameStarted, assetsLoaded, restartGame, playSound])

  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
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
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 text-transparent bg-clip-text tracking-wider">
        FLAPPY BIRD
      </h1>

      <div className="flex flex-col md:flex-row gap-6 items-center mb-6">
        <Card className="bg-slate-900/40 border-blue-500/30 p-4 rounded-lg shadow-lg backdrop-blur-sm">
          <canvas
            ref={canvasRef}
            width={288}
            height={512}
            className="border border-blue-500/30 rounded-md cursor-pointer"
            onClick={handleCanvasClick}
          />
        </Card>

        <div className="flex flex-col gap-4">
          <div className="bg-slate-900/40 border border-blue-500/30 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-xl font-bold text-blue-200 tracking-wide">SCORE: {score}</div>
            <div className="text-lg text-blue-300 tracking-wide">HIGH SCORE: {highScore}</div>

            {gameOver && <div className="mt-4 text-2xl font-bold text-red-400 tracking-wider">GAME OVER</div>}

            {!gameStarted && !gameOver && (
              <div className="mt-4 text-xl font-medium text-blue-300 tracking-wider">PRESS START TO PLAY</div>
            )}

            <div className="flex flex-col gap-3 mt-4">
              <Button
                onClick={(e) => {
                  e.currentTarget.blur(); 
                  gameStarted ? restartGame() : setGameStarted(true);
                }}
                className="bg-blue-800/80 hover:bg-blue-700 text-blue-100 border-none tracking-wider"
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

          <div className="bg-slate-900/40 border border-blue-500/30 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="text-lg font-medium text-blue-200 mb-3 tracking-wider">HOW TO PLAY</h3>
            <div className="text-sm text-blue-300/70">
              <p>Click or press SPACE to make the bird flap</p>
              <p>Navigate through the pipes without hitting them</p>
              <p>Each pipe passed gives you 1 point</p>
              <p>Try to beat your high score!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

