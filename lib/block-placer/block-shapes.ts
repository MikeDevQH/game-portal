export interface BlockShape {
    id: string
    shape: boolean[][]
    color: string
  }
  
  // Define various block shapes (similar to Tetris pieces)
  export const BLOCK_SHAPES: Omit<BlockShape, "id" | "color">[] = [
    // Single block
    {
      shape: [[true]],
    },
  
    // Line shapes
    {
      shape: [[true, true]],
    },
    {
      shape: [[true, true, true]],
    },
    {
      shape: [[true], [true]],
    },
    {
      shape: [[true], [true], [true]],
    },
  
    // L shapes
    {
      shape: [
        [true, false],
        [true, true],
      ],
    },
    {
      shape: [
        [false, true],
        [true, true],
      ],
    },
    {
      shape: [
        [true, true],
        [true, false],
      ],
    },
    {
      shape: [
        [true, true],
        [false, true],
      ],
    },
  
    // T shape
    {
      shape: [
        [true, true, true],
        [false, true, false],
      ],
    },
    {
      shape: [
        [false, true, false],
        [true, true, true],
      ],
    },
  
    // Square shape
    {
      shape: [
        [true, true],
        [true, true],
      ],
    },
  
    // Z shapes
    {
      shape: [
        [true, true, false],
        [false, true, true],
      ],
    },
    {
      shape: [
        [false, true, true],
        [true, true, false],
      ],
    },
  ]
  
  