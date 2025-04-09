// Añadir funciones para verificar si un nivel tiene solución

export type Point = {
  id: string
  x: number
  y: number
}

export type Edge = {
  from: string
  to: string
}

export const isSameEdge = (a: Edge, b: Edge) =>
  (a.from === b.from && a.to === b.to) || (a.from === b.to && a.to === b.from)

// Función para verificar si un grafo tiene un camino euleriano
export const hasEulerianPath = (points: Point[], edges: Edge[]): boolean => {
  // Crear un mapa de adyacencia
  const adjacencyMap = new Map<string, string[]>()

  // Inicializar el mapa con todos los puntos
  points.forEach((point) => {
    adjacencyMap.set(point.id, [])
  })

  // Llenar el mapa de adyacencia
  edges.forEach((edge) => {
    const fromNeighbors = adjacencyMap.get(edge.from) || []
    fromNeighbors.push(edge.to)
    adjacencyMap.set(edge.from, fromNeighbors)

    const toNeighbors = adjacencyMap.get(edge.to) || []
    toNeighbors.push(edge.from)
    adjacencyMap.set(edge.to, toNeighbors)
  })

  // Contar vértices con grado impar
  let oddVertices = 0
  adjacencyMap.forEach((neighbors) => {
    if (neighbors.length % 2 !== 0) {
      oddVertices++
    }
  })

  // Un grafo tiene un camino euleriano si tiene 0 o 2 vértices con grado impar
  return oddVertices === 0 || oddVertices === 2
}

// Función para verificar si todos los vértices están conectados
export const isConnected = (points: Point[], edges: Edge[]): boolean => {
  if (points.length === 0) return true

  // Crear un mapa de adyacencia
  const adjacencyMap = new Map<string, string[]>()

  // Inicializar el mapa con todos los puntos
  points.forEach((point) => {
    adjacencyMap.set(point.id, [])
  })

  // Llenar el mapa de adyacencia
  edges.forEach((edge) => {
    const fromNeighbors = adjacencyMap.get(edge.from) || []
    fromNeighbors.push(edge.to)
    adjacencyMap.set(edge.from, fromNeighbors)

    const toNeighbors = adjacencyMap.get(edge.to) || []
    toNeighbors.push(edge.from)
    adjacencyMap.set(edge.to, toNeighbors)
  })

  // Realizar un recorrido DFS para verificar la conectividad
  const visited = new Set<string>()
  const dfs = (vertex: string) => {
    visited.add(vertex)
    const neighbors = adjacencyMap.get(vertex) || []
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        dfs(neighbor)
      }
    }
  }

  // Comenzar DFS desde el primer vértice
  dfs(points[0].id)

  // Verificar si todos los vértices fueron visitados
  return visited.size === points.length
}

// Función para encontrar un camino euleriano en un grafo
export const findEulerianPath = (points: Point[], edges: Edge[]): Edge[] | null => {
  // Verificar si el grafo tiene un camino euleriano
  if (!hasEulerianPath(points, edges) || !isConnected(points, edges)) {
    return null
  }

  // Crear una copia de las aristas para trabajar
  const remainingEdges = [...edges.map((edge) => ({ ...edge }))]

  // Crear un mapa de adyacencia
  const adjacencyMap = new Map<string, string[]>()

  // Inicializar el mapa con todos los puntos
  points.forEach((point) => {
    adjacencyMap.set(point.id, [])
  })

  // Llenar el mapa de adyacencia
  remainingEdges.forEach((edge) => {
    const fromNeighbors = adjacencyMap.get(edge.from) || []
    fromNeighbors.push(edge.to)
    adjacencyMap.set(edge.from, fromNeighbors)

    const toNeighbors = adjacencyMap.get(edge.to) || []
    toNeighbors.push(edge.from)
    adjacencyMap.set(edge.to, toNeighbors)
  })

  // Encontrar un vértice con grado impar para comenzar (o cualquier vértice si todos tienen grado par)
  let startVertex = points[0].id
  adjacencyMap.forEach((neighbors, vertex) => {
    if (neighbors.length % 2 !== 0) {
      startVertex = vertex
    }
  })

  // Función para encontrar una arista entre dos vértices
  const findEdge = (from: string, to: string): Edge | undefined => {
    return remainingEdges.find(
      (edge) => (edge.from === from && edge.to === to) || (edge.from === to && edge.to === from),
    )
  }

  // Función para eliminar una arista del conjunto de aristas restantes
  const removeEdge = (edge: Edge) => {
    const index = remainingEdges.findIndex(
      (e) => (e.from === edge.from && e.to === edge.to) || (e.from === edge.to && e.to === edge.from),
    )
    if (index !== -1) {
      remainingEdges.splice(index, 1)
    }

    // También actualizar el mapa de adyacencia
    const fromNeighbors = adjacencyMap.get(edge.from) || []
    const toIndex = fromNeighbors.indexOf(edge.to)
    if (toIndex !== -1) {
      fromNeighbors.splice(toIndex, 1)
    }
    adjacencyMap.set(edge.from, fromNeighbors)

    const toNeighbors = adjacencyMap.get(edge.to) || []
    const fromIndex = toNeighbors.indexOf(edge.from)
    if (fromIndex !== -1) {
      toNeighbors.splice(fromIndex, 1)
    }
    adjacencyMap.set(edge.to, toNeighbors)
  }

  // Algoritmo de Hierholzer para encontrar un camino euleriano
  const path: Edge[] = []
  const stack: string[] = [startVertex]

  while (stack.length > 0) {
    const currentVertex = stack[stack.length - 1]
    const neighbors = adjacencyMap.get(currentVertex) || []

    if (neighbors.length === 0) {
      // No hay más vecinos, retroceder
      stack.pop()
      continue
    }

    // Tomar el primer vecino disponible
    const nextVertex = neighbors[0]
    const edge = findEdge(currentVertex, nextVertex)

    if (edge) {
      // Agregar la arista al camino
      path.push({
        from: currentVertex,
        to: nextVertex,
      })

      // Eliminar la arista
      removeEdge(edge)

      // Avanzar al siguiente vértice
      stack.push(nextVertex)
    }
  }

  // Verificar si se recorrieron todas las aristas
  if (path.length !== edges.length) {
    return null
  }

  return path
}

