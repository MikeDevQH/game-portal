"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Trophy, X } from "lucide-react"
import confetti from "canvas-confetti"
import { useEffect } from "react"

interface VictoryModalProps {
  isOpen: boolean
  onClose: () => void
  onPlayAgain: () => void
  title?: string
  message?: string
  icon?: React.ReactNode
}

export default function VictoryModal({
  isOpen,
  onClose,
  onPlayAgain,
  title = "VICTORY!",
  message = "Congratulations! You've won the game.",
  icon = <Trophy className="h-24 w-24 text-yellow-400 drop-shadow-glow-yellow" />,
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
          colors: ["#63B3ED", "#4299E1", "#3182CE", "#2B6CB0", "#2C5282"],
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ["#76E4F7", "#0BC5EA", "#00B5D8", "#0987A0", "#086F83"],
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
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
            className="relative bg-gradient-to-br from-blue-900/90 to-cyan-900/90 p-6 rounded-xl border border-blue-500/50 shadow-2xl max-w-md w-full backdrop-blur-md z-50"
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

            <button onClick={onClose} className="absolute top-3 right-3 text-blue-300 hover:text-blue-100">
              <X className="h-5 w-5" />
            </button>

            <div className="mt-10 text-center">
              <motion.h2
                className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {title}
              </motion.h2>

              <motion.p
                className="text-blue-200 mb-6"
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
                <Button onClick={onPlayAgain} className="bg-blue-600 hover:bg-blue-500 text-white border-none">
                  PLAY AGAIN
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="border-blue-500/50 text-blue-200 hover:bg-blue-800/50"
                >
                  CLOSE
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

