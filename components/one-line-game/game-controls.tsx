"use client"

import { Button } from "@/components/ui/button"
import { RotateCcw, HelpCircle, Lightbulb } from "lucide-react"
import { toast } from "sonner"

interface GameControlsProps {
  onReset: () => void
  onShowHelp: () => void
  hint: string
  pack: string
  levelName: string
}

// Game controls component
export default function GameControls({ onReset, onShowHelp, hint, pack, levelName }: GameControlsProps) {
  const showHint = () => {
    toast.info(hint || "Try to trace all lines without lifting your cursor.")
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={onReset}
        className="bg-indigo-900/50 border-indigo-500/30 text-indigo-300 hover:bg-indigo-800/60"
        title="Reset Level"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={showHint}
        className="bg-indigo-900/50 border-indigo-500/30 text-indigo-300 hover:bg-indigo-800/60"
        title="Show Hint"
      >
        <Lightbulb className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onShowHelp}
        className="bg-indigo-900/50 border-indigo-500/30 text-indigo-300 hover:bg-indigo-800/60"
        title="How to Play"
      >
        <HelpCircle className="h-4 w-4" />
      </Button>
    </div>
  )
}
