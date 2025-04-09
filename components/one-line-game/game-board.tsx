"use client"

import type React from "react"

import type { Key } from "react"
import { motion } from "framer-motion"
import type { Point, Edge } from "@/utils/one-line/one-line-utils"

interface GameBoardProps {
  points: Point[]
  edges: Edge[]
  path: Edge[]
  lastPoint: Point | null
  tempLine: { x: number; y: number } | null
  drawing: boolean
  onPointClick: (point: Point) => void
  svgRef: React.RefObject<SVGSVGElement> | null
}

export default function GameBoard({ points, edges, path, lastPoint, tempLine, onPointClick, svgRef }: GameBoardProps) {
  return (
    <svg
      ref={svgRef}
      viewBox="0 0 400 400"
      className="border w-[400px] h-[400px] bg-indigo-950/60 border-indigo-500/30 rounded-md touch-none select-none"
    >
      {/* Grid lines for visual reference */}
      <g className="grid-lines">
        {Array.from({ length: 10 }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={i * 40 + 40}
            x2="400"
            y2={i * 40 + 40}
            stroke="rgba(99, 102, 241, 0.1)"
            strokeWidth="1"
          />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={i * 40 + 40}
            y1="0"
            x2={i * 40 + 40}
            y2="400"
            stroke="rgba(99, 102, 241, 0.1)"
            strokeWidth="1"
          />
        ))}
      </g>

      {/* Edges to connect */}
      {edges.map((edge: Edge, i: Key | null | undefined) => {
        const from = points.find((p: Point) => p.id === edge.from)!
        const to = points.find((p: Point) => p.id === edge.to)!
        return (
          <line
            key={i}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="rgba(99, 102, 241, 0.3)"
            strokeWidth={2}
            strokeDasharray="5,5"
          />
        )
      })}

      {/* Path drawn by the player */}
      {path.map((edge, i) => {
        const from = points.find((p: Point) => p.id === edge.from)!
        const to = points.find((p: Point) => p.id === edge.to)!
        return (
          <motion.line
            key={`p-${i}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="#6366f1"
            strokeWidth={3}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )
      })}

      {/* Temporary line while drawing */}
      {lastPoint && tempLine && (
        <line
          x1={lastPoint.x}
          y1={lastPoint.y}
          x2={tempLine.x}
          y2={tempLine.y}
          stroke="#6366f1"
          strokeWidth={2}
          strokeDasharray="5,5"
        />
      )}

      {/* Points to connect */}
      {points.map((point: Point) => (
        <g key={point.id}>
          <circle
            cx={point.x}
            cy={point.y}
            r={12}
            fill="#312e81"
            stroke="#6366f1"
            strokeWidth={2}
            onMouseDown={() => onPointClick(point)}
            className="cursor-pointer"
          />
          <text
            x={point.x}
            y={point.y + 5}
            textAnchor="middle"
            fill="#c7d2fe"
            fontSize="12"
            fontWeight="bold"
            pointerEvents="none"
          >
            {point.id}
          </text>
        </g>
      ))}
    </svg>
  )
}
