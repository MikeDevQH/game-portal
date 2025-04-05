"use client"

interface SquareProps {
  value: string | null
  onClick: () => void
}

export default function Square({ value, onClick }: SquareProps) {
  return (
    <button
      className="flex h-24 w-24 items-center justify-center border border-cyan-800/50 text-5xl font-bold transition-all hover:bg-cyan-900/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-opacity-50 bg-cyan-950/40"
      onClick={onClick}
    >
      {value === "x" && (
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-14 w-2 bg-cyan-400 rotate-45 transform origin-center rounded-full shadow-glow-cyan" />
            <div className="h-14 w-2 bg-cyan-400 -rotate-45 transform origin-center rounded-full shadow-glow-cyan" />
          </div>
        </div>
      )}
      {value === "o" && <div className="h-12 w-12 rounded-full border-4 border-cyan-400 shadow-glow-cyan" />}
    </button>
  )
}

