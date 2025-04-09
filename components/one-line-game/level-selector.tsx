"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { levelsByDifficulty } from "@/lib/one-line/level";
import { Lock } from "lucide-react";
import type { Difficulty } from "@/lib/one-line/level";

// Get difficulties from levelsByDifficulty
const difficulties = Object.keys(levelsByDifficulty) as Difficulty[];

type Progress = {
  [key in Difficulty]: number[];
};

interface LevelSelectorProps {
  current: number;
  difficulty: Difficulty;
  progress: Progress;
  onLevelSelect: (levelIndex: number) => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  showHint: () => void;
}

export default function LevelSelector({
  current,
  difficulty,
  progress,
  onLevelSelect,
  onDifficultyChange,
  showHint,
}: LevelSelectorProps) {
  const currentLevels = levelsByDifficulty[difficulty];
  const completedLevels = progress?.[difficulty] ?? [];
  const [isDiffModalOpen, setIsDiffModalOpen] = useState(false);

  // Render difficulty options
  const renderDifficultyOptions = () => {
    return (
      <div className="flex flex-col gap-2 p-4">
        {difficulties.map((diff, index) => {
          let isUnlocked = false;
          if (index === 0) {
            isUnlocked = true;
          } else {
            // Check if the previous difficulty is completed
            const prevDiff = difficulties[index - 1];
            const levelsInPrev = levelsByDifficulty[prevDiff].length;
            const completedInPrev = (progress?.[prevDiff] ?? []).length;
            isUnlocked = completedInPrev === levelsInPrev;
          }
          return (
            <Button
              key={diff}
              onClick={() => {
                if (isUnlocked) {
                  onDifficultyChange(diff);
                  setIsDiffModalOpen(false);
                }
              }}
              disabled={!isUnlocked}
              className={`text-xs px-3 py-1 rounded-full ${
                difficulty === diff
                  ? "bg-indigo-600 text-white"
                  : "bg-indigo-900/50 text-indigo-300 hover:bg-indigo-800/60"
              }`}
            >
              {diff.toUpperCase()}
            </Button>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div
      className="flex flex-col gap-4 w-80 order-first md:mr-8"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
    >
      <Card className="bg-indigo-950/40 border-2 border-indigo-500/30 p-4 rounded-lg shadow-lg backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-indigo-200 mb-3 tracking-wider">
          LEVEL SELECT
        </h3>

        {/* Category selector button */}
        <div className="mb-3 flex justify-center">
          <Button
            onClick={() => setIsDiffModalOpen(true)}
            className="text-xs px-3 py-1 rounded-full bg-indigo-700 text-white hover:bg-indigo-800"
          >
            {`Categoría: ${difficulty.toUpperCase()}`}
          </Button>
        </div>

        {/* Category selection modal */}
        {isDiffModalOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            onClick={() => setIsDiffModalOpen(false)}
          >
            <div
              className="bg-indigo-900 rounded-md shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {renderDifficultyOptions()}
            </div>
          </div>
        )}

        {/* Level buttons */}
        <div className="grid grid-cols-4 gap-2">
          {currentLevels.map((_, index) => {
            const isCompleted = completedLevels.includes(index);
            const isUnlocked = index === 0 || completedLevels.includes(index - 1);
            const isClickable = isUnlocked || isCompleted;
            const isLocked = !isUnlocked;
            const glow = current === index && isUnlocked && !isCompleted;

            return (
              <Button
                key={index}
                variant={current === index ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (isClickable) onLevelSelect(index);
                }}
                disabled={!isClickable}
                className={`w-10 h-10 p-0 flex items-center justify-center relative 
                  ${
                    current === index
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : isClickable
                      ? "bg-indigo-900/50 border-indigo-500/30 text-indigo-300 hover:bg-indigo-800/60"
                      : "bg-gray-800 border-gray-600 text-gray-500 cursor-not-allowed"
                  }
                  ${glow ? "border-2 border-indigo-400 shadow-[0_0_10px_2px_rgba(99,102,241,0.7)]" : ""}
                `}
              >
                <span className="z-10">{index + 1}</span>
                {isLocked && (
                  <Lock className="absolute w-4 h-4 text-gray-500" />
                )}
              </Button>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
}
