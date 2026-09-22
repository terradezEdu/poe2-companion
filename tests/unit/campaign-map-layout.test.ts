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
