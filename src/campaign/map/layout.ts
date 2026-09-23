import type { AreaKnowledge, CampaignConnection } from '../domain/index.ts'

/**
 * The campaign graph deliberately has no route or chronology layout.  This
 * boundary turns stable area identities into repeatable positions so a future
 * presentation change cannot accidentally make graph placement data-driven.
 */
export interface CampaignGraphLayout {
  readonly width: number
  readonly height: number
  readonly nodes: readonly CampaignGraphNode[]
  readonly edges: readonly CampaignGraphEdge[]
}

export interface CampaignGraphNode {
  readonly areaId: string
  readonly x: number
  readonly y: number
}

export interface CampaignGraphEdge {
  readonly fromAreaId: string
  readonly toAreaId: string
  readonly from: CampaignGraphNode
  readonly to: CampaignGraphNode
  readonly direction: CampaignConnection['direction']
  readonly points: readonly GraphPoint[]
}

export interface GraphPoint {
  readonly x: number
  readonly y: number
}

export interface GraphNodeSize {
  readonly width: number
  readonly height: number
}

export interface GraphLinePoints {
  readonly x1: number
  readonly y1: number
  readonly x2: number
  readonly y2: number
}

const NODE_GAP_X = 230
const NODE_GAP_Y = 165
const MAP_PADDING_X = 140
const MAP_PADDING_Y = 125
const MIN_COLUMNS = 2
const NODE_HALF_WIDTH = 90
const NODE_HALF_HEIGHT = 25
// A line passing just outside a node can look like it joins that node's edge.
// Keep unrelated routes outside the node's immediate connection neighborhood.
const EDGE_CLEARANCE = 36
const DEFAULT_NODE_SIZE: GraphNodeSize = { width: NODE_HALF_WIDTH * 2, height: NODE_HALF_HEIGHT * 2 }

export function createCampaignGraphLayout(
  areas: readonly AreaKnowledge[],
  connections: readonly CampaignConnection[],
  nodeSizes: ReadonlyMap<string, GraphNodeSize> = new Map(),
): CampaignGraphLayout {
  // Sorting by stable identity makes the boundary insensitive to input order.
  // The grid has no directional or sequential meaning.
  const orderedAreas = [...areas].sort((left, right) => left.id.localeCompare(right.id))
  const columns = Math.max(MIN_COLUMNS, Math.ceil(Math.sqrt(orderedAreas.length)))
  const rows = Math.max(1, Math.ceil(orderedAreas.length / columns))
  const rowHeights = Array.from({ length: rows }, (_, row) =>
    Math.max(DEFAULT_NODE_SIZE.height, ...orderedAreas.slice(row * columns, (row + 1) * columns)
      .map((area) => nodeSizes.get(area.id)?.height ?? DEFAULT_NODE_SIZE.height)),
  )
  const rowCenters = rowHeights.map((height, row) => {
    if (row === 0) return MAP_PADDING_Y + Math.max(0, height / 2 - NODE_HALF_HEIGHT)
    return 0
  })
  for (let row = 1; row < rows; row += 1) {
    rowCenters[row] = rowCenters[row - 1] + Math.max(
      NODE_GAP_Y,
      (rowHeights[row - 1] + rowHeights[row]) / 2 + NODE_GAP_Y - DEFAULT_NODE_SIZE.height,
    )
  }
  const nodes = orderedAreas.map((area, index) => ({
    areaId: area.id,
    x: MAP_PADDING_X + (index % columns) * NODE_GAP_X,
    y: rowCenters[Math.floor(index / columns)],
  }))
  const nodesByAreaId = new Map(nodes.map((node) => [node.areaId, node]))

  // The validation boundary guarantees both references. Keeping the filter
  // makes this pure layout safe for isolated component use without attempting
  // structural recovery or redefining dataset validity.
  const edges = connections.flatMap((connection) => {
    const from = nodesByAreaId.get(connection.fromAreaId)
    const to = nodesByAreaId.get(connection.toAreaId)
    if (!from || !to) return []
    const points = routeAroundNodes(from, to, nodes, nodeSizes)
    return points ? [{ ...connection, from, to, points }] : []
  })

  return {
    width: MAP_PADDING_X * 2 + Math.max(1, columns - 1) * NODE_GAP_X,
    height: rowCenters[rows - 1] + rowHeights[rows - 1] / 2 + MAP_PADDING_Y - NODE_HALF_HEIGHT,
    nodes,
    edges,
  }
}

/**
 * Routes a connection through a deterministic rectilinear visibility grid.
 * Unrelated node neighborhoods are obstacles. Diagonal connections initially
 * leave vertically, keeping them distinct from the short horizontal links
 * between adjacent nodes in the same row.
 */
function routeAroundNodes(
  from: CampaignGraphNode,
  to: CampaignGraphNode,
  nodes: readonly CampaignGraphNode[],
  nodeSizes: ReadonlyMap<string, GraphNodeSize>,
): readonly GraphPoint[] | null {
  const sizeOf = (node: CampaignGraphNode) => nodeSizes.get(node.areaId) ?? DEFAULT_NODE_SIZE
  const obstacles = nodes
    .filter((node) => node.areaId !== from.areaId && node.areaId !== to.areaId)
    .map((node) => ({
      left: node.x - sizeOf(node).width / 2 - EDGE_CLEARANCE,
      right: node.x + sizeOf(node).width / 2 + EDGE_CLEARANCE,
      top: node.y - sizeOf(node).height / 2 - EDGE_CLEARANCE,
      bottom: node.y + sizeOf(node).height / 2 + EDGE_CLEARANCE,
    }))
  const margin = NODE_GAP_X + NODE_HALF_WIDTH + EDGE_CLEARANCE
  const xs = [...new Set([
    from.x,
    to.x,
    -margin,
    Math.max(...nodes.map((node) => node.x)) + margin,
    ...obstacles.flatMap((rect) => [rect.left, rect.right]),
  ])].sort((a, b) => a - b)
  const ys = [...new Set([
    from.y,
    to.y,
    -margin,
    Math.max(...nodes.map((node) => node.y)) + margin,
    ...obstacles.flatMap((rect) => [rect.top, rect.bottom]),
  ])].sort((a, b) => a - b)
  const start = { column: xs.indexOf(from.x), row: ys.indexOf(from.y) }
  const finish = { column: xs.indexOf(to.x), row: ys.indexOf(to.y) }
  const key = (column: number, row: number) => `${column}:${row}`
  const startKey = key(start.column, start.row)
  const finishKey = key(finish.column, finish.row)
  const distance = new Map([[startKey, 0]])
  const previous = new Map<string, string>()
  const open = [{ ...start, key: startKey, estimate: Math.abs(from.x - to.x) + Math.abs(from.y - to.y) }]
  const visited = new Set<string>()

  while (open.length > 0) {
    open.sort((a, b) => a.estimate - b.estimate || a.row - b.row || a.column - b.column)
    const current = open.shift()!
    if (visited.has(current.key)) continue
    if (current.key === finishKey) break
    visited.add(current.key)

    for (const [column, row] of [
      [current.column - 1, current.row],
      [current.column + 1, current.row],
      [current.column, current.row - 1],
      [current.column, current.row + 1],
    ]) {
      if (column < 0 || column >= xs.length || row < 0 || row >= ys.length) continue
      if (current.key === startKey && from.x !== to.x && from.y !== to.y && row === current.row) continue
      const nextKey = key(column, row)
      if (visited.has(nextKey)) continue
      const a = { x: xs[current.column], y: ys[current.row] }
      const b = { x: xs[column], y: ys[row] }
      if (obstacles.some((rect) => segmentIntersectsRect(a, b, rect))) continue
      const nextDistance = distance.get(current.key)! + Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
      if (nextDistance >= (distance.get(nextKey) ?? Number.POSITIVE_INFINITY)) continue
      distance.set(nextKey, nextDistance)
      previous.set(nextKey, current.key)
      open.push({
        column,
        row,
        key: nextKey,
        estimate: nextDistance + Math.abs(xs[column] - to.x) + Math.abs(ys[row] - to.y),
      })
    }
  }

  if (!distance.has(finishKey)) return null
  const reversed: GraphPoint[] = []
  for (let cursor = finishKey; ; cursor = previous.get(cursor)!) {
    const [column, row] = cursor.split(':').map(Number)
    reversed.push({ x: xs[column], y: ys[row] })
    if (cursor === startKey) break
  }
  const points = simplifyPath(reversed.reverse())
  return trimNodeBodies(points, from, to, sizeOf(from), sizeOf(to))
}

function segmentIntersectsRect(
  a: GraphPoint,
  b: GraphPoint,
  rect: { readonly left: number; readonly right: number; readonly top: number; readonly bottom: number },
): boolean {
  if (a.y === b.y) return a.y > rect.top && a.y < rect.bottom && Math.max(Math.min(a.x, b.x), rect.left) < Math.min(Math.max(a.x, b.x), rect.right)
  return a.x > rect.left && a.x < rect.right && Math.max(Math.min(a.y, b.y), rect.top) < Math.min(Math.max(a.y, b.y), rect.bottom)
}

function simplifyPath(points: readonly GraphPoint[]): readonly GraphPoint[] {
  return points.filter((point, index) => {
    if (index === 0 || index === points.length - 1) return true
    const before = points[index - 1]
    const after = points[index + 1]
    return (before.x === point.x) !== (point.x === after.x) || (before.y === point.y) !== (point.y === after.y)
  })
}

function trimNodeBodies(
  points: readonly GraphPoint[],
  from: CampaignGraphNode,
  to: CampaignGraphNode,
  fromSize: GraphNodeSize,
  toSize: GraphNodeSize,
): readonly GraphPoint[] {
  if (points.length < 2) return points
  const result = [...points]
  const first = result[1]
  const last = result[result.length - 2]
  result[0] = first.x === from.x
    ? { x: from.x, y: from.y + Math.sign(first.y - from.y) * fromSize.height / 2 }
    : { x: from.x + Math.sign(first.x - from.x) * fromSize.width / 2, y: from.y }
  result[result.length - 1] = last.x === to.x
    ? { x: to.x, y: to.y + Math.sign(last.y - to.y) * toSize.height / 2 }
    : { x: to.x + Math.sign(last.x - to.x) * toSize.width / 2, y: to.y }
  return simplifyPath(result)
}

export function connectionDirectionLabel(connection: CampaignConnection): string {
  return connection.direction === 'BIDIRECTIONAL'
    ? 'both'
    : `${connection.fromAreaId}-to-${connection.toAreaId}`
}

/** Keeps direction markers clear of the node controls they connect. */
export function graphLinePoints(edge: CampaignGraphEdge): GraphLinePoints {
  const first = edge.points[0]
  const last = edge.points[edge.points.length - 1]
  return {
    x1: first.x,
    y1: first.y,
    x2: last.x,
    y2: last.y,
  }
}

export function graphEdgePath(edge: CampaignGraphEdge): string {
  return edge.points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x},${point.y}`).join(' ')
}
