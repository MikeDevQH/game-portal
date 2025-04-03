// Board configuration
export const BOARD_SIZE = 15
export const SCALE = 20

// Initial snake position (3 segments)
export const SNAKE_START = [
  { x: 8, y: 7 },
  { x: 7, y: 7 },
  { x: 6, y: 7 },
]

// Initial apple position
export const APPLE_START = { x: 12, y: 7 }

// Game speed in milliseconds (lower = faster)
export const SPEED = 150

// Direction vectors
export const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
}

// Check if snake collided with itself
export const checkCollision = (head: { x: number; y: number }, snake: { x: number; y: number }[]) => {
  // Skip the head when checking collision
  return snake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y)
}

// Check if apple was eaten
export const appleAte = (head: { x: number; y: number }, apple: { x: number; y: number }) => {
  return head.x === apple.x && head.y === apple.y
}

// Generate new apple position
export const generateApple = (snake: { x: number; y: number }[]) => {
  let newApple: { x: number; y: number }

  // Keep generating until we find a position not occupied by the snake
  do {
    newApple = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE),
    }
  } while (snake.some((segment) => segment.x === newApple.x && segment.y === newApple.y))

  return newApple
}

