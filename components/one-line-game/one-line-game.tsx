"use client";

import { useEffect, useRef, useState } from "react";
import { levelsByDifficulty } from "@/lib/one-line/level";
import {
  isSameEdge,
  type Point,
  type Edge,
} from "@/utils/one-line/one-line-utils";
import VictoryModal from "@/components/one-line-game/game-modal";
import LevelSelector from "@/components/one-line-game/level-selector";
import GameBoard from "@/components/one-line-game/game-board";
import GameControls from "@/components/one-line-game/game-controls";
import HelpDialog from "@/components/one-line-game/help-dialog";
import { Brain } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

// Get difficulty from levelsByDifficulty
export type Difficulty = keyof typeof levelsByDifficulty;
const difficulties = Object.keys(levelsByDifficulty) as Difficulty[];
// Initialize progress dynamically based on the categories defined in levels.ts
const initialProgress = difficulties.reduce((acc, diff) => {
  acc[diff] = [];
  return acc;
}, {} as Record<Difficulty, number[]>);

export default function OneLineGame() {
  const [current, setCurrent] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [progress, setProgress] = useState<Record<Difficulty, number[]>>(initialProgress);

  const [path, setPath] = useState<Edge[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [tempLine, setTempLine] = useState<{ x: number; y: number } | null>(
    null
  );
  const [showHelp, setShowHelp] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const currentLevels = levelsByDifficulty[difficulty];
  const level = currentLevels[current];
  const points = level.points;
  const edges = level.edges;

  const isLevelCompleted = () => {
    if (path.length === 0) return false;
    const traversedEdges = new Set<string>();
    path.forEach((edge) => {
      const normalizedEdge = [edge.from, edge.to].sort().join("-");
      traversedEdges.add(normalizedEdge);
    });
    for (const edge of edges) {
      const normalizedEdge = [edge.from, edge.to].sort().join("-");
      if (!traversedEdges.has(normalizedEdge)) {
        return false;
      }
    }
    return true;
  };

  const getClosestPoint = (x: number, y: number) => {
    let closest: Point | null = null;
    let minDist = 20;
    for (const p of points) {
      const dx = p.x - x;
      const dy = p.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minDist) {
        minDist = dist;
        closest = p;
      }
    }
    return closest;
  };

  const isValidEdge = (from: string, to: string) => {
    const edge = { from, to };
    return (
      edges.some((e: Edge) => isSameEdge(e, edge)) &&
      !path.some((e) => isSameEdge(e, edge))
    );
  };

  const handleStart = (point: Point) => {
    if (!drawing) {
      setPath([]);
      setDrawing(true);
      setLastPoint(point);
    }
  };

  // Update progress when a level is completed
  useEffect(() => {
    if (path.length > 0 && isLevelCompleted()) {
      setTimeout(() => {
        setShowModal(true);
        setProgress((prev) => {
          const currentProgress = prev[difficulty];
          if (!currentProgress.includes(current)) {
            return {
              ...prev,
              [difficulty]: [...currentProgress, current].sort((a, b) => a - b),
            };
          }
          return prev;
        });
      }, 300);
    }
  }, [path, current, difficulty]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!drawing || !lastPoint || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setTempLine({ x, y });

      const target = getClosestPoint(x, y);
      if (
        target &&
        target.id !== lastPoint.id &&
        isValidEdge(lastPoint.id, target.id)
      ) {
        setPath((prev) => [...prev, { from: lastPoint.id, to: target.id }]);
        setLastPoint(target);
        setTempLine(null);
      }
    };

    const handleUp = () => {
      if (drawing) {
        if (isLevelCompleted()) {
          setTimeout(() => {
            setShowModal(true);
            setProgress((prev) => {
              const currentProgress = prev[difficulty];
              if (!currentProgress.includes(current)) {
                return {
                  ...prev,
                  [difficulty]: [...currentProgress, current].sort((a, b) => a - b),
                };
              }
              return prev;
            });
          }, 300);
        } else {
          setPath([]);
        }
      }
      setDrawing(false);
      setLastPoint(null);
      setTempLine(null);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [drawing, lastPoint, path, current, difficulty]);

  const nextLevel = () => {
    setShowModal(false);
    setPath([]);

    if (current + 1 < currentLevels.length) {
      setCurrent((prev) => prev + 1);
    } else {
      const order = difficulties;
      const currentIndex = order.indexOf(difficulty);
      if (currentIndex < order.length - 1) {
        setDifficulty(order[currentIndex + 1]);
        setCurrent(0);
      }
    }
  };

  const resetLevel = () => {
    setPath([]);
    setDrawing(false);
    setLastPoint(null);
    setTempLine(null);
  };

  const goToLevel = (levelIndex: number) => {
    setCurrent(levelIndex);
    setPath([]);
    setDrawing(false);
    setLastPoint(null);
    setTempLine(null);
  };

  const changeDifficulty = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    setCurrent(0);
    resetLevel();
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <motion.h1
        className="text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-indigo-300 text-transparent bg-clip-text tracking-wider"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        ONE LINE
      </motion.h1>

      <div className="flex flex-col md:flex-row gap-8 items-start mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card className="bg-indigo-950/40 border-2 border-indigo-500/30 p-4 rounded-lg shadow-lg backdrop-blur-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="text-xl font-bold text-indigo-200 tracking-wide">
                {currentLevels[current].name.toUpperCase()}
              </div>
              <GameControls
                levelName={currentLevels[current].name}
                difficulty={difficulty}
                onReset={resetLevel}
                onShowHelp={() => setShowHelp(true)}
                hint={
                  level?.hint ||
                  "Try to trace all lines without lifting your cursor."
                }
              />
            </div>
            <GameBoard
              points={points}
              edges={edges}
              path={path}
              lastPoint={lastPoint}
              tempLine={tempLine}
              drawing={drawing}
              onPointClick={handleStart}
              svgRef={svgRef}
            />
          </Card>
        </motion.div>

        <Card className="bg-indigo-950/40 border-2 border-indigo-500/30 p-4 rounded-lg shadow-lg w-80">
          <h3 className="text-lg font-semibold text-indigo-200 mb-3 tracking-wider">
            HOW TO PLAY
          </h3>
          <div className="text-sm text-indigo-300/80 space-y-3">
            <p>• Connect all points with a single continuous line</p>
            <p>• You must use all available paths exactly once</p>
            <p>
              • Click on a point to start, then drag to connect to other points
            </p>
            <p>
              • The line will automatically connect when you hover over a valid
              point
            </p>
            <p>• Complete the pattern to advance to the next level</p>
          </div>
        </Card>

        <LevelSelector
          current={current}
          difficulty={difficulty}
          progress={progress}
          onLevelSelect={goToLevel}
          onDifficultyChange={changeDifficulty}
          showHint={() => {}}
        />
      </div>

      {showModal && (
        <VictoryModal
          isOpen={showModal}
          onNextLevel={nextLevel}
          title="LEVEL COMPLETED!"
          message={`Great job! You've solved level ${current + 1}.`}
          icon={
            <Brain className="h-24 w-24 text-indigo-400 drop-shadow-glow-indigo" />
          }
        />
      )}

      <HelpDialog isOpen={showHelp} onOpenChange={setShowHelp} />
    </div>
  );
}
