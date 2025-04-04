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
    <div className="bg-slate-800 p-3 rounded-lg shadow-md">
      <h2 className="text-sm font-semibold text-slate-400 mb-1">SCORE</h2>
      <motion.div className="text-xl font-bold text-white">{displayScore.toLocaleString()}</motion.div>
    </div>
  )
}

