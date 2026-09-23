import assert from 'node:assert/strict'
import test from 'node:test'
import { knownKnowledge } from '../../src/campaign/domain/knowledge.ts'
import type { AreaKnowledge, CampaignConnection } from '../../src/campaign/domain/model.ts'
import { connectionDirectionLabel, createCampaignGraphLayout, graphLinePoints } from '../../src/campaign/map/layout.ts'

function area(id: string): AreaKnowledge {
  return {
    id,
    name: knownKnowledge(`Área ${id}`),
    level: knownKnowledge(1),
    danger: 'LOW',
    hardcoreWarning: knownKnowledge(''),
    rewards: knownKnowledge([]),
    pointsOfInterest: knownKnowledge([]),
    curiosities: knownKnowledge([]),
    bosses: knownKnowledge([]),
    verification: { status: 'UNKNOWN', sources: [], verifiedAt: { state: 'known', value: '' } },
  }
}

test('the graph layout is stable by area identity, not the input order', () => {
  const connections: readonly CampaignConnection[] = [
    { fromAreaId: 'area-a', toAreaId: 'area-b', direction: 'BIDIRECTIONAL' },
    { fromAreaId: 'area-b', toAreaId: 'area-c', direction: 'DIRECTED' },
  ]

  const first = createCampaignGraphLayout([area('area-c'), area('area-a'), area('area-b')], connections)
  const second = createCampaignGraphLayout([area('area-b'), area('area-c'), area('area-a')], connections)

  assert.deepEqual(first.nodes, second.nodes)
  assert.deepEqual(first.nodes.map((node) => node.areaId), ['area-a', 'area-b', 'area-c'])
  assert.equal(first.edges.length, 2)
  assert.deepEqual(first.edges[1].from, first.nodes[1])
  assert.deepEqual(first.edges[1].to, first.nodes[2])
})

test('connection labels distinguish normal two-way and explicit one-way transitions', () => {
  assert.equal(connectionDirectionLabel({ fromAreaId: 'area-a', toAreaId: 'area-b', direction: 'BIDIRECTIONAL' }), 'both')
  assert.equal(connectionDirectionLabel({ fromAreaId: 'area-b', toAreaId: 'area-c', direction: 'DIRECTED' }), 'area-b-to-area-c')
})

test('direction markers stop before the node controls instead of being hidden underneath them', () => {
  const layout = createCampaignGraphLayout(
    [area('area-a'), area('area-b')],
    [{ fromAreaId: 'area-a', toAreaId: 'area-b', direction: 'DIRECTED' }],
  )
  const edge = layout.edges[0]
  const points = graphLinePoints(edge)

  assert.ok(points.x1 > edge.from.x)
  assert.ok(points.x2 < edge.to.x)
  assert.equal(points.y1, edge.from.y)
  assert.equal(points.y2, edge.to.y)
})

test('a representative nine-area topology routes long edges around unrelated node bodies', () => {
  const areas = 'abcdefghi'.split('').map((letter) => area(`area-${letter}`))
  const layout = createCampaignGraphLayout(areas, [
    { fromAreaId: 'area-a', toAreaId: 'area-i', direction: 'DIRECTED' },
  ])
  const edge = layout.edges[0]
  const center = layout.nodes.find((node) => node.areaId === 'area-e')!

  assert.ok(edge.points.length > 2, 'the corner-to-corner transition must route around the center node')
  for (let index = 1; index < edge.points.length; index += 1) {
    const start = edge.points[index - 1]
    const end = edge.points[index]
    assert.ok(start.x === end.x || start.y === end.y, 'every route segment is orthogonal')
    const crossesCenterNode = start.y === end.y
      ? start.y > center.y - 37 && start.y < center.y + 37 && Math.max(Math.min(start.x, end.x), center.x - 102) < Math.min(Math.max(start.x, end.x), center.x + 102)
      : start.x > center.x - 102 && start.x < center.x + 102 && Math.max(Math.min(start.y, end.y), center.y - 37) < Math.min(Math.max(start.y, end.y), center.y + 37)
    assert.equal(crossesCenterNode, false, 'the path must not visually touch the unrelated center area')
  }
})

test('routing uses measured wrapped-node height and keeps layout independent of input order', () => {
  const areas = 'abcdefghi'.split('').map((letter) => area(`area-${letter}`))
  const connections: readonly CampaignConnection[] = [
    { fromAreaId: 'area-a', toAreaId: 'area-i', direction: 'DIRECTED' },
  ]
  const sizes = new Map([['area-f', { width: 153, height: 122 }]])
  const first = createCampaignGraphLayout(areas, connections, sizes)
  const second = createCampaignGraphLayout([...areas].reverse(), connections, sizes)
  assert.deepEqual(first, second)

  const wrapped = first.nodes.find((node) => node.areaId === 'area-f')!
  const edge = first.edges[0]
  for (let index = 1; index < edge.points.length; index += 1) {
    const start = edge.points[index - 1]
    const end = edge.points[index]
    const crossesWrappedNode = start.y === end.y
      ? start.y > wrapped.y - 61 && start.y < wrapped.y + 61 && Math.max(Math.min(start.x, end.x), wrapped.x - 76.5) < Math.min(Math.max(start.x, end.x), wrapped.x + 76.5)
      : start.x > wrapped.x - 76.5 && start.x < wrapped.x + 76.5 && Math.max(Math.min(start.y, end.y), wrapped.y - 61) < Math.min(Math.max(start.y, end.y), wrapped.y + 61)
    assert.equal(crossesWrappedNode, false, 'the routed path must clear the measured wrapped node')
  }
})
