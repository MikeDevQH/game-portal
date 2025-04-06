"use client"

import Link from "next/link"
import { Github, Home } from "lucide-react"
import { motion } from "framer-motion"

export default function Header() {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-md border-b border-blue-500/10 py-5"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center gap-2 text-blue-300 hover:text-blue-100 transition-all duration-300"
        >
          <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
            <Home className="h-5 w-5" />
          </motion.div>
          <span className="font-medium tracking-wider">GAME PORTAL</span>
        </Link>
        <motion.a
          href="https://github.com/MikeDevQH"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-300 hover:text-blue-100 transition-colors flex items-center gap-1"
          whileHover={{ scale: 1.05 }}
        >
          <Github className="h-5 w-5" />
          <span className="hidden sm:inline text-sm">MikeDevQH</span>
        </motion.a>
      </div>
    </motion.header>
  )
}

