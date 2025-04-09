"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import confetti from "canvas-confetti"
import { useEffect } from "react"

interface VictoryModalProps {
  isOpen: boolean
  onNextLevel: () => void
  title?: string
  message?: string
  icon?: React.ReactNode
}

export default function VictoryModal({
  isOpen,
  onNextLevel,
  title = "VICTORY!",
  message = "Congratulations! You've won the game.",
  icon = null,
}: VictoryModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Trigger confetti
      const duration = 3 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min
      }

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)

        // since particles fall down, start a bit higher than random
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ["#818cf8", "#6366f1", "#4f46e5", "#4338ca", "#3730a3"],
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ["#818cf8", "#6366f1", "#4f46e5", "#4338ca", "#3730a3"],
        })
      }, 250)

      return () => clearInterval(interval)
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onNextLevel}
          />

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
            className="relative bg-gradient-to-br from-indigo-900/90 to-indigo-950/90 p-6 rounded-xl border border-indigo-500/50 shadow-2xl max-w-md w-full backdrop-blur-md z-50"
          >
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                {icon}
              </motion.div>
            </div>

            <button onClick={onNextLevel} className="absolute top-3 right-3 text-indigo-300 hover:text-indigo-100">
              <X className="h-5 w-5" />
            </button>

            <div className="mt-10 text-center">
              <motion.h2
                className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-indigo-200 to-indigo-300 mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {title}
              </motion.h2>

              <motion.p
                className="text-indigo-200 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {message}
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-3 justify-center"
              >
                <Button onClick={onNextLevel} className="bg-indigo-600 hover:bg-indigo-500 text-white border-none">
                  NEXT LEVEL
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
