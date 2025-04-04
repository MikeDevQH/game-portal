"use client"

import { motion } from "framer-motion"

interface LevelDisplayProps {
  level: number
}

export default function LevelDisplay({ level }: LevelDisplayProps) {
  return (
    <div className="bg-slate-800 p-3 rounded-lg shadow-md">
      <h2 className="text-sm font-semibold text-slate-400 mb-1">LEVEL</h2>
      <motion.div
        key={level}
        initial={{ scale: 1.5, color: "#ffffff" }}
        animate={{ scale: 1, color: "#ffffff" }}
        className="text-xl font-bold"
      >
        {level}
      </motion.div>
    </div>
  )
}

