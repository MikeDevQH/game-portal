"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Spline, Clock } from "lucide-react"
import { motion } from "framer-motion"

export default function OneLinePage() {
  return (
    <div className="overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="fixed top-12 left-10 w-full z-40 py-4 px-4">
          <div className="container mx-auto">
            <Link href="/">
              <Button variant="ghost" className="mt-5 font-bold text-indigo-300 hover:text-indigo-200 hover:bg-indigo-900/20 hover:scale-110 transition-all duration-300">
                <ArrowLeft className="mr-2 h-4 w-4" />
                BACK TO GAMES
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[80vh] pt-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-300 text-transparent bg-clip-text tracking-wider mb-6">
              ONE LINE
            </h1>

            <div className="flex justify-center mb-8">
              <Spline className="h-20 w-20 text-indigo-400 drop-shadow-glow-indigo animate-pulse" />
            </div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-indigo-950/40 border-2 border-indigo-500/30 p-8 rounded-lg backdrop-blur-sm max-w-2xl mx-auto"
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <Clock className="h-8 w-8 text-indigo-400" />
                <h2 className="text-4xl font-bold text-indigo-200 tracking-wider">COMING SOON</h2>
              </div>

              <p className="text-indigo-300/80 text-lg mb-6">
                We're working hard to bring you the ultimate One Line drawing experience. Complete drawings with a
                single line without repeating any segment.
              </p>

              <div className="flex justify-center">
                <div className="relative w-64 h-4 bg-indigo-900/60 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-indigo-500"
                    initial={{ width: "0%" }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
              <p className="text-indigo-400/70 text-sm mt-2">Development progress: 75%</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

