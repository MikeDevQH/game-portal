import type { Edge, Point } from "@/utils/one-line/one-line-utils";

type Level = {
  name: string;
  points: Point[];
  edges: Edge[];
  hint: string;
};

export type Difficulty = "easy" | "medium" | "hard" | "expert";

export const levelsByDifficulty: Record<Difficulty, Level[]> = {

  //========= Levels are still in development – more coming soon!!! ===========//

  easy: [
    {
      name: "Triangle",
      hint: "Conecta tres puntos en un ciclo continuo.",
      points: [
        { id: "A", x: 200, y: 100 },
        { id: "B", x: 300, y: 300 },
        { id: "C", x: 100, y: 300 },
      ],
      edges: [
        { from: "A", to: "B" },
        { from: "B", to: "C" },
        { from: "C", to: "A" },
      ],
    },
  ],
  medium: [
    {
      name: "Star",
      hint: "ESTO ES UNA PISTA",
      points: [
        { id: "A", x: 200, y: 100 },
        { id: "B", x: 250, y: 150 },
        { id: "C", x: 300, y: 150 },
        { id: "D", x: 260, y: 200 },
        { id: "E", x: 280, y: 250 },
        { id: "F", x: 200, y: 220 },
        { id: "G", x: 120, y: 250 },
        { id: "H", x: 140, y: 200 },
        { id: "I", x: 100, y: 150 },
        { id: "J", x: 150, y: 150 },
      ],
      edges: [
        { from: "A", to: "B" },
        { from: "B", to: "C" },
        { from: "C", to: "D" },
        { from: "D", to: "E" },
        { from: "E", to: "F" },
        { from: "F", to: "G" },
        { from: "G", to: "H" },
        { from: "H", to: "I" },
        { from: "I", to: "J" },
        { from: "J", to: "A" },
      ],
    },
  ],
  hard: [
    {
      name: "Hourglass",
      hint: "ESTO ES UNA PISTA",
      points: [
        { id: "A", x: 100, y: 100 },
        { id: "B", x: 300, y: 100 },
        { id: "C", x: 200, y: 200 },
        { id: "D", x: 300, y: 300 },
        { id: "E", x: 100, y: 300 },
      ],
      edges: [
        { from: "A", to: "B" },
        { from: "B", to: "C" },
        { from: "C", to: "A" },
        { from: "C", to: "D" },
        { from: "D", to: "E" },
        { from: "E", to: "C" },
      ],
    },
  ],
  expert: [
    {
      name: "Hourglass",
      hint: "ESTO ES UNA PISTA",
      points: [
        { id: "A", x: 100, y: 100 },
        { id: "B", x: 300, y: 100 },
        { id: "C", x: 200, y: 200 },
        { id: "D", x: 300, y: 300 },
        { id: "E", x: 100, y: 300 },
      ],
      edges: [
        { from: "A", to: "B" },
        { from: "B", to: "C" },
        { from: "C", to: "A" },
        { from: "C", to: "D" },
        { from: "D", to: "E" },
        { from: "E", to: "C" },
      ],
    },
  ]
};
