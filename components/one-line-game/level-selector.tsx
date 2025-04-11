"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { levelsByPacks } from "@/lib/one-line/level";
import { Lock } from "lucide-react";
import type { Packs } from "@/lib/one-line/level";

// Get packs from levelsByPacks
const packs = Object.keys(levelsByPacks) as Packs[];

type Progress = {
  [key in Packs]: number[];
};

interface LevelSelectorProps {
  current: number;
  pack: Packs;
  progress: Progress;
  onLevelSelect: (levelIndex: number) => void;
  onPackChange: (pack: Packs) => void;
  showHint: () => void;
}

export default function LevelSelector({
  current,
  pack,
  progress,
  onLevelSelect,
  onPackChange,
  showHint,
}: LevelSelectorProps) {
  const currentLevels = levelsByPacks[pack];
  const completedLevels = progress?.[pack] ?? [];
  const [isPckModalOpen, setIsPckModalOpen] = useState(false);

  // Render pack options
  const renderPackOptions = () => {
    return (
      <div className="flex flex-col gap-2 p-4">
        {packs.map((pck, index) => {
          let isUnlocked = false;
          if (index === 0) {
            isUnlocked = true;
          } else {
            // Check if the previous pack is completed
            const prevPck = packs[index - 1];
            const levelsInPrev = levelsByPacks[prevPck].length;
            const completedInPrev = (progress?.[prevPck] ?? []).length;
            isUnlocked = completedInPrev === levelsInPrev;
          }
          return (
            <Button
              key={pck}
              onClick={() => {
                if (isUnlocked) {
                  onPackChange(pck);
                  setIsPckModalOpen(false);
                }
              }}
              disabled={!isUnlocked}
              className={`text-xs px-3 py-1 rounded-full ${
                pack === pck
                  ? "bg-indigo-600 text-white"
                  : "bg-indigo-900/50 text-indigo-300 hover:bg-indigo-800/60"
              }`}
            >
              {pck.toUpperCase()}
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
            onClick={() => setIsPckModalOpen(true)}
            className="text-xs px-3 py-1 rounded-full bg-indigo-700 text-white hover:bg-indigo-800"
          >
            {pack.toUpperCase()}
          </Button>
        </div>

        {/* Category selection modal */}
        {isPckModalOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            onClick={() => setIsPckModalOpen(false)}
          >
            <div
              className="bg-indigo-900 rounded-md shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {renderPackOptions()}
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
                <span>{index + 1}</span>
                {isLocked && (
                  <Lock className="w-4 h-4 text-gray-500" />
                )}               
               </Button>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
}
