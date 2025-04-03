"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Anchor, Rocket, Zap, Diamond, Crown, Trophy, Plane, Ship, type LucideIcon } from "lucide-react"
import { toast } from "sonner"

type MemoryCard = {
  id: number
  icon: LucideIcon
  isMatched: boolean
  color: string
}

const createCards = () => {
  const iconConfigs = [
    { icon: Rocket, color: "text-sky-400" },
    { icon: Diamond, color: "text-cyan-400" },
    { icon: Crown, color: "text-blue-400" },
    { icon: Trophy, color: "text-teal-400" },
    { icon: Zap, color: "text-yellow-400" },
    { icon: Anchor, color: "text-blue-300" },
    { icon: Plane, color: "text-sky-300" },
    { icon: Ship, color: "text-cyan-300" },
  ]

  const cards: MemoryCard[] = []

  iconConfigs.forEach(({ icon, color }, index) => {
    cards.push({ id: index * 2, icon, color, isMatched: false }, { id: index * 2 + 1, icon, color, isMatched: false })
  })

  return cards.sort(() => Math.random() - 0.5)
}

export default function MemoryGame() {
  const [cards, setCards] = useState<MemoryCard[]>(createCards())
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([])
  const [matches, setMatches] = useState(0)
  const [isChecking, setIsChecking] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  useEffect(() => {
    if (!gameStarted) {
      setGameStarted(true)
    }
  }, [gameStarted])

  const handleCardClick = (clickedIndex: number) => {
    // Prevent clicking if already checking or card is already matched
    if (isChecking || cards[clickedIndex].isMatched) return
    // Prevent clicking if card is already flipped
    if (flippedIndexes.includes(clickedIndex)) return
    // Prevent clicking if two cards are already flipped
    if (flippedIndexes.length === 2) return

    // Add clicked card to flipped cards
    const newFlipped = [...flippedIndexes, clickedIndex]
    setFlippedIndexes(newFlipped)

    // If we now have two cards flipped, check for a match
    if (newFlipped.length === 2) {
      setIsChecking(true)
      const [firstIndex, secondIndex] = newFlipped
      const firstCard = cards[firstIndex]
      const secondCard = cards[secondIndex]

      if (firstCard.icon === secondCard.icon) {
        // Match found
        setTimeout(() => {
          setCards(
            cards.map((card, index) =>
              index === firstIndex || index === secondIndex ? { ...card, isMatched: true } : card,
            ),
          )
          setFlippedIndexes([])
          setMatches((m) => m + 1)
          setIsChecking(false)

          // Check for game completion
          if (matches === cards.length / 2 - 1) {
            toast("🎮 CONGRATULATIONS! YOU'VE FOUND ALL MATCHES! 🏆", {
              className: "bg-blue-900 text-blue-100 border-blue-700 font-bold",
            })
          }
        }, 500)
      } else {
        // No match - reset after delay
        setTimeout(() => {
          setFlippedIndexes([])
          setIsChecking(false)
        }, 1000)
      }
    }
  }

  const resetGame = () => {
    setCards(createCards())
    setFlippedIndexes([])
    setMatches(0)
    setIsChecking(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-300 via-cyan-300 to-sky-300 text-transparent bg-clip-text tracking-wider">
          MEMORY MATCH
        </h1>
        <p className="text-blue-200 tracking-wide">
          MATCHES FOUND: {matches} OF {cards.length / 2}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 md:gap-6 p-6 rounded-xl bg-blue-950/30 backdrop-blur-sm shadow-xl border border-blue-500/30">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ rotateY: 0, opacity: 0, scale: 0.8 }}
            animate={{
              rotateY: card.isMatched || flippedIndexes.includes(index) ? 180 : 0,
              opacity: 1,
              scale: 1,
              transition: {
                delay: index * 0.05,
                duration: 0.3,
              },
            }}
            whileHover={{ scale: 1.05 }}
            className="perspective-1000"
          >
            <Card
              className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 cursor-pointer transform-style-3d transition-all duration-300 ${
                card.isMatched
                  ? "bg-blue-900/30 border-blue-400/50"
                  : flippedIndexes.includes(index)
                    ? "bg-blue-800/40 border-blue-500/50"
                    : "bg-blue-950/60 border-blue-600/30 hover:border-blue-500/60 hover:bg-blue-900/40"
              }`}
              onClick={() => handleCardClick(index)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-white/5" />
              <div className="absolute inset-0 flex items-center justify-center">
                {(card.isMatched || flippedIndexes.includes(index)) && (
                  <card.icon
                    className={`w-8 h-8 md:w-10 md:h-10 ${card.isMatched ? `${card.color} matched` : card.color}`}
                  />
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Button
        onClick={resetGame}
        variant="outline"
        size="lg"
        className="bg-blue-950/60 border-blue-500/50 hover:bg-blue-900/60 hover:border-blue-400/70 text-blue-200 hover:text-blue-100 tracking-wider"
      >
        RESET GAME
      </Button>
    </div>
  )
}

