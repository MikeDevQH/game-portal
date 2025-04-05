"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Anchor, Rocket, Zap, Diamond, Crown, Trophy, Plane, Ship, Brain, type LucideIcon } from "lucide-react"
import VictoryModal from "@/components/victory-modal"

type MemoryCard = {
  id: number
  icon: LucideIcon
  isMatched: boolean
  color: string
}

const createCards = () => {
  const iconConfigs = [
    { icon: Rocket, color: "text-blue-400" },
    { icon: Diamond, color: "text-blue-300" },
    { icon: Crown, color: "text-blue-400" },
    { icon: Trophy, color: "text-blue-300" },
    { icon: Zap, color: "text-blue-400" },
    { icon: Anchor, color: "text-blue-300" },
    { icon: Plane, color: "text-blue-400" },
    { icon: Ship, color: "text-blue-300" },
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
  const [showVictoryModal, setShowVictoryModal] = useState(false)

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
            setTimeout(() => {
              setShowVictoryModal(true)
            }, 500)
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
    setShowVictoryModal(false)
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 text-transparent bg-clip-text tracking-wider">
          MEMORY MATCH
        </h1>
        <p className="text-blue-200/80 tracking-wide mt-2 font-light">
          MATCHES FOUND: {matches} OF {cards.length / 2}
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-4 gap-3 md:gap-4 p-4 md:p-6 rounded-xl bg-blue-950/30 backdrop-blur-sm shadow-xl border-2 border-blue-500/20 mb-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
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
              className={`relative w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 cursor-pointer transform-style-3d transition-all duration-300 ${
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <Button
          onClick={resetGame}
          variant="outline"
          size="lg"
          className="bg-blue-800/60 border-blue-500/30 hover:bg-blue-700/80 text-blue-100 hover:text-blue-50 tracking-wider font-medium"
        >
          RESET GAME
        </Button>
      </motion.div>

      <VictoryModal
        isOpen={showVictoryModal}
        onClose={() => setShowVictoryModal(false)}
        onPlayAgain={resetGame}
        title="MEMORY MASTER!"
        message="Congratulations! You've found all the matching pairs."
        icon={<Brain className="h-24 w-24 text-blue-400 drop-shadow-glow-blue" />}
      />
    </div>
  )
}

