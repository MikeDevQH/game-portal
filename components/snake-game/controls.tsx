"use client"

import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react"
import { DIRECTIONS } from "@/utils/snake-game-utils"

interface ControlsProps {
  onDirectionChange: (direction: { x: number; y: number }) => void
}

export default function Controls({ onDirectionChange }: ControlsProps) {
  return (
    <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-lg p-4 backdrop-blur-sm">
      <h3 className="text-lg font-medium text-emerald-200 mb-3 tracking-wider">CONTROLS</h3>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div></div>
        <Button
          variant="ghost"
          size="icon"
          className="bg-emerald-900/50 text-emerald-300 hover:bg-emerald-800/50"
          onClick={() => onDirectionChange(DIRECTIONS.UP)}
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
        <div></div>
        <Button
          variant="ghost"
          size="icon"
          className="bg-emerald-900/50 text-emerald-300 hover:bg-emerald-800/50"
          onClick={() => onDirectionChange(DIRECTIONS.LEFT)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="bg-emerald-900/50 text-emerald-300 hover:bg-emerald-800/50"
          onClick={() => onDirectionChange(DIRECTIONS.DOWN)}
        >
          <ArrowDown className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="bg-emerald-900/50 text-emerald-300 hover:bg-emerald-800/50"
          onClick={() => onDirectionChange(DIRECTIONS.RIGHT)}
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

