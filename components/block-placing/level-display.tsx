"use client"

import { motion } from "framer-motion"

interface LevelDisplayProps {
  level: number
}

export default function LevelDisplay({ level }: LevelDisplayProps) {
  return (
    <div className="bg-pink-900/80 p-3 rounded-lg shadow-md border-2 border-pink-500/30">
      <h2 className="text-sm font-semibold text-pink-300 mb-1">LEVEL</h2>
      <motion.div
        key={level}
        initial={{ scale: 1.5, color: "#ffffff" }}
        animate={{ scale: 1, color: "#ffffff" }}
        className="text-xl font-bold text-pink-100"
      >
        {level}
      </motion.div>
    </div>
  )
}

