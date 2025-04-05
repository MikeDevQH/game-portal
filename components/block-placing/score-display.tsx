"use client"

import { motion, useSpring } from "framer-motion"
import { useEffect, useState } from "react"

interface ScoreDisplayProps {
  score: number
}

export default function ScoreDisplay({ score }: ScoreDisplayProps) {
  const [displayScore, setDisplayScore] = useState(0)
  const springScore = useSpring(0, { stiffness: 100, damping: 30 })

  useEffect(() => {
    springScore.set(score)
    const unsubscribe = springScore.onChange((latest) => {
      setDisplayScore(Math.floor(latest))
    })
    return unsubscribe
  }, [score, springScore])

  return (
    <div className="bg-pink-900/80 p-3 rounded-lg shadow-md border-2 border-pink-500/30">
      <h2 className="text-sm font-semibold text-pink-300 mb-1">SCORE</h2>
      <motion.div className="text-xl font-bold text-pink-100">{displayScore.toLocaleString()}</motion.div>
    </div>
  )
}

