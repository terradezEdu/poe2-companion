import { useLayoutEffect, useMemo, useRef, useState, type PointerEvent, type WheelEvent } from 'react'
import { localizeKnowledge } from '../localization/index.ts'
import type { AreaKnowledge, CampaignConnection } from '../domain/index.ts'
import { connectionDirectionLabel, createCampaignGraphLayout, graphEdgePath, type GraphNodeSize } from './layout.ts'
import './campaign-map.css'

export interface CampaignMapProps {
  /** Validated Act 1 records supplied by the application boundary. */
  readonly areas: readonly AreaKnowledge[]
  /** Validated direct transitions supplied by the application boundary. */
  readonly connections: readonly CampaignConnection[]
  /** Controlled selection: focus and navigation must never change this value. */
  readonly selectedAreaId: string | null
  /** Emits a stable area identifier after pointer or keyboard activation. */
  readonly onAreaSelect: (areaId: string) => void
}

interface ViewTransform {
  readonly x: number
  readonly y: number
  readonly scale: number
}

interface DragState {
  readonly pointerId: number
  readonly clientX: number
  readonly clientY: number
  readonly transform: ViewTransform
}

const INITIAL_TRANSFORM: ViewTransform = { x: 0, y: 0, scale: 1 }
const MIN_SCALE = 0.65
const MAX_SCALE = 1.85

export function CampaignMap({ areas, connections, selectedAreaId, onAreaSelect }: CampaignMapProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragState | null>(null)
  const [transform, setTransform] = useState<ViewTransform>(INITIAL_TRANSFORM)
  const [nodeSizes, setNodeSizes] = useState<ReadonlyMap<string, GraphNodeSize>>(() => new Map())
  const layout = useMemo(() => createCampaignGraphLayout(areas, connections, nodeSizes), [areas, connections, nodeSizes])
  const areasById = useMemo(() => new Map(areas.map((area) => [area.id, area])), [areas])
  const nodesMeasured = areas.every((area) => nodeSizes.has(area.id))

  useLayoutEffect(() => {
    const buttons = canvasRef.current?.querySelectorAll<HTMLButtonElement>('[data-campaign-area]')
    if (!buttons) return
    const measure = () => {
      const sizes = new Map<string, GraphNodeSize>()
      for (const button of buttons) {
        const areaId = button.dataset.areaId
        if (areaId) sizes.set(areaId, { width: button.offsetWidth, height: button.offsetHeight })
      }
      setNodeSizes((previous) => {
        if (previous.size === sizes.size && [...sizes].every(([id, size]) => {
          const old = previous.get(id)
          return old?.width === size.width && old.height === size.height
        })) return previous
        return sizes
      })
    }
    measure()
    const observer = new ResizeObserver(measure)
    buttons.forEach((button) => observer.observe(button))
    return () => observer.disconnect()
  }, [areas])

  function beginPan(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return
    dragRef.current = {
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
      transform,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function pan(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    setTransform({
      ...drag.transform,
      x: drag.transform.x + event.clientX - drag.clientX,
      y: drag.transform.y + event.clientY - drag.clientY,
    })
  }

  function endPan(event: PointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId !== event.pointerId) return
    dragRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  function zoom(event: WheelEvent<HTMLDivElement>) {
    event.preventDefault()
    const viewport = viewportRef.current
    if (!viewport) return

    const rect = viewport.getBoundingClientRect()
    const cursorX = event.clientX - rect.left
    const cursorY = event.clientY - rect.top
    const scaleFactor = event.deltaY < 0 ? 1.12 : 1 / 1.12

    setTransform((current) => {
      const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, current.scale * scaleFactor))
      if (scale === current.scale) return current
      const ratio = scale / current.scale
      return {
        scale,
        x: cursorX - (cursorX - current.x) * ratio,
        y: cursorY - (cursorY - current.y) * ratio,
      }
    })
  }

  return (
    <section className="campaign-map" data-testid="campaign-map" aria-label="Mapa de campaña del Acto 1">
      <div
        ref={viewportRef}
        className="campaign-map__viewport"
        data-testid="campaign-map-viewport"
        onPointerDown={beginPan}
        onPointerMove={pan}
        onPointerUp={endPan}
        onPointerCancel={endPan}
        onWheel={zoom}
      >
        <div
          ref={canvasRef}
          className="campaign-map__canvas"
          style={{
            width: layout.width,
            height: layout.height,
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          }}
        >
          <svg className="campaign-map__edges" width={layout.width} height={layout.height} aria-hidden="true" style={{ visibility: nodesMeasured ? 'visible' : 'hidden' }}>
            <defs>
              <marker id="campaign-map-arrow-directed" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#d4ac60" />
              </marker>
              <marker id="campaign-map-arrow-both-end" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#88a4a1" />
              </marker>
              <marker id="campaign-map-arrow-both-start" markerWidth="8" markerHeight="8" refX="0" refY="3" orient="auto">
                <path d="M6,0 L6,6 L0,3 z" fill="#88a4a1" />
              </marker>
            </defs>
            {layout.edges.map((edge) => {
              return (
                <path
                  key={`${edge.fromAreaId}-${edge.toAreaId}`}
                  className={`campaign-map__edge campaign-map__edge--${edge.direction.toLowerCase()}`}
                  data-testid={`campaign-connection-${edge.fromAreaId}-${edge.toAreaId}`}
                  data-direction={connectionDirectionLabel(edge)}
                  d={graphEdgePath(edge)}
                  markerEnd={`url(#campaign-map-arrow-${edge.direction === 'BIDIRECTIONAL' ? 'both-end' : 'directed'})`}
                  markerStart={edge.direction === 'BIDIRECTIONAL' ? 'url(#campaign-map-arrow-both-start)' : undefined}
                />
              )
            })}
          </svg>

          {layout.nodes.map((node) => {
            const area = areasById.get(node.areaId)
            if (!area) return null
            const areaName = localizeKnowledge(area.name, { gender: 'feminine', number: 'singular' }, (value) => value)
            const isSelected = selectedAreaId === area.id
            return (
              <button
                key={area.id}
                className="campaign-map__node"
                type="button"
                data-campaign-area
                data-area-id={area.id}
                data-selected={isSelected}
                aria-pressed={isSelected}
                style={{ left: node.x, top: node.y }}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => onAreaSelect(area.id)}
              >
                {areaName}
              </button>
            )
          })}
        </div>
      </div>
      <p className="campaign-map__hint">Arrastra para explorar · Usa la rueda para acercar o alejar</p>
    </section>
  )
}
