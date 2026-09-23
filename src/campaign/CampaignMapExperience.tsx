import { useMemo, useState } from 'react'
import { ACT_ONE_CAMPAIGN_INPUT } from './data/index.ts'
import { CampaignMap } from './map/index.ts'
import { SelectedAreaPreview } from './preview/index.ts'
import { validateCampaignDataset } from './validation/index.ts'
import './campaign-map-experience.css'

export function CampaignMapExperience({ input = ACT_ONE_CAMPAIGN_INPUT }: { readonly input?: unknown }) {
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null)
  const result = useMemo(() => validateCampaignDataset(input), [input])

  if (!result.ok) {
    return (
      <main className="campaign-experience campaign-experience--error">
        <section className="campaign-dataset-error" role="alert">
          <p className="campaign-experience__eyebrow">Mapa de campaña · Acto 1</p>
          <h1>Error en la información de campaña</h1>
          <p>No se puede mostrar el mapa de campaña porque los datos no son válidos.</p>
        </section>
      </main>
    )
  }

  const { dataset } = result
  const selectedArea = dataset.act.areas.find((area) => area.id === selectedAreaId) ?? null
  const gameVersion = dataset.gameVersion.state === 'known' ? dataset.gameVersion.value : 'Desconocido'

  return (
    <main className="campaign-experience">
      <header className="campaign-experience__header">
        <div>
          <p className="campaign-experience__eyebrow">Path of Exile 2 · Guía de campaña</p>
          <h1>Mapa del Acto 1</h1>
          <p className="campaign-experience__intro">Explora las conexiones y consulta los detalles de cada área.</p>
        </div>
        <p className="campaign-experience__version">Versión del juego <span>{gameVersion}</span></p>
      </header>
      <div className="campaign-experience__layout">
        <div className="campaign-experience__map">
          <CampaignMap
            areas={dataset.act.areas}
            connections={dataset.connections}
            selectedAreaId={selectedAreaId}
            onAreaSelect={setSelectedAreaId}
          />
        </div>
        <div className="campaign-experience__preview">
          <SelectedAreaPreview area={selectedArea} />
        </div>
      </div>
    </main>
  )
}
