"use client"

import { motion } from "framer-motion"

interface SnakeSegmentProps {
  segment: { x: number; y: number }
  index: number
  isHead: boolean
  cellSize: number
  direction: string | null
}

export default function SnakeSegment({ segment, index, isHead, cellSize, direction }: SnakeSegmentProps) {
  // Calculate color based on position in snake
  const getSegmentColor = () => {
    if (isHead) return "bg-emerald-400"
    // Alternate colors for body segments
    return index % 2 === 0 ? "bg-emerald-500" : "bg-emerald-400"
  }

  // Get rotation angle based on direction
  const getRotation = () => {
    if (!direction) return 0
    switch (direction) {
      case "right":
        return 0
      case "down":
        return 90
      case "left":
        return 180
      case "up":
        return 270
      default:
        return 0
    }
  }

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.1 }}
      className={`absolute rounded-full ${getSegmentColor()} shadow-glow-green`}
      style={{
        width: `${cellSize - 2}px`,
        height: `${cellSize - 2}px`,
        left: `${segment.x * cellSize + 1}px`,
        top: `${segment.y * cellSize + 1}px`,
        zIndex: 1000 - index,
        boxShadow: "0 0 10px rgba(16, 185, 129, 0.6)",
      }}
    >
      {isHead && (
        <div className="relative w-full h-full">
          {/* Snake eyes */}
          <div
            className="absolute w-1.5 h-1.5 bg-emerald-950 rounded-full"
            style={{
              transform: `rotate(${getRotation()}deg)`,
              top: "25%",
              left: "25%",
            }}
          />
          <div
            className="absolute w-1.5 h-1.5 bg-emerald-950 rounded-full"
            style={{
              transform: `rotate(${getRotation()}deg)`,
              top: "25%",
              right: "25%",
            }}
          />
        </div>
      )}
    </motion.div>
  )
}

