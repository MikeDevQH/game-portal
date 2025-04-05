"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"

interface GameCardProps {
  title: string
  description: string
  icon: LucideIcon
  link: string
  color: "blue" | "purple" | "cyan" | "green" | "amber" | "pink" | "sky" | "indigo"
}

const colorStyles = {
  blue: {
    bg: "from-blue-950/50 to-blue-900/30",
    hoverBg: "group-hover:from-blue-900/50 group-hover:to-blue-800/30",
    border: "border-blue-500/20",
    hoverBorder: "hover:border-blue-400/40",
    text: "text-blue-200",
    hoverText: "group-hover:text-blue-100",
    desc: "text-blue-300/60",
    icon: "text-blue-400",
    button: "bg-blue-800/60 hover:bg-blue-700/80 text-blue-100 border-blue-500/20",
    shadow: "hover:shadow-blue-900/20",
  },
  purple: {
    bg: "from-purple-950/50 to-purple-900/30",
    hoverBg: "group-hover:from-purple-900/50 group-hover:to-purple-800/30",
    border: "border-purple-500/20",
    hoverBorder: "hover:border-purple-400/40",
    text: "text-purple-200",
    hoverText: "group-hover:text-purple-100",
    desc: "text-purple-300/60",
    icon: "text-purple-400",
    button: "bg-purple-800/60 hover:bg-purple-700/80 text-purple-100 border-purple-500/20",
    shadow: "hover:shadow-purple-900/20",
  },
  cyan: {
    bg: "from-cyan-950/50 to-cyan-900/30",
    hoverBg: "group-hover:from-cyan-900/50 group-hover:to-cyan-800/30",
    border: "border-cyan-500/20",
    hoverBorder: "hover:border-cyan-400/40",
    text: "text-cyan-200",
    hoverText: "group-hover:text-cyan-100",
    desc: "text-cyan-300/60",
    icon: "text-cyan-400",
    button: "bg-cyan-800/60 hover:bg-cyan-700/80 text-cyan-100 border-cyan-500/20",
    shadow: "hover:shadow-cyan-900/20",
  },
  green: {
    bg: "from-emerald-950/50 to-emerald-900/30",
    hoverBg: "group-hover:from-emerald-900/50 group-hover:to-emerald-800/30",
    border: "border-emerald-500/20",
    hoverBorder: "hover:border-emerald-400/40",
    text: "text-emerald-200",
    hoverText: "group-hover:text-emerald-100",
    desc: "text-emerald-300/60",
    icon: "text-emerald-400",
    button: "bg-emerald-800/60 hover:bg-emerald-700/80 text-emerald-100 border-emerald-500/20",
    shadow: "hover:shadow-emerald-900/20",
  },
  amber: {
    bg: "from-amber-950/50 to-amber-900/30",
    hoverBg: "group-hover:from-amber-900/50 group-hover:to-amber-800/30",
    border: "border-amber-500/20",
    hoverBorder: "hover:border-amber-400/40",
    text: "text-amber-200",
    hoverText: "group-hover:text-amber-100",
    desc: "text-amber-300/60",
    icon: "text-amber-400",
    button: "bg-amber-800/60 hover:bg-amber-700/80 text-amber-100 border-amber-500/20",
    shadow: "hover:shadow-amber-900/20",
  },
  pink: {
    bg: "from-pink-950/50 to-pink-900/30",
    hoverBg: "group-hover:from-pink-900/50 group-hover:to-pink-800/30",
    border: "border-pink-500/20",
    hoverBorder: "hover:border-pink-400/40",
    text: "text-pink-200",
    hoverText: "group-hover:text-pink-100",
    desc: "text-pink-300/60",
    icon: "text-pink-400",
    button: "bg-pink-800/60 hover:bg-pink-700/80 text-pink-100 border-pink-500/20",
    shadow: "hover:shadow-pink-900/20",
  },
  sky: {
    bg: "from-sky-950/50 to-sky-900/30",
    hoverBg: "group-hover:from-sky-900/50 group-hover:to-sky-800/30",
    border: "border-sky-500/20",
    hoverBorder: "hover:border-sky-400/40",
    text: "text-sky-200",
    hoverText: "group-hover:text-sky-100",
    desc: "text-sky-300/60",
    icon: "text-sky-400",
    button: "bg-sky-800/60 hover:bg-sky-700/80 text-sky-100 border-sky-500/20",
    shadow: "hover:shadow-sky-900/20",
  },
  indigo: {
    bg: "from-indigo-950/50 to-indigo-900/30",
    hoverBg: "group-hover:from-indigo-900/50 group-hover:to-indigo-800/30",
    border: "border-indigo-500/20",
    hoverBorder: "hover:border-indigo-400/40",
    text: "text-indigo-200",
    hoverText: "group-hover:text-indigo-100",
    desc: "text-indigo-300/60",
    icon: "text-indigo-400",
    button: "bg-indigo-800/60 hover:bg-indigo-700/80 text-indigo-100 border-indigo-500/20",
    shadow: "hover:shadow-indigo-900/20",
  },
}

export default function GameCard({ title, description, icon: Icon, link, color }: GameCardProps) {
  const styles = colorStyles[color]

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
      <Card
        className={`bg-slate-900/40 ${styles.border} ${styles.hoverBorder} transition-all duration-300 hover:shadow-lg ${styles.shadow} group overflow-hidden backdrop-blur-sm border-2`}
      >
        <CardHeader className="pb-2">
          <CardTitle className={`text-xl ${styles.text} ${styles.hoverText} tracking-wide`}>{title}</CardTitle>
          <CardDescription className={`${styles.desc} text-sm`}>{description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-4 pb-6">
          <div
            className={`h-40 bg-gradient-to-br ${styles.bg} ${styles.hoverBg} rounded-md flex items-center justify-center overflow-hidden relative transition-all duration-500`}
          >
            <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>
            <motion.div whileHover={{ rotate: 5, scale: 1.1 }} transition={{ type: "spring", stiffness: 400 }}>
              <Icon className={`h-16 w-16 ${styles.icon} transition-transform duration-300 relative z-10`} />
            </motion.div>
          </div>
        </CardContent>
        <CardFooter>
          <Link href={link} className="w-full">
            <Button className={`w-full ${styles.button} font-medium tracking-wide text-sm`}>PLAY NOW</Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

