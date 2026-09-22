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

export function createCampaignGraphLayout(
  areas: readonly AreaKnowledge[],
  connections: readonly CampaignConnection[],
): CampaignGraphLayout {
  // Sorting by stable identity makes the boundary insensitive to input order.
  // The grid has no directional or sequential meaning.
  const orderedAreas = [...areas].sort((left, right) => left.id.localeCompare(right.id))
  const columns = Math.max(MIN_COLUMNS, Math.ceil(Math.sqrt(orderedAreas.length)))
  const rows = Math.max(1, Math.ceil(orderedAreas.length / columns))
  const nodes = orderedAreas.map((area, index) => ({
    areaId: area.id,
    x: MAP_PADDING_X + (index % columns) * NODE_GAP_X,
    y: MAP_PADDING_Y + Math.floor(index / columns) * NODE_GAP_Y,
  }))
  const nodesByAreaId = new Map(nodes.map((node) => [node.areaId, node]))

  // The validation boundary guarantees both references. Keeping the filter
  // makes this pure layout safe for isolated component use without attempting
  // structural recovery or redefining dataset validity.
  const edges = connections.flatMap((connection) => {
    const from = nodesByAreaId.get(connection.fromAreaId)
    const to = nodesByAreaId.get(connection.toAreaId)
    return from && to ? [{ ...connection, from, to }] : []
  })

  return {
    width: MAP_PADDING_X * 2 + Math.max(1, columns - 1) * NODE_GAP_X,
    height: MAP_PADDING_Y * 2 + Math.max(0, rows - 1) * NODE_GAP_Y,
    nodes,
    edges,
  }
}

export function connectionDirectionLabel(connection: CampaignConnection): string {
  return connection.direction === 'BIDIRECTIONAL'
    ? 'both'
    : `${connection.fromAreaId}-to-${connection.toAreaId}`
}

/** Keeps direction markers clear of the node controls they connect. */
export function graphLinePoints(edge: CampaignGraphEdge): GraphLinePoints {
  const deltaX = edge.to.x - edge.from.x
  const deltaY = edge.to.y - edge.from.y
  const distance = Math.hypot(deltaX, deltaY)
  if (distance === 0) return { x1: edge.from.x, y1: edge.from.y, x2: edge.to.x, y2: edge.to.y }

  const inset = Math.min(82, distance / 2 - 1)
  const unitX = deltaX / distance
  const unitY = deltaY / distance
  return {
    x1: edge.from.x + unitX * inset,
    y1: edge.from.y + unitY * inset,
    x2: edge.to.x - unitX * inset,
    y2: edge.to.y - unitY * inset,
  }
}
