"use client"

import { motion } from "framer-motion"

interface BlockProps {
  type: string
  isDragged: boolean
  onDragStart: () => void
  level: number
  position: { row: number; col: number }
}

export default function Block({ type, isDragged, onDragStart, level, position }: BlockProps) {
  // Define colors for different block types
  const blockColors: Record<string, string> = {
    red: "bg-red-500 hover:bg-red-400",
    blue: "bg-blue-500 hover:bg-blue-400",
    green: "bg-green-500 hover:bg-green-400",
    yellow: "bg-yellow-500 hover:bg-yellow-400",
    purple: "bg-purple-500 hover:bg-purple-400",
    // Special blocks that appear at higher levels
    gold: "bg-amber-400 hover:bg-amber-300",
    bomb: "bg-gray-800 hover:bg-gray-700",
  }

  // Add special effects based on level
  const getSpecialEffects = () => {
    if (level >= 3) {
      return "after:content-[''] after:absolute after:inset-0 after:bg-white/20 after:rounded-md after:opacity-50 after:animate-pulse"
    }
    return ""
  }

  return (
    <motion.div
      className={`
        w-10 h-10 md:w-12 md:h-12 rounded-md cursor-move relative
        ${blockColors[type] || "bg-gray-500"}
        ${isDragged ? "ring-4 ring-white scale-110 z-10 opacity-50" : ""}
        ${getSpecialEffects()}
        transition-all duration-200 ease-in-out
      `}
      draggable={true}
      onDragStart={onDragStart}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      data-position={`${position.row}-${position.col}`}
    >
      {/* Block content - could be an icon, pattern, or just color */}
      <div className="absolute inset-0 flex items-center justify-center">
        {type === "bomb" && <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />}
        {type === "gold" && <div className="text-xs font-bold text-white">★</div>}
      </div>
    </motion.div>
  )
}

