"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { levelsByPacks } from "@/lib/one-line/level";
import { Lock } from "lucide-react";
import type { Packs } from "@/lib/one-line/level";

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

  const isPackUnlocked = (pck: Packs, index: number) => {
    if (index === 0) return true;
    const prevPack = packs[index - 1];
    const levelsInPrev = levelsByPacks[prevPack].length;
    const completedInPrev = (progress?.[prevPack] ?? []).length;
    return completedInPrev === levelsInPrev;
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

        {/* Visible pack selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-3">
          {packs.map((pck, index) => {
            const unlocked = isPackUnlocked(pck, index);
            return (
              <Button
                key={pck}
                onClick={() => unlocked && onPackChange(pck)}
                disabled={!unlocked}
                className={`text-xs px-3 py-1 rounded-full transition ${
                  pack === pck
                    ? " font-bold text-indigo-200 bg-indigo-900/20 hover:bg-indigo-900/20 hover:scale-110 transition-all duration-300"
                    : unlocked
                    ? "bg-indigo-900/50 text-indigo-300 hover:bg-indigo-800/60"
                    : "bg-gray-800 text-gray-500 cursor-not-allowed"
                }`}
              >
                {pck.toUpperCase()}
              </Button>
            );
          })}
        </div>

        {/* Level buttons */}
        <div className="grid grid-cols-4 gap-2">
          {currentLevels.map((_, index) => {
            const isCompleted = completedLevels.includes(index);
            const isUnlocked =
              index === 0 || completedLevels.includes(index - 1);
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
                  ${
                    glow
                      ? "border-2 border-indigo-400 shadow-[0_0_10px_2px_rgba(99,102,241,0.7)]"
                      : ""
                  }
                `}
              >
                <span>{index + 1}</span>
                {isLocked && <Lock className="w-4 h-4 text-gray-500" />}
              </Button>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
}
