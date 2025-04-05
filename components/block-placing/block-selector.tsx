"use client"
import { motion } from "framer-motion"
import type { BlockShape } from "@/lib/block-placer/block-shapes"

interface BlockSelectorProps {
  blocks: BlockShape[]
  selectedBlock: BlockShape | null
  onSelectBlock: (block: BlockShape) => void
}

export default function BlockSelector({ blocks, selectedBlock, onSelectBlock }: BlockSelectorProps) {
  return (
    <div className="bg-pink-900/80 p-3 rounded-lg shadow-lg w-full border-2 border-pink-500/30">
      <h2 className="text-base font-semibold text-pink-200 mb-3 text-center">Available Blocks</h2>

      <div className="flex flex-row gap-10 justify-center items-center">
        {blocks.map((block) => (
          <motion.div
            key={block.id}
            className={`
        p-2 rounded-md cursor-pointer
        ${selectedBlock?.id === block.id ? "bg-pink-700 ring-2 ring-pink-300" : "bg-pink-950/80 hover:bg-pink-700"}
      `}
            onClick={() => onSelectBlock(block)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${block.shape[0].length}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${block.shape.length}, minmax(0, 1fr))`,
              }}
            >
              {block.shape.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`
                  w-6 h-6 rounded-sm
                  ${cell ? `bg-${block.color}-500` : "bg-transparent"}
                `}
                  />
                )),
              )}
            </div>
          </motion.div>
        ))}

        {blocks.length === 0 && (
          <div className="text-center text-pink-400 py-4 w-full">No blocks available. Game over!</div>
        )}
      </div>
    </div>
  )
}

